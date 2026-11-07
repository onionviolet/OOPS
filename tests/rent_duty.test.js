import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {LOTM_RENT, LOTM_RENT_ID, LOTM_DUTIES} from '../src/book_world_lotm_duties.js';
import {migrateDuties, freshDuties, settleMisses} from '../src/recurring_duties.js';
import {readOwedLedger} from '../src/owed_ledger_sources.js';
const WEEK = 10080, RENT = 60, ID = LOTM_RENT_ID;
let clock = 10, enrolled = true, purse = 0, payFails = false;
const payments = [];
registerDutySet('rent_test', {defs: LOTM_RENT, state: () => ({clock, enrolled}), active: s => s.enrolled, minute: s => s.clock,
    purse: {balance: () => purse, pay: (amount, paid) => { if(payFails) throw Error('Saving is paused.'); purse -= amount; payments.push({amount, weeks: paid.length}); }}});
registerDutySet('claim_test', {defs: LOTM_DUTIES, state: () => ({clock, enrolled}), active: s => s.enrolled, minute: s => s.clock});
const slice = () => domainRegistry.save({}).duties;
const item = () => domainRegistry.project('duties').items.find(i => i.id === ID);
const order = policy => domainRegistry.command('duties', 'setOrder')({dutyId: ID, policy});
const reset = (coins = 0, at = 10) => { clock = at; enrolled = true; purse = coins; payFails = false; payments.length = 0; domainRegistry.load({}); domainRegistry.tick(1); };
const weeks = n => { for(let i = 0; i < n; i++) { clock += WEEK; domainRegistry.tick(1); } };

test('away time: the standing order pays rent every week from the purse with no click (OB4)', () => {
    reset(10 * RENT);
    weeks(4);
    assert.equal(purse, 6 * RENT);
    assert.deepEqual(payments.map(p => p.amount), [RENT, RENT, RENT, RENT]);
    assert.equal(item().missed, 0); assert.equal(item().escalation, '');
});

test('one long jump settles all the weeks in a single debit', () => {
    reset(10 * RENT);
    clock += 3 * WEEK; domainRegistry.tick(1);
    assert.deepEqual(payments, [{amount: 3 * RENT, weeks: 3}]);
});

test('an empty purse misses each week; the notice comes after one, the landlady after two (state, not a draw)', () => {
    reset(0);
    weeks(1);
    assert.equal(slice().missed[ID], 1); assert.equal(payments.length, 0);
    assert.match(item().escalation, /note is pushed under your door/);
    assert.match(domainRegistry.project('duties').rows.find(r => r.id === `duty:${ID}`).why, /note is pushed/);
    weeks(1);
    assert.equal(slice().missed[ID], 2);
    assert.match(item().escalation, /Your landlady knocks/);
    assert.doesNotMatch(item().escalation, /note is pushed/);
});

test('back rent is cleared one week per paid week when the purse can carry it', () => {
    reset(0); weeks(2); assert.equal(slice().missed[ID], 2);
    purse = 4 * RENT; weeks(1); // pays this week and one missed week
    assert.equal(purse, 2 * RENT); assert.equal(slice().missed[ID], 1);
    weeks(1); assert.equal(slice().missed[ID], 0); assert.equal(item().escalation, '');
});

test('pay_late holds one week of grace, then pays the oldest week each week; skip misses', () => {
    reset(10 * RENT); order('pay_late');
    weeks(1); assert.equal(payments.length, 0); assert.equal(slice().missed?.[ID] ?? 0, 0);
    weeks(1); assert.equal(purse, 9 * RENT);
    weeks(2); assert.equal(purse, 7 * RENT);
    order('pay_on_time'); weeks(1); // the deferred week is released and this week paid
    assert.equal(purse, 5 * RENT); assert.equal(slice().late[ID], 0);
    order('skip'); weeks(2);
    assert.equal(slice().missed[ID], 2); assert.equal(purse, 5 * RENT);
    assert.equal(item().policy, 'skip');
});

test('pay_late with an empty purse misses once the grace week ends', () => {
    reset(0); order('pay_late');
    weeks(1); assert.equal(slice().missed?.[ID] ?? 0, 0);
    weeks(1); assert.equal(slice().missed[ID], 1);
});

test('a host that cannot take the coins now rolls the settle back and retries on a later tick', () => {
    reset(5 * RENT); payFails = true;
    clock += 2 * WEEK; domainRegistry.tick(1);
    assert.equal(purse, 5 * RENT); assert.equal(slice().missed?.[ID] ?? 0, 0);
    payFails = false; domainRegistry.tick(1);
    assert.equal(purse, 3 * RENT);
});

test('the choice is a policy, saved, validated and loaded; bad choices are refused; rent is not paid by hand', () => {
    reset(5 * RENT); order('skip');
    const env = domainRegistry.save({}); assert.equal(env.duties.policy[ID], 'skip');
    domainRegistry.validate(env); reset(5 * RENT); domainRegistry.load(JSON.parse(JSON.stringify(env)));
    assert.equal(item().policy, 'skip');
    assert.throws(() => order('bribe'), /not a choice/);
    assert.throws(() => domainRegistry.command('duties', 'setOrder')({dutyId: 'lotm.expense_claim', policy: 'skip'}), /no standing order/);
    assert.throws(() => domainRegistry.command('duties', 'attend')({dutyId: ID}), /standing order/);
});

test('old saves load with the default order; old defs without a policy behave exactly as before', () => {
    const old = {family: 'duties@1', lastDone: {a: 1}, missed: {a: 2}, closed: {a: 3}};
    assert.deepEqual(migrateDuties(old), {...old, policy: {}, late: {}});
    assert.deepEqual(migrateDuties({...old, policy: {x: 'bribe', y: 'skip'}, late: {x: -1}}).policy, {y: 'skip'});
    assert.deepEqual(freshDuties(), {family: 'duties@1', lastDone: {}, missed: {}, closed: {}, policy: {}, late: {}});
    // The weekly claim has no policy: an unattended week is one miss and no coin moves, with a purse present or not.
    reset(5 * RENT);
    weeks(2);
    const claim = domainRegistry.project('duties').items.find(i => i.id === 'lotm.expense_claim');
    assert.equal(claim.missed, 2); assert.equal(claim.policy, undefined); assert.equal(claim.standing, undefined);
    assert.equal(settleMisses(freshDuties(), LOTM_DUTIES, WEEK * 3).slice.closed['lotm.expense_claim'], 3);
});

test('an untouched life without rent writes no key', () => {
    reset(5 * RENT); enrolled = false; domainRegistry.load({}); domainRegistry.tick(1);
    assert.equal(slice(), undefined);
    assert.deepEqual(domainRegistry.project('duties'), {rows: [], items: [], enrolled: false});
});

test('the owed ledger lists the rent and the expense claim (AT10)', () => {
    reset(5 * RENT); weeks(1);
    const ids = readOwedLedger().rows.map(r => r.id);
    assert.ok(ids.includes(`duty:${ID}`)); assert.ok(ids.includes('duty:lotm.expense_claim'));
    const rent = readOwedLedger().rows.find(r => r.id === `duty:${ID}`);
    assert.match(rent.why, /Standing order: pay on time/); assert.equal(rent.creditor, 'landlady');
});
