// Display-only. A world whose life keeps its own belongings and body (not the native hero's) registers here,
// so the shell stops showing the native hero's purse, items and stat sheet over it. Nothing is stored, changed
// or saved: the native hero and its inventory stay exactly as they are and show again in any other world.
// The world supplies the words; the veil itself is CSS keyed on :root[data-own-holdings] (styles/world_look.css).
const worlds = new Map();
// `readers` is optional: {purse(state) -> text, items(state) -> label[] | text}. They get the read-only expansion state the
// shell already reads (see lifeHoldings) and win over the static text only while they return something usable.
export function registerOwnHoldings(worldId, text, readers = {}) {
    if (typeof worldId !== 'string' || !worldId || !text?.purse || !text.items || !text.body) throw new TypeError('A world id and purse, items and body text are required.');
    worlds.set(worldId, Object.freeze({purse: String(text.purse), items: String(text.items), body: String(text.body), readers: Object.freeze({purse: readers?.purse, items: readers?.items})}));
    return () => worlds.delete(worldId);
}
export const ownHoldings = worldId => worlds.get(worldId) ?? null;

// What a life holds, from the simulation's own owners: resources on the actor, items in the simulation inventory
// (native-inventory people keep theirs in gameplay state, which is not this life's). Plain copies, nothing written.
export function lifeHoldings(state, actorId = 'player') {
    const resources = {...(state?.actors?.[actorId]?.resources ?? {})};
    const items = state?.simulation?.people?.[actorId]?.inventory === 'simulation' ? {...(state.simulation.owners?.[actorId] ?? {})} : {};
    return {resources, items};
}

// The entry as shown right now: live reader text where it is usable, else the static text. A reader that throws or returns
// nothing usable falls back, so a bad reader never breaks the shell.
export function ownHoldingsView(worldId, state) {
    const entry = worlds.get(worldId);
    if (!entry) return null;
    const read = (reader, ...args) => { try { return reader ? reader(...args) : undefined; } catch { return undefined; } };
    const purse = read(entry.readers.purse, state), items = read(entry.readers.items, state);
    const list = Array.isArray(items) ? items.filter(x => typeof x === 'string' && x).join(', ') : items;
    return {purse: typeof purse === 'string' && purse ? purse : entry.purse, items: typeof list === 'string' && list ? list : entry.items, body: entry.body};
}

// Where each notice sits: inside the panel whose native content the veil hides.
const NOTICE_HOSTS = [['inventory_div', 'items'], ['basic_character_info_div', 'body']];
export function syncOwnHoldingsNotices(root, entry) {
    const doc = root?.ownerDocument;
    if (!doc) return;
    for (const [hostId, key] of NOTICE_HOSTS) {
        const host = doc.getElementById(hostId), old = host?.querySelector(':scope > [data-own-holdings-notice]');
        if (!host) continue;
        if (!entry) { old?.remove(); continue; }
        if (old) { if (old.textContent !== entry[key]) old.textContent = entry[key]; continue; }
        const note = doc.createElement('p'); note.dataset.ownHoldingsNotice = key; note.textContent = entry[key]; host.prepend(note);
    }
}
