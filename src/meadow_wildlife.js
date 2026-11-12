// Original Village comparison for AD38, AD51 and WPR5. Local time and
// inventory settlement come from the same host as the meadow pen.
import {check} from './basics.js';
import {advanceWildHabitat, openWildHabitat, restoreCreatureLifecycle, settleCohortStock} from './creature_lifecycle.js';

export const RABBIT_MEAT_KEY = JSON.stringify({id: 'Rabbit meat'});
export const MEADOW_BAIT_KEY = JSON.stringify({id: 'Stale bread'});
const copse = {id: 'village.meadow_copse', capacity: 10, supportedSpecies: ['rabbit', 'fox'],
    preyRequirements: {fox: {species: 'rabbit', perPredator: 3}}};
const populations = [{id: 'rabbit', births: 1, losses: 1}, {id: 'fox', births: 1, losses: 1}];
const interval = 12;

function changeStock(state, species, delta) {
    return settleCohortStock(state, {revision: state.revision, id: species, species, habitat: copse, delta});
}

export function discoverMeadowWildlife(clock) {
    const prey = changeStock(restoreCreatureLifecycle(), 'rabbit', 3);
    const stock = changeStock(prey, 'fox', 1);
    return openWildHabitat(stock, {revision: stock.revision, id: copse.id, clock, interval});
}

export function validateMeadowWildlife(saved, clock) {
    const state = restoreCreatureLifecycle(saved);
    const ledger = state.habitats[copse.id];
    check(ledger?.interval === interval && ledger.nextAt - interval <= clock &&
        Object.keys(state.habitats).length === 1 && Object.keys(state.cohorts).length === 2 &&
        Object.keys(state.individuals).length === 0 && Object.keys(state.broods).length === 0 &&
        populations.every(({id}) => state.cohorts[id]?.species === id &&
            state.cohorts[id].habitat === copse.id) &&
        state.cohorts.rabbit.stock + state.cohorts.fox.stock <= copse.capacity, 'Invalid meadow wildlife.');
    return state;
}

export function meadowWildlife(state, clock) {
    if (!state) return null;
    const projected = advanceWildHabitat(state, {revision: state.revision, habitat: copse, clock, populations});
    return {state: projected.state, pending: projected.pending,
        rabbits: projected.state.cohorts.rabbit.stock, foxes: projected.state.cohorts.fox.stock,
        nextAt: projected.state.habitats[copse.id].nextAt};
}

export function huntMeadowRabbit(view, inventory) {
    check(view && !view.pending, 'Check the copse again before hunting.');
    check(view.rabbits > 0, 'There are no rabbits left in the copse.');
    check((inventory[MEADOW_BAIT_KEY] ?? 0) > 0, 'Bring one Stale bread for bait.');
    return {state: changeStock(view.state, 'rabbit', -1), items: [
        {key: MEADOW_BAIT_KEY, amount: -1}, {key: RABBIT_MEAT_KEY, amount: 1},
    ]};
}
