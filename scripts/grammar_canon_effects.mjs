#!/usr/bin/env node
// Effect grammar canon test on two worlds (chat P, EF1) and the new-effect
// harness (five checks, novelty dial).
//   node scripts/grammar_canon_effects.mjs [--json]
import {canonTest, fitGrammar, assemble} from '../src/procedural_grammar.js';
import {guCatalogue} from '../src/gu_catalogue.js';
import {EFFECT_OBJECTS} from '../src/effect_grammar.js';
import {exploreEffects, fitCostCurve, worldLaws, searchEffectsForGoal, knowledgeFrom} from '../src/effect_checks.js';
import {backwardCanonTest} from '../src/grammar_search.js';
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
    const gl2 = {gu: [w.guEffectsGl2, w.labelGuEffectGl2], hogwarts: [w.hpEffectsGl2, w.labelHpEffectGl2]};
    out.gl2 = {};
    for (const world of worlds) {
        const [grammar, label] = gl2[world.id];
        const predict = world.id === 'gu' ? w.GU_GL2_FIELDS : ['verb', 'object', 'target', 'time'];
        out.gl2[world.id] = canonTest(grammar, world.rows, {label, predict, generated: 20}).prediction;
        if (world.id === 'gu') {
            const baseline = canonTest(w.guEffectsGl2Baseline, world.rows, {label, predict, generated: 20});
            const excluded = world.rows.flatMap(row => {
                const result = label(row);
                return result.parts ? [] : [{id: row.id, missing: result.missing, chapters: row.parts?.chapters ?? []}];
            });
            Object.assign(out.gl2.gu, {baseline: baseline.prediction, folds: baseline.folds, corpusRows: world.rows.length, excluded});
        }
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
    // GL6: canon killer moves as nested roles (GL3 precursor).
    const moves = w.guMoveRows(), moveGrammar = fitGrammar(w.guMoveGrammar(Object.keys(guCatalogue)), moves);
    const flags = {};
    let assembled = 0, complete = 0;
    for (const m of moves) {
        const b = assemble(moveGrammar, m.parts), f = b.receipt.flags.filter(x => x.kind === 'rule-flag');
        if (b.ok) assembled++;
        if (b.ok && !f.length) complete++;
        for (const x of f) flags[x.rule] = (flags[x.rule] ?? 0) + 1;
    }
    // RV2: backward from each canon sentence's verb, object, target and time.
    const id = v => JSON.stringify([...['verb', 'object', 'target', 'time', 'carrier', 'cost'].map(k => v.parts[k]), [...(v.parts.limits ?? [])].sort()]);
    out.backward = Object.fromEntries(worlds.map(world => [world.id, backwardCanonTest(world.fitted, world.canon.map(c => c.parts),
        {fix: ['verb', 'object', 'target', 'time'], identity: id})]));
    // PM3: a keeper who has seen four Gu states "hide the camp".
    const gu = worlds[0], seen = gu.canon.filter(c => ['gu:stealth-scales', 'gu:moonlight', 'gu:earth-communication-ear-grass', 'gu:white-jade'].includes(c.id));
    const knows = knowledgeFrom(seen.map(c => c.parts));
    delete knows.target; delete knows.time;
    const camp = searchEffectsForGoal(gu.fitted, {verb: 'conceal', object: 'information', target: 'area'},
        {actor: {knows, owns: {carrier: ['gu'], cost: ['essence-primeval']}}, world: gu.checks});
    out.goal = {goal: 'hide the camp: conceal information around', answers: camp.answers.map(a => ({sentence: Object.values(a.parts).flat().join(' '),
        explains: a.checks.find(c => c.id === 'explains').text, unknown: a.preview.unknown})), tried: camp.tried, gaps: camp.gaps};
    out.moves = {records: moves.length, roles: moves.reduce((n, m) => n + m.parts.roles.length, 0), assembled, complete, flags};
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
    for (const [id, p] of Object.entries(out.gl2)) {
        if (id === 'gu') {
            lines.push(`GL2 gu: ${p.tested}/${p.corpusRows} chapter-checked rows scored in ${p.folds} fixed folds; ${p.excluded.length} excluded:`,
                ...p.excluded.map(row => `    ${row.id}: missing ${row.missing.join(', ')} (ch. ${row.chapters.join(', ')})`),
                '  before -> after (hits): ' + [['whole', p.all], ...Object.entries(p.slots)]
                    .map(([field, current]) => `${field} ${(field === 'whole' ? p.baseline.all : p.baseline.slots[field]).hits}/${p.baseline.tested} -> ${current.hits}/${p.tested}`)
                    .join(', '));
        }
        lines.push(`GL2 ${id}: whole effect predicted from identity ${p.all.hits}/${p.tested} = ${p.all.rate} (majority ${p.all.baseline}); ` +
            Object.entries(p.slots).map(([k, v]) => `${k} ${v.rate} (${v.baseline})`).join(', '), '  top misses:');
        for (const m of p.misses.slice(0, 8)) lines.push(`    ${m.count} x ${m.miss} e.g. ${m.examples.join(', ')}`);
    }
    lines.push(`GL6 moves: ${out.moves.assembled}/${out.moves.records} assemble as nested roles (${out.moves.roles} roles); ${out.moves.complete} fully named and catalogued; flags ${JSON.stringify(out.moves.flags)}`);
    for (const [id, b] of Object.entries(out.backward)) lines.push(`RV2 backward ${id}: canon route found for ${b.canonFound}/${b.tested} = ${b.rate}; ${b.alternativesPerTarget} other routes per target`);
    lines.push(`PM3 ${out.goal.goal}: ${out.goal.answers.length} candidates in ${out.goal.tried} trials`);
    for (const a of out.goal.answers) lines.push(`    ${a.sentence}  ("${a.explains}"; unknown to the keeper: ${a.unknown.join(', ') || 'none'})`);
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
