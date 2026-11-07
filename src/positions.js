// Positions (FD15, slice 3 first step): a world-neutral, read-only projection of the posts a character holds.
// A world registers a source fn(state) that derives rows from facts it already owns; nothing is written and no
// save key exists. Row shape (LANE_A_SOCIETY_POSITIONS 2.2): {id, institution, role, rank, term:{type, startedAt?, years?, endsAt?},
// pay?:{amount, unit, period}, duties?:[ids], exit?:{kinds, cost}, source}. Term types are listed in POSITION_TERM_TYPES.
// positions@1 (FD15 slice 3, saved term and exit): the one thing a derived row cannot recover is how a post ENDED. The slice holds
// records keyed by row id: {startedAt, endsAt?, exit:{kind, at, reason}}. Rows stay derived; positionsOf lays a matching record over
// its row as `ended` (a record whose startedAt differs from the row's belongs to an earlier life and is ignored).
// Leaf module: no world imports, no DOM.
export const POSITION_TERM_TYPES = Object.freeze(['enrolled', 'enlisted', 'hired', 'contracted', 'apprenticed', 'sworn', 'member']);
export const POSITIONS_FAMILY = 'positions@1';
// Player or world choices come first; 'term_end' and 'died' are settled by the clock and the life, never offered as a choice (default, dial, reason:
// a post's own exit.kinds lists what the holder may choose; the two settled kinds apply to every post because every post can run out or lose its holder).
export const SETTLED_EXIT_KINDS = Object.freeze(['term_end', 'died']);
export const POSITION_EXIT_KINDS = Object.freeze(['resign', 'dismissed', 'buy_out', 'transfer', 'desert', ...SETTLED_EXIT_KINDS]);
const nat = n => Number.isInteger(n) && n >= 0;
export const freshPositions = () => ({family: POSITIONS_FAMILY, records: {}});
// A save without the slice (or an unreadable one) loads fresh: older saves keep working and no post is ended retroactively.
export function migratePositions(s) {
    if (!s || s.family !== POSITIONS_FAMILY || !s.records || typeof s.records !== 'object') return freshPositions();
    const records = {};
    for (const [id, r] of Object.entries(s.records)) {
        const e = r?.exit;
        if (!id || !nat(r?.startedAt) || !e || !POSITION_EXIT_KINDS.includes(e.kind) || !nat(e.at) || typeof e.reason !== 'string') continue;
        records[id] = {startedAt: r.startedAt, ...(nat(r.endsAt) ? {endsAt: r.endsAt} : {}), exit: {kind: e.kind, at: e.at, reason: e.reason}};
    }
    return {family: POSITIONS_FAMILY, records};
}
export function validatePositions(s) {
    if (s?.family !== POSITIONS_FAMILY) throw Error('Positions: wrong family.');
    return s;
}
let slice = freshPositions();
export const loadPositions = s => { slice = migratePositions(s); };
export const savePositions = () => (Object.keys(slice.records).length ? structuredClone(slice) : undefined); // untouched: no key
export const positionsSlice = () => structuredClone(slice);
const recordFor = row => { const r = slice.records[row.id]; return r && r.startedAt === row.term?.startedAt ? r : null; };
// Lay the saved exit over a derived row. Idempotent, so a world source may call it and positionsOf may call it again.
export function withExit(row) {
    const r = row.ended ? null : recordFor(row);
    return r ? {...row, term: {...row.term, ...(r.endsAt != null ? {endsAt: r.endsAt} : {})}, ended: {...r.exit}} : row;
}
// When the post ended (minute) for a given row id and start, or null. For worlds whose pay math must stop at the exit.
export function exitAt(id, startedAt) {
    const r = slice.records[id];
    return r && r.startedAt === startedAt ? r.exit.at : null;
}
// Record how a held post ended, once. The caller passes the row it just derived; refuses an exit the row does not offer or a second exit.
export function exitPosition(row, {kind, at, reason}) {
    if (!row?.id || !nat(row.term?.startedAt)) throw Error('That post cannot be left: it has no start on record.');
    if (withExit(row).ended) throw Error('This post has already ended.');
    if (SETTLED_EXIT_KINDS.includes(kind) || !(row.exit?.kinds || []).includes(kind) || !POSITION_EXIT_KINDS.includes(kind)) throw Error(`This post has no ${kind} exit.`);
    if (!nat(at) || typeof reason !== 'string' || !reason) throw Error('An exit needs a time and a reason.');
    slice = {...slice, records: {...slice.records, [row.id]: {startedAt: row.term.startedAt, ...(nat(row.term.endsAt) ? {endsAt: row.term.endsAt} : {}), exit: {kind, at, reason}}}};
}
// Settle posts the clock or a death has already ended. rows: positionsOf(state) rows; at: the minute now (or the minute of death).
// A fixed term whose endsAt is at or before `at` ends as term_end AT endsAt (its true end, not the minute anyone looked), so away time and one
// long step agree. With {died:true} every post still open ends as died at `at`; a term that had already run out before the death stays term_end.
// Idempotent: an ended row (derived or recorded) is skipped, so a second call over fresh rows changes nothing. One slice write; returns the ids newly ended.
export function settlePositions(rows, at, {died = false} = {}) {
    if (!nat(at)) throw Error('Settling positions needs a time.');
    const add = {}, ids = [];
    for (const row of rows || []) {
        if (!row?.id || !nat(row.term?.startedAt) || withExit(row).ended || add[row.id]) continue;
        const end = row.term.endsAt;
        const kind = nat(end) && end <= at ? 'term_end' : died ? 'died' : null;
        if (!kind) continue;
        const when = kind === 'term_end' ? Math.max(end, row.term.startedAt) : Math.max(at, row.term.startedAt);
        add[row.id] = {startedAt: row.term.startedAt, ...(nat(end) ? {endsAt: end} : {}), exit: {kind, at: when, reason: kind === 'term_end' ? 'term-ran-out' : 'holder-died'}};
        ids.push(row.id);
    }
    if (ids.length) slice = {...slice, records: {...slice.records, ...add}};
    return ids;
}
// The life ended: close every open post as died (record kept for heirs and history). Caller: the one place a life's end is first observed.
export const endPositionsOnDeath = (rows, at) => settlePositions(rows, at, {died: true});
const sources = new Map();
export function registerPositionSource(id, fn) {
    if (typeof id !== 'string' || !id) throw new Error('A position source needs an id.');
    if (typeof fn !== 'function') throw new Error(`Position source ${id} needs a function.`);
    sources.set(id, fn);
}
export function positionsOf(state) {
    const rows = [];
    for (const [id, fn] of sources) {
        for (const row of fn(state) || []) {
            if (!row?.id || !row.institution || !row.role || !POSITION_TERM_TYPES.includes(row.term?.type)) throw new Error(`Position source ${id} returned a malformed row.`);
            rows.push(withExit(row));
        }
    }
    return rows;
}
