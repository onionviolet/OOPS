// PS305: what a person at a Tingen place would notice, per place. The records are the world's own place data and the lore stays in the
// private pack (private_packs/lotm-noticed/noticed.json, fetch-if-present, listed in the manifest's supplements like the sheets pack);
// this loader and place_noticed.js's noticedFromPlace are the tracked code. Without the pack a place shows only the nouns its acts name.
// Pack shape: {schema:1, places:{<cast place id>:[{noun, acts?:[actId | {id, verb}]}]}}. The count per place is a dial (NOTICED_MAX caps the box).
import {deepFreeze} from './basics.js';
const PATH = 'lotm-noticed/noticed.json';
export async function loadPrivateNoticed(fetchFile = globalThis.fetch) {
    try {
        const manifest = await fetchFile('private_packs/manifest.json'); if (!manifest.ok) return null;
        const data = await manifest.json(); if (data.schema !== 1 || !data.supplements?.includes(PATH)) return null;
        const file = await fetchFile('private_packs/' + PATH); if (!file.ok) return null;
        const pack = await file.json();
        return pack.schema === 1 && pack.places && typeof pack.places === 'object' ? deepFreeze(pack) : null;
    } catch { return null; }
}
let loaded = null;
export const setPrivateNoticed = pack => { loaded = pack; };
if (typeof globalThis.fetch === 'function') loadPrivateNoticed().then(pack => { loaded ??= pack; });
/** The noticed records for a cast place id ([] when the pack or the place has none). */
export const noticedRecordsFor = placeId => (placeId && loaded?.places?.[placeId]) || [];
