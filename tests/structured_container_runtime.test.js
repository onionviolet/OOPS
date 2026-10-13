import test from 'node:test';
import assert from 'node:assert/strict';
import {applyContainerEffect,advanceContainerClocks,validateContainerDefinition,validateContainerEffect,validateContainerState,containerFacts,nextContainerBoundary} from '../src/structured_container_runtime.js';

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
