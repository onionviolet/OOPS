import test from 'node:test';
import assert from 'node:assert/strict';
import {applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {fireStored, storeWorking} from '../src/stored_working.js';
import {applyEffect} from '../src/world_effects.js';
import {WORLD_QUANTITIES as Q} from '../src/world_quantities.js';
import {END_WORKING, WORKING_END_PACK} from '../src/world_substrate_packs/working_end.js';

const at = id => ({shape: 'holder', id});
const pack = WORKING_END_PACK;
const config = {packs: [pack], shared: {quantities: [Q.vitality, Q.energy]}};

test('generic workshop guard ends on its target, leaving paid upkeep and the other guard intact', () => {
    let engine = createEngineWorld({...config, holders: [
        {id: 'workshop', kind: 'place'},
        ...['keeper', 'assistant'].map(id => ({id, kind: 'body', place: 'workshop',
            quantities: {vitality: 8, 'energy:stamina': 5}})),
    ]});
    for (const carrier of ['keeper', 'assistant']) {
        const record = storeWorking({carrier, mode: 'held', pulse: 2, trigger: {kind: 'time', every: 2},
            draw: {from: carrier, quantity: 'energy:stamina', per: 2},
            effects: [{sentence: {verb: 'block', object: 'vitality', time: 'sustained'},
                details: {target: at(carrier), field: `${carrier}-guard`, minutes: 2}}]},
        {id: `${carrier}-guard`, by: carrier, at: 0});
        const fired = fireStored({...engine, record, at: 0});
        assert.equal(fired.receipt.cost, 2);
        const {id, kind, source} = fired.world.laws.find(field => field.id === record.id);
        // The host records the actual output alongside the stored record.
        engine = applyEngineOps({...engine, world: fired.world}, [
            {op: 'state', holder: carrier, pack, value: {active: [{record: fired.record, field: {id, kind, source}}]}},
        ], 'register-workshop-guard');
    }
    const strike = (world, target) => applyEffect(engine.rules, world,
        {verb: 'remove', object: 'vitality', amount: 3, target: at(target)}, 'workshop-accident');
    assert.equal(strike(engine.world, 'keeper').outcome.blocked.length, 1);
    const publish = detail => ({op: 'publish', kind: END_WORKING, place: 'workshop', by: 'assistant', detail});
    const cancelled = (current, detail) => applyEngineOps(current, [publish(detail)], 'dismiss-guard');
    const wrong = cancelled(engine, {target: at('keeper'), working: 'assistant-guard'});
    assert.equal(wrong.world.holders.keeper.state[pack].active.length, 1);
    assert.deepEqual(wrong.world.laws, engine.world.laws);
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const detail = {target: at('keeper'), working: 'keeper-guard'};
    const ended = cancelled(restored, detail);
    assert.deepEqual(ended.world.holders.keeper.state[pack].active, []);
    assert.deepEqual(ended.world.holders.keeper.state[pack].ended,
        [{id: 'keeper-guard', by: 'assistant', at: 0, remainingCharge: 0}]);
    assert.equal(strike(ended.world, 'keeper').world.holders.keeper.quantities.vitality, 5);
    assert.equal(strike(ended.world, 'assistant').outcome.blocked.length, 1);
    assert.equal(ended.world.holders.keeper.quantities['energy:stamina'], 3);
    assert.deepEqual(cancelled(ended, detail).world.holders.keeper, ended.world.holders.keeper);
});
