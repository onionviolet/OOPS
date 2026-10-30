// COV5 and COV12 (2026-10-30), UR13: two panels that showed the same thing become one. A panel is
// "folded" into an owner. Shared code, so it names no world's panel; the table lives in
// LAYOUT_SPEC.folds. Two kinds:
//   retired: true   the module is gone. Old saved layouts and openers still name it, so its id is
//                   an alias for the owner (and a section of the owner, when one is named).
//   otherwise       the module still lives inside the owner's box; only the All panels list and
//                   the palette stop repeating it. Opening it opens the owner.
// Nothing disappears silently: the first load that finds the old id in a saved layout posts one
// log line and puts a dot on the owner's entry (workspace_navigation listens for the event).
import {LAYOUT_SPEC} from './layout_spec.js';

const MOVED_KEY = 'yairpg.folds.announced.v1';

export const foldOf = (id, spec = LAYOUT_SPEC) => spec.folds?.[id] || null;
export const resolvePanel = (id, spec = LAYOUT_SPEC) => {
    const fold = foldOf(id, spec);
    return fold ? {id: fold.into, section: fold.section || null} : {id, section: null};
};
// Old layout ids that still map to a live module (used by normalizeLayout).
export const retiredAliases = (spec = LAYOUT_SPEC) =>
    Object.fromEntries(Object.entries(spec.folds || {}).filter(([, f]) => f.retired).map(([id, f]) => [id, f.into]));
// A folded module does not repeat in lists (All panels, the palette); the owner stands for it.
export const listable = (id, spec = LAYOUT_SPEC) => !foldOf(id, spec);

// Sections: an owner panel shows each folded view as a tab. A section is {id, label, node,
// eligible(), render(force)}; the owner mounts the registered ones (UR8: registered hook, no
// writes into another panel's element). Order of registration does not matter.
const sections = new Map(), listeners = new Map();
export function registerSection(ownerId, section) {
    const list = sections.get(ownerId) || []; sections.set(ownerId, list);
    list.push({eligible: () => true, ...section});
    listeners.get(ownerId)?.(section);
}
export const sectionsOf = ownerId => sections.get(ownerId) || [];
export const onSectionAdded = (ownerId, fn) => { listeners.set(ownerId, fn); };
const selectors = new Map();
export function bindSectionSelect(ownerId, select) { selectors.set(ownerId, select); }
export function selectSection(ownerId, sectionId) { if (sectionId) selectors.get(ownerId)?.(sectionId); }

// The first load that finds a retired or folded id in a saved layout says where it went, once.
export function movedNotices({spec = LAYOUT_SPEC, titleOf = id => id, storage = globalThis.localStorage} = {}) {
    const folds = Object.entries(spec.folds || {});
    let seen = []; let stored = [];
    try { seen = JSON.parse(storage.getItem(MOVED_KEY) || '[]'); } catch { seen = []; }
    try {
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key?.startsWith('yairpg.workspace.')) stored.push(storage.getItem(key) || '');
        }
    } catch { stored = []; }
    const hits = folds.filter(([id, f]) => !seen.includes(id) && f.announce !== false && stored.some(text => text.includes(`"id":"${id}"`)));
    if (!hits.length) return [];
    try { storage.setItem(MOVED_KEY, JSON.stringify([...seen, ...hits.map(([id]) => id)])); } catch { /* shown again next load */ }
    const byOwner = new Map();
    for (const [id, f] of hits) byOwner.set(f.into, [...(byOwner.get(f.into) || []), id]);
    const say = names => names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
    return [...byOwner].map(([into, from]) => ({into, from, text: `${say(from.map(id => spec.folds[id].label || titleOf(id)))} ${from.length === 1 ? 'is' : 'are'} now in ${titleOf(into)}. Nothing was removed.`}));
}
