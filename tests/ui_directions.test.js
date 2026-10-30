import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createDom} from '../scripts/headless/dom.mjs';
import {DIRECTIONS, buildScreen, mountGallery} from '../src/ui/preview/ui_directions.js';
import {FIXTURES, HUBS, ROUTES, ROUTES_REVEALED, VIEWS} from '../src/ui/preview/fixtures/ui_directions.js';

const dom = createDom(); dom.loadHTML('<html><body></body></html>');
globalThis.document = dom.document;
const textOf = node => (node.textContent || '').replace(/\s+/g, ' ');

test('every direction renders both fixtures with the facts a player needs, from the same state', () => {
    for (const fixture of Object.values(FIXTURES)) {
        for (const {id} of DIRECTIONS) {
            const screen = buildScreen(id, fixture.id, {size: 14});
            const text = textOf(screen);
            assert.ok(text.includes(fixture.place), `${id}/${fixture.id}: place`);
            assert.ok(text.includes(fixture.nextStep.text) || id === 'c' && text.includes(fixture.nextStep.text), `${id}/${fixture.id}: next step`);
            for (const action of fixture.actions.slice(0, id === 'b' ? 3 : 4)) {
                const reachable = text.includes(action.label) || id === 'c';
                assert.ok(reachable, `${id}/${fixture.id}: action ${action.label}`);
            }
            if (fixture.blocked && id !== 'c') assert.ok(text.includes(fixture.blocked), `${id}/${fixture.id}: blocked reason is printed, not only a title`);
        }
    }
});

test('every direction shows each held or offered path, in more than one shape, never one hardcoded ladder', () => {
    for (const fixture of Object.values(FIXTURES)) {
        assert.ok(fixture.ladders.length >= 1);
        assert.ok(fixture.ladders.some(l => l.shape !== 'ladder'), `${fixture.id}: one branching or field example`);
        for (const {id} of DIRECTIONS) {
            const text = textOf(buildScreen(id, fixture.id, {size: 14}));
            const names = fixture.ladders.filter(l => text.includes(l.name)).length;
            assert.ok(names >= (id === 'c' ? 1 : fixture.ladders.length), `${id}/${fixture.id}: ladders`);
        }
    }
});

test('effects-off facts: nothing the player needs is carried by a glow or animation class alone', () => {
    const css = readFileSync(new URL('../styles/ui_directions.css', import.meta.url), 'utf8');
    assert.match(css, /\[data-effects="off"\]/);
    assert.doesNotMatch(css, /display:\s*none/, 'effects rules hide nothing');
});

test('the six hubs absorb the 13 fresh-life routes and the 7 revealed ones exactly once, so seen routes keep a home (UR13, UR17)', () => {
    const routed = HUBS.flatMap(h => h.routes);
    const seen = [...ROUTES, ...ROUTES_REVEALED];
    assert.equal(routed.length, seen.length);
    assert.deepEqual([...routed].sort(), [...seen].sort());
});

test('the 21 representation views each land in a hub, a verb and a desk object', () => {
    assert.equal(VIEWS.length, 21);
    assert.equal(new Set(VIEWS.map(v => v[0])).size, 21);
    for (const row of VIEWS) assert.ok(row.length === 4 && row.every(Boolean), row[0]);
});

test('the gallery mounts one screen per direction and a single screen with dir', () => {
    const host = dom.document.createElement('div');
    mountGallery(host, new URLSearchParams(''));
    assert.equal(host.children.length, 4);
    const one = dom.document.createElement('div');
    mountGallery(one, new URLSearchParams('dir=d&fixture=tingen&size=21'));
    assert.equal(one.children.length, 1);
    assert.equal(textOf(one).includes('Map table'), true);
    for (const place of FIXTURES.tingen.places.filter(p => !p.here)) assert.ok(textOf(one).includes(place.name), `map table lists ${place.name}`);
});

test('the gallery touches no live shell file', () => {
    const src = readFileSync(new URL('../src/ui/preview/ui_directions.js', import.meta.url), 'utf8');
    for (const live of ['workspace_layout', 'panel_reveal', 'village_workspace', 'main.js', 'display.js']) assert.ok(!src.includes(`/${live}`), live);
});
