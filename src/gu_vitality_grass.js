import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';

export const vitalityGrass = guCatalogue['vitality-grass'].growth.value;
export const vitalityLeaf = guCatalogue['vitality-leaf'].treatment.value;

export function growVitalityLeaf(plant, {operator, daylight, water, essence, clock}) {
    if (plant.kind !== 'vitality-grass' || !plant.alive || plant.holder !== operator || plant.injured ||
        !Number.isSafeInteger(plant.leaves) || plant.leaves < 0 || plant.leaves >= vitalityGrass.capacity ||
        !daylight || !Number.isSafeInteger(water) || water < vitalityGrass.waterCost) {
        throw Error('Grow a leaf on a healthy, watered plant with daylight and room on the stem.');
    }
    if (!Number.isFinite(essence) || essence < 0) throw Error('Growing a leaf needs measured essence.');
    const fuel = 'red-steel';
    const activation = resolveGuActivation({stages: [{
        gu: {...plant, rank: vitalityGrass.rank, fedThrough: clock}, operator,
        ability: {fuel: 'primeval', cost: vitalityGrass.essenceCost, effect: {kind: 'grow-leaf', magnitude: 1}},
        supply: {pool: fuel, family: 'primeval', rank: vitalityGrass.rank, source: 'stored'},
    }], reserves: {[operator]: {[fuel]: essence}}, day: clock});
    if (activation.outcome !== 'complete') throw Error('Growing a leaf needs two measures of essence.');
    return {plant: {...plant, leaves: plant.leaves + activation.effects[0].magnitude}, waterSpent: vitalityGrass.waterCost,
        essenceSpent: essence - activation.remaining[operator][fuel]};
}

export function detachVitalityLeaf(plant, operator) {
    if (plant.kind !== 'vitality-grass' || !plant.alive || plant.holder !== operator ||
        !Number.isSafeInteger(plant.leaves) || plant.leaves < 1) {
        throw Error('Choose a living plant with a leaf on the stem.');
    }
    return {...plant, leaves: plant.leaves - 1};
}
