import {resolveGuActivation} from './gu_activation.js';

// The host owns the clock and publishes reserves and the returned session
// together. The session pins the technique, while each payment reads live Gu.
export function beginSustainedGu({stages, reserves, day, now, interval, effect, active = []}) {
    if (!Number.isSafeInteger(now) || now < 0 || !Number.isSafeInteger(interval) || interval < 1 ||
        !Number.isSafeInteger(now + interval)) throw Error('Invalid maintenance clock.');
    const occupied = new Set(active.flatMap(session => session.bindings.map(binding => binding.id)));
    if (stages.some(({gu}) => occupied.has(gu.id))) throw Error('A bound Gu is already sustaining a move.');
    if (stages.some(({gu, operator}) => gu.holder !== operator)) throw Error('The sustaining operator must hold each Gu.');
    const result = resolveGuActivation({stages, reserves, day});
    if (result.outcome !== 'complete') return {...result, session: null};
    const bindings = stages.map(({gu, operator, ability, supply}) =>
        ({id: gu.id, kind: gu.kind, operator, ability, ...(supply && {supply})}));
    return {session: structuredClone({bindings, interval, due: now + interval, effect}), remaining: result.remaining};
}

export function renewSustainedGu({session, gu, reserves, day, now}) {
    if (now !== session.due || !Number.isSafeInteger(now + session.interval)) {
        throw Error('Settle maintenance at its due time.');
    }
    const stages = [];
    for (const binding of session.bindings) {
        const specimen = gu.find(row => row.id === binding.id);
        if (!specimen || specimen.alive === false || specimen.kind !== binding.kind || specimen.holder !== binding.operator) {
            return {session: null, remaining: reserves, reason: 'Gu unavailable', id: binding.id};
        }
        stages.push({gu: specimen, operator: binding.operator, ability: binding.ability, supply: binding.supply});
    }
    // Renewal is a single simultaneous payment using the pinned startup
    // order for its cost modifiers. A failed renewal drops the entire effect.
    const result = resolveGuActivation({stages, reserves, day});
    if (result.outcome !== 'complete') {
        return {session: null, remaining: reserves, reason: result.reason, id: result.id};
    }
    return {session: {...session, due: now + session.interval}, remaining: result.remaining};
}
