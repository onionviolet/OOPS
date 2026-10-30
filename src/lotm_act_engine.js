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
 if(b.risk&&(!id(b.risk.carrier)||!id(b.risk.source)||!(b.risk.weight>0)))out.push('Risk needs carrier, source and a positive weight.');
 return out;
}
export function defineLotmActs(rows,bindings,{worldId,actorId='player',group,situationId,requires=null}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid act binding.');
 const commands=[],unbound=[],ids=new Set();
 for(const row of rows){
  const b=bindings?.[row.id],why=problems(row,b);
  if(why.length){unbound.push({id:row.id,reasons:why});continue;}
  const steps=stepsOf(row),last=steps.length-1,phaseKey=`lotm.act.${row.id}.phase`,doneKey=`lotm.act.${row.id}.done`;
  const costStep=b.costStep&&steps.some(s=>s.id===b.costStep)?b.costStep:steps[0].id;
  const spend=Object.values(b.inputs||{}).map((x,i)=>x).filter(Boolean);
  for(const x of spend)validateItemKey(x.key);
  const support=all(requires,row.eligibility,...(row.condition?[row.condition]:[]));
  // binding.requires gates the start only: held stock it names is spent by the costs, so it cannot hold at completion.
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
   const sb=b.steps[s.id],costs=structuredClone(sb.costs||[]);
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
   const phase=previous&&eq(`actor.${phaseKey}`,previous,'Complete the preceding step first.');
   commands.push({id:cmd,revision:1,label:`${row.label}: ${s.id}`,description:s.text,worldId,actorId,group,
    location:b.place,once:false,duration:sb.minutes??b.steps[s.id].minutes,cancellation:'refund',
    visibleWhen:requires||eq('actor.life','alive'),requires:all(support,phase,startOnly),completionRequires:all(support,phase),
    completionCoLocated:true,completionFailure:'refund',costs,effects,
    lotmAct:{rowId:row.id,stepId:s.id,kind:s.kind||'step',final:i===last,doneKey,phaseKey,unresolved:i===last?unresolved:[],
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
export function quoteLotmActs(commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return [{id:d.id,rowId:d.lotmAct.rowId,label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,
   duration:q.duration??d.duration,costText:d.costs.map(c=>`${c.key||c.type}: ${c.amount}`).join('; ')||'No stock spent.',
   ...(d.lotmAct.unresolved.length?{unresolved:d.lotmAct.unresolved}:{}),
   eligible:!!q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
