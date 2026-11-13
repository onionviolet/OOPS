import {resolveGuActivation} from './gu_activation.js';
import {guCatalogue} from './gu_catalogue.js';

export const fixedImmortalTravel = 'fixed-immortal-travel';
export const fixedImmortalTravelAbility = guCatalogue['fixed-immortal-travel'].ability.value;

export function quoteFixedImmortalTravel({gu, operator, now, from, destination, impression, supply, reserve}) {
    if (gu?.kind !== fixedImmortalTravel || gu.holder !== operator || gu.wildWill) {
        return {reason: 'unavailable'};
    }
    const route = fixedTravelRoute({from, destination, impression});
    if (route.reason) return route;
    if (!supply || supply.family !== fixedImmortalTravelAbility.fuel) return {reason: 'wrong-fuel'};
    const activation = resolveGuActivation({stages: [{gu, operator, ability: fixedImmortalTravelAbility, supply}],
        reserves: {[operator]: {[supply.pool]: reserve}}, day: now});
    if (activation.outcome !== 'complete') return {reason: activation.reason};
    return {...route, spent: activation.activations[0].cost, activation};
}

export function fixedTravelRoute({from, destination, impression}) {
    if (!destination?.id || destination.id === from || impression?.site !== destination.id) {
        return {reason: 'unknown-destination'};
    }
    if (!destination.scene || destination.scene !== impression.scene) return {reason: 'changed-destination'};
    if (destination.sealed) return {reason: 'sealed-destination'};
    return {destination: destination.id};
}
