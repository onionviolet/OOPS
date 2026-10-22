import {rainCycle,isRainingOnDay} from '../src/weather_calendar.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {Game_Time, night_time} from '../src/game_time.js';
import {BASE_CLIMATE_PROFILE as base, PROPOSED_CLIMATE_PROFILES as proposals,
    deriveWorldClimate as derive, legacyClimateEnvironment} from '../src/world_climate.js';

// Exercise actual legacy formula without importing its main.js/DOM dependency.
// Remove only module wiring; all temperature, rain and light arithmetic is live.
const legacySource = readFileSync(new URL('../src/weather.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '').replace(/export\s*\{[^}]*\};\s*$/, '');
function legacy(time, place) {
    const ctx = vm.createContext({current_game_time: time, current_location: place, Game_Time, night_time, rain_cycle:rainCycle, isRainingOnDay});
    vm.runInContext(`${legacySource}\nglobalThis.result = {temperature:get_temperature_at(current_game_time), raining:is_raining(), lightLevel:get_current_light_level()};`, ctx);
    return ctx.result;
}
const frame = (day = 0, extra = {}) => ({
    id: 'proposal.local.clock', kind: 'local', value: {elapsed: day * 1440, unit: 'played_minutes', absence: 'freeze'},
    policy: {mode: 'presence', rate: {numerator: 1, denominator: 1}},
    environment: {absoluteLocalDay: day, dayFraction: .5, seasonId: 'Summer', seasonPhase: .2, daylight: 1, ...extra},
});
function freeze(value) {
    if (value && typeof value === 'object') {Object.values(value).forEach(freeze); Object.freeze(value);}
    return value;
}

test('base temperature, rain and light match weather.js across seasons, cycles and peaks', () => {
    for (const month of [1, 3, 4, 6, 7, 9, 10, 12]) {
        for (const day_count of [0, 1, 4, 5, 10, 11, 12, 13, 142, 143, 10000]) {
            for (const [hour, minute] of [[0, 0], [3, 30], [4, 0], [4, 30], [4, 59], [5, 0], [13, 59], [14, 0], [19, 30], [20, 0], [20, 30], [23, 59]]) {
                const time = new Game_Time({year: 999, month, day: 1, hour, minute, day_count});
                for (const place of [
                    {temperature_range_modifier: 1, temperature_modifier: 0},
                    {temperature_range_modifier: .4, temperature_modifier: -7},
                    {is_temperature_static: true, static_temperature: 9},
                    {is_temperature_static: true, static_temperature: null},
                    {types: [{type: 'dark', stage: 2}]},
                ]) {
                    // Legacy outdoors require numeric range/flat fields.
                    const location = {temperature_range_modifier: 1, temperature_modifier: 0, ...place};
                    const actual = derive(base, location, time, 193);
                    const expected = legacy(time, location);
                    assert.equal(actual.temperature, expected.temperature);
                    assert.equal(actual.raining, expected.raining);
                    assert.equal(actual.lightLevel, expected.lightLevel);
                    assert.deepEqual(derive(base, location, {...frame(), environment: legacyClimateEnvironment(time)}, 193), actual);
                }
            }
        }
    }
});

test('pure seeded derive is stable across revisit, skipped-day order and frozen inputs', () => {
    const profile = proposals.highlandSchool;
    const place = freeze({id: 'school.courtyard', regionId: 'highland'});
    const clock = freeze(frame(14));
    const before = JSON.stringify({profile, place, clock});
    const expected = derive(profile, place, clock, 123);
    for (const day of [80, 0, 3, 1000]) derive(profile, place, frame(day), 999);
    assert.deepEqual(derive(profile, place, clock, 123), expected);
    assert.equal(JSON.stringify({profile, place, clock}), before);
    const direct = [0, 1, 2, 3, 4].map(day => derive(profile, place, frame(day), 123));
    const split = [0, 1].concat([2, 3, 4]).map(day => derive(profile, place, frame(day), 123));
    assert.deepEqual(split, direct);
    assert.notDeepEqual(direct, [0, 1, 2, 3, 4].map(day => derive(profile, place, frame(day), 321)));
});

test('no-season world ignores external season and retains explicit daylight', () => {
    const p = proposals.noSeasonDesert;
    assert.deepEqual(derive(p, {}, frame(4, {seasonId: 'Winter'}), 3), derive(p, {}, frame(4, {seasonId: null}), 3));
    const result = derive(p, {}, frame(4, {daylight: null}), 3);
    assert.equal(result.seasonId, null);
    assert.equal(result.seasonPhase, null);
    assert.equal(result.raining, false);
    assert.equal(result.lightLevel, null);
});

test('custom 7-day temperature and 3-day rain cycles wrap, including negative anchored days', () => {
    const p = {...base, id: 'proposal.custom', seasons: {wet: -2, dry: 3},
        temperatureCycle: [0, 1, 2, 3, 4, 5, 6], rainCycle: [0, -1, 0]};
    for (const day of [-8, -1, 0, 1, 6, 7, 20, 21]) {
        const a = derive(p, {}, frame(day, {seasonId: 'wet'}));
        const b = derive(p, {}, frame(day + 21, {seasonId: 'wet'}));
        assert.equal(a.temperature, b.temperature);
        assert.equal(a.raining, b.raining);
    }
    assert.equal(derive(p, {}, frame(7, {seasonId: 'dry'})).temperature -
        derive(p, {}, frame(7, {seasonId: 'wet'})).temperature, 5);
});

test('indoor and sealed places suppress weather exposure and use controlled climate', () => {
    for (const environment of ['indoor', 'sealed']) {
        const result = derive(base, {environment, static_temperature: 21, lightLevel: 70}, frame(5));
        assert.equal(result.temperature, 21);
        assert.equal(result.raining, false);
        assert.equal(result.rainTemperatureModifier, 0);
        assert.equal(result.lightLevel, 70);
    }
    const result = derive(proposals.sealedRealm, {}, frame(5, {seasonId: null, daylight: null}));
    assert.equal(result.temperature, 18);
    assert.equal(result.lightLevel, 60);
    assert.equal(result.raining, false);
});

test('unknown explicit season and invalid coordinates reject instead of inheriting Frontier', () => {
    assert.throws(() => derive(proposals.highlandSchool, {}, frame(0, {seasonId: 'unknown'})), /Unknown season/);
    assert.throws(() => derive(proposals.highlandSchool, {}, {value: {elapsed: 0}}), /calendar environment/);
    assert.throws(() => derive(base, {}, frame(0, {dayFraction: 1})), /calendar environment/);
    assert.throws(() => derive(base, {}, frame(), -1), /seed/);
    assert.throws(() => derive({...base, rainCycle: []}, {}, frame()), /cycle/);
    assert.throws(() => derive(base, {environment: 'unknown'}, frame()), /environment/);
});

test('calendar-owned custom season cycle and non-24-hour day are consumed unchanged', () => {
    const p = {...base, id: 'proposal.ten-day-calendar', seasons: {wet: -2, dry: 3},
        temperatureCycle: [0], rainCycle: [0]};
    // Fixture standing in for W33, not a second production calendar implementation.
    const customFrame = day => frame(day, {seasonId: day % 10 < 4 ? 'wet' : 'dry',
        seasonPhase: (day % 10) / 10, dayFraction: 20 / 27, daylight: .25});
    const a = derive(p, {}, customFrame(2));
    const b = derive(p, {}, customFrame(12));
    assert.equal(a.temperature, b.temperature);
    assert.equal(a.seasonId, b.seasonId);
    assert.equal(a.seasonPhase, b.seasonPhase);
    assert.equal(a.lightLevel, 55);
    assert.equal(derive(p, {}, customFrame(4)).temperature - a.temperature, 5);
});
