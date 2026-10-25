import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeCatalogue} from '../src/native_material_catalogue.js';
import {gradeMaterialFit} from '../src/craft_material_fit.js';
import {renderingSources} from '../src/native_rendering_recipes.js';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

test('rendering fit grades source contribution without revealing unobserved properties or accepting unrelated oil', () => {
    const profile = {tags: {all: ['meat']}, targets: [{axis: 'oil', value: 100}]};
    const fit = id => gradeMaterialFit(nativeCatalogue, nativeCatalogue.materials[id], profile);
    assert.equal(fit('Boar meat').permille, 1000);
    assert.equal(fit('Goat meat').permille, 800);
    assert.equal(fit('Crab meat').permille, 300);
    assert.equal(fit('Lamp oil').status, 'rejected');
    assert.deepEqual(gradeMaterialFit(nativeCatalogue, nativeCatalogue.materials['Goat meat'], profile, {knows: () => false}),
        {status: 'unknown', permille: null, reason: 'Relevant properties have not been observed.'});
    assert.deepEqual(renderingSources().map(row => [row.id, row.count]), [['Goat meat', 4], ['Crab meat', 10], ['Frog meat', 10]]);
    for(const row of renderingSources()) assert.ok(row.count * nativeCatalogue.materials[row.id].properties.oil >= 300);
    assert.throws(() => gradeMaterialFit(nativeCatalogue, nativeCatalogue.materials['Goat meat'], {...profile, targets: [{axis: 'invented', value: 100}]}), /Invalid material fit target/);
});

test('native rendering shares the learned method, hides unknown sources and quotes exact stock without substituting', async () => {
    const n = await loadNative(`export {recipes} from './src/crafting_recipes.js'; export {character} from './src/data/character.js'; export {item_templates,item_log} from './src/items.js'; export {fill_availability_methods} from './src/component_management.js';`, {stubs: STANCE_LOCATION_STUBS});
    n.fill_availability_methods();
    const base = n.recipes.cooking.items['Animal fat'], goat = n.recipes.cooking.items['Render animal fat from Goat meat'];
    assert.equal(goat.isUnlocked(), false);
    base.setUnlocked();
    assert.equal(goat.isUnlocked(), false, 'knowing the method does not reveal unseen sources');
    const key = n.item_templates['Goat meat'].getInventoryKey();
    n.character.addToInventory([{item_key: key, count: 3}]);
    assert.equal(goat.isUnlocked(), true);
    assert.equal(goat.getAvailabilityComponent(), base.getAvailabilityComponent());
    const before = n.character.getItems()[key].count;
    assert.equal(goat.get_availability().available_ammount, 0);
    n.character.addToInventory([{item_key: n.item_templates['Boar meat'].getInventoryKey(), count: 30}]);
    assert.equal(goat.get_availability().available_ammount, 0, 'another source never replaces the chosen source');
    assert.equal(n.character.getItems()[key].count, before, 'preview spends nothing');
    n.character.addToInventory([{item_key: key, count: 1}]);
    assert.equal(goat.get_availability().available_ammount, 1);
    assert.deepEqual(goat.getResult(), base.getResult());
    assert.deepEqual(base.materials, [{material_id: 'Boar meat', count: 3}]);
});
