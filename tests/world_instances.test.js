import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorldInstance, createWorldVisit, createWorldBindings, validateWorldEndpoint,
    validateWorldRecords, validateWorldInstance, validateWorldVisit, planWorldClock,
    planWorldDeparture, planWorldInstanceUpdate, worldInstanceFacts, worldInstanceView} from '../src/world_instances.js';

const clone = v => structuredClone(v);
const saved = v => JSON.parse(JSON.stringify(v));
function fixture() {
    const definition = {id: 'test.definition', worldId: 'test.away', revision: 1, label: 'Test room', unidentifiedLabel: 'Unknown room',
        regions: [{id: 'room', layerIds: ['material']}], sites: [{id: 'bench', label: 'Bench', regionId: 'room', layerId: 'material', initialOpen: false}],
        initialFacts: {'bench.ready': false, visits: 0}, uniqueClaimIds: ['gift.once']};
    const instance = createWorldInstance(definition, {id: 'away.main', continuityId: 'test.branch', eraId: 'test.present', playedAt: 10,
        parentInstanceId: 'home.main', actorIds: ['player']});
    const endpoint = {worldId: 'test.away', instanceId: instance.id, regionId: 'room', layerId: 'material'};
    const bindings = {actorIds: ['player', 'friend'], externalInstances: [{id: 'home.main', worldId: 'test.home', parentInstanceId: null}]};
    return {definition, instance, endpoint, bindings};
}
function visit(f, actorId = 'player', id = 'visit.first') {
    return createWorldVisit(f.instance, {id, actorId, endpoint: f.endpoint, playedAt: f.instance.clock.observedAt}, f.definition,
        {actorIds: f.bindings.actorIds, visits: []});
}

test('world instances bind definition, native endpoint and save-shaped records without sharing facts', () => {
    const f = fixture(), v = visit(f), records = {definitions: [f.definition], instances: [f.instance], visits: [v]};
    assert.equal(validateWorldRecords(saved(records), saved(f.bindings)), true);
    assert.equal(validateWorldEndpoint(saved(f.endpoint), saved(f.instance), saved(f.definition)), true);
    assert.deepEqual(f.instance.clock, {elapsed: 0, observedAt: 10, unit: 'played_minutes', absence: 'freeze'});
    f.instance.facts.visits = 1; assert.equal(f.definition.initialFacts.visits, 0);
    const foreign = {...f.endpoint, instanceId: 'other.main'};
    assert.throws(() => validateWorldEndpoint(foreign, f.instance, f.definition), /does not belong/);
    const incompatible = saved(f.instance); incompatible.definitionRevision++;
    assert.throws(() => validateWorldInstance(incompatible, f.definition), /incompatible world instance/);
});

test('absent local clock freezes while occupied time is counted once for two visitors', () => {
    const f = fixture(), before = clone(f.instance);
    const absent = planWorldClock(f.instance, {playedAt: 15, visits: [], expectedRevision: 1}, f.definition);
    assert.equal(absent.advancedBy, 0); assert.equal(absent.absentBy, 5);
    assert.deepEqual(f.instance, before); f.instance = absent.nextInstance;
    const visits = [visit(f), visit(f, 'friend', 'visit.friend')];
    const occupied = planWorldClock(f.instance, {playedAt: 20, visits, expectedRevision: 2}, f.definition);
    assert.equal(occupied.advancedBy, 5); assert.equal(occupied.absentBy, 0);
    assert.equal(occupied.nextInstance.clock.elapsed, 5, 'two bodies do not double the local clock');
    const same = planWorldClock(occupied.nextInstance, {playedAt: 20, visits, expectedRevision: 3}, f.definition);
    assert.equal(same.advancedBy, 0); assert.equal(same.nextInstance.revision, 3);
});

test('departure, absent time and a later visit preserve local facts and history through JSON', () => {
    const f = fixture(), v = visit(f), before = clone(f.instance);
    const leave = planWorldDeparture(f.instance, v, {playedAt: 15, visits: [v], expectedRevision: 1}, f.definition);
    assert.equal(leave.allowed, true); assert.equal(leave.advancedBy, 5);
    assert.equal(leave.nextVisit.status, 'ended'); assert.equal(leave.nextVisit.exitedAt, 15);
    assert.deepEqual(f.instance, before); assert.equal(v.status, 'active');
    const records = saved({definitions: [f.definition], instances: [leave.nextInstance], visits: [leave.nextVisit]});
    assert.equal(validateWorldRecords(records, f.bindings), true);
    const absent = planWorldClock(records.instances[0], {playedAt: 30, visits: records.visits, expectedRevision: 2}, f.definition);
    assert.equal(absent.nextInstance.clock.elapsed, 5);
    const returnVisit = createWorldVisit(absent.nextInstance, {id: 'visit.return', actorId: 'player', endpoint: f.endpoint, playedAt: 30},
        f.definition, {actorIds: ['player'], visits: records.visits});
    records.instances[0] = absent.nextInstance; records.visits.push(returnVisit);
    assert.equal(validateWorldRecords(saved(records), f.bindings), true);
    const end = planWorldDeparture(records.instances[0], returnVisit, {playedAt: 34, visits: records.visits, expectedRevision: 3}, f.definition);
    assert.equal(end.nextInstance.clock.elapsed, 9); assert.equal(end.nextVisit.exitedAt, 34);
});

test('stale clocks and backward time are refusal plans, never partial instance updates', () => {
    const f = fixture(), before = clone(f.instance);
    for (const [request, reason] of [[{playedAt: 11, visits: [], expectedRevision: 0}, 'This world clock request is stale.'],
        [{playedAt: 9, visits: [], expectedRevision: 1}, 'Joined played time cannot move backward.']]) {
        const plan = planWorldClock(f.instance, request, f.definition);
        assert.equal(plan.allowed, false); assert.deepEqual(plan.reasons, [reason]); assert.equal(plan.nextInstance, null);
    }
    assert.deepEqual(f.instance, before);
});

test('visits require actual actor, reconciled clock and singular active traveler', () => {
    const f = fixture(), v = visit(f), seed = {id: 'visit.next', actorId: 'player', endpoint: f.endpoint, playedAt: 10};
    assert.throws(() => createWorldVisit(f.instance, seed, f.definition, {actorIds: [], visits: []}), /existing traveler binding/);
    assert.throws(() => createWorldVisit(f.instance, {...seed, playedAt: 11}, f.definition, {actorIds: ['player'], visits: []}), /Reconcile absent world clock/);
    assert.throws(() => createWorldVisit(f.instance, seed, f.definition, {actorIds: ['player'], visits: [v]}), /already visiting/);
    assert.throws(() => validateWorldVisit({...v, enteredAt: 11}, f.instance, f.definition), /ahead of its reconciled/);
    assert.throws(() => planWorldDeparture(f.instance, v, {playedAt: 11, visits: [{...v, revision: 2}], expectedRevision: 1}, f.definition), /actual current visit record/);
    const leave = planWorldDeparture(f.instance, v, {playedAt: 11, visits: [v], expectedRevision: 1}, f.definition);
    const ended = planWorldDeparture(leave.nextInstance, leave.nextVisit, {playedAt: 11, visits: [leave.nextVisit], expectedRevision: 2}, f.definition);
    assert.deepEqual(ended.reasons, ['This visit already ended.']); assert.equal(ended.nextInstance, null);
});

test('collection validation rejects missing parents, cycles, duplicate active visits and overlapping histories', () => {
    const f = fixture(), records = {definitions: [f.definition], instances: [f.instance], visits: [visit(f)]};
    assert.throws(() => validateWorldRecords(records, {...f.bindings, externalInstances: []}), /Missing enclosing instance/);
    const cycle = clone(f.bindings); cycle.externalInstances[0].parentInstanceId = f.instance.id;
    assert.throws(() => validateWorldRecords(records, cycle), /Cyclic instance/);
    assert.throws(() => validateWorldRecords({...records, visits: [visit(f), visit(f, 'player', 'visit.second')]}, f.bindings), /two active world visits/);
    const ended = {...visit(f), status: 'ended', enteredAt: 4, exitedAt: 8};
    const overlap = {...ended, id: 'visit.overlap', enteredAt: 7, exitedAt: 9};
    assert.throws(() => validateWorldRecords({...records, visits: [ended, overlap]}, f.bindings), /overlapping visit histories/);
    assert.equal(validateWorldRecords({...records, visits: [ended, {...overlap, enteredAt: 8}]}, f.bindings), true,
        'adjacent ended visits are supported');
    assert.throws(() => validateWorldRecords(records, {...f.bindings, actorIds: []}), /actor\/claim-holder binding/);
});

test('one-time local claims and facts survive later visits and cannot be settled again', () => {
    const f = fixture(), before = clone(f.instance);
    const request = {expectedRevision: 1, facts: {'bench.ready': true, visits: 1}, sites: {bench: true},
        settleClaims: [{key: 'gift.once', holderId: 'player'}], attachActorIds: ['friend']};
    const update = planWorldInstanceUpdate(f.instance, request, f.definition, {actorIds: ['player', 'friend']});
    assert.equal(update.allowed, true); assert.equal(update.nextInstance.revision, 2); assert.deepEqual(f.instance, before);
    const restored = saved(update.nextInstance);
    assert.deepEqual(restored.claims['gift.once'], {holderId: 'player', settledAt: 10});
    const retry = planWorldInstanceUpdate(restored, {expectedRevision: 2, settleClaims: request.settleClaims}, f.definition, {actorIds: ['player', 'friend']});
    assert.equal(retry.allowed, false); assert.equal(retry.nextInstance, null); assert.match(retry.reasons[0], /already settled/);
    const unchanged = planWorldInstanceUpdate(restored, {expectedRevision: 2}, f.definition, {actorIds: ['player', 'friend']});
    assert.equal(unchanged.changed, false); assert.equal(unchanged.nextInstance.revision, 2);
    assert.throws(() => planWorldInstanceUpdate(restored, {expectedRevision: 2, facts: {visits: false}}, f.definition, {actorIds: ['player', 'friend']}), /Unsupported local fact patch/);
});

test('authoring maps project actual facts while knowledge views disclose only known fields', () => {
    const f = fixture(), bindings = createWorldBindings(f.definition, {instanceId: f.instance.id, worldFactPrefix: 'test.away'});
    assert.deepEqual(worldInstanceFacts(f.instance, f.definition, bindings), {'world.test.away.bench.ready': false, 'world.test.away.visits': 0});
    assert.deepEqual(worldInstanceView(f.instance, f.definition, {discovered: false}), {visible: false});
    const view = worldInstanceView(f.instance, f.definition, {discovered: true, factKeys: ['visits']});
    assert.equal(view.label, 'Unknown room'); assert.deepEqual(view.facts, {visits: 0}); assert.equal('identity' in view, false);
    const known = worldInstanceView(f.instance, f.definition, {discovered: true, identityKnown: true, clockKnown: true, siteIds: ['bench']});
    assert.equal(known.identity.instanceId, 'away.main'); assert.equal(known.elapsedPlayedMinutes, 0);
    known.sites[0].open = true; assert.equal(f.instance.sites.bench.open, false);
    assert.throws(() => worldInstanceView(f.instance, f.definition, {discovered: true, factKeys: ['unknown']}), /Unbound world view knowledge/);
});
