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


test('mutable actor frames retain live query capabilities while isolating data amendments', () => {
    const frame = createPlanningReadFrame();
    const presence = state => (_id, body) => state.clock < 10 ? body.location : 'elsewhere';
    const facts = {location: 'desk'}, source = {player: {facts, charmPresence: presence}, alias: facts};
    source.self = source;
    const first = frame.read('actors', () => source, {mutable: true});
    first.player.facts.location = 'planned';
    assert.equal(first.player.charmPresence, presence, 'borrowed callback identity is retained');
    assert.equal(first.player.charmPresence({clock: 10})('person', {location: 'desk'}), 'elsewhere', 'settlement supplies its current state');
    assert.equal(first.self, first);
    assert.equal(first.alias, first.player.facts);
    const second = frame.read('actors', () => {throw Error('read should be cached');}, {mutable: true});
    assert.equal(second.player.facts.location, 'desk');
    assert.notEqual(second.player.facts, first.player.facts);
    assert.equal(source.player.facts.location, 'desk');
});
