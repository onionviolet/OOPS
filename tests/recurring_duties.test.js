import test from 'node:test';
import assert from 'node:assert/strict';
import {freshDuties, migrateDuties} from '../src/recurring_duties.js';
import {lotmDutyRows, fileExpenseClaim, closeLotmWeeks} from '../src/book_world_lotm_duties.js';
import {validateObligations} from '../src/obligations_ledger.js';
const WEEK = 10080, ID = 'lotm.expense_claim';
test('a due week shows a duty row; filing clears it; the next week is due again', () => {
    let s = freshDuties();
    assert.equal(lotmDutyRows(s, 100)[0].id, `duty:${ID}`);
    s = fileExpenseClaim(s, 200);
    assert.equal(lotmDutyRows(s, 300).length, 0);
    assert.throws(() => fileExpenseClaim(s, 400));
    assert.equal(lotmDutyRows(s, WEEK + 5).length, 1);
});
test('a skipped week is counted once, read next time, and cleared by filing', () => {
    let s = closeLotmWeeks(freshDuties(), 10).slice;
    s = closeLotmWeeks(s, 2 * WEEK + 5).slice;
    assert.equal(s.missed[ID], 2);
    assert.equal(closeLotmWeeks(s, 2 * WEEK + 9).slice.missed[ID], 2);
    assert.match(lotmDutyRows(s, 2 * WEEK + 9)[0].why, /Missed 2 times/);
    s = fileExpenseClaim(s, 2 * WEEK + 20);
    assert.equal(s.missed[ID], 0);
    validateObligations({family: 'obligations@1', rows: lotmDutyRows(s, 2 * WEEK + 20)});
});
test('migration: absent or foreign slices load fresh, junk values drop, save round-trips', () => {
    assert.deepEqual(migrateDuties(undefined), freshDuties());
    const s = fileExpenseClaim(freshDuties(), 5);
    assert.deepEqual(migrateDuties(JSON.parse(JSON.stringify(s))), s);
    assert.deepEqual(migrateDuties({family: 'duties@1', lastDone: {a: -1, b: 2}}).lastDone, {b: 2});
});
