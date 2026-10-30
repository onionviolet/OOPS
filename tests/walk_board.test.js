import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {walkBoard} from '../src/ui/walk_board.js';
import {WALK_MAP_VIEW} from '../src/ui/preview/fixtures/maps.js';

function withBoard(view, options, fn) {
    const dom = createDom(); dom.loadHTML('<html><body></body></html>');
    const previous = globalThis.document; globalThis.document = dom.document;
    try { return fn(walkBoard(view, options), dom); } finally { globalThis.document = previous; }
}
const rowFor = (board, place) => [...board.querySelectorAll('li')].find(li => li.getAttribute('data-walk-place') === place);

test('rows are sorted by minutes, then by place name', () => withBoard(WALK_MAP_VIEW, {}, board => {
    const names = [...board.querySelectorAll('li')].map(li => li.getAttribute('data-walk-place'));
    assert.deepEqual(names, ['Rented attic', 'Glassworks yard', 'Saltgate wharf', 'Old college']);
    assert.equal(board.querySelector('h3').textContent, 'Places and walks');
    assert.equal(board.querySelector('[data-walk-here]').textContent, "You are at Lamplighters' hall, Hill quarter");
}));

test('walk buttons keep their data-lotm and quote minutes', () => withBoard(WALK_MAP_VIEW, {}, board => {
    const wharf = rowFor(board, 'Saltgate wharf').querySelector('button');
    assert.equal(wharf.getAttribute('data-lotm'), 'walk_wharf');
    assert.equal(wharf.textContent, 'Walk · 20 min');
    assert.equal(rowFor(board, 'Glassworks yard').querySelector('button').getAttribute('data-lotm'), 'walk_glass');
}));

test('a blocked walk is disabled and its reason is visible text', () => withBoard(WALK_MAP_VIEW, {}, board => {
    const row = rowFor(board, 'Old college'), button = row.querySelector('button');
    assert.equal(button.disabled, true);
    assert.equal(button.title, 'The college gate shuts at dusk.');
    assert.equal(row.querySelector('small').textContent, 'The college gate shuts at dusk.');
    assert.equal(rowFor(board, 'Saltgate wharf').querySelector('small'), null);
}));

test('people show only at places the seat knows', () => withBoard(WALK_MAP_VIEW, {}, board => {
    const chips = [...rowFor(board, 'Saltgate wharf').querySelectorAll('.walk-board-person')];
    assert.deepEqual(chips.map(c => c.textContent), ['☺ Mott the tally clerk · mornings']);
    assert.doesNotMatch(board.textContent, /stranger|Hidden cellar/);
    assert.equal(board.querySelector('[data-walk-here-people]').textContent, 'Usually here: Widow Pell · evenings');
    assert.equal(board.querySelector('[data-walk-elsewhere]').textContent, 'Your cousin lives in another city');
}));

test('clicking an eligible walk calls move with its id', () => {
    const picked = [];
    withBoard(WALK_MAP_VIEW, {move: id => picked.push(id)}, (board, dom) => {
        rowFor(board, 'Saltgate wharf').querySelector('button').dispatchEvent(new dom.classes.Event('click', {bubbles: true}));
    });
    assert.deepEqual(picked, ['walk_wharf']);
});

test('a lone place shows the empty line and no map toggle without a callback', () => withBoard({places: [{place: 'Roadside inn', here: true, minutes: 0}]}, {}, board => {
    assert.match(board.querySelector('[data-walk-empty]').textContent, /You know no other places yet/);
    assert.equal(board.querySelector('[data-walk-rows]'), null);
    assert.equal(board.querySelector('[data-walk-map-toggle]'), null);
}));

test('the meter scales to the farthest place and the map toggle calls back', () => {
    let toggled = 0;
    withBoard(WALK_MAP_VIEW, {onToggleMap: () => toggled++}, (board, dom) => {
        assert.equal(rowFor(board, 'Old college').querySelector('.walk-board-fill').style.getPropertyValue('--walk-share'), '1');
        const toggle = board.querySelector('[data-walk-map-toggle]');
        assert.equal(toggle.textContent, 'Show the walking map');
        toggle.dispatchEvent(new dom.classes.Event('click', {bubbles: true}));
    });
    assert.equal(toggled, 1);
});
