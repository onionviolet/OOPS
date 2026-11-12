import {fixedImmortalTravel} from './gu_fixed_immortal_travel.js';
import {livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {settleGuDestruction} from './gu_restoration.js';

export const fixedClaimWorld = 'book.ri.keeper.world';
export const fixedClaimSteward = 'book.ri.keeper.steward';
export const fixedClaimOriginal = 'book.ri.keeper.fixed_immortal_travel.specimen';
export const fixedClaimRival = 'fixed-travel-distant-refiner';
export const fixedForgeMinutes = 30;
export const fixedScoutDelay = 5;
export const fixedForgeMaterial = 'fixed-travel-forge-stock';
export const fixedReforgeRecipe = {revision: 1, kind: fixedImmortalTravel, uniqueKey: fixedImmortalTravel,
    stages: [{id: 'quench', inputs: [{material: fixedForgeMaterial, amount: 1}]}], id: 'reforge-fixed-travel', rank: 6};
const key = 'book.ri.keeper.fixed_immortal_travel.claim';
const wakeKey = `${key}.watch_wake`;

// Earlier travel saves already used this key. The forge adds attempts to
// the same snapshot, so neither route needs a parallel source of custody.
export function readKeeperFixedClaim(state) {
    const raw = state.worlds[fixedClaimWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Fixed Immortal Travel claim.');
    const world = validateGuClaims(JSON.parse(raw));
    if (!world.gu.some(gu => gu.id === fixedClaimOriginal) ||
        world.gu.some(gu => gu.kind !== fixedImmortalTravel || gu.uniqueKey !== fixedImmortalTravel ||
            ![6, 7].includes(gu.rank) || !['player', fixedClaimSteward].includes(gu.holder) ||
            !gu.alive && gu.fate !== 'destroyed') ||
        world.attempts.some(job => !['working', 'failed', 'complete'].includes(job.status))) {
        throw Error('Fixed Immortal Travel needs its living claim and attempt history.');
    }
    return world;
}

export function writeKeeperFixedClaim(state, world) {
    validateGuClaims(world);
    const facts = state.worlds[fixedClaimWorld].facts;
    facts[key] = JSON.stringify(world);
    const next = fixedWatchBoundary(world);
    if (next === Infinity) delete facts[wakeKey];
    else facts[wakeKey] = next;
}

export function keeperFixedSpecimen(world) {
    return world && livingGuClaim(world, fixedImmortalTravel);
}

export function fixedGuSeated(world, gu) {
    return !!gu && world.house?.assembly?.core === gu.id;
}

export const latestFixedRival = world => world?.attempts.findLast(row => row.refiner === fixedClaimRival);

export function beginFixedRival(world, at, initiative = false) {
    const id = `fixed-rival-${world.attempts.filter(job => job.refiner === fixedClaimRival).length + 1}`;
    const next = beginGuRefinement(world, {id, refiner: fixedClaimRival, recipe: fixedReforgeRecipe});
    Object.assign(latestFixedRival(next), {startedAt: at, ...(initiative && {initiative: true})});
    return next;
}

function settleThrough(world, clock) {
    const job = latestFixedRival(world);
    if (job?.status === 'working' && clock >= job.startedAt + fixedForgeMinutes) {
        world = settleGuDestruction(world, job.startedAt + fixedForgeMinutes);
        world = stepGuRefinement(world, job.id);
        if (world.attempts.find(row => row.id === job.id).status === 'complete') {
            world = transferGuClaim(world, {key: fixedImmortalTravel, from: fixedClaimRival, to: fixedClaimSteward});
        }
    }
    return settleGuDestruction(world, clock);
}

// Keep legacy projection for old unobserved furnaces. The watched furnace
// also publishes these same transitions at the native clock boundary.
export function keeperFixedClaimAt(state) {
    let world = readKeeperFixedClaim(state);
    const watch = world?.rivalWatch;
    if (watch?.status === 'waiting' && watch.checkAt <= state.clock) {
        world = settleThrough(world, watch.checkAt);
        const latest = latestFixedRival(world);
        const status = keeperFixedSpecimen(world) ? 'occupied' : latest && latest.reportedAt === undefined ? 'busy' : 'started';
        if (status === 'started') {
            const stock = world.stocks[fixedClaimRival] ?? {};
            world = beginFixedRival({...world, stocks: {...world.stocks,
                [fixedClaimRival]: {...stock, [fixedForgeMaterial]: (stock[fixedForgeMaterial] ?? 0) + watch.stock}}}, watch.checkAt, true);
        }
        world = {...world, rivalWatch: {...watch, status, stock: status === 'started' ? 0 : watch.stock}};
    }
    return settleThrough(world, state.clock);
}

export function fixedWatchBoundary(world) {
    if (!world?.rivalWatch) return Infinity;
    const {rivalWatch: watch, destructionMark: mark} = world;
    const rival = latestFixedRival(world);
    return Math.min(watch.status === 'waiting' ? watch.checkAt : Infinity,
        mark?.status === 'pending' ? mark.dueAt : Infinity,
        rival?.status === 'working' ? rival.startedAt + fixedForgeMinutes : Infinity);
}

export function nextFixedWatchBoundary(state) {
    return state.worlds[fixedClaimWorld]?.facts?.[wakeKey] ?? Infinity;
}

export function advanceFixedWatch(state) {
    if (nextFixedWatchBoundary(state) > state.clock) return 0;
    writeKeeperFixedClaim(state, keeperFixedClaimAt(state));
    return 1;
}
