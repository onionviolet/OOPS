"""Token-light access to the index for other agents: summary, query, slice; plus export and verify.

Nothing here returns page images or raw OCR dumps. Counts and locators come first; text only through `slice`, bounded by --max-chars,
for one page or strip at a time."""
import collections
import hashlib
import json
import zipfile
from pathlib import Path

import common as C


def _chapters(series=None, chapter=None):
    for f in sorted(C.PRIVATE.glob("*/*/chapter.jsonl")):
        head = C.read_header(f)
        if not head:
            continue
        if series and head["series"].lower() != series.lower():
            continue
        if not C.chapter_matches(head["chapter"], chapter):
            continue
        yield f, head


def summary(series=None, chapter=None, top=5):
    """Counts only (kinds, flags, risk, panel types) plus locators of the riskiest items."""
    out = {"series": {}}
    for f, head in _chapters(series, chapter):
        s = out["series"].setdefault(head["series"], {"chapters": 0, "pages_or_strips": 0, "items": 0, "kinds": collections.Counter(),
                                                      "flags": collections.Counter(), "panel_types": collections.Counter(),
                                                      "high_risk": 0, "riskiest": [], "formats": set(), "tools": set()})
        _, recs = C.load_chapter(f)
        s["chapters"] += 1
        s["pages_or_strips"] += head.get("page_count") or head.get("slice_count") or 0
        s["formats"].add(head.get("format", "manga"))
        s["tools"].add(head["tools"]["tool"])
        for r in recs:
            if r.get("record") == "item":
                s["items"] += 1
                s["kinds"][r["kind"]] += 1
                s["flags"].update(r.get("flags", []))
                if r.get("risk") is not None:
                    s["high_risk"] += "high_risk" in r.get("flags", [])
                    s["riskiest"].append((r["risk"], head["chapter"], r.get("strip", r.get("page")), r.get("group_id")))
            elif r.get("record") == "panel":
                s["panel_types"][r["type"]] += 1
                s["flags"].update(r.get("flags", []))
    for s in out["series"].values():
        s["riskiest"] = [{"risk": a, "chapter": b, "loc": c, "id": d} for a, b, c, d in sorted(s["riskiest"], reverse=True)[:top]]
        for k in ("kinds", "flags", "panel_types"):
            s[k] = dict(s[k])
        s["formats"], s["tools"] = sorted(s["formats"]), sorted(s["tools"])
    return out


def query(term, series=None, chapter=None, kind=None, limit=20, snippet=0):
    """Counts per chapter plus the first `limit` locators. Text only if snippet > 0 (that many characters per hit)."""
    rows = C.search(term, series, chapter, kind, limit=10 ** 6, loose=True)
    per = collections.Counter(r[1] for r in rows)
    hits = []
    for r in rows[:limit]:
        h = {"series": r[0], "chapter": r[1], "loc": f"{r[3]} {r[2]}", "box": json.loads(r[9]), "kind": r[7], "id": r[5]}
        if snippet:
            h["snippet"] = _slice_text(r[0], r[1], r[2], r[3], r[5], snippet)
        hits.append(h)
    return {"term": term, "total": len(rows), "chapters": len(per), "per_chapter": dict(sorted(per.items(), key=lambda x: _num(x[0]))[:40]),
            "hits": hits}


def _num(ch):
    try:
        return float(ch)
    except ValueError:
        return 1e9


def _slice_text(series, chapter, loc, loc_kind, group_id, n):
    for f, head in _chapters(series, chapter):
        _, recs = C.load_chapter(f)
        for r in recs:
            if r.get("record") in ("item", "panel") and (r.get("group_id") or r.get("panel_id")) == group_id and \
                    str(r.get("strip", r.get("page"))) == str(loc):
                return r["text"][:n]
    return ""


def slice_page(series, chapter, loc, max_chars=1500):
    """Bounded text of one page (manga) or strip (webtoon) in reading order, with kind tags. One chapter, one location."""
    for f, head in _chapters(series, chapter):
        _, recs = C.load_chapter(f)
        lines, used, truncated = [], 0, False
        for r in recs:
            if r.get("record") in ("item", "panel") and str(r.get("strip", r.get("page"))) == str(loc):
                line = f"[{r['kind']}{'/p' + str(r['panel']) if r.get('panel') else ''}] {r['text']}"
                if used + len(line) > max_chars:
                    truncated = True
                    break
                lines.append(line)
                used += len(line)
        return {"series": head["series"], "chapter": head["chapter"], "loc": loc, "chars": used, "truncated": truncated, "text": lines}
    return {"error": "no such chapter"}


def export_markdown(series, chapter=None):
    """chapter.md next to chapter.jsonl: text only, page by page, in reading order (private; not for committing)."""
    done = []
    for f, head in _chapters(series, chapter):
        _, recs = C.load_chapter(f)
        webtoon = head.get("format") == "webtoon"
        lines = [f"# {head['series']} / {head['chapter']}", "", f"CBZ `{head['cbz_sha256'][:12]}`, tools {head['tools']['tool']}, {head.get('format', 'manga')}.", ""]
        cur = None
        for r in recs:
            if r.get("record") in ("item", "panel"):
                loc = r.get("strip") if webtoon else r.get("page")
                if loc != cur:
                    lines += ["", f"## {'Strip' if webtoon else 'Page'} {loc}", ""]
                    cur = loc
                tag = r["kind"] + (f" p{r['panel']}" if r.get("panel") else "")
                risk = f" (risk {r['risk']})" if r.get("risk") and "high_risk" in r.get("flags", []) else ""
                if r["text"].strip():
                    lines.append(f"- **{tag}**{risk}: {r['text']}")
                if r.get("key_values"):
                    lines += [f"  - {kv['key']}: {kv['value']}" for kv in r["key_values"]]
        (f.parent / "chapter.md").write_text("\n".join(lines) + "\n")
        done.append(str(f.parent.relative_to(C.PRIVATE)))
    return done


def verify(series, chapter=None):
    """Re-check page hashes: the CBZ on disk against the catalogue and against the hashes recorded in the chapter file."""
    import sqlite3
    try:
        con = sqlite3.connect(f"file:{C.CAT}?mode=ro", uri=True)
        con.execute("select 1 from assets limit 1")
    except sqlite3.Error:
        con = None                                   # no catalogue: only book files can be verified
    problems, checked = [], 0
    for f, head in _chapters(series, chapter):
        h = head["cbz_sha256"]
        if head.get("format") == "book":
            src = Path(head.get("source_path", ""))
            if not src.exists():
                problems.append((head["chapter"], f"book file missing: {src.name}"))
            elif __import__("books").sha256_file(src) != head["file_sha256"]:
                problems.append((head["chapter"], f"book file changed since extraction: {src.name}"))
            checked += 1
            continue
        row = con.execute("select metadata from assets where hash=?", (h,)).fetchone() if con else None
        if not row:
            problems.append((head["chapter"], "not in catalogue"))
            continue
        pm = json.loads(row[0])["page_members"]
        cbz = C.cbz_path(h)
        if not cbz.exists():
            problems.append((head["chapter"], "cbz missing on disk"))
            continue
        with zipfile.ZipFile(cbz) as z:
            for p in pm:
                try:
                    actual = hashlib.sha256(z.read(p["member"])).hexdigest()
                except KeyError:
                    problems.append((head["chapter"], f"member {p['member']} missing"))
                    continue
                if actual != p["sha256"]:
                    problems.append((head["chapter"], f"{p['member']} differs from catalogue"))
        _, recs = C.load_chapter(f)
        rec_hashes = [r["page_sha256"] for r in recs if r.get("record") == "page"]
        if rec_hashes and rec_hashes != [p["sha256"] for p in pm]:
            problems.append((head["chapter"], "chapter file page hashes differ from catalogue"))
        if head.get("format") == "webtoon" and [s["sha256"] for s in head["slices"]] != [p["sha256"] for p in pm]:
            problems.append((head["chapter"], "chapter file slice hashes differ from catalogue"))
        checked += 1
    if con:
        con.close()
    return {"chapters_checked": checked, "problems": problems}
