// Body care binds existing native sleep ports and simulation stock/jobs.
// No need clock, recovery rate, stock seed or dream location is owned here.
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const check=(ok,message)=>{if(!ok)throw Error(message);};
const eq=(fact,value,reason)=>({fact,op:'eq',value,reason});
function jsonSafe(x){
 check(x===null||['string','boolean'].includes(typeof x)||typeof x==='number'&&Number.isFinite(x)||typeof x==='object','Body rows must be JSON safe.');
 if(x&&typeof x==='object'){
  if(x.all||x.any)check(Array.isArray(x.all||x.any)&&(x.all||x.any).length>0,'Body requirements need predicates.');
  for(const v of Object.values(x))jsonSafe(v);
 }
}
export function defineBodyCare(data,{worldId,actorId='player',group,situationId,requires=null}={}){
 check([worldId,actorId,group,situationId].every(id),'Invalid body binding.');
 if(data==null)return [];
 jsonSafe(data);check(Array.isArray(data.acts),'Expected body acts.');
 const ids=new Set();
 return data.acts.map(row=>{
  check(Object.keys(row).every(k=>['id','kind','label','description','report','place','minutes','minutesBasis','participants','food','requires','ownerNeeded','source','sourceStepId','sourceStepIds','locator'].includes(k)),'Unsupported body effect needs its owner.');
  check(id(row.id)&&!ids.has(row.id)&&['sleep','wake','care','meal'].includes(row.kind)&&text(row.label)&&text(row.report),'Invalid body act.');
  ids.add(row.id);
  check(row.place==null||id(row.place),'Invalid body place.');
  const minutes=row.minutes??0;
  check(Number.isSafeInteger(minutes)&&minutes>=0&&(row.kind!=='sleep'||minutes>0)&&(row.kind!=='wake'||minutes===0),'Sleep needs a supported duration; waking is immediate.');
  check(!['sleep','wake'].includes(row.kind)||actorId==='player','Another body needs its sleep owner.');
  check(row.participants==null||Array.isArray(row.participants),'Body participants need an array.');
  const participants=[...new Set([actorId,...(row.participants||[])])];
  check(participants.every(id),'Invalid meal participants.');
  check(row.food==null||row.kind==='meal'&&Array.isArray(row.food),'Food belongs to a meal.');
  const food=(row.food||[]).map(f=>{
   check(Object.keys(f).every(k=>['owner','key','amount'].includes(k)),'Unsupported food field.');
   check(id(f.owner)&&id(f.key)&&(f.amount==null||Number.isFinite(f.amount)&&f.amount>0),'Invalid food allocation.');
   return {owner:f.owner,key:f.key,amount:f.amount??null};
  });
  const support={all:[eq('actor.life','alive','This body needs to be alive.'),...(requires?[requires]:[]),...(row.requires?[row.requires]:[])]};
  const receiptKey=`body.care.${row.id}`;
  const effects=[{type:'knowledge',actor:actorId,key:receiptKey,stage:'seen',value:row.report,basis:{kind:'observation',attributedTo:actorId,situationId,participants,food}}];
  // Missing physiology owners remain explicit facts, without fabricated vitals.
  if(row.ownerNeeded!=null){check(text(row.ownerNeeded),'Name the missing owner.');effects.push({type:'fact',scope:'actor',actor:actorId,key:`body.ownerNeeded.${row.id}`,value:row.ownerNeeded});}
  const costs=food.filter(f=>f.amount!=null).map(f=>({type:'resource',actor:f.owner,key:f.key,amount:-f.amount}));
  return {id:row.id,revision:1,label:row.label,description:row.description||row.report,worldId,actorId,group,
   ...(row.place?{location:row.place}:{}),participants:participants.filter(p=>p!==actorId).length?participants.filter(p=>p!==actorId):[actorId],participantsCoLocated:true,
   once:false,duration:minutes,cancellation:'refund',visibleWhen:requires||eq('actor.life','alive','This body needs to be alive.'),
   requires:{all:[support,eq('bodyCare.sleeping',row.kind==='wake',row.kind==='wake'?'You are already awake.':'Wake first: you are asleep.')]},
   ...(minutes>0?{completionRequires:support,completionCoLocated:true,completionFailure:'refund'}:{}),costs,effects,
   bodyCare:{kind:row.kind,receiptKey,participants,food,minutesKnown:row.minutes!=null,ownerNeeded:row.ownerNeeded??null}};
 });
}
export function quoteBodyCare(state,commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 return commands.flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  const food=d.bodyCare.food;
  return [{id:d.id,perspective:'Your body',label:`${d.label}${d.bodyCare.minutesKnown?` · ${d.duration} min`:''}`,description:d.description,
   costText:food.length?food.map(f=>`${f.key}: ${f.amount==null?'amount unknown':f.amount} from ${f.owner}`).join('; '):d.bodyCare.kind==='meal'?'Food and portions not recorded.':'No authored stock cost.',
   duration:d.bodyCare.minutesKnown?d.duration:null,eligible:q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}
