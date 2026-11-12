// Crafting engine: optional save owner and knowledge projection.
// One owner per datum: frozen generated materials and recipes (GR3), crafted
// products with their retained law revision (audit R6), observer-scoped
// knowledge (AB3, GR5) and harvest nodes. All functions are pure and return
// a new owner. Absent owner = old save; nothing is created on load.
import {copyJson as plainCopy, natural as nat, sameJson as same} from './basics.js';
import {compareCodePoints} from './gen_kit.js';
import {MATRIX, validateMaterial} from './craft_materials.js';
import {validateBatchProduct} from './craft_resolver.js';
import {defineRecipe, recognizeRecipe} from './craft_recipes.js';
import {createSourceState, validateSourceState} from './craft_sources.js';
import {createExperimentLog,recordTrial,validateExperimentLog,validateTrialSetup} from './craft_experiment_log.js';
import {validateItemKey} from './inventory_key.js';
import {readMaterialLineage} from './material_lineage.js';

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

// The settlement host supplies what the maker actually saw after publishing
// the batch. Discovery retains a reusable recipe and a witnessed product.
function validateWorkingSetup(setup, product) {
    validateTrialSetup(setup);
    const amounts=new Map();
    const keys=new Set();
    for(const {key,qty,role,material,materialRevision} of setup.inputs) {
        validateItemKey(key);
        readMaterialLineage(key);
        if(keys.has(key))fail('Duplicate physical stock in trial setup.');
        keys.add(key);
        const id=JSON.stringify([role,material,materialRevision]);
        amounts.set(id,(amounts.get(id)??0)+qty);
    }
    if(!product||setup.law!==product.law||!same(setup.process,product.process)||
        amounts.size!==product.inputs.length||product.inputs.some(([role,material,revision,qty])=>
            amounts.get(JSON.stringify([role,material,revision]))!==qty)||
        setup.conditions.consumedUnits!==product.inputs.reduce((sum,[role,,,qty])=>sum+(role==='consumed'?qty:0),0))
        fail('The trial setup does not match the resolved batch.');
}

export function recordWorkingTrial(state, product, {observer, at, effects, setup, observation}) {
    if(!Array.isArray(effects)||effects.some(({route,effect})=>!(product.outputs[route]?.[effect]>0)))
        fail('Record only effects witnessed in this trial.');
    const recorded=recordProduct(state,product);
    const witnessed=observe(recorded,observer,product.id,effects.map(({route,effect})=>`effect:${route}.${effect}`),at);
    if(setup===undefined)return witnessed;
    validateWorkingSetup(setup,product);
    const log=recordTrial(state.workingTrials?.[observer]??createExperimentLog(),{
        materials:product.inputs.map(([,material])=>material),process:product.process,
        seen:effects.map(({route,effect})=>`${route}.${effect}`),at,setup:{...setup,product:product.id},observation
    });
    return {...witnessed,workingTrials:{...state.workingTrials,[observer]:log}};
}

function validateWorkingWitness(state, law, recipe, witness) {
    const {observer,world}=recipe.origin;
    text(observer,'Observer');
    text(world,'World');
    if(!recipe.process?.length||recipe.process.some(({op,levels})=>!Object.hasOwn(law.ops,op)||levels[0]!==levels[1]))
        fail('A saved working needs exact supported operations.');
    const product=state.products[witness?.product];
    if(!product||product.law!==law.ref||!knows(state,observer,product.id,witness.fact)
        ||!Object.entries(product.outputs).some(([route,effects])=>Object.entries(effects)
            .some(([effect,value])=>value>0&&witness.fact===`effect:${route}.${effect}`)))
        fail('A working needs a witnessed useful result.');
    const inputs=product.inputs.map(([role,id,,qty])=>({role,qty,material:law.catalogue.materials[id]??state.materials[id]}));
    const process=product.process.map(([op,level])=>({op,level}));
    if(!recognizeRecipe(law.catalogue,recipe,inputs,{process,law:law.ref,stations:product.stations}).recognized)
        fail('This observation came from a different working.');
}

export function learnCraftWorking(state, law, working, {observer, product, route, effect}) {
    if(working.law!==law.ref||!working.world||!Array.isArray(working.steps)||!working.steps.length)
        fail('The working needs its original law and operations.');
    const recipe=defineRecipe(law.catalogue,{id:working.id,revision:working.revision,law:law.ref,
        slots:working.slots,process:working.steps.map(({op,level})=>({op,levels:[level,level]})),
        origin:{kind:'player-working',world:working.world,observer}});
    const witness={product,fact:`effect:${route}.${effect}`};
    validateWorkingWitness(state,law,recipe,witness);
    return freezeRecipe(state,recipe,witness);
}

export function readCraftWorking(state, id, observer) {
    const recipe=state.recipes[id]?.recipe;
    if(recipe?.origin?.kind!=='player-working'||recipe.origin.observer!==observer)return null;
    return plainCopy({id:recipe.id,revision:recipe.revision,law:recipe.law,world:recipe.origin.world,
        slots:recipe.slots,steps:recipe.process.map(({op,levels})=>({op,level:levels[0]}))});
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
    for(const [id, {recipe,witness}] of Object.entries(state.recipes)) {
        const law = laws[recipe.law] ?? fail(`Recipe ${id} needs unsupported law ${recipe.law}.`);
        const {ref, ...spec} = recipe;
        if(id !== recipe.id || !same(plainCopy(defineRecipe(law.catalogue, spec)), recipe)) fail(`Invalid frozen recipe ${id}.`);
        if(recipe.origin?.kind==='player-working')validateWorkingWitness(state,law,recipe,witness);
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
    if(state.workingTrials!==undefined) {
        if(!state.workingTrials||typeof state.workingTrials!=='object'||Array.isArray(state.workingTrials))
            fail('Invalid working trial records.');
        for(const [observer,log] of Object.entries(state.workingTrials)) {
            validateExperimentLog(log);
            for(const {setup,seen,process,materials} of log.entries) {
                const product=state.products[setup?.product];
                validateWorkingSetup(setup,product);
                const resolvedMaterials=[...new Set(product.inputs.map(([,id])=>id))].sort(compareCodePoints);
                if(!same(process,product.process)||!same(materials,resolvedMaterials))
                    fail('Working trial summary disagrees with its resolved batch.');
                if(seen.some(effect=>!knows(state,observer,setup.product,`effect:${effect}`)))
                    fail('Working trial evidence needs an observation by its maker.');
            }
        }
    }
    validateSourceState(state.sources, Object.keys(sourceTables).length === 1 ? table : undefined);
    return state;
}
