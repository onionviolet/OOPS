// Spells beyond the book (chat S): NV1 recombine and NV3 transfer, judged by the
// five checks of the plan ("Effects, moves and spells beyond the book"):
// 1 it runs, 2 it pays, 3 the world allows it, 4 it explains itself, 5 it is
// worth keeping. Every draw is addressed (GR2) and every candidate has a cause
// (PFP19). Generated truths stay values; what an actor knows is elsewhere (GR5).
import {assemble} from './procedural_grammar.js';
import {address, drawU32, indexFromU32} from './gen_kit.js';
import {INTENTS, EFFECT_TARGETS, EXECUTION_TIME, describeSentence} from './spell_effects.js';
import {CARRIER_COST, incantationName} from './spell_grammar.js';
import {quoteSpells} from './spell_law.js';

// Cost curve (check 2). Default weights, fitted so a world's anchor spell costs its
// canon amount: more reach, longer time and deeper verbs cost more by one curve.
// Dial: a world pack overrides any weight with a reason.
export const COST_CURVE = Object.freeze({
    verb: {command: 3, alter_law: 3, animate: 3, transform: 2, copy: 2, conceal: 2},
    target: {body: 2, creature: 2, place: 2, area: 3, working: 2},
    time: {timed: 2, sustained: 2, triggered: 3, lasting: 4},
});
const w = (table, k) => table[k] ?? 1;
export const sentenceWeight = s => w(COST_CURVE.verb, s.verb) * w(COST_CURVE.target, s.target) * w(COST_CURVE.time, s.time);
// anchor: {sentence, amount} -> units per weight point.
export function spellCost(sentence, {anchor}) {
    const unit = anchor.amount / sentenceWeight(anchor.sentence);
    return Math.max(1, Math.round(sentenceWeight(sentence) * unit));
}

// World laws (check 3): default, dial and reason. An exception needs an in-world
// reason and cost (AD5); `exceptions` lists the law ids a caller can cite with one.
export const WORLD_SPELL_LAWS = Object.freeze({
    hogwarts: [{id: 'gamp', refuses: s => s.verb === 'add' && s.object === 'material' && s.direction === 'food',
        reason: "Gamp's Law: food cannot be conjured from nothing (B7); flowers, ropes and bandages can."}],
    dnd: [{id: 'slot-ceiling', refuses: (s, ctx) => ctx.cost > 9, reason: 'No spell slot above ninth level holds it.'}],
    cyoria: [{id: 'boundary', refuses: (s, ctx) => ctx.cost > (ctx.reserve ?? 12), reason: 'More mana than the caster can hold breaks the formula boundary (MoL ch 46).'}],
    lotm: [{id: 'pathway', refuses: s => s.carrier === 'ability' && !['sense', 'conceal', 'add'].includes(s.verb),
        reason: 'A Seer ability senses or hides; other workings need a ritual or another pathway.'}],
});

export function worldAllows(world, sentence, ctx = {}, exceptions = {}) {
    for (const law of WORLD_SPELL_LAWS[world] ?? []) if (law.refuses(sentence, ctx)) {
        const ex = exceptions[law.id];
        if (ex?.reason && ex?.cost) continue;
        return {ok: false, law: law.id, reason: law.reason};
    }
    return {ok: true};
}

const keyOf = s => `${s.verb}|${s.object}|${s.target}|${s.time}`;
// Check 5 (worth keeping): novelty against canon, fit by part pair support, then a
// spread: the best candidate per verb, so the world fills with different spells.
export function keepSpread(candidates, canonSentences, {perVerb = 1} = {}) {
    const canon = new Set(canonSentences.map(keyOf)), canonVerbObject = new Set(canonSentences.map(s => `${s.verb}|${s.object}`));
    const scored = candidates.map(c => ({...c, score: {novelty: canon.has(keyOf(c.sentence)) ? 0 : canonVerbObject.has(`${c.sentence.verb}|${c.sentence.object}`) ? 0.5 : 1,
        fit: c.flags.filter(f => f.kind === 'novel-part').length ? 0.5 : 1}}))
        .filter(c => c.score.novelty > 0);
    const byVerb = new Map();
    for (const c of scored.sort((a, b) => (b.score.novelty + b.score.fit) - (a.score.novelty + a.score.fit) || (a.id < b.id ? -1 : 1))) {
        const list = byVerb.get(c.sentence.verb) ?? [];
        if (list.length < perVerb) list.push(c);
        byVerb.set(c.sentence.verb, list);
    }
    return [...byVerb.values()].flat();
}

function rootsFor(intent, lexicon) {
    return Object.entries(lexicon).filter(([, g]) => g.intents?.includes(intent)).map(([root]) => root).sort();
}

// Run checks 1 to 4 on assembled parts. Returns a candidate or the failed check.
export function judgeSpell(fitted, parts, {world, anchor, target, ctx = {}, exceptions = {}, lexicon = {}, canonForms = [], root, at, cause}) {
    const built = assemble(fitted, parts);
    if (!built.ok) return {ok: false, check: 1, reason: built.receipt.violations.map(v => v.reason ?? v.kind).join('; ')};
    const sentence = built.value.derived.sentence;
    const quote = quoteSpells([{sentence, target: target ?? {id: 'practice.' + sentence.target}}], {id: 'spell.judge'});
    if (!quote.ok) return {ok: false, check: 1, reason: quote.reason};
    const cost = spellCost(sentence, {anchor});
    const allowed = worldAllows(world, sentence, {...ctx, cost}, exceptions);
    if (!allowed.ok) return {ok: false, check: 3, reason: allowed.reason, law: allowed.law};
    const roots = parts.roots?.length ? parts.roots : rootsFor(parts.intent, lexicon).slice(0, 1);
    // EF5: with no root that fits, the spell stays unnamed until the naming owner has a register for it.
    const name = incantationName(roots, {root, at, canonForms}) ?? {name: null, collides: false, reason: 'no root in this world fits the intent'};
    return {ok: true, id: `${cause.kind}:${cause.id}`, parts: built.value.parts, sentence, cost, costAccount: parts.cost,
        name, explain: describeSentence(sentence), flags: built.receipt.flags, cause};
}

const SWAPS = ['intent', 'target', 'execution'];
const VALUES = {intent: INTENTS, target: EFFECT_TARGETS, execution: Object.keys(EXECUTION_TIME)};
// NV1: swap one part of a canon spell. novelty dial = parts changed (default 1).
export function recombine(fitted, canonParts, {root, at, novelty = 1, tries = 24, ...judge}) {
    const out = [];
    for (let i = 0; i < tries; i++) {
        const parts = {...canonParts};
        const changed = [];
        for (let n = 0; n < novelty; n++) {
            const slot = SWAPS[indexFromU32(drawU32(root, address('nv1', at, {i, n}, 'slot')), SWAPS.length)];
            const values = VALUES[slot].filter(v => v !== canonParts[slot]);
            parts[slot] = values[indexFromU32(drawU32(root, address('nv1', at, {i, n}, slot)), values.length)];
            changed.push(slot);
        }
        if (changed.includes('intent')) parts.roots = [];
        const result = judgeSpell(fitted, parts, {...judge, root, at: `${at}.${i}`, cause: {kind: 'inventor', id: `nv1.${at}.${i}`}});
        out.push({...result, changed});
    }
    return out;
}

// NV3: carry a canon spell into another world's carrier, cost and access.
export function transfer(fitted, canonParts, toWorld, judge) {
    const parts = {...canonParts, carrier: toWorld.carrier, cost: CARRIER_COST[toWorld.carrier] === undefined ? toWorld.cost
        : (Array.isArray(CARRIER_COST[toWorld.carrier]) ? CARRIER_COST[toWorld.carrier][0] : CARRIER_COST[toWorld.carrier]), access: toWorld.access};
    return judgeSpell(fitted, parts, {...judge, world: toWorld.world, cause: {kind: 'inventor', id: `nv3.${canonParts.intent}.${toWorld.world}`}});
}
