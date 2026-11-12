import {beginGuRefinement, cancelGuRefinement, observeGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {address, drawFraction} from './gen_kit.js';
import {destroyGuClaim, livingGuClaim, transferGuClaim, validateGuClaims} from './gu_world_claims.js';

export const keeperRefinement = 'book.ri.keeper.immortal_refinement';
export const keeperAdvancement = 'book.ri.keeper.immortal_advancement';
export const keeperReclamation = 'book.ri.keeper.immortal_reclamation';
export const keeperRefinementWorld = 'book.ri.keeper.world';
const factKey = `${keeperRefinement}.attempt`;
const advanceKey = `${keeperAdvancement}.attempt`;
const worldKey = `${keeperReclamation}.world_ledger`;
const material = `${keeperRefinement}.luck_sand`;
export const keeperLuckSand = JSON.stringify({id: material});
export const refinementStageMinutes = 20;
export const refinementRivalMinutes = 90;
const rival = 'distant-refiner';
const playerJob = 'keeper-luck-refinement';
const rivalJob = 'rival-luck-refinement';
const advanceJob = 'keeper-advance-fortune-thread';
const steward = 'book.ri.keeper.steward';
const fortune = 'fortune-thread';
const recipe = {
    id: 'fortune-thread-refinement', revision: 1, kind: 'fortune-thread', rank: 6, uniqueKey: 'fortune-thread',
    stages: [
        {id: 'prepare', inputs: [{material, amount: 2}]},
        {id: 'finish', inputs: [{material, amount: 3}]},
    ],
};
export const keeperRefinementMaterials = recipe.stages.reduce((total, stage) => total + stage.inputs[0].amount, 0);
export const keeperAdvancementMaterials = 3;
export const advancementSettleMinutes = 30;
export const advancementQuenchRisk = 0.5;
const advancementRecipe = {...recipe, id: 'advance-fortune-thread', rank: 7, precursorKind: recipe.kind,
    stages: [{id: 'raise-rank', inputs: [{material, amount: keeperAdvancementMaterials}], onPrecursorControlFailure: 'destroy'}]};
const raceOperations = ['start', 'prepare', 'finish', 'cancel'];
const advanceOperations = ['advance_start', 'advance_finish', 'advance_quench', 'advance_cancel'];
const reclamationOperations = ['lend', 'recall', 'destroy', 'retry_start', 'retry_prepare', 'retry_finish', 'retry_cancel'];
const isRetry = job => job.id.startsWith('keeper-retry-');

export function keeperRefinementEffectPack(operation) {
    return raceOperations.includes(operation) ? keeperRefinement :
        advanceOperations.includes(operation) ? keeperAdvancement :
            reclamationOperations.includes(operation) ? keeperReclamation : null;
}

export function isKeeperRefinementEffect(effect) {
    return effect.type === 'guRefinement' && effect.actor === 'player' &&
        keeperRefinementEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(name => ['type', 'actor', 'operation'].includes(name));
}

function hasPin(record, id = keeperRefinement) {
    return record?.extensions?.some(pin => pin.id === id);
}

function readReceipt(state) {
    const raw = state.worlds[keeperRefinementWorld]?.facts?.[factKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 512) throw Error('Invalid refinement record.');
    const {start, prepared, end, action} = JSON.parse(raw);
    const at = value => Number.isSafeInteger(value) && value >= 0 && value <= state.clock;
    if (!at(start) || (prepared !== null && (!at(prepared) || prepared - start < refinementStageMinutes)) ||
        (action === null ? end !== null : !at(end) || end < (prepared ?? start) ||
            (action === 'finish' ? prepared === null || end - prepared < refinementStageMinutes : action !== 'cancel'))) {
        throw Error('The refinement work and its times disagree.');
    }
    return {start, prepared, end, action};
}

function readAdvancement(state) {
    const raw = state.worlds[keeperRefinementWorld]?.facts?.[advanceKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 256) throw Error('Invalid Immortal Gu advancement record.');
    const {start, end, action} = JSON.parse(raw);
    const at = value => Number.isSafeInteger(value) && value >= 0 && value <= state.clock;
    if (!at(start) || (action === null ? end !== null : !at(end) || end < start ||
        !advanceOperations.slice(1).includes(action) ||
        (action === 'advance_finish' && end - start < advancementSettleMinutes) ||
        (action === 'advance_quench' && end - start >= advancementSettleMinutes))) {
        throw Error('The Immortal Gu advancement times disagree.');
    }
    return {start, end, action};
}

// Replay authored stages in world-clock order. The rival settles first on ties.
function projectRefinement(receipt, clock, advancement, seed) {
    const {start, prepared, end, action} = receipt;
    let world = {gu: [], attempts: [], stocks: {
        player: {[material]: keeperRefinementMaterials}, [rival]: {[material]: keeperRefinementMaterials},
    }};
    world = beginGuRefinement(world, {id: playerJob, refiner: 'player', recipe});
    world = beginGuRefinement(world, {id: rivalJob, refiner: rival, recipe});
    const events = [
        {at: start + refinementStageMinutes, apply: world => stepGuRefinement(world, rivalJob)},
        {at: start + refinementRivalMinutes, apply: world => stepGuRefinement(world, rivalJob)},
        {at: prepared, apply: world => stepGuRefinement(world, playerJob)},
        {at: end, apply: world => action === 'finish' ? stepGuRefinement(world, playerJob) : cancelGuRefinement(world, playerJob)},
    ];
    if (advancement) {
        const controlFailed = advancement.action === 'advance_quench' &&
            drawFraction(seed, address(keeperAdvancement, 'quench', advancement.start)) < advancementQuenchRisk;
        events.push({at: advancement.start, apply: world => beginGuRefinement({
            ...world, stocks: {...world.stocks, player: {[material]: keeperAdvancementMaterials}},
        }, {id: advanceJob, refiner: 'player', recipe: advancementRecipe, precursor: playerJob})});
        events.push({at: advancement.end, apply: world => advancement.action === 'advance_cancel'
            ? cancelGuRefinement(world, advanceJob) : stepGuRefinement(world, advanceJob, {controlFailed})});
    }
    for (const event of events.filter(event => event.at !== null && event.at <= clock).sort((a, b) => a.at - b.at)) {
        world = event.apply(world);
    }
    return world;
}

function heldFortuneThread(world) {
    const specimen = livingGuClaim(world, fortune);
    return specimen?.holder === 'player' ? specimen : null;
}

function readLedger(state) {
    const raw = state.worlds[keeperRefinementWorld]?.facts?.[worldKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Fortune Thread world ledger.');
    const {world, retry, destroyed} = JSON.parse(raw);
    validateGuClaims(world);
    const attempts = new Set(world.attempts.map(job => job.id));
    const retries = world.attempts.filter(isRetry);
    const lastRetry = retries.at(-1);
    if (!attempts.has(playerJob) || !attempts.has(rivalJob) || attempts.size !== world.attempts.length ||
        !Number.isSafeInteger(destroyed) || destroyed < 0 || !!lastRetry !== !!retry ||
        (retry && (retry.id !== lastRetry?.id || !Number.isSafeInteger(retry.at) || retry.at < 0 || retry.at > state.clock)) ||
        retries.some((job, index) => job.id !== `keeper-retry-${index + 1}` || job !== lastRetry && job.status === 'working') ||
        !['player', rival].every(id => Number.isSafeInteger(world.stocks[id]?.[material]) && world.stocks[id][material] >= 0) ||
        world.attempts.some(job => (!isRetry(job) && ![playerJob, rivalJob, advanceJob].includes(job.id)) ||
            job.refiner !== (job.id === rivalJob ? rival : 'player') ||
            !['working', 'complete', 'cancelled', 'failed'].includes(job.status) ||
            !Number.isSafeInteger(job.cursor) || job.cursor < 0 ||
            JSON.stringify(job.recipe) !== JSON.stringify(job.id === advanceJob ? advancementRecipe : recipe) ||
            job.cursor > job.recipe.stages.length || job.status === 'working' && job.cursor === job.recipe.stages.length)) {
        throw Error('The Fortune Thread world ledger disagrees with its procedures.');
    }
    return {world, retry, destroyed};
}

function settleDistantRefiner(world, receipt, clock) {
    let job = world.attempts.find(row => row.id === rivalJob);
    if (job.status === 'working' && job.cursor === 0 && clock - receipt.start >= refinementStageMinutes) {
        world = stepGuRefinement(world, rivalJob);
        job = world.attempts.find(row => row.id === rivalJob);
    }
    return job.status === 'working' && clock - receipt.start >= refinementRivalMinutes
        ? stepGuRefinement(world, rivalJob) : world;
}

function worldAt(state, receipt, advancement, ledger) {
    return ledger ? settleDistantRefiner(ledger.world, receipt, state.clock) :
        projectRefinement(receipt, state.clock, advancement, state.simulation.seed);
}

export function validateKeeperRefinement(state, record) {
    const receipt = readReceipt(state);
    const advancement = readAdvancement(state);
    const ledger = readLedger(state);
    const done = operation => state.actors.player.completed[`${keeperRefinementEffectPack(operation)}.${operation}`] ?? 0;
    const expected = receipt ? [1, Number(receipt.prepared !== null), Number(receipt.action === 'finish'),
        Number(receipt.action === 'cancel')] : [0, 0, 0, 0];
    if ((receipt && (!hasPin(record) || receipt.start < record.initializedAt)) ||
        raceOperations.some((operation, index) => done(operation) !== expected[index])) {
        throw Error('The Immortal Gu attempt needs its own refinement receipts.');
    }
    const advanced = [Number(!!advancement), ...advanceOperations.slice(1).map(operation => Number(advancement?.action === operation))];
    if (advanceOperations.some((operation, index) => done(operation) !== advanced[index]) ||
        (advancement && (!hasPin(record, keeperAdvancement) || receipt?.end == null ||
            advancement.start < receipt.end || (ledger ? !ledger.world.attempts.some(job => job.id === advanceJob) :
                !heldFortuneThread(projectRefinement(receipt, advancement.start)))))) {
        throw Error('Advancement needs a completed Fortune Thread in your care and its own receipts.');
    }
    const records = state.actors.player.completed;
    const reclamations = reclamationOperations.reduce((sum, operation) => sum + (records[`${keeperReclamation}.${operation}`] ?? 0), 0);
    if (!!ledger !== (reclamations > 0) || (ledger && (!hasPin(record, keeperReclamation) || receipt?.end == null ||
        ledger.destroyed !== (records[`${keeperReclamation}.destroy`] ?? 0) ||
        ledger.world.attempts.filter(isRetry).length !== (records[`${keeperReclamation}.retry_start`] ?? 0)))) {
        throw Error('The Fortune Thread world ledger needs its custody and replacement receipts.');
    }
}

function available(receipt, clock) {
    return {
        start: !receipt,
        prepare: !!receipt && receipt.end === null && receipt.prepared === null &&
            clock - receipt.start >= refinementStageMinutes,
        finish: !!receipt && receipt.end === null && receipt.prepared !== null &&
            clock - receipt.prepared >= refinementStageMinutes,
        cancel: !!receipt && receipt.end === null,
    };
}

function availableAdvancement(receipt, advancement, clock, world) {
    const canStart = !advancement && receipt?.end != null && heldFortuneThread(world)?.rank === recipe.rank &&
        !world.attempts.some(job => job.refiner === 'player' && job.status === 'working');
    const running = !!advancement && advancement.end === null;
    const settled = running && clock - advancement.start >= advancementSettleMinutes;
    return {advance_start: canStart, advance_finish: running && settled,
        advance_quench: running && !settled, advance_cancel: running};
}

function availableReclamation(state, receipt, advancement, world, ledger) {
    const ready = receipt?.end != null && (!advancement || advancement.end !== null);
    const claim = world && livingGuClaim(world, fortune);
    const retry = ledger?.retry;
    const job = retry && world.attempts.find(job => job.id === retry.id);
    const work = job?.status === 'working';
    const due = work && state.clock - retry.at >= refinementStageMinutes;
    const present = state.simulation.people[steward]?.life === 'alive' &&
        state.simulation.people[steward].location === 'book.ri.keeper.annex';
    return {lend: ready && present && claim?.holder === 'player', recall: ready && present && claim?.holder === steward,
        destroy: ready && claim?.holder === 'player', retry_start: ready && !work,
        retry_prepare: due && job.cursor === 0, retry_finish: due && job.cursor === 1, retry_cancel: work};
}

export function keeperRefinementFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperRefinementWorld) return {};
    const receipt = readReceipt(state);
    const advancement = readAdvancement(state), ledger = readLedger(state);
    const world = receipt && worldAt(state, receipt, advancement, ledger);
    const options = {...available(receipt, state.clock), ...availableAdvancement(receipt, advancement, state.clock, world),
        ...availableReclamation(state, receipt, advancement, world, ledger)};
    return Object.fromEntries(Object.entries(options)
        .map(([action, ready]) => [`${keeperRefinementEffectPack(action)}.can_${action}`, ready]));
}

export function keeperRefinementView(state) {
    const receipt = readReceipt(state);
    if (!receipt) return null;
    const clock = state.clock;
    const advancement = readAdvancement(state);
    const ledger = readLedger(state);
    const world = worldAt(state, receipt, advancement, ledger);
    const result = observeGuRefinement(world, playerJob, 'player');
    const wait = result.status === 'working'
        ? Math.max(0, (receipt.prepared ?? receipt.start) + refinementStageMinutes - clock) : null;
    const held = heldFortuneThread(world);
    const progress = observeGuRefinement(world, advanceJob, 'player');
    const claim = livingGuClaim(world, fortune);
    const replacement = ledger?.retry && observeGuRefinement(world, ledger.retry.id, 'player');
    return {...result, wait, ...(held && {rank: held.rank}), ...(progress && {advancement: {
        status: progress.status, wait: Math.max(0, advancement.start + advancementSettleMinutes - clock),
    }}), ...(ledger && {reclamation: {holder: claim?.holder === steward ? 'steward' : held ? 'player' : null,
        rank: claim?.holder === steward ? claim.rank : held?.rank, specimen: held?.id,
        destroyed: ledger.destroyed, replacement: replacement && {...replacement,
            wait: Math.max(0, ledger.retry.at + refinementStageMinutes - clock)}}})};
}

export function applyKeeperRefinementEffect(state, effect, context) {
    const pack = keeperRefinementEffectPack(effect.operation);
    if (!isKeeperRefinementEffect(effect) || context.actorId !== 'player' || !hasPin(context.structuredNative, pack) ||
        state.actors.player?.worldId !== keeperRefinementWorld ||
        state.simulation.people.player.location !== 'book.ri.keeper.annex') {
        throw Error('Continue the Immortal Gu refinement at the Gu house.');
    }
    const clock = state.clock, {operation} = effect, receipt = readReceipt(state);
    const advancement = readAdvancement(state), ledger = readLedger(state);
    const world = receipt && worldAt(state, receipt, advancement, ledger);
    const facts = state.worlds[keeperRefinementWorld].facts;
    if (pack === keeperReclamation) {
        if (!hasPin(context.structuredNative) || !availableReclamation(state, receipt, advancement, world, ledger)[operation]) {
            throw Error('The Fortune Thread claim or refinement work has changed.');
        }
        const next = {...(ledger ?? {retry: null, destroyed: 0}), world};
        if (operation === 'lend' || operation === 'recall') {
            const [from, to] = operation === 'lend' ? ['player', steward] : [steward, 'player'];
            next.world = transferGuClaim(world, {key: fortune, from, to});
        } else if (operation === 'destroy') {
            next.world = destroyGuClaim(world, {key: fortune, holder: 'player'});
            next.destroyed += 1;
        } else if (operation === 'retry_start') {
            const previous = world.attempts.filter(isRetry).length;
            const id = `keeper-retry-${previous + 1}`;
            next.world = beginGuRefinement(funded(world, keeperRefinementMaterials), {id, refiner: 'player', recipe});
            next.retry = {id, at: clock};
        } else {
            const {id} = next.retry;
            next.world = operation === 'retry_cancel' ? cancelGuRefinement(world, id) : stepGuRefinement(world, id);
            next.retry = {id, at: clock};
        }
        facts[worldKey] = JSON.stringify(next);
        return operation === 'retry_cancel' ? refund(next.world) : null;
    }
    if (pack === keeperAdvancement) {
        if (!hasPin(context.structuredNative) || !availableAdvancement(receipt, advancement, clock, world)[operation]) {
            throw Error('The Fortune Thread advancement has changed.');
        }
        const next = operation === 'advance_start' ? {start: clock, end: null, action: null} :
            {...advancement, end: clock, action: operation};
        const seed = state.simulation.seed;
        const result = ledger ? advanceLivingClaim(world, operation, next.start, seed) : projectRefinement(receipt, clock, next, seed);
        facts[advanceKey] = JSON.stringify(next);
        if (ledger) facts[worldKey] = JSON.stringify({...ledger, world: result});
        return refund(result);
    }
    if (!available(receipt, clock)[operation]) throw Error('The refinement work has changed.');
    const next = operation === 'start' ? {start: clock, prepared: null, end: null, action: null} :
        operation === 'prepare' ? {...receipt, prepared: clock} : {...receipt, end: clock, action: operation};
    const result = projectRefinement(next, clock);
    facts[factKey] = JSON.stringify(next);
    return refund(result);
}

function funded(world, amount) {
    return {...world, stocks: {...world.stocks, player: {[material]: amount}}};
}

function advanceLivingClaim(world, operation, start, seed) {
    if (operation === 'advance_start') {
        return beginGuRefinement(funded(world, keeperAdvancementMaterials), {id: advanceJob, refiner: 'player',
            recipe: advancementRecipe, precursor: heldFortuneThread(world).id});
    }
    if (operation === 'advance_cancel') return cancelGuRefinement(world, advanceJob);
    const controlFailed = operation === 'advance_quench' &&
        drawFraction(seed, address(keeperAdvancement, 'quench', start)) < advancementQuenchRisk;
    return stepGuRefinement(world, advanceJob, {controlFailed});
}

function refund(world) {
    const returned = world.stocks.player[material];
    return returned ? {key: keeperLuckSand, count: returned} : null;
}
