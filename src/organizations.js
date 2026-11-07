// Groups (lane F step 1, proposal): a world-neutral READ projection of the groups a world already has. A world registers a
// source fn(state) that derives records from facts it owns; nothing is written and no save key exists (positions.js pattern).
// Record fields follow LANE_F_GROUPS 3.2; a field with no owner yet is omitted, never invented or zeroed (AD6). Nouns stay per
// world (AD46): a record may carry its own `nouns`, the palette below only supplies defaults. Leaf module: no world imports, no DOM.
// Sealed facts are never copied in: a record refers to a hidden thing by id, route and status only.
export const GROUP_STATUSES = Object.freeze(['forming', 'active', 'dormant', 'split', 'dissolved']);
// Kind palette. basis: 'authored' = a world row exists for it, 'palette' = a starter default only, 'missing' = nothing yet.
// Never a canon claim (FD14 rule). `nouns` are the defaults a view uses when a record carries none.
const N = (noun, roster, standing, holdings) => ({noun, roster, standing, holdings});
export const GROUP_KINDS = Object.freeze(Object.fromEntries([
    ['household_business', 'authored', N('household business', 'People', 'Standing', 'Holdings')],
    ['church_cell', 'authored', N('church team', 'Members', 'Standing', 'Posts')],
    ['secret_society', 'authored', N('hidden gathering', 'Seats', 'Standing', 'Meeting places')],
    ['gang', 'palette', N('gang', 'Crew', 'Heat', 'Turf')],
    ['sect', 'palette', N('sect', 'Disciples', 'Renown', 'Halls')],
    ['guild', 'palette', N('guild', 'Members', 'Standing', 'Halls')],
    ['corporation', 'palette', N('corporation', 'Staff', 'Brand', 'Assets')],
    ['club', 'palette', N('club', 'Members', 'Standing', 'Rooms')],
    ['school', 'palette', N('school', 'Students', 'Standing', 'Halls')],
    ['cooperative', 'missing', N('cooperative', 'Members', 'Standing', 'Holdings')],
    ['mercenary_band', 'missing', N('band', 'Company', 'Name', 'Camps')],
    ['settlement', 'missing', N('settlement', 'Residents', 'Standing', 'Holdings')],
].map(([id, basis, nouns]) => [id, Object.freeze({id, basis, nouns: Object.freeze(nouns)})])));

const sources = new Map();
export function registerGroupSource(worldId, fn) {
    if (typeof worldId !== 'string' || !worldId) throw new Error('A group source needs a world id.');
    if (typeof fn !== 'function') throw new Error(`Group source ${worldId} needs a function.`);
    sources.set(worldId, fn);
}
const currentWorld = state => state?.actors?.player?.worldId ?? null;
/**
 * Records for one world (default: the player's current world). Only that world's source runs, and a record naming another
 * world is refused, so one world's groups cannot appear in another's view. Hidden records (the player has no knowing owner
 * yet) are left out unless includeHidden is set.
 */
export function groupsOf(state, {world = currentWorld(state), includeHidden = false} = {}) {
    const fn = sources.get(world);
    if (!fn) return [];
    const rows = [];
    for (const row of fn(state) || []) {
        if (!row?.id || row.world !== world || !GROUP_KINDS[row.kind] || !GROUP_STATUSES.includes(row.status)) throw new Error(`Group source ${world} returned a malformed record.`);
        if (row.hidden && !includeHidden) continue;
        rows.push(row);
    }
    return rows;
}
/** Plain-language lines for a view (UR37): one line per group, then its people. */
export function groupLines(groups) {
    return groups.map(g => {
        const n = g.nouns || GROUP_KINDS[g.kind].nouns, m = g.members || [];
        const who = m.length ? ` ${n.roster}: ${m.map(x => x.name ? (x.rank ? `${x.name} (${x.rank})` : x.name) : x.rank || x.actor).join(', ')}.` : '';
        const when = g.meeting ? ` Meets every ${g.meeting.everyDays} day${g.meeting.everyDays === 1 ? '' : 's'}.` : '';
        return `${g.name || g.id}, a ${n.noun} (${g.status}).${who}${when}`;
    });
}
