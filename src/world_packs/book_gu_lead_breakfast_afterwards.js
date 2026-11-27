// Held Calibre English ch18 p35–46,65–68. Refusal/skip and five minutes
// for reheating/eating are authored alternatives and timing calibration.
import {extensionFact} from '../structured_pack_extensions.js';
import {RI_BREAKFAST as B,RI_FANG_ZHENG as FZ} from '../ri_breakfast.js';
import {GU_LEAD,riLeadId as baseId} from './book_gu_lead_life.js';
export const RI_BREAKFAST_AFTERWARDS=baseId('breakfast_afterwards');
const E=RI_BREAKFAST_AFTERWARDS,id=n=>E+'.'+n,HOME=baseId('home'),WORLD=baseId('world'),WORKER=id('worker'),AWAY=id('out_of_sight');
const eq=(fact,value=true)=>({fact,op:'eq',value}),all=(...rules)=>({all:rules});
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'));
const resolved={any:[eq('knowledge.'+B+'.accepted.seen'),eq('knowledge.'+B+'.refused.seen')]};
const admitted=eq(extensionFact(E)),meal=value=>eq('actor.'+id('meal'),value);
const note=(name,value)=>({type:'knowledge',actor:'player',key:id(name),stage:'seen',value});
const set=value=>({type:'fact',actor:'player',scope:'actor',key:id('meal'),value});
function act(name,label,description,duration,needs,effects,extra={}){
 const requires=all(ready,admitted,resolved,...needs);
 return {id:id(name),revision:1,label,description,group:'structured_local',worldId:WORLD,actorId:'player',location:HOME,
  audience:['$actor'],once:true,duration,costs:[],requires,visibleWhen:all(admitted,resolved,...needs),effects,
  ...(duration?{completionRequires:requires,completionCoLocated:true,completionFailure:'refund',cancellation:'refund',reservationReturns:1}:{}),...extra};
}
export const guLeadBreakfastAfterwards={schema:1,id:E,revision:1,
 base:{id:GU_LEAD,revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},dependsOn:[B],
 label:'After the breakfast conversation',description:'Your brother has his answer. The dishes have gone cold while you talked.',
 requires:all(ready,eq('actor.location',HOME),resolved,eq('knowledge.'+B+'.visit.seen')),
 reason:'Settle the pouch offered at the inn before continuing breakfast.',
 locations:[{id:AWAY,label:'Out of sight of the breakfast table',description:'Fang Zheng has left the table. You have not followed him or learned where he went.'}],
 roles:[{id:WORKER,revision:1,label:'Inn worker',worldId:WORLD,location:HOME,inventory:'simulation',provision:false,
  introductionKnowledgeKey:id('worker_seen'),body:{id:id('worker_body'),ownerId:WORKER,controllerId:WORKER,form:'human',lifeStage:'adult',hands:2,mobile:true}}],
 status:[{id:id('departure_status'),label:'Your brother',knowledgeKey:id('departure')},
  {id:id('meal_status'),label:'Your breakfast',knowledgeKey:id('meal_result')}],
 commands:[
  act('leave_table','Finish the conversation','Let your brother leave the table. You remain with the cold dishes; you do not follow him.',0,
   [eq('target.life','alive'),eq('target.location',HOME)],
   [{type:'relocate',actor:FZ,location:AWAY},{type:'spawn',definitionId:WORKER,personId:WORKER},set('cold'),
    note('departure','Fang Zheng leaves the breakfast table and passes out of your sight. You do not know where he goes.'),
    note('worker_seen','An inn worker is nearby. Your dishes have gone cold during the conversation.'),
    note('meal_result','The dishes are still cold. You can ask for them to be warmed or leave them and get on with your preparations.')],
   {targetId:FZ,coLocated:true,participants:['$target']}),
  act('warm','Ask for the dishes to be warmed','Ask the inn worker to reheat the dishes, then finish breakfast. Spend five minutes at the table.',5,
   [meal('cold'),eq('target.life','alive'),eq('target.location',HOME)],
   [set('finished_after_warming'),note('meal_result','The worker warms the dishes. You finish breakfast and can return to your preparations.')],
   {targetId:WORKER,coLocated:true,participants:['$target']}),
  act('skip','Leave the cold dishes','Leave breakfast unfinished and go on with your preparations. This does not move you elsewhere or spend your stones.',0,
   [meal('cold')],[set('skipped_cold'),note('meal_result','You leave the cold dishes unfinished. Your brother is gone; you can get on with your preparations.')])
 ]};
export async function registerGuLeadBreakfastAfterwards(register,base){
 if(!register.bundledInstantExtension)return null;
 return register.bundledInstantExtension(guLeadBreakfastAfterwards,base);
}
