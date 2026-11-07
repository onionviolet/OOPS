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
export const POSITION_EXIT_KINDS = Object.freeze(['resign', 'dismissed', 'buy_out', 'transfer', 'desert']);
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
    if (!(row.exit?.kinds || []).includes(kind) || !POSITION_EXIT_KINDS.includes(kind)) throw Error(`This post has no ${kind} exit.`);
    if (!nat(at) || typeof reason !== 'string' || !reason) throw Error('An exit needs a time and a reason.');
    slice = {...slice, records: {...slice.records, [row.id]: {startedAt: row.term.startedAt, ...(nat(row.term.endsAt) ? {endsAt: row.term.endsAt} : {}), exit: {kind, at, reason}}}};
}
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
