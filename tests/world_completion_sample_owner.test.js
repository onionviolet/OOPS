import test from 'node:test';
import assert from 'node:assert/strict';
import {worldCompletionBridgeFacts} from '../src/world_completion_bridge.js';

const measured=()=>({clock:10,actors:{player:{worldId:'base.frontier',resources:{},facts:{
 'world.completion.enrolled':true,'lore.warning.sampleDrainOpen':false,
 'world.completion.lens.sampleCause':'simulation:3','world.completion.lens.measurementCause':'simulation:5',
 'world.completion.lens.measurementAt':5,'world.completion.lens.measurementCommand':'world.completion.lens.measure_owner_outside'},
 completed:{'world.completion.begin':1,'world.completion.lens.measure_owner_outside':1}}},
 worlds:{'base.frontier':{facts:{'lore.warning.drainOpen':false}}},simulation:{schema:5,people:{player:{location:'Shack'}},
 sites:{},jobs:[],situations:{'lore.warning.rain':{openedAt:2,deadline:22}},knowledge:{player:{
 'lore.warning.sample':{stage:'seen',cause:'simulation:3',at:3,basis:{situationId:'lore.warning.rain',attributedTo:'player'}},
 'world.completion.lens.measurement':{stage:'seen',cause:'simulation:5',at:5,basis:{sampleCause:'simulation:3',commandId:'world.completion.lens.measure_owner_outside'}}}}}});
test('an independent learner at home can refer to the actual player-owned measured datum without being moved',()=>{
 const state=measured(),context={actorId:'remainder_home.neri',facts:{location:'Shack'}},before=structuredClone(state);
 assert.equal(worldCompletionBridgeFacts(state,context)['worldCompletion.measuredSample'],true);
 assert.equal(context.facts.location,'Shack');assert.deepEqual(state,before);
});
test('changed site state or mismatched performed measurement invalidates that shared datum',()=>{
 const context={actorId:'remainder_home.neri',facts:{location:'Shack'}};
 const changed=measured();changed.worlds['base.frontier'].facts['lore.warning.drainOpen']=true;
 assert.equal(worldCompletionBridgeFacts(changed,context)['worldCompletion.measuredSample'],false);
 const mismatched=measured();mismatched.simulation.knowledge.player['world.completion.lens.measurement'].basis.sampleCause='simulation:2';
 assert.equal(worldCompletionBridgeFacts(mismatched,context)['worldCompletion.measuredSample'],false);
});
