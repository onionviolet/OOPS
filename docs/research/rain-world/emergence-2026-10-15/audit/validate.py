from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parent
ledger=json.loads((root/'READ_LEDGER.json').read_text())
f=json.loads((root/'FINDINGS.json').read_text())
errors=[]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for c in ledger['classes']:
 p=Path(c['path'])
 if not p.is_file() or sha(p)!=c['sha256']:errors.append('source mismatch '+c['type']);continue
 n=len(p.read_text().splitlines())
 if n!=c['lines']:errors.append('line mismatch '+c['type'])
 covered=[]
 for a,b in c['reviewed_line_windows']+c['unread_line_windows']:
  if not 1<=a<=b<=n:errors.append('bad range '+c['type'])
  covered.extend(range(a,b+1))
 if sorted(covered)!=list(range(1,n+1)):errors.append('coverage overlap/gap '+c['type'])
by={c['type']:c for c in ledger['classes']}
loccount=0
for finding in f['findings']:
 for l in finding['locators']:
  loccount+=1;c=by[l['type']]
  if c['sha256']!=l['sha256'] or c['path']!=l['path']:errors.append('locator identity '+l['type'])
  for i in range(l['start_line'],l['end_line']+1):
   if not any(a<=i<=b for a,b in c['reviewed_line_windows']):errors.append('locator not reviewed '+l['type']+':'+str(i));break
links=0
for p in root.glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in target or target.startswith('#'):continue
  links+=1
  if not (root/target.split('#')[0]).exists():errors.append('missing link '+target)
input_path=Path(f['input']['input'])
input_current_sha=sha(input_path) if input_path.is_file() else None
if input_current_sha and input_current_sha!=f['input']['input_sha256']:errors.append('installed input hash changed')
summary={s:sum(c['status']==s for c in ledger['classes']) for s in ['full-class-read','selected-windows-read','captured-unread']}
result={'status':'PASS' if not errors else 'FAIL','scope':'Artifact and source consistency only; native behavior not tested','errors':errors,'input_sha256':f['input']['input_sha256'],'installed_input_sha256_at_validation':input_current_sha,'class_status_counts':summary,'source_locators_checked':loccount,'local_links_checked':links,'private_captured_source_bytes':sum(Path(c['path']).stat().st_size for c in ledger['classes']),'artifact_sha256':{p.name:sha(p) for p in root.iterdir() if p.is_file() and p.name!='VALIDATION.json'}}
(root/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['artifact_sha256']},indent=2))
raise SystemExit(bool(errors))
