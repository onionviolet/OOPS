// MND5 first slice (proposal): dated, attributed thoughts and a pure mood reader (docs/MIND_RULES.md, FRC39, RimWorld Need_Mood shape).
// What is stored is the thought rows (who holds it, who it is about, what happened, how much, from when to when), never a mood meter:
// mood is the sum of the rows still running, recomputed on every read. Time is played minutes on the one root clock (TMR1).
// Numbers are calibration hints (SKR11): a thought is a few points either way, lasts days, and softens over its last quarter.
export const THOUGHT_LIMITS = Object.freeze({rows: 60, perHolder: 20, stack: 3, magnitude: 50, line: 140, id: 120,
    fadeShare: 0.25, // a thought softens over the last quarter of its run (RimWorld fades opinion over the final fraction)
    sour: -5, warm: 5, // band edges on the summed total; dials
    cool: -5, fond: 8}); // opinion band edges (a few remembered acts either way); dials
const text = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max;
const natural = v => Number.isSafeInteger(v) && v >= 0;
export const freshThoughts = () => ({schema: 1, rows: []});
export function validateThoughts(slice) {
    const bad = m => { throw TypeError(`Invalid mood thoughts: ${m}`); };
    if(slice == null) return slice;
    if(slice.schema !== 1 || !Array.isArray(slice.rows) || Object.keys(slice).length !== 2) bad('shape');
    if(slice.rows.length > THOUGHT_LIMITS.rows) bad('too many rows');
    const keys = new Set(), perHolder = {};
    for(const r of slice.rows) {
        const ok = r && typeof r === 'object' && Object.keys(r).every(k => ['holder', 'subject', 'source', 'magnitude', 'at', 'until', 'line', 'key', 'kind'].includes(k)) &&
            text(r.holder, THOUGHT_LIMITS.id) && text(r.subject, THOUGHT_LIMITS.id) && text(r.source, THOUGHT_LIMITS.id) && text(r.line, THOUGHT_LIMITS.line) &&
            Number.isInteger(r.magnitude) && r.magnitude !== 0 && Math.abs(r.magnitude) <= THOUGHT_LIMITS.magnitude && natural(r.at) && natural(r.until) && r.until > r.at &&
            (r.key === undefined || text(r.key, THOUGHT_LIMITS.id)) && (r.kind === undefined || r.kind === 'social');
        if(!ok) bad('row');
        if(r.key !== undefined) { if(keys.has(r.key)) bad('repeated key'); keys.add(r.key); }
        perHolder[r.holder] = (perHolder[r.holder] || 0) + 1;
        if(perHolder[r.holder] > THOUGHT_LIMITS.perHolder) bad('too many for one holder');
    }
    return slice;
}
const running = (r, now) => r.until > now && r.at <= now;
// Drops rows that have run out. Pure.
export const pruneThoughts = (slice, now) => ({...slice, rows: slice.rows.filter(r => r.until > now)});
// FRC51: the rows running now for one holder, oldest first, as stored (with `at`), for readers that count rows (mind_meters.js). Pure.
export const runningThoughts = (slice, holder, now) => (slice?.rows || []).filter(r => r.holder === holder && running(r, now)).sort((a, b) => a.at - b.at).map(r => ({...r}));
// FRC51: removes the given rows (matched by value: holder, source, at), e.g. a mark spent by contentment or a route that closed. Pure.
export const dropThoughts = (slice, rows) => {
    const gone = rows.map(r => `${r.holder}\u0000${r.source}\u0000${r.at}`);
    return {...slice, rows: slice.rows.filter(r => !gone.includes(`${r.holder}\u0000${r.source}\u0000${r.at}`))};
};
// The one write port. `minutes` is the run length (the producer already scaled it by the holder's temperament); `key` makes a replay a no-op.
// `kind: 'social'` marks an opinion memory (RimWorld Thought_MemorySocial): it counts toward the holder's opinion of `subject` and not toward
// mood. One act may leave both, a short mood row and a longer social row, as RimWorld's insult does (2-day mood, 20-day opinion).
export function addThought(slice, {holder, subject, source, magnitude, minutes, line, key, kind}, now) {
    if(!natural(now) || !natural(minutes) || minutes < 1) throw TypeError('A thought needs a played minute and a run length.');
    const row = {holder, subject, source, magnitude, at: now, until: now + minutes, line, ...(key !== undefined ? {key} : {}), ...(kind !== undefined ? {kind} : {})};
    validateThoughts({schema: 1, rows: [row]});
    let rows = pruneThoughts(slice, now).rows;
    if(key !== undefined && rows.some(r => r.key === key)) return {...slice, rows};
    // Per-person stack limit: the same cause about the same person keeps only its newest few.
    const same = rows.filter(r => r.holder === holder && r.subject === subject && r.source === source);
    if(same.length >= THOUGHT_LIMITS.stack) { const drop = new Set(same.slice(0, same.length - THOUGHT_LIMITS.stack + 1)); rows = rows.filter(r => !drop.has(r)); }
    rows = [...rows, row];
    const mine = rows.filter(r => r.holder === holder);
    if(mine.length > THOUGHT_LIMITS.perHolder) { const drop = mine[0]; rows = rows.filter(r => r !== drop); }
    if(rows.length > THOUGHT_LIMITS.rows) rows = rows.slice(rows.length - THOUGHT_LIMITS.rows);
    return {...slice, rows};
}
const value = (r, now) => {
    const span = Math.max(1, Math.floor((r.until - r.at) * THOUGHT_LIMITS.fadeShare)), left = r.until - now;
    return r.magnitude * Math.min(1, left / span);
};
export const bandOf = total => total <= THOUGHT_LIMITS.sour ? 'sour' : total >= THOUGHT_LIMITS.warm ? 'warm' : 'even';
export const opinionBandOf = total => total <= THOUGHT_LIMITS.cool ? 'cool' : total >= THOUGHT_LIMITS.fond ? 'fond' : 'even';
const summed = (slice, keep, now) => {
    const rows = (slice?.rows || []).filter(r => keep(r) && running(r, now))
        .map(r => ({source: r.source, subject: r.subject, line: r.line, value: Math.round(value(r, now) * 10) / 10, until: r.until}))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || (a.line < b.line ? -1 : 1));
    return {total: Math.round(rows.reduce((n, r) => n + r.value, 0)), rows};
};
// The pure reader. {total, band, rows}: rows are the thoughts running now, strongest first, each with its present value. Social rows are opinion, not mood.
export function moodOf(slice, holder, now) {
    const {total, rows} = summed(slice, r => r.holder === holder && r.kind !== 'social', now);
    return {total, band: bandOf(total), rows};
}
// Opinion (FRC39, RimWorld OpinionOf; CK3 opinion modifiers that run out): what `holder` thinks of `subject` now, the sum of the running social
// rows the holder keeps about that one person, each fading over its last stretch. Directed (TIE2), derived and never stored. It is apart from any
// allegiance or presence state, so it outlasts leaving a party or a post (Caves of Qud CPR18). {total, band: cool|even|fond, rows}.
export function opinionOf(slice, holder, subject, now) {
    const {total, rows} = summed(slice, r => r.holder === holder && r.subject === subject && r.kind === 'social', now);
    return {total, band: opinionBandOf(total), rows};
}
