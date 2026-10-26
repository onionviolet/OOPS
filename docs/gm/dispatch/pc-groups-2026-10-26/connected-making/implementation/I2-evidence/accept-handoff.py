from pathlib import Path
import hashlib,json,os
root=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks')
thread='01a1794e-8fc7-7c20-b0d0-710380c25b67'
slots=[]
for name in ['slot-1','slot-2']:
 p=root/name
 if p.exists() and json.loads((p/'owner.json').read_text()).get('thread')==thread:slots.append(p)
if len(slots)!=1:raise SystemExit('No unique acknowledged slot transfer to G1-I2.')
slot=slots[0];old=json.loads((slot/'owner.json').read_text())
paths=sorted(['src/craft_experiment_log.js','src/craft_reference.js','tests/craft_depth_rules.test.js','tests/craft_reference.test.js'])
owned=[]
try:
 for path in paths:
  digest=hashlib.sha256(path.encode()).hexdigest()
  if (root/('path-'+digest)).exists():raise FileExistsError(path)
  lock=root/digest;lock.mkdir();owned.append(lock)
  (lock/'owner.json').write_text(json.dumps({'lane':'G1-I2','thread':thread,'path':path,'acquiredByPid':os.getpid()}))
except FileExistsError:
 for lock in owned:(lock/'owner.json').unlink();lock.rmdir()
 raise SystemExit('Per-path contention; all partial acquisitions released, slot preserved.')
meta={**old,'lane':'G1-I2','thread':thread,'phase':'acknowledged log/reference helper source-only slice','paths':paths,'acquiredByPid':os.getpid()}
(slot/'owner.json').write_text(json.dumps(meta,indent=2)+'\n')
out=Path('docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/I2-evidence')
(out/'accepted-handoff.json').write_text(json.dumps({'slot':str(slot),'before':old,'after':meta},indent=2)+'\n')
(out/'helper-before.json').write_text(json.dumps({p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in paths},indent=2)+'\n')
print(json.dumps({'slot':str(slot),'paths':paths}))
