import test from 'node:test';
import assert from 'node:assert/strict';
import { runIrrigationModel } from '../src/systems_irrigation_model.js';

test('all six finite experiments have exact conserved water and harvest', () => {
    const cases = [
        ['straight', 1, [6, 0, 0], [3, 0, 0], 'straight'],
        ['straight', 2, [12, 0, 0], [3, 0, 0], 'branched'],
        ['straight', 3, [12, 6, 0], [3, 3, 0], 'branched'],
        ['branched', 1, [2, 2, 2], [0, 0, 0], 'straight'],
        ['branched', 2, [4, 4, 4], [1, 1, 1], 'branched'],
        ['branched', 3, [6, 6, 6], [3, 3, 3], 'branched'],
    ];
    for (const [layout, inlet, water, harvest, recommendation] of cases) {
        const result = runIrrigationModel({layout, inlet});
        assert.equal(result.schema, 1);
        assert.equal(result.modelVersion, 'irrigation-represented-v1');
        assert.equal(result.representedOnly, true);
        assert.deepEqual(result.config, {layout, inlet});
        assert.equal(result.output.ticks, 6);
        assert.equal(result.output.suppliedWater, inlet * 6);
        assert.deepEqual(result.output.beds.map(bed => bed.water), water);
        assert.deepEqual(result.output.beds.map(bed => bed.harvest), harvest);
        assert.equal(result.output.harvest, harvest.reduce((a, b) => a + b, 0));
        assert.equal(result.output.harvestingBeds, harvest.filter(n => n > 0).length);
        assert.equal(result.output.usableWater + result.output.excessWater, inlet * 6);
        assert.equal(result.knowledge.recommendedLayout, recommendation);
        assert.match(result.knowledge.limitation, /native goods are not modeled/);
    }
});

test('exports exact independent represented output and reproducible knowledge', () => {
    const config = Object.freeze({layout: 'branched', inlet: 3});
    const result = runIrrigationModel(config);
    assert.deepEqual(result.output, {
        ticks: 6, suppliedWater: 18,
        beds: [1, 2, 3].map(bed => ({bed, water: 6, usableWater: 6, excessWater: 0, harvest: 3})),
        usableWater: 18, excessWater: 0, harvest: 9, harvestingBeds: 3,
    });
    assert.deepEqual(result.knowledge.comparison, {straightHarvest: 6, branchedHarvest: 9});
    assert.equal(result.knowledge.id, 'irrigation-represented-v1:inlet-3');
    const repeated = runIrrigationModel(config);
    assert.deepEqual(result, repeated);
    result.config.inlet = 1;
    result.output.beds[0].water = 100;
    result.knowledge.comparison.straightHarvest = 100;
    assert.equal(config.inlet, 3);
    assert.deepEqual(runIrrigationModel(config), repeated);
});

test('changing layout and inlet yields a bounded comparison, not real resources', () => {
    const low = runIrrigationModel({layout:'branched', inlet:1});
    const concentrated = runIrrigationModel({layout:low.knowledge.recommendedLayout, inlet:1});
    const high = runIrrigationModel({layout:'branched', inlet:3});
    assert.equal(low.output.harvest, 0);
    assert.equal(concentrated.output.harvest, 3);
    assert.equal(high.output.harvest, 9);
    assert.deepEqual(Object.keys(high), ['schema','modelVersion','representedOnly','config','output','knowledge']);
    assert.equal('resources' in high, false);
    assert.equal('inhabitants' in high, false);
});

test('invalid configurations cannot start unbounded work or silently coerce inputs', () => {
    for (const config of [undefined, null, [], false, 'straight']) {
        assert.throws(() => runIrrigationModel(config), TypeError);
    }
    for (const layout of [undefined, '', 'curved', 1, true, null]) {
        assert.throws(() => runIrrigationModel({layout, inlet:1}), /layout/);
    }
    for (const inlet of [undefined, null, false, '1', 0, -1, 4, 1.5, NaN, Infinity, 1e9]) {
        assert.throws(() => runIrrigationModel({layout:'straight', inlet}), /inlet/);
    }
});
