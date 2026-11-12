import {resolveGuActivation} from './gu_activation.js';

export function resolveThreeHeadsSixArms({stages, reserves, day}) {
    const participants = [...new Set(stages.map(row => row.operator))];
    return resolveGuActivation({reserves, day,
        beats: [{stages, requires: {operators: 3, specimens: 18, minRank: 3, maxRank: 5}}],
        completionEffect: {kind: 'merged-body', participants, heads: 3, arms: 6}});
}
