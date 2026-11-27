// RA21 supports unused spirituality fading and Old Neil's recharge practice.
// The curve, five-to-two-minute local effect, ten-minute visit and one spirituality are authored dials.
import {oldestFirst} from './spoilage.js';
import {formatDuration} from './number_format.js';

export const CHARM_REVIEW_MINUTES = 14 * 1440;
export const CHARM_UPKEEP_MINUTES = 10;
// Existing Old Neil cast identity, kept here without importing the colleagues host cycle.
export const CHARM_MENTOR_ID = 'lotm.person.cast-6aaa65265bb46e581535';
export const charmLedgerKey = slug => `lotm.charm.${slug}.held`;
const age = (entry, clock) => entry.at == null ? Infinity : Math.max(0, clock - entry.at);
const count = (stock, key) => Number.isSafeInteger(stock?.[key]) && stock[key] > 0 ? stock[key] : 0;

// Native stock is authoritative. Outgoing fungible stock takes the oldest free unit;
// incoming/legacy units have unknown age, never a fabricated fresh timestamp.
export function charmCohorts(state, stock, key, slug, {reserved = 0} = {}) {
    const held = count(stock, key) + reserved, clock = state.clock;
    let saved = state.actors?.player?.facts?.[charmLedgerKey(slug)];
    if (typeof saved === 'string') {try {saved = JSON.parse(saved);} catch {saved = [];}}
    let rows = oldestFirst((Array.isArray(saved) ? saved : []).filter(row => row && typeof row.id === 'string'
        && (row.at === null || Number.isSafeInteger(row.at) && row.at <= clock)).map(row => ({id: row.id, at: row.at})), row => age(row, clock));
    const seen = new Set(); rows = rows.filter(row => !seen.has(row.id) && seen.add(row.id));
    if (rows.length > held) {
        const protectedRows = rows.slice(0, reserved);
        const free = rows.slice(reserved);
        rows = [...protectedRows, ...free.slice(Math.max(0, free.length - (held - protectedRows.length)))];
    }
    for (let i = 0; rows.length < held; i++) {
        const id = `unrecorded:${slug}:${state.sequence}:${i}`;
        if (!rows.some(row => row.id === id)) rows.push({id, at: null});
    }
    return oldestFirst(rows, row => age(row, clock));
}

export function charmStrength(entry, clock) {
    if (!entry || entry.at === null) return {minutes: 5, state: 'unrecorded', needsUpkeep: !!entry};
    // Graduated local response, with a positive floor: a faded charm remains an alternative.
    const minutes = Math.max(2, Math.round(5 - 3 * Math.max(0, clock - entry.at) / CHARM_REVIEW_MINUTES));
    return {minutes, state: minutes === 5 ? 'fresh' : 'fading', needsUpkeep: minutes < 5};
}

export function charmUpkeepFacts(state, context, {key, slug}) {
    const stock = context.gameplay?.player?.inventory || {};
    const rows = charmCohorts(state, stock, key, slug);
    const strength = charmStrength(rows[0], state.clock);
    const mentor = state.simulation?.people?.[CHARM_MENTOR_ID], here = state.simulation?.people?.player?.location;
    const where = context.charmPresence?.(state);
    const present = mentor?.life === 'alive' && (where ? where(CHARM_MENTOR_ID, mentor) : mentor.location) === here;
    const asleep = state.simulation?.conditions?.[CHARM_MENTOR_ID]?.['book.lotm.charm-slumber'];
    return {[`charm.${slug}.needsUpkeep`]: rows.length > 0 && strength.needsUpkeep,
        [`charm.${slug}.mentorAvailable`]: !!present && !(asleep?.expiresAt > state.clock)};
}

export function charmUpkeepDescription(state, stock, key, slug) {
    const first = charmCohorts(state, stock, key, slug)[0];
    if (!first) return 'Bring an unused Slumber charm to Old Neil. A burned charm cannot be brought back.';
    const strength = charmStrength(first, state.clock);
    if (strength.state === 'unrecorded') return 'This charm’s age is unrecorded. Old Neil can check it and renew its charge. You can also keep using it as it is.';
    if (strength.state === 'fresh') return 'Your oldest held Slumber charm still holds a fresh charge. It needs no upkeep yet.';
    return `Your oldest held Slumber charm is fading. Its sleep now lasts ${formatDuration(strength.minutes)} here. Old Neil can renew its charge; you can also use it as it is or make another.`;
}

export function settledCharmCohorts(job, state, stock, {rowId, key, slug}) {
    const action = job.commandId === rowId + '.inscribe' ? 'make' : job.commandId === rowId + '-upkeep.renew' ? 'renew'
        : job.commandId === rowId + '-use.activate' ? 'use' : null;
    if (!action) return null;
    const rows = charmCohorts(state, stock, key, slug, {reserved: action === 'make' ? 0 : 1});
    const selected = rows.shift();
    const strength = charmStrength(selected, state.clock);
    if (action === 'make') {
        if (selected) rows.unshift(selected);
        rows.push({id: `made:${job.id}`, at: state.clock});
    } else if (action === 'renew') {
        rows.push({...selected, at: state.clock});
    }
    return {effects: [{type: 'fact', scope: 'actor', actor: job.actorId, key: charmLedgerKey(slug), value: JSON.stringify(rows)}], strength};
}
