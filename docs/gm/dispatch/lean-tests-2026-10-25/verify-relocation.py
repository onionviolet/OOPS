from pathlib import Path
import json,re,subprocess,sys
root=Path.cwd();maps=[]
for f in sorted((root/'docs/gm/dispatch/lean-tests-2026-10-25').glob('relocation-*.json')):maps+=json.loads(f.read_text())
base='9b997ea60a7eb12200dbc825684e6668403aa015'
# Every complete moved body must remain literal after import removal; split cases
# compare complete original registration blocks with all assertion expressions.
def body(s):return re.sub(r'^import[\s\S]*?;\n','',s,flags=re.M)
def blocks(s):
 b=body(s);ms=list(re.finditer(r'^test\(',b,re.M))
 return [b[m.start():ms[i+1].start() if i+1<len(ms) else len(b)].strip() for i,m in enumerate(ms)]
origins={m['source'] for m in maps if subprocess.run(['git','cat-file','-e',f'{base}:{m["source"]}'],capture_output=True).returncode==0}
def destinations(path,seen=None):
 seen=seen or set()
 edges=[m['destination'] for m in maps if m['source']==path and m['destination']!=path]
 if not edges:return {path}
 return set().union(*(destinations(e,seen|{path}) for e in edges if e not in seen))
checks=[]
for src in sorted(origins):
 old=subprocess.check_output(['git','show',f'{base}:{src}'],text=True)
 dests=destinations(src);texts={d:Path(d).read_text() for d in dests}
 for i,b in enumerate(blocks(old),1):
  # Imported declarations between registrations may move to the unified header.
  retained=[d for d,s in texts.items() if b in body(s)]
  if len(retained)!=1:raise SystemExit(f'{src} case {i}: retained in {retained}, expected exactly once among {dests}')
  checks.append((src,i,retained[0]))
print(f'Exact registration-block preservation: {len(checks)} cases from {len(origins)} base files; every assertion retained once.')
# Base npm runner uses *.test.js. Record unchanged discovery names/titles separately.
print('All destinations match npm test glob:',all(Path(d).name.endswith('.test.js') and Path(d).parent==Path('tests') for _,_,d in checks))
