// Spellcraft depth (chat S, plan SPD1-SPD9): what a cast is made of beyond its
// effect sentence. Components that can be skipped at a cost (SPD1), a skill curve
// with separate reliability, power and speed (SPD2), shaping as trained skill
// (SPD3), failure modes as sentences of their own (SPD4), counterplay as W block
// fields (SPD5), standing fields with upkeep (SPD8) and each world's cost source
// (SPD9, on each pack's world record). SPD6 invention is NV1 (spell_invention.js) with the spellbook notebook;
// SPD7 personal style rides on lineage (LN4) and is a request, not built here.
// Every number is a default with a dial; draws are addressed (GR2). Names no world.
import {address, drawU32} from './gen_kit.js';
import {lowerEffect} from './effect_grammar.js';
import {sharedEffect} from './spell_effects.js';

// SPD1. Components and what skipping one costs. Default from canon: wordless and
// wandless casting are harder, not forbidden (B6 nonverbal lessons; Dumbledore and
// Harry's wandless light). Reason: the caster carries what the word or focus did.
// Dial `skipCost`: multiplier on the spell's cost per skipped component, and the
// reliability lost. Attention skipped is a fizzle risk, never a cost discount.
export const COMPONENTS = Object.freeze(['incantation', 'gesture', 'focus', 'attention']);
export const SKIP_COST = Object.freeze({
    incantation: {cost: 1.5, reliability: 0.15},
    gesture: {cost: 1.25, reliability: 0.1},
    focus: {cost: 2, reliability: 0.25},
    attention: {cost: 1, reliability: 0.5},
});
const SKIPPED_DELIVERY = new Set(['mental', 'will', 'wordless', 'none']);
const UNRECORDED = new Set([undefined, null, '', 'unrecorded', 'unreported']);

// parts: grammar parts (delivery, gesture, focus, attention). Unrecorded is not skipped:
// the source did not say, so no cost is charged and the component stays unknown.
export function spellComponents(parts, {skipCost = SKIP_COST} = {}) {
    const state = {
        incantation: UNRECORDED.has(parts.delivery) ? 'unrecorded' : SKIPPED_DELIVERY.has(parts.delivery) ? 'skipped' : 'used',
        gesture: UNRECORDED.has(parts.gesture) ? 'unrecorded' : parts.gesture === 'none' ? 'skipped' : 'used',
        focus: UNRECORDED.has(parts.focus) ? 'unrecorded' : parts.focus === 'none' ? 'skipped' : 'used',
        attention: UNRECORDED.has(parts.attention) ? 'unrecorded' : parts.attention === 'divided' || parts.attention === 'none' ? 'skipped' : 'used',
    };
    const skipped = COMPONENTS.filter(c => state[c] === 'skipped');
    const costFactor = skipped.reduce((f, c) => f * (skipCost[c]?.cost ?? 1), 1);
    const reliabilityLoss = skipped.reduce((n, c) => n + (skipCost[c]?.reliability ?? 0), 0);
    return {state, skipped, costFactor, reliabilityLoss: Math.min(1, reliabilityLoss)};
}

// SPD2 and SPD3. Skill curve: practice raises reliability, power and speed on
// separate curves toward a per-spell plateau; rust lowers them after a grace
// period without use. Shaping drills (area, precision, efficiency) are their own
// practice counts. Dials: `curve` (half-practice per axis), `plateau`, `rust`.
export const SKILL_CURVE = Object.freeze({
    half: {reliability: 10, power: 25, speed: 40, area: 30, precision: 20, efficiency: 35},
    floor: {reliability: 0.4, power: 0.5, speed: 0.5, area: 0, precision: 0, efficiency: 0},
    plateau: 1,
    rust: {graceMinutes: 7 * 24 * 60, perWeek: 0.03, most: 0.3},
});
const curve = (n, half) => n / (n + half);
// practice: {casts, drills: {area, precision, efficiency}, lastUsed}; at: minute now.
export function castProfile({casts = 0, drills = {}, lastUsed = null} = {}, {at = 0, plateau, curveDial = SKILL_CURVE} = {}) {
    const top = plateau ?? curveDial.plateau;
    const idle = lastUsed == null ? 0 : Math.max(0, at - lastUsed - curveDial.rust.graceMinutes);
    const rust = Math.min(curveDial.rust.most, idle / (7 * 24 * 60) * curveDial.rust.perWeek);
    const axis = (name, n) => {
        const f = curveDial.floor[name];
        return Math.round((f + (top - f) * curve(n, curveDial.half[name])) * (1 - rust) * 1000) / 1000;
    };
    return {reliability: axis('reliability', casts), power: axis('power', casts), speed: axis('speed', casts),
        area: axis('area', drills.area ?? 0), precision: axis('precision', drills.precision ?? 0), efficiency: axis('efficiency', drills.efficiency ?? 0), rust};
}

// SPD4. Failure modes, each its own sentence. Default spread of a failed cast
// (dial `failureMix`): mostly fizzles, some partial, rarer misfire and backfire.
// Reason: a weak cast usually just does not take; a wild one goes somewhere.
// Precision lowers misfire; a skipped focus raises backfire.
export const FAILURE_MIX = Object.freeze({fizzle: 0.55, partial: 0.25, misfire: 0.12, backfire: 0.08});
const SHORTER = {lasting: 'timed', timed: 'instant', sustained: 'instant', triggered: 'instant', instant: 'instant'};
export function failureSentences(sentence, {nearby = 'creature'} = {}) {
    return {
        fizzle: null,
        partial: {...sentence, time: SHORTER[sentence.time] ?? 'instant', limits: [...(sentence.limits ?? []), 'weak']},
        misfire: sentence.target === nearby ? null : {...sentence, target: nearby},
        backfire: sentence.target === 'self' ? null : {...sentence, target: 'self'},
    };
}

// One cast: success or a named failure, drawn by address. Chance of success is
// reliability minus the component loss; the mode then follows the mix.
export function castOutcome(sentence, {profile, components, root = 'cast', at = 'cast', mix = FAILURE_MIX, nearby} = {}) {
    const loss = components?.reliabilityLoss ?? 0;
    const chance = Math.max(0, Math.min(1, (profile?.reliability ?? 1) - loss));
    const roll = drawU32(root, address('cast', at, 'success')) / 2 ** 32;
    if (roll < chance) return {ok: true, mode: 'success', sentence, chance};
    const weights = {...mix,
        misfire: mix.misfire * (1 - (profile?.precision ?? 0)),
        backfire: mix.backfire * (components?.state?.focus === 'skipped' ? 2 : 1)};
    const modes = failureSentences(sentence, {nearby});
    const live = Object.keys(weights).filter(m => m === 'fizzle' || modes[m]);
    const total = live.reduce((n, m) => n + weights[m], 0);
    let pick = drawU32(root, address('cast', at, 'mode')) / 2 ** 32 * total, mode = live.at(-1);
    for (const m of live) { if ((pick -= weights[m]) < 0) { mode = m; break; } }
    return {ok: false, mode, sentence: modes[mode], chance};
}

// SPD5. Counterplay as W block fields (WSC20, EF3): a shield, counter or ward is
// W's `block` with params {verb, object} in W's names, either may be '*'. The
// spell's words lower through P (sharedEffect, then lowerEffect onto W_OBJECT_OF),
// so a counter to a fire spell blocks `add temperature`. A keyed object (light)
// takes the world's key; an object W leaves to another owner (mind, memory, a
// working) has no W block and returns {gap, owner} for that owner to answer.
export function counterFor(sentence, {broad = false, keys = {}} = {}) {
    if (broad) return {verb: 'block', params: {verb: '*', object: '*'}};
    const shared = sharedEffect(sentence);
    if (shared.gap) return {gap: shared.gap};
    const lowered = lowerEffect(shared, {keys});
    const act = lowered.acts[0];
    if (!act?.object) return {gap: lowered.needs[0] ?? `no W object for ${shared.object}`, owner: lowered.publish[0]?.owner ?? null};
    return {verb: 'block', params: {verb: shared.verb, object: act.object}};
}
export const counters = (block, act) => (block.verb === '*' || block.verb === act.verb) && (block.object === '*' || block.object === act.object);

// SPD8. Standing fields: an effect that stays on a thing or place is a W law
// field (`law_add`) with upkeep. Lasting and triggered effects hold until broken
// or sprung (no `until`); sustained and timed ones need the caster's minutes and
// lapse then (W's `until`). A ward (verb block) lowers through P, which names the
// verb it stops on that object (a guard on a quantity stops its loss, on a
// position stops movement); `stops` overrides it. Default upkeep: wards renew
// daily by recasting (Hogwarts' protections are kept up); other charms none.
const HOLDS = new Set(['object', 'place', 'area', 'implement', 'body', 'creature', 'self']);
export function standingField(sentence, {id, scope, at = 0, minutes = null, upkeep = null, source = null, stops = null, keys = {}} = {}) {
    if (!['lasting', 'timed', 'sustained', 'triggered'].includes(sentence.time) || !HOLDS.has(sentence.target)) return null;
    const lapses = sentence.time === 'sustained' || sentence.time === 'timed';
    if (lapses && !Number.isSafeInteger(minutes)) throw Error(`A ${sentence.time} field needs the minutes it lasts.`);
    const ward = sentence.verb === 'block';
    let params = {sentence};
    if (ward) {
        const shared = sharedEffect(sentence);
        const act = shared.gap ? null : lowerEffect(shared, {keys}).acts[0];
        if (!act?.params) return {gap: shared.gap ?? `no W block for ${sentence.object}`};
        params = {verb: stops ?? act.params.verb, object: act.params.object};
    }
    return {op: 'law_add', field: {id: id ?? `spell.${sentence.verb}.${sentence.object}.${scope}.${at}`, scope,
        kind: ward ? 'block' : `spell.${sentence.verb}.${sentence.object}`,
        params: {...params, upkeep: upkeep ?? (ward ? {every: 24 * 60, renew: 'recast'} : null)},
        ...(lapses ? {until: at + minutes} : {}), source}};
}

// SPD9. Cost sources by world live on each pack's world record (`costSource`:
// the account, the world's word for it, how it recovers), beside the world's cost
// slot value; this file names no world.
