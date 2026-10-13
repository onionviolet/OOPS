import test from 'node:test';
import assert from 'node:assert/strict';
import {applyContainerEffect,validateContainerDefinition,validateContainerState} from '../src/structured_container_runtime.js';
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
