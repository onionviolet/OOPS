import test from 'node:test';
import assert from 'node:assert/strict';
import {dayStripModel, hourWords, unitsOf, workFromExpansion, clockWords, todayLine, nextThing} from '../src/ui/day_strip.js';
import {projectCalendar} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';

const view = (hour, minute = 0) => projectCalendar(WORLD_CALENDAR_PROFILES['base.frontier'],
    {instanceId: 'frontier.main', elapsed: 0, calendar: {year: 999, month: 4, day: 1, hour, minute, day_count: 1}});

test('a world with no known calendar hides the strip', () => {
    const m = dayStripModel({calendar: null, events: [{id: 'a', minute: 5, text: 'x'}]});
    assert.equal(m.hidden, true); assert.deepEqual(m.marks, []);
});

test('a day with nothing: a now mark, plain hour ticks, and a quiet ahead', () => {
    const m = dayStripModel({calendar: view(8)});
    assert.equal(m.hidden, false);
    assert.equal(m.nowFraction, 8 / 24);
    assert.deepEqual(m.ticks.map(t => t.label), ['6', '12', '18']);
    assert.deepEqual([m.marks, m.ahead, m.summary], [[], [], {earlier: '', ahead: ''}]);
});

test('lines written today become marks, one per hour, newest naming it; later lines are not marks', () => {
    const m = dayStripModel({calendar: view(10, 30), events: [
        {id: 'a', minute: 8 * 60 + 5, text: 'You woke.'}, {id: 'b', minute: 8 * 60 + 40, text: 'You ate.'},
        {id: 'c', minute: 9 * 60 + 15, text: '  Hesk   greets you. '}, {id: 'late', minute: 11 * 60, text: 'not yet'}, {id: 'blank', minute: 60, text: ' '}]});
    assert.deepEqual(m.marks.map(x => [x.hour, x.count, x.text, x.openId]), [[8, 2, 'You ate.', 'b'], [9, 1, 'Hesk greets you.', 'c']]);
    assert.equal(m.marks[0].label, '8: You ate. (and 1 more)');
    assert.equal(m.summary.earlier, '9: Hesk greets you.');
});

test('work under way shows its end; one running past midnight says tomorrow; unknown end draws nothing', () => {
    const m = dayStripModel({calendar: view(8), work: [{id: 'w1', endsIn: 180}, {id: 'w2', endsIn: 20 * 60}, {id: 'w3', endsIn: null}]});
    assert.deepEqual(m.ahead.map(a => [a.kind, a.text]), [['work', 'Work under way, ends at 11:00'], ['work', 'Work under way, ends tomorrow']]);
    assert.equal(m.ahead[0].to, 11 / 24); assert.equal(m.ahead[1].to, 1);
});

test('plan entries show only for the rest of today, in order, after the work', () => {
    const m = dayStripModel({calendar: view(8), plan: [{id: 'p2', minute: 18 * 60, text: 'Supper'}, {id: 'p0', minute: 7 * 60, text: 'Past'}, {id: 'p1', minute: 12 * 60, text: 'Gather herbs'}]});
    assert.deepEqual(m.ahead.map(a => a.text), ['Gather herbs at 12:00', 'Supper at 18:00']);
    assert.equal(m.summary.ahead, 'Gather herbs at 12:00 · Supper at 18:00');
});

test('hours follow the world calendar units, not a fixed 24', () => {
    const units = {minutesPerHour: 50, hoursPerDay: 20};
    assert.equal(hourWords(500, units), '10');
    const m = dayStripModel({calendar: {minuteWithinDay: 250}, units});
    assert.equal(m.nowFraction, 0.25); assert.deepEqual(m.ticks.map(t => t.label), ['5', '10', '15']);
    assert.deepEqual(unitsOf(view(8)), {minutesPerHour: 60, hoursPerDay: 24});
});

test('work is read from the expansion state for the player only, with neutral words', () => {
    const w = workFromExpansion({clock: 100, pending: [{id: 'j1', due: 160, label: 'Secret outcome', context: {actorId: 'player'}}, {id: 'j2', due: 130, context: {actorId: 'npc'}}], simulation: {jobs: [{id: 'j3', actorId: 'player', due: 220}]}});
    assert.deepEqual(w, [{id: 'j1', endsIn: 60}, {id: 'j3', endsIn: 120}]);
    assert.deepEqual(workFromExpansion(null), []);
});

test('PS199: by default the strip waits until something is timed; Always and Never override', async () => {
    const {stripShows} = await import('../src/ui/day_strip.js');
    const idle = {hidden: false, ahead: []}, timed = {hidden: false, ahead: [{key: 'work:1'}]}, unknown = {hidden: true, ahead: [{key: 'work:1'}]};
    assert.equal(stripShows('timed', idle), false);
    assert.equal(stripShows('timed', timed), true);
    assert.equal(stripShows('on', idle), true);
    assert.equal(stripShows('off', timed), false);
    assert.equal(stripShows('on', unknown), false);
});

test('PS190: ticks and the now line carry clock times; a chip ahead names its time', () => {
    const m = dayStripModel({calendar: view(14, 30), plan: [{id: 'p', minute: 23 * 60, text: 'Moonglow due'}]});
    assert.equal(m.nowLabel, '14:30');
    assert.deepEqual(m.ticks.map(t => t.time), ['6:00', '12:00', '18:00']);
    assert.equal(clockWords(5 * 60 + 5), '5:05');
    assert.deepEqual(m.ahead.map(a => a.text), ['Moonglow due at 23:00']);
});

test('PS190: with nothing planned the status line says so and names what is next; a strip with a plan folds nothing', () => {
    const empty = dayStripModel({calendar: view(8)});
    assert.equal(todayLine({model: empty, next: ''}), 'Today: nothing planned');
    assert.equal(todayLine({model: empty, next: 'Gather moss'}), 'Today: nothing planned · next: Gather moss');
    assert.equal(todayLine({model: {hidden: true}, next: 'x'}), '', 'no calendar, no line');
    assert.equal(nextThing({ready: [{state: 'rest', label: 'Far'}, {state: 'near', label: 'Brew', gap: '1 vial short'}, {state: 'ready', label: 'Gather moss'}]}), 'Gather moss');
    assert.equal(nextThing({ready: [{state: 'near', label: 'Brew', gap: '1 vial short'}]}), 'Brew (1 vial short)');
    assert.equal(nextThing({ready: [], digest: {later: [{name: 'Bakery', detail: 'opens 8:00'}]}}), 'Bakery opens 8:00');
    assert.equal(nextThing({}), '');
});
