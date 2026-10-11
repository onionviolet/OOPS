"""Validate research artifacts, retention hashes and locators, without executing games."""
from pathlib import Path
import json,hashlib,re,subprocess,datetime
ROOT=Path(__file__).resolve().parents[3]; LANE=Path(__file__).parent
REQUIRED=['INTAKE.json','REPORT.md','FINDINGS.json','COVERAGE.json','IMPLEMENTATION_PACKETS.md','CHECKPOINT.md']
SOURCES={
 'theory-of-magic':Path.home()/'.codex/research/theory-of-magic/source',
 'bitburner':Path.home()/'.codex/research/bitburner/source',
 'kill-the-lich-idle':Path.home()/'.codex/research/kill-the-lich-idle/source',
}
errors=[]; checks={'json_files':0,'hashes':0,'source_ranges':0,'local_links':0};counts={}
def require(ok,message):
 if not ok:errors.append(message)
def objects(value):
 if isinstance(value,dict):
  yield value
  for v in value.values():yield from objects(v)
 elif isinstance(value,list):
  for v in value:yield from objects(v)
def verify_files(rows,base):
 for x in rows:
  p=base/x['path'];require(p.is_file(),f'Missing retained source: {p}')
  if p.is_file():
   raw=p.read_bytes();require(hashlib.sha256(raw).hexdigest()==x['sha256'],f'Hash mismatch: {p}')
   require(len(raw)==x['bytes'],f'Size mismatch: {p}');checks['hashes']+=1
for slug,base in SOURCES.items():
 folder=ROOT/'docs/research'/slug
 for name in REQUIRED:require((folder/name).is_file(),f'Missing {slug}/{name}')
 if not (folder/'FINDINGS.json').exists():continue
 finding=json.loads((folder/'FINDINGS.json').read_text())
 proposals=finding.get('proposals',finding.get('ranked_proposals',finding.get('findings',[])))
 touches=finding.get('small_touches',[])
 counts[slug]={'proposals':len(proposals),'touches':len(touches)}
 require(5<=len(proposals)<=10,f'{slug}: need5-10 proposals')
 require(len(touches)>=20,f'{slug}: need20+ touches')
 for p in folder.glob('*.json'):
  try:d=json.loads(p.read_text());checks['json_files']+=1
  except Exception as e:errors.append(f'JSON {p}: {e}');continue
  for obj in objects(d):
   path=obj.get('path');lines=obj.get('lines')
   start=obj.get('start');end=obj.get('end')
   if isinstance(lines,list) and len(lines)==2:start,end=lines
   if path and isinstance(start,int) and isinstance(end,int):
    q=base/path
    require(q.is_file(),f'{slug}: missing range path {path}')
    if q.is_file():require(1<=start<=end<=len(q.read_text(errors='replace').splitlines()),f'{slug}: bad range {path}:{start}-{end}')
    checks['source_ranges']+=1
 intake=json.loads((folder/'INTAKE.json').read_text())
 if slug=='theory-of-magic':
  for snapshot in ['community','original']:
   rows=[x for x in intake['file_inventory'] if x['snapshot']==snapshot]
   verify_files(rows,base if snapshot=='community' else base.parent/'original-source')
 elif slug=='bitburner':verify_files(intake['retained_files'],base)
 else:
  receipt=base.parent/'ACQUISITION.json'
  if receipt.exists():
   d=json.loads(receipt.read_text());rows=d.get('files',d.get('file_inventory',[]));verify_files(rows,base)
   require(bool(rows),'KTL retention schema did not expose files')
 for p in folder.glob('*.md'):
  for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
   if re.match(r'[a-z]+://',link) or link.startswith('#'):continue
   target=(p.parent/link.split('#')[0]).resolve();require(target.exists(),f'Missing link {p.name}: {link}');checks['local_links']+=1
for folder in [LANE]+[ROOT/'docs/research'/slug for slug in ['sucker-for-love-crush-landing','ani-idle','endless-ascent','upload-labs','the-lands-of-eldyn']]:
 for p in folder.glob('*.json'):
  try:json.loads(p.read_text());checks['json_files']+=1
  except Exception as e:errors.append(f'JSON {p}: {e}')
 for p in folder.glob('*.md'):
  for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
   if re.match(r'[a-z]+://',link) or link.startswith('#'):continue
   require((p.parent/link.split('#')[0]).resolve().exists(),f'Missing link {p}: {link}');checks['local_links']+=1
snapshot=json.loads((LANE/'INPUT_SNAPSHOT.json').read_text())
drift=[p for p,h in snapshot['inputs'].items() if hashlib.sha256((ROOT/p).read_bytes()).hexdigest()!=h]
for p in drift:errors.append(f'Input drift requires reconciliation: {p}')
result={'captured_at':datetime.datetime.now().astimezone().isoformat(),'passed':not errors,'checks':checks,'dossiers':counts,'input_drift':drift,'errors':errors,'limitations':'Artifact/hash/range/link checks do not establish semantic completeness, runtime correctness, installed Steam identity, ownership, pacing or user acceptance.'}
(LANE/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
