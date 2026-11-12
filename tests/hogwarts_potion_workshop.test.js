import assert from 'node:assert/strict';
import test from 'node:test';
import {brewWorkshopAntidote, brewWorkshopDraught, brewWorkshopPolyjuice} from '../src/hogwarts_potion_workshop.js';

test('Draught checkpoints depend on extraction and directional history', () => {
    const annotated = brewWorkshopDraught({strokes: 'LLLLLLLR'});
    assert.deepEqual(annotated.observations, {afterAddition: 'Lilac', afterStirring: 'Pale pink'});
    assert.equal(annotated.amounts.settled, 8);
    assert.equal(Object.values(annotated.amounts).reduce((sum, amount) => sum + amount, 0) + annotated.retained.beanSolids + annotated.retained.spentBeans, 112);
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

test('repeated heat consumes the current binder fraction and keeps the bench receipt shape', () => {
    const r = brewWorkshopAntidote({remedyA: 4, remedyB: 3, binder: 5, catalyst: true, steps: ['heat', 'heat', 'warm']});
    assert.deepEqual(r.trace, [
        {step: 0, kind: 'reaction', id: 'binder-degrades', extent: 2},
        {step: 1, kind: 'reaction', id: 'binder-degrades', extent: 1},
        {step: 2, kind: 'reaction', id: 'bind-remedies', extent: 2},
    ]);
    assert.deepEqual(r.spent, [{material: 'binder', qty: 5}, {material: 'carrier', qty: 1},
        {material: 'remedyA', qty: 4}, {material: 'remedyB', qty: 3}]);
    assert.equal(r.mass, 13);
    assert.deepEqual(r.remaining, {a: 0, b: 1, blend: 0});
});

test('Draught equivalence test: the brew-law Draught matches the pre-law bench on 240 attempts', async () => {
    const {readFileSync} = await import('node:fs');
    const golden = JSON.parse(readFileSync(new URL('./fixtures/brew/draught_legacy_golden.json', import.meta.url), 'utf8'));
    assert.equal(golden.cases.length, 240);
    for (const {input, out} of golden.cases) {
        const r = brewWorkshopDraught(input);
        const {intermediate, settled, juice, precursor, matrix} = r.amounts;
        assert.deepEqual({mass: r.mass, intermediate, settled, juice, precursor, matrix, observations: r.observations,
            solidsWithLoss: r.retained.beanSolids + r.retained.spentBeans, preparedJuice: r.trace[1].juice}, out, JSON.stringify(input));
    }
});

test('BRC9: storage loss is its own retained amount, not counted as bean solids', () => {
    const r = brewWorkshopDraught({beanUnits: 12, storage: {days: 3, vessel: 'open'}});
    assert.equal(r.retained.spentBeans, 6);
    assert.equal(r.retained.beanSolids + r.retained.spentBeans + r.trace[1].juice, 12);
    assert.equal(Object.values(r.amounts).reduce((n, a) => n + a, 0) + r.retained.beanSolids + r.retained.spentBeans, 12 + 6 + 94);
});
