import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {createRealmConnection} from '../src/realm_connections.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {composeSubstrate} from '../src/world_substrate.js';
import {bindGearWard, gearWardShared, settleGearHit, startWardAssemblyHandoff, startWardSocketWork, WARD_SOCKET,
    WARD_SOCKET_LAW, wearGearWard} from '../src/world_packs/gear_ward.js';
import {startWardRealmPassage, wardPassagePort, WARD_PASSAGE_LAW} from '../src/world_packs/workshop_ward_passage.js';

const door = 'workshop-door', mount = 'shield', insert = 'insert', bearer = 'borrower';
const ward = 'fire-ward', lender = 'lender', from = 'mine', to = 'waystation';
const endpoint = (worldId, regionId) => ({worldId, instanceId: `${worldId}.main`, regionId, layerId: 'material'});
const connection = createRealmConnection({id: door, revision: 1, kind: 'physical',
    from: endpoint('workshop', from), to: endpoint('waystation-world', to), controllerId: lender,
    open: true, openedAt: 0, bidirectional: true, duration: 2, flows: ['body', 'cargo'],
    requirements: {id: 'workshop-doorway', revision: 1, operations: ['passage'], bodyForms: ['human']},
    cargoPolicy: {allowed: true, maxUnits: 2, allowEquipped: true, classes: ['ward-assembly']}});
const configFor = (connection, payment = {}) => ({packs: ['n.knowledge'],
    shared: {...gearWardShared, quantities: [...gearWardShared.quantities, WORLD_QUANTITIES.vitality]},
    host: {laws: [WARD_SOCKET_LAW, WARD_PASSAGE_LAW], ports: {readThing: wardPassagePort({connection, from, to, ...payment})}}});
const config = configFor(connection);
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
const restore = (engine, rules = config) => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), rules);

function setup(permission, rules = config) {
    const engine = createEngineWorld({...rules, links: [{id: door, kind: 'realm-door', from, to, cost: 2}], holders: [
        {id: from, kind: 'place', quantities: {noise: 0}}, {id: to, kind: 'place', quantities: {noise: 0}},
        ...[bearer, lender].map(id => ({id, kind: 'body', place: from, quantities: {vitality: 100}})),
        ...[[mount, 'ward-recess'], [insert, 'ward-tongue']].map(([id, socket]) =>
            ({id, kind: 'thing', place: from, properties: {holder: lender, [WARD_SOCKET]: socket}})),
    ]});
    const bound = bindGearWard(engine, {id: ward, carrier: insert, bearer: lender, type: 'fire', phase: 'contact',
        charge: 8, per: 4, decay: {every: 3, amount: 1}});
    const installed = advance(startWardSocketWork(bound, {id: 'fit', mount, insert, bearer: lender, action: 'install'}), 3);
    const loan = startWardAssemblyHandoff(installed, {id: 'loan', mount, insert, from: lender, to: bearer, mode: 'loan', connection: permission});
    return wearGearWard(advance(loan, 6), bearer, mount);
}

test('a named physical doorway carries the exact borrowed ward across authored worlds', () => {
    const cross = (engine, id = 'cross') => startWardRealmPassage(engine, {id, bearer, mount, insert, door});
    assert.throws(() => cross(restore(setup(null))), /borrowed cargo/i);
    const pending = advance(cross(setup(door)), 7);
    const closed = applyEngineOps(pending, [{op: 'link_set', id: door, state: 'closed'}], 'fixture:close-door');
    const stopped = advance(restore(closed), 8);
    assert.equal(stopped.records.workings.cross.record.status, 'interrupted');
    for (const part of [bearer, mount, insert]) assert.equal(stopped.world.holders[part].place, from);
    const extra = applyEngineOps(pending, [{op: 'holder_add', value: {id: 'extra', kind: 'thing',
        place: from, properties: {holder: bearer}}}], 'fixture:receive-extra-cargo');
    const loaded = advance(restore(extra), 8);
    assert.equal(loaded.records.workings.cross.record.status, 'interrupted');
    for (const part of [bearer, mount, insert, 'extra']) assert.equal(loaded.world.holders[part].place, from);
    const arrived = advance(restore(pending), 8);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(pending, 8)));
    for (const part of [bearer, mount, insert]) assert.equal(arrived.world.holders[part].place, to);
    assert.equal(arrived.world.holders[lender].place, from);
    const hit = settleGearHit(arrived, {id: ward, wearer: bearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.equal(hit.damage, 3);
    assert.equal(hit.engine.records.stored[ward].charge.now, 2);
    const returned = advance(restore(cross(hit.engine, 'come-back')), 10);
    const handedBack = advance(restore(startWardAssemblyHandoff(returned,
        {id: 'return-loan', mount, insert, from: bearer, to: lender, mode: 'return'})), 13);
    for (const part of [mount, insert]) assert.equal(handedBack.world.holders[part].properties.holder, lender);
    assert.equal(handedBack.records.stored[ward].carrier, insert);
});

test('realm passage debits the combined quoted fee once on arrival', () => {
    const fee = 'stock:door_toll';
    const rules = configFor({...connection, costs: [{ownerId: '$actor', resourceId: fee, amount: 2}],
        requirements: {...connection.requirements, costs: [{ownerId: '$actor', resourceId: fee, amount: 1}]}});
    const ready = applyEngineOps(setup(door, rules), [{op: 'carry', holder: bearer, quantity: fee, amount: 4}], 'fixture:toll');
    const cross = (engine, id = 'cross') => startWardRealmPassage(engine, {id, bearer, mount, insert, door});
    const pending = advance(cross(cross(ready), 'second-cross'), 7);
    const balance = engine => engine.world.holders[bearer].quantities[fee];
    assert.equal(balance(pending), 4);
    const closed = applyEngineOps(pending, [{op: 'link_set', id: door, state: 'closed'}], 'fixture:close-door');
    const stopped = advance(restore(closed, rules), 8);
    assert.equal(balance(stopped), 4);
    const spent = applyEngineOps(pending, [{op: 'add', holder: bearer, quantity: fee, amount: -2}], 'fixture:spend-toll');
    const short = advance(restore(spent, rules), 8);
    assert.equal(balance(short), 2);
    for (const state of [short, stopped]) {
        assert.equal(state.records.workings.cross.record.status, 'interrupted');
        for (const part of [bearer, mount, insert]) assert.equal(state.world.holders[part].place, from);
    }
    const arrived = advance(restore(pending, rules), 8);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(pending, 8)));
    assert.equal(balance(arrived), 1);
    assert.equal(arrived.records.workings['second-cross'].record.status, 'interrupted');
    for (const part of [bearer, mount, insert]) assert.equal(arrived.world.holders[part].place, to);
    assert.throws(() => cross(arrived, 'return-short'), /reserve cannot pay/);
});

test('a collected doorway toll transfers actual stock once, or leaves the ward at its origin', () => {
    const fee = 'stock:door_toll';
    const route = {...connection, costs: [{ownerId: '$actor', resourceId: fee, amount: 2}],
        requirements: {...connection.requirements, costs: [{ownerId: '$actor', resourceId: fee, amount: 1}]}};
    const quantityRules = composeSubstrate({packs: [{id: 'workshop.toll'}], quantities: [WORLD_QUANTITIES.stock]});
    const rules = configFor(route, {collectorId: lender, rules: quantityRules});
    const ready = applyEngineOps(setup(door, rules), [
        {op: 'carry', holder: bearer, quantity: fee, amount: 6},
        {op: 'carry', holder: lender, quantity: fee, amount: 1},
        {op: 'carry', holder: to, quantity: fee, amount: 0},
    ], 'fixture:toll-accounts');
    const cross = (engine, id = 'cross') => startWardRealmPassage(engine, {id, bearer, mount, insert, door});
    const pending = advance(cross(cross(ready), 'second-cross'), 7);
    const balances = engine => [bearer, lender].map(id => engine.world.holders[id].quantities[fee]);
    assert.deepEqual(balances(pending), [6, 1]);

    const max = WORLD_QUANTITIES.stock.max;
    const full = applyEngineOps(pending, [{op: 'set', holder: lender, quantity: fee, amount: max - 2}], 'fixture:fill-till');
    const short = applyEngineOps(pending, [{op: 'set', holder: bearer, quantity: fee, amount: 2}], 'fixture:spend-toll');
    const swapped = configFor(route, {collectorId: to, rules: quantityRules});
    for (const [candidate, config, expected] of [[full, rules, [6, max - 2]], [short, rules, [2, 1]], [pending, swapped, [6, 1]]]) {
        const stopped = advance(restore(candidate, config), 8);
        assert.deepEqual(balances(stopped), expected);
        assert.equal(stopped.world.holders[to].quantities[fee], 0);
        assert.equal(stopped.records.workings.cross.record.status, 'interrupted');
        for (const part of [bearer, mount, insert]) assert.equal(stopped.world.holders[part].place, from);
    }
    const arrived = advance(restore(pending, rules), 8);
    assert.deepEqual(balances(arrived), [3, 4]);
    assert.equal(arrived.records.workings['second-cross'].record.status, 'interrupted');
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(pending, 8)));
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(restore(arrived, rules), 8)));
    for (const part of [bearer, mount, insert]) assert.equal(arrived.world.holders[part].place, to);
    const hit = settleGearHit(arrived, {id: ward, wearer: bearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.equal(hit.damage, 3);
});
