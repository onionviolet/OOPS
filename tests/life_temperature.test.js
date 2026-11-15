// PS33: the cold conditions read the temperature of the life's own world (world_weather_display.js lifeTemperature), so a lead life
// indoors is not frozen by the frontier's Winter, and the native Village keeps its exact weather.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lifeTemperature} from '../src/world_weather_display.js';
// The first cold threshold, read from its owner's source (importing data/character.js pulls the whole shell).
const firstCold = Number(/cold_status_temperatures = \[(-?\d+)/.exec(readFileSync(new URL('../src/data/character.js', import.meta.url), 'utf8'))[1]);

const winterNight = () => -6;   // the frontier's Winter dusk, cold enough for Freezing
const noView = () => { throw Error('the calendar is read only when a climate needs it'); };
const academy = {id: 'book.ri.lead.academy', is_under_roof: true}, wall = {id: 'outer_wall', is_under_roof: false};

test('the native world keeps its exact weather, under a roof or not (the Village\'s cold does not change)', () => {
    assert.equal(lifeTemperature('base.frontier', noView, {id: 'Shack', is_under_roof: true}, winterNight), -6);
    assert.equal(lifeTemperature('base.frontier', noView, {id: 'Village', is_under_roof: false}, winterNight), -6);
});

test('a lead life under a roof is indoors: no cold conditions at the clan academy on a winter night', () => {
    const t = lifeTemperature('book.ri.lead.world', noView, academy, winterNight);
    assert.ok(Number.isFinite(firstCold) && t > firstCold, `indoor ${t} is above the first cold threshold`);
});

test('outdoors, a world with no climate of its own borrows the frontier weather; a world with a climate but no calendar does too', () => {
    assert.equal(lifeTemperature('book.ri.lead.world', noView, wall, winterNight), -6);
    assert.equal(lifeTemperature('book.mol.cyoria', () => null, wall, winterNight), -6);
});

test('the cold conditions are fed by lifeTemperature', () => {
    const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
    assert.match(main, /const new_temperature = lifeTemperature\(/);
});
