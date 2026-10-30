// Representation contract (RCT2): every figure fixture, in the gallery or added by a representation branch,
// must meet one bar. A new fixture module in src/ui/preview/fixtures/ is picked up here without editing this file.
//   fixtures register into FIGURE_FIXTURES on import, or export arrays of specs (any export whose items carry id and title).
//   a module may export SEAT_LIMITED_PAIRS = [{id, full, limited}] : the same subject read by a seat that knows less.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec} from '../src/ui/figure.js';
import {FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const fixtureDir = new URL('../src/ui/preview/fixtures/', import.meta.url);
const pairs = [];
const FIGURE_PARTS = ['rings', 'nodes', 'slots', 'tracks', 'notes', 'edges', 'tables', 'cards', 'bands', 'chips', 'bars'];
const isSpec = v => v && typeof v === 'object' && typeof v.id === 'string' && typeof v.title === 'string' && FIGURE_PARTS.some(k => Array.isArray(v[k]));
for (const file of readdirSync(fixtureDir).filter(f => f.endsWith('.js')).sort()) {
    const mod = await import(new URL(file, fixtureDir));
    for (const value of Object.values(mod)) {
        if (Array.isArray(value) && value.length && value.every(isSpec)) for (const spec of value) if (!FIGURE_FIXTURES.some(f => f.id === spec.id)) FIGURE_FIXTURES.push(spec);
    }
    if (mod.SEAT_LIMITED_PAIRS) pairs.push(...mod.SEAT_LIMITED_PAIRS);
}

const DOM_BUDGET = 2500; // current maximum is well under; a figure past this is a layout problem, not a bigger figure
const count = node => 1 + [...node.children].reduce((sum, child) => sum + count(child), 0);
const draw = (spec, options = {}) => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    return {host, ...renderFigure(host, spec, {text: true, ...options})};
};
// Every fact a spec states in words: labels, notes, step notes, legend text.
const factWords = spec => [
    ...(spec.rings || []).flatMap(r => [r.label, ...(r.segments || []).map(s => s.label)]),
    ...(spec.nodes || []).map(n => n.label), ...(spec.slots || []).map(s => s.label),
    ...(spec.tracks || []).flatMap(t => [t.label, t.progress, ...t.steps.flatMap(s => [s.label, s.note])]),
    ...(spec.notes || []).map(n => n.text), ...(spec.edges || []).map(e => e.label),
    ...(spec.tables || []).flatMap(t => [t.label, ...t.rows.flatMap(r => r.cells)]),
    ...(spec.cards || []).flatMap(c => [c.label, ...c.groups.flatMap(g => [g.label, ...g.rows.flatMap(r => [r.label, r.text])])]),
    ...(spec.bands || []).flatMap(b => [b.label, ...(b.lanes || []), ...b.spans.flatMap(x => [x.label, x.note])]),
    ...(spec.chips || []).flatMap(c => [c.label, ...c.items.flatMap(i => [i.label, i.note])]),
    ...(spec.bars || []).flatMap(b => [b.label, ...b.rows.flatMap(r => [r.label, r.words])]),
].filter(Boolean);

test('fixtures were found and every spec validates', () => {
    assert(FIGURE_FIXTURES.length >= 2);
    for (const spec of FIGURE_FIXTURES) validateFigureSpec(spec);
    assert.equal(new Set(FIGURE_FIXTURES.map(f => f.id)).size, FIGURE_FIXTURES.length, 'fixture ids are unique');
});

test('every fixture has a text form that carries all its stated facts, with or without effects', () => {
    for (const spec of FIGURE_FIXTURES) {
        const text = figureText(spec);
        assert(text.length > 20, `${spec.id} has a text form`);
        for (const word of factWords(spec)) assert(text.includes(word), `${spec.id}: "${word}" is in the text form`);
        // Effects are classes only: stripping them from the spec cannot change a single fact.
        const bare = JSON.parse(JSON.stringify(spec), (k, v) => k === 'effect' ? undefined : v);
        assert.equal(figureText(bare), text, `${spec.id}: effects add no facts`);
        const {host} = draw(spec);
        assert(host.querySelector('.fig-text'), `${spec.id} renders its text form`);
    }
});

test('fixtures draw inside a DOM node budget', () => {
    for (const spec of FIGURE_FIXTURES) {
        const {host} = draw(spec);
        assert(count(host) <= DOM_BUDGET, `${spec.id} has ${count(host)} nodes`);
    }
});

test('seat-limited pairs show less than the full read', () => {
    for (const {id, full, limited} of pairs) {
        const a = figureText(full), b = figureText(limited);
        assert(b.length < a.length, `${id}: the limited seat reads less`);
        assert.notEqual(a, b);
    }
});

test('renderers take their document from the node, never a global', () => {
    const files = [
        ...['figure.js', 'scene_card.js'].map(f => `src/ui/${f}`),
        ...readdirSync(new URL('../src/ui/', import.meta.url)).filter(f => /_(figure|versus|view|spec)\.js$/.test(f)).map(f => `src/ui/${f}`),
        ...readdirSync(new URL('../src/', import.meta.url)).filter(f => /_figure\.js$/.test(f)).map(f => `src/${f}`),
    ];
    for (const file of new Set(files)) {
        const code = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
        assert(!/(^|[^.\w])document\.(create|getElement|querySelector|body|head)/.test(code), `${file} uses the global document`);
    }
});

test('figure styles use tokens only', () => {
    const css = readFileSync(new URL('../styles/figure.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const literal = css.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g) || [];
    assert.deepEqual(literal.filter(l => !/^(#(fff|000)(fff|000)?)$/.test(l)), [], 'no colour literals outside var(--…) fallbacks');
});
