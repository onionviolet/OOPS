#!/usr/bin/env node
// Cross-system stat report: stats with no reader, readers with no writer, runaway multipliers.
//   node scripts/stat_report.mjs [--json] [--out file]
// Reads content registries (items, effects, races) and src/*.js text. Writes nothing but --out.
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadNative, STANCE_LOCATION_STUBS} from '../tests/helpers/native_loader.mjs';
import {collectStatGrants, buildStatReport} from '../src/stat_interactions.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const n = await loadNative('export {item_templates} from "./src/items.js"; export {effect_templates} from "./src/active_effects.js"; ' +
    'export {playable_races} from "./src/races.js"; export {stat_names} from "./src/misc.js";', {stubs: STANCE_LOCATION_STUBS});
const files = {};
const walk = async dir => {
    for (const e of await readdir(join(root, dir), {withFileTypes: true})) {
        if (e.isDirectory()) await walk(join(dir, e.name));
        else if (e.name.endsWith('.js')) files[join(dir, e.name)] = await readFile(join(root, dir, e.name), 'utf8');
    }
};
await walk('src');
const grants = collectStatGrants({item: n.item_templates, effect: n.effect_templates, race: n.playable_races});
const report = buildStatReport({statKeys: Object.keys(n.stat_names), grants, files});
const args = process.argv.slice(2);
const text = args.includes('--json') ? JSON.stringify(report, null, 1) : [
    `stats ${report.totals.stats}, grants ${report.totals.grants} (items, effects, races; skills, titles and traits not walked)`,
    `granted but no named reader: ${report.noReader.join(', ') || 'none'}`,
    `read only by presentation files: ${report.displayOnly.join(', ') || 'none'}`,
    `named by behavior code but no content grants it: ${report.noWriter.join(', ') || 'none'}`,
    `neither: ${report.unused.join(', ') || 'none'}`,
    `runaway (single multiplier >= 3 or worst-case stack >= 20): ${report.runaway.map(r => `${r.stat} (max ${r.maxSingle}, stack ${r.worstCaseStack})`).join('; ') || 'none'}`,
    '', 'stat | writers | named in | behavior files | max flat | max x | stack',
    ...report.stats.map(r => `${r.stat} | ${r.writers} | ${r.readerFiles} | ${r.behaviorReaders} | ${r.maxFlat} | ${r.maxSingleMultiplier} | ${r.worstCaseStack}`),
].join('\n');
if (args.includes('--out')) await writeFile(args[args.indexOf('--out') + 1], text + '\n');
console.log(text);
