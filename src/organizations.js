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
// organizations@1 (lane F step 2, proposal): groups the PLAYER founded. Authored groups stay derived from their world source and are
// never stored; only what a derived row cannot recover is saved: a founded group, its charter and how it ended. Same module-slice
// pattern as positions.js. An untouched life writes no key; absent, foreign or unreadable loads fresh (SAVES 6h).
export const ORGANIZATIONS_FAMILY = 'organizations@1';
// Charter dials (3.2): a few named choices, never free rules. Default first; each is a dial, not a law for every world.
export const CHARTER_DIALS = Object.freeze({
    admission: Object.freeze(['invite', 'vouched', 'open']),
    dues: Object.freeze(['none', 'coin', 'goods', 'service']),
    secrecy: Object.freeze(['quiet', 'open', 'hidden']),
    rhythm: Object.freeze(['weekly', 'fortnightly', 'monthly']),
});
export const RHYTHM_DAYS = Object.freeze({weekly: 7, fortnightly: 14, monthly: 30});
export const SECRECY_DIAL = Object.freeze({open: 0, quiet: 0.5, hidden: 1}); // gatherings.js dial.secrecy: 1 = fully hidden
export const FOUNDED_KIND = 'club', FOUNDED_HOUR = 20, MAX_ACTIVE_PER_WORLD = 3, NAME_MIN = 3, NAME_MAX = 40;
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9 '\u2019-]*$/;
const nat = n => Number.isSafeInteger(n) && n >= 0;
export const freshOrganizations = () => ({family: ORGANIZATIONS_FAMILY, serial: 0, groups: {}});
export function cleanName(v) {
    const n = typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '';
    if (n.length < NAME_MIN || n.length > NAME_MAX || !NAME_RE.test(n)) throw new Error(`A group name is ${NAME_MIN} to ${NAME_MAX} letters, digits, spaces, hyphens or apostrophes.`);
    return n;
}
export function cleanCharter(c) {
    const out = {};
    for (const [dial, values] of Object.entries(CHARTER_DIALS)) {
        const v = c?.[dial] ?? values[0];
        if (!values.includes(v)) throw new Error(`The ${dial} choice must be one of: ${values.join(', ')}.`);
        out[dial] = v;
    }
    return out;
}
const validGroup = (id, g) => {
    try {
        return g && g.id === id && typeof g.world === 'string' && g.world && g.kind === FOUNDED_KIND && g.revision === 1 && g.name === cleanName(g.name) &&
            nat(g.founded) && (g.status === 'active' || (g.status === 'dissolved' && nat(g.dissolvedAt))) && g.founder === 'player' &&
            JSON.stringify(cleanCharter(g.charter)) === JSON.stringify(g.charter) && Object.keys(g).every(k => ['id', 'world', 'kind', 'revision', 'name', 'founder', 'founded', 'status', 'dissolvedAt', 'charter'].includes(k));
    } catch { return false; }
};
// Unreadable parts drop; the rest keeps. validateOrganizations (below) refuses the same shapes on import instead.
export function migrateOrganizations(s) {
    if (!s || s.family !== ORGANIZATIONS_FAMILY || !s.groups || typeof s.groups !== 'object') return freshOrganizations();
    const groups = {};
    for (const [id, g] of Object.entries(s.groups)) if (validGroup(id, g)) groups[id] = structuredClone(g);
    return {family: ORGANIZATIONS_FAMILY, serial: nat(s.serial) ? Math.max(s.serial, Object.keys(groups).length) : Object.keys(groups).length, groups};
}
export function validateOrganizations(s) {
    if (s?.family !== ORGANIZATIONS_FAMILY) throw new Error('Organizations: wrong family.');
    if (!nat(s.serial) || !s.groups || typeof s.groups !== 'object' || Object.keys(s.groups).length > 64) throw new Error('Organizations: unreadable slice.');
    for (const [id, g] of Object.entries(s.groups)) if (!validGroup(id, g)) throw new Error('Organizations: a founded group is unreadable.');
    return s;
}
let slice = freshOrganizations();
export const loadOrganizations = s => { slice = migrateOrganizations(s); };
export const saveOrganizations = () => (slice.serial > 0 ? structuredClone(slice) : undefined); // untouched: no key
export const organizationsSlice = () => structuredClone(slice);
const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();
export const activeFounded = (world, s = slice) => Object.values(s.groups).filter(g => g.world === world && g.status === 'active');
/** Why a group cannot be founded now (name and cap only), or ''. Costs and places belong to the host. */
export function foundingReason(world, name, s = slice) {
    const live = activeFounded(world, s);
    if (live.some(g => sameName(g.name, name))) return `You already run a group called ${name}.`;
    if (live.length >= MAX_ACTIVE_PER_WORLD) return `You already run ${MAX_ACTIVE_PER_WORLD} groups here. Dissolve one first.`;
    return '';
}
/** Found once. Returns the new slice and the group; throws with the reason otherwise. Does not touch the module slice. */
export function foundGroup(s, {world, name, charter, at}) {
    if (typeof world !== 'string' || !world || !nat(at)) throw new Error('A group needs a world and a founding time.');
    const clean = cleanName(name), ch = cleanCharter(charter), reason = foundingReason(world, clean, s);
    if (reason) throw new Error(reason);
    const serial = s.serial + 1, slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group';
    const g = {id: `${world}.group.founded.${slug}-${serial}`, world, kind: FOUNDED_KIND, revision: 1, name: clean, founder: 'player', founded: at, status: 'active', charter: ch};
    return {slice: {...s, serial, groups: {...s.groups, [g.id]: g}}, group: g};
}
export function dissolveGroup(s, id, at) {
    const g = s.groups[id];
    if (!g) throw new Error('You founded no such group.');
    if (g.status !== 'active') throw new Error(`${g.name} is already dissolved.`);
    if (!nat(at)) throw new Error('A dissolving needs a time.');
    return {...s, groups: {...s.groups, [id]: {...g, status: 'dissolved', dissolvedAt: at}}};
}
export const setOrganizationsSlice = s => { slice = s; };
// A founded group as a groups record (LANE_F 3.2). Only fields with an owner are present; the founder is the one member.
export function foundedRecord(g) {
    const live = g.status === 'active';
    return {id: g.id, world: g.world, kind: g.kind, revision: g.revision, name: g.name, status: g.status, authored: false, founder: g.founder, founded: g.founded,
        charter: {...g.charter}, members: [{actor: 'player', name: 'You', rank: 'founder', status: live ? 'active' : 'inactive'}],
        ...(live ? {meeting: {everyDays: RHYTHM_DAYS[g.charter.rhythm], hour: FOUNDED_HOUR, offset: Math.floor(g.founded / 1440) + RHYTHM_DAYS[g.charter.rhythm]}} : {}),
        sources: [{module: 'organizations.js', locator: ORGANIZATIONS_FAMILY}]};
}
/**
 * Records for one world (default: the player's current world). Only that world's source runs, and a record naming another
 * world is refused, so one world's groups cannot appear in another's view. Hidden records (the player has no knowing owner
 * yet) are left out unless includeHidden is set.
 */
export function groupsOf(state, {world = currentWorld(state), includeHidden = false} = {}) {
    const fn = sources.get(world);
    const own = Object.values(slice.groups).filter(g => g.world === world).map(foundedRecord);
    if (!fn && !own.length) return [];
    const rows = [];
    for (const row of [...(fn ? fn(state) || [] : []), ...own]) {
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
