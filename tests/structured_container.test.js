import test from 'node:test';
import assert from 'node:assert/strict';
import {applyContainerEffect, validateContainerDefinition, validateContainerState, advanceContainerClocks, containerFacts, nextContainerBoundary, validateContainerEffect} from '../src/structured_container_runtime.js';
import {createContentRegistry, createExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {compileStructuredPack, mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {beginStructuredCampaign} from '../src/structured_pack_runtime.js';
import {validateStructuredEnvelope, requireStructuredContent} from '../src/structured_pack_state.js';
import {commitSimulationCommand, previewSimulationCommand} from '../src/simulation.js';
import {persistExpansionPlan} from '../src/expansion_persistence.js';

// structured_container_development: original fixture scope retained.
{
const key=JSON.stringify({id:'development.tool'});
const definition={id:'development.owner',revision:1,label:'Synthetic function',holder:'player',worldId:'development.world',sourceId:'development.source',energyId:'development.energy',category:'storage',capacity:8,aperture:[2,2,2],output:4,control:1,trainedOutput:2,developmentThreshold:1,knowledgeKey:'development.known',objects:[{unitId:'development.unit',key,dimensions:[1,1,1],volume:1,titleClaimId:'development.title',titleOwner:'player'}]};
function setup(accessCosts) {
    const d={...definition,...(accessCosts?{accessCosts}:{}),objects:structuredClone(definition.objects)};
    const policy={id:d.energyId,revision:1,label:'Synthetic reserve',capacity:100,output:5,control:2,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:100,strainPerUse:1};
    const registry={simulation:{containers:new Map([[d.id,d]]),energies:new Map([[policy.id,policy]])}};
    const plan={state:{clock:0,actors:{player:{worldId:d.worldId,sources:{[d.sourceId]:{expiresAt:null}}}},simulation:{schema:6,people:{player:{life:'alive',inventory:'native',body:{channel:1,control:2,hands:2,mobile:true}}},faculties:{player:{[d.sourceId]:{awakened:true,active:true,suppressed:false,development:0}}},energies:{player:{[policy.id]:{policy,reserve:100,strain:0}}},claims:{[d.objects[0].titleClaimId]:{owner:'player',status:'held'}},custody:{},knowledge:{player:{}}}},gameplay:{player:{inventory:{[key]:1}}}};
    const context={actorId:'player',nativeAlive:true,nativeBody:{ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals:{player:{health:10}},inventoryOwners:{[d.id]:{}}};
    const bindings={readInventory:p=>p.gameplay.player.inventory,writeInventory:(p,id,rows)=>p.gameplay.player.inventory=rows};
    const apply=(operation,extra={})=>applyContainerEffect(plan,{type:'container',containerId:d.id,operation,...extra},context,registry,bindings);
    const reserve=()=>plan.state.simulation.energies.player[d.energyId].reserve;
    const develop=n=>plan.state.simulation.faculties.player[d.sourceId].development=n;
    apply('install');return {d,registry,plan,context,apply,reserve,develop};
}
test('continuing actual function development changes native transfer debit at authored stages',()=>{
    const f=setup([{development:0,output:4},{development:1,output:2},{development:3,output:1}]);
    f.apply('open');assert.equal(f.reserve(),96);
    for(const [development,cost,operation] of [[0,4,'store'],[1,2,'retrieve'],[2,2,'store'],[3,1,'retrieve'],[8,1,'store']]) {
        f.develop(development);const before=f.reserve();f.apply(operation,{key,whole:true});assert.equal(before-f.reserve(),cost);
        assert.equal(operation==='store'?f.plan.ownership[f.d.id][key]:f.plan.gameplay.player.inventory[key],1);
    }
    validateContainerState(f.plan.state.simulation,f.plan.state,undefined,()=>{});
    const restored=structuredClone(f.plan);validateContainerState(restored.state.simulation,restored.state,f.registry.simulation,()=>{});
});
test('legacy two-threshold debit remains unchanged without authored stages',()=>{
    const f=setup();f.apply('open');assert.equal(f.reserve(),96);f.develop(1);f.apply('store',{key,whole:true});assert.equal(f.reserve(),94);f.develop(9);f.apply('retrieve',{key,whole:true});assert.equal(f.reserve(),92);
});
test('stage policies reject missing zero, duplicates, fractional thresholds and rising outputs',()=>{
    for(const accessCosts of [[],[{development:1,output:2}],[{development:0,output:4},{development:0,output:2}],[{development:0,output:4},{development:1.5,output:2}],[{development:0,output:2},{development:1,output:3}],[{development:0,output:5}],[{development:0,output:0}],[{development:0,output:2,eval:'arbitrary'}]])assert.throws(()=>validateContainerDefinition({...definition,accessCosts}),/stage/);
    validateContainerDefinition({...definition,accessCosts:[{development:0,output:4},{development:9,output:1}]});
});

}

// structured_container_integration: original fixture scope retained.
{
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

}

// structured_container_preparation: original fixture scope retained.
{
const key=JSON.stringify({id:'sample.fresh'}),stale=JSON.stringify({id:'sample.stale'});
const d={id:'sample.owner',revision:1,label:'Synthetic compartment',holder:'player',worldId:'sample.world',sourceId:'sample.source',energyId:'sample.energy',category:'storage',capacity:8,aperture:[2,2,2],output:3,control:1,trainedOutput:1,developmentThreshold:2,knowledgeKey:'sample.inspected',objects:[{unitId:'sample.unit',key,expiredKey:stale,expiresAfter:10,dimensions:[1,1,1],volume:1,titleClaimId:'sample.title',titleOwner:'supplier'}]};
function setup(initial=key) {
    const policy={id:'sample.energy',revision:1,label:'Synthetic reserve',capacity:30,output:5,control:2,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:30,strainPerUse:1};
    const registry={simulation:{containers:new Map([[d.id,d]]),energies:new Map([[policy.id,policy]])}};
    const plan={state:{clock:0,actors:{player:{worldId:d.worldId,sources:{}}},simulation:{schema:5,people:{player:{life:'alive',inventory:'native',body:{channel:0,control:0,hands:2,mobile:true}},supplier:{life:'alive',inventory:'simulation'}},owners:{supplier:{}},faculties:{},energies:{},claims:{'sample.title':{owner:'supplier',status:'held'}},custody:{loan:{owner:'supplier',holder:'player',key:initial,count:1}},knowledge:{player:{}}}},gameplay:{player:{inventory:{[initial]:1}},supplier:{inventory:{}}}};
    const context={actorId:'player',nativeAlive:true,nativeBody:{ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals:{player:{health:10}},inventoryOwners:{[d.id]:{}}};
    const bindings={readInventory:(p,id)=>p.gameplay[id]?.inventory,writeInventory:(p,id,rows)=>p.gameplay[id].inventory=rows};
    const apply=(operation,extra={})=>applyContainerEffect(plan,{type:'container',containerId:d.id,operation,...extra},context,registry,bindings);
    const acquire=()=>{plan.state.actors.player.sources[d.sourceId]={expiresAt:null};plan.state.simulation.people.player.body.channel=1;plan.state.simulation.people.player.body.control=2;plan.state.simulation.faculties.player={[d.sourceId]:{awakened:true,active:true,suppressed:false,development:0}};plan.state.simulation.energies.player={[policy.id]:{policy,reserve:30,strain:0}};};
    return {plan,context,registry,bindings,apply,acquire};
}

test('ordinary external stock ages before source acquisition and installation never refreshes its condition',()=>{
    const f=setup(),original=structuredClone(f.plan.gameplay);f.apply('prepare');
    assert.deepEqual(f.plan.gameplay,original);assert.deepEqual(f.plan.state.actors.player.sources,{});assert.deepEqual(f.plan.state.simulation.faculties,{});assert.equal(f.plan.state.simulation.people.player.body.channel,0);
    assert.equal(f.plan.state.simulation.schema,6);assert.equal(containerFacts(f.plan.state,f.context,f.registry)[`container.${d.id}.installed`],false);assert.equal(nextContainerBoundary(f.plan.state,f.registry,{player:f.context}),10);
    for(const operation of ['open','close','store','retrieve'])assert.throws(()=>f.apply(operation,['store','retrieve'].includes(operation)?{key,whole:true}:{}),/Install/);
    f.plan.state.clock=12;advanceContainerClocks(f.plan,f.registry,{player:f.context},f.bindings);
    assert.equal(f.plan.gameplay.player.inventory[stale],1);assert.equal(f.plan.state.simulation.custody.loan.key,stale);assert.equal(f.plan.state.simulation.objectClocks['sample.unit'].elapsed,12);
    const clock=structuredClone(f.plan.state.simulation.objectClocks['sample.unit']);f.acquire();f.apply('install');
    assert.deepEqual(f.plan.state.simulation.objectClocks['sample.unit'],clock);assert.equal(containerFacts(f.plan.state,f.context,f.registry)[`container.${d.id}.installed`],true);
    f.apply('open');f.apply('store',{key:stale,whole:true});assert.equal(f.plan.ownership[d.id][stale],1);assert.equal(f.plan.gameplay.player.inventory[key],undefined);
    f.plan.state.clock=100;advanceContainerClocks(f.plan,f.registry,{player:f.context},f.bindings);assert.equal(f.plan.state.simulation.objectClocks['sample.unit'].elapsed,12);
    f.apply('retrieve',{key:stale,whole:true});assert.equal(f.plan.gameplay.player.inventory[stale],1);
});

test('activation without source grants no access, preserves preparation elapsed and cannot repeat',()=>{
    const f=setup();f.apply('prepare');f.plan.state.clock=4;f.apply('install');
    assert.equal(f.plan.state.simulation.objectClocks['sample.unit'].elapsed,4);assert.deepEqual(f.plan.state.actors.player.sources,{});
    f.plan.state.simulation.people.player.body.channel=1;f.plan.state.simulation.people.player.body.control=2;
    assert.throws(()=>f.apply('open'),/source/);assert.equal(f.plan.gameplay.player.inventory[key],1);
    assert.throws(()=>f.apply('install'),/again/);assert.throws(()=>f.apply('prepare'),/again/);
});

test('preparation binds actual changed condition and rejects title, policy or prepared native cargo tampering',()=>{
    const f=setup(stale);f.apply('prepare');assert.equal(f.plan.state.simulation.objectClocks['sample.unit'].key,stale);
    const restored=structuredClone(f.plan);validateContainerState(restored.state.simulation,restored.state,undefined,()=>{});
    restored.state.simulation.containers[d.id].installed='false';assert.throws(()=>validateContainerState(restored.state.simulation,restored.state,undefined,()=>{}),/binding/);
    restored.state.simulation.containers[d.id].installed=false;restored.state.simulation.containers[d.id].open=true;assert.throws(()=>validateContainerState(restored.state.simulation,restored.state,undefined,()=>{}),/binding/);
    f.context.inventoryOwners[d.id]={[stale]:1};assert.throws(()=>f.apply('install'),/empty/);f.context.inventoryOwners[d.id]={};
    f.registry.simulation.containers.set(d.id,{...d,capacity:9});assert.throws(()=>f.apply('install'),/policy/);
    const missing=setup();delete missing.plan.state.simulation.claims['sample.title'];assert.throws(()=>missing.apply('prepare'),/title/);
});

test('legacy installed records retain installed behavior and validate without the new flag',()=>{
    const f=setup();f.acquire();f.apply('install');delete f.plan.state.simulation.containers[d.id].installed;
    validateContainerState(f.plan.state.simulation,f.plan.state,undefined,()=>{});assert.equal(containerFacts(f.plan.state,f.context,f.registry)[`container.${d.id}.installed`],true);
    f.apply('open');f.apply('store',{key,whole:true});assert.equal(f.plan.ownership[d.id][key],1);
});

}

// structured_container_runtime: original fixture scope retained.
{

const key=JSON.stringify({id:'atelier.vial'}),expiredKey=JSON.stringify({id:'atelier.stale'});
const d={id:'atelier.box',revision:1,label:'Original sample cabinet',holder:'player',worldId:'atelier.world',sourceId:'atelier.method',energyId:'atelier.energy',category:'storage',capacity:8,aperture:[2,2,2],output:3,control:1,trainedOutput:1,developmentThreshold:2,knowledgeKey:'atelier.inspected',objects:[{unitId:'atelier.unit',key,expiredKey,expiresAfter:10,dimensions:[1,1,1],volume:1,titleClaimId:'atelier.title',titleOwner:'supplier'}]};
function setup(initialKey=key,definition=d){
 const d=definition;
 const policy={id:'atelier.energy',revision:1,label:'Original manual reserve',capacity:30,output:5,control:2,efficiencyNumerator:1,efficiencyDenominator:1,strainLimit:30,strainPerUse:1};
 const registry={simulation:{containers:new Map([[d.id,d]]),energies:new Map([[policy.id,policy]])}};
 const plan={state:{clock:0,actors:{player:{worldId:d.worldId,sources:{[d.sourceId]:{expiresAt:null}}}},simulation:{schema:6,people:{player:{life:'alive',inventory:'native',body:{channel:1,control:2,hands:2,mobile:true}},supplier:{life:'alive',inventory:'simulation'}},faculties:{player:{[d.sourceId]:{awakened:true,active:true,suppressed:false,development:0}}},energies:{player:{[policy.id]:{policy,reserve:30,strain:0}}},claims:{'atelier.title':{owner:'supplier',status:'held'}},custody:{loan:{owner:'supplier',holder:'player',key:initialKey,count:1}},knowledge:{player:{}}}},gameplay:{player:{inventory:{[initialKey]:1}},supplier:{inventory:{}}}};
 const context={actorId:'player',nativeAlive:true,nativeBody:{ownerId:'player',controllerId:'player',hands:2,mobile:true},vitals:{player:{health:10}},inventoryOwners:{[d.id]:{}}};
 const bindings={readInventory:(p,id)=>p.gameplay[id]?.inventory,writeInventory:(p,id,rows)=>{p.gameplay[id].inventory=rows;}};
 const apply=(operation,extra={})=>applyContainerEffect(plan,{type:'container',containerId:d.id,operation,...extra},context,registry,bindings);
 apply('install');return {plan,context,bindings,registry,apply};
}
test('real non-person ownership and exact accountable title survive store, close and retrieve',()=>{
 const f=setup();f.apply('open');f.apply('store',{key,whole:true});assert.equal(f.plan.gameplay.player.inventory[key],undefined);assert.equal(f.plan.ownership[d.id][key],1);
 f.apply('close');assert.equal(f.plan.state.simulation.claims['atelier.title'].owner,'supplier');assert.equal(f.plan.state.simulation.custody.loan.holder,'player');
 f.apply('open');f.apply('retrieve',{key,whole:true});assert.equal(f.plan.gameplay.player.inventory[key],1);assert.deepEqual(f.plan.ownership[d.id],{});
 assert.equal(f.plan.state.simulation.people[d.id],undefined);validateContainerState(f.plan.state.simulation,f.plan.state,f.registry.simulation,id=>assert.ok(f.plan.state.simulation.people[id]));
});
test('trained development changes actual access debit',()=>{
 const f=setup();f.apply('open');assert.equal(f.plan.state.simulation.energies.player[d.energyId].reserve,27);f.apply('close');f.plan.state.simulation.faculties.player[d.sourceId].development=2;f.apply('open');assert.equal(f.plan.state.simulation.energies.player[d.energyId].reserve,26);
});
test('source loss and actual native unconsciousness retain permanent stock and refuse access',()=>{
 const f=setup();f.apply('open');f.apply('store',{key,whole:true});f.apply('close');f.context.nativeAlive=false;
 assert.throws(()=>f.apply('open'),/body/);assert.equal(f.plan.ownership[d.id][key],1);f.context.nativeAlive=true;delete f.plan.state.actors.player.sources[d.sourceId];assert.throws(()=>f.apply('open'),/source/);assert.equal(f.plan.ownership[d.id][key],1);
});
test('actual compartment interior freezes item exposure while outside clock runs and expired state stays expired',()=>{
 const f=setup();f.plan.state.clock=4;f.apply('open');f.apply('store',{key,whole:true});assert.equal(f.plan.state.simulation.objectClocks['atelier.unit'].elapsed,4);
 f.plan.state.clock=100;advanceContainerClocks(f.plan,f.registry,{player:f.context},f.bindings);assert.equal(f.plan.state.simulation.objectClocks['atelier.unit'].elapsed,4);
 f.apply('retrieve',{key,whole:true});f.plan.state.clock=106;advanceContainerClocks(f.plan,f.registry,{player:f.context},f.bindings);assert.equal(f.plan.gameplay.player.inventory[expiredKey],1);assert.equal(f.plan.state.simulation.custody.loan.key,expiredKey);
 f.apply('store',{key:expiredKey,whole:true});f.plan.state.clock=200;f.apply('retrieve',{key:expiredKey,whole:true});assert.equal(f.plan.gameplay.player.inventory[expiredKey],1);assert.equal(f.plan.gameplay.player.inventory[key],undefined);
});
test('unsupported partial, geometry, custody and insufficient energy refuse before stock movement',()=>{
 const f=setup();f.apply('open');assert.throws(()=>f.apply('store',{key,whole:false}),/complete/);
 const tooLarge=structuredClone(d);tooLarge.aperture=[1,1,1];tooLarge.objects[0].dimensions=[2,1,1];f.registry.simulation.containers.set(d.id,tooLarge);assert.throws(()=>f.apply('store',{key,whole:true}),/fit/);f.registry.simulation.containers.set(d.id,d);
 delete f.plan.state.simulation.custody.loan;assert.throws(()=>f.apply('store',{key,whole:true}),/custody/);f.plan.state.simulation.custody.loan={owner:'supplier',holder:'player',key,count:1};f.plan.state.simulation.energies.player[d.energyId].reserve=0;assert.throws(()=>f.apply('store',{key,whole:true}),/energy/);assert.equal(f.plan.gameplay.player.inventory[key],1);assert.equal(f.plan.ownership,undefined);
});
test('preview staging is pure and duplicate transfers cannot manufacture exact units',()=>{
 const f=setup();f.apply('open');const before=structuredClone(f.plan),preview=structuredClone(f.plan);applyContainerEffect(preview,{type:'container',containerId:d.id,operation:'store',key,whole:true},f.context,f.registry,f.bindings);assert.deepEqual(f.plan,before);f.apply('store',{key,whole:true});assert.throws(()=>f.apply('store',{key,whole:true}),/quantity/);assert.equal(f.plan.ownership[d.id][key],1);
 const facts=containerFacts(f.plan.state,f.context,f.registry);assert.equal(facts[`container.${d.id}.known`],false);
});
test('definition and effect validation reject unbound and contradictory policy',()=>{
 validateContainerDefinition(d);assert.throws(()=>validateContainerDefinition({...d,trainedOutput:4}),/development/);assert.throws(()=>validateContainerEffect({type:'container',operation:'store',containerId:d.id,key,whole:true,count:2}),/complete/);
 const f=setup();f.plan.state.simulation.objectClocks['atelier.unit'].key=undefined;assert.throws(()=>validateContainerState(f.plan.state.simulation,f.plan.state,f.registry.simulation,()=>{}),/clock/);
});
test('legacy absence passes unchanged and frozen policy validates without a live registry',()=>{
 const legacy={schema:5};validateContainerState(legacy,{clock:0},undefined,()=>{});assert.deepEqual(legacy,{schema:5});
 const f=setup();validateContainerState(f.plan.state.simulation,f.plan.state,undefined,()=>{});assert.equal(containerFacts(f.plan.state,f.context,undefined)[`container.${d.id}.installed`],true);
 f.plan.state.simulation.containers[d.id].definition.capacity++;
 assert.throws(()=>validateContainerState(f.plan.state.simulation,f.plan.state,f.registry.simulation,()=>{}),/policy/);
});

test('installation keeps an already changed actual object condition',()=>{
 const f=setup(expiredKey);assert.equal(f.plan.state.simulation.objectClocks['atelier.unit'].key,expiredKey);
 f.apply('open');f.apply('store',{key:expiredKey,whole:true});assert.equal(f.plan.ownership[d.id][expiredKey],1);assert.equal(f.plan.ownership[d.id][key],undefined);
});

test('deferred gathered objects start from actual acquisition condition and freeze only in real storage',()=>{
 for(const damaged of [false,true]) {
  const fresh=JSON.stringify({id:'atelier.harvest'}),bad=JSON.stringify({id:'atelier.damaged'}),definition=structuredClone(d);
  definition.objects.push({unitId:'atelier.gathered',key:fresh,expiredKey:bad,expiresAfter:10,dimensions:[1,1,1],volume:1,titleClaimId:'atelier.harvest.title',titleOwner:'player',deferred:true});
  const f=setup(key,definition),clock=()=>f.plan.state.simulation.objectClocks['atelier.gathered'];
  f.apply('open');f.apply('store',{key,whole:true});f.plan.state.clock=100;advanceContainerClocks(f.plan,f.registry,f.context,f.bindings);
  assert.equal(clock().elapsed,0);assert.equal(containerFacts(f.plan.state,f.context,f.registry)['object.atelier.gathered.fresh'],false);assert.equal(nextContainerBoundary(f.plan.state,f.registry,{...f.context,inventoryOwners:f.plan.ownership}),Infinity);
  f.plan.state.simulation.claims['atelier.harvest.title']={owner:'player',status:'held',at:100};f.plan.gameplay.player.inventory[damaged?bad:fresh]=1;
  advanceContainerClocks(f.plan,f.registry,f.context,f.bindings);assert.equal(clock().key,damaged?bad:fresh);assert.equal(clock().elapsed,0);
  f.apply('store',{key:damaged?bad:fresh,whole:true});f.plan.state.clock=200;advanceContainerClocks(f.plan,f.registry,f.context,f.bindings);assert.equal(clock().elapsed,0);
  f.apply('retrieve',{key:damaged?bad:fresh,whole:true});f.plan.state.clock=211;advanceContainerClocks(f.plan,f.registry,f.context,f.bindings);assert.equal(f.plan.gameplay.player.inventory[bad],1);assert.equal(f.plan.gameplay.player.inventory[fresh],undefined);
 }
});

}

