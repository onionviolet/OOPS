import test from 'node:test';
import assert from 'node:assert/strict';
import {mendingEligibility, beginMending, interruptMending, finishMending, canCarry, carryCapacityLb, steppingStonesAttempt, MENDING} from '../src/dnd_phandalin.js';
import {DND_CHECK_PACK_EXAMPLE, createCheckRulePack} from '../src/check_rule_pack.js';

const means = (extra = {}) => ({knowsMending: true, voice: true, freeHand: true, focusHeld: true, reachesTarget: true, ...extra});
const sack = (extra = {}) => ({id: 'dnd.branch.bag:01', name: 'Sack', revision: 1, accessible: true, capacityLb: 30,
    damage: {id: 'tear:1', kind: 'tear', inches: [6], missingMaterial: false, state: 'open'}, ...extra});
const profile = createCheckRulePack(DND_CHECK_PACK_EXAMPLE).profile();
const actor = {lifeId: 'life:1', stepBonus: 2};

test('Mending repairs the six-inch tear once and keeps the same item', () => {
    const begun = beginMending(means(), sack(), 540);
    assert.equal(begun.ok, true);
    assert.equal(finishMending(begun.cast, sack(), 540).ok, false, 'a cast is a full minute');
    const done = finishMending(begun.cast, sack(), 540 + MENDING.minutes);
    assert.equal(done.slotSpent, 0);
    assert.equal(done.itemPatch.id, 'dnd.branch.bag:01');
    assert.equal(done.itemPatch.damage.state, 'repaired');
    const repaired = {...sack(), ...done.itemPatch};
    assert.equal(finishMending(begun.cast, repaired, 541).ok, false, 'settles once');
});

test('the same consumer mends another compatible object, and refuses incompatible or unreachable ones', () => {
    const wineskin = {id: 'dnd.branch.skin:02', revision: 3, accessible: true, damage: {id: 'leak:1', kind: 'tear', inches: [2], missingMaterial: false, state: 'open'}};
    assert.equal(mendingEligibility(means(), wineskin).ok, true);
    assert.match(mendingEligibility(means(), sack({damage: {...sack().damage, inches: [18]}})).reasons[0], /larger than 12/);
    assert.match(mendingEligibility(means(), sack({damage: {...sack().damage, missingMaterial: true}})).reasons[0], /Material is missing/);
    assert.match(mendingEligibility(means({reachesTarget: false}), sack()).reasons[0], /touch/);
    assert.equal(mendingEligibility(means({freeHand: false, voice: false}), sack()).reasons.length, 2);
});

test('interruption repairs nothing and spends no slot; a changed item fizzles the cast', () => {
    const {cast} = beginMending(means(), sack(), 0);
    const stopped = interruptMending(cast);
    assert.deepEqual([stopped.repaired, stopped.slotSpent, stopped.cast], [false, 0, null]);
    assert.equal(finishMending(cast, sack({revision: 2}), 1).ok, false);
});

test('a torn sack cannot carry loose cargo; the repaired one holds the 20 lb supply run', () => {
    assert.equal(carryCapacityLb(sack()), 0);
    assert.equal(canCarry(sack(), 20).ok, false);
    const patch = finishMending(beginMending(means(), sack(), 0).cast, sack(), 1).itemPatch;
    assert.equal(canCarry({...sack(), ...patch}, 20).ok, true);
    assert.equal(canCarry({...sack(), ...patch}, 31).ok, false);
});

test('stepping stones: same approach replays its saved roll, a changed approach rolls anew, and the receipt replays', () => {
    const first = steppingStonesAttempt(profile, 'seed-1', actor, [], 'rush', 600);
    assert.equal(first.replay, false);
    const again = steppingStonesAttempt(profile, 'seed-1', actor, [first.saved], 'rush', 660);
    assert.equal(again.replay, true);
    assert.deepEqual(again.receipt, first.receipt);
    const changed = steppingStonesAttempt(profile, 'seed-1', {...actor, careful: true}, [first.saved], 'test each stone', 660);
    assert.equal(changed.replay, false);
    assert.equal(changed.receipt.dice[0].mode, 'advantage');
    assert.equal(changed.receipt.check.target, 12, 'the DC was declared before the roll');
    const reloaded = steppingStonesAttempt(profile, 'seed-1', actor, [JSON.parse(JSON.stringify(first.saved))], 'rush', 900);
    assert.deepEqual(reloaded.receipt, first.receipt, 'save/reload cannot reroll');
});
