#!/usr/bin/env node
// MC14 step 1: deterministic corpus labelling from repo data only (chat P).
// No agents, no book text. Three corpora:
//   Gu index   labels from wiki categories, G's chapter-checked parts rows, and
//              name words that equal a declared path (a separate, weaker layer);
//              inferSlot proposals are counted but never used as labels (PGC11).
//   Spells     effect sentences from the spellbook leads (effect_worlds labeller).
//   Potions    ingredient and preparation parts per potion from the evidence
//              observations, shaped for B's grammar (BRG1, BRG3).
//   node scripts/grammar_label_mc14.mjs [--index <gu-identities.json>] [--out <summary.json>]
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fitGrammar, inferSlot} from '../src/procedural_grammar.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {GU_PATHS, guKindGrammarV2, labelGuRow} from '../tests/fixtures/procedural_grammar/gu_kind_grammar.mjs';
import {hpEffectRows, labelHpEffect} from '../tests/fixtures/procedural_grammar/effect_worlds.mjs';
import {rowsFromIndex} from './grammar_canon_gu.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), arg = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const privateIndex = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json';
const indexPath = arg('--index') ?? [path.join(root, privateIndex), path.join(root, '../../..', privateIndex)].find(p => fs.existsSync(p));
const PATH_WORDS = new Map(GU_PATHS.map(p => [p[0].toUpperCase() + p.slice(1), p]));

// Gu: which layer can supply each missing field.
export function labelGuIndex(rows) {
    const chapter = new Map(Object.entries(guCatalogue).map(([id, v]) => [id, v.parts?.value]));
    const labelled = rows.filter(r => labelGuRow(r).parts);
    const fitted = fitGrammar(guKindGrammarV2, labelled.map(r => ({id: r.id, ...labelGuRow(r)})));
    const counts = {records: rows.length, alreadyLabelled: labelled.length, missing: {}, recovered: {}, proposals: {}};
    const labels = [];
    for (const row of rows) {
        const out = labelGuRow(row);
        if (out.parts) continue;
        const ch = chapter.get(row.id.replace(/^(candidate|saga|fandom):/, ''));
        const words = (row.name ?? '').split(/\s+/);
        for (const field of out.missing) {
            counts.missing[field] = (counts.missing[field] ?? 0) + 1;
            let label = null, layer = null;
            if (field === 'rank' && ch?.rank?.length) [label, layer] = [ch.rank, 'chapter'];
            if (field === 'path' && ch?.path) [label, layer] = [[ch.path], 'chapter'];
            if (field === 'path' && !label) {
                const named = [...new Set(words.map(w => PATH_WORDS.get(w)).filter(Boolean))];
                if (named.length) [label, layer] = [named, 'name-word'];
            }
            if (label) {
                counts.recovered[`${field}:${layer}`] = (counts.recovered[`${field}:${layer}`] ?? 0) + 1;
                labels.push({id: row.id, field, label, layer});
            } else if (field === 'path' && words.length > 1) {
                // A proposal only: ranked candidates from name words, never a fit label.
                const tokens = words.filter(w => w !== 'Gu' && w !== 'Immortal');
                const best = inferSlot(fitted, {marks: tokens.slice(0, -1), head: tokens.at(-1)}, 'path').ranked[0];
                if (best?.score > 0) counts.proposals.path = (counts.proposals.path ?? 0) + 1;
            }
        }
    }
    return {counts, labels};
}

// Spells: one effect sentence per lead, or the reason there is none.
export function labelSpells() {
    const rows = hpEffectRows(), byVerb = {}, unlabelled = [];
    for (const row of rows) {
        const out = labelHpEffect(row);
        if (out.parts) byVerb[out.parts.verb] = (byVerb[out.parts.verb] ?? 0) + 1; else unlabelled.push(row.id);
    }
    return {records: rows.length, labelled: rows.length - unlabelled.length, byVerb, unlabelled};
}

// Potions: ingredient ids and preparation operations per potion (B's parts).
const PREP = [['weigh', /weigh/], ['crush', /crush/], ['stew', /stew/], ['powder', /powder/], ['cut', /\bcut|chop|slice/], ['tear', /tear/],
    ['add', /\badd/], ['stir', /stir/], ['heat', /heat|boil|simmer/], ['shred', /shred/], ['infuse', /infusion|steep/], ['strain', /strain/],
    ['freeze', /freez/], ['bottle', /bottle|flask/]];
export function labelPotions(file = path.join(root, 'docs/research/hogwarts-potion-evidence-2026-11-11/observations.jsonl')) {
    const subjects = new Map();
    for (const line of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
        const r = JSON.parse(line);
        const s = subjects.get(r.subject) ?? {subject: r.subject, ingredients: new Set(), identity: new Set(), ops: new Set(), evidence: []};
        if (r.ingredient && ['material', 'relation_bound_input', 'external_process_input'].includes(r.participant_kind)) s.ingredients.add(r.ingredient);
        if (r.ingredient && /identity/.test(r.participant_kind ?? '')) s.identity.add(r.ingredient);
        if (['preparation', 'operation', 'extraction', 'recipe'].includes(r.field)) {
            for (const [op, re] of PREP) if (re.test(r.observation.toLowerCase())) s.ops.add(op);
        }
        s.evidence.push(r.id);
        subjects.set(r.subject, s);
    }
    const rows = [...subjects.values()].map(s => ({subject: s.subject, ingredients: [...s.ingredients].sort(), identity: [...s.identity].sort(),
        ops: [...s.ops].sort(), evidence: s.evidence}));
    return {subjects: rows.length, withIngredients: rows.filter(r => r.ingredients.length).length,
        withOps: rows.filter(r => r.ops.length).length, recipeShaped: rows.filter(r => r.ingredients.length && r.ops.length).length,
        rows: rows.filter(r => r.ingredients.length || r.ops.length)};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const summary = {spells: labelSpells(), potions: labelPotions(), gu: null};
    if (indexPath) {
        const gu = labelGuIndex(rowsFromIndex(JSON.parse(fs.readFileSync(indexPath, 'utf8'))));
        summary.gu = gu.counts;
        // Labels from the private index stay private (gitignored path in this checkout).
        const out = path.join(root, 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-labels-mc14.json');
        fs.mkdirSync(path.dirname(out), {recursive: true});
        fs.writeFileSync(out, JSON.stringify({source: 'grammar_label_mc14.mjs', labels: gu.labels}, null, 1) + '\n');
    }
    const target = arg('--out');
    if (target) fs.writeFileSync(target, JSON.stringify(summary, null, 1) + '\n');
    console.log(JSON.stringify({gu: summary.gu, spells: {...summary.spells, unlabelled: summary.spells.unlabelled.length},
        potions: {...summary.potions, rows: summary.potions.rows.length}}, null, 1));
}
