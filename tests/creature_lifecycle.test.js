import assert from 'node:assert/strict';
import test from 'node:test';

import {
    acquireCreature, advanceWildHabitat, creatureDevelopment, creatureHealth, habitatOccupancy, injureCreature,
    openWildHabitat, practiceWithCreature, restoreCreatureLifecycle, settleCreatureCare, startCreatureCare,
    settleCohortStock, settleCreatureBirth, startCreatureBrood, transferCreature,
} from '../src/creature_lifecycle.js';

const habitat = (id, capacity, ...supportedSpecies) => ({id, capacity, supportedSpecies});
const stock = (state, id, species, site, delta) =>
    settleCohortStock(state, {revision: state.revision, id, species, habitat: site, delta});

test('adoption and release preserve the same cat across keepers and save restoration', () => {
    const lane = habitat('lane', 1, 'cat');
    const hearth = habitat('hearth', 1, 'cat');
    const initial = stock(restoreCreatureLifecycle(), 'lane.cats', 'cat', lane, 1);
    const adoption = acquireCreature(initial, {revision: initial.revision, cohortId: 'lane.cats',
        destination: hearth, keeper: 'first'});
    const {id} = adoption;
    const loaded = restoreCreatureLifecycle(JSON.parse(JSON.stringify(adoption.state)));
    const released = transferCreature(loaded, {revision: loaded.revision, id,
        fromKeeper: 'first', toKeeper: null, destination: lane});
    const takenIn = transferCreature(released, {revision: released.revision, id,
        fromKeeper: null, toKeeper: 'second', destination: hearth});

    assert.equal(habitatOccupancy(released, lane.id), 1);
    assert.equal(released.cohorts['lane.cats'].stock, 0);
    assert.deepEqual(takenIn.individuals[id], {...adoption.state.individuals[id], keeper: 'second'});
    assert.throws(() => transferCreature(takenIn, {revision: takenIn.revision, id,
        fromKeeper: 'first', toKeeper: null, destination: lane}), /custody has changed/);
});

test('finite pasture stock and named sheep compete for the same capacity', () => {
    const pasture = habitat('pasture', 2, 'sheep');
    const pen = habitat('pen', 1, 'sheep');
    const initial = stock(restoreCreatureLifecycle(), 'pasture.sheep', 'sheep', pasture, 2);
    const quote = {revision: initial.revision, cohortId: 'pasture.sheep', destination: pen, keeper: 'player'};
    const purchase = acquireCreature(initial, quote);

    assert.equal(habitatOccupancy(purchase.state, pasture.id), 1);
    assert.equal(habitatOccupancy(purchase.state, pen.id), 1);
    assert.equal(initial.cohorts['pasture.sheep'].stock, 2);
    assert.throws(() => acquireCreature(purchase.state, quote), /state changed/);
    assert.throws(() => acquireCreature(purchase.state, {...quote, revision: purchase.state.revision}),
        /insufficient space/);

    const promotedOnSite = acquireCreature(purchase.state, {...quote, destination: pasture,
        revision: purchase.state.revision});
    assert.equal(habitatOccupancy(promotedOnSite.state, pasture.id), 1);
    assert.notEqual(promotedOnSite.id, purchase.id);
    assert.throws(() => acquireCreature(promotedOnSite.state, {...quote, revision: promotedOnSite.state.revision}),
        /No creature is available/);
});

test('local predator stock needs actual prey and shares capacity with it', () => {
    const marsh = {...habitat('marsh', 4, 'rabbit', 'fox'),
        preyRequirements: {fox: {species: 'rabbit', perPredator: 3}}};
    const initial = restoreCreatureLifecycle();

    assert.throws(() => stock(initial, 'marsh.foxes', 'fox', marsh, 1), /insufficient prey/);
    const rabbits = stock(initial, 'marsh.rabbits', 'rabbit', marsh, 3);
    const populated = stock(rabbits, 'marsh.foxes', 'fox', marsh, 1);
    assert.equal(habitatOccupancy(populated, marsh.id), 4);
    assert.throws(() => stock(populated, 'marsh.rabbits', 'rabbit', marsh, 1), /insufficient space/);
    assert.throws(() => stock(populated, 'marsh.rabbits', 'rabbit', marsh, -4), /Insufficient cohort stock/);

    const depleted = stock(populated, 'marsh.rabbits', 'rabbit', marsh, -3);
    const loaded = restoreCreatureLifecycle(JSON.parse(JSON.stringify(depleted)));
    assert.equal(habitatOccupancy(loaded, marsh.id, 'fox'), 1);
    assert.throws(() => stock(loaded, 'marsh.foxes', 'fox', marsh, 1), /insufficient prey/);
});

test('a cat keeps learned responses with their actor through transfer', () => {
    const yard = habitat('yard', 1, 'cat');
    const initial = stock(restoreCreatureLifecycle(), 'yard.cats', 'cat', yard, 1);
    const cat = acquireCreature(initial, {revision: initial.revision, cohortId: 'yard.cats',
        destination: yard, keeper: 'first', traits: {coat: 'brindled'}});
    const session = {id: cat.id, actor: 'first', clock: 5, minimumGap: 5, bondGain: 10, skill: 'recall'};
    const familiar = practiceWithCreature(cat.state, {...session, revision: cat.state.revision});
    assert.throws(() => practiceWithCreature(familiar, {...session, revision: familiar.revision}), /between sessions/);
    const moved = transferCreature(familiar, {revision: familiar.revision, id: cat.id,
        fromKeeper: 'first', toKeeper: 'second', destination: yard});
    const loaded = restoreCreatureLifecycle(JSON.parse(JSON.stringify(moved)));
    assert.equal(loaded.individuals[cat.id].experience.second, undefined);
    assert.throws(() => practiceWithCreature(loaded, {...session, clock: 10, revision: loaded.revision}),
        /another keeper/);
    const introduced = practiceWithCreature(loaded, {...session, actor: 'second', clock: 10,
        revision: loaded.revision, skill: null});
    assert.deepEqual(introduced.individuals[cat.id].experience, {
        first: {lastAt: 5, bond: 10, training: {recall: 1}},
        second: {lastAt: 10, bond: 10, training: {}},
    });
    assert.deepEqual(introduced.individuals[cat.id].traits, {coat: 'brindled'});
});

test('a pending sheep birth survives reload and capacity failure, then yields an untrained juvenile', () => {
    const field = habitat('field', 2, 'sheep');
    const initial = stock(restoreCreatureLifecycle(), 'field.sheep', 'sheep', field, 2);
    const acquire = (state, traits) => acquireCreature(state, {revision: state.revision, cohortId: 'field.sheep',
        destination: field, keeper: 'player', traits, growthMinutes: 3});
    const ewe = acquire(initial, {coat: 'dark', fleece: 'fine'});
    const ram = acquire(ewe.state, {coat: 'light'});
    const practiced = practiceWithCreature(ram.state, {revision: ram.state.revision, id: ewe.id, actor: 'player',
        clock: 3, minimumGap: 1, bondGain: 10, skill: 'lead'});
    const request = {revision: practiced.revision, parents: [ewe.id, ram.id], keeper: 'player',
        clock: 3, gestationMinutes: 4, growthMinutes: 5, root: 'fixture'};
    assert.throws(() => startCreatureBrood(practiced, {...request, clock: 2}), /adult stock/);
    const brood = startCreatureBrood(practiced, request);
    assert.deepEqual(startCreatureBrood(practiced, request), brood);
    assert.throws(() => startCreatureBrood(brood.state, {...request, revision: brood.state.revision}),
        /pending brood/);
    const loaded = restoreCreatureLifecycle(JSON.parse(JSON.stringify(brood.state)));
    const birth = {revision: loaded.revision, broodId: brood.id, clock: 7, destination: field};
    assert.throws(() => settleCreatureBirth(loaded, {...birth, clock: 6}), /No creature birth is due/);
    assert.throws(() => settleCreatureBirth(loaded, birth), /insufficient space/);

    const lamb = settleCreatureBirth(loaded, {...birth, destination: {...field, capacity: 3}});
    const animal = lamb.state.individuals[lamb.id];
    assert.deepEqual(animal.traits, loaded.broods[brood.id].traits);
    assert.ok(['dark', 'light'].includes(animal.traits.coat));
    assert.equal(animal.traits.fleece, 'fine');
    assert.deepEqual(animal.experience, {});
    assert.deepEqual(creatureDevelopment(lamb.state, lamb.id, 11), {ageMinutes: 4, mature: false});
    assert.deepEqual(creatureDevelopment(lamb.state, lamb.id, 12), {ageMinutes: 5, mature: true});
    assert.throws(() => settleCreatureBirth(lamb.state, {...birth, revision: lamb.state.revision}),
        /No creature birth is due/);
});

test('finite sheep care settles identically across time partitions and JSON restore', () => {
    const pen = habitat('pen', 1, 'sheep');
    const initial = stock(restoreCreatureLifecycle(), 'pen.sheep', 'sheep', pen, 1);
    const {id, state} = acquireCreature(initial, {revision: initial.revision, cohortId: 'pen.sheep',
        destination: pen, keeper: 'player'});
    const hurt = injureCreature(state, {revision: state.revision, id, clock: 2,
        kind: 'cut', recoveryMinutes: 8});
    const care = startCreatureCare(hurt, {revision: hurt.revision, id, clock: 3,
        keeper: 'player', duration: 5});
    const settled = settleCreatureCare(care, {revision: care.revision, id, clock: 6});
    const restored = restoreCreatureLifecycle(JSON.parse(JSON.stringify(settled)));
    const outcome = creatureHealth(restored, id, 20);
    assert.deepEqual(outcome, creatureHealth(care, id, 20));
    assert.equal(outcome.injury.remaining, 3);
    assert.equal(outcome.careUntil, null);
    assert.throws(() => startCreatureCare(restored, {revision: restored.revision, id, clock: 7,
        keeper: 'player', duration: 5}), /already has active care/);

    const renewed = startCreatureCare(restored, {revision: restored.revision, id, clock: 20,
        keeper: 'player', duration: 6});
    assert.equal(creatureHealth(renewed, id, 30).injury.healedAt, 23);
    const mid = settleCreatureCare(renewed, {revision: renewed.revision, id, clock: 22});
    assert.deepEqual(creatureHealth(mid, id, 30), creatureHealth(renewed, id, 30));
});

test('moving a cat interrupts recovery without discarding earlier treatment', () => {
    const yard = habitat('yard', 1, 'cat');
    const clinic = habitat('clinic', 1, 'cat');
    const initial = stock(restoreCreatureLifecycle(), 'yard.cats', 'cat', yard, 1);
    const {id, state} = acquireCreature(initial, {revision: initial.revision, cohortId: 'yard.cats',
        destination: yard, keeper: 'first'});
    const hurt = injureCreature(state, {revision: state.revision, id, clock: 0,
        kind: 'sprain', recoveryMinutes: 9});
    const care = startCreatureCare(hurt, {revision: hurt.revision, id, clock: 0,
        keeper: 'first', duration: 10});
    const move = {revision: care.revision, id, fromKeeper: 'first', toKeeper: 'second', destination: clinic};
    assert.throws(() => transferCreature(care, move), /settle active care/);
    const moved = transferCreature(care, {...move, clock: 4});
    assert.equal(creatureHealth(moved, id, 12).injury.remaining, 5);
    assert.throws(() => startCreatureCare(moved, {revision: moved.revision, id, clock: 12,
        keeper: 'first', duration: 10}), /current keeper/);
    const nextCare = startCreatureCare(moved, {revision: moved.revision, id, clock: 12,
        keeper: 'second', duration: 10});
    const interrupted = settleCreatureCare(nextCare, {revision: nextCare.revision, id, clock: 14, interrupted: true});
    assert.equal(creatureHealth(interrupted, id, 25).injury.remaining, 3);
    assert.throws(() => creatureHealth(interrupted, id, 13), /cannot run backward/);
});

test('wild loss and regrowth use the same due windows across partition and reload', () => {
    const marsh = {...habitat('marsh', 10, 'rabbit', 'fox'),
        preyRequirements: {fox: {species: 'rabbit', perPredator: 3}}};
    let state = stock(restoreCreatureLifecycle(), 'rabbit', 'rabbit', marsh, 6);
    state = stock(state, 'fox', 'fox', marsh, 2);
    state = openWildHabitat(state, {revision: state.revision, id: marsh.id, clock: 0, interval: 10});
    state = stock(state, 'rabbit', 'rabbit', marsh, -5);
    const populations = [{id: 'rabbit', births: 2, losses: 1}, {id: 'fox', births: 1, losses: 1}];
    const advance = (input, clock) =>
        advanceWildHabitat(input, {revision: input.revision, habitat: marsh, clock, populations});
    assert.equal(advance(state, 9).state, state);
    const first = advance(state, 10).state;
    assert.equal(first.cohorts.fox.stock, 1);
    assert.equal(first.cohorts.rabbit.stock, 3);
    assert.equal(first.habitats.marsh.losses, 1);
    const loaded = restoreCreatureLifecycle(JSON.parse(JSON.stringify(first)));
    const whole = advance(state, 35);
    const split = advance(advance(loaded, 21).state, 35);
    assert.deepEqual(split.state, whole.state);
    assert.equal(whole.state.cohorts.fox.stock, 1);
    assert.equal(whole.state.cohorts.rabbit.stock, 7);
    assert.deepEqual(whole.state.habitats.marsh, {interval: 10, nextAt: 40, births: 6, losses: 1});
    assert.equal(advance(whole.state, 35).windows, 0);
    assert.throws(() => advanceWildHabitat(whole.state, {revision: state.revision, habitat: marsh, clock: 35,
        populations}), /state changed/);
});

test('wild catch-up exposes its remainder and never recreates extinct stock', () => {
    const clearing = habitat('clearing', 5, 'rabbit');
    const withRabbits = stock(restoreCreatureLifecycle(), 'rabbit', 'rabbit', clearing, 1);
    const empty = stock(withRabbits, 'rabbit', 'rabbit', clearing, -1);
    const state = openWildHabitat(empty, {revision: empty.revision, id: clearing.id, clock: 0, interval: 1});
    const advance = input => advanceWildHabitat(input, {revision: input.revision, habitat: clearing,
        clock: 70, populations: [{id: 'rabbit', births: 1, losses: 1}]});
    const bounded = advance(state);
    assert.equal(bounded.pending, true);
    assert.equal(bounded.settledThrough, 64);
    const finished = advance(restoreCreatureLifecycle(bounded.state));
    assert.equal(finished.pending, false);
    assert.equal(finished.settledThrough, 70);
    assert.equal(finished.state.cohorts.rabbit.stock, 0);
    assert.equal(finished.state.habitats.clearing.births, 0);
});

test('a named survivor can seed wild regrowth after the cohort stock reaches zero', () => {
    const clearing = habitat('clearing', 3, 'rabbit');
    const initial = stock(restoreCreatureLifecycle(), 'rabbit', 'rabbit', clearing, 1);
    const survivor = acquireCreature(initial, {revision: initial.revision, cohortId: 'rabbit', destination: clearing,
        keeper: null, clock: 0});
    const state = openWildHabitat(survivor.state, {revision: survivor.state.revision, id: clearing.id, clock: 0, interval: 10});
    assert.equal(state.cohorts.rabbit.stock, 0);
    const {state: later} = advanceWildHabitat(state, {revision: state.revision, habitat: clearing, clock: 10,
        populations: [{id: 'rabbit', births: 1, losses: 1}]});
    assert.equal(later.cohorts.rabbit.stock, 1);
    assert.equal(later.individuals[survivor.id],state.individuals[survivor.id]);
});
