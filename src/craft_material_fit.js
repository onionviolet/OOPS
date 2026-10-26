// A world's authored profile grades an ingredient, independently of a recipe's
// exact identity rule. No inventory, clock, draw or save ownership (MR1/4/11).
import {materialTags, matchesQuery, validateMaterial, validateMaterialQuery, validateMaterialProperty} from './craft_materials.js';
import {checkSelector, selectorMatches} from './craft_recipes.js';

export function gradeMaterialFit(catalogue, material, {tags = null, essential = null, targets, floor = 1}, {knows} = {}) {
    if(!Array.isArray(targets) || !targets.length || !Number.isSafeInteger(floor) || floor < 1 || floor > 1000) throw Error('Invalid material fit profile.');
    validateMaterialQuery(catalogue, tags);
    if(essential != null) checkSelector(catalogue, essential);
    for(const row of targets) {
        if(!catalogue.axes[row.axis] || !Number.isSafeInteger(row.value) || row.value <= 0 || !Number.isSafeInteger(row.weight ?? 1) || (row.weight ?? 1) <= 0) throw Error('Invalid material fit target.');
        validateMaterialProperty(catalogue, row.axis, {unit: row.unit});
    }
    material = validateMaterial(catalogue, material);
    if(!matchesQuery(tags, materialTags(catalogue, material))) return {status: 'rejected', permille: 0, reason: 'The material does not support this process.'};
    const support = essential == null ? 'yes' : selectorMatches(catalogue, essential, material, knows);
    if(support === 'no') return {status: 'rejected', permille: 0, reason: 'An essential condition is not met.'};
    if(support === 'unknown') return {status: 'unknown', permille: null, reason: 'Relevant properties have not been observed.'};
    // Never substitute true properties into an observer's uncertain estimate.
    if(knows && targets.some(row => !knows(material.id, row.axis))) return {status: 'unknown', permille: null, reason: 'Relevant properties have not been observed.'};
    const weight = targets.reduce((sum, row) => sum + (row.weight ?? 1), 0);
    const permille = Math.floor(targets.reduce((sum, row) => sum + Math.min(1000, material.properties[row.axis] * 1000 / row.value) * (row.weight ?? 1), 0) / weight);
    return {status: permille >= floor ? 'accepted' : 'rejected', permille, reason: permille >= floor ? '' : 'Insufficient contribution for this process.'};
}
