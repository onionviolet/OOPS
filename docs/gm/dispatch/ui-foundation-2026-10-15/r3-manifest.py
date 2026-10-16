from pathlib import Path
import hashlib,json,sys,datetime
base=Path('docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r3')
paths=sorted([*Path('src').rglob('*.js'),*Path('styles').rglob('*.css'),Path('style.css'),Path('build.js')])
current={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
if sys.argv[1]=='before':
 (base/'window-before.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':current},indent=2))
else:
 before=json.loads((base/'window-before.json').read_text());drift=[p for p,h in current.items() if before['files'].get(p)!=h];
 (base/'window-after.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'drift':drift,'files':current},indent=2));print('DRIFT',drift);assert not drift
