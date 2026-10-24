import test from 'node:test';
import assert from 'node:assert/strict';
import {createObligations, collectObligations, writeObligation, readObligations, easeObligations, carriedObligations, validateObligations, obligation} from '../src/obligations_ledger.js';
import {recordDeath, emptyHousehold} from '../src/household_fortunes.js';
import {HEIR_OBLIGATIONS} from '../src/heir_inheritance.js';

test('three existing debt-like states land in one ledger and read back by party and kind', () => {
    const household = recordDeath(emptyHousehold(), {id: 'toma', fed: 0.1, bed: 1, tended: 1, age: 1, lifespan: 9}, 'neglect', 5);
    const l = collectObligations({household, career: {debt: 12}, heirKeys: Object.keys(HEIR_OBLIGATIONS), heirTable: HEIR_OBLIGATIONS});
    assert.deepEqual(l.rows.map(r => r.id), ['career:kitDebt', 'heir:archiveDuty', 'heir:grievance', 'household:resentment']);
    assert.equal(readObligations(l, {kind: 'coin'})[0].amount, 12);
    assert.equal(readObligations(l, {creditor: 'elder'}).length, 2);
    validateObligations(l);
});

test('ease follows AD19 for grudges, leaves coin debt alone, and settling removes the row', () => {
    const household = {standing: 0, resentment: 3, ledger: []};
    let l = collectObligations({household, career: {debt: 12}});
    l = easeObligations(l, 2);
    assert.equal(readObligations(l, {kind: 'grievance'})[0].amount, 1);
    assert.equal(readObligations(l, {kind: 'coin'})[0].amount, 12);
    assert.equal(easeObligations(l, 5).rows.some(r => r.kind === 'grievance'), false);
    l = writeObligation(l, {...readObligations(l, {kind: 'coin'})[0], amount: 0});
    assert.equal(readObligations(l, {kind: 'coin'}).length, 0);
});

test('only carrying rows pass to an heir, and a malformed row fails validation', () => {
    const l = collectObligations({household: {resentment: 2, ledger: []}, career: {debt: 4}});
    assert.deepEqual(carriedObligations(l).rows.map(r => r.id), ['career:kitDebt']);
    assert.throws(() => writeObligation(createObligations(), obligation({id: 'x', kind: 'tithe', debtor: 'a', creditor: 'b', amount: 1, source: 's'})));
    assert.throws(() => writeObligation(createObligations(), obligation({id: 'x', kind: 'coin', debtor: 'a', creditor: 'b', amount: -1, source: 's'})));
});
