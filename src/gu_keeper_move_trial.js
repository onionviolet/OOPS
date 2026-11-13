import {moonbladeSheets} from './gu_ability_profiles.js';
import {resolveGuActivation} from './gu_activation.js';
import {searchGuMoves} from './gu_move_search.js';
import {applyEnergyEffect} from './energy_resources.js';
import {heldMoonlightStockStage, moonlightStockMoveIds} from './gu_moonlight_stock.js';
import {applyKeeperChain, keeperChain, keeperChainFacts, keeperChainSlots, validateKeeperChain} from './gu_keeper_chain.js';
import {applyKeeperSignal, keeperSignal, keeperSignalFacts, keeperSignalOps, validateKeeperSignal} from './gu_keeper_signal.js';
import {fireMoveTrial, keeperFireSlots, keeperFireTrial, keeperFireTrialFacts,
    validateKeeperFireTrial} from './world_packs/book_gu_keeper_fire_trial.js';
import {keeperMoonbladeSupports as supports, keeperMoonbladeTrialFacts, keeperMovePlanSlots, keeperMoveTrial,
    keeperMoveTrialWorld, keeperTrayAlcove, keeperTrayMove, moonbladeMoveTrial,
    validateKeeperMoonbladeTrial} from './world_packs/book_gu_keeper_move_trial.js';

export {keeperMovePlanSlots, keeperMoveTrial, keeperMoveTrialView, keeperMoveTrialWorld,
    keeperTrayAlcove, keeperTrayMove} from './world_packs/book_gu_keeper_move_trial.js';

const keeper = 'book.ri.keeper';
const energyId = `${keeper}.primeval`;
const trayKey = `${keeperTrayMove}.notes`;
const trayTarget = 10;
const trayWrites = {write_tray_plain: [], write_tray_little: ['little_light'], write_tray_source: ['light_source']};

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

export function keeperMoonbladeStages(state) {
    return moonbladeMoveTrial.stages(state);
}

export function validateKeeperMoveTrial(state, record) {
    validateKeeperSignal(state, record);
    validateKeeperChain(state, record);
    validateKeeperFireTrial(state, record);
    validateTrayMove(state, record);
    validateKeeperMoonbladeTrial(state, record);
}

export function keeperMoveTrialFacts(state, actor, record) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperMoveTrialWorld) return {};
    const notes = moonbladeMoveTrial.read(state);
    return {
        ...keeperFireTrialFacts(state), ...trayFacts(state, record), ...keeperChainFacts(state, record),
        ...keeperSignalFacts(state, record), ...keeperMoonbladeTrialFacts(state, notes),
    };
}

export function applyKeeperMoveTrialEffect(state, effect, context, registry) {
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperSignal) {
        return applyKeeperSignal(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperChain) {
        return applyKeeperChain(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperFireTrial) {
        return fireMoveTrial.apply(state, effect, context, registry);
    }
    if (isKeeperMoveTrialEffect(effect) && keeperMoveTrialEffectPack(effect.operation) === keeperTrayMove) {
        if (context.actorId !== 'player' || !trayPinned(context.structuredNative) ||
            state.actors.player?.worldId !== keeperMoveTrialWorld || state.simulation.people.player.location !== `${keeper}.annex`) {
            throw Error('Compare tray Gu beside the steward.');
        }
        applyTrayMove(state, effect.operation, registry);
        return;
    }
    if (!isKeeperMoveTrialEffect(effect)) throw Error('Try Moonblade combinations at the Gu house.');
    return moonbladeMoveTrial.apply(state, effect, context, registry);
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
