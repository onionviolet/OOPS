import test from 'node:test';
import assert from 'node:assert/strict';
import {dayIndex, WORLD_CLOCKS} from '../src/world_day_index.js';
import {Game_Time} from '../src/game_time.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';

const home = WORLD_CALENDAR_PROFILES['base.frontier'].anchor;

test('C1 both clocks give the same dayIndex on known days', () => {
    // Home starts 08:00 on day 1; 960 minutes later is 00:00 of day 2.
    for (const [minutes, day] of [[0, 1], [959, 1], [960, 2], [960 + 1440 * 29, 31], [960 + 1440 * 400, 402]]) {
        const calendar = new Game_Time(home); calendar.goUp(minutes);
        assert.equal(dayIndex({calendar}), day);
        assert.equal(dayIndex({clock: minutes}), day);
    }
});

test('C1 anchored expansion clock and visitor world map to the same day', () => {
    const calendar = new Game_Time(home); calendar.goUp(5000);
    const anchored = {clock: 7000, anchor: {at: 2000, calendar: home}};
    assert.equal(dayIndex(anchored), dayIndex({calendar}));
    // Visitor profiles start at 06:00: 1080 minutes reaches day 2.
    assert.equal(dayIndex({worldId: 'book.mol.cyoria', clock: 1079}), 1);
    assert.equal(dayIndex({worldId: 'book.mol.cyoria', clock: 1080}), 2);
});

test('C1 rejects malformed clocks and documents both', () => {
    assert.throws(() => dayIndex({clock: -1}), /Invalid/);
    assert.throws(() => dayIndex({worldId: 'nope', clock: 0}), /Invalid/);
    assert.throws(() => dayIndex({calendar: {day_count: 0}}), /Invalid/);
    assert.equal(WORLD_CLOCKS.length, 2);
});
