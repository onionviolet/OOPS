import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeCargoStockId, realmCargoCustodyBinding, buildNativeRealmCargoSnapshot,
    validateRealmCargoSnapshot, validateRealmCargoConsent, validateRealmCargoPermission,
    previewRealmCargoPermission, previewRealmCargoPassage} from '../src/realm_cargo.js';

const key = JSON.stringify({id: 'Test rope', quality: 80});
const from = {worldId: 'test.home', instanceId: 'home.main', regionId: 'village', layerId: 'material'};
const to = {worldId: 'test.away', instanceId: 'away.main', regionId: 'room', layerId: 'material'};
const clone = v => structuredClone(v);
const saved = v => JSON.parse(JSON.stringify(v));
const input = () => ({actorId: 'player', bodyId: 'player.body', sequence: 7, revision: 8,
    inventory: {[key]: 3}, equipment: {hand: key}, custody: {}});
const connection = () => ({id: 'test.door', revision: 2, from: clone(from), to: clone(to), bidirectional: true,
    cargoPolicy: {allowed: true, maxUnits: 4, allowEquipped: true, classes: ['carried']}});
function fixture(borrowed = false) {
    const owners = input();
    if (borrowed) {
        owners.custody['loan.rope'] = {owner: 'lender', holder: 'player', key, count: 2, at: 5, cause: 'test.loan'};
        owners.allocations = [{custodyId: 'loan.rope', container: 'bag', slot: null, count: 2}];
    }
    const snapshot = buildNativeRealmCargoSnapshot(owners), route = connection();
    const request = {expectedSequence: 7, expectedRevision: 2, expectedSnapshotRevision: 8,
        expectedSnapshotBinding: snapshot.binding, purposeId: 'test.visit', from: clone(from), to: clone(to), duration: 2};
    return {owners, snapshot, route, request, context: {sequence: 7, clock: 10, permissions: [], consents: []}};
}
const preview = f => previewRealmCargoPassage(f.snapshot, f.route, f.request, f.context);
function grant(f) {
    const loan = f.snapshot.cargo.find(c => c.custodyRef);
    const consent = {schema: 1, id: 'consent.rope', revision: 3, active: true, lenderId: 'lender', holderId: 'player',
        custodyId: 'loan.rope', custodyBinding: loan.custodyBinding, purposeId: f.request.purposeId,
        connectionId: f.route.id, from: clone(from), to: clone(to), maxCount: 2, at: 5, expiresAt: 20};
    const plan = previewRealmCargoPermission(f.snapshot, consent, {id: 'permission.rope', revision: 1,
        expectedSequence: 7, expectedSnapshotRevision: 8, expectedSnapshotBinding: f.snapshot.binding,
        expectedConsentRevision: 3}, f.context);
    assert.equal(plan.allowed, true);
    f.context.consents = [consent]; f.context.permissions = [plan.permission];
    return {consent, permission: plan.permission};
}

test('snapshot conserves exact native bag and equipment counts without mutating stock', () => {
    const owners = input(), before = clone(owners), s = buildNativeRealmCargoSnapshot(owners);
    assert.equal(s.complete, true); assert.equal(s.sources.length, 2);
    assert.deepEqual(s.cargo.map(c => [c.count, c.equipped, c.slot]), [[3, false, null], [1, true, 'hand']]);
    assert.equal(new Set(s.cargo.map(c => c.itemId)).size, 2);
    assert.ok(s.cargo.every(c => c.ownerId === 'player' && c.holderBodyId === 'player.body'));
    assert.deepEqual(owners, before);
    assert.deepEqual(validateRealmCargoSnapshot(saved(s)), s);
    const f = fixture(), plan = preview(f);
    assert.equal(plan.allowed, true); assert.equal(plan.units, 4); assert.deepEqual(plan.effects, []);
    assert.equal(plan.guards.arrivesAt, 12); assert.equal(plan.guards.snapshotBinding, s.binding);
    plan.cargo[0].count = 100;
    assert.equal(f.snapshot.cargo[0].count, 3);
});

test('empty and zero-count bag stock produce complete empty manifests', () => {
    const owners = input(); owners.inventory[key] = 0; owners.equipment = {};
    const s = buildNativeRealmCargoSnapshot(owners);
    assert.deepEqual(s.cargo, []); assert.deepEqual(s.sources, []);
    assert.equal(validateRealmCargoSnapshot(saved(s)).complete, true);
});

test('stock IDs distinguish slots, containers and exact unicode native keys', () => {
    const keys = [key, JSON.stringify({id: 'Test rope', quality: 81}), JSON.stringify({id: '绳🪢'}),
        JSON.stringify({components: {head: 'Iron head', handle: 'Oak handle'}, quality: 50})];
    const ids = keys.flatMap(k => [nativeCargoStockId('player', 'bag', k),
        nativeCargoStockId('player', 'equipment', k, 'hand'), nativeCargoStockId('player', 'equipment', k, 'belt')]);
    assert.equal(new Set(ids).size, ids.length);
    assert.throws(() => nativeCargoStockId('player', 'equipment', key), /actual equipment slot/);
    assert.throws(() => nativeCargoStockId('player', 'bag', 'invalid'), /Invalid native inventory key/);
});

test('borrowed and owned slices conserve quantity with explicit bag/equipment allocation', () => {
    const f = fixture(true), before = clone(f.owners), s = f.snapshot;
    assert.deepEqual(s.cargo.map(c => [c.ownerId, c.count, c.equipped]),
        [['player', 1, false], ['lender', 2, false], ['player', 1, true]]);
    assert.equal(s.cargo.find(c => c.custodyRef).custodyBinding,
        realmCargoCustodyBinding('loan.rope', f.owners.custody['loan.rope']));
    assert.deepEqual(validateRealmCargoSnapshot(saved(s)), s); assert.deepEqual(f.owners, before);
    assert.equal(preview(f).allowed, false);
    grant(f); const plan = preview(f);
    assert.equal(plan.allowed, true); assert.equal(plan.units, 4);
    assert.deepEqual(plan.cargo.find(c => c.custodyRef).authorizedConnectionIds, ['test.door']);
    assert.equal(plan.cargo.find(c => c.custodyRef).ownerId, 'lender');
    assert.equal(plan.guards.permissions.length, 1);
    const restored = saved(f);
    assert.deepEqual(preview(restored), plan, 'loan, permission and consent survive JSON save shapes');
});

test('one loan split over bag and equipment uses one consent guard and keeps one lender', () => {
    const f = fixture(true); f.owners.allocations = [{custodyId: 'loan.rope', container: 'bag', slot: null, count: 1},
        {custodyId: 'loan.rope', container: 'equipment', slot: 'hand', count: 1}];
    f.snapshot = buildNativeRealmCargoSnapshot(f.owners); f.request.expectedSnapshotBinding = f.snapshot.binding;
    grant(f); const plan = preview(f);
    assert.equal(plan.allowed, true); assert.equal(plan.guards.permissions.length, 1);
    assert.equal(plan.cargo.filter(c => c.ownerId === 'lender').reduce((n, c) => n + c.count, 0), 2);
});

for (const [name, mutate, message] of [
    ['ambiguous loan copies', o => {o.custody.loan = {owner: 'lender', holder: 'player', key, count: 1, at: 0};}, /absent or ambiguous/],
    ['loan quantity exceeds stock', o => {o.equipment = {}; o.custody.loan = {owner: 'lender', holder: 'player', key, count: 4, at: 0};}, /exceeds actual carried stock/],
    ['allocation quantity differs from loan', o => {o.custody.loan = {owner: 'lender', holder: 'player', key, count: 2, at: 0}; o.allocations = [{custodyId: 'loan', container: 'bag', slot: null, count: 1}];}, /allocation does not match/],
    ['absent custody allocation', o => {o.allocations = [{custodyId: 'absent', container: 'bag', slot: null, count: 1}];}, /absent or another holder/],
    ['fractional stack', o => o.inventory[key] = 1.5, /Invalid bag count/],
    ['negative stack', o => o.inventory[key] = -1, /Invalid bag count/]
]) test(`snapshot rejects ${name}`, () => {
    const owners = input(); mutate(owners); assert.throws(() => buildNativeRealmCargoSnapshot(owners), message);
});

test('snapshot validation rejects omitted, duplicated and tampered save stock', () => {
    const f = fixture(true);
    for (const change of [s => s.cargo.pop(), s => s.cargo.push(clone(s.cargo[0])),
        s => s.cargo[0].count++, s => s.cargo[0].stockRef.revision++,
        s => s.cargo.find(c => c.custodyRef).custodyRef.at++, s => s.binding = 'forged']) {
        const altered = saved(f.snapshot); change(altered);
        assert.throws(() => validateRealmCargoSnapshot(altered));
    }
});

const refusalCases = [
    ['stale sequence', f => f.request.expectedSequence--, /passage request is stale/],
    ['stale route revision', f => f.request.expectedRevision--, /passage request is stale/],
    ['stale snapshot binding', f => f.request.expectedSnapshotBinding = 'old', /passage request is stale/],
    ['omitted stack', f => f.request.cargo = [], /complete actual bag and equipment/],
    ['partial stack', f => f.request.cargo = f.snapshot.cargo.map(c => ({itemId: c.itemId, count: 1})), /complete actual bag and equipment/],
    ['one-way reverse', f => {f.route.bidirectional = false; f.request.from = clone(to); f.request.to = clone(from);}, /directed route/],
    ['forbidden cargo class', f => f.route.cargoPolicy.classes = [], /does not admit one of your carried/],
    ['forbidden equipment', f => f.route.cargoPolicy.allowEquipped = false, /equipped items/],
    ['over capacity', f => f.route.cargoPolicy.maxUnits = 3, /exceeds route capacity/]
];
for (const [name, change, reason] of refusalCases) test(`cargo passage refuses ${name} without stock effects`, () => {
    const f = fixture(); change(f); const before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, false); assert.match(plan.reasons.join(' '), reason);
    assert.deepEqual(plan.effects, []); assert.deepEqual(f, before);
});

test('nontransferable classification blocks cargo even on an otherwise admitting route', () => {
    const f = fixture(); f.owners.classifications = [{itemKey: key, classId: 'carried', transferable: false}];
    f.snapshot = buildNativeRealmCargoSnapshot(f.owners); f.request.expectedSnapshotBinding = f.snapshot.binding;
    assert.equal(preview(f).allowed, false);
    assert.match(preview(f).reasons.join(' '), /carried items/);
});

for (const [name, change] of [
    ['revoked consent', f => f.context.consents[0].active = false],
    ['revised consent', f => f.context.consents[0].revision++],
    ['revoked permission', f => f.context.permissions[0].active = false],
    ['other purpose', f => f.request.purposeId = 'test.other'],
    ['reverse destination without a reverse grant', f => {f.request.from = clone(to); f.request.to = clone(from);}],
    ['arrival exactly at consent expiry', f => f.request.duration = 10],
    ['consent before start', f => f.context.clock = 4]
]) test(`borrowed cargo refuses ${name}`, () => {
    const f = fixture(true); grant(f); change(f);
    const plan = preview(f); assert.equal(plan.allowed, false);
    assert.match(plan.reasons.join(' '), /actual lender consent/); assert.deepEqual(plan.effects, []);
});

test('permission enrollment rejects stale, revoked, expired or wrong-lender consent', () => {
    const f = fixture(true), {consent, permission} = grant(f);
    assert.deepEqual(validateRealmCargoConsent(saved(consent)), consent);
    assert.deepEqual(validateRealmCargoPermission(saved(permission)), permission);
    const request = {id: 'permission.next', revision: 1, expectedSequence: 7, expectedSnapshotRevision: 8,
        expectedSnapshotBinding: f.snapshot.binding, expectedConsentRevision: 3};
    for (const mutate of [c => c.active = false, c => c.lenderId = 'other', c => c.expiresAt = 10]) {
        const c = clone(consent); mutate(c);
        const p = previewRealmCargoPermission(f.snapshot, c, request, f.context);
        assert.equal(p.allowed, false); assert.equal(p.permission, null); assert.deepEqual(p.effects, []);
    }
    const p = previewRealmCargoPermission(f.snapshot, consent, {...request, expectedConsentRevision: 2}, f.context);
    assert.deepEqual(p.reasons, ['This lender permission request is stale.']);
});
