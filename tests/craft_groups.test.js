// PS101/PS103: a recipe list reads as Ready / One short / Far off, Far off folded with its count.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
const dom = createDom(); dom.loadHTML('<html><body><div id="list" class="crafting_recipe_list"></div></body></html>');
globalThis.document ??= dom.document;
const {groupRecipeRows} = await import('../src/ui/craft_groups.js');

test('rows group under Ready, One short and Far off, Far off folds, and the first ready row leads', () => {
    const list = dom.document.getElementById('list');
    const row = (id, state) => { const r = dom.document.createElement('div'); r.className = 'recipe_div'; r.dataset.recipe_id = id; r.dataset.craftState = state; list.append(r); return r; };
    row('pendant', 'far'); row('cloth', 'near'); row('string', 'ready'); row('hearth', 'blocked'); row('bonemeal', 'near');
    const first = groupRecipeRows(list);
    assert.equal(first.dataset.recipe_id, 'string');
    const order = [...list.children].map(n => n.dataset.craftGroupHead ? `[${n.dataset.craftGroupHead}]` : n.dataset.recipe_id);
    assert.deepEqual(order, ['[ready]', 'string', '[near]', 'cloth', 'bonemeal', '[far]', 'pendant', 'hearth']);
    const head = id => list.querySelector(`[data-craft-group-head="${id}"]`);
    assert.equal(head('near').textContent, 'One short · 2');
    assert.equal(head('far').textContent, '▸ Far off (2)');
    assert.ok(list.querySelector('[data-recipe_id="pendant"]').hasAttribute('data-craft-folded'));
    head('far').click();
    assert.ok(list.hasAttribute('data-far-open')); assert.equal(head('far').textContent, '▾ Far off (2)');
    const again = [...list.children]; groupRecipeRows(list); assert.deepEqual([...list.children], again, 'an unchanged order moves nothing');
});
