import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {guThreeHeadsPack, GU_THREE_HEADS_LAW, threeHeadsWorking} from '../src/world_packs/gu_three_heads_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';

const fuel = 'energy:primeval.formation';
const allocations = [5, 7, 6];
const operators = ['first', 'second', 'third'];
const ref = (kind, id) => ({kind, id});
const config = {ownPacks: [guThreeHeadsPack], packs: ['l.living_body', guThreeHeadsPack.id],
    shared: {quantities: sharedQuantities(['energy', 'stock']), properties: [...sharedProperties(['alive']),
        {id: 'gu_rank', type: 'level', min: 1}, {id: 'gu_keeper', type: 'label'}, {id: 'gu_controller', type: 'label'}]},
    host: {laws: [GU_THREE_HEADS_LAW]}};
function scene() {
    const holders = [{id: 'yard', kind: 'place'}, {id: 'outside', kind: 'place'},
        {id: 'gate', kind: 'thing', as: ['load'], place: 'yard', properties: {gu_load_threshold: 5}, quantities: {'stock:lifted': 0}}];
    const gu = [];
    for (const [index, id] of operators.entries()) {
        holders.push({id, kind: 'body', as: ['operator'], place: 'yard', quantities: {[fuel]: allocations[index] * 2},
            properties: {alive: true, gu_coordination_ready: true}});
        for (let n = 0; n < allocations[index]; n++) {
            const specimen = id + '.gu' + (n + 1);
            holders.push({id: specimen, kind: 'body', as: ['gu'], place: 'yard', tags: ['living.body'],
                quantities: {satiety: 8}, state: {'l.living_body': livingBodyState({species: 'formation-gu', rate: 1})},
                properties: {alive: true, gu_rank: 3 + n % 3, gu_keeper: id, gu_controller: id}});
            gu.push(ref('gu', specimen));
        }
    }
    return {engine: createEngineWorld({...config, holders}), bindings: {
        lead: ref('operator', operators[0]), left: ref('operator', operators[1]), right: ref('operator', operators[2]),
        ...Object.fromEntries(gu.map((specimen, index) => ['gu' + (index + 1), specimen])),
    }};
}
const start = (engine, id, operation, bindings) => startEngineWorking(engine, {id,
    law: GU_THREE_HEADS_LAW, method: threeHeadsWorking(operation), bindings});
const lift = (engine, id) => start(engine, id, 'lift', {lead: ref('operator', 'first'), load: ref('load', 'gate')});
function advance(engine, at) {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const amounts = engine => operators.map(id => engine.world.holders[id].quantities[fuel]);
const gate = engine => engine.world.holders.gate.quantities['stock:lifted'];

test('three operators fund their own live Gu in one beat and the combined body lifts a load', () => {
    const {engine, bindings} = scene();
    assert.equal(gate(advance(lift(engine, 'ordinary-lift'), 1)), 0);
    const running = start(engine, 'combine', 'combine', bindings);
    const pending = advance(running, 1);
    assert.deepEqual(amounts(pending), [10, 14, 12]);
    const combined = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(combined), serializeEngineWorld(advance(running, 2)));
    assert.deepEqual(amounts(combined), [0, 0, 0]);
    const [receipt] = combined.records.workings.combine.record.receipts;
    assert.deepEqual(receipt.truth.paid.lines.map(({payer, amount}) => [payer, amount]), [['first', 10], ['second', 14], ['third', 12]]);
    assert.deepEqual(receipt.observed, {kind: 'merged-body', participants: operators, heads: 3, arms: 6});
    assert.equal(Object.values(receipt.bindings).filter(id => id.includes('.gu')).length, 18);
    assert.equal(gate(advance(lift(restore(combined), 'combined-lift'), 3)), 1);
    assert.equal(gate(advance(lift(advance(combined, 5), 'expired-lift'), 6)), 0);
    for (const id of ['first', 'third']) {
        const apart = applyEngineOps(combined, [{op: 'move', holder: id, to: 'outside'}], 'fixture.separate');
        assert.equal(apart.world.laws.some(field => field.kind === 'gu.three-heads'), false);
    }
});

test('absence, revoked willingness, hunger, or a short individual reserve interrupts the entire synchronized beat', () => {
    const {engine, bindings} = scene();
    const pending = advance(start(engine, 'combine', 'combine', bindings), 1);
    const changes = [
        [{op: 'move', holder: 'third', to: 'outside'}, [10, 14, 12], 'Three willing operators must be present.'],
        [{op: 'property', holder: 'second', property: 'gu_coordination_ready', value: false}, [10, 14, 12], 'Three willing operators must be present.'],
        [{op: 'set', holder: 'third.gu1', quantity: 'satiety', amount: 1}, [10, 14, 12], 'needs feeding'],
        [{op: 'set', holder: 'second', quantity: fuel, amount: 13}, [10, 13, 12], 'needs more essence'],
        [{op: 'property', holder: 'first.gu1', property: 'gu_rank', value: 2}, [10, 14, 12], 'Every Gu needs rank three through five.'],
    ];
    for (const [change, reserves, reason] of changes) {
        const settled = advance(restore(applyEngineOps(pending, [change], 'fixture.interrupt')), 2);
        const {record, landed} = settled.records.workings.combine;
        assert.equal(record.receipts[0].reason, reason);
        assert.deepEqual(landed, []);
        assert.deepEqual(amounts(settled), reserves);
        assert.equal(gate(advance(lift(settled, 'unassisted'), 3)), 0);
    }
    const duplicate = advance(start(engine, 'duplicate', 'combine', {...bindings, gu18: bindings.gu17}), 2);
    assert.equal(duplicate.records.workings.duplicate.record.receipts[0].reason, 'Bind a different Gu in each slot.');
    assert.deepEqual(amounts(duplicate), [10, 14, 12]);
});
