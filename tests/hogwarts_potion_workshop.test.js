import assert from 'node:assert/strict';
import test from 'node:test';
import {brewWorkshopAntidote, brewWorkshopDraught, brewWorkshopPolyjuice} from '../src/hogwarts_potion_workshop.js';

test('Draught checkpoints depend on extraction and directional history', () => {
    const annotated = brewWorkshopDraught({strokes: 'LLLLLLLR'});
    assert.deepEqual(annotated.observations, {afterAddition: 'Lilac', afterStirring: 'Pale pink'});
    assert.equal(annotated.amounts.settled, 8);
    assert.equal(Object.values(annotated.amounts).reduce((sum, amount) => sum + amount, 0) + annotated.retained.beanSolids, 112);
    assert.equal(brewWorkshopDraught({preparation: 'slice', strokes: 'LLLLLLLR'}).amounts.settled, 6);
    assert.equal(brewWorkshopDraught({strokes: 'LLLLLLRL'}).amounts.settled, 0);
});

test('blend treatment competes for the same remedies and depends on heat', () => {
    assert.deepEqual(brewWorkshopAntidote().remaining, {a: 0, b: 0, blend: 2});
    assert.deepEqual(brewWorkshopAntidote({binder: 2}).remaining, {a: 0, b: 0, blend: 0});
    assert.deepEqual(brewWorkshopAntidote({binder: 2, hot: true}).remaining, {a: 0, b: 0, blend: 1});
    assert.deepEqual(brewWorkshopAntidote({binder: 4}).remaining, {a: 2, b: 2, blend: 0});
});

test('storage and provenance affect the same preparations through their respective laws', () => {
    const storage = vessel => brewWorkshopDraught({strokes: 'LLLLLLLR', storage: {days: 3, vessel}});
    assert.deepEqual([storage('open').trace[1].juice, storage('sealed').trace[1].juice], [4, 6]);
    const full = brewWorkshopPolyjuice({storeDose: true});
    assert.equal(full.grade, 'canon');
    assert.equal(full.custody, 'carried');
    assert.equal(full.trace.filter(step => step.action === 'transferBatch').length, 2);
    assert.equal(brewWorkshopPolyjuice({moon: 'New'}).grade, 'original');
    assert.equal(brewWorkshopPolyjuice({stewDays: 15}).grade, 'degraded');
});

test('a cool batch retains the catalyst and achieves a different reaction extent', () => {
    const cool = brewWorkshopAntidote({binder: 2, cool: true});
    const assisted = brewWorkshopAntidote({binder: 2, cool: true, catalyst: true});
    assert.deepEqual([cool.remaining.blend, assisted.remaining.blend], [1, 0]);
    assert.deepEqual(assisted.retained, [{material: 'catalyst-stone', qty: 1}]);
    assert.equal(assisted.mass, cool.mass);
});
