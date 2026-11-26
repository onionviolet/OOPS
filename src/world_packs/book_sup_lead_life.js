// Super Supportive, first explicit offered choice in the opening (ch2).
// Source-only paraphrase; chapter1 is remembered context, not a playable rescue.
import {windowKit} from '../window_chain.js';
const P='book.sup.lead',id=n=>`${P}.${n}`,kit=windowKit({prefix:P});
export const SUP_OPENING=Object.freeze({id:P,world:id('world'),room:id('hospital_room'),corridor:id('corridor'),desk:id('check_in'),amanda:id('amanda'),hannah:id('hannah'),
 console:id('console_off'),announce:id('visitor_announcement'),who:id('ask_who'),see:id('see_hannah'),defer:id('defer_hannah'),welcome:id('welcome_hannah'),fragment:id('ask_fragment')});
const S=SUP_OPENING;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const state=stage=>eq(`actor.${id('stage')}`,stage,'Continue the current hospital conversation first.');
const set=(key,value)=>kit.set(key,value);
const note=(key,value,actor='player',provenance='source')=>({type:'knowledge',actor,key:id(key),stage:'seen',value,
 basis:{kind:'observation',attributedTo:actor,situationId:id('situation'),provenance}});
const person=(n,label,place)=>({id:id(n),revision:1,label,worldId:S.world,location:place,inventory:'simulation',provision:false,
 body:{id:id(n+'_body'),ownerId:id(n),controllerId:id(n),form:'human',hands:2,mobile:true},vitals:{health:100,stamina:100}});
const alive={all:[eq('actor.life','alive'),eq('native.ready',true)]};
const act=(n,label,stage,targetId,minutes,description,locator,effects,extra={})=>({id:id(n),revision:1,label,description,group:'structured_local',worldId:S.world,actorId:'player',location:S.room,audience:['$actor'],once:true,
 duration:minutes,costs:[],cancellation:'refund',requires:{all:[alive,state(stage)]},visibleWhen:state(stage),...(minutes?{completionRequires:{all:[alive,state(stage)]},completionCoLocated:true,completionFailure:'refund'}:{}),
 ...(targetId?{targetId,coLocated:true,participants:['$target']}:{}),source:{locator,kind:'source-paraphrase',timing:'Conversation minutes are authored; no exact hour is supplied.'},effects,...extra});
export const supLeadLife={schema:2,id:P,revision:1,title:'Super Supportive · Alden and the visitor',
 description:'Alden Thorn, a child in hospital two weeks after the attack on his home. Wummy is beside him. Nurse Amanda has come into the room. He wants straight answers about what happened.',
 compatibility:{legacy:'preserve-dormant',origin:'mandatory',identityAliases:[
  {from:'sha256:e6115740a4e33a37e6e596c95ab48db3e44477eb817e834e9a1dd014281b9f84',to:'sha256:267ab9ab44441c403784054b5a10e122c4c2db3eb210923524b1d3a197030a7a',preserveCurrent:true,previousIdentities:[{contentHash:'sha256:f36877551cdd4fe93634b0a4df4eae982fa3112340602358fdb86e6db0ed7686',starts:[{id:id('start'),snapshotHash:'sha256:0298ae5d1193830d8000c173ffdaeb459b6166251762a0823f616525bf6142a5'}]}],reason:'Correct narrator wording and leave the visitor unidentified; preserve the same hospital life and all actions.'},
  {from:'sha256:bff3896602a6427350094a5cfdbdf8879dcdf3128d183097fb0e23eaa4cefd03',to:'sha256:0298ae5d1193830d8000c173ffdaeb459b6166251762a0823f616525bf6142a5',reason:'The corrected arrival sentence preserves the exact starting body, possessions, effects and remembered history.'}
 ]},capabilities:['native-stock','jobs'],world:{id:S.world,label:'Super Supportive · Alden in hospital'},
 locations:[{id:S.room,label:'Children’s hospital, Alden’s room',description:'Rain runs down the window. Wummy lies beside the bed and a handheld console waits in Alden’s lap.',underRoof:true},
  {id:S.corridor,label:'Children’s hospital corridor',description:'Staff can speak just outside the room.',underRoof:true},
  {id:S.desk,label:'Children’s hospital check-in',description:'Visitors wait at the desk before going upstairs.',underRoof:true}],
 items:[{id:id('wummy'),label:'Wummy, your plush wombat',description:'Hannah kept your wombat safe during the rescue. He is beside you now.'},
  {id:id('console'),label:'Handheld game console',description:'Given to you at the House of Healing for practice with your mended arm and wrist.'}],
 starts:[{id:id('start'),locationId:S.room,description:'Wummy is beside you in the hospital bed. Two weeks have passed since the attack on your home. Nurse Amanda has come into the room.',
  body:{id:id('alden_body'),ownerId:'player',controllerId:'player',form:'human',lifeStage:'child',hands:2,mobile:true},effects:[
   {type:'situation',situationId:id('situation'),operation:'begin'},set('stage','nurse'),set('consoleOn',true),set('name','Alden Thorn'),
   kit.item(id('wummy'),1),kit.item(id('console'),1),
   note('opening','You are Alden Thorn. Two weeks after the attack on your home, you are in a children’s hospital. Your arm and wrist have been mended; your stomach is still being watched. Wummy is beside you, and the House of Healing gave you the console.'),
   note('rescue_memory','You remember being unable to move inside a glittering bubble. Hannah introduced herself and Arjun in written notes, kept Wummy safe, and stayed with you on the way to the House of Healing.'),
   note('amanda_known','Amanda is one of the nurses looking after you.'),note('hannah_known','Hannah Elber is the superhero who wrote you notes during the rescue.'),
   note('known_loss','You know your home was destroyed and your parents died in a supervillain attack. Nobody has explained the whole account to you.')] }],
 simulation:{people:[person('amanda','Nurse Amanda',S.room),person('hannah','Hannah Elber',S.desk)],
  situations:[{id:id('situation'),revision:1,label:'Alden’s hospital visit',context:{worldId:S.world,instanceId:id('opening'),continuityId:id('opening'),eraId:id('opening_era'),regionId:id('hospital')},
   participants:['player',S.amanda,S.hannah],initialPhase:'hospital',phases:['hospital'],privateTruth:{route:'opening'},responseWindow:null}],
  commands:[
   act('console_off','Turn off the chirping console','nurse',null,0,'The alert sounds too much like the ringing in your ears. Switch the game off. It stays yours.','en b1 c2 p3–5',
    [set('consoleOn',false),note('console_quiet','You switch off the console. The alert stops; the ringing in your ears has not been cured.')],{visibleWhen:{all:[state('nurse'),eq(`actor.${id('consoleOn')}`,true)]}}),
   act('visitor_announcement','Listen to Amanda','nurse',S.amanda,0,'Amanda has come in with news of a visitor. Hear what she wants to ask.','en b1 c2 p18–19',
    [set('stage','identity'),note('visitor_offer','Amanda says a woman has come to visit. You do not have to see her if you do not want to.')]),
   act('ask_who','Ask who has come','identity',S.amanda,0,'Ask Amanda who the visitor is before giving permission.','en b1 c2 p20–23',
    [set('stage','permission'),note('visitor_identity','Amanda says Hannah Elber is downstairs at check-in. You have not seen her since the rescue.')]),
   act('see_hannah','Ask to see Hannah','permission',S.amanda,1,'Tell Amanda you want to see Hannah, and ask to speak with her on your own. Amanda brings her up and stays just outside.','en b1 c2 p36–38, p58, p65',
    [set('stage','door'),{type:'relocate',actor:S.hannah,location:S.room},{type:'relocate',actor:S.amanda,location:S.corridor},
     note('visit_permission','You asked to see Hannah. She comes through the doorway, but waits for your permission before approaching the bed.'),
     note('visit_permission','Alden has asked to see Hannah and speak with her alone.',S.amanda)]),
   act('defer_hannah','Ask Amanda to refuse the visit for now','permission',S.amanda,1,'Take the refusal Amanda has offered. She goes back to check-in to pass on your answer. This is the offered path Alden did not take in the book.','en b1 c2 p19, p36; untaken offered option, delivery authored',
    [set('stage','deferred'),{type:'relocate',actor:S.amanda,location:S.desk},
     note('visit_deferred','Amanda has your answer and goes downstairs. Hannah does not enter your room. You have not heard her account.', 'player','divergent'),
     note('visit_deferred','Alden has asked me to refuse this visit for now.',S.amanda,'divergent')]),
   act('welcome_hannah','Let Hannah come to the bedside','door',S.hannah,0,'Hannah asks whether her visit is all right. Nod if you want her to come closer.','en b1 c2 p66–69',
    [set('stage','conversation'),note('welcome','You nod, and Hannah sits in the chair beside your bed. She knows you remember the rescue.'),note('welcome','Alden has let me approach and sit beside him.',S.hannah)]),
   act('ask_fragment','Ask about the metal that hurt you','conversation',S.hannah,2,'Tell Hannah you never saw the fragment. Ask her to check whether it was kept and whether you can have it.','en b1 c2 p74–79',
    [set('stage','fragment_requested'),note('fragment_account','Hannah thinks the fragment was part of a table saw blade. She offers to ask whether it was kept. You have not received the fragment or a promise that it can be found.'),
     note('fragment_request','Alden wants me to ask whether the injury fragment was kept and whether he may have it.',S.hannah)])]},
 presentation:{people:{[S.amanda]:{introductionKnowledgeKey:id('amanda_known')},[S.hannah]:{introductionKnowledgeKey:id('hannah_known')}},
  status:[{id:id('opening_status'),label:'Your situation',knowledgeKey:id('opening')},{id:id('visitor_status'),label:'Visitor',knowledgeKey:id('visit_permission')},{id:id('deferred_status'),label:'Visitor',knowledgeKey:id('visit_deferred')},{id:id('fragment_status'),label:'Question for Hannah',knowledgeKey:id('fragment_account')}]}
};
export default {format:'yairpg.world-pack',formatVersion:1,id:P,revision:1,saveSchema:1,kind:'canon',title:'Super Supportive · Alden’s opening',
 sourceSnapshot:{hash:'0f13fc3cc065def09a466314cc12037da758413970038031c7f1b14a153a2c74',locator:'English prepared b1 c1 and c2 p1–79; ch1–2 shard SHA256 6a888e887a7f26f46760755df7440bac1a04c2bde018cf79dd0db35620b70a4e'},
 attribution:{source:'Sleyca, Super Supportive. Paraphrase; no source prose shipped.',licence:'canon-reference',notice:'First offered visitor choice in the opening. One- and two-minute conversation durations and the untaken refusal’s delivery are authored.'},
 budgets:{entities:8,drawsPerEntity:1,saveBytes:60000},content:{},native:supLeadLife};
