import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCheatState, grantCheat, optionalStartCard, awakenCheats, awakenedStatusCard, validateCheatCard, SYSTEM_QUESTS_CARD} from '../src/cheat_cards.js';
const at = {year:999, month:4, day:1, hour:8, minute:0};
const dormant = () => grantCheat(defaultCheatState(), optionalStartCard(), {route:'optional-start', at});
test('cheat optional start grants a dormant informational card', () => {
    const state = dormant();
    assert.equal(state.held['system-quests'].card.state.awakened, false);
    assert.equal(state.held['system-quests'].card.state.points, 0);
    assert.equal(state.held['system-quests'].acquired.route, 'optional-start');
    assert.deepEqual(state.held['system-quests'].messages, []);
    assert.equal(awakenedStatusCard(state), undefined);
    assert.throws(() => validateCheatCard({...SYSTEM_QUESTS_CARD, state:{awakened:'false'}}), /boolean/);
});
test('cheat awakens on day 3 and keeps its first message without replay', () => {
    const state = dormant();
    assert.deepEqual(awakenCheats(state, {dayCount:2, at}).messages, []);
    const awake = awakenCheats(state, {dayCount:3, at});
    assert.equal(awake.messages.length, 1);
    assert.equal(awake.state.held['system-quests'].card.state.awakened, true);
    assert.equal(awake.state.held['system-quests'].messages[0].text, awake.messages[0]);
    assert.equal(state.held['system-quests'].card.state.awakened, false);
    const restored = JSON.parse(JSON.stringify(awake.state));
    assert.ok(awakenedStatusCard(restored));
    const again = awakenCheats(restored, {dayCount:4, wonFight:true, at});
    assert.deepEqual(again.messages, []);
    assert.deepEqual(again.state, restored);
});
test('cheat first won fight awakens before day 3', () => {
    const awake = awakenCheats(dormant(), {dayCount:1, wonFight:true, at});
    assert.equal(awake.messages.length, 1);
    assert.ok(awakenedStatusCard(awake.state));
});
