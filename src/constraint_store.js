// Windowed canon is pack data. This index and its strain receipts are derived,
// never a clock, location owner, random cursor or save slice (AR3, LSD106-143).
import {unitDecision} from './seeded_streams.js';
export const PROVENANCE_CODES=Object.freeze(['canon','canon-derived','fill','emergent','divergent']);
export const constraintProvenance=row=>row.provenance||(row.label==='fill'?'fill':row.label==='I'?'canon-derived':'canon');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const stateKey=r=>{
 const type=r.type||'fact',scope=type==='fact'&&r.scope!=='actor'?'':r.scope||'';
 return JSON.stringify([type==='fact'&&scope===''?'*':r.actor,type,scope,r.key||r.fact]);
};
// Compiled selectors share the store's existing immutable row/index lifetime.
// They contain no actor values, current time or settlement result.
const compiledRows=new WeakMap();
export function neededState(rule){
 if(!rule)return [];
 if(Array.isArray(rule))return rule.flatMap(neededState);
 if(rule.all)return rule.all.flatMap(neededState);
 // Disjunction and negation need a mechanism-specific reading; do not invent a reservation.
 if(rule.any||rule.not)return [];
 return [{...rule,key:rule.key||rule.fact}];
}
export function createConstraintStore(records){
 const rows=structuredClone(records),byActor=new Map(),byNeed=new Map(),byProduced=new Map(),ids=new Set(),byId=new Map();
 const add=(index,key,row)=>{if(!index.has(key))index.set(key,[]);index.get(key).push(row);};
 for(const r of rows){
  if(!r.id||ids.has(r.id)||!r.actor||!Number.isFinite(r.window?.from)||!Number.isFinite(r.window?.to)||r.window.to<r.window.from)throw Error('Invalid constraint identity or window.');
  ids.add(r.id);byId.set(r.id,r);r.provenance=constraintProvenance(r);
  if(!PROVENANCE_CODES.includes(r.provenance))throw Error('Invalid constraint provenance.');
  add(byActor,r.actor,r);
  const needs=new Map(),produces=new Map();
  for(const need of neededState(r.needs)){const key=stateKey({...need,actor:need.actor||r.actor});add(byNeed,key,r);add(needs,key,need);}
  for(const e of r.produces||[]){const key=stateKey({...e,actor:e.actor||r.actor});add(byProduced,key,r);add(produces,key,e);}
  compiledRows.set(r,{needs,produces});
 }
 const byWindow=[...rows].sort((a,b)=>a.window.from-b.window.from||a.id.localeCompare(b.id));
 const select=({actor,from=-Infinity,to=Infinity}={})=>(actor?byActor.get(actor)||[]:byWindow).filter(r=>r.window.from<=to&&r.window.to>=from);
 return {rows,byId,byActor,byNeed,byProduced,byWindow,select,
  reservations:change=>byNeed.get(stateKey(change))||[],producing:change=>byProduced.get(stateKey(change))||[]};
}
// Outcome weights describe the unconditioned model. Filtering precedes one keyed
// draw, even when the permitted mass is tiny. Zero mass is a gap, never a fake roll.
export function conditionedDraw(streams,{world,actor,date,subject,revision,outcomes,consistent=()=>true}){
 if([world,actor,date,subject,revision].some(x=>x==null))throw Error('Incomplete constrained draw key.');
 if(!outcomes.length||outcomes.some(x=>!Number.isFinite(x.weight)||x.weight<0))throw Error('Invalid outcome weights.');
 const total=outcomes.reduce((n,x)=>n+x.weight,0),allowed=outcomes.filter(consistent),mass=allowed.reduce((n,x)=>n+x.weight,0);
 if(!(mass>0)||!Number.isFinite(total))throw Error('Constraint has no model-consistent outcome.');
 const key=JSON.stringify([world,actor,date,subject,revision]);
 const draw=unitDecision(streams,'world.events:cast',key);let cursor=draw.value*mass;
 let outcome=allowed.at(-1);
 for(const candidate of allowed){cursor-=candidate.weight;if(cursor<0){outcome=candidate;break;}}
 return {outcome,receipt:draw.receipt,strain:{key,probability:mass/total,selectedProbability:outcome.weight/total}};
}
function passes(need,value){
 const op=need.op||'eq',wanted=Object.hasOwn(need,'value')?need.value:need.amount;
 if(op==='has')return value!==undefined;
 if(op==='eq')return same(value,wanted);
 if(op==='ne')return !same(value,wanted);
 if(typeof value!=='number')return false;
 return op==='gte'?value>=wanted:op==='gt'?value>wanted:op==='lte'?value<=wanted:op==='lt'?value<wanted:false;
}
// Changes must already be aggregated by the transaction adapter. Reasons are
// authored observer-safe intentions, never a hidden locator or future event name.
export function reservationDecision(store,{changes,at,through=at,settled=()=>false,read=()=>undefined}){
 for(const change of changes){
  const key=stateKey(change);
  const next=Object.hasOwn(change,'value')?change.value:typeof read(change)==='number'?read(change)+(change.amount||0):undefined;
  for(const row of store.reservations(change)){
   if(row.provenance==='fill'||row.window.to<at||settled(row.id))continue;
   for(const need of compiledRows.get(row)?.needs.get(key)||neededState(row.needs).filter(n=>stateKey({...n,actor:n.actor||row.actor})===key))
    if(!passes(need,next))return {allowed:false,reason:row.reason||'You are keeping this for an obligation you still need to meet.'};
  }
  for(const row of store.producing(change)){
   if(row.provenance==='fill'||row.window.to<at)continue;
   if((compiledRows.get(row)?.produces.get(key)||(row.produces||[]).filter(e=>stateKey({...e,actor:e.actor||row.actor})===key)).some(e=>Object.hasOwn(e,'value')&&!same(next,e.value)))return {allowed:false,reason:'Not how it happened'};
  }
 }
 // A timed action must leave the actor free for an upcoming constrained step.
 if(through>at&&store.select({from:at,to:through}).some(r=>r.provenance!=='fill'&&r.what==='beat'&&r.window.to<through&&!settled(r.id)&&changes.some(c=>c.actor===r.actor)))return {allowed:false,reason:'You need to leave time for what you have planned.'};
 return {allowed:true};
}
export function contradictedFills(store,fills){
 return fills.filter(f=>f.provenance==='fill').flatMap(fill=>store.select({actor:fill.actor,from:fill.at,to:fill.at})
  .filter(r=>r.provenance!=='fill'&&(r.produces||[]).some(e=>(e.key||e.fact)===fill.key&&Object.hasOwn(e,'value')&&!same(e.value,fill.value)))
  .map(r=>({kind:'contradicted-fill',key:fill.key,constraint:r.id,locator:r.locator})));
}
