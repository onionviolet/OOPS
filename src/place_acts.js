// Ordinary work on objects at a place, expressed through simulation commands.
// Definitions carry world-specific facts/text; simulation owns time, cost and effects.
const operations=new Set(['inspect','pay','use','wash','clean','consume','store','take']);
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
export function definePlaceActs(data,{worldId,actorId='player',group,situationId,requires=null}={}){
 if(!validId(worldId)||!validId(actorId)||!validId(group)||!validId(situationId))throw Error('Invalid place act binding.');
 const ids=new Set();
 return (data?.acts||[]).map(row=>{
  if(!validId(row.id)||ids.has(row.id)||!operations.has(row.operation)||!validId(row.place)||
   !Number.isSafeInteger(row.minutes)||row.minutes<1||!row.label||!row.description||!row.report||!validId(row.knowledgeKey))throw Error('Invalid place act.');
  ids.add(row.id);
  const guard={all:[...(requires?[requires]:[]),...(row.requires?[row.requires]:[])]};
  return {id:row.id,revision:1,label:row.label,description:row.description,group,actorId,worldId,location:row.place,
   once:false,duration:row.minutes,cancellation:'refund',requires:guard,
   // Keep a blocked local affordance visible, including missing means/order.
   visibleWhen:requires||{fact:'actor.life',op:'eq',value:'alive'},
   completionRequires:guard,completionCoLocated:true,completionFailure:'refund',
   costs:structuredClone(row.costs||[]),effects:[...structuredClone(row.effects||[]),
    {type:'knowledge',actor:actorId,key:row.knowledgeKey,stage:'seen',value:row.report,
     basis:{kind:'observation',attributedTo:actorId,situationId}}]};
 });
}
// Called on a caller-owned plan. Existing facts/resources are retained on upgrade.
// No timers, extra inventories or separate save slice are introduced.
export function seedPlaceObjects(state,data,worldId){
 const facts=state.worlds?.[worldId]?.facts;if(!facts||!data)return false;
 let changed=false;
 for(const row of data.objects||[]){
  if(!validId(row.id))throw Error('Invalid place object.');
  const marker=`place.act.seed.${row.id}`;if(facts[marker])continue;
  if([...(row.resources||[]),...(row.actorFacts||[])].some(r=>!state.actors?.[r.actor]))continue;
  for(const [key,value] of Object.entries(row.facts||{}))if(!Object.hasOwn(facts,key))facts[key]=structuredClone(value);
  for(const r of row.resources||[]){const resources=state.actors[r.actor].resources;
   if(!Object.hasOwn(resources,r.key))resources[r.key]=r.amount;}
  for(const r of row.actorFacts||[]){const owned=state.actors[r.actor].facts;
   if(!Object.hasOwn(owned,r.key))owned[r.key]=structuredClone(r.value);}
  facts[marker]=true;changed=true;
 }
 return changed;
}
// A container changes the actual object's exposure. G2 may combine this with
// observer skill, attention and knowledge; it is not an automatic detection roll.
export function objectNoticeability(state,worldId,object,{searching=false}={}){
 const facts=state.worlds?.[worldId]?.facts||{},inside=facts[object.containerFact];
 const exposure=inside?facts[object.exposureFact]:1;
 return {container:inside??null,exposure:typeof exposure==='number'?exposure:null,
  searchable:searching&&!!inside};
}
export function quotePlaceActs(state,commands,data,preview,{blocked='',decide=()=>({allowed:true})}={}){
 const place=state.simulation?.people?.player?.location;
 return commands.filter(d=>d.location===place).map(d=>{
  const row=data.acts.find(r=>r.id===d.id),q=preview(d),decision=decide(d);
  const reasons=[...(q.reasons||[]).map(r=>r.startsWith('Insufficient ')&&row.costReason?row.costReason:r),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return {id:d.id,label:`${d.label} · ${q.duration??d.duration} min · ${row.costLabel||'no stock spent'}`,
   description:row.description,eligible:q.visible&&q.eligible&&!blocked&&decision.allowed,reasons,duration:q.duration??d.duration};
 });
}
// Knowledge is written by command settlement. Publish its receipt once through
// the host's existing Reports port; preview/reload/re-filter cannot duplicate it.
export function pendingPlaceActReports(state,data,worldId){
 const facts=state.worlds?.[worldId]?.facts||{};
 return (data?.acts||[]).some(row=>{const k=state.simulation?.knowledge?.player?.[row.knowledgeKey];
  return k&&facts[`place.act.reported.${row.id}`]!==k.cause;});
}
export function settlePlaceActReports(state,data,worldId){
 const facts=state.worlds?.[worldId]?.facts,reports=[];if(!facts)return reports;
 for(const row of data?.acts||[]){
  const k=state.simulation?.knowledge?.player?.[row.knowledgeKey],marker=`place.act.reported.${row.id}`;
  if(!k||facts[marker]===k.cause)continue;
  facts[marker]=k.cause;
  reports.push({text:k.value,at:k.at,kind:'events',actor:'player',place:row.place});
 }
 return reports;
}
