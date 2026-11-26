// Optional player-directed continuation of the ch10 recovery comparison.
// Existing English b1 ch10 P033–043 qualifies natural recovery and the full
// stone refill. Leaving with a partial sea and its controls are authored.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD,riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_REFINEMENT} from './book_gu_lead_refinement.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';
import {leadMoonlightKey} from './book_gu_lead_selection.js';
export const GU_FIRST_NIGHT_CHOICE=id('first_night_choice');
const local=n=>`${GU_FIRST_NIGHT_CHOICE}.${n}`;
export const GU_FIRST_NIGHT_SLEEP_ACTION=local('begin_sleep');
export const GU_FIRST_NIGHT_STARTED=local('started');
export const GU_FIRST_NIGHT_DEPART_ACTION=local('set_out');
export const GU_FIRST_NIGHT_STONE_ACTION=local('stone');
export const GU_FIRST_NIGHT_DEPARTED=local('departed');
export const GU_FIRST_NIGHT_DRAW_FIRST_ACTION=local('draw_part_0');
export const guFirstNightDrawnKey=parts=>JSON.stringify({id:local(`stone_drawn_${parts}`)});
const eq=(fact,value=true)=>({fact,op:'eq',value});
const all=(...rules)=>({all:rules});
const energy=id('primeval'),home=id('home');
const stone=JSON.stringify({id:`${GU_LEAD_REFINEMENT}.primeval_stone`});
const drawn=JSON.stringify({id:`${GU_LEAD_REFINEMENT}.drawn_stone`});
const note=(n,value)=>({type:'knowledge',actor:'player',key:local(n),stage:'understood',value});
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),eq('actor.location',home),eq(`item.${leadMoonlightKey}`,1),eq(`faculty.${id('aperture')}.active`),eq(`claim.${id('academy_roll')}.owner`,'player'),eq(`claim.${id('academy_roll')}.held`),eq(`completed.${GU_LEAD_REFINEMENT}.infuse`));
const open=eq(`${GU_FIRST_NIGHT_CHOICE}.open`),admitted=eq(extensionFact(GU_FIRST_NIGHT_CHOICE));
const support=all(ready,admitted,open);
function instant(n,label,description,effects) {
 const means=n==='ready_stone'?all(support,{fact:`item.${stone}`,op:'gte',value:1},{fact:`energy.${energy}.reserve`,op:'lte',value:43}):support;
 return {id:local(n),revision:1,label,description,group:'structured_local',worldId:id('world'),actorId:'player',location:home,audience:['$actor'],once:true,duration:0,visibleWhen:means,requires:means,costs:[],effects};
}
// The opening source demonstrates thirty parts drawn from one stone. These
// carrier states record the parts actually drawn, not a total capacity or a
// depleted state. In this window the sea needs at most those thirty parts.
const measuredItems=Array.from({length:30},(_,i)=>({id:local(`stone_drawn_${i+1}`),label:`Primeval stone · ${i+1} ${i?'parts':'part'} drawn`,description:`The stone you kept after drawing ${i+1} ${i?'parts':'part'} of essence. Its total remaining charge is unmeasured.`,value:1}));
const measuredDraws=Array.from({length:30},(_,parts)=>{
 const input=parts?guFirstNightDrawnKey(parts):stone,output=guFirstNightDrawnKey(parts+1);
 const admission=all(support,{any:[eq(`knowledge.${GU_FIRST_NIGHT_STARTED}.seen`),eq(`knowledge.${local('stone_started')}.seen`)]},{fact:`energy.${energy}.reserve`,op:'lte',value:43},{fact:`item.${input}`,op:'gte',value:1});
 return {id:local(`draw_part_${parts}`),revision:1,label:parts?`Draw one more part from your stone · ${parts} drawn`:'Draw one part from an untouched stone',description:'Draw one part of essence in one minute and keep the same stone. You may then go on, draw another part, or sleep. Stopping before this minute finishes returns the reserved stone unchanged.',group:'structured_local',worldId:id('world'),actorId:'player',location:home,audience:['$actor'],once:false,queueRepeatable:false,duration:1,visibleWhen:admission,requires:admission,completionRequires:all(support,{fact:`energy.${energy}.reserve`,op:'lte',value:43}),completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,costs:[{type:'item',actor:'player',key:input,amount:-1}],effects:[{type:'energy',actor:'player',energyId:energy,operation:'recover',amount:1},{type:'item',actor:'player',key:output,amount:1},note('stone_measured','You draw one part of essence and keep the partly drawn stone. You can stop here or take another part.')]};
});
export const guLeadFirstNightChoice={schema:1,id:GU_FIRST_NIGHT_CHOICE,revision:1,
 base:{id:GU_LEAD,revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},
 dependsOn:[GU_LEAD_REFINEMENT],label:'Choose when to leave the house',
 description:'Sleep here, draw from a carried stone, or go on with the reserve you have. You do not need a full sea to leave.',
 requires:all(ready,open),reason:'Keep your unrefined Moonlight Gu with you after its first resistance, before leaving the house.',
 supportAlternatives:[{target:{id:GU_LEAD_VITAL,revision:1,contentHash:'sha256:89c5e2f92e0baa4a354350c0d904962dc6b8e96911ac3e5770404767acb3b441'},admission:true,commands:[`${GU_LEAD_VITAL}.leave`],replaces:eq(`completed.${GU_LEAD_REFINEMENT}.draw_stone`),requires:{any:[eq(`knowledge.${GU_FIRST_NIGHT_DEPARTED}.seen`),eq(`knowledge.${local('stone_recovered')}.seen`)]}}],
 items:measuredItems,
 status:[{id:local('sleep_status'),label:'Your recovery',knowledgeKey:GU_FIRST_NIGHT_STARTED},{id:local('departure_status'),label:'Your decision',knowledgeKey:GU_FIRST_NIGHT_DEPARTED},{id:local('stone_status'),label:'Your stone',knowledgeKey:local('stone_recovered')},{id:local('measured_status'),label:'Measured draw',knowledgeKey:local('stone_measured')},{id:local('stone_started_status'),label:'Stone at hand',knowledgeKey:local('stone_started')}],
 commands:[...measuredDraws,
  instant('begin_sleep','Sleep in your bed','Lie down in your bed and sleep. Time passes, your body rests and your sea recovers naturally. Wake when you choose; you do not need a full sea to leave.',[note('started','You settle in to sleep. Your primeval sea recovers naturally while time passes. A carried stone remains the faster option.')]),
  instant('ready_stone','Take out a stone for a measured draw','Keep one untouched primeval stone at hand. You can draw one part at a time without going to sleep.',[note('stone_started','You take out a primeval stone. You may draw a measured part and keep it, or go on with your present reserve.')]),
  instant('set_out','Go on with your current reserve','Stop sleeping or other work first. Keep the essence you have recovered and your carried stones. The inn still charges two stones; later workings need their actual essence.',[note('departed','You decide to go on with the reserve you have, keeping your unrefined Moonlight Gu and your carried stones.')]),
  {id:GU_FIRST_NIGHT_STONE_ACTION,revision:1,label:'Fill the remaining sea from a stone',description:'Draw until your sea is full. Set aside one untouched stone and keep it partly drawn afterward. This is a complete top-up, not a choice of a smaller charge. Stopping returns the reserved stone; elapsed time and natural recovery remain.',group:'structured_local',worldId:id('world'),actorId:'player',location:home,audience:['$actor'],once:true,duration:1,
   visibleWhen:all(support,{fact:`energy.${energy}.reserve`,op:'lte',value:43}),requires:all(support,{fact:`energy.${energy}.reserve`,op:'lte',value:43},{fact:`item.${stone}`,op:'gte',value:1}),completionRequires:support,completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,
   durationRecovery:{energyId:energy,minutesPerPart:1},costs:[{type:'item',actor:'player',key:stone,amount:-1}],effects:[{type:'energy',actor:'player',energyId:energy,operation:'recover',amount:44},{type:'item',actor:'player',key:drawn,amount:1},note('stone_recovered','Your sea is full again. You keep the partly drawn stone and your unrefined Moonlight Gu.')]}
 ]};
let installed=null;
export const guFirstNightChoiceExtension=()=>installed;
export async function registerGuLeadFirstNightChoice(register,base) {
 if(!register.bundledInstantExtension||!base.extensions?.some(e=>e.id===GU_LEAD_VITAL))return null;
 installed=await register.bundledInstantExtension(guLeadFirstNightChoice,base);return installed;
}
