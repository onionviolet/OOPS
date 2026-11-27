// Definition evidence, separate from cast place presence and played proof.
export function registeredTravel(places,commands){
 const known=new Map(places.map(p=>[p.id,p])),groups=new Map();
 const group=name=>{if(!groups.has(name))groups.set(name,{group:name,native:new Set(),relocation:new Set(),commands:new Set(),places:new Set()});return groups.get(name);};
 const edge=(from,to,family,command)=>{if(from===to||!known.has(from)||!known.has(to)||known.get(from).group!==known.get(to).group)return;
  const out=group(known.get(from).group);out[family].add(JSON.stringify([from,to]));out.places.add(from);out.places.add(to);if(command)out.commands.add(command);
 };
 for(const p of places)for(const route of p.routes||[])edge(p.id,typeof route==='string'?route:route.dest??route.id,'native');
 for(const c of commands)if(c.actorId==='player'&&known.has(c.location))for(const effect of c.effects||[])
  if(effect.type==='relocate'&&[undefined,'player','$actor'].includes(effect.actor))edge(c.location,effect.location,'relocation',c.id);
 return [...groups.values()].map(g=>({group:g.group,nativeEdges:g.native.size,relocationEdges:g.relocation.size,
  directedEdges:new Set([...g.native,...g.relocation]).size,commands:g.commands.size,places:g.places.size})).sort((a,b)=>a.group.localeCompare(b.group));
}
export function nativeTravelReport(places,locations,commands,measuredAt){
 const ids=new Map(Object.entries(locations).map(([id,p])=>[p,id]));
 const connected=places.map(p=>({...p,routes:[...(locations[p.id]?.connected_locations||[]).map(r=>ids.get(r.location)),ids.get(locations[p.id]?.parent_location)].filter(Boolean)}));
 return {schema:'atlas-registered-travel/1',measuredAt,worlds:registeredTravel(connected,commands),
  basis:'Registered native connections and explicit player relocation command effects between admitted native locations. Includes conditional and story-gated movement; not a current-availability or played-proof verdict.'};
}
export function selectRegisteredTravel(snapshot,leaf,snapshotSha256){
 const valid=report=>report?.schema==='atlas-registered-travel/1'&&Array.isArray(report.worlds);
 const embedded=valid(snapshot?.registeredTravel)?snapshot.registeredTravel:null;
 const matching=valid(leaf)&&snapshotSha256&&leaf.snapshotSha256===snapshotSha256;
 if(matching&&(!embedded||Date.parse(leaf.measuredAt)>Date.parse(embedded.measuredAt)))return {...leaf,status:'measured',source:'standalone'};
 if(embedded)return {...embedded,snapshotSha256:snapshotSha256||null,status:'measured',source:'snapshot'};
 return valid(leaf)?{...leaf,status:'stale',source:'standalone'}:null;
}
