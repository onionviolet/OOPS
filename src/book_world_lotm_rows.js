// Pathway rows for the Tingen branch: authored data over the shared engine (WA1, WPR31). A row names the
// two sources, the two doses, the acting acts, the assessor and the texts; book_world_lotm_pathways.js turns it
// into commands, facts, validators and a descriptor. Every value is an authored proposal (WPR5) unless a
// comment cites a source locator. Adding a pathway is adding a row here and its two dose keys in the ids file.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_CC_ACTS,LOTM_CC_LAYING_MINUTES,LOTM_CC_VIGIL_MINUTES} from './book_world_lotm_ids.js';
const U='understood';
// Seer is hand-authored in book_world_lotm_actions.js (lesson, spirituality, sample bench); this row only names its flags and doses so
// the shared facts, validators and views treat every pathway alike.
export const seerRow=Object.freeze({key:'seer',pid:'seer',prefix:'',potion:'Seer',base:I.source,next:I.clown,holds:{base:'dose',next:'clownDose'},acting:'book.lotm.acting',supported:'lotm.sourceSupported',actingFact:'lotm.acting',digestedFact:'lotm.digested'});
// Corpse Collector (Q1): Death pathway, Evernight line. Acts authored from the ability list; see the Q1 checkpoint.
export const ccRow=Object.freeze({key:'cc',pid:'corpse',slug:'corpse_collector',church:'evernight',prefix:'cc',potion:'Corpse Collector',next:'Gravedigger',base:I.corpse,nextSource:I.gravedigger,holds:{base:'corpseDose',next:'gravediggerDose'},
 officerId:I.supervisor,place:L.workroom,digest:LOTM_CC_ACTS,market:{baseHold:'marketCc9',nextHold:'marketCc8'},
 ids:{accept:'accept_allocation_cc',ingest:'ingest_cc',assess:'request_assessment_cc',promote:'ingest_gravedigger'},
 labels:{accept:'Accept the supervisor\'s allocated Corpse Collector dose (no faculty yet; one pathway per life, switching is a stated cause of loss of control)',ingest:'Take the Corpse Collector dose under supervision (irreversible)',
  assess:'Ask Warden Hale to assess your digestion for the next Sequence (Corpse Collector)',promote:'Drink the prepared Gravedigger dose (irreversible: Sequence 8)'},
 ladder:{ingestNote:' (it takes courage)',s9:['Withstands cold and rot','Undead mistake you for one of their own','Body goes pale and cold'],s8:['Stronger body','Better spirit vision','Speaks to nearby spirits'],
  failure:{signs:'Cold that does not lift, dead things drawn to you and a persona that slips off-stage',outcome:'Loss of control if a potion is drunk undigested, out of order or from another pathway'}},
 acts:[
  {id:'act_laying_out',once:false,minutes:LOTM_CC_LAYING_MINUTES,label:'Wash and shroud an unclaimed body in the cold room with Hale watching · 1 of Hale\'s attention, '+LOTM_CC_LAYING_MINUTES+' min',know:['cc.acting.laying','You laid out an unclaimed body without flinching and without hurry. Handling the dead plainly, as a collector would, settles something in you a little more each time.']},
  {id:'act_vigil',once:true,flag:'vigil',minutes:LOTM_CC_VIGIL_MINUTES,label:'Keep the night vigil beside the cold room\'s dead · 1 of Hale\'s attention, '+LOTM_CC_VIGIL_MINUTES+' min',know:['cc.acting.vigil','You sat an hour in the cold with the dead and did not leave. Staying calm among them, even when they seemed to notice you, was part of the role and it counted.']}],
 know:{
  accept:['cc.terms','One prepared dose now sits in your hands under the supervisor\'s allocation, and Hale keeps the Seer dose back: a second pathway\'s potion is switching and would risk loss of control. The formula includes a dried black-spotted frog and the dose takes courage to drink. Holding it grants nothing; you can still decline.','instruction'],
  ingest:['cc.stabilized','The dose is gone for good. The cold came first, then a stillness; the unclaimed dead in the cold room stopped feeling like a threat. Your skin is paler. You hold a Corpse Collector source and a body that shrugs off cold and rot. Hale says the potion is digested by quiet, repeated work among the dead, not by waiting.','observation'],
  assess:['cc.assessment','Hale tested you and judged the Corpse Collector potion digested. The workroom releases one prepared Gravedigger dose from its stores. Holding it grants nothing; drinking it is another irreversible step.','instruction'],
  promote:['cc.promoted','The Gravedigger potion is gone for good. Your body is stronger and quicker, and the quiet in the cold room now has voices in it, faint and near. This Sequence needs digesting in turn, by its own role.','observation']},
 sources:{
  base:{look:{slot:'skin',rank:2,concealed:true,seenBy:['beyonder','undead'],text:'Your skin is pale and cold to the touch; dogs keep their distance.'},label:'Corpse Collector source (initiated)',bioDetail:'One consumed supervised dose. Source ownership is separate from digestion; none of the Sequence 8 abilities follows from it alone.'},
  next:{label:'Gravedigger source (Sequence 8)',bioDetail:'A second consumed dose after an assessed digestion. Canon grants a stronger body, better spirit vision and speech with nearby spirits; the Tingen slice has no spirit encounter that reads them yet.'}}});
// Savant (Q6): Paragon pathway, the Church of Steam and Machinery's complete line [LOTM_PATHWAYS_B s6: 0065, 0059, 0220]; its holder in Tingen is the
// Machinery team (university quarter, institutions pass F1) and the university president is a Seq 7 Appraiser [1312]. The acting hint is the source's:
// live as the Savant, study and apply (0059). Chosen over Sailor (acting unknown) and Sleepless (needs a night gate) by the Q1 criteria, and over
// Spectator (no Tingen holder). The promotion is the source's: a senior deacon examines, not the local officer [168 p8-p13], and the church waits
// three years on the previous potion [18 p56, 106 p55]. The three-year wait is the default for an ordinary member without the acting method; it is not a gate on a player who digested by acting
// (Klein was examined on merit after about a month, 0169-0170). `waitMinutes` is the player route (0); `ordinaryWaitMinutes` is the dial for NPCs or a start with no acting knowledge,
// prototype-scaled because three played years cannot be carried by an idle save. Acts, minutes, counts, prices and the officer are authored proposals (WPR5).
export const savantRow=Object.freeze({key:'sv',pid:'savant',slug:'savant',church:'machinery',prescreener:'The records officer',prefix:'sv',potion:'Savant',next:'Archaeologist',base:I.savant,nextSource:I.archaeologist,holds:{base:'savantDose',next:'archaeologistDose'},
 officerId:I.machineryOfficer,place:L.university,digest:4,market:{baseHold:'marketSv9',nextHold:'marketSv8'},
 exam:{id:'request_exam_sv',examinerId:I.seniorDeacon,label:'The senior deacon examines the candidate',waitMinutes:0,ordinaryWaitMinutes:3*1440,sourceWait:'three years',minutes:60,
  askLabel:"Sit the senior deacon's examination · 60 min, 1 of the deacon's attention"},
 ids:{accept:'accept_allocation_sv',ingest:'ingest_sv',assess:'request_prescreen_sv',promote:'ingest_archaeologist'},
 labels:{accept:'Accept the records officer\'s allocated Savant dose (no faculty yet; one pathway per life, switching is a stated cause of loss of control)',ingest:'Take the Savant dose under supervision (irreversible)',
  assess:'Ask the records officer to pre-screen your digestion before the senior deacon',promote:'Drink the prepared Archaeologist dose (irreversible: Sequence 8)'},
 ladder:{ingestNote:'',s9:['Basic occult knowledge','Full recall of what you study','Memory and learning sharpened'],s8:['Stronger body','Ancient and survival knowledge','Forbidden-ruin knowledge and simple ritual magic'],
  failure:{signs:'Facts crowd in until the role replaces the self, and the whispers do not calm when you stop studying',outcome:'Loss of control if a potion is drunk undigested, unexamined, out of order or from another pathway'}},
 acts:[
  {id:'act_study',once:false,minutes:30,label:'Study the team\'s repair ledgers and record what the gears show · 1 of the records officer\'s attention, 30 min',know:['sv.acting.study','You studied until you could say how each mechanism failed and why. Treating what you know as something to apply, not to hoard, settles something in you a little more each time.']},
  {id:'act_apply',once:true,flag:'applied',minutes:45,label:'Apply what you studied: price a replacement part from the ledger · 1 of the records officer\'s attention, 45 min',know:['sv.acting.apply','You turned the ledger into a number someone paid. Applying knowledge, the Savant\'s other half, counted.']}],
 know:{
  accept:['sv.terms','One prepared dose now sits in your hands under the records officer\'s allocation. The Machinery team keeps its line to its own probationers: you are not offered another church\'s potion. Holding it grants nothing; you can still decline.','instruction'],
  ingest:['sv.stabilized','The dose is gone for good. Facts rose faster than you could name them, then settled into order. You hold a Savant source. The officer says the potion is digested by living as a Savant, studying and applying, and that the church will not examine you for years whatever you recall.','observation'],
  assess:['sv.assessment','The records officer tested your recall and judged the potion digested. That is only the local pre-screen: the senior deacon examines, and the church waits out its term first.','instruction'],
  exam:['sv.examination','The senior deacon examined you, found the potion digested and understood, and released one prepared Archaeologist dose from the church\'s stores. Holding it grants nothing; drinking it is another irreversible step.','instruction'],
  promote:['sv.promoted','The Archaeologist potion is gone for good. Your body is stronger and old facts about ruins and survival come to you unasked. This Sequence needs digesting in turn, by its own role.','observation']},
 sources:{
  base:{look:{slot:'bearing',rank:2,concealed:true,seenBy:['beyonder'],text:'You answer before the question is finished, as if you had read it.'},label:'Savant source (initiated)',bioDetail:'One consumed supervised dose. Source ownership is separate from digestion; the Sequence 8 abilities do not follow from it alone.'},
  next:{label:'Archaeologist source (Sequence 8)',bioDetail:'A second consumed dose after the examination. Canon grants a stronger body, ancient and survival knowledge, forbidden-ruin knowledge and simple ritual magic; the Tingen slice has no ruin that reads them yet.'}}});
// Sailor (further pathway): Tyrant pathway, the Church of the Storm's line; its Tingen holder is the Mandated Punishers at the docks [LOTM_PATHWAYS_A s6: 0006, 0065;
// institutions pass F1, F3]. The Seq 9 and 8 abilities are the source's (balance on a storm ship, strong body, hidden scales, ten minutes under water; a burst of
// speed and strength when angry). The notes record NO acting statement for it, so the acts are authored from the ability list (the sea's discipline), and the
// church's rule is the source's: a senior deacon examines after a wait. Storm's ordinary-member dial is two days (source default three years); the player route has no wait. All values are proposals.
export const sailorRow=Object.freeze({key:'sa',pid:'sailor',slug:'sailor',church:'storm',prefix:'sa',potion:'Sailor',next:'Folk of Rage',base:I.sailor,nextSource:I.folk,holds:{base:'sailorDose',next:'folkDose'},
 officerId:I.stormOfficer,place:L.docks,digest:4,market:{baseHold:'marketSa9',nextHold:'marketSa8'},prescreener:'The duty officer',
 exam:{id:'request_exam_sa',examinerId:I.stormDeacon,label:'The Storm senior deacon examines the candidate',waitMinutes:0,ordinaryWaitMinutes:2*1440,sourceWait:'three years',minutes:60,
  askLabel:"Sit the Storm senior deacon's examination · 60 min, 1 of the deacon's attention"},
 ids:{accept:'accept_allocation_sa',ingest:'ingest_sa',assess:'request_prescreen_sa',promote:'ingest_folk'},
 labels:{accept:"Accept the duty officer's allocated Sailor dose (no faculty yet; one pathway per life, switching is a stated cause of loss of control)",ingest:'Take the Sailor dose under supervision (irreversible)',
  assess:'Ask the duty officer to pre-screen your digestion before the senior deacon',promote:'Drink the prepared Folk of Rage dose (irreversible: Sequence 8)'},
 ladder:{ingestNote:'',s9:['Balance on a storm deck','A strong body','Scales that make you hard to grip','Ten minutes under water'],s8:['A burst of speed and strength when angry'],
  failure:{signs:'Rage that does not cool, and the sea sounding in the ears on dry land',outcome:'Loss of control if a potion is drunk undigested, unexamined, out of order or from another pathway'}},
 acts:[
  {id:'act_mooring',once:false,minutes:20,label:"Lash a sealed crate against the harbour swell · 1 of the duty officer's attention, 20 min",know:['sa.acting.mooring','You lashed the crate while the quay moved under you and kept your feet. Staying steady on a moving deck, as a sailor does, settles something in you a little more each time.']},
  {id:'act_dive',once:true,flag:'dived',minutes:30,label:"Hold your breath under the quay for the dive drill · 1 of the duty officer's attention, 30 min",know:['sa.acting.dive','You went under the quay and stayed until the officer signalled. Calm in deep water, as a sailor is, counted.']}],
 know:{
  accept:['sa.terms',"One prepared dose now sits in your hands under the duty officer's allocation. The Mandated Punishers keep this line to their own probationers. Holding it grants nothing; you can still decline.",'instruction'],
  ingest:['sa.stabilized','The dose is gone for good. The sea rolled through you and your balance held; your skin prickled where scales might sit. You hold a Sailor source. The officer says it is digested by repeating the sea\'s discipline, not by waiting.','observation'],
  assess:['sa.assessment',"The duty officer judged the Sailor potion digested. That is only the local pre-screen: the Storm senior deacon examines, and the church waits out its term first.",'instruction'],
  exam:['sa.examination',"The Storm senior deacon examined you, found the potion digested, and released one prepared Folk of Rage dose from the church's stores. Holding it grants nothing; drinking it is another irreversible step.",'instruction'],
  promote:['sa.promoted','The Folk of Rage potion is gone for good. Anger now arrives with speed and strength attached, and it takes longer to cool. This Sequence needs digesting in turn, by its own role.','observation']},
 sources:{
  base:{look:{slot:'marks',rank:2,concealed:true,seenBy:['beyonder'],text:'Fine pale scales show at your wrists when your sleeves ride up.'},label:'Sailor source (initiated)',bioDetail:'One consumed supervised dose. Source ownership is separate from digestion; none of the Sequence 8 abilities follows from it alone.'},
  next:{label:'Folk of Rage source (Sequence 8)',bioDetail:'A second consumed dose after the examination. Canon grants a burst of attack and speed when angry; the Tingen slice has no fight that reads it yet.'}}});
export const pathwayRows=Object.freeze([ccRow,savantRow,sailorRow]);
export const allRows=Object.freeze([seerRow,...pathwayRows]);
