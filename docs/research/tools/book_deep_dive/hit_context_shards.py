"""Turn keyword hits into locator-tagged context passages and split them into shards.

Usage: python3 -I hit_context_shards.py BOOK.epub HITS.jsonl OUTDIR --keys K1,K2 [--before 1 --after 5 --shards 4]
Selects hits containing any of --keys, keeps `before`/`after` paragraphs around
each, writes OUTDIR/context.md and OUTDIR/shardN.md split at chapter boundaries.
Each line is `[SERIALpN] text`, so extraction readers cite exact locators.
"""
import sys, json, argparse, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from keyword_scan import members

a = argparse.ArgumentParser()
a.add_argument('book'); a.add_argument('hits'); a.add_argument('outdir')
a.add_argument('--keys', required=True); a.add_argument('--before', type=int, default=1)
a.add_argument('--after', type=int, default=5); a.add_argument('--shards', type=int, default=4)
o = a.parse_args(); want = set(o.keys.split(','))
sel = {}
for l in open(o.hits):
    d = json.loads(l)
    if want & set(d['keys']): sel.setdefault(d['serial'], set()).add(d['p'])
parts = []
for serial, ps in members(o.book):
    if serial not in sel: continue
    keep = set()
    for i in sel[serial]: keep.update(range(max(1, i - o.before), min(len(ps), i + o.after) + 1))
    parts.append(f'\n## serial {serial}\n' + ''.join(f'[{serial}p{i}] {ps[i-1]}\n' for i in sorted(keep)))
os.makedirs(o.outdir, exist_ok=True)
open(os.path.join(o.outdir, 'context.md'), 'w').write(''.join(parts))
total = sum(map(len, parts)); target = total / o.shards; shards = [[]]; cur = 0
for p in parts:
    if cur > target and len(shards) < o.shards: shards.append([]); cur = 0
    shards[-1].append(p); cur += len(p)
for i, s in enumerate(shards, 1): open(os.path.join(o.outdir, f'shard{i}.md'), 'w').write(''.join(s))
print('chapters', len(parts), 'chars', total, 'shards', [sum(map(len, s)) for s in shards])
