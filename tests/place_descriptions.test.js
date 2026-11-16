// PS143: a place's description changes with what happened there (place_descriptions.js). Fang Yuan's clan academy reads how the
// wall stands in the wolf tide (ri_lead_day_tide.js), using the tide's own words; a dateless life adds nothing.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendarDayIndex} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {registerPlaceDescription, describePlace, placeDescriber, setPlaceRedraw, refreshPlaceDescription} from '../src/place_descriptions.js';
import {RI_ACADEMY, riAcademyTideLine} from '../src/ri_lead_day_tide.js';
import {RI_TIDE_PHASES, RI_WOLF_TIDE_WORLD, RI_WOLF_TIDE_FACT, riRecordWolfKill} from '../src/ri_wolf_tide.js';

const DAY = 1440, P = WORLD_CALENDAR_PROFILES[RI_WOLF_TIDE_WORLD];
const life = (clock, facts = {}) => ({clock, simulation: {seed: 4242, people: {player: {bornAt: 0}}}, actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts}},
    worlds: {[RI_WOLF_TIDE_WORLD]: {facts: {'book.ri.lead.instance': 'run.1'}}}});
const atDate = (year, month, day, hour = 12) => (calendarDayIndex(P, {year, month, day}) - calendarDayIndex(P, P.anchor)) * DAY + (hour - P.anchor.hour) * 60;

test('a place reads its base text plus what its sources say; a broken or silent source adds nothing', () => {
    const off = registerPlaceDescription('test.place', s => s.tag), off2 = registerPlaceDescription('test.place', () => { throw Error('x'); });
    assert.equal(describePlace('test.place', 'A yard.', {tag: 'It rained.'}), 'A yard. It rained.');
    assert.equal(describePlace('test.place', 'A yard.', {}), 'A yard.');
    assert.equal(placeDescriber('test.place', 'A yard.', () => ({tag: 'Snow.'}))(), 'A yard. Snow.');
    off(); off2();
    assert.equal(describePlace('test.place', 'A yard.', {tag: 'gone'}), 'A yard.');
});

test('the clan academy reads the tide while it is on: phase and day, wolves near the wall, the tide\'s words, a thinned wall; hidden otherwise', () => {
    const peak = describePlace(RI_ACADEMY, 'The academy.', life(atDate(2, 8, 5)));
    assert.match(peak, /^The academy\. Wolf tide, peak day \d+ of 15\. /);
    assert.ok(peak.includes(RI_TIDE_PHASES.peak.line));
    assert.match(peak, /About \d+ lightning wolves are near the wall\./);
    assert.match(riAcademyTideLine(life(atDate(2, 8, 20))), /^Wolf tide, ebb day \d+ of 15\./);
    const early = riAcademyTideLine(life(atDate(2, 7, 15))), peakNear = Number(/About (\d+)/.exec(peak)[1]);
    assert.match(early, /day 1 of 15/);
    assert.ok(Number(/About (\d+)/.exec(early)[1]) < peakNear, 'the peak crowds the wall more than the early days');
    let state = life(atDate(2, 8, 5));
    for(let i = 0; i < 16; i++) state = life(state.clock, {[RI_WOLF_TIDE_FACT]: riRecordWolfKill(state, {n: 1})});
    assert.match(riAcademyTideLine(state), /thinned this stretch/);
    assert.equal(riAcademyTideLine(life(atDate(2, 6, 1))), '', 'out of the tide the line is hidden');
    assert.equal(riAcademyTideLine({clock: 0, actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts: {}}}}), '', 'a life with no date says nothing');
    assert.equal(riAcademyTideLine({clock: 0, actors: {player: {worldId: 'book.hp.lead.world'}}}), '');
});

test('the native location reads its description through the registry', () => {
    assert.match(readFileSync(new URL('../src/main.js', import.meta.url), 'utf8'), /getDescription:placeDescriber\(l\.id,l\.description,\(\)=>expansionState\)/);
});

test('a refresh redraws the place box once when its drawn text has changed, and not otherwise', () => {
    let hour = 9, redraws = 0;
    const off = registerPlaceDescription('test.redraw.place', s => s.hour < 12 ? 'A cart is unloading.' : '');
    setPlaceRedraw(() => { redraws++; });
    try {
        const describe = placeDescriber('test.redraw.place', 'A street.', () => ({hour}));
        assert.equal(describe(), 'A street. A cart is unloading.');
        assert.equal(refreshPlaceDescription(), false, 'nothing changed');
        hour = 13;
        assert.equal(refreshPlaceDescription(), true); assert.equal(redraws, 1);
        assert.equal(refreshPlaceDescription(), false, 'once per change, even if the redraw draws another place');
    } finally { off(); setPlaceRedraw(null); }
});
