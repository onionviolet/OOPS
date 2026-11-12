import {resolveGuActivation} from './gu_activation.js';
import {guCatalogue} from './gu_catalogue.js';

export const attitudeGu = 'attitude';
export const attitudeAbility = guCatalogue['attitude'].ability.value;

export function useAttitudeGu({gu, operator, now, mental}) {
    if (gu?.kind !== attitudeGu || gu.holder !== operator || gu.wildWill) return null;
    const use = resolveGuActivation({stages: [{gu, operator, ability: attitudeAbility}],
        reserves: {[operator]: {mental}}, day: now});
    return use.outcome === 'complete' ? use : null;
}

// The observer weighs the presented demeanor alongside their actual reasons
// for suspicion. Authority is checked by the institution that owns it.
export function assessGuDemeanor({suspicion, impression = 0}) {
    return suspicion - impression <= 0 ? 'reassured' : 'wary';
}
