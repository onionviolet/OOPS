// Observer-owned evidence and intentions over native simulation commands.
// Existing knowledge, facts and jobs own storage, time, interruption and causes.
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,reason});
const all=(...rules)=>({all:rules.filter(rule=>rule!=null)});
const check=(ok,message)=>{if(!ok)throw Error(message);};
function jsonSafe(x){
 check(x===null||['string','boolean'].includes(typeof x)||typeof x==='number'&&Number.isFinite(x)||typeof x==='object','Rows must be JSON safe.');
 if(x&&typeof x==='object'){
  if(x.all||x.any)check((x.all||x.any).length>0,'Requirements need supported predicates.');
  for(const v of Object.values(x))jsonSafe(v);
 }
}
export function defineInferences(data,{worldId,actorId='player',group,situationId,requires}={}){
 check([worldId,actorId,group,situationId].every(id),'Invalid inference binding.');
 if(data==null)return [];
 jsonSafe(data);check(Array.isArray(data.chains),'Expected inference chains.');
 const commands=[],ids=new Set(),rows=new Set();
 for(const row of data.chains){
  check(Object.keys(row).every(k=>['id','label','description','place','requires','steps','locator'].includes(k)),'Unsupported inference field needs its owner.');
  check(id(row.id)&&!rows.has(row.id)&&text(row.label)&&text(row.description)&&(!row.place||id(row.place))&&Array.isArray(row.steps)&&row.steps.length>=3,'Invalid inference chain.');rows.add(row.id);
  const statusKey=`inference.${row.id}.intention`,phaseKey=`inference.${row.id}.phase`;
  let previous,hasEvidence=false,hasInference=false,hasIntention=false;
  for(const step of row.steps){
   check(Object.keys(step).every(k=>['id','kind','label','description','minutes','report','evidence','requires','sourceId','uncertainty'].includes(k)),'Unsupported inference effect needs its owner.');
   const commandId=`${row.id}.${step.id}`,control=['postpone','resume','cancel'].includes(step.kind);
   check(id(step.id)&&!ids.has(commandId)&&text(step.label)&&text(step.description)&&text(step.report)&&Number.isSafeInteger(step.minutes)&&step.minutes>0,'Invalid inference step.');ids.add(commandId);
   check(['recall','testimony','read','infer','intend','postpone','resume','cancel'].includes(step.kind),'Unsupported inference kind.');
   if(!control){
    check(Array.isArray(step.evidence)&&step.evidence.length>0&&step.evidence.every(e=>Object.keys(e).every(k=>['key','value'].includes(k))&&id(e.key)&&text(e.value)),'A mental step needs held observer evidence.');
    if(['recall','testimony','read'].includes(step.kind)){
     check(!hasInference&&!hasIntention,'Receive evidence before drawing this chain\'s inference.');hasEvidence=true;
     if(step.kind==='read')check(id(step.sourceId)&&step.requires,'Reading needs an identified text and access/comprehension support.');
    }
    if(step.kind==='infer'){check(hasEvidence&&!hasIntention&&text(step.uncertainty),'Inference needs prior evidence and stated uncertainty.');hasInference=true;}
    if(step.kind==='intend'){check(hasInference&&!hasIntention,'Intention needs a preceding inference.');hasIntention=true;}
   }else check(hasIntention&&!step.evidence,'Plan controls follow the intention.');
   const status=step.kind==='intend'||step.kind==='resume'?'active':step.kind==='postpone'?'postponed':step.kind==='cancel'?'cancelled':'considering';
   const evidence=(step.evidence||[]).map(e=>eq(`knowledge.${e.key}.value`,e.value,'Recall or receive the supporting evidence first.'));
   const phase=control?(step.kind==='cancel'?{any:['active','postponed'].map(value=>eq(`actor.${statusKey}`,value,'Choose a current intention first.'))}:eq(`actor.${statusKey}`,step.kind==='resume'?'postponed':'active','The current intention does not support this change.')):
    previous?eq(`actor.${phaseKey}`,previous,'Complete the preceding thought first.'):null;
   const support=all(requires,row.requires,phase,...evidence,step.requires);
   const receiptKey=`inference.${commandId}`;
   const basis={kind:step.kind==='recall'?'recollection':step.kind==='testimony'||step.kind==='read'?'instruction':'inference',attributedTo:actorId,situationId,
    evidence:(step.evidence||[]).map(e=>e.key),...(step.sourceId?{sourceId:step.sourceId}:{}),...(step.uncertainty?{uncertainty:step.uncertainty}:{}),...(row.locator?{at:row.locator}:{})};
   const effects=[{type:'fact',scope:'actor',actor:actorId,key:statusKey,value:status},
    ...(!control?[{type:'fact',scope:'actor',actor:actorId,key:phaseKey,value:step.id}]:[]),
    {type:'knowledge',actor:actorId,key:receiptKey,stage:['recall','read','testimony'].includes(step.kind)?'seen':'interpreted',value:step.report,basis}];
   commands.push({id:commandId,revision:1,label:step.label,description:step.description,worldId,actorId,group,
    ...(row.place?{location:row.place}:{}),once:false,duration:step.minutes,cancellation:'refund',visibleWhen:requires||eq('actor.life','alive','You need to be awake and able to think.'),
    requires:support,completionRequires:support,completionCoLocated:!!row.place,completionFailure:'refund',costs:[],effects,
    inference:{chainId:row.id,label:row.label,kind:step.kind,receiptKey,statusKey}});
   if(!control)previous=step.id;
  }
  check(hasEvidence&&hasInference&&hasIntention,'Chain needs evidence, inference and intention.');
 }
 return commands;
}
export function quoteInferences(state,commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const m=d.inference,k=state.simulation?.knowledge?.[d.actorId]?.[m.receiptKey],status=state.actors?.[d.actorId]?.facts?.[m.statusKey];
  return [{id:d.id,chainId:m.chainId,chainLabel:m.label,perspective:'Your thoughts',label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,
   duration:q.duration??d.duration,costText:'Time; no stock spent.',...(k?{record:k.value}:{}),...(status?{status}:{}),eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
export function pendingInferenceReports(state,commands,worldId){
 return commands.some(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.inference.receiptKey];return k&&state.worlds?.[worldId]?.facts?.[`inference.reported.${d.id}`]!==k.cause;});
}
export function settleInferenceReports(state,commands,worldId){
 const facts=state.worlds?.[worldId]?.facts;if(!facts)return [];
 return commands.flatMap(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.inference.receiptKey],marker=`inference.reported.${d.id}`;
  if(!k||facts[marker]===k.cause)return [];facts[marker]=k.cause;
  return [{text:k.value,at:k.at,kind:'events',actor:d.actorId,place:state.simulation.people[d.actorId]?.location}];
 });
}
