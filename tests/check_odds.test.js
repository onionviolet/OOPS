import test from 'node:test';
import assert from 'node:assert/strict';
import {checkOdds} from '../src/check_odds.js';
import {resolveCheck} from '../src/check_resolver.js';
import {checkDieFace} from '../src/check_contract.js';

const p = (family = 'sum_target', count = 1, sides = 20, extra = {}) => ({id: 'odds.fixture', revision: 1, family, dice: {count, sides}, ...extra});
const c = (target = 12, extra = {}) => ({id: 'odds.check', target, ...extra});
const m = (kind, value, id = kind) => ({id, kind, reason: `test ${id}`, ...(['bonus', 'target'].includes(kind) ? {value} : {})});
const spend = (timing, kind, value, when = 'always') => ({id: `spend.${timing}.${kind}`, timing, resource: 'fate', cost: 1,
    modifier: m(kind, value, `paid.${timing}.${kind}`), when});
const paid = (spends, target = 12) => c(target, {resources: {fate: 10}, spends});
const ratio = (n, d) => ({numerator: String(n), denominator: String(d)});
const number = r => Number(r.numerator) / Number(r.denominator);

test('all admitted dice have equal accepted uint32 populations with an explicit rejected tail', () => {
    for (let sides = 2; sides <= 100; sides++) {
        const population = Math.floor(0x100000000 / sides);
        for (let face = 1; face <= sides; face++) {
            assert.equal(checkDieFace((face - 1) * population, sides), face);
            assert.equal(checkDieFace(face * population - 1, sides), face);
        }
        const tail = population * sides;
        if (tail < 0x100000000) {
            assert.equal(checkDieFace(tail, sides), null);
            assert.equal(checkDieFace(0xffffffff, sides), null);
        }
    }
});

for (const [name, profile, check, n, d] of [
    ['d20', p(), c(), 9, 20],
    ['d20 advantage', p(), c(12, {modifiers: [m('advantage')]}), 279, 400],
    ['d20 disadvantage', p(), c(12, {modifiers: [m('disadvantage')]}), 81, 400],
    ['2d6', p('sum_target', 2, 6), c(7), 7, 12],
    ['3d6', p('sum_target', 3, 6), c(11), 1, 2],
    ['d100', p('roll_under', 1, 100), c(60), 3, 5],
    ['pool', p('success_pool', 5, 6, {successAt: 5}), c(2), 131, 243],
    ['roll-under advantage', p('roll_under', 1, 100), c(60, {modifiers: [m('advantage')]}), 21, 25],
    ['roll-under disadvantage', p('roll_under', 1, 100), c(60, {modifiers: [m('disadvantage')]}), 9, 25],
    ['bonus spend', p(), paid([spend('before', 'bonus', 2)]), 11, 20],
    ['after bonus on failure', p(), paid([spend('after', 'bonus', 2, 'failure')]), 11, 20],
    ['paid advantage', p(), paid([spend('before', 'advantage')]), 279, 400],
    ['target reduction', p(), paid([spend('before', 'target', -2)]), 11, 20],
    ['reroll failures', p(), paid([spend('after', 'reroll', null, 'failure')]), 279, 400],
    ['unconditional replacement reroll', p(), paid([spend('after', 'reroll')]), 9, 20],
    ['advantage plus reroll failures', p(), paid([spend('before', 'advantage'), spend('after', 'reroll', null, 'failure')]), 145359, 160000],
    ['before bonus then after conditional bonus', p(), paid([spend('before', 'bonus', 1), spend('after', 'bonus', 1, 'failure')]), 11, 20],
    ['critical override', p('sum_target', 1, 20, {critical: {successFace: 20, failureFace: 1}}), c(100), 1, 20],
]) test(`exact reference ${name}`, () => assert.deepEqual(checkOdds(profile, check).success, ratio(n, d)));

// Independent, deliberately small exhaustive oracle. Imports no shared policy,
// selector, distribution or outcome helper from production code.
function enumerate(profile, check) {
    let rolls = [[]];
    for (let i = 0; i < profile.dice.count; i++) rolls = rolls.flatMap(ds => Array.from({length: profile.dice.sides}, (_, n) => [...ds, n + 1]));
    const base = rolls.map(ds => profile.family === 'success_pool' ? ds.filter(n => n >= profile.successAt).length : ds.reduce((a, b) => a + b));
    const before = [...(check.modifiers || []), ...(check.spends || []).filter(s => s.timing === 'before').map(s => s.modifier)];
    const adv = before.some(m => m.kind === 'advantage'), dis = before.some(m => m.kind === 'disadvantage');
    const selected = adv === dis ? base : base.flatMap(a => base.map(b => ((profile.family === 'roll_under') === adv ? Math.min : Math.max)(a, b)));
    const after = (check.spends || []).filter(s => s.timing === 'after'), reroll = after.some(s => s.modifier.kind === 'reroll');
    const counts = {};
    let hits = 0n, total = 0n;
    for (const first of selected) for (const second of reroll ? selected : [0]) {
        let raw = first, bonus = 0, target = check.target;
        const apply = m => { if (m.kind === 'bonus') bonus += m.value; if (m.kind === 'target') target += m.value; };
        const wins = () => raw === profile.critical?.successFace || (raw !== profile.critical?.failureFace &&
            (profile.family === 'roll_under' ? raw + bonus <= target : raw + bonus >= target));
        before.forEach(apply);
        for (const s of after) if (s.when !== 'failure' || !wins()) {
            apply(s.modifier); if (s.modifier.kind === 'reroll') raw = second;
        }
        const degree = raw === profile.critical?.successFace ? 'critical_success' : raw === profile.critical?.failureFace ? 'critical_failure' : wins() ? 'success' : 'failure';
        counts[degree] = (counts[degree] || 0n) + 1n;
        total++; if (wins()) hits++;
    }
    return {hits, total, counts};
}
for (const [name, profile, check] of [
    ['sum + advantage + conditional reroll + after bonus', p('sum_target', 2, 3), paid([
        spend('before', 'advantage'), spend('after', 'reroll', null, 'failure'), spend('after', 'bonus', 1, 'failure')], 5)],
    ['under + disadvantage + after target', p('roll_under', 1, 6), c(3, {modifiers: [m('disadvantage')], resources: {fate: 2}, spends: [spend('after', 'target', 1, 'failure')]})],
    ['pool + advantage + reroll', p('success_pool', 2, 3, {successAt: 3}), paid([spend('before', 'advantage'), spend('after', 'reroll', null, 'failure')], 1)],
    ['crit + reroll + after bonus', p('sum_target', 1, 4, {critical: {successFace: 4, failureFace: 1}}), paid([spend('after', 'reroll', null, 'failure'), spend('after', 'bonus', 1)], 4)],
]) test(`independent full enumeration: ${name}`, () => {
    const oracle = enumerate(profile, check), actual = checkOdds(profile, check);
    assert.equal(BigInt(actual.success.numerator) * oracle.total, oracle.hits * BigInt(actual.success.denominator));
    for (const [degree, n] of Object.entries(oracle.counts)) assert.equal(BigInt(actual.degrees[degree].numerator) * oracle.total, n * BigInt(actual.degrees[degree].denominator));
});

test('integer convolution stays exact beyond safe Number precision, including a rare pool event', () => {
    const profile = p('success_pool', 32, 6, {successAt: 6});
    const odds = checkOdds(profile, c(32));
    assert.deepEqual(odds.success, ratio(1, 6n ** 32n));
    assert.equal(odds.totalWeight, String(6n ** 32n));
    const distributionSum = Object.values(odds.degrees).reduce((sum, r) => sum + number(r), 0);
    assert.ok(Math.abs(distributionSum - 1) < 1e-15);
});
test('inclusive target boundaries, zero successes and impossible checks give exact zero or one', () => {
    for (const [profile, impossible, certain] of [[p(), 21, 1], [p('roll_under', 1, 100), 0, 100], [p('success_pool', 2, 6, {successAt: 6}), 3, 0]]) {
        assert.deepEqual(checkOdds(profile, c(impossible)).success, ratio(0, 1));
        assert.deepEqual(checkOdds(profile, c(certain)).success, ratio(1, 1));
    }
});

// Deterministic N=6000 addresses per case, with changing roots and game minutes.
// Absolute tolerance 0.025 (>3.8 worst-case binomial standard errors). This is
// distribution evidence, not a replacement for exact integer conformance.
for (const [name, profile, check] of [
    ['d20', p(), c()], ['2d6', p('sum_target', 2, 6), c(7)], ['3d6', p('sum_target', 3, 6), c(11)],
    ['under', p('roll_under', 1, 100), c(60)], ['pool', p('success_pool', 5, 6, {successAt: 5}), c(2)],
    ['advantage', p(), c(12, {modifiers: [m('advantage')]})], ['disadvantage', p(), c(12, {modifiers: [m('disadvantage')]})],
    ['before spend', p(), paid([spend('before', 'bonus', 2)])], ['after spend', p(), paid([spend('after', 'bonus', 2, 'failure')])],
    ['reroll failure', p(), paid([spend('after', 'reroll', null, 'failure')])],
    ['advantage reroll', p(), paid([spend('before', 'advantage'), spend('after', 'reroll', null, 'failure')])],
    ['pool paid reroll', p('success_pool', 5, 6, {successAt: 5}), paid([spend('after', 'reroll', null, 'failure')], 2)],
]) test(`6000-address sweep, 0.025 absolute band: ${name}`, () => {
    let hits = 0;
    const expected = number(checkOdds(profile, check).success);
    for (let n = 0; n < 6000; n++) {
        const r = resolveCheck(profile, check, {root: n, worldId: 'sweep.world', lifeId: 'sweep.life', gameTime: n, eventId: 'sweep.check'});
        hits += Number(r.result.success);
        assert.ok(r.receipt.dice.every(roll => roll.candidates.every(candidate => candidate.dice.every(d => d.value >= 1 && d.value <= profile.dice.sides))));
    }
    assert.ok(Math.abs(hits / 6000 - expected) <= .025, `${name}: observed ${hits / 6000}, exact ${expected}`);
});
