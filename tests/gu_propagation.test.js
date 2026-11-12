import assert from 'node:assert/strict';
import test from 'node:test';
import {disturbGuPlot, plantGuFruit, produceGuFruit, refineGuFruit, sortGuFruit, transferGuFruitBatch,
    thunderPotatoPropagation as rule} from '../src/gu_propagation.js';
import {runGuPropagation} from '../src/gu_propagation_workshop.js';
import {detachVitalityLeaf, growVitalityLeaf} from '../src/gu_vitality_grass.js';

test('vitality grass grows and sheds individual leaves without consuming the plant', () => {
    const plant = {id: 'grass-7', kind: 'vitality-grass', holder: 'keeper', alive: true, leaves: 8};
    const conditions = {operator: 'keeper', daylight: true, water: 1, essence: 2, clock: 100};
    assert.throws(() => growVitalityLeaf(plant, {...conditions, daylight: false}), /daylight/);
    assert.throws(() => growVitalityLeaf(plant, {...conditions, essence: 1}), /two measures/);
    const growth = growVitalityLeaf(plant, conditions);
    assert.deepEqual(growth, {plant: {...plant, leaves: 9}, waterSpent: 1, essenceSpent: 2});
    assert.throws(() => growVitalityLeaf(growth.plant, conditions), /room on the stem/);
    assert.throws(() => detachVitalityLeaf(growth.plant, 'stranger'), /living plant/);
    assert.deepEqual(detachVitalityLeaf(JSON.parse(JSON.stringify(growth.plant)), 'keeper'), plant);
});

test('producer traits and plot development are independent across a stored fruit transfer', () => {
    const profile = {...rule, viability: 1, batchSize: 1};
    const supply = {pool: 'primeval', family: 'primeval', rank: 3, source: 'aperture'};
    const reserves = {keeper: {primeval: 2}, grower: {primeval: 1}};
    for (const force of [1, 2]) {
        const produced = produceGuFruit({nextBatch: 1, fruits: []}, {rule: profile,
            producer: {id: `mother-${force}`, kind: rule.producer, rank: 3, holder: 'keeper', fedThrough: 45, offspringForce: force},
            operator: 'keeper', supply, reserves, clock: 20, seed: 1}).state;
        const transfer = transferGuFruitBatch(produced, 1, 'keeper', 'grower');
        const sorted = sortGuFruit(transfer, 1, 'grower');
        const [fruit] = sorted.fruits;
        const refined = JSON.parse(JSON.stringify(refineGuFruit(sorted, fruit.id, 'grower')));
        for (const minutes of [5, 10]) {
            const planted = plantGuFruit(refined, {rule: profile, id: fruit.id, operator: 'grower',
                plot: {id: 'pit', fertile: true, developmentMinutes: minutes}, clock: 20, depth: 'deep', reserves}).state;
            const tryBlast = (state, clock, vibration = 2) => disturbGuPlot(state, {plot: 'pit', clock, vibration});
            assert.equal(tryBlast(planted, 19 + minutes).spent, null);
            assert.equal(tryBlast(planted, 20 + minutes, 1).spent, null);
            const blast = tryBlast(planted, 20 + minutes);
            assert.equal(blast.spent, fruit.id);
            assert.equal(blast.state.fruits[0].force, force);
            assert.equal(blast.state.fruits[0].producer, `mother-${force}`);
            assert.equal(tryBlast(blast.state, 20 + minutes).spent, null);
        }
    }
});

test('Mother Gu production pays the borrower, then the owner plants and spends the selected fruit once', () => {
    const result = runGuPropagation();
    assert.deepEqual(result.trace[0].reserves, {'fang-yuan': {primeval: 1}, 'bai-ning-bing': {primeval: 2}});
    assert.equal(result.trace[0].fruits.length, 4);
    assert.ok(result.trace[0].fruits.every(fruit => fruit.phase === 'unsorted' && !Object.hasOwn(fruit, 'sound')));
    assert.equal(result.trace[1].viable.length, 1);
    assert.equal(result.fruits.filter(fruit => fruit.phase === 'discarded').length, 3);
    assert.deepEqual(result.reserves, {'fang-yuan': {primeval: 0}, 'bai-ning-bing': {primeval: 2}});
    const [fruit] = result.fruits.filter(fruit => fruit.phase === 'spent');
    assert.equal(fruit.rank, 2);
    assert.equal(fruit.operator, 'bai-ning-bing');
    assert.equal(fruit.holder, 'fang-yuan');
    assert.deepEqual(result.trace.filter(row => row.action === 'disturb').map(row => row.spent), [null, null, fruit.id, null]);
    assert.ok(runGuPropagation({seed: 7}).trace[1].viable.length > 1, 'viability varies by batch seed');
});

test('production and planting refuse missing custody, paid support, or fertile soil', () => {
    const state = {nextBatch: 1, fruits: []};
    const producer = {id: 'mother-gu', kind: rule.producer, rank: 3, holder: 'bai-ning-bing', fedThrough: 0};
    const supply = {pool: 'primeval', family: 'primeval', rank: 3, source: 'aperture'};
    const reserves = {'bai-ning-bing': {primeval: 4}};
    const request = {rule, producer, operator: 'bai-ning-bing', reserves, supply, clock: 0, seed: 1};
    assert.throws(() => produceGuFruit(state, {...request, operator: 'fang-yuan'}), /hold the living producer/);
    const insufficient = runGuPropagation({operatorEssence: 1});
    assert.equal(insufficient.trace[0].outcome, 'interrupted');
    assert.deepEqual(insufficient.trace[0].fruits, []);
    assert.equal(insufficient.reserves['bai-ning-bing'].primeval, 1);
    const produced = produceGuFruit(state, request).state;
    assert.throws(() => sortGuFruit(produced, 1, 'fang-yuan'), /unsorted production batch/);
    const transferred = transferGuFruitBatch(produced, 1, 'bai-ning-bing', 'fang-yuan');
    const sorted = sortGuFruit(transferred, 1, 'fang-yuan');
    assert.throws(() => sortGuFruit(sorted, 1, 'fang-yuan'), /unsorted production batch/);
    const deadFruit = sorted.fruits.find(row => row.phase === 'discarded');
    assert.throws(() => refineGuFruit(sorted, deadFruit.id, 'fang-yuan'), /viable fruit/);
    const liveFruit = sorted.fruits.find(row => row.phase === 'viable');
    assert.throws(() => plantGuFruit(sorted, {rule, id: liveFruit.id, operator: 'fang-yuan', clock: 0,
        depth: 'deep', reserves, plot: {id: 'pit', fertile: true}}), /before planting/);
    const barren = runGuPropagation({fertile: false});
    assert.match(barren.trace.at(-1).reason, /fertile, empty plot/);
    assert.equal(barren.reserves['fang-yuan'].primeval, 1);
});
