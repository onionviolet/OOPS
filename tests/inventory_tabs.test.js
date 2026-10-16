import test from 'node:test';
import assert from 'node:assert/strict';
import { INVENTORY_CATEGORIES, rowCategories, categoryCounts, emptyHint, categoryOf } from '../src/inventory_tabs.js';

const row = (types, units = 1) => ({classes: ['inventory_item_control', 'character_item_control', ...types.map(t => `character_item_${t}`)], units});

test('categories are the five native ones, each tied to its native control', () => {
    assert.deepEqual(INVENTORY_CATEGORIES.map(c => [c.id, c.native]), [
        ['all', 'inventory_show_all'], ['equipment', 'inventory_show_equipment'], ['usable', 'inventory_show_consumable'],
        ['other', 'inventory_show_other'], ['favorites', 'inventory_show_favs']]);
    assert.equal(categoryOf('nonsense').id, 'all');
});

test('membership mirrors the native display rules: books are usable, loot/material/component are other', () => {
    assert.deepEqual(rowCategories(row(['book']).classes), {all: true, equipment: false, usable: true, other: false, favorites: false});
    for (const t of ['other', 'loot', 'material', 'component']) assert.equal(rowCategories(row([t]).classes).other, true, t);
    assert.equal(rowCategories(row(['equippable']).classes).equipment, true);
});

test('counts overlap where the native filter does: a starred item counts in its category and in Favorites', () => {
    const counts = categoryCounts([row(['equippable']), row(['usable', 'faved'], 3), row(['material'], 5), row(['book'])]);
    assert.deepEqual(counts.all, {stacks: 4, units: 10});
    assert.deepEqual(counts.equipment, {stacks: 1, units: 1});
    assert.deepEqual(counts.usable, {stacks: 2, units: 4});
    assert.deepEqual(counts.other, {stacks: 1, units: 5});
    assert.deepEqual(counts.favorites, {stacks: 1, units: 3});
});

test('empty states tell apart nothing held, an empty category and a search with no matches', () => {
    assert.match(emptyHint({category: 'all', held: false, inCategory: false, search: ''}), /^Nothing held yet/);
    assert.equal(emptyHint({category: 'usable', held: true, inCategory: false, search: ''}), 'No usable items or books yet.');
    assert.match(emptyHint({category: 'favorites', held: true, inCategory: false, search: ''}), /^No starred items yet/);
    assert.equal(emptyHint({category: 'other', held: true, inCategory: true, search: 'rat'}), 'No materials, components or loot match "rat". Clear the filter to see all.');
    assert.equal(emptyHint({category: 'all', held: true, inCategory: true, search: ''}), '');
});
