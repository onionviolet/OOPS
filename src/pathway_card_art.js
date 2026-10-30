// Private-build art hook for the pathway card (CLR3, Round 10 art rule). Art, emblems, group headers and publisher summaries are not ours to
// ship: they load only from the private pack supplement `pathway-card/art.json` when the manifest lists it, exactly like the advancement
// pack. With no pack every lookup returns null and the card draws the same layout with a generated glyph. No tracked file holds an image
// path or a publisher string. Pure lookup over an injected pack; the only state is the pack handed to setCardArt.
// Pack shape: {pathways: {pathId: {emblem?: 'pathway-card/x.png', art?: 'pathway-card/y.webp', group?, arcana?, summary?, alt?}}}
const SUPPLEMENT = 'pathway-card/art.json';
let pack = null;
export const setCardArt = value => { pack = value?.pathways ? value : null; };
/** {emblem?: {src}, art?: {src, alt}, group?, arcana?, summary?} for a pathway id, or null. Paths resolve under private_packs/. */
export function cardArtFor(pathId) {
    const row = pack?.pathways?.[pathId];
    if (!row) return null;
    const url = rel => `private_packs/${rel}`;
    return {...(row.emblem ? {emblem: {src: url(row.emblem)}} : {}), ...(row.art ? {art: {src: url(row.art), alt: row.alt ?? ''}} : {}),
        ...(row.group ? {group: row.group} : {}), ...(row.arcana ? {arcana: row.arcana} : {}), ...(row.summary ? {summary: row.summary} : {})};
}
export async function loadCardArt(fetchFile = globalThis.fetch) {
    try {
        const manifest = await fetchFile('private_packs/manifest.json'); if (!manifest.ok) return null;
        const data = await manifest.json(); if (data.schema !== 1 || !data.supplements?.includes(SUPPLEMENT)) return null;
        const file = await fetchFile(`private_packs/${SUPPLEMENT}`); return file.ok ? await file.json() : null;
    } catch { return null; }
}
