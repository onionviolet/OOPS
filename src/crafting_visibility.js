// Independently adapted from Kuroiteiken/yairp's makeable-recipe filter (3b43025).
// Projection only: no result creation, quality roll, XP, stock or unlock changes.
export function recipeMakeableNow({recipe, stationTier, inventory, itemTemplates,
    isMaterialKnown, canConsume}) {
    if(!recipe.isUnlocked() || !(stationTier > 0)) return false;

    if(Array.isArray(recipe.components)) {
        if(!recipe.components.length) return false;
        const required = new Map();
        for(const type of recipe.components) required.set(type, (required.get(type) || 0) + 1);
        return [...required].every(([type, count]) => {
            let available = 0;
            for(const [key, entry] of Object.entries(inventory)) {
                if(entry.item.component_type === type && entry.count > 0 && canConsume(key)) {
                    available += entry.count;
                }
            }
            return available >= count;
        });
    }

    if(recipe.recipe_type === "component" || recipe.recipe_type === "componentless") {
        // Native material choices require the known material's exact inventory key.
        return recipe.materials.some(material => {
            if(!isMaterialKnown(material.material_id)) return false;
            const key = itemTemplates[material.material_id]?.getInventoryKey();
            return key && inventory[key]?.count >= material.count && canConsume(key);
        });
    }

    const availability = recipe.get_availability();
    return availability.available_ammount > 0 && availability.materials.every(group =>
        group.items.every(entry => canConsume(entry.item.inventory_key)));
}
