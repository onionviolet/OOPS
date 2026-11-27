// Authored optional pacing after the existing source household sequence.
// Native jobs, opening knowledge and the joined clock remain the time owners.
import {placeActStages} from './place_act_sequence.js';
import {extensionFact} from './structured_pack_extensions.js';
import {HP_ARRIVAL_DAY} from './world_packs/book_hp_lead_life_data.js';
const P='book.hp.lead';
export const HP_SUMMER=P+'.summer_routine';
export const HP_SUMMER_ACTION=HP_SUMMER+'.keep_household';
export const HP_TERM_OFFSET=HP_ARRIVAL_DAY*1440-480;
let loaded=null;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
export function hpSummerExtension(base,cast){
 if(!cast||!base?.simulation?.commands)return null;
 const last=cast&&placeActStages(cast.householdActs).at(-1)?.commandId;
 const departure=base.simulation.commands.find(c=>c.id===P+'.arrive_school')?.location;
 if(!last||!departure)return null;
 const done=eq('completed.'+last,true,'Finish the household sequence before settling into an ordinary routine.');
 const before={not:{fact:'hp.lead.day',op:'gte',value:HP_ARRIVAL_DAY},reason:'It is time to take the train to Hogwarts.'};
 const support={all:[eq('actor.life','alive'),eq(extensionFact(HP_SUMMER),true),done,
  eq('knowledge.'+P+'.opening.seen',true,'Begin this life before choosing a household routine.')]};
 return {schema:1,id:HP_SUMMER,revision:1,base:{id:base.id,revision:base.revision,contentHash:base.contentHash},
  label:'An ordinary household routine',description:'Keep the intervening household days until 1 September. You can stop to do something else; time already spent still counts.',
  requires:{all:[done,before]},reason:done.reason,commands:[{
   id:HP_SUMMER_ACTION,revision:1,label:'Keep a household routine until 1 September',
   description:'The days pass at a quicker pace through ordinary household life. Stop whenever you want. The routine ends at the school departure date; you choose when to take the train.',
   worldId:P+'.world',group:'structured_local',actorId:'player',location:departure,audience:['$actor'],once:false,
   visibleWhen:eq(extensionFact(HP_SUMMER),true),requires:{all:[support,before]},
   duration:HP_TERM_OFFSET,durationSinceKnowledge:P+'.opening',costs:[],effects:[],
   completionRequires:support,completionCoLocated:true,completionFailure:'refund',cancellation:'refund',reservationReturns:1,
  }]};
}
export function setHpSummerExtension(extension){loaded=extension;}
export function hpSummerClockRequest(state,record,extension=loaded){
 const command=extension?.commands[0],person=state.simulation?.people?.player;
 if(!command||record?.packId!==P||record.revision!==extension.base.revision||record.contentHash!==extension.base.contentHash||
    state.actors?.player?.worldId!==P+'.world'||person?.life!=='alive'||person.location!==command.location||
    person.body?.ownerId!=='player'||person.body?.controllerId!=='player')return null;
 const pin=record.extensions?.find(e=>e.id===extension.id);
 if(pin?.revision!==extension.revision||pin?.contentHash!==extension.contentHash)return null;
 const opening=state.simulation.knowledge?.player?.[P+'.opening'];
 const job=state.simulation.jobs.find(j=>j.actorId==='player'&&j.commandId===HP_SUMMER_ACTION);
 if(!opening||!job||job.revision!==command.revision||job.targetId!==null||job.participants?.length!==1||job.participants[0]!=='player'||
    job.completionSupport?.location!==command.location||job.due!==opening.at+HP_TERM_OFFSET)return null;
 const remaining=job.due-state.clock;
 return Number.isSafeInteger(remaining)&&remaining>0?Math.min(120,remaining):null;
}
