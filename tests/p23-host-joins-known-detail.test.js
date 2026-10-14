import test from 'node:test';
import assert from 'node:assert/strict';
import {validateKnownDetailEnvelope} from '../src/absorb_p23/host_joins/known_detail.js';
import {settleObservedDrops} from '../src/absorb_p23/known_detail/observations.js';
test('legacy absence preserves the envelope; invalid optional schemas reject without mutation',()=>{
 const save={enemy_killcount:{Rat:99}},before=structuredClone(save);validateKnownDetailEnvelope(save);assert.deepEqual(save,before);
 for(const patch of [{display_preferences:{schema:2,settings:{}}},{p23_drop_observations:{schema:2,creatures:{}}}]){
  const envelope={...save,...patch},before=structuredClone(envelope);assert.throws(()=>validateKnownDetailEnvelope(envelope),/schema/);assert.deepEqual(envelope,before);
 }
});
test('actual loot associates only its own creature and cannot exceed native settlement history',()=>{
 const event={recipientId:'player',creatureId:'Rat',killOrdinal:1,drops:[{itemId:'Rat tail',count:2}]};
 const state=settleObservedDrops(undefined,event).state;
 validateKnownDetailEnvelope({enemy_killcount:{Rat:1},p23_drop_observations:state});
 assert.throws(()=>validateKnownDetailEnvelope({enemy_killcount:{Rat:0},p23_drop_observations:state}),/native kill/);
 assert.deepEqual(settleObservedDrops(state,event).state,state);
 const empty=settleObservedDrops(state,{...event,creatureId:'Wolf',killOrdinal:1,drops:[]}).state;
 assert.deepEqual(empty.creatures.Wolf.drops,{});assert.deepEqual(empty.creatures.Rat.drops,{'Rat tail':2});
});
