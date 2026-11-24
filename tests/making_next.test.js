// MKC5/MKC33: a bench's Next part says where a made thing goes now, derived from the current state; a route the life has
// not found reads "Not yet" with its reason and opens nothing.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {nextRow} from '../src/making_next.js';
import {runeBenchForm, runeBenchNext} from '../src/rune_bench_form.js';
import {gearNextRoutes} from '../src/gear_workshop_panel.js';
import {renderBenchForm, renderBenchNext} from '../src/ui/bench_form.js';
import {EFFECT_TEXT} from '../src/pledges_content.js';

const routes = (found = []) => { const opened = []; return {opened, found: id => id === 'local-actions' || found.includes(id), open: id => opened.push(id)}; };
const view = (extra = {}) => ({runes: ['ember', 'gale'], maxLength: 4, perRune: 1, release: {talisman: 0, charged: 0}, talisman: null, minutesLeft: 0,
    effectText: EFFECT_TEXT, knownPair: () => null, ...extra});

test('a found route opens its panel; an unfound one is "Not yet" with the reason beside it', () => {
    const r = routes(['gear-workshop']);
    const open = nextRow({label: 'Work the blade', panel: 'gear-workshop', reason: 'Visit a forge.'}, r);
    open.run(); assert.deepEqual(r.opened, ['gear-workshop']); assert.ok(!open.disabled);
    const shut = nextRow({label: 'Wear it', panel: 'belongings', reason: 'Open Inventory first.'}, routes());
    assert.equal(shut.label, 'Not yet: wear it'); assert.equal(shut.from, 'Open Inventory first.'); assert.equal(shut.state, 'blocked'); assert.ok(shut.disabled);
});

test('the rune bench offers Next only for what it has made, and names the forge as not yet until it is found', () => {
    assert.deepEqual(runeBenchNext(view(), null, routes()), [], 'nothing carved, nothing to take onward');
    const worn = runeBenchNext(view({talisman: {runes: ['ember', 'gale']}, minutesLeft: 30}), {charges: 2, maxCharges: 3}, routes());
    assert.deepEqual(worn.map(n => n.label), ['Fight while the tablet is worn', 'Fight with the charged strip', 'Not yet: work the blade you fight with']);
    assert.equal(worn[0].fact, '30 min left'); assert.equal(worn[1].fact, '2 of 3 charges');
    assert.equal(worn[2].from, 'Visit a forge to work on gear.');
    const spent = runeBenchNext(view(), {charges: 0, maxCharges: 3}, routes(['gear-workshop']));
    assert.deepEqual(spent.map(n => n.label), ['Work the blade you fight with'], 'a spent strip is not offered for a fight');
});

test('the form draws Next as a sixth part only when the bench passes routes', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div><div id="g"></div></body></html>');
    const h = dom.document.getElementById('h');
    h.append(renderBenchForm(dom.document, runeBenchForm(view({talisman: {runes: ['ember', 'gale']}, minutesLeft: 5}), [], 0, {routes: routes()})));
    assert.deepEqual([...h.querySelectorAll('[data-bench-part]')].map(n => n.dataset.benchPart), ['inputs', 'capacity', 'clashes', 'chance', 'after', 'next']);
    const blocked = h.querySelector('[data-bench-next="gear-workshop"] button');
    assert.ok(blocked.disabled); assert.equal(blocked.title, 'Visit a forge to work on gear.');
    assert.ok(!('next' in runeBenchForm(view(), [], 0)), 'no routes, five parts');
    const g = dom.document.getElementById('g');
    g.append(renderBenchNext(dom.document, [], 'Choose a carried item.'));
    assert.match(g.textContent, /Choose a carried item/);
});

test('a worked piece can be worn, carved for, or sold', () => {
    assert.deepEqual(gearNextRoutes(null), []);
    assert.deepEqual(gearNextRoutes({name: 'Iron sword'}).map(r => r.panel), ['belongings', 'rune-bench', 'local-actions']);
});
