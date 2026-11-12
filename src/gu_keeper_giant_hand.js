import {applyEnergyEffect} from './energy_resources.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {livingGuClaim, validateGuClaims} from './gu_world_claims.js';
import {castGiantHandVariant, castGiantHandWard, castRevisedGiantHand, giantHandForceSupportCost,
    giantHandPractice as tuning, giantHandWardForce, prepareGiantHandPhantoms, releasePreparedGiantHand,
    searchGiantHandVariants, searchGiantHandWard} from './gu_giant_hand.js';

const keeper = 'book.ri.keeper';
export const keeperGiantHand = `${keeper}.giant_hand`;
export const giantHandWorld = `${keeper}.world`;
export const giantHandYard = `${keeperGiantHand}.yard`;
export const giantHandFarBank = `${keeperGiantHand}.far_bank`;
export const keeperGiantHandWard = `${keeper}.giant_hand_ward`;
export const giantHandWardBank = `${keeperGiantHandWard}.far_path`;
export const keeperGiantHandVariants = `${keeper}.giant_hand_variants`;
export const giantHandBracePath = `${keeperGiantHandVariants}.covered_path`;
export const giantHandRedDate = JSON.stringify({id: `${keeperGiantHand}.red_date`});
export const giantHandRefineMinutes = 20;
const key = `${keeperGiantHand}.practice`;
const wardKey = `${keeperGiantHandWard}.result`;
const variantsKey = `${keeperGiantHandVariants}.notes`;
const energyId = `${keeper}.primeval`;
const selfId = `${keeperGiantHand}.self_strength`;
const supportId = `${keeperGiantHand}.older_supports`;
const groupIds = [`${keeperGiantHand}.group_one`, `${keeperGiantHand}.group_two`];
const focusedId = `${keeperGiantHandVariants}.focused`;
const braceForce = 5;
const myriadId = `${keeperGiantHand}.myriad_self`;
const refinement = `${keeperGiantHand}.refinement`;
export const giantHandRecipe = {id: 'myriad-self-practice', revision: 1, kind: 'myriad-self', rank: 7, uniqueKey: 'myriad-self',
    recordLineage: true, stages: [{id: 'formation', inputs: [{material: 'practice_materials', amount: 1}, {material: 'petals', amount: 2}]},
        {id: 'finish', inputs: []}]};
export const giantHandOperations = ['borrow_older', 'return_older', 'borrow_group', 'return_group', 'prepare_phantoms',
    'release_phantoms', 'prepare_myriad', 'finish_myriad', 'cast_giant_hand', 'reset_slab'];
export const giantHandWardOperations = ['ward_plain', 'ward_self'];
const variantWrite = {write_plain: groupIds, write_focused_first: [focusedId, groupIds[0]],
    write_focused_second: [focusedId, groupIds[1]]};
export const giantHandVariantOperations = ['borrow_focused', 'return_focused', ...Object.keys(variantWrite), 'cast_written'];
const pinned = record => record?.extensions?.some(pin => pin.id === keeperGiantHand);
const done = (state, operation) => state.actors.player.completed[`${keeperGiantHand}.${operation}`] ?? 0;
const wardPinned = record => record?.extensions?.some(pin => pin.id === keeperGiantHandWard);
const wardDone = (state, operation) => state.actors.player.completed[`${keeperGiantHandWard}.${operation}`] ?? 0;
const variantsPinned = record => record?.extensions?.some(pin => pin.id === keeperGiantHandVariants);
const variantDone = (state, operation) => state.actors.player.completed[`${keeperGiantHandVariants}.${operation}`] ?? 0;
const fresh = () => ({older: false, group: false, held: null, oldHits: 0, cleared: false, world: null, startedAt: null, last: null});

function read(state) {
    const raw = state.worlds[giantHandWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Giant Hand practice record.');
    return JSON.parse(raw);
}

function options(state, row) {
    const r = row ?? fresh();
    const essence = state.simulation.energies.player[energyId].reserve;
    const product = r.world && livingGuClaim(r.world, 'myriad-self');
    return {borrow_older: !r.older, return_older: r.older, borrow_group: !r.group, return_group: r.group,
        prepare_phantoms: r.older && !r.held && !r.cleared && essence >= tuning.oldSupportEssence,
        release_phantoms: !!r.held && state.clock >= r.held.at,
        prepare_myriad: r.oldHits > 0 && !r.world,
        finish_myriad: !!r.world && !product && state.clock >= r.startedAt + giantHandRefineMinutes,
        cast_giant_hand: product?.holder === 'player' && r.group && !r.held && !r.cleared && essence >= tuning.groupEssence,
        cross: r.cleared, reset_slab: r.cleared};
}

const wardResult = state => state.worlds[giantHandWorld]?.facts?.[wardKey];

function wardInput(state, row, beads) {
    const core = row?.world && livingGuClaim(row.world, 'myriad-self');
    if (core?.holder !== 'player' || !row.group) return null;
    return {myriadId: core.id, groupIds, selfId: row.older ? selfId : null, day: state.clock, beads,
        essence: state.simulation.energies.player[energyId].reserve};
}

function wardOptions(state, record, row) {
    const hasCore = row?.world && livingGuClaim(row.world, 'myriad-self')?.holder === 'player';
    if (!wardPinned(record)) return {ready: !!hasCore};
    const input = wardInput(state, row, tuning.newBeads + giantHandForceSupportCost);
    const result = wardResult(state);
    const plans = input && result !== 'broken' ? searchGiantHandWard(input) : [];
    return {ready: !!hasCore, ward_plain: plans.some(plan => !plan.reinforced), ward_self: plans.some(plan => plan.reinforced),
        cross: result === 'broken'};
}

function readVariants(state) {
    const raw = state.worlds[giantHandWorld]?.facts?.[variantsKey];
    if (raw === undefined) return {focused: false, binding: null, result: null};
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid Group Strength notes.');
    return JSON.parse(raw);
}

function variantInput(state, row, notes, beads) {
    const core = row?.world && livingGuClaim(row.world, 'myriad-self');
    if (core?.holder !== 'player') return null;
    const groups = row.group ? groupIds.map(id => ({id, cost: 1, gather: 2})) : [];
    if (notes.focused) groups.push({id: focusedId, cost: 2, gather: 3});
    return {myriadId: core.id, groups, day: state.clock, beads,
        essence: state.simulation.energies.player[energyId].reserve};
}

const variantPair = binding => binding && [binding['group-one']?.id, binding['group-two']?.id].sort();
const hasPair = (plan, pair) => !!pair && pair.every(id => plan.supports.includes(id));

function variantOptions(state, record, row) {
    const ready = row?.world && livingGuClaim(row.world, 'myriad-self')?.holder === 'player';
    if (!variantsPinned(record)) return {ready: !!ready};
    const notes = readVariants(state);
    const input = variantInput(state, row, notes, tuning.newBeads);
    const plans = input && notes.result !== 'open' ? searchGiantHandVariants(input) : [];
    const chosen = variantPair(notes.binding);
    const writable = Object.fromEntries(Object.entries(variantWrite).map(([op, pair]) => [op, plans.some(plan => hasPair(plan, pair))]));
    return {ready: !!ready, borrow_focused: !notes.focused, return_focused: notes.focused, ...writable,
        cast_written: plans.some(plan => hasPair(plan, chosen)),
        cross: notes.result === 'open'};
}

function validateVariants(state, record, finished) {
    const notes = readVariants(state);
    const atPath = state.simulation.people.player.location === giantHandBracePath;
    const casts = variantDone(state, 'cast_written');
    const written = Object.keys(variantWrite).reduce((sum, op) => sum + variantDone(state, op), 0);
    const pair = variantPair(notes.binding);
    if (!atPath && state.worlds[giantHandWorld]?.facts?.[variantsKey] === undefined &&
        !giantHandVariantOperations.some(op => variantDone(state, op))) return;
    if (!variantsPinned(record) || !finished || typeof notes.focused !== 'boolean' ||
        variantDone(state, 'borrow_focused') - variantDone(state, 'return_focused') !== Number(notes.focused) ||
        Number(!!notes.binding) !== Number(written > 0) || pair && (notes.binding.core?.id !== myriadId ||
            Object.keys(notes.binding).length !== 3 || Object.values(notes.binding).some(row => row?.operator !== 'player') ||
            pair[0] === pair[1] || pair.some(id => ![...groupIds, focusedId].includes(id))) ||
        ![null, 'short', 'open'].includes(notes.result) || !!notes.result !== (casts > 0) ||
        notes.result === 'open' && (!pair?.includes(focusedId) ||
            !variantDone(state, 'write_focused_first') && !variantDone(state, 'write_focused_second')) ||
        atPath && notes.result !== 'open') {
        throw Error('The Giant Hand support notes need their loans, written binding and cast receipts.');
    }
}

export function giantHandFacts(state, record) {
    if (!pinned(record)) return {};
    const row = read(state);
    const entries = (pack, facts) => Object.entries(facts).map(([id, value]) => [`${pack}.${id}`, !!value]);
    return Object.fromEntries([...entries(keeperGiantHand, options(state, row)), ...entries(keeperGiantHandWard, wardOptions(state, record, row)),
        ...entries(keeperGiantHandVariants, variantOptions(state, record, row))]);
}

export function validateGiantHand(state, record) {
    const row = read(state), prepared = done(state, 'prepare_phantoms'), released = done(state, 'release_phantoms');
    const refined = done(state, 'prepare_myriad'), finished = done(state, 'finish_myriad'), cast = done(state, 'cast_giant_hand');
    validateVariants(state, record, finished);
    const atBank = state.simulation.people.player.location === giantHandFarBank;
    const atWardBank = state.simulation.people.player.location === giantHandWardBank;
    const ward = wardResult(state), plain = wardDone(state, 'ward_plain'), strong = wardDone(state, 'ward_self');
    if ((ward !== undefined || plain || strong || atWardBank) &&
        (!wardPinned(record) || !finished || !['held', 'broken'].includes(ward) || strong > 1 ||
            (ward === 'broken' ? strong !== 1 : !plain || strong || atWardBank))) {
        throw Error('The cloud-soil ward needs its Giant Hand result.');
    }
    if (!row && !atBank && !giantHandOperations.some(op => done(state, op))) return;
    const held = row?.held;
    const job = row?.world?.attempts?.[0];
    const product = row?.world ? livingGuClaim(validateGuClaims(row.world), 'myriad-self') : null;
    const past = time => Number.isSafeInteger(time) && time >= record.initializedAt && time <= state.clock;
    if (!pinned(record) || !row ||
        done(state, 'borrow_older') - done(state, 'return_older') !== Number(row.older) ||
        done(state, 'borrow_group') - done(state, 'return_group') !== Number(row.group) ||
        typeof row.older !== 'boolean' || typeof row.group !== 'boolean' || typeof row.cleared !== 'boolean' ||
        !Number.isSafeInteger(row.oldHits) || row.oldHits < 0 || row.oldHits > released ||
        row.oldHits + cast !== done(state, 'reset_slab') + Number(row.cleared) ||
        prepared !== released + Number(!!held) || held && row.cleared ||
        held && (!past(held.at - tuning.preparation) || held.expiresAt !== held.at + tuning.phantomLife ||
            held.effect?.kind !== 'strength-phantoms' || held.effect.magnitude !== 6) ||
        atBank && !row.cleared || refined > 1 || finished > refined || cast && !finished ||
        refined !== Number(!!row.world) || finished !== Number(!!product) ||
        row.world && (!row.oldHits || !past(row.startedAt) || row.world.attempts.length !== 1 || row.world.gu.length !== finished ||
            job?.id !== refinement || job.refiner !== 'player' || job.productId !== myriadId ||
            JSON.stringify(job.recipe) !== JSON.stringify(giantHandRecipe) || job.cursor !== 1 + finished ||
            job.status !== (finished ? 'complete' : 'working') || row.world.stocks.player.practice_materials !== 0 ||
            row.world.stocks.player.petals !== 0) ||
        product && (product.id !== myriadId || product.holder !== 'player' || product.rank !== 7 || product.kind !== 'myriad-self') ||
        ![null, 'old', 'revised', 'expired', 'support', 'essence'].includes(row.last) ||
        row.last === 'old' && !row.oldHits || row.last === 'revised' && !cast) {
        throw Error('The Giant Hand practice needs its loan, preparation and refinement receipts.');
    }
}

export function giantHandView(state, record, inventory) {
    if (!pinned(record)) return null;
    const row = read(state) ?? fresh();
    const ward = wardPinned(record) ? wardResult(state) ?? 'intact' : null;
    const input = ward && wardInput(state, row, inventory?.[giantHandRedDate] ?? 0);
    const notes = variantsPinned(record) ? readVariants(state) : null;
    const variantRequest = notes && variantInput(state, row, notes, inventory?.[giantHandRedDate] ?? 0);
    const variantPlans = variantRequest && notes.result !== 'open' ? searchGiantHandVariants(variantRequest) : [];
    const label = id => id === focusedId ? 'focused' : id === groupIds[0] ? 'first' : 'second';
    const chosen = variantPair(notes?.binding);
    return {older: row.older, group: row.group, last: row.last, hand: row.cleared,
        variants: notes && {result: notes.result, force: braceForce, written: chosen?.map(label),
            missing: chosen?.some(id => !variantRequest?.groups.some(group => group.id === id)),
            plans: variantPlans.map(({supports, force, essence}) => ({supports: supports.map(label), force, essence}))},
        ward: ward && {result: ward, force: giantHandWardForce,
            plans: ward !== 'broken' && input ? searchGiantHandWard(input) : []},
        preparation: row.held ? Math.max(0, row.held.at - state.clock) : null,
        lifetime: row.held ? Math.max(0, row.held.expiresAt - state.clock) : null,
        refined: !!row.world?.gu.length,
        refinement: row.world && !row.world.gu.length ? Math.max(0, row.startedAt + giantHandRefineMinutes - state.clock) : null};
}

export function applyGiantHandVariant(state, record, operation, registry) {
    const row = read(state);
    if (!variantsPinned(record) || !variantOptions(state, record, row)[operation]) throw Error('The written Giant Hand plan is unavailable.');
    const notes = readVariants(state);
    if (operation === 'borrow_focused' || operation === 'return_focused') notes.focused = operation === 'borrow_focused';
    else {
        const input = variantInput(state, row, notes, tuning.newBeads);
        if (operation === 'cast_written') {
            const result = castGiantHandVariant(input, notes.binding);
            if (result.outcome !== 'complete') throw Error('The written Gu are no longer ready.');
            spendPrimeval(state, input.essence - result.remaining.player.primeval, registry);
            const hand = result.effects.find(row => row.kind === 'giant-hand');
            notes.result = hand.magnitude >= braceForce ? 'open' : 'short';
        } else {
            const plan = searchGiantHandVariants(input).find(plan => hasPair(plan, variantWrite[operation]));
            notes.binding = plan.binding;
        }
    }
    state.worlds[giantHandWorld].facts[variantsKey] = JSON.stringify(notes);
}

function spendPrimeval(state, used, registry) {
    for (let unit = 0; unit < used; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
}

export function applyGiantHandWard(state, record, operation, registry) {
    const row = read(state);
    if (!wardPinned(record) || !wardOptions(state, record, row)[operation]) throw Error('The warded trial is unavailable.');
    const reinforced = operation === 'ward_self';
    const input = wardInput(state, row, tuning.newBeads + (reinforced ? giantHandForceSupportCost : 0));
    const plan = searchGiantHandWard(input).find(option => option.reinforced === reinforced);
    if (!plan) throw Error('The chosen Gu or fuel is no longer ready.');
    const result = castGiantHandWard(input, plan.binding);
    const hand = result.effects.find(row => row.kind === 'giant-hand');
    if (!hand) throw Error('Giant Hand did not form.');
    const used = input.essence - result.remaining.player.primeval;
    spendPrimeval(state, used, registry);
    state.worlds[giantHandWorld].facts[wardKey] = hand.magnitude >= giantHandWardForce ? 'broken' : 'held';
}

export function applyGiantHand(state, record, operation, registry) {
    const row = read(state) ?? fresh();
    if (!pinned(record) || !options(state, row)[operation]) throw Error('The Giant Hand practice is unavailable.');
    const day = state.clock, essence = state.simulation.energies.player[energyId].reserve;
    const groups = row.group ? groupIds : [];
    let result;
    if (operation === 'borrow_older' || operation === 'return_older') row.older = operation === 'borrow_older';
    else if (operation === 'borrow_group' || operation === 'return_group') row.group = operation === 'borrow_group';
    else if (operation === 'reset_slab') {
        row.cleared = false;
        row.last = null;
    }
    else if (operation === 'prepare_phantoms') {
        result = prepareGiantHandPhantoms({selfId, supportId, day: day + tuning.preparation, essence});
        if (!result.held) throw Error('The older Gu failed to prepare phantoms.');
        row.held = result.held;
    } else if (operation === 'prepare_myriad') {
        const world = beginGuRefinement({gu: [], attempts: [], stocks: {player: {practice_materials: 1, petals: 2}}},
            {id: refinement, recipe: giantHandRecipe, productId: myriadId, refiner: 'player'});
        row.world = stepGuRefinement(world, refinement);
        row.startedAt = day;
    } else if (operation === 'finish_myriad') row.world = stepGuRefinement(row.world, refinement);
    else {
        const older = operation === 'release_phantoms';
        result = older ? releasePreparedGiantHand({held: row.held, boundIds: groupIds, groupIds: groups, day, essence}) :
            castRevisedGiantHand({myriadId: livingGuClaim(row.world, 'myriad-self').id, groupIds: groups, day, essence});
        const hit = result.effects.some(effect => effect.kind === 'giant-hand' && effect.magnitude >= 4);
        if (!older && !hit) throw Error('The revised Giant Hand failed to form.');
        if (older) {
            row.held = null;
            row.oldHits += Number(hit);
        }
        row.cleared = hit;
        row.last = hit ? (older ? 'old' : 'revised') : result.reason === 'held effect expired' ? 'expired' :
            result.reason === 'needs more essence' ? 'essence' : 'support';
    }
    const spent = result ? essence - result.remaining.player.primeval : 0;
    spendPrimeval(state, spent, registry);
    state.worlds[giantHandWorld].facts[key] = JSON.stringify(row);
}
