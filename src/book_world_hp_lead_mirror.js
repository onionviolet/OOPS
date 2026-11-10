// Harry's discovery uses the same native school commands as the match. The
// cloak is owned stock; the two views of the mirror belong to their observers.
import {definePlaceActs} from './place_acts.js';
import {placeActStages} from './place_act_sequence.js';
import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_QUIDDITCH} from './book_world_hp_lead_quidditch.js';
import {hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

const P='book.hp.lead', HALL=P+'.school_hall', WORLD=P+'.world', RON=P+'.ron';
export const HP_LEAD_MIRROR=P+'.w8_mirror';
const M=HP_LEAD_MIRROR;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const completed=(id,reason)=>eq('completed.'+id,true,reason);
const admittedKey=extensionFact(M);
const house=eq('actor.hp.lead.house','gryffindor','This school account follows Gryffindor.');
let loaded=null;
export const getHpLeadMirror=()=>loaded?.pack??null;
export const hpLeadMirrorFacts=context=>({
 [admittedKey]:!!context.structuredNative?.extensions?.some(e=>e.id===M&&e.revision===1)
});
export const isHpMirrorPassage=id=>loaded?.extension.commands.some(c=>c.id===id&&!!c.durationSinceKnowledge)??false;
export const hpMirrorPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpMirrorPassage);

const mirror={
 id:M,previous:HP_LEAD_QUIDDITCH,finish:'flamel',lead:'flamel-lead',
 finishReason:'Hear Hagrid’s account after the match first.',leadReason:'Hear Hagrid name Flamel first.',
 invalid:'Invalid Christmas account for this school life.',
 enter:'Continue to Christmas from the Great Hall first.',order:'Finish the preceding part of the holiday first.',
 label:'Continue to Christmas',
 description:'Follow up on Flamel in the library, stay at Hogwarts for Christmas and see what the holidays bring.',
 reason:'Finish the match and hear what Hagrid let slip first.'
};
export const compileHpLeadMirror=(pack,base)=>compileHpSchoolContinuation(pack,base,mirror);

export function compileHpSchoolContinuation(pack,base,school){
 const {id,previous,finish}=school;
 const place=school.place??HALL;
 const anchor=eq('actor.location',place,school.placeReason??'Return to the Great Hall first.');
 const matchDone=completed(previous+'.'+finish,school.finishReason);
 const matchPinned=eq(extensionFact(previous),true,matchDone.reason);
 const leadHeard=eq('knowledge.'+previous+'.'+school.lead+'.seen',true,school.leadReason);
 const {data}=pack,stages=placeActStages(data);
 const match=base.extensions?.find(e=>e.id===previous);
 const short=value=>typeof value==='string'&&value.length>0&&value.length<=200;
 if(pack.schema!==1||base.id!==P||pack.baseHash!==base.contentHash||!match||
    pack.predecessorHash!==match.contentHash||!match.commands.some(c=>c.id===previous+'.'+finish)||
    data.sequences?.length!==1||data.sequences[0].id!==id||stages.length!==data.acts.length||
    data.acts.some(a=>a.place!==place||!a.id.startsWith(id+'.')||a.knowledgeKey!==a.id+'.seen'||
     a.operation!=='use'||a.targetId&&a.targetId!==RON||a.participants||a.contact||a.remoteSession||a.inquiryStep||
     a.clockAnchor!=null&&a.clockAnchor!==P+'.opening'||a.clockAnchor&&a.targetId||
     [a.venue,a.label,a.description,a.report].some(value=>!short(value)))){
  throw Error(school.invalid);
 }
 const commands=definePlaceActs(data,{worldId:WORLD,group:'structured_local',situationId:P+'.situation'});
 const byId=new Map(commands.map(c=>[c.id,c])),rows=new Map(data.acts.map(a=>[a.id,a]));
 const admitted=eq(extensionFact(id),true,school.enter);
 return {
  schema:1,id,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:school.label,
  description:school.description,
  requires:{all:[matchPinned,matchDone,leadHeard,anchor,house]},reason:school.reason,
  ...(pack.items===undefined?{}:{items:pack.items}),...(pack.status===undefined?{}:{status:pack.status}),
  commands:stages.map((stage,index)=>{
   const c=byId.get(stage.commandId),row=rows.get(c.id),previous=stages[index-1];
   const order=previous?completed(previous.commandId,school.order):matchDone;
   const guard={all:[admitted,matchPinned,matchDone,leadHeard,house,
    eq('actor.life','alive'),eq('native.ready',true),
    ...(previous?[order]:[]),...(row.requires?[row.requires]:[])]};
   return {...c,requires:guard,completionRequires:guard,visibleWhen:{all:[admitted,order]},
    audience:['$actor'],reservationReturns:1,...(row.clockAnchor?{durationSinceKnowledge:row.clockAnchor}:{})};
  })
 };
}

export async function registerHpLeadMirror(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_QUIDDITCH))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/mirror.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadMirror(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP Christmas continuation unavailable: '+error.message);
  return null;
 }
}
