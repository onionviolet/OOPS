import {fixedImmortalTravel} from './gu_fixed_immortal_travel.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {destroyGuClaim} from './gu_world_claims.js';
import {armGuDestruction, markedGu, settleGuDestruction, stabilizeGuDestruction} from './gu_restoration.js';
import {resolveGuActivation} from './gu_activation.js';
import {readKeeperFixedClaim, keeperFixedClaimAt, writeKeeperFixedClaim, keeperFixedSpecimen,
    beginFixedRival, fixedClaimOriginal, fixedClaimRival, fixedClaimSteward, fixedForgeMaterial as material, fixedForgeMinutes,
    fixedGuSeated, fixedReforgeRecipe as reforge, fixedScoutDelay, fixedWatchBoundary, latestFixedRival as latest,
    nextFixedWatchBoundary} from './gu_keeper_fixed_claim.js';
import {fixedTravelAnnex, fixedTravelHill, fixedTravelCost, quoteKeeperFixedTravel} from './gu_keeper_immortal_travel.js';
import {applyTransitHouse, keeperTransitHouse, transitHouseActions, transitHouseOptions, transitHouseView,
    validateTransitHouse} from './gu_keeper_transit_house.js';

export const keeperFixedForge = 'book.ri.keeper.fixed_forge';
export const keeperGuRestoration = 'book.ri.keeper.gu_as_before';
export const keeperFixedWatch = 'book.ri.keeper.fixed_watch';
export const keeperFixedForgeWorld = 'book.ri.keeper.world';
export {fixedForgeMinutes};
export const fixedForgeDose = JSON.stringify({id: `${keeperFixedForge}.red_date`});
const operations = ['raise', 'commission', 'settle', 'destroy', 'travel_out', 'travel_back'];
const restoration = ['reveal_mark', 'stabilize', 'tend'];
export const markMinutes = 20;
export const restorationCareMinutes = 20;
const form = {revision: 1, kind: fixedImmortalTravel, uniqueKey: fixedImmortalTravel,
    stages: [{id: 'quench', inputs: [{material, amount: 1}]}]};
const raise = {...form, id: 'raise-fixed-travel', rank: 7, precursorKind: fixedImmortalTravel};
export function keeperFixedForgeEffectPack(operation) {
    if (operations.includes(operation)) return keeperFixedForge;
    if (transitHouseActions.includes(operation)) return keeperTransitHouse;
    if (operation === 'watch_smoke') return keeperFixedWatch;
    return restoration.includes(operation) ? keeperGuRestoration : null;
}
const pinned = (record, pack = keeperFixedForge) => record?.extensions?.some(pin => pin.id === pack);
const done = (state, operation) => state.actors.player.completed[`${keeperFixedForgeEffectPack(operation)}.${operation}`] ?? 0;
const smoke = world => !latest(world) ? 'quiet' : latest(world).status === 'working' ? 'stoked' : 'banked';

export function isKeeperFixedForgeEffect(effect) {
    return effect.type === 'guFixedForge' && effect.actor === 'player' && keeperFixedForgeEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

function availability(state, world) {
    const gu = keeperFixedSpecimen(world);
    const job = latest(world);
    const held = gu?.holder === 'player';
    const rankSeven = held && gu.rank === 7;
    const mark = world?.destructionMark;
    const target = markedGu(world);
    const steward = state.simulation.people[fixedClaimSteward];
    const accessible = target?.alive && (target.holder === 'player' ||
        target.holder === fixedClaimSteward && steward?.life === 'alive' && steward.location === fixedTravelAnnex);
    return {raise: held && gu.rank === 6 && !gu.injured && !fixedGuSeated(world, gu), commission: !!world && (!job || job.reportedAt !== undefined),
        settle: !!job && job.status !== 'working' && job.reportedAt === undefined,
        destroy: rankSeven, travel_out: rankSeven && quoteKeeperFixedTravel(state, gu, fixedTravelHill, 7).spent === fixedTravelCost,
        travel_back: rankSeven && quoteKeeperFixedTravel(state, gu, fixedTravelAnnex, 7).spent === fixedTravelCost,
        reveal_mark: held && gu.id === fixedClaimOriginal && !mark,
        stabilize: accessible && mark.status === 'pending',
        tend: accessible && mark.status === 'stabilized' && target.injured && state.clock >= mark.endedAt + restorationCareMinutes,
        watch_smoke: !!world?.rivalWatch && smoke(world) !== world.rivalWatch.observed,
        ...transitHouseOptions(state, world)};
}

export function keeperFixedForgeFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperFixedForgeWorld) return {};
    return Object.fromEntries(Object.entries(availability(state, keeperFixedClaimAt(state)))
        .map(([op, allowed]) => [`${keeperFixedForgeEffectPack(op)}.can_${op}`, !!allowed]));
}

function validateRestoration(state, record, world) {
    const mark = world?.destructionMark;
    const reveals = done(state, 'reveal_mark'), stabilizations = done(state, 'stabilize'), treatments = done(state, 'tend');
    if (!mark && !reveals && !stabilizations && !treatments) return;
    const gu = markedGu(world);
    if (!mark || !pinned(record, keeperGuRestoration) || reveals !== 1 || mark.specimen !== fixedClaimOriginal ||
        !Number.isSafeInteger(mark.armedAt) || mark.armedAt < record.initializedAt || mark.armedAt > state.clock ||
        mark.dueAt !== mark.armedAt + markMinutes || !['pending', 'stabilized', 'detonated', 'lost'].includes(mark.status) ||
        stabilizations !== Number(mark.status === 'stabilized') || treatments > stabilizations ||
        (mark.status === 'pending' ? !gu?.alive || !gu.injured || mark.endedAt !== undefined :
            !Number.isSafeInteger(mark.endedAt) || mark.endedAt < mark.armedAt || mark.endedAt > state.clock ||
            (mark.status === 'detonated' ? mark.endedAt !== mark.dueAt || gu?.alive :
                mark.endedAt >= mark.dueAt || mark.status === 'lost' && gu?.alive)) ||
        mark.status === 'stabilized' && (Boolean(gu?.injured) === Boolean(treatments) ||
            treatments && state.clock < mark.endedAt + restorationCareMinutes)) {
        throw Error('The formation needs matching mark, injury and treatment receipts.');
    }
}

export function validateKeeperFixedForge(state, record) {
    const world = readKeeperFixedClaim(state);
    validateRestoration(state, record, world);
    validateTransitHouse(state, record, world);
    if (!world && !operations.some(op => done(state, op))) return;
    const raised = world?.attempts.filter(job => job.refiner === 'player') ?? [];
    const rivals = world?.attempts.filter(job => job.refiner === fixedClaimRival) ?? [];
    const initiative = rivals.filter(job => job.initiative === true);
    validateRivalWatch(state, record, world, initiative);
    const destroyed = world?.gu.filter(gu => !gu.alive).length ?? 0;
    const forged = raised.length + rivals.length + destroyed;
    if (!world || (forged > 0 || operations.some(op => done(state, op))) && !pinned(record) ||
        raised.length + rivals.length !== world.attempts.length || raised.length !== done(state, 'raise') ||
        rivals.length - initiative.length !== done(state, 'commission') || destroyed !== done(state, 'destroy') + Number(world.destructionMark?.status === 'detonated') ||
        world.gu.filter(gu => gu.rank === 7).length !== raised.length ||
        world.gu.length !== 1 + rivals.filter(job => job.status === 'complete').length ||
        rivals.filter(job => job.reportedAt !== undefined).length !== done(state, 'settle') ||
        raised.some((job, index) => job.id !== `fixed-raise-${index + 1}` || job.status !== 'complete' ||
            job.product !== job.precursor || JSON.stringify(job.recipe) !== JSON.stringify(raise) ||
            !world.gu.some(gu => gu.id === job.product && gu.rank === 7)) ||
        rivals.some((job, index) => job.id !== `fixed-rival-${index + 1}` ||
            ![undefined, true].includes(job.initiative) ||
            JSON.stringify(job.recipe) !== JSON.stringify(reforge) || !Number.isSafeInteger(job.startedAt) ||
            job.startedAt < 0 || job.startedAt > state.clock ||
            (job.reportedAt === undefined ? index !== rivals.length - 1 :
                job.status === 'working' || !Number.isSafeInteger(job.reportedAt) ||
                job.reportedAt < job.startedAt + fixedForgeMinutes || job.reportedAt > state.clock) ||
            job.status === 'complete' && !world.gu.some(gu => gu.id === job.product && gu.id === job.id))) {
        throw Error('Fixed Immortal Travel needs matching loan, advancement and rival receipts.');
    }
}

function validateRivalWatch(state, record, world, initiative) {
    const watch = world?.rivalWatch;
    const checked = done(state, 'watch_smoke');
    const wake = nextFixedWatchBoundary(state);
    if (wake !== fixedWatchBoundary(world) || wake <= state.clock ||
        !watch && (initiative.length || checked) ||
        watch && (!pinned(record, keeperFixedWatch) || !world.destructionMark ||
            watch.checkAt !== world.destructionMark.dueAt + fixedScoutDelay ||
            !['waiting', 'occupied', 'busy', 'started'].includes(watch.status) ||
            (watch.status === 'waiting') !== (watch.checkAt > state.clock) ||
            watch.stock !== Number(watch.status !== 'started') || initiative.length !== Number(watch.status === 'started') ||
            initiative.some(job => job.startedAt !== watch.checkAt) ||
            (!!watch.observed !== (checked > 0)) || watch.observed && !['quiet', 'stoked', 'banked'].includes(watch.observed))) {
        throw Error('The distant furnace needs its scouting and work receipts.');
    }
}

export function keeperFixedForgeView(state, record, inventory) {
    if (!pinned(record)) return null;
    const world = keeperFixedClaimAt(state);
    const job = latest(world);
    const mark = world?.destructionMark;
    const seen = !job?.initiative || !!job.reportedAt || world.rivalWatch?.observed === 'stoked';
    return {status: seen ? job?.reportedAt === undefined && job ? 'working' : job?.status : undefined,
        wait: seen && job?.status === 'working' ? Math.max(0, job.startedAt + fixedForgeMinutes - state.clock) : 0,
        doses: inventory[fixedForgeDose] ?? 0,
        ...(pinned(record, keeperFixedWatch) && world?.rivalWatch && {furnace: world.rivalWatch.observed ?? 'unseen'}),
        ...(pinned(record, keeperTransitHouse) && {house: transitHouseView(state, world)}),
        ...(pinned(record, keeperGuRestoration) && mark && {mark: {status: mark.status,
            wait: mark.status === 'pending' ? mark.dueAt - state.clock : 0,
            injured: markedGu(world)?.alive && markedGu(world).injured}})};
}

function runRestoration(state, world, operation, record) {
    const {clock} = state;
    if (operation === 'reveal_mark') {
        const marked = armGuDestruction(world, {specimen: fixedClaimOriginal, now: clock, delay: markMinutes});
        return pinned(record, keeperFixedWatch) ? {...marked, rivalWatch: {
            checkAt: marked.destructionMark.dueAt + fixedScoutDelay, status: 'waiting', stock: 1}} : marked;
    }
    const gu = markedGu(world);
    if (operation === 'stabilize') {
        const stages = ['time', 'refinement', 'rule'].map(path => ({operator: 'player',
            gu: {id: `formation-${path}`, kind: `formation-${path}`, rank: 6, fedThrough: clock},
            ability: {path, fuel: 'immortal', cost: 1}}));
        const formed = resolveGuActivation({beats: [{stages}], reserves: {player: {immortal: 3}}, day: clock,
            completionEffect: {kind: 'strip-destructive-mark'}});
        if (formed.effects[0]?.kind !== 'strip-destructive-mark') throw Error('The formation failed to strip the mark.');
        return stabilizeGuDestruction(world, {specimen: gu.id, now: clock});
    }
    return {...world, gu: world.gu.map(row => row.id === gu.id ? {...row, injured: false} : row)};
}

function funded(world, actor) {
    return {...world, stocks: {...world.stocks, [actor]: {[material]: 1}}};
}

export function applyKeeperFixedForgeEffect(state, effect, context) {
    const {operation} = effect;
    const world = keeperFixedClaimAt(state);
    const location = ['travel_back', 'watch_smoke'].includes(operation) ? fixedTravelHill : fixedTravelAnnex;
    if (!isKeeperFixedForgeEffect(effect) || !pinned(context.structuredNative) ||
        !pinned(context.structuredNative, keeperFixedForgeEffectPack(operation)) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperFixedForgeWorld || state.simulation.people.player.location !== location ||
        !availability(state, world)[operation]) throw Error('The Fixed Immortal Travel forge or crossing is unavailable.');
    if (operation === 'travel_out' || operation === 'travel_back') return;
    let next;
    if (transitHouseActions.includes(operation)) {
        next = applyTransitHouse(state, world, operation);
    } else if (restoration.includes(operation)) {
        next = runRestoration(state, world, operation, context.structuredNative);
    } else if (operation === 'watch_smoke') {
        next = {...world, rivalWatch: {...world.rivalWatch, observed: smoke(world)}};
    } else if (operation === 'raise') {
        const id = `fixed-raise-${done(state, operation) + 1}`;
        next = stepGuRefinement(beginGuRefinement(funded(world, 'player'), {id, refiner: 'player',
            recipe: raise, precursor: keeperFixedSpecimen(world).id}), id);
    } else if (operation === 'commission') {
        next = beginFixedRival(funded(world, fixedClaimRival), state.clock);
    } else if (operation === 'settle') {
        next = world;
        latest(next).reportedAt = state.clock;
    } else {
        next = settleGuDestruction(destroyGuClaim(world, {key: fixedImmortalTravel, holder: 'player'}), state.clock);
    }
    writeKeeperFixedClaim(state, next);
}
