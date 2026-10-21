import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gradedKey} from '../src/harvest.js';
import {planMaterialMerge, planMaterialSplit, planProcessedMaterial, readMaterialLineage} from '../src/material_lineage.js';

const process = {id: 'drying', revision: 1, at: 40, world_id: 'base.frontier', parameters: {method: 'rack'}};
const stock = (...rows) => Object.fromEntries(rows);

test('processed output retains exact parent key, birth, origin, grade and completeness through later processing', () => {
    const harvested = gradedKey('Rat pelt', 85, 'damaged');
    const first = planProcessedMaterial({
        stock: stock([harvested, 4]), inputs: [{item_key: harvested, count: 3}],
        output: {id: 'Dried rat hide', family: 'animal-hide', count: 2}, process,
        sourceFacts: {[harvested]: {born: 12, origin_world: 'base.frontier', evidence: {
            specimen: {key: 'wolf-rat-1', born: 12, damage: {hits: 2, crits: 1}, condition: 'robust'},
            observations: [{at: 30, ageEstimate: {min: 10, max: 30}}], processed_at: 40
        }}}
    });
    const lineage = readMaterialLineage(first.item_key);
    assert.deepEqual(lineage.facts, {born: 12, origin_world: 'base.frontier'});
    assert.deepEqual(lineage.history[0].inputs, [{item_key: harvested, count: 3, facts: {
        born: 12, origin_world: 'base.frontier', quality: 85, completeness: 'damaged',
        evidence: {specimen: {key: 'wolf-rat-1', born: 12, damage: {hits: 2, crits: 1}, condition: 'robust'}, observations: [{at: 30, ageEstimate: {min: 10, max: 30}}], processed_at: 40}
    }}]);
    const split = planMaterialSplit({item_key: first.item_key, available: 2, count: 1});
    const merged = planMaterialMerge(split.fragments);
    assert.equal(merged.item_key, first.item_key);
    assert.deepEqual(readMaterialLineage(merged.item_key), lineage, 'split and merge retain the entire immutable lineage key');

    const second = planProcessedMaterial({
        stock: stock([first.item_key, 2]), inputs: [{item_key: first.item_key, count: 1}],
        output: {id: 'Cured rat hide', family: 'animal-hide', count: 1},
        process: {...process, id: 'curing', at: 55}
    });
    const next = readMaterialLineage(second.item_key);
    assert.equal(next.facts.born, 12, 'processing keeps the original birth minute');
    assert.equal(next.history[0].inputs[0].item_key, first.item_key, 'the exact prior record remains reachable');
    assert.deepEqual(readMaterialLineage(next.history[0].inputs[0].item_key), lineage);
});

test('splits conserve exact stack identity and quantity; only identical cohorts can merge', () => {
    const key = gradedKey('Rat pelt', 85, 'whole');
    const split = planMaterialSplit({item_key: key, available: 7, count: 2});
    assert.deepEqual(split.fragments, [{item_key: key, count: 2}, {item_key: key, count: 5}]);
    assert.equal(split.fragments.reduce((n, row) => n + row.count, 0), 7);
    assert.deepEqual(planMaterialMerge(split.fragments), {item_key: key, count: 7, consumed: split.fragments});

    assert.throws(() => planMaterialMerge([
        {item_key: key, count: 1}, {item_key: gradedKey('Rat pelt', 80, 'whole'), count: 1}
    ]), /cohorts differ/);
    assert.throws(() => planMaterialSplit({item_key: key, available: 4, count: 4}), /leave material/);
});

test('planning spends exact available input counts and rejects stale, duplicate, excessive-yield and bad revisions', () => {
    const raw = 'legacy-hide';
    const base = {stock: stock([raw, 3]), inputs: [{item_key: raw, count: 2}], output: {id: 'worked hide', family: 'animal-hide', count: 2}, process};
    assert.deepEqual(planProcessedMaterial(base).inputs, [{item_key: raw, count: 2}]);
    assert.throws(() => planProcessedMaterial({...base, stock: stock([raw, 1])}), /stale or insufficient/);
    assert.throws(() => planProcessedMaterial({...base, inputs: [{item_key: raw, count: 1}, {item_key: raw, count: 1}]}), /duplicate/);
    assert.throws(() => planProcessedMaterial({...base, output: {...base.output, count: 3}}), /exceeds consumed/);
    assert.throws(() => planProcessedMaterial({...base, process: {...process, revision: 2**54}}), /revision or time/);
});

test('legacy stock keys remain opaque and unsupported lineage revisions fail closed', () => {
    const plan = planProcessedMaterial({
        stock: stock(['native:old-key', 1]), inputs: [{item_key: 'native:old-key', count: 1}],
        output: {id: 'new material', family: 'plant-fibre', count: 1}, process
    });
    assert.equal(readMaterialLineage(plan.item_key).history[0].inputs[0].item_key, 'native:old-key');
    const invalid = JSON.stringify({id: 'x', lineage: {schema: 'oops.processed-material', revision: 2, family: 'x', facts: {}, history: []}});
    assert.throws(() => readMaterialLineage(invalid), /unsupported/);
});
