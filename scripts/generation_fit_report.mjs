#!/usr/bin/env node
// Generation fit report (PSA30, PC11 in docs/PROCEDURAL_CORE.md): four numbers per world for Gu, spells and
// brews, each printed with the circular trap that flatters it.
//   node scripts/generation_fit_report.mjs [--fold N] [--count N] [--json] [--write]
//
// Method. Rows are hashed into FOLDS folds (the canonTest hash, so a row keeps its fold). The grammar is fitted
// on the other folds and the held-out fold is scored ONCE (default fold 0; a dial, never rotated or averaged,
// so no rule is tuned against a fold it was scored on). N proposals are drawn at novelty 0 and 1.
//   pair support    proposals whose every conditioned slot pair occurs in a train row (the pairs grammar_canon_effects uses)
//   rediscovery     held-out (verb, object, target, time) tuples the proposals reach, headline over tuples the train fold
//                   does not contain; uniform baseline 1-(1-1/S)^N analytically over the declared slot values
//   share shift     total variation between proposal shares and train shares per closed slot (headline: worst slot)
//   executes        proposals that change a probe world through the effect host (checkEffect's runs check, PC16)
// Companion lines send the identity-predicted held-out items of each *_heldout module through the PSA26 runner.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fitGrammar, assemble} from '../src/procedural_grammar.js';
import {drawU32, address, indexFromU32} from '../src/gen_kit.js';
import {proposeEffects, checkEffect, worldLaws, fitCostCurve} from '../src/effect_checks.js';
import {landEffect} from '../src/effect_host.js';
import {composeSubstrate, createWorld} from '../src/world_substrate.js';
import {WORLD_QUANTITIES as WQ, WORLD_PROPERTIES as WP} from '../src/world_quantities.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DIALS = Object.freeze({
    foldSeed: 'canon-test', folds: 5, heldFold: 0, count: 200, levels: [0, 1], smoothing: 0,
    pairs: [['object', 'target'], ['object', 'time']], tuple: ['verb', 'object', 'target', 'time'],
    closedSlots: ['verb', 'object', 'target', 'time', 'carrier', 'cost'],
    targets: {pairSupport: 0.8, rediscoveryRatio: 2, shareShift: 0.25}, smallN: 8,
});

// ---- pure helpers (pinned by tests/generation_fit_report.test.js) ----
export const foldOf = (id, folds = DIALS.folds, seed = DIALS.foldSeed) => indexFromU32(drawU32(seed, address('fold', id)), folds);
export const round3 = x => Math.round(x * 1000) / 1000;
const asList = v => Array.isArray(v) ? v : [v];
export const tupleKey = (parts, slots = DIALS.tuple) => slots.map(s => String(parts[s])).join('|');
export function splitFold(rows, heldFold = DIALS.heldFold, folds = DIALS.folds) {
    return {train: rows.filter(r => foldOf(r.id, folds) !== heldFold), held: rows.filter(r => foldOf(r.id, folds) === heldFold)};
}
/** Chance that N uniform draws over a space of `size` combinations hit one given combination. */
export const uniformHit = (size, n) => size > 0 ? 1 - (1 - 1 / size) ** n : 0;
/** Total variation between two count maps, as shares. */
export function totalVariation(a, b) {
    const ta = Object.values(a).reduce((s, x) => s + x, 0), tb = Object.values(b).reduce((s, x) => s + x, 0);
    if (!ta || !tb) return null;
    return round3([...new Set([...Object.keys(a), ...Object.keys(b)])].reduce((s, k) => s + Math.abs((a[k] ?? 0) / ta - (b[k] ?? 0) / tb), 0) / 2);
}
const counts = values => values.reduce((m, v) => { m[v] = (m[v] ?? 0) + 1; return m; }, {});

export function pairSupport(generated, train, pairs = DIALS.pairs) {
    const combos = (parts, [a, b]) => asList(parts[a]).flatMap(x => asList(parts[b]).map(y => `${x}|${y}`));
    const seen = pairs.map(p => new Set(train.flatMap(r => combos(r.parts, p))));
    const unsupported = generated.filter(g => pairs.some((p, j) => combos(g, p).some(c => !seen[j].has(c))));
    const trainTuples = new Set(train.map(r => tupleKey(r.parts)));
    const copies = generated.filter(g => trainTuples.has(tupleKey(g))).length;
    return {items: generated.length, supported: generated.length - unsupported.length,
        rate: generated.length ? round3(1 - unsupported.length / generated.length) : null, copiesOfTrain: copies,
        copyRate: generated.length ? round3(copies / generated.length) : null};
}

/** Rediscovery of held-out tuples. `space` = combinations over the declared slot values. */
export function rediscovery(generated, held, train, space, n) {
    const reached = new Set(generated.map(g => tupleKey(g)));
    const trainTuples = new Set(train.map(r => tupleKey(r.parts)));
    const novel = held.filter(r => !trainTuples.has(tupleKey(r.parts)));
    const hit = rows => rows.filter(r => reached.has(tupleKey(r.parts))).length;
    const baseline = uniformHit(space, n);
    const rate = rows => rows.length ? round3(hit(rows) / rows.length) : null;
    const novelRate = rate(novel);
    return {held: held.length, hits: hit(held), rate: rate(held), novel: novel.length, novelHits: hit(novel), novelRate,
        baseline: round3(baseline), ratio: novelRate !== null && baseline > 0 ? round3(novelRate / baseline) : null, space, n};
}

export function shareShift(generated, train, slots = DIALS.closedSlots) {
    const per = {};
    for (const s of slots) {
        const t = counts(train.map(r => r.parts[s]).filter(v => v !== undefined)), g = counts(generated.map(p => p[s]).filter(v => v !== undefined));
        per[s] = totalVariation(g, t);
    }
    const vals = Object.entries(per).filter(([, v]) => v !== null).sort((a, b) => b[1] - a[1]);
    return {perSlot: per, worst: vals[0]?.[0] ?? null, worstValue: vals[0]?.[1] ?? null};
}

// ---- the probe world (the same shape tests/effect_host.test.js uses) ----
const vocabulary = {id: 'w.vocabulary', quantities: Object.values(WQ), properties: Object.values(WP)};
// A mind owner that hears any effect.transform.mind: a publish there is "answered", so mind effects pass
// by publishing, never by changing state. The report counts those apart (flag E2).
const mindOwner = {id: 'fit.mind-owner', reactors: [{id: 'listen', on: ['effect.transform.mind'], appliesTo: h => h.kind === 'place', react: () => []}]};
const rules = composeSubstrate({packs: [vocabulary, mindOwner]});
const hall = () => createWorld(rules, {clock: 0, holders: [
    {id: 'hall', kind: 'place', quantities: {temperature: 18, 'light:wand': 5, 'light:moon': 5}},
    {id: 'yard', kind: 'place'},
    {id: 'goblin', kind: 'body', place: 'hall', quantities: {vitality: 20}, properties: {alive: true}}]});
const probeDetails = {target: {shape: 'holder', id: 'goblin'}, place: 'hall', to: 'yard', amount: 2, minutes: 10};

export function executes(grammarFitted, generated, {keys, checks}) {
    const out = {n: generated.length, ran: 0, landed: 0, publishedOnly: 0, lookupOnly: 0, notBuilt: 0, failed: {}, mindPublishes: 0};
    for (const parts of generated) {
        const probe = {rules, world: hall(), keys, details: probeDetails, cause: 'generation-fit'};
        const check = checkEffect(grammarFitted, {id: 'fit', parts}, {...checks, probe}).checks.find(c => c.id === 'runs');
        if (!check.executed) { if (/lookup only/.test(check.reason)) out.lookupOnly++; else out.notBuilt++; continue; }
        let land;
        try { land = landEffect(rules, hall(), {sentence: parts, details: probeDetails}, {cause: 'generation-fit', keys}); } catch (error) { land = {status: `refused: ${error.message}`.slice(0, 60)}; }
        if (check.pass) {
            out.ran++;
            if (land.status === 'published') { out.publishedOnly++; if (parts.verb === 'transform' && parts.object === 'mind') out.mindPublishes++; } else out.landed++;
        } else out.failed[land.status] = (out.failed[land.status] ?? 0) + 1;
    }
    out.rate = out.n ? round3(out.ran / out.n) : null;
    out.landedRate = out.n ? round3(out.landed / out.n) : null;
    return out;
}

// ---- worlds ----
export async function loadWorlds() {
    const gu = await import('../src/world_packs/gu_effect_pack.js');
    const hp = await import('../src/world_packs/hp_effect_pack.js');
    const brew = await import('../src/world_packs/brew_effects_pack.js');
    const fx = await import('../tests/fixtures/procedural_grammar/effect_worlds.mjs');
    const rows = (list, label) => list.map(r => ({id: r.id, ...label(r)})).filter(r => r.parts).map(r => ({id: r.id, parts: r.parts}));
    return [
        {id: 'gu', title: 'Gu (effect sentences from the catalogue)', grammar: gu.guEffects, rows: rows(await gu.guEffectRows(), gu.labelGuEffect),
            keys: {essence: p => p.cost === 'essence-immortal' ? 'immortal' : 'primeval', light: 'moon'},
            traps: [
                ['label', 'T1 label read from the predicted field: labelGuEffect maps parts.function through GU_FUNCTION (src/world_packs/gu_effect_pack.js), so a held-out sentence is the author\'s function reading as a sentence; limits come from regexes over the scene text. Rediscovery here is partly the table reproducing itself.'],
                ['executes', 'E1 a probe world with one body and one place; a pass shows the sentence changes that world, not that it does what the Gu does. Gu verbs that need an essence reserve may read as probe gaps (see failed statuses).']]},
        {id: 'spells', title: 'Spells (Hogwarts spellbook leads)', grammar: hp.hpEffects, rows: rows(fx.hpEffectRows(), hp.labelHpEffect), keys: hp.HP_KEYS,
            traps: [
                ['label', 'T1 label read from the predicted field: labelHpEffect picks verb, object, target and time by regex over the row\'s own lead text (src/world_packs/hp_effect_pack.js), the text the sentence is said to describe. The pack\'s `intent` field also reproduces the truth sentence (src/spell_heldout.js header) and is never an input.'],
                ['executes', 'E1 a probe world with one body and one place; E2 a mind owner that answers any transform.mind publish, so mind effects pass by publishing.']]},
        {id: 'brews', title: 'Brews (Hogwarts potions, evidence-labelled)', grammar: brew.HP_POTION_EFFECTS,
            rows: brew.HP_POTION_SENTENCES.map(r => ({id: r.id, parts: r.parts})), keys: hp.HP_KEYS,
            traps: [
                ['label', 'T1 sentences are authored readings of paraphrased evidence rows (HP_POTION_SENTENCES); the potion family is read from the title (b_coverage_ledgers.mjs), and three titles were corrected after scoring (RULE_INFORMED in src/brew_heldout.js).'],
                ['executes', 'E1 probe world with one body; brews run through the spell keys (the brewing grammar declares none), so a needs-key count is a probe gap, not a brew failure.']]},
    ];
}

export function scoreWorld(world, {heldFold = DIALS.heldFold, count = DIALS.count, levels = DIALS.levels} = {}) {
    const {train, held} = splitFold(world.rows, heldFold);
    const fitted = fitGrammar(world.grammar, train, {smoothing: DIALS.smoothing});
    const space = DIALS.tuple.reduce((n, s) => n * (fitted.slots.find(x => x.id === s)?.values?.length ?? 1), 1);
    const checks = {laws: worldLaws(train.map(r => r.parts)), curve: fitCostCurve(train), words: {}, forbid: []};
    const result = {id: world.id, title: world.title, rows: world.rows.length, train: train.length, held: held.length,
        heldFold, smoothing: DIALS.smoothing, smallN: held.length < DIALS.smallN, levels: {}};
    for (const level of levels) {
        const gen = proposeEffects(fitted, train, {root: 'generation-fit', address: address('fit', world.id, level),
            cause: {kind: 'generation-fit', id: `${world.id}:${level}`}, novelty: {level, cause: 'generation fit report'}, count})
            .filter(c => assemble(fitted, c.parts).ok);
        const parts = gen.map(c => c.parts);
        result.levels[level] = {proposed: count, built: parts.length, pairSupport: pairSupport(parts, train), rediscovery: rediscovery(parts, held, train, space, count),
            shareShift: shareShift(parts, train), executes: executes(fitted, parts, {keys: world.keys, checks})};
    }
    result.traps = world.traps;
    return result;
}

// ---- companion: identity-predicted held-out items through the PSA26 runner (the *_heldout modules) ----
export async function heldoutCompanions() {
    const {runCaseData} = await import('./case_runner.mjs');
    const run = data => runCaseData(data, {id: 'held-out'});
    const out = {};
    try {
        const {guCatalogue} = await import('../src/gu_catalogue.js');
        const {splitGu, fitGu, scoreGu} = await import('../src/gu_heldout.js');
        const split = splitGu(Object.entries(guCatalogue)), score = scoreGu(split.heldOut, fitGu(split.tuned, guCatalogue), guCatalogue);
        out.gu = {heldOut: score.n, withAbility: score.withAbility, ran: score.ran, cannotRun: score.cannotRun,
            note: 'scoreGu builds a probe ability from the predicted class and runs it through resolveGuActivation; only kinds with an authored activation row can run'};
    } catch (e) { out.gu = {error: e.message}; }
    try {
        const {HP_SPELL_ROWS, HP_SPELL_WORLD, HP_SPELL_NAME_WORDS} = await import('../src/spell_pack_hogwarts.js');
        const {splitSpells, fitSpells, scoreSpells} = await import('../src/spell_heldout.js');
        const {executeSpellRows} = await import('../src/spell_heldout_cases.js');
        const blind = JSON.parse(fs.readFileSync(path.join(here, '..', 'docs/gm/dispatch/foundation-s-2026-11-12/evidence/blind_root_lexicon.json'), 'utf8'));
        const split = splitSpells(HP_SPELL_ROWS), fit = fitSpells(split.tuned, HP_SPELL_WORLD);
        const diag = scoreSpells(split.heldOut, fit, HP_SPELL_WORLD, {lexicon: {...blind.roots, ...blind.names}, nameWords: HP_SPELL_NAME_WORDS});
        const sentences = new Map(diag.rows.map(r => [r.id, r.sentenceValue]));
        const results = await executeSpellRows(split.heldOut, sentences, run);
        out.spells = {heldOut: split.heldOut.length, results: results.length, shape: Object.keys(results[0] ?? {}),
            note: 'executeSpellRows runs each predicted sentence through runCaseData and compares with the label in world terms'};
        out.spells.summary = summarizeEngine(results);
    } catch (e) { out.spells = {error: e.message}; }
    try {
        const {HP_POTION_SENTENCES, predictionHolds} = await import('../src/world_packs/brew_effects_pack.js');
        const {potionFamily, HP_POTION_FAMILY_OVERRIDES} = await import('./b_coverage_ledgers.mjs');
        const {splitLabelled, fitMechanisms, scoreHeldOut} = await import('../src/brew_heldout.js');
        const {executeRows} = await import('../src/brew_heldout_cases.js');
        const slug = t => t.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        const labelled = HP_POTION_SENTENCES.map(s => ({id: `hp.potion.${slug(s.title)}`, subject: s.subject, title: s.title, family: potionFamily(s.title), parts: s.parts, evidence: s.evidence}));
        const split = splitLabelled(labelled, {ruleSawTitles: Object.keys(HP_POTION_FAMILY_OVERRIDES)}), table = fitMechanisms(split.tuned);
        scoreHeldOut(split.heldOut, table, {beforeObject: predictionHolds});
        const results = await executeRows(split.heldOut, table, run);
        out.brews = {heldOut: split.heldOut.length, results: results.length, summary: summarizeEngine(results),
            note: 'executeRows runs each fitted mechanism as a brew dose case through runCaseData'};
    } catch (e) { out.brews = {error: e.message}; }
    return out;
}
// Tally every string-valued result column by value, so the report shows what the engine said without guessing field names.
function summarizeEngine(results) {
    const cols = {};
    for (const r of results) for (const [k, v] of Object.entries(r)) if (typeof v === 'string' && v.length < 40 && k !== 'id') { cols[k] ??= {}; cols[k][v.replace(/^cannot:.*/, 'cannot')] = (cols[k][v.replace(/^cannot:.*/, 'cannot')] ?? 0) + 1; }
    return cols;
}

export async function buildReport(opts = {}) {
    const worlds = await loadWorlds();
    return {schema: 'generation-fit@1', method: 'PC11 (docs/PROCEDURAL_CORE.md); PSA30', dials: {...DIALS, heldFold: opts.heldFold ?? DIALS.heldFold, count: opts.count ?? DIALS.count},
        worlds: worlds.map(w => scoreWorld(w, opts)), heldoutRunner: await heldoutCompanions()};
}

// ---- printing ----
const pct = x => x === null || x === undefined ? 'n/a' : `${Math.round(x * 1000) / 10}%`;
export function render(report) {
    const T = report.dials.targets, lines = [`Generation fit (PC11, PSA30): fold ${report.dials.heldFold} of ${report.dials.folds} held out and scored once; N=${report.dials.count} proposals per novelty level; smoothing ${report.dials.smoothing}`, ''];
    for (const w of report.worlds) {
        lines.push(`== ${w.id}: ${w.title}; ${w.rows} rows, ${w.train} train, ${w.held} held out${w.smallN ? ` (SMALL n: under ${report.dials.smallN} held-out rows, read counts not rates)` : ''}`);
        for (const [level, L] of Object.entries(w.levels)) {
            const p = L.pairSupport, r = L.rediscovery, s = L.shareShift, e = L.executes;
            lines.push(`  novelty ${level} (${L.built} of ${L.proposed} proposals assemble)`,
                `    pair support   ${pct(p.rate)} (${p.supported}/${p.items}; dial ${pct(T.pairSupport)}+)   copies of a train sentence ${pct(p.copyRate)}   [T3 smoothing ${w.smoothing}: pairs come from the generator's own fit]`,
                `    rediscovery    ${r.novelHits}/${r.novel} novel held-out tuples = ${pct(r.novelRate)} vs uniform ${pct(r.baseline)} (x${r.ratio ?? 'n/a'}; dial x${T.rediscoveryRatio}+); raw ${r.hits}/${r.held} = ${pct(r.rate)} counts train-seen tuples  [space ${r.space}]`,
                `    share shift    worst slot ${s.worst ?? 'n/a'} ${s.worstValue ?? 'n/a'} (dial ${T.shareShift} or less); ${Object.entries(s.perSlot).map(([k, v]) => `${k} ${v}`).join(', ')}`,
                `    executes       ${e.ran}/${e.n} = ${pct(e.rate)}: ${e.landed} changed the probe world, ${e.publishedOnly} published only (${e.mindPublishes} mind), lookup-only ${e.lookupOnly}${e.lookupOnly ? ' LOOKUP ONLY, not executed' : ''}, not built ${e.notBuilt}; failed ${JSON.stringify(Object.fromEntries(Object.entries(e.failed).map(([k, v]) => [k.replace('refused: World effects: ', '').slice(0, 34), v])))}`);
        }
        lines.push('  traps:', ...w.traps.map(([where, t]) => `    [${where}] ${t}`),
            '    [rediscovery] T4 a held-out sentence is a label, not a fresh observation; a tuple the train fold also holds is a copy, so the headline counts only tuples absent from train.', '');
    }
    lines.push('== runner-backed companion (the *_heldout modules, identity-predicted held-out items through runCaseData)');
    for (const [k, v] of Object.entries(report.heldoutRunner)) lines.push(`  ${k}: ${JSON.stringify(v)}`);
    return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2), arg = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : Number(args[i + 1]); };
    const report = await buildReport({heldFold: arg('--fold', DIALS.heldFold), count: arg('--count', DIALS.count)});
    if (args.includes('--write')) fs.writeFileSync(path.join(here, '..', 'docs/research/power-catalogues-2026-11-16/generation_fit_scores.json'), JSON.stringify(report, null, 1) + '\n');
    console.log(args.includes('--json') ? JSON.stringify(report, null, 1) : render(report));
}
