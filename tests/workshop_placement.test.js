import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopHome, WORKSHOP_HOMES} from '../src/workshop_placement.js';
import {splitReasons} from '../src/player_reasons.js';

test('every command has a home by group allowlist, and unlisted groups have none (WS-1)', () => {
    assert.equal(workshopHome({group: 'social'}), 'talk');
    assert.equal(workshopHome({}), 'work');
    assert.equal(workshopHome({group: 'workshop'}), 'work');
    for(const g of ['promise', 'storylet', 'nested_campaign', 'systems_workshop']) assert.equal(workshopHome({group: g}), 'leads', g);
    assert.equal(workshopHome({group: 'some_new_group'}), null);
    const listed = Object.values(WORKSHOP_HOMES).flat();
    assert.equal(new Set(listed).size, listed.length, 'a group names one home');
});

test('the insufficient-quantity engine line reaches the player as an action, not a trade instruction (WS-2)', () => {
    const split = splitReasons('Insufficient, stale or unavailable item quantity. Refresh the trade.');
    assert.deepEqual(split.player, ['You do not have all the items or coin this asks for.']);
    assert.ok(!/Refresh the trade|stale/.test(split.player.join(' ')));
});
