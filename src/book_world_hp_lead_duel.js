import {definePlaceActs} from './place_acts.js';
import {placeActStages} from './place_act_sequence.js';
import {extensionFact} from './structured_pack_extensions.js';
import {HP_LEAD_FLIGHT,hpSchoolExcursionClockRequest} from './book_world_hp_lead_flight.js';

const P='book.hp.lead', HALL=P+'.school_hall';
export const HP_LEAD_DUEL=P+'.w7_duel';
const ADMITTED=extensionFact(HP_LEAD_DUEL);
const completed=(id,reason)=>({fact:'completed.'+id,op:'eq',value:true,reason});
const flightDone=completed(HP_LEAD_FLIGHT+'.decision','Finish the flying lesson and speak with Professor McGonagall first.');
const flightPinned={fact:extensionFact(HP_LEAD_FLIGHT),op:'eq',value:true,reason:flightDone.reason};
const anchor={fact:'actor.location',op:'eq',value:HALL,reason:'Return to the Great Hall to pick up the evening.'};
let loaded=null;
export const getHpLeadDuel=()=>loaded?.pack??null;
export const hpLeadDuelFacts=context=>({
 [ADMITTED]:!!context.structuredNative?.extensions?.some(e=>e.id===HP_LEAD_DUEL&&e.revision===1)
});
export const isHpDuelPassage=id=>id===HP_LEAD_DUEL+'.supper'||id===HP_LEAD_DUEL+'.wait';
export const hpDuelPassageClockRequest=(state,record)=>hpSchoolExcursionClockRequest(state,record,loaded?.extension,isHpDuelPassage);

// This continuation uses the already admitted school anchor, player inventory,
// command clock and save receipts. Character actions are witnessed in the scene.
export function compileHpLeadDuel(pack,base){
 const {data}=pack,stages=placeActStages(data);
 if(pack.schema!==1||base.id!==P||pack.baseHash!==base.contentHash||
    !base.extensions?.some(e=>e.id===HP_LEAD_FLIGHT&&e.commands.some(c=>c.id===HP_LEAD_FLIGHT+'.decision'))||
    data.sequences?.length!==1||data.sequences[0].id!==HP_LEAD_DUEL||stages.length!==data.acts.length||
    data.acts.some(a=>a.place!==HALL||!a.id.startsWith(HP_LEAD_DUEL+'.')||a.knowledgeKey!==a.id+'.seen'||
     a.effects?.length||a.operation!=='use'||a.targetId||a.participants||a.contact||a.remoteSession||a.inquiryStep||
     [a.venue,a.label,a.description,a.report].some(value=>typeof value!=='string'||!value||value.length>200))){
  throw Error('Invalid midnight appointment for this school life.');
 }
 const commands=definePlaceActs(data,{worldId:P+'.world',group:'structured_local',situationId:P+'.situation'});
 const byId=new Map(commands.map(c=>[c.id,c])), rows=new Map(data.acts.map(a=>[a.id,a]));
 const admitted={fact:ADMITTED,op:'eq',value:true,reason:'Continue the evening from the Great Hall first.'};
 return {
  schema:1,id:HP_LEAD_DUEL,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:'Continue to supper',description:'Follow the evening after your first flying lesson.',
  requires:{all:[flightPinned,flightDone,anchor]},reason:'Finish the flying lesson and return to the Great Hall first.',
  commands:stages.map((stage,index)=>{
   const c=byId.get(stage.commandId),row=rows.get(c.id),previous=stages[index-1];
   const order=previous?completed(previous.commandId,`First: ${previous.label}.`):flightDone;
   const guard={all:[admitted,flightPinned,flightDone,{fact:'actor.life',op:'eq',value:'alive'},
    {fact:'native.ready',op:'eq',value:true},...(previous?[order]:[]),...(row.requires?[row.requires]:[])]};
   return {...c,requires:guard,completionRequires:guard,visibleWhen:{all:[admitted,order]},audience:['$actor'],reservationReturns:1};
  })
 };
}

export async function registerHpLeadDuel(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.extensions?.some(e=>e.id===HP_LEAD_FLIGHT))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/duel.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadDuel(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP midnight appointment unavailable: '+error.message);
  return null;
 }
}
