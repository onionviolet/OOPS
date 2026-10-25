// IM21 (AD11): one view of what crosses each boundary, per world. Rules are
// data; scope says how long the carried thing lasts:
// 'this life' (spent or kept by the one body), 'last life' (reaches only the
// next life), 'any life' (stays for every later life).
export const CARRY_SCOPES = Object.freeze(['this life', 'last life', 'any life']);
export const BOUNDARIES = Object.freeze(['death', 'rebirth', 'world crossing']);
const row = (boundary, what, carries, scope, note) => ({boundary, what, carries, scope, note});

// base.frontier mirrors heir_inheritance.js and life_experience_host.js.
const FRONTIER = [
    row('rebirth', 'Base cheat', 'carries', 'any life', 'Personal faculty and enduring stages follow the continuing self; per-life points reset.'),
    row('death', 'Written and taught lessons', 'carries', 'last life', 'Papers or an apprentice; only reflected or taught lessons.'),
    row('death', 'Coins, belongings, chest, Shack', 'carries', 'last life', 'The estate settles Village kit debt first.'),
    row('death', 'Reputation', 'halved', 'last life', 'Half of each region, rounded toward zero.'),
    row('death', 'Grave and lived deeds', 'carries', 'last life', 'The grave records which scenes that life lived.'),
    row('rebirth', 'Open obligations', 'carries', 'last life', 'Grievance and archive duty stay open for the heir.'),
    row('rebirth', 'Body, skills and levels', 'drops', 'this life', 'The heir starts from a fresh body.'),
    row('rebirth', 'Life record, options, NPC lives, discovery codex', 'carries', 'any life', 'Kept whole across every life.'),
    row('world crossing', 'Carried goods', 'carries', 'this life', 'Cargo must be bound before bodily passage.')
];
// book.paradise.hub mirrors book_world_paradise_carriers.js: passage retains every
// carrier kind, but methods, sources, offices and similar cannot be used there.
const PARADISE = [
    row('death', 'Everything but memory and the base cheat', 'drops', 'this life', 'Nothing else crosses without a carrier (AD11).'),
    row('rebirth', 'Memories', 'carries', 'any life', 'Knowledge of people, routes and lines stays.'),
    row('rebirth', 'Base cheat', 'carries', 'any life', 'Grows with the life; does not reset.'),
    row('world crossing', 'Body, cargo, memory, debt, observer', 'carries', 'this life', 'Passage retains these; use may be none.'),
    row('world crossing', 'Method, source, fuel, office, credential, duty, curse, ally', 'unavailable', 'this life', 'Retained across passage but unusable on the far side.')
];
const WORLD_RULES = Object.freeze({'base.frontier': FRONTIER, 'book.paradise.hub': PARADISE});

// A world pack may add its rows while it is active (opt-in worlds register only when switched on).
// Same shape as the built-in rows; the built-in worlds cannot be replaced.
const REGISTERED = new Map();
export function registerCarryRules(worldId, rows) {
    if(WORLD_RULES[worldId]) throw new Error(`Carry rules for ${worldId} are built in.`);
    for(const r of rows) if(!BOUNDARIES.includes(r.boundary) || !CARRY_SCOPES.includes(r.scope) || !r.what || !r.carries) throw new Error(`Bad carry row for ${worldId}.`);
    REGISTERED.set(worldId, Object.freeze(rows.map(r => Object.freeze({...r}))));
}

export function carryLedger(worldId) {
    const rules = WORLD_RULES[worldId] ?? REGISTERED.get(worldId);
    if(!rules) throw new Error(`No carry rules recorded for ${worldId}.`);
    return BOUNDARIES.map(boundary => ({boundary, rows: rules.filter(r => r.boundary === boundary).map(r => ({...r}))}));
}
export const carryLedgerWorlds = () => [...Object.keys(WORLD_RULES), ...REGISTERED.keys()];
