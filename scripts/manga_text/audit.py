#!/usr/bin/env python3
"""Audit helpers over the manga_text index (pilots; findings are proposals, not canon).

    audit.py terms  --file terms.txt   [--series S]        first appearance and spread of literal terms
    audit.py claims --file claims.json [--series S]        claim -> term hits, locators, short contexts for a reader to judge
    audit.py kv     --series S [--types a,b]              panel key-value rows as a table (webtoon panels)
    audit.py numbers --series S --pattern REGEX           numbers next to a pattern, grouped by chapter

claims.json: [{"id": "J1", "claim": "paraphrase", "ledger": "docs/worlds/.../SOURCE_LEDGER.md row", "all": ["term"], "any": ["term"]}]
Outputs go to private/audits/ (git-ignored). Contexts are truncated; do not paste them into committed docs."""
import argparse
import json
import re
import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402

AUD = C.PRIVATE / "audits"


def num(ch):
    try:
        return float(ch)
    except (TypeError, ValueError):
        return 1e9


def hits(term, series=None, limit=100000, loose=True):
    """All items containing the term. Loose by default: line-break hyphens and accents are ignored."""
    con = C.db()
    cols = "series, chapter, loc, loc_kind, group_id, reading_order, kind, bbox, cbz_sha256, text"
    if loose:
        con.create_function("norm", 1, C.norm)
        sql, args = f"select {cols} from items_fts where norm(text) like ?", ["%" + C.norm(term) + "%"]
    else:
        sql, args = f"select {cols} from items_fts where items_fts match ?", ['"' + term.replace('"', '""') + '"']
    if series:
        sql += " and lower(series)=lower(?)"
        args.append(series)
    rows = con.execute(sql, args).fetchall()
    con.close()
    rows.sort(key=lambda r: (r[0], num(r[1]), num(r[2]), num(r[5])))
    return rows[:limit]


def coverage(series):
    cat = C.build_catalog()
    for s in cat["series"]:
        if s["series"].lower() == (series or "").lower():
            return s["chapter_range"], s["chapters_done"]
    return None, 0


def context(row, width=120):
    """Neighbouring text on the same page/strip (reading order +-1), truncated."""
    con = C.db()
    cur = con.execute("select reading_order, text from items_fts where cbz_sha256=? and loc=? order by cast(reading_order as integer)",
                      (row[8], row[2])).fetchall()
    con.close()
    out = []
    for ro, t in cur:
        if abs(int(ro) - int(row[5])) <= 1:
            out.append(t[:width])
    return out


def cmd_terms(a):
    terms = [t.strip() for t in Path(a.file).read_text().splitlines() if t.strip() and not t.startswith("#")]
    rng, done = coverage(a.series)
    rows = []
    for t in terms:
        h = hits(t, a.series)
        chs = sorted({r[1] for r in h}, key=num)
        first = h[0] if h else None
        rows.append({"term": t, "hits": len(h), "chapters_with_hits": len(chs),
                     "first": f"ch {first[1]} {first[3]} {first[2]} {first[4]} ({first[6]})" if first else None,
                     "last_chapter": chs[-1] if chs else None})
    AUD.mkdir(parents=True, exist_ok=True)
    out = AUD / f"terms_{C.slug(a.series or 'all')}.json"
    out.write_text(json.dumps({"series": a.series, "coverage": {"range": rng, "chapters_done": done}, "terms": rows}, indent=1))
    print(f"coverage {rng} ({done} chapters)")
    for r in rows:
        print(f"{r['term'][:34]:34s} hits={r['hits']:4d} chapters={r['chapters_with_hits']:3d} first={r['first']}")


def cmd_claims(a):
    claims = json.loads(Path(a.file).read_text())
    rng, done = coverage(a.series)
    AUD.mkdir(parents=True, exist_ok=True)
    lines = [f"# Claim audit pilot, {a.series}", f"Coverage: chapters {rng}, {done} chapters done. Private working file.", ""]
    for c in claims:
        lines.append(f"## {c['id']}: {c['claim']}")
        lines.append(f"Ledger: {c.get('ledger', '')}")
        for kind in ("all", "any"):
            for t in c.get(kind, []):
                h = hits(t, a.series)
                chs = sorted({r[1] for r in h}, key=num)
                lines.append(f"- [{kind}] `{t}`: {len(h)} hits in {len(chs)} chapters; first " +
                             (f"ch {h[0][1]} {h[0][3]} {h[0][2]} {h[0][4]}" if h else "none"))
                for r in h[: a.contexts]:
                    lines.append(f"    - ch {r[1]} {r[3]} {r[2]} {r[4]}: " + " | ".join(context(r)))
        lines.append("")
    out = AUD / f"claims_{C.slug(a.series)}.md"
    out.write_text("\n".join(lines))
    print(out)


def cmd_kv(a):
    types = set(a.types.split(",")) if a.types else None
    rows = []
    for f in sorted(C.PRIVATE.glob(f"{C.slug(a.series)}/*/chapter.jsonl")):
        head, recs = C.load_chapter(f)
        for r in recs:
            if r.get("record") == "panel" and r.get("key_values") and (not types or r["type"] in types):
                rows.append({"chapter": r["chapter"], "strip": r["strip"], "canvas_y": r["canvas_y"], "type": r["type"],
                             "confidence": r["confidence"], "rows": r["key_values"]})
    AUD.mkdir(parents=True, exist_ok=True)
    (AUD / f"kv_{C.slug(a.series)}.json").write_text(json.dumps(rows, indent=1))
    keys = {}
    for r in rows:
        for kv in r["rows"]:
            keys.setdefault(kv["key"].lower(), []).append((r["chapter"], kv["value"]))
    print(f"{len(rows)} panels with key-value rows; distinct keys: {len(keys)}")
    for k, v in sorted(keys.items(), key=lambda x: -len(x[1]))[:25]:
        print(f"{k[:28]:28s} n={len(v):3d} e.g. " + "; ".join(f"ch{c}: {val[:22]}" for c, val in v[:3]))


def cmd_numbers(a):
    pat = re.compile(a.pattern, re.I)
    out = {}
    for f in sorted(C.PRIVATE.glob(f"{C.slug(a.series)}/*/chapter.jsonl")):
        head, recs = C.load_chapter(f)
        for r in recs:
            if r.get("record") in ("item", "panel") and pat.search(r.get("text", "")):
                for m in pat.finditer(r["text"]):
                    out.setdefault(r["chapter"], []).append((r.get("strip", r.get("page")), m.group(0)[:60]))
    AUD.mkdir(parents=True, exist_ok=True)
    (AUD / f"numbers_{C.slug(a.series)}.json").write_text(json.dumps(out, indent=1))
    for ch in sorted(out, key=num):
        print(f"ch {ch}: " + "; ".join(f"{loc}:{m}" for loc, m in out[ch][:6]))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    t = sub.add_parser("terms")
    t.add_argument("--file", required=True)
    t.add_argument("--series")
    t.set_defaults(fn=cmd_terms)
    c = sub.add_parser("claims")
    c.add_argument("--file", required=True)
    c.add_argument("--series", required=True)
    c.add_argument("--contexts", type=int, default=3)
    c.set_defaults(fn=cmd_claims)
    k = sub.add_parser("kv")
    k.add_argument("--series", required=True)
    k.add_argument("--types")
    k.set_defaults(fn=cmd_kv)
    n = sub.add_parser("numbers")
    n.add_argument("--series", required=True)
    n.add_argument("--pattern", required=True)
    n.set_defaults(fn=cmd_numbers)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
