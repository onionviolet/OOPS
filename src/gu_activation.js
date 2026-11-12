import {quoteGuFuel} from './gu_fuel.js';

// Pure ordered settlement. The host supplies actual Gu, operators and reserves,
// then publishes the returned debits and effects through its own state owners.
export function resolveGuActivation({stages, beats, reserves, day, completionEffect, controlFailedAt, controlDraw, stopBefore}) {
    if (stages && beats) throw Error('Choose stages or synchronized beats for an activation.');
    const sequence = beats ?? (stages ?? []).map(stage => ({stages: [stage]}));
    if (!sequence.length || sequence.some(beat => !beat.stages.length)) throw Error('Choose at least one Gu to activate.');
    if (controlFailedAt !== undefined && (!Number.isSafeInteger(controlFailedAt) || controlFailedAt < 0 ||
        controlFailedAt >= sequence.length)) throw Error('Choose an existing activation beat for the control failure.');
    if (stopBefore !== undefined && (!Number.isSafeInteger(stopBefore) || stopBefore < 0 || stopBefore >= sequence.length)) {
        throw Error('Choose an existing activation beat before stopping.');
    }
    const used = new Set();
    for (const beat of sequence) validateBeat(beat);
    for (const {gu, operator, ability} of sequence.flatMap(beat => beat.stages)) {
        if (used.has(gu.id)) throw Error('Choose a different held Gu for every activation.');
        if (!Object.hasOwn(reserves, operator) || !ability) throw Error('Every activation needs an operator and an ability.');
        if (typeof ability.fuel !== 'string' || !Number.isFinite(ability.cost) || ability.cost <= 0) {
            throw Error('A paid activation needs a fuel and a positive cost.');
        }
        used.add(gu.id);
    }

    let remaining = structuredClone(reserves);
    const activations = [];
    const modifiers = [];
    const effects = [];
    for (const [index, beat] of sequence.entries()) {
        if (index === stopBefore) {
            return {outcome: 'interrupted', reason: 'stopped before activation', activations, remaining, effects: []};
        }
        const tentative = beat.stages.length === 1 ? remaining : structuredClone(remaining);
        const pending = [];
        for (const stage of beat.stages) {
            const quote = quoteStage(stage, tentative, modifiers, day);
            if (quote.reason) {
                return {outcome: 'interrupted', id: stage.gu.id, reason: quote.reason, activations, remaining, effects: [],
                    ...(quote.funding && {attemptedFunding: {...quote.funding, cost: quote.charge}})};
            }
            pending.push(quote);
        }
        remaining = tentative;
        for (const {activation, producedModifiers, effect} of pending) {
            activations.push(activation);
            modifiers.push(...producedModifiers);
            if (effect) effects.push(effect);
        }
        const lostControl = controlDraw && pending.find(({activation}) => {
            const risk = activation.funding?.controlRisk;
            return risk > 0 && controlDraw(activation) < risk;
        });
        if (index === controlFailedAt || lostControl) {
            return {outcome: 'interrupted', beat: index, ...(lostControl && {id: lostControl.activation.id}),
                reason: 'lost control', activations, remaining, effects: [],
                backlash: structuredClone(beat.backlash ?? (lostControl
                    ? [{kind: 'injure-gu', target: lostControl.activation.id}] : []))};
        }
    }
    if (completionEffect) effects.push(structuredClone(completionEffect));
    return {outcome: 'complete', activations, remaining, effects};
}

function validateBeat({stages, requires = {}}) {
    const {operators, specimens, minRank, maxRank} = requires;
    if (operators !== undefined && new Set(stages.map(stage => stage.operator)).size !== operators) {
        throw Error(`This activation needs ${operators} cooperating operators.`);
    }
    if (specimens !== undefined && stages.length !== specimens) {
        throw Error(`This activation needs ${specimens} Gu together.`);
    }
    if ((minRank !== undefined || maxRank !== undefined) && stages.some(({gu}) =>
        !Number.isSafeInteger(gu.rank) || gu.rank < (minRank ?? 1) || gu.rank > (maxRank ?? Infinity))) {
        throw Error('The bound Gu must meet the activation ranks.');
    }
}

function quoteStage({gu, operator, ability, supply}, reserves, modifiers, day) {
    const {cost, effect} = ability;
    const {pool: fuel, factor, magnitudeFactor = 1, funding} = quoteGuFuel(ability, gu, supply);
    const pool = reserves[operator];
    const applicable = modifiers.filter(row => guModifierApplies(row, gu, ability));
    const costModifier = strongestModifier(applicable, 'cost', (a, b) => a < b);
    const magnitudeModifier = effect && strongestModifier(applicable, 'magnitude', (a, b) => a > b);
    const rangeModifier = effect?.range !== undefined && strongestModifier(applicable, 'range', (a, b) => a > b);
    const countModifier = effect?.count !== undefined && strongestModifier(applicable, 'count', (a, b) => a > b);
    const charge = cost * factor * (costModifier?.factor ?? 1);
    const reserve = Object.hasOwn(pool, fuel) ? pool[fuel] : 0;
    const reason = gu.alive === false ? 'Gu unavailable'
        : gu.injured ? 'needs recovery'
        : gu.fedThrough < day ? 'needs feeding'
        : reserve < charge ? 'needs more essence' : null;
    if (reason) return {reason, funding, charge};

    pool[fuel] -= charge;
    const activation = {id: gu.id, kind: gu.kind, cost: charge, operator, fuel,
        adjustments: [costModifier, magnitudeModifier, rangeModifier, countModifier].filter(Boolean), ...(funding && {funding})};
    return {
        activation,
        producedModifiers: abilityModifiers(ability).map(row => ({...row, sourceId: gu.id})),
        effect: effect && {kind: effect.kind,
            magnitude: (effect.magnitude + (gu.traits?.[effect.trait] ?? 0)) * magnitudeFactor * (magnitudeModifier?.factor ?? 1),
            ...(effect.range !== undefined && {range: effect.range * (rangeModifier?.factor ?? 1)}),
            ...(effect.count !== undefined && {count: effect.count * (countModifier?.factor ?? 1)})},
    };
}

export function abilityModifiers(ability) {
    return ability.modifiers ?? (ability.modifier ? [ability.modifier] : []);
}

export function guModifierApplies(modifier, gu, ability) {
    return (!modifier.path || modifier.path === ability.path) && (!modifier.kind || modifier.kind === gu.kind);
}

function strongestModifier(modifiers, property, isStronger) {
    return modifiers.reduce((best, modifier) =>
        modifier.property === property && isStronger(modifier.factor, best?.factor ?? 1) ? modifier : best, null);
}
