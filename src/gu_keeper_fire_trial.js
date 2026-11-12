import {applyEnergyEffect} from './energy_resources.js';
import {resolveGuActivation} from './gu_activation.js';
import {guCatalogue} from './gu_catalogue.js';
import {searchGuMoves} from './gu_move_search.js';

const keeper = 'book.ri.keeper';
export const keeperFireTrial = `${keeper}.fire_trial`;
export const keeperFireSlots = 8;
const world = `${keeper}.world`;
const annex = `${keeper}.annex`;
const energyId = `${keeper}.primeval`;
const key = `${keeperFireTrial}.notes`;
const issued = `${keeperFireTrial}.issued`;
const returned = `${keeperFireTrial}.duplicate_returned`;
const core = 'red-fire';
const movement = 'fire-discharge';
const supportNames = {'fire-source': 'Fire Source Gu', duplicate: 'Duplicate Gu', enlarge: 'Enlarge Gu'};
const supportKinds = Object.keys(supportNames);
const pinned = record => record?.extensions?.some(pin => pin.id === keeperFireTrial);
const done = (state, action) => state.actors.player.completed[`${keeperFireTrial}.${action}`] ?? 0;

function stage(kind, clock, alive = true) {
    return {gu: {id: kind, kind, rank: 1, fedThrough: clock, alive}, operator: 'player',
        ability: guCatalogue[kind].ability.value};
}

function quote(clock, kinds, amount, duplicateReady = true) {
    return resolveGuActivation({stages: kinds.map(kind => stage(kind, clock, kind !== 'duplicate' || duplicateReady)),
        reserves: {player: {primeval: amount}}, day: clock});
}

function readNotes(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Red Fire trial notes.');
    const notes = JSON.parse(raw);
    const {plans, pair, bundle, last} = notes;
    if (!Array.isArray(plans) || !plans.length || plans.length > keeperFireSlots ||
        new Set(plans.map(plan => JSON.stringify(plan))).size !== plans.length ||
        plans.some(plan => !Array.isArray(plan) || plan.length > supportKinds.length ||
            !plan.every((kind, index) => supportKinds.includes(kind) &&
                (index === 0 || supportKinds.indexOf(kind) > supportKinds.indexOf(plan[index - 1])))) ||
        typeof pair !== 'boolean' || typeof bundle !== 'boolean' ||
        last !== null && (!last || !Number.isSafeInteger(last.slot) || !plans[last.slot - 1] ||
            !Number.isSafeInteger(last.spent) || last.spent < 0 ||
            (last.outcome === 'complete' ? ![1, 2].includes(last.count) || ![1, 2].includes(last.force) ||
                last.count === 2 && !pair || last.force === 2 && !bundle :
                last.outcome !== 'interrupted' || !['needs more essence', 'Gu unavailable'].includes(last.reason)))) {
        throw Error('The Red Fire results and their notes disagree.');
    }
    return notes;
}

export function validateKeeperFireTrial(state, record) {
    const notes = readNotes(state);
    const flags = state.actors.player.facts;
    const crossings = done(state, 'cross') - done(state, 'return_house');
    if (Boolean(notes) !== (done(state, 'research') > 0) ||
        Boolean(flags[issued]) !== (done(state, 'loan') === 1) ||
        done(state, 'return_duplicate') - done(state, 'borrow_duplicate') !== Number(!!flags[returned]) ||
        (notes || flags[returned] !== undefined) && !flags[issued] ||
        (notes || flags[issued]) && !pinned(record) ||
        notes?.last && !done(state, `try_${notes.last.slot}`) ||
        ![0, 1].includes(crossings) ||
        done(state, 'cross') > 0 && !(notes?.pair && notes.bundle)) {
        throw Error('The Red Fire trial needs matching loan, casting and crossing receipts.');
    }
}

export function keeperFireTrialFacts(state) {
    const notes = readNotes(state);
    const flags = state.actors.player.facts;
    return Object.fromEntries([
        [`${keeperFireTrial}.loaned`, flags[issued] === true],
        [`${keeperFireTrial}.duplicate_away`, flags[returned] === true],
        ...Array.from({length: keeperFireSlots}, (_, index) => [`${keeperFireTrial}.plan_${index + 1}`, index < (notes?.plans.length ?? 0)]),
        [`${keeperFireTrial}.route_ready`, !!(notes?.pair && notes.bundle)],
    ]);
}

export function keeperFireTrialView(state, record) {
    if (!pinned(record)) return null;
    const notes = readNotes(state);
    return {pair: notes?.pair ?? false, bundle: notes?.bundle ?? false, last: notes?.last, plans: (notes?.plans ?? []).map((group, index) => {
        const result = quote(state.clock, [...group, core], 12);
        const flame = result.effects[0];
        return {slot: index + 1, names: group.map(kind => supportNames[kind]), count: flame.count, force: flame.magnitude,
            cost: result.activations.reduce((sum, row) => sum + row.cost, 0)};
    })};
}

export function applyKeeperFireTrialEffect(state, {operation, slot}, context, registry) {
    const flags = state.actors.player.facts;
    if (context.actorId !== 'player' || !pinned(context.structuredNative) || state.actors.player.worldId !== world ||
        state.simulation.people.player.location !== annex || !flags[issued]) {
        throw Error('Bring the steward’s fire set to the Gu house.');
    }
    const reserve = state.simulation.energies.player?.[energyId]?.reserve ?? 0;
    const {clock} = state;
    const facts = state.worlds[world].facts;
    const notes = readNotes(state);
    if (operation === 'research_fire') {
        const kinds = supportKinds.filter(kind => kind !== 'duplicate' || !flags[returned]);
        const {options} = searchGuMoves({available: [...kinds, core].map(kind => stage(kind, clock)),
            reserves: {player: {primeval: reserve}}, day: clock, effect: 'flame', maxSupports: supportKinds.length});
        if (!options.length) throw Error('Gather enough essence to test the fire set.');
        facts[key] = JSON.stringify({pair: notes?.pair ?? false, bundle: notes?.bundle ?? false,
            plans: options.map(row => row.supports), last: null});
        return;
    }
    const crossing = operation === 'cross_fire';
    const plan = notes?.plans[slot - 1];
    if (crossing ? !(notes?.pair && notes.bundle) : !plan) throw Error('The fire set is not ready for this trial.');
    const result = quote(clock, crossing ? [movement] : [...plan, core], reserve, !flags[returned]);
    if (crossing && result.effects[0]?.kind !== 'travel') throw Error('Gather enough essence to cross with Fire Discharge.');
    const spent = reserve - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
    if (crossing) return;
    const flame = result.effects[0];
    if (flame) {
        notes.pair ||= flame.count >= 2;
        notes.bundle ||= flame.magnitude >= 2;
    }
    notes.last = {slot, spent, outcome: result.outcome,
        ...(flame ? {count: flame.count, force: flame.magnitude} : {reason: result.reason})};
    facts[key] = JSON.stringify(notes);
}
