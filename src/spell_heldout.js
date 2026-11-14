// Held-out scoring for Hogwarts spells (RUN.md "Then" and "Wave order"; PC72), the spell side of
// brew_heldout.js. Diagnostic, not an execution test: the spell grammar's identity rule predicts a
// row's effect sentence from identity alone, and the prediction is compared with the evidence-labelled
// truth. Outcome and targeting are scored separately. Pure functions; the report script passes in the
// rows, the world, the blind gloss file and the name words, so this module reads no script or doc.
//
// What the rule is. The pack's `intent` field reproduces the truth sentence for every row through
// sentenceFromIntent, so it is the label in disguise and is never an input here. The general rule is
// identity -> intent (inferIntent over roots and name words, a fit on the tuning rows plus the blind
// gloss lexicon) -> verb, object and direction from INTENT_LAW -> target and time from the tuning rows
// that share the intent (else all tuning rows), then the grammar's own checks (assemble). Family is
// never an input (familyWeight 0, as in effectLayerTest): it groups rows by effect.
import {fitGrammar, assemble} from './procedural_grammar.js';
import {defineSpellGrammar, inferIntent, labelSpellRow} from './spell_grammar.js';
import {INTENT_LAW, compareSentences} from './spell_effects.js';

/** The book's six spell families (the `family` field): one tuning row each. */
export const FAMILIES = Object.freeze(['move', 'defend', 'see', 'make', 'mind', 'access']);

export const SPLIT_RULE = 'Among rows whose label is evidence-backed (no effectSource naming an authored ruling or reading) and that are not in a reserved family, '
    + 'the first row by id in each of the six families is the tuning sample; every other evidence-labelled row is held out.';

/** A row's label is evidence-backed unless its effectSource says the sentence was an author's ruling or reading. */
export const isEvidenceLabelled = row => !/\bauthored\b/i.test(row.effectSource ?? '');

/** Fixed split. rows: the Hogwarts spell pack rows. Rows with an authored label are out of scope (the
 * label is not evidence); reserved-family rows (wandlight, corpus) are held out and never tune. */
export function splitSpells(rows) {
    const labelled = rows.filter(isEvidenceLabelled);
    const tuned = [];
    for (const family of FAMILIES) {
        const first = labelled.filter(r => r.family === family && !r.reserved).sort((a, b) => a.id.localeCompare(b.id))[0];
        if (first) tuned.push(first);
    }
    const tunedIds = new Set(tuned.map(r => r.id));
    return {tuned,
        heldOut: labelled.filter(r => !tunedIds.has(r.id)).sort((a, b) => a.id.localeCompare(b.id)),
        authoredLabel: rows.filter(r => !isEvidenceLabelled(r))};
}

/** Intents used by exactly one pack row: INTENT_LAW coined the entry for that row (EF2), so the law saw it.
 * They stay in the held-out count; a second score line leaves them out, as brew's RULE_INFORMED does. */
export function singletonIntentRows(rows) {
    const n = new Map();
    for (const r of rows) n.set(r.intent, (n.get(r.intent) ?? 0) + 1);
    return rows.filter(r => n.get(r.intent) === 1).map(r => r.id);
}

const grammar = defineSpellGrammar();
const mode = counts => Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? null;
const tally = (items, key) => items.reduce((m, x) => { m[x[key]] = (m[x[key]] ?? 0) + 1; return m; }, {});

/** Fit on the tuning rows only: the corpus the roots rule reads and the target and time defaults. */
export function fitSpells(tuned, world) {
    const labelled = tuned.map(r => ({row: r, ...labelSpellRow(r, world)})).filter(r => r.parts);
    return {labelled, fitted: fitGrammar(grammar, labelled.map(x => ({id: x.row.id, parts: x.parts})))};
}

/** The identity projection: the only fields a prediction may read. Intent, target, execution and truth
 * are dropped here, so changing them on a held-out row cannot change its prediction. */
export function identityOf(row, world, nameWords = {}) {
    const {parts} = labelSpellRow({...row, intent: 'x', target: 'object', execution: 'instant', truth: {verb: 'x'}}, world);
    const {roots, delivery, gesture, focus, attention, carrier, cost, access} = parts;
    return {known: {roots, delivery, gesture, focus, attention, carrier, cost, access}, identityRoots: [...roots, ...(nameWords[row.id] ?? [])]};
}

/** Predict one held-out row. Returns {intent, sentence, votes, built} (sentence null when nothing is predicted). */
export function predictSpell(row, fit, world, {lexicon = {}, nameWords = {}} = {}) {
    const {known, identityRoots} = identityOf(row, world, nameWords);
    const inferred = inferIntent(fit.fitted, {roots: identityRoots}, {lexicon});
    const scores = new Map(inferred.ranked);
    const top = [...scores.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0];
    const intent = top?.[0] ?? null;
    if (!intent) return {intent: null, sentence: null, votes: inferred.votes};
    const train = fit.labelled;
    const seen = train.filter(x => x.parts.intent === intent);
    const withIntent = seen.length ? seen : train;
    const targetVotes = {};
    for (const x of withIntent) targetVotes[x.parts.target] = (targetVotes[x.parts.target] ?? 0) + 1 / withIntent.length;
    for (const root of identityRoots) for (const t of lexicon[root]?.targets ?? []) targetVotes[t] = (targetVotes[t] ?? 0) + 1;
    const execution = mode(tally(withIntent.map(x => x.parts), 'execution'));
    const ranked = Object.entries(targetVotes).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([t]) => t);
    let built = null;
    for (const target of ranked) {
        const attempt = assemble(fit.fitted, {...known, intent, target, execution});
        if (attempt?.ok) { built = attempt; break; }
        built ??= attempt;
    }
    return {intent, sentence: built?.ok ? built.value.derived.sentence : null, votes: inferred.votes, rejected: built && !built.ok};
}

/** Phrases in a row's note that mark a field as authored, inferred or unreported by the author of the pack,
 * so a miss on it cannot be told from a defensible default. */
const DEFAULTED = /authored|inferred|infer |unreported|unrecorded|not given|not established|narrow|open|exact .* (is )?(not|unreported)/i;

/** Sort one miss. Categories: wrong rule, missing rule, missing data, undecidable default (a design choice).
 * "Missing mechanism" is the engine's (a label object with no world term), assigned in the cases module. */
export function sortMiss(row, pred, held) {
    const truth = row.truth;
    const law = pred.intent ? INTENT_LAW[pred.intent] : null;
    const vo = law && law.verb === truth.verb && law.object === truth.object;
    if (!pred.intent) {
        return {field: 'outcome', category: 'missing data', why: 'no blind gloss or tuning row names an intent for this identity'};
    }
    if (!vo) {
        const offered = new Set(pred.votes.map(v => v.intent));
        const trueOffered = offered.has(row.intent);
        return {field: 'outcome', category: 'wrong rule', why: trueOffered
            ? `intent ${pred.intent} outranked the true intent ${row.intent}`
            : `identity voted ${pred.intent}; no vote named the true intent ${row.intent}`};
    }
    const sentence = pred.sentence;
    const miss = sentence ? compareSentences(sentence, truth).map(m => m.field) : ['sentence'];
    const targetMiss = miss.includes('target'), timeMiss = miss.includes('time'), dirMiss = miss.includes('direction');
    if (targetMiss) return {field: 'targeting', category: DEFAULTED.test(row.note ?? '') ? 'undecidable default' : 'wrong rule',
        why: DEFAULTED.test(row.note ?? '') ? 'the row note marks the target as authored or inferred' : `target ${sentence?.target ?? 'none'} from the tuning rows, label ${truth.target}`};
    if (dirMiss) return {field: 'outcome', category: 'wrong rule', why: `direction ${sentence?.direction ?? 'none'} vs ${truth.direction ?? 'none'}`};
    if (timeMiss) return {field: 'time', category: DEFAULTED.test(row.note ?? '') ? 'undecidable default' : 'wrong rule',
        why: DEFAULTED.test(row.note ?? '') ? 'the row note marks the time as authored or inferred' : `time ${sentence?.time ?? 'none'} from the tuning rows, label ${truth.time}`};
    return null;
}

/** Score held-out rows. Outcome = verb, object and direction agree (what the intent law carries);
 * verb+object is kept as its own count so it compares with the GL2 leave-one-out number. Targeting =
 * target agrees. Time and whole sentence are extra lines. Every held-out row counts, predicted or not. */
export function scoreSpells(heldOut, fit, world, opts = {}) {
    const rows = heldOut.map(r => {
        const pred = predictSpell(r, fit, world, opts), s = pred.sentence, t = r.truth;
        const law = pred.intent ? INTENT_LAW[pred.intent] : null;
        const verbObject = Boolean(law && law.verb === t.verb && law.object === t.object);
        const outcome = verbObject && (law.direction ?? null) === (t.direction ?? null);
        const targeting = Boolean(s && s.target === t.target);
        const time = Boolean(s && s.time === t.time);
        const sentence = Boolean(s) && compareSentences(s, t).length === 0;
        const miss = outcome && targeting ? (time ? null : sortMiss(r, pred)) : sortMiss(r, pred);
        return {id: r.id, family: r.family, trueIntent: r.intent, intent: pred.intent, verbObject, outcome, targeting, time, sentence,
            predicted: s ? `${s.verb} ${s.object} ${s.target} ${s.time}${s.direction ? ' ' + s.direction : ''}` : 'none',
            actual: `${t.verb} ${t.object} ${t.target} ${t.time}${t.direction ? ' ' + t.direction : ''}`, miss, sentenceValue: s};
    });
    const n = rows.length, count = f => rows.filter(f).length;
    return {n, verbObject: count(r => r.verbObject), outcome: count(r => r.outcome), targeting: count(r => r.targeting), time: count(r => r.time),
        sentence: count(r => r.sentence), both: count(r => r.outcome && r.targeting), rows,
        misses: rows.filter(r => r.miss).sort((a, b) => a.id.localeCompare(b.id))};
}
