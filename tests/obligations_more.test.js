// W11-A: more standing orders (OB1), seizure (OB2) and authority-gated duties (OB8) on the duties@1 domain.
import test from 'node:test';
import assert from 'node:assert/strict';
import {domainRegistry} from '../src/domain_registry.js';
import {registerDutySet} from '../src/duties_domain.js';
import {registerAuthoritySource, registerKnownness} from '../src/authority.js';
import {LOTM_RENT, LOTM_RENT_ID} from '../src/book_world_lotm_duties.js';
import {planSeizure, migrateDuties, freshDuties, allowedOf, policyOption} from '../src/recurring_duties.js';
const WEEK = 10080, RENT = 60, DAY = 1440, ID = LOTM_RENT_ID;
const base = LOTM_RENT[0];
const OFFICIAL = {...base, id: 't.permit', official: true, policy: {default: 'pay_on_time'}};
const WILDS = {...base, id: 't.levy', authority: 'obw', registered: false, policy: {default: 'skip'}};
let current = '', clock = 10, purse = 0, draws = () => 0.5, here = true, goods = [], place = 'town';
const paid = [], taken = [];
const mk = (name, defs, extra = {}) => registerDutySet(name, {defs, state: () => ({clock}), active: () => current === name, minute: s => s.clock, draw: k => draws(k),
    purse: {balance: () => purse, pay: (amount, list) => { purse -= amount; paid.push({amount, list}); }}, ...extra});
mk('rent', LOTM_RENT, {seize: {present: () => here, goods: () => goods, take: (picks, plan) => { taken.push({picks, plan}); }}});
mk('official', [OFFICIAL]);
const SLOW = {...base, id: 't.slow', dues: {...base.dues, dispute: {delayDays: 20}}};
mk('slow', [SLOW]);
mk('wilds', [WILDS], {place: () => place});
registerAuthoritySource('obw', (_s, {place: p}) => p === 'town' ? {claimant: 'council', inBounds: true} : null);
registerKnownness('council', () => [{id: 'seen', weight: 1, text: 'seen'}]);
const slice = () => domainRegistry.save({}).duties ?? freshDuties();
const item = id => domainRegistry.project('duties').items.find(i => i.id === id);
const reset = (name, coins = 0) => { current = name; clock = 10; purse = coins; draws = () => 0.5; here = true; goods = []; place = 'town'; paid.length = 0; taken.length = 0; domainRegistry.load({}); domainRegistry.tick(1); };
const weeks = n => { for(let i = 0; i < n; i++) { clock += WEEK; domainRegistry.tick(1); } };
const order = (dutyId, policy) => domainRegistry.command('duties', 'setOrder')({dutyId, policy});

test('the select lists the new choices with their in-world cost, from data; bribe is not offered to a landlady', () => {
    reset('rent', 10 * RENT); weeks(1);
    const labels = item(ID).policies.map(p => p.id);
    assert.deepEqual(labels, ['pay_on_time', 'pay_late', 'pay_part', 'dispute', 'skip']);
    assert.match(item(ID).policies.find(p => p.id === 'dispute').label, /held 3 days/);
    assert.match(policyOption(base, 'pay_part'), /50% a week/);
    assert.throws(() => order(ID, 'bribe'), /not a choice/);
    assert.deepEqual(allowedOf(OFFICIAL).slice(-1), ['bribe']);
    reset('official', 10 * RENT); weeks(1);
    assert.ok(item('t.permit').policies.some(p => p.id === 'bribe' && /to the official/.test(p.label)));
});

test('pay_part pays its share each week and the rest builds into a missed week', () => {
    reset('rent', 20 * RENT); order(ID, 'pay_part');
    weeks(1); assert.equal(purse, 20 * RENT - 30); assert.equal(slice().missed?.[ID] ?? 0, 0); assert.equal(slice().short[ID], 30);
    weeks(1); assert.equal(purse, 20 * RENT - 60); assert.equal(slice().missed[ID], 1); assert.equal(slice().short?.[ID] ?? 0, 0);
    weeks(2); assert.equal(slice().missed[ID], 2); assert.equal(purse, 20 * RENT - 120);
    reset('rent', 0); order(ID, 'pay_part'); weeks(1);
    assert.equal(slice().missed[ID], 1, 'a purse that cannot carry even the part misses the whole week');
});

test('a dispute holds one week, is answered once after the delay, and a seeded draw grants a cut or not, with its reason', () => {
    reset('rent', 20 * RENT); order(ID, 'dispute'); draws = () => 0.1; // granted
    weeks(1);
    assert.equal(purse, 20 * RENT); assert.equal(slice().missed?.[ID] ?? 0, 0);
    assert.equal(slice().dispute[ID].answerAt, WEEK + 3 * DAY); assert.ok(item(ID).dispute);
    order(ID, 'pay_on_time');
    weeks(1); // answered 3 days into the second week, then week two paid in full
    assert.equal(purse, 20 * RENT - 30 - 60);
    assert.equal(slice().dispute, undefined, 'it resolves once and is gone');
    assert.equal(slice().last[ID].granted, true); assert.match(slice().last[ID].line, /halved/);
    weeks(2); assert.equal(purse, 20 * RENT - 30 - 3 * 60, 'no second payment for the same dispute');
    reset('rent', 20 * RENT); order(ID, 'dispute'); draws = () => 0.9; weeks(1); order(ID, 'pay_on_time'); weeks(1);
    assert.equal(purse, 20 * RENT - 120); assert.equal(slice().last[ID].granted, false); assert.match(slice().last[ID].line, /in full/);
});

test('a dispute still open holds only one week; the weeks after it count as missed', () => {
    reset('slow', 20 * RENT); order(SLOW.id, 'dispute'); draws = () => 0.9;
    weeks(3); // answer lands 20 days after week one closes
    assert.equal(slice().missed[SLOW.id], 2); assert.equal(slice().dispute[SLOW.id].cycle, 0);
    weeks(1); assert.equal(slice().last[SLOW.id].kind, 'dispute'); assert.equal(slice().dispute[SLOW.id].cycle, 3, 'answered once, then a fresh hold');
});

test('the dispute outcome does not depend on how the weeks are ticked', () => {
    const run = step => { reset('rent', 20 * RENT); order(ID, 'dispute'); draws = () => 0.9; if(step) weeks(4); else { clock += 4 * WEEK; domainRegistry.tick(1); } order(ID, 'skip'); weeks(0); return {purse, s: slice()}; };
    const a = run(true), b = run(false);
    assert.deepEqual(a.s.last, b.s.last); assert.equal(a.s.missed?.[ID] ?? 0, b.s.missed?.[ID] ?? 0);
});

test('bribe: an official takes a share each week; a seeded refusal keeps the money and the week is missed', () => {
    reset('official', 20 * RENT); order('t.permit', 'bribe');
    weeks(3); assert.equal(purse, 20 * RENT - 3 * 36); assert.equal(slice().missed?.['t.permit'] ?? 0, 0);
    reset('official', 20 * RENT); order('t.permit', 'bribe'); draws = () => 0.01; weeks(1);
    assert.equal(purse, 20 * RENT - 36); assert.equal(slice().missed['t.permit'], 1); assert.equal(slice().last['t.permit'].kind, 'bribe_refused');
});

test('skip then seizure: at 6 missed weeks goods worth the arrears go, cheapest first, never worn or quest items, only while present', () => {
    const held = [{key: 'sword', name: 'sword', value: 1000, qty: 1, equipped: true}, {key: 'relic', name: 'relic', value: 500, qty: 1, quest: true},
        {key: 'lamp', name: 'lamp', value: 300, qty: 2}, {key: 'rag', name: 'rag', value: 50, qty: 2}, {key: 'bread', name: 'bread', value: 100, qty: 1}];
    reset('rent', 0); goods = held; order(ID, 'skip'); here = false;
    weeks(6);
    assert.equal(slice().missed[ID], 6); assert.equal(taken.length, 0, 'away: nothing is taken');
    assert.match(item(ID).seizureWaiting, /when you are back/);
    here = true; domainRegistry.tick(1);
    assert.equal(taken.length, 1);
    assert.deepEqual(taken[0].picks.map(p => [p.key, p.qty]), [['rag', 2], ['bread', 1], ['lamp', 1]]);
    assert.equal(taken[0].plan.taken, 500); assert.equal(slice().missed?.[ID] ?? 0, 0);
    assert.equal(slice().last[ID].kind, 'seizure'); assert.match(slice().last[ID].line, /Your landlady's men took 2 x rag, 1 x bread, 1 x lamp/);
    assert.equal(item(ID).seizureWaiting, undefined);
    domainRegistry.tick(1); assert.equal(taken.length, 1, 'taken once');
});

test('seizure takes what it can when goods fall short, clears only the weeks covered, and nothing when only worn items remain', () => {
    const part = planSeizure(base.dues ? base : base, 6, [{key: 'a', name: 'a', value: 70, qty: 2}]);
    assert.equal(part.taken, 140); assert.equal(part.weeks, 2);
    assert.equal(planSeizure(base, 6, [{key: 'w', value: 900, qty: 1, equipped: true}, {key: 'q', value: 900, qty: 1, quest: true}]), null);
    assert.equal(planSeizure(base, 5, [{key: 'a', value: 10, qty: 9}]), null, 'below the dial nothing is taken');
    reset('rent', 0); goods = [{key: 'sword', value: 900, qty: 1, equipped: true}]; order(ID, 'skip'); weeks(7);
    assert.equal(taken.length, 0); assert.equal(slice().missed[ID], 7);
});

test('a duty naming an authority is inactive where no claimant knows or reaches the player; its weeks close unaccounted', () => {
    reset('wilds'); weeks(2);
    assert.equal(slice().missed['t.levy'], 2, 'in town the council knows and reaches: weeks are owed');
    place = 'wilds'; weeks(3);
    assert.equal(slice().missed['t.levy'], 2, 'in the wilds the weeks close with no miss');
    assert.equal(item('t.levy'), undefined);
    place = 'town'; weeks(1);
    assert.equal(slice().missed['t.levy'], 3, 'only the week back in town counts');
});

test('Tingen rent names no authority and is unchanged; old saves load byte-identical (no new keys)', () => {
    assert.equal(base.authority, undefined);
    const old = {family: 'duties@1', lastDone: {a: 1}, missed: {a: 2}, closed: {a: 3}, policy: {x: 'skip'}, late: {}};
    assert.deepEqual(migrateDuties(old), {...old}); assert.deepEqual(freshDuties(), {family: 'duties@1', lastDone: {}, missed: {}, closed: {}, policy: {}, late: {}});
    assert.equal(migrateDuties({...old, dispute: {a: {cycle: 1, answerAt: 5}, b: {cycle: -1}}, short: {a: 4}, last: {a: {kind: 'seizure', at: 3, line: 'x'}, b: {}}}).dispute.b, undefined);
    reset('rent', 10 * RENT); weeks(2);
    const s = slice(); assert.equal(s.short, undefined); assert.equal(s.dispute, undefined); assert.equal(s.last, undefined);
    const env = domainRegistry.save({}); domainRegistry.validate(env); reset('rent', 0); domainRegistry.load(JSON.parse(JSON.stringify(env)));
});

test('new fields round-trip through save and load', () => {
    reset('rent', 20 * RENT); order(ID, 'dispute'); weeks(1);
    const env = domainRegistry.save({}); assert.ok(env.duties.dispute[ID]);
    domainRegistry.validate(env); reset('rent', 20 * RENT); domainRegistry.load(JSON.parse(JSON.stringify(env)));
    assert.ok(slice().dispute[ID]);
});
