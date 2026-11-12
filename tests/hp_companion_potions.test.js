import test from 'node:test';
import assert from 'node:assert/strict';
import {begin, commit, HP, quote, settle, validate, view} from '../src/hp_brewing_state.js';

function bench() {
    let now = 0;
    let state = begin({seed: 11, now});
    const context = () => ({now, moon: 'Full'});
    return {
        get state() { return state; },
        apply(request) {
            const result = commit(state, context(), request);
            state = validate(result.state);
            return result.summary;
        },
        quote: request => quote(state, context(), request),
        view: () => view(state, context()),
        wait(minutes) { now += minutes; settle(state, now); },
        reload() { state = validate(JSON.parse(JSON.stringify(state))); },
    };
}

test('paid mucus changes chalk settling at equal mass and raises stirring effort', () => {
    const r = bench();
    r.apply({type: 'companionSuspend', mucus: 0});
    const request = {type: 'companionSuspend', mucus: 1};
    assert.equal(r.quote(request).eligible, true);
    assert.equal(r.state.purse, HP.rules.startPurse - 1);
    r.apply(request);
    assert.equal(r.state.purse, HP.rules.startPurse - 3);
    assert.equal(r.quote(request).eligible, false);
    r.wait(5);
    r.reload();
    const [plain, thick] = r.view().companionPotions.glasses;
    assert.ok(thick.suspended > plain.suspended);
    assert.ok(thick.stirEffort > plain.stirEffort);
    r.apply({type: 'companionEmpty', mucus: 1});
    assert.equal(r.view().companionPotions.glasses.length, 1);
});

test('Ashwinder acquisition and freeze respect deadlines and use a single egg', () => {
    const r = bench();
    const collect = {type: 'companionCollect'};
    const freeze = {type: 'companionFreeze'};
    r.apply({type: 'companionFire'});
    assert.equal(r.quote(collect).eligible, false);
    r.wait(25);
    r.apply(collect);
    assert.equal(r.quote(collect).eligible, false);
    r.reload();
    r.apply(freeze);
    r.wait(35);
    r.apply({type: 'companionPatient', condition: 'ague'});
    assert.match(r.apply({type: 'companionTreat', remedy: 'egg'}), /cleared/);
    assert.equal(r.view().companionPotions.patient, null);
    assert.equal(r.quote({type: 'companionTreat', remedy: 'egg'}).eligible, false);
    r.apply({type: 'companionFire'});
    r.wait(25);
    r.apply(collect);
    r.wait(20);
    assert.equal(r.view().companionPotions.stage, 'scorched');
    assert.equal(r.quote(freeze).eligible, false);
});

test('Glumbumble treatment spends one dose and distinguishes healthy, mismatched and matched recipients', () => {
    const r = bench();
    const dose = {type: 'companionTreat', remedy: 'treacle'};
    assert.match(r.apply(dose), /no symptoms/);
    r.apply({type: 'companionPatient', condition: 'ague'});
    assert.match(r.apply(dose), /symptoms remain/);
    assert.equal(r.view().companionPotions.patient, 'Ague');
    r.wait(120);
    r.apply({type: 'companionPatient', condition: 'hysteria'});
    r.reload();
    assert.equal(r.quote(dose).summary, 'Give one serving and observe the response.');
    assert.match(r.apply(dose), /cleared/);
    assert.equal(r.view().companionPotions.patient, null);
    assert.equal(r.state.purse, HP.rules.startPurse - 6);
});
