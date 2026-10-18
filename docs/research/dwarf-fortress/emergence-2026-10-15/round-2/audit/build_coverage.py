import json,hashlib,re
from pathlib import Path
out=Path(__file__).resolve().parent;old=out.parents[1]/'audit/READ_COVERAGE.json';data=json.loads(old.read_text());root=Path(data['source_root'])
added={'data/init/globals.lua':[[1,48]],'data/init/generators.lua':[[690,810]],'data/vanilla/vanilla_procedural/scripts/generators/interactions.lua':[[280,287]],'data/vanilla/vanilla_procedural/scripts/generators/interactions/item_power.lua':[[1,436]],'data/vanilla/vanilla_procedural/scripts/generators/interactions/mythical.lua':[[1,298]],'data/vanilla/vanilla_reactions/objects/reaction_other.txt':[[165,265],[439,550]]}
def merged(rs):
 r=[]
 for a,b in sorted(rs):
  if r and a<=r[-1][1]+1:r[-1][1]=max(r[-1][1],b)
  else:r.append([a,b])
 return r
by={s['file']:s for s in data['sources']}
for f,spans in added.items():
 if f not in by:
  b=(root/f).read_bytes();by[f]=dict(id='S'+str(len(by)+1).zfill(2),file=f,path=str(root/f),sha256=hashlib.sha256(b).hexdigest(),lines=len(b.decode().splitlines()),read_spans=[],layer='shipped-readable-generator')
 s=by[f];s['prior_read_spans']=s['read_spans'];s['round_2_read_spans']=spans;s['read_spans']=merged(s['read_spans']+spans)
data['sources']=list(by.values());data['status']='cumulative-prior-auditor-plus-round-2-selected-reads';data['prior_ledger']=str(old);(out/'READ_COVERAGE.json').write_text(json.dumps(data,indent=2)+'\n')
unread=[]
for p in sorted(root.rglob('*')):
 if not p.is_file():continue
 f=str(p.relative_to(root));n=len(p.read_bytes().decode('utf-8',errors='replace').splitlines());s=by.get(f);rs=s['read_spans'] if s else [];read=set(i for a,b in rs for i in range(a,b+1));gaps=[];start=None
 for i in range(1,n+2):
  if i<=n and i not in read:
   if start is None:start=i
  elif start is not None:gaps.append([start,i-1]);start=None
 unread.append(dict(file=f,status='fully-read' if not gaps else 'partially-read' if rs else 'captured-unread',unread_lines=gaps))
(out/'UNREAD.json').write_text(json.dumps(dict(scope='Cumulative this auditor round1 plus round2; extraction and aspects reads remain independently owned, not silently merged.',source_files=len(unread),selected_files=len(by),files=unread,native_gaps=['Native syndrome apply/stack/expire/reverse and body/item reconciliation','Native effect source ownership and detached effect contribution removal','Native job reservation, cancellation/refund and output insertion','Native NPC action choice and actor information','Native active loader, binding overrides and actual generated output','Transform/death/summon lifecycle, offscreen and save/reload']),indent=2)+'\n')
f='data/vanilla/vanilla_procedural/scripts/generators/interactions/item_power.lua';lines=(root/f).read_text().splitlines();starts=[(i,re.match(r'interactions.mythical_item_power\.(\w+)=',l).group(1)) for i,l in enumerate(lines,1) if re.match(r'interactions.mythical_item_power\.(\w+)=',l)];rows=[]
for j,(a,name) in enumerate(starts):
 z=starts[j+1][0]-1 if j+1<len(starts) else 421;text='\n'.join(lines[a-1:z]);rows.append(dict(name=name,file=f,lines=[a,z],spheres=re.findall(r'([A-Z_]+)=true',text),emitted_effect_tokens=re.findall(r'"\[(CE_[^"\]]+)\]',text),active_wait_fields=re.findall(r'"\[IS_CDI:WAIT_PERIOD:(\d+)\]',text),limits='Lexical reference, no generator execution, no actual item binding or AI consumer.'))
(out/'ITEM_POWER_ROWS.json').write_text(json.dumps(rows,indent=2)+'\n')
