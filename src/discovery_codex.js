// OG18: a cross-life "ids ever seen" count. Separate from lore_history_state.js
// (world history owner). Save slice `discovery_codex`; absent in older saves.
const KINDS = Object.freeze(['item', 'lesson', 'knowledge']);
const MAX_PER_KIND = 512;
const idOk = v => typeof v === 'string' && v.length > 0 && v.length <= 80 && !['__proto__', 'constructor', 'prototype'].includes(v);
const fail = () => {throw new Error('Invalid discovery codex.');};

export const createDiscoveryCodex = () => ({schema: 1, seen: Object.fromEntries(KINDS.map(k => [k, []]))});

export function validateDiscoveryCodex(codex) {
    if(codex == null) return;
    if(!(codex && typeof codex === 'object' && codex.schema === 1 && codex.seen && typeof codex.seen === 'object')) fail();
    for(const [kind, ids] of Object.entries(codex.seen))
        if(!KINDS.includes(kind) || !Array.isArray(ids) || ids.length > MAX_PER_KIND || new Set(ids).size !== ids.length || !ids.every(idOk)) fail();
}

export function recordDiscovered(codex, kind, ids) {
    if(!KINDS.includes(kind)) throw new Error('Unknown discovery kind.');
    const next = structuredClone(codex ?? createDiscoveryCodex()), seen = new Set(next.seen[kind] ||= []);
    for(const id of ids) if(idOk(id) && seen.size < MAX_PER_KIND) seen.add(id);
    next.seen[kind] = [...seen];
    return next;
}

export function discoveryCount(codex, kind) {
    const rows = codex?.seen || {};
    return kind ? (rows[kind] || []).length : Object.values(rows).reduce((n, ids) => n + ids.length, 0);
}

const itemId = key => {try {const id = JSON.parse(key)?.id; return typeof id === 'string' ? id : key;} catch {return key;}};
// Reads ids the save already holds; never rolls events or infers hidden truth.
export function observeSaveDiscoveries(codex, save) {
    let next = codex ?? createDiscoveryCodex();
    const inv = [...Object.keys(save.inventories?.person?.main_character || {}), ...Object.keys(save.inventories?.storage?.player || {})];
    next = recordDiscovered(next, 'item', inv.map(itemId));
    const c = save.expansion?.chronicle;
    if(c) next = recordDiscovered(recordDiscovered(next, 'knowledge', Object.entries(c.knowledge).filter(([, v]) => v).map(([k]) => k)),
        'lesson', Object.keys(c.knowledge).filter(k => c.knowledge[k] && ['routeSignals', 'guardLesson', 'controlPattern'].includes(k)));
    return next;
}
