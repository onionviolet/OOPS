import test from 'node:test';
import assert from 'node:assert/strict';
import {defineInstitution, offerFor, auditLedger, storeView} from '../src/institution_store.js';
import {NIGHTHAWKS} from '../src/book_world_lotm_merit.js';
import {fresh, run, wait, holds, save, hostOver} from './lotm_helpers.js';
import {validateLotmState} from '../src/book_world_lotm_state.js';
import {validateLotmEnvelope} from '../src/book_world_lotm_envelope.js';
import {INGREDIENT_BY_NAME} from '../src/book_world_lotm_bench.js';

// DWF154/DWF155/DWF162: the leaf is world-neutral; the Nighthawks prove it through real timed assignments and store commands.
const row = {id: 'i', world: 'w', name: 'I', currency: {label: 'Points', unit: 'points'},
    missions: [{id: 'm', label: 'M', pay: 3, minutes: 10, issuer: 'elder', risk: 'none', text: 'done'}],
    store: [{id: 'a', label: 'A', kind: 'item', price: 5, stock: 2}, {id: 'b', label: 'B', kind: 'technique', price: 1, gate: {rule: {fact: 'rank', op: 'gte', value: 2}, text: 'Needs rank 2.'}, text: 't'}]};
const withText = {...row, store: row.store.map(r => ({text: 'x', ...r}))};

test('an institution validates and freezes; malformed rows fail loudly', () => {
    const inst = defineInstitution(withText);
    assert.ok(Object.isFrozen(inst) && Object.isFrozen(inst.store[0]));
    assert.throws(() => defineInstitution({...withText, store: [{...withText.store[0], price: 0}]}), /price/);
    assert.throws(() => defineInstitution({...withText, store: [{...withText.store[0], kind: 'sword'}]}), /kind/);
    assert.throws(() => defineInstitution({...withText, missions: [{...withText.missions[0], pay: 0}]}), /pays/);
    assert.throws(() => defineInstitution({...withText, store: [withText.store[0], withText.store[0]]}), /Duplicate/);
});

test('an offer explains every refusal: cost, stock and gate', () => {
    const inst = defineInstitution(withText);
    const a = offerFor(inst, 'a', {balance: 4}); assert.equal(a.eligible, false); assert.match(a.reasons[0], /costs 5 points; you hold 4/);
    assert.equal(offerFor(inst, 'a', {balance: 9, bought: 2}).reasons[0], 'The store has none left.');
    assert.equal(offerFor(inst, 'a', {balance: 9, bought: 1}).left, 1);
    assert.equal(offerFor(inst, 'b', {balance: 9, facts: {rank: 1}}).reasons[0], 'Needs rank 2.');
    assert.equal(offerFor(inst, 'b', {balance: 9, facts: {rank: 2}}).eligible, true);
    assert.equal(storeView(inst, {balance: 9, facts: {rank: 2}, boughtBy: {a: 2}}).map(o => o.eligible).join(), 'false,true');
    assert.throws(() => offerFor(inst, 'zz', {balance: 1}), /stocks no/);
});

test('the ledger audit is the one rule: spent never passes earned', () => {
    assert.equal(auditLedger({earned: 5, spent: 2}), 3);
    assert.throws(() => auditLedger({earned: 1, spent: 2}), /passes earned/);
    assert.throws(() => auditLedger({earned: 1.5, spent: 0}), /whole/);
});

// Nighthawks: assignments take time and pay merit, the store spends it, refusals are real, stock is finite, saves stay valid.
const ok = p => { assert.ok(validateLotmState(p.state)); assert.ok(validateLotmEnvelope(save(p))); };
const merit = p => hostOver(p).host.view().merit;
const pass = (p, minutes) => { const to = p.state.clock + minutes; for(let i = 0; p.state.clock < to && i < 40; i++) p = wait(p, to - p.state.clock); return p; };

test('Nighthawk merit: an assignment is a real timed action, the formula and ingredients cost merit, stock runs out', () => {
    let p = run(fresh(500), 'report_in');
    assert.equal(merit(p).balance, 0);
    assert.throws(() => run(p, 'merit_buy_sun_8_sheet'), 'broke: no merit');
    p = run(p, 'merit_case_file_copy'); assert.equal(merit(p).balance, 0, 'nothing is paid before the 30 minutes are done');
    p = pass(p, 30); assert.equal(merit(p).balance, 1);
    for(let i = 0; i < 4; i++) { p = run(p, 'merit_cold_room_watch'); p = pass(p, 60); }
    assert.equal(merit(p).balance, 9); ok(p);
    p = run(p, 'merit_buy_sunflower_lot'); assert.equal(merit(p).balance, 6); assert.equal(holds(p, INGREDIENT_BY_NAME['Crystal sunflower'].key), 1); ok(p);
    p = run(p, 'merit_buy_sunflower_lot'); assert.throws(() => run(p, 'merit_buy_sunflower_lot'), 'third lot: none left');
    assert.equal(merit(p).store.find(r => r.id === 'sunflower_lot').left, 0);
    assert.equal(merit(p).balance, 3); assert.throws(() => run(p, 'merit_buy_sun_8_sheet'), 'the sheet costs 8 and 3 are held');
    assert.match(merit(p).store.find(r => r.id === 'sun_8_sheet').reasons[0], /costs 8 merit; you hold 3/);
    for(let i = 0; i < 3; i++) { p = run(p, 'merit_cold_room_watch'); p = pass(p, 60); }
    p = run(p, 'merit_buy_sun_8_sheet'); assert.equal(merit(p).balance, 1); ok(p);
    assert.throws(() => run(p, 'merit_buy_sun_8_sheet'));
    assert.equal(p.state.actors.player.facts['book.lotm.bf.sun_8.formula'], true);
    assert.equal(merit(p).earned - merit(p).spent, merit(p).balance);
});

test('only the Evernight home sees merit; the sheet only appears once', () => {
    const p = run(fresh(500, 'probationer'), 'report_in');
    assert.ok(merit(p));
    assert.equal(NIGHTHAWKS.store.length, 2);
});

// Sect Library: the existing CP and shelving mission are the institution's ledger and mission; the treasure hall is the store.
import * as R from '../src/book_world_primordial_credit.js';
const shift = (s, day) => { const t = day * R.DAY; return R.settle(R.startShift(s, t).state, t + R.DIALS.taskMinutes.value); };

test('Sect: shelving earns CP over days, the hall spends it atomically, stock and the 300 CP technique refuse with reasons', () => {
    let s = R.fresh();
    assert.equal(R.buy(s, 'fire_grass').ok, false); assert.match(R.buy(s, 'fire_grass').reasons[0], /costs 8 CP; you hold 0/);
    s = shift(shift(s, 1), 2); assert.equal(s.cp, 8);
    const out = R.buy(s, 'fire_grass'); assert.equal(out.ok, true); assert.equal(out.state.cp, 0); assert.equal(out.state.store.spent, 8); assert.equal(out.state.store.bought.fire_grass, 1);
    assert.equal(s.cp, 8, 'the input state is untouched'); assert.equal(R.buy(out.state, 'fire_grass').ok, false);
    let t = {...out.state, cp: 100};
    for(let i = 0; i < 3; i++) t = R.buy(t, 'fire_grass').state ?? t;
    assert.equal(t.store.bought.fire_grass, 3); assert.equal(R.buy(t, 'fire_grass').reasons[0], 'The store has none left.');
    const rich = {...R.fresh(), cp: 300}; const c = R.buy(rich, 'killing_life_curse');
    assert.equal(c.state.held[R.CURSE], 'issued'); assert.equal(c.state.cp, 0); assert.equal(R.buy(c.state, 'killing_life_curse').ok, false);
    assert.match(R.buy({...R.fresh(), cp: 299}, 'killing_life_curse').reasons[0], /costs 300 CP; you hold 299/);
    assert.throws(() => R.buy(R.fresh(), 'nope'), /stocks no|no such/);
});

test('Sect: the store slice round-trips, an old slice without it loads, and a bad record is refused', () => {
    const bought = R.buy({...R.fresh(), cp: 30}, 'breath_primer').state;
    assert.equal(R.validateSlice(JSON.parse(JSON.stringify(bought))).store.spent, 20);
    const old = JSON.parse(JSON.stringify({...R.fresh(), cp: 5})); delete old.store;
    assert.deepEqual(R.migrate(old).store, {spent: 0, bought: {}}); assert.doesNotThrow(() => R.validateSlice(old));
    assert.throws(() => R.validateSlice({...bought, store: {spent: 20, bought: {fire_grass: 9}}}), /purchase/);
    assert.throws(() => R.validateSlice({...bought, store: {spent: -1, bought: {}}}), /record/);
    assert.equal(R.isEmpty(R.fresh()), true); assert.equal(R.isEmpty(bought), false);
});
