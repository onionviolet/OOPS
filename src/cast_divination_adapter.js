// Pack-authored, source-pinned queries over native jobs. The simulation owns
// payment, attempt identity, support, time and knowledge. No accuracy RNG here.
import {defineRitual,ritualDial,fitScore,gradeRitual} from './ritual_conditions.js';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules.filter(Boolean)});
export function defineDivinations(data,{worldId,actorId='player',group,situationId,requires}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid divination binding.');
 const commands=[],ids=new Set();
 const rowFields=new Set(['id','targetId','question','method','label','description','means','contact','requires','place','steps','ritual','dial','locator']);
 const stepFields=new Set(['id','kind','label','description','minutes','report','costs','requires','status','signal','belief']);
 for(const row of data?.queries||[]){
  if(Object.keys(row).some(k=>!rowFields.has(k)))throw Error('Unsupported query field needs its owning mechanism.');
  if(!id(row.id)||!id(row.targetId)||!text(row.question)||!text(row.method)||!text(row.label)||!text(row.description)||
   !row.means||!row.contact||row.place!=null&&!id(row.place)||!Array.isArray(row.steps)||row.steps.length<3)throw Error('Invalid query: declare target, question, held means, contact and ordered steps.');
  const kinds=row.steps.map(s=>s.kind);
  if(kinds[0]!=='prepare'||kinds.filter(k=>k==='attempt').length!==1||kinds.at(-1)!=='interpret'||kinds.indexOf('attempt')!==kinds.length-2||kinds.slice(1,-2).some(k=>k!=='rite'))throw Error('Query needs preparation, optional ordered rite, attempt, interpretation.');
  const ritual=row.ritual?defineRitual(row.ritual):null,dial=ritual?ritualDial(worldId,row.dial):null;
  // Compile the existing grader's supported exact/substitute cases into native
  // predicates. World laws can replace this first-slice support policy later.
  const riteSupport=ritual&&{all:ritual.conditions.map(c=>({any:[c.exact.rule,...c.substitutes.filter(s=>fitScore(c.principle.wants,s.tags)>=dial.floor).map(s=>s.rule)]})),reason:'The prepared rite lacks its stated support.'};
  const phaseKey=`divination.${row.id}.phase`,support=all(requires,row.requires,row.means,row.contact,riteSupport);
  let previous;
  for(const step of row.steps){
   if(Object.keys(step).some(k=>!stepFields.has(k)))throw Error('Unsupported rite effect needs its body, place or ability owner.');
   const commandId=`${row.id}.${step.id}`;
   if(!id(step.id)||ids.has(commandId)||!text(step.label)||!text(step.description)||!Number.isSafeInteger(step.minutes)||step.minutes<1||!text(step.report))throw Error('Invalid ordered query step.');
   ids.add(commandId);
   const costs=structuredClone(step.costs||[]);
   if(!Array.isArray(costs)||costs.some(c=>!['resource','item','vital'].includes(c.type)||!Number.isFinite(c.amount)||c.amount>=0))throw Error('Declare explicit spent stock through a native cost.');
   if(step.kind==='attempt'&&!costs.length)throw Error('An attempt needs its supported paid cost.');
   const phase=previous&&eq(`actor.${phaseKey}`,previous,'Complete the preceding rite step first.');
   const effects=[{type:'fact',scope:'actor',actor:actorId,key:phaseKey,value:step.id}];
   const basis={kind:step.kind==='interpret'?'inference':'observation',attributedTo:actorId,situationId,
    queryId:row.id,targetId:row.targetId,method:row.method,...(row.locator?{at:row.locator}:{} )};
   const receiptKey=`divination.${commandId}`;
   effects.push({type:'knowledge',actor:actorId,key:receiptKey,stage:step.kind==='interpret'?'interpreted':'seen',value:step.report,basis});
   if(step.kind==='attempt'){
    if(!['signal','obscured','unanswered'].includes(step.status)||!text(step.signal))throw Error('Attempt needs a supported signal or explicit no-answer feedback.');
    effects.push({type:'knowledge',actor:actorId,key:`divination.${row.id}.signal`,stage:'seen',value:step.signal,basis:{...basis,status:step.status}});
   }
   if(step.kind==='interpret'){
    if(!text(step.belief))throw Error('Interpretation needs a stated belief, not hidden truth.');
    effects.push({type:'knowledge',actor:actorId,key:`divination.${row.id}.interpretation`,stage:'interpreted',value:step.belief,basis:{...basis,evidence:[`divination.${row.id}.signal`]}});
   }
   commands.push({id:commandId,revision:1,label:step.label,description:step.description,worldId,actorId,group,
    ...(row.place?{location:row.place}:{}),once:false,duration:step.minutes,cancellation:'refund',
    visibleWhen:requires||eq('actor.life','alive'),requires:all(support,phase,step.requires),
    completionRequires:all(support,phase,step.requires),completionCoLocated:!!row.place,completionFailure:'refund',costs,effects,
    divination:{queryId:row.id,question:row.question,targetId:row.targetId,method:row.method,label:row.label,
     kind:step.kind,receiptKey,phaseKey,ritual,dial}});
   previous=step.id;
  }
 }
 return commands;
}
export function quoteDivinations(state,commands,preview,{blocked='',decide=()=>({allowed:true}),facts=()=>({})}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const costs=q.eligible?q.costs:d.costs;
  const m=d.divination,k=state.simulation?.knowledge?.[d.actorId]?.[m.receiptKey];
  // Frozen job effects and pack results are internal data, not a preview answer.
  // Show a record after the owning observer has actually received it.
  const known=state.simulation?.knowledge?.[d.actorId]||{};
  return [{id:d.id,queryId:m.queryId,queryLabel:m.label,question:m.question,method:m.method,perspective:'Your rite',
   label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,duration:q.duration??d.duration,
   costs:structuredClone(costs),costText:costs.map(e=>`${e.key||e.type}: ${e.amount}`).join('; ')||'No stock spent.',
   effectText:d.description,...(k?{record:k.value}:{}),
   ...(m.kind==='attempt'&&known[`divination.${m.queryId}.signal`]?{signal:known[`divination.${m.queryId}.signal`].value}:{}),
   ...(m.kind==='interpret'&&known[`divination.${m.queryId}.interpretation`]?{belief:known[`divination.${m.queryId}.interpretation`].value}:{}),
   ...(m.ritual?{grade:gradeRitual(m.ritual,facts(d),m.dial).grade}:{}),eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
export function pendingDivinationReports(state,commands,worldId){
 return commands.some(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.divination.receiptKey];
  return k&&state.worlds?.[worldId]?.facts?.[`divination.reported.${d.id}`]!==k.cause;});
}
export function settleDivinationReports(state,commands,worldId){
 const facts=state.worlds?.[worldId]?.facts;if(!facts)return [];
 return commands.flatMap(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.divination.receiptKey],marker=`divination.reported.${d.id}`;
  if(!k||facts[marker]===k.cause)return [];facts[marker]=k.cause;
  return [{text:k.value,at:k.at,kind:'events',actor:d.actorId,place:state.simulation.people[d.actorId]?.location}];
 });
}
