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

/**
 * Legs for a host that lists places and walk moves but has no route row (the LOTM Tingen host today): a move names its place with
 * `move.to` when the host says so, and otherwise by its "Walk to {place} · " label. This is the one place that still reads the label;
 * delete the fallback when the host puts `to` on its moves (needs the book_world_lotm_host.js owner). Places the seat has not been
 * told of get no leg (SR9). window, when a move carries one, keeps the {hours:[open,close], text, waitMinutes} shape of legsFromRoute.
 */
export function legsFromMoves(view) {
    const moves = Array.isArray(view?.moves) ? view.moves : [];
    const targetOf = (m, place) => m.to === place || (m.to === undefined && typeof m.label === 'string' && m.label.startsWith(`Walk to ${place} \u00b7 `));
    const legs = [];
    for (const p of Array.isArray(view?.places) ? view.places : []) {
        if (p.here) continue;
        const m = moves.find(m => targetOf(m, p.place));
        if (m) legs.push({to: p.place, minutes: p.minutes, moveId: m.id, eligible: !!m.eligible, reasons: [...(m.reasons || [])], ...(m.window ? {window: m.window} : {})});
    }
    return legs;
}
