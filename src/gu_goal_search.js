import {resolveGuActivation} from './gu_activation.js';
import {searchGuMoves} from './gu_move_search.js';
import {runGuProcedure, searchGuProcedures} from './gu_procedures.js';
import {guMoveRoleMatches} from './gu_move_roles.js';

function outcomeFor(method, goal, result) {
    return result.outcome === 'complete' ? method.apply(goal, result.effects) : null;
}

// A goal's methods share a work budget. Each method interprets the effects
// of its own resolver against the actual target, preserving distinct routes.
export function searchGuGoal({goal, methods, available, reserves, stock, day, budget = 200}) {
    if (!Number.isSafeInteger(budget) || budget < 1) throw Error('Choose a positive Gu research budget.');
    const relevant = methods.filter(method => method.goal === goal.kind);
    const options = [], blocked = [];
    let visited = 0;
    let truncated = false;
    for (const [index, method] of relevant.entries()) {
        const work = Math.floor((budget - visited) / (relevant.length - index));
        const missing = method.recipe?.roles.find(role => !role.optional &&
            !available.some(stage => guMoveRoleMatches(role, stage)));
        if (missing || work < 1) {
            blocked.push({method: method.id, reason: missing ? 'missing-role' : 'budget', ...(missing && {role: missing.id})});
            if (!missing) truncated = true;
            continue;
        }
        const request = {available, reserves, stock, day};
        const search = method.recipe
            ? searchGuProcedures({...request, recipe: method.recipe, searchLimit: work})
            : searchGuMoves({...request, effect: method.effect, trialLimit: work, pareto: false});
        visited += search.visited ?? search.evaluated;
        truncated ||= search.truncated;
        const before = options.length;
        for (const row of search.options) {
            const result = row.result ?? {...row, outcome: 'complete'};
            const outcome = outcomeFor(method, goal, result);
            if (outcome) options.push({method: method.id, binding: row.binding ?? row.activations.map(({id, operator}) => ({id, operator})),
                outcome, remaining: result.remaining, activations: result.activations,
                minutes: method.minutes ?? 0, interruption: method.interruption ?? false});
        }
        if (options.length === before) blocked.push({method: method.id, reason: search.truncated ? 'budget' :
            search.options.length ? 'insufficient-effect' : 'no-funded-binding'});
    }
    return {options, blocked, visited, truncated};
}

export function runGuGoal({plan, goal, methods, available, reserves, stock, day}) {
    const method = methods.find(row => row.id === plan.method && row.goal === goal.kind);
    if (!method) throw Error('The written Gu method does not address this target.');
    let result;
    if (method.recipe) {
        result = runGuProcedure({recipe: method.recipe, binding: plan.binding, available, reserves, stock, day});
    } else {
        const stages = plan.binding.map(({id, operator}) => available.find(row => row.gu.id === id && row.operator === operator) ??
            {gu: {id, kind: 'unavailable', alive: false, fedThrough: day}, operator, ability: {fuel: 'unavailable', cost: 1}});
        result = resolveGuActivation({stages, reserves, day});
    }
    return {...result, targetOutcome: outcomeFor(method, goal, result)};
}
