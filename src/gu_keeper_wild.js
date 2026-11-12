import {restoreCreatureLifecycle} from './creature_lifecycle.js';
import {discoverLiquorWorm, fourFlavorsRecipe, fourFlavorsWines, liquorWormApproachable, liquorWormConversion, liquorWormFamiliarity, liquorWormSpecies,
    liquorWormTrailWindow, liquorWormWineArrival, lureLiquorWorm, moveLiquorWorm} from './gu_liquor_worm.js';
import {moonlightBlade} from './gu_ability_profiles.js';
import {resolveGuActivation} from './gu_activation.js';
import {beginGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {applyLine, lineActions, lineOperations, lineView} from './gu_essence_line.js';
import {keeperRankTrialId, keeperRedSteel, redSteelLine} from './world_packs/book_gu_keeper_lines.js';
const redSteelView = state => lineView(state, redSteelLine);
import {applySeven, fourCommitted, keeperSeven, sevenActions, sevenOperations, sevenSpecimen, sevenView, validateSeven} from './gu_keeper_seven.js';
import {applyNine, keeperNine, nineActions, nineCommitsSeven, nineOperations, nineView, validateNine} from './gu_keeper_nine.js';
import {hostedWolfGlade} from './gu_hosted_wolf.js';

const prefix = 'book.ri.keeper';
export const keeperWild = `${prefix}.wild_worm`;
export const keeperRoamingWorm = `${keeperWild}_roam`;
export const keeperWormEssence = `${prefix}.worm_essence`;
export const keeperFourFlavors = `${prefix}.four_flavors`;
export const keeperWildWorld = `${prefix}.world`;
export const keeperTrailWine = JSON.stringify({id: `${keeperWild}.wine`});
const key = `${keeperWild}.encounter`;
const wakeKey = `${keeperRoamingWorm}.wake`;
const border = `${keeperWild}.border`;
const cellar = `${keeperRoamingWorm}.cellar`;
const enclosure = `${keeperWild}.enclosure`;
const fusedHabitat = `${keeperFourFlavors}.consumed`;
const fusionKey = `${keeperFourFlavors}.product`;
const clanWorm = `${prefix}.worm`;
const steward = `${prefix}.steward`;
const operations = ['find', 'approach', 'follow', 'lure', 'capture', 'refine', 'release'];
const roamOperations = ['watch_worm', 'leave_wine'];
const essenceOperations = ['feed', 'convert', 'cast_middle'];
const fedAtKey = `${keeperWormEssence}.fed_at`;
const cutKey = `${keeperWormEssence}.last_cut`;
const moonId = `${prefix}.moon`;
export const wormMealMinutes = 1440;
const sightedPhases = ['trail', 'sheltered', 'lured'];
const phases = [...sightedPhases, 'held', 'released', 'fused', 'roaming'];
export const wormReturnMinutes = 60;

export function isKeeperWildEffect(effect) {
    return effect.type === 'guWild' && effect.actor === 'player' && keeperWildEffectPack(effect.operation) !== null &&
        Object.keys(effect).every(name => ['type', 'actor', 'operation'].includes(name));
}

export function keeperWildEffectPack(operation) {
    if (sevenOperations.includes(operation)) return keeperSeven;
    if (nineOperations.includes(operation)) return keeperNine;
    if (roamOperations.includes(operation)) return keeperRoamingWorm;
    return operations.includes(operation) ? keeperWild : essenceOperations.includes(operation) ? keeperWormEssence :
        operation === 'fuse_four' ? keeperFourFlavors : lineOperations(redSteelLine).includes(operation) ? keeperRedSteel : null;
}

function hasPin(record, pack = keeperWild) {
    return record?.extensions?.some(pin => pin.id === pack);
}

function readEncounter(state) {
    const raw = state.worlds[keeperWildWorld]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string' || raw.length > 4096) throw Error('Invalid wild Liquor Worm record.');
    const encounter = JSON.parse(raw);
    const lifecycle = restoreCreatureLifecycle(encounter.lifecycle);
    const worm = lifecycle.individuals[encounter.id];
    const {phase, roam} = encounter;
    const held = phase === 'held';
    const site = held ? enclosure : phase === 'fused' ? fusedHabitat : phase === 'roaming' ? cellar : border;
    if (!phases.includes(encounter.phase) || typeof encounter.refuge !== 'boolean' ||
        typeof encounter.controlled !== 'boolean' || (encounter.controlled && !held) ||
        (encounter.phase === 'lured' && !encounter.refuge) ||
        (encounter.phase === 'released' ? !Number.isSafeInteger(encounter.releasedAt) ||
            encounter.releasedAt < worm?.bornAt || encounter.releasedAt > state.clock : encounter.releasedAt !== null) ||
        worm?.species !== liquorWormSpecies || Object.keys(lifecycle.individuals).length !== 1 ||
        worm.keeper !== (held ? 'player' : null) || worm.habitat !== site ||
        worm.bornAt > state.clock || !['bold', 'wary'].includes(worm.traits.temperament) ||
        (worm.experience.player?.lastAt ?? 0) > state.clock) throw Error('The wild Liquor Worm and its trail disagree.');
    return {...encounter, lifecycle};
}

function writeEncounter(state, encounter) {
    const facts = state.worlds[keeperWildWorld].facts;
    facts[key] = JSON.stringify(encounter);
    const due = encounter.roam?.due ?? null;
    if (due === null) delete facts[wakeKey];
    else facts[wakeKey] = due;
}

export function validateKeeperWild(state, record) {
    const encounter = readEncounter(state);
    if (encounter && !hasPin(record)) throw Error('The wild Liquor Worm needs its Gu house permission.');
    const roam = encounter?.roam;
    const watch = state.actors.player.completed[`${keeperRoamingWorm}.watch_worm`] ?? 0;
    const wake = state.worlds[keeperWildWorld]?.facts?.[wakeKey];
    if (!!roam !== (watch === 1) || watch > 1 || wake !== (roam?.due ?? undefined) ||
        encounter?.phase === 'roaming' && !roam || roam && (!hasPin(record, keeperRoamingWorm) ||
            (roam.lastDrink !== null && (!Number.isSafeInteger(roam.lastDrink) || roam.lastDrink > state.clock ||
                roam.lastDrink < encounter.lifecycle.individuals[encounter.id].bornAt)) ||
            (roam.due !== null && (!Number.isSafeInteger(roam.due) || roam.due <= state.clock ||
                roam.due > state.clock + 20 || ![...sightedPhases, 'roaming'].includes(encounter.phase))) ||
            (sightedPhases.includes(encounter.phase) && roam.due === null))) {
        throw Error('The roaming Liquor Worm needs its trail watch and scheduled movement.');
    }
    const essence = readEssence(state);
    if ((essence.fedAt !== undefined || essence.converted || essence.casts) &&
        (!encounter || !hasPin(record, keeperWormEssence) || !hasPin(record) || essence.fedAt === undefined ||
            essence.fedAt < encounter.lifecycle.individuals[encounter.id].bornAt)) {
        throw Error('The refined essence needs its matching Liquor Worm and meal receipts.');
    }
    const product = readFourFlavors(state);
    validateSeven(state, record, product);
    validateNine(state, record, sevenSpecimen(state));
    const title = state.simulation.claims[`${prefix}.worm_title`];
    if (!!product !== (encounter?.phase === 'fused') || !!product !== (title?.status === 'settled') ||
        (product && (!hasPin(record, keeperFourFlavors) ||
        !hasPin(record, keeperWormEssence) || title.owner !== steward || state.simulation.people[clanWorm]?.life !== 'dead'))) {
        throw Error('The Four Flavors Liquor Worm needs both consumed specimens and its refinement receipt.');
    }
    const redSteel = redSteelView(state);
    if (redSteel.fedAt !== undefined && (!product || !hasPin(record, keeperRedSteel) || !hasPin(record, keeperRankTrialId))) {
        throw Error('The red-steel reserve needs its Four Flavors and Moonglow receipts.');
    }
}

function readFourFlavors(state) {
    const id = state.worlds[keeperWildWorld]?.facts?.[fusionKey];
    const count = state.actors.player.completed[`${keeperFourFlavors}.fuse_four`] ?? 0;
    if (id === undefined && count === 0) return null;
    if (id !== `${keeperFourFlavors}.specimen` || count !== 1) throw Error('The Four Flavors product identity disagrees.');
    return {id, rank: fourFlavorsRecipe.rank,
        provenance: {recipe: fourFlavorsRecipe.id, ingredients: {first: readEncounter(state)?.id, second: clanWorm}}};
}

function fourFlavorsReady(state, encounter, essence) {
    const clan = state.simulation.people[clanWorm];
    return encounter?.phase === 'held' && encounter.controlled && essence.fed && clan?.life === 'alive' &&
        clan.body.controllerId === 'player' && clan.vitals.health >= 3 && state.simulation.claims[`${prefix}.worm_title`]?.owner === 'player' &&
        state.simulation.claims[`${prefix}.worm_title`].status === 'held';
}

const done = (state, action) => state.actors.player.completed[`${keeperWormEssence}.${action}`] ?? 0;

function readEssence(state) {
    const facts = state.worlds[keeperWildWorld]?.facts;
    const fedAt = facts?.[fedAtKey], lastCut = facts?.[cutKey];
    const converted = done(state, 'convert'), casts = done(state, 'cast_middle');
    if ((fedAt !== undefined) !== (done(state, 'feed') > 0) ||
        fedAt !== undefined && (!Number.isSafeInteger(fedAt) || fedAt < 0 || fedAt > state.clock) ||
        (lastCut !== undefined) !== (casts > 0) || lastCut !== undefined && lastCut !== 2 ||
        casts > converted * liquorWormConversion.yield) throw Error('The Liquor Worm essence receipts disagree.');
    const fed = fedAt !== undefined && state.clock - fedAt < wormMealMinutes;
    return {fedAt, fed, converted, casts, lastCut, middle: converted * liquorWormConversion.yield - casts};
}

function essenceActions(state, encounter, essence) {
    const moon = state.simulation.people[moonId];
    const moonReady = moon?.life === 'alive' && moon.body.controllerId === 'player' && moon.vitals.health >= 3 &&
        state.simulation.claims[`${prefix}.moon_title`]?.owner === 'player';
    const held = encounter?.phase === 'held';
    return {feed: held && !essence.fed, convert: held && encounter.controlled && essence.fed,
        cast_middle: moonReady && essence.middle > 0};
}

function readActions(encounter, clock) {
    const {phase, refuge, controlled, lifecycle, id, releasedAt} = encounter ?? {};
    const worm = lifecycle?.individuals[id];
    const sighted = sightedPhases.includes(phase);
    const catchable = sighted && (phase === 'lured' || liquorWormApproachable(worm, 'player'));
    return {
        find: !encounter || (phase === 'released' && clock - releasedAt >= wormReturnMinutes),
        approach: phase === 'trail' && !catchable,
        follow: phase === 'sheltered' && !refuge,
        lure: sighted && refuge && phase !== 'lured' && clock > (worm.experience.player?.lastAt ?? -1),
        capture: catchable,
        refine: phase === 'held' && !controlled,
        release: phase === 'held',
        watch_worm: sighted && !encounter.roam,
        leave_wine: phase === 'roaming' && encounter.roam?.due === null,
    };
}

export function keeperWildFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperWildWorld) return {};
    const encounter = readEncounter(state);
    const essence = readEssence(state);
    const product = readFourFlavors(state);
    const steel = redSteelView(state);
    const actions = {...readActions(encounter, state.clock), ...essenceActions(state, encounter, essence),
        fuse_four: fourFlavorsReady(state, encounter, essence),
        ...lineActions(state, redSteelLine, fourCommitted(state) ? null : product, steel),
        ...sevenActions(state, product, steel.fed, nineCommitsSeven(state)), ...nineActions(state, sevenSpecimen(state))};
    return {[`${keeperFourFlavors}.held`]: !!product,
        ...Object.fromEntries(Object.entries(actions)
            .map(([action, ready]) => [`${keeperWildEffectPack(action) ?? keeperNine}.can_${action}`, ready]))};
}

export function keeperWildView(state, record) {
    const encounter = readEncounter(state);
    if (!encounter) return null;
    const {id, lifecycle, phase, controlled, refuge, roam} = encounter;
    const familiar = liquorWormFamiliarity(lifecycle.individuals[id], 'player');
    const essence = hasPin(record, keeperWormEssence) ? readEssence(state) : null;
    return {phase, controlled, refuge, familiar, canFind: readActions(encounter, state.clock).find,
        ...(roam && {roam: {returning: phase === 'roaming' && roam.due !== null}}),
        essence: essence && {fed: essence.fed, middle: essence.middle, lastCut: essence.lastCut},
        fourFlavors: hasPin(record, keeperFourFlavors) && !fourCommitted(state) ? readFourFlavors(state) : null,
        seven: sevenView(state, record),
        nine: nineView(state, record),
        redSteel: hasPin(record, keeperRedSteel) ? redSteelView(state) : null};
}

export function applyKeeperWildEffect(state, effect, context) {
    const pack = keeperWildEffectPack(effect.operation);
    const location = effect.operation === 'cast_seven' ? hostedWolfGlade : `${prefix}.annex`;
    if (!isKeeperWildEffect(effect) || context.actorId !== 'player' ||
        state.actors.player?.worldId !== keeperWildWorld || state.simulation.people.player.location !== location ||
        !hasPin(context.structuredNative) || !hasPin(context.structuredNative, pack)) {
        throw Error('Follow the Liquor Worm trail from the Gu house.');
    }
    const {clock} = state;
    const encounter = readEncounter(state);
    const {operation} = effect;
    if (pack === keeperSeven) {
        applySeven(state, context.structuredNative, operation, readFourFlavors(state), redSteelView(state).fed, nineCommitsSeven(state));
        return;
    }
    if (pack === keeperNine) {
        applyNine(state, context.structuredNative, operation, sevenSpecimen(state));
        return;
    }
    if (pack === keeperWormEssence) {
        applyEssence(state, encounter, operation);
        return;
    }
    if (pack === keeperFourFlavors) {
        if (!hasPin(context.structuredNative, keeperWormEssence)) throw Error('Learn to tend the wild Worm first.');
        applyFourFlavors(state, encounter);
        return;
    }
    if (pack === keeperRedSteel) {
        if (!hasPin(context.structuredNative, keeperFourFlavors) || !hasPin(context.structuredNative, keeperRankTrialId)) {
            throw Error('Prepare Four Flavors and the Moonglow trial first.');
        }
        applyLine(state, redSteelLine, fourCommitted(state) ? null : readFourFlavors(state), operation, context.gameplay?.player?.inventory);
        return;
    }
    if (!readActions(encounter, clock)[operation]) throw Error('The Liquor Worm trail has changed.');
    let next = encounter;
    if (!encounter) {
        const found = discoverLiquorWorm(restoreCreatureLifecycle(null), {
            site: border, seed: state.simulation.seed, source: keeperWild, identity: 'border-worm', clock,
        });
        next = {id: found.id, lifecycle: found.state, phase: 'trail', controlled: false, refuge: false, releasedAt: null};
    } else if (operation === 'watch_worm') {
        const lastDrink = next.lifecycle.individuals[next.id].experience.player?.lastAt ?? null;
        next.roam = {due: trailDeadline(next, clock), lastDrink};
    } else if (operation === 'leave_wine') {
        next.roam.due = liquorWormWineArrival(clock, next.roam.lastDrink);
    } else if (operation === 'find') {
        next.phase = 'trail';
        next.releasedAt = null;
        if (next.roam) next.roam.due = trailDeadline(next, clock);
    } else if (operation === 'approach') {
        next.phase = 'sheltered';
    } else if (operation === 'follow') {
        next.refuge = true;
    } else if (operation === 'lure') {
        next.lifecycle = lureLiquorWorm(next.lifecycle, next.id, 'player', clock, 1);
        next.phase = 'lured';
        if (next.roam) next.roam = {lastDrink: clock, due: trailDeadline(next, clock)};
    } else if (operation === 'refine') {
        next.controlled = true;
    } else {
        const capture = operation === 'capture';
        next.lifecycle = moveLiquorWorm(next.lifecycle, next.id, {keeper: capture ? 'player' : null,
            site: capture ? enclosure : border, clock});
        next.phase = capture ? 'held' : 'released';
        next.controlled = false;
        next.releasedAt = capture ? null : clock;
        if (next.roam) next.roam.due = null;
    }
    writeEncounter(state, next);
}

function trailDeadline(encounter, clock) {
    return clock + liquorWormTrailWindow(encounter.lifecycle.individuals[encounter.id], 'player');
}

export function nextRoamingWormBoundary(state) {
    return state.worlds[keeperWildWorld]?.facts?.[wakeKey] ?? Infinity;
}

export function advanceRoamingWorm(state) {
    if (nextRoamingWormBoundary(state) > state.clock) return 0;
    const encounter = readEncounter(state);
    const {id, roam, phase} = encounter;
    const at = roam.due;
    const returning = phase === 'roaming';
    encounter.lifecycle = moveLiquorWorm(encounter.lifecycle, id, {keeper: null, site: returning ? border : cellar, clock: at});
    if (returning) {
        encounter.lifecycle = lureLiquorWorm(encounter.lifecycle, id, 'player', at, 1);
        encounter.phase = 'lured';
        encounter.refuge = true;
        encounter.roam = {lastDrink: at, due: trailDeadline(encounter, at)};
    } else {
        encounter.phase = 'roaming';
        encounter.roam.due = null;
    }
    writeEncounter(state, encounter);
    return 1;
}

function applyFourFlavors(state, encounter) {
    if (!fourFlavorsReady(state, encounter, readEssence(state))) throw Error('Both Liquor Worms need to be alive and ready.');
    const id = `${keeperFourFlavors}.specimen`;
    const ingredients = {first: encounter.id, second: clanWorm};
    const world = {gu: Object.values(ingredients).map(id => ({id, kind: liquorWormSpecies, rank: 1,
        alive: true, holder: 'player'})), attempts: [], stocks: {player: Object.fromEntries(fourFlavorsWines.map(row => [row.flavor, 1]))}};
    let next = beginGuRefinement(world, {id, refiner: 'player', recipe: fourFlavorsRecipe, ingredients});
    for (const stage of fourFlavorsRecipe.stages) next = stepGuRefinement(next, id);
    const product = next.gu.find(gu => gu.alive && gu.id === id);
    if (!product || next.gu.filter(gu => gu.fate === 'consumed').length !== 2) throw Error('The four wines did not settle.');
    const clock = state.clock;
    const lifecycle = moveLiquorWorm(encounter.lifecycle, encounter.id, {keeper: null, site: fusedHabitat, clock});
    const facts = state.worlds[keeperWildWorld].facts;
    writeEncounter(state, {...encounter, lifecycle, controlled: false, phase: 'fused'});
    facts[fusionKey] = product.id;
    const clan = state.simulation.people[clanWorm];
    clan.vitals.health = 0;
    clan.life = 'dead';
    clan.body.controllerId = clanWorm;
    clan.lifeCause = {cause: id, reason: 'Consumed in the Four Flavors fusion.', at: clock};
    // Close the clan's title with its issuer. Legacy orders require a title
    // held by the player and therefore cannot be restarted for this specimen.
    Object.assign(state.simulation.claims[`${prefix}.worm_title`], {owner: steward, status: 'settled', cause: id});
    state.actors[clanWorm].facts[`${prefix}.worm_kept`] = false;
    state.actors.player.facts[`${prefix}.auto_worm`] = false;
}

function applyEssence(state, encounter, operation) {
    const essence = readEssence(state);
    if (!essenceActions(state, encounter, essence)[operation]) throw Error('The Worm or the essence is no longer ready.');
    const facts = state.worlds[keeperWildWorld].facts;
    if (operation === 'feed') {
        facts[fedAtKey] = state.clock;
    } else if (operation === 'cast_middle') {
        const {rank, stage} = liquorWormConversion;
        const result = resolveGuActivation({stages: [{
            gu: {id: moonId, kind: 'moonlight', rank: 1, fedThrough: state.clock}, operator: 'player', ability: moonlightBlade,
            supply: {pool: 'middle-copper', family: 'primeval', rank, stage, source: 'condensed'},
        }], reserves: {player: {'middle-copper': essence.middle}}, day: state.clock});
        if (result.outcome !== 'complete' || result.activations[0].cost !== 1) throw Error('The refined Moonblade could not form.');
        facts[cutKey] = result.effects[0].magnitude;
    }
    // Successful conversion and cast counts are the conserved aperture pool.
}
