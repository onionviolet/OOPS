import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative} from './helpers/native_loader.mjs';
import {nativeCatalogue, nativeMaterialFor, nativeItemsMatching, NATIVE_ITEM_IDS, NATIVE_TAGS, SYMBOLIC_PROPOSALS} from '../src/native_material_catalogue.js';

test('catalogue is base.native@2 with 20 to 40 materials and conserved fractions', () => {
    assert.equal(nativeCatalogue.ref, 'base.native@2');
    assert.ok(NATIVE_ITEM_IDS.length >= 20 && NATIVE_ITEM_IDS.length <= 40);
    for(const m of Object.values(nativeCatalogue.materials)) {
        const sum = Object.entries(m.properties).reduce((n, [a, v]) => n + (nativeCatalogue.axes[a].kind === 'fraction' ? v : 0), 0);
        assert.equal(sum, nativeCatalogue.basis, m.id);
    }
    for(const id of Object.keys(SYMBOLIC_PROPOSALS)) assert.ok(NATIVE_ITEM_IDS.includes(id), id);
    assert.ok(NATIVE_TAGS.symbolic.every(t => nativeCatalogue.registry.get(t).kind === 'symbolic_proposal'));
});

test('every mapped id exists in the game item definitions', async () => {
    const {item_templates} = await loadNative(`export {item_templates} from './src/items.js';`, {prefix: 'native-bridge-test-'});
    assert.deepEqual(NATIVE_ITEM_IDS.filter(id => !item_templates[id]), []);
});

test('lookup and reverse queries', () => {
    assert.equal(nativeMaterialFor('Rat pelt').id, 'Rat pelt');
    assert.equal(nativeMaterialFor('No such item'), null);
    assert.equal(nativeMaterialFor('toString'), null);
    const fuel = nativeItemsMatching({all: ['fuel']});
    for(const id of ['Wood log', 'Hickory wood log', 'Charcoal', 'Coal', 'Lamp oil']) assert.ok(fuel.includes(id), id);
    assert.ok(!fuel.includes('Rat pelt'));
    assert.deepEqual(nativeItemsMatching({all: ['binder']}), ['Animal fat', 'Bonemeal', 'Flax', 'Sinew', 'Tree sap']);
    assert.ok(nativeItemsMatching('animal').includes('Animal fat'), 'parent tags expand');
    assert.ok(nativeItemsMatching('oil').includes('Animal fat'));
    assert.deepEqual(nativeItemsMatching({all: ['pelt']}), ['Boar hide', 'Rat pelt', 'Wolf pelt']);
    assert.ok(!nativeItemsMatching({all: ['wood']}).includes('Coal'));
});

test('property thresholds', () => {
    assert.deepEqual(nativeItemsMatching(null, {min: {oil: 800}}), ['Animal fat', 'Lamp oil']);
    assert.deepEqual(nativeItemsMatching({all: ['wood']}, {min: {hardness: 60}}), ['Hickory wood log']);
    assert.ok(nativeItemsMatching({all: ['fuel']}, {max: {hardness: 20}}).includes('Charcoal'));
    assert.throws(() => nativeItemsMatching(null, {min: {nope: 1}}));
});
