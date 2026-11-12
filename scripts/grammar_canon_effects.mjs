#!/usr/bin/env node
// Effect grammar canon test on two worlds (chat P, EF1) and the new-effect
// harness (five checks, novelty dial).
//   node scripts/grammar_canon_effects.mjs [--json]
import {canonTest, fitGrammar} from '../src/procedural_grammar.js';
import {EFFECT_OBJECTS} from '../src/effect_grammar.js';
import {exploreEffects, fitCostCurve, worldLaws} from '../src/effect_checks.js';
import * as w from '../tests/fixtures/procedural_grammar/effect_worlds.mjs';
import {fileURLToPath} from 'node:url';

export async function effectWorlds() {
    const amounts = await w.guCanonAmounts();
    const worlds = [
        {id: 'gu', grammar: w.guEffects, rows: await w.guEffectRows(), label: w.labelGuEffect, compare: w.compareGuEffect, forbid: w.GU_FORBID},
        {id: 'hogwarts', grammar: w.hpEffects, rows: w.hpEffectRows(), label: w.labelHpEffect, compare: w.compareHpEffect, forbid: w.HP_FORBID},
    ];
    for (const world of worlds) {
        world.canon = world.rows.map(r => ({id: r.id, ...world.label(r)})).filter(r => r.parts)
            .map(r => ({id: r.id, parts: r.parts, amount: amounts[r.id]}));
        world.fitted = fitGrammar(world.grammar, world.canon);
        world.checks = {laws: worldLaws(world.canon.map(c => c.parts)), curve: fitCostCurve(world.canon),
            words: w.worldWords(world.canon.map(c => c.parts)), forbid: world.forbid};
    }
    return worlds;
}
// Share of one world's canon sentences whose verb on object kind the other world's canon also has.
function transfer(from, to) {
    const laws = worldLaws(from.canon.map(c => c.parts));
    const hit = to.canon.filter(c => laws.has(`${c.parts.verb}|${EFFECT_OBJECTS[c.parts.object]}`));
    return {from: from.id, to: to.id, tested: to.canon.length, shared: hit.length, rate: Math.round(hit.length / to.canon.length * 1000) / 1000};
}
export async function runEffects() {
    const worlds = await effectWorlds();
    const out = {canon: {}, transfer: [transfer(worlds[0], worlds[1]), transfer(worlds[1], worlds[0])], explore: {}};
    for (const world of worlds) {
        out.canon[world.id] = canonTest(world.grammar, world.rows, {label: world.label, compare: world.compare, infer: ['verb'],
            pairs: [['object', 'target'], ['object', 'time']]});
        const other = worlds.find(x => x !== world);
        for (const level of [0, 1, 2]) {
            const run = exploreEffects(world.fitted, world.canon, world.checks, {root: 'effects-proof', address: `explore:${world.id}:${level}`,
                cause: {kind: 'pressure', id: 'proof:scouts-at-the-gate'}, novelty: {level, cause: level ? 'an inventor far from tradition' : 'a traditional teacher'},
                count: 40, transferFrom: other.canon, keep: {k: 6}});
            out.explore[`${world.id}@${level}`] = {proposed: run.proposed, passed: run.passed, failures: run.failures, niches: run.niches,
                curve: world.checks.curve, kept: run.kept.map(c => ({id: c.id, from: c.origin.canon, changed: c.origin.changed, score: c.score,
                    sentence: `${c.parts.verb} ${c.parts.object} ${c.parts.target} ${c.parts.time} via ${c.parts.carrier} on ${c.parts.cost}`}))};
        }
    }
    return out;
}
function summary(out) {
    const lines = [];
    for (const [id, r] of Object.entries(out.canon)) {
        lines.push(`${id}: ${r.corpus.rows} rows, ${r.corpus.labelled} labelled; rebuild ${r.rebuild.passed}/${r.rebuild.tested} = ${r.rebuild.rate}`,
            `  verb inferred from object, target, time: ${r.inference.verb.rate} (baseline ${r.inference.verb.baseline})`,
            `  pair support: ${Object.entries(r.range.pairs).map(([k, v]) => `${k} ${v.supportedRate}`).join(', ')}`,
            `  unlabelled: ${r.corpus.unlabelledReasons.map(u => `${u.count} x ${u.field} (${u.examples.join(', ')})`).join('; ')}`, '  missing rules:');
        for (const f of r.missingRules) lines.push(`    ${f.count} x ${f.kind} ${f.rule ?? f.slot}${f.cause ? ` (${f.cause})` : ''} e.g. ${f.examples.join(', ')}`);
    }
    for (const t of out.transfer) lines.push(`transfer ${t.from} laws -> ${t.to} canon: ${t.shared}/${t.tested} = ${t.rate}`);
    for (const [id, e] of Object.entries(out.explore)) {
        lines.push(`explore ${id}: ${e.passed}/${e.proposed} pass, failures ${JSON.stringify(e.failures)}, ${e.niches} niches kept`);
        for (const k of e.kept) lines.push(`    ${k.sentence}  [from ${k.from}, changed ${k.changed.join('+')}, score ${k.score}]`);
    }
    return lines.join('\n');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const out = await runEffects();
    console.log(process.argv.includes('--json') ? JSON.stringify(out, null, 1) : summary(out));
}
