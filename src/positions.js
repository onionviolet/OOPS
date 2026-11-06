// Positions (FD15, slice 3 first step): a world-neutral, read-only projection of the posts a character holds.
// A world registers a source fn(state) that derives rows from facts it already owns; nothing is written and no
// save key exists. Row shape (LANE_A_SOCIETY_POSITIONS 2.2): {id, institution, role, rank, term:{type, startedAt?, years?, endsAt?},
// pay?:{amount, unit, period}, duties?:[ids], exit?:{kinds, cost}, source}. Term types are listed in POSITION_TERM_TYPES.
// Leaf module: no world imports, no DOM.
export const POSITION_TERM_TYPES = Object.freeze(['enrolled', 'enlisted', 'hired', 'contracted', 'apprenticed', 'sworn', 'member']);
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
            rows.push(row);
        }
    }
    return rows;
}
