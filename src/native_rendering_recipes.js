// Original base-world application of TSW3/8/9. Select a source deliberately in
// the existing recipe list. Its oil contribution changes the input cost, while
// the normal cooking executor owns stock, chance, XP, rollback and publication.
import {nativeCatalogue} from './native_material_catalogue.js';
import {gradeMaterialFit} from './craft_material_fit.js';

export function renderingSources() {
    const reference = nativeCatalogue.materials['Boar meat'];
    const profile = {tags: {all: ['meat']}, targets: [{axis: 'oil', value: reference.properties.oil}]};
    return Object.values(nativeCatalogue.materials).filter(material => material.id !== reference.id).flatMap(material => {
        const fit = gradeMaterialFit(nativeCatalogue, material, profile);
        return fit.status === 'accepted' ? [{id: material.id, fit: fit.permille, count: Math.ceil(3 * 1000 / fit.permille)}] : [];
    });
}

export function registerRenderingRecipes({recipes, ItemRecipe, knowsItem}) {
    const base = recipes.cooking.items['Animal fat'];
    for(const source of renderingSources()) {
        const id = `Render animal fat from ${source.id}`;
        const recipe = new ItemRecipe({name: id, recipe_type: base.recipe_type,
            materials: [{material_id: source.id, count: source.count}],
            result: {...base.result}, recipe_level: [...base.recipe_level], recipe_skill: base.recipe_skill,
            success_chance: [...base.success_chance], is_unlocked: false});
        // One learned method, no cloned unlock or extra persistent capability.
        // Unknown source names do not appear before the player encounters them.
        recipe.isUnlocked = () => !!(base.isUnlocked() && knowsItem(source.id));
        recipe.getAvailabilityComponent = () => base.getAvailabilityComponent();
        recipes.cooking.items[id] = recipe;
    }
}
