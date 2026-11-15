// PS143: a place's description changes with what happened there (place_descriptions.js). Fang Yuan's clan academy reads how the
// wall stands in the wolf tide (ri_lead_day_tide.js), using the tide's own words; a dateless life adds nothing.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendarDayIndex} from '../src/world_calendar.js';
import {WORLD_CALENDAR_PROFILES} from '../src/world_calendar_content.js';
import {registerPlaceDescription, describePlace, placeDescriber} from '../src/place_descriptions.js';
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

test('the clan academy reads the tide: peak and ebb in its own words, a thinned wall, nothing out of a dated life', () => {
    assert.equal(describePlace(RI_ACADEMY, 'The academy.', life(atDate(2, 8, 5))), `The academy. ${RI_TIDE_PHASES.peak.line}`);
    assert.equal(riAcademyTideLine(life(atDate(2, 8, 20))), RI_TIDE_PHASES.ebb.line);
    assert.equal(riAcademyTideLine(life(atDate(2, 6, 1))), RI_TIDE_PHASES.off.line, 'a dated life outside the tide hears the wall is quiet');
    let state = life(atDate(2, 8, 5));
    for(let i = 0; i < 40; i++) state = life(state.clock, {[RI_WOLF_TIDE_FACT]: riRecordWolfKill(state, {n: 1})});
    assert.match(riAcademyTideLine(state), /thinned this stretch of the wall/);
    assert.equal(riAcademyTideLine({clock: 0, actors: {player: {worldId: RI_WOLF_TIDE_WORLD, facts: {}}}}), '', 'a life with no date says nothing');
    assert.equal(riAcademyTideLine({clock: 0, actors: {player: {worldId: 'book.hp.lead.world'}}}), '');
});

test('the native location reads its description through the registry', () => {
    assert.match(readFileSync(new URL('../src/main.js', import.meta.url), 'utf8'), /getDescription:placeDescriber\(l\.id,l\.description,\(\)=>expansionState\)/);
});
