from pathlib import Path
import json,time,datetime,hashlib,sys
ROOT=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks')
OWNER={'lane':'L4','thread':'01a178b9-c5da-7831-8d68-f87f8b3da153'}
paths=sorted(sys.argv[1:] or ['src/book_world_lotm_districts.js','tests/lotm_power_work.test.js'])
end=time.monotonic()+50
while time.monotonic()<end:
 for n in (1,2):
  slot=ROOT/f'slot-{n}'
  try:slot.mkdir()
  except FileExistsError:continue
  (slot/'owner.json').write_text(json.dumps({**OWNER,'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}))
  locks=[]
  try:
   for rel in paths:
    h=hashlib.sha256(rel.encode()).hexdigest()
    if (ROOT/('path-'+h)).exists():raise FileExistsError(rel)
    p=ROOT/h;p.mkdir();locks.append(p)
    (p/'owner.json').write_text(json.dumps({**OWNER,'path':rel}))
  except FileExistsError:
   for p in locks:
    (p/'owner.json').unlink(missing_ok=True);p.rmdir()
   (slot/'owner.json').unlink();slot.rmdir();continue
  own={'slot':str(slot),'paths':paths,'locks':[str(p) for p in locks]}
  Path(__file__).with_name('reservation.json').write_text(json.dumps(own,indent=2)+'\n')
  with Path(__file__).parent.parent.joinpath('L4.md').open('a') as f:f.write('\nReservation acquired: `'+str(slot)+'`; paths '+', '.join('`'+p+'`' for p in paths)+'. Per-path SHA256 locks, owner L4.\n')
  print('ACQUIRED',slot,flush=True);raise SystemExit(0)
 time.sleep(1)
print('Still waiting');raise SystemExit(2)
