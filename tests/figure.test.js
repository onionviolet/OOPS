import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure, figureText, validateFigureSpec, FIGURE_STATES} from '../src/ui/figure.js';
import {RITUAL_FIXTURE, WEB_FIXTURE, FIGURE_FIXTURES} from '../src/ui/preview/figure_fixtures.js';

const draw = spec => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>');
    const host = dom.document.getElementById('host');
    return {host, ...renderFigure(host, spec, {text: true})};
};
const all = (node, test) => [node, ...[...node.children].flatMap(child => all(child, test))].filter(test);
const cls = (node, name) => (node.getAttribute('class') || '').split(/\s+/).includes(name);

test('validation names the problem for malformed specs', () => {
    const base = {id: 'x', title: 'X'};
    const bad = [
        [{...base, rings: [{id: 'r', radius: 2, slots: 1}]}, /radius/],
        [{...base, nodes: [{id: 'a', label: 'A', at: 'center', state: 'sparkly'}]}, /unknown state/],
        [{...base, nodes: [{id: 'a', label: 'A', at: 'center'}, {id: 'a', label: 'B', at: 'center'}]}, /duplicate/],
        [{...base, slots: [{id: 's', label: 'S', ring: 'none', index: 0}]}, /unknown ring/],
        [{...base, rings: [{id: 'r', radius: 1, slots: 2}], slots: [{id: 's', label: 'S', ring: 'r', index: 5}]}, /beyond/],
        [{...base, nodes: [{id: 'a', label: 'A', at: 'center'}], edges: [{from: 'a', to: 'ghost', kind: 'k'}]}, /two known/],
        [{...base, tracks: [{id: 't', steps: []}]}, /needs steps/],
        [{...base, nodes: [{id: 'a', label: 'A', at: 'center', effect: 'sparks'}]}, /unknown effect/],
        [{id: 'x'}, /title/],
    ];
    for (const [spec, pattern] of bad) assert.throws(() => validateFigureSpec(spec), pattern);
    assert.equal(validateFigureSpec(RITUAL_FIXTURE).rings.find(ring => ring.id === 'parts').count, 4);
    assert.equal(validateFigureSpec(WEB_FIXTURE).rings[0].count, 5);
});

test('both fixtures render through one path with an accessible title, description and no leftover facts-by-color', () => {
    for (const spec of FIGURE_FIXTURES) {
        const {host, svg, text} = draw(spec);
        assert.equal(svg.getAttribute('role'), 'img');
        assert.equal(all(svg, n => n.tagName.toLowerCase() === 'title' && n.parentNode === svg)[0].textContent, spec.title);
        assert.equal(all(svg, n => n.tagName.toLowerCase() === 'desc')[0].textContent, figureText(spec));
        assert.equal(svg.namespaceURI, 'http://www.w3.org/2000/svg');
        assert.equal(host.dataset.figure, spec.id);
        assert.equal(host.querySelector('.fig-text').textContent, text);
        const markers = all(svg, n => cls(n, 'fig-marker'));
        assert.equal(markers.length, (spec.nodes || []).length + (spec.slots || []).length);
        // Every state that is drawn carries a mark glyph and every drawn label appears in the text form.
        for (const marker of markers) {
            const state = Object.keys(FIGURE_STATES).find(s => cls(marker, `fig-state--${s}`));
            const glyphs = all(marker, n => cls(n, 'fig-glyph') || cls(n, 'fig-badge')).map(n => n.textContent).join('');
            if (state) assert(glyphs.includes(FIGURE_STATES[state]), `${marker.dataset.id} shows its ${state} mark`);
        }
        for (const label of all(svg, n => cls(n, 'fig-label')).flatMap(n => all(n, t => t.tagName.toLowerCase() === 'tspan').map(t => t.textContent))) {
            assert(text.includes(label.split(' ')[0]), `${label} is in the text form`);
        }
    }
});

test('ritual circle: rings, slots by state, chant progress and the risk line in words', () => {
    const {svg, text} = draw(RITUAL_FIXTURE);
    assert.equal(all(svg, n => cls(n, 'fig-segment')).length, 6 + 4);
    const slots = all(svg, n => cls(n, 'fig-marker--slot'));
    assert.deepEqual(slots.map(s => ['filled', 'broken', 'empty'].find(state => cls(s, `fig-state--${state}`))), ['filled', 'broken', 'filled', 'empty']);
    assert.equal(all(svg, n => cls(n, 'fig-step')).length, 5);
    assert.match(text, /Track Chant, 2 of 5 done/);
    assert.match(text, /Risk is high/);
    assert(all(svg, n => cls(n, 'fig-note-text')).length >= 1);
    assert.match(text, /2\. Grey salt \(broken\)/);
});

test('relationship web: you at the centre, one line pattern per edge kind, unknown lines marked', () => {
    const {svg, text} = draw(WEB_FIXTURE);
    const you = all(svg, n => n.dataset?.id === 'you')[0], body = all(you, n => cls(n, 'fig-body'))[0];
    assert.equal(body.getAttribute('cx'), String(WEB_FIXTURE.size / 2));
    const edges = all(svg, n => cls(n, 'fig-edge') && n.getAttribute('data-kind'));
    assert.equal(edges.length, WEB_FIXTURE.edges.length);
    const patterns = new Map(edges.map(e => [e.getAttribute('data-kind'), (e.getAttribute('class').match(/fig-edge--k\d/) || [])[0]]));
    assert.equal(new Set(patterns.values()).size, 3);
    assert(edges.some(e => cls(e, 'fig-state--unknown')));
    assert.match(text, /You to Corin Dray: knows, unconfirmed \(unknown\)/);
    assert.equal(all(svg, n => cls(n, 'fig-legend-swatch')).length, 0, 'the legend is drawn beside the svg, not inside it');
});

test('no kind-specific drawing code and a plain-words text form that survives effects off', () => {
    const source = readFileSync(new URL('../src/ui/figure.js', import.meta.url), 'utf8').split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
    for (const word of ['ritual', 'relationship', 'trust', 'debt', 'moon', 'chant', 'meridian']) assert.doesNotMatch(source, new RegExp(word, 'i'), `figure.js does not branch on ${word}`);
    const css = readFileSync(new URL('../styles/figure.css', import.meta.url), 'utf8');
    assert.match(css, /data-effects="off"\][^{]*\{|data-effects="off"\]/);
    assert.match(css, /data-effects="reduced"/);
    // The same invented-kind spec draws without changes to the primitive.
    const meridian = {id: 'm', title: 'Channel', size: 400, nodes: [{id: 'a', label: 'Gate', at: [0, -.5], state: 'broken'}, {id: 'b', label: 'Pool', at: [0, .5], state: 'filled', effect: 'glow'}], edges: [{from: 'a', to: 'b', kind: 'flow', label: 'blocked', state: 'broken'}]};
    const {svg, text} = draw(meridian);
    assert.equal(all(svg, n => cls(n, 'fig-marker')).length, 2);
    assert.match(text, /Gate to Pool: flow, blocked \(broken\)/);
});
