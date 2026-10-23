"""Book mode: scanned or image-only PDFs and fixed-layout EPUBs, read locally with Apple Vision (Japanese and English).

Page images are extracted read-only from the source file; the PDF text layer is used when a page has one (mode auto) and OCR runs on
pages without. Output follows the chapter schema (format 'book'), so the same index, summary, query, slice and export commands work.
Nothing is translated: Japanese stays in text_raw with a language flag."""
import hashlib
import io
import json
import os
import platform
import posixpath
import re
import resource
import shutil
import subprocess
import tempfile
import time
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import cv2
import numpy as np
from PIL import Image

import common as C
import tables as TB
import webtoon as W

BOOKS_VERSION = "books-0.2"      # 0.2: ignore page-sized frames and mostly empty grids (panel layouts)
LONG_SIDE = 2400
TEXT_LAYER_MIN = 40                # chars: below this a PDF page counts as image-only
CHUNK = 10
LOW_CONF = 0.9
DEFAULT_LANGS = ["ja-JP", "en-US"]


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def book_title(path):
    stem = Path(path).stem
    stem = re.sub(r"\s*\((?:[^()]*z-lib[^()]*)\)", "", stem)
    return re.sub(r"\s+", " ", stem).strip() or "untitled"


def lang_of(text):
    kana = sum(1 for c in text if "぀" <= c <= "ヿ")
    han = sum(1 for c in text if "一" <= c <= "鿿")
    latin = sum(1 for c in text if c.isascii() and c.isalpha())
    if kana or (han and han >= latin):
        return "ja" if kana else "zh-or-ja"
    return "en" if latin else "other"


def versions(langs, mode, profile):
    return {"tool": BOOKS_VERSION, "schema": C.SCHEMA_VERSION,
            "ocr": f"apple-vision-VNRecognizeTextRequest accurate {','.join(langs)} auto-language macOS-build-{C.mac_build()}",
            "detector": None, "order": "rows; vertical-rl when most lines are tall", "mode": mode,
            "profile": f"{profile['name']}@{W.profile_hash(profile)}"}


# ------------------------------------------------------------------ sources
def pdf_run(*args):
    C.ensure_pdfbin()
    return subprocess.run([str(C.PDFBIN), *map(str, args)], capture_output=True, text=True)


def pdf_pages(path):
    r = pdf_run("info", path)
    try:
        d = json.loads(r.stdout.strip().splitlines()[0])
    except (ValueError, IndexError):
        return None
    return d.get("pages") if "error" not in d else None


def pdf_text(path, first, last):
    out = {}
    for line in pdf_run("text", path, first, last).stdout.splitlines():
        d = json.loads(line)
        out[d["page"]] = d
    return out


def epub_pages(path):
    """Spine pages of an EPUB: [{'name', 'text', 'image'}] with the largest image on each page (fixed-layout books are images)."""
    pages = []
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("META-INF/container.xml"))
        opf_path = root.find(".//{*}rootfile").attrib["full-path"]
        opf = ET.fromstring(z.read(opf_path))
        base = posixpath.dirname(opf_path)
        manifest = {i.attrib["id"]: i.attrib["href"] for i in opf.findall(".//{*}manifest/{*}item")}
        for ref in opf.findall(".//{*}spine/{*}itemref"):
            href = manifest.get(ref.attrib["idref"])
            if not href:
                continue
            name = posixpath.normpath(posixpath.join(base, href))
            try:
                html = z.read(name).decode("utf8", "ignore")
            except KeyError:
                continue
            srcs = re.findall(r"""(?:src|xlink:href|href)=["']([^"']+\.(?:jpe?g|png|gif|webp))["']""", html, re.I)
            best, best_size = None, -1
            for s in srcs:
                member = posixpath.normpath(posixpath.join(posixpath.dirname(name), s))
                try:
                    size = z.getinfo(member).file_size
                except KeyError:
                    continue
                if size > best_size:
                    best, best_size = member, size
            text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"(?is)<(script|style).*?</\1>", " ", html))).strip()
            pages.append({"name": name, "text": text, "image": best})
    return pages


# ------------------------------------------------------------------ page analysis
def order_lines(lines):
    """Rows top to bottom; vertical-rl (columns right to left) when most lines are much taller than wide."""
    if not lines:
        return [], "horizontal"
    tall = sum(1 for l in lines if (l["box"][3] - l["box"][1]) > 2 * (l["box"][2] - l["box"][0]))
    if tall > 0.6 * len(lines):
        return sorted(lines, key=lambda l: (-(l["box"][0] + l["box"][2]) / 2 // 40, l["box"][1])), "vertical-rl"
    rows = W.rows_from(lines)
    return [l for r in rows for l in r["lines"]], "horizontal"


KV_RE = re.compile(r"^(.{1,16}?)\s*[:：]\s*(\S.*)$")


def kv_from_lines(lines):
    kv = []
    for l in lines:
        m = KV_RE.match(l["text"])
        if m:
            kv.append({"key": m.group(1).strip(), "value": m.group(2).strip(), "how": "colon", "confidence": l["conf"]})
    return kv


def analyse_page(png_path, ocr_result, profile, page_no, file_sha, series):
    """Items, tables and profile boxes from one OCR'd page image. Returns (items, regions, direction, size)."""
    im = cv2.imread(str(png_path))
    H, Wd = im.shape[:2]
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    lines = W.lines_from(ocr_result, Wd, H)
    regions, used_lines = [], set()
    page_area = H * Wd
    for t in TB.find_tables(gray):
        if C.box_area(t["box"]) > 0.7 * page_area:
            continue                                        # the page border or an art grid, not a table
        rows, used = TB.cell_rows(t, lines)
        cells = [c for r in rows for c in r]
        if not cells or sum(1 for c in cells if c.strip()) < 0.6 * len(cells):
            continue                                        # mostly empty cells: a panel layout
        used_lines |= {id(lines[k]) for k in used}
        kv = [{"key": r[0], "value": r[1], "how": "table_row", "confidence": None} for r in rows if len(r) == 2 and r[0] and r[1]]
        if not kv:
            kv = [{"key": r[0], "value": " | ".join(r[1:]), "how": "table_row", "confidence": None} for r in rows if len(r) > 2 and r[0]]
        regions.append({"kind": "book_table", "box": t["box"], "rows": rows, "key_values": kv, "detect": "ruled grid"})
    tbox = [r["box"] for r in regions] + [t["box"] for t in TB.find_tables(gray)]
    cands = [{"box": b["box"], "source": "ruled box"} for b in TB.find_boxes(gray)
             if C.box_area(b["box"]) <= 0.7 * page_area and not any(C.box_inter(b["box"], t) > 0.5 * C.box_area(b["box"]) for t in tbox)]
    cands += [c for c in W.find_panels(im, profile)
              if C.box_area(c["box"]) <= 0.7 * page_area and not any(C.box_inter(c["box"], t) > 0.5 * C.box_area(c["box"]) for t in tbox + [x["box"] for x in cands])]
    for c in cands:
        b = c["box"]
        inside = [l for l in lines if id(l) not in used_lines and W.inside(l, b)]
        if len(inside) < 2:
            continue
        used_lines |= {id(l) for l in inside}
        rows = W.rows_from(inside)
        kv = kv_from_lines(inside) or W.key_values(rows, b[2] - b[0])
        regions.append({"kind": "book_profile", "box": b, "rows": [[l["text"] for l in r["lines"]] for r in rows], "key_values": kv,
                        "detect": c["source"]})
    free = [l for l in lines if id(l) not in used_lines]
    ordered, direction = order_lines(free)
    blocks = []
    if direction == "horizontal":
        for blk in sorted(W.cluster_blocks(ordered), key=lambda bl: (bl["box"][1], bl["box"][0])):
            blocks.append(blk)
    else:
        blocks = [{"lines": [l], "box": l["box"]} for l in ordered]
    return blocks, regions, direction, (Wd, H)


# ------------------------------------------------------------------ book
def process_book(path, title=None, langs=None, mode="auto", profile=None, tools=None):
    path = Path(path)
    langs = langs or DEFAULT_LANGS
    profile = profile or W.load_profiles()["databook"]
    series = title or book_title(path)
    kind = path.suffix.lower().lstrip(".")
    t0 = time.time()
    file_sha = sha256_file(path)
    C.PRIVATE.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="book-", dir=C.PRIVATE))
    try:
        if kind == "pdf":
            n = pdf_pages(path)
            if not n:
                return {"error": "cannot open (damaged or truncated PDF: no page tree or trailer)", "file_sha256": file_sha}
            units = list(range(1, n + 1))
        elif kind == "epub":
            ep = epub_pages(path)
            units = list(range(1, len(ep) + 1))
            n = len(units)
        else:
            return {"error": f"unsupported file type .{kind}", "file_sha256": file_sha}
        records, stats = [], {"items": 0, "panels": 0, "ocr_pages": 0, "text_layer_pages": 0, "empty_pages": 0, "flags": {}, "langs": {}}
        for start in range(0, n, CHUNK):
            chunk = units[start:start + CHUNK]
            layer = pdf_text(path, chunk[0], chunk[-1]) if kind == "pdf" else {}
            need = []
            for p in chunk:
                chars = layer[p]["chars"] if kind == "pdf" and p in layer else (len(ep[p - 1]["text"]) if kind == "epub" else 0)
                if mode == "always" or (mode == "auto" and chars < TEXT_LAYER_MIN):
                    need.append(p)
            imgs = {}
            for p in need:
                f = tmp / f"p{p:05d}.png"
                if kind == "pdf":
                    r = pdf_run("render", path, p, f, LONG_SIDE)
                    if not f.exists():
                        continue
                else:
                    member = ep[p - 1]["image"]
                    if not member:
                        continue
                    with zipfile.ZipFile(path) as z:
                        im = Image.open(io.BytesIO(z.read(member))).convert("RGB")
                    sc = LONG_SIDE / max(im.size)
                    if sc < 1:
                        im = im.resize((round(im.size[0] * sc), round(im.size[1] * sc)))
                    im.save(f)
                imgs[p] = f
            vis = C.ocr_images(list(imgs.values()), langs=langs) if imgs else {}
            for p in chunk:
                items, regions, direction, size = [], [], "horizontal", None
                source = "none"
                text_layer = (layer[p]["text"] if kind == "pdf" and p in layer else (ep[p - 1]["text"] if kind == "epub" else "")).strip()
                if p in imgs:
                    blocks, regions, direction, size = analyse_page(imgs[p], vis.get(imgs[p].name, {}), profile, p, file_sha, series)
                    source = "ocr"
                    stats["ocr_pages"] += 1
                    for blk in blocks:
                        confs = [l["conf"] for l in blk["lines"]]
                        text = " ".join(l["text"] for l in blk["lines"])
                        lg = lang_of(text)
                        flags = []
                        if confs and min(confs) < LOW_CONF:
                            flags.append("low_confidence")
                        risk = None
                        if lg == "en":
                            risk = C.item_risk(text, confs, C.series_vocab(series))[0]
                            if risk >= 0.3:
                                flags.append("high_risk")
                        items.append({"text": text, "box": blk["box"], "lang": lg, "conf": sum(confs) / len(confs), "risk": risk,
                                      "flags": flags, "source": "ocr"})
                if text_layer and (p not in imgs or mode == "auto" and len(text_layer) >= TEXT_LAYER_MIN):
                    if p not in imgs:
                        stats["text_layer_pages"] += 1
                        source = "text_layer"
                    w_, h_ = (layer[p]["w"], layer[p]["h"]) if kind == "pdf" and p in layer else (0, 0)
                    items.append({"text": text_layer, "box": [0, 0, w_, h_], "lang": lang_of(text_layer), "conf": None, "risk": None,
                                  "flags": [], "source": "text_layer"})
                for k, it in enumerate(items, 1):
                    b = [round(v) for v in it["box"]]
                    rec = {"record": "item", "format": "book", "cbz_sha256": file_sha, "file_sha256": file_sha, "series": series,
                           "chapter": "book", "page": p, "bbox": b, "reading_order": k, "group_id": f"p{p:04d}-t{k:03d}", "kind": "book_text",
                           "text": it["text"], "text_raw": it["text"], "lang": it["lang"],
                           "confidence": round(it["conf"], 3) if it["conf"] is not None else None, "risk": it["risk"],
                           "source": it["source"], "direction": direction, "flags": it["flags"] + (["language_" + it["lang"]] if it["lang"] != "en" else [])}
                    records.append(rec)
                    stats["items"] += 1
                    stats["langs"][it["lang"]] = stats["langs"].get(it["lang"], 0) + 1
                    for f_ in rec["flags"]:
                        stats["flags"][f_] = stats["flags"].get(f_, 0) + 1
                for k, rg in enumerate(regions, 1):
                    text = " ".join(" ".join(r) for r in rg["rows"])
                    lg = lang_of(text)
                    rec = {"record": "panel", "format": "book", "cbz_sha256": file_sha, "file_sha256": file_sha, "series": series, "chapter": "book",
                           "page": p, "panel_id": f"p{p:04d}-r{k:02d}", "bbox": [round(v) for v in rg["box"]], "kind": rg["kind"], "type": rg["kind"],
                           "text": text, "text_raw": text, "lang": lg, "rows": rg["rows"], "key_values": rg["key_values"], "detect": rg["detect"],
                           "confidence": None, "flags": ["language_" + lg] if lg != "en" else []}
                    records.append(rec)
                    stats["panels"] += 1
                if not items and not regions:
                    stats["empty_pages"] += 1
                records.append({"record": "page", "page": p, "width": size[0] if size else None, "height": size[1] if size else None,
                                "source": source, "direction": direction, "items": len(items), "regions": len(regions)})
            for f in imgs.values():
                f.unlink(missing_ok=True)
        wall = time.time() - t0
        header = {"record": "header", "schema": C.SCHEMA_VERSION, "cbz_sha256": file_sha, "file_sha256": file_sha, "series": series, "chapter": "book",
                  "title": series, "format": "book", "book_kind": kind, "source_path": str(path), "page_count": n,
                  "ocr": {"mode": mode, "langs": langs}, "created_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                  "tools": tools or versions(langs, mode, profile), "reading_direction": "mixed",
                  "run": {"seconds": round(wall, 2), "sec_per_page": round(wall / max(1, n), 3),
                          "peak_rss_mb": round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6, 1),
                          "host": platform.platform(), "nice": os.nice(0)},
                  "stats": stats}
        return {"hash": file_sha, "header": header, "records": records}
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def write_book(res, series):
    cfile = C.chapter_file(series, "book")
    cfile.parent.mkdir(parents=True, exist_ok=True)
    part = cfile.with_suffix(".jsonl.part")
    with part.open("w") as f:
        f.write(json.dumps(res["header"]) + "\n")
        for r in res["records"]:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    part.replace(cfile)
    con = C.db()
    with con:
        C.index_records(con, res["header"], res["records"], cfile.parent.relative_to(C.PRIVATE))
    con.close()
    return cfile


def book_done(path, series, tools):
    f = C.chapter_file(series, "book")
    head = C.read_header(f)
    return bool(head) and head.get("file_sha256") == sha256_file(path) and C._without_build(head.get("tools")) == C._without_build(tools)


def queue_entries():
    """Entries from the governor's books queue plus our own local list. Tolerant of list or {items: [...]} and str or dict entries."""
    out = []
    sources = [Path(os.environ.get("MANGA_TEXT_BOOK_QUEUE", Path.home() / ".local/share/source-platform/governor/books/ocr_queue.json")),
               C.RUNS / "book_queue_local.json"]
    for src in sources:
        try:
            d = json.loads(src.read_text())
        except (OSError, ValueError):
            continue
        items = d.get("items") or d.get("queue") or d.get("books") or [] if isinstance(d, dict) else d
        for it in items:
            if isinstance(it, str):
                it = {"path": it}
            p = it.get("path") or it.get("file") or it.get("final_path") or it.get("dest")
            if p and Path(p).exists() and Path(p).suffix.lower() in (".pdf", ".epub"):
                out.append({"path": p, "title": it.get("title") or it.get("label"), "ocr": it.get("ocr"),
                            "lang": it.get("lang") or it.get("language")})
    seen, uniq = set(), []
    for e in out:
        if e["path"] not in seen:
            seen.add(e["path"])
            uniq.append(e)
    return uniq


def entry_options(e):
    langs = DEFAULT_LANGS
    if e.get("lang"):
        l = str(e["lang"]).lower()
        langs = ["en-US"] if l.startswith("en") else (["ja-JP", "en-US"] if l.startswith("ja") else DEFAULT_LANGS)
    mode = "always" if e.get("ocr") is True else "auto"
    return langs, mode
