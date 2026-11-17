// What a person at a place would notice (PS305, proposal under AD56). A place is not empty because no station opens there: a room has a
// desk, a lamp, a drawer, and a life with a reason to touch one can. A world registers a source; Around you's Here box lists what the
// sources return as things here, each noun with the verbs the life has for it. Default: two to four nouns a place; dial: the world's
// source decides which (from its own place data, or from the acts it already offers there, see noticedFromActs); reason: a place a life
// spends days in should read as a place, not as "A place in Tingen". No state is kept here; each source reads the live world, and a
// source that throws or returns nothing adds nothing. Presentation only: a verb runs the owner's own control (AR3).
const sources = new Map();
export const NOTICED_MAX = 4;

/** A source: {id, rows(frame) => [{id, name, role?, verbs: [{id, label, short?, run, disabled?, reason?}]}]}. Returns a release function. */
export function registerPlaceNoticed(source) {
    if (!source || typeof source.id !== 'string' || typeof source.rows !== 'function') throw Error('A place noticing source needs an id and a rows function.');
    sources.set(source.id, source);
    return () => { if (sources.get(source.id) === source) sources.delete(source.id); };
}

/** The noticed rows for a frame, observer-admitted by the sources themselves. */
export function placeNoticed(frame = {}) {
    const out = [], seen = new Set();
    for (const source of sources.values()) {
        let found = [];
        try { found = source.rows(frame) || []; } catch { found = []; }
        for (const row of found) if (row?.id && row.name && !seen.has(row.id)) { seen.add(row.id); out.push(row); }
    }
    return out.slice(0, NOTICED_MAX);
}

// "Look over the desk" gives the verb "Look over" and the noun "desk". Only a plain shape reads: one verb (and one particle), an article,
// then one to three words with no preposition, comma or number, so a label that does not read this way is left to its own list rather
// than guessed at ("Put the revolver in the drawer" is not "the revolver in the drawer").
const PARTICLES = 'over|out|off|up|on|down|at|through';
const SHAPE = new RegExp(`^([A-Za-z]+(?: (?:${PARTICLES}))?) (?:the|your|a|an) ([A-Za-z’'-]+(?: [A-Za-z’'-]+){0,2})$`);
const STOP = new Set(['of', 'in', 'on', 'to', 'from', 'with', 'for', 'at', 'into', 'beneath', 'under', 'and', 'or', 'before', 'after', 'by', 'about']);

/** Pure: {verb, noun} from an act label, or null. The label may carry a quote tail (" · 1 min · no stock spent"). */
export function nounOf(label) {
    const text = String(label || '').split(' · ')[0].trim();
    const m = text.match(SHAPE);
    if (!m) return null;
    const words = m[2].split(' ');
    if (words.some(w => STOP.has(w.toLowerCase()))) return null;
    return {verb: m[1], noun: m[2]};
}

/**
 * Pure: noticed rows from the acts a world already offers at the place ([{id, label, eligible, reasons}]). Acts on the same noun
 * share a row. `open(id)` is the owner's way to its control for that act. An act whose label does not read as verb and noun is not
 * listed here; its own list still has it.
 */
export function noticedFromActs(acts = [], {open, max = NOTICED_MAX} = {}) {
    const byNoun = new Map();
    for (const act of acts) {
        const read = nounOf(act.label);
        if (!read) continue;
        const key = read.noun.toLowerCase();
        if (!byNoun.has(key)) byNoun.set(key, {id: `noticed:${key.replace(/[^a-z0-9]+/g, '-')}`, name: read.noun[0].toUpperCase() + read.noun.slice(1), role: '', verbs: []});
        byNoun.get(key).verbs.push({id: act.id, label: String(act.label).split(' · ')[0], short: read.verb, run: () => open?.(act.id),
            disabled: act.eligible === false, reason: act.eligible === false ? [...new Set(act.reasons || [])].join(' ') : ''});
    }
    return [...byNoun.values()].slice(0, max);
}
