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

test('round 2: a credit row carries its term bar, late terms and the house ladder with causes', () => {
    const terms = {tiers: ['Hostile', 'Cold', 'Neutral', 'Friendly', 'Honoured'], cuts: [-60, -20, 20, 60], grace: 3, ratchet: 0.02, defaulted: 6, paid: 3};
    const fx = {...OWED_MIXED, terms, standing: {...OWED_MIXED.standing, credit: [{factionId: 'market_circle', termDays: 28}],
        factions: OWED_MIXED.standing.factions.map(f => f.id === 'market_circle' ? {...f, score: 12} : f),
        deeds: [{deed: 'trade', moves: [{id: 'market_circle', amount: 2}, {id: 'gutter_crews', amount: -1.2, backlash: true}]}]}};
    const r = owedLedgerView({...gatherOwed(fx), selected: 'credit:market_circle'}).selected;
    assert.equal(Math.round(r.termLeft * 28), 25);
    assert.match(r.late, /after 3 days of grace the rate rises 2 points .* standing drops 6/);
    assert.equal(r.house.text, 'Standing with the Market Circle: Neutral (12). 8 more reaches Friendly; paying a loan in full on time adds 3.');
    assert.deepEqual(r.house.rungs.filter(x => x.current).map(x => x.label), ['Neutral']);
    assert.equal(r.house.causes, 'Recent: +2 for trade.');
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const host = dom.document.getElementById('h');
    renderOwedLedger(host, owedLedgerView({...gatherOwed(fx), selected: 'credit:market_circle'}));
    assert.equal(host.querySelector('[data-owed-row="credit:market_circle"] [role="meter"]').getAttribute('aria-valuenow'), '89');
    assert.match(host.querySelector('.owed-ladder [aria-current="true"]').textContent, /Neutral \(you\)/);
});

test('settle in place: a credit row quotes the figure Standing shows and hands it to the repay command', () => {
    const fx = {...OWED_MIXED, standing: {...OWED_MIXED.standing, coins: 7}};
    const loan = fx.standing.factions.find(f => f.id === 'market_circle').loan;
    const row = owedLedgerView({...gatherOwed(fx), selected: 'credit:market_circle'}).selected;
    // Standing labels its button `Repay ${loan.owed}`; this row reads the same field of the same projection.
    assert.equal(row.quote.label, `Repay ${loan.owed}`);
    assert.deepEqual([row.quote.command, row.quote.factionId, row.quote.owed], ['repay', 'market_circle', loan.owed]);
    assert.equal(row.quote.pays, Math.min(loan.owed, 7));
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const host = dom.document.getElementById('h'), sent = [];
    renderOwedLedger(host, owedLedgerView({...gatherOwed(fx), selected: 'credit:market_circle'}), {onSettle: q => sent.push(q)});
    const button = host.querySelector('[data-owed-settle]');
    assert.equal(button.textContent, `Repay ${loan.owed}`);
    button.onclick();
    assert.equal(sent[0].owed, loan.owed);
    // An empty purse says why and disables the button; rows without a lender keep no button.
    const broke = owedLedgerView({...gatherOwed({...fx, standing: {...fx.standing, coins: 0}}), selected: 'credit:market_circle'}).selected;
    assert.equal(broke.quote.blocked, 'You have no coins to repay with.');
    const claim = owedLedgerView({...gatherOwed(fx), selected: 'claim:3'}).selected;
    assert.equal(claim.quote, null);
});

test('a coin row names its own currency and totals never mix currencies (UR61, COI money)', () => {
    const row = (id, amount, unit) => ({id, kind: 'coin', debtor: 'player', creditor: 'counting_house', amount, since: 0, unit});
    const v = owedLedgerView({rows: [row('a', 1, 'crown'), row('b', 4, {one: 'penny', many: 'pennies'}), row('c', 2, null)]});
    const text = Object.fromEntries(v.rows.map(r => [r.id, r.amountText]));
    assert.deepEqual(text, {a: '1 crown', b: '4 pennies', c: '2 coins'});
    assert.match(v.summary, /\(1 crown, 4 pennies and 2 coins\)/);
});
