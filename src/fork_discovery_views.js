// FNA04: independently extended from MrDrJames/yet-another-idle-rpg-dev
// c0b8d1d06e96107eb1572f03ae3324e8133f1fe8 (MIT). Keep upstream LICENSE.
// FNA08/FNA10 are independent projections, with no foreign code or assets.
// Knowledge inputs belong to native item acquisition, bestiary and heard notes.
export function clearRewardText(location, disclosed = []) {
    const clears = Math.floor((location.enemy_groups_killed || 0) / location.enemy_count);
    const rewards = location.rewards_with_clear_requirement || [];
    const known = rewards.filter(reward => Number.isSafeInteger(reward.required_clear_count)
        && reward.required_clear_count > clears
        && (reward.hint?.visibility === 'public' || disclosed.some(d =>
            d.location === location.id && d.clears === reward.required_clear_count)));
    return `Clears: [${clears}]` + (known.length
        ? ` · known milestone: ${Math.min(...known.map(r => r.required_clear_count))} clears` : '');
}

// These are sources disclosed by an encountered enemy's existing bestiary,
// not proof that a particular acquisition dropped from that enemy.
export function knownBestiarySources(itemId, {knownItems, kills, enemies}) {
    if (!(knownItems[itemId]?.number > 0)) return [];
    return Object.keys(kills).filter(id => kills[id] > 0 &&
        enemies[id]?.loot_list.some(loot => loot.item_name === itemId));
}

// Partial expectation: only acquired items, only an already encountered enemy.
// At standard quality, before market saturation and trader markup. No RNG.
export function knownLootValue(enemyId, {knownItems, kills, enemies, baseValue, dropModifier = 1}) {
    if (!(kills[enemyId] > 0)) return null;
    let value = 0, included = 0;
    for (const loot of enemies[enemyId]?.loot_list || []) {
        if (!(knownItems[loot.item_name]?.number > 0)) continue;
        const price = baseValue(loot.item_name);
        const count = loot.count ? (loot.count.min + loot.count.max) / 2 : 1;
        const chance = Math.max(0, Math.min(1, loot.chance * dropModifier));
        if (!Number.isFinite(price) || price < 0 || !Number.isFinite(count) || count < 0 || !Number.isFinite(chance)) continue;
        value += price * count * chance;
        included++;
    }
    return included ? value : null;
}
