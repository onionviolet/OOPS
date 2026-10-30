import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {relationshipWebSpec, WEB_LIMITS} from '../src/ui/relationship_web.js';
import {relationshipWebPeople, relationshipWebForState} from '../src/relationship_web_view.js';
import {figureText, renderFigure, validateFigureSpec} from '../src/ui/figure.js';
import {RELATIONSHIP_WEB_FIXTURES, RELATIONSHIP_WEB_PEOPLE} from '../src/ui/preview/fixtures/relationship_web.js';
import {initializeExpedition, expeditionRegistry} from '../src/expedition_content.js';
import {createExpansionState} from '../src/expansion_engine.js';
import {enrollSimulation} from '../src/simulation.js';
import {freshMemory} from '../src/person_memory.js';
import {rememberEffect} from '../src/person_memory_effects.js';

const fresh = () => initializeExpedition(createExpansionState(23));
const enrolled = () => enrollSimulation(fresh(), expeditionRegistry, {actorId: 'player', worldId: 'base.frontier', facts: {location: 'Village'}, external: {money: 30}}).state;
const met = {'village.craftsmanMet': true, location: 'Village', calendarMinute: 1440 * 3};

test('fixtures validate and keep each edge kind on its own line pattern', () => {
    for (const spec of RELATIONSHIP_WEB_FIXTURES) validateFigureSpec(spec);
    const kinds = new Set(RELATIONSHIP_WEB_FIXTURES[0].edges.map(e => e.kind));
    assert.ok(kinds.size <= 4, 'figure.js has four line patterns');
    const text = figureText(RELATIONSHIP_WEB_FIXTURES[0]);
    assert.match(text, /Osric the tallyman: owes, you owe: return 2 × Lantern oil \(pending\)/);
    assert.match(text, /Wren, dock runner to You: manner, heard of you \(unknown\)\. .*Who told them is not known to you\./);
    assert.match(text, /Brenna Hale, ferrier to You: saw, saw 2 deeds\. Saw: You paid the agreed coin; and You carried her anvil block\./);
});

test('closeness rings come from known signals; the inner ring sits between outer spokes', () => {
    const spec = relationshipWebSpec(RELATIONSHIP_WEB_PEOPLE);
    const ring = id => spec.nodes.filter(n => n.ring === id).map(n => n.id);
    assert.deepEqual(ring('close').sort(), ['brenna', 'matthis']);
    const close = spec.rings.find(r => r.id === 'close'), known = spec.rings.find(r => r.id === 'known');
    assert.equal(close.rotate, (known.rotate || 0) + 180 / known.count);
    const single = relationshipWebSpec([{id: 'a', name: 'Ann', here: false, owes: [], saw: []}]);
    assert.equal(single.rings.length, 1); assert.equal(single.size, 560);
    assert.match(figureText(single), /No agreement or shared event yet with Ann\./);
    assert.doesNotMatch(figureText(single), /not here/, 'the web never claims where someone is');
});

test('a crowded life keeps the most connected people and points to the cards for the rest', () => {
    const many = Array.from({length: WEB_LIMITS.people + 3}, (_, i) => ({id: `p${i}`, name: `Person ${i}`, here: false, owes: i === 18 ? [{by: 'you', label: 'a debt'}] : [], saw: []}));
    const spec = relationshipWebSpec(many);
    assert.equal(spec.nodes.length, WEB_LIMITS.people + 1);
    assert.ok(spec.nodes.some(n => n.id === 'p18'), 'the person you owe stays on the web');
    assert.match(figureText(spec), /3 more people are in the cards below\./);
});

test('live projection: commission debt and shared history appear; the hidden axis and absent manner do not', () => {
    const state = enrolled();
    state.actors.player.facts['sim.commissioned'] = true;
    state.simulation.relationships.oldCraftsman = {player: {axes: {trust: 99, fear: 8}, memories: [{cause: 'private:1', at: 0, text: 'Secret distrust.'}]}};
    state.simulation.people.oldCraftsman.location = 'Forest road';
    const memory = rememberEffect(freshMemory(), {holder: 'oldCraftsman', subject: 'player', cause: 'c1', axis: 'trust', amount: 5, text: 'Supplied the agreed materials.'}, 2);
    const [craftsman] = relationshipWebPeople(state, met, {memory});
    assert.equal(craftsman.id, 'oldCraftsman');
    assert.deepEqual(craftsman.owes, [{by: 'them', label: 'a commissioned kit', settled: false, strained: false}]);
    assert.equal(craftsman.here, false); assert.equal(craftsman.manner, undefined, 'no manner read while absent (PIR3)');
    const text = figureText(relationshipWebForState(state, met, {memory}));
    assert.match(text, /Old craftsman to You: owes, owes you: a commissioned kit \(pending\)/);
    assert.doesNotMatch(text, /99|fear|Secret|distrust/);
    // Face to face the observed manner appears, through the same gate as the workshop.
    state.simulation.people.oldCraftsman.location = 'Village';
    const here = relationshipWebPeople(state, met, {memory})[0];
    assert.equal(here.here, true); assert.equal(here.manner?.warm, true);
    assert.match(figureText(relationshipWebForState(state, met, {memory})), /Seen here now: (Warmer toward you|More at ease with you) since you supplied the agreed materials/);
    state.actors.player.completed['village.collect'] = 1;
    assert.equal(relationshipWebPeople(state, met, {memory})[0].owes[0].settled, true);
});

test('loans the observer is party to become debts both ways; unrelated loans stay out', () => {
    const state = enrolled();
    state.simulation.custody = {
        lent: {owner: 'player', holder: 'oldCraftsman', key: JSON.stringify({id: 'Hand saw'}), count: 1, at: 0, cause: 'x'},
        borrowed: {owner: 'oldCraftsman', holder: 'player', key: JSON.stringify({id: 'Rope'}), count: 2, at: 0, cause: 'y'},
        others: {owner: 'oldCraftsman', holder: 'someoneElse', key: JSON.stringify({id: 'Gold'}), count: 9, at: 0, cause: 'z'},
    };
    const owes = relationshipWebPeople(state, met)[0].owes.map(o => `${o.by}:${o.label}`).sort();
    assert.deepEqual(owes, ['them:return Hand saw', 'you:return 2 × Rope']);
});

test('the web renders as a sibling of the cards in the People panel with a text form', async () => {
    const dom = createDom(); dom.loadHTML('<html><body></body></html>');
    globalThis.document = dom.document;
    try {
        const {createPeopleOverview} = await import('../src/people_ui.js');
        const people = createPeopleOverview(); dom.document.body.append(people.panel);
        const state = enrolled(); state.actors.player.facts['sim.commissioned'] = true;
        assert.equal(people.render(state, met), 1, 'render still returns the row count');
        const web = people.panel.querySelector('#relationship_web');
        assert.ok(web); assert.equal(web.parentElement, people.panel);
        assert.equal(web.closest('[data-known-person]'), null);
        assert.equal(web.querySelector('[data-known-person]'), null);
        assert.match(web.querySelector('pre.fig-text').textContent, /owes you: a commissioned kit/);
        const card = people.panel.querySelector('[data-known-person="oldCraftsman"]');
        assert.doesNotMatch(card.textContent, /owes|Who knows what/);
        const svg = web.querySelector('svg'); people.render(state, met);
        assert.equal(web.querySelector('svg'), svg, 'an unchanged spec is not redrawn');
    } finally { delete globalThis.document; }
});

test('edge labels: no two placed label boxes overlap in the populated fixture', () => {
    const dom = createDom(); dom.loadHTML('<html><body><div id="h"></div></body></html>');
    const {svg} = renderFigure(dom.document.getElementById('h'), RELATIONSHIP_WEB_FIXTURES[0]);
    const all = (n, f) => [n, ...[...n.children].flatMap(c => all(c, f))].filter(f);
    const boxes = all(svg, n => (n.getAttribute('class') || '') === 'fig-edge-label').map(t => {
        const x = Number(t.getAttribute('x')), y = Number(t.getAttribute('y')) - 4, w = t.textContent.length * 8.5 + 6;
        return {x0: x - w / 2, x1: x + w / 2, y0: y - 8, y1: y + 8};
    });
    assert.equal(boxes.length, RELATIONSHIP_WEB_FIXTURES[0].edges.length);
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        assert.ok(!(a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0), `labels ${i} and ${j} overlap`);
    }
});
