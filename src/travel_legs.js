// World-neutral long travel (GM31, WA37, SR1-SR24). A route is an ordered list of legs; each leg has a means, minutes, a fare and
// optional hazards. quoteRoute reads only; settleRoute returns what the caller must apply through the native owners (clock, purse,
// relocation, harm): it holds no state (AR3, AR12). Hazard rolls are ambient events keyed by world, route, leg and day (WA37), so a
// replay of the same day gives the same result and a forward anchor is not disturbed.
import {check, natural, object, deepFreeze} from './basics.js';
import {hashStreamSeed, xorshift32} from './hash_rng.js';
import {isOpen, hoursText} from './region_kit.js';
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const DAY = 1440;
const fareOk = f => f === undefined || object(f) && (natural(f.sum) || f.unstated === true || natural(f.perKm) && natural(f.km) && (f.cap === undefined || natural(f.cap)));
const MEANS = ['road', 'rail', 'sea', 'air', 'crossing', 'foot'];

export function defineRoute(row) {
    check(object(row) && id(row.id) && id(row.world) && Array.isArray(row.legs) && row.legs.length > 0, 'Invalid route.');
    const seen = new Set();
    for(const [i, leg] of row.legs.entries()) {
        check(object(leg) && id(leg.id) && !seen.has(leg.id) && id(leg.from) && id(leg.to) && leg.from !== leg.to && MEANS.includes(leg.means) && natural(leg.minutes) && leg.minutes > 0 && fareOk(leg.fare), `Invalid leg ${leg.id}.`);
        check(leg.hours === undefined || Array.isArray(leg.hours) && leg.hours.length === 2 && leg.hours.every(Number.isInteger) && leg.hours[0] !== leg.hours[1], `Invalid hours on ${leg.id}.`);
        check(i === 0 || leg.from === row.legs[i - 1].to, `Leg ${leg.id} does not start where the last one ends.`);
        seen.add(leg.id);
        const h = new Set();
        for(const hz of leg.hazards || []) {
            check(object(hz) && id(hz.id) && !h.has(hz.id) && Number.isFinite(hz.chance) && hz.chance >= 0 && hz.chance <= 1 && typeof hz.kind === 'string' && hz.kind && typeof hz.result === 'string' && hz.result, `Invalid hazard on ${leg.id}.`);
            h.add(hz.id);
        }
    }
    return deepFreeze(structuredClone({dial: {hazard: 1, priceLevel: 1}, ...row, dial: {hazard: 1, priceLevel: 1, ...(row.dial || {})}}));
}

export const legFare = (leg, level = 1) => {
    const f = leg.fare;
    if(!f || f.unstated) return null;
    if(natural(f.sum)) return Math.round(f.sum * level);
    const raw = f.perKm * f.km;
    return Math.round((f.cap === undefined ? raw : Math.min(raw, f.cap)) * level);
};
// Minutes to wait until a leg's service window opens, from an absolute minute-of-day clock.
const waitFor = (hours, minuteOfDay) => {
    if(!hours) return 0;
    const hour = Math.floor(minuteOfDay / 60) % 24;
    if(isOpen(hours, hour)) return 0;
    return (hours[0] * 60 - minuteOfDay + DAY) % DAY;
};
/** ctx: {money, minuteOfDay, proposedFare}. Reads only. */
export function quoteRoute(route, {money = Infinity, minuteOfDay = 8 * 60, proposedFare = 0} = {}) {
    let clock = minuteOfDay, totalFare = 0, purse = money;
    const legs = route.legs.map(leg => {
        const wait = waitFor(leg.hours, clock), known = legFare(leg, route.dial.priceLevel), fare = known ?? proposedFare, reasons = [];
        if(wait) reasons.push(`Service runs ${hoursText(leg.hours)}; wait ${wait} min.`);
        if(purse < fare) reasons.push(`Needs ${fare} money for the fare.`);
        purse -= fare; totalFare += fare;
        const start = clock + wait; clock = start + leg.minutes;
        return {id: leg.id, from: leg.from, to: leg.to, means: leg.means, minutes: leg.minutes, waitMinutes: wait, fare,
            fareText: known === null ? 'Fare not recorded.' : known === 0 ? 'No fare.' : `${known} money fare.`, fareBasis: known === null ? 'proposed' : 'stated',
            hazards: (leg.hazards || []).map(h => ({id: h.id, kind: h.kind})), eligible: purse >= 0 && !reasons.some(r => r.startsWith('Needs')), reasons};
    });
    const totalMinutes = clock - minuteOfDay;
    return {id: route.id, legs, totalMinutes, totalDays: Math.ceil(totalMinutes / DAY), totalFare, eligible: legs.every(l => l.eligible), reasons: legs.flatMap(l => l.reasons)};
}
// One keyed draw per (world, route, leg, hazard, day): the same day always gives the same answer.
export const hazardDraw = (worldId, routeId, legId, hazardId, day, seed = 1) => {
    let n = hashStreamSeed(seed >>> 0 || 1, `ambient:travel:${worldId}:${routeId}:${legId}:${hazardId}:${day}`);
    n = xorshift32(xorshift32(n));
    return n / 4294967296;
};
/** ctx: {day, minuteOfDay, seed}. Returns what to apply: elapsed minutes, fare to charge, hazard results, arrival. */
export function settleRoute(route, {day = 0, minuteOfDay = 8 * 60, seed = 1, money = Infinity, proposedFare = 0} = {}) {
    const quote = quoteRoute(route, {money, minuteOfDay, proposedFare});
    check(quote.eligible, 'The route cannot be started: ' + quote.reasons.join(' '));
    let elapsed = 0; const events = [];
    route.legs.forEach((leg, i) => {
        elapsed += quote.legs[i].waitMinutes;
        const legDay = day + Math.floor((minuteOfDay + elapsed) / DAY);
        for(const hz of leg.hazards || []) {
            const u = hazardDraw(route.world, route.id, leg.id, hz.id, legDay, seed);
            if(u < Math.min(1, hz.chance * route.dial.hazard)) events.push({legId: leg.id, hazard: hz.id, kind: hz.kind, result: hz.result, harm: hz.harm || null, day: legDay});
        }
        elapsed += leg.minutes;
    });
    return {minutes: elapsed, days: Math.ceil(elapsed / DAY), fareCharged: quote.totalFare, events, arrivedAt: route.legs.at(-1).to};
}
