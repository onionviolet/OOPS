"""Documentation/asset checks only; does not import or exercise YAIR."""
from pathlib import Path
import collections, hashlib, json, re, subprocess
HERE=Path(__file__).resolve().parent
LANE=HERE.parents[1]/'around-you.md'
ROOT=next(p for p in HERE.parents if (p/'src').is_dir() and (p/'PROJECT.md').is_file())
s=LANE.read_text();errors=[];local_links=[];repo_refs=[]
for href in re.findall(r'\]\(([^)]+)\)',s):
    if '://' not in href:
        dest=(LANE.parent/href.split('#')[0]).resolve();local_links.append(str(dest))
        if not dest.exists():errors.append('Missing local link: '+href)
for f,l in re.findall(r'((?:src|docs)/[A-Za-z0-9_./-]+\.(?:js|md)):(\d+)',s):
    p=ROOT/f;repo_refs.append(f+':'+l)
    if not p.exists() or int(l)>len(p.read_text().splitlines()):errors.append('Invalid reference: '+f+':'+l)
counts=collections.Counter(re.findall(r'^\| AW(?:6\d|7\d|80) \| ([1-5]),',s,re.M))
if dict(counts)!={'1':5,'2':6,'3':5,'4':5}:errors.append('Triage counts differ')
for section in ['## Summary','## Findings table','## Proposed plan edits','## Settled without asking','## Questions for Weibao']:
    if section not in s:errors.append('Missing section '+section)
summary=s.split('## Summary\n',1)[1].split('\n## ',1)[0]
if len([l for l in summary.splitlines() if l.strip()])>5:errors.append('Summary exceeds five lines')
for scene in json.loads((HERE/'render-receipt.json').read_text())['results']:
    for field,name in [('htmlSha256',scene['html']),('pngSha256',scene['png'])]:
        if hashlib.sha256((HERE/name).read_bytes()).hexdigest()!=scene[field]:errors.append('Asset hash drift '+name)
private=ROOT/'docs/research/scroll-of-taiwu/private/aw-mapdomain-2026-10-16.md'
ignored=subprocess.run(['git','check-ignore','--quiet',str(private)],cwd=ROOT).returncode==0
if not ignored:errors.append('Private Taiwu evidence is not ignored')
whitespace=subprocess.run(['git','diff','--no-index','--check','/dev/null',str(LANE)],cwd=ROOT,capture_output=True,text=True)
whitespace_ok=whitespace.returncode in (0,1) and not (whitespace.stdout+whitespace.stderr).strip()
if not whitespace_ok:errors.append('Whitespace check: '+whitespace.stdout+whitespace.stderr)
receipt={'scope':'Documentation, links, citation bounds, triage and asset hash checks only; no build/tests/game/save operations',
 'localLinks':len(local_links),'repoCitationStarts':len(repo_refs),'triage':{**dict(counts),'5':0},'taiwuPrivateIgnored':ignored,'whitespacePass':whitespace_ok,
 'laneSha256':hashlib.sha256(LANE.read_bytes()).hexdigest(),'errors':errors}
(HERE/'documentation-checks.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt,indent=2))
if errors:raise SystemExit(1)
