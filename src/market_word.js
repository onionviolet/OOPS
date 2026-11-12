// Societies and markets v0, word of a price spreads as knowledge (chat M, SMK12-SMK14; R6).
// Contract: docs/MARKETS_CONTRACT.md. Rows are the existing simulation `knowledge` effect
// ({type, actor, key, stage, value, basis}, simulation_effects.js), so the one knowledge writer keeps them and
// the truth stays with its owner (the shelf). A sighting is an observation; a retelling is a reported account
// that names who said it. Nothing here stores a truth flag beside a claim. Pure: no state, no clock, no draw.
import {MARKET_DIALS, DAY} from './market_substrate.js';

const fail = message => { throw new Error(`Market word: ${message}`); };
export const priceKey = (place, good) => `market.price.${place}.${good}`;

/** What an observer at the shelf learns: the asking price now. */
export function sightingKnowledge({observer, quote, at}) {
    if (!observer || !quote?.place) fail('a sighting needs an observer and a shelf quote.');
    return {type: 'knowledge', actor: observer, key: priceKey(quote.place, quote.good), stage: 'seen',
        value: {price: quote.price, seenAt: at, place: quote.place, good: quote.good}, basis: {kind: 'observation'}};
}

/** A retelling keeps the original sighting time, so a stale price stays stale as it travels. */
export function retellKnowledge(row, {from, to}) {
    if (!row?.key || !from || !to || from === to) fail('a retelling needs a row, a teller and another listener.');
    return {type: 'knowledge', actor: to, key: row.key, stage: 'seen', value: {...row.value},
        basis: {kind: 'reported', route: 'told', attributedTo: from}};
}

/** Apply rows to a plain knowledge map {actor: {key: entry}}, the same rule simulation_effects applies to 'seen'. */
export function applyKnowledge(known, rows, at) {
    const out = structuredClone(known);
    for (const r of rows) (out[r.actor] ??= {})[r.key] = {stage: r.stage, value: structuredClone(r.value), at, ...(r.basis ? {basis: structuredClone(r.basis)} : {})};
    return out;
}

/**
 * Talk among people in one place (SMK13). Default: each present holder tells each other present holder every
 * market price it knows that the listener lacks or knows from an older sighting. Dial `keys` narrows what is
 * talked about. Order is fixed (teller id, listener id, key), so a reload replays the same talk.
 */
export function marketTalk(known, present, {keys = null} = {}) {
    const ids = [...present].sort(), rows = [], best = {};
    for (const to of ids) best[to] = {...Object.fromEntries(Object.entries(known[to] ?? {}).map(([k, v]) => [k, v.value?.seenAt ?? -1]))};
    for (const from of ids) for (const [key, entry] of Object.entries(known[from] ?? {}).sort(([a], [b]) => a < b ? -1 : 1)) {
        if (!key.startsWith('market.price.') || (keys && !keys.includes(key))) continue;
        for (const to of ids) if (to !== from && (best[to][key] ?? -1) < entry.value.seenAt) {
            rows.push(retellKnowledge({key, value: entry.value}, {from, to}));
            best[to][key] = entry.value.seenAt;
        }
    }
    return rows;
}

/** What an actor believes a price is (SMK14): the remembered value, its age and whether it has gone stale. */
export function believedPrice(known, actor, place, good, at, dials = MARKET_DIALS) {
    const e = known[actor]?.[priceKey(place, good)];
    if (!e) return null;
    const ageDays = Math.floor((at - e.value.seenAt) / DAY);
    return {price: e.value.price, ageDays, stale: ageDays > dials.memoryDays.value, basis: e.basis?.kind ?? 'observation',
        attributedTo: e.basis?.attributedTo ?? null};
}
