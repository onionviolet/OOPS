// Operation compilers return ordinary simulation predicates/effects, never state.
// Add a registry entry here to extend pack operations without changing the adapter.
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const requireId=x=>{if(!id(x))throw Error('Invalid place operation key.');return x;};
const fact=(scope,key,value,actor)=>({type:'fact',scope,key,value,...(actor?{actor}:{})});
const eq=(key,value,reason)=>({fact:key,op:'eq',value,reason});
const plain=()=>({requires:[],effects:[]});
function prepare(row,{data}){
 const seeded=(actor,key)=>(data.objects||[]).some(o=>(o.resources||[]).some(r=>r.actor===actor&&r.key===key&&Number.isFinite(r.amount)&&r.amount>=0));
 const costs=row.costs||[],effects=row.effects||[];
 if(!costs.length||costs.some(e=>e.type!=='resource'||e.native||!(e.amount<0)||!seeded(e.actor,e.key)))throw Error('Preparation needs costs from seeded resource stock.');
 if(!effects.some(e=>e.type==='fact'||e.type==='resource'&&e.amount>0)||effects.some(e=>e.type==='resource'&&(!seeded(e.actor,e.key)||e.native)))throw Error('Preparation needs a fact or seeded resource output.');
 return plain();
}
function secure(row,{actorId,data}){
 const s=row.secure;if(!s||!id(row.objectId))throw Error('Securing needs an owned object and custody facts.');
 if(!(data.objects||[]).some(o=>o.id===row.objectId&&(o.actorFacts||[]).some(f=>f.actor===actorId&&f.key===s.ownedFact)))throw Error('Securing needs a seeded object custody owner.');
 const owned=requireId(s.ownedFact),custody=requireId(s.custodyFact),concealed=requireId(s.concealedFact);
 requireId(s.container);
 return {requires:[eq(`actor.${owned}`,true,'You need the object in your custody.')],effects:[
  fact('world',custody,s.container),fact('world',concealed,true)]};
}
function checkTime(row,{actorId,situationId}){
 const c=row.clock;if(!c||!id(c.fact)||!['string','number'].includes(typeof c.value)||typeof c.value==='number'&&!Number.isFinite(c.value))throw Error('Checking time needs a supported displayed clock reading.');
 return {requires:[eq(`world.${c.fact}`,c.value,'Check the current clock reading again.')],effects:[
  {type:'knowledge',actor:actorId,key:`${row.knowledgeKey}.display`,stage:'seen',value:c.value,
   basis:{kind:'observation',attributedTo:actorId,situationId}}]};
}
const wake=(row,{actorId})=>{const key=requireId(row.awakeFact||'place.act.awake');return {
 requires:[eq(`actor.${key}`,false,'You are already awake, or your sleep state is unknown.')],effects:[fact('actor',key,true,actorId)]};};
// No ordinary-rest need owner is bound at this seam. Record the act, not a
// fabricated stamina grant. Native sleep/recovery remains with its existing owner.
const settle=(row,{actorId})=>({requires:[],effects:[fact('actor',requireId(row.restFact||'place.act.rested'),true,actorId)]});
export const PLACE_ACT_OPERATIONS=Object.freeze({inspect:plain,pay:plain,use:plain,wash:plain,clean:plain,consume:plain,store:plain,take:plain,
 read:plain,prepare,wake,'check time':checkTime,sit:settle,settle,secure,'wait here':plain});
export function compilePlaceActOperation(row,binding){
 const compile=Object.hasOwn(PLACE_ACT_OPERATIONS,row.operation)&&PLACE_ACT_OPERATIONS[row.operation];
 if(!compile)throw Error('Invalid place act operation.');
 return compile(row,binding);
}
