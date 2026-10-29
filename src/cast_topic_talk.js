// Pack topics become ordinary native jobs. The simulation owns admission,
// participants, reserved costs, time, knowledge, relationships and delayed events.
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const minutes=x=>Number.isSafeInteger(x)&&x>=0;
export function defineTopicTalks(data,{worldId,actorId='player',group,situationId,requires=null,hourFact='topicTalk.hour'}={}){
 if(![worldId,actorId,group,situationId].every(validId))throw Error('Invalid topic talk binding.');
 const ids=new Set(),commands=[];
 for(const row of data?.talks||[]){
  if(![row.id,row.personId,row.topicId].every(validId)||!row.label||!row.description||!minutes(row.minutes)||row.minutes<1||
   row.place!=null&&!validId(row.place)||row.knowledgeKey!=null&&!validId(row.knowledgeKey)||
   row.hour!=null&&(!Number.isInteger(row.hour)||row.hour<0||row.hour>23)||!row.choices?.length)throw Error('Invalid topic talk.');
  const support={all:[...(requires?[requires]:[]),...(row.requires?[row.requires]:[]),
   ...(row.knowledgeKey?[{fact:`knowledge.${row.knowledgeKey}.seen`,op:'eq',value:true,reason:row.knowledgeReason||'Learn about this topic first.'}]:[])]};
  const guard={all:[support,...(row.hour!=null?[{fact:hourFact,op:'eq',value:row.hour,reason:row.hourReason||`Talk at hour ${row.hour}.`}]:[])]};
  for(const choice of row.choices){
   const id=`${row.id}.${choice.id}`,extra=choice.minutes??0;
   if(!validId(choice.id)||ids.has(id)||!choice.label||!choice.report||!minutes(extra)||!Number.isSafeInteger(row.minutes+extra))throw Error('Invalid topic choice.');
   ids.add(id);
   const effects=structuredClone(choice.effects||[]);
   // Restrict this adapter to effects with an existing social owner and a clear
   // pre-commit quote. Other mechanisms belong in their owning command adapter.
   if(effects.some(e=>!['knowledge','relationship','reputation','event'].includes(e.type)||e.type==='knowledge'&&!e.basis))throw Error('Topic effects need an existing owner and knowledge basis.');
   // Pack evidence may identify the observer and source locator without the
   // runtime situation. Bind that missing context at the host seam; preserve
   // an explicit attribution and every authored basis field.
   for(const effect of effects)if(effect.type==='knowledge'&&effect.basis.situationId===undefined)effect.basis.situationId=situationId;
   const receiptKey=`topic.talk.${id}`;
   effects.push({type:'knowledge',actor:actorId,key:receiptKey,stage:'seen',value:choice.report,
    basis:{kind:'observation',attributedTo:actorId,situationId,personId:row.personId,topicId:row.topicId,
     choiceId:choice.id,participants:[actorId,row.personId]}});
   const completionRequires={all:[support,...(choice.requires?[choice.requires]:[])]};
   commands.push({id,revision:1,label:choice.label,description:row.description,group,actorId,worldId,
    targetId:row.personId,participants:[row.personId],coLocated:true,participantsCoLocated:true,
    ...(row.place?{location:row.place}:{}),once:false,duration:row.minutes+extra,cancellation:'refund',
    visibleWhen:requires||{fact:'actor.life',op:'eq',value:'alive'},requires:{all:[guard,...(choice.requires?[choice.requires]:[])]},
    completionRequires,completionCoLocated:true,completionFailure:'refund',costs:structuredClone(choice.costs||[]),effects,
    topicTalk:{personId:row.personId,topicId:row.topicId,label:row.label,choiceId:choice.id,receiptKey}});
  }
 }
 return commands;
}
const signed=x=>x>=0?`+${x}`:String(x);
export function topicTalkEffectText(e,label=id=>id){
 if(e.type==='knowledge')return `${label(e.actor||'player')} learns: ${e.value} (${e.basis?.kind||'unknown basis'})`;
 if(e.type==='relationship')return `${label(e.actor||'player')} toward ${label(e.target)}: ${e.axis} ${signed(e.amount)}${e.text?` (${e.text})`:''}`;
 if(e.type==='reputation')return `${e.region}: standing ${signed(e.amount)}`;
 if(e.type==='event')return `${label(e.actor||'player')}: ${e.text||'a follow-up becomes due'} after ${Math.max(1,e.delay||1)} min`;
 // Costs retain their native meaning; do not invent a currency conversion.
 return `${label(e.actor||'player')}: ${e.key||e.type} ${signed(e.amount)}`;
}
export function quoteTopicTalks(state,commands,preview,{presence=(d,q)=>q,blocked='',decide=()=>({allowed:true}),label=id=>id}={}){
 return commands.flatMap(d=>{
  const q=presence(d,preview(d));if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return [{id:d.id,...d.topicTalk,topicLabel:d.topicTalk.label,personLabel:label(d.targetId),perspective:'Your conversation',
   label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,duration:q.duration??d.duration,
   costs:structuredClone(q.costs||d.costs),effects:structuredClone(q.effects||d.effects),
   costText:(q.costs||d.costs).map(e=>topicTalkEffectText(e,label)).join('; ')||'No stock spent.',
   effectText:(q.effects||d.effects).map(e=>topicTalkEffectText(e,label)).join('; '),
   eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
export function pendingTopicTalkReports(state,commands,worldId){
 return commands.some(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.topicTalk.receiptKey];
  return k&&state.worlds?.[worldId]?.facts?.[`topic.talk.reported.${d.id}`]!==k.cause;});
}
export function settleTopicTalkReports(state,commands,worldId){
 const facts=state.worlds?.[worldId]?.facts;if(!facts)return [];
 return commands.flatMap(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.topicTalk.receiptKey],marker=`topic.talk.reported.${d.id}`;
  if(!k||facts[marker]===k.cause)return [];facts[marker]=k.cause;
  return [{text:k.value,at:k.at,kind:'events',actor:d.actorId,place:state.simulation.people[d.actorId]?.location}];
 });
}
