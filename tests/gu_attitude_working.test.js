import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {attitudeWorking, GU_ATTITUDE_WORLD_LAW, guAttitudeEncounterPack} from '../src/world_packs/gu_attitude_working.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const petals = 'stock:orchid-petals', mental = 'energy:mental', essence = 'energy:primeval.rank1';
const pack = guAttitudeEncounterPack.id;
const config = {
    ownPacks: [guAttitudeEncounterPack], packs: ['l.living_body', pack],
    shared: {quantities: sharedQuantities(['stock', 'energy']),
        properties: [...sharedProperties(['alive']), ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'}))]},
    host: {laws: [GU_ATTITUDE_WORLD_LAW]},
};
function scene() {
    return createEngineWorld({...config, holders: [
        {id: 'office', kind: 'place'},
        {id: 'visitor', kind: 'body', as: ['operator'], place: 'office', quantities: {[petals]: 0, [mental]: 3, [essence]: 9}},
        {id: 'mask', kind: 'body', as: ['gu'], tags: ['living.body'], place: 'office', quantities: {satiety: 10},
            state: {'l.living_body': livingBodyState({species: 'attitude', rate: 1})},
            properties: {alive: true, gu_kind: 'attitude', gu_keeper: 'visitor', gu_controller: 'visitor'}},
        {id: 'receptive', kind: 'body', place: 'office', quantities: {[petals]: 3}, properties: {gu_suspicion: 1}},
        {id: 'informed', kind: 'body', place: 'office', quantities: {[petals]: 3},
            properties: {gu_suspicion: 1, gu_evidence_against: ['visitor']}},
        {id: 'lock', kind: 'thing', place: 'office', quantities: {[petals]: 3}, properties: {gu_suspicion: 1}},
    ]});
}
const wear = engine => startEngineWorking(engine, {id: 'wear', law: GU_ATTITUDE_WORLD_LAW, method: attitudeWorking('wear'),
    bindings: {operator: {kind: 'operator', id: 'visitor'}, specimen: {kind: 'gu', id: 'mask'}}});
const ask = (engine, id) => startEngineWorking(engine, {id, law: GU_ATTITUDE_WORLD_LAW, method: attitudeWorking('ask'),
    bindings: {operator: {kind: 'operator', id: 'visitor'}, office: {kind: 'place', id: 'office'}}});
const advance = (engine, minute) => {
    const result = advanceEngineWorld(engine, minute);
    assert.equal(result.pending, false);
    return result.engine;
};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const judgment = (engine, id) => engine.world.holders[id].state[pack];
const amount = (engine, id, stock) => engine.world.holders[id].quantities[stock];
const change = (engine, holder, property, value) =>
    applyEngineOps(engine, [{op: 'property', holder, property, value}], 'fixture.changed');

test('the same worn Gu reassures one observer and fails against evidence or a title check', () => {
    const plain = advance(ask(scene(), 'plain'), 1);
    assert.equal(judgment(plain, 'receptive').judgment, 'wary');
    const worn = advance(wear(scene()), 1);
    assert.equal(amount(worn, 'visitor', mental), 1);
    assert.equal(amount(worn, 'visitor', essence), 9);
    assert.equal(worn.records.workings.wear.record.receipts[0].observed.specimen, 'mask');
    const pending = ask(worn, 'ask-unentitled');
    const asked = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(asked), serializeEngineWorld(advance(pending, 2)));
    assert.deepEqual(judgment(asked, 'receptive'), {visitor: 'visitor', judgment: 'reassured', fulfilled: false});
    assert.deepEqual(judgment(asked, 'informed'), {visitor: 'visitor', judgment: 'wary', fulfilled: false});
    assert.equal(judgment(asked, 'lock'), undefined);
    assert.equal(amount(asked, 'visitor', petals), 0);

    const entitled = change(asked, 'visitor', 'gu_supply_title', true);
    const delivered = advance(ask(entitled, 'ask-entitled'), 3);
    assert.equal(judgment(delivered, 'receptive').fulfilled, true);
    assert.equal(judgment(delivered, 'informed').fulfilled, false);
    assert.equal(amount(delivered, 'visitor', petals), 1);
    assert.equal(amount(delivered, 'receptive', petals), 2);
    assert.equal(amount(delivered, 'informed', petals), 3);
    assert.equal(amount(delivered, 'lock', petals), 3);
});

test('expiry and live loss of control remove the effect, and an underfunded activation changes nothing', () => {
    const worn = advance(wear(scene()), 1);
    const titled = change(worn, 'visitor', 'gu_supply_title', true);
    const expired = advance(ask(advance(restore(titled), 5), 'too-late'), 6);
    assert.equal(judgment(expired, 'receptive').judgment, 'wary');
    assert.equal(amount(expired, 'visitor', petals), 0);
    assert.equal(expired.world.laws.some(field => field.kind === 'gu.demeanor'), false);
    const transferred = change(titled, 'mask', 'gu_controller', 'informed');
    const noInfluence = advance(ask(transferred, 'mask-lost'), 2);
    assert.equal(judgment(noInfluence, 'receptive').judgment, 'wary');
    assert.equal(amount(noInfluence, 'visitor', mental), 1);
    const hungry = applyEngineOps(titled, [{op: 'set', holder: 'mask', quantity: 'satiety', amount: 1}], 'fixture.last-meal');
    const withoutMeal = advance(ask(restore(hungry), 'mask-hungry'), 2);
    assert.equal(judgment(withoutMeal, 'receptive').judgment, 'wary');
    assert.equal(amount(withoutMeal, 'visitor', petals), 0);

    const pending = wear(scene());
    const spent = applyEngineOps(pending, [{op: 'set', holder: 'visitor', quantity: mental, amount: 1}], 'fixture.mental-spent');
    const denied = advance(restore(spent), 1);
    assert.equal(denied.records.workings.wear.record.status, 'interrupted');
    assert.equal(amount(denied, 'visitor', mental), 1);
    assert.equal(denied.world.laws.length, 0);
});
