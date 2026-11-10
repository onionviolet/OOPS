// The flight is a finite excursion from an already admitted school location.
// Only the extension pin and native command receipts persist.
import {definePlaceActs} from './place_acts.js';
import {placeActSequenceView,placeActStages} from './place_act_sequence.js';

const P='book.hp.lead', HALL=P+'.school_hall';
export const HP_LEAD_FLIGHT=P+'.w7';
const ADMITTED='structured.extension.'+HP_LEAD_FLIGHT+'.admitted';
const W6_RETURN=P+'.w6.return';
const SCHOOL_PASSAGE_MINUTES=120;
const completed=(id,reason)=>({fact:'completed.'+id,op:'eq',value:true,reason});
const weekDone=completed(W6_RETURN,'Return from Friday tea before continuing to the next school week.');
let loaded=null;
export const getHpLeadFlight=()=>loaded?.pack??null;
export const hpLeadFlightFacts=context=>({
 [ADMITTED]:!!context.structuredNative?.extensions?.some(e=>e.id===HP_LEAD_FLIGHT&&e.revision===1)
});
export const isHpSchoolPassage=id=>id===HP_LEAD_FLIGHT+'.breakfast'||id===HP_LEAD_FLIGHT+'.field';

// Quote a faster pace for the accepted school-day passage. The native clock
// still advances and settles the existing job at its original due minute.
export function hpSchoolPassageClockRequest(state,record,extension=loaded?.extension){
 return hpSchoolExcursionClockRequest(state,record,extension,isHpSchoolPassage);
}

export function hpSchoolExcursionClockRequest(state,record,extension,isPassage){
 const pupil=state.simulation?.people?.player;
 if(!extension||record?.packId!==P||record.revision!==extension.base.revision||record.contentHash!==extension.base.contentHash||
    state.actors?.player?.worldId!==P+'.world'||pupil?.location!==HALL||pupil.life!=='alive'||
    pupil.body?.ownerId!=='player'||pupil.body?.controllerId!=='player')return null;
 const pin=record.extensions?.find(e=>e.id===extension.id);
 if(!pin||pin.contentHash!==extension.contentHash||pin.revision!==extension.revision)return null;
 const job=state.simulation.jobs.find(j=>j.actorId==='player'&&isPassage(j.commandId));
 if(!job||job.targetId!==null||job.participants?.length!==1||job.participants[0]!=='player'||
    job.completionSupport?.location!==HALL)return null;
 const command=extension.commands.find(c=>c.id===job.commandId),remaining=job.due-state.clock;
 if(!command||job.revision!==command.revision||!Number.isSafeInteger(remaining)||remaining<=0||remaining>command.duration)return null;
 return Math.min(SCHOOL_PASSAGE_MINUTES,remaining);
}

export function compileHpLeadFlight(pack,base){
 const {data}=pack,stages=placeActStages(data);
 if(pack.schema!==1||pack.baseHash!==base.contentHash||base.id!==P||
    !base.simulation.commands.some(c=>c.id===W6_RETURN)||data.sequences?.length!==1||
    stages.length!==data.acts.length||data.acts.some(a=>a.place!==HALL||!a.id.startsWith(HP_LEAD_FLIGHT+'.')||
     a.knowledgeKey!==a.id+'.seen'||a.effects?.length||a.operation!=='use'||
     a.targetId||a.participants||a.contact||a.remoteSession||a.inquiryStep||
     [a.label,a.description,a.report].some(value=>typeof value!=='string'||value.length>200))){
  throw Error('Invalid flying lesson for this school life.');
 }
 const commands=definePlaceActs(data,{worldId:P+'.world',group:'structured_local',situationId:P+'.situation',requires:weekDone});
 const prior=new Map(stages.map((s,i)=>[s.commandId,stages[i-1]]));
 return {
  schema:1,id:HP_LEAD_FLIGHT,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:'The first flying lesson',
  description:'Follow the next school week from the Great Hall to the flying lawn and back.',
  requires:weekDone,reason:weekDone.reason,
  commands:commands.map(c=>{
   const last=prior.get(c.id);
   const order=last?completed(last.commandId,'Finish the previous part of the flying lesson first.'):weekDone;
   const admitted={fact:ADMITTED,op:'eq',value:true,reason:'Continue to the flying lesson from the Great Hall first.'};
   // Native command completion is the authority. The sequence view reads its
   // witnessed reports, but a report alone does not unlock a later action.
   const row=data.acts.find(a=>a.id===c.id);
   const guard={all:[admitted,{fact:'actor.life',op:'eq',value:'alive'},{fact:'native.ready',op:'eq',value:true},
    weekDone,...(last?[order]:[]),...(row.requires?[row.requires]:[])]};
   return {...c,requires:guard,completionRequires:guard,visibleWhen:{all:[admitted,order]},audience:['$actor'],reservationReturns:1};
  })
 };
}

export function hpLeadFlightArc(state,pack){
 return pack?placeActSequenceView(state,pack.data):null;
}

export async function registerHpLeadFlight(register,base,fetchFile=globalThis.fetch){
 loaded=null;
 if(!register.extension||!base.simulation.commands.some(c=>c.id===W6_RETURN))return null;
 try{
  const file=await fetchFile('private_packs/hp-cast/flight.json');
  if(!file.ok)return null;
  const pack=await file.json();
  const extension=await register.extension(compileHpLeadFlight(pack,base),base);
  loaded={pack,extension};
  return extension;
 }catch(error){
  console.warn('HP flying lesson unavailable: '+error.message);
  return null;
 }
}
