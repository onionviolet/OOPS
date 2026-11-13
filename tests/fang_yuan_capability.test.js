// PC52/PC95 developer fixture. The later consumer is Fang Yuan's academy route.
// The clan offer and refinement support are fixture inputs. The same living
// holder supplies the working, care and contest mechanisms.
import assert from 'node:assert/strict';
import test from 'node:test';
import {beginContest, runContest} from '../src/contest.js';
import {GU_CONTEST, wangErDuel} from '../src/contest_packs/gu_world.js';
import {acquireCreature, restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyCase} from '../src/world_packs/gu_body_cases.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {firstControlMethod, GU_CONTROL_PROPERTIES, GU_FIRST_CONTROL_LAW} from '../src/world_packs/gu_first_control.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {readQuantity} from '../src/world_substrate.js';

const fang = 'fang_yuan';
const essence = 'primeval_essence';
const appetite = 'l.living_body';
const moonlight = guBodyCase('moonlight');
const [petals] = moonlight.knownStock;
const bladeCost = guCatalogue.moonlight.ability.value.cost;
// Fund both source-route infusion costs and four combat casts in one fixture.
const scene = wangErDuel({essence: 30 + 1 + bladeCost * 4});
const config = {
    packs: [appetite, 'c.contest'],
    shared: {quantities: [...scene.quantities, WORLD_QUANTITIES.stock],
        properties: [WORLD_PROPERTIES.alive, ...GU_CONTROL_PROPERTIES]},
    host: {laws: [GU_FIRST_CONTROL_LAW]},
};

function acquire() {
    const habitat = {id: scene.place, capacity: 1, supportedSpecies: ['moonlight']};
    let lifecycle = restoreCreatureLifecycle();
    lifecycle = settleCohortStock(lifecycle, {revision: lifecycle.revision,
        id: 'clan_stock', species: 'moonlight', habitat, delta: 1});
    const entrants = scene.bodies.map(holder => holder.id !== fang ? holder : {...holder, as: ['operator'],
        properties: {alive: true, aperture_open: true}});
    let engine = createEngineWorld({...config, holders: [...entrants,
        {id: 'pouch', kind: 'thing', place: scene.place, quantities: {[petals]: 4}}]});
    const acquired = acquireCreature(lifecycle, {revision: lifecycle.revision,
        cohortId: 'clan_stock', destination: habitat, keeper: fang});
    const {id} = acquired;
    assert.equal(acquired.state.cohorts.clan_stock.stock, 0);
    const holder = {...guBodyHolder(moonlight.row, {id, place: scene.place, satiety: moonlight.ration}),
        properties: {alive: true, gu_kind: 'moonlight', gu_keeper: acquired.state.individuals[id].keeper}};
    engine = applyEngineOps(engine, [{op: 'holder_add', value: holder}], 'fixture:clan_choice');
    return {engine, id};
}

const startRefinement = (engine, specimen, id, supported) => startEngineWorking(engine, {
    law: GU_FIRST_CONTROL_LAW, method: firstControlMethod(supported), id,
    bindings: {operator: {kind: 'operator', id: fang}, specimen: {kind: 'gu', id: specimen}},
});
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const controller = (engine, id) => engine.world.holders[id].properties.gu_controller;

function fight(engine, id) {
    const holder = engine.world.holders[id];
    const entrants = structuredClone(scene.entrants);
    const player = entrants.find(entrant => entrant.id === fang);
    player.moves = ['moonlight_gu', 'fist'];
    const {alive, gu_kind, gu_controller, gu_keeper} = holder.properties;
    const carried = alive && gu_controller === fang && gu_keeper === fang && holder.place === engine.world.holders[fang].place;
    player.profile.gu = carried ? [{id, kind: gu_kind, rank: 1,
        fedThrough: readQuantity(engine.world, id, 'satiety') > 0 ? 0 : -1}] : [];
    // A short contest reads a snapshot at entry. Contest ticks are tenths of a
    // second. Scheduling their effects across world minutes is future host work.
    const record = beginContest(GU_CONTEST, {id: 'capability_run', seed: 2,
        place: scene.place, entrants}, engine.world);
    return runContest(GU_CONTEST, record, engine.rules, engine.world);
}

test('Fang Yuan refines, feeds and uses the same acquired Moonlight Gu in combat', () => {
    const {engine: acquired, id} = acquire();
    assert.equal(controller(acquired, id), undefined);
    assert.equal(readQuantity(fight(acquired, id).world, fang, essence), 31 + bladeCost * 4);
    const first = startRefinement(acquired, id, 'first_attempt', false);
    const resisted = advanceEngineWorld(first, 30).engine;
    assert.equal(resisted.records.workings.first_attempt.record.receipts[0].observed.result, 'resisted');
    assert.equal(controller(resisted, id), undefined);
    assert.equal(readQuantity(resisted.world, fang, essence), 1 + bladeCost * 4);

    const supported = applyEngineOps(resisted, [{op: 'property', holder: fang, property: 'refinement_support', value: true}], 'fixture:earned_support');
    const retry = startRefinement(supported, id, 'second_attempt', true);
    const pending = advanceEngineWorld(retry, 32).engine;
    assert.equal(controller(pending, id), undefined);
    const engine = advanceEngineWorld(restore(pending), 35).engine;
    assert.deepEqual(serializeEngineWorld(engine), serializeEngineWorld(advanceEngineWorld(retry, 35).engine));
    assert.equal(engine.records.workings.second_attempt.record.receipts[0].observed.result, 'controlled');
    assert.equal(controller(engine, id), fang);
    assert.equal(readQuantity(engine.world, fang, essence), bladeCost * 4);

    for (const op of [
        {op: 'property', holder: fang, property: 'refinement_support', value: false},
        {op: 'property', holder: id, property: 'gu_keeper', value: 'clan'},
        {op: 'set', holder: fang, quantity: essence, amount: 0},
    ]) {
        const changed = applyEngineOps(pending, [op], 'fixture:lost_means');
        const refused = advanceEngineWorld(changed, 35).engine;
        assert.equal(refused.records.workings.second_attempt.record.status, 'interrupted');
        assert.equal(controller(refused, id), undefined);
        assert.equal(readQuantity(refused.world, fang, essence), readQuantity(changed.world, fang, essence));
    }
    const repeated = advanceEngineWorld(startRefinement(engine, id, 'repeat_attempt', true), 40).engine;
    assert.equal(readQuantity(repeated.world, fang, essence), bladeCost * 4);
    assert.equal(controller(repeated, id), fang);

    const overlapping = advanceEngineWorld(startRefinement(retry, id, 'simultaneous_attempt', true), 35).engine;
    assert.equal(overlapping.records.workings.simultaneous_attempt.record.status, 'interrupted');
    assert.equal(controller(overlapping, id), fang);
    assert.equal(readQuantity(overlapping.world, fang, essence), bladeCost * 4);

    const beforeMeal = advanceEngineWorld(engine, moonlight.ration - 1).engine;
    const fed = applyEngineOps(beforeMeal, moonlight.mealOps(beforeMeal.world, id, 'pouch'), 'fixture:meal');
    const ready = advanceEngineWorld(fed, moonlight.ration).engine;
    assert.equal(readQuantity(ready.world, 'pouch', petals), 2);
    assert.equal(readQuantity(ready.world, fang, essence), bladeCost * 4);
    const restored = restore(ready);
    assert.deepEqual(restored.world.holders[id], ready.world.holders[id]);
    const result = fight(restored, id);
    assert.deepEqual(result, fight(ready, id));
    const blades = result.record.log.filter(row => row.actor === fang && row.move === 'moonlight_gu');
    assert.ok(blades.some(row => row.outcome === 'hit'));
    const target = blades.find(row => row.outcome === 'hit').target;
    assert.ok(readQuantity(result.world, target, 'vitality') < readQuantity(ready.world, target, 'vitality'));
    assert.equal(readQuantity(result.world, fang, essence), bladeCost * (4 - blades.length));
    assert.equal(readQuantity(result.world, 'pouch', petals), 2);
    const after = restoreEngineWorld(serializeEngineWorld({...restored, world: result.world}), config);
    assert.deepEqual(after.world, result.world);

    const missed = advanceEngineWorld(engine, moonlight.ration).engine;
    assert.equal(missed.world.holders[id].state[appetite].emptySince, moonlight.ration);
    const withoutMeal = fight(missed, id);
    assert.ok(withoutMeal.record.log.some(row => row.actor === fang && row.move === 'fist'));
    assert.equal(readQuantity(withoutMeal.world, fang, essence), bladeCost * 4);
    assert.equal(readQuantity(withoutMeal.world, 'pouch', petals), 4);

    const lowEssence = applyEngineOps(ready, [{op: 'set', holder: fang, quantity: essence, amount: bladeCost - 1}], 'fixture:low_essence');
    const withoutFuel = fight(lowEssence, id);
    assert.ok(withoutFuel.record.log.some(row => row.actor === fang && row.move === 'fist'));
    assert.equal(readQuantity(withoutFuel.world, fang, essence), bladeCost - 1);

    const separated = applyEngineOps(ready, [{op: 'property', holder: id, property: 'gu_keeper', value: 'clan'}], 'fixture:transferred');
    const withoutGu = fight(separated, id);
    assert.ok(withoutGu.record.log.some(row => row.actor === fang && row.move === 'fist'));
    assert.equal(readQuantity(withoutGu.world, fang, essence), bladeCost * 4);
});
