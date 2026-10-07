// Display-only kind identification. Stable native IDs/counts/custody persist.
import {GAME_ABSORPTION_ASSAY_IDS as I, GAME_ABSORPTION_ASSAY_KEYS as K} from './game_absorption_assay_content.js';
import {gameAbsorptionAssayIdentified} from './game_absorption_assay_facts.js';
const FULL_ID = JSON.parse(K.full).id;
function exactId(item) {
    if(typeof item === 'string') return item === K.full ? FULL_ID : item;
    if(typeof item?.id === 'string') return item.id;
    try {const key = JSON.parse(item?.key); return JSON.stringify({id: key.id}) === item.key ? key.id : null;} catch {return null;}
}
export function projectGameAbsorptionAssayItemView(item, state, fallback = {}) {
    const name = fallback.name ?? item?.name ?? (typeof item === 'string' ? item : ''), description = fallback.description ?? item?.description ?? '';
    if(exactId(item) !== FULL_ID) return {...fallback, name, description};
    const identified = state?.referenceGameplay?.schema === 1 && state.actors?.player?.facts?.[`${I.prefix}opened`] === true && gameAbsorptionAssayIdentified(state);
    return {...fallback, name: identified ? 'Gum wash vial • 1 charge' : name,
        description: identified ? `${description}${description ? ' ' : ''}Identified from your retained evidence as gum wash. One external application spends this charge and leaves an Empty bench vial. It does not restore a knife edge.` : description,
        identified, charge: 1};
}
export const GAME_ABSORPTION_ASSAY_ITEM_VIEW_ID = FULL_ID;
