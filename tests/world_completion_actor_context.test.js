import test from 'node:test';
import assert from 'node:assert/strict';
import {createContentRegistry,createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';
import {worldCompletionSimulationContexts} from '../src/world_completion_runtime.js';
test('connected-world scheduler preserves each actor location instead of borrowing the player location',()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{people:[{id:'field.worker',revision:1,label:'Worker',worldId:'base.frontier',location:'Village road',inventory:'simulation'}]}});
 const state=enrollSimulation(createExpansionState(81),registry,{actorId:'player',facts:{location:'Village'},external:{money:91},gameplay:{}}).state;
 const contexts={player:{actorId:'player',facts:{location:'Village','weather.raining':false}},'field.worker':{actorId:'field.worker',facts:{}}};
 const before=structuredClone(state),frames=structuredClone(contexts);
 const out=worldCompletionSimulationContexts(state,contexts);
 assert.equal(out.player.facts.location,'Village');assert.equal(out['field.worker'].facts.location,'Village road');
 assert.equal(out['field.worker'].facts['weather.raining'],false);
 contexts['field.worker'].facts.location='Own current native site';
 assert.equal(worldCompletionSimulationContexts(state,contexts)['field.worker'].facts.location,'Own current native site');
 assert.deepEqual(state,before);assert.deepEqual(frames['field.worker'].facts,{});
});
