#!/usr/bin/env python3
"""Build the Phone Shelf: readable, categorized copies of library books.

Reads docs/research/phone_shelf.json, resolves each entry to a file in the
Source Library catalogue, the phone intake folder or an explicit path, and
writes copies to the output folder. Sources are only read. EPUB copies get a
clean title and series metadata; TTKS captures become EPUBs.

    python3 -I scripts/phone_shelf.py [--out DIR] [--zip]
"""
import argparse, hashlib, html, json, os, re, sqlite3, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "docs/research/phone_shelf.json"
CATALOGUE = Path("~/.local/share/source-platform/catalogue.sqlite").expanduser()
TTKS = ROOT / "docs/research/novels/ttks-novels-2026-10-10"
TTKS_AUTHORS = {"B1": "软糖鸢尾蓝", "B2": "六大六子", "B3": "皮卡堂布拉特", "B4": "万里万雪", "B5": "斤斤斤"}
AD = re.compile(r"[【(（][^】)）]*(域名|ttk|天天看小說|天天看小说)[^】)）]*[】)）]|\(本章完\)")


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def index_sources(intake_dirs):
    idx = {}
    if CATALOGUE.exists():
        db = sqlite3.connect(f"file:{CATALOGUE}?mode=ro", uri=True)
        for h, path in db.execute("select hash, path from locations"):
            if os.path.exists(path):
                # prefer locations outside this repo (originals, not private copies)
                rank = 1 if str(ROOT) in path else 0
                idx.setdefault(h, []).append((rank, path))
    for d in intake_dirs:
        for p in Path(d).expanduser().rglob("*"):
            if p.is_file() and p.suffix.lower() in (".epub", ".pdf"):
                idx.setdefault(sha256(p), []).append((2, str(p)))
    return idx


def resolve(src, idx):
    if src.startswith("path:"):
        p = Path(src[5:]).expanduser()
        if p.is_dir():
            p = next((q for q in sorted(p.iterdir()) if q.suffix.lower() == ".epub"), None)
        return str(p) if p and p.exists() else None
    hits = [h for h in idx if h.startswith(src)]
    if len(hits) != 1:
        return None if not hits else ValueError(f"ambiguous prefix {src}")
    return sorted(idx[hits[0]])[0][1]


def display(series, vol, sub):
    name = series if vol is None else f"{series} {vol:02d}"
    return f"{name} - {sub}" if sub else name


def safe(name):
    return re.sub(r'[/\\:*?"<>|]', "_", name).strip()


def rewrite_epub(src, dst, title, series, vol):
    """Copy an EPUB, setting dc:title and series metadata in the OPF."""
    zin = zipfile.ZipFile(src)
    names = zin.namelist()
    opf = None
    try:
        cont = zin.read("META-INF/container.xml").decode("utf8", "ignore")
        opf = re.search(r'full-path="([^"]+)"', cont).group(1)
    except Exception:
        opf = next((n for n in names if n.endswith(".opf")), None)
    with zipfile.ZipFile(dst, "w") as zout:
        zout.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        for info in zin.infolist():
            if info.filename == "mimetype":
                continue
            data = zin.read(info.filename)
            if info.filename == opf:
                data = patch_opf(data.decode("utf8", "ignore"), title, series, vol).encode("utf8")
            zout.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED)


def patch_opf(x, title, series, vol):
    t = html.escape(title, quote=False)
    x, n = re.subn(r"(<dc:title\b[^>]*>).*?(</dc:title>)", lambda m: m.group(1) + t + m.group(2), x, count=1, flags=re.S)
    if not n:
        x = re.sub(r"(<metadata\b[^>]*>)", lambda m: m.group(1) + f"<dc:title>{t}</dc:title>", x, count=1)
    x = re.sub(r'<meta[^>]*name="calibre:series(_index)?"[^>]*/>', "", x)
    extra = f'<meta name="calibre:series" content="{html.escape(series)}"/>'
    if vol is not None:
        extra += f'<meta name="calibre:series_index" content="{vol}"/>'
    return re.sub(r"</metadata>", extra + "</metadata>", x, count=1)


def ttks_chapters(code):
    base = TTKS / code / "sources"
    chapters = {}
    for f in sorted((base / "ttks-browser-2026-10-10").glob(f"ttks_{code}_*.json")):
        d = json.load(open(f, encoding="utf8"))
        for k, v in d.items():
            if k != "_meta" and isinstance(v, list) and len(v) == 2:
                chapters[int(k)] = (v[0], v[1])
    for f in sorted(base.glob("00[0-9][0-9].txt")):
        n = int(f.stem)
        if n not in chapters:
            chapters[n] = (f"第{n}章", f.read_text("utf8"))
    return [chapters[k] for k in sorted(chapters)]


def build_ttks(code, dst, title):
    chs = ttks_chapters(code)
    esc = lambda s: html.escape(s, quote=False)
    items, spine, nav, ncx = [], [], [], []
    with zipfile.ZipFile(dst, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>', compress_type=zipfile.ZIP_DEFLATED)
        for i, (head, body) in enumerate(chs, 1):
            paras = [AD.sub("", p).strip().strip(" ") for p in body.split("\n")]
            paras = [p for p in paras if p and p != head]
            xhtml = ('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" lang="zh"><head><title>'
                     + esc(head) + "</title></head><body><h2>" + esc(head) + "</h2>"
                     + "".join(f"<p>{esc(p)}</p>" for p in paras) + "</body></html>")
            fn = f"c{i:04d}.xhtml"
            z.writestr("OEBPS/" + fn, xhtml, compress_type=zipfile.ZIP_DEFLATED)
            items.append(f'<item id="c{i}" href="{fn}" media-type="application/xhtml+xml"/>')
            spine.append(f'<itemref idref="c{i}"/>')
            nav.append(f'<li><a href="{fn}">{esc(head)}</a></li>')
            ncx.append(f'<navPoint id="n{i}" playOrder="{i}"><navLabel><text>{esc(head)}</text></navLabel><content src="{fn}"/></navPoint>')
        z.writestr("OEBPS/nav.xhtml", '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>目录</title></head><body><nav epub:type="toc"><ol>' + "".join(nav) + "</ol></nav></body></html>", compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/toc.ncx", '<?xml version="1.0" encoding="utf-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="ttks-' + code + '"/></head><docTitle><text>' + esc(title) + "</text></docTitle><navMap>" + "".join(ncx) + "</navMap></ncx>", compress_type=zipfile.ZIP_DEFLATED)
        opf = ('<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/">'
               f'<dc:identifier id="uid">ttks-{code}</dc:identifier><dc:title>{esc(title)}</dc:title><dc:creator>{esc(TTKS_AUTHORS[code])}</dc:creator><dc:language>zh-Hant</dc:language>'
               '<meta property="dcterms:modified">2026-11-22T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>'
               + "".join(items) + '</manifest><spine toc="ncx">' + "".join(spine) + "</spine></package>")
        z.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
    return len(chs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="~/Documents/Library/Phone Shelf")
    ap.add_argument("--zip", action="store_true")
    a = ap.parse_args()
    out = Path(a.out).expanduser()
    m = json.load(open(MANIFEST, encoding="utf8"))
    idx = index_sources(m.get("intake", []))
    receipt, missing, seen = [], [], {}
    for shelf, entries in m["shelves"].items():
        (out / shelf).mkdir(parents=True, exist_ok=True)
        for series, vol, src, *rest in entries:
            sub = rest[0] if rest else None
            name = display(series, vol, sub)
            if src.startswith("ttks:"):
                dst = out / shelf / (safe(name.replace(" [zh]", "")) + " [zh].epub")
                n = build_ttks(src[5:], dst, series.replace(" [zh]", ""))
                receipt.append({"shelf": shelf, "name": name, "source": src, "chapters": n, "_dst": dst})
                continue
            path = resolve(src, idx)
            if not isinstance(path, str):
                missing.append((shelf, name, src, str(path)))
                continue
            key = sha256(path)
            if key in seen:
                missing.append((shelf, name, src, f"duplicate of {seen[key]}"))
                continue
            seen[key] = name
            ext = Path(path).suffix.lower()
            dst = out / shelf / (safe(name) + ext)
            if ext == ".epub":
                rewrite_epub(path, dst, name.replace(" [zh]", ""), series.replace(" [zh]", ""), vol)
            else:
                dst.write_bytes(Path(path).read_bytes())
            receipt.append({"shelf": shelf, "name": name, "source": src, "source_sha256": key, "source_path": path, "_dst": dst})
    for r in receipt:
        f = r.pop("_dst")
        r["file"] = str(f.relative_to(out)); r["bytes"] = f.stat().st_size; r["sha256"] = sha256(f)
    (out / "shelf_receipt.json").write_text(json.dumps({"books": receipt, "missing": missing}, ensure_ascii=False, indent=1), "utf8")
    total = sum(r.get("bytes", 0) for r in receipt)
    print(f"built {len(receipt)} books, {total/1e6:.0f} MB, missing {len(missing)}")
    for x in missing:
        print("  MISSING", *x, sep=" | ")
    if a.zip:
        zp = out.with_suffix(".zip")
        with zipfile.ZipFile(zp, "w", zipfile.ZIP_STORED) as z:
            for f in sorted(out.rglob("*")):
                if f.is_file():
                    z.write(f, Path(out.name) / f.relative_to(out))
        print("zip", zp, f"{zp.stat().st_size/1e6:.0f} MB")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
