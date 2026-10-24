import test from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/pledges.js';

const skilled = {combat: 1};
test('vows steady the trial, a failed attempt wakes the heart demon, calm and rations pay it down', () => {
    let s = P.vowTake(P.fresh(), 'long-watch', 0);
    const plain = P.trialView(P.fresh(), skilled).risk;
    assert.equal(P.trialView(s, skilled).risk, plain - 40, 'one kept vow steadies the attempt');
    s = P.vowBreak(s, 'long-watch', 5);
    assert.equal(P.trialView(s, skilled).risk, plain + 40, 'its scar worsens it');
    const failed = P.attempt(s, {roll: 0, units: 0, skills: skilled});
    assert.deepEqual([failed.passed, failed.state.trial.stage, failed.state.trial.pressure], [false, 0, 2]);
    assert.ok(P.buckets(failed.state, 0).heart_demon.strength < 1);
    const eased = P.calm(failed.state);
    assert.equal(eased.trial.pressure, 1);
    const paid = P.attempt(eased, {roll: 999, units: 5, skills: skilled});
    assert.deepEqual([paid.passed, paid.spent, paid.state.trial.stage], [true, 5, 1]);
    assert.equal(P.buckets(paid.state, 0).tempering.strength, 1.03);
    assert.throws(() => P.attempt(P.fresh(), {roll: 999, units: 0, skills: {}}), /not ready/);
    const view = P.trialView(P.fresh(), {});
    assert.equal(view.ready, false); assert.ok(view.shown.length);
});

test('the rune bench: pair knowledge comes only from two-rune tablets; the worn talisman expires and its price is real', () => {
    let s = P.fresh();
    const long = P.carve(s, ['ember', 'gale', 'root'], 100);
    assert.deepEqual(long.state.runes.pairs, [], 'a long strip does not reveal its pairs');
    assert.deepEqual(P.buckets(long.state, 110).talisman.max_stamina > 1, true);
    const two = P.carve(s, ['root', 'ember'], 100);
    assert.deepEqual(two.state.runes.pairs.map(p => [p.a, p.b, p.effect]), [['root', 'ember', 'fizzle']]);
    assert.ok(P.buckets(two.state, 110).talisman.agility < 1, 'a bad pairing dulls the feet');
    assert.equal(P.buckets(two.state, 100 + 120).talisman, undefined, 'it expires');
    assert.equal(P.expire(two.state, 220).talisman, null);
    assert.equal(P.runeView(two.state).coverage.tried, 1);
});

test('the slice round-trips, migrates absent to fresh, and rejects tampering', () => {
    let s = P.vowTake(P.fresh(), 'open-hand', 3);
    s = P.attempt(s, {roll: 0, units: 0, skills: skilled}).state;
    s = P.carve(s, ['gale', 'tide'], 9).state;
    assert.deepEqual(P.migrate(JSON.parse(JSON.stringify(s))), s);
    assert.ok(P.isFresh(P.migrate(null)));
    const bad = structuredClone(s); bad.talisman.effects.nonsense = 3;
    assert.throws(() => P.validate(bad), /Unknown talisman effect/);
    const bad2 = structuredClone(s); bad2.trial.stage = 9;
    assert.throws(() => P.validate(bad2), /tempering/);
});

test('domain: save omits an untouched slice, commands run through ports and publish stat buckets, rollback on a failed save', async () => {
    await import('../src/pledges_domain.js');
    const D = await import('../src/pledges_domain.js');
    const {domainRegistry} = await import('../src/domain_registry.js');
    const bread = {count: 5}, wood = {count: 0}, multiplier = {};
    const owner = {bread};
    let failSave = false;
    const actor = {getLevelableComponent: () => ({stats: {multiplier}}), getFullStats: () => ({health: 5, stamina: 5, max_health: 10, max_stamina: 10}), updateStatsAndDisplay() {}};
    D.configurePledges({actor: () => actor, clock: () => 100, idle: () => true, count: id => id === 'Stale bread' ? bread.count : wood.count, assertSpend() {},
        removeItem: (id, n) => { if(id === 'Stale bread') bread.count -= n; else wood.count -= n; }, itemOwners: () => [owner, bread, wood],
        persist: cb => { if(failSave) throw Error('disk full'); cb(); }, random: () => 0.9, logMessage() {}, refresh() {}, skillLevel: () => 2});
    domainRegistry.load({});
    assert.equal(domainRegistry.save({}).pledges, undefined);
    D.commands.takeVow('long-watch');
    assert.ok(multiplier.vow_oath.strength > 1, 'the vow reaches the hero');
    const r = D.commands.temper(5);
    assert.equal(r.passed, true); assert.equal(bread.count, 0);
    assert.ok(multiplier.tempering.strength > 1);
    failSave = true;
    assert.throws(() => D.commands.calm(), /not|weighs|disk/);
    failSave = false; bread.count = 3;
    const before = D.pledgesState();
    failSave = true;
    wood.count = 4;
    assert.throws(() => D.commands.carve(['ember', 'gale']), /disk full/);
    assert.equal(wood.count, 4, 'wood is refunded on rollback'); assert.deepEqual(D.pledgesState(), before);
    failSave = false;
    D.commands.carve(['ember', 'gale']);
    assert.equal(wood.count, 2);
    const saved = domainRegistry.save({});
    assert.equal(saved.pledges.family, 'progression.pledges@1');
    domainRegistry.validate(saved); domainRegistry.load({}); assert.equal(D.pledgesState().trial.stage, 0);
    domainRegistry.load(saved); assert.equal(D.pledgesState().trial.stage, 1);
    assert.ok(multiplier.talisman.max_stamina > 1);
});
