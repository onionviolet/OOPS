"""Print chapters FROM..TO (inclusive ints) of a ttks text.json, stripping site watermark lines.
Usage: python3 -I ttks_range.py BOOK.json FROM TO"""
import json, re, sys
d = json.load(open(sys.argv[1])); a, b = int(sys.argv[2]), int(sys.argv[3])
for k in sorted(d):
    if a <= int(k) <= b:
        h, body = d[k]
        body = re.sub(r"【[^】]*(域名|天天看|ttk)[^】]*】", "", body)
        print(f"\n===== [{k}] {h}\n{body}")
