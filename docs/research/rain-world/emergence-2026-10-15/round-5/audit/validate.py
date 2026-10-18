from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
ledger=json.loads((root/'READ_LEDGER.json').read_text());find=json.loads((root/'FINDINGS.json').read_text());errors=[];by={}
for e in ledger['classes']+ledger['support_sources']:
 p=Path(e['path']);by[e['type']]=e
 if not p.is_file() or sha(p)!=e['sha256']:errors.append('source mismatch '+e['type']);continue
 n=len(p.read_text().splitlines())
 if 'unread_line_windows' in e:
  positions=[i for a,b in e['reviewed_line_windows']+e['unread_line_windows'] for i in range(a,b+1)]
  if sorted(positions)!=list(range(1,n+1)):errors.append('coverage overlap/gap '+e['type'])
 for a,b in e['reviewed_line_windows']:
  if not 1<=a<=b<=n:errors.append('bad review range '+e['type'])
locs=0
for f in find['findings']:
 for l in f['locators']:
  locs+=1;e=by[l['type']]
  if (e['sha256'],e['path'])!=(l['sha256'],l['path']):errors.append('locator identity '+l['type'])
  if any(not any(a<=i<=b for a,b in e['reviewed_line_windows']) for i in range(l['start_line'],l['end_line']+1)):errors.append('unread locator '+l['type']+str(l['start_line']))
links=0
for p in root.glob('*.md'):
 for t in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in t or t.startswith('#'):continue
  links+=1
  if not (root/t.split('#')[0]).exists():errors.append('missing link '+t)
p=Path(find['input']);installed=sha(p) if p.exists() else None
if installed and installed!=find['input_sha256']:errors.append('input drift')
for e in ledger['support_sources']:
 if 'input' in e and sha(Path(e['input']))!=e['input_sha256']:errors.append('support input drift')

source_index=json.loads((root/'SOURCE_INDEX.json').read_text())
for e in source_index['entries']:
 receipt=Path(e['path']).with_suffix('.receipt.json')
 saved=json.loads(receipt.read_text())
 if e['returncode']!=0 or saved['sha256']!=e['sha256'] or saved['command']!=e['command']:errors.append('capture receipt '+e['type'])
scan=json.loads(Path(find['private_reference_scan']).read_text())
scan_source=Path(scan['source'])
if sha(scan_source)!=scan['sha256']:errors.append('reference scan input drift')
scan_lines=scan_source.read_text().splitlines()
for k,v in scan['searches'].items():
 actual=[{'line':i+1,'text':line.strip()} for i,line in enumerate(scan_lines) if re.search(v['pattern'],line)]
 if actual!=v['matches']:errors.append('reference scan mismatch '+k)

counts={s:sum(e['status']==s for e in ledger['classes']) for s in ['full-class-read','selected-windows-read','captured-unread']}
out={'status':'PASS' if not errors else 'FAIL','errors':errors,'scope':'Artifact/source consistency only; native behavior unobserved','input_sha256':find['input_sha256'],'installed_input_sha256_at_validation':installed,'cumulative_game_classes':len(ledger['classes']),'class_status_counts':counts,'support_sources':len(ledger['support_sources']),'alias_duplicates_excluded':len(ledger['aliases']),'source_locators_checked':locs,'local_links_checked':links,'private_referenced_bytes':sum(Path(e['path']).stat().st_size for e in by.values()),'artifact_sha256':{p.name:sha(p) for p in root.iterdir() if p.is_file() and p.name!='VALIDATION.json'}}
(root/'VALIDATION.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({k:v for k,v in out.items() if k!='artifact_sha256'},indent=2));raise SystemExit(bool(errors))
