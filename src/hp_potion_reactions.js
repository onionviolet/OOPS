import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw, resolveBatch} from './craft_resolver.js';
import {cancelOutputs, defineDoseRules} from './craft_dose_rules.js';
import {bindMethod} from './method_program.js';
import {DRAUGHT_OF_LIVING_DEATH, brewDraughtOfLivingDeath} from './world_packs/hp_brew_pack.js';

export const ANTIDOTE_OPERATIONS = Object.freeze({
    heat: Object.freeze({label: 'Heat the binder', input: 'unmixed ingredients', output: 'unmixed ingredients', reaction: 'hot'}),
    warm: Object.freeze({label: 'Mix warm', input: 'unmixed ingredients', output: 'a test dose', reaction: 'bind'}),
    cool: Object.freeze({label: 'Mix cool', input: 'unmixed ingredients', output: 'a test dose', reaction: 'cool-bind'}),
});
export const ANTIDOTE_STEP_LIMIT = 4;
export const bindAntidoteMethod = steps => bindMethod(steps, ANTIDOTE_OPERATIONS, {
    input: 'unmixed ingredients', output: 'a test dose', limit: ANTIDOTE_STEP_LIMIT,
});

const phialRules = defineDoseRules({id: 'book.hp.antidote.phial', revision: 1, pairs: [
    {a: 'a', b: 'remedyA', reason: 'The first remedy counters the first constituent.'},
    {a: 'b', b: 'remedyB', reason: 'The second remedy counters the second constituent.'},
    {a: 'blend', b: 'joint', reason: 'The bound remedy counters the combined exposure.'},
]});

const axes = ['precursor', 'juice', 'intermediate', 'remedyA', 'remedyB', 'binder', 'joint', 'residue'];
const materials = ['carrier', ...axes.filter(id => id !== 'intermediate' && id !== 'joint' && id !== 'residue')];
const catalogue = defineCatalogue({
    id: 'workshop.hogwarts', revision: 1, basis: 1,
    axes: axes.map(id => ({id, kind: 'fraction'})),
    tags: [{id: 'bond-catalyst', kind: 'functional', revision: 1}],
    materials: [
        ...materials.map(id => ({id, revision: 1, properties: id === 'carrier' ? {} : {[id]: 1}})),
        {id: 'catalyst-stone', revision: 1, properties: {}, tags: ['bond-catalyst']},
    ],
});

const law = defineCraftLaw({
    id: 'workshop.hogwarts.reactions', revision: 1, catalogue, carrier: 'Cauldron',
    ops: [{id: 'admit'}, {id: 'hot'}, {id: 'bind'}, {id: 'cool-bind'}],
    reactions: [
        {id: 'juice-reacts', after: 'admit', reactants: {juice: 1, precursor: 1}, products: {intermediate: 2}},
        {id: 'binder-degrades', after: 'hot', limit: 500, reactants: {binder: 1}, products: {residue: 1}},
        {id: 'bind-remedies', after: 'bind', reactants: {remedyA: 1, remedyB: 1, binder: 1}, products: {joint: 3}},
        {id: 'catalysed-cool-binding', after: 'cool-bind', priority: 1, catalyst: 'bond-catalyst',
            reactants: {remedyA: 1, remedyB: 1, binder: 1}, products: {joint: 3}},
        {id: 'slow-cool-binding', after: 'cool-bind', limit: 500,
            reactants: {remedyA: 1, remedyB: 1, binder: 1}, products: {joint: 3}},
    ],
});

export function quantity(value, label, minimum = 0) {
    if (!Number.isSafeInteger(value) || value < minimum || value > 999) {
        throw Error(`${label} must be a whole number from ${minimum} to 999.`);
    }
    return value;
}

function mix(amounts, operations, catalyst = false) {
    const inputs = Object.entries(amounts).filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({material: catalogue.materials[id], qty}));
    if (catalyst) inputs.push({material: catalogue.materials['catalyst-stone'], qty: 1, role: 'catalyst'});
    return resolveBatch(law, {inputs, process: operations.map(op => ({op}))});
}

// The classroom Draught of Living Death runs on the shared brew law
// (world_packs/hp_brew_pack.js); this adapter keeps its long-standing return
// shape for the HP bench. Storage loss is now its own retained amount
// (spentBeans), no longer counted as bean solids (BRC9).
export function brewWorkshopDraught({preparation = 'crush', beanUnits = 12, precursor = 6, carrier = 94, strokes = '',
    storage = {days: 0, vessel: 'open'}} = {}) {
    if (!['crush', 'slice'].includes(preparation)) throw Error('Choose crush or slice.');
    if (typeof strokes !== 'string' || !/^[LR]{0,64}$/.test(strokes)) throw Error('Enter up to 64 strokes using L and R.');
    quantity(beanUnits, 'Bean units', 1);
    quantity(precursor, 'Precursor');
    quantity(carrier, 'Carrier', 1);
    quantity(storage?.days, 'Storage days');
    if (!['open', 'sealed'].includes(storage.vessel)) throw Error('Choose open or sealed storage.');
    const {facts, cues} = brewDraughtOfLivingDeath({preparation, beanUnits, precursor, carrier, strokes, storage});
    const {batch, out} = facts.brew;
    const cue = DRAUGHT_OF_LIVING_DEATH.cues;
    const amounts = Object.fromEntries([...axes, 'matrix', 'settled'].map(id => [id, 0]));
    for (const [id, n] of Object.entries(batch)) {
        if (id.endsWith(':matrix')) amounts.matrix += n;
        else amounts[id] = (amounts[id] ?? 0) + n;
    }
    const mass = Object.values(batch).reduce((n, v) => n + v, 0);
    const spentBeans = out.retained['bean:spent'] ?? 0, beanSolids = out.retained.bean ?? 0;
    const juice = beanUnits - spentBeans - beanSolids;
    return {
        method: 'draught', mass, amounts,
        observations: {afterAddition: cues.afterAddition.includes(cue.afterAddition.cue) ? cue.afterAddition.cue : cue.afterAddition.below,
            afterStirring: cues.afterStirring.includes(cue.afterStirring.cue) ? cue.afterStirring.cue : cue.afterStirring.below},
        spent: {carrier, precursor, beanUnits}, retained: {beanSolids, spentBeans},
        trace: [{step: 'storage', ...storage, extractable: beanUnits - spentBeans}, {step: preparation, juice, solids: beanSolids},
            ...(facts.reactions ?? []), ...(facts.strokes ?? []).map(row => ({step: 'stir', ...row}))],
        basis: 'Harry Potter book 6, chapter 9, anchors the preparation and colour changes. Quantities, thresholds and checkpoint predictions are original game tuning.',
    };
}

export function brewWorkshopAntidote({remedyA = 4, remedyB = 4, binder = 0, hot = false, cool = false,
    catalyst = false, steps, burden = {a: 2, b: 2, blend: 2}} = {}) {
    for (const [label, value] of Object.entries({remedyA, remedyB, binder})) quantity(value, label);
    if ([hot, cool, catalyst].some(value => typeof value !== 'boolean')) throw Error('Hot, cool and catalyst must be true or false.');
    for (const key of ['a', 'b', 'blend']) quantity(burden?.[key], `Burden ${key}`);
    const operations = bindAntidoteMethod(steps ?? [...(hot ? ['heat'] : []), cool ? 'cool' : 'warm']).map(op => op.reaction);
    const {product, debits, retained, trace} = mix({carrier: 1, remedyA, remedyB, binder}, operations, catalyst);
    const {composition: amounts} = product;
    const {outputs} = cancelOutputs(phialRules, {phial: {...burden, remedyA: amounts.remedyA,
        remedyB: amounts.remedyB, joint: Math.floor(amounts.joint / 3)}});
    const remaining = Object.fromEntries(['a', 'b', 'blend'].map(key => [key, outputs.phial?.[key] ?? 0]));
    return {
        method: 'antidote', mass: product.mass, amounts, spent: debits, retained, trace, remaining,
        observation: Object.values(remaining).some(value => value > 0) ? 'Some of the burden remains.' : 'All three burdens cleared.',
        basis: 'Harry Potter book 6, chapter 18, supplies the blend requirement. The assay materials, conditions and effects are original game tuning.',
    };
}
