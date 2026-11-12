#!/usr/bin/env node
// Canon test for the proof Gu kind grammar (chat P, contract v0).
//   node scripts/grammar_canon_gu.mjs [--index <gu-identities.json>] [--write-slice] [--json]
// With the private review index present, runs the whole index and can rewrite
// the committed slice (labels only: name, ranks, wiki path/type categories,
// revision). Without it, runs the committed slice.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonTest} from '../src/procedural_grammar.js';
import {drawU32, address, compareCodePoints} from '../src/gen_kit.js';
import {guKindGrammar, guKindGrammarV2, guKindGrammarV3, labelGuRow, compareGuKind, guKindIdentity} from '../tests/fixtures/procedural_grammar/gu_kind_grammar.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), arg = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const slicePath = path.join(root, 'tests/fixtures/procedural_grammar/gu_kind_slice.json');
const defaultIndex = path.join(root, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json');
const indexPath = arg('--index') ?? (fs.existsSync(defaultIndex) ? defaultIndex : null);
const SLICE_SIZE = 120;

export function rowsFromIndex(index) {
    return index.records.filter(r => r.status !== 'reference-page').map(r => ({
        id: r.id,
        name: r.saga?.name ?? r.fandom?.name ?? null,
        sagaRank: r.metadata?.saga_rank ?? null,
        fandomRanks: r.metadata?.fandom_category_ranks ?? [],
        categories: (r.fandom?.categories ?? []).filter(c => / Path$/.test(c) || / Type Gu$/.test(c)),
        revision: r.fandom?.revision_id ?? null,
        status: r.status,
    }));
}
// Deterministic slice: hash order by id, so the slice is not alphabetical.
// Mostly labelled rows (the rebuild needs parts) plus a tail of unlabelled ones.
export function sliceRows(rows, labelledSize = SLICE_SIZE, unlabelledSize = 20) {
    const order = list => [...list].sort((a, b) => drawU32('gu-slice@1', address(a.id)) - drawU32('gu-slice@1', address(b.id)) || compareCodePoints(a.id, b.id));
    const labelled = rows.filter(r => labelGuRow(r).parts), unlabelled = rows.filter(r => !labelGuRow(r).parts);
    return [...order(labelled).slice(0, labelledSize), ...order(unlabelled).slice(0, unlabelledSize)].sort((a, b) => compareCodePoints(a.id, b.id));
}
export const runGuCanon = (rows, grammar = guKindGrammar) => canonTest(grammar, rows, {label: labelGuRow, compare: compareGuKind, identity: guKindIdentity, infer: ['path', 'role'], pairs: [['path', 'role'], ['rank', 'path'], ['rank', 'role']]});

function summary(name, report) {
    const lines = [`${name}: ${report.corpus.rows} rows, ${report.corpus.labelled} labelled, ${report.corpus.unlabelled} unlabelled`,
        `  rebuild ${report.rebuild.passed}/${report.rebuild.tested} = ${report.rebuild.rate}`,
        `  open-part coverage ${report.openPartCoverage.rate}`,
        `  inference from name parts: ${Object.entries(report.inference).map(([k, v]) => `${k} ${v.hits}/${v.tested} = ${v.rate} (majority baseline ${v.baseline})`).join('; ')}`,
        `  range: ${report.range.inside}/${report.range.generated} inside, fallbacks ${report.range.fallbacks}, rule-flagged ${report.range.ruleFlagged}, canon collisions ${report.range.canonCollisions}`,
        `  shares (total variation, tolerance ${report.range.tolerance}): ${Object.entries(report.range.shares).map(([k, v]) => `${k} ${v.distance}${v.withinTolerance ? '' : ' OVER'}`).join(', ')}`,
        `  pair support (generated items whose every pair the corpus shows): ${Object.entries(report.range.pairs).map(([k, v]) => `${k} ${v.items - v.unseenItems}/${v.items} = ${v.supportedRate} (${v.seenInCorpus} pairs seen)`).join('; ')}`,
        '  missing rules:'];
    for (const f of report.missingRules.slice(0, 12)) lines.push(`    ${f.count} x ${f.kind} ${f.rule ?? f.slot ?? f.field}${f.cause ? ` (${f.cause})` : ''}${f.value !== undefined ? ` = ${JSON.stringify(f.value)}` : ''} (e.g. ${f.examples.slice(0, 3).join(', ')})`);
    lines.push('  unlabelled:', ...report.corpus.unlabelledReasons.map(f => `    ${f.count} x ${f.field}`));
    return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const out = {};
    if (indexPath) {
        const rows = rowsFromIndex(JSON.parse(fs.readFileSync(indexPath, 'utf8')));
        if (args.includes('--write-slice')) {
            fs.writeFileSync(slicePath, JSON.stringify({source: 'held Gu review index, labels only', revision: 1, rows: sliceRows(rows)}, null, 1) + '\n');
        }
        out['full v1'] = runGuCanon(rows);
        out['full v2'] = runGuCanon(rows, guKindGrammarV2);
        out['full v3'] = runGuCanon(rows, guKindGrammarV3);
    }
    const slice = JSON.parse(fs.readFileSync(slicePath, 'utf8')).rows;
    out['slice v1'] = runGuCanon(slice);
    out['slice v2'] = runGuCanon(slice, guKindGrammarV2);
    out['slice v3'] = runGuCanon(slice, guKindGrammarV3);
    if (args.includes('--json')) console.log(JSON.stringify(out, null, 1));
    else for (const [k, v] of Object.entries(out)) console.log(summary(k, v));
}
