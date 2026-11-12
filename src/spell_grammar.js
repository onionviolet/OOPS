// Spell grammar of parts (chat S, SG1-SG9) on chat P's grammar contract
// (docs/PROCEDURAL_GRAMMAR_CONTRACT.md). A spell is intent, roots, target,
// delivery, gesture, execution, carrier, cost and access. The derive rule turns
// those parts into an effect sentence through the intent law (spell_effects.js),
// so canon spells, beyond-canon spells and other worlds' spells all run the same
// path (PFP16, PFP17). Names no world; world packs supply rows and dials (PFP3).
import {defineGrammar} from './procedural_grammar.js';
import {address, drawU32, indexFromU32} from './gen_kit.js';
import {spellComponents} from './spell_depth.js';
import {INTENTS, INTENT_LAW, EFFECT_TARGETS, EFFECT_CARRIERS, EFFECT_COSTS, EXECUTION_TIME, sentenceFromIntent, compareSentences} from './spell_effects.js';

// Which account a carrier pays from by default (a list: a cantrip spends no slot). Dial: a world (or a transfer,
// NV3) can pay a carrier from another account; the check flags it, never rejects.
export const CARRIER_COST = Object.freeze({wand: 'stamina', attuned_mana: 'mana', spell_slot: ['slot', 'none'], ritual: 'spirituality',
    ability: 'spirituality', gu: 'essence', potion: 'material', item: 'none'});

// Verbs that can act on a running effect. Default from canon: ending, removing,
// blocking or sensing an effect. Reason: an effect has no position, size or mind.
const EFFECT_VERBS_ON_EFFECTS = new Set(['end', 'remove', 'block', 'sense', 'copy', 'conceal']);
const LIVING_OBJECTS = new Set(['mind', 'mood', 'memory', 'pain', 'vitality', 'voice', 'sight']);

export function defineSpellGrammar({id = 'spell', revision = 4, dials = {}} = {}) {
    return defineGrammar({
        id, revision, dials: {carrierCostStrict: false, mindedObjects: false, ...dials},
        slots: [
            {id: 'intent', type: 'one', values: INTENTS},
            {id: 'roots', type: 'tokens', open: true, min: 0, max: 6, given: 'intent'},
            {id: 'target', type: 'one', values: EFFECT_TARGETS, given: 'intent'},
            {id: 'execution', type: 'one', values: Object.keys(EXECUTION_TIME)},
            {id: 'delivery', type: 'one', open: true},
            {id: 'gesture', type: 'one', open: true},
            // SPD1: focus (wand, staff, talisman, none) and attention are their own parts (revision 4).
            {id: 'focus', type: 'one', open: true},
            {id: 'attention', type: 'one', open: true},
            {id: 'carrier', type: 'one', values: EFFECT_CARRIERS},
            {id: 'cost', type: 'one', values: EFFECT_COSTS},
            {id: 'access', type: 'one', open: true},
        ],
        rules: [
            {id: 'sentence', kind: 'derive', reads: ['intent', 'target', 'execution', 'carrier', 'cost'],
                default: 'The intent law turns will, target and execution into an effect sentence.',
                reason: 'Roots and gestures are clues; what the caster wills decides what happens (vocabulary research, section V3).',
                run: ({parts}) => {
                    try { return {sentence: sentenceFromIntent(parts)}; }
                    catch (error) { return {sentenceError: error.message}; }
                }},
            {id: 'components', kind: 'derive', reads: ['delivery', 'gesture', 'focus', 'attention'],
                default: 'Incantation, gesture, focus and attention are separate; a skipped one raises the cost and lowers reliability (SPD1).',
                reason: 'Wordless and wandless casting are harder, not forbidden (canon nonverbal lessons). Unrecorded parts cost nothing.',
                run: ({parts}) => ({components: spellComponents(parts)})},
            {id: 'sentence-runs', kind: 'check', default: 'A spell needs a sentence the effect law can run.',
                reason: 'Generated means runnable (PFP16).',
                run: ({derived}) => derived.sentence ? null : {reason: derived.sentenceError ?? 'no sentence'}},
            {id: 'target-fits-verb', kind: 'check', default: 'A running effect is a target only for verbs that end, remove, block, sense, copy or hide it.',
                reason: 'An effect has no position, size or mind to change (canon: Finite, Nox, Liberacorpus).',
                run: ({derived}) => derived.sentence?.target === 'effect' && !EFFECT_VERBS_ON_EFFECTS.has(derived.sentence.verb)
                    ? {reason: `${derived.sentence.verb} cannot act on a running effect`} : null},
            {id: 'living-target', kind: 'check', dial: 'mindedObjects',
                default: 'Mind, mood, memory, pain, vitality, voice and sight belong to a living target (creature, body or self).',
                reason: 'A board has no mind to stun (properties, not categories: PFP22). Dial: a world where things have minds sets mindedObjects.',
                run: ({derived, dials}) => {
                    const s = derived.sentence;
                    if (!s || dials.mindedObjects) return null;
                    const needsLife = LIVING_OBJECTS.has(s.object) || s.direction === 'mind';
                    return needsLife && !['creature', 'body', 'self', 'area'].includes(s.target) ? {reason: `${s.object} needs a living target, not a ${s.target}`} : null;
                }},
            {id: 'carrier-pays', kind: 'check', severity: 'flag', dial: 'carrierCostStrict',
                default: 'Each carrier pays from its usual account (wand: stamina, attuned mana: mana, spell slot: slot, Gu: essence).',
                reason: 'A transfer between worlds (NV3) may pay differently; that is allowed and shown, not refused (AD56).',
                run: ({parts}) => {
                    const usual = [CARRIER_COST[parts.carrier] ?? []].flat();
                    return usual.length && !usual.includes(parts.cost) ? {reason: `${parts.carrier} usually pays with ${usual.join(' or ')}, not ${parts.cost}`} : null;
                }},
        ],
        fallback: {id: 'fallback.light', parts: {intent: 'light', roots: [], target: 'implement', execution: 'sustained',
            delivery: 'spoken', gesture: 'unrecorded', focus: 'wand', attention: 'unrecorded', carrier: 'wand', cost: 'stamina', access: 'taught'}},
    });
}

// A world pack row -> grammar parts and truth (PGC11: labelling is the domain's).
export function labelSpellRow(row, world) {
    const missing = ['intent', 'target', 'execution'].filter(k => !row[k]);
    if (!row.truth) missing.push('truth');
    if (missing.length) return {missing};
    return {parts: {intent: row.intent, roots: row.roots ?? [], target: row.target, execution: row.execution,
        delivery: row.delivery ?? 'unrecorded', gesture: row.gesture ?? 'unrecorded',
        focus: row.focus ?? world.focus ?? 'unrecorded', attention: row.attention ?? 'unrecorded',
        carrier: row.carrier ?? world.carrier, cost: row.cost ?? world.cost, access: row.access ?? world.access}, truth: row.truth};
}

export const compareSpell = (value, truth) => value.derived.sentence ? compareSentences(value.derived.sentence, truth)
    : [{field: 'sentence', expected: 'runs', got: value.derived.sentenceError ?? null}];

// Names come last (EF5, NMR). A generated incantation joins its roots with an
// ending drawn by address (GR2). Collisions with canon forms are reported, not renamed.
const ENDINGS = ['o', 'us', 'um', 'a', 'io', 'endo'];
export function incantationName(roots, {root = 'spell-name', at = 'name', canonForms = []} = {}) {
    if (!roots.length) return null;
    const end = ENDINGS[indexFromU32(drawU32(root, address('ending', at, roots.join('.'))), ENDINGS.length)];
    const words = roots.length > 1 ? [roots.slice(0, -1).join(''), roots.at(-1) + end] : [roots[0] + end];
    const name = words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    const canon = new Set(canonForms.map(f => f.toLowerCase()));
    return {name, collides: canon.has(name.toLowerCase())};
}

export const intentLaw = intent => INTENT_LAW[intent] ?? null;

// Intent from roots (revision 2, added after the canon test). Evidence order:
// roots seen with an intent in the fitted corpus, then the world's root lexicon
// (source-language glosses; dictionary inference, SKR3, never proof that a root
// works), then whether the corpus shows the intent with this target (tiebreak).
// Dials: lexiconWeight (default 1) and targetWeight (default 0.25).
export function inferIntent(fitted, parts, {lexicon = {}, lexiconWeight = 1, targetWeight = 0.25} = {}) {
    const rootsGiven = fitted.weights.roots.given ?? {}, targetGiven = fitted.weights.target.given ?? {};
    const scores = new Map(), votes = [];
    const add = (intent, n, why) => { scores.set(intent, (scores.get(intent) ?? 0) + n); votes.push({intent, n, why}); };
    for (const root of parts.roots ?? []) {
        const seen = Object.entries(rootsGiven).filter(([, counts]) => counts[root]);
        const total = seen.reduce((n, [, counts]) => n + counts[root], 0);
        for (const [intent, counts] of seen) add(intent, counts[root] / total, `root ${root} in corpus`);
        for (const intent of lexicon[root]?.intents ?? []) add(intent, lexiconWeight, `root ${root}: ${lexicon[root].gloss}`);
    }
    for (const intent of scores.keys()) if (targetGiven[intent]?.[parts.target]) add(intent, targetWeight, `corpus shows ${intent} on ${parts.target}`);
    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    return {best: ranked[0]?.[0] ?? null, ranked: ranked.slice(0, 5), votes};
}

// The canon rebuild from roots (the honest form of PFP17 for spells): hide the
// intent, infer it from roots (and the lexicon, if given), derive the sentence and
// compare it to the canon truth. Leave one out over the rows.
export function rootRebuild(grammar, rows, world, {lexicon = {}, fitGrammar, assemble} = {}) {
    const labelled = rows.map(r => ({row: r, ...labelSpellRow(r, world)})).filter(r => r.parts);
    let inferred = 0, rebuilt = 0;
    const misses = [];
    for (const {row, parts, truth} of labelled) {
        const fitted = fitGrammar(grammar, labelled.filter(x => x.row.id !== row.id).map(x => ({id: x.row.id, parts: x.parts})));
        const guess = inferIntent(fitted, parts, {lexicon}).best;
        if (guess === parts.intent) inferred++;
        const built = guess ? assemble(fitted, {...parts, intent: guess}) : null;
        if (built?.ok && !compareSpell(built.value, truth).length) rebuilt++;
        else misses.push(row.id);
    }
    return {rows: labelled.length, inferred, rebuilt, misses};
}

// SPD1: a recorded gesture or focus is identity evidence beside the words (a swish
// and flick lifts), so it joins the roots as a `gesture:` or `focus:` token on both
// the training and the held-out side. The world's usual focus says nothing.
const withMarks = (parts, world, on = true) => !on ? parts : ({...parts, roots: [...(parts.roots ?? []),
    ...['gesture', 'focus'].filter(k => parts[k] && !['unrecorded', 'none', world.focus].includes(parts[k])).map(k => `${k}:${parts[k]}`)]});

// GL2 effect-layer canon test (plan "Grammar layers"): hold out the whole effect
// (intent, target, execution) and predict it from identity (family, roots) plus
// the world's lexicon; derive the sentence; compare with the recorded truth.
// Leave one out. Misses are grouped by the first field that went wrong, each a
// named missing rule. Dials: familyWeight (default 0: a family prior lowered
// verb and object hits in the 2026-11-12 run), components (default off: recorded gesture and focus
// as identity tokens gained nothing on 80 rows, 40 with a gesture, 2026-11-12; SPD1) and the lexicon weight. A gloss may
// carry `targets` (a noun root such as corpus votes for a body target).
export function effectLayerTest(grammar, rows, world, {lexicon = {}, nameWords = {}, familyWeight = 0, components = false, fitGrammar, assemble} = {}) {
    const labelled = rows.map(r => ({row: r, ...labelSpellRow(r, world)})).filter(r => r.parts);
    const misses = {}, fields = {verbObject: 0, sentence: 0};
    const most = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? null;
    for (const {row, parts, truth} of labelled) {
        const train = labelled.filter(x => x.row.id !== row.id);
        const fitted = fitGrammar(grammar, train.map(x => ({id: x.row.id, parts: withMarks(x.parts, world, components)})));
        // Project the held-out row onto known inputs before inference or assembly.
        const {roots, delivery, gesture, focus, attention, carrier, cost, access} = parts;
        const known = {roots, delivery, gesture, focus, attention, carrier, cost, access};
        const identity = {roots: [...withMarks(known, world, components).roots, ...(nameWords[row.id] ?? [])]};
        const scores = new Map((inferIntent(fitted, identity, {lexicon}).ranked ?? []).map(([k, v]) => [k, v]));
        const family = {};
        for (const x of train) if (x.row.family === row.family) family[x.parts.intent] = (family[x.parts.intent] ?? 0) + 1;
        const familyTotal = Object.values(family).reduce((n, c) => n + c, 0);
        if (familyWeight > 0) for (const [intent, c] of Object.entries(family)) scores.set(intent, (scores.get(intent) ?? 0) + familyWeight * c / familyTotal);
        const top = [...scores.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0];
        const intent = top?.[0] ?? null;
        // An intent the rest of the corpus never shows falls back to the whole corpus for target and time.
        const seen = train.filter(x => x.parts.intent === intent);
        const withIntent = seen.length ? seen : train;
        const targetVotes = Object.fromEntries(withIntent.reduce((m, x) => m.set(x.parts.target, (m.get(x.parts.target) ?? 0) + 1 / withIntent.length), new Map()));
        for (const root of identity.roots) for (const t of lexicon[root]?.targets ?? []) targetVotes[t] = (targetVotes[t] ?? 0) + 1;
        const execution = most(Object.fromEntries(withIntent.reduce((m, x) => m.set(x.parts.execution, (m.get(x.parts.execution) ?? 0) + 1), new Map())));
        // The world's laws join the prediction: take the best-voted target the grammar's rules accept.
        const ranked = Object.entries(targetVotes).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([t]) => t);
        let built = null;
        for (const target of ranked) {
            const attempt = intent && execution ? assemble(fitted, {...known, intent, target, execution}) : null;
            if (attempt?.ok) { built = attempt; break; }
            built ??= attempt;
        }
        const got = built?.ok ? built.value.derived.sentence : null;
        const law = intent ? INTENT_LAW[intent] : null;
        const vo = law && law.verb === truth.verb && law.object === truth.object;
        const mismatch = got ? compareSentences(got, truth) : [{field: 'sentence'}];
        if (vo) fields.verbObject++;
        if (!mismatch.length) { fields.sentence++; continue; }
        const rule = !intent ? 'no-identity-evidence' : !vo ? 'intent-from-identity' : !got ? 'target-rejected-by-law'
            : mismatch[0].field === 'target' ? 'target-from-intent' : mismatch[0].field === 'time' ? 'time-from-intent' : `field-${mismatch[0].field}`;
        (misses[rule] ??= []).push(row.id);
    }
    const n = labelled.length, pct = x => Math.round(x / n * 1000) / 10;
    return {rows: n, verbObject: fields.verbObject, sentence: fields.sentence, verbObjectRate: pct(fields.verbObject), sentenceRate: pct(fields.sentence),
        missingRules: Object.entries(misses).map(([rule, ids]) => ({rule, count: ids.length, examples: ids.slice(0, 6), ids})).sort((a, b) => b.count - a.count)};
}
