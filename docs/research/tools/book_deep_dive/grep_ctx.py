"""Show context windows for members that contain every keyword.

Usage: python3 -I grep_ctx.py TEXT.json WINDOW MAXHITS KW1 [KW2 ...]
Case-insensitive. Prints member id, volume, heading and a window around KW1.
Members are visited in file order (epub_to_json's spine order, merge_volumes' key
order); all-digit keys are sorted numerically. The volume comes from a "vNN" key
prefix (merge_volumes after a numbering restart), otherwise it is counted by
chapter-1 resets (Chinese 第1章/第一章 or English 'Chapter 1').
"""
import json
import re
import sys

VOL_KEY = re.compile(r'^v(\d+)ch')
RESET = re.compile(r'^\s*(第\s*(1|一)\s*章|Chapter\s*0*1\b)', re.I)


def ordered(d):
    if d and all(k.isdigit() for k in d):
        return sorted(d, key=int)
    return list(d)


def main(path, window, maxhits, kws):
    with open(path, encoding='utf-8') as f:
        d = json.load(f)
    kws_l = [k.lower() for k in kws]
    vol = 0
    hits = 0
    for key in ordered(d):
        heading, body = d[key]
        m = VOL_KEY.match(key)
        if m:
            vol = int(m.group(1))
        elif RESET.match(heading):
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
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:])
