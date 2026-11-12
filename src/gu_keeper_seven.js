import {guCatalogue} from './gu_catalogue.js';
import {beginGuRefinement, cancelGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {activateHostedThunderclap, hostedThunderclapReady} from './gu_hosted_wolf.js';
import {validateGuClaims} from './gu_world_claims.js';

export const keeperSeven = 'book.ri.keeper.seven_fragrances';
export const sevenMinutes = 20;
export const sevenOperations = ['prepare_seven', 'finish_seven', 'cancel_seven', 'feed_seven', 'concentrate_silver', 'cast_seven'];
const {recipe: {value: recipe}, conversion: {value: conversion}} = guCatalogue['seven-fragrances-liquor-worm'];
export const sevenConversion = conversion;
const key = `${keeperSeven}.work`;
const worldId = 'book.ri.keeper.world';
const second = `${keeperSeven}.loan`;
const output = `${keeperSeven}.specimen`;
const done = (state, operation) => state.actors.player.completed[`${keeperSeven}.${operation}`] ?? 0;
const pinned = record => record?.extensions?.some(pin => pin.id === keeperSeven);
const latest = row => row?.world.attempts.at(-1);
const stock = state => done(state, 'concentrate_silver') * conversion.yield - done(state, 'cast_seven') * 2;

function read(state) {
    const raw = state.worlds[worldId]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Seven Fragrances record.');
    const row = JSON.parse(raw);
    const at = value => Number.isSafeInteger(value) && value >= 0 && value <= state.clock;
    if (!at(row.startedAt) || row.fedAt !== null && !at(row.fedAt) ||
        !Array.isArray(row.world?.gu) || !Array.isArray(row.world?.attempts)) throw Error('Invalid Seven Fragrances work.');
    return row;
}

export function sevenSpecimen(state) {
    return read(state)?.world.gu.find(specimen => specimen.id === output);
}

export function sevenActions(state, parent, parentFed, committed = false) {
    const row = read(state);
    const status = latest(row)?.status;
    const fed = row?.fedAt != null && state.clock - row.fedAt < 1440;
    return {prepare_seven: !!parent && parentFed && (!status || status === 'cancelled'),
        finish_seven: status === 'working' && state.clock >= row.startedAt + sevenMinutes,
        cancel_seven: status === 'working', feed_seven: status === 'complete' && !committed && !fed,
        concentrate_silver: status === 'complete' && !committed && fed,
        cast_seven: stock(state) >= 2 && hostedThunderclapReady(state)};
}

export function sevenView(state, record) {
    const row = read(state);
    if (!row || !pinned(record)) return null;
    const status = latest(row).status;
    return {status, remaining: status === 'working' ? Math.max(0, row.startedAt + sevenMinutes - state.clock) : 0,
        fed: row.fedAt !== null && state.clock - row.fedAt < 1440, stock: stock(state), lastStrike: row.lastStrike};
}

export function fourCommitted(state) {
    return ['working', 'complete'].includes(latest(read(state))?.status);
}

export function validateSeven(state, record, parent) {
    const row = read(state);
    if (!row && !sevenOperations.some(op => done(state, op))) return;
    if (row) validateGuClaims(row.world);
    const jobs = row?.world.attempts;
    const finished = done(state, 'finish_seven');
    const procedure = JSON.stringify(recipe);
    if (!row || !parent || !pinned(record) || jobs.length !== done(state, 'prepare_seven') || finished > 1 ||
        jobs.filter(job => job.status === 'cancelled').length !== done(state, 'cancel_seven') ||
        jobs.filter(job => job.status === 'complete').length !== finished ||
        jobs.filter(job => job.status === 'working').length !== Number(latest(row)?.status === 'working') ||
        jobs.some((job, index) => job.id !== `seven-fragrances-${index + 1}` || job.refiner !== 'player' ||
            job.productId !== output || job.ingredients?.first !== parent.id || job.ingredients.second !== second ||
            JSON.stringify(job.recipe) !== procedure || job.cursor !== (job.status === 'complete' ? 2 : 1)) ||
        (row.fedAt !== null) !== (done(state, 'feed_seven') > 0) ||
        (row.lastStrike !== undefined) !== (done(state, 'cast_seven') > 0) || (row.lastStrike !== undefined && row.lastStrike !== 2) ||
        (!finished && (row.fedAt !== null || done(state, 'concentrate_silver'))) || stock(state) < 0 ||
        row.world.gu.length !== 2 + finished || !row.world.gu.slice(0, 2).every((gu, index) =>
            gu.id === [parent.id, second][index] && gu.kind === recipe.ingredients.first && gu.rank === 2 &&
            gu.holder === 'player' && gu.alive === !finished && gu.fate === (finished ? 'consumed' : undefined)) ||
        JSON.stringify(row.world.gu[0].provenance) !== JSON.stringify(parent.provenance) ||
        (finished && !row.world.gu.some(gu => gu.id === output && gu.kind === recipe.kind && gu.rank === recipe.rank &&
            gu.alive && gu.provenance?.ingredients.first === parent.id && gu.provenance.ingredients.second === second))) {
        throw Error('Seven Fragrances needs its living inputs, lineage and essence receipts.');
    }
}

export function applySeven(state, record, operation, parent, parentFed, committed) {
    if (!pinned(record) || !sevenActions(state, parent, parentFed, committed)[operation]) {
        throw Error('The Seven Fragrances work or Thunderclap is unavailable.');
    }
    const row = read(state) ?? {world: {gu: [parent.id, second].map(id => ({
        id, kind: recipe.ingredients.first, rank: 2, holder: 'player', alive: true,
        ...(id === parent.id && {provenance: parent.provenance}),
    })), attempts: [], stocks: {}}, startedAt: null, fedAt: null};
    const job = latest(row);
    if (operation === 'prepare_seven') {
        const id = `seven-fragrances-${done(state, operation) + 1}`;
        const stock = Object.fromEntries(recipe.stages[0].inputs.map(({material, amount}) => [material, amount]));
        row.world = stepGuRefinement(beginGuRefinement({...row.world, stocks: {player: stock}}, {
            id, refiner: 'player', recipe, ingredients: {first: parent.id, second}, productId: output,
        }), id);
        row.startedAt = state.clock;
    } else if (operation === 'finish_seven') row.world = stepGuRefinement(row.world, job.id);
    else if (operation === 'cancel_seven') row.world = cancelGuRefinement(row.world, job.id);
    else if (operation === 'feed_seven') row.fedAt = state.clock;
    else if (operation === 'cast_seven') row.lastStrike = activateHostedThunderclap(state, record, {stage: 'upper', reserve: 2});
    state.worlds[worldId].facts[key] = JSON.stringify(row);
}
