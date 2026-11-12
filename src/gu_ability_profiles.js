import {guCatalogue} from './gu_catalogue.js';

export const moonlightBlade = guCatalogue.moonlight.ability.value;
export const littleLightSupport = guCatalogue['little-light'].ability.value;
export const lightSourceSupport = guCatalogue['light-source'].ability.value;
export const moonglowBlade = guCatalogue.moonglow.ability.value;

export const moonlightFocusBonus = 0.25;

export function moonlightFocusSpecimen(id, focus, refined, clock) {
    return {id, kind: 'moonlight', rank: 1, fedThrough: clock,
        traits: {bladeForce: (focus === 'tight' ? moonlightFocusBonus : 0) + (refined ? moonlightFocusBonus : 0)}};
}

export function moonbladeSheets(activation) {
    const cut = activation.effects.find(effect => effect.kind === 'damage');
    if (!cut) throw Error('The Moonblade failed to cut the target.');
    return cut.magnitude * 4;
}

export const littleLightMoonblade = guCatalogue.moonlight.move.value;
