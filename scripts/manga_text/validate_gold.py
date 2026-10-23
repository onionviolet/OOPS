#!/usr/bin/env python3
"""Stage 1 validation. Reads private/ outputs and the hand-checked gold files in private/gold/.

Gold note: the gold transcriptions and panel orders were typed by a vision model
(Claude) reading the page images, not by a human checker.

    ~/.local/share/manga-text/venv/bin/python scripts/manga_text/validate_gold.py
"""
import collections
import hashlib
import json
import re
import sqlite3
import sys
import zipfile
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
import common as C  # noqa: E402

PRIVATE, LIB, CAT = C.PRIVATE, C.LIB, C.CAT
CHAPTERS = {"1": "ccdc7b295a6afcfb3efd958d7d4378c5ca3857a0dce015a0e424d5b2cc5a16a5",
            "10": "0d3b80d617b91d8ab6608e72cf81a4ef48fa7141accfd786c303c8972c4aec3c",
            "16": "1fa46fcd44fae8eddcdbec7b6853cdfe242b7dd4f0d748169865c739a2319974"}


def load(h):
    rows = [json.loads(l) for l in open(next(PRIVATE.glob(f"*/*/chapter.jsonl")) if False else _find(h))]
    return rows[0], [r for r in rows if r["record"] == "page"], [r for r in rows if r["record"] == "item"]


def _find(h):
    for f in PRIVATE.glob("*/*/chapter.jsonl"):
        head = C.read_header(f)
        if head and head["cbz_sha256"] == h:
            return f
    raise FileNotFoundError(h)


def toks(s):
    return re.findall(r"[a-z0-9']+", s.lower().replace("’", "'"))


def score(gold, sfx, ocr):
    g = collections.Counter(toks(gold))
    s = set(toks(sfx))
    o = collections.Counter(t for t in toks(ocr) if t not in s)
    hit = sum((g & o).values())
    return hit / max(1, sum(g.values())), hit / max(1, sum(o.values())), sum(g.values()), sum(o.values())


def check_pages(out):
    con = sqlite3.connect(f"file:{CAT}?mode=ro", uri=True)
    for ch, h in CHAPTERS.items():
        meta = json.loads(con.execute("select metadata from assets where hash=?", (h,)).fetchone()[0])
        pm = meta["page_members"]
        head, pages, items = load(h)
        with zipfile.ZipFile(LIB / h / "source.cbz") as z:
            members = sorted(n for n in z.namelist() if re.match(r"^\d{5}\.", n))
        ok_count = head["page_count"] == len(pm) == len(pages) == len(members)
        ok_order = [p["page_member"] for p in pages] == [p["member"] for p in pm] == members
        ok_hash = [p["page_sha256"] for p in pages] == [p["sha256"] for p in pm]
        ok_pageno = [p["page"] for p in pages] == list(range(1, len(pm) + 1))
        out["pages"][ch] = {"pages": len(pages), "catalogue": len(pm), "cbz": len(members), "count": ok_count,
                            "order": ok_order, "hash": ok_hash, "numbering": ok_pageno,
                            "pass": ok_count and ok_order and ok_hash and ok_pageno}


def check_gold(out):
    for name in ["c10_00010", "c16_00008", "c1_00013"]:
        ch, pg = name.split("_")[0][1:], int(name.split("_")[1])
        _, _, items = load(CHAPTERS[ch])
        text = " ".join(i["text"] for i in items if i["page"] == pg)
        r = score((PRIVATE / f"gold/{name}.txt").read_text(), (PRIVATE / f"gold/{name}.sfx").read_text(), text)
        out["gold"][name] = {"recall": round(r[0], 2), "precision": round(r[1], 2), "gold_words": r[2], "out_words": r[3]}
    _, _, items = load(CHAPTERS["1"])
    page_items = [i for i in items if i["page"] == 46]
    alltxt = " ".join(i["text"] for i in page_items).lower()
    res = {}
    for kind in ("speech", "sfx"):
        want = (PRIVATE / f"gold/c1_00046.items_{kind}").read_text().split()
        res[kind] = {w: (w in toks(alltxt)) for w in want}
    out["gold"]["c1_00046_items"] = res


def match(prefix, items):
    p = re.sub(r"[^a-z0-9' ]", "", prefix.lower())
    for i in items:
        t = re.sub(r"[^a-z0-9' ]", "", i["text"].lower())
        if p in t:
            return i
    return None


def check_order(out):
    order = json.load(open(PRIVATE / "gold/order.json"))
    tot_pairs = ok_pairs = unmatched = 0
    per = {}
    for name, g in order.items():
        _, _, items = load(CHAPTERS[g["chapter"]])
        items = [i for i in items if i["page"] == g["page"]]
        flat = []
        for pi, panel in enumerate(g["panels"]):
            for pre in panel:
                m = match(pre, items)
                if m is None:
                    unmatched += 1
                    per.setdefault(name, {}).setdefault("unmatched", []).append(pre)
                else:
                    flat.append((pi, m["reading_order"]))
        pp = po = 0
        for a in range(len(flat)):
            for b in range(a + 1, len(flat)):
                if flat[a][0] != flat[b][0]:
                    pp += 1
                    po += flat[a][1] < flat[b][1]
        per.setdefault(name, {}).update({"cross_panel_pairs": pp, "correct": po})
        tot_pairs += pp
        ok_pairs += po
    out["order"] = {"per_page": per, "cross_panel_pairs": tot_pairs, "correct": ok_pairs,
                    "accuracy": round(ok_pairs / max(1, tot_pairs), 3), "unmatched_items": unmatched}


def check_stats(out):
    for ch, h in CHAPTERS.items():
        head, pages, items = load(h)
        st = head["stats"]
        n = len(items)
        text_items = [i for i in items if i["text"].strip()]
        out["stats"][ch] = {
            "pages": len(pages), "items": n, "text_items": len(text_items), "empty_pages": st["empty_pages"],
            "spread_pages": st["spread_pages"],
            "flag_rate": {k: round(v / max(1, n), 3) for k, v in sorted(st["flags"].items())},
            "flag_counts": st["flags"], "sec_per_page": head["run"]["sec_per_page"], "peak_rss_mb": head["run"]["peak_rss_mb"],
            "kinds": dict(collections.Counter(i["kind"] for i in items))}


def main():
    out = {"pages": {}, "gold": {}, "order": {}, "stats": {}}
    check_pages(out)
    check_gold(out)
    check_order(out)
    check_stats(out)
    (PRIVATE / "validation_results.json").write_text(json.dumps(out, indent=1))
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
