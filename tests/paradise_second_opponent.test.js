import assert from 'node:assert/strict';
import test from 'node:test';
import {serializeEngineWorld, applyEngineOps} from '../src/engine_world.js';
import {readQuantity} from '../src/world_substrate.js';
import {paradisePracticeRun as run} from '../src/world_packs/paradise_sword_practice.js';
const restore = state => run.restore(JSON.parse(JSON.stringify(serializeEngineWorld(state))));
const complete = () => ['spar','enroll','finish','spar','study','spar'].reduce((s,a)=>run.act(s,a),run.create());
const results = s => s.world.holders.su_xiao.state['paradise.counter_drills'];
test('same guarded image defeats the familiar opening but waiting lands a real cut', () => {
 const base=complete(), commit=run.act(restore(base),'counter_commit'), wait=run.act(restore(base),'counter_wait');
 assert.deepEqual(results(commit),[{method:'commit',first:'guarding_image',seconds:1.6,blocked:true}]);
 assert.deepEqual(results(wait),[{method:'wait',first:'su_xiao',seconds:1,blocked:false}]);
 assert.ok(readQuantity(commit.world,'su_xiao','vitality')<30);
 assert.ok(readQuantity(wait.world,'guarding_image','vitality')<30);
 for(const branch of [commit,wait]) {
  assert.equal(branch.world.clock,75);
  assert.equal(readQuantity(branch.world,'su_xiao','stock:paradise_coin'),1000);
  assert.equal(branch.world.holders.su_xiao.properties['paradise.sword_practice_xp'],200);
 }
});
test('new choices need the completed studied drill and cannot bypass an absent teacher', () => {
 const initial=run.create();assert.equal(run.act(initial,'counter_wait'),initial);
 const learned=['enroll','finish','spar','study'].reduce((s,a)=>run.act(s,a),initial);
 assert.equal(run.act(learned,'counter_wait'),learned);
 const absent=applyEngineOps(complete(),[{op:'holder_remove',holder:'koshiro_image'}],'fixture:teacher_absent');
 assert.equal(run.act(absent,'counter_wait'),absent);
});
test('old saves gain only the new image, keep both settled outcomes and refuse duplicate methods after restore', () => {
 const old=restore(complete());assert.equal(old.world.holders.guarding_image,undefined);
 const first=run.act(old,'counter_commit'), saved=restore(first);
 assert.deepEqual(results(saved),results(first));
 assert.equal(run.act(saved,'counter_commit'),saved);
 const both=run.act(saved,'counter_wait');
 assert.equal(both.world.clock,80);assert.equal(results(both).length,2);
 assert.deepEqual(run.view(restore(both)).history,run.view(both).history);
 assert.equal(run.act(restore(both),'counter_wait').world.clock,80);
 assert.equal(readQuantity(both.world,'su_xiao','stock:paradise_coin'),1000);
});
