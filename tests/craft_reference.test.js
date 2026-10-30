import test from 'node:test';
import assert from 'node:assert/strict';
import {frontierCatalogue as cat, frontierBrewLaw as law, frontierSources as sources, tonicGrammar} from '../src/craft_content_frontier.js';
import {generateMaterial} from '../src/craft_materials.js';
import {generateRecipe} from '../src/craft_recipes.js';
import {resolveBatch} from '../src/craft_resolver.js';
import {createCraftState, freezeMaterials, freezeRecipe, knows, recordProduct, validateCraftState} from '../src/craft_state.js';
import {canUseRecipe, examine, examineQuote, learnFromReference, readTraining, recipeAccess, registerReference, validateReferences,
    createDemonstratedMethod, validateDemonstratedMethod, planDemonstratedRepeat, recordDemonstratedMethod, demonstratedMethods} from '../src/craft_reference.js';

const roundTrip = value => JSON.parse(JSON.stringify(value));
const owners = {catalogues: {[cat.ref]: cat}, laws: {[law.ref]: law}, sourceTables: {[sources.ref]: sources}};
function setup() {
    let state = createCraftState({world: 'base.frontier'});
    const g = generateRecipe(law, tonicGrammar, {root: 1, scope: 's', index: 0, extra: []});
    state = freezeRecipe(state, g.value, g.witness);
    const herb = generateMaterial(cat, 'reedherb', {root: 4, scope: 'w/m', index: 0}).value;
    const water = cat.materials['Spring water'];
    const {product} = resolveBatch(law, {inputs: [{material: herb, qty: 1}, {material: water, qty: 1}], process: [{op: 'steep', level: 1}]});
    state = recordProduct(freezeMaterials(state, cat, [herb]), product);
    state = registerReference(state, {id: 'book:tonics', mode: 'access', recipe: g.value.id});
    state = registerReference(state, {id: 'disk:tonics', kind: 'disk', mode: 'learn', recipe: g.value.id});
    state = registerReference(state, {id: 'book:lifting', mode: 'training', grant: {kind: 'attribute', id: 'strength', points: 1}});
    return {state, recipe: g.value.id, product: product.id};
}

test('absent owner on old saves: no access, valid, nothing created', () => {
    const state = createCraftState({world: 'w'});
    assert.equal(state.references, undefined);
    assert.deepEqual(recipeAccess(state, 'player', ['x']), {});
    assert.equal(validateReferences(state), state);
});

test('access reference supplies a recipe only while held and never teaches', () => {
    const {state, recipe} = setup();
    assert.deepEqual(recipeAccess(state, 'p', ['book:tonics'])[recipe], ['ref:book:tonics']);
    assert.equal(canUseRecipe(state, 'p', recipe, []), false, 'lost book removes access');
    assert.equal(learnFromReference(state, 'p', 'book:tonics', ['book:tonics']).ok, false);
});

test('learn-and-consume adds the known recipe; losing the item keeps it, and it needs the item held', () => {
    const {state, recipe} = setup();
    assert.equal(learnFromReference(state, 'p', 'disk:tonics', []).ok, false);
    const r = learnFromReference(state, 'p', 'disk:tonics', ['disk:tonics']);
    assert.deepEqual([r.ok, r.consumed], [true, ['disk:tonics']]);
    assert.deepEqual(recipeAccess(r.state, 'p', [])[recipe], ['learned']);
    assert.equal(canUseRecipe(r.state, 'other', recipe, []), false, 'known recipe is per actor');
    assert.doesNotThrow(() => validateReferences(roundTrip(r.state)));
});

test('training book grants once per actor read key, not per item', () => {
    const {state} = setup();
    const a = readTraining(state, 'p', 'book:lifting', ['book:lifting']);
    assert.deepEqual(a.grant, {kind: 'attribute', id: 'strength', points: 1, actor: 'p', source: 'book:lifting'});
    assert.equal(readTraining(a.state, 'p', 'book:lifting', ['book:lifting']).reason, 'already read by this actor: a second reading adds nothing new; practising the method is what builds on it');
    assert.equal(readTraining(a.state, 'q', 'book:lifting', ['book:lifting']).ok, true);
    assert.equal(readTraining(state, 'p', 'book:lifting', []).reason, 'reference not held');
});

test('examine: success identifies per observer; failure costs more, reveals nothing, is deterministic', () => {
    const {state, product} = setup();
    const t = {skill: 1, difficulty: 4, root: 7, facts: ['effect:oral.health'], cost: {minutes: 5}, at: 60};
    let s = state, fails = 0, hit;
    let base = 7; while(examine(state, 'p', product, {...t, root: base}).ok) base++; // start from a root that misses
    for(let i = 0; i < 200 && !hit; i++) {
        const r = examine(s, 'p', product, {...t, root: i ? base + i * 1009 : base});
        s = r.state;
        if(r.ok) hit = r; else { fails++; assert.deepEqual(r.facts, []); assert.equal(knows(s, 'p', product, 'effect:oral.health'), false); }
    }
    assert.ok(fails > 0 && hit, `fails=${fails} hit=${!!hit}`, 'low skill fails then eventually succeeds');
    assert.equal(hit.cost.minutes, 5 + fails, 'cost rises per miss');
    assert.equal(knows(s, 'p', product, 'effect:oral.health'), true);
    assert.equal(knows(s, 'q', product, 'effect:oral.health'), false);
    assert.deepEqual(examine(state, 'p', product, t), examine(state, 'p', product, t), 'same inputs, same draw (MR2)');
    assert.equal(examineQuote(state, 'p', product, t).cost.minutes, 5, 'quote spends nothing (MR4)');
    const reloaded = roundTrip(s);
    assert.doesNotThrow(() => { validateCraftState(reloaded, owners); validateReferences(reloaded); });
    assert.equal(examine(reloaded, 'p', product, t).ok, examine(s, 'p', product, t).ok);
});

test('forged learned recipe or read key is rejected', () => {
    const {state} = setup();
    const bad = roundTrip(state); bad.references.learned.p = ['nope'];
    assert.throws(() => validateReferences(bad), /unfrozen/);
    const bad2 = roundTrip(state); bad2.references.read.p = ['book:tonics'];
    assert.throws(() => validateReferences(bad2), /non-training/);
});

test('runtime: shelf, method gate, loss keeps learned recipe, once-only read, consumed slate', async () => {
    const rt = await import('../src/crafting_frontier_runtime.js');
    const ctx = {world: 'base.frontier', location: 'Village', clock: 100, root: 5, blocked: '', skill: 0};
    const run = (owner, inventory, request) => {
        const q = rt.quoteCrafting(owner, inventory, request, ctx);
        if(!q.eligible) return {q};
        const plan = rt.stageCrafting(owner, inventory, q, ctx);
        const next = {...inventory};
        for(const {key, amount} of plan.items) { next[key] = (next[key] ?? 0) + amount; if(!next[key]) delete next[key]; }
        return {q, plan, owner: plan.state, inventory: next};
    };
    let owner = null, inv = {};
    for(const ref of ['village.method-book', 'village.method-disk', 'village.primer']) ({owner, inventory: inv} = run(owner, inv, {type: 'acquire', ref}));
    const method = rt.referenceKey('village.method-book'), slate = rt.referenceKey('village.method-disk'), primer = rt.referenceKey('village.primer');
    assert.equal(rt.projectCrafting(owner, inv).methods[0].via[0], 'ref:village.method-book');
    const lost = {...inv}; delete lost[method];
    assert.deepEqual(rt.projectCrafting(owner, lost).methods, [], 'loss removes access');
    const back = run(owner, inv, {type: 'return', key: method});
    assert.equal(back.inventory[method], undefined, 'put back removes the object only');
    assert.deepEqual(rt.projectCrafting(back.owner, back.inventory).methods, []);
    const read = run(owner, inv, {type: 'read', key: primer});
    assert.deepEqual(read.plan.grant, {kind: 'skill', id: 'Literacy', points: 30, actor: 'player', source: 'village.primer'});
    assert.match(run(read.owner, read.inventory, {type: 'read', key: primer}).q.reason, /already read/);
    const learn = run(owner, lost, {type: 'learn', key: slate});
    assert.equal(learn.inventory[slate], undefined, 'slate consumed');
    const after = {...learn.inventory}; assert.equal(rt.projectCrafting(learn.owner, after).methods[0].via[0], 'learned');
    assert.doesNotThrow(() => rt.validateOwner(roundTrip(learn.owner)));
    const forged = roundTrip(owner); forged.references.defs['village.primer'].grant.points = 99;
    assert.throws(() => rt.validateOwner(forged), /Unknown Village reference/);
});

function demonstrated(recipe) {
    return createDemonstratedMethod({id: 'observed-1', success: true, at: 60,
        setup: {revision: 1, law: law.ref, inputs: [{key: 'held-herb', material: 'herb', qty: 1}], process: [['steep', 1]],
            conditions: {apparatus: 'village-bench', control: 1}},
        request: {type: 'craft', inputs: [{key: 'held-herb', qty: 1}], process: [{op: 'steep', level: 1}], recipe}});
}
test('demonstrated success stays separate from instruction access and observer knowledge', () => {
    const {state, recipe} = setup(), method = demonstrated(recipe), before = roundTrip(state);
    const recorded = recordDemonstratedMethod(state, 'p', method);
    assert.deepEqual(state, before);
    assert.equal(canUseRecipe(recorded, 'p', recipe, []), false, 'no permanent authored recipe access granted');
    assert.deepEqual(demonstratedMethods(recorded, 'other'), [], 'another observer was not taught');
    assert.deepEqual(recorded.knowledge, state.knowledge, 'no material or product truth revealed');
    assert.deepEqual(recorded.recipes, state.recipes, 'generated selector witness stays unchanged');
    assert.equal(recordDemonstratedMethod(recorded, 'p', method), recorded, 'same evidence is idempotent');
    const view = demonstratedMethods(recorded, 'p'); view[0].setup.inputs[0].qty = 99;
    assert.equal(demonstratedMethods(recorded, 'p')[0].setup.inputs[0].qty, 1);
    assert.deepEqual(validateReferences(roundTrip(recorded)), recorded);
    assert.throws(() => createDemonstratedMethod({...method, success: false}), /demonstrated/);
});

test('quick/guided/deep prepare the same paid request and known changes require a modified attempt', () => {
    const method = demonstrated('known-book-method'), before = roundTrip(method);
    const plans = ['quick', 'guided', 'deep'].map(mode => planDemonstratedRepeat(method, {mode, setup: method.setup}));
    assert.ok(plans.every(p => p.ok && !p.modified));
    assert.deepEqual(plans.map(p => p.request), [method.request, method.request, method.request]);
    assert.equal(plans[0].request.recipe, 'known-book-method', 'current host must still recheck access');
    assert.equal(planDemonstratedRepeat(method).ok, false, 'past setup is not current means');
    const changed = roundTrip(method.setup); changed.conditions.apparatus = 'different-bench';
    assert.equal(planDemonstratedRepeat(method, {setup: changed}).ok, false);
    const modified = planDemonstratedRepeat(method, {mode: 'guided', setup: changed, request: method.request});
    assert.equal(modified.ok, true); assert.equal(modified.modified, true);
    assert.ok(modified.comparison.changed.some(c => c.field === 'conditions.apparatus'));
    const larger = roundTrip(method.request); larger.inputs[0].qty = 2;
    assert.equal(planDemonstratedRepeat(method, {setup: method.setup, request: larger}).ok, false);
    assert.deepEqual(method, before, 'planning does not mutate demonstrated evidence');
    const bad = roundTrip(method); bad.setup.revision = 2;
    assert.throws(() => validateDemonstratedMethod(bad), /setup/);
});
