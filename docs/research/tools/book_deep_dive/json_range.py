"""Print chapters FROM..TO (inclusive ints) of a book text.json, stripping site watermark lines.

Usage: python3 -I json_range.py BOOK.json FROM TO [--vol N]
Keys may be bare numbers ("123", the ttks text.json shape) or merge_volumes keys
("ch00123", split parts "ch00123-2"). Volume-qualified keys ("v02ch00001") need
--vol N, because the same chapter number exists in more than one volume.
"""
import json, re, sys

KEY = re.compile(r'^(?:v(\d+))?(?:ch)?(\d+)(?:-\d+)?$')
args = sys.argv[1:]
vol = None
if '--vol' in args:
    i = args.index('--vol'); vol = int(args[i + 1]); del args[i:i + 2]
if len(args) != 3:
    print(__doc__); sys.exit(2)
with open(args[0], encoding='utf-8') as f:
    d = json.load(f)
a, b = int(args[1]), int(args[2])
parsed = {k: KEY.match(k) for k in d}
if any(m and m.group(1) for m in parsed.values()) and vol is None:
    sys.exit('volume-qualified keys (vNNchNNNNN): pass --vol N')
rows = sorted((int(m.group(2)), k) for k, m in parsed.items()
              if m and (vol is None or (m.group(1) and int(m.group(1)) == vol)))
for n, k in rows:
    if a <= n <= b:
        h, body = d[k]
        body = re.sub(r"【[^】]*(域名|天天看|ttk)[^】]*】", "", body)
        print(f"\n===== [{k}] {h}\n{body}")
