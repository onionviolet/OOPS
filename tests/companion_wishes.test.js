import test from 'node:test';
import assert from 'node:assert/strict';
import {BOND_RITES, validateBonds, migrateBonds, doBondRite, stepCompanions, goLooking} from '../src/companion_roster.js';
import * as W from '../src/companion_wishes.js';

test('wishes: one open wish each, no two companions share one, rites progress and a grant raises the bond', () => {
    const a = W.issueWish('person:a', null, 0, BOND_RITES), taken = [W.wishSignature(a)];
    for (const key of ['person:b', 'person:c', 'person:d']) {
        const w = W.issueWish(key, null, 0, BOND_RITES, taken);
        assert.ok(!taken.includes(W.wishSignature(w)));
        taken.push(W.wishSignature(w));
    }
    const wish = {kind: 'rite', rite: 'share_meal', need: 2, done: 0, since: 0}, p = W.COMPANION_PROFILES.free;
    let bond = {level: 1, memory: [], wish};
    bond = W.progressWish(bond, 'walk_together', p); assert.equal(bond.wish.done, 0);
    bond = W.progressWish(bond, 'share_meal', p); assert.equal(bond.wish.done, 1);
    bond = W.progressWish(bond, 'share_meal', p);
    assert.equal(bond.wish, undefined); assert.equal(bond.level, 1 + p.grantGain);
});

test('leaving: only a free person, only after the patience, never when the bond holds; way back after the pause', () => {
    const p = W.COMPANION_PROFILES.free, wish = {kind: 'level', target: 9, since: 0};
    const day = n => n * W.DAY;
    assert.equal(W.departure({level: 1, memory: [], wish}, day(13), p, 'Ana'), null);
    assert.equal(W.departure({level: p.holdLevel, memory: [], wish}, day(30), p, 'Ana'), null);
    assert.equal(W.departure({level: 1, memory: [], wish}, day(30), W.COMPANION_PROFILES.bound, 'Lio'), null);
    const gone = W.departure({level: 1, memory: [], wish}, day(15), p, 'Ana');
    assert.match(gone.reason, /Ana waited 15 days/);
    const bond = {level: 1, memory: [], gone};
    assert.throws(() => W.comeBack('person:a', bond, day(16), p, BOND_RITES), /Too soon/);
    const back = W.comeBack('person:a', bond, day(15 + p.returnAfterDays), p, BOND_RITES);
    assert.equal(back.gone, undefined); assert.ok(back.wish);
});

test('roster: step issues wishes, an ignored wish sends a person away, rites are refused while gone, going looking brings them back', () => {
    const rows = [{key: 'person:zed', name: 'Zed'}, {key: 'party:lio', name: 'Lio'}];
    stepCompanions(rows, 0);
    assert.throws(() => doBondRite('person:nope!', 'share_meal', 'kind', 0));
    stepCompanions(rows, W.DAY * 20);
    const gone = migrateBonds(null); // fresh slice stays empty and independent of module state
    assert.deepEqual(gone.bonds, {});
    assert.throws(() => doBondRite('person:zed', 'share_meal', 'kind', 0), /not here/);
    assert.throws(() => goLooking('person:zed', W.DAY * 21), /Too soon/);
    goLooking('person:zed', W.DAY * 24);
    doBondRite('person:zed', 'share_meal', 'kind', W.DAY * 24);
    doBondRite('party:lio', 'share_meal', 'practical', 0);
});

test('schema 1 saves validate and migrate; damaged wishes fail', () => {
    const old = {schema: 1, bonds: {'party:lio': {level: 2, memory: []}}};
    validateBonds(old);
    assert.equal(migrateBonds(old).schema, 2);
    assert.throws(() => validateBonds({schema: 2, bonds: {'party:lio': {level: 2, memory: [], wish: {kind: 'rite', rite: 'nap', need: 2, done: 0, since: 0}}}}), /wish/);
    validateBonds({schema: 2, bonds: {'party:lio': {level: 2, memory: [], wish: {kind: 'level', target: 5, since: 0}, gone: {since: 0, reason: 'x'}, note: 'y'}}});
});
