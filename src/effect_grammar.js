// Effect grammar v0 (chat P, PFP23, docs/PROCEDURAL_GRAMMAR_CONTRACT.md#effect-grammar).
// One grammar of effect sentences for every world: verb, object, target and
// shape, time, carrier, cost and limits, declared on the grammar contract.
// Objects lower onto chat W's substrate: a W quantity becomes an add op, the
// rest publish an effect kind `effect.<verb>.<object>` that present holders
// answer (WSC8). Nothing here names a world (PFP3); world packs map their own
// vocabulary onto these parts and declare carriers, costs and words.
import {defineGrammar, assemble} from './procedural_grammar.js';
import {WORLD_QUANTITIES} from './world_quantities.js';
import {W_OBJECT_OF, applyEffect} from './world_effects.js';
import {applyWorldOps} from './world_substrate.js';

// Few primitives (EF2): a new one needs a canon effect these cannot express
// and a second consumer.
export const EFFECT_VERBS = Object.freeze(['move', 'add', 'remove', 'transform', 'bind', 'release', 'sense', 'conceal', 'copy', 'block', 'end', 'alter']);
export const EFFECT_OBJECTS = Object.freeze({
    vitality: 'quantity', heat: 'quantity', light: 'quantity', sound: 'quantity', essence: 'quantity', force: 'quantity',
    moisture: 'quantity', lifespan: 'quantity',
    position: 'state', form: 'state', mind: 'state',
    information: 'knowledge', memory: 'knowledge',
    relation: 'relation', thing: 'thing', working: 'working', law: 'law', time: 'law',
});
// What each verb can act on, by object kind. Reason: a verb is a kind of
// change; it reads the property it changes (PFP22), never a category.
export const VERB_ACCEPTS = Object.freeze({
    move: ['state', 'thing', 'relation', 'quantity'],
    add: ['quantity', 'thing', 'knowledge'],
    remove: ['quantity', 'thing', 'knowledge'],
    transform: ['state', 'quantity', 'thing'],
    bind: ['state', 'thing', 'relation'],
    release: ['state', 'thing', 'relation', 'working'],
    sense: ['quantity', 'state', 'knowledge', 'thing', 'relation', 'working', 'law'],
    conceal: ['quantity', 'state', 'knowledge', 'thing', 'relation', 'working'],
    copy: ['knowledge', 'state', 'working', 'thing'],
    block: ['quantity', 'state', 'relation', 'working', 'thing'],
    end: ['working'],
    alter: ['working', 'law'],
});
export const EFFECT_TARGETS = Object.freeze(['self', 'touched', 'bound', 'line', 'cone', 'area', 'marked']);
export const EFFECT_TIMES = Object.freeze(['instant', 'sustained', 'lasting', 'delayed', 'triggered']);
// Counterplay comes free (EF3): which verbs answer an effect on the same object.
const COUNTERS = Object.freeze({conceal: ['sense'], sense: ['conceal'], bind: ['release'], move: ['block', 'bind'], add: ['remove', 'block'],
    remove: ['block', 'add'], transform: ['block', 'transform'], alter: ['end', 'alter'], copy: ['conceal'], block: ['end', 'remove'],
    release: ['bind'], end: []});
// Scope tiers price reach and time by one curve (check 2, P5 fit).
export const TARGET_TIER = Object.freeze({self: 0, touched: 1, bound: 2, line: 2, cone: 3, area: 3, marked: 4});
export const TIME_TIER = Object.freeze({instant: 0, delayed: 1, triggered: 1, sustained: 2, lasting: 3});
export const scopeOf = parts => (TARGET_TIER[parts.target] ?? 0) + (TIME_TIER[parts.time] ?? 0) + Math.max(0, 2 - (parts.limits?.length ?? 0));

// The effect kind a sentence publishes when its object is not a W quantity.
export const effectKind = (verb, object) => `effect.${verb}.${object}`;

// Lower a sentence onto W's effect primitives (src/world_effects.js, SB3).
// Objects map through W_OBJECT_OF (heat to temperature, sound to noise,
// essence to energy). A keyed family (light, energy) takes the world's key:
// `keys[object]` is a string or a function of the sentence's parts, so a Gu
// pack can name `energy:primeval.rank1` and a Hogwarts pack `light:wand`. A
// keyed object with no key is listed in `needs` (W refuses a bare family).
// Objects W leaves to another owner (null in W_OBJECT_OF) lower to a publish
// for that owner to answer. Returns {acts, publish, needs}: an act is
// {verb, object} plus what P knows of it (until for sustained time); the caller
// adds targets and amounts and runs it with `applySentence`.
export const OBJECT_OWNER = Object.freeze({working: 'K', information: 'N', memory: 'N', mind: 'A', force: 'L', lifespan: 'L'});
export function lowerEffect(parts, {keys = {}, key = null, objectOf = W_OBJECT_OF, quantities = WORLD_QUANTITIES} = {}) {
    const base = objectOf[parts.object];
    const acts = [], publish = [], needs = [];
    if (base === undefined) throw Error(`No W reading for object ${parts.object}.`);
    if (base === null) {
        // Sensing and hiding run on W's channels whatever the object; what is
        // learned or hidden is recorded by its owner (N for knowledge).
        if (['sense', 'conceal', 'release'].includes(parts.verb)) acts.push({verb: parts.verb});
        publish.push({kind: effectKind(parts.verb, parts.object), owner: OBJECT_OWNER[parts.object] ?? null});
        return {acts, publish, needs};
    }
    let object = base;
    if (quantities[base]?.keyed) {
        // A thing's own key (this Gu's light is starlight) beats the world default.
        const k = key ?? (typeof keys[parts.object] === 'function' ? keys[parts.object](parts) : keys[parts.object]);
        if (!k) { needs.push(`${base}:<key>`); return {acts, publish, needs}; }
        object = `${base}:${k}`;
    }
    // A block names the verb it stops on that object: a guard on a quantity stops
    // its loss, on a position stops movement, on a form or bond stops change.
    // details.params overrides it at run time.
    const stops = {quantity: 'remove', state: parts.object === 'position' ? 'move' : 'transform', relation: 'bind', thing: 'move', law: 'alter'}[EFFECT_OBJECTS[parts.object]] ?? 'remove';
    const act = parts.verb === 'block' ? {verb: 'block', params: {verb: stops, object}} : {verb: parts.verb, object};
    if (object === 'law:*') { delete act.object; act.kind = parts.object; }
    acts.push(act);
    return {acts, publish, needs};
}

// A world declares its carriers and the cost accounts each may pay with.
// carriers: {carrier: [cost]}. The grammar is per world because carrier and
// cost vocabularies are world data; verbs, objects, targets and times are shared.
export function defineEffectGrammar({world, carriers, limits = [], keys = {}, revision = 1, dials = {}}) {
    if (!world || !carriers || !Object.keys(carriers).length) throw Error('An effect grammar needs a world id and carriers with costs.');
    const costs = [...new Set(Object.values(carriers).flat())];
    const first = Object.keys(carriers)[0];
    return defineGrammar({
        id: `effect.${world}`, revision, dials,
        slots: [
            {id: 'verb', type: 'one', values: EFFECT_VERBS},
            {id: 'object', type: 'one', values: Object.keys(EFFECT_OBJECTS), given: 'verb'},
            {id: 'target', type: 'one', values: EFFECT_TARGETS, given: 'verb'},
            {id: 'time', type: 'one', values: EFFECT_TIMES, given: 'verb'},
            {id: 'carrier', type: 'one', values: Object.keys(carriers)},
            {id: 'cost', type: 'one', values: costs, given: 'carrier'},
            {id: 'limits', type: 'set', values: limits, open: true, min: 0},
        ],
        rules: [
            {id: 'verb-object', kind: 'check', reads: ['verb', 'object'],
                default: 'A verb acts on the object kinds it can change (VERB_ACCEPTS).',
                reason: 'Laws read properties, not categories (PFP22); a mismatch is a missing primitive or a mislabel.',
                run: ({parts}) => VERB_ACCEPTS[parts.verb]?.includes(EFFECT_OBJECTS[parts.object]) ? null
                    : {reason: `${parts.verb} does not act on ${EFFECT_OBJECTS[parts.object] ?? parts.object}`, pair: `${parts.verb}|${parts.object}`}},
            {id: 'carrier-cost', kind: 'check', reads: ['carrier', 'cost'],
                default: 'A carrier pays from the accounts its world gives it.', dial: 'anyCost',
                reason: 'A Gu runs on essence, a spoken spell on the caster; a different account needs an in-world reason.',
                run: ({parts, dials}) => dials.anyCost || carriers[parts.carrier]?.includes(parts.cost) ? null : {reason: `${parts.carrier} cannot pay with ${parts.cost}`}},
            {id: 'scope', kind: 'derive', reads: ['target', 'time', 'limits'], default: 'Scope is target tier plus time tier plus fewer limits.',
                reason: 'Bigger reach, longer time and fewer limits cost more by one curve (plan check 2).',
                run: ({parts}) => ({scope: scopeOf(parts)})},
            {id: 'lowered', kind: 'derive', reads: ['verb', 'object', 'cost'], default: 'A sentence lowers to W acts through W_OBJECT_OF and the world keys; objects of other owners publish.',
                reason: 'P composes sentences; W lands them (SB3).',
                run: ({parts}) => ({...lowerEffect(parts, {keys}), counters: COUNTERS[parts.verb] ?? []})},
        ],
        fallback: {id: `effect.${world}.fallback`, parts: {verb: 'sense', object: 'information', target: 'area', time: 'sustained',
            carrier: first, cost: carriers[first][0], limits: []}},
    });
}

export const assembleEffect = (grammar, parts) => assemble(grammar, parts);

// Run a sentence in a W world: one executor for the verbs (W's applyEffect).
// details supply what the sentence leaves to the moment: target (a W shape;
// geometry such as a line arrives as {shape: 'holders', ids} from X), amount,
// to, into, mark, channel, reads, from, value, field and, for sustained time,
// minutes (until = now + minutes). Publishes for other owners land on
// details.place. Returns the world and every act's outcome.
export function applySentence(rules, world, parts, details, {keys = {}, cause, by} = {}) {
    if (!cause) throw Error('A sentence needs a cause.');
    const lowered = lowerEffect(parts, {keys, key: details.key ?? null});
    if (lowered.needs.length) return {world, outcomes: [], needs: lowered.needs, published: []};
    let next = world;
    const outcomes = [];
    const until = parts.time === 'sustained' && Number.isSafeInteger(details.minutes) ? world.clock + details.minutes : undefined;
    for (const act of lowered.acts) {
        const {minutes, place, key, ...rest} = details;
        const run = applyEffect(rules, next, {...act, ...rest, ...(until != null ? {until} : {}), by: by ?? rest.by}, cause);
        next = run.world;
        outcomes.push(run.outcome);
    }
    const published = [];
    if (lowered.publish.length) {
        if (!details.place) throw Error('An effect for another owner needs a place to land.');
        next = applyWorldOps(rules, next, lowered.publish.map(p => ({op: 'publish', kind: p.kind, place: details.place, by: by ?? cause,
            detail: {owner: p.owner, parts}})), cause);
        published.push(...lowered.publish);
    }
    return {world: next, outcomes, needs: [], published};
}
