// RPX1/RPX2: the bench detail -> figure adapter. Invented names only (CLR3).
import test from 'node:test';
import assert from 'node:assert/strict';
import {riteFigureSpec} from '../src/ui/rite_figure.js';
import {figureText, validateFigureSpec} from '../src/ui/figure.js';
import {RITE_PREPARING, RITE_BREWING} from '../src/ui/preview/fixtures/rituals.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const base = {id: 'ash_7', name: 'Ash Reader', seq: 7, pathway: 'Ash', status: 'brewable', minutes: 60, via: null, ritual: null, rite: null,
    formulaKnown: false, brewing: false, ready: false, left: 0, doses: 0, slots: [{id: 'main', role: 'main material', name: 'Grey reed', need: 2, held: 1}]};
const steps = spec => spec.tracks.find(t => t.id === 'brew').steps.map(s => s.state);

test('each rite condition is a slot whose state word matches its grade, and the odds sit at the centre', () => {
    const text = figureText(RITE_PREPARING);
    assert.match(text, /1\. Under a silent bell \(filled\)/);
    assert.match(text, /2\. Before the first bird \(strained\)/);
    assert.match(text, /3\. Holding one breath \(empty\)/);
    assert.match(text, /Drink now · 62% odds \(strained\)/);
    assert.match(text, /stand-in a shuttered room by day, fit 0.5/);
    assert.match(text, /Holding one breath: still needed/);
    assert.ok(!/broken/.test(text), 'nothing is attempted, so nothing is broken');
});

test('a formula with no rite draws materials and the brew track only', () => {
    const spec = validateFigureSpec(riteFigureSpec(base));
    assert.equal(spec.rings.length + spec.nodes.length + spec.slots.length, 0);
    assert.deepEqual(spec.tracks.map(t => t.id), ['materials', 'brew']);
    assert.match(figureText(spec), /Track Materials, 0 of 1 done: 1\. Grey reed 1\/2 \(empty\)/);
    assert.deepEqual(steps(spec), ['current', 'pending', 'pending', 'pending', 'pending']);
});

test('the brew track follows formula, materials, brewing, bottling and holding a dose', () => {
    const full = [{...base.slots[0], held: 2}];
    assert.deepEqual(steps(riteFigureSpec({...base, formulaKnown: true})), ['done', 'current', 'pending', 'pending', 'pending']);
    assert.deepEqual(steps(riteFigureSpec({...base, formulaKnown: true, slots: full})), ['done', 'done', 'current', 'pending', 'pending']);
    const brewing = riteFigureSpec({...base, formulaKnown: true, brewing: true, left: 12});
    assert.deepEqual(steps(brewing), ['done', 'done', 'current', 'pending', 'pending']);
    assert.equal(brewing.tracks[1].steps[2].label, 'Brew · 12 min left');
    assert.equal(brewing.tracks[1].steps[2].effect, 'pulse');
    assert.deepEqual(steps(riteFigureSpec({...base, formulaKnown: true, brewing: true, ready: true})), ['done', 'done', 'done', 'current', 'pending']);
    assert.deepEqual(steps(riteFigureSpec({...base, formulaKnown: true, doses: 1})), ['done', 'done', 'done', 'done', 'current']);
});

test('inspect-only rows and main-route rows draw no track and claim no holdings', () => {
    const inspect = riteFigureSpec({...base, status: 'inspect'});
    assert.deepEqual(inspect.tracks.map(t => t.id), ['materials']);
    assert.deepEqual(inspect.tracks[0].steps, [{label: 'Grey reed'}]);
    const via = riteFigureSpec({...base, via: 'Brewed with the actions above.'});
    assert.deepEqual(via.tracks.map(t => t.id), ['materials']);
    assert.match(figureText(via), /Brewed with the actions above\./);
    assert.equal(riteFigureSpec(null), null);
    assert.equal(riteFigureSpec({...base, slots: [], status: 'inspect'}), null);
});

test('glow marks only settled met conditions; the gallery registers both fixtures through the adapter', () => {
    const glows = RITE_BREWING.slots.filter(s => s.effect === 'glow');
    assert.ok(glows.length && glows.every(s => s.state === 'filled' && s.ring === 'rite'));
    assert.ok(RITE_PREPARING.slots.filter(s => s.state !== 'filled').every(s => !s.effect));
    for(const spec of [RITE_PREPARING, RITE_BREWING]) { validateFigureSpec(spec); assert.ok(FIGURE_FIXTURES.includes(spec)); }
});
