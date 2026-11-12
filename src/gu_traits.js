import {address, drawU32, pickWeighted} from './gen_kit.js';
import {guCatalogue} from './gu_catalogue.js';

// Tables contain only fields a kind or its origin actually defines. Each
// trait has its own addressed draw, so adding another field leaves it intact.
export function drawGuTraits({seed, source, identity, table}) {
    return Object.fromEntries(Object.entries(table).map(([trait, choices]) => {
        const pick = pickWeighted(choices, row => row.weight, drawU32(seed, address(source, trait, identity)));
        if (!pick.value) throw Error('A Gu trait needs a positive possibility.');
        return [trait, pick.value.id];
    }));
}

export const wildWormTraits = guCatalogue['liquor-worm'].traits.value;
export const clanMoonlightTraits = guCatalogue.moonlight.traits.value;
