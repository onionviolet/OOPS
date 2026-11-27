// Booked-meal grain allocation. Mira's event pantry is an authored continuation.
import {registerDomain} from '../domain_registry.js';
import {I,K,command,eq,gte,all,any,not,af,item,transfer,know,contact} from './shared.js';
const P='farmSupply.',phase=(state)=>state?.actors?.player?.facts?.[P+'phase'];
let ports;
export const configureFarmSupply=p=>{ports=p;};
export function validateFarmSupplyState(state){
 const f=state.actors?.player?.facts||{},done=state.actors?.player?.completed||{},keys=['phase','keep','booking'];
 const present=keys.some(k=>Object.hasOwn(f,P+k)),used=['plan','receive','return','host'].some(k=>(done['mg.farm_supply.'+k]||0)>0);
 if(!present&&!used)return;
 const check=(ok,why)=>{if(!ok)throw Error('Farm supply: '+why);};
 check(f['mg.opened']===true,'an order needs its courtyard charter.');
 check(keys.every(k=>Object.hasOwn(f,P+k))&&Number.isSafeInteger(f[P+'keep'])&&f[P+'keep']>=0,'invalid household holdback.');
 check(['waiting','stored','finished','released','cancelled'].includes(f[P+'phase']),'unknown order phase.');
 check(Number.isSafeInteger(f[P+'booking'])&&f[P+'booking']>=1&&f[P+'booking']<=(done['mg.event.book']||0),'unknown booking.');
 const allocated=(done['mg.farm_supply.receive']||0)-(done['mg.farm_supply.return']||0)-(done['mg.farm_supply.host']||0);
 check(allocated===(f[P+'phase']==='stored'?1:0),'food allocation does not match settled transfers.');
 const held=(state.simulation?.jobs||[]).filter(j=>j.commandId==='mg.farm_supply.host').reduce((n,j)=>n+(j.costs||[]).filter(c=>c.type==='item'&&c.actor===I.mira&&c.key===K.grain&&c.amount<0).reduce((n,c)=>n-c.amount,0),0);
 check((state.simulation?.owners?.[I.mira]?.[K.grain]||0)+held>=allocated,'the allocated food is missing.');
}
const ownFact=(key,value)=>({type:'fact',actor:'player',scope:'actor',key:P+key,value});
const activeBooking=state=>!!state?.actors?.player?.facts?.['mg.eventBooked']&&state.actors.player.facts['mg.eventProgram']==='grain'&&state.actors.player.facts[P+'booking']===(state.actors.player.completed['mg.event.book']||0);
export function farmSupplyView(state){
 const f=state?.actors?.player?.facts||{},held=state?.simulation?.owners?.[I.mira]?.[K.grain]||0;
 return {booked:f['mg.eventBooked']===true,program:f['mg.eventProgram'],phase:phase(state)||'none',keep:f[P+'keep']??4,held,active:activeBooking(state),
  busy:(state?.simulation?.jobs||[]).some(j=>j.commandId==='mg.farm_supply.host')};
}
export function farmSupplyKeep(state){const v=farmSupplyView(state);return v.phase==='waiting'?v.keep+Number(v.active):['stored','finished','released'].includes(v.phase)?v.keep:0;}
export function farmSupplyFacts(state,context={}){
 const v=farmSupplyView(state),count=context.gameplay?.player?.inventory?.[K.grain]||0;
 return {'farmSupply.waiting':v.active&&v.phase==='waiting','farmSupply.stored':v.active&&v.phase==='stored','farmSupply.surplus':count>v.keep,
  'farmSupply.free':!v.busy,'farmSupply.miraGrain':state?.simulation?.owners?.[I.mira]?.[K.grain]||0,'farmSupply.returnable':v.phase==='stored'&&!v.busy};
}
const hidden=eq('farmSupply.control',true);
export const supplyCommands=[
 command({id:'mg.farm_supply.plan',family:'MG06',label:'Arrange grain for Bram’s booked gathering',description:'Mira agrees to hold one grain portion for the booked meal when your harvest can spare it. No food or money is supplied by this agreement.',targetId:I.mira,coLocated:true,participants:['$target'],visibleWhen:hidden,
  support:contact(I.mira),requires:all(eq('actor.mg.eventBooked'),any(eq('actor.mg.eventProgram',false),eq('actor.mg.eventProgram','grain'))),effects:[af('eventProgram','grain'),know('farmSupply.plan','Mira will hold one harvested grain portion for Bram’s booked meal. Keep your chosen household amount first. The meal still needs food and Bram’s payment means.',I.mira)]}),
 command({id:'mg.farm_supply.receive',family:'MG06',label:'Set aside one harvested grain with Mira',description:'Transfer one grain portion to Mira’s event pantry after a harvest; the chosen household amount remains with you.',targetId:I.mira,coLocated:true,participants:['$target'],visibleWhen:hidden,
  support:contact(I.mira),requires:all(eq('farmSupply.waiting'),eq('farmSupply.surplus')),costs:[transfer(K.grain,1,'player',I.mira)],effects:[ownFact('phase','stored'),know('farmSupply.received','Mira received one grain portion for Bram’s booked gathering. It is set aside from sale, but no meal or payment has happened.',I.mira)]}),
 command({id:'mg.farm_supply.return',family:'MG06',label:'Collect the unserved grain from Mira',description:'Return the exact unserved portion from Mira’s pantry. A meal in progress must finish or be stopped first.',targetId:I.mira,coLocated:true,participants:['$target'],visibleWhen:hidden,
  support:contact(I.mira),requires:all(eq('farmSupply.returnable'),gte('farmSupply.miraGrain',1)),costs:[transfer(K.grain,1,I.mira,'player')],effects:[ownFact('phase','released'),know('farmSupply.returned','Mira returned the one unserved grain portion. The return changes no payment.',I.mira)]}),
];
export function suppliedMeal(original){return {...original,id:'mg.farm_supply.host',label:'Host Bram’s gathering with Mira’s set-aside grain · 6 min',description:'Use the one grain portion held by Mira, plus two stamina. Bram pays five coins from his purse when the meal is served. Stopping returns the food to Mira’s pantry.', // player-text: allow Hosting is the in-world act of serving the booked meal.
 participants:['$target',I.mira],completionCoLocated:true,completionRequires:all(original.completionRequires,contact(I.mira)),
 visibleWhen:all(eq('actor.mg.eventBooked'),eq('actor.mg.eventProgram','grain'),eq('farmSupply.stored')),
 requires:all(original.completionRequires,contact(I.mira),eq('farmSupply.stored'),gte('farmSupply.miraGrain',1)),
 costs:original.costs.map(c=>c.type==='item'&&c.key===K.grain?{...c,actor:I.mira}:c),
 effects:[...original.effects,ownFact('phase','finished')]};}
function fullContext(plan,context){return {...context,actorId:'player',targetId:I.mira,external:plan.external,gameplay:plan.gameplay,
 facts:{...context.facts,...farmSupplyFacts(plan.state,{...context,gameplay:plan.gameplay}),'farmSupply.control':true}};}
function execute(plan,id,registry,context){const c=fullContext(plan,context),q=ports.previewCommand(plan.state,registry,id,c);if(!q.eligible)return false;
 const acquired=plan.acquisitions||[],unlocked=plan.unlocks||[],out=ports.commitCommand(plan.state,registry,{id},c);
 Object.assign(plan,out);plan.acquisitions=[...acquired,...(out.acquisitions||[])];plan.unlocks=[...unlocked,...(out.unlocks||[])];return true;}
export function settleFarmSupply(plan,registry,context,{harvest=false}={}){
 if(!registry&&ports){registry=ports.registry;context=ports.context(plan);}
 if(!registry||!context)return false;
 const v=farmSupplyView(plan.state);
 if(v.phase==='stored'&&!v.active&&!v.busy)return execute(plan,'mg.farm_supply.return',registry,context);
 if(v.phase==='waiting'&&!v.active){plan.state.actors.player.facts[P+'phase']='released';return true;}
 return harvest&&v.phase==='waiting'&&v.active?execute(plan,'mg.farm_supply.receive',registry,context):false;
}
function order({keep}={}){
 if(!Number.isSafeInteger(keep)||keep<0)throw Error('Choose a whole household reserve of zero or more.');
 if(!ports||ports.writable?.()===false)throw Error('Use the writable game tab.');
 if(ports.idle?.()===false)throw Error('Finish the current work first.');
 const plan=ports.plan(0),v=farmSupplyView(plan.state);if(['waiting','stored'].includes(v.phase))throw Error('Clear the current grain order first.');
 if(!execute(plan,'mg.farm_supply.plan',ports.registry,ports.context(plan)))throw Error('Book a grain gathering with Mira here first.');
 Object.assign(plan.state.actors.player.facts,{[P+'keep']:keep,[P+'phase']:'waiting',[P+'booking']:plan.state.actors.player.completed['mg.event.book']||0});
 ports.commit(plan);return farmSupplyView(ports.root());
}
function clear(){
 if(!ports||ports.writable?.()===false)throw Error('Use the writable game tab.');const plan=ports.plan(0),v=farmSupplyView(plan.state);
 if(v.phase==='none')throw Error('No grain order is set.');
 if(v.busy)throw Error('Stop the meal before collecting its food.');
 if(v.phase==='stored'){if(!execute(plan,'mg.farm_supply.return',ports.registry,ports.context(plan)))throw Error('Return to Mira to collect the unserved grain.');}
 plan.state.actors.player.facts[P+'phase']='cancelled';ports.commit(plan);
}
registerDomain({id:'farmSupply',projection:()=>farmSupplyView(ports?.root()),commands:{order,clear},tick:()=>{
 if(!ports||ports.writable?.()===false)return;const v=farmSupplyView(ports.root());if(!['stored','waiting'].includes(v.phase)||v.active||v.busy)return;
 const plan=ports.plan(0);if(settleFarmSupply(plan,ports.registry,ports.context(plan)))ports.commit(plan);
}});
