import pathlib,json,hashlib
root=pathlib.Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/locks')
meta={'lane':'G7-L3','thread':'01a1794a-8b76-7ca3-803b-96d8c1e71dca'}
slot=None
for i in [1,2]:
 p=root/f'slot-{i}'
 try:p.mkdir();(p/'owner.json').write_text(json.dumps(meta));slot=p;break
 except FileExistsError:pass
if not slot:print('WAIT: both runtime slots occupied');raise SystemExit()
paths=sorted(['src/world_packs/book_mol_pack.js','src/book_world_mol_lore.js','src/book_world_mol_actions.js','tests/mol_lore_traces.test.js'])
claimed=[]
for name in paths:
 p=root/hashlib.sha256(name.encode()).hexdigest()
 if (root/('path-'+p.name)).exists():print('WAIT path',name);break
 try:p.mkdir();(p/'owner.json').write_text(json.dumps({**meta,'path':name}));claimed.append(p)
 except FileExistsError:print('WAIT path',name);break
else:
 out=pathlib.Path('docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L3/LOCKS.json');out.write_text(json.dumps({'slot':str(slot),'paths':[str(p) for p in claimed]},indent=2)+'\n');print('ACQUIRED',slot.name,paths);raise SystemExit()
for p in claimed+[slot]:(p/'owner.json').unlink();p.rmdir()
