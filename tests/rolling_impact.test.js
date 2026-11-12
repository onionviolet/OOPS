import assert from 'node:assert/strict';
import test from 'node:test';
import {impactOfRollingLoad, seversTether, tetherFailureDelay} from '../src/rolling_impact.js';
import {drainWake, settleDrainArrival} from '../src/gu_keeper_drain.js';
import {potatoBuyer, potatoBuyerPlot} from '../src/gu_keeper_potato_market.js';

test('release, arrival and detonation read separate constraints', () => {
    assert.equal(seversTether([{kind: 'damage', magnitude: 1}], 2), false);
    assert.equal(seversTether([{kind: 'damage', magnitude: 2}], 2), true);
    assert.deepEqual(impactOfRollingLoad({mass: 2, drop: 1, loss: 2, track: {start: 'head', end: 'foot'}}),
        {at: 'head', vibration: 0});
    const fruit = {id: 'fruit', holder: potatoBuyer, producer: 'parent', phase: 'planted', force: 2,
        plot: potatoBuyerPlot.id, depth: 'deep', readyAt: 10};
    const ready = {fruits: [fruit], rig: {size: 'heavy', phase: 'rolling', due: 10}};
    assert.equal(settleDrainArrival(ready, 9), null);
    const early = settleDrainArrival({...ready, rig: {...ready.rig, due: 9}}, 11);
    assert.equal(early.rig.triggered, false);
    assert.deepEqual(early.fruits, [fruit]);
    const light = settleDrainArrival({...ready, rig: {...ready.rig, size: 'light'}}, 10);
    assert.equal(light.rig.triggered, false);
    assert.deepEqual(light.fruits, [fruit]);
    const heavy = settleDrainArrival(ready, 10);
    assert.deepEqual(heavy.buyerResult, {id: fruit.id, producer: fruit.producer, force: 2});
    assert.equal(heavy.buyerCleared, true);
    assert.equal(heavy.rollTests, 1);
    assert.equal(settleDrainArrival(heavy, 11), null);
});

test('worn cord schedules a separate break and arrival without a blade', () => {
    assert.equal(tetherFailureDelay({load: 2, capacity: 2, strainBudget: 2}), null);
    assert.equal(tetherFailureDelay({load: 2, capacity: 1, strainBudget: 2}), 2);
    const row = {fruits: [], rig: {size: 'heavy', phase: 'tethered', worn: true, failAt: 8}};
    assert.equal(drainWake(row),8);
    assert.equal(settleDrainArrival(row, 7),null);
    const broken = settleDrainArrival(row,8);
    assert.equal(broken.rig.release,'wear');
    assert.equal(drainWake(broken),9);
    assert.equal(broken.wearReleases,1);
    const arrived = settleDrainArrival(broken,9);
    assert.equal(arrived.rig.triggered,false);
    assert.equal(drainWake(arrived),undefined);
    assert.equal(settleDrainArrival(arrived,20),null);
});
