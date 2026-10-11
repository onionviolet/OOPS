"""Read-only artifact/source locator checks; does not execute game code."""
from pathlib import Path
import re, json, hashlib, subprocess, datetime
root=Path(__file__).resolve().parent
sources=json.loads((root/'SOURCES.json').read_text())
lookup={r['url'].removesuffix('.git').removeprefix('https://github.com/').lower():r for r in sources['repos']}
errors=[]; checked=[]; local=[]
for doc in sorted(root.glob('*.md')):
    text=doc.read_text()
    for match in re.finditer(r'https://github\.com/([^/]+/[^/]+)/blob/([0-9a-f]{40})/([^\s)#]+)(?:#L(\d+)(?:-L(\d+))?)?',text):
        repo,sha,path,start,end=match.groups()
        record=lookup.get(repo.lower())
        if not record or record['sha']!=sha:
            errors.append(f'{doc.name}: unknown snapshot {match.group()}');continue
        target=Path(record['clone_dir'])/path
        if not target.is_file():
            errors.append(f'{doc.name}: missing source {target}');continue
        count=len(target.read_text(errors='replace').splitlines())
        if start and not (1<=int(start)<=int(end or start)<=count):
            errors.append(f'{doc.name}: invalid line range {match.group()}')
        checked.append({'document':doc.name,'url':match.group(),'file_lines':count})
    for target in re.findall(r'\]\(([^)]+)\)',text):
        if '://' in target or target.startswith('#'):continue
        path=target.split('#')[0]
        if path and not (doc.parent/path).exists():errors.append(f'{doc.name}: missing local target {target}')
        local.append({'document':doc.name,'target':target})
for record in sources['repos']:
    clone=record['clone_dir']
    git=lambda *args:subprocess.check_output(['git','-C',clone,*args],text=True).strip()
    if git('rev-parse','HEAD')!=record['sha']:errors.append(f'{clone}: snapshot drift')
    if git('rev-parse','--is-shallow-repository')!='true':errors.append(f'{clone}: not shallow')
    if git('status','--porcelain'):errors.append(f'{clone}: clone not clean')
baseline=json.loads((root/'INPUT_SNAPSHOT.json').read_text())
workspace=root.parents[2]
input_drift=[]
for path,sha in baseline['inputs'].items():
    now=hashlib.sha256((workspace/path).read_bytes()).hexdigest()
    if now!=sha:input_drift.append({'path':path,'before':sha,'now':now})
touches=len(re.findall(r'^\| T\d+ \|',(root/'SMALL_TOUCHES.md').read_text(),re.M))
proposals=len(re.findall(r'^\| [1-8] / P\d+ \|',(root/'PROPOSALS.md').read_text(),re.M))
if touches<20:errors.append('fewer than 20 curated touches')
if not 5<=proposals<=10:errors.append('ranked proposals out of requested range')
result={'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'static locator, artifact completeness, source snapshot and clone checks only','status':'pass' if not errors else 'fail','errors':errors,'clones_checked':len(sources['repos']),'pinned_locators_checked':len(checked),'unique_pinned_locators':len({r['url'] for r in checked}),'local_targets_checked':len(local),'curated_touches':touches,'ranked_proposals':proposals,'input_drift':input_drift,'runtime_checks':'not run; research-only assignment','source_locators':checked}
(root/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='source_locators'},indent=2))
raise SystemExit(bool(errors))
