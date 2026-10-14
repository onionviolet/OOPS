"""Structural checks for this docs-only lane; all writes stay beside this script."""
from pathlib import Path
from collections import Counter
import json, re
OUT=Path(__file__).resolve().parent
B1=OUT.parent/'b1'
coverage=json.loads((OUT/'COVERAGE.json').read_text())
worlds={p.stem.removeprefix('WORLD_'):p for p in OUT.glob('WORLD_*.md')}
slugs={p.stem.removeprefix('WORLD_') for p in B1.glob('WORLD_*.md')}
errors=[]
status_count=Counter()
matrix=(OUT/'MATRIX.md').read_text()
rows={}
for line in matrix.splitlines():
    if line.startswith('| [') and '`' in line:
        slug=re.search(r'`([^`]+)`',line).group(1)
        cells=[x.strip() for x in line.strip('|').split('|')][1:]
        if slug in rows:errors.append(f'duplicate matrix slug {slug}')
        rows[slug]=cells
if set(rows)!=slugs:errors.append('matrix does not match B1 roster')
for slug,cells in rows.items():
    expected=list(coverage['worlds'][slug]['codes'].values())
    if cells!=expected or len(cells)!=12:errors.append(f'matrix mismatch {slug}')
    status_count.update(cells)
for slug,p in worlds.items():
    s=p.read_text()
    codes=re.findall(r'^\| (SO\d+) ',s,re.M)
    if codes!=[f'SO{i}' for i in range(1,13)]:errors.append(f'SO coverage {slug}')
    for variable in ['Quality','Freshness','Purity','Compatibility','Provenance']:
        if f'| {variable} |' not in s:errors.append(f'{slug} missing {variable}')
    for section in ['Scope and source locators','Five sourcing variables','SO1-SO12 routes','Default, dial and local response','Open source/use gate']:
        if f'## {section}' not in s:errors.append(f'{slug} missing {section}')
    found={m.group(1):m.group(2) for m in re.finditer(r'^\| (SO\d+) [^|]+\| ([BPLU]) \|',s,re.M)}
    if found!=coverage['worlds'][slug]['codes']:errors.append(f'note status mismatch {slug}')
links=0
for p in OUT.glob('*.md'):
    s=p.read_text()
    if '\u2014' in s:errors.append(f'em dash in {p.name}')
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',s):
        if target.startswith(('http:','https:','#')):continue
        path=target.split('#',1)[0]
        links+=1
        if not (p.parent/path).exists():errors.append(f'missing link {p.name}: {target}')
chains=re.findall(r'^## (C\d+) ',(OUT/'CHAINS.md').read_text(),re.M)
if chains!=[f'C{i}' for i in range(1,10)]:errors.append('chain IDs')
if len(worlds)!=37 or len(slugs)!=72:errors.append('coverage count')
result={'status':'PASS' if not errors else 'FAIL','b1_worlds':len(slugs),'world_notes':len(worlds),'matrix_only':len(slugs)-len(worlds),'matrix_cells':sum(map(len,rows.values())),'status_counts':dict(status_count),'causal_chains':len(chains),'local_links_checked':links,'checks':['exact B1 slug roster','twelve cells per matrix row','note/matrix/coverage status agreement','twelve SO codes and five variables per world note','required note sections','C1-C9 unique ordered chains','local file link targets exist','no em dashes in Markdown'],'errors':errors,'not_verified':['anchor semantics','primary source claims','source fidelity','runtime','build','browser','save/import','human acceptance']}
(OUT/'DOC_CHECKS.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
