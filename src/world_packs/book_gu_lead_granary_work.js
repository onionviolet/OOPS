import {extensionFact} from '../structured_pack_extensions.js';
import {RI_LEAD_DAY,RI_DAY_ITEMS as IT,RI_ACADEMY_ELDER} from '../ri_lead_day_facts.js';
import {RI_GRANARY as ID,RI_EAR_GRASS,RI_EAR_ATTACHMENT,RI_GRANARY_FOUND,RI_GRANARY_PATCHED,RI_GRANARY_PAID,RI_GRANARY_DIALS as D,RI_GRANARY_ESSENCE} from '../ri_granary_work.js';
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules});
const key=id=>JSON.stringify({id});
const has=(id,reason)=>({fact:`item.${key(id)}`,op:'gte',value:1,reason});
const item=(id,amount)=>({type:'item',actor:'player',key:key(id),amount});
const note=(key,value,actor='player')=>({type:'knowledge',actor,key,stage:'seen',value});
const admitted=eq(extensionFact(ID));
const support=all(admitted,eq('actor.life','alive'),eq('native.ready'),eq('native.alive'),
 eq('body.ownerId','player'),eq('body.controllerId','player'),eq('body.mobile'),
 eq('actor.location','book.ri.lead.academy','Return to the feed store beside the clan academy.'));
const open=eq(`${ID}.open`,true,'Finish the present repair and collect its pay. After a paid repair, fresh store work opens the next day.');
const ear=[has(RI_EAR_GRASS,'Bring your Earth Communication Ear Grass.'),eq(`actor.${RI_EAR_ATTACHMENT}`,'right_ear_adapted','The Ear Grass must be attached before its roots can carry sound to you.')];
function action(op,label,description,duration,needs,costs,effects,{spent=false,show,atStart=[],...extra}={}){
 const requirements=all(support,...needs);
 return {id:`${ID}.${op}`,revision:1,label,description,group:'structured_local',worldId:'book.ri.lead.world',actorId:'player',
  location:'book.ri.lead.academy',audience:['$actor'],once:false,duration,visibleWhen:all(admitted,show),requires:all(requirements,...atStart),
  ...(duration?{completionRequires:requirements,completionCoLocated:true,cancellation:spent?'forfeit':'refund',completionFailure:spent?'forfeit':'refund',...(!spent?{reservationReturns:1}:{})}:{}),
  costs,effects,...extra};
}
export const guLeadGranaryWork={schema:1,id:ID,revision:1,
 base:{id:'book.ri.lead',revision:1,contentHash:'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c'},dependsOn:[RI_LEAD_DAY],
 label:'Scratching beneath the feed store',description:'Locate the gnawed opening, patch it with a wolf hide, and show the academy elder. He pays twenty Moon Orchid petals. Listening spends essence; searching by hand takes longer.',
 requires:eq(extensionFact(RI_LEAD_DAY)),reason:'Open your ordinary day in the clan village.',
 status:[{id:`${ID}.work`,label:'At the feed store',knowledgeKey:RI_GRANARY_FOUND},{id:`${ID}.repair`,label:'The patched floor',knowledgeKey:RI_GRANARY_PATCHED},{id:`${ID}.pay`,label:'Petals for the work',knowledgeKey:RI_GRANARY_PAID}],
 commands:[
  action('listen','Listen beneath the feed store · 1 part, 5 min','Hold still and put the Ear Grass roots against the ground. Follow the nearby scratching, then lift the loose plank to find the gnawed opening. One part funds the attempt; stopping does not return it.',D.listen,[open,...ear],[{type:'energy',actor:'player',energyId:'book.ri.lead.primeval',operation:'use',output:RI_GRANARY_ESSENCE,control:1}],
   [note(RI_GRANARY_FOUND,'Grounded roots carry scratching from beneath a loose plank. You lift it and find the gnawed opening; a wolf hide can cover it for the night.')],{spent:true,show:open}),
  action('search','Inspect the feed store by hand · 45 min','Move the bundles and inspect the floor edges until you find the loose plank and gnawed opening. You spend no essence.',D.search,[open],[],
   [note(RI_GRANARY_FOUND,'You move the stored bundles and inspect the floor edges. Beneath a loose plank you find the gnawed opening; a wolf hide can cover it for the night.')],{show:open}),
  action('patch','Patch the opening with a wolf hide · 20 min','Stretch a wolf hide beneath the plank and wedge it in place. The hide stays in the floor, so you give up selling it. Show the finished work to the elder for twenty petals.',D.patch,
   [eq(`${ID}.found`,true,'Locate the opening by listening or inspecting first.')],[item(IT.pelt,-1)],
   [note(RI_GRANARY_PATCHED,'The wolf hide is wedged beneath the plank. The scratching has stopped; the elder can check the finished patch.')],{show:eq(`${ID}.found`),atStart:[has(IT.pelt,'Bring a wolf hide for the patch.')]}),
  action('collect','Show the repair to the elder · 20 petals','Let the academy elder check the patch. He pays twenty Moon Orchid petals for this repair. New store work opens the next day.',0,
   [eq(`${ID}.unpaid`,true,'Finish a repair that has not been paid for yet.')],[],[item(IT.petals,D.petals),note(RI_GRANARY_PAID,'The academy elder checks the patched opening and pays twenty Moon Orchid petals. The hide stays in the floor; new store work opens tomorrow.'),
    note(RI_GRANARY_PAID,'Fang Yuan patched the feed-store opening. I checked the work and paid twenty Moon Orchid petals.',RI_ACADEMY_ELDER)],
   {targetId:RI_ACADEMY_ELDER,coLocated:true,participants:['$target'],show:eq(`${ID}.unpaid`)})
 ]};
