"""Shared pieces for manga_text: paths, catalogue access, titles, chapter shape, layout, index, catalog."""
import collections
import hashlib
import io
import json
import os
import platform
import re
import sqlite3
import subprocess
import sys
import time
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
PRIVATE = Path(os.environ.get("MANGA_TEXT_PRIVATE", REPO / "docs/research/manga-text/private"))
LIB = Path(os.environ.get("MANGA_TEXT_LIBRARY", Path.home() / ".local/share/source-platform/library"))
CAT = Path(os.environ.get("MANGA_TEXT_CATALOGUE", Path.home() / ".local/share/source-platform/catalogue.sqlite"))
HOME = Path(os.environ.get("MANGA_TEXT_HOME", Path.home() / ".local/share/manga-text"))
BIN = HOME / "bin" / "avision"
RUNS = PRIVATE / "runs"
MEMBER_RE = re.compile(r"^\d{5}\.(jpg|jpeg|png|webp)$", re.I)
SCHEMA_VERSION = 3
DETECTOR = "ogkalu/comic-text-and-bubble-detector"
EXCLUDE_SERIES = {"Platform Verification", "Source Library Manga Fixture"}


# ------------------------------------------------------------------ catalogue and titles
def cat_rows(con=None):
    """Yield (hash, metadata) for every CBZ asset. Opens the catalogue read-only."""
    own = con is None
    if own:
        con = sqlite3.connect(f"file:{CAT}?mode=ro", uri=True)
    try:
        for h, m in con.execute("select hash, metadata from assets"):
            m = json.loads(m)
            if m.get("kind") == "cbz" and m.get("page_members") and (m.get("title") or "").strip():
                yield h, m
    finally:
        if own:
            con.close()


def parse_title(title):
    """'Series / Chapter 12.5' -> (series, label, number). Extras keep their text as label."""
    title = (title or "").strip()
    if " / " in title:
        series, rest = title.split(" / ", 1)
    else:
        series, rest = title, ""
    series, rest = series.strip(), rest.strip()
    m = re.match(r"^Chapter\s+([\d.]+)\s*$", rest, re.I)
    if m:
        return series, m.group(1), float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)", rest)
    return series, rest or "1", (float(m.group(1)) if m else None)


def slug(text):
    return re.sub(r"[^A-Za-z0-9._-]+", "_", text).strip("_") or "unknown"


def chapter_dir_name(label):
    if re.fullmatch(r"\d+(\.\d+)?", label):
        whole, _, frac = label.partition(".")
        return f"ch{int(whole):04d}" + (f".{frac}" if frac else "")
    return "x-" + slug(label).lower()[:60]


def chapter_dir(series, label):
    return PRIVATE / slug(series) / chapter_dir_name(label)


def chapter_file(series, label):
    return chapter_dir(series, label) / "chapter.jsonl"


def cbz_path(h):
    return LIB / h / "source.cbz"


def read_header(path):
    try:
        with open(path) as f:
            return json.loads(f.readline())
    except (OSError, ValueError):
        return None


def _without_build(tools):
    """Tool block minus the macOS build number: a routine OS update must not trigger a full re-run."""
    t = dict(tools or {})
    if isinstance(t.get("ocr"), str):
        t["ocr"] = re.sub(r"\s*macOS-build-\S+", "", t["ocr"])
    return t


def up_to_date(path, h, tools):
    head = read_header(path)
    return bool(head) and head.get("cbz_sha256") == h and _without_build(head.get("tools")) == _without_build(tools)


# ------------------------------------------------------------------ chapter shape
def detect_format(sizes, continuity=None):
    """'webtoon' for scroll-slice chapters, else 'manga'.

    sizes = [(w, h), ...] per member; continuity = share of sampled adjacent pairs whose touching edge rows are
    textured and nearly identical (a scroll cut through continuous art). Manga pages are separate pages, so their
    edges rarely match; webtoon slices are cut from one long image. Measured on this library: JJK and Bleach chapters
    scored at most 0.11, Omniscient Reader chapters at least 0.11 (median 0.30), and webtoon chapters are long."""
    n = len(sizes)
    if n == 0:
        return "manga"
    if continuity is not None:
        if continuity >= 0.2:
            return "webtoon"
        if continuity >= 0.08 and n >= 40:
            # weak evidence needs scroll-slice geometry too: manga pages share one height (spreads change only the width)
            hs = [s[1] for s in sizes]
            top = max(hs)
            buckets = len({round(h / (0.03 * top)) for h in hs})
            return "webtoon" if buckets >= 3 else "manga"
        return "manga"
    hs = [s[1] for s in sizes]
    modal = collections.Counter(hs).most_common(1)[0][1] / n
    short = sum(1 for w, h in sizes if h < 0.4 * w)
    if (len(set(hs)) >= 4 and modal < 0.6) or (short >= 3 and len(set(hs)) >= 3):
        return "webtoon"
    return "manga"


def _edge_rows(im, top, n=3):
    import numpy as np
    a = np.asarray(im.convert("L").resize((400, max(n * 2, int(im.size[1] * 400 / im.size[0])))), dtype=np.float32)
    return a[:n].mean(axis=0) if top else a[-n:].mean(axis=0)


def continuity_score(h, cbz=None, maxpairs=30):
    import numpy as np
    from PIL import Image
    import random
    with zipfile.ZipFile(cbz or cbz_path(h)) as z:
        names = sorted(n for n in z.namelist() if MEMBER_RE.match(n))
        idx = list(range(len(names) - 1))
        random.Random(0).shuffle(idx)
        idx = sorted(idx[:maxpairs])
        good = 0
        for i in idx:
            a = Image.open(io.BytesIO(z.read(names[i])))
            b = Image.open(io.BytesIO(z.read(names[i + 1])))
            ra, rb = _edge_rows(a, False), _edge_rows(b, True)
            if ra.std() > 12 and rb.std() > 12 and np.abs(ra - rb).mean() < 10:
                good += 1
        return good / max(1, len(idx))


def member_sizes(h, cbz=None):
    from PIL import Image
    with zipfile.ZipFile(cbz or cbz_path(h)) as z:
        names = sorted(n for n in z.namelist() if MEMBER_RE.match(n))
        return [Image.open(io.BytesIO(z.read(n))).size for n in names]


# ------------------------------------------------------------------ versions and tools
def mac_build():
    try:
        return subprocess.run(["sw_vers", "-buildVersion"], capture_output=True, text=True).stdout.strip() or "unknown"
    except OSError:
        return "unknown"


def detector_revision():
    try:
        return json.loads((HERE / "models.json").read_text())["detector"]["revision"][:12]
    except (OSError, ValueError, KeyError):
        pass
    ref = Path.home() / ".cache/huggingface/hub/models--ogkalu--comic-text-and-bubble-detector/refs/main"
    try:
        return ref.read_text().strip()[:12]
    except OSError:
        return "unknown"


PDFBIN = HOME / "bin" / "pdfpages"


def ensure_pdfbin():
    src = HERE / "pdfpages.swift"
    if PDFBIN.exists() and PDFBIN.stat().st_mtime >= src.stat().st_mtime:
        return
    PDFBIN.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["swiftc", "-O", str(src), "-o", str(PDFBIN)], check=True)


def ensure_bin():
    src = HERE / "avision.swift"
    if BIN.exists() and BIN.stat().st_mtime >= src.stat().st_mtime:
        return
    BIN.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["swiftc", "-O", str(src), "-o", str(BIN)], check=True)


def _helper_hash():
    return hashlib.sha256((HERE / "avision.swift").read_bytes()).hexdigest()[:12]


def _ocr_cache():
    (PRIVATE / "cache").mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(PRIVATE / "cache" / "ocr.sqlite", timeout=60)
    con.execute("create table if not exists ocr(key text primary key, result text)")
    return con


def ocr_images(paths, batch=40, use_cache=True, langs=None):
    """Apple Vision on image files via the compiled helper (batches of 40; a warm persistent process measured the same speed).

    Results are cached by sha256 of the image bytes plus the helper source hash, so an interrupted chapter resumes from its finished
    strips and a re-run after a pipeline change does not read the same pixels twice. Returns {file name: result dict}."""
    ensure_bin()
    res, todo, keys = {}, [], {}
    con = _ocr_cache() if use_cache else None
    hh = _helper_hash() + ("" if not langs or langs == ["en-US"] else ":" + ",".join(langs))
    lang_args = ["--lang", ",".join(langs)] if langs and langs != ["en-US"] else []
    for p in map(str, paths):
        key = hashlib.sha256(Path(p).read_bytes()).hexdigest() + ":" + hh
        keys[p] = key
        row = con.execute("select result from ocr where key=?", (key,)).fetchone() if con else None
        if row:
            d = json.loads(row[0])
            d["file"] = Path(p).name
            res[Path(p).name] = d
        else:
            todo.append(p)
    def helper(files, timeout):
        """One helper call with a timeout: a hung Vision call (seen once, after an idle stretch) must not stall the watcher forever."""
        try:
            return subprocess.run([str(BIN)] + lang_args + files, capture_output=True, text=True, check=True, timeout=timeout).stdout
        except subprocess.TimeoutExpired:
            return None
        except subprocess.CalledProcessError as e:           # killed (memory pressure) or crashed on one image: caller retries singly
            return "FAILED:" + (f"signal {-e.returncode}" if e.returncode < 0 else f"exit {e.returncode}")

    for i in range(0, len(todo), batch):
        files = todo[i:i + batch]
        out = helper(files, 300 + 10 * len(files))
        if out is None or out.startswith("FAILED:"):         # retry image by image so one bad page costs one page, not the batch
            lines = []
            for f in files:
                o = helper([f], 120)
                if o is not None and not o.startswith("FAILED:") and o.strip():
                    lines.append(o.strip().splitlines()[0])
                else:
                    why = "ocr_timeout" if o is None else "ocr_failed " + (o[7:] if o else "empty output")
                    lines.append(json.dumps({"file": Path(f).name, "obs": [], "error": why}))
        else:
            lines = out.splitlines()
        for p, line in zip(files, lines):
            d = json.loads(line)
            res[d["file"]] = d
            if con and "error" not in d:
                con.execute("insert or replace into ocr values(?,?)", (keys[p], line))
        if con:
            con.commit()
    if con:
        con.close()
    return res


def ocr_failures(vis):
    """Names of images whose Vision call failed outright (timeout, crash, kill): an empty page is not the same as an unread page."""
    return sorted(n for n, d in vis.items() if d.get("error"))


def ocr_failure_message(vis):
    bad = ocr_failures(vis)
    if not bad:
        return None
    kinds = sorted({vis[n]["error"] for n in bad})
    return f"ocr_failed on {len(bad)} of {len(vis)} images ({'; '.join(kinds)[:120]})"


# ------------------------------------------------------------------ text quality: lexicon and calibrated risk
_LEX = {}
WORD_RE = re.compile(r"[A-Za-z][A-Za-z']*")


def lexicon():
    if "w" not in _LEX:
        words = set()
        for f in ("/usr/share/dict/web2", "/usr/share/dict/propernames"):
            try:
                words.update(w.strip().lower() for w in open(f, errors="ignore"))
            except OSError:
                pass
        words.update(("senpai", "sensei", "okay", "ok", "yeah", "hey", "huh", "gonna", "wanna", "gotta", "ya", "uh", "um", "hmm",
                      "ugh", "ahh", "aah", "oh", "wow", "damn", "kid", "kids", "ain", "nope", "yep", "dunno", "kinda", "sorta"))
        _LEX["w"] = words
    return _LEX["w"]


def series_vocab(series, min_count=5):
    """Tokens seen at least min_count times in this series' indexed text (names, invented terms), cached per process."""
    key = ("v", series)
    if key not in _LEX:
        counts = collections.Counter()
        try:
            con = db()
            for (t,) in con.execute("select text from items_fts where lower(series)=lower(?)", (series,)):
                counts.update(w.lower().strip("'") for w in WORD_RE.findall(t))
            con.close()
        except sqlite3.Error:
            pass
        _LEX[key] = {w for w, c in counts.items() if c >= min_count}
    return _LEX[key]


def _known(word, vocab):
    w = word.lower().strip("'")
    if len(w) <= 2 or w in vocab or w in lexicon():
        return True
    for suf in ("'s", "s", "ed", "ing", "'ll", "'re", "'ve", "'d", "n't", "ly", "es"):
        if w.endswith(suf) and (w[: -len(suf)] in lexicon() or w[: -len(suf)] in vocab):
            return True
    return False


_NO_APOS = {"youll", "didnt", "dont", "cant", "wont", "isnt", "arent", "wasnt", "couldnt", "wouldnt", "shouldnt", "doesnt", "thats",
            "theyre", "youre", "weve", "ive", "hes", "shes", "theyll", "wouldve", "im", "lets", "whats", "heres", "theres", "havent"}


def item_risk(text, line_confs, vocab=frozenset()):
    """Probability-like score in [0, 1] that an OCR item contains an error; sorts bad lines first.

    Apple Vision's own confidence is nearly two-valued (1.0 or 0.5 and below), so it is combined, noisy-or style, with the share of
    words that are neither English nor frequent in the series, stray symbols, letter-digit mixes and tiny fragments."""
    parts = {}
    conf = min(line_confs) if line_confs else 1.0
    parts["conf"] = max(0.0, 1.0 - conf)
    words = [w for w in WORD_RE.findall(text) if len(w) >= 3 and not w.endswith("-")]
    parts["unknown_words"] = (sum(1 for w in words if not _known(w, vocab)) / len(words)) if words else 0.0
    chars = [c for c in text if not c.isspace()]
    bad = [c for c in chars if not (c.isalnum() and c.isascii() or c in ".,'!?\"-:;()&…~*%/+")]
    parts["stray_symbols"] = min(1.0, 3.0 * len(bad) / max(1, len(chars)))
    toks = text.split()
    mixed = sum(1 for t in toks if re.search(r"[A-Za-z]", t) and re.search(r"\d", t))
    parts["letter_digit_mix"] = mixed / max(1, len(toks))
    parts["dropped_apostrophe"] = (sum(1 for w in WORD_RE.findall(text) if w.lower() in _NO_APOS) / max(1, len(toks)))
    letters = sum(c.isalpha() for c in text)
    parts["fragment"] = 1.0 if (0 < letters <= 2 and not re.search(r"\d", text)) else 0.0
    w = {"conf": 1.0, "unknown_words": 0.6, "stray_symbols": 0.8, "letter_digit_mix": 0.5, "fragment": 0.3, "dropped_apostrophe": 0.9}
    keep = 1.0
    for k, v in parts.items():
        keep *= 1.0 - w[k] * v
    return round(1.0 - keep, 3), parts


def box_area(b):
    return max(0.0, b[2] - b[0]) * max(0.0, b[3] - b[1])


def box_inter(a, b):
    return box_area([max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3])])


def box_iou(a, b):
    i = box_inter(a, b)
    return i / max(1.0, box_area(a) + box_area(b) - i)


# ------------------------------------------------------------------ index (one FTS5 table for everything)
FTS_COLS = ("text", "cbz_sha256", "series", "chapter", "loc", "loc_kind", "spread_half", "group_id",
            "reading_order", "kind", "confidence", "bbox", "flags", "path")


def db():
    PRIVATE.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(PRIVATE / "index.sqlite")
    con.execute("create table if not exists meta(key text primary key, value text)")
    con.execute("create table if not exists chapters(cbz_sha256 text primary key, series text, chapter text, format text, "
                "tool_version text, pages int, items int, panels int, indexed_utc text, path text)")
    con.execute("create virtual table if not exists items_fts using fts5(text, cbz_sha256 unindexed, series unindexed, "
                "chapter unindexed, loc unindexed, loc_kind unindexed, spread_half unindexed, group_id unindexed, "
                "reading_order unindexed, kind unindexed, confidence unindexed, bbox unindexed, flags unindexed, "
                "path unindexed, tokenize='unicode61 remove_diacritics 2')")
    return con


def index_records(con, header, records, rel_path):
    h = header["cbz_sha256"]
    con.execute("delete from items_fts where cbz_sha256=?", (h,))
    n = panels = 0
    for r in records:
        if r.get("record") not in ("item", "panel") or not (r.get("text") or "").strip():
            continue
        loc = r.get("strip") if r.get("format") == "webtoon" else r.get("page")
        con.execute("insert into items_fts values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (r["text"], h, r["series"], r["chapter"], loc, "strip" if r.get("format") == "webtoon" else "page",
                     r.get("spread_half"), r.get("group_id") or r.get("panel_id"), r.get("reading_order", 0), r["kind"],
                     r.get("confidence"), json.dumps(r["bbox"]), ",".join(r.get("flags", [])), str(rel_path)))
        n += 1
        panels += r.get("record") == "panel"
    con.execute("insert or replace into chapters values(?,?,?,?,?,?,?,?,?,?)",
                (h, header["series"], header["chapter"], header.get("format", "manga"), header["tools"]["tool"],
                 header.get("page_count") or header.get("slice_count"), n, panels, header["created_utc"], str(rel_path)))


def load_chapter(path):
    rows = [json.loads(line) for line in open(path)]
    return rows[0], rows[1:]


def reindex_all():
    """Rebuild the whole index from chapter.jsonl files."""
    if (PRIVATE / "index.sqlite").exists():
        (PRIVATE / "index.sqlite").unlink()
    con = db()
    n = 0
    with con:
        for f in sorted(PRIVATE.glob("*/*/chapter.jsonl")):
            head, recs = load_chapter(f)
            index_records(con, head, recs, f.relative_to(PRIVATE).parent)
            n += 1
    con.close()
    return n


def chapter_matches(chapter, spec):
    if spec is None:
        return True
    if "-" in spec and re.fullmatch(r"[\d.]+-[\d.]+", spec):
        lo, hi = (float(x) for x in spec.split("-"))
        try:
            return lo <= float(chapter) <= hi
        except (TypeError, ValueError):
            return False
    return str(chapter) == spec


def norm(s):
    """Loose-match key: lowercase, no diacritics, letters and digits only (joins line-break hyphens and spaces)."""
    import unicodedata
    s = unicodedata.normalize("NFKD", (s or "").lower())
    return re.sub(r"[^a-z0-9]+", "", "".join(c for c in s if not unicodedata.combining(c)))


def search(query, series=None, chapter=None, kind=None, limit=20, loose=False):
    """Literal phrase search. loose=True matches the normalised text, so 'zanpakuto' finds 'ZANPAKU- TO' (line-break hyphens)."""
    con = db()
    cols = "series, chapter, loc, loc_kind, spread_half, group_id, reading_order, kind, confidence, bbox, path"
    if loose:
        con.create_function("norm", 1, norm)
        sql = f"select {cols} from items_fts where norm(text) like ?"
        args = ["%" + norm(query) + "%"]
    else:
        sql = f"select {cols} from items_fts where items_fts match ?"
        args = ['"' + query.replace('"', '""') + '"']
    if series:
        sql += " and lower(series)=lower(?)"
        args.append(series)
    if kind:
        sql += " and kind like ?"
        args.append(kind.replace("*", "%"))
    sql += " order by series, cast(chapter as real), cast(loc as integer), cast(reading_order as integer)"
    out = []
    for row in con.execute(sql, args):
        if chapter_matches(row[1], chapter):
            out.append(row)
            if len(out) >= limit:
                break
    con.close()
    return out


# ------------------------------------------------------------------ catalog and index page
def build_catalog():
    series = {}
    for f in sorted(PRIVATE.glob("*/*/chapter.jsonl")):
        h = read_header(f)
        if not h:
            continue
        s = series.setdefault(h["series"], {"series": h["series"], "slug": f.parent.parent.name, "chapters": [], "pages": 0,
                                            "items": 0, "panels": 0, "empty_pages": 0, "flags": collections.Counter(),
                                            "formats": set(), "tools": set(), "last_run": ""})
        st = h.get("stats", {})
        s["chapters"].append({"chapter": h["chapter"], "dir": f.parent.name, "hash": h["cbz_sha256"], "format": h.get("format", "manga"),
                              "pages": h.get("page_count") or h.get("slice_count"), "items": st.get("items", 0),
                              "panels": st.get("panels", 0)})
        s["pages"] += h.get("page_count") or h.get("slice_count") or 0
        s["items"] += st.get("items", 0)
        s["panels"] += st.get("panels", 0)
        s["empty_pages"] += st.get("empty_pages", 0)
        for k, v in st.get("flags", {}).items():
            s["flags"][k] += v
        s["formats"].add(h.get("format", "manga"))
        s["tools"].add(h["tools"]["tool"])
        s["last_run"] = max(s["last_run"], h["created_utc"])
    out = {"generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "private_root": str(PRIVATE.relative_to(REPO))
           if str(PRIVATE).startswith(str(REPO)) else str(PRIVATE), "series": []}
    for name in sorted(series):
        s = series[name]
        nums = []
        for c in s["chapters"]:
            try:
                nums.append(float(c["chapter"]))
            except ValueError:
                pass
        s["chapters"].sort(key=lambda c: (float(c["chapter"]) if re.fullmatch(r"[\d.]+", c["chapter"]) else 1e9, c["chapter"]))
        out["series"].append({
            "series": name, "slug": s["slug"], "formats": sorted(s["formats"]), "chapters_done": len(s["chapters"]),
            "chapter_range": [min(nums), max(nums)] if nums else None, "pages": s["pages"], "items": s["items"],
            "panels": s["panels"], "empty_pages": s["empty_pages"],
            "flag_rates_per_item": {k: round(v / max(1, s["items"]), 3) for k, v in sorted(s["flags"].items())},
            "tool_versions": sorted(s["tools"]), "last_run": s["last_run"], "chapters": s["chapters"]})
    out["totals"] = {"series": len(out["series"]), "chapters": sum(x["chapters_done"] for x in out["series"]),
                     "pages": sum(x["pages"] for x in out["series"]), "items": sum(x["items"] for x in out["series"]),
                     "panels": sum(x["panels"] for x in out["series"])}
    return out


def write_catalog():
    cat = build_catalog()
    PRIVATE.mkdir(parents=True, exist_ok=True)
    tmp = PRIVATE / "CATALOG.json.tmp"
    tmp.write_text(json.dumps(cat, indent=1))
    tmp.replace(PRIVATE / "CATALOG.json")
    lines = ["# Manga text index", "", f"Generated {cat['generated_utc']} by `scripts/manga_text/manga_text.py catalog`.",
             "Private; do not commit. Locators: `<series>/<chapter dir>/chapter.jsonl`, panels in `<chapter dir>/panels/`.", "",
             f"Totals: {cat['totals']['series']} series, {cat['totals']['chapters']} chapters, {cat['totals']['pages']} pages/slices, "
             f"{cat['totals']['items']} items, {cat['totals']['panels']} panels.", "",
             "| Series | Format | Chapters done | Range | Pages | Items | Panels | Empty pages | Low-confidence rate | Outside-box rate | Tool | Last run |",
             "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for s in cat["series"]:
        fr = s["flag_rates_per_item"]
        rng = f"{s['chapter_range'][0]:g}-{s['chapter_range'][1]:g}" if s["chapter_range"] else "n/a"
        lines.append(f"| {s['series']} | {'/'.join(s['formats'])} | {s['chapters_done']} | {rng} | {s['pages']} | {s['items']} | "
                     f"{s['panels']} | {s['empty_pages']} | {fr.get('low_confidence', 0):.1%} | {fr.get('outside_text_box', 0):.1%} | "
                     f"{', '.join(s['tool_versions'])} | {s['last_run']} |")
    (PRIVATE / "INDEX.md").write_text("\n".join(lines) + "\n")
    return cat


# ------------------------------------------------------------------ doctor
def doctor():
    ok = True

    def line(name, good, detail=""):
        nonlocal ok
        ok = ok and good
        print(f"{'ok  ' if good else 'FAIL'} {name}{': ' + detail if detail else ''}")

    line("macOS", platform.system() == "Darwin", f"{platform.platform()} build {mac_build()}")
    line("python", sys.version_info >= (3, 11), sys.version.split()[0])
    for mod in ("PIL", "numpy", "cv2", "torch", "transformers"):
        try:
            m = __import__(mod)
            line(f"module {mod}", True, getattr(m, "__version__", ""))
        except Exception as e:  # noqa: BLE001
            line(f"module {mod}", False, str(e)[:80])
    try:
        ensure_pdfbin()
        line("PDF page helper (PDFKit) compiled", PDFBIN.exists(), str(PDFBIN))
    except Exception as e:  # noqa: BLE001
        line("PDF page helper (PDFKit) compiled", False, str(e)[:100])
    sw = subprocess.run(["which", "swiftc"], capture_output=True, text=True).stdout.strip()
    line("swiftc (Xcode command line tools)", bool(sw), sw)
    try:
        ensure_bin()
        from PIL import Image, ImageDraw, ImageFont
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "t.png"
            im = Image.new("RGB", (500, 120), "white")
            ImageDraw.Draw(im).text((20, 30), "DOCTOR TEST 42", fill="black", font=ImageFont.load_default(size=40))
            im.save(p)
            r = ocr_images([p])["t.png"]
            txt = " ".join(o["text"] for o in r.get("obs", []))
            line("Apple Vision text recognition", "DOCTOR" in txt.upper(), f"read {txt!r}")
    except Exception as e:  # noqa: BLE001
        line("Apple Vision text recognition", False, str(e)[:100])
    try:
        import models
        mok, mmsg = models.verify()
        line("detector files match pinned checksums", mok, "; ".join(mmsg))
    except Exception as e:  # noqa: BLE001
        line("detector files match pinned checksums", False, str(e)[:100])
    try:
        con = sqlite3.connect(f"file:{CAT}?mode=ro", uri=True)
        n = sum(1 for _ in cat_rows(con))
        con.close()
        line("catalogue readable (read-only)", True, f"{n} cbz assets")
    except Exception as e:  # noqa: BLE001
        line("catalogue readable (read-only)", False, str(e)[:100])
    line("library folder", LIB.exists(), str(LIB))
    try:
        PRIVATE.mkdir(parents=True, exist_ok=True)
        t = PRIVATE / ".doctor"
        t.write_text("x")
        t.unlink()
        line("private output writable", True, str(PRIVATE))
    except OSError as e:
        line("private output writable", False, str(e))
    try:
        c = sqlite3.connect(":memory:")
        c.execute("create virtual table t using fts5(a)")
        line("sqlite FTS5", True, sqlite3.sqlite_version)
    except Exception as e:  # noqa: BLE001
        line("sqlite FTS5", False, str(e))
    ig = subprocess.run(["git", "-C", str(REPO), "check-ignore", "-q", str(PRIVATE / "x")], capture_output=True)
    line("private folder is git-ignored", ig.returncode == 0)
    print("doctor:", "all checks passed" if ok else "some checks failed")
    return 0 if ok else 1
