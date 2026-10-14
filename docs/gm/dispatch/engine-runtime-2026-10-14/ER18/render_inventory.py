from pathlib import Path
import json,re,collections
lane=Path('docs/gm/dispatch/engine-runtime-2026-10-14/ER18')
x=json.loads((lane/'census.json').read_text());cats=x['categories'];raw=(lane/'inventory-body.md').read_text().replace('Fourteen named boundary providers','Nineteen named boundary providers')
anchors=[]
def anchor(m):
 f,needle=m.groups();lines=Path(f).read_text().splitlines();hits=[i for i,l in enumerate(lines,1) if needle in l and not l.lstrip().startswith('//')]
 if not hits:raise ValueError(f'Missing {f}: {needle}')
 n=hits[0];anchors.append({'file':f,'line':n,'needle':needle});return f'`{f}:{n}`'
raw=re.sub(r'\{(src/[^|{}]+)\|([^{}]+)\}',anchor,raw)
titles=['Clock','Scheduler','Command','RNG stream','Store/entity/registry','Fact/knowledge','Transaction','Persistence','Manifest/registration','World instance','Carrier/transfer','World law/config','Selector/read model','Presenter','Formatter']
table=f"MEASURED structural snapshot: {len(x['files'])} files under `src/`, excluding SECRETS-prefixed names.\n\n| Code | Palette | Sites | Files |\n| --- | --- | ---: | ---: |\n"
for i,(ab,rs) in enumerate(cats.items()):table+=f"| ER18-C{i+1} | {ab}: {titles[i]} | {len(rs)} | {len({r['file'] for r in rs})} |\n"
raw=raw.replace('{{COUNTS}}',table.strip())
for i,(ab,rs) in enumerate(cats.items()):
 raw+=f'\n### ER18-I{i+1}: {ab} {titles[i]}\n\n'
 raw+='| READ file | Symbols / sites (line) |\n| --- | --- |\n'
 grouped=collections.defaultdict(list)
 for r in rs:grouped[r['file']].append(r)
 for f,rows in grouped.items():
  details='; '.join(f"`{r['symbol']}` (`{f}:{r['line']}`, {r['kind']})" for r in rows)
  raw+=f'| `{f}` | {details} |\n'
Path('docs/research/ABSTRACTION_INVENTORY_2026-10-14.md').write_text(raw)
(lane/'anchors.json').write_text(json.dumps(anchors,indent=2)+'\n')
print('Rendered',len(anchors),'explicit anchors;',len(raw.splitlines()),'lines;',len(raw.encode()),'bytes')
