import test from 'node:test';
import assert from 'node:assert/strict';
import {createMixtureState, resolveMixture, validateMixtureState} from '../src/mixture_state.js';
import {projectMixtureDiscovery, describeVial, observedVials, MIXTURE_EFFECTS} from '../src/mixture_discovery.js';

const BELL = 'River bellleaf', EMBER = 'Emberseed', WATER = 'Spring water', SALT = 'Mellow salt';
function drink(state, inputs, process) {
    const product = resolveMixture(state, inputs, process);
    state.products[product.id] = product;
    state.knowledge[product.id] = {observed: true, at: Object.keys(state.knowledge).length};
    state.lastObservation = product.id;
    return product;
}
const cell = (d, ingredient, effect) => d.rows.find(r => r.id === ingredient).cells.find(c => c.effect === effect);

test('a fresh life shows every ingredient unknown and suggests isolating the first plant', () => {
    const d = projectMixtureDiscovery(createMixtureState(7));
    assert.ok(d.rows.every(r => r.state === 'unknown' && r.cells.every(c => c.state === 'unknown')));
    assert.equal(d.suggestion.kind, 'first');
    assert.deepEqual(d.suggestion.prefill.inputs, {[BELL]: 1, [WATER]: 1});
    assert.match(d.text, /Next try: Mix River bellleaf/);
});

test('a single-plant vial makes that plant known; the other plant stays unknown and is suggested next', () => {
    const s = createMixtureState(7);
    drink(s, {[BELL]: 1, [WATER]: 1}, 'steep');
    const d = projectMixtureDiscovery(s);
    assert.equal(d.rows.find(r => r.id === BELL).state, 'known');
    assert.equal(d.rows.find(r => r.id === EMBER).state, 'unknown');
    assert.equal(d.suggestion.kind, 'isolate');
    assert.ok(d.suggestion.prefill.inputs[EMBER]);
    assert.equal(cell(d, BELL, 'health').state, 'known');
    assert.match(cell(d, BELL, 'health').text, /steeped/);
});

test('a plant seen only beside another plant is guessed, then worked out once the other is known', () => {
    const s = createMixtureState(7);
    drink(s, {[BELL]: 1, [EMBER]: 1, [WATER]: 1}, 'boil');
    let d = projectMixtureDiscovery(s);
    assert.equal(d.rows.find(r => r.id === BELL).state, 'guessed');
    assert.equal(d.rows.find(r => r.id === EMBER).state, 'guessed');
    assert.equal(d.suggestion.kind, 'separate');
    drink(s, {[BELL]: 1, [WATER]: 1}, 'boil');
    d = projectMixtureDiscovery(s);
    assert.equal(d.rows.find(r => r.id === EMBER).state, 'known');
    assert.match(cell(d, EMBER, 'stamina').text, /worked out from two vials/);
    // The worked-out strength equals the strength a direct single-plant vial would show.
    const direct = projectMixtureDiscovery((() => { const t = createMixtureState(7); drink(t, {[EMBER]: 1, [WATER]: 1}, 'boil'); return t; })());
    assert.equal(cell(d, EMBER, 'stamina').readings[0].word, cell(direct, EMBER, 'stamina').readings[0].word);
    assert.ok(Math.abs(cell(d, EMBER, 'stamina').readings[0].value - cell(direct, EMBER, 'stamina').readings[0].value) < 1e-9);
});

test('process comparison is suggested, then recorded when both processes are read; the carrier is proven inert by a separate vial', () => {
    const s = createMixtureState(7);
    drink(s, {[BELL]: 1, [WATER]: 1}, 'steep');
    drink(s, {[EMBER]: 1, [WATER]: 1}, 'steep');
    let d = projectMixtureDiscovery(s);
    assert.equal(d.suggestion.kind, 'process');
    assert.equal(d.suggestion.prefill.process, 'boil');
    drink(s, {[BELL]: 1, [WATER]: 1}, 'boil');
    drink(s, {[EMBER]: 1, [WATER]: 1}, 'boil');
    d = projectMixtureDiscovery(s);
    assert.equal(cell(d, BELL, 'health').readings.length, 2);
    assert.equal(d.rows.find(r => r.id === SALT).state, 'unknown');
    assert.equal(d.suggestion.kind, 'carrier');
    drink(s, {[BELL]: 1, [WATER]: 1, [SALT]: 1}, 'boil');
    d = projectMixtureDiscovery(s);
    assert.equal(d.rows.find(r => r.id === SALT).state, 'known');
    assert.equal(d.suggestion.kind, 'blend');
});

test('the projection reads only observed vials: differing hidden truth with identical observations gives identical output', () => {
    const a = createMixtureState(7), b = createMixtureState(7);
    drink(a, {[BELL]: 1, [WATER]: 1}, 'boil');
    drink(b, {[BELL]: 1, [WATER]: 1}, 'boil');
    b.profiles = null; b.hiddenMethod = null;
    assert.equal(JSON.stringify(projectMixtureDiscovery(a)), JSON.stringify(projectMixtureDiscovery(b)));
    // Unobserved (unknown) products leak nothing either.
    const c = createMixtureState(7);
    const product = resolveMixture(c, {[BELL]: 1, [EMBER]: 1, [WATER]: 1}, 'steep');
    c.products[product.id] = product;
    assert.equal(JSON.stringify(projectMixtureDiscovery(c)), JSON.stringify(projectMixtureDiscovery(createMixtureState(7))));
    assert.equal(observedVials(c).length, 0);
});

test('the discovery view adds nothing to the saved owner', () => {
    const s = createMixtureState(7);
    drink(s, {[BELL]: 1, [WATER]: 1}, 'boil');
    const before = JSON.stringify(s);
    projectMixtureDiscovery(s);
    assert.equal(JSON.stringify(s), before);
    validateMixtureState(s);
});

test('a vial card states potency, side effects and duration in words, and the effect list is data', () => {
    const s = createMixtureState(7);
    const v = describeVial(drink(s, {[BELL]: 1, [WATER]: 1}, 'boil'));
    assert.match(v.potency, /health regeneration/);
    assert.equal(v.minutes, 40);
    assert.ok(MIXTURE_EFFECTS.every(e => e.id && e.label && e.dose && e.tiers.length));
});

test('the Village counter shows the learned table and the next try, and "Set up this try" fills the inputs', async () => {
    const {createMixturePanel} = await import('../src/mixture_ui.js');
    const {setMixtureOwner} = await import('../src/mixture_state.js');
    const previous = {document: globalThis.document, setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval};
    class Element {
        constructor() { this.children = []; this.style = {}; this.dataset = {}; this.textContent = ''; this.isConnected = true; }
        append(...nodes) { this.children.push(...nodes); for (const n of nodes) n.parentElement = this; }
        prepend(n) { this.children.unshift(n); }
        insertBefore(n) { this.children.push(n); n.parentElement = this; }
        replaceChildren() { this.children = []; }
        setAttribute() {} querySelector() { return null; } querySelectorAll() { return []; } addEventListener() {} closest() { return null; }
        classList = {toggle() {}};
    }
    const nodes = {};
    globalThis.document = {createElement: () => new Element(), getElementById: id => nodes[id], addEventListener() {}, querySelector() { return null; }};
    globalThis.setInterval = () => 1; globalThis.clearInterval = () => {};
    try {
        const state = createMixtureState(7);
        drink(state, {[BELL]: 1, [WATER]: 1}, 'steep');
        setMixtureOwner(state);
        const crafting = new Element(), actions = new Element();
        nodes.location_actions_div = actions; nodes.crafting_window = crafting;
        let panel;
        crafting.before = n => { panel = n; };
        const handle = createMixturePanel({craftingContainer: crafting, actionContainer: actions, read: () => ({visible: true, ready: true, seed: 7, clock: 0, inventory: {}}), act: () => ({})});
        handle.render();
        const find = (n, test) => test(n) ? n : n.children.map(c => find(c, test)).find(Boolean);
        const learned = find(panel, n => n.id === 'mixture_discovery');
        assert.ok(learned, 'discovery section exists');
        assert.match(learned.dataset.text, /River bellleaf \(known\)/);
        assert.match(find(learned, n => n.id === 'mixture_next_try').textContent, /Emberseed/);
        assert.match(find(learned, n => n.id === 'mixture_last_vial').textContent, /Last vial you drank/);
        find(learned, n => n.id === 'mixture_next_set').onclick();
        const amount = id => find(panel, n => n.id === 'mixture_amount_' + id.replaceAll(' ', '_')).value;
        assert.equal(amount(EMBER), 1);
        assert.equal(amount(BELL), 0);
    } finally { setMixtureOwner(null); Object.assign(globalThis, previous); }
});

test('one vial gets one tier word in the table and on the vial card', () => {
    const s = createMixtureState(7);
    for (const process of ['steep', 'boil']) for (const plant of [BELL, EMBER]) {
        const product = drink(createMixtureState(7), {[plant]: 1, [WATER]: 1}, process);
        const solo = createMixtureState(7); drink(solo, {[plant]: 1, [WATER]: 1}, process);
        const d = projectMixtureDiscovery(solo), card = describeVial(product);
        const main = MIXTURE_EFFECTS.filter(e => !e.side).map(e => ({e, v: product.dose[e.dose]})).sort((a, b) => b.v - a.v)[0];
        const word = cell(d, plant, main.e.id).readings[0].word;
        assert.equal(card.potency, `${word} ${main.e.label.toLowerCase()}`, `${plant} ${process}`);
    }
    void s;
});

test('steep and boil readings show the ratio, so the suggested comparison teaches something visible', () => {
    const s = createMixtureState(7);
    drink(s, {[BELL]: 1, [WATER]: 1}, 'steep');
    drink(s, {[BELL]: 1, [WATER]: 1}, 'boil');
    const health = cell(projectMixtureDiscovery(s), BELL, 'health');
    assert.ok(health.ratio > 1.1);
    assert.match(health.word, /boiling ≈\d\.\d× steeping/);
});

test('responsive-law vials (revision 2) are read separately and never mixed into ordinary readings', () => {
    const s = createMixtureState(7);
    const ordinary = drink(s, {[BELL]: 1, [WATER]: 1}, 'boil');
    const responsive = {...structuredClone(ordinary), revision: 2, id: 'm2:fake', dose: {...ordinary.dose, health: ordinary.dose.health * 1.2}};
    s.products[responsive.id] = responsive; s.knowledge[responsive.id] = {observed: true, at: 9};
    const d = projectMixtureDiscovery(s), health = cell(d, BELL, 'health');
    assert.equal(health.readings.length, 2);
    assert.ok(health.readings.some(r => r.revision === 2));
    assert.ok(Math.abs(health.readings.find(r => r.revision === 1).value - ordinary.dose.health) < 1e-9);
    assert.match(health.text, /responsive/);
});
