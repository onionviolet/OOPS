import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteExchange, releasedUnits, assertConserved} from '../src/exchange_ledger.js';
import * as P from '../src/pledges.js';

test('quote balances and never creates matter: credit plus debit is need, surplus stays as residue', () => {
    const q = assertConserved(quoteExchange({need: 3, released: 5, stock: 0}), 5);
    assert.deepEqual([q.credit, q.debit, q.residue, q.ok], [3, 0, 2, true]);
    const p = assertConserved(quoteExchange({need: 4, released: 1, stock: 3}), 1);
    assert.deepEqual([p.credit, p.debit, p.residue, p.ok], [1, 3, 0, true]);
});
test('under-offering is a refusal with a reason, not a partial result', () => {
    const q = quoteExchange({need: 4, released: 1, stock: 2});
    assert.deepEqual([q.ok, q.short], [false, 1]); assert.match(q.reason, /Need 3 wood and carry 2/);
    assert.throws(() => quoteExchange({need: 1, stock: -1}), /Invalid exchange/);
    assert.throws(() => releasedUnits(3, 5, 4), /Invalid release/);
});
test('release rounds down so it never exceeds what was spent', () => {
    assert.equal(releasedUnits(3, 1, 2), 1); assert.equal(releasedUnits(3, 0, 2), 0); assert.equal(releasedUnits(3, 2, 2), 3);
});
test('recarving credits only the worn strip of the same slot, fades with time and charges', () => {
    let s = P.carve(P.fresh(), ['ember', 'gale', 'root'], 0).state; // 3 wood
    assert.equal(P.wornRelease(s, 'talisman', 0), 3);
    assert.equal(P.wornRelease(s, 'talisman', 60), 1);
    assert.equal(P.wornRelease(s, 'talisman', 120), 0);
    assert.equal(P.wornRelease(s, 'charged', 0), 0);
    assert.deepEqual(P.carveQuote(s, 'talisman', ['gale', 'tide'], 0, 0).debit, 0);
    s = P.carveCharged(s, ['ember', 'gale'], 'attack', 0, 'b');
    assert.equal(P.wornRelease(s, 'charged', 0), 2);
    const spent = {...s, charged: {...s.charged, charges: 0, uses: s.charged.maxCharges}};
    assert.equal(P.wornRelease(spent, 'charged', 0), 0);
    assert.equal(P.carveQuote(s, 'charged', ['gale', 'tide'], 0, 0).ok, true);
});
