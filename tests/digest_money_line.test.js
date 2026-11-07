import test from 'node:test';
import assert from 'node:assert/strict';
import {returnDigest, moneyLines, coinWords} from '../src/return_digest.js';
import {createReturnDigestRow} from '../src/return_digest_ui.js';
import {LOTM_RENT, LOTM_RENT_ID} from '../src/book_world_lotm_duties.js';
import {freshDuties, settleDues, setPolicy} from '../src/recurring_duties.js';
import {bare, registry} from './lotm_helpers.js';

// OB6: the weekly money line, derived from the duties slice and the owed rows; no save key, one line per world.
const WEEK = 10080, RENT = 60;
const base = bare(50).state;
const state = clock => ({...structuredClone(base), clock});
// Real settlement of n weeks from the opening week, so the slice is what the duties domain would hold.
function settle(weeks, coins, {policy} = {}) {
    let slice = freshDuties(); const defs = LOTM_RENT;
    if (policy) slice = setPolicy(slice, defs, LOTM_RENT_ID, policy);
    slice = settleDues(slice, defs, 10, 0).slice; // starts tracking at the life's first minute
    const r = settleDues(slice, defs, 10 + weeks * WEEK, coins);
    return r.slice;
}
const lotm = (slice, extra = {}) => ({world: 'lotm', defs: LOTM_RENT, slice, fmt: coinWords(), ...extra});
const digest = (seenAt, clock, money) => returnDigest(state(clock), registry, {facts: {}, seenAt, money});

test('two weeks away with rent paid on time gives one money line with the right total', () => {
    const slice = settle(2, 10 * RENT), d = digest(10, 10 + 2 * WEEK, [lotm(slice)]);
    assert.equal(d.visible, true);
    assert.deepEqual(d.money.lines, [{world: 'lotm', text: 'Rent and dues paid: 10 soli.'}]);
    assert.deepEqual(d.money.exceptions, []);
    assert.match(d.text, /Rent and dues paid: 10 soli\./);
});

test('a missed week is an exception and stays out of the total; wages owed to you join the line', () => {
    const slice = settle(2, RENT), owed = [{id: 'wage:x', kind: 'coin', debtor: 'nighthawks', creditor: 'player', amount: 3 * 240}];
    const m = digest(10, 10 + 2 * WEEK, [lotm(slice, {owed})]).money;
    assert.equal(m.lines[0].text, 'Rent and dues paid: 5 soli. Wages owed to you: 3 pounds.');
    assert.equal(m.exceptions.length, 1);
    assert.match(m.exceptions[0].text, /Rent missed once \(5 soli unpaid\)/);
    const fined = digest(10, 10 + 2 * WEEK, [lotm(slice, {owed: [{id: 'fine:yard', kind: 'coin', debtor: 'player', creditor: 'yard', amount: 30}]})]).money;
    assert.ok(fined.exceptions.some(e => e.kind === 'fined' && e.text === 'Fined 2 soli 6 pence'));
    assert.doesNotMatch(fined.lines.map(l => l.text).join(' '), /Fined/);
});

test('a Frontier life shows its own line in its own coins, not the LOTM one', () => {
    const defs = [{id: 'f.dues', schedule: {period: WEEK, opens: 0, closes: WEEK}, debtor: 'player', creditor: 'mira', source: 'f', why: 'Tithe',
        dues: {amount: 2, lateCycles: 1, steps: []}}];
    let slice = settleDues(freshDuties(), defs, 10, 0).slice; slice = settleDues(slice, defs, 10 + WEEK, 9).slice;
    const fmt = n => `${n} coin${n === 1 ? '' : 's'}`;
    const m = digest(10, 10 + WEEK, [{world: 'frontier', defs, slice, fmt, paidLabel: 'Tithe paid'}]).money;
    assert.deepEqual(m.lines, [{world: 'frontier', text: 'Tithe paid: 2 coins.'}]);
    assert.doesNotMatch(JSON.stringify(m), /soli|pound|Rent/);
});

test('failure scenario: an untouched life, a life with no dues, or no time passed shows no money line', () => {
    assert.deepEqual(digest(10, 10 + 2 * WEEK, [lotm(freshDuties())]).money, {lines: [], exceptions: []});
    assert.deepEqual(digest(10, 10 + 2 * WEEK, null).money, {lines: [], exceptions: []});
    assert.deepEqual(moneyLines([lotm(settle(2, 10 * RENT))], {seenAt: 500, clock: 500}), {lines: [], exceptions: []});
    assert.deepEqual(moneyLines([{world: 'x', defs: [], slice: {}}], {seenAt: 0, clock: WEEK * 3}), {lines: [], exceptions: []});
    const d = digest(10, 10 + 2 * WEEK, null);
    assert.equal(d.visible, false); assert.equal(d.text, '');
});

test('the line is derived on read: the inputs are not changed and a short span stays hidden', () => {
    const slice = settle(2, 10 * RENT), before = JSON.stringify(slice);
    digest(10, 10 + 2 * WEEK, [lotm(slice)]);
    assert.equal(JSON.stringify(slice), before);
    assert.equal(digest(10 + WEEK, 10 + WEEK + 30, [lotm(slice)]).visible, false, 'under the digest dial');
});

test('coin words use the world currency', () => {
    const f = coinWords();
    assert.equal(f(0), '0 pence'); assert.equal(f(1), '1 penny'); assert.equal(f(40), '3 soli 4 pence'); assert.equal(f(480), '2 pounds');
    assert.throws(() => f(-1));
});

test('the digest row shows the money line and its exceptions', () => {
    const els = [], doc = {createElement: tag => { const e = {tag, children: [], dataset: {}, hidden: false, textContent: '', addEventListener() {}, append(...c) { this.children.push(...c); }, replaceChildren(...c) { this.children = c; }, setAttribute() {}}; els.push(e); return e; }};
    const row = createReturnDigestRow({doc, markRead() {}});
    row.update(digest(10, 10 + 2 * WEEK, [lotm(settle(2, RENT))]));
    const p = els.find(e => e.className === 'return-digest-money');
    assert.equal(p.hidden, false);
    assert.equal(p.textContent, 'Rent and dues paid: 5 soli. Rent missed once (5 soli unpaid).');
});
