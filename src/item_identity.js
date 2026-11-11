// FRC54 / ITM23 (proposal, AD56): who knows what an item is. An item's name on a screen is a reading
// of one character's knowledge over the item, never a flag on the item. The item keeps its stable id
// and its true properties act whether anyone knows them (KNW1, ITM16); this module only decides which
// name and description a given observer is shown.
//
// Shape. A world registers an identity per item id: an open name (what anyone holding it sees) and
// routes, each naming a knowledge key that, once that observer holds it, supports a better name. The
// route's certainty is the entry's own ladder stage (KNW3, `certaintyOf`), capped by the route: a
// seller's word written as an understood record of the sale still only supports a guess about the
// item. Learning happens elsewhere, through the one knowledge writer (KNW2): study, being told, use.
// Pure functions, no state: the same item read through two actors' knowledge maps gives two names.
//
// Prior art in the tree: the two hand-coded vial views (`nethack_fieldcraft_item_view.js`,
// `game_absorption_assay_item_view.js`) chained in display.js `nativeItemView`. This is the shared
// form; those two can move onto it when next touched. Caves of Qud's Examiner (docs/research/caves-of-qud,
// SYSTEM_INVENTORY "Identification") is the one bank precedent: per-kind understanding by a skill.
import {certaintyOf, provenanceOf} from './knowledge_view.js';

const RANK = {open: 0, guessed: 1, known: 2};
// SPR31: how a route is learned. A route may name it; the knowledge row's own basis.route says it for that entry.
const VIA = ['told', 'seen', 'used', 'studied'];
const identities = new Map();

/**
 * Register what an item can be known as. spec: {itemId, open: {name, description}, routes: [{knowledge,
 * name, description, cap?: 'guessed'|'known'}]}. Throws on a duplicate or malformed row, so a bad pack
 * fails at load, not on a screen.
 */
export function defineItemIdentity(spec) {
    const {itemId, open, routes = []} = spec || {};
    if (typeof itemId !== 'string' || !itemId) throw Error('An item identity needs the item id it reads.');
    if (identities.has(itemId)) throw Error(`Item identity ${itemId} is already defined.`);
    if (typeof open?.name !== 'string' || !open.name) throw Error(`Item identity ${itemId} needs an open name.`);
    for (const r of routes) {
        if (typeof r.knowledge !== 'string' || typeof r.name !== 'string' || !r.name) throw Error(`Item identity ${itemId} has a route without a knowledge key or a name.`);
        if (r.cap != null && !(r.cap in RANK) || r.cap === 'open') throw Error(`Item identity ${itemId} route ${r.knowledge} has an unknown cap.`);
        if (r.via != null && !VIA.includes(r.via)) throw Error(`Item identity ${itemId} route ${r.knowledge} has an unknown way of learning.`);
    }
    const frozen = Object.freeze({itemId, open: Object.freeze({name: open.name, description: open.description ?? ''}),
        routes: Object.freeze(routes.map(r => Object.freeze({knowledge: r.knowledge, name: r.name, description: r.description ?? '', cap: r.cap ?? 'known', ...(r.via ? {via: r.via} : {})})))});
    identities.set(itemId, frozen);
    return frozen;
}

/** The identity for an item given as its id, its serialized {id} key, or an item object; null when none is registered. */
export function itemIdentityOf(item) {
    return identities.get(itemIdOf(item)) ?? null;
}

function itemIdOf(item) {
    if (typeof item === 'string') {
        if (identities.has(item)) return item;
        try { const k = JSON.parse(item); return typeof k?.id === 'string' ? k.id : null; } catch { return null; }
    }
    if (typeof item?.id === 'string') return item.id;
    if (typeof item?.key === 'string') return itemIdOf(item.key);
    return null;
}

/**
 * One observer's reading of one identity. knowledge: that observer's own entry map (observer.knowledge(),
 * or simulation.knowledge[actorId] for a non-seat actor). Returns {certainty, name, description, provenance,
 * knowledgeKey, via}; via is how this entry was learned (SPR31), from the row or else the route. The strongest
 * route wins; between equals, the newest. Open names come from the item, never from a missing truth, so an open line hints at nothing beyond what the hand already holds.
 */
export function itemReading(knowledge, identity) {
    let best = null;
    for (const route of identity.routes) {
        const entry = knowledge?.[route.knowledge];
        if (!entry) continue;
        const held = certaintyOf(entry);
        if (held === 'open') continue;
        const certainty = RANK[held] <= RANK[route.cap] ? held : route.cap;
        if (!best || RANK[certainty] > RANK[best.certainty] || RANK[certainty] === RANK[best.certainty] && (entry.at ?? -1) > (best.at ?? -1))
            best = {certainty, route, entry, at: entry.at};
    }
    if (!best) return {certainty: 'open', name: identity.open.name, description: identity.open.description, provenance: '', knowledgeKey: null, via: null};
    return {certainty: best.certainty, name: best.route.name, description: best.route.description || identity.open.description,
        provenance: provenanceOf(best.entry), knowledgeKey: best.route.knowledge, via: best.entry.basis?.route ?? best.route.via ?? null};
}

const LADDER = {open: 'You do not know what it is yet.', guessed: 'This is your reading; it may be wrong.', known: ''};

/**
 * Display projection for item surfaces, chained like the vial views: unknown items pass through unchanged.
 * Returns {...fallback, name, description, identified, certainty}.
 */
export function projectItemIdentityView(item, knowledge, fallback = {}) {
    const identity = itemIdentityOf(item);
    if (!identity) return {...fallback, name: fallback.name ?? item?.name ?? (typeof item === 'string' ? item : ''), description: fallback.description ?? item?.description ?? ''};
    const r = itemReading(knowledge, identity);
    const note = LADDER[r.certainty];
    return {...fallback, name: r.name, description: [r.description, note].filter(Boolean).join(' '), identified: r.certainty === 'known', certainty: r.certainty};
}

/** Short line for lists: the name, and for a guess or an unknown, the word that says so. */
export function itemReadingLine(reading) {
    return reading.certainty === 'known' ? reading.name : reading.certainty === 'guessed' ? `${reading.name} (unchecked)` : `${reading.name} (unknown)`;
}

// BDT86 / SPR31 (proposal): the use route. Using an item teaches only what the use showed. visibility is how
// plainly the effect showed itself to this actor: 'plain' supports a known reading, 'faint' only a guess, 'none'
// teaches nothing (the use still happened and still cost what it cost; that cost belongs to the caller's command,
// AD38). The row is the one knowledge shape (KNW2), written for the actor who used it and nobody else, and says
// it was learned by use. Returns the knowledge effect, or null when nothing showed.
const USE_STAGE = {plain: 'understood', faint: 'interpreted', none: null};
export function usedKnowledge({actor = 'player', key, value, visibility = 'plain', situationId} = {}) {
    if (!(visibility in USE_STAGE)) throw Error(`Unknown visibility ${visibility} for a use.`);
    if (typeof key !== 'string' || !key || typeof value !== 'string' || !value) throw Error('A use writes a knowledge key and what was seen.');
    const stage = USE_STAGE[visibility];
    return stage ? {type: 'knowledge', actor, key, stage, value, basis: {kind: 'observation', route: 'used', attributedTo: actor, ...(situationId ? {situationId} : {})}} : null;
}
