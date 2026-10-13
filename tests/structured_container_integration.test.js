import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {validateStructuredEnvelope,requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand,previewSimulationCommand} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
const key=JSON.stringify({id:'atelier.sample'}),oldKey=JSON.stringify({id:'atelier.stale'});
function fixture(){
 const container={id:'atelier.cabinet',revision:1,label:'Original cabinet',holder:'player',worldId:'atelier.world',sourceId:'atelier.source',energyId:'atelier.reserve',category:'storage',capacity:8,aperture:[2,2,2],output:3,control:1,trainedOutput:1,developmentThreshold:1,knowledgeKey:'atelier.method',objects:[{unitId:'atelier.unit',key,expiredKey:oldKey,expiresAfter:10,dimensions:[1,1,1],volume:1,titleClaimId:'atelier.title',titleOwner:'atelier.supplier'}]};
 const command=(op)=>({id:'atelier.'+op,revision:1,label:'Cabinet '+op,worldId:'atelier.world',actorId:'player',audience:['$actor'],visibleWhen:{fact:'knowledge.atelier.method.seen',op:'eq',value:true},effects:[{type:'container',containerId:container.id,operation:op,...(['store','retrieve'].includes(op)?{key,whole:true}:{})}]});
 return {schema:2,id:'atelier',revision:1,compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock','custody','source-function'],world:{id:'atelier.world',label:'Original atelier'},locations:[{id:'atelier.room',label:'Workroom',description:'Original fixture'}],items:[{id:'atelier.sample',label:'Sample',description:'One sample'},{id:'atelier.stale',label:'Stale sample',description:'Same sample after exposure'}],units:[{id:'atelier.unit',keys:[key,oldKey],titleClaimId:'atelier.title',titleOwner:'atelier.supplier'}],sources:[{id:'atelier.source',revision:1,label:'Original trained method',kind:'trait',grants:[]}],simulation:{people:[{id:'atelier.supplier',revision:1,label:'Supplier',worldId:'atelier.world',location:'atelier.room',inventory:'simulation',provision:false}],containers:[container],energies:[{id:'atelier.reserve',revision:1,label:'Manual reserve',capacity:30,output:5,control:2,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:30,strainPerUse:1}],commands:['open','close','store','retrieve'].map(command)},presentation:{people:{'atelier.supplier':{introductionKnowledgeKey:'atelier.met'}},status:[]},bootstrap:{id:'atelier.start',locationId:'atelier.room',description:'Independent fixture',effects:[{type:'claim',actor:'atelier.supplier',key:'atelier.title',operation:'acquire'},{type:'item',key,actor:'atelier.supplier',amount:1},{type:'custody',from:'atelier.supplier',to:'player',key,count:1,loanId:'atelier.loan'},{type:'body',key:'channel',value:1},{type:'body',key:'control',value:2},{type:'source',sourceId:'atelier.source',operation:'grant',awakened:true,active:true},{type:'energy',energyId:'atelier.reserve',operation:'learn'},{type:'energy',energyId:'atelier.reserve',operation:'recover',amount:30},{type:'knowledge',key:'atelier.method',stage:'seen',value:'Practiced the cabinet'},{type:'container',containerId:container.id,operation:'install'}]}};
}
function setup(){
 const raw=fixture(),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const c=compileStructuredPack(raw,registry);mergeStructuredPack(c,registry);const d={...c.definition,contentHash:'sha256:'+'a'.repeat(64)};
 const context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:10,max_health:10,stamina:10,max_stamina:10}},nativeAlive:true,nativeBody:{ownerId:'player',controllerId:'player',hands:2,mobile:true},inventoryOwners:{'atelier.cabinet':{}},facts:{location:'atelier.room'}};
 const {plan,record}=beginStructuredCampaign(createExpansionState(4),d,context,null);return {registry,d,context:{...context,worldId:d.world.id},plan,record};
}
const bindings={player:{category:'person',id:'main_character'}},ownershipBindings={'atelier.cabinet':{category:'storage',id:'atelier.cabinet'}};
function envelope(f,plan=f.plan){const e={character:{money:0},expansion:plan.state,content_packs:{schema:1,packs:{},structured:f.record},'current location':'atelier.room',inventories:{person:{main_character:{}},storage:{'atelier.cabinet':{}}},levels:{person:{main_character:{skill_xp:{}}}}};let data;persistExpansionPlan(plan,{createSave:()=>JSON.stringify(e),storage:{setItem(k,v){data=v}},key:'test',bindings,ownershipBindings,validateEnvelope:validateStructuredEnvelope});return JSON.parse(data)}
const action=(f,p,op)=>commitSimulationCommand(p.state,f.registry,{id:'atelier.'+op},{...f.context,external:p.external,gameplay:p.gameplay,inventoryOwners:{...f.context.inventoryOwners,...p.ownership}});
test('native person and real non-person owner save together, with failed write preserving prior bytes',()=>{
 const f=setup(),opened=action(f,f.plan,'open'),stored=action(f,opened,'store');const saved=envelope(f,stored);assert.equal(saved.inventories.storage['atelier.cabinet'][key].count,1);assert.deepEqual(saved.inventories.person.main_character,{});validateStructuredEnvelope(saved);requireStructuredContent(f.record,new Map([[f.d.id,f.d]]));
 const before=JSON.stringify(envelope(f,opened));assert.throws(()=>persistExpansionPlan(stored,{createSave:()=>before,storage:{setItem(){throw Error('write refused')}},key:'test',bindings,ownershipBindings,validateEnvelope:validateStructuredEnvelope}),/write refused/);assert.equal(JSON.stringify(envelope(f,opened)),before);
 const duplicate=structuredClone(saved);duplicate.inventories.person.main_character[key]={count:1};assert.throws(()=>validateStructuredEnvelope(duplicate),/unit/);assert.equal(saved.expansion.simulation.people['atelier.cabinet'],undefined);
});
test('joined clock advances exposure at empty boundaries, preserves interior and external actor time',()=>{
 const f=setup(),opened=action(f,f.plan,'open'),stored=action(f,opened,'store');const contexts={player:{...f.context,inventoryOwners:stored.ownership,vitals:f.context.vitals.player}};
 const advanced=advanceSimulation(stored.state,f.registry,12,stored.external,stored.gameplay,contexts);assert.equal(advanced.state.clock,12);assert.equal(advanced.state.simulation.objectClocks['atelier.unit'].elapsed,0);assert.equal(advanced.state.simulation.objectClocks['atelier.unit'].lastAt,12);
 const cargo=structuredClone(stored.ownership);const pulled=commitSimulationCommand(advanced.state,f.registry,{id:'atelier.retrieve'},{...f.context,gameplay:advanced.gameplay,inventoryOwners:cargo});
 const expired=advanceSimulation(pulled.state,f.registry,10,pulled.external,pulled.gameplay,{player:{...f.context,inventoryOwners:pulled.ownership,vitals:f.context.vitals.player}});assert.equal(expired.gameplay.player.inventory[oldKey],1);assert.equal(expired.state.simulation.custody['atelier.loan'].key,oldKey);validateStructuredEnvelope(envelope(f,expired));
});
test('native consciousness refusal is a pure quote and legacy optional objects do not initialize',()=>{
 const f=setup(),before=structuredClone(f.plan);const quote=previewSimulationCommand(f.plan.state,f.registry,'atelier.open',{...f.context,gameplay:f.plan.gameplay,nativeAlive:false});assert.equal(quote.eligible,false);assert.deepEqual(f.plan,before);assert.equal(f.plan.state.simulation.schema,6);
});
test('expiry is a joined boundary before treatment and reserved expiration refunds its exact changed condition',()=>{
 const f=setup();const fresh={fact:'object.atelier.unit.fresh',op:'eq',value:true};
 f.registry.simulation.commands.set('atelier.consume',{id:'atelier.consume',revision:1,label:'Use actual sample',actorId:'player',worldId:'atelier.world',duration:12,cancellation:'refund',audience:['$actor'],reservationReturns:1,completionRequires:fresh,completionFailure:'refund',costs:[{type:'item',key,amount:-1,breakCustody:true}],effects:[{type:'claim',actor:'atelier.supplier',key:'atelier.title',operation:'settle'}]});
 const started=commitSimulationCommand(f.plan.state,f.registry,{id:'atelier.consume'},{...f.context,gameplay:f.plan.gameplay});
 const after=advanceSimulation(started.state,f.registry,12,started.external,started.gameplay,{player:{...f.context,vitals:f.context.vitals.player}});
 assert.equal(after.state.simulation.claims['atelier.title'].status,'held');assert.equal(after.gameplay.player.inventory[oldKey],1);assert.equal(after.state.simulation.objectClocks['atelier.unit'].key,oldKey);assert.equal(after.state.simulation.jobs.length,0);validateStructuredEnvelope(envelope(f,after));
});
test('exposure key corruption and access after a staged vital debit reject before publication',()=>{
 const f=setup(),opened=action(f,f.plan,'open'),stored=action(f,opened,'store'),saved=envelope(f,stored);
 saved.expansion.simulation.objectClocks['atelier.unit'].key=oldKey;assert.throws(()=>validateStructuredEnvelope(saved),/condition/);
 f.registry.simulation.commands.set('atelier.paid_open',{...f.registry.simulation.commands.get('atelier.open'),id:'atelier.paid_open',costs:[{type:'vital',key:'health',amount:-10}]});
 const quote=previewSimulationCommand(f.plan.state,f.registry,'atelier.paid_open',{...f.context,gameplay:f.plan.gameplay});assert.equal(quote.eligible,false);assert.equal(f.plan.vitals.player.health,10);
});
