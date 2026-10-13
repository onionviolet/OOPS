import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,validateExpansionState} from '../src/expansion_engine.js';
import {createWorldInstance} from '../src/world_instances.js';
import {createPocketDoorConnection} from '../src/pocket_realm_rules.js';
import {GLASSHOUSE_DEFINITION,validateRealmState} from '../src/realm_state.js';
import {FOLDED_GLASSHOUSE_IDS as I} from '../src/pocket_realm_content.js';
test('dormant pocket permits another registered world but never an unvisited pocket body',()=>{
 const state=createExpansionState(42),registry=createContentRegistry({worlds:[{id:'base.frontier'},{id:'test.typed'},{id:I.worldId}]});
 state.worlds[I.worldId]={facts:{},resources:{},completed:{}};
 state.realmPrototype={schema:2,instances:{[I.instanceId]:createWorldInstance(GLASSHOUSE_DEFINITION,{id:I.instanceId,continuityId:'frontier.glasshouse.branch',eraId:'frontier.present',playedAt:0,parentInstanceId:'frontier.main',actorIds:[]})},visits:[],activeVisitId:null,offeredElapsed:null,receipts:[],connection:createPocketDoorConnection()};
 state.worlds['test.typed']={facts:{},resources:{},completed:{}};state.actors.player.worldId='test.typed';const before=structuredClone(state.realmPrototype);
 assert.doesNotThrow(()=>validateRealmState(state));assert.doesNotThrow(()=>validateExpansionState(state,registry));assert.deepEqual(state.realmPrototype,before);
 state.actors.player.worldId=I.worldId;assert.throws(()=>validateRealmState(state),/Player world and pocket visit disagree/);
 state.actors.player.worldId='test.unregistered';assert.throws(()=>validateExpansionState(state,registry));
});
