// Builds docs/coverage/creatures.jsonl (MS1, CV1-CV4; chat L). Deterministic: one row per
// living kind from L's catalogue plus every kind in chat G's Gu catalogue. States follow
// CV2: runs-canon, runs-authored, blocked:<rule>, not-a-thing:<reason>; never unclassified.
// Rerun after either catalogue changes:  node scripts/coverage_creatures.mjs [--check]
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {LIVING_KIND_ROWS, guLivingRows, livingKindRegistry} from '../src/living_kinds.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {guBodyRow} from '../src/world_packs/gu_body_cases.js';
import {runCase} from './coverage_report.mjs';
import {reachableFrom} from './reachable.mjs';

const OUT = new URL('../docs/coverage/creatures.jsonl', import.meta.url);
const TEST = 'tests/living_foundation.test.js';
const registry = livingKindRegistry({extra: guLivingRows(guCatalogue)});
const reachable = reachableFrom();
const sheepFixture = {module: 'src/world_packs/meadow_lantern_coverage.js', id: 'lantern-fleece.moon-veil'};

// Owners a kind appears on (SC4), by chat letter: L runs every body; G owns Gu rows.
const mechanisms = kind => kind.class === 'gu' ? ['L', 'G'] : ['L'];

// Heredity state per kind (GN, PFP27), kept in the note until the shared row format
// has a heredity field (request to P): alleles (lineage_traits model), coin (the
// lifecycle's per-trait draw, to fold onto alleles, OA5), none (traits drawn from a
// source, not inherited), and whether the kind has genome rows yet (GN1).
const heredity = kind => `heredity=${kind.inheritance}${kind.genome ? '+genome' : ''}`;
async function classify(kind) {
    if (kind.id === 'sheep') {
        const computed = await runCase({state: 'expressed-authored', case: sheepFixture}, {reachable});
        if (!/^(expressed|runs)-/.test(computed.state)) throw new Error(`${kind.id}: ${computed.state} (${computed.detail})`);
        return {state: computed.state, fixture: sheepFixture,
            note: 'original kind; opt-in Lantern Fleece Moon Veil, saved reversion, and Sun Molt husk awakening',
            test: 'tests/heredity.test.js'};
    }
    if (kind.class === 'gu' && !kind.placeholder) {
        const {row, durationMinutes} = guBodyRow(kind.id);
        const fields = {...row.bodyFields, rationMinutes: durationMinutes};
        const unknown = Object.entries(fields).filter(([, field]) => field.basis === 'unknown').map(([name]) => name);
        const chapters = Object.entries(fields).filter(([, field]) => field.basis === 'chapter')
            .map(([name, field]) => `${name} ch. ${field.chapters.join(', ')}`);
        const hasDiet = fields.diet.basis === 'chapter';
        const fixture = hasDiet ? {module: 'src/world_packs/gu_body_cases.js', id: kind.id} : undefined;
        let state = 'blocked:diet-unknown';
        if (fixture) {
            const computed = await runCase({state: 'blocked:runner-clock-advance', case: fixture}, {reachable});
            if (!/^(expressed|runs)-/.test(computed.state)) throw new Error(`${kind.id}: ${computed.state} (${computed.detail})`);
            state = computed.state;
        }
        return {
            state, fixture,
            note: [`unknown fields: ${unknown.join(', ')}`,
                chapters.length ? `stated fields: ${chapters.join('; ')}` : null,
                hasDiet ? 'authored engine feeding timeline with unfed and wrong-food controls' : null,
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

const rows = await Promise.all(Object.values(registry.kinds).sort((a, b) => a.id < b.id ? -1 : 1).map(async kind => {
    const {state, note, fixture, test} = await classify(kind);
    return {id: kind.id, source: kind.source.locator, state, mechanisms: mechanisms(kind),
        test: test ?? (fixture ? 'tests/gu_body_cases.test.js'
            : state.startsWith('runs') ? `${TEST}#every L kind reads through one body read` : null),
        note: [`class=${kind.class}`, heredity(kind), note].filter(Boolean).join('; '),
        case: fixture};
}));
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
