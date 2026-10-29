import {evaluateRule} from './rules.js';
// Pack routes reuse native jobs, purse reservation, relocation and observations.
// This adapter owns no clock, location or save slice.
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const natural=x=>Number.isSafeInteger(x)&&x>=0;
export function defineJourneys(data,{worldId,actorId='player',group,situationId,requires=null,hourFact='journey.hour',moneyFact='journey.money'}={}){
 if(![worldId,actorId,group,situationId].every(validId))throw Error('Invalid journey binding.');
 const ids=new Set();
 const rows=Array.isArray(data)?data:data?.journeys||[];
 if(!Array.isArray(rows))throw Error('Invalid journeys.');
 return rows.map(row=>{
  if(![row.id,row.from,row.to,row.means].every(validId)||ids.has(row.id)||!row.label||!row.report||!natural(row.minutes)||row.minutes<1||row.fare!=null&&!natural(row.fare)||row.hours!=null&&(!Array.isArray(row.hours)||row.hours.length!==2||row.hours.some(h=>!Number.isInteger(h)||h<0||h>24)||row.hours[0]>=24||row.hours[0]===row.hours[1]))throw Error('Invalid journey.');
  ids.add(row.id);
  const support={all:[...(requires?[requires]:[]),...(row.requires?[structuredClone(row.requires)]:[])]};
  const gates=[support],fare=row.fare??null;
  if(row.hours){const [from,to]=row.hours,reason=`Service runs ${from}:00–${to}:00.`,lo={fact:hourFact,op:'gte',value:from,reason},hi={fact:hourFact,op:'lte',value:to-1,reason};gates.push(from<to?{all:[lo,hi]}:{any:[lo,hi],reason});}
  if(fare>0)gates.push(actorId==='player'?{fact:moneyFact,op:'gte',value:fare,reason:`You need ${fare} money for the fare.`}:{fact:'actor.life',op:'eq',value:'unpaid',reason:'Unpaid fill: this actor needs a purse owner before paid travel.'});
  const receiptKey=`journey.arrived.${row.id}`;
  return {id:row.id,revision:1,label:row.label,description:row.description||`Travel by ${row.means} to the destination.`,worldId,actorId,group,
   location:row.from,once:false,duration:row.minutes,cancellation:'refund',visibleWhen:requires||{fact:'actor.life',op:'eq',value:'alive'},requires:{all:gates},
   completionRequires:support,completionCoLocated:true,completionFailure:'refund',
   costs:fare>0&&actorId==='player'?[{type:'resource',actor:actorId,key:'money',native:true,amount:-fare}]:[],
   effects:[{type:'relocate',actor:actorId,location:row.to},{type:'knowledge',actor:actorId,key:receiptKey,stage:'seen',value:row.report,basis:{kind:'observation',attributedTo:actorId,situationId}}],
   journey:{from:row.from,to:row.to,means:row.means,fare,hours:row.hours?structuredClone(row.hours):null,receiptKey}};
 });
}
export function quoteJourneys(state,commands,preview,{facts=null,blocked='',decide=()=>({allowed:true}),label=id=>id}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...new Set([...q.reasons,...(facts?evaluateRule(d.requires,facts(d)).reasons:[])]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return [{id:d.id,...d.journey,perspective:'Your journey',label:`${d.label} · ${d.duration} min`,description:d.description,
   duration:d.duration,costs:structuredClone(d.costs),costText:d.journey.fare==null?'Fare not recorded.':d.journey.fare===0?'No fare.':`${d.journey.fare} money fare.`,
   routeText:`${label(d.journey.from)} → ${label(d.journey.to)} · ${d.journey.means}`,
   eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
export function pendingJourneyReports(state,commands,worldId){
 return commands.some(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.journey.receiptKey];return k&&state.worlds?.[worldId]?.facts?.[`journey.reported.${d.id}`]!==k.cause;});
}
export function settleJourneyReports(state,commands,worldId){
 const facts=state.worlds?.[worldId]?.facts;if(!facts)return [];
 return commands.flatMap(d=>{const k=state.simulation?.knowledge?.[d.actorId]?.[d.journey.receiptKey],marker=`journey.reported.${d.id}`;
  if(!k||facts[marker]===k.cause)return [];facts[marker]=k.cause;
  return [{text:k.value,at:k.at,kind:'events',actor:d.actorId,place:d.journey.to}];
 });
}
