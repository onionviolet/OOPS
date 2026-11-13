import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld,
    serializeEngineWorld, startEngineWorking} from '../src/engine_world.js';
import {fightingSpiritWorking, GU_FIGHTING_SPIRIT_LAW, GU_SPIRIT_WORLD_PROPERTIES,
    GU_SPIRIT_WORLD_QUANTITIES} from '../src/world_packs/gu_fighting_spirit_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';

const prime = 'energy:primeval.spirit', red = 'energy:immortal.red-date', soul = 'energy:soul-steadiness';
const config = {packs: ['l.living_body', 'a.mind'],
    shared: {quantities: [...sharedQuantities(['energy', 'stock']), ...GU_SPIRIT_WORLD_QUANTITIES],
        properties: [...sharedProperties(['alive']), ...GU_SPIRIT_WORLD_PROPERTIES,
            ...['gu_kind', 'gu_keeper', 'gu_controller'].map(id => ({id, type: 'label'})),
            {id: 'gu_rank', type: 'level', min: 1}]},
    host: {laws: [GU_FIGHTING_SPIRIT_LAW]}};
function scene() {
    const gu = (id, kind, rank) => ({id, kind: 'body', as: ['gu'], place: 'court', quantities: {satiety: 9},
        properties: {alive: true, gu_kind: kind, gu_rank: rank, gu_keeper: 'keeper', gu_controller: 'keeper'}});
    return createEngineWorld({...config, holders: [
        {id: 'court', kind: 'place', quantities: {'stock:rallied': 0}},
        {id: 'keeper', kind: 'body', as: ['operator'], place: 'court',
            properties: {gu_spirit_control: true, mind_awake: true, mind_pain: 0},
            quantities: {[prime]: 4, [red]: 3, [soul]: 3, gu_fighting_spirit: 0}},
        gu('thought-a', 'thought-support', 1), gu('will-a', 'will-support', 1),
        gu('spare', 'thought-support', 1), gu('fight-a', 'fight', 7),
    ]});
}
const ids = {operator: 'keeper', site: 'court', thought: 'thought-a', will: 'will-a', fight: 'fight-a'};
function start(engine, id, action = 'cast') {
    const method = fightingSpiritWorking(action);
    return startEngineWorking(engine, {id, method, law: GU_FIGHTING_SPIRIT_LAW, payer: 'keeper',
        bindings: Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]))});
}
function advance(engine, at) {
    const result = advanceEngineWorld(engine, at);
    assert.equal(result.pending, false);
    return result.engine;
}
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const price = engine => [prime, red].map(key => engine.world.holders.keeper.quantities[key]);
const cast = engine => engine.records.workings.cast.record;

test('late loss of control keeps both paid stages and lands backlash on exact Gu and caster', () => {
    const pending = advance(start(scene(), 'cast'), 1);
    assert.deepEqual(price(pending), [2, 3]);
    const disturbed = applyEngineOps(pending, [
        {op: 'property', holder: 'keeper', property: 'gu_spirit_control', value: false},
    ], 'fixture.disturbance');
    const failed = advance(restore(disturbed), 3);
    assert.deepEqual(serializeEngineWorld(failed), serializeEngineWorld(advance(disturbed, 3)));
    assert.deepEqual(price(failed), [2, 0]);
    assert.deepEqual(cast(failed).receipts[1].observed, {outcome: 'backlash', lost: ['thought-a', 'will-a']});
    const {holders} = failed.world;
    assert.equal(holders['thought-a'], undefined);
    assert.equal(holders['will-a'], undefined);
    assert.ok(holders.spare);
    assert.ok(holders['fight-a']);
    assert.equal(holders.keeper.properties.mind_pain, 2);
    assert.equal(holders.keeper.quantities[soul], 1);
    const unrallied = advance(start(failed, 'rally', 'rally'), 4);
    assert.equal(unrallied.records.workings.rally.record.status, 'interrupted');
    assert.equal(unrallied.world.holders.court.quantities['stock:rallied'], 0);
});

test('successful release funds a rally; a short core or withdrawn support retains preparation only', () => {
    const pending = advance(start(scene(), 'cast'), 1);
    const rallied = advance(start(advance(restore(pending), 3), 'rally', 'rally'), 4);
    assert.deepEqual(price(rallied), [2, 0]);
    assert.equal(rallied.world.holders.court.quantities['stock:rallied'], 1);
    assert.ok(rallied.world.holders['thought-a']);
    const short = applyEngineOps(pending, [{op: 'set', holder: 'keeper', quantity: red, amount: 2}], 'fixture.short');
    const denied = advance(restore(short), 3);
    assert.deepEqual(price(denied), [2, 2]);
    assert.equal(cast(denied).receipts[1].reason, 'needs more essence');
    assert.ok(denied.world.holders['thought-a']);
    assert.equal(denied.world.holders.keeper.properties.mind_pain, 0);
    const lost = applyEngineOps(pending, [{op: 'property', holder: 'will-a', property: 'gu_keeper', value: 'rival'}], 'fixture.transfer');
    const refused = advance(lost, 3);
    assert.deepEqual(price(refused), [2, 3]);
    assert.equal(cast(refused).receipts[1].reason, 'The prepared supports are no longer available.');
    const hungry = applyEngineOps(pending, [{op: 'set', holder: 'will-a', quantity: 'satiety', amount: 0}], 'fixture.hungry');
    const interrupted = advance(restore(hungry), 3);
    assert.deepEqual(price(interrupted), [2, 3]);
    assert.ok(interrupted.world.holders['will-a']);
    assert.equal(cast(interrupted).receipts[1].reason, 'The prepared supports are no longer available.');
    const competing = advance(start(pending, 'competing'), 2);
    assert.deepEqual(price(competing), [2, 3]);
    assert.equal(competing.records.workings.competing.record.receipts[0].reason, 'A support is already preparing another working.');
});

test('an unfunded initial beat leaves every reserve and support untouched', () => {
    const dry = applyEngineOps(scene(), [{op: 'set', holder: 'keeper', quantity: prime, amount: 1}], 'fixture.dry');
    const denied = advance(start(dry, 'cast'), 3);
    assert.deepEqual(price(denied), [1, 3]);
    assert.equal(cast(denied).receipts[0].reason, 'needs more essence');
    assert.ok(denied.world.holders['thought-a']);
    assert.ok(denied.world.holders['will-a']);
});
