import {resolveGuActivation} from './gu_activation.js';

const sourceKind = stage => stage.emits ?? stage.ability.effect.kind;

function connect(signal, {chain: {accepts, produces, factor = 1, contacts}}) {
    if (signal.kind !== accepts) return null;
    return {kind: produces, magnitude: signal.magnitude * factor, contacts: contacts ?? signal.contacts};
}

export function runGuEffectChain({plan, available, reserves, day, target}) {
    const stages = plan.map(({id, operator}) => available.find(stage => stage.gu.id === id && stage.operator === operator));
    const [core, ...supports] = stages;
    if (!core?.ability.effect || core.chain || supports.some(stage => !stage?.chain)) {
        throw Error('The Gu chain needs a source and known connections.');
    }
    let shape = {kind: sourceKind(core), magnitude: 0, contacts: 1};
    for (const stage of supports) {
        shape = connect(shape, stage);
        if (!shape) throw Error('The next Gu cannot carry this effect.');
    }
    const result = resolveGuActivation({stages, reserves, day});
    if (result.outcome !== 'complete') return {...result, signal: null, reached: false};
    const [effect] = result.effects;
    const signal = supports.reduce(connect, {...effect, kind: sourceKind(core), contacts: effect.count ?? 1});
    return {...result, signal, reached: target.accepts.includes(signal.kind) &&
        signal.magnitude >= target.minForce && signal.contacts >= target.contacts};
}

// Each expansion costs one unit of the search budget, including funded misses.
// Connection types prune the search before it builds specimen permutations.
export function searchGuEffectChains({available, reserves, day, target, budget = 200, maxConnections = 3}) {
    if (!Number.isSafeInteger(budget) || budget < 1 || !Number.isSafeInteger(maxConnections) || maxConnections < 0) {
        throw Error('Gu chain search needs valid bounds.');
    }
    const links = new Map();
    for (const stage of available) {
        if (!stage.chain) continue;
        const type = stage.chain.accepts;
        if (!links.has(type)) links.set(type, []);
        links.get(type).push(stage);
    }
    const options = [];
    let visited = 0;
    let truncated = false;
    function explore(stages, kind) {
        if (visited >= budget) {
            truncated = true;
            return;
        }
        visited++;
        const plan = stages.map(({gu, operator}) => ({id: gu.id, operator}));
        const result = runGuEffectChain({plan, available, reserves, day, target});
        if (result.reached) options.push({plan, result});
        if (result.outcome !== 'complete' || stages.length > maxConnections) return;
        for (const stage of links.get(kind) ?? []) {
            if (stages.some(row => row.gu.id === stage.gu.id)) continue;
            explore([...stages, stage], stage.chain.produces);
            if (truncated) break;
        }
    }
    for (const stage of available) {
        if (!stage.chain && stage.ability.effect) explore([stage], sourceKind(stage));
        if (truncated) break;
    }
    return {options, visited, truncated};
}
