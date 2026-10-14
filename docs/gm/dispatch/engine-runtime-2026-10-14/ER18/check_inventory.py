from pathlib import Path
import re,json,hashlib,collections
lane=Path('docs/gm/dispatch/engine-runtime-2026-10-14/ER18');x=json.loads((lane/'census.json').read_text());anchors=json.loads((lane/'anchors.json').read_text())
errors=[];drift=[];categories={}
live_files={str(p) for p in Path('src').rglob('*') if p.is_file() and not p.name.startswith('SECRETS')}
captured_files={f['file'] for f in x['files']}
drift.extend(sorted(live_files.symmetric_difference(captured_files)))
for f in x['files']:
 p=Path(f['file'])
 if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=f['sha256']:drift.append(f['file'])
for ab,rs in x['categories'].items():
 for r in rs:
  ls=Path(r['file']).read_text().splitlines()
  if not 1<=r['line']<=len(ls):errors.append([ab,r,'line out of bounds'])
 categories[ab]={'sites':len(rs),'files':len({r['file'] for r in rs})}
for a in anchors:
 if a['needle'] not in Path(a['file']).read_text().splitlines()[a['line']-1]:errors.append(['anchor moved',a])
text=Path('docs/research/ABSTRACTION_INVENTORY_2026-10-14.md').read_text()
for i in range(1,16):
 if f'## ER18-AB{i}:' not in text:errors.append(['missing category',i])
 if f'### ER18-I{i}:' not in text:errors.append(['missing appendix',i])
for bad in ['\u2014',' -- ','{{COUNTS}}']:
 if bad in text:errors.append(['style/unrendered token',bad])
for link in re.findall(r'\]\(([^)]+)\)',text):
 if not link.startswith(('http:','https:','#')):
  target=link.split('#')[0]
  if not (Path('docs/research')/target).exists():errors.append(['broken link',target])
xs=[];random_sites=[]
for f in x['files']:
 p=Path(f['file'])
 if p.suffix!='.js':continue
 for i,l in enumerate(p.read_text().splitlines(),1):
  if re.search(r'<<\s*13',l):xs.append(f"{p}:{i}")
  if 'Math.random' in l and not l.lstrip().startswith('//'):random_sites.append(f"{p}:{i}")
result={'source_files':len(x['files']),'categories':categories,'explicit_anchors':len(anchors),'xorshift_sites':xs,'raw_random_line_sites':random_sites,'source_drift':drift,'errors':errors,'pass':not errors and not drift}
(lane/'checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ['source_files','explicit_anchors','source_drift','errors','pass']},indent=2));print('xorshift sites',len(xs),'raw random line sites',len(random_sites))
raise SystemExit(0 if result['pass'] else 1)
