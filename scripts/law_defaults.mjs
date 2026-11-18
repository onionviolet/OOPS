#!/usr/bin/env node
// PSA28 dry run for the two laws field fill measured (area-field, form-transformation; proposal 2026-11-17).
// The first fill asked readers for six or four fields per row; text rarely states them, so only 0-5% of rows had every
// one, and the 84-93% with defaults was true by construction. This script redesigns the fields and tests the defaults:
//   1. A law reads a row's effect sentence (the "Effect verb.object/target/time" label, else a confirmed fill) and only the
//      few fields that change play. Everything else is a dial with a stated source, or is dropped.
//   2. Each derivation rule and each dial is scored on held-out rows against the majority baseline, with the verdict rule
//      of derivation_rules_backtest.mjs. Scores go in derivation_rules.json (this file exports them), not a new shape.
//   3. The dry-run take is `runCase` over the composed case, not a count: a row is taken when its case is expressed.
//   node scripts/law_defaults.mjs            print the report (field provenance, held-out scores, take)
//   node scripts/law_defaults.mjs --write    also write docs/coverage/fields/law_take.json
// No model calls are made; the fills it reads are docs/coverage/fields/<slug>.jsonl.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runCaseData} from './coverage_report.mjs';
import {AREA_TERMS, AREA_TIMES, areaCase, areaCaseId} from '../src/area_field_law.js';
import {FORM_VERBS, formCase, formCaseId} from '../src/form_transformation_law.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIELDS = slug => path.join(root, 'docs/coverage/fields', `${slug}.jsonl`);
const sha = s => createHash('sha1').update(s).digest('hex');
export const FLOOR = 10;
export const LAW_VERSION = 'law-defaults-v1';
/** Frozen before scoring: one fifth of rows by hash are held out; nothing is fitted on them. */
export const isTest = id => parseInt(sha(`split:${id}`).slice(0, 6), 16) % 5 === 0;

const RULE_SYS = ['ars_magica', 'blades_commercial', 'blades', 'brp', 'cypher', 'dnd5e_2014', 'dnd5e_planes', 'dnd_srd', 'eclipse_phase', 'fate', 'gurps', 'ironsworn', 'mm3e_commercial', 'mm3e', 'pf1'];
const KINDS = ['spells', 'powers', 'creatures', 'artifacts', 'items', 'conditions', 'places', 'rules', 'class_features'];
export const sysOf = l => RULE_SYS.find(s => l === s || l.startsWith(`${s}_`)) ?? l.split('_')[0];
export const kindOf = l => KINDS.find(k => l.endsWith(`_${k}`)) ?? 'other';

/**
 * The field specs. `read` fields come from the row (label or confirmed fill) and have no default: a row that does not state
 * them stays blocked, because they are what the power IS. `derive` fields come from another field by a scored rule. `dial`
 * fields have a default with a source and a world override. `drop` fields stay in the fill files but no law reads them.
 * Sources: `tabletop` (a rule several systems share), `rows` (the commonest value in the catalogue's own rows, fitted on
 * the development rows only), `design` (a plain design choice, named so).
 */
export const SPECS = {
    'area-field': {
        required: ['sentence', 'time', 'anchor', 'who'],
        fields: {
            sentence: {role: 'read', from: 'the label verb.object only; the confirmed `inside` was tried as a source (damage = remove.vitality, protect-or-heal = add.vitality) and lost to the majority baseline on held-out rows, so it is not used', reason: 'what the area does to what is inside it; without it nothing can be shown'},
            time: {role: 'derive', from: 'the label time; else the confirmed duration (rule area.time-from-duration)', default: 'sustained', source: 'rows: the commonest label time among area-field rows (see held-out)', reason: 'instant, held or lasting changes how many pulses land'},
            anchor: {role: 'dial', from: 'label target self or fill shape aura-on-holder = holder', default: 'place', source: 'rows: 87% of confirmed shapes are not an aura on the holder', reason: 'a fixed field stays; an aura goes where its holder goes'},
            who: {role: 'dial', from: 'fill affects: allies, enemies, chosen, holder = marked; everyone and terrain-or-objects = everyone', default: 'everyone', source: 'tabletop: an area effect hits everyone in it unless it names a choice (PF1 Area of Effect; D&D 5e Areas of Effect)', reason: 'a choice needs the caster to mark who counts'},
            ends: {role: 'derive', from: 'time (rule area.ends-from-time): instant = none, sustained = dismissed, lasting = timeout', reason: 'follows the time; not asked of the text'},
            shape: {role: 'drop', reason: 'a place is the world\'s unit; a cone and a sphere land on the same place'},
            size: {role: 'drop', reason: 'how big a place is belongs to the world, not the law'},
            stacking: {role: 'dial', default: 'separate', source: 'tabletop: same-named effects do not stack (PF1 Combining Magical Effects; D&D 5e Combining Magical Effects); bonus_stacking.js owns the rest', reason: 'read by the stacking owner, not the area law'},
            cost: {role: 'drop', reason: 'priced by the stored-working owner'},
            inside: {role: 'drop', reason: 'replaced by the sentence'},
            affects: {role: 'drop', reason: 'replaced by `who`'},
            duration: {role: 'drop', reason: 'replaced by `time`'},
        },
    },
    'form-transformation': {
        required: ['sentence', 'target', 'reversal'],
        fields: {
            sentence: {role: 'read', from: 'the label transform.form (or alter.form, the same change), else a confirmed change of body-or-species, looks-only, size or abilities-only', reason: 'a form change that is not one is another law'},
            target: {role: 'dial', from: 'label target self = holder, touched = other; fill target holder, willing-other or unwilling-other, object', default: 'holder', source: 'rows: 81% of confirmed targets are the holder', reason: 'who changes decides whom the working must reach'},
            reversal: {role: 'derive', from: 'the confirmed reversal; else the confirmed duration (rule form.reversal-from-duration, passes held-out). The label time was tried (rule form.reversal-from-time) and got 0 of 6 held-out right, so it is not used', default: 'at-will', source: 'rows: at-will is the commonest confirmed reversal on development rows; "none" was the first guess (a change stays) and lost on held-out rows (1 of 20 right)', reason: 'how it comes undone is what the player plays'},
            duration: {role: 'drop', reason: 'a timeout is a reversal with a clock; the clock is a dial'},
            abilities: {role: 'dial', default: 'follows the form', source: 'tabletop: a body-form change grants the new form\'s traits, a looks-only change does not (PF1 Alter Self versus Disguise Self)', reason: 'read by the packs that read `form`; the law sets the label'},
            change: {role: 'drop', reason: 'folded into the sentence'}, trigger: {role: 'drop', reason: 'the stored working\'s trigger'}, cost: {role: 'drop', reason: 'priced by the stored-working owner'}, limits: {role: 'drop', reason: 'authored per row where it matters'}, fits: {role: 'read', from: 'the verdict pass', reason: 'a row the fill reads as another effect stays blocked'},
        },
    },
};

const LABEL = /Effect ([a-z]+)\.([a-z]+)\/([a-z]+)(?:\/([a-z]+))?/;
export function factsOf(slug, ledgerRow, fill) {
    const m = ledgerRow.text?.match(LABEL);
    return {id: ledgerRow.id, filled: Boolean(fill), ledger: ledgerRow.ledger, kind: kindOf(ledgerRow.ledger), sys: sysOf(ledgerRow.ledger), f: fill?.f ?? {},
        label: m ? {verb: m[1], object: m[2], target: m[3], time: m[4] ?? null} : null};
}

// Rules (authored from what the sentence time and the fill values mean; the cross-tab of dev rows only checked them).
export const DURATION_TO_TIME = Object.freeze({instant: 'instant', 'until-ended': 'sustained', minutes: 'lasting', 'hours-days': 'lasting', permanent: 'lasting'});
export const ENDS_OF_TIME = Object.freeze({instant: 'none', sustained: 'dismissed', lasting: 'timeout'});
export const REVERSAL_OF_DURATION = Object.freeze({instant: 'none', permanent: 'none', 'until-ended': 'at-will', minutes: 'timeout', 'hours-days': 'timeout'});
export const REVERSAL_OF_TIME = Object.freeze({instant: 'none', sustained: 'at-will', lasting: 'timeout'});
const INSIDE_SENTENCE = Object.freeze({damage: {verb: 'remove', object: 'vitality'}, 'protect-or-heal': {verb: 'add', object: 'vitality'}});
const WHO_OF_AFFECTS = Object.freeze({everyone: 'everyone', 'terrain-or-objects': 'everyone', allies: 'marked', enemies: 'marked', chosen: 'marked', holder: 'marked'});
const FORM_CHANGE_OK = new Set(['body-or-species', 'looks-only', 'size', 'abilities-only']);
const FORM_TARGET = Object.freeze({holder: 'holder', 'willing-other': 'other', 'unwilling-other': 'other', object: 'object'});
const FORM_LABEL_TARGET = Object.freeze({self: 'holder', touched: 'other', bound: 'other', marked: 'other'});

/** Dials fitted on development rows only (the test fifth never contributes); the commonest label time by kind, else the slug's. */
export function fitDials(slug, facts) {
    const dev = facts.filter(x => !isTest(x.id)), mode = vals => { const c = {}; for (const v of vals) c[v] = (c[v] ?? 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0]; };
    if (slug === 'area-field') {
        const lab = dev.filter(x => AREA_TIMES.includes(x.label?.time));
        return {time: {all: mode(lab.map(x => x.label.time)), byKind: Object.fromEntries(KINDS.map(k => [k, mode(lab.filter(x => x.kind === k).map(x => x.label.time))]).filter(([, v]) => v))}};
    }
    return {reversal: {all: mode(dev.filter(x => x.f.reversal).map(x => x.f.reversal))}};
}

/** One row through the law: {case, provenance} when it composes, else {blocked, why}. A `provenance` value names where each field came from. */
export function compose(slug, x, dials) {
    const prov = {};
    if (slug === 'area-field') {
        if (x.f.fits === 'not-area') return {blocked: 'read as not an area effect', prov};
        let s = x.label && {verb: x.label.verb, object: x.label.object};
        if (s) prov.sentence = 'label';
        if (!s) return {blocked: 'no stated sentence', prov};
        let time = x.label?.time && AREA_TIMES.includes(x.label.time) ? x.label.time : null;
        if (time) prov.time = 'label';
        else if (x.label?.time) return {blocked: `time ${x.label.time} has no pulse model`, prov};
        else if (DURATION_TO_TIME[x.f.duration]) { time = DURATION_TO_TIME[x.f.duration]; prov.time = 'fill'; }
        else { time = dials.time.byKind[x.kind] ?? dials.time.all; prov.time = 'default'; }
        if (!AREA_TERMS[`${s.verb}.${s.object}`]) return {blocked: `${s.verb}.${s.object} has no world account`, prov};
        const aura = x.label?.target === 'self' || x.f.shape === 'aura-on-holder';
        prov.anchor = x.label || x.f.shape ? 'stated' : 'default';
        const who = WHO_OF_AFFECTS[x.f.affects] ?? 'everyone';
        prov.who = x.f.affects ? 'fill' : 'default';
        return {case: areaCaseId({...s, time}, aura ? 'holder' : 'place', who), prov};
    }
    if (x.f.fits === 'not-transform') return {blocked: 'read as not a form change', prov};
    let ok = x.label && FORM_VERBS.includes(x.label.verb) && x.label.object === 'form';
    if (ok) prov.sentence = 'label'; else if (!x.label && x.f.fits === 'transforms' && FORM_CHANGE_OK.has(x.f.change)) { ok = true; prov.sentence = 'fill'; }
    if (!ok) return {blocked: x.label ? `${x.label.verb}.${x.label.object} is another law` : 'no stated sentence', prov};
    if (x.label?.target === 'area' || x.f.target === 'area') return {blocked: 'a form change over an area waits for the area law to carry it', prov};
    const target = FORM_TARGET[x.f.target] ?? FORM_LABEL_TARGET[x.label?.target] ?? 'holder';
    prov.target = FORM_TARGET[x.f.target] || FORM_LABEL_TARGET[x.label?.target] ? 'stated' : 'default';
    let reversal = x.f.reversal, how = 'fill';
    if (!reversal) {
        if (REVERSAL_OF_DURATION[x.f.duration]) { reversal = REVERSAL_OF_DURATION[x.f.duration]; how = 'derived-duration'; }
        else { reversal = dials.reversal.all ?? 'at-will'; how = 'default'; }
    }
    prov.reversal = how;
    return {case: formCaseId(reversal, target), prov};
}

/** Frozen dials the ledger attach reads, so a rebuilt ledger equals the committed one. Fitted on development rows 2026-11-17; `fitDials` recomputes them for the report. */
export const FROZEN_DIALS = Object.freeze({'form-transformation': {reversal: {all: 'at-will'}}});
/** Every ledger row of the slug: still blocked on it, or already carrying the law's case (so a rerun after wiring keeps its denominator). */
export function slugRows(slug) {
    const dir = path.join(root, 'docs/coverage'), mod = slug === 'area-field' ? 'src/area_field_law.js' : 'src/form_transformation_law.js', out = [];
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl') && !['worlds.jsonl', 'interaction_oracle.jsonl'].includes(f)).sort())
        for (const r of readLines(path.join(dir, f))) if (r.state === `blocked:${slug}` || r.case?.module === mod) out.push({id: r.id, ledger: f.replace('.jsonl', ''), text: r.note});
    return out;
}
const readLines = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
export function load(slug) {
    const fills = Object.fromEntries(readLines(FIELDS(slug)).filter(r => r.kind === 'row').map(r => [r.id, r]));
    return slugRows(slug).map(r => factsOf(slug, r, fills[r.id]));
}

const rate = (k, n) => (n ? Math.round(1000 * k / n) / 1000 : null);
export const verdictOf = (n, exact, base) => n < FLOOR ? 'insufficient-held-out' : exact > base ? 'passes' : 'fails-baseline';

/** Held-out scoring. Each scorer says which test rows it applies to, what it predicts and what the stated truth is. */
export function scores(slug, facts, dials) {
    const dev = facts.filter(x => !isTest(x.id)), test = facts.filter(x => isTest(x.id));
    const mode = (rows, get) => { const c = {}; for (const r of rows) { const v = get(r); if (v != null) c[v] = (c[v] ?? 0) + 1; } return Object.entries(c).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0]; };
    const one = (id, mechanism, applies, truth, predict, baseOf, notes, extra = {}) => {
        const set = test.filter(x => applies(x) && truth(x) != null), base = baseOf(dev);
        const exact = set.filter(x => predict(x) === truth(x)).length, bExact = set.filter(x => base === truth(x)).length;
        const verdict = verdictOf(set.length, exact, bExact);
        return {id, mechanism, inputs: extra.inputs ?? [], version: LAW_VERSION, fit: extra.fit ?? 'none (authored from what the values mean)', split: 'sha1(split:id) mod 5 = 0 held out, frozen before scoring',
            baselineRule: `most common development value (${base})`, set: extra.set ?? 'held-out rows that state both the input and the truth', heldOutN: set.length, exact, withinBand: null,
            baseline: {name: `most common development value (${base})`, exact: bExact, withinBand: null}, allHeldOut: null, verdict,
            confidence: {exact: rate(exact, set.length), withinBand: null, n: set.length, verdict}, note: notes, proposed: true};
    };
    const out = [];
    if (slug === 'area-field') {
        const lt = x => AREA_TIMES.includes(x.label?.time) ? x.label.time : null;
        out.push(one('law.area-field.time-from-duration', 'Area time (instant, sustained, lasting) from the confirmed duration: instant, until-ended = sustained, minutes, hours-days, permanent = lasting',
            x => x.f.duration && lt(x), lt, x => DURATION_TO_TIME[x.f.duration], rows => mode(rows.filter(lt), lt), 'Truth is the Luna effect label time; the label is unchecked, so this measures agreement of two sources, not the label.', {inputs: ['confirmed duration']}));
        out.push(one('law.area-field.time-default', 'Area time default: the commonest label time of the row\'s kind (spell, power, creature, artifact ...), fitted on development rows',
            x => lt(x), lt, x => dials.time.byKind[x.kind] ?? dials.time.all, rows => mode(rows.filter(lt), lt), 'The default a row with no label time and no duration receives. A dial per world, not a fact.', {inputs: ['ledger kind'], fit: 'commonest label time per kind on development rows'}));
        out.push(one('law.area-field.sentence-from-inside', 'Area sentence from the confirmed inside: damage = remove.vitality, protect-or-heal = add.vitality',
            x => INSIDE_SENTENCE[x.f.inside] && x.label, x => `${x.label.verb}.${x.label.object}`, x => `${INSIDE_SENTENCE[x.f.inside].verb}.${INSIDE_SENTENCE[x.f.inside].object}`, rows => mode(rows.filter(r => r.label), r => `${r.label.verb}.${r.label.object}`),
            'Truth is the label sentence, which the same readers wrote.', {inputs: ['confirmed inside']}));
        out.push(one('law.area-field.ends-from-time', 'Area ends from time: instant = none, sustained = dismissed, lasting = timeout',
            x => lt(x) && x.f.ends, x => x.f.ends === 'never' ? 'none' : ['timeout', 'dismissed'].includes(x.f.ends) ? x.f.ends : null, x => ENDS_OF_TIME[lt(x)], rows => mode(rows.filter(r => r.f.ends), r => r.f.ends === 'never' ? 'none' : ['timeout', 'dismissed'].includes(r.f.ends) ? r.f.ends : null),
            'Truth is the confirmed ends (removed-by-counter and source-lost are left out: the law has no counter model for an area yet).', {inputs: ['label time']}));
    } else {
        const rv = x => x.f.reversal;
        const isForm = x => (FORM_VERBS.includes(x.label.verb) && x.label.object === 'form') ? 'form' : 'other';
        out.push(one('law.form-transformation.sentence-from-change', 'A confirmed change of body-or-species, looks-only, size or abilities-only is a form sentence (the route for rows with no label)',
            x => x.label && x.f.change && FORM_CHANGE_OK.has(x.f.change), isForm, () => 'form', rows => mode(rows.filter(r => r.label && r.f.change && FORM_CHANGE_OK.has(r.f.change)), isForm), 'Truth is the label sentence. Prediction and baseline agree when most such rows are form labels; the rule earns its place only if it beats a no-route baseline of "other".', {inputs: ['confirmed change']}));
        out.push(one('law.form-transformation.reversal-from-duration', 'Form reversal from the confirmed duration: instant, permanent = none; until-ended = at-will; minutes, hours-days = timeout',
            x => REVERSAL_OF_DURATION[x.f.duration] && rv(x), rv, x => REVERSAL_OF_DURATION[x.f.duration], rows => mode(rows.filter(rv), rv), 'Truth is the confirmed reversal. Counter-effects are never predicted: no duration implies one.', {inputs: ['confirmed duration']}));
        out.push(one('law.form-transformation.reversal-from-time', 'Form reversal from the label time: instant = none, sustained = at-will, lasting = timeout',
            x => REVERSAL_OF_TIME[x.label?.time] && rv(x), rv, x => REVERSAL_OF_TIME[x.label.time], rows => mode(rows.filter(rv), rv), 'Truth is the confirmed reversal.', {inputs: ['label time']}));
        out.push(one('law.form-transformation.reversal-default', 'Form reversal default: the commonest development reversal (at-will)',
            x => rv(x), rv, () => dials.reversal.all, rows => mode(rows.filter(rv), rv), 'The default a row with no stated reversal, duration or label time receives.', {inputs: []}));
        out.push(one('law.form-transformation.target-from-label', 'Form target from the label target: self = holder, touched = other',
            x => FORM_LABEL_TARGET[x.label?.target] && x.f.target && FORM_TARGET[x.f.target], x => FORM_TARGET[x.f.target], x => FORM_LABEL_TARGET[x.label.target], rows => mode(rows.filter(r => r.f.target), r => FORM_TARGET[r.f.target]), 'Truth is the confirmed fill target.', {inputs: ['label target']}));
    }
    return out;
}

/** Run every distinct composed case once; a row is taken when its case is expressed. */
export async function take(slug, facts, dials) {
    const memo = new Map(), rows = [], blockedWhy = {};
    for (const x of facts) {
        const c = compose(slug, x, dials);
        if (!c.case) { blockedWhy[c.blocked] = (blockedWhy[c.blocked] ?? 0) + 1; rows.push({id: x.id, state: 'catalogued', detail: c.blocked, basis: null, confidence: null, take: false, prov: c.prov}); continue; }
        if (!memo.has(c.case)) { const data = (slug === 'area-field' ? areaCase : formCase)(c.case); memo.set(c.case, await runCaseData(data, {id: c.case})); }
        const out = memo.get(c.case), taken = /^(expressed|runs)-/.test(out.state);
        if (!taken) blockedWhy[`case ${out.state}`] = (blockedWhy[`case ${out.state}`] ?? 0) + 1;
        rows.push({id: x.id, state: out.state, detail: c.case, basis: out.basis ?? 'authored', confidence: null, take: taken, prov: c.prov, test: isTest(x.id)});
    }
    return {rows, blockedWhy, cases: memo.size};
}

/** Provenance of the taken rows: how many leaned on a default for a required field (true by construction when most do). */
export function leaning(slug, rows) {
    const taken = rows.filter(r => r.take), req = SPECS[slug].required;
    const stated = r => req.filter(k => r.prov[k] && r.prov[k] !== 'default');
    const nDefault = r => req.filter(k => r.prov[k] === 'default').length;
    return {taken: taken.length, noDefault: taken.filter(r => nDefault(r) === 0).length, oneDefault: taken.filter(r => nDefault(r) === 1).length, twoPlus: taken.filter(r => nDefault(r) >= 2).length,
        byField: Object.fromEntries(req.map(k => [k, Object.fromEntries(Object.entries(taken.reduce((c, r) => { const v = r.prov[k] ?? 'none'; c[v] = (c[v] ?? 0) + 1; return c; }, {})))])), statedSample: taken.length ? stated(taken[0]).length : 0};
}

/** The score rows both laws add to derivation_rules.json (written there by derivation_rules_backtest.mjs). */
export function scoreRows() {
    return Object.keys(SPECS).flatMap(slug => { const facts = scoringFacts(slug); return scores(slug, facts, fitDials(slug, facts)); });
}
/** Scoring and dial fitting use only the rows the fill files cover, so a ledger that gains rows later does not move a written score. */
export const scoringFacts = slug => load(slug).filter(x => x.filled);

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    const summary = {version: LAW_VERSION, split: 'sha1(split:id) mod 5 = 0 held out', slugs: {}};
    for (const slug of Object.keys(SPECS)) {
        const facts = load(slug), dials = fitDials(slug, scoringFacts(slug)), run = await take(slug, facts, dials), n = facts.length, t = run.rows.filter(r => r.take).length;
        const heldOut = run.rows.filter(r => r.test);
        const sc = scores(slug, scoringFacts(slug), dials), lean = leaning(slug, run.rows), pct = x => `${(100 * x).toFixed(1)}%`;
        const labelled = facts.filter(f => f.label).length;
        summary.slugs[slug] = {rows: n, labelled, taken: t, takeRate: rate(t, n), distinctCases: run.cases, blocked: run.blockedWhy, dials, leaning: lean, heldOutTake: {n: heldOut.length, taken: heldOut.filter(r => r.take).length},
            scores: sc.map(s => ({id: s.id, n: s.heldOutN, exact: s.exact, baseline: s.baseline.exact, verdict: s.verdict}))};
        console.log(`\n## ${slug}: ${n} blocked rows, ${labelled} with an effect label`);
        console.log(`dry-run take ${t} (${pct(t / n)}) through ${run.cases} distinct cases; held-out fifth ${summary.slugs[slug].heldOutTake.taken} of ${heldOut.length}`);
        console.log('taken rows needing 0 / 1 / 2+ defaults for a required field:', lean.noDefault, lean.oneDefault, lean.twoPlus);
        console.log('blocked because:', JSON.stringify(run.blockedWhy));
        console.log('dials:', JSON.stringify(dials));
        for (const s of sc) console.log(`${s.verdict.padEnd(22)} ${s.id.padEnd(48)} n=${String(s.heldOutN).padStart(3)} rule ${s.exact} baseline ${s.baseline.exact}`);
    }
    if (process.argv.includes('--write')) fs.writeFileSync(path.join(root, 'docs/coverage/fields/law_take.json'), `${JSON.stringify(summary, null, 1)}\n`);
}
