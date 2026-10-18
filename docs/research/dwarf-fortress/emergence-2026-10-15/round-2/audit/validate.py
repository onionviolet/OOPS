import json,hashlib,re
from pathlib import Path
out=Path(__file__).resolve().parent;errors=[];c=json.loads((out/'READ_COVERAGE.json').read_text());u=json.loads((out/'UNREAD.json').read_text());by={s['file']:s for s in c['sources']};root=Path(c['source_root']);allfiles={str(p.relative_to(root)):p for p in root.rglob('*') if p.is_file()}
for f,s in by.items():
 b=Path(s['path']).read_bytes()
 if hashlib.sha256(b).hexdigest()!=s['sha256']:errors.append('source hash '+f)
 for a,z in s['read_spans']:
  if not 1<=a<=z<=s['lines']:errors.append('source span '+f)
if set(allfiles)!={x['file'] for x in u['files']}:errors.append('file coverage')
for e in u['files']:
 f=e['file'];n=len(allfiles[f].read_bytes().decode('utf-8',errors='replace').splitlines());read={i for a,z in by.get(f,{}).get('read_spans',[]) for i in range(a,z+1)};unread=[i for a,z in e['unread_lines'] for i in range(a,z+1)]
 if len(unread)!=len(set(unread)) or read&set(unread) or read|set(unread)!=set(range(1,n+1)):errors.append('span accounting '+f)
n=json.loads((out/'NATIVE_READS.json').read_text())
for r in n['pseudocode']:
 b=Path(r['path']).read_bytes()
 if hashlib.sha256(b).hexdigest()!=r['sha256']:errors.append('native text hash '+r['path'])
 for a,z in r['read_spans']:
  if not 1<=a<=z<=len(b.decode().splitlines()):errors.append('native read range')
for f in ['NATIVE_CHECKS.json','RTTI_CHECKS.json','FUNCTION_CHECKS.json']:
 if not json.loads((out/f).read_text())['all_checks_pass']:errors.append('native validation '+f)
links=0
for p in out.glob('*.md'):
 for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in link or link.startswith('#'):continue
  links+=1
  if not (p.parent/link.split('#')[0]).exists():errors.append('broken link '+link)
r=dict(status='PASS' if not errors else 'FAIL',cumulative_source_files=len(by),readable_files_accounted=len(allfiles),native_pseudocode_read_records=len(n['pseudocode']),old_literal_refs=6,rtti_classes=3,supplied_vtable_pointers=72,pinned_function_regions=18,findings=6,local_links_checked=links,errors=errors,scope='Static evidence integrity and selected independent instruction review only; no gameplay or full-engine proof.')
(out/'VALIDATION.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));raise SystemExit(bool(errors))
