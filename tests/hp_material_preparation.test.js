import test from 'node:test';
import assert from 'node:assert/strict';
import {assessHpPreparation, inspectHpPreparation} from '../src/hp_brewing_formula.js';
import {begin, commit, view, quote, settle, HP} from '../src/hp_brewing_state.js';

function fixture(coarse = false) {
    let state = begin({seed: 11, now: 0});
    let now = 0;
    const ctx = () => ({now, moon: 'Full'});
    const act = req => {state = commit(state, ctx(), req).state;};
    const slots = {};
    for(const slot of HP.formula.slots) {
        act({type: 'acquire', ingredient: slot.ingredient, route: slot.id === 'fluxweed' ? 'book.hp.route.harvest'
            : ['bicorn', 'boomslang'].includes(slot.id) ? 'book.hp.route.trusted_supplier' : 'book.hp.route.student_store'});
        slots[slot.id] = Object.keys(state.lots).at(-1);
    }
    act({type: 'stew', lotId: slots.lacewing});
    now += HP.formula.slots[0].minStewMinutes; settle(state, now);
    act({type: 'prepare', lotId: slots.bicorn, variant: `book.hp.prep.powder_${coarse ? 'coarse' : 'fine'}`});
    act({type: 'prepare', lotId: slots.boomslang, variant: 'book.hp.prep.shred_fine'});
    return {get state() {return state;}, ctx, slots, act, wait: minutes => {now += minutes; settle(state, now);}};
}

test('HP selected-lot assessment is observer-safe, pure, and distinguishes unsupported from uncertain', () => {
    const f = fixture(), projected = view(f.state, f.ctx());
    assert.equal(assessHpPreparation(projected, f.slots).status, 'supported');
    const before = structuredClone(f.state);
    for(let i = 0; i < 3; i++) assessHpPreparation(view(f.state, f.ctx()), f.slots);
    assert.deepEqual(f.state, before);
    const claimed = f.state.lots[f.slots.lacewing];
    claimed.known.stewed = false; claimed.claim = 'Sold as stewed twenty-one days.';
    const unknown = assessHpPreparation(view(f.state, f.ctx()), f.slots);
    assert.equal(unknown.status, 'uncertain');
    claimed.truth.stewedMinutes = HP.formula.slots[0].nearStewMinutes;
    assert.deepEqual(assessHpPreparation(view(f.state, f.ctx()), f.slots), unknown, 'concealed duration cannot change assessment, text, order or costs');
    const authorGap = view(f.state, f.ctx());
    authorGap.lots.find(l => l.id === f.slots.bicorn).variant = 'Unsupported preparation';
    assert.equal(assessHpPreparation(authorGap, f.slots).status, 'unsupported');
    assert.match(unknown.coverage, /does not search every possible substitute/);
});

test('one preparation difference reaches the actual dose consumer and its cost', () => {
    const durations = [];
    for(const coarse of [false, true]) {
        const f = fixture(coarse);
        assert.equal(assessHpPreparation(view(f.state, f.ctx()), f.slots).status, coarse ? 'deviation' : 'supported');
        f.act({type: 'sample', donorId: 'd1', route: 'ask'});
        const sampleId = Object.keys(f.state.samples)[0];
        f.act({type: 'brew', slots: f.slots});
        assert.equal(Object.keys(f.state.lots).length, 0);
        f.wait(HP.rules.brewMinutes);
        const batch = Object.values(f.state.batches)[0];
        f.act({type: 'drink', batchId: batch.id, sampleId});
        durations.push(f.state.effect.endsAt - f.state.effect.startedAt);
        assert.equal(f.state.batches[batch.id].dosesLeft, HP.rules.doses - 1);
        assert.equal(Object.keys(f.state.samples).length, 0);
    }
    assert.deepEqual(durations, [HP.formula.transformMinutes, Math.floor(HP.formula.transformMinutes * HP.rules.degradedPermille / 1000)]);
});

test('stale and duplicate lot selections refuse without spending; changed apparatus invalidates a clean-pot comparison', () => {
    const f = fixture();
    const slots = {...f.slots, bicorn: 'no-longer-held'};
    const before = structuredClone(f.state);
    assert.equal(assessHpPreparation(view(f.state, f.ctx()), slots).status, 'stale');
    assert.equal(quote(f.state, f.ctx(), {type: 'brew', slots}).eligible, false);
    assert.throws(() => f.act({type: 'brew', slots}), /lot you hold/);
    assert.deepEqual(f.state, before);
    const duplicate = {...f.slots, boomslang: f.slots.bicorn};
    assert.equal(assessHpPreparation(view(f.state, f.ctx()), duplicate).status, 'stale');
    assert.equal(quote(f.state, f.ctx(), {type: 'brew', slots: duplicate}).eligible, false);
    f.state.cauldron.condition = HP.rules.cauldronOkFrom - 1;
    const changed = assessHpPreparation(view(f.state, f.ctx()), f.slots);
    assert.equal(changed.status, 'deviation'); assert.match(changed.apparatus, /Scour/);
    f.act({type: 'scour'});
    assert.equal(f.state.purse, before.purse - HP.rules.scourCost);
    assert.equal(assessHpPreparation(view(f.state, f.ctx()), f.slots).status, 'supported');
});


test('HP causal inspector consumes projected evidence without inventing historical receipts or changing knowledge', () => {
    const f = fixture(), lot = f.state.lots[f.slots.lacewing];
    lot.known.stewed = false; lot.claim = 'Sold as stewed twenty-one days.';
    const before = structuredClone(f.state), projection = view(f.state, f.ctx());
    const inspected = inspectHpPreparation(projection, f.slots);
    const lace = inspected[0];
    assert.equal(lace.properties.find(r => r.id === 'acquisition').status, 'claim');
    assert.equal(lace.properties.find(r => r.id === 'stewing').status, 'unknown');
    assert.equal(Object.hasOwn(lace.properties.find(r => r.id === 'stewing'), 'value'), false);
    assert.equal(lace.method.revisionStatus, 'unsupported');
    assert.deepEqual(lace.trace, []); assert.equal(lace.receipt, null);
    assert.equal(lace.coverage.searched, 1); assert.equal(lace.coverage.total, 6);
    assert.equal(lace.failedConditions.length, 0);
    assert.deepEqual(f.state, before);
    lot.truth.stewedMinutes = HP.formula.slots[0].nearStewMinutes;
    assert.deepEqual(inspectHpPreparation(view(f.state, f.ctx()), f.slots), inspected);
    assert.equal(inspected[1].properties.some(r => r.id === 'stewing'), false, 'irrelevant unknown fields do not imply missing formula conditions');
});
