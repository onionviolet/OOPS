// Retained authenticated English ch17 P056–061 / ch18 P023,P031–035:
// Fang Zheng questions the night away and hands over five whole stones plus
// one half-sized partly drained piece. Sleeping/awake alternatives are authored.
import {configureRiBreakfast,RI_BREAKFAST as B,RI_FANG_ZHENG as FZ} from '../ri_breakfast.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD,riLeadId as id} from './book_gu_lead_life.js';
const V=id('vital'),home=id('home'),world=id('world'),local=n=>B+'.'+n;
const stone=JSON.stringify({id:id('refinement.primeval_stone')}),half=JSON.stringify({id:V+'.half_stone'});
const eq=(fact,value=true)=>({fact,op:'eq',value}),all=(...rules)=>({all:rules});
const note=(n,value)=>({type:'knowledge',actor:'player',key:local(n),stage:'understood',value});
const ready=all(eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),eq('actor.location',home));
const admitted=eq(extensionFact(B));
const offer=all(ready,admitted,eq(B+'.open'));
const pocket=all({fact:`target.item.${stone}`,op:'gte',value:5},{fact:`target.item.${half}`,op:'gte',value:1});
function choice(n,label,description,effects,needs=[]){return {id:local(n),revision:1,label,description,group:'structured_local',worldId:world,actorId:'player',location:home,audience:['$actor'],once:true,duration:0,targetId:FZ,coLocated:true,participants:['$target'],visibleWhen:offer,requires:all(offer,...needs),costs:[],effects};}
export const guLeadBreakfast={schema:1,id:B,revision:1,base:{id:GU_LEAD,revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},dependsOn:[V],label:'Breakfast at the inn',
 description:'Come downstairs for breakfast after your night at the inn.',
 requires:all(ready,eq(B+'.available')),reason:'Come downstairs in the morning after a paid night here or the completed overnight working. This visit happens before your brother’s offer has been settled.',
 roles:[{id:FZ,revision:1,label:'Fang Zheng',worldId:world,location:home,inventory:'simulation',provision:false,introductionKnowledgeKey:local('visit'),body:{id:FZ+'.body',ownerId:FZ,controllerId:FZ,form:'human',lifeStage:'child',hands:2,mobile:true}}],
 supportAlternatives:[{target:{id:V,revision:1,contentHash:'sha256:89c5e2f92e0baa4a354350c0d904962dc6b8e96911ac3e5770404767acb3b441'},admission:false,commands:[V+'.press_again'],replaces:eq('completed.'+V+'.brother'),requires:all(eq('knowledge.'+local('resolved')+'.seen'),eq('completed.'+V+'.first_night'))}],
 status:[{id:local('visit_status'),label:'Your brother downstairs',knowledgeKey:local('visit')},{id:local('outcome_status'),label:'Breakfast conversation',knowledgeKey:local('resolved')}],
 commands:[{id:local('join'),revision:1,label:'Go downstairs for breakfast',description:'Take ten minutes downstairs. Fang Zheng draws up a chair. “Where did you sleep? Shen Cui came to me crying.” He puts a small pouch on the table.',group:'structured_local',worldId:world,actorId:'player',location:home,audience:['$actor'],once:true,duration:10,visibleWhen:all(ready,admitted,eq(B+'.available')),requires:all(ready,admitted,eq(B+'.available'),eq(B+'.unintroduced')),completionRequires:all(ready,admitted,eq(B+'.available'),eq(B+'.unintroduced')),completionCoLocated:true,cancellation:'refund',completionFailure:'refund',reservationReturns:1,costs:[],effects:[{type:'spawn',definitionId:FZ,personId:FZ},{type:'item',actor:FZ,key:stone,amount:5},{type:'item',actor:FZ,key:half,amount:1},note('visit','Fang Zheng rests his hand over the pouch. “If you’re stepping aside, I’ll speak for Shen Cui.” You can take his offer or push it back.')]},
 choice('accept','Take the pouch','Draw the pouch toward you. “Then take it up with Aunt and Uncle.”',[{type:'transfer',from:FZ,to:'player',key:stone,count:5},{type:'transfer',from:FZ,to:'player',key:half,count:1},note('accepted','You took the pouch Fang Zheng handed over.'),note('resolved','You count five whole stones and a small, partly drained piece into your purse. Fang Zheng tightens his jaw. “I’ll ask them myself.”')],[pocket]),
 choice('refuse','Push the pouch back','Slide it across the table. “Keep your stones. Ask Aunt and Uncle about Shen Cui.”',[note('refused','You pushed the pouch back across the table.'),note('resolved','Fang Zheng closes his hand around the pouch. “I can ask them myself.” You leave the stones with him.')])
 ]};
export async function registerGuLeadBreakfast(register,base,ports){
 if(!ports||!register.bundledInstantExtension)return null;
 const extension=await register.bundledInstantExtension(guLeadBreakfast,base);
 configureRiBreakfast(ports);return extension;
}
