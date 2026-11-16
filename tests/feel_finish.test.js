// PS153-PS159 feel and finish: the daylight mapping and the Options rows (presentation only).
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FEEL_SETTINGS, daylightOf} from '../src/ui/feel_finish.js';

test('time-of-day light reads the weather light level, rain and roof', () => {
    assert.deepEqual(daylightOf({light: 100}), {level: 1, sky: 'day'});
    assert.deepEqual(daylightOf({light: 40}), {level: 0, sky: 'night'});
    assert.equal(daylightOf({light: 70}).sky, 'dusk');
    assert.equal(daylightOf({light: 100, raining: true}).sky, 'rain');
    assert.equal(daylightOf({light: 100, roofed: true}).sky, 'indoor');
    assert.equal(daylightOf({light: 40, roofed: true}).sky, 'night');
});

test('every effect has its own Options row, a real default, and sound starts off', () => {
    const keys = FEEL_SETTINGS.map(s => s.key);
    for (const k of ['glow', 'ready', 'light', 'states', 'sound', 'yair']) assert(keys.includes(k), k);
    for (const s of FEEL_SETTINGS) assert(s.options.some(([v]) => v === s.default), s.key);
    assert.equal(FEEL_SETTINGS.find(s => s.key === 'sound').default, 'off');
    // Each toggle is real: the stylesheet keys every effect off its own attribute.
    const css = readFileSync(new URL('../styles/feel_finish.css', import.meta.url), 'utf8');
    for (const a of ['data-feel-glow', 'data-feel-ready', 'data-look-motion', 'data-feel-light', 'data-feel-states']) assert(css.includes(a), a);
});
