// Source-authored ordered encounters lowered to the existing native transaction.
// No battle clock, random stream, inventory, save slice or source grant lives here.
import {jsonData,stableId,validateSimulationEffect} from './simulation_contracts.js';
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {runConflictFrame} from './conflict_frame.js';
const eq=(fact,value)=>({fact,op:'eq',value});
const all=(...rules)=>({all:rules.filter(Boolean)});
const text=x=>typeof x==='string'&&x.trim().length>0;
const check=(ok,message)=>{if(!ok)throw Error(message);};
const fields=new Set(['id','label','description','place','targetId','requires','moves','locator','sourceStepId']);
const moveFields=new Set(['id','label','description','minutes','after','requires','costs','effects','report','ability','result','locator','sourceStepId']);
const abilityFields=new Set(['sourceId','function','acquisition','executionKind','control','target','counters','carriers']);
export function defineCastAbilities(data,{worldId,actorId='player',group,situationId,requires}={}){
 check([worldId,actorId,group,situationId].every(stableId),'Invalid encounter binding.');
 const commands=[],seen=new Set();
 for(const row of data?.encounters||[]){
  jsonData(row);
  check(Object.keys(row).every(k=>fields.has(k))&&stableId(row.id)&&text(row.label)&&text(row.description)&&Array.isArray(row.moves)&&row.moves.length>0,'Invalid encounter row.');
  check(row.place==null||stableId(row.place),'Invalid encounter place.');
  check(row.targetId==null||stableId(row.targetId),'Invalid encounter target.');
  const phaseKey=`conflict.${row.id}.phase`,resultKey=`conflict.${row.id}.result`,prior=new Set();
  for(const move of row.moves){
   check(Object.keys(move).every(k=>moveFields.has(k))&&stableId(move.id)&&!prior.has(move.id)&&text(move.label)&&text(move.description)&&text(move.report)&&Number.isSafeInteger(move.minutes)&&move.minutes>0,'Invalid encounter move; minutes need source evidence or a labelled scheduling fill.');
   const commandId=`${row.id}.${move.id}`;
   check(!seen.has(commandId),'Duplicate encounter command.');seen.add(commandId);
   check(move.after==null||Array.isArray(move.after)&&move.after.length>0&&move.after.every(x=>prior.has(x)),'Move predecessors must be earlier declared moves.');
   check(move.result==null||stableId(move.result),'Invalid encounter result.');
   const phase=move.after&&{any:move.after.map(x=>eq(`actor.${phaseKey}`,x))};
   // An episode move settles once. Repeated practice is represented by its
   // supported repetitions, rather than replaying a settled wound or release.
   const support=all(requires,row.requires,move.requires,phase);
   const effects=(move.effects||[]).map((spec,index)=>{
    let effect=structuredClone(spec);
    if(['resource','item','vital','xp','reputation','energy'].includes(effect.type)&&effect.amount==null){
     effect={type:'owner-needed',owner:effect.type,key:`${row.id}.${move.id}.unknown_amount.${index}`,value:`${spec.key||spec.type}: amount not recorded.`};
    }
    if(effect.type==='owner-needed'){
     check(stableId(effect.owner)&&text(effect.value),'Name the missing effect owner and supported fact.');
     effect={type:'fact',scope:'actor',actor:actorId,key:effect.key||`${row.id}.${move.id}.owner_needed.${index}`,value:`owner needed: ${effect.owner}; ${effect.value}`};
    }else{
     if(effect.type==='knowledge')effect.basis??={kind:'observation',attributedTo:actorId,situationId,...(move.locator||row.locator?{at:move.locator||row.locator}:{})};
    }
    validateSimulationEffect(effect);return effect;
   });
   const receiptKey=`conflict.${commandId}`;
   effects.push({type:'fact',scope:'actor',actor:actorId,key:phaseKey,value:move.id},
    {type:'knowledge',actor:actorId,key:receiptKey,stage:'seen',value:move.report,basis:{kind:'observation',attributedTo:actorId,situationId,...(move.locator||row.locator?{at:move.locator||row.locator}:{})}});
   const declaredCosts=structuredClone(move.costs||[]);
   check(Array.isArray(declaredCosts)&&declaredCosts.every(c=>['resource','item','vital'].includes(c.type)&&(c.amount==null||Number.isFinite(c.amount)&&c.amount<0)),'Encounter costs must name actual spent stock or an unknown amount.');
   const unknownCost=move.costs==null||declaredCosts.some(c=>c.amount==null);
   const costs=declaredCosts.filter(c=>c.amount!=null);
   const command={id:commandId,revision:1,label:move.label,description:move.description,worldId,actorId,group,once:true,duration:move.minutes,cancellation:'refund',
    ...(row.place?{location:row.place}:{}),...(row.targetId?{targetId:row.targetId,participants:['$target'],coLocated:true}:{}),
    visibleWhen:requires||eq('actor.life','alive'),requires:support,completionRequires:support,completionCoLocated:!!row.place||!!row.targetId,completionFailure:'refund',costs,effects,
    castAbility:{encounterId:row.id,encounterLabel:row.label,moveId:move.id,phaseKey,resultKey,receiptKey,cost:unknownCost?null:'stated'}};
   let compiled=command;
   if(move.ability){
    const a=move.ability;
    check(a.sourceId==null||stableId(a.sourceId),'Invalid ability source.');
    check(Object.keys(a).every(k=>abilityFields.has(k)),'Unsupported ability field.');
    // Use the existing structured held-source/control/target/counter compiler.
    // The common namespace is an identity check, not a grant of that source.
    const parts=commandId.split('.'),sourceParts=(a.sourceId||'').split('.');
    let n=0;while(n<parts.length&&parts[n]===sourceParts[n])n++;
    const namespace=commandId.split('.').slice(0,n).join('.');
    if(a.sourceId&&namespace&&a.function&&a.acquisition&&a.executionKind){
    const d={id:namespace,world:{id:worldId},sources:[{id:a.sourceId}],abilities:[{id:`${commandId}.ability`,commandId,sourceId:a.sourceId,function:a.function,acquisition:a.acquisition,executionKind:a.executionKind,
     control:a.control||{all:[]},target:a.target||null,counters:a.counters||[],carriers:a.carriers||[]}],simulation:{commands:[command]}};
    for(const c of a.carriers||[])d.sources.push({id:c.sourceId});
    compiled=compileStructuredAbilities(d).commands[0];
    }else{
     // Partial evidence still binds known means. Unknown classification is
     // not a new admission gate and does not acquire a faculty or power.
     const held=a.sourceId&&{any:[eq(`faculty.${a.sourceId}.active`,true),...(a.carriers||[]).map(c=>all(eq(`faculty.${c.sourceId}.active`,true),c.requires))]};
     compiled.requires=all(support,held,a.control,a.target,...(a.counters||[]).map(c=>({not:c})));
     compiled.completionRequires=compiled.requires;
    }
   }
   if(move.result)compiled.effects.push({type:'fact',scope:'actor',actor:actorId,key:resultKey,value:move.result});
   commands.push(compiled);prior.add(move.id);
  }
 }
 return commands;
}
export function quoteCastAbilities(state,commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const costs=q.eligible?q.costs:d.costs,m=d.castAbility,k=state.simulation?.knowledge?.[d.actorId]?.[m.receiptKey];
  return [{id:d.id,label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,encounterLabel:m.encounterLabel,perspective:'Your encounter',
   costs:structuredClone(costs),cost:m.cost===null?null:'stated',costText:[costs.map(c=>`${c.key||c.type}: ${c.amount}`).join('; '),m.cost===null?'Cost not recorded.':''].filter(Boolean).join('; ')||'No stock spent.',
   ...(k?{record:k.value}:{}),eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}

// C14 selects the authored move at actual admission. The native transaction
// callback revalidates and owns payment, frozen jobs, refunds and completion.
// C14's transient cursor is discarded; no artificial battle is saved alongside
// the native job. Source aftermath is published by that job's native effects.
export function commitCastAbility(commands,id,{state,context,commit}){
 const selected=commands.find(d=>d.id===id);
 check(selected,'Choose a registered encounter move.');
 const moves=commands.filter(d=>d.castAbility.encounterId===selected.castAbility.encounterId);
 return runConflictFrame({id:selected.castAbility.encounterId,results:{},
  createPlan:()=>({state:{simulation:{sessions:{player:{nativeBattle:null}}}}}),
  prepare:frame=>({moves:moves.map(d=>({id:d.id,types:[d.id],apply:()=>Object.assign(frame.plan,commit(d.id))}))})},
  {state,context,command:{type:id}});
}
