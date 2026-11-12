import assert from 'node:assert/strict';
import {begin, commit, HP, quote, settle, validate, view} from '../../../src/hp_brewing_state.js';

const context = now => ({now, moon: 'Full'});
const ingredient = key => `book.hp.ing.${key}`;
const route = key => `book.hp.route.${key}`;

function prepareInputs(stewDays = 21) {
    let now = 0;
    let state = begin({seed: 11, now});
    const apply = request => { state = commit(state, context(now), request).state; };
    const acquire = (key, from) => {
        apply({type: 'acquire', ingredient: ingredient(key), route: route(from)});
        return Object.values(state.lots).find(lot => lot.ingredient === ingredient(key)).id;
    };
    const slots = {
        fluxweed: acquire('fluxweed', 'harvest'),
        lacewing: acquire('lacewing_flies', 'student_store'),
        leeches: acquire('leeches', 'student_store'),
        knotgrass: acquire('knotgrass', 'student_store'),
        bicorn: acquire('bicorn_horn', 'trusted_supplier'),
        boomslang: acquire('boomslang_skin', 'trusted_supplier'),
    };
    apply({type: 'stew', lotId: slots.lacewing});
    now += stewDays * 1440;
    settle(state, now);
    if(state.lots[slots.lacewing].stew) apply({type: 'removeStew', lotId: slots.lacewing});
    apply({type: 'prepare', lotId: slots.boomslang, variant: 'book.hp.prep.shred_fine'});
    return {state, slots, now};
}

function brew(inputs, horn, finish = 'standard') {
    const {state, slots, now} = inputs;
    const prepared = horn === 'raw' ? state : commit(state, context(now), {
        type: 'prepare', lotId: slots.bicorn, variant: `book.hp.prep.powder_${horn}`,
    }).state;
    const batchState = commit(prepared, context(now), {type: 'brew', slots, finish}).state;
    const retained = validate(JSON.parse(JSON.stringify(batchState)));
    const ready = retained.cauldron.brew.readyAt;
    assert.equal(ready, now + HP.rules.brewMinutes + (finish === 'concentrated' ? 60 : 0));
    settle(retained, ready - 1);
    assert.ok(retained.cauldron.brew);
    settle(retained, ready);
    const [batch] = Object.values(retained.batches);
    assert.equal(Object.keys(retained.lots).length, 0);
    validate(retained);
    return {state: retained, batch, now: ready};
}

function applySample(brewed, donorId, sampleRoute = 'ask', species = 'human') {
    const {batch, now} = brewed;
    let state = JSON.parse(JSON.stringify(brewed.state));
    validate(state);
    let sample;
    for (let attempt = 0; attempt < 64 && !sample; attempt++) {
        state = commit(state, context(now), {type: 'sample', donorId, route: sampleRoute}).state;
        const newest = Object.values(state.samples).at(-1);
        if (newest.truth.species === species) sample = newest;
    }
    assert.ok(sample, `No ${species} sample in the fixture`);
    const request = {type: 'drink', batchId: batch.id, sampleId: sample.id};
    const beforePreview = JSON.stringify(state);
    assert.ok(quote(state, context(now), request).eligible);
    assert.equal(JSON.stringify(state), beforePreview);
    const applied = commit(state, context(now), request).state;
    assert.equal(applied.batches[batch.id].dosesLeft, batch.dosesLeft - 1);
    assert.ok(!Object.hasOwn(applied.samples, sample.id));
    validate(applied);
    const {kind, startedAt, endsAt} = applied.effect;
    const minutes = endsAt - startedAt;
    const resumed = JSON.parse(JSON.stringify(applied));
    validate(resumed);
    if (minutes > 0) {
        assert.equal(view(resumed, context(endsAt - 1)).effect.donorName, state.donors[sample.donorId].name);
        assert.equal(view(resumed, context(endsAt - 1)).effect.minutesLeft, 5);
        assert.equal(view(resumed, context(endsAt)).effect, null);
    }
    return {cohort: batch.cohortId, grade: batch.grade, donor: applied.effect.donorId, kind, minutes,
        species, condition: applied.condition?.id ?? null, dosesSpent: 1};
}

const inputs = prepareInputs();
const fine = brew(inputs, 'fine');
const coarse = brew(inputs, 'coarse');
const raw = brew(inputs, 'raw');
const fineA = applySample(fine, 'd1');
const fineB = applySample(fine, 'd2');
const coarseA = applySample(coarse, 'd1');
const coarseB = applySample(coarse, 'd2');
const rawA = applySample(raw, 'd1');
const cat = applySample(fine, 'd2', 'brush', 'cat');
const humanRows = [fineA, fineB, coarseA, coarseB, rawA];
assert.deepEqual(humanRows.map(row => [row.grade, row.donor, row.kind, row.minutes]), [
    ['canon', 'd1', 'transform', 60],
    ['canon', 'd2', 'transform', 60],
    ['degraded', 'd1', 'thin', 30],
    ['degraded', 'd2', 'thin', 30],
    ['original', 'd1', 'nothing', 0],
]);
assert.equal(fineA.cohort, fineB.cohort);
assert.equal(coarseA.cohort, coarseB.cohort);
assert.equal(cat.condition, 'animal_features');
const concentrated = brew(inputs, 'fine', 'concentrated');
const concentratedA = applySample(concentrated, 'd1');
const concentratedB = applySample(concentrated, 'd2');
const earlier = applySample(brew(prepareInputs(16), 'fine'), 'd1');
const later = applySample(brew(prepareInputs(20), 'fine'), 'd1');
assert.equal(concentrated.batch.dosesLeft, fine.batch.dosesLeft - 1);
assert.equal(concentratedA.minutes, 120);
assert.equal(concentratedB.minutes, 120);
assert.equal(concentratedA.donor, fineA.donor);
assert.equal(concentratedB.donor, fineB.donor);
assert.equal(earlier.minutes, 31);
assert.equal(later.minutes, 54);
const oldBatch = structuredClone(coarse);
delete oldBatch.state.batches[oldBatch.batch.id].history.finish;
assert.equal(applySample(oldBatch, 'd1').minutes, 30);
const forged = structuredClone(concentrated.state);
forged.batches[concentrated.batch.id].history.finish.doseMinutes = 720;
assert.throws(() => validate(forged), /Inconsistent retained Polyjuice finish/);
console.log(JSON.stringify({humanRows, cat, concentratedA, concentratedB, earlier, later}, null, 2));
