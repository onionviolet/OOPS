import {acquireCreature, habitatOccupancy, settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {detectGuApproach} from './gu_senses.js';
import {observeGuCloak, resolveGuCloak} from './gu_concealment.js';
import {controlledStealthScales} from './gu_keeper_stealth.js';
import {separateHostedGu} from './gu_host_custody.js';
import {crownRetired} from './gu_crown_flight.js';

export const wolfScouting = 'book.ri.keeper.wolf_scouting';
export const wolfRavine = `${wolfScouting}.ravine`;
export const eyeExtractionCost = 2;
export const wolfScoutOperations = ['find_crown', 'scout_plain', 'scout_crown', 'scout_ravine',
    'screened', 'extract_eye', 'refine_eye', 'reveal_cache'];
const ravinePrey = `${wolfScouting}.ravine_hares`;
const prey = 'ridge-hare';
const species = 'lightning-wolf';
const ravine = {id: wolfRavine, capacity: 5, supportedSpecies: [prey, species],
    preyRequirements: {[species]: {species: prey, perPredator: 2}}};
const quietMinutes = 10;
const loan = {id: `${wolfScouting}.loan`, kind: 'stealth-scales', rank: 2};
const eye = guCatalogue['lightning-eye'].ability.value;
const eyeId = host => `${wolfScouting}.eye.${host}`;
const done = (state, operation) => state.actors.player.completed[`${wolfScouting}.${operation}`] ?? 0;
export const scoutingPinned = record => record?.extensions?.some(row => row.id === wolfScouting);
export const atRavine = operation => ['scout_ravine', 'screened', 'extract_eye', 'refine_eye', 'reveal_cache'].includes(operation);

export function settleCrownMigration(row, {clock, habitat, due, hareStock}) {
    const crown = row.scouting;
    if (!crown || crown.movedAt !== null || due > clock || hareStock > 4 ||
        habitatOccupancy(row.lifecycle, ravine.id, prey) < 2) return row;
    const lifecycle = transferCreature(row.lifecycle, {revision: row.lifecycle.revision, id: crown.host,
        fromKeeper: null, toKeeper: null, destination: ravine, clock: due});
    return {...row, lifecycle, scouting: {...crown, movedAt: due}};
}

export function crownActions(row, {clock, stock, ready}) {
    const crown = row?.scouting;
    const moved = crown?.movedAt != null;
    const quiet = (crown?.noticedAt ?? -quietMinutes) + quietMinutes <= clock;
    return {find_crown: ready && !crown && stock > 0,
        scout_plain: ready && !!crown && !!row.focus,
        scout_crown: ready && !!crown && !moved && quiet,
        scout_ravine: ready && moved && quiet && !row.flight,
        screened: ready && moved && quiet && crown.custody === 'host',
        extract_eye: ready && moved && quiet && crown.custody === 'host' && crown.screenedAt !== null && clock < crown.screenedAt + quietMinutes,
        refine_eye: ready && crown?.custody === 'captured', reveal_cache: ready && crown?.custody === 'refined' && !crown.cache};
}

export function crownView(row, record, clock) {
    const crown = row.scouting;
    return crown && scoutingPinned(record) ? {moved: crown.movedAt !== null, dead: !!row.flight, custody: crown.custody,
        plain: crown.plain, plainOwned: !!crown.plainGu, result: crown.result, cache: crown.cache,
        quietIn: crown.noticedAt === null ? 0 : Math.max(0, crown.noticedAt + quietMinutes - clock)} : null;
}

export function validateCrown(row, state, record, habitat, wolfCohort) {
    const crown = row?.scouting;
    if (!crown) {
        if (wolfScoutOperations.some(name => done(state, name))) throw Error('The crown wolf needs its sighting.');
        return [];
    }
    const animal = row.lifecycle.individuals[crown.host];
    const hares = row.lifecycle.cohorts[ravinePrey];
    const at = value => Number.isSafeInteger(value) && value >= animal?.bornAt && value <= state.clock;
    const received = ['captured', 'refined'].includes(crown.custody);
    if (!scoutingPinned(record) || done(state, 'find_crown') !== 1 || !animal || animal.origin !== wolfCohort ||
        animal.keeper !== null || animal.traits.mark !== 'pale-crest' || !at(animal.bornAt) ||
        animal.habitat !== (row.flight ? crownRetired.id : crown.movedAt === null ? habitat.id : ravine.id) ||
        crown.gu !== eyeId(crown.host) || !['host', 'captured', 'refined'].includes(crown.custody) ||
        (crown.movedAt !== null && (!at(crown.movedAt) || !row.flight && animal.health.lastAt !== crown.movedAt ||
            (crown.movedAt - row.openedAt) % row.lifecycle.habitats[habitat.id].interval !== 0)) ||
        ![null, 'seen', 'hidden', 'screened'].includes(crown.result) ||
        ![null, 'hidden'].includes(crown.plain) || (crown.plain !== null) !== (done(state, 'scout_plain') > 0) ||
        crown.plainGu !== undefined && (crown.plain !== 'hidden' || crown.plainGu !== controlledStealthScales(state)?.id) ||
        (crown.noticedAt !== null && !at(crown.noticedAt)) || (crown.result === 'seen' && crown.noticedAt === null) ||
        (crown.screenedAt !== null && !at(crown.screenedAt)) ||
        Number(received) !== done(state, 'extract_eye') || Number(crown.custody === 'refined') !== done(state, 'refine_eye') ||
        typeof crown.cache !== 'boolean' || Number(crown.cache) !== done(state, 'reveal_cache') ||
        (crown.cache && crown.custody !== 'refined') || received && crown.movedAt === null ||
        !hares || hares.species !== prey || hares.habitat !== ravine.id || hares.stock !== 4) {
        throw Error('The crown wolf, its sight and its trail disagree.');
    }
    return [ravinePrey];
}

function activate(kind, id, rank, clock, supplyRank, reserve, source) {
    const ability = guCatalogue[kind].ability.value;
    const result = resolveGuActivation({stages: [{gu: {id, kind, rank, fedThrough: clock}, operator: 'scout', ability,
        supply: {pool: 'essence', family: 'primeval', rank: supplyRank, source}}],
    reserves: {scout: {essence: reserve}}, day: clock});
    const effect = result.effects.find(row => row.kind === ability.effect.kind);
    if (!effect) throw Error('The scouting Gu did not respond.');
    return effect.magnitude;
}

function seenByWolf({clock, eyeGu, screened, owned}) {
    const cloak = screened ? null : resolveGuCloak({gu: owned ?? loan, clock, reserve: 2});
    const penetration = eyeGu ? activate('lightning-eye', eyeGu, 3, clock, 3, eye.cost, 'stored') : 0;
    return observeGuCloak({senses: {sight: {reach: 1, penetration}, scent: {reach: 0}}, cloak,
        screens: screened ? ['sight'] : []});
}

export function applyCrown(row, state, operation, habitat, wolfCohort) {
    const clock = state.clock;
    const crown = row.scouting;
    if (operation === 'find_crown') {
        const animal = acquireCreature(row.lifecycle, {revision: row.lifecycle.revision, cohortId: wolfCohort,
            destination: habitat, keeper: null, traits: {mark: 'pale-crest'}, clock});
        row.lifecycle = settleCohortStock(animal.state, {revision: animal.state.revision, id: ravinePrey, species: prey,
            habitat: ravine, delta: 4});
        row.scouting = {host: animal.id, gu: eyeId(animal.id), custody: 'host', movedAt: null,
            result: null, plain: null, noticedAt: null, screenedAt: null, cache: false};
    } else if (operation === 'scout_plain') {
        const owned = controlledStealthScales(state);
        if (seenByWolf({clock, owned})) throw Error('The wolf saw the scout.');
        crown.plain = 'hidden';
        if (owned) crown.plainGu = owned.id;
    } else if (['scout_crown', 'scout_ravine', 'screened'].includes(operation)) {
        const screened = operation === 'screened';
        const seen = seenByWolf({clock, eyeGu: crown.custody === 'host' ? crown.gu : null, screened,
            owned: controlledStealthScales(state)});
        crown.result = seen ? 'seen' : screened ? 'screened' : 'hidden';
        crown.screenedAt = screened && !seen ? clock : null;
        if (seen) crown.noticedAt = clock;
    } else if (operation === 'extract_eye') {
        separateHostedGu({id: `${wolfScouting}.plunder`, cost: eyeExtractionCost, clock});
        crown.custody = 'captured';
        crown.screenedAt = null;
    } else if (operation === 'refine_eye') crown.custody = 'refined';
    else if (operation === 'reveal_cache') {
        const penetration = activate('lightning-eye', crown.gu, 3, clock, 3, eye.cost, 'stored');
        if (!detectGuApproach({senses: {sight: {reach: 1, penetration}}, concealment: [{channel: 'sight', magnitude: 2}]})) {
            throw Error('Lightning Eye did not expose the hidden cache.');
        }
        crown.cache = true;
    }
}
