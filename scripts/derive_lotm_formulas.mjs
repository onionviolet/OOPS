#!/usr/bin/env node
// LOTM derived formulas (PWC21, proposal): the ledger hook, the rules file writer and the held-out score.
//   node scripts/derive_lotm_formulas.mjs --write-rules    regenerate docs/coverage/lotm_rules.json
//   node scripts/derive_lotm_formulas.mjs --score <labels.json> [--out docs/coverage/lotm_derived_score.json]
// The law lives in src/lotm_derived_formulas.js (pure, so a row can be brewed in a test). This module decides which ledger rows
// take it: only rows still `blocked:formula-in-notes` after the wiki and chapter tiers folded, so a stated formula always wins.
import {createHash} from 'node:crypto';
import {confidenceOf} from './derivation_confidence.mjs';
import {readFileSync, writeFileSync} from 'node:fs';
import {liftReachable} from './typed_runs.mjs';
import {fileURLToPath} from 'node:url';
import {LOTM_DERIVE_RULES, derivedSpec, derivedRowId} from '../src/lotm_derived_formulas.js';

export const DERIVED_CASE_MODULE = 'src/world_packs/lotm_derived_cases.js';
export const RULES_FILE = 'docs/coverage/lotm_rules.json';
export const TABLE_DOC = 'docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md';
// GKM429: held out when sha1(id)[0] < 0x33. Frozen with the rule before any score label exists.
export const heldOut = id => createHash('sha1').update(id).digest()[0] < 0x33;

/** Rows the law takes: still blocked on the formula, a pathway Sequence the law knows. */
export const takesDerived = row => row.state === 'blocked:formula-in-notes' && row.pathway && Number.isInteger(row.seq);

/** Patch one ledger row into expressed-derived with its case; the runner confirms the state. */
export function applyDerived(row) {
    const spec = derivedSpec(row.pathway, row.seq);
    row.note += ` Derived tier (PWC20, PWC21; not canon): ${spec.slots.filter(s => s.role === 'main').map(s => `${s.qty > 1 ? s.qty + ' x ' : ''}${s.select.material}`).join(' plus ')} as the main, an unnamed lot the economy fills, with themed supplementary items; ritual open. A stated formula at the chapter or wiki tier replaces it.`;
    row.state = 'expressed-derived';
    row.mechanisms = [...new Set([...row.mechanisms, 'engine_brew_stock', 'lotm_derived_formulas'])];
    row.test = 'tests/lotm_derived_formulas.test.js';
    row.case = {module: DERIVED_CASE_MODULE, id: `lotm.derived.${derivedRowId(row.pathway, row.seq)}`};
    row.derived = {rule: spec.rules[0], inputs: spec.inputs, confidence: confidenceOf(spec.rules[0])};
    row.state = liftReachable(row).state; // runs-derived once the case module is reachable (PSA24)
}

export function rulesFile(derivedIds) {
    const T = TABLE_DOC;
    return {
        meta: {world: 'book.lotm.tingen', pwc: 'PWC21, PWC25 (first rules-as-rows file)', date: '2026-11-17', status: 'proposal (AD32)',
            shape: '{id, world, statement (paraphrased), locators, speaker, mechanism, derives: [row slugs]}',
            split: 'held out when sha1(id)[0] < 0x33 (GKM429)'},
        rules: [
            {id: LOTM_DERIVE_RULES.characteristic, world: 'lotm',
                statement: 'A same-Sequence Beyonder characteristic can stand in for the main materials of that Sequence\'s potion; the supplementary items are still needed and Sequences cannot be skipped. Beyonder characteristics are conserved, so a creature part that carries the characteristic and a dead Beyonder\'s characteristic are the same stuff.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Main versus aux; Characteristic worth)`, 'lotm_c_0214.xhtml', 'lotm_c_0221.xhtml', 'lotm_c_0209.xhtml'],
                speaker: 'character (stated in scene, per the table\'s T tags)',
                mechanism: 'brew_law main slot as an unnamed lot (src/lotm_derived_formulas.js, src/world_packs/lotm_brew_pack.js packRow)',
                derives: derivedIds.filter(id => !id.endsWith('_0'))},
            {id: LOTM_DERIVE_RULES.uniqueness, world: 'lotm',
                statement: 'A pathway has one Sequence 0 at a time and it needs the Uniqueness; the Sequence 0 potions the novel states combine the Uniqueness with Sequence 1 characteristics. The Sequence 0 branch is fitted to two stated rows (Fool, Black Emperor), so it is a default and outside the score.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Seq 0 and 1)`, 'lotm_c_0269.xhtml', 'lotm_c_0327.xhtml', 'lotm_c_0412.xhtml', 'lotm_c_0449.xhtml'],
                speaker: 'character; scene (Blasphemy Card, Fool 0 formula)',
                mechanism: 'brew_law, two main slots (Uniqueness, then Sequence 1 characteristics)',
                derives: derivedIds.filter(id => id.endsWith('_0'))},
            {id: LOTM_DERIVE_RULES.supplementary, world: 'lotm',
                statement: 'Supplementary items are plant liquids, powders and water that fit the Sequence\'s theme; no stated rule links them across Sequences or pathways, so the derived row carries one themed placeholder slot, never a named item.',
                locators: [`${T}#01-rules-that-apply-to-every-row (Ingredient class)`],
                speaker: 'reader inference (dwf57, dwf59)',
                mechanism: 'brew_law aux slot (read by nothing; Neil: the first five barely matter)',
                derives: derivedIds},
        ]};
}

const PRIVATE = `${(process.env.LABEL_PRIVATE ?? '/Users/weiwei/code/yet-another-idle-rpg/docs/research/advancement-aspects-2026-11-16/private').replace(/\/$/, '')}/`;
export const LABEL_FILE = `${PRIVATE}derive_lotm_mains_luna.json`;
const slugOf = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/** Every stated main the rule never sees: chapter tier, wiki tier and the brew pack's table-stated mains, as {rowId, main, tier}. */
export async function statedMains() {
    const out = [], seen = new Set();
    const add = (rowId, main, tier) => { const k = `${rowId}|${main}`; if (!seen.has(k)) { seen.add(k); out.push({rowId, main, tier}); } };
    const chapter = JSON.parse(readFileSync('docs/coverage/chapter_tier_labels.json', 'utf8')).lotm_potions;
    const wiki = JSON.parse(readFileSync('docs/coverage/wiki_tier_labels.json', 'utf8')).lotm_potions;
    for (const [id, v] of Object.entries(chapter)) for (const m of v.mains ?? []) add(id, m.name, 'chapter');
    for (const [id, v] of Object.entries(wiki)) for (const m of v.mains ?? []) add(id, m.name, 'wiki');
    const {LOTM_BREW_ROWS} = await import('../src/world_packs/lotm_brew_pack.js');
    for (const r of LOTM_BREW_ROWS) for (const s of r.slots.filter(x => x.role === 'main')) add(`lotm.potion.${r.id}`, s.material, 'table');
    return out;
}

const PATHWAYS = ['Fool', 'Error', 'Door', 'Visionary', 'Sun', 'Tyrant', 'White Tower', 'Hanged Man', 'Darkness', 'Death', 'Twilight Giant', 'Red Priest', 'Demoness', 'Paragon', 'Hermit', 'Mother', 'Moon', 'Black Emperor', 'Justiciar', 'Abyss', 'Chained', 'Wheel of Fortune'];
export const LABEL_SCHEMA = {type: 'object', additionalProperties: false, required: ['pathway', 'sequence', 'basis'],
    properties: {pathway: {type: 'string', enum: [...PATHWAYS, 'unknown', 'none']}, sequence: {type: 'integer', minimum: -1, maximum: 9},
        basis: {type: 'string', enum: ['named-in-book-or-wiki', 'inferred-from-creature-or-item', 'unknown']}}};
export const LABEL_SYSTEM = `You answer questions about the web novel Lord of the Mysteries. Each question names one ingredient, creature part or item that appears in a potion formula. Say which Beyonder pathway and which Sequence the Beyonder characteristic of that ingredient belongs to, as the novel or its wiki states or clearly implies. Use "none" when the item carries no Beyonder characteristic (an ordinary plant, mineral or water) and "unknown" when you cannot tell. Sequence is 0 to 9, or -1 when unknown or none. Do not guess to fill the answer.`;

/** Score: does the rule's identity prediction (the main carries this row's pathway at this Sequence) match a label made without the rule? */
export function score(items, labels, pathwayOf) {
    const fresh = () => ({items: 0, match: 0, pathwayOnly: 0, contradict: 0, undeterminable: 0, labels: [], rows: new Set(), rowsMatch: new Set()});
    const buckets = {all: fresh(), heldOut: fresh()};
    for (const it of items) {
        const m = /^lotm\.potion\.(.+)_(\d)$/.exec(it.rowId);
        const seq = Number(m[2]), pathway = pathwayOf(it.rowId);
        if (seq === 0) continue; // the Seq 0 branch is fitted to two stated rows, so it is not scored
        const l = labels[it.key]?.reply;
        if (!l) continue;
        const targets = heldOut(it.rowId) ? [buckets.all, buckets.heldOut] : [buckets.all];
        for (const b of targets) {
            b.items++; b.rows.add(it.rowId);
            if (l.pathway === 'unknown' || l.pathway === 'none' || l.sequence < 0) { b.undeterminable++; continue; }
            b.labels.push({pathway: l.pathway, sequence: l.sequence, rowSeq: seq, rowPathway: pathway});
            if (l.pathway === pathway && l.sequence === seq) { b.match++; b.rowsMatch.add(it.rowId); }
            else if (l.pathway === pathway) b.pathwayOnly++;
            else b.contradict++;
        }
    }
    const modeOf = xs => { const c = {}; for (const x of xs) c[x] = (c[x] ?? 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1])[0] ?? [null, 0]; };
    const out = {};
    for (const [name, b] of Object.entries(buckets)) {
        const n = b.match + b.pathwayOnly + b.contradict;
        const [mp, mpn] = modeOf(b.labels.map(x => x.pathway)), [ms, msn] = modeOf(b.labels.map(x => x.sequence));
        out[name] = {items: b.items, rows: b.rows.size, determinable: n, undeterminable: b.undeterminable,
            ruleBothAxes: b.match, rulePathwayRight: b.match + b.pathwayOnly, ruleSeqRight: b.labels.filter(x => x.sequence === x.rowSeq).length,
            rowsWithAMatch: b.rowsMatch.size,
            majorityPathway: {value: mp, right: mpn}, majoritySequence: {value: Number(ms), right: msn},
            note: 'Pathway and Sequence are an identity prediction, so no non-trivial baseline exists; majority class shown per axis.'};
    }
    return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--write-rules')) {
    const rows = readFileSync('docs/coverage/lotm_potions.jsonl', 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(r => r.derived).map(r => r.id.replace(/^lotm\.potion\./, ''));
    const next = rulesFile(rows);
    // The rite rows come from scripts/lotm_rites.mjs --fold (a paid pass); regenerating the formula rules keeps them.
    next.rules.push(...JSON.parse(readFileSync(RULES_FILE, 'utf8')).rules.filter(r => r.id.startsWith('lotm.rite.')));
    next.meta.pwc = 'PWC21, PWC21e, PWC25 (first rules-as-rows file)';
    writeFileSync(RULES_FILE, JSON.stringify(next, null, 2) + '\n');
    console.log(`wrote ${RULES_FILE} (${rows.length} derived rows)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url) && (process.argv.includes('--labels') || process.argv.includes('--score'))) {
    const items = (await statedMains()).map(x => ({...x, key: `${x.rowId}|${x.main}`}));
    if (process.argv.includes('--labels')) {
        const {runPass} = await import('./label_runner.mjs');
        const unique = [...new Map(items.map(x => [x.main, x])).values()];
        await runPass({name: 'derive_lotm_mains', dir: PRIVATE, system: LABEL_SYSTEM, schema: LABEL_SCHEMA, model: 'gpt-6-luna', effort: 'low', maxTokens: 800, maxUsd: 1,
            items: unique.map(x => ({id: x.main, user: `Ingredient: ${x.main}`}))}, process.argv.slice(2).filter(a => a !== '--labels'));
    } else {
        const raw = JSON.parse(readFileSync(LABEL_FILE, 'utf8'));
        const labels = Object.fromEntries(items.map(x => [x.key, raw[x.main]]));
        const pathwayOf = id => { const n = /^lotm\.potion\.(.+)_\d$/.exec(id)[1]; return PATHWAYS.find(p => slugOf(p) === n); };
        const result = {meta: {rule: LOTM_DERIVE_RULES.characteristic, ruleFileSha1: createHash('sha1').update(readFileSync(RULES_FILE)).digest('hex'),
            split: 'sha1(id)[0] < 0x33 (GKM429), frozen in commit 13b7b765c before any label existed', labeler: 'gpt-6-luna, low effort, one reader, prompt never states the rule; model recall, not a chapter read',
            tiers: ['chapter', 'wiki', 'table'], date: '2026-11-17'}, byTier: {}};
        for (const tier of ['chapter', 'wiki', 'table', 'all'])
            result.byTier[tier] = score(items.filter(x => tier === 'all' || x.tier === tier), labels, pathwayOf);
        const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
        if (out) writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
        console.log(JSON.stringify(result, null, 1));
    }
}
