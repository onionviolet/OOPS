// Builds docs/coverage/creatures.jsonl (MS1, CV1-CV4; chat L). Deterministic: one row per
// living kind from L's catalogue plus every kind in chat G's Gu catalogue. States follow
// CV2: runs-canon, runs-authored, blocked:<rule>, not-a-thing:<reason>; never unclassified.
// Rerun after either catalogue changes:  node scripts/coverage_creatures.mjs [--check]
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {LIVING_KIND_ROWS, guLivingRows, livingKindRegistry} from '../src/living_kinds.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {guBodyRow} from '../src/world_packs/gu_body_cases.js';

const OUT = new URL('../docs/coverage/creatures.jsonl', import.meta.url);
const TEST = 'tests/living_foundation.test.js';
const registry = livingKindRegistry({extra: guLivingRows(guCatalogue)});

// Owners a kind appears on (SC4), by chat letter: L runs every body; G owns Gu rows.
const mechanisms = kind => kind.class === 'gu' ? ['L', 'G'] : ['L'];

// Heredity state per kind (GN, PFP27), kept in the note until the shared row format
// has a heredity field (request to P): alleles (lineage_traits model), coin (the
// lifecycle's per-trait draw, to fold onto alleles, OA5), none (traits drawn from a
// source, not inherited), and whether the kind has genome rows yet (GN1).
const heredity = kind => `heredity=${kind.inheritance}${kind.genome ? '+genome' : ''}`;
function classify(kind) {
    if (kind.class === 'gu' && !kind.placeholder) {
        const {row, durationMinutes} = guBodyRow(kind.id);
        const fields = {...row.bodyFields, rationMinutes: durationMinutes};
        const unknown = Object.entries(fields).filter(([, field]) => field.basis === 'unknown').map(([name]) => name);
        const chapters = Object.entries(fields).filter(([, field]) => field.basis === 'chapter')
            .map(([name, field]) => `${name} ch. ${field.chapters.join(', ')}`);
        // The current common runner applies a single sentence at one minute.
        // Engine fixtures are evidence for the body, not a computed ledger state.
        const hasDiet = fields.diet.basis === 'chapter';
        return {
            state: hasDiet ? 'blocked:runner-clock-advance' : 'blocked:diet-unknown',
            note: [`unknown fields: ${unknown.join(', ')}`,
                chapters.length ? `stated fields: ${chapters.join('; ')}` : null,
                hasDiet ? 'authored engine feeding fixture; common runner cannot advance time' : null,
                `living roles: ${kind.living.join(', ') || 'none recorded'}`].filter(Boolean).join('; '),
        };
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
        test: state.startsWith('runs') ? `${TEST}#every L kind reads through one body read` : null,
        note: [`class=${kind.class}`, heredity(kind), note].filter(Boolean).join('; ')};
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
