import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveCheck, replayCheck, spendAfterCheck} from '../src/check_resolver.js';
import {checkOdds} from '../src/check_odds.js';
import {DND_CHECK_PACK_EXAMPLE, createCheckRulePack} from '../src/check_rule_pack.js';
import {readCheckInspector} from '../src/check_inspector.js';
import {TagRegistry} from '../src/tag_store.js';
import {RULE_TARGET, resolveRuleEffects} from '../src/rule_modules.js';

const clone = structuredClone;
const profile = (family = 'sum_target', count = 1, sides = 20, extra = {}) =>
    ({id: `test.${family}.${count}d${sides}`, revision: 1, family, dice: {count, sides}, ...extra});
const at = (n = 0) => ({root: 'r1-test-root', worldId: 'test.world', lifeId: 'life:1', gameTime: n, eventId: 'test.check'});
const modifier = (kind, value, id = kind) => ({id, kind, reason: `test ${id}`, ...(['bonus', 'target'].includes(kind) ? {value} : {})});
const spend = (timing = 'before', kind = 'bonus', value = 2, extra = {}) => ({id: `spend.${timing}.${kind}`, timing,
    resource: 'effort', cost: 1, modifier: modifier(kind, value, `paid.${timing}.${kind}`), ...extra});
const check = (target = 12, extra = {}) => ({id: 'test.check', target, ...extra});
const cases = [
    ['d20', profile(), check()],
    ['advantage', profile(), check(12, {modifiers: [modifier('advantage')]})],
    ['disadvantage', profile(), check(12, {modifiers: [modifier('disadvantage')]})],
    ['2d6', profile('sum_target', 2, 6, {degreeStep: 3}), check(7)],
    ['3d6', profile('sum_target', 3, 6), check(11)],
    ['d100', profile('roll_under', 1, 100), check(60)],
    ['pool', profile('success_pool', 5, 6, {successAt: 5}), check(2)],
];
const goldens = JSON.parse(readFileSync(new URL('./fixtures/check_resolver_golden.json', import.meta.url)));
for (const [name, p, c] of cases) for (const n of [0, 1440, 9001]) {
    test(`golden ${name} at gameTime ${n}`, () => {
        const rolled = resolveCheck(p, c, at(n));
        assert.deepEqual(rolled.receipt, goldens[name][n]);
        assert.deepEqual(replayCheck(JSON.parse(JSON.stringify(rolled.receipt))), rolled);
    });
}
function freeze(v) { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
test('pure on frozen inputs, no clock/entropy; preview and unrelated checks never shift a result', () => {
    const p = freeze(profile()), c = freeze(check()), a = freeze(at());
    const before = JSON.stringify([p, c, a]), expected = resolveCheck(p, c, a);
    const random = Math.random, now = Date.now;
    try {
        Math.random = Date.now = () => { throw Error('Ambient entropy/clock'); };
        checkOdds(p, c);
        resolveCheck(p, check(12, {id: 'unrelated'}), a);
        assert.deepEqual(resolveCheck(p, c, a), expected);
    } finally { Math.random = random; Date.now = now; }
    assert.equal(JSON.stringify([p, c, a]), before);
    for (const file of ['check_contract', 'check_resolver', 'check_odds', 'check_rule_pack', 'check_inspector']) {
        assert.doesNotMatch(readFileSync(new URL(`../src/${file}.js`, import.meta.url), 'utf8'), /Math\.random|Date\.now|performance\.now|document\.|window\./);
    }
});
test('before spend changes result/receipt and proposes one exact debit without mutating its ledger', () => {
    const p = profile(), c = freeze(check(12, {resources: {effort: 3}, spends: [spend()]}));
    const base = resolveCheck(p, check(), at()), paid = resolveCheck(p, c, at());
    assert.deepEqual(paid.receipt.dice, base.receipt.dice);
    assert.equal(paid.result.total, base.result.total + 2);
    assert.equal(paid.resources.effort, 2);
    assert.equal(c.resources.effort, 3);
    assert.equal(paid.receipt.spent[0].timing, 'before');
    assert.ok(paid.receipt.top.some(row => row.id === 'paid.before.bonus' && row.reason === 'test paid.before.bonus'));
});
test('after seeing a pending receipt, apply a named resource spend while retaining the original dice', () => {
    const base = resolveCheck(profile(), check(12, {resources: {effort: 2}}), at());
    const paid = spendAfterCheck(base.receipt, spend('after'));
    assert.deepEqual(paid.receipt.dice, base.receipt.dice);
    assert.equal(paid.result.total, base.result.total + 2);
    assert.equal(paid.resources.effort, 1);
    assert.deepEqual(replayCheck(paid.receipt), paid);
    assert.throws(() => spendAfterCheck(base.receipt, spend('before')), /after-roll/);
});
test('conditional after-roll spend debits failures only, reroll slots stay separate and replay', () => {
    const p = profile(), c = check(12, {resources: {effort: 2}, spends: [spend('after', 'reroll', null, {when: 'failure'})]});
    const samples = Array.from({length: 100}, (_, n) => resolveCheck(p, c, at(n)));
    const rerolled = samples.find(r => r.receipt.dice[1].used), kept = samples.find(r => !r.receipt.dice[1].used);
    assert.ok(rerolled && kept);
    assert.equal(rerolled.resources.effort, 1); assert.equal(kept.resources.effort, 2);
    assert.equal(kept.receipt.spent.length, 0);
    assert.equal(kept.receipt.dice.length, 2, 'unused reroll dice preserve the fixed completion envelope');
    assert.equal(rerolled.receipt.dice[1].phase, 'reroll');
    assert.notEqual(rerolled.receipt.dice[0].candidates[0].dice[0].address, rerolled.receipt.dice[1].candidates[0].dice[0].address);
    assert.deepEqual(replayCheck(rerolled.receipt), rerolled);
    assert.ok(samples.some(r => r.receipt.dice[1].used && r.result.raw < r.receipt.dice[0].candidates[0].score), 'replacement reroll may be worse');
});
test('after spends evaluate in declared order, with bonus before failure-triggered reroll', () => {
    const p = profile(), a = at(), base = resolveCheck(p, check(), a).result.raw;
    const r = resolveCheck(p, check(base + 1, {resources: {effort: 2}, spends: [spend('after'), spend('after', 'reroll', null, {when: 'failure'})]}), a);
    assert.equal(r.receipt.spent.length, 1);
    assert.equal(r.receipt.dice.length, 2);
    assert.equal(r.receipt.dice[1].used, false);
    assert.equal(r.result.success, true);
});
test('both advantage sources cancel by presence, and roll-under advantage keeps the lower candidate', () => {
    const p = profile(), c = check(12, {modifiers: [modifier('advantage', null, 'a1'), modifier('advantage', null, 'a2'), modifier('disadvantage')]});
    assert.deepEqual(resolveCheck(p, c, at()).receipt.dice, resolveCheck(p, check(), at()).receipt.dice);
    const under = resolveCheck(profile('roll_under', 1, 100), check(60, {modifiers: [modifier('advantage')]}), at());
    assert.equal(under.result.raw, Math.min(...under.receipt.dice[0].candidates.map(c => c.score)));
});
test('blocked rules return why-not reasons with no dice or spend, including unknown facts', () => {
    const c = check(12, {resources: {effort: 1}, spends: [spend()], requires: {fact: 'focus', op: 'eq', value: true, reason: 'Requires a focus.'}});
    const r = resolveCheck(profile(), c, at());
    assert.equal(r.result.degree, 'blocked'); assert.deepEqual(r.receipt.reasons, ['Requires a focus.']);
    assert.deepEqual(r.receipt.dice, []); assert.deepEqual(r.receipt.spent, []); assert.equal(r.resources.effort, 1);
    assert.deepEqual(checkOdds(profile(), c).success, {numerator: '0', denominator: '1'});
    assert.equal(resolveCheck(profile(), {...c, facts: {focus: true}}, at()).receipt.dice.length, 1);
});
test('critical faces and margin degrees are explicit profile parameters, without implicit d20 crits', () => {
    const p = profile('sum_target', 1, 20, {degreeStep: 5, critical: {successFace: 20, failureFace: 1}});
    const results = Array.from({length: 200}, (_, n) => resolveCheck(p, check(50), at(n)).result);
    assert.ok(results.some(r => r.raw === 20 && r.degree === 'critical_success' && r.success));
    assert.ok(results.some(r => r.raw === 1 && r.degree === 'critical_failure' && !r.success));
    assert.equal(resolveCheck(profile(), check(50), at()).result.success, false);
    const positive = resolveCheck(profile('sum_target', 1, 20, {degreeStep: 5}), check(-20), at()).result;
    assert.equal(positive.level, 1 + Math.floor(positive.margin / 5));
});
test('JSON save/reload/import of caller-owned cursor, profile and history keeps the next check exact', () => {
    const state = {profile: cases[3][1], check: cases[3][2], next: at(1440), history: [resolveCheck(profile(), check(), at()).receipt]};
    const expected = resolveCheck(state.profile, state.check, state.next);
    const imported = JSON.parse(JSON.stringify(state));
    assert.deepEqual(resolveCheck(imported.profile, imported.check, imported.next), expected);
    assert.deepEqual(replayCheck(imported.history[0]).receipt, state.history[0]);
});
test('replay refuses tampering or unsupported receipt version, including changed profile at the same revision', () => {
    const r = resolveCheck(profile(), check(), at()).receipt;
    for (const mutate of [r => r.schema = 2, r => r.result.total++, r => r.profile.dice.sides = 19, r => r.drawAddress.gameTime++, r => r.profileRef = 'wrong@1']) {
        const altered = clone(r); mutate(altered); assert.throws(() => replayCheck(altered));
    }
});
test('admission rejects unsupported fields, nonintegers, duplicate IDs, unavailable resources and over-budget work', () => {
    for (const mutate of [p => p.family = 'unknown', p => p.dice.count = 100, p => p.dice.sides = 1, p => p.dice.sides = 6.5,
        p => p.critical = {successFace: 20, failureFace: 20}, p => p.revision = 0, p => p.extra = true]) {
        const p = profile(); mutate(p); assert.throws(() => resolveCheck(p, check(), at()));
    }
    for (const c of [check(NaN), check(1.5), check(12, {spends: [spend()]}),
        check(12, {modifiers: [modifier('bonus', 1), modifier('bonus', 2)]}),
        check(12, {modifiers: [modifier('reroll')]}), check(12, {spends: [spend('before', 'reroll')], resources: {effort: 1}}),
        check(12, {resources: {effort: 1}, spends: [spend(), spend('after')]}),
        check(12, {requires: {all: [], any: []}}), check(12, {extra: true})]) {
        assert.throws(() => resolveCheck(profile(), c, at())); assert.throws(() => checkOdds(profile(), c));
    }
    for (const bad of [{...at(), gameTime: undefined}, {...at(), gameTime: -1}, {...at(), root: null}, {...at(), ticks: 1}])
        assert.throws(() => resolveCheck(profile(), check(), bad));
});
test('pack wraps real module matching/lock without weakening its original resolver admission', () => {
    const registry = new TagRegistry([]), data = clone(DND_CHECK_PACK_EXAMPLE);
    data.modules.push({schema: 1, id: 'example.rule', revision: 1, resolver: 'village.mix@2', kind: 'world_law',
        scope: {worldId: data.worldId, instanceId: 'example.instance', continuityId: 'example.life'},
        selector: {routes: ['mix'], subjects: [], requires: {all: []}},
        priority: {layer: 'world', depth: 0, value: 0, specificity: 0, order: 0},
        effects: [{id: 'double', channel: 'physics', kind: 'parameter', target: RULE_TARGET, combine: 'multiply', value: {numerator: 2, denominator: 1}, overrides: []}]});
    const wrapped = createCheckRulePack(data, {registry});
    const result = resolveRuleEffects(wrapped.modules, {...data.modules[0].scope, route: 'mix', facts: {}, roles: {}}, {registry});
    assert.equal(result.value.numerator, 2);
    assert.equal(wrapped.lock().profile.family, 'sum_target'); assert.equal(wrapped.lock().rulings[0].kind, 'ruling');
    assert.equal(wrapped.lock().moduleLock.resolver, 'village.mix@2');
    const copy = wrapped.profile(); copy.dice.sides = 6; assert.equal(wrapped.profile().dice.sides, 20);
    const updated = clone(data); updated.rulings[0].revision++; assert.notDeepEqual(createCheckRulePack(updated, {registry}).lock().fingerprint, wrapped.lock().fingerprint);
    data.modules[0].resolver = 'check@1'; assert.throws(() => createCheckRulePack(data, {registry}), /Unsupported rule module/);
});
test('pack rejects duplicate rulings and mismatched world, and its lock roundtrips as JSON', () => {
    const pack = createCheckRulePack(DND_CHECK_PACK_EXAMPLE, {registry: new TagRegistry([])});
    assert.deepEqual(JSON.parse(JSON.stringify(pack.lock())), pack.lock());
    const bad = clone(DND_CHECK_PACK_EXAMPLE); bad.rulings.push(bad.rulings[0]);
    assert.throws(() => createCheckRulePack(bad, {}), /Duplicate ruling/);
    bad.rulings = []; bad.modules = [{scope: {worldId: 'elsewhere'}}]; assert.throws(() => createCheckRulePack(bad, {}), /world mismatch/);
});
test('inspector requires author access, shows last N of this profile, exact odds and detached data', () => {
    const p = profile(), c = check(), receipts = [0, 1, 2].map(n => resolveCheck(p, c, at(n)).receipt);
    receipts.push(resolveCheck(cases[5][1], cases[5][2], at()).receipt);
    assert.throws(() => readCheckInspector({profile: p, check: c, receipts}), /author access/);
    const view = readCheckInspector({author: true, profile: p, check: c, receipts, limit: 2});
    assert.deepEqual(view.receipts, receipts.slice(1, 3)); assert.deepEqual(view.odds, checkOdds(p, c));
    view.receipts[0].result.total = -999; assert.notEqual(receipts[1].result.total, -999);
    assert.deepEqual(readCheckInspector({author: true, profile: p, check: c, receipts, limit: 0}).receipts, []);
    assert.throws(() => readCheckInspector({author: true, profile: p, check: c, limit: 101}));
});
