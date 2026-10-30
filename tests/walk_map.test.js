import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {figureText, validateFigureSpec} from '../src/ui/figure.js';
import {walkMapSpec, walkMapBlock, routeStripSpec} from '../src/ui/walk_map.js';
import {WALK_MAP_VIEW, MAP_FIXTURES} from '../src/ui/preview/fixtures/maps.js';

test('walk map quotes minutes from where you stand and marks you', () => {
    const {spec, controls} = walkMapSpec(WALK_MAP_VIEW), text = figureText(spec);
    assert.match(text, /^Walks from Lamplighters' hall/);
    assert.match(text, /Lamplighters' hall \(current\)/);
    for (const [place, minutes] of [['Rented attic', 2], ['Saltgate wharf', 20], ['Old college', 35]]) assert.match(text, new RegExp(`to ${place}: walk, ${minutes} min`));
    // Rings step outward by minutes; a blocked walk is marked and its reason is in words.
    const radii = spec.rings.map(ring => ring.radius);
    assert.deepEqual(radii, [...radii].sort((a, b) => a - b));
    assert.match(text, /Old college: walk, 35 min \(strained\)/);
    assert.match(text, /Some walks are blocked now: The college gate shuts at dusk\./);
    // Every drawn place with a walk maps to that walk command (the real verb, SUI14).
    assert.deepEqual(Object.values(controls).sort(), ['walk_attic', 'walk_college', 'walk_glass', 'walk_wharf']);
});

test('only what the seat knows is drawn', () => {
    const text = figureText(walkMapSpec(WALK_MAP_VIEW).spec);
    assert.match(text, /Mott the tally clerk to Saltgate wharf: usually here, mornings/);
    assert.match(text, /Widow Pell to Lamplighters' hall: usually here, evenings/);
    // A person whose usual place the seat does not know never reaches the figure.
    assert.doesNotMatch(text, /stranger|Hidden cellar/);
    assert.match(text, /Off this map: Your cousin lives in another city\./);
});

test('a lone place and an empty view still draw', () => {
    const lone = figureText(walkMapSpec({places: [{place: 'Roadside inn', here: true, minutes: 0}]}).spec);
    assert.match(lone, /You know no other places yet/);
    assert.doesNotThrow(() => validateFigureSpec(walkMapSpec({}).spec));
    for (const spec of MAP_FIXTURES) assert.doesNotThrow(() => validateFigureSpec(spec));
    assert.match(figureText(routeStripSpec({from: 'A', to: 'B', minutes: 5, passed: [{label: 'C', at: 'gate', seen: false}]})), /someone · gate \(unknown\)/);
});

test('the panel block shows the figure, its text form, and a place click picks that walk', () => {
    const dom = createDom(); dom.loadHTML('<html><body></body></html>');
    const previous = globalThis.document; globalThis.document = dom.document;
    try {
        const picked = [];
        const box = walkMapBlock(WALK_MAP_VIEW, {onPick: id => picked.push(id)});
        assert.equal(box.querySelector('summary').textContent, 'Walking map · minutes from here');
        assert.match(box.querySelector('pre.fig-text').textContent, /walk, 20 min/);
        const marker = [...box.querySelectorAll('.fig-marker')].find(node => node.getAttribute('data-id') === 'place-2');
        box.querySelector('.fig').dispatchEvent(new dom.classes.Event('click', {bubbles: true}));
        marker.querySelector('circle').dispatchEvent(new dom.classes.Event('click', {bubbles: true}));
        assert.deepEqual(picked, ['walk_wharf']);
    } finally { globalThis.document = previous; }
});
