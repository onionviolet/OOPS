// A bounded frontier inference through existing recipes and encounter knowledge.
// Observing this projection never learns a recipe, spends samples or rolls craft quality.
const routes = [{recipe: 'Healing powder', prerequisite: 'Weak healing powder'}];
const keyId = key => {try {return JSON.parse(key).id;} catch {return null;}};
export function acquiredMaterialIds(items = []) {
    return new Set(items.filter(row => row.count > 0).map(row => row.item_id || keyId(row.item_key)).filter(Boolean));
}
export function inventoryGains(previous = {}, next = {}) {
    return new Set(Object.keys(next).filter(key => next[key] > (previous[key] || 0)).map(keyId).filter(Boolean));
}
export function materialInsights({worldId, recipes, known, level}, acquired, additional = []) {
    if(worldId !== 'base.frontier') return [];
    const learned = new Set(additional);
    return routes.flatMap(route => {
        const recipe = recipes?.alchemy?.items?.[route.recipe], prior = recipes?.alchemy?.items?.[route.prerequisite];
        if(!recipe || recipe.isUnlocked() || learned.has(recipe.id) ||
            !(prior?.isUnlocked() || learned.has(prior?.id)) ||
            !(level(recipe.recipe_skill) >= recipe.recipe_level[0])) return [];
        const inputs = recipe.materials.map(row => row.material_id);
        if(inputs.some(id => !id || !known(id)) || !inputs.some(id => acquired.has(id))) return [];
        return [{category:'alchemy', subcategory:'items', recipe_id:route.recipe, id:recipe.id,
            text:`Your alchemy practice connects ${inputs.join(' with ')}. Learned preparation: ${recipe.name}. Crafting still needs its full materials and an alchemy station.`}];
    });
}
