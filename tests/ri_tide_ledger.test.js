// Fang Yuan's record of each wolf tide (ri_tide_ledger.js): patrols reported and merit credited at the board, counted from the engine's
// completion counts since the tide opened, closed into the ledger when the tide ends, and read at the academy.
import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarDayIndex} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {RI_WOLF_TIDE_WORLD} from '../src/ri_wolf_tide.js';
import {settleTideLedger, riTideLedgerLine, riTideLedgerView, RI_TIDE_LEDGER_KEEP} from '../src/ri_tide_ledger.js';
import {describePlace} from '../src/place_descriptions.js';

const DAY = 1440, P = WORLD_CALENDAR_PROFILES[RI_WOLF_TIDE_WORLD], D = 'book.ri.lead.day';
const atDate = (year, month, day, hour = 12) => (calendarDayIndex(P, {year, month, day}) - calendarDayIndex(P, P.anchor)) * DAY + (hour - P.anchor.hour) * 60;
const life = (clock, done = {}) => ({clock, simulation: {seed: 4242, people: {player: {bornAt: 0}}},
    actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts: {}, completed: Object.fromEntries(Object.entries(done).map(([k, n]) => [`${D}.${k}`, n]))}},
    worlds: {[RI_WOLF_TIDE_WORLD]: {facts: {'book.ri.lead.instance': 'run.1'}}}});
const empty = {open: null, past: []};

test('a tide counts from when it opens: patrols reported, and merit from the eyes and tallies handed in', () => {
    let l = settleTideLedger(empty, life(atDate(2, 7, 15), {report: 4, hand_in_eye: 2}));
    assert.ok(l.open, 'the tide is open');
    const later = life(atDate(2, 7, 20), {report: 6, hand_in_eye: 5, hand_in_tally: 1});
    l = settleTideLedger(l, later);
    assert.deepEqual(riTideLedgerView(later, l).thisTide, {patrols: 2, merit: 40}, 'two reports, three eyes and a tally since it opened');
    assert.match(riTideLedgerLine(later, l), /^This tide you have reported 2 patrols and the board has credited you 40 merit\.$/);
    assert.equal(riTideLedgerLine(life(atDate(2, 7, 15), {report: 4, hand_in_eye: 2}), settleTideLedger(empty, life(atDate(2, 7, 15), {report: 4, hand_in_eye: 2}))),
        'You have not reported a patrol this tide yet.');
});

test('the tide closes into the ledger when it ends, and the academy reads the last tide between tides', () => {
    let l = settleTideLedger(empty, life(atDate(2, 7, 15), {report: 1}));
    l = settleTideLedger(l, life(atDate(2, 7, 25), {report: 2, hand_in_tally: 1}));
    const after = life(atDate(2, 10, 1), {report: 2, hand_in_tally: 1});
    l = settleTideLedger(l, after);
    assert.equal(l.open, null);
    assert.deepEqual(l.past.map(t => [t.patrols, t.merit]), [[1, 10]]);
    assert.equal(riTideLedgerLine(after, l), 'Last tide you reported one patrol and earned 10 merit at the board.');
    let many = empty;
    for(let y = 2; y < 2 + RI_TIDE_LEDGER_KEEP + 2; y++) { many = settleTideLedger(many, life(atDate(y, 7, 15))); many = settleTideLedger(many, life(atDate(y, 10, 1))); }
    assert.equal(many.past.length, RI_TIDE_LEDGER_KEEP, 'the ledger keeps a few tides');
});

test('nothing before the first tide, outside his life, or with no date; the academy shows the line beside the tide readout', () => {
    assert.equal(riTideLedgerLine(life(atDate(2, 6, 1)), empty), '');
    assert.equal(riTideLedgerLine({clock: 0, actors: {player: {worldId: 'book.hp.lead.world'}}}, empty), '');
    const undated = {clock: 0, actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts: {}, completed: {}}}};
    assert.equal(settleTideLedger(empty, undated), empty, 'no date, no change');
    assert.match(describePlace('book.ri.lead.academy', 'The academy.', life(atDate(2, 7, 15))), /You have not reported a patrol this tide yet\./);
});
