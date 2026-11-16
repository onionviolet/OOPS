// Binds the item card model to the live game without importing main.js: the composition root passes the readers.
import {itemCardModel} from './item_card_model.js';
import {domainRegistry} from './domain_registry.js';

// PS249: the sheet's reroll preview is the Gear workshop's own quote for the first rolled mark (one authority for the
// odds); the sheet only draws it and opens the bench. A refusal (no forge here, too little skill) is shown as its reason.
function reforgeOf(key, item, known) {
    const id = (item.affixes || []).find(a => a.s !== 'mechanism')?.id;
    const quote = id && domainRegistry.command('gear_workshop', 'quote');
    if (!quote) return null;
    let q; try { q = quote({maker: 'player', action: 'reroll', key, affix: id}); } catch { return null; }
    const open = domainRegistry.command('gear_workshop', 'openReroll');
    return {preview: q.eligible ? q.preview : null, reason: q.eligible ? '' : q.reason, known,
        cost: q.eligible ? q.spend.slice(1).map(r => ({name: JSON.parse(r.key).id, count: r.count})) : [], open: open ? () => open(key, id) : null};
}
export function makeItemCardReader({getItemFromKey, getItemRarity, equipmentOf, durability}) {
    return key => {
        let item; try { item = getItemFromKey(key); } catch { return null; }
        if (!item?.equip_slot) return null;
        const worn = equipmentOf()[item.equip_slot] || null;
        const wear = durability?.enabled ? durability.factor(item) : null;
        const model = itemCardModel(item, worn, {rarity: Number.isFinite(item.quality) ? getItemRarity(item.quality) : null, wearFactor: wear});
        const reforge = item.components ? reforgeOf(key, item, (model.affixes || []).every(a => a.known)) : null;
        return reforge ? {...model, reforge} : model;
    };
}
