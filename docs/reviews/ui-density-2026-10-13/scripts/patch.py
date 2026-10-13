import json,sys,random
S=sys.argv[1]
both=[l.split(' | ') for l in open(S+'/out/i_both.txt').read().strip().split('\n')]
pick=lambda t,n:[x[0] for x in both if x[1]==t][:n]
equip=pick('Armor',8)[2:8]+pick('Shield',3)[:2]+pick('Cape',1)
other=pick('Material',9)+pick('UsableItem',7)+pick('Book',1)
def inv():
  d={}
  for i,x in enumerate(equip): d[json.dumps({"id":x,"quality":[60,80,100,120][i%4]},separators=(',',':'))]={"count":1+(i%2)}
  for i,x in enumerate(other): d[json.dumps({"id":x},separators=(',',':'))]={"count":[3,1,12,5,2][i%5]}
  return d
SK=['Combat','Evasion','Pest killer','Running','Weightlifting','Swimming','Woodcutting','Fishing','Haggling','Persistence','Fieldwork','Crafting','Cooking','Smelting']
for b,fn in [('original','orig'),('v06','v06'),('current','current')]:
  o=json.load(open(f'{S}/out/{fn}_after_elder.json'))
  o['global_flags']['is_crafting_unlocked']=True;o['global_flags']['is_gathering_unlocked']=True
  o['character']['money']=5000
  if b=='original':
    o['character']['inventory'].update(inv())
    for i,s in enumerate(SK):
      if s in o['skills']: o['skills'][s]['total_xp']=200*(i+1)**2
  else:
    o['inventories']['person']['main_character'].update(inv())
    sx=o['levels']['person']['main_character']['skill_xp']
    for i,s in enumerate(SK):
      if s in sx: sx[s]=200*(i+1)**2
  json.dump(o,open(f'{S}/out/{fn}_progressed.json','w'))
  print(b,'items',len(o['character'].get('inventory') or o['inventories']['person']['main_character']))
print('equip',equip);print('other',other)
