import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveWorldCalendar, formatCalendar, calendarDayIndex} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {buildEventBook, happenedOn, standingOn, restrictionsOn} from '../src/world_events.js';
import {riWolfTidePhase, riWolfTidePhaseLine, riEncounterWeights, riWolfFoe, RI_TIDE_PHASES, RI_WOLF_TIDE_WORLD} from '../src/ri_wolf_tide.js';
import {RI_PATROL_ENCOUNTERS} from '../src/ri_lead_day_facts.js';

const DAY = 1440, P = WORLD_CALENDAR_PROFILES[RI_WOLF_TIDE_WORLD];
const life = (clock, extra = {}) => ({clock, simulation: {seed: 4242, people: {player: {bornAt: 0}}}, actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts: {}}},
    worlds: {[RI_WOLF_TIDE_WORLD]: {facts: {'book.ri.lead.instance': 'run.1', ...extra}}}});
const atDate = (year, month, day, hour = 12) => (calendarDayIndex(P, {year, month, day}) - calendarDayIndex(P, P.anchor)) * DAY + (hour - P.anchor.hour) * 60;

test('his life starts in spring and the date and season follow the one clock', () => {
    const v = resolveWorldCalendar(life(0), null);
    assert.deepEqual([v.year, v.month, v.day, v.seasonId], [1, 3, 12, 'Spring']);
    assert.equal(formatCalendar(v), '12 March, year 1, Spring');
    assert.equal(resolveWorldCalendar(life(atDate(1, 12, 20)), null).seasonId, 'Winter');
    assert.equal(resolveWorldCalendar(life(atDate(2, 1, 15)), null).seasonId, 'Winter');
    assert.equal(resolveWorldCalendar(life(atDate(2, 7, 15)), null).seasonId, 'Summer');
    assert.equal(resolveWorldCalendar(life(atDate(2, 9, 1)), null).seasonId, 'Autumn');
});
test('no date before the life has begun, and the legacy seasons rule is unchanged', () => {
    const s = life(0); delete s.worlds[RI_WOLF_TIDE_WORLD].facts['book.ri.lead.instance'];
    assert.equal(resolveWorldCalendar(s, null), null);
    assert.equal(resolveWorldCalendar({actors: {player: {worldId: 'base.frontier'}}}, {year: 999, month: 5, day: 1, hour: 8, minute: 0, day_count: 1}).seasonId, 'Summer');
});
test('a start fixture can set the stage date through its world fact', () => {
    const v = resolveWorldCalendar(life(5 * DAY, {'book.ri.lead.calendar.startedAt': 5 * DAY}), null);
    assert.equal(v.absoluteLocalDay, calendarDayIndex(P, P.anchor));
});

test('a recurring row opens and closes every year with its phases', () => {
    const cal = {months: P.months}, row = {id: 'tide', key: 'tide', kind: 'public_event', placement: 'recurring', scope: 'public', evidence: 'I',
        recur: {every: {years: 1}, fromDay: 100, durationDays: 9, phaseDays: [{id: 'a', days: 3}, {id: 'b', days: 6}]}};
    const book = buildEventBook([row], {calendar: cal});
    assert.equal(standingOn(book, 'tide', 99).active, false);
    assert.equal(standingOn(book, 'tide', 99).nextDay, 100);
    assert.deepEqual([100, 102, 103, 108].map(d => standingOn(book, 'tide', d).phase.id), ['a', 'a', 'b', 'b']);
    assert.equal(standingOn(book, 'tide', 109).active, false);
    assert.equal(standingOn(book, 'tide', 109).nextDay, 465);
    assert.equal(standingOn(book, 'tide', 465 + 4).index, 1);
    assert.equal(happenedOn(book, 468).length, 1);
    assert.equal(happenedOn(book, 300).length, 0);
    assert.equal(standingOn(buildEventBook([{...row, recur: {...row.recur, untilDay: 100}}], {calendar: cal}), 'tide', 468).active, false);
    assert.throws(() => buildEventBook([row]), /needs a calendar/);
    assert.throws(() => buildEventBook([{...row, recur: {...row.recur, phaseDays: [{id: 'a', days: 3}]}}], {calendar: cal}), /Invalid recurrence/);
    assert.throws(() => buildEventBook([{...row, recur: {...row.recur, every: {days: 5}}}], {calendar: cal}), /repeats before it ends/);
    const closure = buildEventBook([{...row, kind: 'curfew'}], {calendar: cal});
    assert.equal(restrictionsOn(closure, 105).length, 1);
    assert.equal(restrictionsOn(closure, 200).length, 0);
});

test('the tide phase moves with the date: off, early, peak, ebb, off, and again next year', () => {
    const at = (y, m, d) => riWolfTidePhase(life(atDate(y, m, d))).id;
    assert.deepEqual([at(1, 7, 20), at(2, 7, 1), at(2, 7, 15), at(2, 7, 29), at(2, 7, 30), at(2, 8, 13), at(2, 8, 14), at(2, 8, 28), at(2, 8, 29), at(3, 7, 20), at(3, 8, 20)],
        ['off', 'off', 'early', 'early', 'peak', 'peak', 'ebb', 'ebb', 'off', 'early', 'ebb']);
    assert.equal(riWolfTidePhase({clock: 0}).id, 'off');
    assert.equal(riWolfTidePhase({clock: 0}).dated, false);
    assert.match(riWolfTidePhaseLine(riWolfTidePhase(life(atDate(2, 8, 1)))), /height/);
});

test('phases change the patrol weights and the wolf size, and a dateless life keeps its weights', () => {
    const stage = (y, m, d) => life(atDate(y, m, d));
    const off = riEncounterWeights(stage(2, 6, 1)), early = riEncounterWeights(stage(2, 7, 20)), peak = riEncounterWeights(stage(2, 8, 5)), ebb = riEncounterWeights(stage(2, 8, 20));
    assert.ok(peak.small_pack > early.small_pack && early.small_pack > ebb.small_pack);
    assert.ok(peak.quiet < early.quiet && early.quiet < ebb.quiet);
    assert.equal(peak.wild_gu, off.wild_gu);
    for (const row of RI_PATROL_ENCOUNTERS) assert.ok(Number.isInteger(off[row.id]), row.id);
    const rows = RI_PATROL_ENCOUNTERS.map(r => r.id);
    assert.deepEqual(riEncounterWeights({clock: 0, simulation: {seed: 1}, actors: {player: {facts: {}}}}).small_pack !== undefined, true);
    // 14 days x 24 hours inside one phase (early: Jul 15-28, peak: Jul 30-Aug 12): the big-wolf draws differ by the phase's dial.
    const bigShare = (m, d) => { let n = 0; for (let h = 0; h < 14 * 24; h++) if (riWolfFoe(life(atDate(2, m, d, 0) + h * 60)).large) n++; return n; };
    const ours = {early: bigShare(7, 15), peak: bigShare(7, 30)};
    assert.ok(ours.peak > ours.early, JSON.stringify(ours));
    assert.equal(riWolfFoe(stage(2, 8, 5)).phase, 'peak');
    for (const [id, t] of Object.entries(RI_TIDE_PHASES)) assert.ok(t.why.length > 10 && t.line.length > 10, id);
    assert.ok(rows.length > 0);
});
