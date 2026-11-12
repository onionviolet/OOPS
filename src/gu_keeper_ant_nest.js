import {restoreCreatureLifecycle} from './creature_lifecycle.js';
import {antNestKind, antNestRank, antNestCost, antNestMaterial, antBroodRations, armyAntHabitat,
    armyAntCounts, armyAntBroodReady, produceArmyAnts, hatchArmyAntBrood, sendArmyAntSoldiers} from './gu_army_ants.js';
import {livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';

const prefix = 'book.ri.keeper';
export const keeperAntNest = `${prefix}.ant_nest`;
export const keeperAntWorld = `${prefix}.world`;
export const antBroodMinutes = 40;
export const antNiche = `${keeperAntNest}.niche`;
const annex = `${prefix}.annex`;
const steward = `${prefix}.steward`;
const specimen = `${keeperAntNest}.specimen`;
const key = `${keeperAntNest}.colony`;
const operations = ['borrow', 'return_loan', 'seed', 'brood', 'clear'];
const habitat = {...armyAntHabitat, id: `${keeperAntNest}.tray`};
const hasPin = record => record?.extensions?.some(pin => pin.id === keeperAntNest);
const done = (state, operation) => state.actors.player.completed[`${keeperAntNest}.${operation}`] ?? 0;

export function isKeeperAntNestEffect(effect) {
    return effect.type === 'guAntNest' && effect.actor === 'player' && operations.includes(effect.operation) &&
        Object.keys(effect).every(field => ['type', 'actor', 'operation'].includes(field));
}

function readColony(state) {
    const raw = state.worlds[keeperAntWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid army ant colony record.');
    const {world, lifecycle: saved} = JSON.parse(raw);
    validateGuClaims(world);
    const gu = livingGuClaim(world, antNestKind);
    const lifecycle = restoreCreatureLifecycle(saved);
    if (world.gu.length !== 1 || world.attempts.length || Object.keys(world.stocks).length ||
        gu?.id !== specimen || gu.kind !== antNestKind || gu.rank !== antNestRank || ![steward, 'player'].includes(gu.holder) ||
        Object.entries(lifecycle.cohorts).some(([id, cohort]) => cohort.habitat !== habitat.id ||
            id !== `${habitat.id}.${cohort.species.replace('army-ant-', '')}` || !habitat.supportedSpecies.includes(cohort.species)) ||
        Object.keys(lifecycle.individuals).length || Object.keys(lifecycle.broods).length || Object.keys(lifecycle.habitats).length) {
        throw Error('Ant Nest and the colony need their own living stock records.');
    }
    return {world, lifecycle};
}

function options(state, colony) {
    const p = state.simulation.people[steward];
    const present = p?.life === 'alive' && p.location === annex;
    const gu = colony && livingGuClaim(colony.world, antNestKind);
    const held = gu?.holder === 'player';
    const ants = colony && armyAntCounts(colony.lifecycle, habitat);
    return {borrow: present && !held, return_loan: present && held, seed: held && !ants.queen,
        brood: !!colony && armyAntBroodReady(colony.lifecycle, habitat),
        clear: ants?.soldier >= 2 && !done(state, 'clear'), enter: done(state, 'clear') > 0,
        salvage: done(state, 'clear') > 0 && !done(state, 'salvage')};
}

export function keeperAntNestFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperAntWorld) return {};
    return Object.fromEntries(Object.entries(options(state, readColony(state)))
        .map(([operation, allowed]) => [`${keeperAntNest}.can_${operation}`, !!allowed]));
}

export function validateKeeperAntNest(state, record) {
    const colony = readColony(state);
    const borrows = done(state, 'borrow'), returns = done(state, 'return_loan');
    const seeded = done(state, 'seed'), broods = done(state, 'brood'), clears = done(state, 'clear');
    if (!!colony !== (borrows > 0) || seeded > 1 || clears > 1 || done(state, 'salvage') > clears ||
        state.simulation.people.player.location === antNiche && clears !== 1 ||
        (!colony && (returns || seeded || broods || clears))) throw Error('Ant Nest needs its colony receipts.');
    if (!colony) return;
    const gu = livingGuClaim(colony.world, antNestKind);
    const ants = armyAntCounts(colony.lifecycle, habitat);
    if (!hasPin(record) || borrows - returns !== Number(gu.holder === 'player') || ants.queen !== seeded ||
        ants.worker !== seeded * 2 + broods || ants.soldier !== broods - clears ||
        ants.queen + ants.worker + ants.soldier > habitat.capacity) throw Error('Ant Nest needs its colony receipts.');
}

export function keeperAntNestView(state, record) {
    const colony = readColony(state);
    if (!colony || !hasPin(record)) return null;
    const job = state.simulation.jobs.find(job => job.commandId === `${keeperAntNest}.brood`);
    return {...armyAntCounts(colony.lifecycle, habitat), held: livingGuClaim(colony.world, antNestKind).holder === 'player',
        breeding: job ? Math.max(0, job.due - state.clock) : null, clear: done(state, 'clear') > 0};
}

export function applyKeeperAntNestEffect(state, effect, context) {
    const {operation} = effect;
    const colony = readColony(state);
    if (!isKeeperAntNestEffect(effect) || !hasPin(context.structuredNative) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperAntWorld || state.simulation.people.player.location !== annex ||
        !options(state, colony)[operation]) throw Error('Ant Nest or its colony is unavailable for that work.');
    const next = colony ?? {world: {gu: [{id: specimen, kind: antNestKind, rank: antNestRank,
        uniqueKey: antNestKind, alive: true, holder: steward}], attempts: [], stocks: {}}, lifecycle: restoreCreatureLifecycle(null)};
    if (operation === 'borrow' || operation === 'return_loan') {
        const [from, to] = operation === 'borrow' ? [steward, 'player'] : ['player', steward];
        next.world = transferGuClaim(next.world, {key: antNestKind, from, to});
    } else if (operation === 'seed') {
        const gu = livingGuClaim(next.world, antNestKind);
        next.lifecycle = produceArmyAnts(next.lifecycle, {gu: {...gu, fedThrough: state.clock}, operator: 'player',
            reserve: antNestCost, material: antNestMaterial, now: state.clock, habitat}).lifecycle;
    } else if (operation === 'brood') {
        next.lifecycle = hatchArmyAntBrood(next.lifecycle, {ration: antBroodRations, habitat});
    } else {
        next.lifecycle = sendArmyAntSoldiers(next.lifecycle, habitat);
    }
    state.worlds[keeperAntWorld].facts[key] = JSON.stringify(next);
}
