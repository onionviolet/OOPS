// Crafting engine: reference access, learning and examine attempts (G1).
// Five states stay separate (MR1, MR10, MR33): known recipe (`learned`),
// identification (craft_state `knowledge`), reference access (a held object
// supplies a method while present), payment (cost returned for the caller's
// transaction path, AR3/AR7) and output (grants returned, never applied here).
// Optional owner `state.references`; absent on old saves, created on first use.
// Holding is the caller's inventory fact: functions take `held` (reference ids).
// Losing a reference removes access only; learned recipes stay (MR3).
import {natural as nat} from './basics.js';
import {address, compareCodePoints, drawU32, indexFromU32} from './gen_kit.js';
import {observe} from './craft_state.js';
import {validateTrialSetup, compareTrialSetups} from './craft_experiment_log.js';

const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);
const MODES = ['access', 'learn', 'training'];

export const emptyReferences = () => ({defs: {}, learned: {}, read: {}, consumed: [], attempts: {}});
const owner = state => state.references ?? emptyReferences();
const bump = (state, references) => ({...state, sequence: state.sequence + 1, references});
export const DEMONSTRATED_FAMILY = 'craft.demonstrated@1';
export const MAX_DEMONSTRATED_METHODS = 64;
const data = value => value === null || ['string', 'boolean'].includes(typeof value) ||
    typeof value === 'number' && Number.isFinite(value) ||
    Array.isArray(value) && value.every(data) ||
    value !== null && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(data);
const requestData = value => value !== null && typeof value === 'object' && !Array.isArray(value) && data(value);
const equalData = (a, b) => JSON.stringify(a, function(key, value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(Object.keys(value).sort(compareCodePoints).map(k => [k, value[k]])) : value;
}) === JSON.stringify(b, function(key, value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(Object.keys(value).sort(compareCodePoints).map(k => [k, value[k]])) : value;
});

// A host records an actually committed viable result. This neither grants an
// authored recipe nor proves efficacy/safe dose. HP may retain this same record
// in its existing state owner; no second save/stock/stage domain is introduced.
export function createDemonstratedMethod({id, setup, request, at, success}) {
    if(success !== true) fail('A method needs an actually demonstrated viable result.');
    const method = {family: DEMONSTRATED_FAMILY, id, setup: structuredClone(setup), request: structuredClone(request), at, demonstration: 'viable'};
    return validateDemonstratedMethod(method);
}
export function validateDemonstratedMethod(method) {
    if(method?.family !== DEMONSTRATED_FAMILY || method.demonstration !== 'viable' || !nat(method.at) || !requestData(method.request)) fail('Invalid demonstrated method.');
    text(method.id, 'Demonstrated method ID');
    validateTrialSetup(method.setup);
    return method;
}

// A plan is an ordinary request, never a paid execution. The host still quotes
// and revalidates actual instruction access, tools, stock and stages. No default
// current setup is inferred from a historical method.
export function planDemonstratedRepeat(method, {mode = 'quick', setup, request} = {}) {
    validateDemonstratedMethod(method);
    if(!['quick', 'guided', 'deep'].includes(mode)) fail('Unknown making depth.');
    const comparison = compareTrialSetups(method.setup, setup);
    const requestChanged = request !== undefined && !equalData(method.request, request);
    const modified = !comparison.sameKnownSetup || requestChanged;
    if(requestChanged) {
        comparison.sameKnownSetup = false;
        comparison.changed.push({field: 'request', before: structuredClone(method.request), after: structuredClone(request)});
    }
    if(mode === 'quick' && modified) return {ok: false, mode, modified, comparison,
        reason: 'The recorded known setup has changed or is incomplete. Review it as a modified attempt.'};
    if(!setup || modified && request === undefined) return {ok: false, mode, modified, comparison,
        reason: 'Choose the current materials and means before reviewing a modified attempt.'};
    const next = request ?? method.request;
    if(!requestData(next)) fail('Invalid making request.');
    return {ok: true, mode, modified, comparison, request: structuredClone(next),
        assurance: modified ? 'Modified attempt; the recorded result is not guaranteed.' : 'Repeats the recorded known setup; unmeasured conditions and recipient response remain untested.'};
}

export const demonstratedMethods = (state, actor) => structuredClone(state?.references?.demonstrated?.[actor] ?? []);
export function recordDemonstratedMethod(state, actor, method) {
    text(actor, 'Actor'); validateDemonstratedMethod(method);
    const refs = owner(state), methods = refs.demonstrated?.[actor] ?? [], prior = methods.find(m => m.id === method.id);
    if(prior) {
        if(!equalData(prior, method)) fail('A demonstrated method record would change.');
        return state;
    }
    return bump(state, {...refs, demonstrated: {...refs.demonstrated, [actor]: [...methods, structuredClone(method)].slice(-MAX_DEMONSTRATED_METHODS)}});
}

// spec: {id, kind:'book'|'disk'|string, mode, recipe?, grant?}
//  access   : supplies `recipe` while held; never teaches.
//  learn    : learnFromReference adds `recipe` to known recipes and consumes it.
//  training : readTraining grants `grant` ({kind:'skill'|'attribute', id, points}) once per actor.
export function defineReference(spec) {
    text(spec.id, 'Reference ID');
    if(!MODES.includes(spec.mode)) fail(`Unknown reference mode ${spec.mode}.`);
    if(spec.mode !== 'training') text(spec.recipe, 'Reference recipe');
    else {
        const g = spec.grant ?? fail('A training reference needs a grant.');
        if(!['skill', 'attribute'].includes(g.kind) || !g.id || !nat(g.points) || !g.points) fail('Invalid training grant.');
    }
    return {id: spec.id, kind: spec.kind ?? 'book', mode: spec.mode, ...(spec.recipe ? {recipe: spec.recipe} : {}),
        ...(spec.grant ? {grant: {...spec.grant}} : {})};
}

export function registerReference(state, spec) {
    const def = defineReference(spec);
    if(def.recipe && !state.recipes[def.recipe]) fail(`Reference ${def.id} names unfrozen recipe ${def.recipe}.`);
    const refs = owner(state), prior = refs.defs[def.id];
    if(prior && JSON.stringify(prior) !== JSON.stringify(def)) fail(`Reference ${def.id} would change.`);
    return bump(state, {...refs, defs: {...refs.defs, [def.id]: def}});
}

const def = (state, id) => state.references?.defs[id] ?? fail(`Unknown reference ${id}.`);
const heldSet = held => new Set(held);

// Where this actor may use each recipe now: {recipeId: ['learned', 'ref:<id>']}.
export function recipeAccess(state, actor, held = []) {
    const out = {};
    const add = (recipe, via) => { (out[recipe] ??= []).push(via); };
    const refs = state.references;
    if(!refs) return out;
    for(const recipe of refs.learned[actor] ?? []) add(recipe, 'learned');
    for(const id of [...heldSet(held)].sort(compareCodePoints)) {
        const d = refs.defs[id];
        if(d?.mode === 'access') add(d.recipe, `ref:${id}`);
    }
    return out;
}
export const canUseRecipe = (state, actor, recipeId, held = []) => !!recipeAccess(state, actor, held)[recipeId];

export function learnFromReference(state, actor, refId, held) {
    text(actor, 'Actor');
    const d = def(state, refId);
    if(d.mode !== 'learn') return {ok: false, reason: 'not a learn-and-consume reference', state, consumed: []};
    if(!heldSet(held).has(refId)) return {ok: false, reason: 'reference not held', state, consumed: []};
    const refs = owner(state), known = refs.learned[actor] ?? [];
    const learned = known.includes(d.recipe) ? known : [...known, d.recipe].sort(compareCodePoints);
    return {ok: true, consumed: [refId], recipe: d.recipe,
        state: bump(state, {...refs, learned: {...refs.learned, [actor]: learned}, consumed: [...refs.consumed, refId]})};
}

// Per-actor read key: `${refId}` once per actor; a second reader still earns it.
export function readTraining(state, actor, refId, held) {
    text(actor, 'Actor');
    const d = def(state, refId);
    if(d.mode !== 'training') return {ok: false, reason: 'not a training reference', state, grant: null};
    if(!heldSet(held).has(refId)) return {ok: false, reason: 'reference not held', state, grant: null};
    const refs = owner(state), keys = refs.read[actor] ?? [];
    if(keys.includes(refId)) return {ok: false, reason: 'already read by this actor: a second reading adds nothing new; practising the method is what builds on it', state, grant: null};
    return {ok: true, grant: {...d.grant, actor, source: refId},
        state: bump(state, {...refs, read: {...refs.read, [actor]: [...keys, refId].sort(compareCodePoints)}})};
}

// Examine attempt. try: {skill, difficulty, root, facts, cost, at}. Cost is data
// for the caller's payment path and rises with failures (a dial, default +1 per miss).
// Failure reveals nothing, records the miss, and returns a `failure` outcome.
// Chance and draw follow MR2: the draw is keyed on actor, subject and attempt count.
export function examineQuote(state, actor, subject, {cost = {}} = {}) {
    const misses = state.references?.attempts[actor]?.[subject]?.misses ?? 0;
    return {misses, cost: Object.fromEntries(Object.entries(cost).map(([k, v]) => [k, v + misses]))};
}
export function examine(state, actor, subject, attempt) {
    const {skill, difficulty, root, facts, at} = attempt;
    if(!nat(skill) || !nat(difficulty) || !nat(root) || !Array.isArray(facts) || !facts.length) fail('Invalid examine attempt.');
    const refs = owner(state), rec = refs.attempts[actor]?.[subject] ?? {misses: 0, tries: 0};
    const {cost} = examineQuote(state, actor, subject, attempt);
    const chance = Math.max(5, Math.min(95, 50 + 10 * (skill - difficulty)));
    const roll = indexFromU32(drawU32(root, address('craft.examine', actor, subject, rec.tries)), 100);
    const ok = roll < chance;
    const note = {misses: rec.misses + (ok ? 0 : 1), tries: rec.tries + 1};
    const next = bump(ok ? observe(state, actor, subject, facts, at) : state,
        {...refs, attempts: {...refs.attempts, [actor]: {...refs.attempts[actor], [subject]: note}}});
    return ok ? {ok, outcome: 'identified', chance, cost, state: next, facts}
        : {ok, outcome: 'failure', chance, cost, state: next, facts: [], failure: {kind: 'misread', retryCost: examineQuote(next, actor, subject, attempt).cost}};
}

export function validateReferences(state) {
    const refs = state.references;
    if(!refs) return state;
    for(const [id, d] of Object.entries(refs.defs)) {
        if(id !== d.id || JSON.stringify(defineReference(d)) !== JSON.stringify(d)) fail(`Invalid reference ${id}.`);
        if(d.recipe && !state.recipes[d.recipe]) fail(`Reference ${id} names unfrozen recipe ${d.recipe}.`);
    }
    for(const [actor, ids] of Object.entries(refs.learned)) for(const r of ids) if(!state.recipes[r]) fail(`${actor} learned unfrozen recipe ${r}.`);
    for(const [actor, ids] of Object.entries(refs.read)) for(const id of ids) if(refs.defs[id]?.mode !== 'training') fail(`${actor} read non-training ${id}.`);
    for(const id of refs.consumed) if(refs.defs[id]?.mode !== 'learn') fail(`Consumed reference ${id} is not a learn reference.`);
    for(const byS of Object.values(refs.attempts)) for(const a of Object.values(byS)) if(!nat(a.misses) || !nat(a.tries) || a.misses > a.tries) fail('Invalid examine record.');
    for(const [actor, methods] of Object.entries(refs.demonstrated ?? {})) {
        text(actor, 'Actor');
        if(!Array.isArray(methods) || methods.length > MAX_DEMONSTRATED_METHODS || new Set(methods.map(m => m.id)).size !== methods.length) fail('Invalid demonstrated methods.');
        methods.forEach(validateDemonstratedMethod);
    }
    return state;
}
