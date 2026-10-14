import test from 'node:test';
import assert from 'node:assert/strict';
import {clearRewardText, knownBestiarySources, knownLootValue} from '../src/fork_discovery_views.js';

test('public and heard milestones use real remaining rewards without revealing hidden thresholds', () => {
    const zone = {id: 'field', enemy_count: 15, enemy_groups_killed: 15,
        rewards_with_clear_requirement: [{required_clear_count: 2, hint: {visibility: 'public'}},
            {required_clear_count: 4}, {required_clear_count: 99}]};
    assert.equal(clearRewardText(zone), 'Clears: [1] · known milestone: 2 clears');
    assert.equal(clearRewardText({...zone, enemy_groups_killed: 30}), 'Clears: [2]');
    assert.equal(clearRewardText({...zone, enemy_groups_killed: 30}, [{location: 'field', clears: 4}]), 'Clears: [2] · known milestone: 4 clears');
    assert.equal(clearRewardText({...zone, enemy_groups_killed: 30}, [{location: 'other', clears: 99}, {location: 'field', clears: 3}]), 'Clears: [2]');
    assert.equal(clearRewardText({...zone, enemy_groups_killed: 1485}), 'Clears: [99]');
    assert.equal(clearRewardText({...zone, rewards_with_clear_requirement: [{required_clear_count: 2, hint: {visibility: 'hidden'}}]}), 'Clears: [1]');
});

const enemies = {rat: {loot_list: [{item_name: 'tail', chance: .5, count: {min: 1, max: 3}}, {item_name: 'secret', chance: 1}]},
    unknown: {loot_list: [{item_name: 'tail', chance: 1}]} };
test('reverse sources require positive item acquisition and encountered bestiary', () => {
    assert.deepEqual(knownBestiarySources('tail', {knownItems: {}, kills: {rat: 1}, enemies}), []);
    assert.deepEqual(knownBestiarySources('tail', {knownItems: {tail: {number: 1}}, kills: {rat: 1, unknown: 0}, enemies}), ['rat']);
    assert.deepEqual(knownBestiarySources('tail', {knownItems: {tail: {number: 0}}, kills: {rat: 1}, enemies}), []);
});
test('loot expectation excludes unknown items, accounts for range, caps chance and does not call unknown prices', () => {
    const input = {knownItems: {tail: {number: 1}}, kills: {rat: 1}, enemies,
        baseValue: id => {assert.equal(id, 'tail'); return 10;}};
    const before = JSON.stringify(input);
    assert.equal(knownLootValue('rat', input), 10);
    assert.equal(knownLootValue('rat', {...input, dropModifier: 10}), 20);
    assert.equal(knownLootValue('unknown', input), null);
    assert.equal(knownLootValue('rat', {...input, knownItems: {}}), null);
    assert.equal(JSON.stringify(input), before);
});
