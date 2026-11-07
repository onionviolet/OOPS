// FD16 layer 2 (LANE_B_EVENTS): consequences. A rule is a pure function from what the player's life already holds to zero or more
// event records {id, at, text, cause, observerSafe}. No random draw, no clock of its own and no save field: a record exists because its
// cause exists, and its id is built from that cause, so the same cause yields the same id on every read, replay and second tick.
// One adapter (`consequenceNews`) hands the records to the existing event feed; the feed stays the only place a player reads them.
// First rule: a person-shaped line when an owed item becomes due, read from the shared owed ledger (readOwedLedger).
// World-neutral: voices are a palette keyed by creditor id; an unknown creditor falls back to the ledger's own label.
import {readOwedLedger} from './owed_ledger_sources.js';
const DAY = 1440;
const rules = new Map();

// rule = {id, read(ctx) -> event[]}. Re-registering an id replaces it (one authority per rule).
export function registerConsequence(rule) {
    if(typeof rule?.id !== 'string' || !rule.id || typeof rule.read !== 'function') throw Error('Invalid consequence rule.');
    rules.set(rule.id, Object.freeze({...rule}));
}
export const consequenceRuleIds = () => [...rules.keys()];

const valid = e => e && typeof e.id === 'string' && e.id && Number.isFinite(e.at) && typeof e.text === 'string' && e.text && typeof e.cause === 'string' && e.cause;
// Run every rule; a rule that throws is skipped (a world not ready is not a reason to break the feed). Dedupe by id, so a cause fires once;
// ids already in `seen` (a caller's earlier run) are dropped. Output order is stable: newest first, then id.
export function runConsequences(ctx, {seen = []} = {}) {
    const done = new Set(seen), out = [];
    for(const rule of rules.values()) {
        let found;
        try { found = rule.read(ctx) ?? []; } catch { continue; }
        for(const e of found) {
            if(!valid(e) || done.has(e.id)) continue;
            done.add(e.id);
            out.push({id: e.id, at: e.at, text: e.text, cause: e.cause, observerSafe: e.observerSafe === true});
        }
    }
    return out.sort((a, b) => b.at - a.at || a.id.localeCompare(b.id));
}

// Voices: who the player hears from when a creditor's item falls due. A palette; a world adds its own row, canon overrides it.
export const VOICES = Object.freeze({
    nighthawks: 'Captain Dunn\'s office is still waiting on your expense application for the week.',
    landlady: 'Your landlady stops you on the stair: this week\'s rent is due.',
    'hp.lead.school': 'The others are already filing into the lesson, and they expect you in your seat.',
    village_watch: 'The watch sergeant asks, without heat, when the patrol kit is coming back.',
    household: 'Someone at home has kept count, and says nothing.',
    elder: 'The elder mentions, in passing, that the old promise is still open.',
});
const words = id => String(id).replace(/^book\.[^.]+\./, '').replace(/[_.:-]+/g, ' ').trim();
const lineFor = (row, labels) => VOICES[row.creditor] ?? `${labels[row.creditor] ?? words(row.creditor)} is waiting on you: ${String(row.why ?? '').split('. ')[0].replace(/\.$/, '')}.`;

// Rule 1: an owed item that is due. Due means the writer says so: a duty row exists only while its window is open, late or missed, and a
// dated row (loan, claim) is due once its own date has come. Money rows with no date and grievances are not "due", so they stay silent.
// The cause is the row's id plus when it began, so the next cycle of a weekly duty is a new cause and a new line.
export const OWED_DUE_RULE = Object.freeze({id: 'owed.due', read({owed}) {
    const out = [], live = owed?.live ?? {}, labels = owed?.labels ?? {}, now = owed?.now ?? 0;
    for(const row of owed?.rows ?? []) {
        if(row.debtor !== 'player' || !row.id) continue;
        const due = live[row.id]?.due, dated = !!due && (due.overdue || due.daysLeft <= 0);
        if(row.kind !== 'duty' && !dated) continue;
        const since = Number.isFinite(row.since) ? row.since : 0;
        const at = dated ? Math.max(0, now + Math.min(0, due.daysLeft) * DAY) : since;
        out.push({id: `owed:${row.id}@${since}`, at, text: lineFor(row, labels), cause: `owed:${row.id}`, observerSafe: true});
    }
    return out;
}});
registerConsequence(OWED_DUE_RULE);

// The adapter. Reads only the player's own ledger projection and returns feed news rows {id, at, text}. Only observerSafe records leave.
export function consequenceNews(state, read = readOwedLedger) {
    let owed;
    try { owed = read(); } catch { return []; }
    return runConsequences({state, owed}).filter(e => e.observerSafe).map(e => ({id: e.id, at: e.at, text: e.text}));
}
