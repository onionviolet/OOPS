import test from 'node:test';
import assert from 'node:assert/strict';
import {createRealmConnection, validateRealmConnection, realmConnectionBinding,
    validateRealmConnectionBinding, previewRealmPassage, planRealmOpening,
    planRealmClosure, realmConnectionView} from '../src/realm_connections.js';

const from = {worldId: 'test.home', instanceId: 'home.main', regionId: 'village', layerId: 'material'};
const to = {worldId: 'test.away', instanceId: 'away.main', regionId: 'room', layerId: 'material'};
const clone = value => structuredClone(value);
const saved = value => JSON.parse(JSON.stringify(value));
function fixture() {
    const connection = createRealmConnection({id: 'test.door', revision: 3, kind: 'physical',
        from, to, controllerId: 'player', open: true, openedAt: 5, lifetime: 30, expiresAt: 35,
        bidirectional: true, duration: 2, flows: ['body', 'cargo'],
        requirements: {id: 'test.boundary', revision: 1, operations: ['passage'], bodyForms: ['human']},
        cargoPolicy: {allowed: true, maxUnits: 4, allowEquipped: true, classes: ['carried']}});
    const context = {actorId: 'player', sequence: 7, clock: 10, endpoint: clone(from), life: 'alive',
        body: {id: 'player.body', revision: 2, form: 'human'}, busy: false,
        knownConnectionIds: [connection.id], knownBoundaryIds: ['test.boundary'],
        sources: [], resources: [], cargoComplete: true,
        cargo: [{itemId: 'cargo.rope', ownerId: 'player', holderId: 'player', classId: 'carried',
            count: 2, equipped: false, transferable: true, authorizedConnectionIds: []}],
        bindings: [from, to].map(endpoint => ({endpoint: clone(endpoint), available: true,
            positions: [{id: 'door.arrival', free: true, bodyForms: ['human']}]}))};
    const request = {expectedSequence: 7, expectedRevision: 3, operation: 'passage', direction: 'forward'};
    return {connection, context, request};
}
const preview = f => previewRealmPassage(f.connection, f.context, f.request);
function refused(f, reason) {
    const before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, false);
    assert.ok(plan.reasons.includes(reason), JSON.stringify(plan.reasons));
    assert.deepEqual(plan.effects, []);
    assert.equal(plan.arrival, null);
    assert.deepEqual(f, before);
}

test('physical passage moves existing body and complete cargo without mutating owners', () => {
    const f = fixture(), before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, true);
    assert.deepEqual(plan.reasons, []);
    assert.deepEqual(plan.arrival, {endpoint: to, positionId: 'door.arrival',
        bodyRef: {id: 'player.body', revision: 2},
        cargo: [{itemId: 'cargo.rope', ownerId: 'player', holderId: 'player', count: 2}]});
    assert.equal(plan.effects[0].type, 'realm.body_passage');
    assert.equal(plan.effects[0].at, 12);
    assert.equal(plan.effects[0].retainIdentity, true);
    assert.equal(plan.effects[0].moveExistingCargo, true);
    assert.equal(plan.effects[1].type, 'realm.use_receipt');
    assert.equal(plan.guards[1].checkSupportAgain, true);
    assert.deepEqual(f, before);
    plan.arrival.endpoint.regionId = 'other';
    assert.deepEqual(f, before, 'returned plans must be detached');
});

const refusals = [
    ['stale sequence', f => f.request.expectedSequence--, 'This connection request is stale.'],
    ['stale revision', f => f.request.expectedRevision--, 'This connection request is stale.'],
    ['undiscovered route', f => f.context.knownConnectionIds = [], 'Discover this connection through actual evidence first.'],
    ['busy body', f => f.context.busy = true, 'Finish the current committed activity before this use.'],
    ['dead actor', f => f.context.life = 'dead', "The acting person's current life does not support this use."],
    ['unsupported body form', f => f.context.body.form = 'bird', 'The current body is incompatible with this boundary.'],
    ['wrong origin', f => f.context.endpoint = clone(to), "The actor is not at this route's actual origin endpoint."],
    ['missing destination', f => f.context.bindings.pop(), 'The existing destination binding is unavailable; a route cannot create it.'],
    ['closed route', f => {f.connection.open = false; f.connection.closure = {cause: 'test.close', at: 9, reason: 'manual'};}, 'This route is closed.'],
    ['expired lease', f => f.context.clock = 35, "This route's access lease has expired."],
    ['arrival at lease expiry', f => f.context.clock = 33, 'The declared route cannot support the full action before closure.'],
    ['future route receipt', f => f.context.clock = 4, "The route's saved time is ahead of the supplied played clock."],
    ['reverse one-way passage', f => {f.request.direction = 'reverse'; f.context.endpoint = clone(to); f.connection.bidirectional = false;}, 'This route does not admit reverse passage.'],
    ['historical chronology', f => f.connection.chronology.mode = 'historical', 'This prototype supports present-time connections only.'],
    ['missing body flow', f => f.connection.flows = ['cargo'], 'Bodily passage requires a real admitted body channel or transport source.'],
    ['cross-layer body support', f => {f.connection.to.layerId = 'echo'; f.context.bindings[1].endpoint.layerId = 'echo';}, 'The source/channel does not provide actual cross-layer body/contact support.'],
    ['occupied arrival', f => f.context.bindings[1].positions[0].free = false, 'No currently free, compatible arrival position is bound.'],
    ['requested unbound position', f => f.request.arrivalPositionId = 'absent', 'No currently free, compatible arrival position is bound.'],
    ['incomplete inventory', f => f.context.cargoComplete = false, 'Bind the complete actual carried inventory before bodily passage.'],
    ['omitted carried cargo', f => f.request.cargo = [], 'Deposit or transfer omitted cargo through its actual owner before passage.'],
    ['partial stack', f => f.request.cargo = [{itemId: 'cargo.rope', count: 1}], 'Deposit or transfer omitted cargo through its actual owner before passage.'],
    ['foreign cargo', f => f.request.cargo = [{itemId: 'cargo.absent', count: 2}], 'Requested cargo is not actually held by this actor.'],
    ['nontransferable cargo', f => f.context.cargo[0].transferable = false, 'The route cannot admit this actual cargo.'],
    ['equipped cargo policy', f => {f.context.cargo[0].equipped = true; f.connection.cargoPolicy.allowEquipped = false;}, 'This route does not admit the equipped item.'],
    ['cargo capacity', f => f.connection.cargoPolicy.maxUnits = 1, 'Actual cargo exceeds the declared route capacity.'],
    ['unpermitted lender', f => f.context.cargo[0].ownerId = 'lender', "Borrowed cargo lacks this route's custody permission."]
];
for (const [name, change, reason] of refusals) test(`passage refuses ${name} with no effects`, () => {
    const f = fixture(); change(f); refused(f, reason);
});

test('reverse passage retains the same body and lender-owned cargo with exact route authorization', () => {
    const f = fixture(); f.context.endpoint = clone(to); f.request.direction = 'reverse';
    f.context.cargo[0].ownerId = 'lender'; f.context.cargo[0].authorizedConnectionIds = [f.connection.id];
    const plan = preview(f);
    assert.equal(plan.allowed, true);
    assert.deepEqual(plan.arrival.endpoint, from);
    assert.equal(plan.arrival.cargo[0].ownerId, 'lender');
});

test('route and boundary costs aggregate against the same actual reserve', () => {
    const f = fixture(); f.connection.costs = [{ownerId: '$actor', resourceId: 'focus', amount: 2}];
    f.connection.requirements.costs = [{ownerId: '$actor', resourceId: 'focus', amount: 3}];
    f.context.resources = [{ownerId: 'player', resourceId: 'focus', amount: 4}];
    refused(f, 'The actual focus reserve cannot pay this use.');
    f.context.resources[0].amount = 5;
    const plan = preview(f); assert.equal(plan.allowed, true);
    assert.deepEqual(plan.costs, [{ownerId: 'player', resourceId: 'focus', amount: 5}]);
    assert.equal(f.context.resources[0].amount, 5);
});

test('view keeps the original body and cannot carry physical cargo or become passage', () => {
    const f = fixture(); f.connection.kind = 'view'; f.connection.flows = ['light'];
    f.connection.requirements.operations = ['view', 'passage']; f.request.operation = 'view';
    const plan = preview(f); assert.equal(plan.allowed, true); assert.equal(plan.arrival, null);
    assert.deepEqual(plan.effects[0].bodyRemains, from);
    f.request.cargo = [{itemId: 'cargo.rope', count: 2}];
    refused(f, 'Viewing/projection/manifestation does not copy or carry physical stock in this prototype.');
    delete f.request.cargo; f.request.operation = 'passage';
    refused(f, 'A viewing/projection route is not bodily passage.');
});

test('opening, closure and reopening round-trip authored save bindings without resetting interiors', () => {
    const f = fixture(); f.connection.open = false; f.connection.openedAt = f.connection.expiresAt = null;
    const binding = realmConnectionBinding(f.connection), before = clone(f);
    const opened = planRealmOpening(f.connection, f.context, f.request);
    assert.equal(opened.allowed, true); assert.equal(opened.nextConnection.revision, 4);
    assert.equal(opened.nextConnection.expiresAt, 40);
    assert.equal(opened.effects[1].createInterior, false); assert.equal(opened.effects[1].resetInterior, false);
    assert.deepEqual(f, before);
    const c = saved(opened.nextConnection);
    assert.equal(validateRealmConnectionBinding(c, saved(binding)), c);
    const closed = planRealmClosure(c, f.context, {...f.request, expectedRevision: 4});
    assert.equal(closed.allowed, true);
    assert.deepEqual(closed.nextConnection.closure, {cause: closed.cause, at: 10, reason: 'manual'});
    assert.equal(closed.effects[1].retainInterior, true); assert.equal(closed.effects[1].retainResidents, true);
    assert.equal(closed.effects[1].retainCargoOwners, true); assert.equal(closed.effects[1].moveOccupants, false);
    assert.equal(validateRealmConnectionBinding(saved(closed.nextConnection), binding).open, false);
    const reopened = planRealmOpening(saved(closed.nextConnection), {...f.context, clock: 15}, {...f.request, expectedRevision: 5});
    assert.equal(reopened.allowed, true); assert.equal(reopened.nextConnection.revision, 6);
    assert.equal(reopened.nextConnection.expiresAt, 45); assert.equal('closure' in reopened.nextConnection, false);
    assert.doesNotThrow(() => validateRealmConnectionBinding(reopened.nextConnection, binding));
    const altered = saved(reopened.nextConnection); altered.cargoPolicy.maxUnits++;
    assert.throws(() => validateRealmConnectionBinding(altered, binding), /authored cargoPolicy binding/);
    assert.throws(() => validateRealmConnection({...c, expiresAt: 41}), /expiry must match/);
});

test('open and manual close require distinct scoped controller authority', () => {
    const f = fixture(); f.connection.controllerId = 'keeper';
    const closed = {...f.connection, open: false, openedAt: null, expiresAt: null};
    const p = planRealmOpening(closed, f.context, f.request);
    assert.equal(p.allowed, false); assert.match(p.reasons.join(' '), /actual controller or scoped authority/);
    f.context.authorityIds = [`connection.open.${f.connection.id}`];
    assert.equal(planRealmOpening(closed, f.context, f.request).allowed, true);
    assert.equal(planRealmClosure(f.connection, f.context, f.request).allowed, false);
    f.context.authorityIds = [`connection.close.${f.connection.id}`];
    assert.equal(planRealmClosure(f.connection, f.context, f.request).allowed, true);
    f.context.endpoint = {...from, regionId: 'elsewhere'};
    assert.match(planRealmClosure(f.connection, f.context, f.request).reasons.join(' '), /Remote closure/);
    f.context.authorityIds.push(`connection.close.remote.${f.connection.id}`);
    assert.equal(planRealmClosure(f.connection, f.context, f.request).allowed, true);
});

test('expiry and lost-anchor closures require actual causal evidence rather than manual authority', () => {
    const f = fixture(); f.connection.controllerId = 'keeper';
    const early = planRealmClosure(f.connection, f.context, {...f.request, reason: 'expired'});
    assert.deepEqual(early.reasons, ['This route has not expired.']); assert.deepEqual(early.effects, []);
    const expired = planRealmClosure(f.connection, {...f.context, clock: 35}, {...f.request, reason: 'expired'});
    assert.equal(expired.allowed, true); assert.equal(expired.nextConnection.closure.reason, 'expired');
    f.connection.requirements.anchorId = 'door.anchor';
    assert.equal(planRealmClosure(f.connection, f.context, {...f.request, reason: 'anchor_lost'}).allowed, false);
    f.context.anchors = [{id: 'door.anchor', revision: 2, available: false}];
    assert.equal(planRealmClosure(f.connection, f.context, {...f.request, reason: 'anchor_lost'}).allowed, true);
});

test('known route view reports witnessed state, not undisclosed live route state', () => {
    const f = fixture(); assert.equal(realmConnectionView(f.connection, {...f.context, knownConnectionIds: []}).visible, false);
    f.context.evidence = [{id: 'witness.old', recipientId: 'player', at: 6, kind: 'observation', text: 'Door was open.',
        connectionId: f.connection.id, connectionSnapshot: {revision: 1, open: true}},
    {id: 'witness.other', recipientId: 'keeper', at: 9, kind: 'report', text: 'Private report.',
        connectionId: f.connection.id, connectionSnapshot: {revision: 2, open: false}}];
    const view = realmConnectionView(f.connection, f.context);
    assert.deepEqual(view.knownState, {revision: 1, open: true, observedAt: 6});
    assert.deepEqual(view.observations.map(e => e.id), ['witness.old']);
});
