import test from 'node:test';
import assert from 'node:assert/strict';
import {applyRung, easeRung, defineLadder, FEAR, FATIGUE, SICKNESS, EXHAUSTION_5E} from '../src/condition_ladders.js';
import {ridersFor, critStands, defineRider, FLAMING, WOUNDING, FLAMING_BURST, baneAgainst, FORTIFICATION} from '../src/weapon_riders.js';

test('PFA5: a second fear steps up, a stronger fear jumps, the top rung caps', () => {
    assert.equal(applyRung(FEAR, null, {to: 'shaken'}).rung, 'shaken');
    assert.equal(applyRung(FEAR, 'shaken', {to: 'shaken'}).rung, 'frightened', 'shaken twice is frightened');
    assert.equal(applyRung(FEAR, 'shaken', {to: 'panicked'}).rung, 'panicked');
    assert.deepEqual(applyRung(FEAR, 'cowering', {to: 'shaken'}), {rung: 'cowering', changed: false, capped: true});
    assert.equal(applyRung(FATIGUE, 'fatigued', {to: 'fatigued'}).rung, 'exhausted');
    assert.equal(applyRung(SICKNESS, 'sickened', {to: 'sickened'}).rung, 'sickened', 'a non-stacking ladder only refreshes');
    assert.equal(applyRung(EXHAUSTION_5E, 'exhaustion 2', {step: 1}).rung, 'exhaustion 3');
    assert.equal(easeRung(FEAR, 'frightened'), 'shaken');
    assert.equal(easeRung(FEAR, 'shaken'), null, 'off the bottom rung is off the ladder');
    assert.throws(() => applyRung(FEAR, null, {to: 'terrified'}), /unknown rung/);
    assert.throws(() => defineLadder({id: 'x', rungs: ['a']}), /two rungs/);
});

test('PFA6: riders fire by trigger and real target kind; fortification can turn a crit', () => {
    const riders = [FLAMING, WOUNDING, FLAMING_BURST, baneAgainst('undead')];
    assert.deepEqual(ridersFor(riders, {crit: false}, {kinds: ['humanoid']}).map(r => r.rider), ['flaming', 'wounding']);
    assert.deepEqual(ridersFor(riders, {crit: true}, {kinds: ['undead']}).map(r => r.rider), ['flaming', 'wounding', 'flaming_burst', 'bane:undead']);
    assert.deepEqual(ridersFor([WOUNDING], {}, {}).flatMap(r => r.effects), [{condition: 'bleed', value: 1}], 'wounding hands bleed to the caller (AFW14)');
    assert.equal(critStands({fortification: FORTIFICATION.light}, 0.1), false);
    assert.equal(critStands({fortification: FORTIFICATION.light}, 0.3), true);
    assert.equal(critStands({}, 0), true, 'no fortification, the crit stands');
    assert.throws(() => defineRider({id: 'x', trigger: 'miss', effects: [{}]}), /trigger/);
});
