from pathlib import Path
import json
p=Path(__file__).with_name('reservation.json');own=json.loads(p.read_text())
for name in [*own['locks'],own['slot']]:
 d=Path(name);record=json.loads((d/'owner.json').read_text());assert record.get('lane')=='L4' and record.get('thread')=='01a178b9-c5da-7831-8d68-f87f8b3da153'
for name in [*own['locks'],own['slot']]:
 d=Path(name);(d/'owner.json').unlink();d.rmdir()
with Path(__file__).parent.parent.joinpath('L4.md').open('a') as f:f.write('\nRELEASED '+own['slot']+' and exact paths '+', '.join('`'+x+'`' for x in own['paths'])+'. Source custody is released at this checkpoint.\n')
p.rename(p.with_name('last-released-reservation.json'));print('Released L4 reservations only')
