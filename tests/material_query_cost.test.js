import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCatalogue} from '../src/craft_materials.js';
import {nativeCatalogue} from '../src/native_material_catalogue.js';
import {queryRenderingSources, renderingSources, registerRenderingRecipes} from '../src/native_rendering_recipes.js';
import {loadNative, STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';

function fixture(revision, oil, {basis = 1000, kind = 'fraction', referenceOil = 100} = {}) {
    return defineCatalogue({id: 'query.cost', revision, basis, axes: [{id: 'oil', kind}],
        tags: [{id: 'meat', kind: 'physical', revision: 1}], materials: [
            {id: 'Boar meat', revision, tags: ['meat'], properties: {oil: referenceOil}},
            {id: 'candidate', revision, tags: ['meat'], properties: {oil}},
        ]});
}

test('a truncated diagnostic cannot mislabel unsupported units or hide an invalid reference', () => {
    for(const catalogue of [fixture(1, 80, {basis: 100}), fixture(1, 80, {kind: 'scalar'})])
        assert.throws(() => queryRenderingSources({catalogue, maxCandidates: 0}), /Unsupported rendering units/);
    assert.throws(() => queryRenderingSources({catalogue: fixture(1, 80, {referenceOil: 0}), maxCandidates: 0}), /positive-oil reference/);
});

test('budgeted rendering diagnostics report incomplete coverage without changing the complete native result', () => {
    const before = JSON.stringify(nativeCatalogue.materials);
    const complete = queryRenderingSources();
    assert.deepEqual(complete.sources, renderingSources());
    assert.equal(complete.coverage.complete, true);
    assert.equal(complete.cost.fitEvaluations, Object.keys(nativeCatalogue.materials).length - 1);
    const limited = queryRenderingSources({maxCandidates: 2});
    assert.deepEqual(limited.coverage, {examined: 2, total: complete.coverage.total, complete: false, reason: 'candidate-budget'});
    assert.equal(limited.cost.fitEvaluations, 2);
    assert.deepEqual(limited.sources, [], 'an empty partial result is not exhaustive rejection');
    assert.equal(queryRenderingSources({maxCandidates: 0}).coverage.complete, false);
    assert.deepEqual(queryRenderingSources().sources, complete.sources, 'partial search must not poison later complete results');
    assert.equal(JSON.stringify(nativeCatalogue.materials), before, 'selection does not mutate the catalogue');
    assert.throws(() => queryRenderingSources({maxCandidates: -1}), /budget/);
});

test('rendering reads catalogue identity and current contribution on every call', () => {
    const first = queryRenderingSources({catalogue: fixture(1, 80)});
    const revised = queryRenderingSources({catalogue: fixture(2, 100)});
    assert.equal(first.catalogue, 'query.cost@1'); assert.equal(revised.catalogue, 'query.cost@2');
    assert.equal(first.sources[0].count, 4); assert.equal(revised.sources[0].count, 3);
    assert.deepEqual(first.sources[0].contribution, {model: 'fixed-batch', unit: 'oil-permille-pieces', target: 300,
        supplied: 320, expectedLoss: 20, disposition: 'expected-rendering-loss'});
    assert.equal(revised.sources[0].contribution.expectedLoss, 0);
    assert.equal(queryRenderingSources({catalogue: fixture(1, 0)}).sources.length, 0, 'even equal revision labels cannot return a cached old value');
});

test('real recipe registration retains measured coverage and the fixed-batch contribution disposition', async () => {
    class Recipe {constructor(spec) {Object.assign(this, spec);}}
    const base = {recipe_type: 'item', result: {id: 'Animal fat', count: 1}, recipe_level: [1, 2], recipe_skill: 'Cooking',
        success_chance: [1, 1], isUnlocked: () => true, getAvailabilityComponent: () => null};
    const recipes = {cooking: {items: {'Animal fat': base}}};
    const report = registerRenderingRecipes({recipes, ItemRecipe: Recipe, knowsItem: () => true});
    assert.equal(report.coverage.complete, true);
    assert.equal(report.cost.fitEvaluations, report.coverage.total);
    const goat = recipes.cooking.items['Render animal fat from Goat meat'];
    assert.deepEqual(goat.materials, [{material_id: 'Goat meat', count: 4}]);
    assert.deepEqual(goat.result, base.result);
    assert.equal(goat.materialContribution.expectedLoss, 20);
    assert.equal(goat.isUnlocked(), true);
    const native = await loadNative(`export {recipes} from './src/crafting_recipes.js';`, {stubs: STANCE_LOCATION_STUBS});
    assert.deepEqual(native.recipes.cooking.items['Render animal fat from Goat meat'].materialContribution, goat.materialContribution);
});
