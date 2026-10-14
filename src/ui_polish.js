// Original presentation helpers, inspired by the Proto23 mechanism audit.
// No foreign source, combat outcomes or save state are introduced here.
export function combatHitText({target, damage, count = 1, critical = false, blocked = false}) {
    return `${target}${blocked ? ' partially blocked, then' : ' was'} hit${critical ? ' [CRIT]' : ''}${count > 1 ? ` ×${count} hits` : ''} for ${Math.ceil(10 * damage) / 10} physical damage${count > 1 ? ' total' : ''}`;
}
export function vendorState({stock, selected = 0, price, money, buying = 0, selling = 0}) {
    if(stock <= 0) return {state: 'sold-out', label: 'Sold out'};
    if(stock <= selected) return {state: 'in-basket', label: 'All in basket'};
    if(price > money + selling - buying) return {state: 'unaffordable', label: 'Cannot afford one more'};
    return {state: 'available', label: ''};
}
export function conditionText(durability, actor, item) {
    if(!durability.enabled || !item?.tags?.equippable || !JSON.parse(item.getInventoryKey()).e2_instance) return '';
    const {condition, cost} = durability.quoteRepair(actor, item.getInventoryKey());
    return `Condition ${Number(condition.toFixed(4))}/100 · Repair ${cost} coin${cost === 1 ? '' : 's'}`;
}
