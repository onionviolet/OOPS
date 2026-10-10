"""Extract an EPUB's chapter text into one JSON file for fast local searching.

Usage: python3 -I epub_to_json.py BOOK.epub OUT.json
Output: {member_filename: [heading, body_text]} in archive order.
Read-only on the EPUB. Keep OUT.json outside git (copyrighted text).
"""
import html
import json
import re
import sys
import zipfile

def main(src, dst):
    z = zipfile.ZipFile(src)
    out = {}
    for name in sorted(z.namelist()):
        if not name.endswith((".xhtml", ".html", ".htm")):
            continue
        raw = z.read(name).decode("utf8", "ignore")
        text = html.unescape(re.sub(r"<[^>]+>", "\n", raw))
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        heading = next((l for l in lines[:3] if re.search(r"(第.+章|Chapter\s*\d+)", l)), lines[0] if lines else "")
        out[name.split("/")[-1]] = [heading, "\n".join(lines)]
    with open(dst, "w") as f:
        json.dump(out, f, ensure_ascii=False)
    print(len(out), "members,", sum(len(v[1]) for v in out.values()), "characters")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
