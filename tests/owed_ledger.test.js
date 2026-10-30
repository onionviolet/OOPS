import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {owedLedgerView, gatherOwed, owedRow, EMPTY_TEXT} from '../src/owed_ledger_view.js';
import {careerRows} from '../src/owed_ledger_sources.js';
import {renderOwedLedger} from '../src/ui/owed_ledger.js';
import {OWED_EMPTY, OWED_MIXED} from '../src/ui/preview/fixtures/economy.js';
import * as standing from '../src/economy_standing.js';

const viewOf = (fx, opts = {}) => owedLedgerView({...gatherOwed(fx), ...opts});

test('a fresh life shows the empty text that says how to fill the tab (UR32)', () => {
    const v = viewOf(OWED_EMPTY);
    assert.equal(v.total, 0); assert.equal(v.empty, EMPTY_TEXT); assert.match(v.empty, /borrow from a house/);
});

test('live figures win over stale ledger rows: interest, due dates, eased grudge', () => {
    const v = viewOf(OWED_MIXED);
    const byId = Object.fromEntries(v.rows.map(r => [r.id, r]));
    assert.equal(byId['credit:market_circle'].amount, 11);
    assert.equal(byId['credit:market_circle'].dueText, 'due in 25 days');
    assert.equal(byId['credit:gutter_crews'].dueText, 'overdue');
    assert.equal(byId['craft:verge-grudge'].amount, 2);
    assert.equal(byId['claim:3'].direction, 'owed');
    assert.equal(byId['claim:3'].effect, 'The broker owes you 12 coins, due in 2 days.');
    assert.equal(v.rows[0].id, 'credit:gutter_crews', 'overdue first');
    assert.match(v.summary, /You owe 4 accounts \(42 coins\)\. Owed to you: 1 account \(12 coins\)\. Next date: the Gutter Crews, overdue\./);
});

test('filters count every account and narrow without losing the total', () => {
    const v = viewOf(OWED_MIXED, {filter: 'owed'});
    const count = id => v.filters.find(f => f.id === id)?.count;
    assert.equal(count('all'), 5); assert.equal(count('owe'), 4); assert.equal(count('owed'), 1); assert.equal(count('due'), 3);
    assert.equal(count('grievance'), 1); assert.equal(count('favor'), undefined, 'absent kinds are absent, not greyed');
    assert.deepEqual(v.rows.map(r => r.id), ['claim:3']);
    const none = viewOf({...OWED_MIXED, standing: {...OWED_MIXED.standing, claims: [], ledger: OWED_MIXED.standing.ledger.filter(r => r.id !== 'claim:3')}}, {filter: 'owed'});
    assert.match(none.empty, /Choose All to see 4 accounts/);
});

test('the inspector names why, since, heir carry and where to settle', () => {
    const r = viewOf(OWED_MIXED, {selected: 'credit:market_circle'}).selected;
    assert.equal(r.effect, 'You owe the Market Circle 11 coins, due in 25 days.');
    assert.equal(r.since, 'Since: 3 days ago.');
    assert.match(r.carries, /Passes to an heir/);
    assert.match(r.settle, /Standing and ledger → Credit/);
});

test('parties read from the controlled actor, not a literal id', () => {
    const r = owedRow({id: 'x', kind: 'favor', debtor: 'seat_b', creditor: 'mill', amount: 1, why: 'w', source: 's', eases: 0, carries: false}, {actorId: 'seat_b'});
    assert.equal(r.direction, 'owe'); assert.equal(r.effect, 'You owe mill a favour, no set date.');
});

test('a real loan from the standing rules reaches the tab with its date', () => {
    let s = standing.fresh();
    s = standing.takeLoan(s, 'market_circle', 10, 0);
    const now = 3 * standing.DAY;
    const projection = {now, ledger: s.ledger.rows, claims: s.claims,
        factions: Object.keys(standing.FACTIONS).map(id => ({id, label: standing.FACTIONS[id].label, loan: s.loans[id] ? standing.loanStatus(s.loans[id], now) : null}))};
    const v = owedLedgerView(gatherOwed({standing: projection}));
    assert.equal(v.total, 1);
    assert.equal(v.rows[0].dueText, 'due in 25 days');
    assert.ok(v.rows[0].amount > 10, 'interest accrued since the row was written');
});

test('a kit due back is a duty; a kept kit is the career debt', () => {
    assert.deepEqual(careerRows({loan: {status: 'return_due', completed: true}, debt: 0}).map(r => r.kind), ['duty']);
    assert.deepEqual(careerRows({loan: {status: 'debt', completed: true}, debt: 5}).map(r => r.kind), ['coin']);
    assert.deepEqual(careerRows(undefined), []);
});

test('the tab renders text for every state and reports filter and selection', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const host = dom.document.getElementById('h');
    renderOwedLedger(host, viewOf(OWED_EMPTY));
    assert.match(host.querySelector('[data-owed="empty"]').textContent, /No one owes you/);
    host.replaceChildren();
    const picked = [];
    renderOwedLedger(host, viewOf(OWED_MIXED, {selected: 'claim:3'}), {onFilter: id => picked.push(['f', id]), onSelect: id => picked.push(['s', id])});
    assert.equal(host.querySelectorAll('[data-owed-row]').length, 5);
    assert.match(host.querySelector('[data-owed="inspector"]').textContent, /Settle: The broker pays/);
    assert.equal(host.querySelector('[data-owed-row="credit:gutter_crews"]').hasAttribute('data-overdue'), true);
    host.querySelector('[data-owed-filter="owe"]').onclick();
    host.querySelector('[data-owed-row="claim:3"] button').onclick();
    assert.deepEqual(picked, [['f', 'owe'], ['s', null]]);
});
