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

import {worldCompletionNativeContext,worldCompletionFacts,worldCompletionContext} from '../src/world_completion_facts.js';
import {withFactsFrame,invalidateFactsInput,withFactsMutation} from '../src/facts_frame.js';
test('body projections use publication revisions and keep direct same-clock reads fresh',()=>{
 const state={clock:2,sequence:3,simulation:{people:{player:{vitals:{health:9}},worker:{vitals:{health:4}},role:{location:'Remote'}}}};
 const read=()=>worldCompletionNativeContext(state);
 withFactsFrame(state,()=>{
  const first=read();first.vitals.worker={health:0};
  assert.equal(read().vitals.worker.health,4);
  state.simulation.people.worker.vitals={health:7};
  invalidateFactsInput(state);
  assert.equal(read().vitals.worker.health,7);
  withFactsMutation([state],()=>{
   state.simulation.people.worker.vitals={health:8};
   assert.equal(read().vitals.worker.health,8);
   state.simulation.people.role.vitals={health:5};
   assert.equal(read().vitals.role.health,5);
  });
  assert.equal(read().vitals.role.health,5);
  const context={vitals:{player:{health:2}},vitalsByActor:{worker:{health:1}}};
  assert.deepEqual(worldCompletionNativeContext(state,context).vitals,{player:{health:2},worker:{health:8},role:{health:5}});
 });
 state.simulation.people.role.vitals={health:6};assert.equal(read().vitals.role.health,6);
 state.simulation.people.role.vitals={health:1};assert.equal(read().vitals.role.health,1);
});
test('normalized connected-world facts preserve their dependency chain and input ownership',()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{}});
 const state=enrollSimulation(createExpansionState(81),registry,{actorId:'player',facts:{location:'Village'},external:{money:91},gameplay:{}}).state;
 const context={actorId:'player',facts:{location:'Village',other:17},vitals:{health:9},equipment:{},gameplay:{}};
 const before=structuredClone(context),facts=worldCompletionFacts(state,context),joined=worldCompletionContext(state,context);
 assert.deepEqual(joined.facts,{...context.facts,...facts});
 withFactsFrame(state,()=>assert.deepEqual(worldCompletionFacts(state,context),facts));
 assert.deepEqual(context,before);assert.equal(facts.other,undefined);
});

test('connected-world result retains supplied family facts without copying unrelated facts into its output',()=>{
 const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:{}});
 const state=enrollSimulation(createExpansionState(81),registry,{actorId:'player',facts:{location:'Village'},external:{money:91},gameplay:{}}).state;
 const base={actorId:'player',facts:{location:'Village'},vitals:{health:9},equipment:{},gameplay:{}};
 const expected=worldCompletionFacts(state,base);
 const context={...base,facts:{...Object.fromEntries(Array.from({length:1500},(_,i)=>['unrelated.'+i,i])),...base.facts,'worldCompletion.fixture':17,'worldCompletion.local':'stale'}};
 const before=structuredClone(context);
 const actual=worldCompletionFacts(state,context);
 assert.deepEqual(actual,{...expected,'worldCompletion.fixture':17});
 assert.equal(actual['worldCompletion.local'],expected['worldCompletion.local']);
 assert.deepEqual(context,before);
 const joined=worldCompletionContext(state,context).facts;
 assert.deepEqual(joined,{...context.facts,...actual});
 assert.equal(JSON.stringify(joined),JSON.stringify({...context.facts,...actual}),'projection order remains stable');
 joined['worldCompletion.fixture']=99;assert.equal(worldCompletionContext(state,context).facts['worldCompletion.fixture'],17);
});
