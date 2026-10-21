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
            return Object.entries(inventory).some(([key,entry]) => entry.item.id === material.material_id && entry.count >= material.count && canConsume(key));
        });
    }

    const availability = recipe.get_availability();
    return availability.available_ammount > 0 && availability.materials.every(group =>
        group.items.every(entry => canConsume(entry.item.inventory_key)));
}

// Crafting screen (2026-10-13): one read-only status per items recipe. The row's
// unavailable class, the "Makeable now" filter, the detail's Craft button and the
// requirement rows all read this. It reuses the exact get_availability() result the
// native craft uses and adds the same station and disposition checks the craft makes.
export function itemRecipeStatus({recipe, stationTier, findMaterial, isMaterialKnown, canConsume}) {
    const availability = recipe.get_availability();
    const requirements = recipe.materials.map((material, i) => {
        // get_availability() stops after the first short material; later rows use the same lookup.
        const found = availability.materials[i] || findMaterial({material, needed_count: material.count});
        const known = material.material_type ? true : isMaterialKnown(material.material_id);
        const owned = found.items.reduce((n,entry)=>n+entry.count,0), usable = found.items.reduce((n,entry)=>n+(canConsume(entry.item.getInventoryKey())?entry.count:0),0);
        const blocked = Math.max(0,owned-usable), held_back = found.count >= material.count && blocked > 0;
        return {material, have: found.count, owned, usable, blocked, stockKnown: true, need: material.count, missing: found.count < material.count, known, held_back, items: found.items};
    });
    const reasons = [];
    if(!recipe.isUnlocked()) reasons.push('not learned');
    if(!(stationTier > 0)) reasons.push('no station here');
    const missing = requirements.filter(r => r.missing);
    if(missing.length) reasons.push(`missing ${missing.length} material${missing.length > 1 ? 's' : ''}`);
    if(requirements.some(r => r.held_back)) reasons.push('a material is reserved or you are busy');
    const available = !reasons.length && availability.available_ammount > 0;
    return {available, amount: available ? availability.available_ammount : 0, requirements, reasons, availability};
}
