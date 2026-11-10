import {placeActStages,sequencePrerequisites,sequenceOffers} from './place_act_sequence.js';
// Ordinary work on objects at a place, expressed through simulation commands.
// Definitions carry world-specific facts/text; simulation owns time, cost and effects.
import {compilePlaceActOperation} from './place_act_operations.js';
import {evaluateRule} from './rules.js';
import {divinationCostText} from './cast_divination_adapter.js';
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
export function definePlaceActs(data,{worldId,actorId='player',group,situationId,requires=null,inquiries=new Map()}={}){
 if(!validId(worldId)||!validId(actorId)||!validId(group)||!validId(situationId))throw Error('Invalid place act binding.');
 const ids=new Set();
 const boundInquiries=new Set();
 const sequenceIds=new Set(placeActStages(data).map(s=>s.commandId));
 return (data?.acts||[]).map(row=>{
  if(!validId(row.id)||ids.has(row.id)||!validId(row.place)||
   !Number.isSafeInteger(row.minutes)||row.minutes<1||!row.label||!row.description||!row.report||!validId(row.knowledgeKey))throw Error('Invalid place act.');
  ids.add(row.id);
  const inquiry=row.inquiryStep==null?null:inquiries.get(row.inquiryStep);
  if(row.inquiryStep!=null){
   if(!inquiry?.divination||boundInquiries.has(row.inquiryStep)||inquiry.actorId!==actorId
    ||inquiry.worldId!==worldId||inquiry.location!==row.place||inquiry.duration!==row.minutes
    ||row.costs?.length||row.remoteSession||row.contact||row.operation!=='use'
    ||(row.cancellation??'refund')!==inquiry.cancellation){
    throw Error('Place inquiry needs one matching local step with its own cost and timing.');
   }
   boundInquiries.add(row.inquiryStep);
  }
  if(row.flavour!=null&&(typeof row.flavour!=='string'||row.flavour.length>200))throw Error('Invalid place-act narrator text.');
  const cancellation=row.cancellation??'refund';
  if(!['refund','forfeit'].includes(cancellation))throw Error('Place work needs a supported interruption policy.');
  const operation=compilePlaceActOperation(row,{data,worldId,actorId,situationId});
  const remote=row.remoteSession;
  const contact=row.contact;
  if(contact&&(!row.targetId||remote||!validId(contact.place)))throw Error('Separate contact needs a target and supported place.');
  if(row.participants&&(!Array.isArray(row.participants)||!row.participants.length||new Set(row.participants).size!==row.participants.length||!row.participants.every(validId)))throw Error('Invalid place act participants.');
  if(remote&&row.participants)throw Error('Remote sessions own their participants.');
  if(remote&&!(data.remoteSessions||[]).some(s=>s.id===remote&&s.anchor===row.place))throw Error('Unknown remote session anchor.');
  const guard={all:[...(contact?[
   {fact:'actor.location',op:'eq',value:row.place,reason:'Your physical anchor is no longer here.'},
   {fact:'target.location',op:'eq',value:contact.place,reason:'The required contact is no longer supported.'},
   {fact:'target.body.ownerId',op:'eq',value:row.targetId},
   {fact:'target.body.controllerId',op:'eq',value:row.targetId}]:[]),...(remote?[{fact:'actor.location',op:'eq',value:row.place,reason:'Your physical anchor is no longer here.'},{fact:`remote.${remote}.ready`,op:'eq',value:true,reason:'The meeting connection is no longer supported.'}]:[]),...(requires?[requires]:[]),...(row.requires?[row.requires]:[]),...(inquiry?[inquiry.requires]:[]),...operation.requires,...sequencePrerequisites(data,row.id)]};
  return {id:row.id,revision:1,label:row.label,description:row.description+(cancellation==='forfeit'?' Inputs stay spent if this work stops before completion.':''),group,actorId,worldId,location:row.place,
   ...(remote&&!row.targetId?{participants:data.remoteSessions.find(s=>s.id===remote).seats.map(s=>s.id),participantsCoLocated:false}:{}),
   ...(row.targetId?{targetId:row.targetId,participants:remote?(data.remoteSessions.find(s=>s.id===remote).seats.map(s=>s.id)):['$target'],coLocated:!remote&&!contact,participantsCoLocated:!remote&&!contact}:{}),
   ...(row.participants?{participants:[...row.participants],participantsCoLocated:true}:{}),
   once:sequenceIds.has(row.id),duration:row.minutes,cancellation,requires:guard,
   ...(inquiry?{divination:inquiry.divination}:{}),
   ...(row.operation==='sleep'?{bodyCare:{kind:'sleep'}}:{}),
   // Keep a blocked local affordance visible, including missing means/order.
   visibleWhen:{all:[requires||{fact:'actor.life',op:'eq',value:'alive'},...(row.visibleWhen?[row.visibleWhen]:[]),
    ...(inquiry?[inquiry.visibleWhen]:[])]},
   completionRequires:guard,completionCoLocated:!remote&&!contact,completionFailure:cancellation,
   costs:structuredClone(inquiry?.costs||row.costs||[]),effects:[...structuredClone(inquiry?.effects||[]),...structuredClone(row.effects||[]),...operation.effects,
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
// A pack may expressly mark its ordinary, observable prerequisites as safe to
// explain. Unknown facts and unmarked source requirements stay neutral.
function disclosedReasons(rule,facts){
 if(!rule||!facts)return [];
 if(rule.all)return rule.all.flatMap(r=>disclosedReasons(r,facts));
 if(rule.any||rule.not)return [];
 const result=evaluateRule(rule,facts);
 return result.known&&!result.met&&rule.reason?[rule.reason]:[];
}
export function quotePlaceActs(state,commands,data,preview,{blocked='',decide=()=>({allowed:true}),facts=()=>null}={}){
 const place=state.simulation?.people?.player?.location,pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 const rows=new Map((data?.acts||[]).map(row=>[row.id,row]));
 return sequenceOffers(state,data,commands).filter(d=>d.location===place||pending.has(d.id)).flatMap(d=>{
  const row=rows.get(d.procedure?.parentId||d.id),q=preview(d);
  if(!row)return [];
  if(!q.visible)return [];
  const decision=decide(d);
  // Public remote presence is already part of the admitted guard. Explain that
  // specific known condition, not every compiled (possibly private) prerequisite.
  const remoteRule=row.remoteSession?d.requires?.all?.find(r=>r.fact===`remote.${row.remoteSession}.ready`):null;
  const publicFacts=row.publicReasons?facts(d):null;
  const known=row.publicReasons?disclosedReasons(d.divination?d.requires:row.requires,publicFacts):[];
  if(remoteRule)known.push(...disclosedReasons(remoteRule,publicFacts));
  const reasons=[...(q.reasons||[]).flatMap(r=>r==='The required knowledge, means or circumstances are missing.'&&known.length?known:[r.startsWith('Insufficient ')&&row.costReason?row.costReason:r]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const cost=d.divination?divinationCostText(state,d,q.eligible?q.costs:d.costs):row.costLabel||'no stock spent';
  return [{id:d.id,label:`${d.label} · ${q.duration??d.duration} min · ${cost}${d.cancellation==='forfeit'?' · inputs stay spent if stopped':''}`,
   description:d.procedure?d.description:row.description,...(row.flavour?{flavour:row.flavour}:{}),eligible:q.eligible&&!blocked&&decision.allowed,reasons,duration:q.duration??d.duration}];
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

// A disclosed stock view reads actual resource owners, without another inventory.
export function placeStockViews(state,data,observer='player'){
 const known=state.simulation?.knowledge?.[observer]||{};
 return (data?.stockViews||[]).filter(v=>known[v.knowledge]&&(!v.untilKnowledge||!known[v.untilKnowledge])).map(v=>({title:v.title,rows:v.rows.map(r=>({label:r.label,amount:state.actors?.[r.actor]?.resources?.[r.key]??null}))}));
}

// Current retained observations, not reconstructed completion history or pack text.
export function placeActRecords(state,data,observer='player'){
 const known=state.simulation?.knowledge?.[observer]||{};
 const keys=new Set((data?.acts||[]).flatMap(row=>[row.knowledgeKey,...(row.effects||[]).filter(e=>e.type==='knowledge'&&e.actor===observer).map(e=>e.key)]));
 return [...keys].flatMap(id=>{const k=known[id];return k?[{id,text:k.value,at:k.at}]:[];});
}

// A settled arrival holds a cast itinerary until its settled departure. Keep
// the actual body location authoritative: this never moves or recreates anyone.
export function placeActVisitors(state,data,actorId='player'){
 const completed=state.actors?.[actorId]?.completed||{},held=new Set();
 for(const visit of data?.visits||[]){
  if(!validId(visit.arrival)||!(validId(visit.departure)||visit.departure===null&&visit.continues===true)||!Array.isArray(visit.participants)||!visit.participants.length||!visit.participants.every(validId))throw Error('Invalid place visit.');
  if(completed[visit.arrival]&&!completed[visit.departure])for(const id of visit.participants)held.add(id);
 }
 return held;
}
