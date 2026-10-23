import test from 'node:test';
import assert from 'node:assert/strict';
import {defineVowRules, createVowState, takeVow, breakVow, vowBonuses, vowScar, validateVowState} from '../src/vow_rules.js';
import {defineTrialRules, createTrialState, riskFor, quoteSafeBreakthrough, attemptBreakthrough, validateTrialState} from '../src/breakthrough_trial.js';
import {defineTrustRules, createTrustState, giveGift, rankPeers, validateTrustState} from '../src/peer_standing.js';

const vows = defineVowRules({id: 'v', revision: 1, maxKept: 2, vows: [
    {id: 'no-meat', text: 'Eat no flesh.', track: 'qi', bonus: 80, scar: 2, reason: 'A clean body holds finer breath.'},
    {id: 'no-lies', text: 'Tell no lie.', track: 'qi', bonus: 50, scar: 3, reason: 'Honest speech steadies the mind.'},
    {id: 'no-sleep', text: 'Never rest past dawn.', track: 'body', bonus: 60, scar: 1, reason: 'Hard hours harden the frame.'}]});
const trial = defineTrialRules({id: 't', revision: 1, baseRisk: {1: 300, 2: 500}, floor: 50, perPressure: 40, perStability: 20, setback: 300, pressureOnFail: 3, pressureOnPass: -1,
    tribulationFrom: 2, tribulationWaves: 3, pay: {perUnit: 25, perUnitRisk: 100, maxUnits: 6, label: 'spirit herbs'}});

test('vows: bonus while kept, scar when broken, cap holds, reload validates', () => {
    let s = takeVow(vows, createVowState(), 'no-meat', 0); s = takeVow(vows, s, 'no-lies', 5);
    assert.deepEqual(vowBonuses(vows, s), {qi: 130});
    assert.throws(() => takeVow(vows, s, 'no-sleep', 6), /Only 2/);
    s = breakVow(vows, s, 'no-lies', 9);
    assert.deepEqual([vowBonuses(vows, s), vowScar(s)], [{qi: 80}, 3]);
    assert.deepEqual(validateVowState(vows, JSON.parse(JSON.stringify(s))), s);
});

test('breakthrough: paying cuts risk to a floor, never zero; failure sets back and builds pressure', () => {
    const q = quoteSafeBreakthrough(trial, 2, {stability: 2});
    assert.deepEqual([q.from, q.units, q.cost, q.to], [460, 5, 125, 50]);
    assert.equal(riskFor(trial, 2, {stability: 2, units: 6}), 50);
    const fail1 = attemptBreakthrough(trial, createTrialState(), {tier: 2, roll: 100, progress: 1000});
    assert.deepEqual([fail1.passed, fail1.lost, fail1.state.pressure, fail1.waves], [false, 300, 9, 3]);
    assert.equal(riskFor(trial, 2, {pressure: 3, scar: 2}), 700);
    assert.equal(attemptBreakthrough(trial, createTrialState(), {tier: 1, roll: 0, progress: 0}).state.pressure, 3, 'tier below tribulation adds one step');
    const paid = attemptBreakthrough(trial, fail1.state, {tier: 2, roll: 999, progress: 1000, stability: 2, units: 6});
    assert.deepEqual([paid.passed, paid.spent, paid.state.pressure], [true, 150, 8]);
    assert.deepEqual(validateTrialState(JSON.parse(JSON.stringify(paid.state))), paid.state);
    assert.throws(() => riskFor(trial, 2, {units: 7}), /Pay between/);
});

const trust = defineTrustRules({id: 'tr', suspicionPerExcess: 1, tiers: [
    {id: 'stranger', at: 0, giftCeiling: 20, reason: 'A stranger wonders what you want.'}, {id: 'friend', at: 10, giftCeiling: 100, reason: 'Even friends count.'}]});
test('gifts: ceiling per tier, oversize gift costs trust not permission; ranking is stable', () => {
    let r = giveGift(trust, createTrustState(), 'mira', 20);
    assert.deepEqual([r.change, r.tooBig], [2, false]);
    r = giveGift(trust, r.state, 'mira', 60);
    assert.deepEqual([r.change, r.tooBig, r.now], [-38, true, 'stranger']);
    assert.equal(r.state.trust.mira, 0);
    const big = giveGift(trust, {...createTrustState(), trust: {a: 15}}, 'a', 60);
    assert.deepEqual([big.change, big.tooBig], [6, false]);
    assert.deepEqual(validateTrustState(JSON.parse(JSON.stringify(big.state))), big.state);
    const rk = rankPeers([{id: 'you', score: 5}, {id: 'b', score: 9}, {id: 'a', score: 9}], 'you');
    assert.deepEqual([rk.rank, rk.of, rk.next, rk.order.map(p => p.id)], [3, 3, {id: 'b', gap: 4}, ['a', 'b', 'you']]);
});
