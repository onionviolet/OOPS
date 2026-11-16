// PS250/PS251: the Rune bench in the shared bench form: five parts, untried pairings never show their effect.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {runeBenchForm} from '../src/rune_bench_form.js';
import {renderBenchForm} from '../src/ui/bench_form.js';
import {EFFECT_TEXT} from '../src/pledges_content.js';

const known = new Set(['ember>gale', 'root>ember']);
const view = (extra = {}) => ({runes: ['ember', 'gale', 'root', 'tide'], maxLength: 4, perRune: 1, release: {talisman: 0, charged: 0}, talisman: null, minutesLeft: 0,
    effectText: EFFECT_TEXT, knownPair: (a, b) => known.has(`${a}>${b}`) ? {'ember>gale': 'kindle', 'root>ember': 'fizzle'}[`${a}>${b}`] : null, ...extra});

test('a strip reads as goes in, room, clashes, how sure and after; an untried pairing stays "?"', () => {
    const f = runeBenchForm(view(), ['root', 'ember', 'gale', 'tide'], 2);
    assert.deepEqual(f.capacity, {used: 4, max: 4, unit: 'runes', reason: 'a wood tablet takes 4 runes in a row'});
    assert.match(f.inputs.at(-1).fact, /4 wood needed/); assert.equal(f.inputs.at(-1).state, 'blocked', 'two wood cannot pay for four');
    assert.deepEqual(f.clashes.map(c => c.label), ['Root → Ember'], 'a known fizzle is a clash');
    assert.equal(f.chance[0].label, '2 of 3 pairings known');
    assert.equal(f.chance.find(c => c.data?.benchPair === 'gale>tide').fact, 'untried');
    assert.deepEqual(f.after.map(a => a.label), ['clumsy feet', 'more stamina', '?']);
    assert.ok(!JSON.stringify(f).includes('swift'), 'the untried gale>tide effect is not leaked');
    assert.equal(f.cost, 'Spend 4 wood');
});

test('recarving names the worn tablet it replaces and the wood it returns', () => {
    const f = runeBenchForm(view({talisman: {runes: ['ember', 'gale']}, minutesLeft: 40, release: {talisman: 2, charged: 0}}), ['gale', 'tide'], 3);
    assert.match(f.clashes.at(-1).fact, /comes off with 40 min left/); assert.equal(f.cost, 'Replacing the worn tablet covers 2; spend 0 wood');
});

test('the form draws every part in order, with a capacity bar, and says so when a part is empty', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const host = dom.document.getElementById('h');
    host.append(renderBenchForm(dom.document, runeBenchForm(view(), [], 6)));
    assert.deepEqual([...host.querySelectorAll('[data-bench-part]')].map(n => n.dataset.benchPart), ['inputs', 'capacity', 'clashes', 'chance', 'after']);
    assert.equal(host.querySelector('meter').getAttribute('aria-label'), '0 of 4 runes used');
    assert.match(host.textContent, /Nothing chosen yet/);
});
