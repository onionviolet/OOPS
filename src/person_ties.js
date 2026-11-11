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
        if(o.moodAtLeast != null && (!Number.isSafeInteger(o.moodAtLeast) || !textOk(o.moodBlocked))) throw Error('A mood gate needs an integer and a refusal line.');
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
// MND5 (mood slice): a world may register one reader for how a person feels toward the player right now, {total, band, rows} or null
// (the mood_thoughts reader). The tie module never stores it. Regard (above) is the slow standing; mood is what the last few days did.
// An offer may set `moodAtLeast` (default band edge -4 keeps the conversation shut while the person is sour) with `moodBlocked` text.
const moodReaders = new Map();
export const registerTieMood = (worldId, read) => { if(typeof read !== 'function') throw Error('A tie mood reader is a function.'); moodReaders.set(worldId, read); };
const moodOf = (state, worldId, personId) => { try { return moodReaders.get(worldId)?.(state, personId) ?? null; } catch { return null; } };
// The words the player reads: knowledge of what was seen, never the total (AD6-AD8). Even moods say nothing.
export const moodWords = mood => !mood?.rows?.length || mood.band === 'even' ? '' :
    mood.band === 'sour' ? `They are short with you at the moment: ${mood.rows[0].line}.` : `They are in good humour with you: ${mood.rows[0].line}.`;
const moodShut = (state, decl, o) => {
    if(o.moodAtLeast == null) return null;
    const mood = moodOf(state, decl.worldId, decl.people[o.alias]);
    return mood && mood.total < o.moodAtLeast ? `${o.moodBlocked || 'They are not in the mood for it right now.'} ${moodWords(mood)}`.trim() : null;
};
// FRC39 opinion (proposal): a world may also register one reader for what a person thinks of the player over weeks, {total, band, rows} or
// null (mood_thoughts opinionOf over the social rows). Regard (tieValue, the edge) is standing built by acts; mood is the last few days;
// opinion is the remembered acts still running. The tie module stores none of them (TIE1). Gates that read it name `opinion.<alias>` (TIE7).
const opinionReaders = new Map();
export const registerTieOpinion = (worldId, read) => { if(typeof read !== 'function') throw Error('A tie opinion reader is a function.'); opinionReaders.set(worldId, read); };
export const tieOpinion = (state, worldId, personId) => { try { return opinionReaders.get(worldId)?.(state, personId) ?? null; } catch { return null; } };
// Words, never the number (TIE24): the strongest remembered act on the side the opinion leans.
export const opinionWords = op => {
    if(!op?.rows?.length || op.band === 'even') return '';
    const row = op.rows.find(r => (op.band === 'fond') === (r.value > 0));
    if(!row) return '';
    return op.band === 'fond' ? `They have thought well of you lately: ${row.line}.` : `They hold something against you: ${row.line}.`;
};
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
    for(const [alias, id] of Object.entries(decl.people)) {
        for(const kind of decl.kinds) out[`tie.${alias}.${kind}`] = tieValue(state, id, kind);
        if(moodReaders.has(decl.worldId)) out[`mood.${alias}`] = moodOf(state, decl.worldId, id)?.total ?? 0; // only worlds with a mood reader
        if(opinionReaders.has(decl.worldId)) out[`opinion.${alias}`] = tieOpinion(state, decl.worldId, id)?.total ?? 0; // only worlds with an opinion reader
    }
    return out;
}

const offerNote = (decl, o) => ({...seenNote(decl, decl.people[o.alias], o.note.key, o.note.value), stage: 'understood'});
// Native commands for hosts that list simulation commands (base carries world, place, group, timing). Once only; the gate is a tie fact.
export function tieOfferCommands(worldId, base) {
    const decl = worldTies(worldId);
    return (decl?.offers || []).map(o => ({...base, id: o.id, revision: 1, label: o.label, description: o.description,
        requires: {all: [...(base.requires?.all || []), {fact: `tie.${o.alias}.${o.kind}`, op: 'gte', value: o.atLeast, reason: o.blocked},
            ...(o.moodAtLeast != null ? [{fact: `mood.${o.alias}`, op: 'gte', value: o.moodAtLeast, reason: o.moodBlocked}] : [])], reason: o.blocked},
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
        return {personId, alias: r.alias, kind: r.kind, label: r.label, line: `${seen ? r.noticed : r.none} ${r.moves} ${moodWords(moodOf(state, decl.worldId, personId))} ${opinionWords(tieOpinion(state, decl.worldId, personId))}`.replace(/ +/g, ' ').trim()};
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
        const regard = tieValue(state, personId, o.kind) >= o.atLeast, shut = regard ? moodShut(state, decl, o) : null, eligible = regard && !shut;
        return {id: o.id, personId, label: o.label, description: o.description, eligible, reasons: eligible ? [] : [shut || o.blocked]};
    });
}
export function tieOfferEffects(state, offerId) {
    const decl = worldTies(state?.actors?.player?.worldId), o = decl?.offers.find(x => x.id === offerId);
    if(!o) throw Error('That conversation is not open here.');
    if(state.simulation?.knowledge?.player?.[o.note.key]) throw Error('You have already had that conversation.');
    if(tieValue(state, decl.people[o.alias], o.kind) < o.atLeast) throw Error(o.blocked);
    const shut = moodShut(state, decl, o);
    if(shut) throw Error(shut);
    return [offerNote(decl, o)];
}
