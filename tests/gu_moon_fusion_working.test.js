import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {GU_MOON_FUSION_LAW, GU_MOON_FUSION_PROPERTIES, moonBladeWorking, moonFusionWorking} from '../src/world_packs/gu_moon_fusion_working.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {readLineage} from '../src/world_substrate.js';
import {guBodyCase} from '../src/world_packs/gu_body_cases.js';

const stones = 'stock:furnace-stone', green = 'energy:primeval.rank1', red = 'energy:primeval.rank2';
const moonglowBody = guBodyCase('moonglow');
const [petals] = moonglowBody.knownStock;
const ref = (kind, id) => ({kind, id});
const operator = ref('operator', 'keeper');
const materials = {moon: ref('gu', 'moon'), lightA: ref('gu', 'near'), lightB: ref('gu', 'far')};
const config = {
    packs: ['l.living_body'],
    shared: {quantities: sharedQuantities(['stock', 'energy', 'vitality']),
        properties: [...sharedProperties(['alive']), ...GU_MOON_FUSION_PROPERTIES,
            ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))]},
    host: {laws: [GU_MOON_FUSION_LAW]},
};

function furnace() {
    const ingredient = (id, kind) => ({id, kind: 'body', as: ['gu'], tags: ['living.body'], place: 'furnace',
        quantities: {satiety: 8}, properties: {alive: true, gu_kind: kind, gu_rank: 1, gu_keeper: 'keeper', gu_controller: 'keeper'},
        state: {'l.living_body': livingBodyState({species: kind, rate: 1})}});
    return createEngineWorld({...config, holders: [
        {id: 'furnace', kind: 'place'},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'furnace',
            properties: {gu_furnace_steady: true}, quantities: {[stones]: 2, [green]: 8, [red]: 10}},
        {id: 'target', kind: 'body', as: ['creature'], place: 'furnace', quantities: {vitality: 12}},
        {id: 'basket', kind: 'thing', place: 'furnace', quantities: {[petals]: 4}},
        ingredient('moon', 'moonlight'), ingredient('near', 'little-light'), ingredient('far', 'little-light'),
    ]});
}
const start = (engine, id, method, bindings) => startEngineWorking(engine, {law: GU_MOON_FUSION_LAW, method, id, bindings, payer: 'keeper'});
const fusion = (engine, id = 'job', bindings = materials) => start(engine, id, moonFusionWorking, {operator, ...bindings});
const cast = (engine, id, kind, specimen) => start(engine, id, moonBladeWorking(kind), {
    operator, specimen: ref('gu', specimen), target: ref('creature', 'target'),
});
const advance = (engine, minute) => {
    const result = advanceEngineWorld(engine, minute);
    assert.equal(result.pending, false);
    return result.engine;
};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);

test('paid Moonlight fusion produces a distinct living Moonglow with three parents and a usable stronger blade', () => {
    const initial = furnace();
    const baseline = advance(cast(initial, 'baseline', 'moonlight', 'moon'), 1);
    assert.equal(baseline.world.holders.target.quantities.vitality, 11);
    assert.equal(baseline.world.holders.keeper.quantities[green], 4);

    const running = fusion(initial);
    const pending = advance(running, 2);
    assert.equal(pending.world.holders.keeper.quantities[stones], 1);
    const tiedUp = advance(cast(advance(running, 1), 'while-fusing', 'moonlight', 'moon'), 2);
    assert.equal(tiedUp.records.workings['while-fusing'].record.receipts[0].reason, 'This Gu is already committed.');
    assert.equal(tiedUp.world.holders.keeper.quantities[green], 8);
    const complete = advance(restore(pending), 3);
    assert.deepEqual(serializeEngineWorld(complete), serializeEngineWorld(advance(running, 3)));
    const product = 'job.moonglow';
    const {holders} = complete.world;
    assert.equal(holders[product].properties.gu_kind, 'moonglow');
    assert.equal(holders[product].properties.gu_rank, 2);
    assert.equal(holders[product].quantities.satiety, 15);
    assert.equal(holders[product].state['l.living_body'].species, 'moonglow');
    assert.ok(readLineage(complete.world, product).some(row =>
        row.act === 'merge' && [...row.parents].sort().join(',') === 'far,moon,near'));
    for (const id of ['moon', 'near', 'far']) assert.equal(holders[id], undefined);

    const stale = advance(cast(complete, 'old-blade', 'moonlight', 'moon'), 4);
    assert.equal(stale.records.workings['old-blade'].record.status, 'interrupted');
    assert.equal(stale.world.holders.keeper.quantities[green], 8);
    const fired = advance(cast(restore(stale), 'new-blade', 'moonglow', product), 5);
    assert.deepEqual(fired.records.workings['new-blade'].record.receipts[0].observed, {specimen: product, kind: 'moonglow'});
    assert.equal(fired.world.holders.keeper.quantities[red], 5);
    assert.equal(fired.world.holders.target.quantities.vitality, 9);
});

test('failed paid fusion injures or destroys its own ingredients and restore preserves the loss', () => {
    const pending = advance(fusion(furnace()), 1);
    const unsettled = applyEngineOps(pending, [
        {op: 'property', holder: 'keeper', property: 'gu_furnace_steady', value: false},
    ], 'fixture.unsteady');
    const failed = advance(restore(unsettled), 3);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(unsettled, 3)));
    assert.deepEqual(failed.records.workings.job.record.receipts[1].observed, {fusion: 'failed-control'});
    assert.equal(failed.world.holders.keeper.quantities[stones], 1);
    assert.equal(failed.world.holders['job.moonglow'], undefined);
    assert.equal(failed.world.holders.far, undefined);
    assert.equal(failed.world.holders.moon.properties.injured, true);
    assert.equal(failed.world.holders.near.properties.injured, true);
    const impaired = advance(cast(failed, 'hurt-moon', 'moonlight', 'moon'), 4);
    assert.equal(impaired.records.workings['hurt-moon'].record.receipts[0].reason, 'needs recovery');
    assert.equal(impaired.world.holders.keeper.quantities[green], 8);
});

test('duplicate or concurrently committed ingredients cannot reserve the same Gu or spend a second stone', () => {
    const initial = furnace();
    const duplicate = advance(fusion(initial, 'duplicate', {...materials, lightB: materials.lightA}), 3);
    assert.equal(duplicate.records.workings.duplicate.record.status, 'interrupted');
    assert.equal(duplicate.world.holders.keeper.quantities[stones], 2);
    const competing = advance(fusion(fusion(initial, 'job-a'), 'job-b'), 3);
    assert.equal(competing.world.holders.keeper.quantities[stones], 1);
    assert.ok(competing.world.holders['job-a.moonglow']);
    assert.equal(competing.world.holders['job-b.moonglow'], undefined);
    assert.equal(competing.records.workings['job-b'].record.receipts[0].reason, 'An ingredient is already committed.');
});

test('a withdrawn ingredient stops final settlement, and the surviving bindings lapse by their deadline', () => {
    const pending = advance(fusion(furnace()), 1);
    const withdrawn = applyEngineOps(pending, [
        {op: 'property', holder: 'far', property: 'gu_keeper', value: 'rival'},
    ], 'fixture.withdrawal');
    const refused = advance(restore(withdrawn), 3);
    assert.equal(refused.records.workings.job.record.receipts[1].reason, 'A prepared ingredient is no longer in your control.');
    assert.equal(refused.world.holders.keeper.quantities[stones], 1);
    assert.equal(refused.world.holders['job.moonglow'], undefined);
    const after = advance(cast(refused, 'available-again', 'moonlight', 'moon'), 4);
    assert.equal(after.records.workings['available-again'].record.status, 'complete');
    assert.equal(after.world.holders.keeper.quantities[green], 4);
});

test('the fused body uses its own diet and the next cast reads its live satiety', () => {
    const complete = advance(fusion(furnace()), 3);
    const product = 'job.moonglow';
    const waiting = advance(complete, 17);
    const empty = advance(cast(waiting, 'empty-blade', 'moonglow', product), 18);
    assert.equal(empty.records.workings['empty-blade'].record.receipts[0].reason, 'needs feeding');
    assert.equal(empty.world.holders.keeper.quantities[red], 10);
    assert.equal(empty.world.holders.target.quantities.vitality, 12);
    assert.equal(empty.world.holders[product].state['l.living_body'].emptySince, 18);

    const meal = moonglowBody.mealOps(empty.world, product, 'basket');
    const fed = restore(applyEngineOps(empty, meal, 'fixture.moonglow-meal'));
    const ready = advance(cast(fed, 'fed-blade', 'moonglow', product), 19);
    assert.equal(ready.records.workings['fed-blade'].record.receipts[0].observed.specimen, product);
    assert.equal(ready.world.holders.basket.quantities[petals], 4 - moonglowBody.mealAmount);
    assert.equal(ready.world.holders.keeper.quantities[red], 5);
    assert.equal(ready.world.holders.target.quantities.vitality, 9);
});
