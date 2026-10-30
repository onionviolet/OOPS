import test from 'node:test';
import assert from 'node:assert/strict';
import {accessView, loopView, DAY} from '../src/book_world_mol_access.js';
const exp = (clock, permit = true, mastery = 1) => ({clock, actors: {player: {worldId: 'book.mol.cyoria', facts: permit ? {'book.mol.guestPermit': true} : {}}},
    simulation: {powers: {player: {'book.mol.formula_operator': {mastery}}}, knowledge: {player: {'book.mol.formula': {}}}}});
test('no permit means no grant', () => assert.equal(accessView(exp(5, false), null).granted, false));
test('a fresh pass opens library, repair and reconstruction and lists what it never covered', () => {
    const v = accessView(exp(100), {issuedAt: 100});
    assert.equal(v.state, 'active'); assert.equal(v.opens.length, 3); assert.ok(v.closed.includes('A first-circle badge'));
});
test('after the term the pass lapses and the trained skill is still listed', () => {
    const v = accessView(exp(100 + 31 * DAY), {issuedAt: 100});
    assert.equal(v.state, 'expired'); assert.deepEqual(v.opens, []); assert.equal(v.retained.length, 2);
});
test('the restart readout names its source and says what resets and carries', () => {
    const l = loopView(exp(1));
    assert.match(l.source, /Proposed Mother of Learning reset table/); assert.ok(l.resets.length && l.carries.length); assert.equal(l.heldNow.length, 2);
});
test('the loop table is world-neutral: an unregistered world gets the default and says so', async () => {
    const {loopReadout} = await import('../src/loop_table.js');
    const l = loopReadout('book.other.world'); assert.match(l.source, /no reset table yet/); assert.ok(l.resets.length && l.carries.length);
});
