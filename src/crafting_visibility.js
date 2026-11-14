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
        const need = found.need ?? material.count;
        const owned = found.items.reduce((n,entry)=>n+entry.count,0), usable = found.items.reduce((n,entry)=>n+(canConsume(entry.item.getInventoryKey())?entry.count:0),0);
        const blocked = Math.max(0,owned-usable), held_back = found.count >= need && blocked > 0;
        return {material, have: found.count, owned, usable, blocked, stockKnown: true, need, missing: found.count < need, known, held_back, items: found.items, heat: found.heat};
    });
    const reasons = [];
    if(!recipe.isUnlocked()) reasons.push('not learned');
    if(!(stationTier > 0)) reasons.push('no station here');
    const missing = requirements.filter(r => r.missing);
    for(const r of missing) if(r.heat && !r.heat.ok) reasons.push(r.heat.reason);
    if(missing.some(r => !(r.heat && !r.heat.ok))) reasons.push(`missing ${missing.length} material${missing.length > 1 ? 's' : ''}`);
    if(requirements.some(r => r.held_back)) reasons.push('a material is reserved or you are busy');
    const available = !reasons.length && availability.available_ammount > 0;
    return {available, amount: available ? availability.available_ammount : 0, requirements, reasons, availability};
}

/** UIC172: a recipe row says how far it is from ready, not just "Missing". */
export function shortOfText(requirements) {
    const short = requirements.filter(r => r.missing).length, all = requirements.length;
    return short === 1 ? '1 material short' : `${short} of ${all} materials short`;
}

/** The short word on a recipe row and its longer spoken form, from one status. */
export function recipeRowSummary(state) {
    const noStation = state.reasons.includes('no station here'), short = state.requirements.some(r => r.missing);
    return state.available
        ? {short: `${state.amount} ready`, explanation: `${state.amount} ${state.amount === 1 ? 'attempt' : 'attempts'} ready; results may vary`}
        : noStation ? {short: 'No station', explanation: 'No station here'}
        : short ? {short: shortOfText(state.requirements), explanation: 'Missing materials; select for requirements'}
        : {short: 'Unavailable', explanation: 'Unavailable; select for requirements'};
}

/**
 * UIC172: each skill tab shows how many of its item recipes can be made now, so an empty tab is known before it is
 * opened. Reads the rows' own readiness marks; one pass per frame however many rows repaint.
 */
let tabCountsQueued = false;
export function paintRecipeTabCounts(doc) {
    if (tabCountsQueued || !doc?.querySelectorAll) return;
    tabCountsQueued = true;
    const run = () => {
        tabCountsQueued = false;
        for (const tab of doc.querySelectorAll('.crafting_mainpage_button[data-crafting_category]')) {
            const category = tab.dataset.crafting_category;
            const ready = doc.querySelectorAll(`[data-crafting_category="${category}"][data-crafting_subcategory] .recipe_readiness[data-ready="true"]`).length;
            const next = ready ? String(ready) : '';
            if ((tab.dataset.readyCount || '') !== next) { if (next) tab.dataset.readyCount = next; else delete tab.dataset.readyCount; }
            const title = ready ? `${ready} ${ready === 1 ? 'recipe' : 'recipes'} ready to make` : 'Nothing ready to make here yet';
            if (tab.title !== title) tab.title = title;
        }
    };
    (globalThis.requestAnimationFrame || (fn => setTimeout(fn, 0)))(run);
}
