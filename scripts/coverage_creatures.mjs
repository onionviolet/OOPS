// Builds docs/coverage/creatures.jsonl (MS1, CV1-CV4; chat L). Deterministic: one row per
// living kind from L's catalogue plus every kind in chat G's Gu catalogue. States follow
// CV2: runs-canon, runs-authored, blocked:<rule>, not-a-thing:<reason>; never unclassified.
// Rerun after either catalogue changes:  node scripts/coverage_creatures.mjs [--check]
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {LIVING_KIND_ROWS, guLivingRows, livingKindRegistry} from '../src/living_kinds.js';
import {guCatalogue} from '../src/gu_catalogue.js';

const OUT = new URL('../docs/coverage/creatures.jsonl', import.meta.url);
const TEST = 'tests/living_foundation.test.js';
const registry = livingKindRegistry({extra: guLivingRows(guCatalogue)});

// Shared-rule owners a kind appears on (SC4). L's lifecycle and body read run every row;
// the others are named only where a module actually reads that kind today.
const LIFECYCLE_HOSTS = new Set(['liquor-worm', 'starlight-firefly', 'moonlight']);
const mechanisms = kind => {
    const out = ['L:living_kinds', 'L:living_body'];
    if (kind.class === 'gu') out.push('G:gu_catalogue');
    if (LIFECYCLE_HOSTS.has(kind.id) || kind.class !== 'gu' && kind.hosts.some(h => !/simulation|chronicle|npc_lives|shipping|hired|hp_brewing|household_brood/.test(h)))
        out.push('L:creature_lifecycle');
    return out;
};

function classify(kind) {
    if (kind.class === 'gu' && !kind.placeholder) {
        // Every Gu eats and can die, so each is a creature. A Gu body runs only with a
        // diet, ration and stage timing, which live as scene constants in Keeper code,
        // not as catalogue fields (G's backlog GB7).
        return {state: 'blocked:gu-body-fields', note: `G row has no diet, ration or stage minutes (GB7); living roles: ${kind.living.join(', ') || 'none recorded'}`};
    }
    // L rows: every value the body read needs (class, needs body, stages, inheritance,
    // reproduction, prey) is authored, including for kinds a book names, because no
    // cited scene states those values. The test runs each row through the body read.
    const book = kind.source.kind === 'book';
    return {state: 'runs-authored', note: [book ? `book kind (${kind.source.locator}); living values authored` : 'original kind',
        kind.placeholder ? 'placeholder until G catalogues it' : null,
        kind.needs === null ? 'fed by habitat supply' : null].filter(Boolean).join('; ')};
}

const rows = Object.values(registry.kinds).sort((a, b) => a.id < b.id ? -1 : 1).map(kind => {
    const {state, note} = classify(kind);
    return {id: kind.id, source: kind.source.locator, state, mechanisms: mechanisms(kind),
        test: state.startsWith('runs') ? `${TEST}: every L kind reads through one body read` : null, class: kind.class, note};
});
const text = rows.map(row => JSON.stringify(row)).join('\n') + '\n';

const counts = {};
for (const row of rows) { const key = row.state.split(':')[0]; counts[key] = (counts[key] ?? 0) + 1; }
if (process.argv.includes('--check')) {
    const saved = readFileSync(OUT, 'utf8');
    if (saved !== text) { console.error('creatures.jsonl is stale: rerun node scripts/coverage_creatures.mjs'); process.exit(1); }
} else {
    mkdirSync(new URL('.', OUT), {recursive: true});
    writeFileSync(OUT, text);
}
console.log(`creatures: ${rows.length} rows`, counts, `unclassified ${rows.filter(r => r.state === 'unclassified').length}`);
