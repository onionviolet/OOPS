import {detachVitalityLeaf, growVitalityLeaf, vitalityGrass, vitalityLeaf} from './gu_vitality_grass.js';

export const keeperVitality = 'book.ri.keeper.vitality_garden';
export const vitalityOperations = ['borrow_grass', 'return_grass', 'grow_leaf', 'harvest_leaf', 'treat_leaf'];
export const leafGrowthMinutes = 15;
const world = 'book.ri.keeper.world';
const annex = 'book.ri.keeper.annex';
const steward = 'book.ri.keeper.steward';
const plantId = `${keeperVitality}.plant`;
const key = `${keeperVitality}.bed`;
export const keeperVitalityLeaf = JSON.stringify({id: `${keeperVitality}.leaf`});
const done = (state, operation) => state.actors.player.completed[`${keeperVitality}.${operation}`] ?? 0;
const pinned = record => record?.extensions?.some(pin => pin.id === keeperVitality);

function readGarden(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 512) throw Error('Invalid vitality garden record.');
    const row = JSON.parse(raw);
    const {plant, grownAt, treatedAt} = row;
    const valid = at => at === null || Number.isSafeInteger(at) && at >= 0 && at <= state.clock;
    if (plant?.id !== plantId || plant.kind !== 'vitality-grass' || ![steward, 'player'].includes(plant.holder) ||
        plant.alive !== true || !Number.isSafeInteger(plant.leaves) || plant.leaves < 0 ||
        plant.leaves > vitalityGrass.capacity || !valid(grownAt) || !valid(treatedAt)) {
        throw Error('The vitality garden needs its living plant and treatment record.');
    }
    return row;
}

function daylight(state, context) {
    const frame = context?.nativeWeatherClock;
    if (!Number.isSafeInteger(frame?.minute) || !Number.isSafeInteger(frame.clock)) return false;
    const minute = frame.minute + state.clock - frame.clock;
    const hour = ((minute % 1440) + 1440) % 1440;
    return hour >= 6 * 60 && hour < 18 * 60;
}

function remaining(now, since, minutes) {
    return since == null ? 0 : Math.max(0, since + minutes - now);
}

function options(state, row, context) {
    const stewardHere = state.simulation.people[steward]?.life === 'alive' && state.simulation.people[steward].location === annex;
    const held = row?.plant.holder === 'player';
    const health = context?.vitals?.player;
    return {borrow_grass: stewardHere && !held, return_grass: stewardHere && held,
        grow_leaf: held && row.plant.leaves < vitalityGrass.capacity && daylight(state, context) &&
            !remaining(state.clock, row.grownAt, leafGrowthMinutes),
        harvest_leaf: held && row.plant.leaves > 0,
        treat_leaf: !!row && health?.health < health?.max_health && !remaining(state.clock, row.treatedAt, vitalityLeaf.restMinutes)};
}

export function keeperVitalityFacts(state, context) {
    return Object.fromEntries(Object.entries(options(state, readGarden(state), context))
        .map(([operation, ready]) => [`${keeperVitality}.can_${operation}`, !!ready]));
}

export function keeperVitalityView(state, record) {
    if (!pinned(record)) return null;
    const row = readGarden(state);
    return row && {held: row.plant.holder === 'player', leaves: row.plant.leaves, capacity: vitalityGrass.capacity,
        growthWait: remaining(state.clock, row.grownAt, leafGrowthMinutes),
        treatmentWait: remaining(state.clock, row.treatedAt, vitalityLeaf.restMinutes),
        detached: done(state, 'harvest_leaf') - done(state, 'sell_leaf') - done(state, 'treat_leaf')};
}

export function validateKeeperVitality(state, record, inventory) {
    const row = readGarden(state);
    const borrows = done(state, 'borrow_grass'), returns = done(state, 'return_grass');
    const grown = done(state, 'grow_leaf'), harvested = done(state, 'harvest_leaf');
    const used = done(state, 'treat_leaf'), sold = done(state, 'sell_leaf');
    const item = inventory?.[keeperVitalityLeaf];
    if (Boolean(row) !== (borrows > 0) || (item?.count ?? item ?? 0) !== harvested - used - sold ||
        (!row && (returns || grown || harvested || used || sold)) ||
        (row && (!pinned(record) || borrows - returns !== Number(row.plant.holder === 'player') ||
            row.plant.leaves !== grown - harvested || (row.grownAt !== null) !== (grown > 0) ||
            (row.treatedAt !== null) !== (used > 0)))) {
        throw Error('The vitality plant, harvested leaves and use receipts disagree.');
    }
}

export function applyKeeperVitalityEffect(state, {operation}, context) {
    if (context.actorId !== 'player' || !pinned(context.structuredNative) || state.actors.player?.worldId !== world ||
        state.simulation.people.player.location !== annex) throw Error('Work at the Gu house vitality garden.');
    const row = readGarden(state);
    if (!options(state, row, context)[operation]) throw Error('The vitality garden is not ready for that action.');
    const next = row ?? {plant: {id: plantId, kind: 'vitality-grass', alive: true, holder: steward, leaves: 0},
        grownAt: null, treatedAt: null};
    if (operation === 'borrow_grass' || operation === 'return_grass') {
        next.plant.holder = operation === 'borrow_grass' ? 'player' : steward;
    } else if (operation === 'grow_leaf') {
        next.plant = growVitalityLeaf(next.plant, {operator: 'player', daylight: daylight(state, context),
            water: vitalityGrass.waterCost, essence: vitalityGrass.essenceCost, clock: state.clock}).plant;
        next.grownAt = state.clock;
    } else if (operation === 'harvest_leaf') {
        next.plant = detachVitalityLeaf(next.plant, 'player');
    } else {
        next.treatedAt = state.clock;
    }
    state.worlds[world].facts[key] = JSON.stringify(next);
    return operation === 'harvest_leaf' ? {key: keeperVitalityLeaf, count: 1} : null;
}
