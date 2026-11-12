import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gradedKey} from '../src/harvest.js';
import {planMaterialMerge, planMaterialPartition, planMaterialSplit, planProcessedMaterial, readMaterialLineage} from '../src/material_lineage.js';

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

test('heirloom lines append dated holders and deeds, grow value, stay capped and ordered (IM12)', async () => {
    const {planHeirloomLine, heirloomLines, heirloomValue, HEIRLOOM_LINE_CAP} = await import('../src/material_lineage.js');
    const key = gradedKey('Rat pelt', 85, 'whole');
    const made = planProcessedMaterial({stock: stock([key, 1]), inputs: [{item_key: key, count: 1}], output: {id: 'Rat cloak', family: 'animal-hide', count: 1}, process, sourceFacts: {[key]: {born: 0}}});
    assert.deepEqual(heirloomLines(made.item_key), []);
    const one = planHeirloomLine({stock: stock([made.item_key, 1]), item_key: made.item_key, count: 1, at: 525600, kind: 'passed', holder: 'Ada'});
    const two = planHeirloomLine({stock: stock([one.item_key, 1]), item_key: one.item_key, count: 1, at: 1051200, kind: 'passed', holder: 'Bo'});
    assert.deepEqual(heirloomLines(two.item_key).map(l => [l.at, l.holder]), [[525600, 'Ada'], [1051200, 'Bo']]);
    const json = JSON.parse(JSON.stringify({k: two.item_key})).k; // export/import round trip
    assert.deepEqual(readMaterialLineage(json).history, readMaterialLineage(made.item_key).history);
    assert.ok(heirloomValue(two.item_key, 1051200) > heirloomValue(made.item_key, 1051200), 'lines add value');
    assert.ok(heirloomValue(made.item_key, 1051200) > heirloomValue(made.item_key, 0), 'age adds value');
    assert.throws(() => planHeirloomLine({stock: stock([one.item_key, 1]), item_key: one.item_key, count: 1, at: 5, kind: 'deed', text: 'x'}), /date order/);
    let k = two.item_key;
    for (let i = 0; i < 20; i++) k = planHeirloomLine({stock: stock([k, 1]), item_key: k, count: 1, at: 2000000 + i, kind: 'deed', text: `deed ${i}`}).item_key;
    assert.equal(heirloomLines(k).length, HEIRLOOM_LINE_CAP);
    assert.equal(heirloomLines(k).at(-1).text, 'deed 19');
    assert.throws(() => planHeirloomLine({stock: stock([key, 1]), item_key: key, count: 1, at: 1, kind: 'deed', text: 'x'}), /processed material/);
});
// Independent fixture work; installed into the focused test after slot acquisition.
test('support receipts retain exact consumed and retained inputs without inflating yield or rejuvenating stock', () => {
    const base = {stock: {'hide': 3, 'oil-lot-A': 1, 'kit-lot-A': 1},
        inputs: [{item_key: 'hide', count: 3}],
        supportInputs: [{item_key: 'oil-lot-A', count: 1, disposition: 'consumed'}, {item_key: 'kit-lot-A', count: 1, disposition: 'retained'}],
        output: {id: 'Rat pelt', family: 'animal-hide', count: 3}, process,
        sourceFacts: {hide: {born: 12}, 'oil-lot-A': {born: 1}}};
    const before = structuredClone(base);
    const plan = planProcessedMaterial(base);
    assert.deepEqual(base, before, 'planning cannot mutate inventory, evidence or caller selections');
    assert.deepEqual(plan.inputs, [{item_key: 'hide', count: 3}, {item_key: 'oil-lot-A', count: 1}]);
    const history = readMaterialLineage(plan.item_key).history[0];
    assert.deepEqual(history.inputs.slice(1).map(({item_key,count,role,disposition})=>({item_key,count,role,disposition})), [
        {item_key:'oil-lot-A',count:1,role:'support',disposition:'consumed'},
        {item_key:'kit-lot-A',count:1,role:'support',disposition:'retained'}]);
    assert.equal(plan.lineage.facts.born, 12, 'support provenance is retained without asserting it is hide birth');
    assert.throws(()=>planProcessedMaterial({...base,stock:{...base.stock,'oil-lot-A':0}}),/stale or insufficient/);
    assert.throws(()=>planProcessedMaterial({...base,stock:{...base.stock,'kit-lot-A':0}}),/stale or insufficient/);
    assert.throws(()=>planProcessedMaterial({...base,output:{...base.output,count:4}}),/exceeds consumed/,'consumed oil and retained kit cannot inflate count yield');
    assert.throws(()=>planProcessedMaterial({...base,supportInputs:[{item_key:'hide',count:1,disposition:'retained'}]}),/overlap/);
    assert.throws(()=>planProcessedMaterial({...base,supportInputs:[{item_key:'oil-lot-A',count:1,disposition:'invented'}]}),/disposition/);
});

test('forging accounts for shaped stock, recoverable scrap and scale in one transaction', () => {
    const billet = gradedKey('Iron billet', 85, 'whole');
    const hammer = gradedKey('Smithing hammer', 90, 'whole');
    const request = {
        stock: stock([billet, 2], [hammer, 1]), inputs: [{item_key: billet, count: 2}],
        supportInputs: [{item_key: hammer, count: 1, disposition: 'retained'}],
        process: {...process, id: 'forge-head'}, unit: 'grams', unitsPerInput: () => 500,
        outputs: [
            {output: {id: 'Axe head', family: 'iron', count: 1, quality: 790}, unitsPerItem: 820},
            {output: {id: 'Iron scrap', family: 'iron', count: 3}, unitsPerItem: 50}
        ],
        losses: [{reason: 'scale', amount: 30}]
    };
    const result = planMaterialPartition(request);
    assert.deepEqual(result.inputs, request.inputs);
    assert.deepEqual(result.balance, {unit: 'grams', input: 1000, output: 970, loss: 30});
    assert.deepEqual(request.stock, stock([billet, 2], [hammer, 1]));
    for (const row of JSON.parse(JSON.stringify(result.outputs))) {
        const event = readMaterialLineage(row.item_key).history[0];
        assert.equal(event.inputs[0].item_key, billet);
        assert.equal(event.inputs[1].disposition, 'retained');
    }
    assert.throws(() => planMaterialPartition({...request, losses: []}), /every input unit/);
    assert.throws(() => planMaterialPartition({...request, stock: stock([billet, 1], [hammer, 1])}), /stale or insufficient/);
});

test('advanced conversion preserves its exact parent on success and accounts for a spent parent on failure', () => {
    const sword = gradedKey('Iron sword', 82, 'whole');
    const request = {
        stock: stock([sword, 1]), inputs: [{item_key: sword, count: 1}],
        process: {...process, id: 'bind-artifact', world_id: 'fixture.refinement'},
        unit: 'grams', unitsPerInput: () => 1400
    };
    const success = planMaterialPartition({...request, outputs: [
        {output: {id: 'Bound sword', family: 'artifact', count: 1}, unitsPerItem: 1400}
    ]});
    assert.equal(readMaterialLineage(success.outputs[0].item_key).history[0].inputs[0].item_key, sword);
    const failure = planMaterialPartition({...request, outputs: [], losses: [{reason: 'shattered', amount: 1400}]});
    assert.deepEqual(failure.inputs, success.inputs);
    assert.deepEqual(failure.outputs, []);
    assert.equal(failure.event.inputs[0].item_key, sword);
    assert.deepEqual(failure.balance, {unit: 'grams', input: 1400, output: 0, loss: 1400});
});

test('forged heads and substitute handles carry exact ancestry through assembly and salvage', () => {
    const billet = gradedKey('Iron billet', 85, 'whole');
    const oak = gradedKey('Oak handle', 90, 'whole');
    const ash = gradedKey('Ash handle', 85, 'whole');
    const forge = planMaterialPartition({
        stock: stock([billet, 1]), inputs: [{item_key: billet, count: 1}],
        process: {...process, id: 'shape-head'}, unit: 'grams', unitsPerInput: () => 1000,
        outputs: [{output: {id: 'Axe head', family: 'iron', count: 1}, unitsPerItem: 950}],
        losses: [{reason: 'scale', amount: 50}]
    });
    const head = forge.outputs[0].item_key;
    const assemble = handle => planMaterialPartition({
        stock: stock([head, 1], [handle, 1]), inputs: [{item_key: head, count: 1}, {item_key: handle, count: 1}],
        process: {...process, id: 'fit-handle', at: 45}, unit: 'grams',
        unitsPerInput: key => key === head ? 950 : 200,
        outputs: [{output: {id: 'Axe', family: 'tool', count: 1}, unitsPerItem: 1150}]
    });
    const axe = assemble(oak).outputs[0].item_key;
    assert.notEqual(axe, assemble(ash).outputs[0].item_key);
    const salvage = planMaterialPartition({
        stock: stock([axe, 1]), inputs: [{item_key: axe, count: 1}],
        process: {...process, id: 'dismantle', at: 95}, unit: 'grams', unitsPerInput: () => 1150,
        outputs: [{output: {id: 'Recovered head', family: 'iron', count: 1}, unitsPerItem: 950}],
        losses: [{reason: 'split handle', amount: 200}]
    });
    const [recovered] = salvage.outputs;
    const [{item_key: ancestor}] = readMaterialLineage(recovered.item_key).history[0].inputs;
    assert.equal(ancestor, axe);
    assert.deepEqual(readMaterialLineage(ancestor).history[0].inputs.map(row => row.item_key), [head, oak]);
    assert.equal(readMaterialLineage(head).history[0].inputs[0].item_key, billet);
});
