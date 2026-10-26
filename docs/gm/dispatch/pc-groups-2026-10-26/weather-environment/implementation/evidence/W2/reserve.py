from pathlib import Path
import time,json,hashlib
base=Path(__file__).resolve().parent;root=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks');paths=sorted(['src/home_building_model.js','src/home_domain.js','src/weather_calendar.js','tests/home_weather.test.js','tests/home_domain.test.js'])
for i in range(50):
 for n in [1,2]:
  slot=root/f'slot-{n}'
  try:slot.mkdir()
  except FileExistsError:continue
  meta={'lane':'G6-W2','thread':'01a1794d-9355-7f53-8c4b-12a067d142fb','phase':'home weather boundary slice'};(slot/'owner.json').write_text(json.dumps(meta));held=[]
  for p in paths:
   d=root/hashlib.sha256(p.encode()).hexdigest()
   try:d.mkdir()
   except FileExistsError:break
   (d/'owner.json').write_text(json.dumps({**meta,'path':p}));held.append(d)
  else:
   r={'slot':str(slot),'paths':paths,'locks':[str(p) for p in held]};(base/'reservation.json').write_text(json.dumps(r,indent=2));print(json.dumps(r));raise SystemExit
  for d in held:(d/'owner.json').unlink();d.rmdir()
  (slot/'owner.json').unlink();slot.rmdir()
 time.sleep(1)
print('Slots remain occupied; no locks acquired')
