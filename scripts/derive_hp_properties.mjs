#!/usr/bin/env node
// PWC22: derived property sets for Hogwarts ingredients the books never state (docs/research/power-catalogues-2026-11-16).
// Deterministic, no model call. The rule is docs/coverage/hp_rules.json#hp.rule.recipe-carries-effect:
//   1. A potion's effect (its labelled sentence verb.object, else its family) names one axis of the Hogwarts property
//      set (src/hp_property_set.js). The map below is authored from the effect grammar, never fitted to ingredient labels.
//   2. An ingredient carries the axes of the potions it goes into. Support for an axis is the share of its potions with a
//      known effect that name it, discounted by how few such potions there are (one recipe is weak evidence).
//   3. The ingredient's own row counts too: the same thing in another form (dittany leaf, essence of dittany) at one
//      weight, other parts of the same source creature or plant (Dragon claw, Dragon blood) at a lower one, using only
//      axes a source states. A derived axis never chains from another derived set.
// Derived levels are capped at `some`: a derived set says an axis is present, not how much (amounts stay authored).
// Usage: node scripts/derive_hp_properties.mjs [--score]   (prints the held-out score; writes docs/coverage/hp_derived_score.json)
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {HP_AXIS_DOSE, HP_PROPERTY_MODULE, derivedCaseId} from '../src/hp_property_set.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = p => path.join(ROOT, p);
const readJson = p => JSON.parse(readFileSync(at(p), 'utf8'));

export const DERIVE_RULE = 'hp.rule.recipe-carries-effect';
export const DERIVE_TEST = 'tests/derive_hp_properties.test.js';

/** Authored dials (default, dial, reason). Same for every ingredient. */
export const DERIVE_DIALS = Object.freeze({
    minConfidence: 0.25,   // an axis below this is not emitted (a single weak recipe edge falls under 0.5 x cap)
    confidenceCap: 0.8,    // derived evidence never reaches stated-axis certainty
    someAt: 0.55,          // confidence for level `some`; below it the axis is `trace`. `strong` is never derived.
    formStemWeight: 0.55,  // same thing in another form of the same name
    sourceStemWeight: 0.3, // another part of the same creature or plant
    maxAxes: 2,
});

/** A potion's effect sentence (verb.object) to the one Hogwarts axis it moves. Sentences with no axis in the set are
 * left out on purpose (sound, light, position, force on things, time): the ingredient row then names the gap. */
export const EFFECT_AXIS = Object.freeze({
    'add.vitality': 'mend', 'remove.vitality': 'venom', 'block.vitality': 'ward', 'transform.form': 'form',
    'transform.mind': 'mind', 'remove.memory': 'memory', 'sense.information': 'conceal-or-sense', 'conceal.thing': 'conceal-or-sense',
    'conceal.light': 'conceal-or-sense', 'add.force': 'vigour', 'add.lifespan': 'vigour', 'add.heat': 'heat', 'block.heat': 'ward',
    'block.working': 'ward', 'end.working': 'ward', 'bind.thing': 'ward', 'bind.form': 'form', 'block.mind': 'calm', 'remove.force': 'calm',
});
/** When a potion has no sentence: its family (wiki-tier) to an axis. Body-door and target families name no axis. */
export const FAMILY_AXIS = Object.freeze({'mind-state': 'mind', 'body-form': 'form', 'conceal-or-sense': 'conceal-or-sense', 'luck-field': 'luck'});

const FORM_WORDS = new Set(['essence', 'of', 'powdered', 'root', 'leaf', 'leaves', 'oil', 'juice', 'dust', 'powder', 'extract', 'dried', 'fresh',
    'sliced', 'pickled', 'fluid', 'the', 's', 'spirit', 'plant', 'branch', 'seedpod']);
const NOT_MATERIAL = new Set(['potion', 'person', 'place', 'concept', 'other']);

const sha1 = s => createHash('sha1').update(s).digest()[0];
/** The frozen GKM429 split: held out when the first byte of sha1(id) is below 0x33. */
export const isHeldOut = id => sha1(id) < 0x33;

let cache;
function sources() {
    return cache ??= (() => {
        const wiki = readJson('docs/coverage/wiki_tier_labels.json');
        return {ingredients: wiki.hp_ingredients, potions: wiki.hp_potions, chapter: readJson('docs/coverage/chapter_tier_labels.json').hp_ingredients ?? {}};
    })();
}

/** Axes a source states for an ingredient (wiki tier, then chapter tier), as {axis: level}. */
export function statedAxes(id) {
    const {ingredients, chapter} = sources();
    const out = {};
    for (const a of [...(ingredients[id]?.axes ?? []), ...(chapter[id]?.axes ?? [])]) out[a.axis] = a.level;
    return out;
}
export const chapterStatedIds = () => Object.keys(sources().chapter).filter(id => sources().chapter[id].axes);

export function potionAxis(potionId) {
    const p = sources().potions[potionId];
    if (!p) return {axis: null, why: 'recipe-not-labelled'};
    if (p.sentence) {
        const key = `${p.sentence.verb}.${p.sentence.object}`;
        return EFFECT_AXIS[key] ? {axis: EFFECT_AXIS[key], by: `sentence ${key}`} : {axis: null, why: `effect-outside-axis-set:${key}`};
    }
    const fam = p.sentenceFamily ?? p.family;
    if (!fam) return {axis: null, why: 'recipe-effect-unknown'};
    return FAMILY_AXIS[fam] ? {axis: FAMILY_AXIS[fam], by: `family ${fam}`} : {axis: null, why: `effect-outside-axis-set:${fam}`};
}

const tokens = id => id.replace(/^hp\.ingredient\./, '').split('_').filter(Boolean);
const formStem = id => tokens(id).filter(t => !FORM_WORDS.has(t)).join('_');
const sourceStem = id => { const t = formStem(id).split('_'); return t.length > 1 ? t[0] : ''; };

/**
 * One ingredient's derived set from the graph and its own-row siblings.
 * `visible(id)` returns the stated axes a sibling may lend (a scoring run hides held-out rows there).
 */
export function deriveIngredient(id, visible = statedAxes) {
    const t = sources().ingredients[id];
    if (!t) return {id, block: 'no-recipe-edge', why: 'no wiki-tier row'};
    if (NOT_MATERIAL.has(t.kind)) return {id, block: 'not-material', why: `wiki-tier kind ${t.kind}`};
    const inputs = [], gaps = [];
    const known = [];
    for (const {potion} of t.potions ?? []) {
        const e = potionAxis(potion);
        if (e.axis) { known.push({potion, axis: e.axis}); inputs.push(`potion:${potion.replace(/^hp\.potion\./, '')}->${e.axis}`); } else gaps.push(e.why);
    }
    const conf = {};
    const k = known.length;
    if (k) {
        const byAxis = {};
        for (const {axis} of known) byAxis[axis] = (byAxis[axis] ?? 0) + 1;
        for (const [axis, n] of Object.entries(byAxis)) conf[axis] = (n / k) * (1 - 0.5 ** k);
    }
    // Own row: other forms and other parts of the same source, only where a source states their axes.
    const siblings = Object.keys(sources().ingredients).filter(o => o !== id && !NOT_MATERIAL.has(sources().ingredients[o].kind));
    const own = (pick, weight, label) => {
        const found = pick.map(o => ({o, ax: visible(o)})).filter(s => Object.keys(s.ax).length);
        if (!found.length) return;
        const votes = {};
        for (const s of found) for (const axis of Object.keys(s.ax)) votes[axis] = (votes[axis] ?? 0) + 1 / found.length;
        for (const [axis, share] of Object.entries(votes)) {
            conf[axis] = 1 - (1 - (conf[axis] ?? 0)) * (1 - weight * share);
            for (const s of found) if (s.ax[axis]) inputs.push(`${label}:${s.o.replace(/^hp\.ingredient\./, '')}->${axis}`);
        }
    };
    const fs = formStem(id), ss = sourceStem(id);
    if (fs) own(siblings.filter(o => formStem(o) === fs), DERIVE_DIALS.formStemWeight, 'form');
    if (ss) own(siblings.filter(o => formStem(o) !== fs && sourceStem(o) === ss), DERIVE_DIALS.sourceStemWeight, 'source');
    const ranked = Object.entries(conf).map(([axis, c]) => [axis, Math.min(c, 1) * DERIVE_DIALS.confidenceCap])
        .filter(([, c]) => c >= DERIVE_DIALS.minConfidence).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, DERIVE_DIALS.maxAxes);
    if (!ranked.length) {
        const block = !(t.potions ?? []).length && !inputs.length ? 'no-recipe-edge'
            : known.length || inputs.length ? 'derived-below-confidence'
                : /recipe-effect-unknown|recipe-not-labelled/.test(gaps.join()) ? 'recipe-effect-unknown' : 'effect-outside-axis-set';
        return {id, block, why: gaps.length ? [...new Set(gaps)].join('; ') : 'no recipe or same-source row states an effect', inputs};
    }
    const axes = ranked.map(([axis, c]) => ({axis, level: c >= DERIVE_DIALS.someAt ? 'some' : 'trace', confidence: Math.round(c * 100) / 100}));
    return {id, axes, inputs: [...new Set(inputs)], recipes: k, intersect: k > 1 && new Set(known.map(x => x.axis)).size === 1};
}

/** Derive every ingredient row still blocked on properties. Returns Map id -> result. */
export function deriveAll(ids) {
    return new Map(ids.map(id => [id, deriveIngredient(id)]));
}

/** The ledger hook: fills a `blocked:ingredient-properties` row from its derived set, or narrows its block. */
export function foldDerived(rows) {
    for (const row of rows) {
        if (row.state !== 'blocked:ingredient-properties') continue;
        const d = deriveIngredient(row.id);
        if (d.block) {
            row.state = `blocked:ingredient-${d.block}`;
            row.note += ` Derived tier (PWC22, ${DERIVE_RULE}): none; ${d.why}.`;
            continue;
        }
        const list = d.axes.map(a => `${a.axis} ${a.level} (${a.confidence})`).join(', ');
        const primary = HP_AXIS_DOSE[d.axes[0].axis];
        row.note += ` Derived tier (PWC22, ${DERIVE_RULE}, deterministic, unchecked against a source): ${list} from ${d.inputs.length} edge${d.inputs.length === 1 ? '' : 's'}${d.intersect ? ', the recipes agree' : ''}. A stated axis from a later wiki or chapter pass replaces it.`;
        // runs-derived needs a case module the game reaches from src/main.js; the property set is library-only today, so every derived row is expressed-derived and a dosed one names its test.
        row.state = 'expressed-derived';
        if (primary) row.test = DERIVE_TEST;
        row.mechanisms = [...new Set([...row.mechanisms, 'hp_property_set', ...(primary ? ['b.dose'] : [])])];
        row.case = {module: HP_PROPERTY_MODULE, id: derivedCaseId(d.axes)};
        row.derived = {rule: DERIVE_RULE, inputs: d.inputs};
    }
    return rows;
}

// ---------- score (frozen before the held-out axes were read) ----------

function scoreRun(targets, visible, label) {
    const base = baselineAxis();
    const stats = {label, n: targets.length, derived: 0, top: 0, any: 0, baseTop: 0, baseTopOnDerived: 0, candAny: 0, candN: 0, withEdges: 0, edgeTop: 0, edgeN: 0, misses: []};
    for (const id of targets) {
        const truth = Object.keys(statedAxes(id));
        const d = deriveIngredient(id, visible);
        const t = sources().ingredients[id];
        const hasEdge = (t.potions ?? []).some(p => potionAxis(p.potion).axis);
        if (hasEdge) stats.withEdges++;
        stats.baseTop += truth.includes(base) ? 1 : 0;
        if (t.axisCandidates) { stats.candN++; stats.candAny += t.axisCandidates.some(a => truth.includes(a)) ? 1 : 0; }
        if (d.block) continue;
        stats.derived++;
        stats.baseTopOnDerived += truth.includes(base) ? 1 : 0;
        const hit = truth.includes(d.axes[0].axis);
        stats.top += hit ? 1 : 0;
        stats.any += d.axes.some(a => truth.includes(a.axis)) ? 1 : 0;
        if (hasEdge) { stats.edgeN++; stats.edgeTop += hit ? 1 : 0; }
        if (!hit) stats.misses.push(`${id.replace('hp.ingredient.', '')}: derived ${d.axes.map(a => a.axis).join('+')} vs stated ${truth.join('+')}`);
    }
    return stats;
}
/** The majority baseline: the most common stated axis among training (not held-out) rows. */
function baselineAxis() {
    const counts = {};
    for (const id of Object.keys(sources().ingredients)) if (!isHeldOut(id)) for (const a of Object.keys(statedAxes(id))) counts[a] = (counts[a] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function scoreAll() {
    const {ingredients} = sources();
    const labelled = Object.keys(ingredients).filter(id => Object.keys(statedAxes(id)).length);
    const train = new Set(labelled.filter(id => !isHeldOut(id)));
    const heldOut = labelled.filter(isHeldOut);
    const chapterIds = chapterStatedIds();
    // Held-out run: siblings lend only training axes, and never a held-out row's own.
    const heldRun = scoreRun(heldOut, id => (train.has(id) ? statedAxes(id) : {}), 'held-out (sha1(id)[0] < 0x33), siblings lend training axes only');
    // Chapter line: the 13 chapter-stated rows, their axes hidden, siblings lend training axes minus those rows.
    const hide = new Set(chapterIds);
    const chapRun = scoreRun(chapterIds, id => (train.has(id) && !hide.has(id) ? statedAxes(id) : {}), 'the 13 chapter-stated rows hidden (siblings lend training axes minus these)');
    // Secondary, not held out: every labelled row, siblings lend all others. Larger n, same frozen rule.
    const looRun = (() => {
        const all = labelled.map(id => scoreRun([id], o => (o === id ? {} : statedAxes(o)), 'loo'));
        const sum = key => all.reduce((n, s) => n + s[key], 0);
        return {label: 'every labelled row, leave one out (not held out)', n: labelled.length, derived: sum('derived'), top: sum('top'), any: sum('any'), baseTop: sum('baseTop'),
            baseTopOnDerived: sum('baseTopOnDerived'), candAny: sum('candAny'), candN: sum('candN'), withEdges: sum('withEdges'), edgeTop: sum('edgeTop'), edgeN: sum('edgeN'), misses: []};
    })();
    return {baseline: baselineAxis(), rule: ruleHash(), heldRun, chapRun, looRun};
}

export function ruleHash() {
    return createHash('sha1').update(JSON.stringify([DERIVE_DIALS, EFFECT_AXIS, FAMILY_AXIS, [...FORM_WORDS]])).digest('hex').slice(0, 12);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (process.argv.includes('--score')) {
        const out = scoreAll();
        writeFileSync(at('docs/coverage/hp_derived_score.json'), `${JSON.stringify(out, null, 1)}\n`);
        for (const r of [out.heldRun, out.chapRun, out.looRun]) console.log(JSON.stringify({...r, misses: r.misses.length}));
        console.log(`baseline axis ${out.baseline}; rule ${out.rule}`);
    } else {
        const ids = Object.keys(sources().ingredients);
        const res = ids.map(id => deriveIngredient(id));
        const tally = {};
        for (const r of res) { const k = r.block ?? 'derived'; tally[k] = (tally[k] ?? 0) + 1; }
        console.log(JSON.stringify(tally));
    }
}
