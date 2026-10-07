// Pure player-facing projection for the two finite fieldcraft vial types.
// Knowledge comes only from the current player's explicit completed bench work.
import {NETHACK_FIELDCRAFT_IDS as I, NETHACK_FIELDCRAFT_KEYS as K} from './nethack_fieldcraft_content.js';

const FULL_ID = 'Unmarked pale vial';
const EMPTY_ID = 'Empty bench vial';
const FULL_KEY = K.vial;
const EMPTY_KEY = K.empty;
const prefix = 'nethack_fieldcraft.';
const count = n => Number.isSafeInteger(n) && n > 0 ? n : 0;

function exactItemId(item) {
    if(typeof item === 'string') return item === FULL_KEY ? FULL_ID : item === EMPTY_KEY ? EMPTY_ID : item;
    if(!item || typeof item !== 'object') return null;
    // Native item keys are serialized {id} strings; native definitions use id.
    if(typeof item.id === 'string') return item.id;
    if(typeof item.key === 'string') {
        try {
            const parsed = JSON.parse(item.key);
            if(parsed && typeof parsed.id === 'string' && JSON.stringify({id: parsed.id}) === item.key) return parsed.id;
        } catch { /* A non-JSON key is simply not one of these items. */ }
    }
    return null;
}

function learnedReedOil(state) {
    const fieldcraft = state?.referenceGameplay?.fieldcraft;
    const player = state?.actors?.player;
    const knowledge = state?.simulation?.knowledge?.player?.[I.oil];
    const completed = player?.completed || {};
    const explicitApplication = count(completed[ I.assay ]) > 0 ||
        count(completed[`${prefix}trial_dull`]) > 0 ||
        count(completed[`${prefix}trial_fineDull`]) > 0;
    return state?.referenceGameplay?.schema === 1 && fieldcraft?.schema === 1 &&
        player?.facts?.[`${prefix}opened`] === true && explicitApplication &&
        knowledge?.stage === 'understood';
}

/**
 * Return a display-only name, description, identity flag, and physical charge.
 * `item` may be the stable item ID, its frozen serialized key, or a native item
 * definition/object carrying `id` or `key`. Unknown items pass through unchanged.
 */
export function projectFieldcraftItemView(item, state, {name, description} = {}) {
    const id = exactItemId(item);
    if(id !== FULL_ID && id !== EMPTY_ID) {
        return {name: name ?? item?.name ?? (typeof item === 'string' ? item : ''),
            description: description ?? item?.description ?? '', identified: false, charge: null};
    }

    const baseName = name ?? (id === FULL_ID ? FULL_ID : EMPTY_ID);
    const baseDescription = description ?? '';
    if(id === EMPTY_ID) {
        return {name: baseName, description: baseDescription, identified: false, charge: 0};
    }

    const identified = learnedReedOil(state);
    return {
        name: identified ? 'Reed oil vial • 1 charge' : baseName,
        description: identified
            ? `${baseDescription}${baseDescription ? ' ' : ''}Identified as reed oil: one external application at Eda’s fitting bench uses this charge; the empty vial remains.`
            : baseDescription,
        identified,
        charge: 1,
    };
}

// Export exact frozen identifiers for static integration checks and consumers.
export const NETHACK_FIELDCRAFT_ITEM_VIEW_IDS = Object.freeze({full: FULL_ID, empty: EMPTY_ID});
export const NETHACK_FIELDCRAFT_ITEM_VIEW_KEYS = Object.freeze({full: FULL_KEY, empty: EMPTY_KEY});
