import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {resolveGuDefense} from './gu_defense.js';
import {controlledScaleArmor} from './world_packs/book_gu_keeper_refinement_trials.js';
import {runGuGoal, searchGuGoal} from './gu_goal_search.js';

const keeper = 'book.ri.keeper';
const world = `${keeper}.world`;
const jadeId = `${keeper}.jade`;
export const keeperDefense = `${keeper}.layered_defense`;
export const keeperDefenseResearch = `${keeper}.defense_research`;
export const defenseFarBank = `${keeperDefenseResearch}.far_bank`;
const aperture = `${keeper}.primeval`;
const fact = `${keeperDefense}.trial`;
const shieldRecovery = 20;
const shotRecovery = 5;
export const defenseTrials = Object.freeze({
    bare_blast: [],
    jade_blast: ['white-jade'],
    shield_blast: ['water-shield', 'white-jade'],
    braced_blast: ['water-shield', 'white-jade', 'scale-armor'],
});
const pinned = record => record?.extensions?.some(pin => pin.id === keeperDefense);
const researchPinned = record => record?.extensions?.some(pin => pin.id === keeperDefenseResearch);
const store = state => state.worlds[world].facts;
const read = state => JSON.parse(store(state)[fact] ?? 'null');
const guardKinds = ['water-shield', 'white-jade', 'scale-armor'];
const optionId = kinds => `cross_${guardKinds.reduce((mask, kind, index) => mask + (kinds.includes(kind) ? 2 ** index : 0), 0)}`;
export const defenseResearchOperations = Object.freeze(Object.fromEntries(
    Array.from({length: 7}, (_, index) => guardKinds.filter((_, bit) => (index + 1) & 2 ** bit))
        .map(kinds => [optionId(kinds), kinds])
));
const kindsFor = operation => defenseTrials[operation] ?? defenseResearchOperations[operation];
const usesShield = operation => kindsFor(operation).includes('water-shield');
const shieldReadyAt = receipt => receipt?.shieldAt == null ? 0 : receipt.shieldAt + shieldRecovery;
const shotReadyAt = receipt => receipt ? receipt.at + shotRecovery : 0;

function jadeReady(state) {
    const jade = state.simulation.people[jadeId];
    return jade?.life === 'alive' && jade.body.controllerId === 'player' && jade.vitals.health >= 2 &&
        state.simulation.claims[`${jadeId}_title`]?.owner === 'player';
}

export function defenseFacts(state, thunderclapReady) {
    if (!thunderclapReady) return {};
    const receipt = read(state);
    return {
        [`${keeperDefense}.ready`]: true,
        [`${keeperDefense}.shot_ready`]: state.clock >= shotReadyAt(receipt),
        [`${keeperDefense}.water_ready`]: state.clock >= shieldReadyAt(receipt),
        [`${keeperDefense}.jade_ready`]: jadeReady(state),
        [`${keeperDefense}.armor_ready`]: !!controlledScaleArmor(state),
    };
}

const profiles = Object.fromEntries(guardKinds.map(kind => [
    guCatalogue[kind].ability.value.effect.kind, {
        id: kind, type: kind === 'scale-armor' ? 'bludgeoning' : 'lightning',
        phase: kind === 'scale-armor' ? 'landing' : 'blast', breaks: kind === 'water-shield',
    },
]));

function guardStage(kind, clock, armor) {
    const ids = {'white-jade': jadeId, 'water-shield': `${keeperDefense}.loan`, 'scale-armor': armor?.id ?? 'scale-armor'};
    return {gu: {id: ids[kind], kind, rank: kind === 'scale-armor' ? armor?.rank ?? 2 : 2, fedThrough: clock},
        operator: 'player', ability: guCatalogue[kind].ability.value,
        supply: {pool: 'essence', family: 'primeval', rank: 1, source: 'aperture'}};
}

function resolveGuardEffects(power, effects) {
    return resolveGuDefense([
        {type: 'lightning', phase: 'blast', amount: 9 * power},
        {type: 'bludgeoning', phase: 'landing', amount: 4},
    ], effects.map(({kind, magnitude}) => ({...profiles[kind], capacity: magnitude})));
}

function resolveTrial(operation, power, {armor, clock}) {
    const stages = kindsFor(operation).map(kind => guardStage(kind, clock, armor));
    if (!stages.length) return resolveGuardEffects(power, []);
    const active = resolveGuActivation({stages, reserves: {player: {essence: stages.length * 2}}, day: clock});
    if (active.outcome !== 'complete') throw Error('The trial defenses could not be raised.');
    return resolveGuardEffects(power, active.effects);
}

const damage = result => result.remainder.reduce((sum, packet) => sum + packet.amount, 0);
const standardPower = guCatalogue.thunderclap.ability.value.effect.magnitude;
const crossing = {kind: 'cross-thunderclap', maxDamage: 8, power: standardPower};
const defenseMethod = {
    id: 'layer-guards', goal: crossing.kind,
    recipe: {roles: guardKinds.map(kind => ({id: kind, kind, optional: true})), beats: [{roles: guardKinds}]},
    apply: (target, effects) => {
        const result = resolveGuardEffects(target.power, effects);
        return damage(result) <= target.maxDamage ? result : null;
    },
};

function crossingRequest(state, receipt, power = standardPower) {
    const armor = controlledScaleArmor(state);
    const ready = [state.clock >= shieldReadyAt(receipt), jadeReady(state), !!armor];
    const reserve = state.simulation.energies.player[aperture].reserve;
    return {ready, goal: {...crossing, power}, methods: [defenseMethod], day: state.clock,
        reserves: {player: {essence: reserve}}, available: guardKinds.flatMap((kind, i) =>
            ready[i] ? [guardStage(kind, state.clock, armor)] : [])};
}

function crossingOptions(request) {
    return searchGuGoal(request).options.map(plan => ({
        operation: optionId(guardKinds.filter(kind => plan.binding[kind])),
        cost: request.reserves.player.essence - plan.remaining.player.essence,
        plan,
    }));
}

export function keeperDefenseResearchFacts(state, record) {
    if (!researchPinned(record)) return {};
    const receipt = read(state);
    const options = crossingOptions(crossingRequest(state, receipt));
    return Object.fromEntries(options.map(({operation}) => [`${keeperDefenseResearch}.${operation}`, true]));
}

function writeResult(state, operation, previous, result) {
    const broken = result.layers.some(layer => layer.broken);
    store(state)[fact] = JSON.stringify({operation, at: state.clock, shieldAt: broken ? state.clock : previous?.shieldAt ?? null});
}

export function applyKeeperDefense(state, record, operation, thunderclapPower) {
    const facts = defenseFacts(state, !!thunderclapPower);
    const kinds = defenseTrials[operation];
    const available = key => facts[`${keeperDefense}.${key}`];
    if (!pinned(record) || !available('shot_ready') || usesShield(operation) && !available('water_ready') ||
        kinds.includes('white-jade') && !available('jade_ready') || kinds.includes('scale-armor') && !available('armor_ready')) {
        throw Error('The hunter and the chosen defenses must be ready.');
    }
    const previous = read(state);
    const result = resolveTrial(operation, thunderclapPower, {armor: controlledScaleArmor(state), clock: state.clock});
    writeResult(state, operation, previous, result);
    return damage(result);
}

export function applyKeeperDefenseResearch(state, record, operation, power) {
    const receipt = read(state);
    if (!researchPinned(record) || state.clock < shotReadyAt(receipt)) throw Error('Wait until the hunter can fire again.');
    const request = crossingRequest(state, receipt, power);
    const option = crossingOptions(request).find(row => row.operation === operation);
    if (!option) throw Error('The Gu or essence for this crossing has changed.');
    const result = runGuGoal({...request, plan: option.plan});
    if (!result.targetOutcome) throw Error('This combination cannot carry you across the blast lane.');
    writeResult(state, operation, receipt, result.targetOutcome);
    return {cost: option.cost, damage: damage(result.targetOutcome)};
}

export function keeperDefenseView(state, record) {
    if (!pinned(record)) return null;
    const receipt = read(state);
    const view = {shotIn: Math.max(0, shotReadyAt(receipt) - state.clock), shieldIn: Math.max(0, shieldReadyAt(receipt) - state.clock),
        last: receipt && resolveTrial(receipt.operation, standardPower, {clock: receipt.at})};
    if (researchPinned(record)) {
        const request = crossingRequest(state, receipt);
        view.research = {limit: crossing.maxDamage, missing: guardKinds.filter((_, i) => !request.ready[i]),
            options: crossingOptions(request).map(({operation, cost, plan}) => ({operation, cost, kinds: kindsFor(operation),
                blast: plan.outcome.remainder[0].amount, landing: plan.outcome.remainder[1].amount}))};
    }
    return view;
}

export function validateKeeperDefense(state, record) {
    const receipt = read(state);
    const completed = (pack, operation) => (state.actors.player.completed[`${pack}.${operation}`] ?? 0) > 0;
    const research = Object.keys(defenseResearchOperations).filter(operation => completed(keeperDefenseResearch, operation));
    const done = [...Object.keys(defenseTrials).filter(operation => completed(keeperDefense, operation)), ...research];
    if (!receipt && done.length === 0 && state.simulation.people.player.location !== defenseFarBank) return;
    const inTime = time => Number.isSafeInteger(time) && time >= record.initializedAt && time <= state.clock;
    if (!pinned(record) || research.length && !researchPinned(record) || !receipt || !done.includes(receipt.operation) || !inTime(receipt.at) ||
        state.simulation.people.player.location === defenseFarBank && !research.length ||
        (receipt.shieldAt !== null) !== done.some(usesShield) ||
        receipt.shieldAt !== null && (!inTime(receipt.shieldAt) || receipt.shieldAt > receipt.at) ||
        usesShield(receipt.operation) && receipt.shieldAt !== receipt.at) {
        throw Error('The layered defense trial needs its activation and recovery receipts.');
    }
}
