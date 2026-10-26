import pathlib,time,json,hashlib,os,sys
root=pathlib.Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks')
paths=sorted(sys.argv[1:])
for attempt in range(550):
 for n in [1,2]:
  slot=root/f'slot-{n}'
  try:slot.mkdir()
  except FileExistsError:continue
  meta={'lane':'G1-I2','thread':'01a1794e-8fc7-7c20-b0d0-710380c25b67','pid':os.getpid(),'phase':'experiment observations/comparison'}
  (slot/'owner.json').write_text(json.dumps(meta));owned=[]
  try:
   for p in paths:
    key=hashlib.sha256(p.encode()).hexdigest()
    if (root/f'path-{key}').exists():raise FileExistsError(p)
    lock=root/key;lock.mkdir();owned.append(lock)
    (lock/'owner.json').write_text(json.dumps({**meta,'path':p}))
  except FileExistsError:
   for lock in owned:(lock/'owner.json').unlink();lock.rmdir()
   (slot/'owner.json').unlink();slot.rmdir();continue
  print(json.dumps({'acquired':str(slot),'paths':paths}),flush=True);raise SystemExit
 time.sleep(.1)
print('No free slot in bounded wait; no ownership acquired.')
