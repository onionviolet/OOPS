// Binds the item card model to the live game without importing main.js: the composition root passes the readers.
import {itemCardModel} from './item_card_model.js';
export function makeItemCardReader({getItemFromKey, getItemRarity, equipmentOf, durability}) {
    return key => {
        let item; try { item = getItemFromKey(key); } catch { return null; }
        if (!item?.equip_slot) return null;
        const worn = equipmentOf()[item.equip_slot] || null;
        const wear = durability?.enabled ? durability.factor(item) : null;
        return itemCardModel(item, worn, {rarity: Number.isFinite(item.quality) ? getItemRarity(item.quality) : null, wearFactor: wear});
    };
}
