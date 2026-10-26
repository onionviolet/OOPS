import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';
import {nativeEquipmentSnapshot,prepareNativeEquipment} from '../src/native_equipment_transaction.js';
const nativeKey=JSON.stringify({id:'Fixture sword'}),simKey=JSON.stringify({id:'Fixture hammer'});
const actors={player:{getEquipment:()=>({}),_equipItem:()=>{}}},getItem=()=>({equip_slot:'weapon'});

test('common clock keeps simulation-owned gear in its own state while preparing actual native equipment',()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{people:[{id:'sim.worker',revision:1,label:'Worker',worldId:'base.frontier',location:'Village',inventory:'simulation'}]}});
 const state=enrollSimulation(createExpansionState(76),registry,{actorId:'player',facts:{location:'Village'},external:{money:20},gameplay:{}}).state;
 state.simulation.equipment['sim.worker']={weapon:simKey};const before=structuredClone(state);
 const out=advanceSimulation(state,registry,1,{money:20},{},{player:{equipment:{weapon:nativeKey}},'sim.worker':{equipment:{weapon:simKey}}});
 assert.deepEqual(state,before);assert.deepEqual(out.state.simulation.equipment['sim.worker'],{weapon:simKey});
 assert.deepEqual(out.equipment,{player:{weapon:nativeKey}});assert.doesNotThrow(()=>prepareNativeEquipment(out.equipment,{actors,getItem}));
});
test('direct plan staging excludes only explicit simulation owners and retains unknown-owner rejection',()=>{
 const input={player:{weapon:nativeKey},'sim.worker':{weapon:simKey},'unknown.native':{}};
 const result=nativeEquipmentSnapshot(input,{'sim.worker':{inventory:'simulation'},player:{inventory:'native'}});
 assert.deepEqual(result,{player:{weapon:nativeKey},'unknown.native':{}});
 assert.throws(()=>prepareNativeEquipment(result,{actors,getItem}),/No native equipment owner unknown.native/);
 assert.deepEqual(input['sim.worker'],{weapon:simKey});
 assert.throws(()=>nativeEquipmentSnapshot(null),/Invalid equipment owner/);
});
