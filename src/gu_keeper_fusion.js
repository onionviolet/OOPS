import {discoverMoonFusions, moonFusionAbility, moonFusionDose, moonFusionKinds, moonFusionMaterials,
    moonFusionSupply, testMoonFusion} from './gu_moon_fusions.js';
import {beginGuProjection, invokeProjectedGu} from './gu_projection.js';
import {beginGuRefinement, cancelGuRefinement, previewGuRefinementProduct, stepGuRefinement} from './gu_refinement.js';
import {validateGuClaims} from './gu_world_claims.js';

const prefix = 'book.ri.keeper';
export const keeperFusion = `${prefix}.moon_fusion`;
export const keeperFusionTime = `${prefix}.moon_fusion_time`;
export const keeperFusionVital = `${prefix}.moon_fusion_vital`;
export const keeperFusionWorld = `${prefix}.world`;
export const fusionWait = 20;
export const fusionRecovery = 30;
export const fusionSealMinutes = 10;
const fact = `${keeperFusion}.bench`;
const starts = ['start_1', 'start_2', 'start_3'];
const operations = ['setup', 'research', ...starts, 'finish', 'rush', 'recover', 'replace', 'cast'];
const timeOperations = ['open_seal', 'cut_latch', 'cancel_fusion', 'bring_rescued'];
const vitalOperations = ['borrow_vital', 'return_vital'];
const rescuedId = 'fusion-rescued-light';
const vitalId = 'fusion-steward-vital';
const steward = `${prefix}.steward`;
const latchForce = 3;
export function keeperFusionEffectPack(operation) {
    if (operations.includes(operation)) return keeperFusion;
    if (vitalOperations.includes(operation)) return keeperFusionVital;
    return timeOperations.includes(operation) ? keeperFusionTime : null;
}
const pinned = (record, pack = keeperFusion) => record?.extensions?.some(pin => pin.id === pack);
const done = (state, op) => state.actors.player.completed[`${keeperFusionEffectPack(op) ?? keeperFusion}.${op}`] ?? 0;

export function isKeeperFusionEffect(effect) {
    return effect.type === 'guFusion' && effect.actor === 'player' && keeperFusionEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

const held = (gu, kind, id) => ({id, kind, rank: 1, holder: 'player', alive: true, ...gu});
const productOf = bench => bench?.world.gu.find(gu => gu.rank === 2 && gu.alive);
const attemptOf = bench => bench?.world.attempts.at(-1);
const at = (value, clock) => Number.isSafeInteger(value) && value >= 0 && value <= clock;
const rescuedGu = bench => bench?.world.gu.find(gu => gu.id === rescuedId);
const vitalGu = bench => bench?.world.gu.find(gu => gu.vitalMaster === steward);
const fusionPlans = bench => discoverMoonFusions(bench.world.gu, 'player', {vitalSuccessor: vitalGu(bench)?.id});
const activeSeal = (bench, clock) => bench?.future && bench.started !== null &&
    attemptOf(bench).id === bench.future.job && bench.future.openedAt + fusionSealMinutes > clock && !bench.future.cut;

function setup() {
    const gu = ['moonlight', 'little-light', 'little-light', 'stone-scar', 'groove-stone']
        .map((kind, index) => held({}, kind, `fusion-input-${index + 1}`));
    return {world: {gu, attempts: [], stocks: {player: {[moonFusionMaterials]: 0}}}, notes: [], started: null, failed: null, cast: null};
}

function readBench(state) {
    const raw = state.worlds[keeperFusionWorld]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Moonlight fusion bench.');
    const bench = JSON.parse(raw);
    validateGuClaims(bench.world);
    const attempt = attemptOf(bench), product = productOf(bench);
    const rescue = rescuedGu(bench);
    const vital = vitalGu(bench);
    const future = bench.future;
    const source = future && bench.world.attempts.find(job => job.id === future.job);
    if (!Array.isArray(bench.notes) || bench.notes.length > starts.length ||
        bench.world.gu.some(gu => (gu.holder !== 'player' && !((gu === rescue || gu === vital) && gu.holder === steward)) ||
            !Object.hasOwn(moonFusionKinds, gu.kind) || ![1, 2].includes(gu.rank)) ||
        bench.world.gu.filter(gu => gu.vitalMaster !== undefined).length !== Number(!!vital) ||
        Boolean(vital) !== bench.world.gu.some(gu => gu.id === vitalId && gu.kind === 'little-light') ||
        vital && vital.id !== vitalId && (vital !== product || vital.provenance?.ingredients?.lightB !== vitalId) ||
        bench.world.attempts.some(job => job.vitalSurvivors !== undefined &&
            (job.status !== 'failed' || !Array.isArray(job.vitalSurvivors) || job.vitalSurvivors.length !== 1 ||
                job.vitalSurvivors[0] !== vitalId || job.ingredients?.lightB !== vitalId)) ||
        (bench.started === null ? attempt?.status === 'working' : !at(bench.started, state.clock) || attempt?.status !== 'working') ||
        (bench.failed !== null && !at(bench.failed, state.clock)) ||
        product && (!product.traits || product.provenance?.recipe !== product.kind || attempt?.product !== product.id) ||
        bench.cast && (!product || bench.cast.power !== product.traits.power || bench.cast.reach !== product.traits.reach) ||
        future && (!source || !at(future.openedAt, state.clock) ||
            source.status === 'working' && future.openedAt < bench.started ||
            future.cut !== null && (!at(future.cut.at, state.clock) || future.cut.at < future.openedAt ||
                future.cut.at >= future.openedAt + fusionSealMinutes || future.cut.power !== source.recipe.productTraits?.power) ||
            Boolean(future.cut?.power >= latchForce) !== Boolean(rescue)) || !future && rescue ||
        rescue && (rescue.kind !== 'little-light' || rescue.rank !== 1)) {
        throw Error('The fusion bench needs matching specimens and procedure records.');
    }
    return bench;
}

function availability(state, bench) {
    const working = bench?.started != null;
    const product = productOf(bench);
    const gu = bench?.world.gu ?? [];
    const vital = vitalGu(bench);
    const master = state.simulation.people[steward];
    const masterHere = master?.life === 'alive' && master.location === `${prefix}.annex`;
    const ready = working && state.clock >= bench.started + fusionWait;
    const needsLight = !!bench && !working && !product && gu.filter(row =>
        row.alive && row.holder === 'player' && row.kind === 'little-light').length === 1;
    return {setup: !bench, research: !!bench && !working && !product,
        ...Object.fromEntries(starts.map((op, index) => [op, !working && !product && !!bench?.notes[index]])),
        finish: ready, rush: working && !ready,
        recover: bench?.failed != null && state.clock >= bench.failed + fusionRecovery && gu.some(gu => gu.alive && gu.injured),
        replace: needsLight,
        cast: product?.holder === 'player', take_dose: product?.holder === 'player' && !done(state, 'take_dose'),
        open_seal: working && !rescuedGu(bench) && bench.future?.job !== attemptOf(bench).id,
        cut_latch: !!activeSeal(bench, state.clock), cancel_fusion: working,
        bring_rescued: needsLight && rescuedGu(bench)?.holder === steward,
        borrow_vital: masterHere && (vital ? vital.alive && vital.holder === steward && (vital === product || needsLight) : needsLight),
        return_vital: masterHere && !working && vital?.alive === true && vital.holder === 'player'};
}

export function keeperFusionFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperFusionWorld) return {};
    return Object.fromEntries(Object.entries(availability(state, readBench(state)))
        .map(([operation, allowed]) => [`${keeperFusionEffectPack(operation) ?? keeperFusion}.can_${operation}`, allowed]));
}

export function validateKeeperFusion(state, record) {
    const bench = readBench(state);
    const attempts = starts.reduce((sum, op) => sum + done(state, op), 0);
    const vital = vitalGu(bench);
    if (!!bench !== (done(state, 'setup') === 1) || !bench && [...operations, ...timeOperations, ...vitalOperations].some(op => done(state, op)) ||
        bench && (!pinned(record) || bench.world.attempts.length !== attempts ||
            bench.world.attempts.filter(job => job.status === 'failed').length !== done(state, 'rush') ||
            bench.world.attempts.filter(job => job.status === 'cancelled').length !== done(state, 'cancel_fusion') ||
            Boolean(bench.future) !== (done(state, 'open_seal') > 0) ||
            (timeOperations.some(op => done(state, op)) && !pinned(record, keeperFusionTime)) ||
            (vital && !pinned(record, keeperFusionVital)) || Boolean(vital) !== (done(state, 'borrow_vital') > 0) ||
            done(state, 'borrow_vital') - done(state, 'return_vital') !== Number(vital?.holder === 'player') ||
            done(state, 'cut_latch') > done(state, 'open_seal') || bench.future?.cut && !done(state, 'cut_latch') ||
            done(state, 'bring_rescued') !== Number(rescuedGu(bench)?.holder === 'player') ||
            Number(!!productOf(bench)) !== done(state, 'finish') ||
            !!bench.cast !== (done(state, 'cast') > 0) || done(state, 'take_dose') > 1)) {
        throw Error('The fusion bench needs its preparation and cast receipts.');
    }
}

export function keeperFusionView(state, record) {
    const bench = pinned(record) && readBench(state);
    if (!bench) return null;
    const product = productOf(bench);
    const rescue = rescuedGu(bench);
    const vital = vitalGu(bench);
    return {plans: bench.notes.map(row => ({label: moonFusionKinds[row.recipe.kind].label,
        traits: row.recipe.productTraits, alternate: row.recipe.kind === 'etched-moon'})),
        product: product && moonFusionKinds[product.kind].label, cast: bench.cast,
        waiting: bench.started === null ? null : Math.max(0, bench.started + fusionWait - state.clock),
        recovering: bench.world.gu.some(gu => gu.alive && gu.injured) ? Math.max(0, bench.failed + fusionRecovery - state.clock) : null,
        destroyed: bench.world.gu.filter(gu => gu.fate === 'destroyed').map(gu => moonFusionKinds[gu.kind].label),
        ...(vital && {vital: {label: moonFusionKinds[vital.kind].label, rank: vital.rank,
            withSteward: vital.holder === steward, injured: !!vital.injured, alive: vital.alive,
            protected: bench.world.attempts.some(job => job.vitalSurvivors?.includes(vitalId))}}),
        ...(pinned(record, keeperFusionTime) && {future: {rescued: !!rescue, opened: !!bench.future, cut: bench.future?.cut?.power,
            brought: rescue?.holder === 'player', fate: rescue?.fate,
            remaining: activeSeal(bench, state.clock) ? bench.future.openedAt + fusionSealMinutes - state.clock : 0}})};
}

function cutFutureLatch(bench, clock) {
    const {job, openedAt} = bench.future;
    const gu = previewGuRefinementProduct(bench.world, job);
    if (!gu) throw Error('The seal can no longer reach the prepared fusion.');
    const ability = moonFusionAbility(gu);
    const operator = 'player';
    const projection = beginGuProjection({anchor: job, operator, now: openedAt, duration: fusionSealMinutes, rankLimit: 2,
        profile: {rank: gu.rank, capabilities: [{kind: gu.kind, rank: gu.rank, ability, supply: moonFusionSupply}],
            reserves: {[moonFusionSupply.pool]: moonFusionDose}}});
    const result = invokeProjectedGu({projection, anchor: job, operator, now: clock, kind: gu.kind});
    const hit = result.effects.find(effect => effect.kind === 'damage');
    if (!hit) throw Error('The future Moonblade failed to reach the latch.');
    bench.future.cut = {at: clock, power: hit.magnitude};
    if (hit.magnitude >= latchForce) bench.world.gu.push(held({holder: steward}, 'little-light', rescuedId));
}

export function applyKeeperFusionEffect(state, effect, context) {
    const {operation} = effect;
    const bench = readBench(state);
    if (!isKeeperFusionEffect(effect) || !pinned(context.structuredNative) ||
        !pinned(context.structuredNative, keeperFusionEffectPack(operation)) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperFusionWorld || state.simulation.people.player.location !== `${prefix}.annex` ||
        !availability(state, bench)[operation]) throw Error('This Moonlight fusion is unavailable.');
    const next = bench ?? setup();
    if (operation === 'research') next.notes = fusionPlans(next);
    else if (starts.includes(operation)) {
        const plan = next.notes[starts.indexOf(operation)];
        const found = fusionPlans(next).find(row => JSON.stringify(row) === JSON.stringify(plan));
        if (!found) throw Error('The written recipe needs its original ready ingredients.');
        const id = `moon-fusion-${next.world.attempts.length + 1}`;
        const funded = {...next.world, stocks: {player: {[moonFusionMaterials]: 1}}};
        next.world = stepGuRefinement(beginGuRefinement(funded, {...found, id, refiner: 'player'}), id);
        next.started = state.clock;
    } else if (operation === 'finish' || operation === 'rush') {
        next.world = stepGuRefinement(next.world, attemptOf(next).id, {controlFailed: operation === 'rush',
            isLivingMaster: master => state.simulation.people[master]?.life === 'alive'});
        next.started = null;
        next.notes = [];
        if (operation === 'rush') next.failed = state.clock;
    } else if (operation === 'open_seal') {
        next.future = {job: attemptOf(next).id, openedAt: state.clock, cut: null};
    } else if (operation === 'cut_latch') {
        cutFutureLatch(next, state.clock);
    } else if (operation === 'cancel_fusion') {
        next.world = cancelGuRefinement(next.world, attemptOf(next).id);
        next.started = null;
        next.notes = [];
    } else if (operation === 'bring_rescued') {
        rescuedGu(next).holder = 'player';
    } else if (operation === 'borrow_vital' || operation === 'return_vital') {
        const vital = vitalGu(next);
        if (vital) vital.holder = operation === 'borrow_vital' ? 'player' : steward;
        else next.world.gu.push(held({vitalMaster: steward}, 'little-light', vitalId));
        next.notes = [];
    } else if (operation === 'recover') {
        for (const gu of next.world.gu) if (gu.alive) delete gu.injured;
    } else if (operation === 'replace') {
        next.world.gu.push(held({}, 'little-light', `fusion-replacement-${done(state, 'replace') + 1}`));
    } else if (operation === 'cast') {
        const result = testMoonFusion(productOf(next), 'player', state.clock, moonFusionDose);
        const cut = result.effects.find(row => row.kind === 'damage');
        if (!cut) throw Error('The fused Gu could not cast.');
        next.cast = {power: cut.magnitude, reach: cut.range};
    }
    state.worlds[keeperFusionWorld].facts[fact] = JSON.stringify(next);
}
