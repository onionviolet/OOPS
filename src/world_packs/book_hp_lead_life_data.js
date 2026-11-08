// Harry Potter lead life, book 1 chapter 2 opening (zoo Saturday). A NEW life beside book.hp.school and
// book.hp.trade; it touches neither (both stay preserve-dormant with their saved hashes). Source: lead-run
// scenes hp1c001 (private, not shipped); everything here is paraphrase or an authored proposal (AD32).
// Chapter 1 (the prologue) is not Harry's point of view and is deliberately absent from his knowledge.
// Compatibility decision: a new definition id with no earlier save state; old saves hold none of it.
// No calendar year (the book gives none): the clock is elapsed play, day 0 is the Saturday of the birthday.
import {lessonEffects} from '../lesson.js';
import {registerWorldTies,tieEffects,tieOfferCommands} from '../person_ties.js';
import {hpLeadMakingCommands as makingRows,hpLeadMakingItems,hpPotionsIssueEffects} from '../hp_lead_making.js';
const P='book.hp.lead', id=n=>`${P}.${n}`;
const note=(n,value)=>({type:'knowledge',key:id(n),stage:'understood',value});
const guardian=who=>({type:'relationship',actor:id(who),target:'player',axis:id('guardian_of'),amount:1000});
const alive={all:[{fact:'actor.life',op:'eq',value:'alive'},{fact:'native.ready',op:'eq',value:true}]};
// LT8 (proposal, docs/CROSS_WORLD_SYSTEMS_TRANSFER.md#lt8-ties): Ron's regard for Harry is a tie on the shared person record. Default:
// shared moments (the Sorting, the first Charms lesson) each raise affection by one. Dial: the offer's threshold (two). Reason: the book's
// friendship grows from shared school days; affection opens the evening talk where Ron tells Harry about his family.
export const HP_LEAD_TIES=registerWorldTies({worldId:id('world'),situationId:id('situation'),kinds:['affection'],people:{ron:id('ron')},
 shown:[{alias:'ron',kind:'affection',label:'Ron',none:'You have only just met.',noticed:'You have shared a few school moments.',moves:'Days together at school, at meals and in lessons, bring you closer.',seenPrefix:id('tie.ron.')}],
 offers:[{id:id('tie.ron_family'),alias:'ron',kind:'affection',atLeast:2,label:'Sit with Ron in the common room · 30 min',
  description:'An evening by the fire with Ron, once lessons are done.',
  blocked:'Ron is still a boy you shared a bench with; a few more days of school together first.',
  note:{key:id('tie.ron_family'),value:'Ron told you about his family: five older brothers, a younger sister, and hand-me-downs for almost everything he owns.'}}]});
const ronTie=(moment,value)=>tieEffects(id('world'),{alias:'ron',kind:'affection',seen:{key:id(`tie.ron.${moment}`),value}});

export const hpLeadLife={
 schema:2,id:P,revision:1,title:'Harry Potter · the boy under the stairs',
 description:'Opt-in lead life: a ten-year-old in his guardians\' household on the morning of his cousin\'s birthday. No income, no wand, no money of his own. Present magic has no learned method behind it.',
 compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock','jobs'],
 world:{id:id('world'),label:'Harry Potter · your guardians\' street (lead life)'},
 locations:[
  {id:id('cupboard'),label:'Your room under the stairs',description:'Your place in the house: a narrow space with a bed, a spider or two, and no door you can lock from inside.',underRoof:true},
  {id:id('kitchen'),label:'Your guardians\' kitchen',description:'Where breakfast is fried and the day\'s orders are given.',underRoof:true},
  {id:id('hall'),label:'Front door and hall',description:'The hall of your guardians\' house.',underRoof:true},
  {id:id('school_hall'),label:'Hogwarts, the Great Hall',description:'The school\'s great hall, where the new first years are sorted.',underRoof:true}],
 items:[...hpLeadMakingItems], // W1a: Potions ingredients and flasks (hp_lead_making.js)
 sources:[{id:id('magic'),revision:1,label:'A source with no method',kind:'trait',origin:'inherited',grants:[],bioDetail:'Something in you sometimes acts on its own. No method is learned, taught or named, and this entry grants no technique.'}],
 starts:[{id:id('start'),locationId:id('cupboard'),
  description:'You are ten, your guardians\' nephew, living in the room under the stairs. It is Saturday morning and your cousin\'s birthday. You hold nothing of your own: no money, no wand.',
  body:{id:id('body'),ownerId:'player',controllerId:'player',form:'human',lifeStage:'child',hands:2,mobile:true},
  effects:[
   {type:'source',sourceId:id('magic'),operation:'grant',awakened:true,active:true,origin:'inherited'},
   guardian('vernon'),guardian('petunia'),
   {type:'situation',situationId:id('situation'),operation:'begin'},
   {type:'fact',scope:'actor',key:id('in_custody'),value:true},
   note('opening','You are ten and live with your aunt, uncle and cousin. The room under the stairs is your place. You have no money and nothing that is only yours to spend; what you eat, wear and do today is decided by your guardians.'),
   note('vernon_known','Your uncle runs the house and the day; he does not like trouble.'),
   note('petunia_known','Your aunt calls the household up in the morning and cooks breakfast.'),
   note('dudley_known','Your cousin shares the house, and today is his birthday.'),
   note('custody','Your aunt and uncle are your guardians. They decide where you go and what you eat; a child has no standing to overrule them.')]}],
 simulation:{situations:[{id:id('situation'),revision:1,label:'The household day',context:{worldId:id('world'),instanceId:id('main'),continuityId:id('main'),eraId:id('book1'),regionId:id('privet')},
  participants:['player'],initialPhase:'day',phases:['day'],privateTruth:{day:'saturday'},responseWindow:null}],
  people:[
  ...['vernon:Your uncle','petunia:Your aunt','dudley:Your cousin','ron:Ron Weasley'].map(s=>{const [n,label]=s.split(':');
   return {id:id(n),revision:1,label,worldId:id('world'),location:n==='ron'?id('school_hall'):id('kitchen'),inventory:'simulation',provision:false,body:{id:id(n+'_body'),ownerId:id(n),controllerId:id(n),form:'human',hands:2,mobile:true},vitals:{health:100,stamina:100}};})],
  commands:[{id:id('dress'),revision:1,label:'Get up and dress for the day · 5 min',group:'structured_local',worldId:id('world'),actorId:'player',location:id('cupboard'),audience:['$actor'],costs:[],
   description:'Find your socks under the bed, pull off a spider and get dressed before your aunt\'s call.',duration:5,cancellation:'refund',requires:alive,completionRequires:alive,completionCoLocated:true,completionFailure:'refund',
   effects:[note('dressed','You are dressed. Today is your cousin\'s birthday.')]}]},
 presentation:{people:Object.fromEntries(['vernon','petunia','dudley','ron'].map(n=>[id(n),{introductionKnowledgeKey:id(n+'_known')}])),status:[{id:id('opening_status'),label:'Means',knowledgeKey:id('opening')},{id:id('custody_status'),label:'Custody',knowledgeKey:id('custody')}]}
};
// W8-A: the route from the summer to the school, as two native one-shot commands (HG1/HG2). Arrival opens on the lead clock's day 32
// (1 September, book_world_hp_school_calendar.js) through the fact 'hp.lead.day' (book_world_hp_facts.js) and sets the actor facts the
// duty set and the position source already read. The summer's earlier beats (letters, Diagon Alley) are NOT built: the default is
// arrival on 1 September. Sorting follows the canon placing (Gryffindor); the other houses are locked rows, not commands.
export const HP_ARRIVAL_DAY=32;
export const hpLeadSchoolCommands=[
 {id:id('arrive_school'),revision:1,label:'Take the train to Hogwarts · 8 h',group:'structured_local',worldId:id('world'),actorId:'player',location:id('cupboard'),audience:['$actor'],costs:[],once:true,
  description:'The school year starts on 1 September. Your trunk, your ticket and the long train north; you arrive at the castle in the evening.',duration:480,cancellation:'refund',
  requires:{all:[...alive.all,{fact:'hp.lead.day',op:'gte',value:HP_ARRIVAL_DAY}],reason:'The term starts on 1 September; there is no train to the school before then.'},completionRequires:alive,completionCoLocated:true,completionFailure:'refund',
  effects:[{type:'relocate',actor:'player',location:id('school_hall')},{type:'fact',scope:'actor',key:'hp.lead.atSchool',value:true},
   note('arrived','You have reached Hogwarts for the first term. Lessons begin on a weekly timetable.')]},
 {id:id('sorting'),revision:1,label:'Put on the Sorting Hat · 15 min',group:'structured_local',worldId:id('world'),actorId:'player',location:id('school_hall'),audience:['$actor'],costs:[],once:true,
  description:'Each new first year sits on the stool and has the hat placed on their head. It names a house.',duration:15,cancellation:'refund',
  requires:{all:[...alive.all,{fact:'actor.hp.lead.atSchool',op:'eq',value:true}],reason:'You are not at the school yet.'},completionRequires:alive,completionCoLocated:true,completionFailure:'refund',
  effects:[{type:'fact',scope:'actor',key:'hp.lead.house',value:'gryffindor'},note('sorted','The hat placed you in Gryffindor.'),
   note('ron_known','Ron Weasley, the red-haired boy from the train, was sorted into Gryffindor too.'),
   ...ronTie('sorting','Ron cheered when the hat named Gryffindor and moved up the bench for you.')]}];
// Options the book did not take, shown locked beside the Sorting (rendered "Not how it happened").
export const hpLeadSchoolLocked={[id('sorting')]:[
 {id:id('sorting.hufflepuff'),label:'Be placed in Hufflepuff',reason:'The hat named Gryffindor. Another house would mean a different common room and Head of House; none of that is built.'},
 {id:id('sorting.ravenclaw'),label:'Be placed in Ravenclaw',reason:'The hat named Gryffindor. Another house would mean a different common room and Head of House; none of that is built.'},
 {id:id('sorting.slytherin'),label:'Be placed in Slytherin',reason:'The hat named Gryffindor. Another house would mean a different common room and Head of House; none of that is built.'}]};
hpLeadLife.simulation.commands.push(...hpLeadSchoolCommands);
// W9-D: the first lessons (HG3 spell row from a lesson, HG7 Potions class). Windows and chances are facts from book_world_hp_lessons.js
// (hpFacts); this file is data only. The Charms lesson teaches the levitation charm once; each later Charms class is a practice attempt whose
// chance rises with practice. Potions is a weekly class with a practice outcome (the Alchemy skill owns the progress). Authored proposals.
export const HP_LEVITATION=id('levitation');
export const hpLeadLessonCommands=(()=>{
 const open=(fact,reason)=>({all:[...alive.all,{fact,op:'eq',value:true}],reason});
 const charmsOpen=open('hp.lead.charmsOpen','Charms is taught on Mondays from 09:00 to 10:00 in term, once you are sorted.');
 const potionsOpen=open('hp.lead.potionsOpen','Potions is taught on Mondays from 10:00 to 11:00 in term, once you are sorted.');
 const base={revision:1,group:'structured_local',worldId:id('world'),actorId:'player',location:id('school_hall'),audience:['$actor'],costs:[],cancellation:'refund',completionRequires:alive,completionCoLocated:true,completionFailure:'refund'};
 const know=(n,value)=>note(n,value);
 return [
  {...base,id:id('lesson_charms'),label:'Attend your first Charms lesson · 30 min',once:true,duration:30,requires:charmsOpen,
   description:'The charms master shows the wand motion and the words for the levitation charm on a feather. Attending teaches the method; it does not make the charm work yet.',
   effects:[...lessonEffects({key:id('lesson.levitation'),value:'The charms master showed the wand motion and the words for the levitation charm.',situationId:id('situation')}),{type:'power',powerId:HP_LEVITATION,operation:'learn'},...ronTie('charms','Ron sat beside you in your first Charms lesson and grumbled at his feather with you.'),know('charms_last','The charms master corrected your wrist and your pronunciation. You know the levitation charm now; getting a feather to rise takes practice.')]},
  {...base,id:id('charms_practice'),label:'Practise the levitation charm in Charms · 30 min',duration:30,
   requires:{all:[...charmsOpen.all,{fact:`power.${HP_LEVITATION}.owned`,op:'eq',value:true}],reason:charmsOpen.reason},
   description:'Every pupil tries the charm on a feather. Each try, lifted or dropped, adds one step of practice, and the chance of lifting it rises with practice.',
   outcomes:[
    {id:'lifted',weight:{fact:'hp.lead.levitateChance'},effects:[{type:'power',powerId:HP_LEVITATION,operation:'refine',amount:1},know('charms_last','Your feather rose off the desk and settled again. The practice is yours.')]},
    {id:'dropped',weight:{fact:'hp.lead.levitateChance',scale:-1,add:1},effects:[{type:'power',powerId:HP_LEVITATION,operation:'refine',amount:1},know('charms_last','The feather stayed put, or wobbled and fell. You noticed what you did wrong.')]}]},
  {...base,id:id('lesson_potions'),label:'Attend Potions · 45 min',duration:45,requires:potionsOpen,
   description:'A first-year class in the dungeon: you follow the written steps for a simple draught under the potions master\'s eye. Care and attention raise the chance it comes out right, and each class adds to your Alchemy.',
   outcomes:[
    {id:'brewed',weight:{fact:'hp.lead.brewChance'},effects:[...hpPotionsIssueEffects,...lessonEffects({key:id('lesson.potions'),value:'You followed the written steps of a simple draught under the potions master.',situationId:id('situation'),skill:'Alchemy',xp:5}),know('potions_last','Your draught came out the right colour and the master moved on.')]},
    {id:'spoiled',weight:{fact:'hp.lead.brewChance',scale:-1,add:1},effects:[...hpPotionsIssueEffects,...lessonEffects({key:id('lesson.potions'),value:'You followed the written steps of a simple draught under the potions master.',situationId:id('situation'),skill:'Alchemy',xp:2}),know('potions_last','Your draught went wrong; the master told you where.')]}]}];
})();
hpLeadLife.simulation.powers=[{id:HP_LEVITATION,revision:1,label:'Levitation charm',model:'practice',capacity:1,cooldown:0}];
hpLeadLife.simulation.commands.push(...hpLeadLessonCommands);
export const hpLeadTieCommands=tieOfferCommands(id('world'),{group:'structured_local',worldId:id('world'),actorId:'player',location:id('school_hall'),audience:['$actor'],costs:[],
 duration:30,cancellation:'refund',requires:{all:[...alive.all,{fact:'actor.hp.lead.atSchool',op:'eq',value:true}]},completionRequires:alive,completionCoLocated:true,completionFailure:'refund'});
hpLeadLife.simulation.commands.push(...hpLeadTieCommands);
// W1a (proposal, docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md): the Potions class brews on the shared craft engine with HP's own
// law as data. Default: each class issues one set of ingredients for the board's recipe. Dial: a store cupboard or a bought kit later. Reason: in book 1
// the class brews in pairs from the board, and the student does not buy the class ingredients.
export const hpLeadMakingCommands=makingRows.map(c=>({...c,audience:['$actor']})); // structured commands name their observers
hpLeadLife.simulation.commands.push(...hpLeadMakingCommands);
hpLeadLife.calendarProfile={id:P+'.calendar',revision:1,algorithmId:'fixed_months',algorithmRevision:1,
 units:{minutesPerHour:60,hoursPerDay:24},months:Array.from({length:12},(_,i)=>({id:String(i+1),days:30})),
 week:['Sat','Sun','Mon','Tue','Wed','Thu','Fri'],precision:'day',evidence:'elapsed play; the book names the Saturday, not a year',
 label:'Household days',format:'elapsed',seasons:false,anchor:{year:1,month:1,day:1,hour:8,minute:0,day_count:0}};

// Household acts for the shared sequence owner (place_act_sequence.js). Zero acts is a legal start.
export const hpLeadHouseholdActs={
 acts:[{id:id('dress'),place:id('cupboard'),knowledgeKey:id('dressed')}],
 sequences:[{id:id('zoo_saturday'),title:'Your cousin\'s birthday',stages:[{commandId:id('dress'),label:'Get up and dress for the day'}]}]};

// G11 cast tiers (LSD126-LSD137): full = both layers; role = mechanical only; named non-human = a role-tier non-person.
export const hpLeadCastTiers=Object.freeze({
 full:[id('vernon'),id('petunia'),id('dudley')],
 role:['hp.person.piers-polkiss','hp.person.zoo-director'],
 nonHuman:['hp.creature.boa-constrictor']});
