import test from 'node:test';
import assert from 'node:assert/strict';
import {awayReason, lintAnchors, RECURRENCE_DAYS, TIME_BANDS, whereabouts} from '../src/cast_schedule.js';
import {calendarMinutes} from '../src/world_rhythm.js';

const atDay = (day, hour = 8, minute = 0) => {
    const elapsed = (day - 1) * 1440 + hour * 60 + minute;
    const dayOfYear = Math.floor(elapsed / 1440), year = 999 + Math.floor(dayOfYear / 360);
    const inYear = dayOfYear % 360;
    return {calendar: {year, month: Math.floor(inYear / 30) + 1, day: inYear % 30 + 1,
        hour, minute, day_count: day}};
};
const row = (fields = {}) => ({actor: 'dunn', place: 'office', from: 'morning', to: 'afternoon', day: 2, ...fields});

test('weekday schedule away on the weekend returns its next Monday window', () => {
    const result = whereabouts([row({recurrence: 'weekdays', day: 1})], 'dunn', atDay(6, 12));
    assert.equal(result.place, null);
    assert.equal(result.nextAt, calendarMinutes(atDay(8, 0).calendar) + 480);
    assert.equal(result.nextPlace, 'office');
    assert.match(awayReason(result), /^Away; usually back by morning at office$/);
});

test('once rows hold only their own day and irregular rows stay unphased', () => {
    assert.equal(whereabouts([row()], 'dunn', atDay(2, 9)).place, 'office');
    assert.equal(whereabouts([row()], 'dunn', atDay(3, 9)).place, null);
    assert.equal(whereabouts([row()], 'dunn', atDay(1, 9)).nextAt, calendarMinutes(atDay(2, 0).calendar) + 480);
    assert.deepEqual(whereabouts([row()], 'dunn', atDay(3, 18)), {place: null, nextAt: null, nextPlace: null});
    assert.throws(() => whereabouts([row({day: undefined})], 'dunn', atDay(2)), /needs a day/);
    assert.deepEqual(whereabouts([row({recurrence: 'irregular'})], 'dunn', atDay(3)), {place: null, irregular: true});
});

test('overlap precedence is canon, intention, routine, fill, then later locator', () => {
    const rows = [row({place: 'fill', source: 'fill'}), row({place: 'routine', source: 'routine'}),
        row({place: 'intention', source: 'intention'}), row({place: 'canon', source: 'canon'}),
        row({place: 'later', source: 'routine', locator: 'z'}), row({place: 'earlier', source: 'routine', locator: 'a'})];
    assert.equal(whereabouts(rows, 'dunn', atDay(2, 9)).place, 'canon');
    assert.equal(whereabouts(rows.slice(0, 2).concat(rows.slice(4)), 'dunn', atDay(2, 9)).place, 'later');
});

test('until is inclusive on its last day and removes the row afterwards', () => {
    const schedule = [row({recurrence: 'daily', day: 1, until: 2})];
    assert.equal(whereabouts(schedule, 'dunn', atDay(2, 9)).place, 'office');
    assert.deepEqual(whereabouts(schedule, 'dunn', atDay(3)), {place: null, nextAt: null, nextPlace: null});
});

test('anchor lint rejects contradictory routine and fill rows but ignores canon and matching places', () => {
    const anchor = {actor: 'dunn', place: 'street', at: atDay(2, 9)};
    const routine = row({source: 'routine'}), fill = row({source: 'fill'}), canon = row({source: 'canon'});
    const intention = row({source: 'intention'});
    assert.deepEqual(lintAnchors([routine, fill, intention], [anchor]), [routine, fill, intention]);
    assert.deepEqual(lintAnchors([canon, row({place: 'street', source: 'fill'})], [anchor]), []);
});

test('time bands and recurrence defaults are exported and invalid rows fail early', () => {
    assert.deepEqual(TIME_BANDS.morning, {from: 480, to: 720});
    assert.equal(RECURRENCE_DAYS.yearly, 360);
    assert.equal(whereabouts([row({from: 540, to: 660})], 'dunn', atDay(2, 9)).place, 'office');
    assert.equal(whereabouts([row({recurrence: 'weekly', day: 3})], 'dunn', atDay(10, 9)).place, 'office');
    assert.equal(whereabouts([row({recurrence: 'weekly', day: 3})], 'dunn', atDay(8, 9)).place, null);
    assert.throws(() => whereabouts([row({from: 'midnight'})], 'dunn', atDay(1)), /Unknown/);
});
