// Stages the private-build art for the pathway card (CLR3: publisher art never enters tracked files or the public bundle).
// Reads a private map file, copies the named images into <packs>/pathway-card/, writes pathway-card/art.json and lists it in the manifest's
// supplements so loadCardArt() finds it. Run against a private_packs directory that is gitignored.
//   node scripts/stage_pathway_card_private.mjs <map.json> <packsDir>
// map.json: {"_roots": {"emblem": "<abs dir>", "art": "<abs dir>"}, "<pathId>": {"emblem": "<file>", "art": "<file>", "group"?, "summary"?, "alt"?}}
import {copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {basename, join} from 'node:path';
const [mapFile, packs] = process.argv.slice(2);
const map = JSON.parse(readFileSync(mapFile, 'utf8')), roots = map._roots; delete map._roots;
const dir = join(packs, 'pathway-card'); mkdirSync(dir, {recursive: true});
const pathways = {};
for (const [id, row] of Object.entries(map)) {
    const out = {};
    for (const kind of ['emblem', 'art']) if (row[kind]) {
        const src = join(roots[kind], row[kind]);
        if (!existsSync(src)) throw new Error(`Missing ${kind} for ${id}: ${src}`);
        copyFileSync(src, join(dir, basename(row[kind]))); out[kind] = `pathway-card/${basename(row[kind])}`;
    }
    for (const k of ['group', 'arcana', 'summary', 'alt']) if (row[k]) out[k] = row[k];
    pathways[id] = out;
}
writeFileSync(join(dir, 'art.json'), JSON.stringify({schema: 1, pathways}, null, 1));
const manifestFile = join(packs, 'manifest.json'), manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
if (!manifest.supplements.includes('pathway-card/art.json')) manifest.supplements.push('pathway-card/art.json');
writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));
console.log(`staged ${Object.keys(pathways).length} pathway card(s) into ${dir}`);
