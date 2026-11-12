import {resolveGuActivation} from './gu_activation.js';
import {resolveGuDefense} from './gu_defense.js';
import {runGuGoal, searchGuGoal} from './gu_goal_search.js';

export const guardDamage = result => result.remainder.reduce((sum, packet) => sum + packet.amount, 0);

// The caller supplies the hazard and the current activation stages. Native
// custody, reserves and publication of damage or recovery stay with the caller.
export function guGuardWorking({packets, layers, crossing}) {
    const resolve = (power, effects) => resolveGuDefense(
        packets.map(({powerFactor, amount, ...packet}) => ({
            ...packet, amount: powerFactor === undefined ? amount : powerFactor * power,
        })),
        effects.map(({kind, magnitude}) => ({...layers[kind], capacity: magnitude})),
    );
    const {kind, methodId, guardKinds, maxDamage} = crossing;
    const methods = [{
        id: methodId, goal: kind,
        recipe: {roles: guardKinds.map(kind => ({id: kind, kind, optional: true})), beats: [{roles: guardKinds}]},
        apply: (target, effects) => {
            const result = resolve(target.power, effects);
            return guardDamage(result) <= target.maxDamage ? result : null;
        },
    }];
    const request = ({power, ...input}) => ({...input, goal: {kind, power, maxDamage}, methods});

    return {
        demonstrate({power, stages, reserves, day}) {
            if (!stages.length) return {outcome: 'complete', targetOutcome: resolve(power, [])};
            const result = resolveGuActivation({stages, reserves, day});
            return {...result, targetOutcome: result.outcome === 'complete' ? resolve(power, result.effects) : null};
        },
        search: input => searchGuGoal(request(input)),
        cross: (input, plan) => runGuGoal({...request(input), plan}),
    };
}
