import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRetainedMethods, buildNativePocketCargo, previewNativeRealmTraveler} from '../src/native_realm_traveler.js';
import {createRealmConnection, previewRealmPassage} from '../src/realm_connections.js';

const key = JSON.stringify({id: 'Test rope'});
const from = {worldId: 'test.home', instanceId: 'home.main', regionId: 'village', layerId: 'material'};
const to = {worldId: 'test.away', instanceId: 'away.main', regionId: 'room', layerId: 'material'};
const clone = v => structuredClone(v);
function fixture() {
    const connection = createRealmConnection({id: 'test.door', revision: 1, from, to, kind: 'physical',
        controllerId: 'player', open: true, openedAt: 0, bidirectional: true, flows: ['body', 'cargo'],
        requirements: {id: 'test.boundary', revision: 1, operations: ['passage']},
        cargoPolicy: {allowed: true, allowEquipped: true, maxUnits: 4, classes: ['carried']}});
    const state = {sequence: 7, clock: 10, realmPrototype: {connection},
        simulation: {custody: {}, people: {player: {body: {mobile: true}}},
            powers: {player: {'tidemark.counterweight': {owned: true, revision: 2}}}}};
    const context = {gameplay: {player: {inventory: {[key]: 2}}}, equipment: {player: {hand: key}},
        vitals: {player: {health: 12, stamina: 6}}, busy: false};
    const cargo = buildNativePocketCargo(state, context, {from, to, connectionId: connection.id});
    assert.equal(cargo.allowed, true);
    const route = {actorId: 'player', sequence: 7, clock: 10, life: 'alive',
        body: {id: 'native.player.body', revision: 1, form: 'human'}, endpoint: clone(from),
        knownConnectionIds: [connection.id], cargo: cargo.cargo, cargoComplete: cargo.cargoComplete,
        bindings: [from, to].map(endpoint => ({endpoint: clone(endpoint), available: true,
            positions: [{id: 'door.arrival', free: true, bodyForms: ['human']}]}))};
    const passage = previewRealmPassage(connection, route, {expectedSequence: 7, expectedRevision: 1});
    assert.equal(passage.allowed, true);
    return {state, context, route, passage};
}
const preview = f => previewNativeRealmTraveler(f.state, f.context, f.route, f.passage);

test('native body/cargo adapter retains one real body, exact stock and learned owner references', () => {
    const f = fixture(), before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, true); assert.equal(plan.nativeExecutable, false);
    assert.deepEqual(plan.arrival.existingBodyRef, {domain: 'body', id: 'native.player.body', revision: 1});
    assert.deepEqual(plan.arrival.presences, []);
    assert.equal(plan.arrival.cargo.reduce((n, c) => n + c.count, 0), 3);
    assert.ok(plan.arrival.cargo.every(c => c.operation === 'move_existing_stock' && c.toBodyId === 'native.player.body'));
    assert.deepEqual(plan.retained.methodRefs, [{domain: 'method', id: 'tidemark.counterweight', revision: 2}]);
    assert.deepEqual(plan.costs, []); assert.deepEqual(f, before);
    const restored = JSON.parse(JSON.stringify(f)); assert.deepEqual(preview(restored), plan);
    restored.route.endpoint = clone(to); restored.route.bindings.reverse();
    restored.passage = previewRealmPassage(restored.state.realmPrototype.connection, restored.route,
        {expectedSequence: 7, expectedRevision: 1, direction: 'reverse'});
    const back = preview(restored); assert.equal(back.allowed, true);
    assert.deepEqual(back.arrival.endpoint, from); assert.deepEqual(back.arrival.cargo, plan.arrival.cargo);
});

test('retained methods require actual owned power and a positive safe revision', () => {
    assert.deepEqual(nativeRetainedMethods({}), []);
    for (const power of [{owned: false, revision: 1}, {owned: true, revision: 0},
        {owned: true, revision: 1.5}, {owned: true, revision: Number.MAX_SAFE_INTEGER + 1}]) {
        assert.deepEqual(nativeRetainedMethods({simulation: {powers: {player: {'tidemark.counterweight': power}}}}), []);
    }
    const f = fixture(), methods = nativeRetainedMethods(f.state);
    assert.deepEqual(methods, [{id: 'tidemark.counterweight', revision: 2, ownerId: 'player', sourceId: null, stage: 'learned'}]);
    methods[0].revision = 99; assert.equal(nativeRetainedMethods(f.state)[0].revision, 2);
});

test('native adapter preserves an upstream route refusal without reading unrelated owners', () => {
    const reasons = ['This route is closed.'];
    assert.deepEqual(previewNativeRealmTraveler({}, {}, {}, {allowed: false, reasons}), {allowed: false, reasons});
});

for (const [name, change, reason] of [
    ['missing inventory binding', f => delete f.context.gameplay, /Cargo data must be plain JSON/],
    ['incomplete cargo flag', f => f.route.cargoComplete = false, /complete actual carried inventory/],
    ['wrong body ID', f => f.route.body.id = 'copied.body', /complete actual carried inventory/],
    ['omitted equipment', f => f.route.cargo.pop(), /complete actual carried inventory/],
    ['duplicated cargo row', f => f.route.cargo[1] = clone(f.route.cargo[0]), /native cargo reference is stale/],
    ['changed stack count', f => f.context.gameplay.player.inventory[key]++, /native cargo reference is stale/],
    ['forged stock revision', f => f.route.cargo[0].stockRef.revision++, /native cargo reference is stale/],
    ['incapacitated body', f => f.route.life = 'incapacitated', /current body is unavailable/],
    ['zero health', f => f.context.vitals.player.health = 0, /current body is unavailable/],
    ['busy native body', f => f.context.busy = true, /current body is unavailable/],
    ['immobile native body', f => f.state.simulation.people.player.body.mobile = false, /no actual physical-passage function/]
]) test(`native traveler refuses ${name}`, () => {
    const f = fixture(); change(f); const before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, false); assert.match(plan.reasons.join(' '), reason); assert.deepEqual(f, before);
    if ('intents' in plan) {assert.deepEqual(plan.intents, []); assert.equal(plan.arrival, null);}
});

test('conventional pocket doorway refuses borrowed goods without enrolling permission', () => {
    const f = fixture(); f.state.simulation.custody.loan = {owner: 'lender', holder: 'player', key, count: 1, at: 0};
    // Remove the identical equipment copy so actual loan stock is unambiguous.
    f.context.equipment.player = {};
    const before = clone(f), plan = buildNativePocketCargo(f.state, f.context, {from, to, connectionId: 'test.door'});
    assert.equal(plan.allowed, false);
    assert.deepEqual(plan.reasons, ['Return borrowed goods before using the conventional doorway.']);
    assert.equal(plan.cargo.find(c => c.ownerId === 'lender').count, 1);
    f.route.cargo = plan.cargo; f.route.cargoComplete = true;
    assert.deepEqual(preview(f).reasons, plan.reasons);
    assert.deepEqual(f.state, before.state); assert.deepEqual(f.context, before.context);
});

test('pocket cargo fails closed for absent doorway, missing stock owners and capacity refusal', () => {
    const f = fixture();
    const missing = buildNativePocketCargo(f.state, f.context, {from, to, connectionId: 'absent'});
    assert.equal(missing.allowed, false); assert.equal(missing.cargoComplete, false); assert.deepEqual(missing.cargo, []);
    assert.match(missing.reasons[0], /No actual doorway/);
    const invalid = buildNativePocketCargo(f.state, {...f.context, equipment: {}}, {from, to, connectionId: 'test.door'});
    assert.equal(invalid.allowed, false); assert.equal(invalid.guards, null);
    f.state.realmPrototype.connection.cargoPolicy.maxUnits = 2;
    const full = buildNativePocketCargo(f.state, f.context, {from, to, connectionId: 'test.door'});
    assert.equal(full.allowed, false); assert.equal(full.cargoComplete, true);
    assert.match(full.reasons.join(' '), /exceeds route capacity/);
});
