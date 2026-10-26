import test from 'node:test';
import assert from 'node:assert/strict';
import {assessIngredientWorldFit, NATIVE_HP_ABRASION_LAW} from '../src/ingredient_world_fit.js';
import {nativeMaterialFor, nativeCatalogue} from '../src/native_material_catalogue.js';
import {planMaterialSplit} from '../src/material_lineage.js';

const input = () => ({definitionWorld: 'base.frontier', hostWorld: 'book.hp', use: 'cauldron-abrasion',
    material: nativeMaterialFor('Bonemeal'), form: 'powdered', carrier: 'water-suspension', application: 'manual-scour'});

test('selected foreign powder supplies physical abrasion under its declared ORIGINAL law', () => {
    const fit = assessIngredientWorldFit(input());
    assert.equal(fit.eligible, true);
    assert.equal(fit.contribution, 'physical-abrasion');
    assert.equal(fit.law.status, 'ORIGINAL');
    assert.equal(fit.law.catalogue, nativeCatalogue.ref);
    assert.equal(fit.canonicalIdentity, 'not-established');
    assert.equal(fit.activePower, 'not-established');
    assert.deepEqual(fit.missingMeans, []);
});

test('actual powder, carrier and manual application are required independently', () => {
    for(const [field, required] of [['form', 'powdered-form'], ['carrier', 'water-suspension'], ['application', 'manual-scour']]) {
        const q = input(); delete q[field];
        const fit = assessIngredientWorldFit(q);
        assert.equal(fit.status, 'unmet-means');
        assert.equal(fit.eligible, false);
        assert.deepEqual(fit.missingMeans, [required]);
        assert.equal(fit.law.id, NATIVE_HP_ABRASION_LAW.id);
    }
});

test('reverse structural repair and other unmodelled directions stay inert without a law', () => {
    const stock = {hpBatch: {dosesLeft: 2, custody: 'carried'}, money: 5};
    const before = structuredClone(stock);
    for(const q of [
        {...input(), definitionWorld: 'book.hp', hostWorld: 'base.frontier', use: 'structural-repair'},
        {...input(), hostWorld: 'book.lotm'},
        {...input(), use: 'polyjuice-identity'},
        {...input(), definitionWorld: null},
    ]) {
        assert.deepEqual(assessIngredientWorldFit(q), {eligible: false, status: 'missing-law', law: null,
            missingMeans: [], contribution: null, canonicalIdentity: 'not-established', activePower: 'not-established'});
    }
    assert.deepEqual(stock, before);
});

test('definition identity and real profile matter; similarity and proposed symbolism do not authorize substitution', () => {
    for(const id of ['Monster bone', 'Potash', 'Animal fat'])
        assert.equal(assessIngredientWorldFit({...input(), material: nativeMaterialFor(id)}).status, 'unsupported-material');
    assert.equal(assessIngredientWorldFit({...input(), material: null}).status, 'unsupported-material');
    const forged = structuredClone(nativeMaterialFor('Bonemeal'));
    forged.tags.push('cleansing');
    assert.throws(() => assessIngredientWorldFit({...input(), material: forged}), /disagrees with its catalogue/);
});

test('unknown birthplace, contact, consecration, former owner and familiarity do not decide mechanical abrasion', () => {
    const reference = assessIngredientWorldFit(input());
    for(const context of [
        {originWorld: null, departureWorld: null, familiarity: 0},
        {originWorld: 'elsewhere', contacts: ['old-relic'], consecration: true, priorOwner: 'saint', familiarity: 100},
        {known: false, belief: 'not useful', symbols: ['deathly'], activePower: 'claimed'},
    ]) assert.deepEqual(assessIngredientWorldFit({...input(), ...context}), reference);
});

test('splitting held powder preserves exact identity; a fit quote does not mint or debit stock', () => {
    const split = planMaterialSplit({item_key: 'Bonemeal', available: 3, count: 1});
    assert.deepEqual(split.fragments, [{item_key: 'Bonemeal', count: 1}, {item_key: 'Bonemeal', count: 2}]);
    const owners = {inventory: {Bonemeal: 3}, clock: 10, knowledge: {}, draw: 7};
    const q = {...input(), owners};
    const before = JSON.stringify(q);
    const first = assessIngredientWorldFit(q);
    first.law.sourceRefs.push('caller edit');
    assert.equal(assessIngredientWorldFit(JSON.parse(before)).law.sourceRefs.includes('caller edit'), false);
    assert.equal(JSON.stringify(q), before);
    assert.deepEqual(owners.inventory, {Bonemeal: 3});
});
