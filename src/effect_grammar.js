// Effect grammar v0 (chat P, PFP23, docs/PROCEDURAL_GRAMMAR_CONTRACT.md#effect-grammar).
// One grammar of effect sentences for every world: verb, object, target and
// shape, time, carrier, cost and limits, declared on the grammar contract.
// Objects lower onto chat W's substrate: a W quantity becomes an add op, the
// rest publish an effect kind `effect.<verb>.<object>` that present holders
// answer (WSC8). Nothing here names a world (PFP3); world packs map their own
// vocabulary onto these parts and declare carriers, costs and words.
import {defineGrammar, assemble} from './procedural_grammar.js';
import {WORLD_QUANTITIES} from './world_quantities.js';

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

// Lower a sentence onto W ops (WSC8 op names). quantities: the W vocabulary
// in play (default WORLD_QUANTITIES). Quantities W has not declared yet are
// published as effects and listed in `needs` for W (WSC2: W decides).
// Boundary proposal for W: an effect on moisture reads W's place humidity.
export const DEFAULT_QUANTITY_OF = Object.freeze({moisture: 'humidity'});
export function lowerEffect(parts, {quantities = WORLD_QUANTITIES, quantityOf = DEFAULT_QUANTITY_OF} = {}) {
    const kind = EFFECT_OBJECTS[parts.object];
    const wName = quantityOf[parts.object] ?? parts.object;
    const ops = [], needs = [];
    if (kind === 'quantity' && quantities[wName] && ['add', 'remove'].includes(parts.verb)) {
        ops.push({op: 'add', quantity: wName, sign: parts.verb === 'add' ? 1 : -1});
    } else if (kind === 'law' && parts.verb === 'alter') {
        ops.push({op: 'law_add', field: parts.object});
    } else {
        if (kind === 'quantity' && !quantities[wName]) needs.push(wName);
        ops.push({op: 'publish', kind: effectKind(parts.verb, parts.object)});
    }
    return {ops, needs};
}

// A world declares its carriers and the cost accounts each may pay with.
// carriers: {carrier: [cost]}. The grammar is per world because carrier and
// cost vocabularies are world data; verbs, objects, targets and times are shared.
export function defineEffectGrammar({world, carriers, limits = [], revision = 1, dials = {}}) {
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
            {id: 'lowered', kind: 'derive', reads: ['verb', 'object'], default: 'Objects W declares become quantity ops; the rest publish an effect kind.',
                reason: 'P composes sentences; W lands them (SB3).',
                run: ({parts}) => ({...lowerEffect(parts), counters: COUNTERS[parts.verb] ?? []})},
        ],
        fallback: {id: `effect.${world}.fallback`, parts: {verb: 'sense', object: 'information', target: 'area', time: 'sustained',
            carrier: first, cost: carriers[first][0], limits: []}},
    });
}

export const assembleEffect = (grammar, parts) => assemble(grammar, parts);
