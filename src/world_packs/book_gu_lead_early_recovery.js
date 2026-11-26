// Optional opening choice. Prepared English b1 ch10 P033–043 supplies
// C-grade natural recovery and the faster stone refill. Choosing natural rest,
// its controls and its later admission are authored alternatives to the scene.
import {riSeaMinutesPerPart} from '../ri_lead_day_facts.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD,riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';
import {leadMoonlightKey} from './book_gu_lead_selection.js';
export const GU_LEAD_EARLY_RECOVERY=id('early_recovery');
const name=n=>`${GU_LEAD_EARLY_RECOVERY}.${n}`;
const eq=(fact,value=true)=>({fact,op:'eq',value});
const all=(...rules)=>({all:rules});
const note=(key,value)=>({type:'knowledge',actor:'player',key:name(key),stage:'understood',value});
const energy=id('primeval'),home=id('home');
const stone=JSON.stringify({id:`${GU_LEAD_REFINEMENT}.primeval_stone`});
const drawn=JSON.stringify({id:`${GU_LEAD_REFINEMENT}.drawn_stone`});
const begun=eq(`knowledge.${name('started')}.seen`);
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),eq('actor.location',home),eq(`item.${leadMoonlightKey}`,1),eq(`faculty.${id('aperture')}.active`),eq(`claim.${id('academy_roll')}.owner`,'player'),eq(`claim.${id('academy_roll')}.held`),eq(`completed.${GU_LEAD_REFINEMENT}.infuse`));
const admitted=eq(extensionFact(GU_LEAD_EARLY_RECOVERY));
const open=eq(`${GU_LEAD_EARLY_RECOVERY}.open`);
const support=all(ready,admitted,begun,open);
const notFull={fact:`energy.${energy}.reserve`,op:'lte',value:43};
const finished=note('ready','Your primeval sea is full again. The Moonlight Gu remains unrefined. You can leave the house when you are ready.');
function act(n,label,duration,requires,description,effects,extra={}) {
 const command={id:name(n),revision:1,label,description,group:'structured_local',worldId:id('world'),actorId:'player',location:home,audience:['$actor'],once:false,duration,visibleWhen:requires,requires,completionRequires:all(ready,admitted,begun),completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,costs:[],effects,...extra};
 if(duration===0){delete command.completionRequires;delete command.completionCoLocated;}
 return command;
}
export const guLeadEarlyRecovery={schema:1,id:GU_LEAD_EARLY_RECOVERY,revision:1,
 base:{id:GU_LEAD,revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},
 label:'Recover after the first attempt',description:'Rest while your primeval sea recovers, or draw from a carried stone. Time spent resting lets the Gu push out the green trace.',
 dependsOn:[GU_LEAD_REFINEMENT],requires:all(ready,open),reason:'Rest here after your Moonlight Gu resists, before you draw from a stone or leave the house.',
 supportAlternatives:[{target:{id:GU_LEAD_VITAL,revision:1,contentHash:'sha256:89c5e2f92e0baa4a354350c0d904962dc6b8e96911ac3e5770404767acb3b441'},admission:true,commands:[`${GU_LEAD_VITAL}.leave`],replaces:eq(`completed.${GU_LEAD_REFINEMENT}.draw_stone`),requires:eq(`knowledge.${name('ready')}.seen`)}],
 status:[{id:name('choice_status'),label:'Recovery choice',knowledgeKey:name('started')},{id:name('ready_status'),label:'Recovered reserve',knowledgeKey:name('ready')}],
 commands:[
  act('begin','Settle down to recover',0,all(ready,admitted,open),
   'Your sea recovers four parts an hour without a stone. From fourteen to forty-four takes about seven and a half hours. The Gu keeps expelling the essence you pressed into it. You can stop resting and resume later; time and recovered essence remain.',
   [note('started','You set the unrefined Moonlight Gu beside you. Resting costs time, not a primeval stone. You can still choose a stone to recover faster.')],{once:true,completionRequires:all(ready,admitted)}),
  act('rest','Rest until your primeval sea fills',1,all(support,notFull),
   'Recover four parts an hour. The time shown follows your current reserve and the recovery already under way. Stop whenever you like; elapsed time, recovered essence and the fading green trace remain.',[finished],
   {durationRecovery:{energyId:energy,minutesPerPart:riSeaMinutesPerPart(44),anchorKnowledge:name('started')}}),
  act('stone','Draw from a stone for the remaining reserve',1,all(support,notFull,{fact:`item.${stone}`,op:'gte',value:1}),
   'Use one untouched primeval stone to fill the missing reserve, at about one part a minute. Keep the partly drawn stone. Stopping returns the reserved stone; natural recovery and time already passed remain.',
   [{type:'energy',actor:'player',energyId:energy,operation:'recover',amount:44},{type:'item',actor:'player',key:drawn,amount:1},finished],
   {durationRecovery:{energyId:energy,minutesPerPart:1},costs:[{type:'item',actor:'player',key:stone,amount:-1}]}),
  act('resume','Leave the resting place with a full reserve',0,all(support,eq(`energy.${energy}.reserve`,44)),
   'Your sea has filled while time passed. Keep your Gu and your untouched stones; prepare to leave the house.',[finished])
 ]};
let installed;
export async function registerGuLeadEarlyRecovery(register,base) {
 if(!register.bundledInstantExtension||!base.extensions?.some(e=>e.id===GU_LEAD_VITAL))return null;
 installed=await register.bundledInstantExtension(guLeadEarlyRecovery,base);return installed;
}

// The same guarded passage clock used by other lead-life work; it does not
// settle energy or invent elapsed time on preview.
export function guLeadEarlyRecoveryClockRequest(state,record,extension=installed) {
 const person=state.simulation?.people?.player,pin=record?.extensions?.find(p=>p.id===GU_LEAD_EARLY_RECOVERY);
 if(!extension||record?.packId!==GU_LEAD||record.contentHash!==guLeadEarlyRecovery.base.contentHash||record.revision!==1||!pin||pin.revision!==extension.revision||pin.contentHash!==extension.contentHash||state.actors?.player?.worldId!==id('world')||person?.life!=='alive'||person.location!==home||person.body?.mobile!==true||person.body.ownerId!=='player'||person.body.controllerId!=='player')return null;
 const job=state.simulation.jobs.find(j=>j.actorId==='player'&&[name('rest'),name('stone')].includes(j.commandId));
 if(!job||job.revision!==1||job.targetId!==null||job.participants?.length!==1||job.participants[0]!=='player'||job.completionSupport?.location!==home)return null;
 if(job.commandId===name('stone'))return null;
 const left=job.due-state.clock;
 return Number.isSafeInteger(left)&&left>0&&left<=660?Math.min(30,left):null;
}
