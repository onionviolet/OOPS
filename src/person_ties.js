import {validateSimulationEffect} from './simulation_contracts.js';
// LT8 one person record (proposal under AD32; docs/CROSS_WORLD_SYSTEMS_TRANSFER.md#lt8-ties). The engine is the existing directed edge
// simulation.relationships[holder][subject] written by the native `relationship` effect (axes, memories, per-cause replay receipts, saved
// inside the expansion state). This module adds no store: it names tie kinds as axes, lets a world declare which of its people carry ties
// (an alias table, data only), turns those axes into rule facts for gates, and pairs every change with what the player saw.
// Truth, knowledge and display stay apart (AD6-AD8): rule facts read the holder's real regard for gates; the player's store gets an
// observation note attributed to that person (what happened, from the player's seat), and views show only that note, never the number.
// Default: five kinds; a world declares the ones its stories write. Dial: per-world `kinds`. Reason: trust, debt, affection, rivalry
// and duty cover the ties the lead lives already narrate (a captain's trust, a classmate's friendship) without a world-specific store.
export const TIE_KINDS = Object.freeze(['trust', 'debt', 'affection', 'rivalry', 'duty']);
export const tieAxis = kind => `tie.${kind}`;
const declarations = new Map();
const idOk = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);
const textOk = x => typeof x === 'string' && x.trim().length > 0;

// decl: {worldId, situationId, kinds:[...TIE_KINDS subset], people:{alias: personId}, offers?:[offer]}. Re-registering replaces it.
// An offer is the first consumer shape (regard opens disclosure): {id, alias, kind, atLeast, label, description, blocked, note:{key, value}}.
// Taking it writes one player note attributed to that person, so People and the Notebook show what was said. Hosts render offers their
// own way (a native command, a panel button); the row, the gate and the effect are the same data.
export function registerWorldTies(decl) {
    if(!decl || !idOk(decl.worldId) || !idOk(decl.situationId)) throw Error('World ties need a world id and a situation id.');
    const kinds = decl.kinds || TIE_KINDS;
    if(!Array.isArray(kinds) || !kinds.length || kinds.some(k => !TIE_KINDS.includes(k))) throw Error(`Unknown tie kind in ${decl.worldId}.`);
    const people = Object.entries(decl.people || {});
    if(!people.length || people.some(([alias, id]) => !/^[a-z][a-z0-9_]*$/.test(alias) || !idOk(id))) throw Error(`World ties for ${decl.worldId} need people as alias: personId.`);
    const offers = (decl.offers || []).map(o => {
        if(!idOk(o?.id) || !decl.people[o.alias] || !kinds.includes(o.kind) || !Number.isSafeInteger(o.atLeast) || ![o.label, o.description, o.blocked, o.note?.value].every(textOk) || !idOk(o.note?.key))
            throw Error(`Invalid tie offer in ${decl.worldId}.`);
        if(o.effects != null) { if(!Array.isArray(o.effects)) throw Error('Tie effects need a list.'); o.effects.forEach(validateSimulationEffect); }
        if(o.minutes != null && (!Number.isSafeInteger(o.minutes) || o.minutes <= 0)) throw Error('Tie work needs positive minutes.');
        return Object.freeze({...o, note: Object.freeze({...o.note})});
    });
    // shown (XC4): a tie shown from first meeting, before it has moved: {alias, kind, label, none, noticed, moves, seenPrefix}. The line is
    // knowledge, never the regard number: `none` until the player holds one of the tie's own observation notes (keys starting with
    // seenPrefix, attributed to that person), then `noticed`. Other things the person said do not count as the tie moving.
    const shown = (decl.shown || []).map(r => {
        if(!decl.people[r.alias] || !kinds.includes(r.kind) || ![r.label, r.none, r.noticed, r.moves].every(textOk) || !idOk(r.seenPrefix)) throw Error(`Invalid shown tie in ${decl.worldId}.`);
        return Object.freeze({...r});
    });
    declarations.set(decl.worldId, Object.freeze({worldId: decl.worldId, situationId: decl.situationId, kinds: Object.freeze([...kinds]),
        people: Object.freeze(Object.fromEntries(people)), offers: Object.freeze(offers), shown: Object.freeze(shown)}));
    return declarations.get(decl.worldId);
}
export const worldTies = worldId => declarations.get(worldId) || null;
export const tieWorlds = () => [...declarations.keys()];
const seenNote = (decl, holder, key, value) => ({type: 'knowledge', actor: 'player', key, stage: 'seen', value,
    basis: {kind: 'observation', attributedTo: holder, situationId: decl.situationId}});

// One tie change: the holder's regard (truth, a relationship axis) plus the player's observation of the act (knowledge). The cause passed
// to applySimulationEffects makes the regard replay-safe, so a per-occasion cause (a week, a lesson) lets the same act count again.
// `seen.key` may repeat across occasions; the note then shows the latest occasion.
export function tieEffects(worldId, {alias, kind, amount = 1, seen}) {
    const decl = worldTies(worldId), holder = decl?.people[alias];
    if(!holder || !decl.kinds.includes(kind) || !Number.isSafeInteger(amount) || !amount || !idOk(seen?.key) || !textOk(seen?.value)) throw Error('Invalid tie change.');
    return [{type: 'relationship', actor: holder, target: 'player', axis: tieAxis(kind), amount}, seenNote(decl, holder, seen.key, seen.value)];
}

// The holder's current regard on one kind (raw baseline; memory decay belongs to person_memory and is not applied here).
export const tieValue = (state, holder, kind, subject = 'player') => state?.simulation?.relationships?.[holder]?.[subject]?.axes?.[tieAxis(kind)] || 0;

// Rule facts for the player's current world: `tie.<alias>.<kind>` for every declared person and kind (0 when nothing happened yet),
// so gates and outcome weights always resolve.
export function tieFacts(state) {
    const decl = worldTies(state?.actors?.player?.worldId);
    if(!decl) return {};
    const out = {};
    for(const [alias, id] of Object.entries(decl.people)) for(const kind of decl.kinds) out[`tie.${alias}.${kind}`] = tieValue(state, id, kind);
    return out;
}

const offerNote = (decl, o) => ({...seenNote(decl, decl.people[o.alias], o.note.key, o.note.value), stage: 'understood'});
// Native commands for hosts that list simulation commands (base carries world, place, group, timing). Once only; the gate is a tie fact.
export function tieOfferCommands(worldId, base) {
    const decl = worldTies(worldId);
    return (decl?.offers || []).map(o => ({...base, id: o.id, revision: 1, label: o.label, description: o.description,
        requires: {all: [...(base.requires?.all || []), {fact: `tie.${o.alias}.${o.kind}`, op: 'gte', value: o.atLeast, reason: o.blocked}], reason: o.blocked},
        ...(o.minutes ? {duration: o.minutes} : {}), once: o.repeatable ? false : true,
        ...(o.assisted ? {participants: [base.actorId || 'player', decl.people[o.alias]], participantsCoLocated: true} : {}),
        effects: [...structuredClone(o.effects || []), offerNote(decl, o)]}));
}
// Panel rows for hosts that render their own buttons: eligible while the regard is high enough; once taken, the note itself.
export function tieShownView(state) {
    const decl = worldTies(state?.actors?.player?.worldId);
    if(!decl) return [];
    const notes = Object.entries(state.simulation?.knowledge?.player || {});
    return decl.shown.map(r => {
        const personId = decl.people[r.alias];
        const seen = notes.some(([k, n]) => k.startsWith(r.seenPrefix) && n?.basis?.attributedTo === personId && n.basis.situationId === decl.situationId);
        return {personId, alias: r.alias, kind: r.kind, label: r.label, line: `${seen ? r.noticed : r.none} ${r.moves}`};
    });
}
export function tieOfferView(state) {
    const decl = worldTies(state?.actors?.player?.worldId);
    if(!decl) return [];
    const known = state.simulation?.knowledge?.player || {};
    // A taken offer stays as what was said (the player's own note), so the place it was asked keeps the answer readable.
    return decl.offers.map(o => {
        const personId = decl.people[o.alias];
        if(known[o.note.key]) return {id: o.id, personId, label: o.label, taken: true, said: known[o.note.key].value};
        const eligible = tieValue(state, personId, o.kind) >= o.atLeast;
        return {id: o.id, personId, label: o.label, description: o.description, eligible, reasons: eligible ? [] : [o.blocked]};
    });
}
export function tieOfferEffects(state, offerId) {
    const decl = worldTies(state?.actors?.player?.worldId), o = decl?.offers.find(x => x.id === offerId);
    if(!o) throw Error('That conversation is not open here.');
    if(state.simulation?.knowledge?.player?.[o.note.key]) throw Error('You have already had that conversation.');
    if(tieValue(state, decl.people[o.alias], o.kind) < o.atLeast) throw Error(o.blocked);
    return [offerNote(decl, o)];
}
