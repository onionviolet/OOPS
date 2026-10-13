import test from 'node:test';
import assert from 'node:assert/strict';
import {applyContainerEffect,advanceContainerClocks,containerFacts,validateContainerState,nextContainerBoundary} from '../src/structured_container_runtime.js';
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
