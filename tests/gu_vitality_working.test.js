import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {GU_VITALITY_WORLD_LAW, GU_VITALITY_WORLD_PROPERTIES, GU_VITALITY_WORLD_QUANTITIES,
    guVitalityHabitatPack, guVitalityWorking} from '../src/world_packs/gu_vitality_working.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {readLineage} from '../src/world_substrate.js';

const water = 'stock:water', essence = 'energy:primeval.rank2', leaves = 'stock:vitality-leaf', stem = 'gu_rooted_leaves';
const config = {packs: ['l.living_body', guVitalityHabitatPack.id], ownPacks: [guVitalityHabitatPack],
    shared: {quantities: [...sharedQuantities(['stock', 'energy', 'vitality', 'daylight']), ...GU_VITALITY_WORLD_QUANTITIES],
        properties: [...sharedProperties(['alive']), ...GU_VITALITY_WORLD_PROPERTIES,
            ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))]},
    host: {laws: [GU_VITALITY_WORLD_LAW]}};
function garden() {
    return createEngineWorld({...config, holders: [
        {id: 'garden', kind: 'place', quantities: {daylight: 1}},
        {id: 'shed', kind: 'place', quantities: {daylight: 0}},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'garden', quantities: {[essence]: 4}},
        {id: 'water', kind: 'thing', as: ['supply'], place: 'garden', quantities: {[water]: 3}},
        {id: 'plant', kind: 'body', as: ['gu'], tags: ['living.body'], place: 'garden', quantities: {[stem]: 0, satiety: 2},
            properties: {alive: true, gu_kind: 'vitality-grass', gu_keeper: 'keeper', gu_controller: 'keeper'},
            state: {'l.living_body': livingBodyState({species: 'vitality-grass', rate: 1})}},
        ...['first', 'second'].map(id => ({id, kind: 'body', as: ['creature'], place: 'garden',
            quantities: {vitality: 6}, properties: {alive: true, gu_vitality_limit: 12}})),
    ]});
}
function start(engine, id, operation, patient = 'first') {
    const method = guVitalityWorking(operation);
    const ids = {operator: 'keeper', producer: 'plant', plot: 'garden', cistern: 'water', patient};
    return startEngineWorking(engine, {id, method, law: GU_VITALITY_WORLD_LAW,
        bindings: Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]))});
}
function advance(engine, at) {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const q = (engine, holder, quantity) => engine.world.holders[holder].quantities[quantity];
const result = (engine, id) => engine.records.workings[id].record;
const step = (engine, id, operation, patient) =>
    advance(start(engine, id, operation, patient), engine.world.clock + guVitalityWorking(operation).steps[0].minutes);

test('upkeep sustains paid growth and the finite harvest pays separate patients through restore', () => {
    const thirsty = step(garden(), 'thirsty', 'grow');
    assert.equal(result(thirsty, 'thirsty').receipts[0].reason, 'The plant needs tending.');
    assert.equal(q(thirsty, 'water', water), 3);
    assert.equal(q(thirsty, 'keeper', essence), 4);
    const tended = step(thirsty, 'tend', 'tend');
    assert.equal(q(tended, 'water', water), 2);
    const running = start(tended, 'grow-one', 'grow');
    const midway = advance(running, 5);
    const grown = advance(restore(midway), 7);
    assert.deepEqual(serializeEngineWorld(grown), serializeEngineWorld(advance(running, 7)));
    assert.equal(q(grown, 'plant', stem), 1);
    const twice = step(grown, 'grow-two', 'grow');
    const first = step(twice, 'pluck-one', 'pluck');
    const harvest = step(first, 'pluck-two', 'pluck');
    assert.equal(q(harvest, 'plant', stem), 0);
    assert.equal(q(harvest, 'keeper', leaves), 2);
    assert.equal(q(harvest, 'keeper', essence), 0);
    assert.equal(q(harvest, 'water', water), 0);

    const transferred = applyEngineOps(harvest, [
        {op: 'property', holder: 'plant', property: 'gu_keeper', value: 'second'},
        {op: 'property', holder: 'plant', property: 'gu_controller', value: 'second'},
    ], 'fixture.plant-transfer');
    const healed = step(restore(transferred), 'treat-first', 'treat');
    assert.equal(q(healed, 'first', 'vitality'), 8);
    const refused = step(restore(healed), 'treat-early', 'treat');
    assert.equal(result(refused, 'treat-early').receipts[0].reason, 'The last leaf is still working.');
    assert.equal(q(refused, 'keeper', leaves), 1);
    const other = step(refused, 'treat-second', 'treat', 'second');
    assert.equal(q(other, 'second', 'vitality'), 8);
    assert.equal(q(other, 'keeper', leaves), 0);
    const later = step(advance(other, healed.world.clock + 60), 'empty-basket', 'treat');
    assert.equal(result(later, 'empty-basket').receipts[0].reason, 'No detached leaf is available.');
});

test('shade exposure follows the plant, then recovery allows its next paid leaf to heal', () => {
    const stress = 'gu_shade_stress';
    const tended = step(garden(), 'tend', 'tend');
    const sheltered = applyEngineOps(tended, [
        {op: 'carry', holder: 'plant', quantity: stress},
        {op: 'move', holder: 'plant', to: 'shed'},
    ], 'fixture.shelter');
    const exposed = advance(restore(advance(sheltered, 3)), 6);
    assert.deepEqual(serializeEngineWorld(exposed), serializeEngineWorld(advance(sheltered, 6)));
    assert.equal(q(exposed, 'plant', stress), 5);

    const sunny = applyEngineOps(exposed, [{op: 'move', holder: 'plant', to: 'garden'}], 'fixture.sunlight');
    const refused = step(sunny, 'early', 'grow');
    assert.equal(result(refused, 'early').receipts[0].reason, 'The plant is still recovering from shade.');
    assert.equal(q(refused, 'plant', stress), 2);
    assert.equal(q(refused, 'water', water), 2);
    assert.equal(q(refused, 'keeper', essence), 4);

    const pending = start(refused, 'retry', 'grow');
    const grown = advance(restore(advance(pending, 10)), 12);
    assert.deepEqual(serializeEngineWorld(grown), serializeEngineWorld(advance(pending, 12)));
    assert.equal(q(grown, 'plant', stress), 0);
    assert.equal(q(grown, 'water', water), 1);
    assert.equal(q(grown, 'keeper', essence), 2);
    const healed = step(step(grown, 'pluck', 'pluck'), 'treat', 'treat');
    assert.equal(q(healed, 'first', 'vitality'), 8);
});

test('prolonged shade can kill the rooted Gu while a detached leaf remains usable', () => {
    const grown = step(step(garden(), 'tend', 'tend'), 'grow', 'grow');
    const harvest = step(grown, 'pluck', 'pluck');
    const shaded = applyEngineOps(harvest, [
        {op: 'carry', holder: 'plant', quantity: 'gu_shade_stress'},
        {op: 'carry', holder: 'plant', quantity: 'vitality', amount: 3},
        {op: 'property', holder: 'plant', property: 'gu_vitality_limit', value: 3},
        {op: 'move', holder: 'plant', to: 'shed'},
    ], 'fixture:prolonged-shade');
    const at = shaded.world.clock;
    const critical = advance(shaded, at + 12);
    assert.equal(q(critical, 'plant', 'gu_shade_stress'), 12);
    assert.equal(q(critical, 'plant', 'vitality'), 1);
    const dead = advance(restore(critical), at + 13);
    assert.deepEqual(serializeEngineWorld(dead), serializeEngineWorld(advance(shaded, at + 13)));
    assert.equal(dead.world.holders.plant, undefined);
    assert.equal(readLineage(dead.world, 'plant').at(-1).act, 'end');
    const refused = step(dead, 'grow-again', 'grow');
    assert.equal(result(refused, 'grow-again').receipts[0].reason, 'role-unavailable');
    assert.equal(q(refused, 'water', water), 1);
    assert.equal(q(refused, 'keeper', essence), 2);
    const treated = step(refused, 'use-detached', 'treat');
    assert.equal(q(treated, 'first', 'vitality'), 8);
    assert.equal(q(treated, 'keeper', leaves), 0);

    const rescued = applyEngineOps(critical, [{op: 'move', holder: 'plant', to: 'garden'}], 'fixture:rescued-plant');
    const recovered = advance(restore(rescued), at + 24);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(rescued, at + 24)));
    assert.equal(q(recovered, 'plant', 'gu_shade_stress'), 0);
    assert.equal(q(recovered, 'plant', 'vitality'), 1);
    const care = start(recovered, 'treat-rescued', 'treat-gu', 'plant');
    const healed = advance(restore(care), recovered.world.clock + 1);
    assert.deepEqual(serializeEngineWorld(healed), serializeEngineWorld(advance(care, recovered.world.clock + 1)));
    assert.equal(q(healed, 'plant', 'vitality'), 3);
    assert.equal(q(healed, 'keeper', leaves), 0);
    const moved = applyEngineOps(care, [{op: 'move', holder: 'plant', to: 'shed'}], 'fixture:patient-moved');
    const missed = advance(restore(moved), recovered.world.clock + 1);
    assert.equal(result(missed, 'treat-rescued').receipts[0].reason, 'The patient is unavailable.');
    assert.equal(q(missed, 'keeper', leaves), 1);
    const deadCare = step(dead, 'treat-dead', 'treat-gu', 'plant');
    assert.equal(result(deadCare, 'treat-dead').receipts[0].reason, 'role-unavailable');
    assert.equal(q(deadCare, 'keeper', leaves), 1);
    const newLeaf = step(step(healed, 'water-rescue', 'tend'), 'new-leaf', 'grow');
    // Tending used the last unit of water. The plant survives, while paid growth still needs another ration.
    assert.equal(result(newLeaf, 'new-leaf').status, 'interrupted');
    const supplied = applyEngineOps(newLeaf, [{op: 'set', holder: 'water', quantity: water, amount: 1}], 'fixture:water-resupplied');
    const regrown = step(supplied, 'regrow', 'grow');
    assert.equal(q(regrown, 'plant', stem), 1);
    assert.equal(q(regrown, 'keeper', essence), 0);
});

test('a site losing daylight during growth refuses before spending, and two treatments cannot spend one leaf', () => {
    const tended = step(garden(), 'tend', 'tend');
    const pending = advance(start(tended, 'growing', 'grow'), 2);
    const dark = applyEngineOps(pending, [{op: 'set', holder: 'garden', quantity: 'daylight', amount: 0}], 'fixture.sunset');
    const denied = advance(restore(dark), 4);
    assert.equal(result(denied, 'growing').status, 'interrupted');
    assert.equal(q(denied, 'keeper', essence), 4);
    assert.equal(q(denied, 'water', water), 2);
    assert.equal(q(denied, 'plant', stem), 0);

    const harvest = step(step(tended, 'grow', 'grow'), 'pluck', 'pluck');
    const two = start(start(harvest, 'first-use', 'treat'), 'second-use', 'treat', 'second');
    const settled = advance(restore(two), harvest.world.clock + 1);
    assert.equal(q(settled, 'first', 'vitality'), 8);
    assert.equal(q(settled, 'second', 'vitality'), 6);
    assert.equal(q(settled, 'keeper', leaves), 0);
    assert.equal(result(settled, 'second-use').receipts[0].reason, 'No detached leaf is available.');
});
