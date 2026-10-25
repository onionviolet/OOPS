// A remembered design is not a batch, skill grant or material-identification fact.
import {SALT_STEEP} from './craft_reference_content.js';
import {createCraftState,freezeRecipe} from './craft_state.js';
import {emptyReferences,recipeAccess} from './craft_reference.js';
import {heldRefs,validateOwner} from './crafting_frontier_runtime.js';
export function validatePattern(pattern){
    if(!pattern||pattern.world!=='base.frontier'||!Number.isSafeInteger(pattern.at)||pattern.at<0||JSON.stringify(pattern.recipe)!==JSON.stringify(SALT_STEEP))throw Error('Invalid retained pattern.');
    return pattern;
}
export function sketchPattern(owner,inventory,id,at){
    validateOwner(owner);
    if(!recipeAccess(owner??{},'player',heldRefs(inventory))[id])throw Error('Read or learn this method before sketching it.');
    const recipe=owner?.recipes[id]?.recipe;
    return structuredClone(validatePattern({world:owner.scope.world,at,recipe}));
}
export function rebuildPattern(owner,pattern,world){
    validatePattern(pattern);validateOwner(owner);
    if(world!==pattern.world)throw Error('This design needs its Frontier law and ingredients. Its record remains intact.');
    let next=freezeRecipe(owner??createCraftState({world,life:0}),pattern.recipe);
    const refs=structuredClone(next.references??emptyReferences()),known=refs.learned.player??[];
    if(known.includes(pattern.recipe.id))throw Error('This body already knows the method.');
    refs.learned.player=[...known,pattern.recipe.id];next.references=refs;
    return validateOwner(next);
}
