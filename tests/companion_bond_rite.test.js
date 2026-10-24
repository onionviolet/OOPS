import test from 'node:test';
import assert from 'node:assert/strict';
import {performBondRite, TEMPERAMENT_RITE, BOND_GAIN, BOND_MEMORY_CAP} from '../src/companion_roster.js';

test('bond rite: the temperament-preferred rite gives the larger gain and a memory line', () => {
    const fit = performBondRite(null, TEMPERAMENT_RITE.reserved, 'reserved', 10);
    const off = performBondRite(null, 'share_meal', 'reserved', 10);
    assert.equal(fit.level, BOND_GAIN.preferred);
    assert.equal(off.level, BOND_GAIN.base);
    assert.ok(fit.level > off.level);
    assert.equal(fit.memory.length, 1);
    assert.match(fit.memory[0].line, /quiet company.*suited them/);
    assert.equal(off.memory[0].preferred, false);
});

test('bond rite: scene memory is capped, keeps the newest, and input is not mutated', () => {
    let bond = null;
    for (let i = 0; i < BOND_MEMORY_CAP + 4; i++) {
        const before = JSON.stringify(bond);
        bond = performBondRite(bond, 'walk_together', 'patient', i);
        assert.equal(JSON.stringify(bond) === before, false);
    }
    assert.equal(bond.memory.length, BOND_MEMORY_CAP);
    assert.equal(bond.memory.at(-1).when, BOND_MEMORY_CAP + 3);
    assert.equal(bond.memory[0].when, 4);
    assert.equal(bond.level, (BOND_MEMORY_CAP + 4) * BOND_GAIN.preferred);
});

test('bond rite: unknown rite or temperament fails loudly', () => {
    assert.throws(() => performBondRite(null, 'nap', 'kind'));
    assert.throws(() => performBondRite(null, 'share_meal', 'grumpy'));
});

import {validateBonds, migrateBonds, bondParts, doBondRite, bondLevel} from '../src/companion_roster.js';

test('bond slice: old saves migrate to empty, damaged slices fail, rites round-trip', () => {
    assert.deepEqual(migrateBonds(undefined).bonds, {});
    assert.throws(() => validateBonds({schema: 1, bonds: {'party:lio': {level: -1, memory: []}}}), /Invalid companion bonds/);
    assert.throws(() => validateBonds({schema: 1, bonds: {bogus: {level: 1, memory: []}}}));
    doBondRite('party:lio', 'work_alongside', 'practical', 5);
    assert.equal(bondLevel('party:lio'), BOND_GAIN.preferred);
});

test('bond parts name the temperament only when it is known', () => {
    assert.doesNotMatch(bondParts(null, 'kind', false).join(' '), /kind/);
    assert.match(bondParts(null, 'kind', true).join(' '), /kind.*shared a meal/);
});
