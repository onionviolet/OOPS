import {runGuGoal, searchGuGoal} from './gu_goal_search.js';
import {keeperMoonbladeStages} from './gu_keeper_move_trial.js';
import {keeperBeamRecipe, keeperBeamStages} from './gu_keeper_procedure.js';
import {applyEnergyEffect} from './energy_resources.js';
import {seversTether} from './rolling_impact.js';

const prefix = 'book.ri.keeper';
export const keeperGoal = `${prefix}.screen_research`;
export const keeperGoalWorld = `${prefix}.world`;
export const keeperGoalBay = `${keeperGoal}.store`;
const fact = `${keeperGoal}.notes`;
const aperture = `${prefix}.primeval`;
const goal = {kind: 'open-screen', cordForce: 1, counterweightLoad: 2, runnerForce: 3};
const methods = [
    {id: 'cut-cord', label: 'Cut the cord with Moonblade', goal: goal.kind, effect: 'damage',
        apply: (target, effects) => seversTether(effects, target.cordForce) ? 'cut-cord' : null},
    {id: 'lower-counterweight', label: 'Lower the counterweight with a synchronized catch', goal: goal.kind,
        recipe: keeperBeamRecipe, interruption: true,
        apply: (target, effects) => effects.some(row => row.kind === 'lower-beam' && row.load >= target.counterweightLoad) ? 'lower-counterweight' : null},
    {id: 'lift-runner', label: 'Lift the iron runner', goal: goal.kind,
        recipe: {roles: [{id: 'lifting-strength', fn: 'lift'}], beats: [{roles: ['lifting-strength']}]},
        apply: (target, effects) => effects.some(row => row.kind === 'lift' && row.magnitude >= target.runnerForce) ? 'lift-runner' : null},
];
const hasPin = record => record?.extensions?.some(pin => pin.id === keeperGoal);
const done = (state, operation) => state.actors.player.completed[`${keeperGoal}.${operation}`] ?? 0;
export const keeperGoalAttempts = methods.map((_, index) => `try_${index + 1}`);
const operations = ['research', ...keeperGoalAttempts];

export function isKeeperGoalEffect(effect) {
    return effect.type === 'guGoal' && effect.actor === 'player' && operations.includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

function pool(state) {
    return [...new Map([...keeperMoonbladeStages(state), ...keeperBeamStages(state)].map(row => [row.gu.id, row])).values()];
}

function readNotes(state) {
    const raw = state.worlds[keeperGoalWorld]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid screen research notes.');
    const {plans, blocked, last, openedBy} = JSON.parse(raw);
    const ids = new Set(pool(state).map(row => row.gu.id));
    const known = id => methods.some(method => method.id === id);
    if (!Array.isArray(plans) || plans.length > methods.length || new Set(plans.map(plan => plan.method)).size !== plans.length ||
        plans.some(({method, binding, cost}) => !known(method) ||
            !Number.isSafeInteger(cost) || cost < 1 || cost > 12 || !binding ||
            (method === 'cut-cord' ? !Array.isArray(binding) || binding.length < 1 || binding.length > 3 :
                Array.isArray(binding) || Object.keys(binding).sort().join() !==
                    methods.find(row => row.id === method).recipe.roles.map(role => role.id).sort().join()) ||
            new Set(Object.values(binding).map(row => row?.id)).size !== Object.values(binding).length ||
            Object.values(binding).some(row => row?.operator !== 'player' || !ids.has(row.id))) ||
        !Array.isArray(blocked) || blocked.length > methods.length ||
        blocked.some(row => !known(row.method) || !['missing-role', 'insufficient-effect', 'no-funded-binding', 'budget'].includes(row.reason)) ||
        openedBy !== null && !plans.some(plan => plan.method === openedBy) ||
        last !== null && (!last || !Number.isSafeInteger(last.slot) || last.slot < 1 || last.slot > plans.length ||
            !Number.isSafeInteger(last.spent) || last.spent < 0 || last.spent > 12)) {
        throw Error('The screen research and saved bindings disagree.');
    }
    return {plans, blocked, last, openedBy};
}

export function validateKeeperGoal(state, record) {
    const notes = readNotes(state);
    if (!!notes !== (done(state, 'research') > 0) || notes && !hasPin(record) ||
        notes?.last && !done(state, `try_${notes.last.slot}`) ||
        notes?.openedBy && !notes.last || done(state, 'salvage') > Number(!!notes?.openedBy) ||
        state.simulation.people.player.location === keeperGoalBay && !notes?.openedBy) {
        throw Error('The screen needs its research and opening receipts.');
    }
}

export function keeperGoalFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperGoalWorld) return {};
    const notes = readNotes(state);
    return Object.fromEntries(Object.entries({research: !notes?.openedBy,
        ...Object.fromEntries(keeperGoalAttempts.map((operation, index) => [operation, !!notes?.plans[index] && !notes.openedBy])),
        enter: !!notes?.openedBy, salvage: !!notes?.openedBy && !done(state, 'salvage')})
        .map(([key, allowed]) => [`${keeperGoal}.can_${key}`, allowed]));
}

export function keeperGoalView(state, record) {
    const notes = hasPin(record) && readNotes(state);
    return notes && {...notes, plans: notes.plans.map(({method, cost}) => ({
        cost, label: methods.find(row => row.id === method).label, synchronized: method === 'lower-counterweight',
    })), blocked: notes.blocked.map(row => ({...row, label: methods.find(method => method.id === row.method).label}))};
}

export function applyKeeperGoalEffect(state, effect, context, registry) {
    const {operation} = effect;
    if (!isKeeperGoalEffect(effect) || !hasPin(context.structuredNative) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperGoalWorld ||
        state.simulation.people.player.location !== `${prefix}.annex`) throw Error('Research the screen from the Gu house.');
    const notes = readNotes(state);
    if (notes?.openedBy) throw Error('The screen is already open.');
    const reserve = state.simulation.energies.player[aperture].reserve;
    const available = pool(state);
    const request = {goal, methods, available, reserves: {player: {primeval: reserve}}, day: state.clock};
    const facts = state.worlds[keeperGoalWorld].facts;
    if (operation === 'research') {
        const {options, blocked} = searchGuGoal({...request, available: available.filter(row => row.gu.alive)});
        const best = new Map();
        for (const row of options) {
            const cost = reserve - row.remaining.player.primeval;
            if (!best.has(row.method) || cost < best.get(row.method).cost) {
                best.set(row.method, {method: row.method, binding: row.binding, cost});
            }
        }
        facts[fact] = JSON.stringify({plans: [...best.values()], blocked, last: null, openedBy: null});
        return;
    }
    const slot = keeperGoalAttempts.indexOf(operation) + 1;
    const plan = notes?.plans[slot - 1];
    if (!plan) throw Error('Write down a method for the screen first.');
    const result = runGuGoal({...request, plan});
    const spent = reserve - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId: aperture, operation: 'use', output: 1, control: 1}, registry);
    }
    facts[fact] = JSON.stringify({...notes, last: {slot, spent}, openedBy: result.targetOutcome});
}
