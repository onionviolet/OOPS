// Profile-level achievements (G6). An achievement is a recognised deed, kept per player profile, not per
// save: it lives in localStorage ('yairpg.profile.v1'), is not carried by Export/Import, and survives a
// new run. Compatibility decision (AR6): this is new state outside the save envelope, so no save
// migration exists. Titles own lifetime-counter recognition and bonuses (titles.js), rank and reputation
// stay with their owners; an achievement here grants NO power by itself (AD38: a world may choose
// otherwise through the optional `grant` field, which no catalog row sets today).
export const PROFILE_KEY = 'yairpg.profile.v1';

// facts: {counters, titlesHeld, named, relics}. Predicates are pure over facts.
export const achievement_catalog = Object.freeze([
    {id: 'first_name', name: 'What It Is Called', text: 'Give an item a name.', test: f => f.named >= 1},
    {id: 'storied_hand', name: 'Storied Hand', text: 'Name an item that has earned a quality.', test: f => f.relics >= 1},
    {id: 'name_giver', name: 'Name-Giver', text: 'Name five items.', test: f => f.named >= 5},
    {id: 'first_title', name: 'Recognised', text: 'Hold your first title.', test: f => f.titlesHeld >= 1},
    {id: 'ten_titles', name: 'Well Known', text: 'Hold ten titles.', test: f => f.titlesHeld >= 10},
    {id: 'a_hundred_hands', name: 'A Hundred Hands', text: 'Succeed at 100 crafts.', test: f => (f.counters.crafts || 0) >= 100},
]);

const object = v => v && typeof v === 'object' && !Array.isArray(v);
export const emptyProfile = () => ({schema: 1, unlocked: {}});

// Unknown ids are kept (a newer build may know them) and grant nothing.
export function normalizeProfile(raw) {
    const profile = emptyProfile();
    if (!object(raw) || raw.schema !== 1 || !object(raw.unlocked)) return profile;
    for (const [id, r] of Object.entries(raw.unlocked)) if (object(r)) profile.unlocked[id] = {at: Number.isFinite(r.at) && r.at >= 0 ? r.at : 0};
    return profile;
}

export function readProfile(storage) {
    try { return normalizeProfile(JSON.parse(storage.getItem(PROFILE_KEY))); } catch { return emptyProfile(); }
}
export function writeProfile(storage, profile) {
    try { storage.setItem(PROFILE_KEY, JSON.stringify(profile)); return true; } catch { return false; }
}

// Returns newly unlocked ids (catalog order) and persists. A storage failure still reports the unlock
// for this session, so the player is told once and nothing is lost silently.
export function unlockEarned(storage, facts, at = Date.now()) {
    const profile = readProfile(storage), earned = [];
    for (const a of achievement_catalog) if (!profile.unlocked[a.id] && a.test(facts)) { profile.unlocked[a.id] = {at}; earned.push(a.id); }
    if (earned.length) writeProfile(storage, profile);
    return earned;
}

export function achievementView(profile) {
    return achievement_catalog.map(a => ({id: a.id, name: a.name, text: a.text, held: !!profile.unlocked[a.id], power: a.grant ? 'world-defined' : 'none'}));
}
