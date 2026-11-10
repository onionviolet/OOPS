import {definePlaceActs} from './place_acts.js';
import {placeActStages} from './place_act_sequence.js';
import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_DUEL} from './book_world_hp_lead_duel.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

const P='book.hp.lead', HALL=P+'.school_hall', WORLD=P+'.world', RON=P+'.ron';
export const HP_LEAD_HALLOWEEN=P+'.w7_halloween';
const admittedKey=extensionFact(HP_LEAD_HALLOWEEN);
const complete=(id,reason)=>({fact:'completed.'+id,op:'eq',value:true,reason});
const duelDone=complete(HP_LEAD_DUEL+'.account','Finish the midnight outing first.');
const duelPinned={fact:extensionFact(HP_LEAD_DUEL),op:'eq',value:true,reason:duelDone.reason};
const anchor={fact:'actor.location',op:'eq',value:HALL,reason:'Return to the Great Hall to pick up school.'};
const house={fact:'actor.hp.lead.house',op:'eq',value:'gryffindor',reason:'This school account follows Gryffindor.'};
let loaded=null;
export const getHpLeadHalloween=()=>loaded?.pack??null;
export const hpLeadHalloweenFacts=context=>({
 [admittedKey]:!!context.structuredNative?.extensions?.some(e=>e.id===HP_LEAD_HALLOWEEN&&e.revision===1)
});
export const isHpHalloweenPassage=id=>loaded?.extension.commands.some(c=>c.id===id&&!!c.durationSinceKnowledge)??false;
export const hpHalloweenPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpHalloweenPassage);

export function hpHalloweenHousePoints(state){
 const facts=state.worlds?.[WORLD]?.facts??{};
 const awards=loaded?.pack.awards??[];
 const rows=awards.flatMap(({key,label})=>Number.isSafeInteger(facts[key])?[{label,delta:facts[key]}]:[]);
 return rows.length?{rows,change:rows.reduce((sum,r)=>sum+r.delta,0)}:null;
}

export function compileHpLeadHalloween(pack,base){
 const {data}=pack, stages=placeActStages(data);
 const duel=base.extensions?.find(e=>e.id===HP_LEAD_DUEL);
 const own=id=>typeof id==='string'&&id.startsWith(HP_LEAD_HALLOWEEN+'.');
 const short=value=>typeof value==='string'&&value.length>0&&value.length<=200;
 if(pack.schema!==1||base.id!==P||pack.baseHash!==base.contentHash||!duel||
    pack.predecessorHash!==duel.contentHash||!duel.commands.some(c=>c.id===HP_LEAD_DUEL+'.account')||
    data.sequences?.length!==1||data.sequences[0].id!==HP_LEAD_HALLOWEEN||stages.length!==data.acts.length||
    data.acts.some(a=>a.place!==HALL||!own(a.id)||a.knowledgeKey!==a.id+'.seen'||
     a.operation!=='use'||a.targetId&&a.targetId!==RON||a.participants||a.contact||a.remoteSession||a.inquiryStep||
     a.clockAnchor!=null&&a.clockAnchor!==P+'.opening'||a.clockAnchor&&a.targetId||
     [a.venue,a.label,a.description,a.report].some(value=>!short(value)))||
    !Array.isArray(pack.awards)||pack.awards.length!==3||new Set(pack.awards.map(a=>a.key)).size!==3||
    pack.awards.some(a=>!own(a.key)||!short(a.label)||!data.acts.some(row=>row.effects?.some(e=>e.type==='fact'&&e.scope==='world'&&e.key===a.key&&Number.isSafeInteger(e.value))))){
  throw Error('Invalid Halloween account for this school life.');
 }
 const commands=definePlaceActs(data,{worldId:WORLD,group:'structured_local',situationId:P+'.situation'});
 const byId=new Map(commands.map(c=>[c.id,c])),rows=new Map(data.acts.map(a=>[a.id,a]));
 const admitted={fact:admittedKey,op:'eq',value:true,reason:'Continue from the Great Hall first.'};
 return {
  schema:1,id:HP_LEAD_HALLOWEEN,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:'Continue to Halloween',description:'Receive your broom, train with Wood and follow the school term through Halloween.',
  requires:{all:[duelPinned,duelDone,anchor,house]},reason:'Finish the midnight outing and return to the Great Hall first.',
  items:pack.items,
  status:pack.status,
  commands:stages.map((stage,index)=>{
   const c=byId.get(stage.commandId),row=rows.get(c.id),previous=stages[index-1];
   const order=previous?complete(previous.commandId,'Finish the preceding part of the school day first.'):duelDone;
   const guard={all:[admitted,duelPinned,duelDone,house,
    {fact:'actor.life',op:'eq',value:'alive'},{fact:'native.ready',op:'eq',value:true},
    ...(previous?[order]:[]),...(row.requires?[row.requires]:[])]};
   return {...c,requires:guard,completionRequires:guard,visibleWhen:{all:[admitted,order]},audience:['$actor'],reservationReturns:1,
    ...(row.clockAnchor?{durationSinceKnowledge:row.clockAnchor}:{})};
  })
 };
}

export async function registerHpLeadHalloween(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_DUEL))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/halloween.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadHalloween(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP Halloween continuation unavailable: '+error.message);
  return null;
 }
}
