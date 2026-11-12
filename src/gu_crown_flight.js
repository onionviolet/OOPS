import {transferCreature} from './creature_lifecycle.js';
import {guCatalogue} from './gu_catalogue.js';
import {captureFleeingGu, fleeingGu, guFlightStatus, startGuFlight} from './gu_flight.js';
import {resolveGuActivation} from './gu_activation.js';

export const crownFlight = 'book.ri.keeper.crown_flight';
export const sparkScrub = `${crownFlight}.scrub`;
export const shieldLedge = `${crownFlight}.ledge`;
export const shieldBank = `${crownFlight}.bank`;
export const crownRetired = {id: `${crownFlight}.dead`, capacity: 1, supportedSpecies: ['lightning-wolf']};
export const flightOperations = ['start_flight', 'touch_spark', 'tongs_spark', 'touch_shield', 'pluck_shield', 'refine_shield', 'shield_cross'];
export const flightSites = {touch_spark: sparkScrub, tongs_spark: sparkScrub, touch_shield: shieldLedge,
    pluck_shield: shieldLedge, refine_shield: shieldLedge, shield_cross: shieldLedge};
const routes = {spark: {site: sparkScrub, minutes: 10}, shield: {site: shieldLedge, minutes: 22}};
const shield = guCatalogue['thunder-shield'].ability.value;
const done = (state, name) => state.actors.player.completed[`${crownFlight}.${name}`] ?? 0;
export const flightPinned = record => record?.extensions?.some(row => row.id === crownFlight);

export function flightActions(row, {clock, ready}) {
    const crown = row?.scouting;
    const flight = row?.flight;
    const spark = fleeingGu(flight, 'spark', {site: sparkScrub, clock});
    const liveShield = fleeingGu(flight, 'shield', {site: shieldLedge, clock});
    return {start_flight: ready && crown?.movedAt != null && crown.custody !== 'host' && !flight,
        touch_spark: ready && spark?.resistedAt === null, tongs_spark: ready && !!spark,
        touch_shield: ready && liveShield?.resistedAt === null, pluck_shield: ready && liveShield?.resistedAt != null,
        refine_shield: ready && flight?.gu.shield.custody === 'captured',
        shield_cross: ready && flight?.gu.shield.custody === 'refined'};
}

export function flightView(row, record, clock) {
    if (!row.flight || !flightPinned(record)) return null;
    return {crossed: row.flight.crossed, gu: Object.fromEntries(Object.entries(row.flight.gu).map(([kind, gu]) =>
        [kind, {status: guFlightStatus(gu, clock), remaining: Math.max(0, gu.until - clock), tried: gu.resistedAt !== null}]))};
}

export function validateCrownFlight(row, state, record) {
    const flight = row?.flight;
    if (!flight) {
        if (flightOperations.some(name => done(state, name))) throw Error('The flight needs its crown wolf and release receipt.');
        return;
    }
    const animal = row.lifecycle.individuals[flight.host];
    const at = value => Number.isSafeInteger(value) && value >= flight.at && value <= state.clock;
    if (!flightPinned(record) || done(state, 'start_flight') !== 1 || flight.host !== row.scouting?.host ||
        !Number.isSafeInteger(flight.at) || flight.at < row.scouting.movedAt || flight.at > state.clock ||
        animal?.habitat !== crownRetired.id || animal.health.lastAt !== flight.at ||
        Object.keys(flight.gu ?? {}).length !== 2 ||
        Object.entries(routes).some(([kind, route]) => {
            const gu = flight.gu?.[kind];
            return gu?.id !== `${flight.host}.${kind}` || gu.site !== route.site || gu.until !== flight.at + route.minutes ||
                !['wild', 'captured', ...(kind === 'shield' ? ['refined'] : [])].includes(gu.custody) ||
                (gu.resistedAt !== null) !== (done(state, `touch_${kind}`) === 1) ||
                gu.resistedAt !== null && (!at(gu.resistedAt) || gu.resistedAt >= gu.until) ||
                (gu.capturedAt === null) !== (gu.custody === 'wild') ||
                gu.capturedAt !== null && (!at(gu.capturedAt) || gu.capturedAt >= gu.until ||
                    gu.resistedAt !== null && gu.capturedAt < gu.resistedAt);
        }) || Number(flight.gu.spark.custody !== 'wild') !== done(state, 'tongs_spark') ||
        Number(flight.gu.shield.custody !== 'wild') !== done(state, 'pluck_shield') ||
        Number(flight.gu.shield.custody === 'refined') !== done(state, 'refine_shield') ||
        typeof flight.crossed !== 'boolean' || flight.crossed !== (done(state, 'shield_cross') > 0) ||
        flight.crossed && flight.gu.shield.custody !== 'refined') throw Error('The fleeing Gu and their capture receipts disagree.');
}

function use(gu, ability, clock, {rank, reserve, source = 'stored'}) {
    const result = resolveGuActivation({stages: [{operator: 'player', ability,
        gu: {id: gu.id, kind: ability.effect.kind, rank, fedThrough: clock},
        supply: {pool: 'essence', family: 'primeval', rank, source}}],
    reserves: {player: {essence: reserve}}, day: clock});
    if (!result.effects.some(effect => effect.kind === ability.effect.kind)) throw Error('The Gu did not respond.');
}

export function applyCrownFlight(row, state, operation) {
    const clock = state.clock;
    const flight = row.flight;
    if (operation === 'start_flight') {
        const host = row.scouting.host;
        row.lifecycle = transferCreature(row.lifecycle, {revision: row.lifecycle.revision, id: host,
            fromKeeper: null, toKeeper: null, destination: crownRetired, clock});
        row.flight = {...startGuFlight({host, clock, routes}), crossed: false};
    } else if (operation === 'touch_spark') {
        use(flight.gu.spark, {fuel: 'primeval', cost: 1, effect: {kind: 'shock', magnitude: 1}}, clock, {rank: 3, reserve: 1});
        flight.gu.spark.resistedAt = clock;
    } else if (operation === 'touch_shield') {
        use(flight.gu.shield, shield, clock, {rank: 3, reserve: shield.cost});
        flight.gu.shield.resistedAt = clock;
    } else if (operation === 'tongs_spark') captureFleeingGu(flight, 'spark', {site: sparkScrub, clock});
    else if (operation === 'pluck_shield') {
        use({id: `${crownFlight}.plunder`}, {fuel: 'primeval', cost: 4,
            effect: {kind: 'suppress-wild-will', magnitude: 1}}, clock, {rank: 1, reserve: 4, source: 'aperture'});
        captureFleeingGu(flight, 'shield', {site: shieldLedge, clock});
    } else if (operation === 'refine_shield') flight.gu.shield.custody = 'refined';
    else if (operation === 'shield_cross') {
        use(flight.gu.shield, shield, clock, {rank: 3, reserve: shield.cost});
        flight.crossed = true;
    }
}
