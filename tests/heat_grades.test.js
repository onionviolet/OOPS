import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {quoteHeat, heatWorld, validateHeatWorld, HEAT_WORLDS} from '../src/heat_grades.js';

const iron = {minGrade: 2, load: 4};

test('heat quote: a log fails by name, charcoal and coal run, lowest eligible grade is used', () => {
    validateHeatWorld(heatWorld());
    const log = quoteHeat(iron, [{id: 'Rough wood log', count: 9}]);
    assert.equal(log.ok, false);
    assert.match(log.reason, /Rough wood log only reaches grade 1 \(open fire\); this needs grade 2 \(forge fire\)/);
    assert.equal(quoteHeat(iron, []).ok, false);
    assert.equal(quoteHeat(iron, [{id: 'Iron ore', count: 3}]).reason, 'No fuel held; this needs grade 2 (forge fire).');
    const both = quoteHeat(iron, [{id: 'Coal', count: 2}, {id: 'Charcoal', count: 1}, {id: 'Rough wood log', count: 5}]);
    assert.deepEqual([both.ok, both.fuelId, both.unitsPerCraft, both.have], [true, 'Charcoal', 1, 1]);
    const coal = quoteHeat({minGrade: 3, load: 8}, [{id: 'Coal', count: 5}, {id: 'Charcoal', count: 5}]);
    assert.deepEqual([coal.fuelId, coal.unitsPerCraft, coal.minutesPerCraft], ['Coal', 2, 2]);
});

test('heat quote reads data per world and spends nothing', () => {
    const held = Object.freeze([Object.freeze({id: 'Coal', count: 1})]);
    const world = {grades: ['warm'], fuels: {Coal: {grade: 1, amount: 1, burn: 1}}};
    assert.equal(quoteHeat({minGrade: 1, load: 3}, held, {world}).unitsPerCraft, 3);
    assert.throws(() => quoteHeat({minGrade: 0, load: 1}, held), /Invalid heat requirement/);
    assert.throws(() => validateHeatWorld({grades: ['a'], fuels: {X: {grade: 2, amount: 1, burn: 1}}}), /Invalid fuel row/);
    assert.ok(Object.isFrozen(HEAT_WORLDS));
});

test('Iron ingot recipe: logs cannot smelt, charcoal and coal can, quote consumes nothing', async () => {
    const native = await loadNative(`
        export {item_templates} from './src/items.js';
        export {recipes} from './src/crafting_recipes.js';
        export {character} from './src/data/character.js';
        export {fill_availability_methods} from './src/component_management.js';`, {stubs: STANCE_LOCATION_STUBS, prefix: 'heat-native-test-'});
    native.fill_availability_methods();
    const recipe = native.recipes.smelting.items['Iron ingot'];
    const add = (id, count) => native.character.addToInventory([{item_key: native.item_templates[id].getInventoryKey(), count}]);
    const held = id => native.character.getItems()[native.item_templates[id].getInventoryKey()]?.count ?? 0;
    add('Iron ore', 10); add('Rough wood log', 4);
    const blocked = recipe.get_availability();
    assert.equal(blocked.available_ammount, 0);
    assert.match(blocked.materials[1].heat.reason, /Rough wood log only reaches grade 1/);
    assert.equal(held('Rough wood log'), 4);
    add('Charcoal', 1);
    assert.equal(recipe.get_availability().available_ammount, 1);
    assert.equal(recipe.get_availability().materials[1].heat.fuelId, 'Charcoal');
    assert.equal(held('Charcoal'), 1);
    add('Coal', 3);
    assert.equal(recipe.get_availability().materials[1].heat.fuelId, 'Charcoal');
});
