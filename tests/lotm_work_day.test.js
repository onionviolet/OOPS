import test from 'node:test';
import assert from 'node:assert/strict';
import {wageLedger, lotmWorkRows, renderPayLedger} from '../src/lotm_work_day.js';
import {createDom} from '../scripts/headless/dom.mjs';
import {LOTM_BESIDE_PROFILE} from '../src/book_world_lotm_cast_host.js';
import {SHIFT_DAY_FACT} from '../src/book_world_lotm_shift.js';
import {WAGE_CONTRACT_NOTE} from '../src/book_world_lotm_wage.js';
import {LOTM_RENT_RECEIPT, officeBudget, officePracticeRows, officeRecap} from '../src/lotm_office_day.js';
import {fresh, hostOver} from './lotm_helpers.js';

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

test('work suggestions quote the office clock and open the existing control without working a shift', () => {
    const life = fresh();
    life.state.lotm.entryProfile = LOTM_BESIDE_PROFILE;
    life.state.clock = life.state.lotm.initializedAt + 600;
    life.state.simulation.knowledge.player = {[WAGE_CONTRACT_NOTE]: {at: 0}};
    let busy = false;
    const {host} = hostOver(life, {busy: () => busy});
    const opened = [];
    const rows = () => lotmWorkRows(life.state, {shift: host.shiftRead(), openShift: id => opened.push(id)});
    assert.deepEqual(rows().map(r => [r.id, r.state]), [
        ['shift-desk', 'ready'], ['shift-archive', 'ready'], ['shift-gate', 'near'], ['lotm-wage', 'ready']
    ]);
    assert.match(rows()[0].label, /4 h/);
    assert.match(rows()[2].gap, /19:00/);
    rows()[1].open();
    assert.deepEqual(opened, ['archive']);
    assert.equal(rows()[1].act, undefined);
    busy = true;
    assert.equal(rows()[0].state, 'near');
    assert.equal(rows()[0].gap, 'Finish what you are doing first.');
    assert.throws(() => host.workShift('desk'), /Finish what you are doing first/);
    busy = false;
    life.state.actors.player.facts[SHIFT_DAY_FACT] = 1;
    assert.deepEqual(rows().map(r => r.id), ['lotm-wage']);
});

test('the ledger mounts as a Journal page that shows only while there is a contract and redraws only on change', async () => {
    const {mountPayLedgerTab} = await import('../src/lotm_work_day.js');
    const previous = globalThis.document, dom = createDom(); dom.loadHTML('<html><body></body></html>'); globalThis.document = dom.document;
    try {
        let tab = null, state = {actors: {player: {worldId: 'elsewhere'}}};
        mountPayLedgerTab({registerBoxTab: t => { tab = t; return () => {}; }, read: () => state});
        assert.equal(tab.box, 'journal'); assert.equal(tab.label, 'Pay');
        assert.equal(tab.when(), false, 'no contract: no tab');
        assert.equal(tab.node.textContent, '');
    } finally { globalThis.document = previous; }
});

test('Bio rows say what Klein owes and when rent falls due (D1)', async () => {
    const {lotmBioRows} = await import('../src/lotm_work_day.js');
    assert.deepEqual(lotmBioRows({actors: {player: {worldId: 'elsewhere'}}}, null), []);
});

test('the office compares the next wage after deductions and rent, and keeps paid receipts in date order', () => {
    const wage = {weeklyPence: 720, paid: 1, closed: 1, advance: true};
    const rent = {amount: 66, shutsIn: 240, missed: 0};
    assert.deepEqual(officeBudget(wage, rent), [
        'Next week: 3 pounds pay · 1 pound 10 soli kept for the advance · 1 pound 10 soli to you',
        'Rent: 5 soli 6 pence a week · due in 4 h',
        'After one week’s rent: 1 pound 4 soli 6 pence',
    ]);
    assert.match(officeBudget({...wage, closed: 8}, {...rent, amount: 147})[2], /2 pounds 7 soli 9 pence/);
    const known = {'book.lotm.wage.week1': {at: 80, value: 'Pay collected'},
        'book.lotm.shift.last': {at: 80, value: 'Shift finished'},
        'divination.lotm.be.lesson.tarot': {at: 20, value: 'Lesson finished'},
        [LOTM_RENT_RECEIPT]: {at: 80, value: 'Rent paid'}};
    assert.deepEqual(officeRecap({simulation: {knowledge: {player: known}}}, wage), ['Pay collected', 'Rent paid', 'Shift finished', 'Lesson finished']);
});

test('the office routes one step per reading and follows the running job before a future step', () => {
    const queryId = 'lotm.div.tarot-lost-object';
    const prepare = {id: `${queryId}.prepare`, queryId, eligible: false};
    const ask = {id: `${queryId}.ask`, queryId, eligible: true};
    const job = {id: 'left', commandId: prepare.id};
    assert.equal(officePracticeRows([prepare, ask])[0].id, ask.id);
    assert.equal(officePracticeRows([prepare, ask], [job])[0].running.id, job.id);
});
