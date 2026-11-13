import {resolveGuActivation} from './gu_activation.js';
import {fixedImmortalTravel, fixedImmortalTravelAbility} from './gu_fixed_immortal_travel.js';

// Authored Keeper design. The headless host exercises the same support costs
// and cargo tradeoff against live holders.
export const transitHouseBlueprint = {
    core: fixedImmortalTravel, rank: 6, minutes: 15,
    ability: {...fixedImmortalTravelAbility, cost: 2},
    supports: {
        anchor: {carriesLoad: true, ability: {fuel: 'immortal', cost: 1, modifier: {property: 'cost', factor: 0.5, kind: fixedImmortalTravel}}},
        glide: {carriesLoad: false, ability: {fuel: 'immortal', cost: 1, modifier: {property: 'cost', factor: 0, kind: fixedImmortalTravel}}},
    },
};

export function fitGuHouse(blueprint, core, support, clock) {
    if (core?.kind !== blueprint.core || core.rank !== blueprint.rank || !core.alive || core.injured ||
        !support?.alive || support.injured || core.id === support.id || !Number.isSafeInteger(clock) || clock < 0 ||
        !Object.hasOwn(blueprint.supports, support.kind)) {
        throw Error('The frame needs a ready core and a compatible living support.');
    }
    return {core: core.id, support: support.id, fittedAt: clock, phase: 'setting'};
}

export function settleGuHouse(blueprint, assembly, core, support, clock, rush = false) {
    const due = assembly?.fittedAt + blueprint.minutes;
    if (assembly?.phase !== 'setting' || !core?.alive || core.injured || core.id !== assembly.core ||
        !support?.alive || support.id !== assembly.support || (rush ? clock >= due : clock < due)) {
        throw Error('The bound frame is not ready for that step.');
    }
    return {assembly: {...assembly, phase: rush ? 'damaged' : 'ready'},
        support: rush ? {...support, alive: false, fate: 'destroyed'} : support};
}

export function quoteGuHouse(blueprint, assembly, {core, support, operator, clock, reserve, loaded}) {
    const brace = blueprint.supports[support?.kind];
    if (assembly?.phase !== 'ready' || !core?.alive || core.id !== assembly.core || core.holder !== operator ||
        !support?.alive || support.id !== assembly.support || !brace || (loaded && !brace.carriesLoad)) return null;
    const supply = {pool: 'green-grape', family: 'immortal', rank: blueprint.rank, source: 'stored'};
    const stages = [
        {gu: {...support, fedThrough: clock}, operator, ability: brace.ability, supply},
        {gu: {...core, fedThrough: clock}, operator, ability: blueprint.ability, supply},
    ];
    const result = resolveGuActivation({stages, reserves: {[operator]: {'green-grape': reserve}}, day: clock});
    return result.effects.some(effect => effect.kind === 'travel') ? result : null;
}
