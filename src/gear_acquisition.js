import {createAffixes, DEFAULT_AFFIX_DIAL} from './gear_affixes.js';

// Acquisition resolves equipment truth once. Saved keys, trade and inspection
// carry that truth; they never ask this generator to roll it again (ESD10/13).
export function affixedStockEntries({item, count, partsOf, random, dial = DEFAULT_AFFIX_DIAL, plain = false}) {
    const key = item.getInventoryKey();
    if (!item.components?.internal || item.affixes?.length || plain) return [{item_key: key, count}];
    const parsed = JSON.parse(key), groups = new Map();
    for (let n = 0; n < count; n++) {
        const affixes = createAffixes({parts: partsOf(item.components), rarity: item.getRarity(), random: decision => random(n, decision), dial});
        const resolved = JSON.stringify({...parsed, ...(affixes.length ? {affixes} : {})});
        groups.set(resolved, (groups.get(resolved) || 0) + 1);
    }
    return [...groups].map(([item_key, count]) => ({item_key, count}));
}

// Surviving worn gear is recoverable after victory. The survival chance is a
// local content dial for battle damage, separate from biological material loot.
// Transfer the actual worn key, including affixes/work; never reroll a corpse.
export function recoveredEquipmentLoot(equipment, random, chance = .25) {
    return Object.entries(equipment).sort(([a], [b]) => a.localeCompare(b))
        .filter(([, item]) => item?.getInventoryKey)
        .filter(([slot]) => chance > random(slot))
        .map(([, item]) => ({item_key: item.getInventoryKey(), count: 1}));
}

export const acquiredLootKeys = (loot, templates) => loot.map(row => ({
    item_key: row.item_key || templates[row.item_id].getInventoryKey(), count: row.count,
}));
