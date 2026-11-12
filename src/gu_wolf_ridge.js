import {acquireCreature, advanceWildHabitat, habitatOccupancy, openWildHabitat, restoreCreatureLifecycle,
    settleCohortStock, transferCreature} from './creature_lifecycle.js';
import {guCatalogue} from './gu_catalogue.js';
import {resolveGuActivation} from './gu_activation.js';
import {drawGuTraits} from './gu_traits.js';
import {applyCrown, crownActions, crownView, scoutingPinned, settleCrownMigration, validateCrown,
    wolfScoutOperations, wolfScouting} from './gu_wolf_scouting.js';
import {applyCrownFlight, crownFlight, flightActions, flightOperations, flightPinned, flightView, validateCrownFlight} from './gu_crown_flight.js';

export const wolfRidge = 'book.ri.keeper.wolf_ridge';
export const wolfShelf = `${wolfRidge}.shelf`;
export const ridgeInterval = 30;
export const ridgeOperations = ['watch_ridge', 'mark_wolf', 'take_hare', 'fresh_trail', 'returning_trail',
    'spare_wolf', 'hunt_ridge_wolf', 'refine_wings', 'fly_shelf'];
const fact = `${wolfRidge}.population`;
const world = 'book.ri.keeper.world';
const prey = 'ridge-hare';
const wolf = 'lightning-wolf';
const hareCohort = `${wolfRidge}.hares`;
const wolfCohort = `${wolfRidge}.wolves`;
const habitat = {id: wolfRidge, capacity: 9, supportedSpecies: [prey, wolf],
    preyRequirements: {[wolf]: {species: prey, perPredator: 2}}};
const retired = {id: `${wolfRidge}.dead`, capacity: Number.MAX_SAFE_INTEGER, supportedSpecies: [wolf]};
const populations = [{id: wolfCohort, births: 1, losses: 1}, {id: hareCohort, births: 1, losses: 1}];
const coat = {mark: [{id: 'split-ear', weight: 1}, {id: 'white-paw', weight: 1}, {id: 'grey-muzzle', weight: 1}],
    hosted: [{id: 'wings', weight: 1}, {id: 'none', weight: 2}]};
const wings = guCatalogue['thunderwings'].ability.value;
const pin = record => record?.extensions?.some(row => row.id === wolfRidge);
const done = (state, operation) => state.actors.player.completed[`${wolfRidge}.${operation}`] ?? 0;

function stock(lifecycle, id, species, delta) {
    return settleCohortStock(lifecycle, {revision: lifecycle.revision, id, species, habitat, delta});
}
function move(lifecycle, id, destination, clock) {
    return transferCreature(lifecycle, {revision: lifecycle.revision, id, fromKeeper: null, toKeeper: null, destination, clock});
}
function open(original) {
    const host = original.lifecycle.individuals[original.host];
    const at = host.health.lastAt;
    let lifecycle = stock(original.lifecycle, hareCohort, prey, 6);
    lifecycle = stock(lifecycle, wolfCohort, wolf, 2);
    if (!original.dead) lifecycle = move(lifecycle, original.host, habitat, at);
    lifecycle = openWildHabitat(lifecycle, {revision: lifecycle.revision, id: habitat.id, clock: at, interval: ridgeInterval});
    return {original: original.host, openedAt: at, lifecycle, tracks: {}, focus: null, last: null};
}
function read(state) {
    const raw = state.worlds[world]?.facts?.[fact];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid wolf ridge record.');
    const row = JSON.parse(raw);
    return {...row, lifecycle: restoreCreatureLifecycle(row.lifecycle)};
}

export function controlledRidgeEye(state) {
    const eye = read(state)?.scouting;
    return eye?.custody === 'refined' ? eye.gu : null;
}
function project(row, clock) {
    if (!row) return null;
    const moved = settleCrownMigration(row, {clock, habitat, due: row.lifecycle.habitats[habitat.id].nextAt,
        hareStock: row.lifecycle.cohorts[hareCohort].stock});
    const {state, pending} = advanceWildHabitat(moved.lifecycle, {revision: moved.lifecycle.revision, habitat, clock, populations});
    return {...moved, lifecycle: state, pending};
}
function returner(row, clock) {
    return Object.entries(row?.tracks ?? {}).find(([, track]) => track.custody === 'wild' && track.returnAt <= clock)?.[0];
}
function held(row, custody) {
    return Object.entries(row?.tracks ?? {}).find(([, track]) => track.custody === custody)?.[0];
}
export function ridgeReady(original) {
    return !!original && (original.dead || original.gu.custody === 'keeper' && !original.lifecycle.individuals[original.host].keeper);
}
function actions(row, clock) {
    const ready = !!row && !row.pending;
    const focus = row?.focus && row.tracks[row.focus];
    const stock = row?.lifecycle.cohorts[wolfCohort].stock ?? 0;
    const support = ready && habitatOccupancy(row.lifecycle, habitat.id, wolf) <=
        Math.floor(row.lifecycle.cohorts[hareCohort].stock / habitat.preyRequirements[wolf].perPredator);
    return {watch_ridge: true, mark_wolf: ready && clock >= row.openedAt + ridgeInterval &&
        row.lifecycle.individuals[row.original].habitat === habitat.id,
    take_hare: ready && row.lifecycle.cohorts[hareCohort].stock > 0,
    fresh_trail: support && !focus && stock > 0,
    returning_trail: ready && !focus && !!returner(row, clock),
    spare_wolf: ready && focus?.custody === 'wild', hunt_ridge_wolf: ready && focus?.custody === 'wild',
    refine_wings: ready && !!held(row, 'captured'), fly_shelf: ready && !!held(row, 'refined'),
    ...crownActions(row, {clock, stock: support ? stock : 0, ready}), ...flightActions(row, {clock, ready})};
}
export function ridgeFacts(state, original) {
    const row = project(read(state), state.clock);
    return {[`${wolfRidge}.ready`]: ridgeReady(original), [`${wolfScouting}.moved`]: row?.scouting?.movedAt != null,
        [`${crownFlight}.opened`]: !!row?.flight,
        ...Object.fromEntries(Object.entries(actions(row, state.clock))
            .map(([name, allowed]) => [`${flightOperations.includes(name) ? crownFlight : wolfScoutOperations.includes(name) ? wolfScouting : wolfRidge}.can_${name}`, !!allowed]))};
}
export function ridgeView(state, record) {
    if (!pin(record)) return null;
    const row = project(read(state), state.clock);
    if (!row) return null;
    const {lifecycle, tracks, focus} = row;
    const active = focus && tracks[focus];
    const airworthy = held(row, 'refined');
    const captured = held(row, 'captured');
    return {hares: habitatOccupancy(lifecycle, habitat.id, prey), wolves: habitatOccupancy(lifecycle, habitat.id, wolf),
        next: Math.max(0, lifecycle.habitats[habitat.id].nextAt - state.clock), last: row.last, pending: row.pending,
        focus: active ? {...lifecycle.individuals[focus].traits, hosted: active.hosted} : null,
        wingState: airworthy ? 'refined' : captured ? 'captured' : null, scouting: crownView(row, record, state.clock),
        flight: flightView(row, record, state.clock)};
}
export function validateWolfRidge(state, record, original) {
    const row = read(state);
    const extraCohorts = validateCrown(row, state, record, habitat, wolfCohort);
    validateCrownFlight(row, state, record);
    if (!row) {
        if (ridgeOperations.some(name => done(state, name))) throw Error('The ridge needs its population record.');
        return;
    }
    const {lifecycle, tracks, focus, openedAt} = row;
    const originalHost = original?.lifecycle.individuals[original.host];
    const originalHere = lifecycle.individuals[row.original];
    const clock = lifecycle.habitats[habitat.id];
    const entries = Object.entries(tracks ?? {});
    const dead = entries.filter(([, track]) => track.custody !== 'wild');
    if (!pin(record) || !ridgeReady(original) || !done(state, 'watch_ridge') || row.original !== original.host ||
        originalHere?.habitat !== (original.dead ? originalHost.habitat : habitat.id) ||
        originalHere?.bornAt !== originalHost.bornAt || originalHere?.origin !== originalHost.origin ||
        openedAt !== originalHost.health.lastAt || clock?.interval !== ridgeInterval ||
        clock.nextAt - ridgeInterval > state.clock || (clock.nextAt - openedAt) % ridgeInterval ||
        ![null, 'marked', 'fresh', 'returned', 'spared', 'hunted', 'flew'].includes(row.last) ||
        !tracks || Array.isArray(tracks) || (focus !== null && tracks[focus]?.custody !== 'wild') ||
        Object.keys(lifecycle.individuals).length !== entries.length + 1 + Number(!!row.scouting) || entries.length !== done(state, 'fresh_trail') ||
        row.scouting && (row.scouting.host === row.original || Object.hasOwn(tracks, row.scouting.host)) ||
        dead.length !== done(state, 'hunt_ridge_wolf') || dead.filter(([, track]) => track.custody === 'refined').length !== done(state, 'refine_wings') ||
        entries.some(([id, track]) => {
            const animal = lifecycle.individuals[id];
            return id === row.original || !animal || animal.origin !== wolfCohort || animal.keeper !== null ||
                animal.bornAt > state.clock || animal.habitat !== (track.custody === 'wild' ? habitat.id : retired.id) ||
                !coat.mark.some(mark => mark.id === animal.traits.mark) ||
                !['wild', 'empty', 'captured', 'refined'].includes(track.custody) ||
                !['wings', 'none'].includes(track.hosted) || (track.custody === 'empty') !== (track.custody !== 'wild' && track.hosted === 'none') ||
                track.gu !== (track.hosted === 'wings' ? `${wolfRidge}.wings.${animal.serial}` : null) ||
                !Number.isSafeInteger(track.returnAt) || track.returnAt < animal.bornAt || track.returnAt > state.clock + ridgeInterval;
        }) || !Object.keys(lifecycle.cohorts).every(id => [hareCohort, wolfCohort, originalHere.origin, ...extraCohorts].includes(id)) ||
        lifecycle.cohorts[hareCohort]?.species !== prey || lifecycle.cohorts[wolfCohort]?.species !== wolf ||
        habitatOccupancy(lifecycle, habitat.id) > habitat.capacity) throw Error('The ridge hosts and their hunt receipts disagree.');
}

export function applyWolfRidge(state, record, operation, original) {
    if (!pin(record) || !ridgeReady(original)) throw Error('Follow up the first wolf trail.');
    if (flightOperations.includes(operation) && !flightPinned(record)) throw Error('Speak to the hunter about the ravine pursuit.');
    if (wolfScoutOperations.includes(operation) && !scoutingPinned(record)) throw Error('Speak to the hunter about scouting.');
    const clock = state.clock;
    const row = project(read(state) ?? open(original), clock);
    if (!actions(row, clock)[operation] || operation !== 'watch_ridge' && !done(state, 'watch_ridge')) {
        throw Error('Read the ridge tracks before acting.');
    }
    const {lifecycle} = row;
    if (flightOperations.includes(operation)) applyCrownFlight(row, state, operation);
    else if (wolfScoutOperations.includes(operation)) applyCrown(row, state, operation, habitat, wolfCohort);
    else if (operation === 'mark_wolf') row.last = 'marked';
    else if (operation === 'take_hare') row.lifecycle = stock(lifecycle, hareCohort, prey, -1);
    else if (operation === 'fresh_trail') {
        const serial = lifecycle.nextIdentity;
        const traits = drawGuTraits({seed: state.simulation.seed, source: wolfRidge, identity: `wolf-${serial}`, table: coat});
        const hosted = !done(state, 'fresh_trail') ? 'wings' : traits.hosted;
        const animal = acquireCreature(lifecycle, {revision: lifecycle.revision, cohortId: wolfCohort,
            destination: habitat, keeper: null, traits: {mark: traits.mark}, clock});
        row.lifecycle = animal.state;
        row.focus = animal.id;
        row.tracks[animal.id] = {hosted, gu: hosted === 'wings' ? `${wolfRidge}.wings.${serial}` : null,
            returnAt: clock, custody: 'wild'};
        row.last = 'fresh';
    } else if (operation === 'returning_trail') {
        row.focus = returner(row, clock);
        row.last = 'returned';
    } else if (operation === 'spare_wolf' || operation === 'hunt_ridge_wolf') {
        const id = row.focus;
        const track = row.tracks[id];
        if (operation === 'spare_wolf') track.returnAt = clock + ridgeInterval;
        else {
            row.lifecycle = move(lifecycle, id, retired, clock);
            track.custody = track.hosted === 'wings' ? 'captured' : 'empty';
        }
        row.focus = null;
        row.last = operation === 'spare_wolf' ? 'spared' : 'hunted';
    } else if (operation === 'refine_wings') row.tracks[held(row, 'captured')].custody = 'refined';
    else if (operation === 'fly_shelf') {
        const gu = row.tracks[held(row, 'refined')].gu;
        const result = resolveGuActivation({stages: [{operator: 'player', ability: wings,
            gu: {id: gu, kind: 'thunderwings', rank: 3, fedThrough: clock},
            supply: {pool: 'white-silver', family: 'primeval', rank: 3, source: 'stored'}}],
        reserves: {player: {'white-silver': wings.cost}}, day: clock});
        if (!result.effects.some(effect => effect.kind === 'flight')) throw Error('Thunderwings did not carry you.');
        row.last = 'flew';
    }
    const {pending, ...saved} = row;
    state.worlds[world].facts[fact] = JSON.stringify(saved);
}
