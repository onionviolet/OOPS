import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {fixedTravelWorking, GU_FIXED_TRAVEL_LAW, guTravelCarryPack} from '../src/world_packs/gu_fixed_travel_working.js';
import {GU_USE_AGREEMENT_LAW, GU_USE_AGREEMENT_PROPERTIES, guRecallPack, guUseAgreementWorking} from '../src/world_packs/gu_use_agreement.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const livingFuel = 'energy:immortal.green-grape';
const borrowedFuel = 'energy:immortal.borrowed';
const travelKind = 'fixed-immortal-travel';
const ref = (kind, id) => ({kind, id});
const roles = {actor: 'operator', station: 'place'};
const delivery = defineWorkingLaw({id: 'trial.hill-delivery', revision: 1, operations: {
    file: {roles, settle({bound}) {
        const {actor, station} = bound;
        if (actor.place !== station.holder) return {ok: false, reason: 'Courier has not arrived.'};
        return {ok: true, effects: [{op: 'add', holder: station.holder, quantity: 'stock:reports', amount: 1}]};
    }},
}});
const filing = {id: 'trial.file-at-station', revision: 1, law: delivery.ref, roles,
    steps: [{op: 'file', minutes: 3, bindings: {actor: 'actor', station: 'station'}}]};
const config = {
    packs: ['l.living_body', guTravelCarryPack.id, guRecallPack.id], ownPacks: [guTravelCarryPack, guRecallPack],
    shared: {quantities: sharedQuantities(['energy', 'stock']), properties: [...sharedProperties(['alive']),
        ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
        {id: 'gu_rank', type: 'level', min: 1}, ...GU_USE_AGREEMENT_PROPERTIES]},
    host: {laws: [GU_FIXED_TRAVEL_LAW, delivery, GU_USE_AGREEMENT_LAW]},
};
const traveller = ref('operator', 'traveller');
const hill = ref('place', 'hill');
const away = {id: 'sealing-formation', kind: 'block', scope: 'start', params: {verb: 'move', object: 'position'}};
function setup({borrowed = false, ward = false} = {}) {
    return createEngineWorld({...config, lawFields: ward ? [away] : [], holders: [
        {id: 'start', kind: 'place'},
        {id: 'hill', kind: 'place', properties: {gu_travel_scene: 'old-observatory'}, quantities: {'stock:reports': 0}},
        {id: 'traveller', kind: 'body', as: ['operator'], place: 'start', quantities: {[livingFuel]: 3}},
        {id: 'rival', kind: 'body', place: 'hill'},
        {id: 'fixed', kind: 'body', as: ['gu'], place: borrowed ? 'hill' : 'start', quantities: {satiety: 10},
            properties: {alive: true, gu_kind: travelKind, gu_rank: 6, gu_carried: true,
                gu_keeper: borrowed ? 'rival' : 'traveller', gu_controller: borrowed ? 'rival' : 'traveller'}},
        {id: 'stabled', kind: 'body', as: ['gu'], place: 'start',
            properties: {alive: true, gu_kind: 'little-light', gu_keeper: 'traveller', gu_carried: false}},
        {id: 'notes', kind: 'thing', as: ['impression'], place: 'start',
            properties: {gu_impression_owner: 'traveller', gu_impression_site: 'hill', gu_travel_scene: 'old-observatory'}},
        {id: 'anchor', kind: 'thing', as: ['time-anchor'], place: 'start', quantities: {[borrowedFuel]: 1},
            properties: {gu_anchor_owner: 'traveller', gu_anchor_kind: travelKind, gu_anchor_rank: 6,
                gu_anchor_starts: 0, gu_anchor_expires: 5}},
    ]});
}
const jump = (engine, minute) => {
    const run = advanceEngineWorld(engine, minute);
    assert.equal(run.pending, false);
    return run.engine;
};
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
function startTravel(engine, borrowed = false) {
    return startEngineWorking(engine, {id: 'cross', law: GU_FIXED_TRAVEL_LAW, method: fixedTravelWorking({borrowed}),
        payer: 'traveller', bindings: {operator: traveller, destination: hill, impression: ref('impression', 'notes'),
            ...(borrowed ? {anchor: ref('time-anchor', 'anchor')} : {specimen: ref('gu', 'fixed')})}});
}
const fileReport = engine => startEngineWorking(engine, {id: 'file', law: delivery, method: filing,
    bindings: {actor: traveller, station: hill}});

test('a paid live crossing moves the exact carried Gu and enables a destination working after restore', () => {
    const running = fileReport(startTravel(setup()));
    const arrived = jump(restore(jump(running, 1)), 3);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(jump(running, 3)));
    const {holders} = arrived.world;
    assert.equal(holders.traveller.place, 'hill');
    assert.equal(holders.fixed.place, 'hill');
    assert.equal(holders.stabled.place, 'start');
    assert.equal(holders.traveller.quantities[livingFuel], 2);
    assert.equal(holders.hill.quantities['stock:reports'], 1);
    assert.equal(arrived.records.workings.cross.record.receipts[0].observed.capability, 'fixed');
    assert.equal(arrived.records.workings.cross.landed[0].status, 'landed');
});

test('recall returns the exact loaned Gu through its anchor only when the movement lands', () => {
    const opening = applyEngineOps(setup(), [
        {op: 'holder_add', value: {id: 'lender', kind: 'body', as: ['operator'], place: 'start',
            properties: {alive: true}, quantities: {[livingFuel]: 2}}},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property => ({op: 'property', holder: 'fixed', property, value: 'lender'})),
    ], 'fixture:recall-title');
    const agree = (engine, action, id, recallable) => startEngineWorking(engine, {id, law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking(action, 8, {recallable}), bindings: {
            lender: ref('operator', 'lender'), borrower: traveller, specimen: ref('gu', 'fixed'),
        }});
    const arrived = recallable => jump(startTravel(jump(agree(opening, 'grant', 'grant', recallable), 1)), 3);
    const borrowed = arrived(true);
    const pending = agree(borrowed, 'recall', 'recall');
    const recalled = jump(restore(pending), 4);
    assert.deepEqual(serializeEngineWorld(recalled), serializeEngineWorld(jump(pending, 4)));
    assert.equal(recalled.world.holders.fixed.place, 'start');
    assert.equal(recalled.world.holders.fixed.properties.gu_keeper, 'lender');
    assert.equal(recalled.world.holders.fixed.properties.gu_use_grantee, undefined);
    assert.equal(recalled.world.holders.fixed.properties.gu_recall_anchor, undefined);
    assert.equal(recalled.world.holders.fixed.quantities.satiety, borrowed.world.holders.fixed.quantities.satiety);
    assert.equal(recalled.world.holders.traveller.place, 'hill');
    assert.equal(recalled.world.holders.lender.quantities[livingFuel], 1);

    const blocked = jump(restore(applyEngineOps(pending, [{op: 'law_add', field: {...away, scope: 'hill'}}], 'fixture:recall-ward')), 4);
    assert.equal(blocked.world.holders.fixed.place, 'hill');
    assert.equal(blocked.world.holders.fixed.properties.gu_keeper, 'traveller');
    assert.equal(blocked.world.holders.fixed.properties.gu_recall_arrival, undefined);
    assert.equal(blocked.world.holders.lender.quantities[livingFuel], 1);
    assert.equal(blocked.records.workings.recall.landed[1].status, 'idle');

    const unanchored = jump(agree(arrived(false), 'recall', 'recall'), 4);
    assert.equal(unanchored.records.workings.recall.record.status, 'interrupted');
    assert.equal(unanchored.world.holders.lender.quantities[livingFuel], 2);
});

test('a loaned living Gu crosses with its borrower and returns locally after expiry', () => {
    const opening = applyEngineOps(setup(), [
        {op: 'holder_add', value: {id: 'lender', kind: 'body', as: ['operator'], place: 'start', quantities: {[livingFuel]: 1}}},
        ...['gu_title', 'gu_keeper', 'gu_controller'].map(property => ({op: 'property', holder: 'fixed', property, value: 'lender'})),
    ], 'fixture:held-title');
    const agree = (engine, action, id, until) => startEngineWorking(engine, {id, law: GU_USE_AGREEMENT_LAW,
        method: guUseAgreementWorking(action, until), bindings: {
            lender: ref('operator', 'lender'), borrower: traveller, specimen: ref('gu', 'fixed'),
        }});
    const loaned = jump(agree(opening, 'grant', 'grant', 4), 1);
    const pending = fileReport(startTravel(loaned));
    const arrived = jump(restore(jump(pending, 2)), 4);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(jump(pending, 4)));
    assert.equal(arrived.world.holders.fixed.place, 'hill');
    assert.equal(arrived.world.holders.fixed.properties.gu_keeper, 'traveller');
    assert.equal(arrived.world.holders.fixed.properties.gu_title, 'lender');
    assert.equal(arrived.world.holders.fixed.properties.gu_controller, 'lender');
    assert.equal(arrived.world.holders.traveller.quantities[livingFuel], 2);
    assert.equal(arrived.world.holders.lender.quantities[livingFuel], 1);
    assert.equal(arrived.world.holders.hill.quantities['stock:reports'], 1);
    const remoteReturn = jump(agree(arrived, 'return', 'remote-return'), 5);
    assert.equal(remoteReturn.records.workings['remote-return'].record.status, 'interrupted');
    const together = applyEngineOps(remoteReturn, [{op: 'move', holder: 'lender', to: 'hill'}], 'fixture:local-handoff');
    const returned = jump(restore(agree(together, 'return', 'return')), 6);
    assert.equal(returned.world.holders.fixed.place, 'hill');
    assert.equal(returned.world.holders.fixed.properties.gu_keeper, 'lender');
    assert.equal(returned.world.holders.fixed.properties.gu_use_grantee, undefined);
    assert.equal(returned.world.holders.fixed.quantities.satiety, arrived.world.holders.fixed.quantities.satiety);

    const expiring = jump(agree(opening, 'grant', 'grant', 3), 1);
    const refused = jump(restore(startTravel(expiring)), 3);
    assert.equal(refused.records.workings.cross.record.receipts[0].reason, 'gu-use-grant-expired');
    assert.equal(refused.world.holders.fixed.place, 'start');
    assert.equal(refused.world.holders.traveller.quantities[livingFuel], 3);

    const warded = applyEngineOps(pending, [{op: 'law_add', field: away}], 'fixture:ward-after-loan');
    const intercepted = jump(restore(warded), 4);
    assert.equal(intercepted.records.workings.cross.landed[0].status, 'idle');
    assert.equal(intercepted.world.holders.traveller.quantities[livingFuel], 2);
    assert.equal(intercepted.world.holders.fixed.place, 'start');
    assert.equal(intercepted.world.holders.fixed.properties.gu_keeper, 'traveller');
    assert.equal(intercepted.world.holders.hill.quantities['stock:reports'], 0);
});

test('live scene changes stop a cast before payment, while a late ward intercepts the paid move', () => {
    const pending = jump(startTravel(setup()), 1);
    const change = (id, property, value) => applyEngineOps(pending, [{op: 'property', holder: id, property, value}], 'fixture.change');
    for (const [engine, reason] of [
        [change('hill', 'gu_travel_scene', 'fallen-observatory'), 'changed-destination'],
        [change('hill', 'gu_travel_sealed', true), 'sealed-destination'],
        [change('notes', 'gu_impression_owner', 'rival'), 'unknown-destination'],
        [change('fixed', 'gu_controller', 'rival'), 'unavailable'],
    ]) {
        const outcome = jump(restore(engine), 3);
        assert.equal(outcome.records.workings.cross.record.receipts[0].reason, reason);
        assert.equal(outcome.world.holders.traveller.place, 'start');
        assert.equal(outcome.world.holders.traveller.quantities[livingFuel], 3);
    }
    const intercepted = jump(fileReport(applyEngineOps(pending, [{op: 'law_add', field: away}], 'fixture.ward')), 4);
    assert.equal(intercepted.records.workings.cross.landed[0].status, 'idle');
    assert.equal(intercepted.world.holders.traveller.quantities[livingFuel], 2);
    assert.equal(intercepted.world.holders.traveller.place, 'start');
    assert.equal(intercepted.world.holders.fixed.place, 'start');
    assert.equal(intercepted.records.workings.file.record.receipts[0].reason, 'Courier has not arrived.');
});

test('borrowed travel spends the anchor reserve and leaves the living Gu with its rival keeper', () => {
    const opening = setup({borrowed: true});
    const pending = jump(startTravel(opening, true), 1);
    const fixed = pending.world.holders.fixed;
    const arrived = jump(fileReport(restore(pending)), 4);
    const {holders} = arrived.world;
    assert.equal(holders.traveller.place, 'hill');
    assert.equal(holders.traveller.quantities[livingFuel], 3);
    assert.equal(holders.anchor.quantities[borrowedFuel], 0);
    assert.equal(holders.hill.quantities['stock:reports'], 1);
    assert.deepEqual(holders.fixed, fixed);
    assert.equal(arrived.records.workings.cross.record.receipts[0].truth.paid.lines[0].payer, 'anchor');
    assert.equal(Object.values(holders).filter(holder => holder.properties.gu_kind === travelKind).length, 1);

    const expiry = applyEngineOps(pending, [
        {op: 'property', holder: 'anchor', property: 'gu_anchor_expires', value: 2},
    ], 'fixture.anchor-cut');
    const denied = jump(restore(expiry), 3);
    assert.equal(denied.records.workings.cross.record.receipts[0].reason, 'unreachable-anchor');
    assert.equal(denied.world.holders.anchor.quantities[borrowedFuel], 1);
    assert.equal(denied.world.holders.traveller.place, 'start');
});

test('two pending workings cannot spend the same borrowed dose', () => {
    const opening = startTravel(setup({borrowed: true, ward: true}), true);
    const competing = startEngineWorking(opening, {id: 'repeat', law: GU_FIXED_TRAVEL_LAW,
        method: fixedTravelWorking({borrowed: true}), bindings: {operator: traveller, destination: hill,
            impression: ref('impression', 'notes'), anchor: ref('time-anchor', 'anchor')}});
    const settled = jump(restore(jump(competing, 1)), 3);
    assert.equal(settled.records.workings.cross.landed[0].status, 'idle');
    assert.equal(settled.records.workings.repeat.record.receipts[0].reason, 'needs more essence');
    assert.equal(settled.world.holders.traveller.quantities[livingFuel], 3);
    assert.equal(settled.world.holders.anchor.quantities[borrowedFuel], 0);
    assert.equal(settled.world.holders.traveller.place, 'start');
});
