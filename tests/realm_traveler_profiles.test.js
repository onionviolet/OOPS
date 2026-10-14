import test from 'node:test';
import assert from 'node:assert/strict';
import {validateRealmTraveler, previewRealmTraveler, planRealmProjection,
    realmTravelerView} from '../src/realm_traveler_profiles.js';

const home = {worldId: 'test.home', instanceId: 'home.main', regionId: 'village', layerId: 'material'};
const away = {worldId: 'test.away', instanceId: 'away.main', regionId: 'room', layerId: 'material'};
const clone = v => structuredClone(v);
const ref = (domain, id) => ({domain, id, revision: 1});
function fixture(mode = 'physical') {
    const profile = {schema: 1, id: 'traveler.test', revision: 2, actorId: 'player',
        identityRef: ref('actor', 'player.identity'), mindRef: ref('mind', 'player.mind'), currentBodyId: 'player.body',
        embodiment: {mode: 'single', sourceId: null, supportId: null},
        memories: [{id: 'memory.role', revision: 1, ownerId: 'player', kind: 'role', subjectId: 'test.hero', stage: 'remembered'}],
        methods: [], sources: [], companions: [], obligations: [],
        bodies: [{id: 'player.body', revision: 1, ownerId: 'player', identityId: 'player.identity', mindId: 'player.mind',
            form: 'human', endpoint: clone(home), life: 'alive', available: true,
            functions: ['travel.physical', 'attention.control'], poolIds: ['player.fuel'], conditionRef: ref('vitals', 'player.body.vitals')}],
        pools: [{id: 'player.fuel', revision: 1, ownerId: 'player', ownerRef: ref('actual_pool', 'player.fuel'),
            balances: [{resourceId: 'focus', amount: 20}]}],
        cargo: [{id: 'cargo.rope', revision: 1, ownerId: 'player', holderBodyId: 'player.body', itemKey: 'Test rope',
            count: 2, kind: 'owned', stockRef: ref('native_inventory', 'stock.rope'), loan: null}]};
    const request = {mode, bodyId: 'player.body', expectedRevision: 2, expectedSequence: 7, duration: 2, to: clone(away),
        supportId: null, targetBodyId: null, presenceIds: [], presencePositions: [], cargoIds: ['cargo.rope'], companionIds: []};
    const context = {sequence: 7, clock: 10, supports: [], ownerBindings: [], stockBindings: []};
    if (mode !== 'physical') {
        const support = {id: 'support.test', revision: 1, sourceId: 'source.test', methodId: 'method.test', mode,
            originForms: ['human'], arrivalForms: [mode === 'projection' ? 'light' : 'human'],
            requiredFunctions: ['attention.control'], grantedFunctions: ['sense.light'], poolIds: ['player.fuel'],
            sharedSourceIds: mode === 'alternate_body' ? [] : ['source.test'], maxBodies: 3,
            setupCosts: [{poolId: 'player.fuel', resourceId: 'focus', amount: 1}],
            sustainCosts: [{poolId: 'player.fuel', resourceId: 'focus', amount: 2}],
            material: mode !== 'projection', permitsCargoTransfer: mode === 'shared_body', manifestations: []};
        context.supports = [support]; request.supportId = support.id; request.cargoIds = [];
        profile.sources = [{id: 'source.test', revision: 1, ownerId: 'player', acquired: true, active: true,
            suppressed: false, bodyIds: ['player.body'], supportIds: [support.id], intrinsicControlIds: [], availableAt: 0, expiresAt: null}];
        profile.methods = [{id: 'method.test', revision: 1, ownerId: 'player', sourceId: 'source.test', stage: 'learned'}];
        if (mode === 'alternate_body') {
            const body = clone(profile.bodies[0]); body.id = 'player.away'; body.endpoint = clone(away);
            body.conditionRef = ref('vitals', 'player.away.vitals'); body.poolIds = ['player.away.fuel'];
            profile.bodies.push(body); profile.sources[0].bodyIds.push(body.id);
            profile.pools.push({...clone(profile.pools[0]), id: 'player.away.fuel', ownerRef: ref('actual_pool', 'player.away.fuel')});
            profile.embodiment = {mode: 'exclusive', sourceId: 'source.test', supportId: support.id};
            request.targetBodyId = body.id;
        } else {
            request.presenceIds = ['presence.left']; request.presenceForm = mode === 'projection' ? 'light' : 'human';
            request.presencePositions = [{presenceId: 'presence.left', positionId: 'room.left'}];
        }
    }
    context.ownerBindings = [profile.identityRef, profile.mindRef, ...profile.bodies.map(b => b.conditionRef),
        ...profile.pools.map(p => p.ownerRef)].map(r => ({...clone(r), ownerId: 'player', available: true}));
    context.stockBindings = profile.cargo.map(c => ({stockRef: clone(c.stockRef), ownerId: c.ownerId,
        holderBodyId: c.holderBodyId, itemKey: c.itemKey, count: c.count}));
    context.access = {id: 'access.test', revision: 1, actorId: 'player', bodyId: request.bodyId, sequence: 7, duration: 2,
        mode, from: clone(home), to: clone(away), allowed: true, reasons: [], expiresAt: null,
        cargoIds: clone(request.cargoIds), companionIds: [], presenceIds: clone(request.presenceIds), presencePositions: clone(request.presencePositions)};
    return {profile, context, request};
}
const preview = f => previewRealmTraveler(f.profile, f.context, f.request);
function refusal(f, message) {
    const before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, false); assert.equal(plan.eligible, false);
    assert.match(plan.reasons.join(' '), message); assert.equal(plan.arrival, null);
    assert.deepEqual(plan.intents, []); assert.deepEqual(f, before);
}

for (const mode of ['physical', 'projection', 'shared_body', 'alternate_body']) test(`${mode} preview preserves actual carrier owners through JSON shapes`, () => {
    const f = fixture(mode), before = clone(f), plan = preview(f);
    assert.equal(plan.allowed, true); assert.equal(plan.nativeExecutable, false);
    assert.deepEqual(f, before); assert.equal(validateRealmTraveler(f.profile), true);
    assert.deepEqual(preview(JSON.parse(JSON.stringify(f))), plan);
    assert.deepEqual(plan.retained.identityRef, f.profile.identityRef); assert.deepEqual(plan.retained.mindRef, f.profile.mindRef);
    assert.deepEqual(plan.retained.memoryRefs, [ref('memory', 'memory.role')]);
    if (mode === 'physical') {
        assert.deepEqual(plan.arrival.existingBodyRef, ref('body', 'player.body'));
        assert.equal(plan.arrival.cargo[0].count, 2); assert.equal(plan.arrival.cargo[0].operation, 'move_existing_stock');
        assert.deepEqual(plan.costs, []); assert.equal(plan.intents[0].kind, 'move_existing_body');
    } else {
        assert.equal(plan.costs[0].amount, 5, 'one setup plus two minutes of sustain');
        assert.equal(f.profile.pools[0].balances[0].amount, 20, 'quotes do not spend pools');
        assert.equal(plan.retained.homeBodies[0].bodyRef.id, 'player.body');
        assert.deepEqual(plan.arrival.cargo, []);
        if (mode === 'alternate_body') {
            assert.equal(plan.arrival.existingBodyRef.id, 'player.away'); assert.deepEqual(plan.arrival.presences, []);
            assert.equal(plan.support.poolPolicy, 'retain_independent_body_pools');
        } else {
            assert.equal(plan.arrival.presences[0].material, mode === 'shared_body');
            assert.deepEqual(plan.arrival.presences[0].identityRef, f.profile.identityRef);
            assert.equal(plan.support.mindPolicy, 'one_shared_mind');
        }
    }
    const receipt = plan.intents.at(-1);
    assert.equal(receipt.kind, 'single_receipt'); assert.equal(receipt.grantsHeldItems, false); assert.equal(receipt.grantsMethods, false);
});

for (const [name, change, reason] of [
    ['stale profile', f => f.request.expectedRevision--, /traveler request is stale/],
    ['stale sequence', f => f.request.expectedSequence--, /traveler request is stale/],
    ['absent identity owner', f => f.context.ownerBindings.shift(), /actual owner binding is absent/],
    ['stale vital owner', f => f.context.ownerBindings[2].revision++, /actual owner binding is absent/],
    ['boundary refusal', f => {f.context.access.allowed = false; f.context.access.reasons = ['Door is closed.'];}, /Door is closed/],
    ['wrong access body', f => f.context.access.bodyId = 'other.body', /Boundary support belongs to/],
    ['expired access at arrival', f => f.context.access.expiresAt = 12, /access expires/],
    ['omitted cargo', f => f.request.cargoIds = [], /Admit every actually held cargo/],
    ['stale stock count', f => f.context.stockBindings[0].count++, /differs from its actual owned\/loaned stock/],
    ['unadmitted cargo', f => f.context.access.cargoIds = [], /Boundary support does not admit this actual cargo/],
    ['unavailable body', f => f.profile.bodies[0].available = false, /current body is unavailable/]
]) test(`physical traveler refuses ${name}`, () => {
    const f = fixture(); change(f); refusal(f, reason);
});

for (const [name, change, reason] of [
    ['fragment instead of learned method', f => f.profile.methods[0].stage = 'fragment', /Remembered roles\/descriptions/],
    ['suppressed source', f => f.profile.sources[0].suppressed = true, /actual acquired source/],
    ['source expiry at arrival', f => f.profile.sources[0].expiresAt = 12, /actual acquired source/],
    ['insufficient actual fuel', f => f.profile.pools[0].balances[0].amount = 4, /actual focus pool cannot fund/],
    ['unsupported presence position', f => f.context.access.presencePositions[0].positionId = 'room.other', /independent position lacks/],
    ['physical cargo in projection', f => {f.request.cargoIds = ['cargo.rope']; f.context.access.cargoIds = ['cargo.rope'];}, /no defined one-owner physical cargo transfer/]
]) test(`projection refuses ${name}`, () => {
    const f = fixture('projection'); change(f); refusal(f, reason);
});

test('shared bodies aggregate one actual pool and do not duplicate held equipment', () => {
    const f = fixture('shared_body'); f.request.presenceIds.push('presence.right');
    f.request.presencePositions.push({presenceId: 'presence.right', positionId: 'room.right'});
    f.context.access.presenceIds = clone(f.request.presenceIds); f.context.access.presencePositions = clone(f.request.presencePositions);
    const plan = preview(f); assert.equal(plan.allowed, true); assert.equal(plan.costs[0].amount, 10);
    assert.ok(plan.arrival.presences.every(p => p.poolRefs[0].id === 'player.fuel' && p.heldCargoRefs.length === 0));
    f.request.cargoIds = ['cargo.rope']; f.context.access.cargoIds = ['cargo.rope'];
    refusal(f, /no defined one-owner physical cargo transfer/);
    f.request.presenceIds.pop(); f.request.presencePositions.pop();
    f.context.access.presenceIds = clone(f.request.presenceIds); f.context.access.presencePositions = clone(f.request.presencePositions);
    const single = preview(f); assert.equal(single.allowed, true);
    assert.equal(single.arrival.cargo[0].toBodyId, 'presence.left'); assert.equal(single.arrival.cargo[0].count, 2);
    assert.equal(single.arrival.presences[0].heldCargoRefs.length, 1);
});

test('loaned cargo and independent companion retain ownership, consent and return obligations', () => {
    const f = fixture(), obligation = {id: 'duty.return', revision: 1, ownerId: 'player', kind: 'loan_return',
        bodyId: 'player.body', state: 'active', blocksModes: [], ownerRef: ref('custody', 'loan.rope')};
    f.profile.obligations.push(obligation);
    Object.assign(f.profile.cargo[0], {ownerId: 'lender', kind: 'loaned', loan: {id: 'loan.rope', revision: 1,
        lenderId: 'lender', obligationId: obligation.id, destinations: [clone(away)], expiresAt: 20}});
    f.context.stockBindings[0].ownerId = 'lender';
    const body = {...clone(f.profile.bodies[0]), id: 'friend.body', ownerId: 'friend', identityId: 'friend.identity', mindId: 'friend.mind',
        conditionRef: ref('vitals', 'friend.body.vitals'), poolIds: []};
    const consent = {id: 'consent.friend', revision: 1, actorId: 'friend', granted: true, mode: 'physical',
        from: clone(home), to: clone(away), expiresAt: 20};
    f.profile.companions.push({id: 'companion.friend', revision: 1, actorId: 'friend', body, consent});
    f.context.ownerBindings.push({...body.conditionRef, ownerId: 'friend', available: true});
    f.request.companionIds = f.context.access.companionIds = ['companion.friend'];
    const plan = preview(f); assert.equal(plan.allowed, true);
    assert.equal(plan.arrival.cargo[0].ownerId, 'lender'); assert.equal(plan.retained.obligations[0].state, 'active');
    assert.equal(plan.arrival.companions[0].propertyPolicy, 'retain_existing_companion_owner');
    consent.granted = false; refusal(f, /companion has not consented/); consent.granted = true;
    f.profile.cargo[0].loan.expiresAt = 12; refusal(f, /lender's permission/);
    f.profile.cargo[0].loan.expiresAt = 20; obligation.blocksModes = ['physical'];
    refusal(f, /active obligation prevents/);
});

test('traveler save validation rejects aliasing bodies, pools, stock and mismatched identity', () => {
    const f = fixture('alternate_body');
    const bad = clone(f.profile); bad.bodies[1].conditionRef = clone(bad.bodies[0].conditionRef);
    assert.throws(() => validateRealmTraveler(bad), /independent condition\/vital owners/);
    const pool = clone(f.profile); pool.pools[1].ownerRef = clone(pool.pools[0].ownerRef);
    assert.throws(() => validateRealmTraveler(pool), /alias the same actual reserve/);
    const stock = fixture().profile; stock.cargo.push({...clone(stock.cargo[0]), id: 'cargo.copy'});
    assert.throws(() => validateRealmTraveler(stock), /duplicate the same held stock/);
    const identity = fixture().profile; identity.bodies[0].identityId = 'other.identity';
    assert.throws(() => validateRealmTraveler(identity), /one actual identity and mind/);
});

test('traveler views disclose only recipient evidence and self snapshots are detached', () => {
    const f = fixture('projection');
    assert.deepEqual(realmTravelerView(f.profile, {viewerActorId: 'other', evidence: []}), {visible: false});
    const view = realmTravelerView(f.profile, {viewerActorId: 'other', evidence: [
        {id: 'report.allowed', recipientId: 'other', subjectActorId: 'player', at: 9, text: 'A light appeared.'},
        {id: 'report.private', recipientId: 'player', subjectActorId: 'player', at: 9, text: 'Private.'}]});
    assert.deepEqual(view, {visible: true, self: false, observations: [{id: 'report.allowed', at: 9, text: 'A light appeared.'}]});
    const self = realmTravelerView(f.profile, {viewerActorId: 'player', evidence: []});
    self.currentFuel[0].balances[0].amount = 0; assert.equal(f.profile.pools[0].balances[0].amount, 20);
    assert.throws(() => planRealmProjection(f.profile, f.context, {...f.request, mode: 'physical'}), /Choose projection/);
});
