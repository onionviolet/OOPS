import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {renderFigure} from '../src/ui/figure.js';
import {figureGraph, neighbourhood, focusSet, filterIds, compareNodes, cardModel, moveFocus, changedIds, attachFigureInteract} from '../src/ui/figure_interact.js';
import {tableModel, sortRows, matrixModel, sentenceModel, mountFormSwitch, FIGURE_FORMS} from '../src/ui/figure_forms.js';
import {RELATIONSHIP_WEB_FIXTURE, RUMOUR_RIPPLE_FIXTURE} from '../src/ui/preview/fixtures/relationship_web.js';

const chain = {id: 'c', title: 'Chain', nodes: [
    {id: 'a', label: 'Alder', at: [-.8, 0], state: 'done'}, {id: 'b', label: 'Birch', at: [-.2, 0], state: 'filled', why: 'Told by Alder'},
    {id: 'c', label: 'Cedar', at: [.4, 0], state: 'unknown'}, {id: 'd', label: 'Dogwood', at: [.4, .8], state: 'done'}],
    edges: [{from: 'a', to: 'b', kind: 'told'}, {from: 'b', to: 'c', kind: 'told', label: 'guessed', state: 'unknown'}, {from: 'a', to: 'd', kind: 'saw'}]};
const draw = spec => { const dom = createDom(); dom.loadHTML('<html><body><div id="host"></div></body></html>'); classes = dom.classes; const host = dom.document.getElementById('host'); renderFigure(host, spec); return {dom, host}; };
let classes;
const key = (host, id, k) => host.querySelector(`.fig-marker[data-id="${id}"]`).dispatchEvent(new classes.KeyboardEvent('keydown', {key: k, bubbles: true, cancelable: true}));

test('graph model: neighbours by hops, focus set, filter and compare', () => {
    const g = figureGraph(chain);
    assert.deepEqual([...neighbourhood(g, 'b')].sort(), ['a', 'b', 'c']);
    assert.deepEqual([...neighbourhood(g, 'c', 2)].sort(), ['a', 'b', 'c']);
    assert.equal(neighbourhood(g, 'nope').size, 0);
    assert.deepEqual([...focusSet(g, ['c', 'd'])].sort(), ['a', 'b', 'c', 'd']);
    assert.equal(filterIds(g, {}), null);
    assert.deepEqual([...filterIds(g, {text: 'bi'})], ['b']);
    assert.deepEqual([...filterIds(g, {states: ['done']})].sort(), ['a', 'd']);
    assert.deepEqual([...filterIds(g, {kinds: ['saw']})].sort(), ['a', 'd']);
    const c = compareNodes(g, 'b', 'd');
    assert.deepEqual(c.shared.map(s => s.id), ['a']);
    assert.deepEqual(c.onlyA.map(s => s.id), ['c']);
    assert.equal(compareNodes(g, 'a', 'b').direct.length, 1);
});

test('card model carries the node words, why, and links that can themselves open cards', () => {
    const g = figureGraph(chain), card = cardModel(g, 'b');
    assert.equal(card.why, 'Told by Alder');
    assert.equal(card.stateWords, '● Filled');
    assert.deepEqual(card.links.map(l => l.id).sort(), ['a', 'c']);
    assert.equal(card.links.find(l => l.id === 'c').edgeLabel, 'guessed');
    assert.equal(cardModel(g, 'zz'), null);
});

test('arrow moves pick the nearest point in the cone; change diff names only real changes', () => {
    const p = new Map([['a', {x: 0, y: 0}], ['b', {x: 50, y: 5}], ['c', {x: 200, y: 0}], ['d', {x: 10, y: 90}]]);
    assert.equal(moveFocus(p, 'a', 'right'), 'b');
    assert.equal(moveFocus(p, 'a', 'down'), 'd');
    assert.equal(moveFocus(p, 'a', 'left'), null);
    const next = {nodes: chain.nodes.map(n => n.id === 'c' ? {...n, state: 'done'} : n).concat([{id: 'e', label: 'Elm', at: 'center'}])};
    assert.deepEqual(changedIds(chain, next).sort(), ['c', 'e']);
    assert.deepEqual(changedIds(chain, chain), []);
});

test('attach: hover lights neighbours and fades the rest, native titles become aria labels and return on destroy', () => {
    const {host} = draw(chain), titlesBefore = host.querySelectorAll('.fig-marker > title').length;
    assert.equal(titlesBefore, 4);
    const api = attachFigureInteract(host, chain);
    assert.equal(host.querySelectorAll('.fig-marker > title').length, 0);
    assert.match(host.querySelector('.fig-marker[data-id="b"]').getAttribute('aria-label'), /Birch/);
    host.querySelector('.fig-marker[data-id="b"]').dispatchEvent(new classes.PointerEvent('pointerover', {bubbles: true}));
    const cls = id => host.querySelector(`.fig-marker[data-id="${id}"]`).getAttribute('class');
    assert.match(cls('a'), /fig-hl/); assert.match(cls('c'), /fig-hl/); assert.match(cls('d'), /fig-dim/);
    assert.ok(host.querySelector('.fig-card[data-id="b"]'), 'hover card shows');
    assert.match(host.querySelector('.fig-card').textContent, /Why: Told by Alder/);
    const hot = [...host.querySelectorAll('.fig-edge')].filter(e => /fig-hl/.test(e.getAttribute('class'))).map(e => `${e.dataset.from}${e.dataset.to}`);
    assert.deepEqual(hot.sort(), ['ab', 'bc']);
    api.destroy();
    assert.equal(host.querySelectorAll('.fig-marker > title').length, 4);
    assert.equal(host.querySelector('.fig-cards'), null);
});

test('attach: pin two to compare, filter dims non-matches, focus mode hides distant labels, Esc clears', () => {
    const {host} = draw(chain), api = attachFigureInteract(host, chain);
    api.pin('b'); api.pin('d');
    assert.deepEqual(api.pinned(), ['b', 'd']);
    assert.equal(host.querySelector('.fig-compare').hidden, false);
    assert.match(host.querySelector('.fig-compare').textContent, /Both connect to: Alder/);
    api.setFilter('ced');
    assert.match(host.querySelector('.fig-marker[data-id="a"]').getAttribute('class'), /fig-dim/);
    assert.match(host.querySelector('.fig-filter-count').textContent, /1 of 4 match/);
    api.setFilter(''); api.unpin(); api.pin('c'); api.setFocusMode(true);
    assert.match(host.querySelector('.fig-marker[data-id="d"]').getAttribute('class'), /fig-far/);
    assert.doesNotMatch(host.querySelector('.fig-marker[data-id="c"]').getAttribute('class'), /fig-far/);
    key(host, 'c', 'Escape');
    assert.deepEqual(api.pinned(), []);
});

test('attach: keyboard roving focus moves along the drawn layout and Enter pins', () => {
    const {host} = draw(chain); attachFigureInteract(host, chain);
    const tab = id => host.querySelector(`.fig-marker[data-id="${id}"]`).getAttribute('tabindex');
    assert.equal(tab('a'), '0'); assert.equal(tab('b'), '-1');
    host.querySelector('.fig-marker[data-id="a"]').focus();
    key(host, 'a', 'ArrowRight');
    assert.equal(tab('b'), '0'); assert.equal(tab('a'), '-1');
    key(host, 'b', 'Enter');
    assert.equal(host.querySelector('.fig-marker[data-id="b"]').getAttribute('aria-pressed'), 'true');
});

test('a spec with no markers attaches as a no-op', () => {
    const {host} = draw({id: 't', title: 'T', tracks: [{id: 'x', steps: [{label: 'one'}]}]});
    assert.doesNotThrow(() => attachFigureInteract(host, {id: 't', title: 'T', tracks: [{id: 'x', steps: [{label: 'one'}]}]}).destroy());
});

test('alternate forms hold the same facts: table, matrix and sentences read the one graph', () => {
    const t = tableModel(RELATIONSHIP_WEB_FIXTURE), g = figureGraph(RELATIONSHIP_WEB_FIXTURE);
    assert.equal(t.rows.length, g.nodes.size);
    assert.equal(t.rows.reduce((n, r) => n + r.degree, 0), g.edges.length * 2);
    assert.equal(sortRows(t.rows, 'degree')[0].degree, Math.max(...t.rows.map(r => r.degree)));
    assert.deepEqual(sortRows(t.rows, 'label').map(r => r.label), [...t.rows.map(r => r.label)].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1));
    const m = matrixModel(RUMOUR_RIPPLE_FIXTURE);
    assert.equal(m.cell('deed', 'osric').length, 1); assert.equal(m.cell('osric', 'deed').length, 1); assert.equal(m.cell('deed', 'boat').length, 0);
    assert.equal(sentenceModel(RUMOUR_RIPPLE_FIXTURE).length, 8);
});

test('form switch: figure stays one choice, others render, the choice is remembered, interaction detaches cleanly', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="root"></div></body></html>');
    const root = dom.document.getElementById('root'), memory = new Map();
    const sw = mountFormSwitch(root, RUMOUR_RIPPLE_FIXTURE, {memory});
    assert.equal(sw.form(), 'web'); assert.ok(root.querySelector('svg.fig-svg')); assert.ok(root.querySelector('.fig-interact-bar'));
    sw.show('table'); assert.ok(root.querySelector('table.fig-table')); assert.equal(root.querySelector('svg.fig-svg'), null);
    root.querySelector('tr[data-id="osric"]').click(); assert.match(root.querySelector('.fig-inspector').textContent, /Osric/);
    sw.show('matrix'); assert.ok(root.querySelector('table.fig-matrix'));
    assert.equal(memory.get('rumour-ripple-seal'), 'matrix');
    const again = mountFormSwitch(root, RUMOUR_RIPPLE_FIXTURE, {memory}); assert.equal(again.form(), 'matrix');
    again.show('web'); assert.ok(root.querySelector('svg.fig-svg'));
    assert.deepEqual(Object.keys(FIGURE_FORMS), ['web', 'table', 'matrix', 'sentences']);
});
