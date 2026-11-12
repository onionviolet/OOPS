// Spell grammar of parts (chat S, SG1-SG9) on chat P's grammar contract
// (docs/PROCEDURAL_GRAMMAR_CONTRACT.md). A spell is intent, roots, target,
// delivery, gesture, execution, carrier, cost and access. The derive rule turns
// those parts into an effect sentence through the intent law (spell_effects.js),
// so canon spells, beyond-canon spells and other worlds' spells all run the same
// path (PFP16, PFP17). Names no world; world packs supply rows and dials (PFP3).
import {defineGrammar} from './procedural_grammar.js';
import {address, drawU32, indexFromU32} from './gen_kit.js';
import {INTENTS, INTENT_LAW, EFFECT_TARGETS, EFFECT_CARRIERS, EFFECT_COSTS, EXECUTION_TIME, sentenceFromIntent, compareSentences} from './spell_effects.js';

// Which account a carrier pays from by default (a list: a cantrip spends no slot). Dial: a world (or a transfer,
// NV3) can pay a carrier from another account; the check flags it, never rejects.
export const CARRIER_COST = Object.freeze({wand: 'stamina', attuned_mana: 'mana', spell_slot: ['slot', 'none'], ritual: 'spirituality',
    ability: 'spirituality', gu: 'essence', potion: 'material', item: 'none'});

// Verbs that can act on a running effect. Default from canon: ending, removing,
// blocking or sensing an effect. Reason: an effect has no position, size or mind.
const EFFECT_VERBS_ON_EFFECTS = new Set(['end', 'remove', 'block', 'sense', 'copy', 'conceal']);
const LIVING_OBJECTS = new Set(['mind', 'mood', 'memory', 'pain', 'vitality', 'voice', 'sight']);

export function defineSpellGrammar({id = 'spell', revision = 3, dials = {}} = {}) {
    return defineGrammar({
        id, revision, dials: {carrierCostStrict: false, mindedObjects: false, ...dials},
        slots: [
            {id: 'intent', type: 'one', values: INTENTS},
            {id: 'roots', type: 'tokens', open: true, min: 0, max: 6, given: 'intent'},
            {id: 'target', type: 'one', values: EFFECT_TARGETS, given: 'intent'},
            {id: 'execution', type: 'one', values: Object.keys(EXECUTION_TIME)},
            {id: 'delivery', type: 'one', open: true},
            {id: 'gesture', type: 'one', open: true},
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
            delivery: 'spoken', gesture: 'unrecorded', carrier: 'wand', cost: 'stamina', access: 'taught'}},
    });
}

// A world pack row -> grammar parts and truth (PGC11: labelling is the domain's).
export function labelSpellRow(row, world) {
    const missing = ['intent', 'target', 'execution'].filter(k => !row[k]);
    if (!row.truth) missing.push('truth');
    if (missing.length) return {missing};
    return {parts: {intent: row.intent, roots: row.roots ?? [], target: row.target, execution: row.execution,
        delivery: row.delivery ?? 'unrecorded', gesture: row.gesture ?? 'unrecorded',
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
