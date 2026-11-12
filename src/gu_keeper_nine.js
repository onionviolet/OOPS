import {resolveGuActivation} from './gu_activation.js';
import {guCatalogue} from './gu_catalogue.js';
import {beginGuRefinement, cancelGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {validateGuClaims} from './gu_world_claims.js';

export const keeperNine = 'book.ri.keeper.nine_eyes';
export const nineFarBank = `${keeperNine}.far_bank`;
export const nineSettleMinutes = 15;
export const nineHoldMinutes = 30;
export const nineOperations = ['prepare_nine', 'settle_nine', 'cancel_nine', 'feed_nine', 'concentrate_gold', 'test_initial', 'cross_cut'];
const {recipe: {value: recipe}, conversion: {value: conversion}} = guCatalogue['nine-eyes-liquor-worm'];
export const nineConversion = conversion;
const charge = guCatalogue['charging-crash'].ability.value;
export const crashCost = charge.cost;
export const crashCut = 160;
const key = `${keeperNine}.work`;
const worldId = 'book.ri.keeper.world';
const second = `${keeperNine}.market_worm`;
const output = `${keeperNine}.specimen`;
const done = (state, operation) => state.actors.player.completed[`${keeperNine}.${operation}`] ?? 0;
const pinned = record => record?.extensions?.some(pin => pin.id === keeperNine);
const latest = row => row?.world.attempts.at(-1);
const stock = state => done(state, 'concentrate_gold') * conversion.yield - done(state, 'cross_cut') * crashCost;

function read(state) {
    const raw = state.worlds[worldId]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Nine Eyes record.');
    const row = JSON.parse(raw);
    const at = value => Number.isSafeInteger(value) && value >= 0 && value <= state.clock;
    if (!at(row.startedAt) || row.fedAt !== null && !at(row.fedAt) ||
        !Array.isArray(row.world?.gu) || !Array.isArray(row.world?.attempts) || !latest(row)) {
        throw Error('Invalid Nine Eyes work.');
    }
    return row;
}

export function nineCommitsSeven(state) {
    return ['working', 'complete'].includes(latest(read(state))?.status);
}

export function nineActions(state, parent) {
    const row = read(state);
    const status = latest(row)?.status;
    const fed = row?.fedAt != null && state.clock - row.fedAt < 1440;
    const complete = status === 'complete';
    return {buy_second: !!parent && !done(state, 'buy_second'),
        prepare_nine: !!parent && done(state, 'buy_second') === 1 && !['working', 'complete'].includes(status),
        settle_nine: status === 'working' && state.clock >= row.startedAt + nineSettleMinutes,
        cancel_nine: status === 'working', feed_nine: complete && !fed, concentrate_gold: complete && fed,
        test_initial: complete, cross_cut: stock(state) >= crashCost, collect: done(state, 'cross_cut') > 0 && !done(state, 'collect')};
}

export function nineView(state, record) {
    const row = read(state);
    if (!row || !pinned(record)) return null;
    const status = latest(row).status;
    return {status, readyIn: Math.max(0, row.startedAt + nineSettleMinutes - state.clock),
        closesIn: Math.max(0, row.startedAt + nineHoldMinutes - state.clock),
        fed: row.fedAt !== null && state.clock - row.fedAt < 1440, stock: stock(state), lastDistance: row.lastDistance};
}

export function validateNine(state, record, parent) {
    const row = read(state);
    const bought = done(state, 'buy_second');
    const prepared = done(state, 'prepare_nine');
    const settled = done(state, 'settle_nine');
    const cancelled = done(state, 'cancel_nine');
    const collected = done(state, 'collect');
    const crosses = done(state, 'cross_cut');
    if (bought > 1 || collected > 1 || collected > crosses ||
        (!row && nineOperations.some(op => done(state, op))) || ((bought || row) && (!parent || !pinned(record)))) {
        throw Error('Nine Eyes needs its market Worm and refinement receipts.');
    }
    if (!row) return;
    validateGuClaims(row.world);
    const {gu, attempts} = row.world;
    const status = latest(row).status;
    const complete = status === 'complete';
    const finished = Number(complete);
    const procedure = JSON.stringify(recipe);
    if (bought !== 1 || prepared !== attempts.length || attempts.length !== settled + cancelled + Number(status === 'working') ||
        attempts.filter(job => job.status === 'cancelled').length !== cancelled ||
        attempts.filter(job => job.status === 'failed').length !== settled - finished ||
        attempts.some((job, index) => job.id !== `nine-eyes-${index + 1}` || job.refiner !== 'player' ||
            job.productId !== output || job.ingredients?.first !== parent.id || job.ingredients.second !== second ||
            JSON.stringify(job.recipe) !== procedure || !['working', 'complete', 'failed', 'cancelled'].includes(job.status) ||
            job.cursor !== (['working', 'cancelled'].includes(job.status) ? 1 : 2) ||
            index < attempts.length - 1 && !['failed', 'cancelled'].includes(job.status)) ||
        gu.length !== 2 + finished || !gu.slice(0, 2).every((specimen, index) => specimen.id === [parent.id, second][index] &&
            specimen.kind === recipe.ingredients.first && specimen.rank === 3 && specimen.holder === 'player' &&
            specimen.alive === !complete && specimen.fate === (complete ? 'consumed' : undefined)) ||
        JSON.stringify(gu[0].provenance) !== JSON.stringify(parent.provenance) ||
        (complete && !gu.some(specimen => specimen.id === output && specimen.kind === recipe.kind && specimen.rank === recipe.rank &&
            specimen.holder === 'player' && specimen.alive && specimen.provenance?.ingredients.first === parent.id &&
            specimen.provenance.ingredients.second === second)) ||
        (row.fedAt !== null) !== (done(state, 'feed_nine') > 0) || stock(state) < 0 ||
        (!complete && (row.fedAt !== null || done(state, 'concentrate_gold') || done(state, 'test_initial') || crosses)) ||
        (row.lastDistance !== undefined) !== (done(state, 'test_initial') + crosses > 0) ||
        (row.lastDistance !== undefined && ![100, 200].includes(row.lastDistance))) {
        throw Error('The Nine Eyes job, living Worms and yellow-gold reserve disagree.');
    }
}

function crash(operation, state) {
    const stage = operation === 'cross_cut' ? conversion.stage : conversion.from;
    const pool = `gold-${stage}`;
    const reserve = operation === 'cross_cut' ? stock(state) : crashCost;
    const result = resolveGuActivation({stages: [{gu: {id: `${keeperNine}.charging_crash`, kind: 'charging-crash', rank: 4,
        fedThrough: state.clock}, operator: 'player', ability: charge,
        supply: {pool, family: charge.fuel, rank: 4, stage, source: stage === conversion.from ? 'stored' : 'condensed'}}],
        reserves: {player: {[pool]: reserve}}, day: state.clock});
    const distance = result.effects.find(row => row.kind === 'dash')?.magnitude;
    if (result.outcome !== 'complete' || (operation === 'cross_cut' ? distance < crashCut : distance >= crashCut)) {
        throw Error('Charging Crash could not settle the crossing.');
    }
    return distance;
}

export function applyNine(state, record, operation, parent) {
    if (!pinned(record) || !nineActions(state, parent)[operation]) throw Error('The Nine Eyes work is unavailable.');
    const row = read(state) ?? {world: {gu: [parent, {id: second, kind: recipe.ingredients.second, rank: 3, holder: 'player', alive: true}],
        attempts: [], stocks: {}}, startedAt: null, fedAt: null};
    const job = latest(row);
    if (operation === 'prepare_nine') {
        const id = `nine-eyes-${done(state, operation) + 1}`;
        const ingredients = {first: parent.id, second};
        const materials = Object.fromEntries(recipe.stages[0].inputs.map(({material, amount}) => [material, amount]));
        const prepared = beginGuRefinement({...row.world, stocks: {player: materials}}, {
            id, refiner: 'player', recipe, ingredients, productId: output,
        });
        row.world = stepGuRefinement(prepared, id);
        row.startedAt = state.clock;
    } else if (operation === 'settle_nine') {
        row.world = stepGuRefinement(row.world, job.id, {controlFailed: state.clock >= row.startedAt + nineHoldMinutes});
    } else if (operation === 'cancel_nine') row.world = cancelGuRefinement(row.world, job.id);
    else if (operation === 'feed_nine') row.fedAt = state.clock;
    else if (operation === 'test_initial' || operation === 'cross_cut') row.lastDistance = crash(operation, state);
    state.worlds[worldId].facts[key] = JSON.stringify(row);
}
