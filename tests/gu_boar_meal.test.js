import assert from 'node:assert/strict';
import test from 'node:test';
import {acquireCreature, openWildHabitat, restoreCreatureLifecycle, settleCohortStock} from '../src/creature_lifecycle.js';
import {advancePhasedWorldHerds} from '../src/creature_herd_world.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {MEADOW_BREEDING_GENOME} from '../src/living_genomes.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {readLineage} from '../src/world_substrate.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../src/world_quantities.js';
import {BOAR_MEAL_PROPERTY, BOAR_MEAT, BOAR_STRENGTH, CARRY_LOAD_PROPERTY, WHITE_BOAR_LAW, WHITE_BOAR_PRACTICE, WHITE_BOAR_PRACTICE_PACK,
    boarMealRemains, pushBoarLoad, whiteBoarFeed} from '../src/world_packs/gu_boar_meal.js';
import {applyEffect} from '../src/world_effects.js';

test('a wild boar meal enables paid White Boar practice after restore', () => {
    const place = 'foothill', origin = 'boars', fuel = 'energy:primeval.rank1.middle';
    const habitat = {id: place, capacity: 1, supportedSpecies: ['wild-boar']};
    const empty = restoreCreatureLifecycle();
    const herd = settleCohortStock(empty, {revision: empty.revision, id: origin, habitat, species: 'wild-boar', delta: 1});
    const boar = acquireCreature(herd, {revision: herd.revision, cohortId: origin, destination: habitat, keeper: null});
    const lifecycle = openWildHabitat(boar.state, {revision: boar.state.revision, id: place, clock: 0, interval: 2});
    const config = {packs: ['l.living_body', WHITE_BOAR_PRACTICE_PACK.id], ownPacks: [WHITE_BOAR_PRACTICE_PACK], shared: {
        quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.energy, BOAR_STRENGTH],
        properties: [WORLD_PROPERTIES.alive, BOAR_MEAL_PROPERTY, CARRY_LOAD_PROPERTY,
            ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))],
    }, host: {laws: [WHITE_BOAR_LAW]}};
    const engine = createEngineWorld({...config, links: [{id: 'track', kind: 'path', from: place, to: 'camp'}],
        holders: [{id: place, kind: 'place'}, {id: 'camp', kind: 'place'},
        {id: 'crate', kind: 'thing', place, properties: {[CARRY_LOAD_PROPERTY.id]: 6}},
        {id: origin, kind: 'cohort', place, count: 0, refs: {herd: origin}},
        {id: boar.id, kind: 'body', place, refs: {creature: boar.id}, quantities: {[BOAR_MEAT]: 1}},
        {id: 'keeper', kind: 'body', place, properties: {alive: true, 'boar-practice-tolerance': 2},
            quantities: {[fuel]: 2, [BOAR_STRENGTH.id]: 0, 'boar-practice-exertion': 0}},
        {id: 'white', kind: 'body', place, as: ['gu'], tags: ['living.body'], quantities: {satiety: 0},
            properties: {alive: true, gu_kind: 'white-boar', gu_keeper: 'keeper', gu_controller: 'keeper'},
            state: {'l.living_body': livingBodyState({species: 'white-boar', rate: 1})}},
    ]});
    const {ivs, ...linked} = MEADOW_BREEDING_GENOME;
    const loss = advancePhasedWorldHerds({engine, lifecycle}, {revision: lifecycle.revision, clock: 2,
        habitat: {...habitat, capacity: 0}, populations: [{id: origin, births: 0, losses: 1,
            genome: {...linked, id: 'test.wild-boar'}, pedigree: {gestationMinutes: 1, growthMinutes: 1, maxKinship: 1},
            world: {birthRow: 'boar.birth', lossRow: 'boar.loss', remainsFor: boarMealRemains}}]});
    const remains = `${boar.id}.remains`;
    assert.deepEqual(readLineage(loss.engine.world, remains)[0].parents, [boar.id]);
    const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
    const advance = (engine, clock) => advanceEngineWorld(engine, clock).engine;
    const start = (engine, id, method, extra = {}) => startEngineWorking(engine, {id, law: WHITE_BOAR_LAW, method,
        bindings: {keeper: {kind: 'body', id: 'keeper'}, gu: {kind: 'gu', id: 'white'}, ...extra}});
    const meal = whiteBoarFeed({meal: 8, freshFor: 4});
    const feed = (engine, id = 'feed') => start(engine, id, meal, {carcass: {kind: 'thing', id: remains}});
    const practice = engine => start(engine, 'practice', WHITE_BOAR_PRACTICE);
    const hungry = advance(restore(practice(loss.engine)), 3);
    assert.equal(hungry.records.workings.practice.record.status, 'interrupted');
    assert.equal(hungry.world.holders.keeper.quantities[fuel], 2);
    assert.equal(hungry.world.holders.keeper.quantities[BOAR_STRENGTH.id], 0);
    const stale = advance(restore(feed(advance(loss.engine, 5))), 6);
    assert.equal(stale.records.workings.feed.record.status, 'interrupted');
    assert.equal(stale.world.holders[remains].quantities[BOAR_MEAT], 1);
    assert.equal(stale.world.holders.white.quantities.satiety, 0);
    const pending = feed(restore(loss.engine));
    const fed = advance(restore(pending), 3);
    assert.equal(fed.world.holders[remains].quantities[BOAR_MEAT], 0);
    assert.equal(fed.world.holders.white.quantities.satiety, 8);
    assert.equal(advance(restore(feed(fed, 'again')), 4).records.workings.again.record.status, 'interrupted');
    const trained = advance(restore(practice(fed)), 4);
    assert.deepEqual(serializeEngineWorld(trained), serializeEngineWorld(advance(practice(advance(pending, 3)), 4)));
    assert.equal(trained.world.holders.keeper.quantities[fuel], 1);
    assert.equal(trained.world.holders.keeper.quantities[BOAR_STRENGTH.id], 1);
    const nextPulse = (engine, id) => start(engine, id, WHITE_BOAR_PRACTICE);
    const concurrent = advance(restore(nextPulse(practice(fed), 'second-pulse')), 4);
    assert.equal(concurrent.records.workings['second-pulse'].record.status, 'interrupted');
    assert.equal(concurrent.world.holders.keeper.quantities[fuel], 1);
    const painful = advance(restore(nextPulse(trained, 'too-soon')), 5);
    assert.equal(painful.records.workings['too-soon'].record.receipts[0].reason, 'Your muscles still hurt. Rest before practicing again.');
    assert.equal(painful.world.holders.keeper.quantities[fuel], 1);
    assert.equal(painful.world.holders.keeper.quantities[BOAR_STRENGTH.id], 1);
    const resumed = nextPulse(restore(painful), 'after-rest');
    const recovered = advance(restore(resumed), 6);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(resumed, 6)));
    assert.equal(recovered.world.holders.keeper.quantities[fuel], 0);
    assert.equal(recovered.world.holders.keeper.quantities[BOAR_STRENGTH.id], 2);
    const withoutGu = applyEngineOps(trained, [{op: 'lifecycle', act: 'end', holder: 'white'}], 'gu-loss');
    assert.equal(restore(withoutGu).world.holders.keeper.quantities[BOAR_STRENGTH.id], 1);
    const push = engine => pushBoarLoad(engine, {keeper: 'keeper', load: 'crate', link: 'track', baseCapacity: 5});
    assert.equal(push(restore(advance(hungry, 4))).reason, 'load-too-heavy');
    const warded = applyEffect(withoutGu.rules, withoutGu.world, {verb: 'block', params: {verb: 'move', object: 'position'},
        target: {shape: 'holder', id: 'crate'}, field: 'tether'}, 'test-tether');
    assert.equal(push(restore({...withoutGu, world: warded.world})).reason, 'load-blocked');
    const moved = push(restore(withoutGu));
    assert.equal(moved.ok, true);
    assert.equal(restore(moved.engine).world.holders.crate.place, 'camp');
    assert.equal(moved.engine.world.holders.keeper.quantities[BOAR_STRENGTH.id], 1);
});
