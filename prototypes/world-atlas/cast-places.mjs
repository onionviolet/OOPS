// Development-only projection of the private cast packs the game loads.
// Uses the game's own loader and city merge. Emits ids, names, evidence labels
// and locators only, never source prose. Prints {} when packs are absent.
import {readFile} from 'node:fs/promises';
import {loadPrivateCast} from '../../src/book_world_lotm_cast_days.js';
import {validateLotmCast} from '../../src/book_world_lotm_cast.js';
import {validateMolCast} from '../../src/book_world_mol_cast.js';
import {loadCities} from '../../src/lotm_next_city.js';
import {withCities} from '../../src/book_world_lotm_cities.js';

const root = new URL('../../', import.meta.url);
// ATLAS_LOTM_CAST previews a scratch LOTM pack (for example a rebuild with atlas picks) in place of the live one.
const override = process.env.ATLAS_LOTM_CAST;
async function fsFetch(path) {
    try {
        const text = await readFile(override && path === 'private_packs/lotm-cast/cast.json' ? override : new URL(path, root), 'utf8');
        return {ok: true, json: async () => JSON.parse(text)};
    } catch {return {ok: false};}
}
globalThis.fetch ??= fsFetch;

// Same naming rule the game uses for id-like place names (castPlaceName).
const ID_LIKE = /^[a-z]+\.[a-z]+\.[\w-]+$/;
const slugWords = id => {const tail = String(id || '').split('.').pop().replace(/^cast-[0-9a-f]+$/, ''); return tail ? tail.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase()) : '';};
const placeName = p => !p.name || ID_LIKE.test(p.name) ? (slugWords(p.indexId) || slugWords(p.id) || 'An unnamed place') : p.name;

export function projectCast(world, pack) {
    const byKey = new Map();
    for (const p of pack.places) {byKey.set(p.id, p); if (p.indexId) byKey.set(p.indexId, p);}
    for (const a of pack.placeAliases || []) if (!byKey.has(a.id) && byKey.has(a.place)) byKey.set(a.id, byKey.get(a.place));
    const resolve = key => byKey.get(key)?.id || null;
    const people = new Map((pack.people || []).map(p => [p.id, p]));
    const seen = new Map();
    const note = (place, actor, how) => {
        const id = resolve(place);
        if (!id || !people.has(actor)) return;
        const list = seen.get(id) || new Map();
        if (!list.has(actor)) list.set(actor, how);
        seen.set(id, list);
    };
    for (const r of pack.routines || []) note(r.place || r.indexPlace, r.actor, 'routine');
    for (const r of pack.remoteWhereabouts || []) note(r.place, r.actor, 'whereabouts');
    for (const r of pack.schedule || []) note(r.place || r.location, r.actor || r.person, 'schedule');
    // Book scenes anchored to a place: beats, dated anchors, schedule slots and household acts. Ids and locators only.
    const rows = v => Array.isArray(v) ? v : Object.values(v || {}).flat();
    const scenes = new Map();
    const scene = (place, row) => {const id = resolve(place); if (!id) return; (scenes.get(id) || scenes.set(id, []).get(id)).push(row);};
    for (const b of rows(pack.beats)) scene(b.place, {id: b.id, kind: 'beat', locator: b.knows?.[0]?.locator || b.locator || null, day: b.dayIndex ?? null, actor: b.actor || null});
    for (const a of rows(pack.anchors)) scene(a.place || a.indexPlace, {id: a.id || a.place + '.anchor', kind: 'anchor', locator: a.locator || null, day: a.dayWindow?.[0] ?? null, actor: a.actor || null});
    for (const s of rows(pack.schedule)) scene(s.place || s.location, {id: s.id, kind: 'schedule', locator: s.locator || null, day: s.day ?? null, actor: s.actor || s.person || null});
    for (const h of rows(pack.householdActs)) scene(h.place, {id: h.id, kind: 'household', locator: h.locator || null, day: null, actor: null});
    const known = new Set(pack.leadLife?.knownPlaces || []);
    const places = pack.places.map(p => ({
        id: p.id, indexId: p.indexId || null, name: placeName(p), kind: p.kind || null,
        parent: p.parent ? resolve(p.parent) : null,
        district: p.travel?.district || p.district || null, provenance: p.travel?.provenance || null,
        evidence: p.label || null, locator: p.locator || null, known: known.has(p.id),
        people: [...(seen.get(p.id) || [])].map(([id, how]) => ({id, how})),
        scenes: scenes.get(p.id) || [],
    }));
    const ids = new Set(places.map(p => p.id));
    for (const p of places) if (p.parent === p.id || !ids.has(p.parent)) p.parent = null;
    return {
        world, places,
        people: [...people.values()].map(p => ({id: p.id, indexId: p.indexId || null, name: p.name || p.indexId || p.id, tier: p.tier || null, evidence: p.label || null, locator: p.locator || null})),
    };
}

export async function readCasts(fetchFile = fsFetch) {
    const out = {};
    let lotm = await loadPrivateCast('lotm', validateLotmCast, fetchFile);
    if (lotm) {
        const prior = globalThis.fetch;
        globalThis.fetch = fetchFile;
        try {lotm = withCities(lotm, await loadCities());} finally {globalThis.fetch = prior;}
        out.lotm = projectCast('lotm', lotm);
    }
    const mol = await loadPrivateCast('mol', validateMolCast, fetchFile);
    if (mol) out.mol = projectCast('mol', mol);
    return out;
}

if (import.meta.main) process.stdout.write(JSON.stringify(await readCasts()));
