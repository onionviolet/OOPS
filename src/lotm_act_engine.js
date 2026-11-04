// Rite and craft engine path for LOTM L4 rows (MR1-MR36, AD38, AR2/AR10).
// Pure compiler: an L4 source row (LOTM_RITE_ROWS, LOTM_CRAFT_ROWS or
// LOTM_AID_PREPARATIONS) plus an authored binding becomes ordered native
// simulation commands, in the shape cast_divination_adapter already uses. The row
// supplies source steps, eligibility and owner-needed requests; the binding
// supplies what the row leaves null (place, minutes, stock, output, owner effects,
// risk). A row with no complete binding is reported, never guessed. Nothing here
// registers commands, mutates state or rolls dice; the simulation owns payment,
// time and knowledge, and harm_state owns backlash (the host injects `add`).
import {validateSimulationEffect} from './simulation_contracts.js';
import {validateItemKey} from './inventory_key.js';
import {evaluateRule} from './rules.js';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const pos=x=>Number.isSafeInteger(x)&&x>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules.filter(Boolean)});

// binding: {row, place, steps:{[stepId]:{minutes, report?, costs?:[native cost]}},
//  inputs:{[inputName]:{key,qty}|null}, output?:{key,qty}, owners:{[owner]:[effect]},
//  requires?, risk?:{carrier, source, weight, protections?:[{rule, reduces}]}}.
// null input = at hand, not spent (apparatus, a bottle). Inputs are charged at
// `costStep` (default: the first step). Output lands on the last step.
const stepsOf=row=>row.steps||row.method||[];
function problems(row,b){
 const out=[];
 if(!b)return ['No binding: authored place, minutes and stock are missing.'];
 if(!id(b.place))out.push('Binding needs a place.');
 for(const s of stepsOf(row))if(!pos(b.steps?.[s.id]?.minutes))out.push(`Step ${s.id} needs authored minutes.`);
 for(const i of row.inputs||row.ingredients||[]){
  const x=b.inputs?.[i.name];
  if(x===undefined)out.push(`Input "${i.name}" needs a stock binding or an explicit null.`);
  else if(x!==null&&(!pos(x.qty)||!text(x.key)))out.push(`Input "${i.name}" needs key and quantity.`);
 }
 if(b.layout){
  const st=b.layout.stations;
  if(b.layout.order!==undefined&&b.layout.order!=='fixed')out.push('Only a fixed station order is built; a free order is a later dial.');
  if(!Array.isArray(st)||!st.length)out.push('A layout needs stations.');
  else for(const x of st){
   if(!id(x.id)||!text(x.label))out.push('Each station needs an id and a label.');
   if(x.stock&&(!pos(x.stock.qty)||!text(x.stock.key)))out.push(`Station ${x.id} stock needs key and quantity.`);
  }
 }
 if(b.risk&&(!id(b.risk.carrier)||!id(b.risk.source)||!(b.risk.weight>0)))out.push('Risk needs carrier, source and a positive weight.');
 return out;
}
export const lotmActKeys=rowId=>({phase:`lotm.act.${rowId}.phase`,done:`lotm.act.${rowId}.done`,idle:`lotm.act.${rowId}.idle`});
// resolvePlace maps a binding's place token (a pack alias) to a place id; identity when no pack is loaded.
export function defineLotmActs(rows,bindings,{worldId,actorId='player',group,situationId,requires=null,resolvePlace=x=>x}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid act binding.');
 const commands=[],unbound=[],ids=new Set();
 for(const row of rows){
  const b=bindings?.[row.id],why=problems(row,b);
  if(why.length){unbound.push({id:row.id,reasons:why});continue;}
  const rowSteps=stepsOf(row),{phase:phaseKey,done:doneKey,idle:idleKey}=lotmActKeys(row.id);
  // Stations come first and in order: each is a placement the player does (a candle at a corner) and each
  // spends its own stock, so a missing candle blocks that step rather than being skipped (AD38: mechanism, not a list).
  const stations=(b.layout?.stations||[]).map(x=>({id:`set-${x.id}`,kind:'station',text:x.text||`Set ${x.label}.`,station:x}));
  const steps=[...stations,...rowSteps],last=steps.length-1;
  const costStep=b.costStep&&rowSteps.some(s=>s.id===b.costStep)?b.costStep:rowSteps[0].id;
  const spend=Object.values(b.inputs||{}).map((x,i)=>x).filter(Boolean);
  for(const x of spend)validateItemKey(x.key);
  const support=all(requires,row.eligibility,...(row.condition?[row.condition]:[]));
  // Eligibility (the row's means) and binding.requires gate the start only: the kit they name is spent by the step's own
  // costs, so it cannot hold at completion. Completion keeps the lead's circumstances and the step order.
  const startOnly=b.requires;
  const unresolved=[];
  const owners=(row.effects||[]).flatMap(e=>{
   const given=b.owners?.[e.owner];
   if(given){return structuredClone(given).map(f=>({...f,actor:f.actor??actorId}));}
   unresolved.push(e.owner);
   // Same escape as divination rites: an auditable fact naming the missing owner.
   return [{type:'fact',scope:'actor',actor:actorId,key:`lotm.act.${row.id}.owner_needed.${e.owner}`,value:`owner needed: ${e.owner}; ${e.value}`}];
  });
  let previous;
  steps.forEach((s,i)=>{
   const cmd=`${row.id}.${s.id}`;
   if(ids.has(cmd))throw Error('Duplicate act step.');ids.add(cmd);
   const sb=s.station?{minutes:s.station.minutes??1,costs:s.station.stock?[{type:'item',key:s.station.stock.key,amount:-s.station.stock.qty}]:[]}:b.steps[s.id],costs=structuredClone(sb.costs||[]).map(c=>c.actor?c:{...c,actor:actorId});
   if(s.id===costStep)for(const x of spend)costs.push({type:'item',actor:actorId,key:x.key,amount:-x.qty});
   if(costs.some(c=>!['resource','item','vital'].includes(c.type)||!(c.amount<0)))throw Error('Declare spent stock through a native cost.');
   const effects=[{type:'fact',scope:'actor',actor:actorId,key:phaseKey,value:s.id},
    {type:'knowledge',actor:actorId,key:`lotm.act.${cmd}`,stage:'seen',value:sb.report||s.text,
     basis:{kind:'observation',attributedTo:actorId,situationId,actId:row.id,at:row.locators?.[0]}}];
   if(i===last){
    if(b.output){validateItemKey(b.output.key);if(!pos(b.output.qty))throw Error('Output needs a quantity.');
     effects.push({type:'item',actor:actorId,key:b.output.key,amount:b.output.qty});}
    effects.push(...owners,{type:'fact',scope:'actor',actor:actorId,key:doneKey,value:true});
   }
   effects.forEach(validateSimulationEffect);
   // Step one starts a fresh run only when none is under way (idle); a paused run resumes at its next step.
   const phase=previous?eq(`actor.${phaseKey}`,previous,'Complete the preceding step first.'):eq(`actor.${idleKey}`,true,'This rite is already under way: carry on with its next step.');
   commands.push({id:cmd,revision:1,label:`${row.label}: ${s.id}`,description:s.text,worldId,actorId,group,
    location:resolvePlace(b.place),once:false,duration:sb.minutes,cancellation:'refund',
    visibleWhen:requires||eq('actor.life','alive'),requires:all(support,phase,startOnly),completionRequires:all(requires,phase),
    completionCoLocated:true,completionFailure:'refund',costs,effects,
    lotmAct:{rowId:row.id,rowLabel:row.label,stepId:s.id,index:i,total:steps.length,kind:s.kind||'step',final:i===last,doneKey,phaseKey,idleKey,
     layout:b.layout?{order:'fixed',stations:b.layout.stations.map(x=>({id:`set-${x.id}`,label:x.label}))}:null,unresolved:i===last?unresolved:[],
     risk:i===last&&b.risk?structuredClone(b.risk):null}});
   previous=s.id;
  });
 }
 return {commands,unbound};
}

// Risk is the base weight minus each protection whose rule holds in `facts`
// at settle time. Protections are the lead's real preparation (a ward, a
// worthy offering), so the same rite costs less when done properly.
export function backlashDue(command,facts){
 const r=command.lotmAct?.risk;if(!r)return null;
 const cut=(r.protections||[]).reduce((n,p)=>n+(evaluateRule(p.rule,facts).met?p.reduces:0),0);
 return {carrier:r.carrier,source:r.source,weight:Math.max(0,r.weight-cut)};
}
// Host seam. `add(carrier,{source,weight})` is harm_state's addBacklash adapter
// (book_world_lotm_harm). Marker facts make settlement once per completion.
export function settleLotmBacklash(state,commands,worldId,facts,add){
 const marks=state.worlds?.[worldId]?.facts;if(!marks)return [];
 return commands.flatMap(c=>{
  const m=c.lotmAct,k=m?.final&&m.risk&&state.simulation?.knowledge?.[c.actorId]?.[`lotm.act.${c.id}`];
  const mark=`lotm.backlash.settled.${m?.rowId}`;
  if(!k||marks[mark]===k.cause)return [];
  marks[mark]=k.cause;
  const due=backlashDue(c,facts);
  return due.weight>0?[add(due.carrier,{source:due.source,weight:due.weight})]:[];
 });
}
// A final step done and not yet charged (the mark follows the completion record's cause).
export function pendingLotmBacklash(state,commands,worldId){
 const marks=state.worlds?.[worldId]?.facts;if(!marks)return false;
 return commands.some(c=>{const m=c.lotmAct,k=m?.final&&m.risk&&state.simulation?.knowledge?.[c.actorId]?.[`lotm.act.${c.id}`];
  return !!k&&marks[`lotm.backlash.settled.${m.rowId}`]!==k.cause;});
}
// Support facts the engine's own guards read: a row is idle when no run is under way (or the last finished).
export function lotmActIdleFacts(commands,actorFacts={}){
 const last=new Map(),out={};
 for(const c of commands){const m=c.lotmAct;if(m.final)last.set(m.rowId,c.id.slice(m.rowId.length+1));}
 for(const c of commands){const m=c.lotmAct,phase=actorFacts[m.phaseKey];out[`actor.${m.idleKey}`]=phase===undefined||phase===last.get(m.rowId);}
 return out;
}
// status: done (this step is behind the run), next (the one button), later. A finished run reads as a fresh one.
export function quoteLotmActs(commands,preview,{blocked='',decide=()=>({allowed:true}),actorFacts={}}={}){
 const idle=lotmActIdleFacts(commands,actorFacts),byRow=new Map();
 for(const c of commands){if(!byRow.has(c.lotmAct.rowId))byRow.set(c.lotmAct.rowId,[]);byRow.get(c.lotmAct.rowId).push(c);}
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const m=d.lotmAct,decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const ids=byRow.get(m.rowId).map(c=>c.id),at=idle[`actor.${m.idleKey}`]?-1:ids.indexOf(`${m.rowId}.${actorFacts[m.phaseKey]}`);
  return [{id:d.id,rowId:m.rowId,rowLabel:m.rowLabel,label:`${d.label} · ${q.duration??d.duration} min`,step:d.label.slice(m.rowLabel.length+2),description:d.description,
   index:m.index,total:m.total,status:m.index<=at?'done':m.index===at+1?'next':'later',layout:m.layout,
   duration:q.duration??d.duration,costText:d.costs.map(c=>`${c.key||c.type}: ${c.amount}`).join('; ')||'No stock spent.',
   ...(m.unresolved.length?{unresolved:m.unresolved}:{}),
   eligible:!!q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
