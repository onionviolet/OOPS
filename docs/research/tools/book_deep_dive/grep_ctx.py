"""Show context windows for members that contain every keyword.

Usage: python3 -I grep_ctx.py TEXT.json WINDOW MAXHITS KW1 [KW2 ...]
Case-insensitive. Prints member id, volume (counted by chapter-1 resets,
Chinese 第1章 or English 'Chapter 1:'), heading and a window around KW1.
"""
import json
import re
import sys

def main(path, window, maxhits, kws):
    d = json.load(open(path))
    kws_l = [k.lower() for k in kws]
    vol = 0
    hits = 0
    for key in sorted(d):
        heading, body = d[key]
        if re.match(r"(第1章|Chapter 1\b)", heading):
            vol += 1
        low = body.lower()
        if all(k in low for k in kws_l):
            i = low.find(kws_l[0])
            flat = body.replace("\n", " ")
            print(f"## {key} vol{vol} {heading[:40]}\n{flat[max(0, i - window):i + window]}\n")
            hits += 1
            if hits >= maxhits:
                break

if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:])
