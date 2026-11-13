// FRC51 first slice (proposal): mind meters as dated, attributed marks (docs/MIND_RULES.md MND5, MND7-MND9, MND22;
// docs/research/cultist-simulator/MIND_METERS_DIGEST.md). Imports no world (AR3) and stores nothing of its own.
// A mark is a mood thought row (mood_thoughts.js) whose source is `mind.<kind>.<cause>`: it names a holder, what caused it, a line,
// when it began and how long it lasts, and it lowers the holder's mood like any thought (one mood, MND5). The count, the forewarning
// and the open route are derived from the running rows on every read; nothing here is a counter (MND8: the loss carrier stays the
// world's own, and a caller decides what a closed route feeds).
// Shape (digest finding 1 and 2): a pile of expiring marks, a forewarning at two, a route at three with a last window to abate it;
// contentment, itself short-lived, is spent one for one against a mark. Numbers are calibration hints scaled from the digest's
// lifetimes (180 / 60 units become three days / one day of played minutes), not source numbers (SKR11). Dials, per world.
import {dropThoughts} from './mood_thoughts.js';
export const MIND_DIALS = Object.freeze({warnAt: 2, threshold: 3, windowMinutes: 1440});
export const MIND_KINDS = Object.freeze({
    dread: {magnitude: -3, minutes: 3 * 1440},
    fascination: {magnitude: -1, minutes: 3 * 1440},
    contentment: {magnitude: 4, minutes: 1440}});
const PREFIX = 'mind.';
export const mindSource = (kind, cause) => `${PREFIX}${kind}.${cause}`;
export const mindKindOf = source => typeof source === 'string' && source.startsWith(PREFIX) ? source.slice(PREFIX.length).split('.')[0] : null;
// The thought a mark writes through the one mood write port (addThought). `cause` is the producer's stable id.
export function markThought({holder, kind, cause, line, kinds = MIND_KINDS}) {
    const k = kinds[kind];
    if(!k) throw TypeError(`Unknown mind kind: ${kind}`);
    const source = mindSource(kind, cause);
    return {holder, subject: holder, source, magnitude: k.magnitude, minutes: k.minutes, line, key: source};
}
// The pure reader for one kind. `rows` are the holder's running thought rows (runningThoughts), oldest first.
// stage: 'clear' | 'warned' | 'route'. While a route is open: opensAt (the mark that made it three), closesAt (the last window's end),
// due (the window has run out with the marks still standing) and passes (the oldest mark runs out first, so it closes by itself).
export function mindMeter(rows, kind, now, dials = MIND_DIALS) {
    const marks = (rows || []).filter(r => mindKindOf(r.source) === kind && r.at <= now && r.until > now).sort((a, b) => a.at - b.at);
    const count = marks.length, stage = count >= dials.threshold ? 'route' : count >= dials.warnAt ? 'warned' : 'clear';
    const out = {kind, count, stage, lines: marks.map(r => r.line), marks};
    if(stage !== 'route') return out;
    const opensAt = marks[dials.threshold - 1].at, closesAt = opensAt + dials.windowMinutes;
    return {...out, opensAt, closesAt, left: Math.max(0, closesAt - now), due: now >= closesAt,
        passes: count === dials.threshold && marks[0].until <= closesAt};
}
// Spending: the oldest running mark of a kind is removed (contentment, a night's sleep). Pure; {slice, spent} (spent null when none ran).
export function spendMark(slice, holder, kind, now) {
    const oldest = mindMeter((slice?.rows || []).filter(r => r.holder === holder), kind, now).marks[0];
    return oldest ? {slice: dropThoughts(slice, [oldest]), spent: oldest} : {slice, spent: null};
}
// A route whose window ran out: the marks that opened it are taken off (the caller has already applied what the route feeds),
// so closing twice is a no-op. Pure; {slice, closed} (closed: the rows removed, empty when no route was due).
export function closeRoute(slice, holder, kind, now, dials = MIND_DIALS) {
    const m = mindMeter((slice?.rows || []).filter(r => r.holder === holder), kind, now, dials);
    if(m.stage !== 'route' || !m.due) return {slice, closed: []};
    const closed = m.marks.slice(0, dials.threshold);
    return {slice: dropThoughts(slice, closed), closed};
}
