import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {guUniqueRefinementPack, GU_UNIQUE_REFINEMENT_LAW, uniqueRefinementWorking} from '../src/world_packs/gu_unique_refinement.js';
import {fixedTravelFuel, fixedTravelWorking, GU_FIXED_TRAVEL_LAW, guTravelCarryPack} from '../src/world_packs/gu_fixed_travel_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {readLineage} from '../src/world_substrate.js';

const pack = guUniqueRefinementPack.id;
const site = 'fixed-refinery', material = 'stock:travel-refinement-material';
const ref = (kind, id) => ({kind, id});
const config = {ownPacks: [guUniqueRefinementPack, guTravelCarryPack],
    packs: ['l.living_body', pack, guTravelCarryPack.id],
    shared: {quantities: sharedQuantities(['stock', 'energy']), properties: [...sharedProperties(['alive']),
        ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
        {id: 'gu_rank', type: 'level', min: 1}]},
    host: {laws: [GU_UNIQUE_REFINEMENT_LAW, GU_FIXED_TRAVEL_LAW]}};

function world() {
    return createEngineWorld({...config, holders: [
        {id: site, kind: 'place'},
        {id: 'hill', kind: 'place', properties: {gu_travel_scene: 'observatory'}},
        ...['first', 'rival', 'receiver'].map(id => ({id, kind: 'body', as: ['operator'], place: site,
            properties: {gu_refinement_steady: true}, quantities: {[material]: 6, [fixedTravelFuel]: 2}})),
        {id: 'memory', kind: 'thing', as: ['impression'], place: site,
            properties: {gu_impression_owner: 'receiver', gu_impression_site: 'hill', gu_travel_scene: 'observatory'}},
    ]});
}
function advance(engine, at) {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const working = (engine, id, action, operator, binding) => startEngineWorking(engine, {
    id, law: GU_UNIQUE_REFINEMENT_LAW, method: uniqueRefinementWorking(action),
    bindings: {operator: ref('operator', operator), ...binding}});
const forge = (engine, id, operator) => working(engine, id, 'forge', operator, {seat: ref('place', site)});
const takeover = (engine, id, operator, specimen) => working(engine, id, 'control', operator, {specimen: ref('gu', specimen)});
const outcome = (engine, id) => engine.world.holders[id].state[pack];
const stock = (engine, id) => engine.world.holders[id].quantities[material];
const live = engine => Object.values(engine.world.holders).filter(h => h.properties.gu_world_claim && h.properties.alive).map(h => h.id);

test('the first paid specimen keeps its claim through custody, control, travel and restore, then destruction frees it', () => {
    const running = forge(forge(world(), 'a-first', 'first'), 'b-rival', 'rival');
    const pending = advance(running, 2);
    assert.deepEqual([stock(pending, 'first'), stock(pending, 'rival')], [5, 5]);
    const first = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(first), serializeEngineWorld(advance(running, 3)));
    assert.deepEqual(live(first), ['a-first.gu']);
    assert.deepEqual(outcome(first, 'rival'), {status: 'failed'});
    assert.deepEqual([stock(first, 'first'), stock(first, 'rival')], [4, 4]);
    assert.equal(first.world.holders['a-first.gu'].properties.gu_controller, undefined);
    const transferred = applyEngineOps(first, [
        {op: 'property', holder: 'a-first.gu', property: 'gu_keeper', value: 'receiver'},
    ], 'fixture.transfer');
    const controlled = advance(takeover(transferred, 'control', 'receiver', 'a-first.gu'), 4);
    const crossing = startEngineWorking(controlled, {id: 'cross', law: GU_FIXED_TRAVEL_LAW, method: fixedTravelWorking(),
        bindings: {operator: ref('operator', 'receiver'), specimen: ref('gu', 'a-first.gu'),
            destination: ref('place', 'hill'), impression: ref('impression', 'memory')}});
    const away = advance(forge(crossing, 'remote-claim', 'rival'), 7);
    assert.equal(away.world.holders['a-first.gu'].place, 'hill');
    assert.equal(away.world.holders.receiver.quantities[fixedTravelFuel], 1);
    assert.deepEqual(live(away), ['a-first.gu']);
    assert.deepEqual(outcome(away, 'rival'), {status: 'failed'});
    assert.equal(stock(away, 'rival'), 2);

    const retry = advance(forge(away, 'retry', 'rival'), 8);
    const destroyed = applyEngineOps(retry, [{op: 'lifecycle', act: 'end', holder: 'a-first.gu'}], 'fixture.destroyed');
    const finished = advance(restore(destroyed), 10);
    assert.deepEqual(live(finished), ['retry.gu']);
    assert.equal(stock(finished, 'rival'), 0);
    assert.equal(finished.world.holders['retry.gu'].properties.gu_keeper, 'rival');
    assert.ok(readLineage(finished.world, 'a-first.gu').some(row => row.act === 'end'));
});

test('ordinary control failure has the same reported result as an occupied claim', () => {
    const unsteady = applyEngineOps(world(), [
        {op: 'property', holder: 'rival', property: 'gu_refinement_steady', value: false},
    ], 'fixture.unsteady');
    const failed = advance(forge(unsteady, 'control-failure', 'rival'), 3);
    const occupied = advance(forge(forge(world(), 'a-first', 'first'), 'b-rival', 'rival'), 3);
    assert.deepEqual(outcome(failed, 'rival'), outcome(occupied, 'rival'));
    assert.equal(stock(failed, 'rival'), stock(occupied, 'rival'));
    assert.deepEqual(live(failed), []);
});

test('different workshops race for one claim, while leaving during quench retains only preparation cost', () => {
    const remote = applyEngineOps(world(), [{op: 'move', holder: 'rival', to: 'hill'}], 'fixture.rival-workshop');
    const remoteWins = advance(forge(forge(remote, 'b-local', 'first'), 'a-remote', 'rival'), 3);
    assert.deepEqual(live(remoteWins), ['a-remote.gu']);
    assert.equal(remoteWins.world.holders['a-remote.gu'].place, 'hill');
    assert.deepEqual(outcome(remoteWins, 'first'), {status: 'failed'});
    const pending = advance(forge(remote, 'abandoned', 'rival'), 1);
    const departed = applyEngineOps(pending, [{op: 'move', holder: 'rival', to: site}], 'fixture.departure');
    const interrupted = advance(restore(departed), 3);
    assert.equal(interrupted.records.workings.abandoned.record.status, 'interrupted');
    assert.equal(stock(interrupted, 'rival'), 5);
    assert.deepEqual(live(interrupted), []);
});
