// Original Village shell animal. Care, work and combat consume the same
// projected condition. Local laws determine humidity response and capacity.
import {check, natural} from './basics.js';
import {acquireCreature, creatureHealth, injureCreature, restoreCreatureLifecycle,
    settleCohortStock, settleCreatureCare, startCreatureCare} from './creature_lifecycle.js';
import {measureCreatureCapability} from './creature_methods.js';
import {advanceLivingRegulator, openLivingRegulator, validateLivingRegulator} from './living_regulator.js';

const chamber = {id: 'village.shell_chamber', capacity: 1, supportedSpecies: ['reed-terrapin']};
export const SHELL_LAW = Object.freeze({delay: 2, draft: 9, recharge: 7, closeBelow: 47, openAbove: 60, careMinutes: 12});
const guard = {id: 'combat.shell-guard', unit: 'armor', combine: 'sum'};

export function enrollMeadowShell(clock) {
    const stock = settleCohortStock(restoreCreatureLifecycle(), {revision: 0, id: 'reed-terrapin',
        species: 'reed-terrapin', habitat: chamber, delta: 1});
    const found = acquireCreature(stock, {revision: stock.revision, cohortId: 'reed-terrapin',
        destination: chamber, keeper: 'player', clock});
    return {id: found.id, lifecycle: injureCreature(found.state, {revision: found.state.revision,
        id: found.id, clock, kind: 'sore-leg', recoveryMinutes: 4}),
    regulator: openLivingRegulator(clock, 58), shell: 'open', mode: 'open', fedUntil: clock, work: 0};
}

export function validateMeadowShell(state, clock) {
    const lifecycle = restoreCreatureLifecycle(state.lifecycle);
    const animal = lifecycle.individuals[state.id];
    validateLivingRegulator(state.regulator);
    check(animal?.habitat === chamber.id && animal.species === 'reed-terrapin' && animal.keeper === 'player' &&
        Object.keys(lifecycle.individuals).length === 1 && state.regulator.clock <= clock &&
        animal.health.lastAt <= state.regulator.clock && natural(state.fedUntil) &&
        state.fedUntil <= state.regulator.clock + SHELL_LAW.careMinutes &&
        ['open','closed'].includes(state.shell) && ['open','closed','linked'].includes(state.mode) &&
        natural(state.work) && state.work <= 4 && (state.fitting === undefined || state.fitting === cloth) &&
        (state.mode !== 'linked' ? state.regulator.pending === null : state.fitting === cloth),
        'Invalid meadow shell animal.');
    return state;
}

export function meadowShellCondition(state) {
    const injury = creatureHealth(state.lifecycle, state.id, state.regulator.clock).injury;
    const fed = state.regulator.clock < state.fedUntil;
    const damp = state.regulator.humidity >= SHELL_LAW.closeBelow;
    const canWork = fed && damp && state.shell === 'open' && !injury?.remaining;
    const armor = measureCreatureCapability(guard, [
        {source: 'body.shell', unit: guard.unit, value: state.shell === 'closed' ? 6 : 1},
    ]);
    return {injury, fed, damp, canWork, armor};
}

export function projectMeadowShell(state, clock) {
    if (!state) return null;
    let next = {...state};
    const {delay, draft, recharge, closeBelow, openAbove} = SHELL_LAW;
    const step = advanceLivingRegulator(state.regulator, clock, {delay, draft, recharge, mode: state.mode},
        ({minute, humidity}) => {
            if (humidity < closeBelow) next.shell = 'closed';
            if (humidity >= openAbove) next.shell = 'open';
            const health = creatureHealth(next.lifecycle, next.id, minute - 1);
            const supported = minute <= next.fedUntil && humidity >= closeBelow;
            if (supported && health.injury?.remaining > 0) {
                const started = startCreatureCare(next.lifecycle, {revision: next.lifecycle.revision, id: next.id,
                    clock: minute - 1, keeper: 'player', duration: 1});
                next.lifecycle = settleCreatureCare(started, {revision: started.revision, id: next.id, clock: minute});
            }
            if (supported && !health.injury?.remaining && next.shell === 'open') {
                next.work = Math.min(4, next.work + 1);
            }
            return next.shell;
        });
    next.regulator = step.state;
    return {state: next, pending: step.pending, condition: meadowShellCondition(next)};
}

export const SHELL_ACTIONS = Object.freeze([
    'rescue_shell', 'feed_shell', 'fit_inlet', 'open_inlet', 'close_inlet', 'link_inlet', 'collect_driftwood', 'check_shell',
]);

const hay = JSON.stringify({id: 'Meadow hay'});
const cloth = JSON.stringify({id: 'Wool cloth'});
const driftwood = JSON.stringify({id: 'Rough wood log'});

export function planMeadowShell(state, action, {clock, inventory}) {
    if (action === 'rescue_shell') {
        check(!state, 'The chamber already has its terrapin.');
        return {state: enrollMeadowShell(clock), cost: 5, items: []};
    }
    const view = projectMeadowShell(state, clock);
    check(view, 'Take in the injured terrapin first.');
    const next = view.state;
    if (action === 'check_shell') return {state: next, cost: 0, items: []};
    check(!view.pending, 'Check the chamber again to catch up.');
    let items = [];
    switch (action) {
    case 'feed_shell':
        check(!view.condition.fed, 'The terrapin still has food.');
        check((inventory[hay] ?? 0) >= 1, 'Bring one Meadow hay for the terrapin.');
        next.fedUntil = clock + SHELL_LAW.careMinutes;
        items = [{key: hay, amount: -1}];
        break;
    case 'fit_inlet':
        check(next.fitting === undefined, 'The inlet is already fitted.');
        check((inventory[cloth] ?? 0) >= 1, 'Bring one Wool cloth to fit the inlet.');
        next.fitting = cloth;
        next.mode = 'linked';
        next.regulator.pending = null;
        items = [{key: cloth, amount: -1}];
        break;
    case 'open_inlet':
    case 'close_inlet':
    case 'link_inlet':
        check(action !== 'link_inlet' || next.fitting === cloth, 'Fit the inlet before linking it.');
        next.mode = {open_inlet: 'open', close_inlet: 'closed', link_inlet: 'linked'}[action];
        next.regulator.pending = null;
        if (next.mode !== 'linked') next.regulator.inlet = next.mode;
        break;
    case 'collect_driftwood':
        check(next.work === 4, 'The terrapin has not gathered a bundle yet.');
        next.work = 0;
        items = [{key: driftwood, amount: 1}];
        break;
    default:
        throw Error('Unknown chamber action.');
    }
    return {state: next, cost: 0, items};
}
