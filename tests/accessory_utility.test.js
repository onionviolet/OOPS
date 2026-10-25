import test from 'node:test';
import assert from 'node:assert/strict';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {ACCESSORY_IDS as IDS, ACCESSORIES, registerAccessoryItems,
    registerAccessoryRecipes, equippedAccessoryUtility, accessoryBonusText,
    accessoryCraftChance, accessoryDropModifier, accessoryTradeMargin,
    accessoryCraftingTiers, setAccessoryEquipmentReader} from '../src/absorb_c1/accessories.js';

const equipped = id => ({amulet: {id, equip_slot: 'amulet'}});

test('utilities derive solely from the native amulet slot, never saved metadata', () => {
    assert.deepEqual(equippedAccessoryUtility(), {craftLuck: 0, dropMultiplier: 1,
        markupReduction: 0, portableCookingTier: 0});
    assert.equal(equippedAccessoryUtility({artifact: {id: IDS.drops, equip_slot: 'amulet'}}).dropMultiplier, 1);
    assert.equal(equippedAccessoryUtility({amulet: {id: IDS.drops, equip_slot: 'artifact'}}).dropMultiplier, 1);
    assert.equal(equippedAccessoryUtility({amulet: {id: 'Old ram\'s horn', equip_slot: 'amulet', utility: {dropMultiplier: 99}}}).dropMultiplier, 1);
    assert.equal(equippedAccessoryUtility(equipped(IDS.drops)).dropMultiplier, 1.05);
    assert.equal(equippedAccessoryUtility(equipped(IDS.luck)).dropMultiplier, 1);
    assert.equal(accessoryBonusText({id: 'unknown'}), '');
});

test('luck changes nonzero item craft chance without converting impossible or certain recipes', () => {
    assert.equal(accessoryCraftChance(0.65, equipped(IDS.luck)), 0.67);
    assert.equal(accessoryCraftChance(0.99, equipped(IDS.luck)), 1);
    assert.equal(accessoryCraftChance(0, equipped(IDS.luck)), 0);
    assert.equal(accessoryCraftChance(1, equipped(IDS.luck)), 1);
    assert.equal(accessoryCraftChance(0.65, equipped(IDS.price)), 0.65);
    assert.ok(Math.abs(accessoryDropModifier(0.4, equipped(IDS.drops)) - 0.42) < 1e-12);
    assert.equal(accessoryDropModifier(0, equipped(IDS.drops)), 0);
});

test('price reduces only markup and leaves sell values and below-base margins intact', () => {
    assert.equal(accessoryTradeMargin(2, equipped(IDS.price)), 1.95);
    assert.equal(accessoryTradeMargin(1, equipped(IDS.price)), 1);
    assert.equal(accessoryTradeMargin(0.9, equipped(IDS.price)), 0.9);
    assert.equal(accessoryTradeMargin(2, equipped(IDS.drops)), 2);
});

test('portable cooking respects safety/unlock gates and preserves better native stations', () => {
    const safe = {tags: {safe_zone: true}};
    assert.deepEqual(accessoryCraftingTiers(safe, equipped(IDS.cooking), true), {cooking: 1});
    assert.deepEqual(accessoryCraftingTiers(safe, equipped(IDS.cooking), false), {});
    assert.deepEqual(accessoryCraftingTiers({tags: {combat_zone: true}}, equipped(IDS.cooking), true), {});
    assert.deepEqual(accessoryCraftingTiers(safe, equipped(IDS.price), true), {});
    const kitchen = {...safe, crafting: {isUnlocked: () => true, tiers: {cooking: 3, forging: 2}}};
    assert.deepEqual(accessoryCraftingTiers(kitchen, equipped(IDS.cooking), true), {cooking: 3, forging: 2});
    assert.deepEqual(kitchen.crafting.tiers, {cooking: 3, forging: 2});
    const locked = {...safe, crafting: {isUnlocked: () => false, tiers: {cooking: 3, forging: 2}}};
    assert.deepEqual(accessoryCraftingTiers(locked, equipped(IDS.cooking), true), {cooking: 1});
    assert.deepEqual(accessoryCraftingTiers(null, equipped(IDS.cooking), true), {});
});


test('injected equipment reader stays live and accepts the host custody filter', () => {
    let current = equipped(IDS.price), borrowed = false;
    setAccessoryEquipmentReader(() => borrowed ? {} : current);
    try {
        assert.equal(accessoryTradeMargin(2), 1.95);
        current = equipped(IDS.drops);
        assert.equal(accessoryTradeMargin(2), 2);
        assert.equal(accessoryDropModifier(1), 1.05);
        borrowed = true;
        assert.equal(accessoryDropModifier(1), 1);
        assert.throws(() => setAccessoryEquipmentReader(null), TypeError);
    } finally {setAccessoryEquipmentReader(() => ({}));}
});

test('native registration, material acquisition, equipment and save-key roundtrip use existing models', async () => {
    const native = await loadNative(`
            export {item_templates, Amulet, getItemFromKey} from './src/items.js';
            export {recipes, ItemRecipe} from './src/crafting_recipes.js';
            export {character} from './src/data/character.js';
            export {availabilities} from './src/data/component_references.js';
            export {fill_availability_methods} from './src/component_management.js';`, {stubs: STANCE_LOCATION_STUBS, prefix: 'c1-native-test-'});
    const items = registerAccessoryItems(native);
    const recipes = registerAccessoryRecipes(native);
    native.fill_availability_methods();
    assert.equal(registerAccessoryItems(native)[0], items[0]);
    assert.equal(registerAccessoryRecipes(native)[0], recipes[0]);
    for (const [i, d] of ACCESSORIES.entries()) {
        const item = items[i], recipe = recipes[i];
        assert.equal(item.equip_slot, 'amulet');
        assert.equal(item.use_quality, false);
        assert.deepEqual(item.getStats(), {});
        assert.equal(item.description, accessoryBonusText(item));
        assert.equal(recipe.getAvailabilityComponent().getStatus().is_unlocked, true);
        assert.equal(native.availabilities.recipe[d.id], recipe.getAvailabilityComponent());
        assert.deepEqual(recipe.getResult(), {result_id: d.id, count: 1});
        assert.equal(recipe.get_availability().available_ammount, 0);
        for (const material of d.materials) {
            const input = native.item_templates[material.material_id];
            assert.ok(input, material.material_id);
            native.character.addToInventory([{item_key: input.getInventoryKey(), count: material.count}]);
        }
        assert.equal(recipe.get_availability().available_ammount, 1);
        // Use the native selected-input ledger for consumption, then native result key.
        for (const group of recipe.get_availability().materials) {
            let needed = group.items.reduce((sum, x) => sum + x.count, 0);
            for (const entry of group.items) {
                const count = Math.min(needed, entry.count);
                native.character.removeFromInventory([{item_key: entry.item.getInventoryKey(), item_count: count}]);
                needed -= count;
            }
        }
        const restored = native.getItemFromKey(item.getInventoryKey());
        assert.equal(restored.id, d.id);
        assert.equal(restored.equip_slot, 'amulet');
        assert.equal(restored.use_quality, false);
        native.character._equipItem(restored);
        assert.deepEqual(equippedAccessoryUtility(native.character.getEquipment()), equippedAccessoryUtility(equipped(d.id)));
        const serializedEquipment = JSON.parse(JSON.stringify(native.character.getEquipment()));
        assert.equal(serializedEquipment.amulet.id, d.id);
        assert.deepEqual(equippedAccessoryUtility(serializedEquipment), equippedAccessoryUtility(equipped(d.id)));
        native.character.unequipItem('amulet');
        assert.deepEqual(equippedAccessoryUtility(native.character.getEquipment()), equippedAccessoryUtility());
    }
    assert.ok(native.item_templates['Iron ingot']);
    assert.ok(native.item_templates["Old ram's horn"]);
});
