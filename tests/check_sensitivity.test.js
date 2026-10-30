import test from 'node:test';
import assert from 'node:assert/strict';
import {readCheckSensitivity} from '../src/check_inspector.js';

const profile = {id: 'p', revision: 1, family: 'sum_target', dice: {count: 2, sides: 6}};
const check = {id: 'c', target: 7, modifiers: [{id: 'charm', kind: 'bonus', value: 2, reason: 'Charm 2'}]};
const ringed = {id: 'r', target: 7, modifiers: [{id: 'charm', kind: 'bonus', value: 2, reason: 'Charm 2'},
    {id: 'ring', kind: 'bonus', value: 30, reason: 'Ring: already guarantees success'}]};
const doomed = {id: 'd', target: 7, modifiers: [{id: 'curse', kind: 'bonus', value: -50, reason: 'Curse: guarantees failure'},
    {id: 'charm', kind: 'bonus', value: 2, reason: 'Charm 2'}]};

test('contribution, +1 and the sweep come from exact odds; clipped modifiers never matter', () => {
    const r = readCheckSensitivity({author: true, profile, check, statMap: {Charm: {modifierId: 'charm', perPoint: 2}}});
    const by = Object.fromEntries(r.modifiers.map(m => [m.id, m]));
    assert.ok(by.charm.plusOne > 0 && by.charm.contribution !== 0);
    assert.deepEqual(r.neverMatter, []);
    const ring = readCheckSensitivity({author: true, profile, check: ringed});
    assert.deepEqual(ring.neverMatter, ['charm'], 'the ring makes charm irrelevant; the ring itself still matters');
    assert.equal(ring.modifiers.find(m => m.id === 'ring').saturated, true, 'but more ring points would be wasted');
    const hopeless = readCheckSensitivity({author: true, profile, check: doomed});
    assert.deepEqual(hopeless.neverMatter, ['charm'], 'charm cannot rescue a -50; the curse still matters because removing it would');
    assert.equal(hopeless.modifiers.find(m => m.id === 'curse').saturated, true);
    assert.equal(r.stats[0].plusOne, +(by.charm.plusOne * 2).toFixed(6));
    assert.equal(by.charm.sweep.length, 11);
});

test('author access is required and the check is not mutated', () => {
    const before = JSON.stringify(check);
    assert.throws(() => readCheckSensitivity({profile, check}), /author access/);
    readCheckSensitivity({author: true, profile, check});
    assert.equal(JSON.stringify(check), before);
    assert.throws(() => readCheckSensitivity({author: true, profile, check, statMap: {X: {modifierId: 'nope'}}}), /unknown modifier/);
});
