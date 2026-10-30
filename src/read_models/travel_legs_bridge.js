// Bridge: L11 travel legs (travel_legs.js quoteRoute) -> rep-maps `legs` contract (claude/rep-maps, MAPS_AND_TRAVEL.md "Data source and switch-over"):
//   legs: [{to, minutes, means, cost?, moveId, eligible, reasons, window?}]
// Pure. The host supplies the move id for each leg and the place labels the seat already knows; places the seat does not know are dropped
// (SR9, LTU11), and hazards are not passed on (an observer learns a hazard by meeting it).
import {hoursText} from '../region_kit.js';

/**
 * route: defineRoute() row. quote: quoteRoute(route, ctx). moveIdFor: legId -> host move id (or null).
 * labels: {placeId: label} for places the seat knows. Legs whose `to` is not in labels are dropped.
 * Cost: a stated fare is {amount, text}; a proposed one (basis 'proposed') is {amount, text, stated:false}; free legs carry no cost.
 * window: set when the leg has service hours: {hours:[open, close], text, waitMinutes}.
 */
export function legsFromRoute(route, quote, {moveIdFor = () => null, labels = {}} = {}) {
    const rows = [];
    quote.legs.forEach((q, i) => {
        const leg = route.legs[i];
        if (!Object.hasOwn(labels, q.to)) return;
        const row = {to: q.to, toLabel: labels[q.to], from: q.from, minutes: q.minutes, means: q.means, moveId: moveIdFor(q.id) ?? null,
            eligible: q.eligible, reasons: [...q.reasons]};
        if (q.fare > 0 || q.fareBasis === 'proposed') row.cost = {amount: q.fare, text: q.fareText, ...(q.fareBasis === 'proposed' ? {stated: false} : {})};
        if (leg.hours) row.window = {hours: [...leg.hours], text: hoursText(leg.hours), waitMinutes: q.waitMinutes};
        rows.push(row);
    });
    return rows;
}

/** Legs of several routes into the board's flat list; a place reached twice keeps the quicker leg. */
export function legsFromRoutes(entries, opts = {}) {
    const best = new Map();
    for (const {route, quote} of entries) for (const leg of legsFromRoute(route, quote, opts)) {
        const cur = best.get(leg.to);
        if (!cur || leg.minutes < cur.minutes) best.set(leg.to, leg);
    }
    return [...best.values()];
}
