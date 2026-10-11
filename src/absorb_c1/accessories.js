// Original utility accessories inspired by the audited Proto23 design pattern.
// Native items, recipes and equipment remain the only ownership ledger.
export const ACCESSORY_IDS = Object.freeze({
    luck: 'Knotted chance charm',
    drops: 'Forager pendant',
    price: 'Market tally pendant',
    cooking: 'Travel hearth pendant',
});

const definitions = [
    {id: ACCESSORY_IDS.luck, value: 8,
        description: 'While equipped: +2 percentage points to nonzero item-recipe success chance, capped at 100%. No effect on equipment quality.',
        utility: {craftLuck: 0.02},
        materials: [{material_id: 'Rat tail', count: 2}, {material_id: 'Piece of willow wood', count: 1}]},
    {id: ACCESSORY_IDS.drops, value: 12,
        description: 'While equipped: +5% relative enemy item-drop chance. Does not increase drop quantity or combat rewards.',
        utility: {dropMultiplier: 1.05},
        materials: [{material_id: 'Rat fang', count: 3}, {material_id: 'Rat tail', count: 3}]},
    {id: ACCESSORY_IDS.price, value: 20,
        description: 'While equipped: reduce shop markup by 5%. Base item value, selling prices and market saturation stay unchanged.',
        utility: {markupReduction: 0.05},
        materials: [{material_id: 'Iron ingot', count: 1}, {material_id: 'Rat tail', count: 1}]},
    {id: ACCESSORY_IDS.cooking, value: 30,
        description: 'While equipped: tier 1 cooking in any safe location after crafting is unlocked. Ingredients and Cooking skill still apply; better kitchens retain their tier.',
        utility: {portableCookingTier: 1},
        materials: [{material_id: 'Iron ingot', count: 2}, {material_id: 'Piece of willow wood', count: 2}]},
];

// Freeze nested authored data; native constructors receive fresh copies.
export const ACCESSORIES = Object.freeze(definitions.map(d => Object.freeze({
    ...d, utility: Object.freeze(d.utility),
    materials: Object.freeze(d.materials.map(m => Object.freeze(m))),
})));
const byId = new Map(ACCESSORIES.map(d => [d.id, d]));

export function registerAccessoryItems({item_templates, Amulet}) {
    for (const d of ACCESSORIES) {
        item_templates[d.id] ||= new Amulet({
            id: d.id, name: d.id, description: d.description, value: d.value,
            stats: {}, item_tier: 1, use_quality: false, saturates_market: false,
        });
    }
    return ACCESSORIES.map(d => item_templates[d.id]);
}

export function registerAccessoryRecipes({recipes, ItemRecipe}) {
    for (const d of ACCESSORIES) {
        recipes.crafting.items[d.id] ||= new ItemRecipe({
            id: d.id, name: d.id, is_unlocked: true, recipe_type: 'equipment',
            materials: d.materials.map(m => ({...m})),
            result: {result_id: d.id, count: 1}, recipe_skill: 'Crafting',
            recipe_level: [1, 8], success_chance: [0.65, 1],
        });
    }
    return ACCESSORIES.map(d => recipes.crafting.items[d.id]);
}

// The host may supply its custody-filtered live native equipment without creating
// a main/items/trade cycle. Explicit arguments are useful for previews/tests.
let equipmentReader = () => ({});
export function setAccessoryEquipmentReader(reader) {
    if (typeof reader !== 'function') throw new TypeError('Accessory equipment reader must be a function');
    equipmentReader = reader;
}

export function equippedAccessoryUtility(equipment = equipmentReader()) {
    // Read only the real native amulet slot, never inventory/storage/custody.
    const item = equipment?.amulet;
    const d = item?.equip_slot === 'amulet' ? byId.get(item.id) : undefined;
    return {craftLuck: 0, dropMultiplier: 1, markupReduction: 0,
        portableCookingTier: 0, ...(d?.utility || {})};
}

export function accessoryBonusText(item) {
    return byId.get(item?.id)?.description || '';
}

export function accessoryCraftChance(chance, equipment) {
    // Impossible recipes stay impossible; deterministic recipes stay certain.
    if (!(chance > 0 && chance < 1)) return chance;
    return Math.min(1, chance + equippedAccessoryUtility(equipment).craftLuck);
}

export function accessoryDropModifier(modifier, equipment) {
    return modifier * equippedAccessoryUtility(equipment).dropMultiplier;
}

export function accessoryTradeMargin(margin, equipment) {
    // Discount only markup: never create buy/sell arbitrage below base value.
    return margin > 1
        ? 1 + (margin - 1) * (1 - equippedAccessoryUtility(equipment).markupReduction)
        : margin;
}

export function accessoryCraftingTiers(location, equipment, craftingUnlocked = false) {
    const tiers = location?.crafting?.isUnlocked?.()
        ? {...location.crafting.tiers} : {};
    const portable = equippedAccessoryUtility(equipment).portableCookingTier;
    if (craftingUnlocked && location?.tags?.safe_zone && portable) {
        tiers.cooking = Math.max(tiers.cooking || 0, portable);
    }
    return tiers;
}
