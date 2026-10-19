import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {addPurse, commitPlanMoney, moneyLedger, moneyLedgerBinding, planMoneySource, resetMoneyLedger, setPurse} from '../src/economy_domain.js';
import {addSavedPurse, setSavedPurse} from '../src/money.js';
import {beginNativeCraftTransaction} from '../src/native_craft_transaction.js';

// ECX1 + ECL2 (ECR15/ECR16): one seam for the purse, each change one row with its named source.
test('purse writes keep their arithmetic and record a named row per change', () => {
    resetMoneyLedger();
    const hero = {money: 0};
    setPurse(hero, 102, 'new game', {baseline: true});
    addPurse(hero, -28, 'native.trade', {detail: 'Trade with villageTrader: bought 28, sold 0 coins'});
    addPurse(hero, 0, 'activity: fishing');
    addPurse(hero, 10.5, 'reward: location Forest');
    assert.equal(hero.money, 84.5, 'no rounding or range rule added');
    const view = moneyLedger();
    assert.deepEqual(view.rows.map(r => [r.source, r.delta, r.balance]), [['new game', 102, 102], ['native.trade', -28, 74], ['reward: location Forest', 10.5, 84.5]], 'zero changes add no row');
    assert.deepEqual([view.faucets, view.sinks, view.net], [{'reward: location Forest': 10.5}, {'native.trade': -28}, -17.5], 'baseline rows are not faucets');
    assert.equal(view.rows[1].detail, 'Trade with villageTrader: bought 28, sold 0 coins');
    assert.throws(() => addPurse(hero, 5), /named source/);
    assert.throws(() => setPurse(hero, 5, ''), /named source/);
    assert.equal(hero.money, 84.5, 'an unnamed write changes nothing');
    assert.deepEqual(domainRegistry.project('economy'), view, 'the registry projection is the ledger');
});

test('a window keeps rows by game minute', () => {
    resetMoneyLedger();
    const hero = {money: 0};
    addPurse(hero, 5, 'a');
    const at = moneyLedger().rows[0].at;
    assert.equal(moneyLedger({since: at + 1}).rows.length, 0);
    assert.equal(moneyLedger({since: at, until: at + 1}).rows.length, 1);
});

test('save copies are written with a source and add no row; a rolled-back batch drops its rows', () => {
    resetMoneyLedger();
    const envelope = {character: {money: 30}};
    addSavedPurse(envelope, 5, 'village career: tuition');
    setSavedPurse(envelope, envelope.character.money - 50, 'village career: kit debt');
    assert.equal(envelope.character.money, -15);
    assert.throws(() => addSavedPurse(envelope, 1), /named source/);
    assert.equal(moneyLedger().rows.length, 0);
    const hero = {money: 20};
    addPurse(hero, 1, 'kept');
    const batch = beginNativeCraftTransaction({owners: [hero], bindings: [moneyLedgerBinding]});
    addPurse(hero, -7, 'habitat');
    batch.rollback();
    assert.equal(hero.money, 21);
    assert.deepEqual(moneyLedger().rows.map(r => r.source), ['kept']);
    addPurse(hero, 2, 'after');
    assert.deepEqual(moneyLedger().rows.map(r => r.n), [1, 2], 'numbering continues from the mark');
});

test('a committed plan is named by the events it appended', () => {
    resetMoneyLedger();
    const history = [{sequence: 4, actionId: 'old.thing', label: 'old'}, {sequence: 5, actionId: 'native.trade', label: 'Trade with t: bought 3, sold 0 coins'}];
    const plan = {state: {history}, external: {money: 7}};
    assert.deepEqual(planMoneySource(plan, 4), {source: 'native.trade', detail: 'Trade with t: bought 3, sold 0 coins'});
    assert.equal(planMoneySource(plan, 5).source, 'native.plan', 'no new event: a generic name, never a stale one');
    assert.equal(planMoneySource({...plan, moneySource: 'household.hearth'}, 4).source, 'household.hearth');
    const hero = {money: 10};
    commitPlanMoney(hero, plan, 4);
    assert.equal(hero.money, 7);
    assert.deepEqual(moneyLedger().sinks, {'native.trade': -3});
});
