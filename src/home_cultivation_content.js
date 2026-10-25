// Finite imported qi, taught through the household's existing jobs and roster.
import {QI_FIELD,QI_FIELD_MINUTES,SEALED_CONDENSATE} from './cultivation_items.js';
export const CULTIVATION_KEEPER='home.manor.keeper';
export const CULTIVATION_STEWARD='home.manor.steward';
export const CULTIVATION_ROOM='Arlmere family manor';
export const CRADLE_FILM='home.cradleFilm';
export const FIELD_SERVICE_TERMS=Object.freeze({filmPerPacket:1,lossPerFilm:.05,cleanedPerVisit:1});
const eq=(fact,value)=>({fact,op:'eq',value});
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const ready={all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},{fact:'resource.home.energy',op:'gte',value:20}]};
const field={all:[eq('actor.home.employed',true),eq('location',CULTIVATION_ROOM),{fact:`condition.${QI_FIELD}`,op:'gte',value:1}]};
const K=CULTIVATION_KEEPER,S=CULTIVATION_STEWARD;
const command=(id,label,extra)=>({id:'home.cultivation.'+id,revision:1,label,worldId:'base.frontier',group:'home_work',actorId:K,location:CULTIVATION_ROOM,duration:30,cancellation:'refund',reservationReturns:1,completionFailure:'refund',costs:[],effects:[],...extra});
export const cultivationDefinitions={conditions:[{id:QI_FIELD,revision:1,label:'Released condensate in the manor cradle',stacking:'max',absence:'zero'}],commands:[
 command('release','Toma releases one sealed condensate into the fitted cradle',{revision:2,duration:5,targetId:'player',participants:[K,'player'],participantsCoLocated:true,completionCoLocated:true,requires:ready,completionRequires:eq('actor.home.employed',true),
 costs:[{type:'item',actor:'player',key:JSON.stringify({id:SEALED_CONDENSATE}),amount:-1},res(K,'home.energy',-20),res(S,'home.estateFunds',-2)],effects:[res(K,'home.wages',2),res(K,'home.cultivationPractice',0),{type:'condition',actor:K,id:QI_FIELD,operation:'apply',duration:QI_FIELD_MINUTES},res(S,CRADLE_FILM,FIELD_SERVICE_TERMS.filmPerPacket)]}),
 command('clean','Toma cleans the estate cradle feed-space',{duration:15,targetId:S,requires:{all:[ready,{fact:'target.resource.'+CRADLE_FILM,op:'gte',value:1}]},completionRequires:{all:[eq('actor.home.employed',true),eq('location',CULTIVATION_ROOM),{fact:'target.resource.'+CRADLE_FILM,op:'gte',value:1}]},costs:[{type:'item',actor:'player',key:JSON.stringify({id:'Charcoal'}),amount:-1},res(K,'home.energy',-10),res(S,'home.estateFunds',-2)],effects:[res(K,'home.wages',2),res(S,CRADLE_FILM,-FIELD_SERVICE_TERMS.cleanedPerVisit)],description:'Fifteen played minutes, one actual charcoal and two estate coins paid as wages remove one settled film from the room’s feed-space. The current field improves after completion; canceling returns unused reservations. The film stays with the estate when the portable cradle is packed.'}),
 command('study','Toma studies breath circulation in the actual field',{requires:{all:[ready,field,{not:{fact:'resource.home.cultivationPractice',op:'gte',value:6}}]},completionRequires:field,
 costs:[res(K,'home.energy',-20),res(S,'home.estateFunds',-2)],effects:[res(K,'home.wages',2),res(K,'home.cultivationPractice',1)]}),
 command('lesson','Practice circulation with the qualified Toma',{targetId:'player',participants:[K,'player'],participantsCoLocated:true,completionCoLocated:true,
 requires:{all:[ready,field,{fact:'resource.home.cultivationPractice',op:'gte',value:2}]},completionRequires:{all:[field,{fact:'resource.home.cultivationPractice',op:'gte',value:2}]},
 costs:[res(K,'home.energy',-20),res(S,'home.estateFunds',-3)],effects:[res(K,'home.wages',3),{type:'unlock',actor:'player',kind:'skill',id:'Meditation'},{type:'xp',actor:'player',skill:'Meditation',amount:12},res('player','home.cultivationContributions',1)]}),
 command('awakened_lesson','Study finer circulation with the awakened Toma',{targetId:'player',participants:[K,'player'],participantsCoLocated:true,completionCoLocated:true,requires:{all:[ready,field,eq('cultivation.awakened',true),eq('body.form','human'),{fact:'resource.home.cultivationPractice',op:'gte',value:2},{not:{fact:'target.resource.home.awakenedLessons',op:'gte',value:6}}]},completionRequires:{all:[field,eq('body.form','human'),eq('target.life','alive')]},costs:[res(K,'home.energy',-20),res(S,'home.estateFunds',-3)],effects:[res(K,'home.wages',3),{type:'unlock',actor:'player',kind:'skill',id:'Meditation'},{type:'xp',actor:'player',skill:'Meditation',amount:18},res('player','home.awakenedLessons',1)],description:'Toma’s observed awakening and two completed circulation studies support a six-lesson finer curriculum. Each lesson reserves thirty minutes, twenty of Toma’s effort and three estate coins paid as wages. Both people and the released field must remain present. Completion teaches eighteen native Meditation XP; cancellation returns unearned reservations.'}),
]};
export function activeHouseholdField(c){const p=c.people?.[K],v=c.conditions?.[K]?.[QI_FIELD];return p?.life==='alive'&&p.location===CULTIVATION_ROOM&&!!v&&(v.expiresAt==null||v.expiresAt>c.clock)&&v.intensity>0;}
export const cradleFilm=c=>Math.max(0,c.staffResources?.[S]?.[CRADLE_FILM]||0);
export const householdFieldPower=c=>activeHouseholdField(c)?1/(1+FIELD_SERVICE_TERMS.lossPerFilm*cradleFilm(c)):0;

// The patient's own queue owns timed residue work. No second treatment timer.
for(const actor of ['home.manor.steward','home.manor.cook','home.manor.keeper','home.manor.tutor'])for(const kind of ['purge','capacity']){
 const purge=kind==='purge',key=purge?'home.medicineResidue':'home.medicineCapacityBonus';
 cultivationDefinitions.commands.push(command(`${kind}.${actor}`,purge?'Medicinal residue purge':'Medicinal capacity appointment',{
  id:`home.medicine.${kind}.${actor}`,actorId:actor,duration:purge?12:24,requires:{all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},purge?{fact:'resource.home.medicineResidue',op:'gte',value:1}:{fact:'resource.home.medicineCapacityBonus',op:'lte',value:25}]},completionRequires:eq('actor.home.employed',true),
  costs:[{type:'item',actor:'player',key:JSON.stringify({id:'Charcoal'}),amount:purge?-2:-4},res(S,'home.estateFunds',purge?-2:-3)],
  effects:[res(actor,'home.wages',purge?2:3),res(actor,key,purge?{fact:'resource.home.medicineResidue',scale:-1,min:-5,max:0}:5)]
 }));
}
