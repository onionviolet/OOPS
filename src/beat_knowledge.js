// World-general pack-to-knowledge adapter. The host supplies actual witnesses
// and the existing knowledge effect writer; neither truth nor display is a store.
export function beatKnowledgeWrites(beat,result,{at,present=[],playerExposure=null,actor=id=>id}={}){
 if(!['carried','altered'].includes(result.status))return [];
 // An altered outcome must author its own knowledge; canon knowledge would lie.
 const rows=result.status==='altered'?beat.altered?.[result.altered]?.knows:beat.knows;
 const writes=[];
 for(const k of rows||[]){
  if(typeof k.key!=='string'||typeof k.value!=='string')throw Error('Beat knowledge needs a key and text.');
  const recipients=k.audience==='present'?[beat.actor,...present]:[k.actor||beat.actor];
  if(k.witnesses?.includes(playerExposure))recipients.push('player');
  for(const id of new Set(recipients.map(actor))){
   if(id==='player'&&!k.witnesses?.includes(playerExposure))continue;
   writes.push({at,cause:beat.id,effect:{type:'knowledge',actor:id,key:k.key,
    stage:k.stage||'seen',value:k.value}});
  }
 }
 return writes;
}
export function applyBeatKnowledge(plan,writes,write){
 for(const row of writes){
  if(!plan.state.simulation.people[row.effect.actor])continue;
  // A later catch-up retains the event date. The shared simulation reference is
  // deliberate: only the ordinary knowledge writer mutates the caller's plan.
  write({...plan,state:{...plan.state,clock:row.at}},[row.effect],row.cause);
 }
}
