// Foundation L phase 2: one lifecycle that a pet, livestock, a wild cohort, a Gu and a
// person all read, through one kind catalogue, one body read, one substrate pack and
// one kernel care working. Numbers are test fixtures, not world values.
import assert from 'node:assert/strict';
import test from 'node:test';

import {acquireCreature, practiceWithCreature, restoreCreatureLifecycle, setCreatureOrgan, settleCohortStock,
    advanceWildHabitat, openWildHabitat, startCreatureBrood, settleCreatureBirth, startCreatureCare} from '../src/creature_lifecycle.js';
import {LIVING_KIND_ROWS, guLivingRows, habitatFromKinds, livingKind, livingKindRegistry} from '../src/living_kinds.js';
import {apertureOrgan, applyBodyHarm, livingBodyFacts, readLivingBody} from '../src/living_body.js';
import {LIVING_CARE_LAW, careRoutine} from '../src/living_workings.js';
import {createLivingBodyPack, livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {beginWorking, quoteWorking, serializeWorking, restoreWorking, settleWorking} from '../src/kernel_working.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, readQuantity, restoreWorld, serializeWorld} from '../src/world_substrate.js';
import {guCatalogue} from '../src/gu_catalogue.js';

const registry = livingKindRegistry({extra: guLivingRows(guCatalogue)});
const pen = {id: 'pen', capacity: 4, supportedSpecies: ['sheep']};
const home = {id: 'home', capacity: 4, supportedSpecies: ['house_cat', 'human']};
const cellar = {id: 'cellar', capacity: 4, supportedSpecies: ['liquor-worm']};
const copse = habitatFromKinds(registry, {id: 'copse', capacity: 10, species: ['rabbit', 'fox'], perPredator: {fox: 2}});

function add(state, cohort, species, habitat, keeper, clock, extra = {}) {
    const stocked = settleCohortStock(state, {revision: state.revision, id: cohort, species, habitat, delta: 1});
    return acquireCreature(stocked, {revision: stocked.revision, cohortId: cohort, destination: habitat, keeper, clock, ...extra});
}

// One store for every consumer: the done check's shape (one lifecycle, not one per host).
function village() {
    let s = restoreCreatureLifecycle();
    const ewe = add(s, 'supplier.sheep', 'sheep', pen, 'player', 0, {traits: {coat: 'cream'}}); s = ewe.state;
    const ram = add(s, 'supplier.ram', 'sheep', pen, 'player', 0, {traits: {coat: 'brown'}}); s = ram.state;
    const cat = add(s, 'doorstep', 'house_cat', home, 'player', 0, {growthMinutes: 0}); s = cat.state;
    const worm = add(s, 'wild.worm', 'liquor-worm', cellar, 'player', 0); s = worm.state;
    const me = add(s, 'birth.village', 'human', home, 'player', 0, {ageMinutes: 0, growthMinutes: 0}); s = me.state;
    s = settleCohortStock(s, {revision: s.revision, id: 'rabbit', species: 'rabbit', habitat: copse, delta: 6});
    s = settleCohortStock(s, {revision: s.revision, id: 'fox', species: 'fox', habitat: copse, delta: 2});
    return {s, ewe: ewe.id, ram: ram.id, cat: cat.id, worm: worm.id, me: me.id};
}

test('every species a host names has one kind row, and Gu rows come from G’s catalogue', () => {
    const named = ['sheep', 'house_cat', 'rabbit', 'fox', 'reed-terrapin', 'reed-construct', 'lightning-wolf', 'ridge-hare',
        'insight-moth', 'army-ant-queen', 'army-ant-worker', 'army-ant-soldier', 'ordinary-starlight-firefly',
        'starlight-firefly', 'liquor-worm', 'moonlight', 'cloudseed-beetle', 'human', 'fluxweed'];
    for (const id of named) assert.ok(livingKind(registry, id), id);
    assert.equal(Object.keys(guCatalogue).length, guLivingRows(guCatalogue).length);
    assert.deepEqual(livingKind(registry, 'starlight-firefly').living, ['emergent']);
    assert.ok(livingKind(registry, 'starlight-firefly').reproduction.includes('emergence'));
    assert.equal(livingKind(registry, 'thunderclap').class, 'gu');
    assert.throws(() => livingKindRegistry({extra: [LIVING_KIND_ROWS[0]]}), /defined twice/);
    // L's insight-moth placeholder gives way when G's catalogue supplies the kind.
    const withMoth = livingKindRegistry({extra: guLivingRows({...guCatalogue,
        'insight-moth': {parts: {chapters: [1], value: {roles: ['loaned'], rank: [1]}}}})});
    assert.equal(livingKind(withMoth, 'insight-moth').placeholder, undefined);
    assert.equal(livingKind(registry, 'insight-moth').placeholder, true);
    assert.deepEqual(copse.preyRequirements, {fox: {species: 'rabbit', perPredator: 2}});
});

test('pet, livestock, wild cohort, Gu and person read one lifecycle through one body read', () => {
    const {s, ewe, cat, worm, me} = village();
    const sheep = readLivingBody({lifecycle: s, registry, id: ewe, clock: 30, sinceMeal: 8});
    assert.equal(sheep.class, 'animal');
    assert.equal(sheep.hunger.stage, 'peckish');
    const pet = readLivingBody({lifecycle: s, registry, id: cat, clock: 30});
    assert.equal(pet.hunger.selfFed, true);
    const gu = readLivingBody({lifecycle: s, registry, id: worm, clock: 30, sinceMeal: 0, feeding: {fedThrough: 3, day: 4}});
    assert.deepEqual([gu.class, gu.gu.fed, gu.conditions.includes('unfed')], ['gu', false, true]);
    const person = readLivingBody({lifecycle: s, registry, id: me, clock: 30, sinceMeal: 0});
    assert.equal(person.class, 'person');
    assert.equal(person.hunger.stage, 'unknown', 'needs.js human has no ration length yet (request in checkpoint)');
    assert.equal(readLivingBody({lifecycle: s, registry, id: me, clock: 30, sinceMeal: 0, ration: 360}).hunger.stage, 'fed');
    // Wild cohort: the same store settles the copse windows with prey read from kind rows.
    const opened = openWildHabitat(s, {revision: s.revision, id: 'copse', clock: 0, interval: 10});
    const wild = advanceWildHabitat(opened, {revision: opened.revision, habitat: copse, clock: 30,
        populations: [{id: 'rabbit', births: 1, losses: 0}, {id: 'fox', births: 1, losses: 1}]});
    assert.equal(wild.windows, 3);
    assert.ok(wild.state.cohorts.fox.stock <= Math.floor(wild.state.cohorts.rabbit.stock / 2));
    // Every individual sits in one store with one identity counter.
    assert.equal(new Set(Object.values(s.individuals).map(i => i.serial)).size, Object.keys(s.individuals).length);
});

test('inheritance, development, learned behavior and condition change independently', () => {
    let {s, ewe, ram} = village();
    const brood = startCreatureBrood(s, {revision: s.revision, parents: [ewe, ram], keeper: 'player', clock: 5,
        gestationMinutes: 10, growthMinutes: 20, root: 7});
    s = practiceWithCreature(brood.state, {revision: brood.state.revision, id: ewe, actor: 'player', clock: 6,
        minimumGap: 1, bondGain: 10, skill: 'come'});
    s = applyBodyHarm(s, {id: ewe, clock: 7, hit: {kind: 'cut', amount: 3}});
    const born = settleCreatureBirth(s, {revision: s.revision, broodId: brood.id, clock: 15, destination: pen});
    s = born.state;
    const mother = readLivingBody({lifecycle: s, registry, id: ewe, clock: 15, sinceMeal: 0});
    const lamb = readLivingBody({lifecycle: s, registry, id: born.id, clock: 15, sinceMeal: 0});
    assert.equal(mother.injury.remaining, 6, 'the wound is the mother’s');
    assert.deepEqual(mother.learned.player.skills, {come: 1});
    assert.deepEqual(lamb.learned, {}, 'no lesson is copied into the newborn');
    assert.equal(lamb.injury, null);
    assert.equal(lamb.stage, 'juvenile');
    assert.ok(['cream', 'brown'].includes(lamb.traits.coat));
    assert.equal(readLivingBody({lifecycle: s, registry, id: born.id, clock: 35, sinceMeal: 0}).stage, 'adult');
    // A second hurt worsens the open wound instead of being refused.
    const worse = applyBodyHarm(s, {id: ewe, clock: 16, hit: {kind: 'bite', amount: 2}});
    const read = readLivingBody({lifecycle: worse, registry, id: ewe, clock: 16, sinceMeal: 0});
    assert.deepEqual([read.injury.kind, read.injury.remaining, read.injury.required], ['cut', 10, 10]);
    assert.equal(read.vitality.value, 50);
    assert.equal(livingBodyFacts(read)['self.injured'], true);
});

test('the aperture is a body organ whose capacity a world law sets', () => {
    let {s, me} = village();
    s = setCreatureOrgan(s, {revision: s.revision, id: me, organ: 'aperture', value: {grade: 'C', rank: 1}});
    // Fixture law shaped like a Gu world pack row; the real numbers belong to chat G's pack.
    const law = {rankCapacity: {1: 100, 2: 200}, grades: {A: {seaPercent: 90}, C: {seaPercent: 50}}, conditions: {cracked: 50}};
    const read = readLivingBody({lifecycle: s, registry, id: me, clock: 1, sinceMeal: 0, organLaws: {aperture: law}});
    assert.deepEqual(read.organs.aperture, {grade: 'C', rank: 1, condition: 'intact', seaPercent: 50, capacity: 50});
    assert.equal(livingBodyFacts(read)['self.aperture.capacity'], 50);
    assert.equal(apertureOrgan({grade: 'A', rank: 2, condition: 'cracked'}, law).capacity, 90);
    assert.throws(() => apertureOrgan({grade: 'D', rank: 1}, law), /no aperture rule/);
    const restored = restoreCreatureLifecycle(JSON.parse(JSON.stringify(s)));
    assert.deepEqual(restored.individuals[me].organs.aperture, {grade: 'C', rank: 1});
});

test('substrate: bodies of different kinds drain satiety at their own rate; one jump equals many steps and a reload', () => {
    const rules = composeSubstrate({packs: [createLivingBodyPack()]});
    const body = (id, species, rate, satiety) => ({id, kind: 'body', place: 'farm', tags: ['living.body'],
        quantities: {satiety}, state: {'l.living_body': livingBodyState({species, rate})}});
    const world = createWorld(rules, {holders: [{id: 'farm', kind: 'place'}, body('ewe', 'sheep', 1, 12),
        body('worm', 'liquor-worm', 2, 10), body('courier', 'reed-construct', 0, 0)]});
    const jump = advanceWorld(rules, world, 20).world;
    let steps = world;
    for (let t = 1; t <= 20; t++) steps = advanceWorld(rules, restoreWorld(rules, serializeWorld(steps)), t).world;
    for (const w of [jump, steps]) {
        assert.equal(readQuantity(w, 'ewe', 'satiety'), 0);
        assert.equal(readQuantity(w, 'worm', 'satiety'), 0);
        assert.equal(w.holders.courier.state['l.living_body'].hungry, false, 'a construct never hungers');
    }
    const hungry = j => j.chain.filter(e => e.kind === 'living.hungry').map(e => [e.at, e.by]);
    assert.deepEqual(hungry(jump), [[5, 'worm'], [12, 'ewe']]);
    assert.deepEqual(hungry(steps), hungry(jump));
    // Satiety is the hunger authority on the substrate: the body read from it matches
    // the read from minutes since the meal, before and after the body runs empty.
    const {s: life, ewe: eweId} = village();
    for (const [w, t] of [[advanceWorld(rules, world, 8).world, 8], [jump, 20]]) {
        const pack = w.holders.ewe.state['l.living_body'];
        const fromSatiety = readLivingBody({lifecycle: life, registry, id: eweId, clock: t,
            satiety: {amount: readQuantity(w, 'ewe', 'satiety'), emptySince: pack.emptySince}});
        const fromMinutes = readLivingBody({lifecycle: life, registry, id: eweId, clock: t, sinceMeal: t});
        assert.deepEqual(fromSatiety.hunger, fromMinutes.hunger, `minute ${t}`);
    }
    // A hit published into the place lands in the target's inbox only.
    const hit = applyWorldOps(rules, jump, [{op: 'publish', kind: 'living.harm', place: 'farm',
        detail: {target: 'ewe', kind: 'bite', amount: 2}}], 'c.contest:test');
    assert.equal(hit.holders.ewe.state['l.living_body'].inbox.length, 1);
    assert.equal(hit.holders.worm.state['l.living_body'].inbox.length, 0);
});

test('kernel: a care routine reads the body at each step and its quote equals settlement', () => {
    const {s, ewe} = village();
    let lifecycle = applyBodyHarm(s, {id: ewe, clock: 0, hit: {kind: 'cut', amount: 3}});
    const read = keeperOf => (ref, at) => {
        if (ref.kind === 'actor') return {kind: 'actor', id: ref.id};
        if (ref.kind === 'food') return {kind: 'food', id: ref.id, count: 2, minutes: 12};
        const body = readLivingBody({lifecycle, registry, id: ref.id, clock: at, sinceMeal: 0});
        return {...body, kind: 'living', keeper: keeperOf(at) ?? body.keeper};
    };
    const bindings = {keeper: {kind: 'actor', id: 'player'}, body: {kind: 'living', id: ewe}, ration: {kind: 'food', id: 'hay'}};
    const method = careRoutine({duration: 6});
    const ports = {read: read(() => null)};
    const quote = quoteWorking(LIVING_CARE_LAW, method, {id: 'care.1', bindings, at: 10, ports});
    assert.equal(quote.ok, true);
    let record = beginWorking(LIVING_CARE_LAW, method, {id: 'care.1', bindings, at: 10});
    const first = settleWorking(LIVING_CARE_LAW, record, {now: 11, ports});
    record = restoreWorking(LIVING_CARE_LAW, serializeWorking(first.record));
    const done = settleWorking(LIVING_CARE_LAW, record, {now: 30, ports});
    const effects = [...first.effects, ...done.effects];
    assert.deepEqual(effects.map(e => e.effect), quote.effects);
    // The ewe changes keeper before tending: the feed step stands, tending is refused.
    const moved = settleWorking(LIVING_CARE_LAW, beginWorking(LIVING_CARE_LAW, method, {id: 'care.2', bindings, at: 10}),
        {now: 30, ports: {read: read(at => at >= 12 ? 'shepherd' : null)}});
    assert.deepEqual([moved.record.status, moved.record.receipts.map(r => r.ok)], ['interrupted', [true, false]]);
    assert.deepEqual(moved.record.receipts[1].observed, {refused: true});
    const care = effects.find(e => e.effect.kind === 'living.care');
    lifecycle = startCreatureCare(lifecycle, {revision: lifecycle.revision, id: ewe, clock: care.at, keeper: 'player',
        duration: care.effect.duration});
    assert.equal(readLivingBody({lifecycle, registry, id: ewe, clock: care.at + 6, sinceMeal: 0}).injury, null);
});

test('every L kind reads through one body read (cited by docs/coverage/creatures.jsonl)', () => {
    const rows = LIVING_KIND_ROWS;
    const anywhere = {id: 'anywhere', capacity: rows.length, supportedSpecies: rows.map(k => k.id)};
    let s = restoreCreatureLifecycle();
    const ids = {};
    for (const kind of rows) {
        const made = add(s, `source.${kind.id}`, kind.id, anywhere, 'player', 0, {growthMinutes: 5});
        s = made.state; ids[kind.id] = made.id;
    }
    for (const kind of rows) {
        const young = readLivingBody({lifecycle: s, registry, id: ids[kind.id], clock: 1, sinceMeal: 0, ration: 60});
        const grown = readLivingBody({lifecycle: s, registry, id: ids[kind.id], clock: 10, sinceMeal: 0, ration: 60});
        assert.equal(young.class, kind.class, kind.id);
        assert.equal(young.stage, kind.stages[0], kind.id);
        assert.ok(kind.stages.includes(grown.stage) && grown.mature, kind.id);
        if (kind.needs === null) assert.equal(grown.hunger.stage, 'habitat', kind.id);
    }
    assert.equal(Object.keys(s.individuals).length, rows.length, 'one store holds every kind');
});
