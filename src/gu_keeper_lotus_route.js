// The keeper's Monarch Lotus route. Its one ledger is a namespaced fact in the
// existing expansion world save slice; the native energy and recipe knowledge
// stay with their existing save owners. Prices and times below are authored
// dials, not values supplied by Reverend Insanity (ri:ch163:p24, ri:ch308:p93).
import {beginGuRefinement, observeGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';
import {registerGuRefiner} from './gu_refiner_registry.js';
import {LOTUS_AMOUNT} from './world_packs/gu_lotus_essence_case.js';

export const keeperLotus = 'book.ri.keeper.lotus_route';
export const lotusWorld = 'book.ri.keeper.world';
export const lotusLedgerKey = `${keeperLotus}.ledger`;
export const lotusRecipeKey = `${keeperLotus}.recipe`;
export const LOTUS_DIALS = Object.freeze({precursorStones: 2, recipeStones: 2, springStones: 1,
    trailMinutes: 60, springDutyMinutes: 60, stageMinutes: 15, useCadenceMinutes: 1440});
// Seven distinct springs are an authored mapping of the lore's seven-spring
// input. Each has one charge, an outside-settlement custodian and a water duty.
export const LOTUS_SPRINGS = Object.freeze([
    ['willow', 'Aunt Shen', 'clear the willow channel'],
    ['stone', 'Old Qiao', 'carry stones from the sluice'],
    ['reed', 'Sister Lan', 'cut reeds from the overflow'],
    ['pine', 'Uncle Bai', 'mend the pine gate'],
    ['moss', 'Keeper Fen', 'scrape moss from the lip'],
    ['crane', 'Madam Yu', 'clean the crane pool'],
    ['dawn', 'Brother Tao', 'haul water at dawn'],
].map(([id, custodian, obligation]) => Object.freeze({id, custodian, obligation,
    material: `${keeperLotus}.spring.${id}`})));
const precursorKey = `${keeperLotus}.precursor`;
const productKey = `${keeperLotus}.monarch`;
const precursorKind = 'heavenly-essence-treasure-lotus';
const productKind = 'heavenly-essence-treasure-monarch-lotus';
const jobId = `${keeperLotus}.advance`;
const steward = 'book.ri.keeper.steward';
const pool = 'energy:primeval.rank1.initial';
const energyId = 'book.ri.keeper.primeval';
const recipe = Object.freeze({id: `${keeperLotus}.recipe`, revision: 1, kind: productKind, rank: 4,
    uniqueKey: productKey, precursorKind, stages: LOTUS_SPRINGS.map((spring, index) => ({id: `spring-${index + 1}`,
        inputs: [{material: spring.material, amount: 1}]}))});
const initial = () => ({schema: 1, world: {gu: [{id: precursorKey, kind: precursorKind, rank: 3,
    uniqueKey: precursorKey, alive: true, holder: steward}], attempts: [],
    stocks: {player: Object.fromEntries(LOTUS_SPRINGS.map(s => [s.material, 0]))}},
    springs: Object.fromEntries(LOTUS_SPRINGS.map(s => [s.id, null])),
    startedAt: null, lastStageAt: null, lastUseAt: null});
const done = (state, operation) => state.actors.player.completed[`${keeperLotus}.${operation}`] ?? 0;
const held = row => livingGuClaim(row.world, productKey)?.holder === 'player';
const job = row => row.world.attempts[0];
const source = state => state.worlds[lotusWorld]?.facts?.[lotusLedgerKey];

export function readKeeperLotus(state) {
    const raw = source(state);
    if (raw === undefined) return initial();
    if (typeof raw !== 'string' || raw.length > 12000) throw Error('Invalid Monarch Lotus ledger.');
    const row = JSON.parse(raw);
    if (row.schema !== 1) throw Error('Unknown Monarch Lotus ledger version.');
    return row;
}

export function keeperLotusOptions(state) {
    const row = readKeeperLotus(state), current = job(row), precursor = livingGuClaim(row.world, precursorKey);
    const knowledge = state.simulation.knowledge.player?.[lotusRecipeKey]?.stage === 'understood';
    const allSprings = LOTUS_SPRINGS.every(s => row.springs[s.id] !== null);
    const energy = state.simulation.energies.player?.[energyId];
    const options = {buy_precursor: precursor?.holder === steward, buy_recipe: !knowledge,
        begin: precursor?.holder === 'player' && knowledge && allSprings && !current,
        use: held(row) && energy && energy.reserve < energy.policy.capacity &&
            (row.lastUseAt === null || state.clock - row.lastUseAt >= LOTUS_DIALS.useCadenceMinutes)};
    for (const spring of LOTUS_SPRINGS) options[`draw_${spring.id}`] =
        precursor?.holder === 'player' && knowledge && !current && row.springs[spring.id] === null;
    for (let i = 1; i <= 7; i++) options[`stage_${i}`] = current?.status === 'working' && current.cursor === i - 1 &&
        state.clock - row.lastStageAt >= LOTUS_DIALS.stageMinutes;
    return options;
}

export function keeperLotusFacts(state, context) {
    if (context.actorId !== 'player' || state.actors.player?.worldId !== lotusWorld) return {};
    return Object.fromEntries(Object.entries(keeperLotusOptions(state)).map(([name, ready]) => [`${keeperLotus}.can_${name}`, !!ready]));
}

export function keeperLotusView(state) {
    const row = readKeeperLotus(state), progress = observeGuRefinement(row.world, jobId, 'player');
    const specimen = livingGuClaim(row.world, productKey);
    return {precursor: livingGuClaim(row.world, precursorKey)?.holder === 'player',
        recipe: state.simulation.knowledge.player?.[lotusRecipeKey]?.stage === 'understood',
        springs: LOTUS_SPRINGS.map(s => ({id: s.id, custodian: s.custodian, spent: row.springs[s.id] !== null})),
        progress: progress && {stage: progress.stage, status: progress.status,
            remaining: progress.status === 'working' ? Math.max(0, row.lastStageAt + LOTUS_DIALS.stageMinutes - state.clock) : 0},
        held: specimen?.holder === 'player', rank: specimen?.rank ?? null,
        nextUseIn: row.lastUseAt === null ? 0 : Math.max(0, row.lastUseAt + LOTUS_DIALS.useCadenceMinutes - state.clock)};
}

export function validateKeeperLotus(state, record) {
    const used = ['buy_precursor', 'buy_recipe', 'begin', 'use', ...LOTUS_SPRINGS.map(s => `draw_${s.id}`),
        ...Array.from({length: 7}, (_, i) => `stage_${i + 1}`)].some(op => done(state, op));
    if (!used && source(state) === undefined) return;
    if (!record?.extensions?.some(pin => pin.id === keeperLotus)) throw Error('Monarch Lotus route lacks its permission.');
    const row = readKeeperLotus(state), {gu, attempts, stocks} = validateGuClaims(row.world);
    const precursor = gu.find(g => g.id === precursorKey), monarch = livingGuClaim(row.world, productKey);
    const attempt = attempts[0];
    const at = n => Number.isSafeInteger(n) && n >= record.initializedAt && n <= state.clock;
    const draws = LOTUS_SPRINGS.reduce((sum, s) => sum + done(state, `draw_${s.id}`), 0);
    if (gu.length !== 1 || precursor?.kind !== (monarch ? productKind : precursorKind) ||
        precursor.rank !== (monarch ? 4 : 3) ||
        precursor.holder !== (done(state, 'buy_precursor') ? 'player' : steward) ||
        done(state, 'buy_precursor') > 1 || done(state, 'buy_recipe') > 1 ||
        !!state.simulation.knowledge.player?.[lotusRecipeKey] !== !!done(state, 'buy_recipe') ||
        LOTUS_SPRINGS.some(s => done(state, `draw_${s.id}`) > 1 ||
            (row.springs[s.id] === null) !== !done(state, `draw_${s.id}`) ||
            row.springs[s.id] !== null && !at(row.springs[s.id]) ||
            stocks.player?.[s.material] !== (done(state, `draw_${s.id}`) - (attempt ? 1 : 0))) ||
        attempts.length !== done(state, 'begin') || attempts.length > 1 ||
        (attempt && (JSON.stringify(attempt.recipe) !== JSON.stringify(recipe) || attempt.refiner !== 'player' ||
            attempt.precursor !== precursorKey || attempt.id !== jobId ||
            attempt.cursor !== Array.from({length: 7}, (_, i) => done(state, `stage_${i + 1}`)).reduce((a,b) => a+b,0) ||
            !['working', 'complete'].includes(attempt.status) ||
            (attempt.status === 'complete') !== !!monarch || !at(row.startedAt) || !at(row.lastStageAt))) ||
        (!attempt && (row.startedAt !== null || row.lastStageAt !== null || draws === 7 && done(state, 'use'))) ||
        (monarch && (monarch.kind !== productKind || monarch.rank !== 4 || monarch.holder !== 'player' || !monarch.alive ||
            monarch.id !== precursorKey || monarch.fate !== undefined)) ||
        done(state, 'use') > 0 && (!monarch || !at(row.lastUseAt)) ||
        done(state, 'use') === 0 && row.lastUseAt !== null) throw Error('Monarch Lotus custody, springs or stages disagree.');
}

function settle(state, effect, context) {
    if (state.simulation.people.player.location !== (effect.operation.startsWith('draw_') ? `${keeperLotus}.trail` : 'book.ri.keeper.annex') ||
        !keeperLotusOptions(state)[effect.operation]) throw Error('The Lotus route changed before this action.');
    const row = readKeeperLotus(state), operation = effect.operation, extra = [];
    if (operation === 'buy_precursor') row.world = transferGuClaim(row.world, {key: precursorKey, from: steward, to: 'player'});
    else if (operation === 'buy_recipe') extra.push({type: 'knowledge', actor: 'player', key: lotusRecipeKey,
        stage: 'understood', value: 'The rank-four Monarch Lotus recipe needs the living rank-three precursor and seven spring charges.'});
    else if (operation.startsWith('draw_')) {
        const spring = LOTUS_SPRINGS.find(s => operation === `draw_${s.id}`);
        row.springs[spring.id] = state.clock;
        row.world.stocks.player[spring.material] = 1;
    } else if (operation === 'begin') {
        row.world = beginGuRefinement(row.world, {id: jobId, refiner: 'player', precursor: precursorKey, recipe, at: state.clock});
        row.startedAt = state.clock; row.lastStageAt = state.clock;
    } else if (operation.startsWith('stage_')) {
        row.world = stepGuRefinement(row.world, jobId);
        row.lastStageAt = state.clock;
    } else if (operation === 'use') {
        const energy = state.simulation.energies.player[energyId];
        // The case sentence lands once per use through the played-effects tick (ENTRY_POINTS, keeper-monarch-lotus);
        // landing it here too would record the same use twice. The native energy owner applies the same amount.
        extra.push({type: 'energy', actor: 'player', energyId, operation: 'recover',
            amount: Math.min(LOTUS_AMOUNT, energy.policy.capacity - energy.reserve)});
        row.lastUseAt = state.clock;
    }
    return [{type: 'fact', actor: 'player', scope: 'world', key: lotusLedgerKey, value: JSON.stringify(row)}, ...extra];
}

export const LOTUS_OPERATIONS = Object.freeze(['buy_precursor', 'buy_recipe', ...LOTUS_SPRINGS.map(s => `draw_${s.id}`),
    'begin', ...Array.from({length: 7}, (_, i) => `stage_${i + 1}`), 'use']);
registerGuRefiner(lotusWorld, {pack: keeperLotus, operations: LOTUS_OPERATIONS, consequences: settle});
