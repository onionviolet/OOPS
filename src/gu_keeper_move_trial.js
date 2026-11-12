import {moonlightBlade, moonbladeSheets, littleLightSupport, lightSourceSupport, littleLightMoonblade} from './gu_ability_profiles.js';
import {resolveGuActivation} from './gu_activation.js';
import {bindGuMove} from './gu_move_roles.js';
import {searchGuMoves} from './gu_move_search.js';
import {applyEnergyEffect} from './energy_resources.js';
import {heldMoonlightStockStage, moonlightStockMoveIds} from './gu_moonlight_stock.js';
import {applyKeeperChain, keeperChain, keeperChainFacts, keeperChainSlots, validateKeeperChain} from './gu_keeper_chain.js';
import {applyKeeperSignal, keeperSignal, keeperSignalFacts, keeperSignalOps, validateKeeperSignal} from './gu_keeper_signal.js';
import {applyKeeperFireTrialEffect, keeperFireSlots, keeperFireTrial, keeperFireTrialFacts,
    validateKeeperFireTrial} from './gu_keeper_fire_trial.js';

const keeper = 'book.ri.keeper';
export const keeperMoveTrial = `${keeper}.move_trial`;
export const keeperMoveTrialWorld = `${keeper}.world`;
export const keeperTrayMove = `${keeper}.tray_move`;
export const keeperTrayAlcove = `${keeperTrayMove}.alcove`;
export const keeperMovePlanSlots = 4;
const core = `${keeper}.moon`;
const energyId = `${keeper}.primeval`;
const key = `${keeperMoveTrial}.notes`;
const trayKey = `${keeperTrayMove}.notes`;
const trayTarget = 10;
const trayWrites = {write_tray_plain: [], write_tray_little: ['little_light'], write_tray_source: ['light_source']};
const supports = {
    little_light: {kind: 'little-light', ability: littleLightSupport, label: 'Little Light Gu'},
    light_source: {kind: 'light-source', ability: lightSourceSupport, label: 'Light Source Gu'},
};
const admitted = record => record?.extensions?.some(pin => pin.id === keeperMoveTrial);

export function isKeeperMoveTrialEffect(effect) {
    const {operation, slot} = effect;
    const slots = operation === 'cast' ? keeperMovePlanSlots : operation === 'cast_fire' ? keeperFireSlots :
        operation === 'cast_chain' ? keeperChainSlots : 0;
    return effect.type === 'guMoveTrial' && effect.actor === 'player' && keeperMoveTrialEffectPack(operation) !== null &&
        (slots ? Number.isSafeInteger(slot) && slot >= 1 && slot <= slots : slot === undefined) &&
        Object.keys(effect).every(name => ['type', 'actor', 'operation', 'slot'].includes(name));
}

export function keeperMoveTrialEffectPack(operation) {
    if (['research', 'cast'].includes(operation)) return keeperMoveTrial;
    if (Object.hasOwn(trayWrites, operation) || operation === 'cast_tray_move') return keeperTrayMove;
    if (['research_chain', 'cast_chain'].includes(operation)) return keeperChain;
    if (keeperSignalOps.some(op => operation === `signal_${op}`)) return keeperSignal;
    return ['research_fire', 'cast_fire', 'cross_fire'].includes(operation) ? keeperFireTrial : null;
}

export function keeperMoveCommandId(effect) {
    if (keeperMoveTrialEffectPack(effect.operation) === keeperSignal) {
        return `${keeperSignal}.${effect.operation.slice('signal_'.length)}`;
    }
    if (keeperMoveTrialEffectPack(effect.operation) === keeperChain) {
        return `${keeperChain}.${effect.operation === 'research_chain' ? 'research' : `try_${effect.slot}`}`;
    }
    if (keeperMoveTrialEffectPack(effect.operation) === keeperTrayMove) return `${keeperTrayMove}.${effect.operation}`;
    if (keeperMoveTrialEffectPack(effect.operation) === keeperFireTrial) {
        const command = effect.operation === 'research_fire' ? 'research' :
            effect.operation === 'cross_fire' ? 'cross' : `try_${effect.slot}`;
        return `${keeperFireTrial}.${command}`;
    }
    return `${keeperMoveTrial}.${effect.operation === 'research' ? 'research' : `try_${effect.slot}`}`;
}

function moonReady(state) {
    const moon = state.simulation.people[core];
    return moon?.life === 'alive' && moon.body.controllerId === 'player' && moon.vitals.health >= 3 &&
        state.simulation.claims[`${keeper}.moon_title`]?.owner === 'player';
}

function stagesFor(clock, flags) {
    return [
        ...Object.entries(supports).map(([id, {kind, ability}]) => ({
            gu: {id, kind, rank: 1, alive: flags[id], fedThrough: clock}, operator: 'player', ability,
        })),
        {gu: {id: core, kind: 'moonlight', rank: 1, alive: flags.moon, fedThrough: clock},
            operator: 'player', ability: moonlightBlade},
    ];
}

function flagsFor(state) {
    const facts = state.actors.player.facts;
    return {...Object.fromEntries(Object.keys(supports).map(id => [id, facts[`${keeperMoveTrial}.${id}`] === true])),
        moon: moonReady(state)};
}

export function keeperMoonbladeStages(state) {
    return stagesFor(state.clock, flagsFor(state));
}

function readNotes(state) {
    const raw = state.worlds[keeperMoveTrialWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Moonblade combination notes.');
    const {plans, last} = JSON.parse(raw);
    if (!Array.isArray(plans) || plans.length < 1 || plans.length > keeperMovePlanSlots ||
        plans.some(group => !Array.isArray(group) || group.length > 2 || new Set(group).size !== group.length ||
            group.some(id => !Object.hasOwn(supports, id))) || new Set(plans.map(group => group.join())).size !== plans.length ||
        (last !== null && (!last || !Number.isSafeInteger(last.slot) || last.slot < 1 || last.slot > plans.length ||
            !Number.isSafeInteger(last.spent) || last.spent < 0 || last.spent > 5 ||
            (last.outcome === 'complete' ? ![1, 2].includes(last.power) || ![1, 2].includes(last.reach) :
                last.outcome !== 'interrupted' || !['needs more essence', 'Gu unavailable'].includes(last.reason))))) {
        throw Error('The Moonblade combinations and their notes disagree.');
    }
    return {plans, last};
}

export function validateKeeperMoveTrial(state, record) {
    validateKeeperSignal(state, record);
    validateKeeperChain(state, record);
    validateKeeperFireTrial(state, record);
    validateTrayMove(state, record);
    const notes = readNotes(state);
    const completed = state.actors.player.completed;
    const hasNotes = (completed[`${keeperMoveTrial}.research`] ?? 0) > 0;
    const flags = state.actors.player.facts;
    const hasFlags = Object.keys(supports).some(id => flags[`${keeperMoveTrial}.${id}`] !== undefined);
    if (!!notes !== hasNotes || (notes || hasFlags) && !admitted(record) ||
        (notes?.last && !(completed[`${keeperMoveTrial}.try_${notes.last.slot}`] > 0))) {
        throw Error('The Moonblade combination notes need their trial receipts.');
    }
}

export function keeperMoveTrialFacts(state, actor, record) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperMoveTrialWorld) return {};
    const count = readNotes(state)?.plans.length ?? 0;
    return {
        ...keeperFireTrialFacts(state), ...trayFacts(state, record), ...keeperChainFacts(state, record), ...keeperSignalFacts(state, record),
        [`${keeperMoveTrial}.moon_ready`]: moonReady(state),
        ...Object.fromEntries(Object.keys(supports).map(id =>
            [`${keeperMoveTrial}.holds_${id}`, state.actors.player.facts[`${keeperMoveTrial}.${id}`] === true])),
        ...Object.fromEntries(Array.from({length: keeperMovePlanSlots}, (_, index) =>
            [`${keeperMoveTrial}.plan_${index + 1}`, index < count])),
    };
}

function castStages(stages, group) {
    return [...group, core].map(id => stages.find(row => row.gu.id === id));
}

function quote(stages, group, reserve, day) {
    return resolveGuActivation({stages: castStages(stages, group), reserves: {player: {primeval: reserve}}, day});
}

export function keeperMoveTrialView(state, record) {
    if (!admitted(record)) return null;
    const notes = readNotes(state);
    if (!notes) return null;
    const clock = state.clock;
    const stages = stagesFor(clock, {moon: true, little_light: true, light_source: true});
    const known = bindGuMove(littleLightMoonblade, stages)[0].stages.map(row => row.gu.id);
    const plans = notes.plans.map((group, index) => {
        const {effects, activations} = quote(stages, group, 12, clock);
        return {slot: index + 1, names: group.map(id => supports[id].label),
            known: castStages(stages, group).map(row => row.gu.id).join() === known.join(),
            cost: activations.reduce((total, row) => total + row.cost, 0), power: effects[0].magnitude, reach: effects[0].range};
    });
    return {plans, last: notes.last};
}

export function applyKeeperMoveTrialEffect(state, effect, context, registry) {
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperSignal) {
        return applyKeeperSignal(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperChain) {
        return applyKeeperChain(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperFireTrial) {
        return applyKeeperFireTrialEffect(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperTrayMove) {
        if (context.actorId !== 'player' || !trayPinned(context.structuredNative) ||
            state.actors.player?.worldId !== keeperMoveTrialWorld || state.simulation.people.player.location !== `${keeper}.annex`) {
            throw Error('Compare tray Gu beside the steward.');
        }
        applyTrayMove(state, effect.operation, registry);
        return;
    }
    if (!isKeeperMoveTrialEffect(effect) || context.actorId !== 'player' || !admitted(context.structuredNative) ||
        state.actors.player?.worldId !== keeperMoveTrialWorld || state.simulation.people.player.location !== `${keeper}.annex`) {
        throw Error('Try Moonblade combinations at the Gu house.');
    }
    const reserve = state.simulation.energies.player?.[energyId]?.reserve ?? 0;
    const stages = keeperMoonbladeStages(state);
    const facts = state.worlds[keeperMoveTrialWorld].facts;
    if (effect.operation === 'research') {
        const {options} = searchGuMoves({available: stages.filter(row => row.gu.alive), day: state.clock,
            reserves: {player: {primeval: reserve}}, effect: 'damage'});
        if (!options.length) throw Error('Bring a ready Moonlight Gu and enough essence to test a blade.');
        facts[key] = JSON.stringify({plans: options.map(row => row.supports), last: null});
        return;
    }
    const notes = readNotes(state);
    const group = notes?.plans[effect.slot - 1];
    if (!group) throw Error('Write down a combination before trying it.');
    const result = quote(stages, group, reserve, state.clock);
    const spent = reserve - result.remaining.player.primeval;
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
    const hit = result.effects[0];
    notes.last = {slot: effect.slot, outcome: result.outcome, spent,
        ...(hit ? {power: hit.magnitude, reach: hit.range} : {reason: result.reason})};
    facts[key] = JSON.stringify(notes);
}

const trayPinned = record => record?.extensions?.some(pin => pin.id === keeperTrayMove);
const trayDone = (state, operation) => state.actors.player.completed[`${keeperTrayMove}.${operation}`] ?? 0;

function readTray(state) {
    const raw = state.worlds[keeperMoveTrialWorld]?.facts?.[trayKey];
    if (raw === undefined) return {plan: null, result: null};
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid tray move notes.');
    return JSON.parse(raw);
}

function validateTrayMove(state, record) {
    const raw = state.worlds[keeperMoveTrialWorld]?.facts?.[trayKey];
    const atAlcove = state.simulation.people.player.location === keeperTrayAlcove;
    const casts = trayDone(state, 'cast_tray_move');
    const written = Object.keys(trayWrites).filter(op => trayDone(state, op));
    if (raw === undefined && !atAlcove && !casts && !written.length) return;
    const {plan, result} = readTray(state);
    const validPlan = plan && moonlightStockMoveIds.includes(plan.core) && Object.hasOwn(trayWrites, plan.operation) &&
        written.includes(plan.operation);
    if (!trayPinned(record) || !validPlan || Number(!!result) !== Number(casts > 0) ||
        result && (!moonlightStockMoveIds.includes(result.core) || !written.includes(result.operation) ||
            !Number.isSafeInteger(result.sheets) || result.sheets < 4 || result.sheets > 12 ||
            result.open !== (result.sheets >= trayTarget) ||
            result.open && (result.core !== plan.core || result.operation !== plan.operation)) ||
        atAlcove && !result?.open) throw Error('The tray move needs its written specimen and cast receipts.');
}

function traySearch(state) {
    const core = heldMoonlightStockStage(state);
    const reserve = state.simulation.energies.player[energyId].reserve;
    const available = core ? [...keeperMoonbladeStages(state).filter(row => row.gu.alive && row.gu.kind !== 'moonlight'), core] : [];
    const options = searchGuMoves({available, reserves: {player: {primeval: reserve}},
        day: state.clock, effect: 'damage', maxSupports: 1, pareto: false}).options;
    return {core, reserve, available, options};
}

const trayOption = (options, operation) => options.find(row => row.supports.join() === trayWrites[operation].join());
const trayHasPlan = (options, plan) => !!plan && options.some(row =>
    row.core === plan.core && row.supports.join() === trayWrites[plan.operation].join());

function trayFacts(state, record) {
    if (!trayPinned(record)) return {};
    const {plan, result} = readTray(state);
    const options = result?.open ? [] : traySearch(state).options;
    const flags = {...Object.fromEntries(Object.keys(trayWrites).map(op => [op, !!trayOption(options, op)])),
        cast_tray_move: trayHasPlan(options, plan), enter: !!result?.open};
    return Object.fromEntries(Object.entries(flags).map(([op, value]) => [`${keeperTrayMove}.${op}`, value]));
}

export function keeperTrayMoveView(state, record) {
    if (!trayPinned(record)) return null;
    const {plan, result} = readTray(state);
    const {core, options, reserve} = traySearch(state);
    const label = id => moonlightStockMoveIds.indexOf(id) === 0 ? 'First tray Gu' : 'Second tray Gu';
    return {target: trayTarget, written: plan && label(plan.core), missing: !!plan && core?.gu.id !== plan.core, result,
        plans: result?.open ? [] : options.map(option => ({name: label(option.core),
            support: option.supports.map(id => supports[id].label)[0], sheets: moonbladeSheets(option),
            cost: reserve - option.remaining.player.primeval}))};
}

function applyTrayMove(state, operation, registry) {
    const notes = readTray(state);
    if (notes.result?.open) throw Error('The paper seal is already cut.');
    const {options, available, reserve} = traySearch(state);
    if (operation === 'cast_tray_move') {
        if (!trayHasPlan(options, notes.plan)) throw Error('The exact tray Gu or its support is unavailable.');
        const {core, operation: source} = notes.plan;
        const stages = [...trayWrites[source], core].map(id => available.find(stage => stage.gu.id === id));
        const result = resolveGuActivation({stages, reserves: {player: {primeval: reserve}}, day: state.clock});
        const sheets = moonbladeSheets(result);
        for (let unit = 0; unit < reserve - result.remaining.player.primeval; unit++) {
            applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
        }
        notes.result = {core, operation: source, sheets, open: sheets >= trayTarget};
    } else {
        const option = trayOption(options, operation);
        if (!option) throw Error('Bring a tray Gu and a funded combination first.');
        notes.plan = {core: option.core, operation};
    }
    state.worlds[keeperMoveTrialWorld].facts[trayKey] = JSON.stringify(notes);
}
