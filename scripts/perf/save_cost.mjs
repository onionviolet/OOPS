// Save cost bench (O6 in docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md).
// Splits one durable write into its pure parts on the committed perf fixtures:
// parse, validate, stringify (the durable writer's counter-free body), the
// writer's re-parse of the string it is handed, and export encoding. The browser
// adds create_save's snapshot work and the storage write; the perf gate's
// Storage.setItem counter gives the write rate.
//   node scripts/perf/save_cost.mjs [--runs 15] [--fixtures fresh,mid,crowded] [--json]
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {validateSaveEnvelope, encodeSaveFile, serializeDurableSave} from '../../src/save_files.js';

const arg = (name, fallback) => {const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback;};
const runs = Number(arg('runs', 15)), names = arg('fixtures', 'fresh,mid,crowded').split(',');
const dir = fileURLToPath(new URL('../../tests/fixtures/perf/', import.meta.url));
const version = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url))).version ?? 'v0.6';

function time(fn) {
    for(let i = 0; i < 3; i++) fn();
    const samples = [];
    for(let i = 0; i < runs; i++) {const t = performance.now(); fn(); samples.push(performance.now() - t);}
    samples.sort((a, b) => a - b);
    return {best: samples[0], median: samples[Math.floor(samples.length / 2)]};
}

export function measureSaveCost(text) {
    const save = JSON.parse(text);
    const gameVersion = save['game version'] ?? version;
    const parts = {
        parse: time(() => JSON.parse(text)),
        validate: time(() => validateSaveEnvelope(JSON.parse(text), gameVersion)),
        durableStringify: time(() => serializeDurableSave(save)),
        stringify: time(() => JSON.stringify(save)),
        exportEncode: time(() => encodeSaveFile(text)),
    };
    return {bytes: Buffer.byteLength(text), parts};
}

if(process.argv[1] === fileURLToPath(import.meta.url)) {
    const report = {};
    for(const name of names) report[name] = measureSaveCost(readFileSync(`${dir}${name}.json`, 'utf8'));
    if(process.argv.includes('--json')) console.log(JSON.stringify(report, null, 1));
    else {
        const cols = ['parse', 'validate', 'durableStringify', 'stringify', 'exportEncode'];
        console.log(`fixture   bytes    ${cols.map(c => c.padStart(16)).join('')}   (ms, best/median of ${runs})`);
        for(const [name, r] of Object.entries(report))
            console.log(`${name.padEnd(9)} ${String(r.bytes).padStart(7)}  ${cols.map(c => `${r.parts[c].best.toFixed(2)}/${r.parts[c].median.toFixed(2)}`.padStart(16)).join('')}`);
    }
}
