import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeCatalogue as cat} from '../src/native_material_catalogue.js';
import {gradeMaterialFit} from '../src/craft_material_fit.js';
import {defineRecipe, matchRecipe, recognizeRecipe} from '../src/craft_recipes.js';
import {defineCraftLaw, resolveBatch} from '../src/craft_resolver.js';
import {createCraftState, freezeRecipe, validateCraftState} from '../src/craft_state.js';

const input = (id, qty = 1, extra = {}) => ({material: cat.materials[id], qty, ...extra});
const slot = (id, role, select, qty = [1, 1], extra = {}) => ({id, role, select, qty, ...extra});
const recipe = slots => defineRecipe(cat, {id: 'original-test-fit', revision: 1, slots});
const meat = {tags: 'meat'}, fat = {material: 'Animal fat'};

test('independent essential is not averaged away; unknown essential is not a measured absence', () => {
    const profile = {targets: [{axis: 'oil', value: 800}, {axis: 'resin', value: 700}], floor: 500};
    assert.equal(gradeMaterialFit(cat, cat.materials['Animal fat'], profile).status, 'accepted');
    const essential = {property: {axis: 'resin', min: 1}};
    assert.deepEqual(gradeMaterialFit(cat, cat.materials['Animal fat'], {...profile, essential}),
        {status: 'rejected', permille: 0, reason: 'An essential condition is not met.'});
    const hidden = {...profile, essential, targets: [{axis: 'oil', value: 100}]};
    const observe = {knows: (_id, axis) => axis !== 'resin'};
    assert.deepEqual(gradeMaterialFit(cat, cat.materials['Animal fat'], hidden, observe),
        gradeMaterialFit(cat, cat.materials['Tree sap'], hidden, observe));
    assert.equal(gradeMaterialFit(cat, cat.materials['Animal fat'], hidden, observe).status, 'unknown');
});

test('fit/recipe authoring validates full vocabulary even in irrelevant branches', () => {
    assert.throws(() => gradeMaterialFit(cat, cat.materials['Animal fat'], {
        tags: {any: ['fat', 'invented-tag']}, targets: [{axis: 'oil', value: 1}]}), /Unknown query tag/);
    assert.throws(() => recipe([slot('a', 'base', {tags: {any: ['fat', 'invented-tag']}})]), /Unknown query tag/);
    assert.throws(() => recipe([slot('a', 'base', {property: {axis: 'invented', min: 1}})]), /Unknown axis/);
    assert.throws(() => gradeMaterialFit(cat, cat.materials['Animal fat'], {
        targets: [{axis: 'oil', value: 1, unit: 'litres'}]}), /Incompatible unit/);
});

test('reference, alternate and blend allocate all explicitly selected physical portions', () => {
    const r = recipe([slot('base', 'base', meat, [2, 2])]);
    for(const inputs of [[input('Boar meat', 2)], [input('Goat meat', 2)],
        [input('Boar meat'), input('Goat meat')]]) {
        const before = JSON.stringify(inputs), m = matchRecipe(cat, r, inputs);
        assert.equal(m.ok, true);
        assert.equal(m.assignment.base.qty, 2);
        assert.equal(m.debits.reduce((n, row) => n + row.qty, 0), 2);
        assert.equal(m.retained.length, 0);
        assert.deepEqual(m.debits.map(row => [row.input, row.material, row.qty]),
            inputs.map((lot, index) => [index, lot.material.id, lot.qty]));
        assert.equal(JSON.stringify(inputs), before, 'quote does not mutate');
    }
    assert.equal(matchRecipe(cat, r, [input('Boar meat', 3)]).ok, false, 'never silently uses only the minimum');
    assert.equal(matchRecipe(cat, r, [input('Boar meat'), input('Lamp oil')]).ok, false);
});

test('simultaneous compatible functions share one physical debit only when authored', () => {
    const slots = [slot('binder', 'binder', {tags: 'binder'}, [2, 2], {share: 'paste'}),
        slot('carrier', 'solvent', {tags: 'solvent'}, [2, 2], {share: 'paste'})];
    const m = matchRecipe(cat, recipe(slots), [input('Animal fat', 2, {key: 'held:fat'})]);
    assert.equal(m.ok, true);
    assert.equal(m.assignment.binder.qty, 2);
    assert.equal(m.assignment.carrier.qty, 2);
    assert.deepEqual(m.debits, [{input: 0, material: 'Animal fat', qty: 2, key: 'held:fat'}]);
    assert.equal(matchRecipe(cat, recipe(slots.map(({share, ...s}) => s)), [input('Animal fat', 2)]).ok, false);
    assert.throws(() => recipe([slots[0], {...slots[1], role: 'catalyst'}]), /cannot share/);
    assert.throws(() => recipe([slots[0], {...slots[1], qty: [3, 3]}]), /do not overlap/);
});

test('competing uses split available amounts without greedy allocation or double spending', () => {
    const r = recipe([slot('flexible', 'solvent', {tags: 'solvent'}), slot('binder', 'binder', fat)]);
    const m = matchRecipe(cat, r, [input('Animal fat'), input('Lamp oil')]);
    assert.equal(m.ok, true, 'flexible role must leave the unique binder available');
    assert.equal(m.assignment.flexible.material, 'Lamp oil');
    assert.equal(m.assignment.binder.material, 'Animal fat');
    const split = recipe([slot('fuel', 'base', fat), slot('carrier', 'solvent', fat)]);
    assert.equal(matchRecipe(cat, split, [input('Animal fat')]).ok, false);
    assert.equal(matchRecipe(cat, split, [input('Animal fat', 2)]).ok, true);
    const partlyShared = recipe([slot('binder', 'binder', fat, [1, 1], {share: 'held'}),
        slot('carrier', 'solvent', fat, [1, 1], {share: 'held'}), slot('burned', 'base', fat)]);
    const used = matchRecipe(cat, partlyShared, [input('Animal fat', 2)]);
    assert.equal(used.ok, true);
    assert.equal(used.debits[0].qty, 2, 'retained qualities plus a distinct burned portion');
});

test('retained catalysts reserve real amounts and do not contribute consumed mass', () => {
    const r = recipe([slot('base', 'base', meat), slot('first', 'catalyst', fat), slot('second', 'catalyst', fat)]);
    assert.equal(matchRecipe(cat, r, [input('Boar meat'), input('Animal fat', 1, {role: 'catalyst'})]).ok, false);
    const selected = [input('Boar meat'), input('Animal fat', 2, {role: 'catalyst'})];
    const m = matchRecipe(cat, r, selected);
    assert.equal(m.ok, true);
    assert.equal(m.retained[0].qty, 2);
    assert.deepEqual(m.debits.map(row => row.material), ['Boar meat']);
    const law = defineCraftLaw({id: 'retention-test', revision: 1, catalogue: cat});
    const resolved = resolveBatch(law, {inputs: selected});
    assert.equal(resolved.product.mass, cat.basis);
    assert.deepEqual(resolved.retained, [{material: 'Animal fat', qty: 2}]);
});

test('recognition requires actual declared process, law and station, independent of recipe stamp', () => {
    const law = defineCraftLaw({id: 'original-allocation-test', revision: 1, catalogue: cat,
        ops: [{id: 'mix', levels: [1, 2]}]});
    const r = defineRecipe(cat, {id: 'named-paste', revision: 1, law: law.ref, station: 'bench',
        slots: [slot('base', 'base', meat)], process: [{op: 'mix', levels: [1, 1]}]});
    const inputs = [input('Boar meat')], options = {process: [{op: 'mix', level: 1}], law: law.ref, stations: ['bench']};
    assert.equal(matchRecipe(cat, r, inputs).ok, true, 'ingredient comparison stays compatible');
    assert.equal(recognizeRecipe(cat, r, inputs).recognized, false);
    assert.equal(recognizeRecipe(cat, r, inputs, options).ref, r.ref);
    assert.equal(recognizeRecipe(cat, r, inputs, {...options, process: [{op: 'mix', level: 2}]}).recognized, false);
    assert.equal(recognizeRecipe(cat, r, inputs, {...options, process: [{op: 'mix'}]}).recognized, false);
    assert.equal(recognizeRecipe(cat, r, inputs, {...options, law: 'other@1'}).recognized, false);
    assert.equal(recognizeRecipe(cat, r, inputs, {...options, stations: []}).recognized, false);
    const ordinary = resolveBatch(law, {inputs, process: options.process});
    const stamped = resolveBatch(law, {inputs, process: options.process, recipe: {ref: 'arbitrary@1'}});
    assert.deepEqual(ordinary.product.outputs, stamped.product.outputs);
    assert.equal(recognizeRecipe(cat, r, [input('Lamp oil')], options).recognized, false);
});

test('blend resolution preserves side constituents, reaction products and fractional rounding', () => {
    const law = defineCraftLaw({id: 'original-blend-test', revision: 1, catalogue: cat,
        ops: [{id: 'prepare', converts: [{from: 'oil', to: 'resin', permille: 333}]}],
        reactions: [{id: 'interact', after: 'prepare', reactants: {oil: 1, resin: 1}, products: {ash: 2}}],
        outputs: [{id: 'grit', route: 'topical', effect: 'cleaning', axis: 'ash', per: 10, mode: 'total'}]});
    const inputs = [input('Animal fat'), input('Tree sap')];
    const {product, trace, debits} = resolveBatch(law, {inputs, process: [{op: 'prepare', level: 1}]});
    assert.equal(product.mass, 2000);
    assert.equal(Object.values(product.composition).reduce((n, amount) => n + amount, 0), 2000);
    assert.deepEqual(debits, [{material: 'Animal fat', qty: 1}, {material: 'Tree sap', qty: 1}]);
    assert.equal(trace[0].moved, 266, 'round conversion down and retain the remainder');
    assert.equal(product.composition.oil, 0);
    assert.equal(product.composition.resin, 432);
    assert.equal(product.composition.ash, 1068);
    assert.ok(product.outputs.topical.cleaning > 0);
    assert.equal(product.composition.matrix, 500, 'side constituents are not discarded by a fit score');
});

test('unknown matching remains a trial, while malformed or repeated exact stock cannot allocate', () => {
    const r = recipe([slot('fat', 'base', {property: {axis: 'oil', min: 100}}, [2, 2])]);
    const hidden = matchRecipe(cat, r, [input('Boar meat'), input('Goat meat')], {knows: () => false});
    assert.equal(hidden.ok, false); assert.deepEqual(hidden.unknown, ['fat']); assert.deepEqual(hidden.problems, []);
    assert.throws(() => matchRecipe(cat, r, [input('Boar meat', 0.5)]), /whole units/);
    assert.throws(() => matchRecipe(cat, r, [input('Boar meat', 1, {key: 'same'}), input('Goat meat', 1, {key: 'same'})]), /key once/);
});

test('capacity allocation agrees with exhaustive small physical allocations', () => {
    const cases = [fat, {tags: 'solvent'}, {tags: 'binder'}, {tags: 'fuel'}];
    // Exhaustive oracle describes allowed physical partitions, independently
    // of the circulation implementation and its traversal order.
    for(const a of cases) for(const b of cases) for(let n = 1; n <= 3; n++) {
        const lots = [input('Animal fat', n), input('Lamp oil', 1)];
        const r = recipe([slot('a', 'base', a, [1, 2]), slot('b', 'solvent', b, [1, 2])]);
        const accepts = (selector, lot) => selector.material ? selector.material === lot.material.id
            : lot.material.tags.includes(selector.tags);
        let possible = false;
        for(let firstFat = 0; firstFat <= n; firstFat++) for(let firstOil = 0; firstOil <= 1; firstOil++) {
            const amounts = [[firstFat, firstOil], [n - firstFat, 1 - firstOil]];
            if(amounts.every((row, group) => {
                const sum = row.reduce((total, qty) => total + qty, 0);
                return sum >= 1 && sum <= 2 && row.every((qty, i) => !qty || accepts(group ? b : a, lots[i]));
            })) possible = true;
        }
        const m = matchRecipe(cat, r, lots);
        assert.equal(m.ok, possible, JSON.stringify({a, b, n}));
        if(m.ok) for(let i = 0; i < lots.length; i++) {
            assert.equal(Object.values(m.assignment).reduce((sum, entry) =>
                sum + entry.allocations.filter(row => row.input === i).reduce((n, row) => n + row.qty, 0), 0), lots[i].qty);
        }
    }
});


test('shared-function recipe remains valid through the existing frozen recipe owner', () => {
    const law = defineCraftLaw({id: 'original-shared-save-test', revision: 1, catalogue: cat});
    const r = defineRecipe(cat, {id: 'shared-paste', revision: 1, law: law.ref, slots: [
        slot('binder', 'binder', fat, [1, 1], {share: 'paste'}),
        slot('carrier', 'solvent', fat, [1, 1], {share: 'paste'})], process: []});
    const owner = freezeRecipe(createCraftState({world: 'original.fixture', life: 0}), r);
    const reloaded = JSON.parse(JSON.stringify(owner));
    assert.doesNotThrow(() => validateCraftState(reloaded, {catalogues: {[cat.ref]: cat}, laws: {[law.ref]: law}}));
    assert.equal(recognizeRecipe(cat, reloaded.recipes[r.id].recipe, [input('Animal fat')], {law: law.ref, process: []}).recognized, true);
});
