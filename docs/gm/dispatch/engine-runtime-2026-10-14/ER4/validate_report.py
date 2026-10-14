from pathlib import Path
import re,json,hashlib
lane=Path(__file__).resolve().parent
root=lane.parents[4]
report=root/'docs/research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md'
s=report.read_text()
revs=json.loads((lane/'VERIFIED_SOURCE_REVISIONS.json').read_text())
byrepo={x['repo']:k for k,x in revs.items()}
refs=re.findall(r'https://github.com/([^/]+/[^/]+)/blob/([a-f0-9]{40})/([^)#]+)#L(\d+)-L(\d+)',s)
for repo,sha,path,a,z in refs:
 key=byrepo[repo]
 assert sha==revs[key]['sha'],(repo,'revision mismatch')
 p=lane/'sources'/key/path
 assert p.exists(),p
 assert 0<int(a)<=int(z)<=len(p.read_text().splitlines()),(p,a,z)
profiles=re.split(r'^### ER4-G\d+: ',s,flags=re.M)[1:]
assert len(profiles)==19
labels=['Tick model','Offline / background catch-up','Big numbers','Save format / migration','Simulation LOD','Determinism','UI update model']
for profile in profiles:
 for label in labels:assert profile.count('| '+label+' |')==1,(profile[:50],label)
assert '—' not in s and ' -- ' not in s
assert len(re.findall(r'^\| ER4-L\d+ /',s,re.M))==9
assert len(re.findall(r'^\| ER4-N\d+ \|',s,re.M))==8
local=re.findall(r'\]\(([^)]+)\)',s)
checked=0
for target in local:
 if target.startswith(('https://','http://')):continue
 p=report.parent/target.split('#')[0]
 assert p.exists(),p
 checked+=1
files={}
for p in (lane/'sources').rglob('*'):
 if p.is_file() and '.git' not in p.parts:
  files[str(p.relative_to(lane))]=hashlib.sha256(p.read_bytes()).hexdigest()
(lane/'SOURCE_SHA256.json').write_text(json.dumps(files,indent=2)+'\n')
summary=f'PASS: 19 profiles; 133 dimension rows; {len(refs)} pinned source ranges valid; 9 lesson mappings; 8 new ideas; {checked} local links resolve; style checks pass. Source-reading evidence only, not runtime or performance validation.\n'
(lane/'VALIDATION.txt').write_text(summary)
print(summary,end='')
