#!/usr/bin/env node
// Derived values against their own world's rules (PWC86, PWC100; proposal). Local, no paid call. Writes docs/coverage/derivation_clashes.json.
//   node scripts/derivation_consistency.mjs [--check]
// Gu: a derived rank against the refinement recipes (as a product it must be one above its highest known precursor, as an input it must sit
//   below every product of known rank; the +1 holds on 50 of 54 edges, so a precursor clash is a review item, not an error).
// LOTM: a derived potion against the Sequence order (the main is that Sequence's characteristic, Sequence 0 needs Sequence 1; a pathway with a
//   derived Sequence and a gap above it is flagged).
// Harry Potter: a derived ingredient axis against the axes of the recipes that use it (an axis no recipe supports came from siblings only).
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {derivedSpec, LOTM_PATHWAYS} from '../src/lotm_derived_formulas.js';
import {deriveIngredient, potionAxis} from './derive_hp_properties.mjs';

const root = new URL('..', import.meta.url).pathname;
export const CLASH_FILE = 'docs/coverage/derivation_clashes.json';
const rd = f => JSON.parse(readFileSync(join(root, f), 'utf8'));
const rows = f => readFileSync(join(root, f), 'utf8').trim().split('\n').map(l => JSON.parse(l));

async function gu() {
    const g = await import('./derive_gu_ranks.mjs');
    const priv = ['/Users/weiwei/code/yet-another-idle-rpg/', root].map(b => join(b, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json')).find(existsSync);
    if (!priv) return {skipped: 'private Gu index missing', clashes: [], checked: 0};
    const world = g.buildWorld({index: JSON.parse(readFileSync(priv, 'utf8')), edges: rd(g.EDGES_FILE).edges, chapterTier: rd('docs/coverage/chapter_tier_labels.json').gu_kinds, wikiTier: rd('docs/coverage/wiki_tier_labels.json').gu_kinds});
    const derived = rd(g.DERIVED_FILE).rows, clashes = [];
    // products of each Gu, from every record's edges
    const productsOf = {};
    for (const [id, e] of Object.entries(world.edges)) for (const x of new Set(world.resolve([...(e.precursors ?? []), ...(e.fusion ?? [])]))) (productsOf[x] ??= []).push(id);
    let checked = 0;
    for (const [id, d] of Object.entries(derived)) {
        const rank = d.rank, why = [];
        const pre = g.precursorRule(world, id);
        if (pre && d.rule !== 'gu.rank.precursor' && pre.rank !== rank) why.push(`as a product: precursors imply rank ${pre.rank} (${pre.inputs.join(', ')}), derived ${rank} by ${d.rule}`);
        for (const p of productsOf[id] ?? []) if (world.rank[p] && world.rank[p] <= rank) why.push(`as an input: product ${p} has rank ${world.rank[p]}, so this should be at most ${world.rank[p] - 1}; derived ${rank}`);
        if (pre || productsOf[id]) checked++;
        if (why.length) clashes.push({world: 'reverend-insanity', rule: d.rule, id, derived: rank, why});
    }
    return {checked, derivedRows: Object.keys(derived).length, clashes};
}

function lotm() {
    const ledger = rows('docs/coverage/lotm_potions.jsonl'), clashes = [];
    const dv = ledger.filter(r => r.derived), bySeq = {};
    for (const r of ledger) { const m = /^lotm\.potion\.(.+)_(\d)$/.exec(r.id); if (m) (bySeq[m[1]] ??= {})[m[2]] = r; }
    let checked = 0;
    for (const r of dv) {
        const m = /^lotm\.potion\.(.+)_(\d)$/.exec(r.id), seq = Number(m[2]);
        const pathway = LOTM_PATHWAYS.find(p => p.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') === m[1]);
        if (!pathway) { clashes.push({world: 'lotm', rule: r.derived.rule, id: r.id, why: ['pathway not in LOTM_PATHWAYS']}); continue; }
        checked++;
        const spec = derivedSpec(pathway, seq), mains = spec.slots.filter(s => s.role === 'main').map(s => s.select.material), why = [];
        if (seq > 0 && !mains.every(x => x.startsWith(`Sequence ${seq} `))) why.push(`main is not Sequence ${seq}'s characteristic: ${mains.join(', ')}`);
        if (seq === 0 && !bySeq[m[1]]?.['1']) why.push('Sequence 0 needs a Sequence 1 row in the pathway and there is none');
        if (seq === 0 && !mains.some(x => /Uniqueness/.test(x))) why.push('Sequence 0 main lacks the Uniqueness');
        // Sequences cannot be skipped: the row above must exist.
        if (seq < 9 && !bySeq[m[1]]?.[String(seq + 1)]) why.push(`no Sequence ${seq + 1} row in the pathway, but Sequence ${seq} is derived`);
        if (why.length) clashes.push({world: 'lotm', rule: r.derived.rule, id: r.id, why});
    }
    return {checked, derivedRows: dv.length, clashes};
}

function hp() {
    const ledger = rows('docs/coverage/hp_ingredients.jsonl'), clashes = [];
    let checked = 0;
    const dv = ledger.filter(r => r.derived);
    for (const r of dv) {
        const d = deriveIngredient(r.id);
        if (!d.axes) { clashes.push({world: 'hp', rule: r.derived.rule, id: r.id, why: [`ledger says derived but the rule now blocks it: ${d.block}`]}); continue; }
        const recipeAxes = new Set((d.inputs ?? []).filter(i => i.startsWith('potion:')).map(i => i.split('->')[1]));
        if (!recipeAxes.size) continue;
        checked++;
        const unsupported = d.axes.filter(a => !recipeAxes.has(a.axis)).map(a => a.axis);
        const why = [];
        if (recipeAxes.size > 1) why.push(`its recipes disagree: ${[...recipeAxes].join(' vs ')}`);
        if (unsupported.length) why.push(`axis ${unsupported.join(', ')} comes from siblings, no recipe that uses it has it (recipes: ${[...recipeAxes].join(', ')})`);
        if (why.length) clashes.push({world: 'hp', rule: r.derived.rule, id: r.id, why});
    }
    return {checked, derivedRows: dv.length, clashes};
}

export async function build() {
    const out = {gu: await gu(), lotm: lotm(), hp: hp()};
    return {meta: {pass: 'PWC86, PWC100', date: '2026-11-17', status: 'proposal (AD32)', regenerate: 'node scripts/derivation_consistency.mjs',
        note: 'A clash sends the row to review; it changes no ledger. Counts: rows checked (had a recipe, product, input or Sequence neighbour) and clashes.'},
        counts: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, {derivedRows: v.derivedRows ?? null, checked: v.checked, clashes: v.clashes.length, ...(v.skipped ? {skipped: v.skipped} : {})}])),
        clashes: Object.values(out).flatMap(v => v.clashes)};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const text = `${JSON.stringify(await build(), null, 1)}\n`;
    if (process.argv.includes('--check')) process.exit(text === readFileSync(join(root, CLASH_FILE), 'utf8') ? 0 : 1);
    writeFileSync(join(root, CLASH_FILE), text);
    console.log(JSON.stringify(JSON.parse(text).counts));
}
