"""Webtoon pipeline: strip slicing, a profile-driven panel-region step, panel clips, key-value records.

Finders, thresholds and classification rules come from a profile (profiles/*.json), so another series with a
different window style needs a profile, not code."""
import hashlib
import io
import json
import os
import platform
import re
import resource
import shutil
import tempfile
import time
import zipfile
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

import common as C

WEBTOON_VERSION = "webtoon-0.9"        # 0.9 (schema 3): risk score, text-based overlap dedupe, panel risk
LOW_CONF = 0.9
HIGH_RISK = 0.3
PROFILE_DIR = C.HERE / "profiles"


# ------------------------------------------------------------------ profiles
def _merge(base, over):
    out = dict(base)
    for k, v in over.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict) and k != "classify":
            out[k] = _merge(out[k], v)
        else:
            out[k] = v
    return out


def load_profiles(directory=None):
    d = Path(directory) if directory else PROFILE_DIR
    raw = {}
    for f in sorted(d.glob("*.json")):
        p = json.loads(f.read_text())
        raw[p["name"]] = p
    default = raw["default"]
    out = {}
    for name, p in raw.items():
        if name == "default":
            out[name] = dict(default)
            continue
        merged = _merge(default, {k: v for k, v in p.items() if k != "extends"})
        out[name] = merged
    return out


def profile_for(series, profiles=None):
    profiles = profiles or load_profiles()
    for name, p in profiles.items():
        if name != "default" and series in p.get("series", []):
            return p
    return profiles["default"]


def profile_hash(p):
    return hashlib.sha256(json.dumps(p, sort_keys=True).encode()).hexdigest()[:10]


def versions(profile):
    return {"tool": WEBTOON_VERSION, "schema": C.SCHEMA_VERSION, "ocr": f"apple-vision-VNRecognizeTextRequest accurate en-US macOS-build-{C.mac_build()}",
            "detector": None, "order": f"top-to-bottom blocks; strips {profile['strip']['height']}/{profile['strip']['overlap']}",
            "profile": f"{profile['name']}@{profile_hash(profile)}"}


# ------------------------------------------------------------------ canvas and strips
def build_canvas(h, meta, cbz=None):
    """Stack slices into one canvas of the most common width. Returns (canvas BGR, slices, problems)."""
    cbz = cbz or C.cbz_path(h)
    pm = meta["page_members"]
    problems, imgs = [], []
    with zipfile.ZipFile(cbz) as z:
        names = sorted(n for n in z.namelist() if C.MEMBER_RE.match(n))
        if names != [p["member"] for p in pm]:
            problems.append("member order differs from catalogue")
        for i, p in enumerate(pm, 1):
            data = z.read(p["member"])
            if hashlib.sha256(data).hexdigest() != p["sha256"]:
                problems.append(f"slice {i} hash mismatch")
            im = Image.open(io.BytesIO(data))
            im.load()
            imgs.append((p, im.convert("RGB")))
    if problems:
        return None, None, problems
    widths = [im.size[0] for _, im in imgs]
    W = max(set(widths), key=widths.count)
    slices, y, parts = [], 0, []
    for i, (p, im) in enumerate(imgs, 1):
        scale = 1.0
        if im.size[0] != W:
            scale = W / im.size[0]
            im = im.resize((W, max(1, round(im.size[1] * scale))), Image.LANCZOS)
        a = np.asarray(im)[:, :, ::-1]
        parts.append(a)
        slices.append({"slice": i, "member": p["member"], "sha256": p["sha256"], "y0": y, "y1": y + a.shape[0], "scale": round(scale, 4)})
        y += a.shape[0]
    return np.ascontiguousarray(np.concatenate(parts, axis=0)), slices, []


def strip_ranges(H, strip_h=2400, overlap=400):
    step = strip_h - overlap
    out, k = [], 0
    while True:
        y0 = k * step
        out.append((k, y0, min(H, y0 + strip_h)))
        if y0 + strip_h >= H:
            return out
        k += 1


def owning_strip(y0, y1, H, strip_h=2400, overlap=400):
    rs = strip_ranges(H, strip_h, overlap)
    for k, a, b in rs:
        if a <= y0 and y1 <= b:
            return k
    return min(int(y0 // (strip_h - overlap)), len(rs) - 1)


def slices_for(slices, y0, y1):
    return [s["member"] for s in slices if s["y0"] < y1 and s["y1"] > y0]


def dedupe_lines(lines):
    """Overlap strips read the same pixels twice. Lines are sorted best-first (farthest from their strip edge); a later line is a
    duplicate if it overlaps a kept one by box, or says the same thing (normalised text) at nearly the same height and column."""
    kept = []
    for l in lines:
        n = C.norm(l["text"])
        dup = False
        for k2 in kept:
            if abs(l["box"][1] - k2["box"][1]) >= 80:
                continue
            if C.box_iou(l["box"], k2["box"]) > 0.4 or (n and n == C.norm(k2["text"]) and abs(l["box"][0] - k2["box"][0]) < 60):
                dup = True
                break
        if not dup:
            kept.append(l)
    return kept


def lines_from(vis, W, H, x_off=0, y_off=0, scale=1.0):
    out = []
    for o in vis.get("obs", []):
        x, y, w, h = o["bbox"]
        out.append({"text": o["text"], "conf": float(o["conf"]),
                    "box": [x * W / scale + x_off, (1 - y - h) * H / scale + y_off, (x + w) * W / scale + x_off, (1 - y) * H / scale + y_off]})
    return out


# ------------------------------------------------------------------ panel finders
def ring_fraction(g, x, y, w, h):
    H, W = g.shape
    hits = tot = 0
    for d in (4, 7):
        for yy in (y - d, y + h + d):
            if 0 <= yy < H:
                seg = g[yy, max(0, x):min(W, x + w)]
                hits += int((seg > 110).sum())
                tot += seg.size
        for xx in (x - d, x + w + d):
            if 0 <= xx < W:
                seg = g[max(0, y):min(H, y + h), xx]
                hits += int((seg > 110).sum())
                tot += seg.size
    return hits / max(1, tot)


def side_cover(lines, x, y, w, h):
    t = 6
    top = lines[y:y + t, x:x + w].max(axis=0) > 0
    bot = lines[max(0, y + h - t):y + h, x:x + w].max(axis=0) > 0
    lef = lines[y:y + h, x:x + t].max(axis=1) > 0
    rig = lines[y:y + h, max(0, x + w - t):x + w].max(axis=1) > 0
    return float(top.mean()), float(bot.mean()), float(lef.mean()), float(rig.mean())


def find_outlines(g, f):
    H, W = g.shape
    bright = cv2.morphologyEx((g > f["bright_threshold"]).astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    cs, hier = cv2.findContours(bright, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    if hier is None:
        return out
    hier = hier[0]
    for i, c in enumerate(cs):
        if hier[i][3] != -1 or hier[i][2] == -1:
            continue
        x, y, w, h = cv2.boundingRect(c)
        if w < f["min_w"] or h < f["min_h"] or w > W - 8 or w * h > f["max_area"]:
            continue
        best, ba, j = None, 0.0, hier[i][2]
        while j != -1:
            a = cv2.contourArea(cs[j])
            if a > ba:
                best, ba = j, a
            j = hier[j][0]
        if best is None or ba / (w * h) < f["min_hole_fraction"]:
            continue
        hx, hy, hw, hh = cv2.boundingRect(cs[best])
        roi = g[hy:hy + hh, hx:hx + hw]
        msk = np.zeros(roi.shape, np.uint8)
        cv2.drawContours(msk, [cs[best] - np.array([hx, hy])], -1, 255, -1)
        vals = roi[msk > 0]
        if vals.size == 0 or np.median(vals) > f["interior_median_max"] or (vals > 200).mean() > f["interior_bright_max"]:
            continue
        out.append({"box": [x, y, x + w, y + h], "source": "outline", "hole_fraction": round(ba / (w * h), 3),
                    "interior_median": int(np.median(vals))})
    return out


def merge_candidates(cands):
    order = {"outline": 0, "frame": 1, "black_fill": 2, "color_window": 3}
    cands = sorted(cands, key=lambda c: (order[c["source"]], -C.box_area(c["box"])))
    kept = []
    for c in cands:
        a, drop = c["box"], False
        for k in kept:
            i = C.box_inter(a, k["box"])
            if i / max(1.0, C.box_area(a)) > 0.8:
                drop = True
                k.setdefault("also", []).append(c["source"])
                break
            if i / max(1.0, C.box_area(k["box"])) > 0.8 and c["source"] == k["source"] == "black_fill":
                drop = True
                break
        if not drop:
            kept.append(c)
    return kept


def find_panels(canvas, profile):
    fd = profile["finders"]
    g = cv2.cvtColor(canvas, cv2.COLOR_BGR2GRAY)
    H, W = g.shape
    cands = []
    if fd["outline"]["enabled"]:
        cands.extend(find_outlines(g, fd["outline"]))
    if fd["black_fill"]["enabled"]:
        f = fd["black_fill"]
        m = cv2.morphologyEx((g < f["black"]).astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in cs:
            x, y, w, h = cv2.boundingRect(c)
            if w < f["min_w"] or h < f["min_h"] or (w > W - 8 and h > 900):
                continue
            if cv2.contourArea(c) / (w * h) < f["min_rect"]:
                continue
            inner = g[y + 6:y + h - 6, x + 6:x + w - 6]
            if inner.size == 0 or (inner < f["black"]).mean() < f["min_black_fraction"]:
                continue
            cands.append({"box": [x, y, x + w, y + h], "source": "black_fill", "rect": round(cv2.contourArea(c) / (w * h), 3),
                          "black": round(float((inner < f["black"]).mean()), 3), "ring": round(ring_fraction(g, x, y, w, h), 3)})
    if fd["frame"]["enabled"]:
        f = fd["frame"]
        bright = (g > f["bright_threshold"]).astype(np.uint8) * 255
        hor = cv2.morphologyEx(bright, cv2.MORPH_OPEN, np.ones((1, 50), np.uint8))
        ver = cv2.morphologyEx(bright, cv2.MORPH_OPEN, np.ones((30, 1), np.uint8))
        lines = cv2.dilate(cv2.bitwise_or(hor, ver), np.ones((5, 5), np.uint8))
        cs, _ = cv2.findContours(lines, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in cs:
            x, y, w, h = cv2.boundingRect(c)
            if w < f["min_w"] or h < f["min_h"] or w > W - 4:
                continue
            sides = side_cover(lines, x, y, w, h)
            if min(sides) >= f["min_side_cover"]:
                cands.append({"box": [x, y, x + w, y + h], "source": "frame", "sides": [round(v, 2) for v in sides]})
    if fd["color_window"]["enabled"]:
        f = fd["color_window"]
        hsv = cv2.cvtColor(canvas, cv2.COLOR_BGR2HSV)
        bm = ((hsv[:, :, 0] >= f["hue_min"]) & (hsv[:, :, 0] <= f["hue_max"]) & (hsv[:, :, 1] > f["min_sat"])
              & (hsv[:, :, 2] > f["min_val"])).astype(np.uint8) * 255
        for c in [c for c in cands if c["source"] == "outline"]:
            tb = c["box"]
            bm[max(0, tb[1] - 6):tb[3] + 6, max(0, tb[0] - 6):tb[2] + 6] = 0
        raw = bm.copy()
        bm = cv2.morphologyEx(bm, cv2.MORPH_CLOSE, np.ones((f["close"], f["close"]), np.uint8))
        cs, _ = cv2.findContours(bm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in cs:
            x, y, w, h = cv2.boundingRect(c)
            if w < f["min_w"] or h < f["min_h"] or (w > W - 4 and h > 1800):
                continue
            fill = cv2.contourArea(c) / (w * h)
            coverage = float((raw[y:y + h, x:x + w] > 0).mean())
            if fill >= f["min_fill"] and coverage >= f.get("min_raw_coverage", 0.0):
                cands.append({"box": [x, y, x + w, y + h], "source": "color_window", "fill": round(fill, 3),
                              "raw_coverage": round(coverage, 3)})
    return merge_candidates(cands)


# ------------------------------------------------------------------ panel analysis
def text_color(crop_bgr):
    hsv = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2HSV)
    bright = hsv[:, :, 2] > 150
    if bright.sum() < 30:
        return "none"
    sat, hue = hsv[:, :, 1][bright], hsv[:, :, 0][bright]
    colored = sat > 90
    if colored.mean() < 0.2:
        return "white"
    h = float(np.median(hue[colored]))
    if h < 10 or h > 170:
        return "red"
    if h < 35:
        return "yellow"
    if h < 85:
        return "green"
    if h < 135:
        return "blue"
    return "other"


def frame_style(crop_bgr):
    g = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
    edge = cv2.Canny(g, 80, 160)
    band = np.zeros_like(edge)
    t = max(6, min(g.shape) // 12)
    band[:t, :] = band[-t:, :] = 1
    band[:, :t] = band[:, -t:] = 1
    return "jagged" if float((edge[band == 1] > 0).mean()) > 0.30 else "plain"


def rows_from(lines):
    ls = sorted(lines, key=lambda l: (l["box"][1] + l["box"][3]) / 2)
    rows = []
    for l in ls:
        cy, hgt = (l["box"][1] + l["box"][3]) / 2, l["box"][3] - l["box"][1]
        if rows and abs(cy - rows[-1]["cy"]) < 0.6 * max(hgt, rows[-1]["h"]):
            rows[-1]["lines"].append(l)
            rows[-1]["cy"] = (rows[-1]["cy"] + cy) / 2
        else:
            rows.append({"cy": cy, "h": hgt, "lines": [l]})
    for r in rows:
        r["lines"].sort(key=lambda l: l["box"][0])
    return rows


VALUE_RE = re.compile(r"^(.+?)\s+((?:Lv\.?\s*)?\d+(?:[./]\d+)?%?|[A-F][+-]?|SS?|EX)$", re.I)
RELAXED_RE = re.compile(r"^([A-Za-z][A-Za-z ]{2,24}?)\s*[:;.,]\s*(\S.*)$")


def key_values(rows, panel_w):
    """Stat-sheet rows: 'Key: Value', two columns with a wide gap, 'Key 12'; misread colons accepted when 2+ clean colon rows."""
    kv, rest = [], []
    for r in rows:
        ls = r["lines"]
        txt = " ".join(l["text"] for l in ls)
        conf = min(l["conf"] for l in ls)
        if ":" in txt:
            k, v = txt.split(":", 1)
            if k.strip() and v.strip():
                kv.append({"key": k.strip(), "value": v.strip(), "how": "colon", "confidence": conf, "row": txt})
                continue
        if len(ls) >= 2 and (ls[1]["box"][0] - ls[0]["box"][2]) > 0.12 * panel_w:
            kv.append({"key": ls[0]["text"].strip(), "value": " ".join(l["text"] for l in ls[1:]).strip(), "how": "columns",
                       "confidence": conf, "row": txt})
            continue
        m = VALUE_RE.match(txt)
        if m and len(ls) == 1 and re.search(r"[A-Za-z]", m.group(1)):
            kv.append({"key": m.group(1).strip(), "value": m.group(2).strip(), "how": "trailing_value", "confidence": conf, "row": txt})
            continue
        rest.append((txt, conf))
    if sum(1 for e in kv if e["how"] == "colon") >= 2:
        for txt, conf in rest:
            m = RELAXED_RE.match(txt)
            if m:
                kv.append({"key": m.group(1).strip(" ,.;"), "value": m.group(2).strip(), "how": "misread_separator", "confidence": conf, "row": txt})
    rowtxt = [" ".join(l["text"] for l in r["lines"]) for r in rows]
    kv.sort(key=lambda e: rowtxt.index(e["row"]) if e["row"] in rowtxt else 0)
    for e in kv:
        e.pop("row", None)
    return kv


def _rule_matches(rule, feat):
    if "text_regex" in rule and not re.search(rule["text_regex"], feat["text"], re.I):
        return False
    for key in ("source", "shape", "color", "frame"):
        if key in rule:
            want = rule[key] if isinstance(rule[key], list) else [rule[key]]
            if feat[key] not in want:
                return False
    if "min_kv" in rule and feat["kv"] < rule["min_kv"]:
        return False
    return True


def classify(profile, text, color, frame, shape, source, kv_count):
    feat = {"text": text, "color": color, "frame": frame, "shape": shape, "source": source, "kv": kv_count}
    for rule in profile["classify"]["rules"]:
        if _rule_matches(rule, feat):
            return rule["type"]
    return profile["classify"].get("fallback", "other_window")


def layout_description(ptype, color, frame, rows, box, kv, shape):
    w, h = box[2] - box[0], box[3] - box[1]
    n = sum(len(r["lines"]) for r in rows)
    cols = max((len(r["lines"]) for r in rows), default=0)
    shape_w = "wide" if w > 1.8 * h else ("tall" if h > 1.4 * w else "squarish")
    return (f"{shape_w} {shape} window, {w}x{h}px, {frame} frame, {color} text, {len(rows)} text rows ({n} lines, up to {cols} per row)"
            f"{f', {len(kv)} key-value rows' if kv else ''}; type guess {ptype}")


# ------------------------------------------------------------------ text blocks
def cluster_blocks(lines):
    blocks = []
    for l in sorted(lines, key=lambda l: (l["box"][1], l["box"][0])):
        b = l["box"]
        hgt = b[3] - b[1]
        for blk in blocks:
            bb = blk["box"]
            gap, ov = b[1] - bb[3], min(b[2], bb[2]) - max(b[0], bb[0])
            if -0.3 * hgt <= gap < 1.0 * hgt and ov > 0.3 * min(b[2] - b[0], bb[2] - bb[0]):
                blk["lines"].append(l)
                blk["box"] = [min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3])]
                break
        else:
            blocks.append({"lines": [l], "box": list(b)})
    return blocks


def inside(l, box, pad=4):
    cx, cy = (l["box"][0] + l["box"][2]) / 2, (l["box"][1] + l["box"][3]) / 2
    return box[0] - pad <= cx <= box[2] + pad and box[1] - pad <= cy <= box[3] + pad


# ------------------------------------------------------------------ chapter
def process_chapter(h, meta, tools, profile, cbz=None):
    series, label, _ = C.parse_title(meta.get("title"))
    cdir = C.chapter_dir(series, label)
    sh, ov = profile["strip"]["height"], profile["strip"]["overlap"]
    step = sh - ov
    C.PRIVATE.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="webtoon-", dir=C.PRIVATE))
    t0 = time.time()
    try:
        canvas, slices, problems = build_canvas(h, meta, cbz)
        if problems:
            return {"hash": h, "error": "; ".join(problems)}
        H, W = canvas.shape[:2]
        strips = strip_ranges(H, sh, ov)
        paths = []
        for k, a, b in strips:
            p = tmp / f"s{k:04d}.png"
            cv2.imwrite(str(p), canvas[a:b])
            paths.append(p)
        vis = C.ocr_images(paths)
        t_vis = time.time() - t0
        raw = []
        for (k, a, b), p in zip(strips, paths):
            for l in lines_from(vis[p.name], W, b - a, 0, a):
                l["strip"], l["edge"] = k, min(l["box"][1] - a, b - l["box"][3])
                raw.append(l)
        raw.sort(key=lambda l: -l["edge"])
        kept = dedupe_lines(raw)
        # panel regions
        panels = []
        for c in find_panels(canvas, profile):
            x0, y0, x1, y1 = c["box"]
            m = 10
            cb = [max(0, x0 - m), max(0, y0 - m), min(W, x1 + m), min(H, y1 + m)]
            crop = canvas[cb[1]:cb[3], cb[0]:cb[2]]
            up = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            n = len(panels)
            cp, mp = tmp / f"crop_{n:04d}.png", tmp / f"mask_{n:04d}.png"
            cv2.imwrite(str(cp), up)
            hsv = cv2.cvtColor(up, cv2.COLOR_BGR2HSV)
            tm = profile["ocr"]["text_mask"]
            cv2.imwrite(str(mp), np.where((hsv[:, :, 2] > tm["min_val"]) & (hsv[:, :, 1] < tm["max_sat"]), 0, 255).astype(np.uint8))
            panels.append({"cand": c, "crop": crop, "crop_box": cb, "tmp": cp, "tmp_mask": mp, "up": up.shape})
        pvis = C.ocr_images([p["tmp"] for p in panels] + [p["tmp_mask"] for p in panels]) if panels else {}
        final = []
        for p in panels:
            best = None
            for variant, key in (("color", "tmp"), ("text_mask", "tmp_mask")):
                ls = lines_from(pvis.get(p[key].name, {}), p["up"][1], p["up"][0], p["crop_box"][0], p["crop_box"][1], scale=2.0)
                score = sum(len(l["text"]) * l["conf"] for l in ls)
                if best is None or score > best[0]:
                    best = (score, variant, ls)
            if not best[2]:
                continue
            bx = p["cand"]["box"]
            cover = sum(C.box_area(l["box"]) for l in best[2]) / max(1, (bx[2] - bx[0]) * (bx[3] - bx[1]))
            if p["cand"]["source"] in ("outline", "frame") and cover < profile["min_text_coverage"]:
                continue
            p["lines"], p["ocr_variant"] = best[2], best[1]
            final.append(p)
        vocab = C.series_vocab(series)
        pboxes = [p["cand"]["box"] for p in final]
        free = [l for l in kept if not any(inside(l, b) for b in pboxes)]
        records, stats = [], {"items": 0, "panels": 0, "panel_types": {}, "flags": {}}
        for k, a, b in strips:
            records.append({"record": "strip", "strip": k, "y_offset": a, "y_end": b, "height": b - a})
        items = []
        for blk in sorted(cluster_blocks(free), key=lambda bl: (bl["box"][1], -bl["box"][0])):
            bx = blk["box"]
            confs = [l["conf"] for l in blk["lines"]]
            flags = []
            if min(confs) < LOW_CONF:
                flags.append("low_confidence")
            if any(l["strip"] != blk["lines"][0]["strip"] for l in blk["lines"]):
                flags.append("crosses_strip")
            text = " ".join(l["text"] for l in sorted(blk["lines"], key=lambda l: l["box"][1]))
            risk, _ = C.item_risk(text, confs, vocab)
            if risk >= HIGH_RISK:
                flags.append("high_risk")
            ks = owning_strip(bx[1], bx[3], H, sh, ov)
            items.append({"record": "item", "cbz_sha256": h, "series": series, "volume": None, "chapter": label, "format": "webtoon",
                          "strip": ks, "strip_y_offset": ks * step, "page": ks, "canvas_y": [round(bx[1]), round(bx[3])],
                          "bbox": [round(v) for v in bx],
                          "bbox_in_strip": [round(bx[0]), round(bx[1] - ks * step), round(bx[2]), round(bx[3] - ks * step)],
                          "source_slices": slices_for(slices, bx[1], bx[3]), "kind": "text", "text": text, "text_raw": text,
                          "confidence": round(sum(confs) / len(confs), 3), "risk": risk, "speaker": None, "speaker_source": None, "flags": flags})
        for n, it in enumerate(items, 1):
            it["reading_order"], it["group_id"] = n, f"s{it['strip']:03d}-t{n:03d}"
        panel_recs = []
        for n, p in enumerate(sorted(final, key=lambda p: p["cand"]["box"][1]), 1):
            c = p["cand"]
            x0, y0, x1, y1 = c["box"]
            pid = f"p{n:03d}"
            color, frame = text_color(p["crop"]), frame_style(p["crop"])
            rows = rows_from(p["lines"])
            kv = key_values(rows, x1 - x0)
            shape = "polygon" if (c["source"] == "outline" and c.get("hole_fraction", 1) < profile["polygon_hole_fraction"]) else "rectangle"
            text = " ".join(" ".join(l["text"] for l in r["lines"]) for r in rows)
            ptype = classify(profile, text, color, frame, shape, c["source"], len(kv))
            confs = [l["conf"] for l in p["lines"]]
            flags = []
            if min(confs) < LOW_CONF:
                flags.append("low_confidence")
            if c["source"] == "black_fill" and c.get("ring", 1) < 0.75:
                flags.append("weak_frame_ring")
            if (x1 - x0) * (y1 - y0) > profile["oversized_area"]:
                flags.append("oversized_region")
            if p["crop_box"][1] == 0 or p["crop_box"][3] == H:
                flags.append("touches_chapter_edge")
            prisk, _ = C.item_risk(text, confs, vocab)
            if prisk >= HIGH_RISK:
                flags.append("high_risk")
            ks = owning_strip(y0, y1, H, sh, ov)
            rel = (cdir / "panels" / f"{pid}.png").relative_to(C.REPO) if str(cdir).startswith(str(C.REPO)) else cdir / "panels" / f"{pid}.png"
            notes = profile.get("type_notes", {})
            rec = {"record": "panel", "panel_id": pid, "cbz_sha256": h, "series": series, "chapter": label, "format": "webtoon",
                   "strip": ks, "strip_y_offset": ks * step, "page": ks, "canvas_y": [y0, y1], "bbox": [x0, y0, x1, y1],
                   "bbox_in_strip": [x0, y0 - ks * step, x1, y1 - ks * step], "crop_box": p["crop_box"],
                   "source_slices": slices_for(slices, y0, y1), "type": ptype, "shape": shape, "text_color": color, "frame": frame,
                   "ocr_variant": p["ocr_variant"], "kind": "panel_" + ptype, "text": text, "text_raw": text,
                   "lines": [{"text": l["text"], "confidence": round(l["conf"], 3), "bbox": [round(v) for v in l["box"]]} for l in p["lines"]],
                   "rows": [" ".join(l["text"] for l in r["lines"]) for r in rows], "key_values": kv,
                   "confidence": round(sum(confs) / len(confs), 3), "risk": prisk, "detect": {k: v for k, v in c.items() if k != "box"},
                   "layout_description": layout_description(ptype, color, frame, rows, c["box"], kv, shape),
                   "story_function": notes.get(ptype), "story_function_source": "profile type note: a vision model's reading, not human-checked",
                   "flags": flags, "crop_file": str(rel), "speaker": None, "speaker_source": None}
            panel_recs.append((rec, p["crop"]))
            stats["panels"] += 1
            stats["panel_types"][ptype] = stats["panel_types"].get(ptype, 0) + 1
            for f in flags:
                stats["flags"][f] = stats["flags"].get(f, 0) + 1
        for it in items:
            for f in it["flags"]:
                stats["flags"][f] = stats["flags"].get(f, 0) + 1
        stats["items"] = len(items)
        records.extend(items)
        records.extend(r for r, _ in panel_recs)
        wall = time.time() - t0
        header = {"record": "header", "schema": C.SCHEMA_VERSION, "cbz_sha256": h, "series": series, "chapter": label,
                  "title": meta.get("title"), "format": "webtoon", "slice_count": len(slices), "canvas": {"width": W, "height": H},
                  "strip_height": sh, "strip_overlap": ov, "slices": slices,
                  "created_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "tools": tools, "reading_direction": "ttb",
                  "run": {"seconds": round(wall, 2), "seconds_vision_strips": round(t_vis, 2), "sec_per_strip": round(wall / len(strips), 3),
                          "strips": len(strips), "peak_rss_mb": round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6, 1),
                          "host": platform.platform(), "nice": os.nice(0)},
                  "stats": stats}
        return {"hash": h, "header": header, "records": records, "panel_crops": panel_recs}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def write_panels(res, cdir):
    pdir = Path(cdir) / "panels"
    if pdir.exists():
        shutil.rmtree(pdir)
    pdir.mkdir(parents=True, exist_ok=True)
    for rec, crop in res.get("panel_crops", []):
        cv2.imwrite(str(pdir / f"{rec['panel_id']}.png"), crop)
        (pdir / f"{rec['panel_id']}.json").write_text(json.dumps(rec, indent=1, ensure_ascii=False))
