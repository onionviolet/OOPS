import {resolveGuActivation} from './gu_activation.js';

export function separateHostedGu({id, cost, clock}) {
    const result = resolveGuActivation({stages: [{operator: 'player', gu: {id, kind: 'plunder', fedThrough: clock},
        ability: {fuel: 'primeval', cost, effect: {kind: 'separate-hosted-gu', magnitude: 1}}}],
    reserves: {player: {primeval: cost}}, day: clock});
    if (!result.effects.some(effect => effect.kind === 'separate-hosted-gu')) throw Error('Plunder lost its hold on the wild Gu.');
}
