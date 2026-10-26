// Audit probes, synthetic inputs only. Run from repository root with node.
import assert from 'node:assert/strict';
import {nativeCatalogue as c} from '../../../../../../src/native_material_catalogue.js';
import {gradeMaterialFit} from '../../../../../../src/craft_material_fit.js';
import {defineRecipe, matchRecipe, selectorMatches} from '../../../../../../src/craft_recipes.js';
import {defineProcess, processGaps} from '../../../../../../src/dose_process.js';
import {defineCraftLaw, resolveBatch} from '../../../../../../src/craft_resolver.js';

const goat = c.materials['Goat meat'], fat = c.materials['Animal fat'];
const result = {};
// An axis used as an essential condition cannot safely be encoded as a score.
result.zeroResinAccepted = gradeMaterialFit(c, goat, {floor: 500,
    targets: [{axis: 'oil', value: 80}, {axis: 'resin', value: 100}]});
assert.equal(goat.properties.resin, 0);
assert.equal(result.zeroResinAccepted.status, 'accepted');
assert.equal(result.zeroResinAccepted.permille, 500);
const slot = (id, select, qty = [1, 1]) => ({id, role: 'active', select, qty});
const recipe = (id, slots, extra = {}) => defineRecipe(c, {id, revision: 1, slots, ...extra});
result.blend = matchRecipe(c, recipe('audit.blend', [slot('oil', {tags: 'meat'}, [2, 2])]),
    [{material: goat, qty: 1}, {material: c.materials['Crab meat'], qty: 1}]);
assert.equal(result.blend.ok, false);
result.shared = matchRecipe(c, recipe('audit.shared', [slot('binder', {tags: 'binder'}), slot('solvent', {tags: 'solvent'})]),
    [{material: fat, qty: 1}]);
assert.equal(result.shared.ok, false);
result.unknownNumeric = selectorMatches(c, {property: {axis: 'oil', min: 80}}, goat, () => false);
result.unknownTag = selectorMatches(c, {tags: 'meat'}, goat, () => false);
assert.equal(result.unknownNumeric, 'unknown');
assert.equal(result.unknownTag, 'yes');
const processRecipe = recipe('audit.process', [slot('source', {material: goat.id})], {process: [{op: 'test', levels: [1, 1]}]});
result.omittedProcess = matchRecipe(c, processRecipe, [{material: goat, qty: 1}]);
result.wrongProcess = matchRecipe(c, processRecipe, [{material: goat, qty: 1}], {process: []});
assert.equal(result.omittedProcess.ok, true);
assert.equal(result.wrongProcess.ok, false);
// Descriptors can carry requirements that processGaps does not execute.
const row = defineProcess({id: 'audit.units', world: 'audit', name: 'Audit', minutes: 1,
    slots: [{id: 'source', role: 'carrier', select: {material: 'different'}, key: 'held', qty: 1,
        unit: 'ml', amount: '10', require: {provenance: 'required-origin'}}]});
result.descriptorOnly = processGaps(row, {held: 1});
assert.equal(result.descriptorOnly.ok, true);
const law = defineCraftLaw({id: 'audit.law', revision: 1, catalogue: c, carrier: 'audit', ops: [], reactions: [], outputs: [], tagLaws: []});
const request = {inputs: [{material: goat, qty: 1}]};
const plain = resolveBatch(law, request).product;
const stamped = resolveBatch(law, {...request, recipe: {ref: 'audit.unvalidated@1'}}).product;
assert.deepEqual(plain.composition, stamped.composition);
assert.deepEqual(plain.outputs, stamped.outputs);
result.recipeStamp = {plain: plain.recipe, stamped: stamped.recipe, identityChanged: plain.id !== stamped.id, physicalResultUnchanged: true};
assert.equal(result.recipeStamp.identityChanged, true);
console.log(JSON.stringify(result, null, 2));
