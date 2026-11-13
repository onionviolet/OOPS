import {resolveGuActivation} from './gu_activation.js';

export function resolveHostedExtraction({gu, operator, cost, clock, reserve}) {
    return resolveGuActivation({stages: [{operator, gu,
        ability: {fuel: 'primeval', cost, effect: {kind: 'separate-hosted-gu', magnitude: 1}}}],
    reserves: {[operator]: {primeval: reserve}}, day: clock});
}

export function separateHostedGu({id, cost, clock}) {
    const result = resolveHostedExtraction({gu: {id, kind: 'plunder', fedThrough: clock},
        operator: 'player', cost, clock, reserve: cost});
    if (!result.effects.some(effect => effect.kind === 'separate-hosted-gu')) throw Error('Plunder lost its hold on the wild Gu.');
}
