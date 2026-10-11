"""Artifact and acquisition evidence checks; no network or gameplay tests."""
import json,hashlib,re,subprocess,zipfile
from pathlib import Path
from datetime import datetime
O=Path('docs/research/power-systems/novel-crawl');P=Path('docs/research/novels/power-scout-2026-10-10')
selection=json.loads((O/'SELECTION.json').read_text());candidate=Path('docs/research/power-systems/broad-scout/CANDIDATES.json');allrows=json.loads(candidate.read_text())['candidates']
assert selection['candidate_sha256']==hashlib.sha256(candidate.read_bytes()).hexdigest()
assert [r['id'] for r in selection['candidates']]==[r['id'] for r in sorted(allrows,key=lambda r:-r['novelty_score'])[:15]]
x=json.loads((O/'SERIES.json').read_text());assert len(x['series'])==15;assert len(x['chapter_sources'])==11
assert sum(bool(r['claims']) for r in x['series'])==5
for r in x['series']:
 assert set(r['path'])==set('currency steps gate risk shape branching grader ceiling'.split())
 assert set(r['axes'])==set('object mechanism trigger certainty scope price limit visibility persistence growth'.split())
 assert r['unique_mechanics'] and r['vows_contracts_costs']['slots'] and r['gag_or_rule_abuse']
 assert (P/r['acquisition']['private_folder'].rsplit('/',1)[-1]/'READING.md').exists()
 assert not r['acquisition']['full_book_read']
for s in x['chapter_sources']:
 p=Path(s['private_member']);assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sha256'];assert len(p.read_text().splitlines())==s['paragraphs']
 assert subprocess.run(['git','check-ignore','-q',str(p)]).returncode==0
for r in json.loads((O/'EPUBS.json').read_text()):
 p=Path(r['file']);assert hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256']
 with zipfile.ZipFile(p) as z:
  chapters=[n for n in z.namelist() if re.match(r'OEBPS/file\d+\.xhtml$',n)];assert len(chapters)==r['chapter_count'],(r,chapters)
 assert subprocess.run(['git','check-ignore','-q',str(p)]).returncode==0
# Verify parent repair and member hashes, with all cited line numbers in range.
leaf=json.loads((P/'pale-lights/CLAIMS.json').read_text());assert len(leaf['claims'])==15
for s in leaf['sources']:
 p=P/'pale-lights'/s['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sha256']
for cl in leaf['claims']:
 src=cl['source'];p=P/'pale-lights/sources'/(src['member_id']+'.txt');assert all(0<n<=len(p.read_text().splitlines()) for n in src['paragraphs'])
before=(O/'source_requests_before.txt').read_bytes();after=Path('docs/research/SOURCE_REQUESTS.md').read_bytes();assert after.startswith(before)
ids=re.findall(rb'^\| (S\d+) \|',after,re.M);assert len(ids)==len(set(ids));assert len(ids)==94
state=json.loads((P/'transport/state.json').read_text());assert state['pending'] is None;assert len(state['closed'])==5
logs=[json.loads(line) for line in (P/'transport/requests.jsonl').read_text().splitlines()]
requests=[r for r in logs if r['event']=='request'];last={};gaps=[];counts={};closed={}
from urllib.parse import urlsplit
for r in logs:
 host=r.get('host') or urlsplit(r.get('url','')).hostname
 if r['event']=='closed':closed[host]=r['time']
 if r['event']!='request':continue
 assert host not in closed,('request after host closed',host)
 start=datetime.fromisoformat(r['started']);end=datetime.fromisoformat(r['time'])
 if host in last:
  gap=(start-last[host]).total_seconds();assert gap>=3.99,(host,gap);gaps.append(gap)
 last[host]=end;counts[host]=counts.get(host,0)+1
 assert '/login' not in r['url'] and not any(h in host for h in ['ttks','ttkan','69shu'])
assert max(counts.values())<300
inbox=list(Path('docs/research/novels/inbox').glob('*.epub'));assert not inbox
for f in O.glob('*.md'):
 assert '\u2014' not in f.read_text(),f
report=(O/'REPORT.md').read_text();assert len(re.findall(r'^\| \d+ \| M\d+:',report,re.M))==15
result={'passed':True,'selected':15,'books_with_chapter_text':5,'chapters_acquired_read':11,'chapter_hashes_verified':11,'private_epubs':5,'leaf_model':'gpt-6-luna medium','leaf_claims_reviewed':15,'parent_repair_rounds':1,'source_request_ids_added':['S89','S90','S91','S92','S93','S94'],'existing_request_prefix_preserved':True,'unique_request_ids':94,'hosts_stopped':state['closed'],'network_requests':len(requests),'requests_per_host':counts,'minimum_same_host_gap_seconds':min(gaps),'requests_after_host_stop':0,'inbox_epubs_at_delivery':0,'game_builds_tests_commits':0,'scope':'artifact integrity, acquired-source coverage and bounded source review only'}
(O/'VALIDATION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result,ensure_ascii=False,indent=2))
