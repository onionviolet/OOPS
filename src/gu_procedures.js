import {resolveGuActivation} from './gu_activation.js';
import {guMoveRoleMatches, iterateGuMoveBindings} from './gu_move_roles.js';

const requirementsMet = (recipe, stock) => Object.entries(recipe.stock ?? {})
    .every(([key, amount]) => Number.isSafeInteger(stock?.[key]) && stock[key] >= amount);

// Saved bindings identify bodies and operators. Every attempt reads its
// current sources. A missing role interrupts at its declared beat.
export function runGuProcedure({recipe, binding, available, stock, reserves, day, stopBefore, controlFailedAt}) {
    if (!requirementsMet(recipe, stock)) {
        return {outcome: 'interrupted', reason: 'missing support stock', activations: [], remaining: reserves, effects: []};
    }
    const roles = new Map(recipe.roles.map(role => [role.id, role]));
    const used = new Set();
    const beats = recipe.beats.map(beat => ({...beat, backlash: beat.backlash?.map(({role, ...effect}) => {
        const pick = binding[role];
        if (!pick) throw Error('Gu backlash needs a bound role.');
        return {...effect, target: effect.kind === 'injure-operator' ? pick.operator : pick.id};
    }), stages: beat.roles.flatMap(id => {
        const role = roles.get(id);
        const pick = binding[id];
        if (!role || (!pick && !role.optional) || (pick && (used.has(pick.id) || !Object.hasOwn(reserves, pick.operator)))) {
            throw Error('Invalid saved Gu procedure binding.');
        }
        if (!pick) return [];
        used.add(pick.id);
        const stage = available.find(row => row.gu.id === pick.id && row.operator === pick.operator);
        if (stage && guMoveRoleMatches(role, stage)) return [stage];
        return [{gu: {id: pick.id, kind: 'unavailable', alive: false, fedThrough: day},
            operator: pick.operator, ability: {fuel: 'unavailable', cost: 1}}];
    })})).filter(beat => beat.stages.length);
    const result = resolveGuActivation({beats, reserves, day, stopBefore, controlFailedAt});
    return result.outcome === 'complete' && recipe.completion
        ? {...result, effects: [...result.effects, recipe.completion(result.effects)]} : result;
}

export function searchGuProcedures({recipe, available, stock, reserves, day, searchLimit = 200}) {
    if (!Number.isSafeInteger(searchLimit) || searchLimit < 1) throw Error('Choose a positive Gu procedure search budget.');
    const budget = {limit: searchLimit, visited: 0, truncated: false};
    const options = [];
    if (requirementsMet(recipe, stock)) {
        for (const {roles} of iterateGuMoveBindings(recipe, available, budget)) {
            if (!Object.values(roles).some(Boolean)) continue;
            const binding = Object.fromEntries(Object.entries(roles).map(([id, stage]) => [id,
                stage && {id: stage.gu.id, operator: stage.operator}]));
            const result = runGuProcedure({recipe, binding, available, stock, reserves, day});
            if (result.outcome === 'complete') options.push({binding, result});
        }
    }
    return {options, visited: budget.visited, truncated: budget.truncated};
}

// The host owns custody and consuming the held effect. Only the support
// beat draws from today's reserve, even when it cannot complete the move.
export function runGuProcedureFollowup({held, recipe, ...request}) {
    if (request.day < held.at || request.day >= held.expiresAt) {
        return {outcome: 'interrupted', reason: 'held effect expired', activations: [], remaining: request.reserves, effects: []};
    }
    return runGuProcedure({...request, recipe: {...recipe,
        completion: effects => recipe.completion([held.effect, ...effects])}});
}

// The chapter establishes the identities, count and total times. The
// individual core charges and the modeled activation order are calibration dials.
export const strengthReversingProcedure = Object.freeze({
    id: 'strength-reversing-life-and-death',
    roles: ['eat-strength', 'pulling-mountain', 'pulling-water'].map(kind =>
        ({id: kind, kind, minRank: 6, operator: 'player'})),
    beats: [{roles: ['eat-strength']}, {roles: ['pulling-mountain', 'pulling-water']}],
    stock: {'supplementary-mortal-gu': 330_000},
    preparationMinutes: 120,
    developmentMinutes: 3 * 1440,
    completion: () => ({kind: 'body-transition-ready'}),
});

export function beginStrengthReversal({form, preparedAt, now, ...request}) {
    const recipe = strengthReversingProcedure;
    if (!['living', 'immortal-zombie'].includes(form) || !Number.isSafeInteger(preparedAt) || preparedAt < 0 ||
        !Number.isSafeInteger(now + recipe.developmentMinutes) || now - preparedAt < recipe.preparationMinutes) {
        throw Error('Strength Reversing Life and Death needs two hours of focused preparation.');
    }
    const result = runGuProcedure({...request, recipe, day: now});
    return {result, transition: result.outcome === 'complete' ? {
        from: form, to: form === 'living' ? 'immortal-zombie' : 'living', dueAt: now + recipe.developmentMinutes,
    } : null};
}

export function finishStrengthReversal(transition, {now, restedSinceActivation = false}) {
    if (!transition || restedSinceActivation || !Number.isSafeInteger(now) || now < transition.dueAt) return null;
    return {kind: 'body-transition', from: transition.from, to: transition.to};
}
