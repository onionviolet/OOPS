"""Bounded artifact checks, not gameplay tests or live URL fetches."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[3]
c=json.loads((OUT/'CANDIDATES.json').read_text())
s=json.loads((OUT/'SERIES.json').read_text())
rows=c['candidates']
assert len(rows)>=40
ids={r['id'] for r in rows}
assert len(ids)==len(rows)==len(s['series'])
assert len({r['title'].casefold() for r in rows})==len(rows)
source_ids={x['id'] for x in c['sources']}
assert len(source_ids)==len(c['sources'])
norm=lambda x:re.sub(r'[^\w]','',x.casefold())
prior={norm(r['title']) for r in json.loads((OUT/'EXCLUSIONS.json').read_text())}
required={'id','title','author','platform','summary','lenses','novelty_score','source_urls','evidence_scope','verified_hook','unknowns','proposal'}
for r in rows:
    assert required<=r.keys(),r['title']
    assert norm(r['title']) not in prior,r['title']
    assert 1<=r['novelty_score']<=5
    assert len(r['summary'].split())>=35
    assert r['author'] and r['platform'] and r['lenses'] and r['unknowns']
    assert r['proposal'].startswith('Proposal:')
    assert set(r['source_ids'])<=source_ids
    for url in r['source_urls']:
        assert urlparse(url).scheme=='https' and urlparse(url).netloc,url
path={'currency','steps','gate','risk','shape','branching','grader','ceiling'}
axes={'object','mechanism','trigger','certainty','scope','price','limit','visibility','persistence','growth'}
slots={'swearer','restriction','object','scope','duration','benefit','consequence','witness','condition','ramp','stake','counterparty','release','visibility','inheritance','interpretation','coercion'}
for r in s['series']:
    assert r['id'] in ids
    assert path==r['path'].keys()
    assert axes==r['axes'].keys()
    assert slots<=r['vows_contracts_costs']['slots'].keys()
    assert set(r['evidence_sources'])<=source_ids
    assert r['gag_or_rule_abuse']['verified_scene'] is None
assert len(c['top_15'])==15
assert [r['rank'] for r in c['top_15']]==list(range(1,16))
assert len({r['candidate_id'] for r in c['top_15']})==15
assert all(r['candidate_id'] in ids and r['status']=='proposal' for r in c['top_15'])
assert len(c['source_requests'])==10
assert [r['id'] for r in c['source_requests']]==[f'S{i}' for i in range(6,16)]
assert all(r['candidate_id'] in ids for r in c['source_requests'])
before=(OUT/'source_requests_before.txt').read_bytes()
after=(ROOT/'docs/research/SOURCE_REQUESTS.md').read_bytes()
assert after.startswith(before),'Earlier shared text changed'
append=after[len(before):].decode()
for r in c['source_requests']:
    assert append.count(f"| {r['id']} | ")==1
    assert r['url'] in append
all_shared_ids=re.findall(r'^\| (S\d+) \|',after.decode(),re.M)
assert len(all_shared_ids)==len(set(all_shared_ids))==15
for name in ['REPORT.md','SOURCES.md','CANDIDATES.json','SERIES.json','CHECKPOINT.md']:
    text=(OUT/name).read_text()
    assert '\u2014' not in text,name
    if name.endswith('.md'):
        for link in re.findall(r'\]\(([^)]+)\)',text):
            if not link.startswith(('https://','http://','#')):
                assert (OUT/link.split('#')[0]).exists(),(name,link)
input_hash=json.loads((OUT/'INPUTS.json').read_text())
e8_status={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==h for p,h in input_hash.items() if p.startswith('docs/emergent/E8')}
reconciled=json.loads((OUT/'INPUT_RECONCILIATION.json').read_text())
assert all(hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==h for p,h in reconciled['reviewed_hashes'].items()),'New input drift after review'
counts=Counter('Western' if r['language_group'].startswith('Western') else r['language_group'] for r in rows)
assert all(counts[x]>0 for x in ['Chinese','Korean','Japanese','Western'])
receipt=dict(status='passed',candidate_count=len(rows),language_groups=dict(counts),series_mapping_count=len(s['series']),
             source_reference_count=len(c['sources']),top_mechanics=15,source_requests_added=10,
             shared_original_bytes_preserved=True,shared_request_ids_unique=True,exact_repeats_excluded=True,
             path_parts=8,axes=10,core_and_optional_vow_fields_checked=True,e8_matches_initial_snapshot=e8_status,
             concurrent_e8_updates_reviewed=True,e8_matches_reviewed_snapshot=True,
             links='Local targets exist; public URLs syntactically valid and recorded from metadata. No mass live URL fetch.',
             verification_scope='Artifact integrity and coverage only. No primary chapter reading, gameplay/build/save tests.',
             sha256={name:hashlib.sha256((OUT/name).read_bytes()).hexdigest() for name in ['CANDIDATES.json','SERIES.json','REPORT.md','SOURCES.md']})
(OUT/'VALIDATION.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(receipt,ensure_ascii=False,indent=2))
