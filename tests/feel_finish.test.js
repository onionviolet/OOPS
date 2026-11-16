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
    for (const k of ['glow', 'ready', 'light', 'states', 'floats', 'hitFlash', 'sound', 'cueReady', 'cueLevel', 'cueFight', 'cueGate', 'yair']) assert(keys.includes(k), k);
    for (const s of FEEL_SETTINGS) assert(s.options.some(([v]) => v === s.default), s.key);
    assert.equal(FEEL_SETTINGS.find(s => s.key === 'sound').default, 'off');
    // Each toggle is real: the stylesheet keys every effect off its own attribute.
    const css = readFileSync(new URL('../styles/feel_finish.css', import.meta.url), 'utf8');
    for (const a of ['data-feel-glow', 'data-feel-ready', 'data-look-motion', 'data-feel-light', 'data-feel-states']) assert(css.includes(a), a);
});

test('a fight line names who took how much, and misses float nothing (PS186, PS187)', async () => {
    const {parseFightLine} = await import('../src/ui/feel_finish.js');
    const foes = ['A lightning wolf', 'A wolf'];
    assert.deepEqual(parseFightLine('You use Claw on A lightning wolf: it lands, for 10.1', foes), {target: 'A lightning wolf', amount: 10.1, kind: 'damage'});
    assert.deepEqual(parseFightLine('A lightning wolf hits you on the arm for 3.5 physical', foes), {target: 'you', amount: 3.5, kind: 'damage'});
    assert.equal(parseFightLine('You use Claw on A wolf: it misses', foes), null);
    assert.equal(parseFightLine('The wind rises.', foes), null);
    assert.equal(parseFightLine('You recover 4 health', foes).kind, 'heal');
    const {fightFromMessage} = await import('../src/ui/feel_finish.js');
    assert.deepEqual(fightFromMessage('message_common message_enemy_attacked message_combat', 'Wolf rat was hit for 1 bludgeoning damage'), {target: 'Wolf rat', amount: 1, kind: 'damage'});
    assert.deepEqual(fightFromMessage('message_common message_hero_attacked message_combat', 'Hero was hit for 5.9 piercing damage'), {target: 'you', amount: 5.9, kind: 'damage'});
    assert.equal(fightFromMessage('message_common message_default message_combat', 'Wolf rat misses you'), null);
});

test('cues follow the message log\'s own classes and words (PS189)', async () => {
    const {cueForMessage} = await import('../src/ui/feel_finish.js');
    assert.equal(cueForMessage('message_common message_victory message_combat'), 'fight');
    assert.equal(cueForMessage('message_common message_hero_defeated'), 'fight');
    assert.equal(cueForMessage('message_common message_skill_leveled_up'), 'level');
    assert.equal(cueForMessage('message_common message_unlocks', 'Reached level 3'), 'level');
    assert.equal(cueForMessage('message_common message_location_unlocked'), 'gate');
    assert.equal(cueForMessage('message_common message_unlocks', 'You can now fish here'), 'gate');
    assert.equal(cueForMessage('message_common message_loot'), null);
});
