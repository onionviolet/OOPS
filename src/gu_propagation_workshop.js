import {disturbGuPlot, observeGuFruit, plantGuFruit, produceGuFruit, refineGuFruit, sortGuFruit, transferGuFruitBatch,
    thunderPotatoPropagation as rule} from './gu_propagation.js';

export function runGuPropagation({seed = 1, depth = 'deep', fertile = true, operatorEssence = 4} = {}) {
    const owner = 'fang-yuan', operator = 'bai-ning-bing';
    const producer = {id: 'mother-gu', kind: rule.producer, rank: 3, holder: operator, alive: true, fedThrough: 0};
    const supply = {pool: 'primeval', family: 'primeval', rank: 3, source: 'aperture'};
    const production = produceGuFruit({nextBatch: 1, fruits: []}, {rule, producer, operator, supply,
        reserves: {[owner]: {primeval: 1}, [operator]: {primeval: operatorEssence}}, clock: 0, seed});
    const trace = [{action: 'produce', outcome: production.result.outcome, reserves: production.reserves,
        fruits: observeGuFruit(production.state)}];
    let {state, reserves} = production;
    if (!state.fruits.length) return {trace, reserves};
    state = transferGuFruitBatch(state, 1, operator, owner);
    state = sortGuFruit(state, 1, owner);
    const viable = state.fruits.filter(fruit => fruit.phase === 'viable');
    trace.push({action: 'sort', viable: viable.map(fruit => fruit.id)});
    if (!viable.length) return {trace, reserves, fruits: observeGuFruit(state)};
    const [{id}] = viable;
    state = refineGuFruit(state, id, owner);
    const plot = {id: 'test-pit', fertile};
    try {
        ({state, reserves} = plantGuFruit(state, {rule, id, operator: owner, plot, depth, reserves, clock: 0}));
    } catch (error) {
        trace.push({action: 'plant', outcome: 'stopped', reason: error.message});
        return {trace, reserves, fruits: observeGuFruit(state)};
    }
    trace.push({action: 'plant', id, plot: plot.id, depth});
    state = JSON.parse(JSON.stringify(state));
    for (const [clock, vibration] of [[9, 2], [10, 1], [10, 2], [11, 2]]) {
        const result = disturbGuPlot(state, {plot: plot.id, clock, vibration});
        trace.push({action: 'disturb', clock, vibration, spent: result.spent});
        state = result.state;
    }
    return {trace, reserves, fruits: observeGuFruit(state),
        basis: 'Chapter 213 establishes the loan, batch sorting, rank-two fruit, soil development and vibration. The trial prices, quality distribution and vibration thresholds are authored.'};
}
