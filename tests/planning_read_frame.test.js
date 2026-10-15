import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlanningReadFrame} from '../src/planning_read_frame.js';
test('planning frames reuse reads without leaking consumer amendments',()=>{
    const frame=createPlanningReadFrame();let calls=0;const build=()=>{calls++;return {facts:{location:'Village'},vitals:{health:7}};};
    const first=frame.read('native',build,{mutable:true});first.facts.location='staged';first.vitals.health=0;
    assert.deepEqual(frame.read('native',build,{mutable:true}),{facts:{location:'Village'},vitals:{health:7}});assert.equal(calls,1);
});
test('binding/publication invalidation refreshes all nested builders and phases stay independent',()=>{
    const frame=createPlanningReadFrame();let live=1;const inner=()=>({value:live});const outer=()=>({nested:frame.read('native',inner)});
    assert.equal(frame.read('feature',outer).nested.value,1);live=2;frame.invalidate();assert.equal(frame.read('feature',outer).nested.value,2);
    live=3;assert.equal(createPlanningReadFrame().read('feature',()=>({nested:inner()})).nested.value,3);
});
