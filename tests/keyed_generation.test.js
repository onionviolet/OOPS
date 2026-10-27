import test from 'node:test';
import assert from 'node:assert/strict';
import {keyedShopStock, keyedUnitFor} from '../src/keyed_generation.js';
import {dayIndex} from '../src/world_day_index.js';

const template = [{items: Array.from({length: 12}, (_, k) => ({item_name: `i${k}`, chance: 0.5, count: [1, 20], quality: [10, 90]}))}];
const base = {worldSeed: 12345, shopId: 'tingen.baker', dayIndex: 5, template};

test('same seed, shop and day give identical stock; unrelated draws change nothing', () => {
    const a = keyedShopStock(base);
    keyedUnitFor(12345, 'loot', ['anything'], 3);
    keyedShopStock({...base, shopId: 'other'});
    assert.deepEqual(keyedShopStock(base), a);
    assert.ok(a.length > 0 && a.length < 12);
});

test('different day, shop id or world seed changes stock', () => {
    const a = JSON.stringify(keyedShopStock(base));
    for (const alt of [{dayIndex: 6}, {shopId: 'tingen.smith'}, {worldSeed: 999}])
        assert.notEqual(JSON.stringify(keyedShopStock({...base, ...alt})), a);
});

test('dayIndex from the played calendar feeds the key', () => {
    const d = dayIndex({calendar: {day_count: 5}});
    assert.deepEqual(keyedShopStock({...base, dayIndex: d}), keyedShopStock(base));
});

test('rejects bad inputs', () => {
    assert.throws(() => keyedShopStock({...base, dayIndex: 0}));
    assert.throws(() => keyedShopStock({...base, shopId: ''}));
});
