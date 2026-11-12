import assert from 'node:assert/strict';
import test from 'node:test';

import {brewBalance} from '../src/brew_law.js';
import {brewDraughtOfLivingDeath} from '../src/world_packs/hp_brew_pack.js';
import {applyDose, createDoseState, defineDoseRules, validateDoseState} from '../src/craft_dose_rules.js';
import {acquireCreature, restoreCreatureLifecycle, settleCohortStock, settleCreatureCare, startCreatureCare} from '../src/creature_lifecycle.js';
import {applyBodyHarm, readLivingBody} from '../src/living_body.js';
import {livingKindRegistry} from '../src/living_kinds.js';
import {beginWorking, defineWorkingLaw, interruptWorking, restoreWorking, serializeWorking, settleWorking} from '../src/kernel_working.js';
import {advanceWorld, applyWorldOps, composeSubstrate, createWorld, readProvenance, readQuantity, restoreWorld, serializeWorld, substratePort} from '../src/world_substrate.js';
import {createLivingBodyPack, livingBodyState} from '../src/world_substrate_packs/living_body.js';

const room = {id: 'infirmary', capacity: 2, supportedSpecies: ['human']};
const registry = livingKindRegistry();
const keeper = 'attendant';
const ration = 360;
const flask = 'draught.flask';
const delivery = 'draught.oral';
const bodyPack = 'l.living_body';
const measure = part => `draught:${part.replace(':', '.')}`;
const worldRules = composeSubstrate({
    packs: [createLivingBodyPack()],
    quantities: [{id: 'draught', keyed: true, unit: 'brew-unit', min: 0, max: 1000}],
    properties: [{id: 'custodian', type: 'label'}],
});

// Authored HP fixture only. The settled fraction carries the soporific activity.
// A meal slows uptake (half the settled units); the rest of the swallowed
// fraction passes without acting. Supervised rest clears the resulting stress
// through L's recovery clock. These numbers are game dials.
const oralAbsorption = {fed: 500, peckish: 500, hungry: 1000, starved: 1000};
const doseRules = defineDoseRules({id: delivery, revision: 1, tolerance: [{
    effect: 'soporific', perDose: 100, decayPerDay: 100, overdoseAt: 800,
    harm: {effect: 'draught-stress', per: 1}, reason: 'Repeated exposure dulls the response and excess adds toxic stress.',
}]});

const roles = {flask: 'item', body: 'body'};
const swallow = defineWorkingLaw({id: delivery, revision: 1, operations: {
    drink: {roles, minutes: 2, settle({bound, facts}) {
        if (bound.flask.place !== bound.body.place) return {ok: false, reason: 'flask-out-of-reach'};
        const {contents} = facts;
        const measured = Object.entries(contents);
        if (Object.keys(bound.flask.quantities).length !== measured.length ||
            measured.some(([part, amount]) => bound.flask.quantities[measure(part)] !== amount))
            return {ok: false, reason: 'measured-dose-unavailable'};
        return {ok: true, effects: measured.map(([part, amount]) =>
            ({op: 'add', holder: bound.flask.id, quantity: measure(part), amount: -amount}))};
    }},
}});
const method = {id: delivery, revision: 1, law: swallow.ref, roles, steps: [
    {op: 'drink', bindings: {flask: 'flask', body: 'body'}},
]};

function fixture({hungry = false, preparation = 'crush', strokes = 'LLLLLLLR', route = 'oral'} = {}) {
    const {facts} = brewDraughtOfLivingDeath({preparation, beanUnits: 12, precursor: 6, carrier: 94,
        strokes, storage: {days: 0, vessel: 'sealed'}});
    assert.deepEqual(brewBalance(facts), preparation === 'crush'
        ? {admitted: 112, held: 108, released: 4, balanced: true}
        : {admitted: 112, held: 103, released: 9, balanced: true});
    const contents = facts.brew.batch;

    const empty = restoreCreatureLifecycle();
    const stock = settleCohortStock(empty, {revision: empty.revision, id: 'human.cohort', species: 'human', habitat: room, delta: 1});
    const {state: lifecycle, id} = acquireCreature(stock, {revision: stock.revision, cohortId: 'human.cohort',
        destination: room, keeper, clock: 0, growthMinutes: 0});
    const world = createWorld(worldRules, {holders: [
        {id: room.id, kind: 'place'}, {id: 'store', kind: 'place'},
        {id, kind: 'body', place: room.id, tags: ['living.body'], quantities: {satiety: hungry ? 1 : ration},
            state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})}},
        {id: flask, kind: 'thing', as: ['item'], place: room.id, properties: {custodian: keeper},
            quantities: Object.fromEntries(Object.entries(contents).map(([part, amount]) => [measure(part), amount]))},
    ]});
    const working = beginWorking(swallow, method, {id: delivery, at: 0, facts: {contents, route},
        bindings: {flask: {kind: 'item', id: flask}, body: {kind: 'body', id}}});
    return {id, lifecycle, world, working, dose: createDoseState(), intake: null};
}

function bodyOf({lifecycle, world, id}) {
    return readLivingBody({lifecycle, registry, id, clock: world.clock, ration,
        satiety: {amount: readQuantity(world, id, 'satiety'), emptySince: world.holders[id].state[bodyPack].emptySince}});
}

function advance(state, to) {
    const {working} = state;
    const at = working.deadlines[0];
    const due = working.status === 'running' && at <= to;
    const world = advanceWorld(worldRules, state.world, due ? at : to).world;
    let next = {...state, world};
    if (!due) return next;

    const read = substratePort(world);
    const result = settleWorking(swallow, working, {now: at, ports: {read, authority: ({bindings}) => {
        if (working.facts.route !== 'oral') return {ok: false, reason: 'route-mismatch'};
        const item = read(bindings.flask, at);
        const recipient = state.lifecycle.individuals[bindings.body.id];
        const ok = item.properties.custodian === keeper && recipient?.keeper === keeper;
        return {ok, reason: 'attendant-lost-custody'};
    }}});
    next = {...next, working: result.record};
    if (result.record.status === 'complete') {
        const contents = working.facts.contents;
        const body = bodyOf(next);
        const settled = contents.settled ?? 0;
        const uptake = oralAbsorption[body.hunger.stage];
        assert.ok(Number.isInteger(uptake), 'fixture needs a measured hunger stage');
        const absorbed = Math.floor(settled * uptake / 1000);
        const reaction = absorbed ? applyDose(doseRules, state.dose, 'soporific', absorbed, at) :
            {state: state.dose, effective: 0, overdose: null};
        let lifecycle = state.lifecycle;
        const stress = reaction.effective + (reaction.overdose?.amount ?? 0);
        if (stress) {
            lifecycle = applyBodyHarm(lifecycle, {id: state.id, clock: at, hit: {kind: 'draught-stress', amount: stress}});
            const duration = bodyOf({...next, lifecycle}).injury.remaining;
            lifecycle = startCreatureCare(lifecycle, {revision: lifecycle.revision, id: state.id, clock: at, keeper, duration});
        }
        next = {...next, lifecycle, dose: reaction.state,
            world: applyWorldOps(worldRules, world, result.effects.map(row => row.effect), working.id),
            intake: {at, route: working.facts.route, contents, absorbed, passed: Object.values(contents).reduce((total, amount) => total + amount, 0) - absorbed, stress}};
    }
    return advance(next, to);
}

function restore(state) {
    const saved = JSON.parse(JSON.stringify({...state, world: serializeWorld(state.world), working: serializeWorking(state.working)}));
    return {...saved, world: restoreWorld(worldRules, saved.world),
        lifecycle: restoreCreatureLifecycle(saved.lifecycle), working: restoreWorking(swallow, saved.working),
        dose: validateDoseState(doseRules, saved.dose)};
}

function held({world, working}) {
    return Object.fromEntries(Object.keys(working.facts.contents).map(part => [part, readQuantity(world, flask, measure(part))]));
}

test('real oral Draught debits its whole measured composition and hunger changes finite recovery', () => {
    for (const [hungry, stage, stress, minutes, vitality] of [[false, 'fed', 4, 8, 50], [true, 'hungry', 8, 16, 37]]) {
        const start = fixture({hungry});
        const untouched = structuredClone(start);
        const control = advance({...start, working: interruptWorking(start.working, {at: 0, reason: 'withheld'})}, 2);
        const dosed = advance(start, 2);
        assert.deepEqual(start, untouched);
        assert.equal(bodyOf(control).hunger.stage, stage);
        assert.equal(bodyOf(control).injury, null);
        assert.equal(bodyOf(control).vitality.value, hungry ? 75 : 100);
        assert.deepEqual(held(control), {'carrier:matrix': 94, juice: 2, intermediate: 4, settled: 8});
        assert.deepEqual(control.dose, createDoseState());

        assert.equal(dosed.working.status, 'complete');
        assert.deepEqual(dosed.intake, {at: 2, route: 'oral', contents: held(control), absorbed: stress, passed: 108 - stress, stress});
        for (const [part, amount] of Object.entries(dosed.intake.contents)) {
            assert.equal(held(dosed)[part], 0);
            assert.equal(readProvenance(dosed.world, flask, measure(part))[delivery], -amount);
        }
        assert.deepEqual(dosed.dose.levels.soporific, {level: stress * 100, at: 2});
        assert.deepEqual(bodyOf(dosed).injury, {kind: 'draught-stress', required: minutes, remaining: minutes});
        assert.equal(bodyOf(dosed).vitality.value, vitality);
        assert.equal(bodyOf(advance(dosed, 2 + minutes - 1)).injury.remaining, 1);
        assert.deepEqual(bodyOf(advance(dosed, 2 + minutes)), bodyOf(advance(control, 2 + minutes)));
    }
});

test('preparation and stirring change the active amount in the dose the body receives', () => {
    const sliced = advance(fixture({preparation: 'slice'}), 2);
    assert.deepEqual(sliced.intake.contents, {'carrier:matrix': 94, precursor: 3, settled: 6});
    assert.equal(sliced.intake.absorbed, 3);
    assert.equal(bodyOf(sliced).injury.remaining, 6);

    const unstirred = fixture({strokes: ''});
    const end = advance(unstirred, 2);
    assert.deepEqual(end.intake.contents, {'carrier:matrix': 94, juice: 2, intermediate: 12});
    assert.equal(end.intake.absorbed, 0);
    assert.equal(end.intake.passed, 108);
    assert.deepEqual(Object.values(held(end)), [0, 0, 0]);
    assert.deepEqual(end.lifecycle, unstirred.lifecycle);
    assert.deepEqual(end.dose, unstirred.dose);
});

test('pre-swallow cancellation, unavailable custody and wrong route leave the brew and body intact', () => {
    const start = advance(fixture(), 1);
    const moved = {...start, world: applyWorldOps(worldRules, start.world,
        [{op: 'move', holder: flask, to: 'store'}], 'put-away')};
    const transferred = {...start, world: applyWorldOps(worldRules, start.world,
        [{op: 'property', holder: flask, property: 'custodian', value: 'supplier'}], 'hand-back')};
    const cancelled = {...start, working: interruptWorking(start.working, {at: 1, reason: 'withheld'})};
    const short = {...start, world: applyWorldOps(worldRules, start.world,
        [{op: 'add', holder: flask, quantity: measure('settled'), amount: -1}], 'sampled')};
    for (const [before, reason] of [[moved, 'flask-out-of-reach'], [cancelled, 'withheld'],
        [short, 'measured-dose-unavailable'], [transferred, 'attendant-lost-custody'], [fixture({route: 'topical'}), 'route-mismatch']]) {
        const after = advance(restore(before), 5);
        assert.equal(after.working.status, 'interrupted');
        assert.equal(after.working.receipts.at(-1).reason, reason);
        assert.equal(after.intake, null);
        assert.deepEqual(after.lifecycle, start.lifecycle);
        assert.deepEqual(after.dose, start.dose);
        assert.deepEqual(held(after), held(before));
        assert.equal(bodyOf(after).injury, null);
    }
});

test('partition and JSON restore across swallowing and recovery preserve the debit and the body clock', () => {
    const start = fixture({hungry: true});
    const run = (steps, reload) => steps.reduce((state, minute) => {
        const next = advance(state, minute);
        return reload ? restore(next) : next;
    }, start);
    const direct = run([18], false);
    const minutes = Array.from({length: 18}, (_, index) => index + 1);
    assert.deepEqual(run(minutes, false), direct);
    assert.deepEqual(run(minutes, true), direct);
    assert.equal(bodyOf(direct).injury, null);

    const stoppedAt = run([1, 2, 5], true);
    const lifecycle = settleCreatureCare(stoppedAt.lifecycle, {revision: stoppedAt.lifecycle.revision, id: stoppedAt.id,
        clock: stoppedAt.world.clock, interrupted: true});
    const interrupted = advance(restore({...stoppedAt, lifecycle}), 18);
    assert.equal(bodyOf(interrupted).injury.remaining, 13);
    assert.equal(bodyOf(interrupted).inCare, false);
    assert.deepEqual(interrupted.intake, direct.intake);
    assert.deepEqual(held(interrupted), held(direct), 'swallowed material stays spent when rest is interrupted');
});
