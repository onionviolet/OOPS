import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createContentRegistry,createExpansionState,advanceSimulation} from '../../../../../src/expansion_engine.js';
import {enrollSimulation} from '../../../../../src/simulation.js';
import {prepareNativeEquipment} from '../../../../../src/native_equipment_transaction.js';
const fixed=process.argv.includes('--expect-fixed'),key=JSON.stringify({id:'Fixture sword'}),simKey=JSON.stringify({id:'Fixture hammer'});
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{people:[{id:'sim.worker',revision:1,label:'Simulation-owned worker',worldId:'base.frontier',location:'Village',inventory:'simulation',body:{hands:2},vitals:{health:10,max_health:10,stamina:10,max_stamina:10}}]}});
const initial=enrollSimulation(createExpansionState(76),registry,{actorId:'player',facts:{location:'Village'},external:{money:20},gameplay:{}}).state;
initial.simulation.equipment['sim.worker']={weapon:simKey};
const sourceBefore=structuredClone(initial),contexts={player:{actorId:'player',facts:{location:'Village'},equipment:{weapon:key}},'sim.worker':{actorId:'sim.worker',facts:{location:'Village'},equipment:{weapon:simKey}},'unknown.native':{equipment:{}}};
const out=advanceSimulation(initial,registry,1,{money:20},{},contexts);
assert.deepEqual(initial,sourceBefore,'Pure advance must not mutate input');
assert.deepEqual(out.state.simulation.equipment['sim.worker'],sourceBefore.simulation.equipment['sim.worker'],'Simulation-owned equipment retains its sole owner');
assert.deepEqual(out.equipment.player,{weapon:key},'Actual native slots must remain in outgoing publication');
const actors={player:{getEquipment:()=>({}),_equipItem:()=>{}}},getItem=()=>({equip_slot:'weapon'});
if(fixed){assert.equal(Object.hasOwn(out.equipment,'sim.worker'),false,'Simulation equipment must not reach native publisher');assert.throws(()=>prepareNativeEquipment(out.equipment,{actors,getItem}),/No native equipment owner unknown.native/);const nativeOnly={...out.equipment};delete nativeOnly['unknown.native'];assert.doesNotThrow(()=>prepareNativeEquipment(nativeOnly,{actors,getItem}));}
else{assert.deepEqual(out.equipment['sim.worker'],{weapon:simKey});assert.throws(()=>prepareNativeEquipment(out.equipment,{actors,getItem}),/No native equipment owner sim.worker/);}
assert.equal(Object.hasOwn(out.equipment,'unknown.native'),true,'Unbound owners must remain visible to native validation');
// Unknown outgoing owners still reach the validator rather than being silently discarded.
assert.throws(()=>prepareNativeEquipment({...out.equipment,'unknown.native':{}},{actors,getItem}),/No native equipment owner/);
const result={mode:fixed?'REGRESSION_FIXED':'REPRODUCED_SOURCE',scope:'One common advance/publication owner-boundary fixture, not native gameplay or durable storage',clock:out.state.clock,nativeSlots:out.equipment.player,simulationOwnerUnchanged:true,simulationExcludedFromNative:!Object.hasOwn(out.equipment,'sim.worker'),unknownNativeStillRejected:true,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(new URL('../../../../../src/expansion_engine.js',import.meta.url))).digest('hex')};
fs.writeFileSync(new URL(fixed?'./EQUIPMENT_FIXED.json':'./EQUIPMENT_REPRO.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
