from pathlib import Path
import json,hashlib,time
r=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks')
paths=sorted(['src/crafting_frontier_runtime.js','src/craft_failure_ledger.js','src/craft_ledger_domain.js','src/crafting_home.js','tests/crafting_runtime.test.js','tests/craft_failure_ledger.test.js'])
for attempt in range(101):
 a=[]
 for k in ['slot-1','slot-2']:
  try:(r/k).mkdir()
  except FileExistsError:continue
  (r/k/'owner.json').write_text(json.dumps({'lane':'G1-I1','thread':'01a1794e-38da-7351-94b8-b86a6f5d307b'}));a.append(k);break
 if a:
  try:
   for p in paths:
    k=hashlib.sha256(p.encode()).hexdigest();(r/k).mkdir();a.append(k);(r/k/'owner.json').write_text(json.dumps({'lane':'G1-I1','path':p,'thread':'01a1794e-38da-7351-94b8-b86a6f5d307b'}))
   print('ACQUIRED',a[0]);break
  except FileExistsError:
   for k in reversed(a):(r/k/'owner.json').unlink();(r/k).rmdir()
 if attempt<100:time.sleep(.5)
else:
 for k in ['slot-1','slot-2']:print(k,(r/k/'owner.json').read_text())
