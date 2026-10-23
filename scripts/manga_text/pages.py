"""Manga page pipeline: Apple Vision text lines grouped by a comic text/bubble detector.

Spreads are split (right half first, right-to-left). Output records follow the schema in README.md."""
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

import common as C
import panels as PN

PAGES_VERSION = "stage1-0.3"        # 0.3 (schema 3): panels by gutter cuts, coarse kinds (speech/caption/sfx), risk score, no very_low flag
DET_THRESHOLD = 0.4
SPREAD_RATIO = 1.1
LOW_CONF = 0.9
HIGH_RISK = 0.3
ORDER_MODE = os.environ.get("MANGA_TEXT_ORDER", "overlap")


def versions():
    return {"tool": PAGES_VERSION, "schema": C.SCHEMA_VERSION, "ocr": f"apple-vision-VNRecognizeTextRequest accurate en-US macOS-build-{C.mac_build()}",
            "detector": f"{C.DETECTOR}@{C.detector_revision()} threshold={DET_THRESHOLD}", "order": ORDER_MODE}


def load_pages(h, meta, tmp, cbz=None):
    """Verify members, order and hashes against the catalogue; write page units (spread halves) to tmp."""
    from PIL import Image
    cbz = cbz or C.cbz_path(h)
    problems, pm = [], meta["page_members"]
    with zipfile.ZipFile(cbz) as z:
        names = sorted(n for n in z.namelist() if C.MEMBER_RE.match(n))
        if names != [p["member"] for p in pm]:
            problems.append(f"member order differs from catalogue ({len(names)} vs {len(pm)})")
        pages = []
        for i, p in enumerate(pm, 1):
            if p["member"] not in z.namelist():
                problems.append(f"missing member {p['member']}")
                continue
            data = z.read(p["member"])
            sha = hashlib.sha256(data).hexdigest()
            if sha != p["sha256"]:
                problems.append(f"page {i} hash mismatch")
            im = Image.open(io.BytesIO(data))
            im.load()
            im = im.convert("RGB")
            W, Hh = im.size
            units = []
            if W > Hh * SPREAD_RATIO:
                mid = W // 2
                for half, (x0, x1) in (("right", (mid, W)), ("left", (0, mid))):
                    f = tmp / f"{i:05d}_{half}.png"
                    im.crop((x0, 0, x1, Hh)).save(f)
                    units.append({"path": f, "half": half, "x_off": x0, "w": x1 - x0, "h": Hh})
            else:
                f = tmp / f"{i:05d}.png"
                im.save(f)
                units.append({"path": f, "half": None, "x_off": 0, "w": W, "h": Hh})
            pages.append({"page": i, "member": p["member"], "sha": sha, "width": W, "height": Hh, "units": units})
    return pages, problems


_det = {}


def run_detector(pages):
    import torch
    from PIL import Image
    from transformers import RTDetrImageProcessor, RTDetrV2ForObjectDetection
    if not _det:
        _det["proc"] = RTDetrImageProcessor.from_pretrained(C.DETECTOR)
        _det["model"] = RTDetrV2ForObjectDetection.from_pretrained(C.DETECTOR).eval()
        _det["dev"] = "mps" if torch.backends.mps.is_available() else "cpu"
        _det["model"].to(_det["dev"])
    proc, model, dev = _det["proc"], _det["model"], _det["dev"]
    res = {}
    for p in pages:
        for u in p["units"]:
            im = Image.open(u["path"]).convert("RGB")
            inp = proc(images=im, return_tensors="pt").to(dev)
            with torch.no_grad():
                o = model(**inp)
            r = proc.post_process_object_detection(o, target_sizes=torch.tensor([im.size[::-1]]), threshold=DET_THRESHOLD)[0]
            res[u["path"].name] = [{"label": model.config.id2label[int(l)], "score": float(s), "box": [float(x) for x in b]}
                                   for s, l, b in zip(r["scores"], r["labels"], r["boxes"])]
    return res


def clean_boxes(dets):
    ds = sorted((d for d in dets if d["label"] in ("text_bubble", "text_free")), key=lambda d: -d["score"])
    keep = []
    for d in ds:
        a = d["box"]
        if any(C.box_inter(a, k["box"]) / max(1.0, min(C.box_area(a), C.box_area(k["box"]))) > 0.8 for k in keep):
            continue
        keep.append(d)
    return keep


def order_band(items, H):
    return sorted(items, key=lambda it: (round(it["box"][1] / (H * 0.12)), -it["box"][0]))


def v_overlap(a, b):
    o = min(a[3], b[3]) - max(a[1], b[1])
    return o / max(1.0, min(a[3] - a[1], b[3] - b[1]))


def order_overlap(items, H=None):
    rem = sorted(items, key=lambda it: it["box"][1])
    out = []
    while rem:
        row = [rem.pop(0)]
        grew = True
        while grew:
            grew = False
            for it in rem[:]:
                if any(v_overlap(it["box"], r["box"]) > 0.3 for r in row):
                    row.append(it)
                    rem.remove(it)
                    grew = True
        out.extend(sorted(row, key=lambda it: -(it["box"][0] + it["box"][2]) / 2))
    return out


def order_items(items, H, mode=None):
    return order_band(items, H) if (mode or ORDER_MODE) == "band" else order_overlap(items, H)


def build_unit_items(u, vis, dets, gray=None):
    """Group Apple lines into detector boxes; lines outside any box stay single items.

    With a gray image, panels come from white-gutter cuts: items get a panel number and are ordered panel by panel (right to left,
    top to bottom), then by the row heuristic inside a panel. Returns (ordered items, panel rectangles)."""
    W, H = u["w"], u["h"]
    balloons = [d["box"] for d in dets if d["label"] == "bubble"]
    groups = [{"det": d, "box": d["box"], "lines": []} for d in clean_boxes(dets)]
    outside = []
    for li, o in enumerate(vis.get("obs", [])):
        x, y, w, h = o["bbox"]
        x0, x1, y0, y1 = x * W, (x + w) * W, (1 - y - h) * H, (1 - y) * H
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        line = {"id": li, "text": o["text"], "conf": float(o["conf"]), "box": [x0, y0, x1, y1]}
        cands = [g for g in groups if g["box"][0] - 5 <= cx <= g["box"][2] + 5 and g["box"][1] - 5 <= cy <= g["box"][3] + 5]
        if cands:
            min(cands, key=lambda g: C.box_area(g["box"]))["lines"].append(line)
        else:
            outside.append(line)
    items = [{"box": g["box"], "lines": sorted(g["lines"], key=lambda l: l["box"][1]), "det": g["det"], "outside": False} for g in groups]
    items += [{"box": l["box"], "lines": [l], "det": None, "outside": True} for l in outside]
    for it in items:
        cx, cy = (it["box"][0] + it["box"][2]) / 2, (it["box"][1] + it["box"][3]) / 2
        it["in_balloon"] = any(b[0] <= cx <= b[2] and b[1] <= cy <= b[3] for b in balloons)
    rects = PN.xy_cut(gray) if gray is not None else []
    if len(rects) <= 1:
        for it in items:
            it["panel"], it["panel_method"] = (1 if rects else None), ("none" if rects else None)
        return order_items(items, H), rects
    by_panel = {}
    for it in items:
        cx, cy = (it["box"][0] + it["box"][2]) / 2, (it["box"][1] + it["box"][3]) / 2
        idx, inside_ = PN.assign((cx, cy), rects)
        it["panel"], it["panel_method"] = idx + 1, ("xycut" if inside_ else "xycut_nearest")
        by_panel.setdefault(idx, []).append(it)
    ordered = []
    for idx in sorted(by_panel):
        ordered.extend(order_items(by_panel[idx], H))
    return ordered, rects


def coarse_kind(it, text, label, page_h):
    """speech | caption | sfx | page_number | unknown. Boxes the detector calls text_bubble, or free text inside a balloon, are speech;
    short free text is a sound effect; longer free text is a caption (narration, name card, or speech outside a balloon: coarse)."""
    if it["outside"] and re.fullmatch(r"\d{1,4}", text.strip()) and it["box"][1] > page_h * 0.88:
        return "page_number"
    if not text.strip():
        return "unknown"
    if label == "text_bubble" or it.get("in_balloon"):
        return "speech"
    words = len(text.split())
    confs = [l["conf"] for l in it["lines"]]
    if (words <= 2 and len(text) <= 16) or (confs and min(confs) <= 0.5 and words <= 3):
        return "sfx"
    return "caption"


def process_chapter(h, meta, tools, cbz=None):
    series, label, _ = C.parse_title(meta.get("title"))
    C.PRIVATE.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="pages-", dir=C.PRIVATE))
    t0 = time.time()
    try:
        pages, problems = load_pages(h, meta, tmp, cbz)
        if problems:
            return {"hash": h, "error": "; ".join(problems)}
        vis = C.ocr_images([u["path"] for p in pages for u in p["units"]])
        if C.ocr_failure_message(vis):
            return {"error": C.ocr_failure_message(vis)}
        t_vis = time.time() - t0
        det = run_detector(pages)
        t_det = time.time() - t0 - t_vis
        vocab = C.series_vocab(series)
        records, stats = [], {"items": 0, "empty_pages": 0, "spread_pages": 0, "flags": {}}
        for p in pages:
            page_items, order = [], 0
            if len(p["units"]) > 1:
                stats["spread_pages"] += 1
            page_panels = []
            for u in p["units"]:
                from PIL import Image
                import numpy as np
                gray = np.asarray(Image.open(u["path"]).convert("L"))
                ordered, rects = build_unit_items(u, vis.get(u["path"].name, {}), det.get(u["path"].name, []), gray)
                page_panels.extend([[int(r[0] + u["x_off"]), int(r[1]), int(r[2] + u["x_off"]), int(r[3])] for r in rects])
                for n, it in enumerate(ordered):
                    order += 1
                    ls = it["lines"]
                    confs = [l["conf"] for l in ls]
                    flags = []
                    if u["half"]:
                        flags.append("spread_split")
                    if it["outside"]:
                        flags.append("outside_text_box")
                    if not ls:
                        flags.append("no_text_in_box")
                    if confs and min(confs) < LOW_CONF:
                        flags.append("low_confidence")
                    text = " ".join(l["text"] for l in ls)
                    risk, risk_parts = C.item_risk(text, confs, vocab) if ls else (None, {})
                    if risk is not None and risk >= HIGH_RISK:
                        flags.append("high_risk")
                    if it.get("panel_method") == "xycut_nearest":
                        flags.append("panel_inferred")
                    lab = it["det"]["label"] if it["det"] else None
                    kind = coarse_kind(it, text, lab, u["h"])
                    b = it["box"]
                    rec = {"record": "item", "format": "manga", "cbz_sha256": h, "series": series, "volume": None, "chapter": label,
                           "page": p["page"], "page_member": p["member"], "page_sha256": p["sha"], "spread_half": u["half"],
                           "panel": it.get("panel"), "panel_method": it.get("panel_method"), "panel_confidence": None,
                           "bbox": [max(0, round(b[0] + u["x_off"])), max(0, round(b[1])), min(p["width"], round(b[2] + u["x_off"])),
                                    min(p["height"], round(b[3]))],
                           "group_id": f"p{p['page']:03d}{(u['half'] or '-')[0]}-g{n + 1:02d}", "line_ids": [l["id"] for l in ls],
                           "reading_order": order, "kind": kind, "text": text, "text_raw": text,
                           "confidence": round(sum(confs) / len(confs), 3) if confs else None, "risk": risk, "in_balloon": it.get("in_balloon", False),
                           "detector_label": lab, "detector_score": round(it["det"]["score"], 3) if it["det"] else None,
                           "speaker": None, "speaker_source": None, "flags": flags}
                    page_items.append(rec)
                    for f in flags:
                        stats["flags"][f] = stats["flags"].get(f, 0) + 1
            texty = [r for r in page_items if r["text"].strip()]
            stats["empty_pages"] += not texty
            records.append({"record": "page", "page": p["page"], "page_member": p["member"], "page_sha256": p["sha"],
                            "width": p["width"], "height": p["height"], "spread": len(p["units"]) > 1, "panels": page_panels, "items": len(page_items),
                            "text_items": len(texty), "empty": not texty})
            records.extend(page_items)
            stats["items"] += len(page_items)
        wall = time.time() - t0
        header = {"record": "header", "schema": C.SCHEMA_VERSION, "cbz_sha256": h, "series": series, "chapter": label, "title": meta.get("title"),
                  "format": "manga", "page_count": len(pages), "created_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                  "tools": tools, "reading_direction": "rtl-panels",
                  "run": {"seconds": round(wall, 2), "seconds_vision": round(t_vis, 2), "seconds_detector": round(t_det, 2),
                          "sec_per_page": round(wall / len(pages), 3),
                          "peak_rss_mb": round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6, 1),
                          "host": platform.platform(), "nice": os.nice(0)},
                  "stats": stats}
        return {"hash": h, "header": header, "records": records}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
