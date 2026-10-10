"""Merge several EPUB volumes into one JSON keyed by chapter number.

Usage: python3 -I merge_volumes.py OUT.json VOL1.epub [VOL2.epub ...]
Output: {"ch00001": [heading, body], ...}. Chapter numbers come from a
heading like 'Chapter 123' or '第123章'. Members without a chapter number
(notes, covers) are skipped. Later volumes win on duplicate chapters, and
duplicates are reported. Keep OUT.json outside git (copyrighted text).
"""
import html
import json
import re
import sys
import zipfile

NUM = re.compile(r"(?:Chapter\s*(\d+)|第(\d+)章)")

def chapters(path):
    z = zipfile.ZipFile(path)
    for name in z.namelist():
        if not name.lower().endswith((".xhtml", ".html", ".htm")):
            continue
        raw = z.read(name).decode("utf8", "ignore")
        text = html.unescape(re.sub(r"<[^>]+>", "\n", raw))
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        for l in lines[:3]:
            m = NUM.search(l)
            if m:
                yield int(m.group(1) or m.group(2)), l, "\n".join(lines)
                break

def main(dst, srcs):
    out, dupes = {}, 0
    for src in srcs:
        for n, heading, body in chapters(src):
            key = f"ch{n:05d}"
            if key in out:
                dupes += 1
            out[key] = [heading, body]
    out = dict(sorted(out.items()))
    with open(dst, "w") as f:
        json.dump(out, f, ensure_ascii=False)
    nums = [int(k[2:]) for k in out]
    missing = sorted(set(range(min(nums), max(nums) + 1)) - set(nums))
    print(f"{len(out)} chapters {min(nums)}-{max(nums)}, {dupes} duplicates, "
          f"{len(missing)} missing{': ' + str(missing[:20]) if missing else ''}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
