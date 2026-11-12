import {fixedImmortalTravel, fixedImmortalTravelAbility, quoteFixedImmortalTravel} from './gu_fixed_immortal_travel.js';
import {transferGuClaim} from './gu_world_claims.js';
import {readKeeperFixedClaim, keeperFixedClaimAt, writeKeeperFixedClaim, keeperFixedSpecimen, fixedClaimOriginal,
    fixedGuSeated, fixedClaimSteward as steward} from './gu_keeper_fixed_claim.js';
import {keeperGate} from './gu_stargate.js';

const prefix = 'book.ri.keeper';
export const keeperFixedTravel = `${prefix}.fixed_immortal_travel`;
export const keeperFixedTravelWorld = `${prefix}.world`;
export const fixedTravelAnnex = `${prefix}.annex`;
export const fixedTravelHill = `${keeperGate}.observatory`;
export const fixedTravelDose = JSON.stringify({id: `${keeperFixedTravel}.green_grape`});
export const fixedTravelCost = fixedImmortalTravelAbility.cost;
const operations = ['borrow', 'return_loan', 'travel_out', 'travel_back'];
const sites = {
    [fixedTravelAnnex]: {id: fixedTravelAnnex, scene: 'The cedar desk beside the annex door.', memory: `${keeperFixedTravel}.annex_impression`},
    [fixedTravelHill]: {id: fixedTravelHill, scene: 'The stone terrace beside the hill Stargate.', memory: `${keeperFixedTravel}.hill_impression`},
};
const hasPin = record => record?.extensions?.some(pin => pin.id === keeperFixedTravel);
const done = (state, operation) => state.actors.player.completed[`${keeperFixedTravel}.${operation}`] ?? 0;

export const fixedTravelMemory = site => sites[site].memory;
export const fixedTravelScene = site => sites[site].scene;

export function isKeeperFixedTravelEffect(effect) {
    return effect.type === 'guFixedTravel' && effect.actor === 'player' && operations.includes(effect.operation) &&
        Object.keys(effect).every(key => ['type', 'actor', 'operation'].includes(key));
}

function memory(state, destination) {
    const observed = state.simulation.knowledge.player?.[destination.memory];
    return observed?.stage === 'understood' ? {site: destination.id, scene: observed.value} : null;
}

export function quoteKeeperFixedTravel(state, gu, target, rank = 6) {
    const destination = sites[target];
    return quoteFixedImmortalTravel({gu: gu && {...gu, fedThrough: state.clock}, operator: 'player', now: state.clock,
        from: state.simulation.people.player.location, destination, impression: memory(state, destination),
        supply: {pool: rank === 6 ? 'green-grape' : 'red-date', family: 'immortal', rank, source: 'stored'}, reserve: fixedTravelCost});
}

function options(state, world) {
    const gu = keeperFixedSpecimen(world);
    const held = gu?.holder === 'player';
    const free = held && !fixedGuSeated(world, gu);
    const stewardHere = state.simulation.people[steward]?.life === 'alive' &&
        state.simulation.people[steward].location === fixedTravelAnnex;
    return {borrow: stewardHere && (!world || gu?.holder === steward), return_loan: stewardHere && free,
        travel_out: free && gu.rank === 6 && quoteKeeperFixedTravel(state, gu, fixedTravelHill).spent === fixedTravelCost,
        travel_back: free && gu.rank === 6 && quoteKeeperFixedTravel(state, gu, fixedTravelAnnex).spent === fixedTravelCost};
}

export function keeperFixedTravelFacts(state, actor) {
    if (actor !== 'player' || state.actors.player?.worldId !== keeperFixedTravelWorld) return {};
    return Object.fromEntries(Object.entries(options(state, keeperFixedClaimAt(state)))
        .map(([operation, allowed]) => [`${keeperFixedTravel}.can_${operation}`, !!allowed]));
}

export function validateKeeperFixedTravel(state, record) {
    const world = readKeeperFixedClaim(state);
    const borrows = done(state, 'borrow'), returns = done(state, 'return_loan');
    const destroyed = world?.gu.filter(gu => !gu.alive && gu.holder === 'player').length ?? 0;
    if ((!!world !== (borrows > 0)) || world && borrows - returns - destroyed !== Number(keeperFixedSpecimen(world)?.holder === 'player') ||
        (!world && (returns || done(state, 'travel_out') || done(state, 'travel_back'))) ||
        (world || done(state, 'remember_annex') || done(state, 'remember_hill')) && !hasPin(record) ||
        Object.values(sites).some(site => {
            const impression = memory(state, site);
            const visits = done(state, site.id === fixedTravelAnnex ? 'remember_annex' : 'remember_hill');
            return !!impression !== (visits > 0) || impression && impression.scene !== site.scene;
        })) throw Error('Fixed Immortal Travel needs its loan and destination impressions.');
}

export function keeperFixedTravelView(state, record, inventory) {
    if (!hasPin(record)) return null;
    const world = keeperFixedClaimAt(state);
    const gu = keeperFixedSpecimen(world);
    return {held: gu?.holder === 'player', rank: gu?.rank, vacant: !!world && !gu, doses: inventory[fixedTravelDose] ?? 0,
        knowsAnnex: !!memory(state, sites[fixedTravelAnnex]), knowsHill: !!memory(state, sites[fixedTravelHill])};
}

export function applyKeeperFixedTravelEffect(state, effect, context) {
    if (!isKeeperFixedTravelEffect(effect) || !hasPin(context.structuredNative) ||
        context.actorId !== 'player' || state.actors.player?.worldId !== keeperFixedTravelWorld) {
        throw Error('Take up the steward’s Fixed Immortal Travel loan first.');
    }
    const {operation} = effect;
    const from = state.simulation.people.player.location;
    const requiredFrom = operation === 'travel_back' ? fixedTravelHill : fixedTravelAnnex;
    const world = keeperFixedClaimAt(state);
    if (from !== requiredFrom || !options(state, world)[operation]) throw Error('The Gu or the destination is no longer ready.');
    if (operation === 'travel_out' || operation === 'travel_back') return;
    const current = world ?? {gu: [{id: fixedClaimOriginal, kind: fixedImmortalTravel, rank: 6,
        uniqueKey: fixedImmortalTravel, alive: true, holder: steward}], attempts: [], stocks: {}};
    const [source, target] = operation === 'borrow' ? [steward, 'player'] : ['player', steward];
    writeKeeperFixedClaim(state, transferGuClaim(current, {key: fixedImmortalTravel, from: source, to: target}));
}
