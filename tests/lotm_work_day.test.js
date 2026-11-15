import test from 'node:test';
import assert from 'node:assert/strict';
import {wageLedger, lotmWorkRows, renderPayLedger} from '../src/lotm_work_day.js';
import {createDom} from '../scripts/headless/dom.mjs';

const words = n => `${n}p`;
test('the pay ledger runs from the first draw until the advance is clear, each week paid, kept and owed after (D1)', () => {
    const L = wageLedger({started: true, advance: true, closed: 2, paid: 1, net: 0, advanceLeft: 2520});
    assert.equal(L.rows.length, 8, 'twelve pounds at half of three a week clears in eight weeks');
    assert.deepEqual(L.rows.slice(0, 4).map(r => r.status), ['paid', 'owed', 'next', 'ahead']);
    assert.equal(L.rows[0].paid, L.rows[0].kept, 'half kept, half paid');
    assert.equal(L.rows.at(-1).advanceLeft, 0);
    const none = wageLedger({started: true, advance: false, closed: 0, paid: 0, net: 0, advanceLeft: 0});
    assert.deepEqual(none.rows.map(r => [r.kept, r.status]), [[0, 'next']], 'no advance: full pay, one running week');
    assert.equal(wageLedger(null).rows.length, 0);
});

test('the ledger draws as a table with each week in words', () => {
    const {document} = (() => { const d = createDom(); d.loadHTML('<html><body></body></html>'); return d; })();
    const el = renderPayLedger(document, wageLedger({started: true, advance: true, closed: 1, paid: 0, net: 360, advanceLeft: 2880}), words);
    assert.match(el.textContent, /^Pay and debts · 720p a week · advance left 2880p/);
    assert.match(el.textContent, /owed now/); assert.match(el.textContent, /this week/);
});

test('no contract, no rows; pay due is ready under Find work and acts; otherwise it rests with the time to the next week', () => {
    assert.deepEqual(lotmWorkRows({actors: {player: {worldId: 'elsewhere'}}}), []);
});
