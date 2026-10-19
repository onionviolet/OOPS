// Crafting engine: optional save owner and knowledge projection.
// One owner per datum: frozen generated materials and recipes (GR3), crafted
// products with their retained law revision (audit R6), observer-scoped
// knowledge (AB3, GR5) and harvest nodes. All functions are pure and return
// a new owner. Absent owner = old save; nothing is created on load.
import {copyJson as plainCopy, natural as nat, sameJson as same} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {MATRIX, validateMaterial} from './craft_materials.js';
import {validateBatchProduct} from './craft_resolver.js';
import {defineRecipe} from './craft_recipes.js';
import {createSourceState, validateSourceState} from './craft_sources.js';

export const CRAFT_SCHEMA = 1;
const fail = message => { throw new Error(message); };
const text = (value, label) => typeof value === 'string' && value.length ? value : fail(`${label} must be non-empty text.`);

export function createCraftState(scope) {
    return {schema: CRAFT_SCHEMA, scope: {world: text(scope?.world, 'World'), life: scope.life ?? 0}, sequence: 0,
        materials: {}, recipes: {}, products: {}, knowledge: {}, sources: createSourceState()};
}

const bump = state => ({...state, sequence: state.sequence + 1});
// Freeze on reveal: first sight stores the value; a later different value for
// the same ID is a content drift and is rejected rather than overwritten.
export function freezeMaterials(state, catalogue, materials) {
    const next = {...state, materials: {...state.materials}};
    for(const m of materials) {
        const v = plainCopy(validateMaterial(catalogue, m));
        if(catalogue.materials[v.id]) continue; // authored truth lives in content
        const prior = next.materials[v.id];
        if(prior && !same(prior, v)) fail(`Frozen material ${v.id} would change.`);
        next.materials[v.id] = v;
    }
    return bump(next);
}
export function freezeRecipe(state, recipe, witness = null) {
    const prior = state.recipes[recipe.id];
    const record = {recipe: plainCopy(recipe), witness: witness ? plainCopy(witness) : null};
    if(prior && !same(prior.recipe, record.recipe)) fail(`Frozen recipe ${recipe.id} would change.`);
    return bump({...state, recipes: {...state.recipes, [recipe.id]: prior ?? record}});
}
export function recordProduct(state, product) {
    const prior = state.products[product.id];
    if(prior && !same(prior, product)) fail(`Product ${product.id} disagrees with its stored record.`);
    return bump({...state, products: {...state.products, [product.id]: prior ?? plainCopy(product)}});
}
export function setSourceNode(state, key, node) {
    return {...state, sources: {...state.sources, nodes: {...state.sources.nodes, [key]: {...node}}}};
}

// Knowledge is facts an observer has seen, never a second truth (GR5).
// facts: ['axis:restore', 'route:oral', 'effect:oral.health', 'tag:toxic', 'name']
export function observe(state, observer, subject, facts, at) {
    text(observer, 'Observer'); text(subject, 'Subject');
    if(!nat(at)) fail('Observation time must be a game minute.');
    if(!state.materials[subject] && !state.products[subject] && !state.recipes[subject] && !subject.startsWith('authored:')) fail(`Unknown subject ${subject}.`);
    const prior = state.knowledge[observer]?.[subject] ?? {facts: [], firstAt: at};
    const merged = [...new Set([...prior.facts, ...facts.map(f => text(f, 'Fact'))])].sort(compareCodePoints);
    return bump({...state, knowledge: {...state.knowledge, [observer]: {...state.knowledge[observer], [subject]: {facts: merged, firstAt: prior.firstAt, lastAt: at}}}});
}
export const knows = (state, observer, subject, fact) => state.knowledge[observer]?.[subject]?.facts.includes(fact) ?? false;
// Adapter for recipe matching: what this observer knows about material axes.
export const knowsAxis = (state, observer) => (materialId, axis) =>
    knows(state, observer, materialId, `axis:${axis}`) || knows(state, observer, `authored:${materialId}`, `axis:${axis}`);

// What an observer may be shown. Unknown truths stay out of names, tags,
// ordering keys and tooltips (audit R3).
export function projectProduct(state, catalogue, productId, observer) {
    const product = state.products[productId] ?? fail(`Unknown product ${productId}.`);
    const facts = new Set(state.knowledge[observer]?.[productId]?.facts ?? []);
    const effects = [];
    for(const [route, byEffect] of Object.entries(product.outputs)) for(const [effect, value] of Object.entries(byEffect))
        if(facts.has(`effect:${route}.${effect}`)) effects.push({route, effect, value});
    const tags = product.tags.filter(t => facts.has(`tag:${t}`) && catalogue.registry.get(t)?.visible !== 'hidden');
    const known = effects.length > 0 || tags.length > 0;
    return {id: productId, name: known ? `${product.carrier} (${[...effects.map(e => e.effect), ...tags].join(', ')})` : `Unidentified ${product.carrier.toLowerCase()}`,
        identified: known, effects, tags, mass: product.mass,
        inputs: product.inputs.map(([role, id, , qty]) => ({role, id, qty}))};
}
export function projectMaterial(state, catalogue, materialId, observer) {
    const m = catalogue.materials[materialId] ?? state.materials[materialId] ?? fail(`Unknown material ${materialId}.`);
    const subject = catalogue.materials[materialId] ? `authored:${materialId}` : materialId;
    const facts = new Set(state.knowledge[observer]?.[subject]?.facts ?? []);
    const properties = Object.fromEntries(Object.entries(m.properties)
        .filter(([axis]) => axis !== MATRIX && !catalogue.axes[axis].hidden && facts.has(`axis:${axis}`)));
    return {id: m.id, name: m.name, family: m.family, phase: m.phase, properties, unknownAxes: Object.keys(m.properties)
        .filter(a => a !== MATRIX && !catalogue.axes[a].hidden && !(a in properties)).length};
}

// laws: {ref: law}; catalogues: {ref: catalogue}. Unsupported revisions are
// rejected, never silently dropped (CR6 AB1.c).
export function validateCraftState(state, {catalogues, laws, sourceTables = {}}) {
    if(state?.schema !== CRAFT_SCHEMA || !nat(state.sequence) || !state.scope?.world) fail('Unsupported crafting owner.');
    for(const [id, m] of Object.entries(state.materials)) {
        const catalogue = catalogues[m.origin?.catalogue] ?? fail(`Material ${id} needs unsupported catalogue ${m.origin?.catalogue}.`);
        if(id !== m.id || !same(plainCopy(validateMaterial(catalogue, m)), m)) fail(`Invalid frozen material ${id}.`);
    }
    for(const [id, {recipe}] of Object.entries(state.recipes)) {
        const law = laws[recipe.law] ?? fail(`Recipe ${id} needs unsupported law ${recipe.law}.`);
        const {ref, ...spec} = recipe;
        if(id !== recipe.id || !same(plainCopy(defineRecipe(law.catalogue, spec)), recipe)) fail(`Invalid frozen recipe ${id}.`);
    }
    for(const [id, product] of Object.entries(state.products)) {
        const law = laws[product.law] ?? fail(`Product ${id} needs unsupported law ${product.law}.`);
        const materials = {...law.catalogue.materials, ...state.materials};
        if(id !== product.id) fail(`Product key mismatch ${id}.`);
        validateBatchProduct(law, product, materials);
    }
    for(const [observer, subjects] of Object.entries(state.knowledge)) for(const [subject, k] of Object.entries(subjects)) {
        if(!state.materials[subject] && !state.products[subject] && !state.recipes[subject] && !subject.startsWith('authored:')) fail(`Knowledge of unknown ${subject} by ${observer}.`);
        if(!Array.isArray(k.facts) || !nat(k.firstAt) || !nat(k.lastAt) || k.lastAt < k.firstAt) fail(`Invalid knowledge ${observer}/${subject}.`);
    }
    const table = Object.values(sourceTables)[0];
    validateSourceState(state.sources, Object.keys(sourceTables).length === 1 ? table : undefined);
    return state;
}
