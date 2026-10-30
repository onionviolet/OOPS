"""Verify the frozen unread partition without exposing private source payloads."""
import collections
import hashlib
import json
from pathlib import Path
import re

HERE=Path('docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3')
BASE=Path('docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27')
load=lambda p:json.loads(Path(p).read_text())
rows=lambda p:[json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
m=load(HERE/'r3b/manifest.json')
for p,h in m['inputs'].items():
    assert (sha(p) if Path(p).exists() else None)==h, f'Frozen input drift: {p}'
queue=(HERE/'r3b/queue.txt').read_text().splitlines()
assert queue==[b['brief'] for b in m['briefs']] and len(queue)==len(set(queue))
assert set(queue)=={str(p) for f in ['c1b','c4b','c5b'] for p in (HERE/f).glob('luna_b*.md')}
assert [b['family'] for b in m['briefs']]==sorted([b['family'] for b in m['briefs']],key=lambda f:['c4','c1','c5'].index(f))
expected={('c1','slugs'):set(load(BASE/'l10/slug-cluster/coordinator-gaps.json')['unread'])}
for f in ['methods','gm33']:
    expected['c4',f]={r['id'] for r in rows(BASE/'l4/v4plus/unread.jsonl') if r['family']==f}
c1_inventory={r['slug']:r for r in load(BASE/'l10/slug-cluster/inventory.json')}
c4_inventory={r['id']:r for f in ['methods','gm33'] for r in rows(BASE/f'l4/v4plus/{f}_all_in.jsonl')}
def volume(o):
    q=re.search(r'\bb([1-8])\b',o.get('locator') or '')
    if q:return int(q[1])
    sh=o.get('shard') or next(iter(o.get('shards',[])),'')
    q=re.match(r'lotm([2-8])c',sh)
    if q:return int(q[1])
    if re.match(r'[bw][1-8]s',sh):return 1
    return o['volume']
c5_inventory={}
status=(HERE/'r3b/c5-lane-status.txt').read_text().splitlines()
running={s.split(':',1)[0] for s in status if ': running' in s}
skipped={s['group'] for s in m['families']['c5']['skippedRunning']}
for i,s in enumerate(load(HERE/'c5/manifest.json')['shards'],1):
    old=[l.split('\t') for l in Path(s['input']).read_text().splitlines() if l]
    answers=set()
    if Path(s['output']).exists():
        for line in Path(s['output']).read_text().splitlines():
            if not line.strip() or line.startswith('{'):continue
            n,code=line.split('\t');n=int(n)
            assert n not in answers and 1<=n<=len(old)
            answers.add(n)
    missing={r[1] for n,r in enumerate(old,1) if n not in answers}
    if s['group'] in skipped:
        assert f'sw-r3-c5-luna_{i}' in running or s['brief'] in load(HERE/'r3b/c5-unfinished-lanes.json')
        continue
    assert f'sw-r3-c5-luna_{i}' not in running
    expected['c5',s['group']]=missing
    for fields in old:c5_inventory[fields[1]]=fields[1:]
actual=collections.defaultdict(list)
for b in m['briefs']:
    assert sha(b['input'])==b['inputSha256'] and sha(b['brief'])==b['briefSha256']
    text=Path(b['brief']).read_text()
    assert b['input'] in text and b['output'] in text and '{"unread":[' in text
    assert '--max 2' in text and 'No placeholders' in text
    assert str(Path(b['output']).parent) in [str(BASE/'l10/slug-cluster'),str(BASE/'l4/v4plus'),str(BASE/'wb-families-texture')]
    if b['family']=='c1':
        data=load(b['input']); ids=[r['slug'] for r in data]
        assert data==[c1_inventory[s] for s in ids]
        assert 'Pathway-neutral' in text
    elif b['family']=='c4':
        data=rows(b['input']);ids=[r['id'] for r in data]
        for r in data:
            source=c4_inventory[r['id']]
            assert len(r['occurrences'])==len(source['occurrences'])
            for o,old in zip(r['occurrences'],source['occurrences']):
                assert o['volume']==volume(old)
                assert {k:v for k,v in o.items() if k not in ['volume','original_assigned_volume']}=={k:v for k,v in old.items() if k!='volume'}
            assert r['sourceVolumes']==sorted({volume(o) for o in source['occurrences']})
    else:
        data=[l.split('\t') for l in Path(b['input']).read_text().splitlines() if l];ids=[r[1] for r in data]
        for i,r in enumerate(data,1):assert r[0]==str(i) and r[1:]==c5_inventory[r[1]]
    assert 0<len(ids)==b['rows']<=m['families'][b['family']]['cap']
    actual[b['family'],b['group']].extend(ids)
for key,wanted in expected.items():
    got=actual[key]
    assert len(got)==len(set(got)) and set(got)==wanted, f'Coverage mismatch: {key}'
assert all(key in expected for key in actual)
# The 205-ID legacy handoff is a subset, not an additional assignment.
legacy={r['id'] for r in rows(BASE/'l4/v4plus/methods_05b_in.jsonl')}
assert len(legacy)==205 and legacy<=set(actual['c4','methods'])
for family in ['c4','c1','c5']:
    print(f'{family}: {sum(len(v) for k,v in actual.items() if k[0]==family)} IDs exactly once; {sum(b["family"]==family for b in m["briefs"])} briefs')
print(f'queue: {len(queue)} unique briefs, C4 then C1 then C5; input/brief hashes and corrected addresses PASS')
