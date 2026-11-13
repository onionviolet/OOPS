import {moonlightBlade} from './gu_ability_profiles.js';
import {runGuProcedure, runGuProcedureFollowup, searchGuProcedures} from './gu_procedures.js';
import {applyEnergyEffect} from './energy_resources.js';
import {resolveGuActivation} from './gu_activation.js';
import {beamCondensationMinutes, beamCondensationProfile, deriveGuCondensation} from './gu_condensation.js';
export {beamCondensationMinutes, beamCondensationProfile} from './gu_condensation.js';
import {beginGuRefinement, cancelGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {applyGiantHand, applyGiantHandVariant, applyGiantHandWard, giantHandFacts, giantHandOperations, giantHandVariantOperations,
    giantHandWardOperations, giantHandYard, keeperGiantHand, keeperGiantHandVariants, keeperGiantHandWard,
    validateGiantHand} from './gu_keeper_giant_hand.js';

const prefix = 'book.ri.keeper';
export const keeperProcedure = `${prefix}.beam_procedure`;
export const keeperProcedureWorld = `${prefix}.world`;
export const keeperProcedureBay = `${keeperProcedure}.bay`;
export const keeperBeamCondensation = `${prefix}.beam_condensation`;
export const keeperBeamPassage = `${keeperBeamCondensation}.passage`;
export const keeperBeamLink = `${prefix}.beam_link`;
export const keeperBeamRecord = `${prefix}.beam_record`;
export const keeperBeamRecordGate = `${keeperBeamRecord}.gate`;
export const beamLinkMinutes = 10;
const key = `${keeperProcedure}.notes`;
const condensationKey = `${keeperBeamCondensation}.work`;
const linkKey = `${keeperBeamLink}.move`;
const recordKey = `${keeperBeamRecord}.copy`;
const energyId = `${prefix}.primeval`;
const operations = ['research', 'try_1', 'try_2'];
const condensationOperations = ['prepare_beam_gu', 'cancel_beam_gu', 'finish_beam_gu', 'use_beam_gu', 'test_heavy_gu'];
const linkOperations = ['prime_shelf', 'catch_shelf'];
const recordOperations = ['copy_beam', 'replay_beam'];
const admitted = record => record?.extensions?.some(pin => pin.id === keeperProcedure);
const done = (state, operation) => state.actors.player.completed[`${keeperProcedure}.${operation}`] ?? 0;
const condensedDone = (state, operation) => state.actors.player.completed[`${keeperBeamCondensation}.${operation}`] ?? 0;
const condensationPinned = record => record?.extensions?.some(pin => pin.id === keeperBeamCondensation);
const linkPinned = record => record?.extensions?.some(pin => pin.id === keeperBeamLink);
const beamRecordPinned = record => record?.extensions?.some(pin => pin.id === keeperBeamRecord);
const recordDone = (state, op) => state.actors.player.completed[`${keeperBeamRecord}.${op}`] ?? 0;
const gateLoad = state => recordDone(state, 'remove_weight') ? 1 : 2;
const beamGuId = `${keeperBeamCondensation}.gu`;
const net = (cost, magnitude) => ({fn: 'catch', fuel: 'primeval', cost, effect: {kind: 'hold-load', magnitude}});
export const procedureNets = {light: {label: 'Silk Catch Gu', ability: net(1, 1)}, heavy: {label: 'Woven Catch Gu', ability: net(2, 2)}};
const jade = {fn: 'brace', fuel: 'primeval', cost: 1, effect: {kind: 'brace', magnitude: 1}};
export const keeperBeamRecipe = {
    roles: [{id: 'brace', fn: 'brace'}, {id: 'cut', fn: 'cut'}, {id: 'catch', fn: 'catch'}],
    beats: [{roles: ['brace']}, {roles: ['cut', 'catch'], requires: {specimens: 2}}],
    completion: effects => ({kind: 'lower-beam', load: effects.find(row => row.kind === 'hold-load').magnitude}),
};

export function isKeeperProcedureEffect(effect) {
    return effect.type === 'guProcedure' && effect.actor === 'player' && keeperProcedureEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(field => ['type', 'actor', 'operation'].includes(field));
}

export function keeperProcedureEffectPack(operation) {
    return operations.includes(operation) ? keeperProcedure : condensationOperations.includes(operation) ? keeperBeamCondensation :
        linkOperations.includes(operation) ? keeperBeamLink : recordOperations.includes(operation) ? keeperBeamRecord :
            giantHandOperations.includes(operation) ? keeperGiantHand :
            giantHandWardOperations.includes(operation) ? keeperGiantHandWard :
                giantHandVariantOperations.includes(operation) ? keeperGiantHandVariants : null;
}

export function keeperBeamStages(state) {
    const {simulation, clock} = state;
    const kept = slot => {
        const p = simulation.people[`${prefix}.${slot}`];
        return simulation.claims[`${prefix}.${slot}_title`]?.owner === 'player' &&
            p?.life === 'alive' && p.body.controllerId === 'player' && p.vitals.health >= 3;
    };
    const stage = (id, kind, ability, alive) => ({
        gu: {id, kind, alive, rank: 1, fedThrough: clock}, operator: 'player', ability,
    });
    return [stage(`${prefix}.jade`, 'white-jade', jade, kept('jade')),
        stage(`${prefix}.moon`, 'moonlight', moonlightBlade, kept('moon')),
        ...Object.entries(procedureNets).map(([id, {ability}]) =>
            stage(id, `${id}-catch`, ability, state.actors.player.facts[`${keeperProcedure}.holds_${id}`] === true))];
}

function readNotes(state) {
    const raw = state.worlds[keeperProcedureWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid three-core move notes.');
    const {plans, last, load} = JSON.parse(raw);
    if (!Array.isArray(plans) || plans.length < 1 || plans.length > 2 ||
        new Set(plans.map(plan => plan.catch?.id)).size !== plans.length ||
        plans.some(plan => Object.keys(plan).length !== 3 || plan.brace?.id !== `${prefix}.jade` ||
            plan.cut?.id !== `${prefix}.moon` || !Object.hasOwn(procedureNets, plan.catch?.id) ||
            Object.values(plan).some(pick => pick?.operator !== 'player')) ||
        ![0, 1, 2].includes(load) || last !== null &&
            (!last || !Number.isSafeInteger(last.slot) || last.slot < 1 || last.slot > plans.length ||
            ![0, 1, 6, 7].includes(last.spent) || !['complete', 'interrupted'].includes(last.outcome))) {
        throw Error('The three-core move notes and the trial disagree.');
    }
    return {plans, last, load};
}

function witnessedBeam(notes) {
    if (notes?.last?.outcome !== 'complete') return null;
    const binding = notes.plans[notes.last.slot - 1];
    const ability = procedureNets[binding.catch.id].ability;
    if (notes.load < ability.effect.magnitude || notes.last.spent !== jade.cost + moonlightBlade.cost + ability.cost) return null;
    return {catch: binding.catch.id, load: ability.effect.magnitude, spent: notes.last.spent};
}

function readBeamRecord(state) {
    const raw = state.worlds[keeperProcedureWorld]?.facts?.[recordKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 2048) throw Error('Invalid copied beam demonstration.');
    return JSON.parse(raw);
}

function beamSource(state, notes) {
    return witnessedBeam(notes) ?? readBeamRecord(state)?.witness;
}

function beamRecordOptions(state, notes, record) {
    const open = record?.last?.outcome === 'open';
    return {copy_beam: !open && !!witnessedBeam(notes), replay_beam: !open && !!record,
        remove_weight: !open && !!record && gateLoad(state) === 2, enter: !!open};
}

function validateBeamRecord(state, record) {
    const saved = readBeamRecord(state);
    const copied = recordDone(state, 'copy_beam');
    const replayed = recordDone(state, 'replay_beam');
    const removed = recordDone(state, 'remove_weight');
    const atGate = state.simulation.people.player.location === keeperBeamRecordGate;
    if (!saved && !copied && !replayed && !removed && !atGate) return;
    const {binding, attempt, witness, last} = saved ?? {};
    const net = Object.hasOwn(procedureNets, binding?.catch?.id) ? procedureNets[binding.catch.id].ability : null;
    if (!beamRecordPinned(record) || !copied || removed > 1 || !net ||
        Object.keys(binding).length !== 3 || binding.brace?.id !== `${prefix}.jade` || binding.cut?.id !== `${prefix}.moon` ||
        Object.values(binding).some(pick => pick?.operator !== 'player') ||
        !witness || witness.catch !== binding.catch.id || witness.load !== net.effect.magnitude ||
        witness.spent !== jade.cost + moonlightBlade.cost + net.cost ||
        !attempt || !['try_1', 'try_2'].includes(attempt.operation) || !Number.isSafeInteger(attempt.ordinal) ||
        attempt.ordinal < 1 || attempt.ordinal > done(state, attempt.operation) ||
        !Number.isSafeInteger(attempt.copiedAt) || attempt.copiedAt < record.initializedAt || attempt.copiedAt > state.clock ||
        atGate && last?.outcome !== 'open' ||
        last !== null && (!replayed || !last || !['open', 'too-light', 'interrupted'].includes(last.outcome) ||
            ![1, 2].includes(last.target) || last.target < gateLoad(state) ||
            (last.outcome === 'interrupted' ? ![0, 1].includes(last.spent) : last.spent !== witness.spent ||
                (last.outcome === 'open') !== (witness.load >= last.target)))) {
        throw Error('The copied beam move needs its demonstration and replay receipts.');
    }
}

function beamDesign(source) {
    return deriveGuCondensation({profile: beamCondensationProfile, witness: {
        outcome: 'complete', effects: [{kind: 'lower-beam', load: source.load}],
    }});
}

function readCondensation(state) {
    const raw = state.worlds[keeperProcedureWorld]?.facts?.[condensationKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid Beam Catch work.');
    return JSON.parse(raw);
}

const shelfSupport = {id: 'heavy', operator: 'player'};
const shelfFollowup = {
    roles: [{id: 'catch', fn: 'catch'}], beats: [{roles: ['catch']}],
    completion: effects => {
        const core = effects.find(effect => effect.kind === 'lower-beam');
        const support = effects.find(effect => effect.kind === 'hold-load');
        return {kind: 'lower-shelf', load: core?.magnitude > 0 && support ? support.magnitude : 0};
    },
};

function readLink(state) {
    const raw = state.worlds[keeperProcedureWorld]?.facts?.[linkKey];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 1024) throw Error('Invalid linked beam move.');
    return JSON.parse(raw);
}

function linkOptions(state, row, link, stages, notes) {
    const ready = row?.world.gu[0]?.alive === true;
    return {ready, prime_shelf: ready && notes.load < 2 && link?.outcome !== 'pending' &&
        stages.some(stage => stage.gu.id === shelfSupport.id && stage.gu.alive) &&
        state.simulation.energies.player[energyId].reserve >= beamCondensationProfile.cost,
    catch_shelf: link?.outcome === 'pending'};
}

function validateLink(state, record, notes) {
    const link = readLink(state);
    const completed = operation => state.actors.player.completed[`${keeperBeamLink}.${operation}`] ?? 0;
    const primed = completed('prime_shelf'), settled = completed('catch_shelf');
    if (!link && !primed && !settled) return;
    const effect = link?.effect;
    if (!link || !linkPinned(record) || !condensedDone(state, 'finish_beam_gu') || !primed ||
        link.specimen !== beamGuId || link.support !== shelfSupport.id || effect?.kind !== 'lower-beam' || effect.magnitude !== 1 ||
        !Number.isSafeInteger(link.at) || link.at < record.initializedAt || link.at > state.clock ||
        link.expiresAt !== link.at + beamLinkMinutes ||
        !['pending', 'complete', 'support', 'expired', 'essence'].includes(link.outcome) ||
        primed !== settled + Number(link.outcome === 'pending') || link.outcome === 'complete' && notes?.load !== 2) {
        throw Error('The linked shelf move needs its held effect and completion receipts.');
    }
}

function condensationOptions(state, notes, row) {
    const job = row?.world.attempts[0];
    const product = row?.world.gu[0];
    const canCast = product?.alive && state.simulation.energies.player[energyId].reserve >= beamCondensationProfile.cost;
    const source = beamSource(state, notes);
    return {ready: !!source, prepare_beam_gu: !!source && (!job || job.status === 'cancelled'),
        cancel_beam_gu: job?.status === 'working', finish_beam_gu: job?.status === 'working' && state.clock >= row.at + beamCondensationMinutes,
        use_beam_gu: !!canCast && !row.passage, test_heavy_gu: !!canCast && !row.heavyTried && notes.load < 2,
        enter: !!row?.passage};
}

function validateCondensation(state, record, notes) {
    const row = readCondensation(state);
    const prepared = condensedDone(state, 'prepare_beam_gu'), cancelled = condensedDone(state, 'cancel_beam_gu');
    const finished = condensedDone(state, 'finish_beam_gu');
    const used = condensedDone(state, 'use_beam_gu'), tried = condensedDone(state, 'test_heavy_gu');
    const atPassage = state.simulation.people.player.location === keeperBeamPassage;
    if (!row && !prepared && !cancelled && !finished && !used && !tried && !atPassage) return;
    const job = row?.world?.attempts?.[0];
    const source = row?.source;
    const product = row?.world?.gu?.[0];
    const validSource = Object.hasOwn(procedureNets, source?.catch) && source.load === procedureNets[source.catch].ability.effect.magnitude &&
        source.spent === jade.cost + moonlightBlade.cost + procedureNets[source.catch].ability.cost;
    if (!condensationPinned(record) || !row || !job || !validSource || !notes || notes.load < source.load ||
        !Number.isSafeInteger(row.at) || row.at < record.initializedAt || row.at > state.clock ||
        prepared < 1 || finished > 1 || used > finished || tried > finished ||
        row.passage !== !!used || row.heavyTried !== !!tried || atPassage && !row.passage ||
        row.world.attempts.length !== 1 || job.id !== `${keeperBeamCondensation}.job.${prepared}` ||
        job.refiner !== 'player' || job.productId !== beamGuId || Object.keys(job.ingredients ?? {}).length !== 0 ||
        JSON.stringify(job.recipe) !== JSON.stringify(beamCondensationProfile.recipe) ||
        row.world.stocks?.player?.petals !== 0 || row.world.stocks?.player?.stone !== 0 ||
        job.status !== (finished ? 'complete' : prepared === cancelled ? 'cancelled' : 'working') ||
        prepared !== cancelled + Number(job.status !== 'cancelled') || job.cursor !== (finished ? 2 : 1) ||
        row.world.gu.length !== finished || finished && (job.product !== beamGuId || product.id !== beamGuId ||
            product.kind !== 'beam-catch' || product.rank !== 1 || product.alive !== true || product.holder !== 'player' ||
            product.provenance?.recipe !== beamCondensationProfile.recipe.id || product.provenance?.revision !== 1 ||
            Object.keys(product.provenance?.ingredients ?? {}).length !== 0)) {
        throw Error('The Beam Catch Gu needs its practiced move, materials and refinement receipts.');
    }
}

export function validateKeeperProcedure(state, record) {
    const notes = readNotes(state);
    const flags = state.actors.player.facts;
    if (!!notes !== (done(state, 'research') > 0) ||
        (notes || Object.keys(procedureNets).some(id => flags[`${keeperProcedure}.holds_${id}`] !== undefined)) && !admitted(record) ||
        (notes?.last && !done(state, `try_${notes.last.slot}`)) ||
        notes?.load > 0 && !done(state, 'try_1') && !done(state, 'try_2') ||
        (done(state, 'salvage') > 0 && notes?.load !== 2) || done(state, 'salvage') > 1 ||
        state.simulation.people.player.location === keeperProcedureBay && !(notes?.load > 0)) {
        throw Error('The three-core rehearsal needs its written plans and results.');
    }
    validateCondensation(state, record, notes);
    validateBeamRecord(state, record);
    validateLink(state, record, notes);
    validateGiantHand(state, record);
}

export function keeperProcedureFacts(state, actor, record) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperProcedureWorld) return {};
    const notes = readNotes(state);
    const pool = keeperBeamStages(state);
    const facts = Object.fromEntries(Object.entries({research: pool[0].gu.alive && pool[1].gu.alive && pool.slice(2).some(row => row.gu.alive),
        try_1: !!notes?.plans[0], try_2: !!notes?.plans[1], enter: notes?.load > 0,
        salvage: notes?.load === 2 && !done(state, 'salvage'),
        holds_light: pool[2].gu.alive, holds_heavy: pool[3].gu.alive}).map(([id, value]) => [`${keeperProcedure}.${id}`, value]));
    const condensed = condensationPinned(record) ? readCondensation(state) : null;
    const condensation = condensationPinned(record) ? condensationOptions(state, notes, condensed) : {ready: !!beamSource(state, notes)};
    const link = linkPinned(record) ? linkOptions(state, condensed, readLink(state), pool, notes) : {ready: condensed?.world.gu[0]?.alive === true};
    const entries = (pack, options) => Object.fromEntries(Object.entries(options).map(([id, value]) => [`${pack}.${id}`, !!value]));
    const copy = beamRecordPinned(record) ? beamRecordOptions(state, notes, readBeamRecord(state)) : {};
    return {...facts, ...entries(keeperBeamCondensation, condensation), ...entries(keeperBeamLink, link),
        ...entries(keeperBeamRecord, copy), ...giantHandFacts(state, record)};
}

export function keeperProcedureView(state, record) {
    if (!admitted(record)) return null;
    const notes = readNotes(state);
    if (!notes) return null;
    const row = condensationPinned(record) ? readCondensation(state) : null;
    const job = row?.world.attempts[0];
    const link = linkPinned(record) && readLink(state);
    const copy = beamRecordPinned(record) && readBeamRecord(state);
    return {...notes, link: link && {outcome: link.outcome, remaining: Math.max(0, link.expiresAt - state.clock)},
        copy: copy && {label: procedureNets[copy.witness.catch].label, load: copy.witness.load, target: gateLoad(state), last: copy.last},
        condensation: condensationPinned(record) && {source: row?.source ?? beamSource(state, notes), status: job?.status,
        remaining: job?.status === 'working' ? Math.max(0, row.at + beamCondensationMinutes - state.clock) : 0,
        passage: row?.passage, heavyTried: row?.heavyTried, cost: beamCondensationProfile.cost},
    plans: notes.plans.map(({catch: pick}) => {
        const {label, ability} = procedureNets[pick.id];
        return {label, load: ability.effect.magnitude, cost: jade.cost + moonlightBlade.cost + ability.cost};
    })};
}

function applyBeamCondensation(state, operation, registry) {
    const notes = readNotes(state);
    let row = readCondensation(state);
    if (!condensationOptions(state, notes, row)[operation]) throw Error('The Beam Catch work is unavailable.');
    if (operation === 'prepare_beam_gu') {
        const source = beamSource(state, notes);
        const {recipe} = beamDesign(source);
        const materials = Object.fromEntries(recipe.stages.flatMap(stage => stage.inputs).map(({material, amount}) => [material, amount]));
        const job = `${keeperBeamCondensation}.job.${condensedDone(state, operation) + 1}`;
        const working = beginGuRefinement(
            {gu: [], attempts: [], stocks: {player: materials}},
            {id: job, refiner: 'player', recipe, productId: beamGuId});
        row = {source, at: state.clock, passage: false, heavyTried: false, world: stepGuRefinement(working, job)};
    } else if (operation === 'cancel_beam_gu') {
        row.world = cancelGuRefinement(row.world, row.world.attempts[0].id);
    } else if (operation === 'finish_beam_gu') {
        const id = row.world.attempts[0].id;
        row.world = stepGuRefinement(row.world, id);
    } else {
        const reserve = state.simulation.energies.player[energyId].reserve;
        const activation = activateBeamCatch(state, row, reserve);
        if (activation.outcome !== 'complete') throw Error('The Beam Catch Gu failed to answer.');
        spendEssence(state, reserve - activation.remaining.player.primeval, registry);
        const load = activation.effects.find(effect => effect.kind === 'lower-beam')?.magnitude ?? 0;
        if (operation === 'use_beam_gu') row.passage = load >= 1;
        else row.heavyTried = load < 2;
    }
    state.worlds[keeperProcedureWorld].facts[condensationKey] = JSON.stringify(row);
}

function activateBeamCatch(state, row, reserve) {
    const {ability} = beamDesign(row.source);
    return resolveGuActivation({stages: [{gu: {...row.world.gu[0], fedThrough: state.clock}, ability, operator: 'player'}],
        reserves: {player: {primeval: reserve}}, day: state.clock});
}

function applyBeamLink(state, operation, registry) {
    const row = readCondensation(state), link = readLink(state), available = keeperBeamStages(state);
    const notes = readNotes(state);
    if (!linkOptions(state, row, link, available, notes)[operation]) throw Error('The linked shelf move is unavailable.');
    const reserve = state.simulation.energies.player[energyId].reserve;
    const day = state.clock, facts = state.worlds[keeperProcedureWorld].facts;
    if (operation === 'prime_shelf') {
        const result = activateBeamCatch(state, row, reserve);
        const effect = result.effects.find(row => row.kind === 'lower-beam');
        if (!effect) throw Error('Beam Catch did not hold the shelf.');
        spendEssence(state, reserve - result.remaining.player.primeval, registry);
        facts[linkKey] = JSON.stringify({specimen: row.world.gu[0].id, support: shelfSupport.id, effect, at: day,
            expiresAt: day + beamLinkMinutes, outcome: 'pending'});
        return;
    }
    const result = runGuProcedureFollowup({held: link, recipe: shelfFollowup, binding: {catch: shelfSupport},
        available, day, reserves: {player: {primeval: reserve}}});
    spendEssence(state, reserve - result.remaining.player.primeval, registry);
    const lowered = result.effects.some(effect => effect.kind === 'lower-shelf' && effect.load >= 2);
    const outcome = lowered ? 'complete' : result.reason === 'held effect expired' ? 'expired' :
        result.reason === 'needs more essence' ? 'essence' : 'support';
    if (lowered) facts[key] = JSON.stringify({...notes, load: 2});
    facts[linkKey] = JSON.stringify({...link, outcome});
}

function spendEssence(state, spent, registry) {
    for (let unit = 0; unit < spent; unit++) {
        applyEnergyEffect(state, 'player', {energyId, operation: 'use', output: 1, control: 1}, registry);
    }
}

function applyBeamRecord(state, operation, registry) {
    const notes = readNotes(state), copy = readBeamRecord(state);
    if (!beamRecordOptions(state, notes, copy)[operation]) throw Error('The copied beam work is unavailable.');
    const facts = state.worlds[keeperProcedureWorld].facts;
    if (operation === 'copy_beam') {
        const native = `try_${notes.last.slot}`;
        facts[recordKey] = JSON.stringify({binding: notes.plans[notes.last.slot - 1], witness: witnessedBeam(notes),
            attempt: {operation: native, ordinal: done(state, native), copiedAt: state.clock}, last: null});
        return;
    }
    const reserve = state.simulation.energies.player[energyId].reserve;
    const result = runGuProcedure({recipe: keeperBeamRecipe, binding: copy.binding, available: keeperBeamStages(state),
        reserves: {player: {primeval: reserve}}, day: state.clock});
    const spent = reserve - result.remaining.player.primeval;
    spendEssence(state, spent, registry);
    const target = gateLoad(state);
    const measured = result.effects.find(effect => effect.kind === 'lower-beam');
    const outcome = !measured ? 'interrupted' : measured.load >= target ? 'open' : 'too-light';
    facts[recordKey] = JSON.stringify({...copy, last: {outcome, spent, target}});
}

export function applyKeeperProcedureEffect(state, effect, context, registry) {
    const {operation} = effect;
    const pack = keeperProcedureEffectPack(operation);
    if (pack === keeperGiantHand || pack === keeperGiantHandWard || pack === keeperGiantHandVariants) {
        if (!isKeeperProcedureEffect(effect) || context.actorId !== 'player' || state.actors.player?.worldId !== keeperProcedureWorld ||
            state.simulation.people.player.location !== giantHandYard) throw Error('Practice Giant Hand in the cloud-soil yard.');
        if (pack === keeperGiantHand) applyGiantHand(state, context.structuredNative, operation, registry);
        else if (pack === keeperGiantHandWard) applyGiantHandWard(state, context.structuredNative, operation, registry);
        else applyGiantHandVariant(state, context.structuredNative, operation, registry);
        return;
    }
    if (!isKeeperProcedureEffect(effect) || !admitted(context.structuredNative) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperProcedureWorld ||
        state.simulation.people.player.location !== `${prefix}.annex`) throw Error('Try the written move at the Gu house.');
    if (pack === keeperBeamCondensation) {
        if (!condensationPinned(context.structuredNative)) throw Error('Take up the Beam Catch refinement first.');
        applyBeamCondensation(state, operation, registry);
        return;
    }
    if (pack === keeperBeamLink) {
        if (!linkPinned(context.structuredNative)) throw Error('Take up the linked shelf lesson first.');
        applyBeamLink(state, operation, registry);
        return;
    }
    if (pack === keeperBeamRecord) {
        if (!beamRecordPinned(context.structuredNative)) throw Error('Take up the beam record lesson first.');
        applyBeamRecord(state, operation, registry);
        return;
    }
    const available = keeperBeamStages(state);
    const reserve = state.simulation.energies.player[energyId].reserve;
    const request = {recipe: keeperBeamRecipe, available, reserves: {player: {primeval: reserve}}, day: state.clock};
    const facts = state.worlds[keeperProcedureWorld].facts;
    const notes = readNotes(state);
    if (operation === 'research') {
        const {options} = searchGuProcedures({...request, available: available.filter(row => row.gu.alive)});
        if (!options.length) throw Error('Bring the three ready Gu and enough essence for a complete rehearsal.');
        facts[key] = JSON.stringify({plans: options.map(row => row.binding), last: null, load: notes?.load ?? 0});
        return;
    }
    const slot = operation === 'try_1' ? 1 : 2;
    const binding = notes?.plans[slot - 1];
    if (!binding) throw Error('Write down the three-core move first.');
    const result = runGuProcedure({...request, binding});
    const spent = reserve - result.remaining.player.primeval;
    spendEssence(state, spent, registry);
    const lowered = result.effects.find(row => row.kind === 'lower-beam');
    facts[key] = JSON.stringify({...notes, last: {slot, outcome: result.outcome, spent},
        load: Math.max(notes.load, lowered?.load ?? 0)});
}
