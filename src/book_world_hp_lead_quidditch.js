// The first match uses the school excursion's native command, clock and save
// owners. A broom's behaviour on the pitch is separate from its possession.
import {definePlaceActs} from './place_acts.js';
import {placeActStages} from './place_act_sequence.js';
import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_HALLOWEEN} from './book_world_hp_lead_halloween.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

const P='book.hp.lead', HALL=P+'.school_hall', WORLD=P+'.world', RON=P+'.ron';
export const HP_LEAD_QUIDDITCH=P+'.w8_quidditch';
const Q=HP_LEAD_QUIDDITCH;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const completed=(id,reason)=>eq('completed.'+id,true,reason);
const doneReason='Finish Halloween with Ron and Hermione first.';
const halloweenDone=completed(HP_LEAD_HALLOWEEN+'.thanks',doneReason);
const halloweenPinned=eq(extensionFact(HP_LEAD_HALLOWEEN),true,doneReason);
const admittedKey=extensionFact(Q);
const anchor=eq('actor.location',HALL,'Return to the Great Hall first.');
const house=eq('actor.hp.lead.house','gryffindor','This match follows Gryffindor.');
let loaded=null;
export const getHpLeadQuidditch=()=>loaded?.pack??null;
export const hpLeadQuidditchFacts=context=>({
 [admittedKey]:!!context.structuredNative?.extensions?.some(e=>e.id===Q&&e.revision===1)
});
export const isHpQuidditchPassage=id=>loaded?.extension.commands.some(c=>c.id===id&&!!c.durationSinceKnowledge)??false;
export const hpQuidditchPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpQuidditchPassage);

export function hpQuidditchMatch(state){
 const facts=state.worlds?.[WORLD]?.facts??{};
 const player=state.actors?.player;
 const position=facts[Q+'.position'];
 if(!position)return null;
 return {
  position,
  schoolDeduction:facts[Q+'.courtyard-deduction']??null,
  score:player?.completed?.[Q+'.tea']?{
   gryffindor:facts[Q+'.gryffindor-score'],
   slytherin:facts[Q+'.slytherin-score']
  }:null
 };
}

export function compileHpLeadQuidditch(pack,base){
 const {data}=pack,stages=placeActStages(data);
 const halloween=base.extensions?.find(e=>e.id===HP_LEAD_HALLOWEEN);
 const short=value=>typeof value==='string'&&value.length>0&&value.length<=200;
 if(pack.schema!==1||base.id!==P||pack.baseHash!==base.contentHash||!halloween||
    pack.predecessorHash!==halloween.contentHash||!halloween.commands.some(c=>c.id===HP_LEAD_HALLOWEEN+'.thanks')||
    data.sequences?.length!==1||data.sequences[0].id!==Q||stages.length!==data.acts.length||
    data.acts.some(a=>a.place!==HALL||!a.id.startsWith(Q+'.')||a.knowledgeKey!==a.id+'.seen'||
     a.operation!=='use'||a.targetId&&a.targetId!==RON||a.participants||a.contact||a.remoteSession||a.inquiryStep||
     a.clockAnchor!=null&&a.clockAnchor!==P+'.opening'||a.clockAnchor&&a.targetId||
     [a.venue,a.label,a.description,a.report].some(value=>!short(value)))){
  throw Error('Invalid Quidditch account for this school life.');
 }
 const commands=definePlaceActs(data,{worldId:WORLD,group:'structured_local',situationId:P+'.situation'});
 const byId=new Map(commands.map(c=>[c.id,c])),rows=new Map(data.acts.map(a=>[a.id,a]));
 const admitted=eq(admittedKey,true,'Continue to the match from the Great Hall first.');
 return {
  schema:1,id:Q,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:'Continue to your first Quidditch match',
  description:'Keep up with Wood’s practice and fly for Gryffindor when Madam Hooch calls the teams out.',
  requires:{all:[halloweenPinned,halloweenDone,anchor,house]},reason:'Finish Halloween and return to the Great Hall first.',
  status:pack.status,
  commands:stages.map((stage,index)=>{
   const c=byId.get(stage.commandId),row=rows.get(c.id),previous=stages[index-1];
   const order=previous?completed(previous.commandId,'Finish the preceding part of the match account first.'):halloweenDone;
   const guard={all:[admitted,halloweenPinned,halloweenDone,house,
    eq('actor.life','alive'),eq('native.ready',true),
    ...(previous?[order]:[]),...(row.requires?[row.requires]:[])]};
   return {...c,requires:guard,completionRequires:guard,visibleWhen:{all:[admitted,order]},
    audience:['$actor'],reservationReturns:1,...(row.clockAnchor?{durationSinceKnowledge:row.clockAnchor}:{})};
  })
 };
}

export async function registerHpLeadQuidditch(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_HALLOWEEN))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/quidditch.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadQuidditch(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP Quidditch continuation unavailable: '+error.message);
  return null;
 }
}
