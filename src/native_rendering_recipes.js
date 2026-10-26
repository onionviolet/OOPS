// Original base-world application of TSW3/8/9. Select a source deliberately in
// the existing recipe list. Its oil contribution changes the input cost, while
// the normal cooking executor owns stock, chance, XP, rollback and publication.
import {nativeCatalogue} from './native_material_catalogue.js';
import {gradeMaterialFit} from './craft_material_fit.js';

// Author/developer query used once at recipe registration, not an observer
// forecast. Counts describe actual work; a truncated diagnostic is not a claim
// that unsearched sources are physically unsuitable. No cache or saved state.
export function queryRenderingSources({catalogue = nativeCatalogue, maxCandidates = Infinity} = {}) {
    if(maxCandidates !== Infinity && (!Number.isSafeInteger(maxCandidates) || maxCandidates < 0)) throw Error('Invalid rendering query budget.');
    if(catalogue.basis !== 1000 || catalogue.axes.oil?.kind !== 'fraction') throw Error('Unsupported rendering units: this native method uses fractional oil on a 1000-part basis.');
    const reference = catalogue.materials['Boar meat'];
    if(!reference || !Number.isSafeInteger(reference.properties.oil) || reference.properties.oil <= 0) throw Error('Rendering query needs its positive-oil reference.');
    const profile = {tags: {all: ['meat']}, targets: [{axis: 'oil', value: reference.properties.oil}]};
    const candidates = Object.values(catalogue.materials).filter(material => material.id !== reference.id);
    const sources = [];
    let examined = 0;
    for(const material of candidates) {
        if(examined >= maxCandidates) break;
        const fit = gradeMaterialFit(catalogue, material, profile);
        examined++;
        if(fit.status !== 'accepted') continue;
        const count = Math.ceil(3 * 1000 / fit.permille);
        // ORIGINAL fixed-batch approximation: contribution is a game unit,
        // not measured oil mass. Whole pieces are spent; ceiling surplus is
        // expected rendering loss, not another retained oil inventory.
        const target = 3 * reference.properties.oil, supplied = count * material.properties.oil;
        sources.push({id: material.id, fit: fit.permille, count,
            contribution: {model: 'fixed-batch', unit: 'oil-permille-pieces', target, supplied,
                expectedLoss: supplied - target, disposition: 'expected-rendering-loss'}});
    }
    const complete = examined === candidates.length;
    return {sources, catalogue: catalogue.ref,
        coverage: {examined, total: candidates.length, complete, reason: complete ? 'catalogue-exhausted' : 'candidate-budget'},
        cost: {fitEvaluations: examined}};
}

// Native registration always searches the complete catalogue. A diagnostic
// budget must not silently remove a supported recipe from ordinary play.
export const renderingSources = () => queryRenderingSources().sources;

export function registerRenderingRecipes({recipes, ItemRecipe, knowsItem}) {
    const base = recipes.cooking.items['Animal fat'];
    const selection = queryRenderingSources();
    for(const source of selection.sources) {
        const id = `Render animal fat from ${source.id}`;
        const recipe = new ItemRecipe({name: id, recipe_type: base.recipe_type,
            materials: [{material_id: source.id, count: source.count}],
            result: {...base.result}, recipe_level: [...base.recipe_level], recipe_skill: base.recipe_skill,
            success_chance: [...base.success_chance], is_unlocked: false});
        // One learned method, no cloned unlock or extra persistent capability.
        // Unknown source names do not appear before the player encounters them.
        recipe.isUnlocked = () => !!(base.isUnlocked() && knowsItem(source.id));
        recipe.getAvailabilityComponent = () => base.getAvailabilityComponent();
        recipe.materialContribution = source.contribution;
        recipes.cooking.items[id] = recipe;
    }
    return selection;
}
