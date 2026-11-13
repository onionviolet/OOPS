import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld,
    startEngineWorking} from '../src/engine_world.js';
import {guBodyHolder} from '../src/gu_living_body.js';
import {defineWorkingLaw} from '../src/kernel_working.js';
import {GU_CONTROL_PROPERTIES} from '../src/world_packs/gu_first_control.js';
import {GIANT_HAND_PROPERTIES, GU_GIANT_HAND_LAW, giantHandBrace, landGiantHandImpact, prepareGiantHandWorking, releaseGiantHandWorking,
    readGiantHandCorridor, revisedGiantHandFlight, revisedGiantHandStrike, revisedGiantHandSweep,
    revisedGiantHandWorking} from '../src/world_packs/gu_giant_hand_working.js';
import {sharedProperties, sharedQuantities} from '../src/world_quantities.js';
import {linkDistance, worldLinks} from '../src/world_substrate.js';

const redDate = 'energy:immortal.red-date', primeval = 'energy:primeval.rank1';
const guardRoles = {defender: 'creature'};
const guardLaw = defineWorkingLaw({id: 'trial.hand-guard', revision: 1, operations: {
    raise: {roles: guardRoles, settle({bound: {defender}}) {
        if (!(defender.quantities[primeval] >= 1)) return {ok: false, reason: 'The guard needs essence.'};
        return {ok: true, costs: [{quantity: primeval, payer: defender.holder, amount: 1}], effects: [{
            sentence: {verb: 'block', object: 'vitality', target: 'bound', time: 'sustained', carrier: 'gu', cost: 'none', limits: []},
            details: {target: {shape: 'holder', id: defender.holder}, minutes: 1, params: {verb: 'remove', object: 'vitality'}},
        }]};
    }},
}});
const config = {packs: ['l.living_body'], host: {laws: [GU_GIANT_HAND_LAW, guardLaw],
    ports: {landImpact: landGiantHandImpact, readThing: readGiantHandCorridor}}, shared: {
    quantities: sharedQuantities(['energy', 'stock', 'vitality']), properties: [...sharedProperties(['alive']), ...GU_CONTROL_PROPERTIES,
        ...GIANT_HAND_PROPERTIES, {id: 'gu_rank', type: 'level', min: 1}],
}};

function setup() {
    return createEngineWorld({...config, holders: [
        {id: 'yard', kind: 'place'}, {id: 'rest', kind: 'place'},
        {id: 'caster', kind: 'body', as: ['operator'], place: 'yard', quantities: {[primeval]: 3, [redDate]: 1}, properties: {alive: true}},
        {id: 'slab', kind: 'thing', place: 'yard', properties: {gu_slab_load: 5}},
        ...[['core', 'myriad-self', 7], ['plain', 'group-strength', 1], ['other', 'group-strength', 1],
            ['focused', 'group-strength', 1, {gu_gather_force: 3, gu_gather_cost: 2}]].map(([id, kind, rank, extra]) => ({
            ...guBodyHolder({id: kind, needs: 'gu'}, {id, place: 'yard', satiety: 20}),
            properties: {alive: true, gu_kind: kind, gu_rank: rank, gu_keeper: 'caster', gu_controller: 'caster', ...extra},
        })),
    ]});
}
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;
const restore = engine => restoreEngineWorld(serializeEngineWorld(engine), config);
const purse = engine => engine.world.holders.caster.quantities;
function run(engine, id, method, right = 'focused', core = 'core') {
    const ids = {operator: 'caster', support: 'steady', core, left: 'plain', right, slab: 'slab', rest: 'rest', target: 'opponent', corridor: 'rest'};
    return startEngineWorking(engine, {id, law: GU_GIANT_HAND_LAW, method,
        bindings: Object.fromEntries(Object.entries(method.roles).map(([role, kind]) => [role, {kind, id: ids[role]}]))});
}
const cast = (engine, right) => run(engine, 'hand', revisedGiantHandWorking, right);

test('a paid Giant Hand strikes a living opponent unless their independent guard is timely', () => {
    const initial = applyEngineOps(setup(), [{op: 'holder_add', value: {id: 'opponent', kind: 'body', as: ['creature'], place: 'yard',
        properties: {alive: true}, quantities: {vitality: 20, [primeval]: 2}}}], 'fixture:opponent');
    const guard = (engine, minutes) => startEngineWorking(engine, {id: 'guard', law: guardLaw,
        method: {id: 'trial.hand-guard.raise', revision: 1, law: guardLaw.ref, roles: guardRoles,
            steps: [{op: 'raise', minutes, bindings: {defender: 'defender'}}]}, bindings: {defender: {kind: 'creature', id: 'opponent'}}});
    const cast = run(initial, 'hand', revisedGiantHandStrike);
    const pending = guard(cast, 2);
    const blocked = advance(restore(advance(pending, 1)), 3);
    assert.deepEqual(serializeEngineWorld(blocked), serializeEngineWorld(advance(pending, 3)));
    assert.equal(blocked.world.holders.opponent.quantities.vitality, 20);
    assert.equal(blocked.world.holders.opponent.quantities[primeval], 1);
    assert.equal(purse(blocked)[redDate], 0);
    assert.equal(purse(blocked)[primeval], 0);
    assert.equal(blocked.records.workings.hand.landed[0].status, 'idle');
    const expired = advance(guard(cast, 1), 3);
    assert.equal(expired.world.holders.opponent.quantities.vitality, 15);
    assert.equal(expired.world.holders.opponent.quantities[primeval], 1);
    assert.equal(expired.records.workings.hand.landed[0].status, 'landed');
    const evaded = applyEngineOps(advance(cast, 1), [{op: 'move', holder: 'opponent', to: 'rest'}], 'fixture:retreat');
    const missed = advance(restore(evaded), 2);
    assert.equal(missed.world.holders.opponent.quantities.vitality, 20);
    assert.equal(purse(missed)[redDate], 0);
    assert.equal(purse(missed)[primeval], 3);
});

test('a released Giant Hand follows live reach to its saved aim even after the caster leaves', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'holder_add', value: {id: 'opponent', kind: 'body', as: ['creature'], place: 'rest',
            properties: {alive: true}, quantities: {vitality: 20}}},
        {op: 'holder_add', value: {id: 'bystander', kind: 'body', as: ['creature'], place: 'rest',
            properties: {alive: true}, quantities: {vitality: 20}}},
        {op: 'holder_add', value: {id: 'shelter', kind: 'place'}},
        {op: 'link_add', link: {id: 'clear-shot', kind: 'sightline', from: 'yard', to: 'rest', cost: 2}},
    ], 'fixture:flight');
    const launched = advance(run(initial, 'hand', revisedGiantHandFlight), 2);
    assert.equal(purse(launched)[redDate], 0);
    assert.equal(purse(launched)[primeval], 0);
    assert.equal(launched.world.holders.opponent.quantities.vitality, 20);
    const left = applyEngineOps(launched, [{op: 'move', holder: 'caster', to: 'shelter'}], 'fixture:caster-left');
    const hit = advance(restore(left), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(left, 3)));
    assert.equal(hit.world.holders.opponent.quantities.vitality, 15);
    assert.equal(hit.world.holders.bystander.quantities.vitality, 20);

    for (const change of [{op: 'link_set', id: 'clear-shot', state: 'closed'},
        {op: 'move', holder: 'opponent', to: 'yard'}]) {
        const evaded = advance(restore(applyEngineOps(launched, [change], 'fixture:changed-flight')), 3);
        assert.equal(evaded.world.holders.opponent.quantities.vitality, 20);
        assert.equal(purse(evaded)[redDate], 0);
        assert.equal(purse(evaded)[primeval], 0);
        const {record, landed} = evaded.records.workings.hand;
        if (change.op === 'move') assert.equal(record.receipts.at(-1).observed.contact, 'evaded');
        else assert.equal(landed[0].status, 'idle');
    }
});

test('a paid sweep hits occupants along the open prefix of its route', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'holder_add', value: {id: 'lane', kind: 'place'}},
        {op: 'holder_add', value: {id: 'off-route', kind: 'place'}},
        ...[['near', 'lane'], ['opponent', 'rest'], ['bystander', 'off-route']].map(([id, place]) => ({op: 'holder_add',
            value: {id, kind: 'body', as: ['creature'], place, properties: {alive: true}, quantities: {vitality: 20}}})),
        {op: 'link_add', link: {id: 'first', kind: 'sightline', from: 'yard', to: 'lane', cost: 1}},
        {op: 'link_add', link: {id: 'second', kind: 'sightline', from: 'lane', to: 'rest', cost: 1}},
        {op: 'law_add', field: {id: 'near-brace', kind: 'gu.giant-hand.brace', scope: 'near', params: {capacity: 3}}},
    ], 'fixture:sweep');
    const pending = run(initial, 'hand', revisedGiantHandSweep(['first', 'second']));
    const launched = advance(pending, 2);
    const hit = advance(restore(launched), 3);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, 3)));
    assert.equal(hit.world.holders.near.quantities.vitality, 18);
    assert.equal(hit.world.holders.opponent.quantities.vitality, 15);
    assert.equal(hit.world.holders.bystander.quantities.vitality, 20);
    assert.equal(purse(hit)[primeval], 0);
    const closed = applyEngineOps(launched, [{op: 'link_set', id: 'second', state: 'closed'},
        {op: 'move', holder: 'bystander', to: 'lane'}], 'fixture:late-obstruction');
    const partial = advance(restore(closed), 3);
    assert.deepEqual(partial.records.workings.hand.record.receipts.at(-1).observed.places, ['lane']);
    assert.equal(partial.world.holders.near.quantities.vitality, 18);
    assert.equal(partial.world.holders.bystander.quantities.vitality, 15);
    assert.equal(partial.world.holders.opponent.quantities.vitality, 20);
    assert.equal(purse(partial)[primeval], 0);
    const early = advance(applyEngineOps(pending, [{op: 'link_set', id: 'second', state: 'closed'}], 'fixture:early-obstruction'), 3);
    assert.equal(early.records.workings.hand.record.status, 'interrupted');
    assert.equal(purse(early)[redDate], 0);
    assert.equal(purse(early)[primeval], 3);

    const staged = run(initial, 'hand', revisedGiantHandSweep(['first', 'second'], {staged: true}));
    const firstContact = advance(staged, 3);
    assert.equal(firstContact.world.holders.near.quantities.vitality, 18);
    assert.equal(firstContact.world.holders.opponent.quantities.vitality, 20);
    const moving = applyEngineOps(firstContact, [{op: 'move', holder: 'near', to: 'rest'},
        {op: 'move', holder: 'opponent', to: 'off-route'}], 'fixture:between-contacts');
    const ended = advance(restore(moving), 4);
    assert.deepEqual(serializeEngineWorld(ended), serializeEngineWorld(advance(moving, 4)));
    assert.equal(ended.world.holders.near.quantities.vitality, 18);
    assert.equal(ended.world.holders.opponent.quantities.vitality, 20);
    const cutoff = advance(restore(applyEngineOps(firstContact, [{op: 'link_set', id: 'second', state: 'closed'}],
        'fixture:between-contact-closure')), 4);
    assert.equal(cutoff.records.workings.hand.record.status, 'interrupted');
    assert.equal(cutoff.world.holders.near.quantities.vitality, 18);
    assert.equal(cutoff.world.holders.opponent.quantities.vitality, 20);
    assert.equal(purse(cutoff)[primeval], 0);
    assert.equal(advance(restore(firstContact), 4).world.holders.opponent.quantities.vitality, 15);

    const dissipate = engine => run(engine, 'hand', revisedGiantHandSweep(['first', 'second'], {dissipating: true}));
    const fading = advance(dissipate(initial), 3);
    const weakened = advance(restore(fading), 4);
    assert.deepEqual(serializeEngineWorld(weakened), serializeEngineWorld(advance(dissipate(initial), 4)));
    assert.equal(weakened.world.holders.near.quantities.vitality, 18);
    assert.equal(weakened.world.holders.opponent.quantities.vitality, 18);
    assert.deepEqual(weakened.records.workings.hand.record.receipts.at(-1).observed, {place: 'rest', force: 2});
    assert.equal(purse(weakened)[redDate], 0);
    assert.equal(purse(weakened)[primeval], 0);
    const strongBrace = applyEngineOps(initial, [{op: 'law_params', id: 'near-brace', params: {capacity: 5}}], 'fixture:strong-brace');
    const spent = advance(restore(advance(dissipate(strongBrace), 3)), 4);
    assert.equal(spent.records.workings.hand.record.status, 'interrupted');
    assert.equal(spent.world.holders.near.quantities.vitality, 20);
    assert.equal(spent.world.holders.opponent.quantities.vitality, 20);
    assert.equal(advance(spent, 5).world.laws.length, 0);
    const crowded = applyEngineOps(strongBrace, [{op: 'move', holder: 'opponent', to: 'lane'}], 'fixture:same-contact-beat');
    const held = advance(dissipate(crowded), 3);
    assert.equal(held.world.holders.opponent.quantities.vitality, 20);
    assert.equal(held.records.workings.hand.landed.at(-1).reason, 'The sweep has spent its force.');

    const inFlight = advance(dissipate(initial), 2);
    const addDebris = amount => applyEngineOps(inFlight, [
        {op: 'carry', holder: 'lane', quantity: 'stock:rubble', amount},
        {op: 'property', holder: 'lane', property: 'gu_blocked_exit', value: 'debris-passage'},
        {op: 'link_add', link: {id: 'debris-passage', kind: 'path', from: 'lane', to: 'off-route', state: 'closed'}},
        {op: 'link_add', link: {id: 'locked-door', kind: 'path', from: 'lane', to: 'rest', state: 'closed'}},
    ], 'fixture:debris-arrives');
    const pathFromLane = (engine, to) => linkDistance(worldLinks(engine.world), 'lane', to, {kinds: ['path']});
    const debris = addDebris(1);
    assert.equal(pathFromLane(debris, 'off-route'), null);
    const firstHit = advance(restore(debris), 3);
    assert.equal(firstHit.world.holders.lane.quantities['stock:rubble'], 0);
    assert.equal(firstHit.world.holders.near.quantities.vitality, 19);
    const pastDebris = advance(restore(firstHit), 4);
    assert.deepEqual(serializeEngineWorld(pastDebris), serializeEngineWorld(advance(debris, 4)));
    assert.deepEqual(pathFromLane(pastDebris, 'off-route').route, ['debris-passage']);
    assert.equal(pathFromLane(pastDebris, 'rest'), null);
    assert.equal(pastDebris.world.holders.opponent.quantities.vitality, 19);
    const buried = advance(restore(addDebris(7)), 4);
    assert.equal(buried.world.holders.lane.quantities['stock:rubble'], 2);
    assert.equal(pathFromLane(buried, 'off-route'), null);
    assert.equal(buried.world.holders.near.quantities.vitality, 20);
    assert.equal(buried.world.holders.opponent.quantities.vitality, 20);
    assert.equal(buried.records.workings.hand.record.status, 'interrupted');
    assert.equal(purse(buried)[primeval], 0);
});

test('a White Jade brace breaks under Giant Hand and passes the remaining force through once', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'holder_add', value: {id: 'opponent', kind: 'body', as: ['creature', 'operator'], place: 'yard',
            properties: {alive: true}, quantities: {vitality: 20, [primeval]: 2}}},
        {op: 'holder_add', value: {...guBodyHolder({id: 'white-jade', needs: 'gu'}, {id: 'jade', place: 'yard', satiety: 20}),
            properties: {alive: true, gu_kind: 'white-jade', gu_rank: 1, gu_keeper: 'opponent', gu_controller: 'opponent'}}},
    ], 'fixture:jade-brace');
    const brace = (engine, id) => startEngineWorking(engine, {id, law: GU_GIANT_HAND_LAW, method: giantHandBrace,
        bindings: {operator: {kind: 'operator', id: 'opponent'}, guard: {kind: 'gu', id: 'jade'}}});
    const pending = brace(run(initial, 'hand', revisedGiantHandStrike), 'brace');
    const poised = advance(pending, 1);
    assert.equal(poised.world.laws[0].params.capacity, 3);
    const hit = advance(restore(poised), 2);
    assert.deepEqual(serializeEngineWorld(hit), serializeEngineWorld(advance(pending, 2)));
    assert.equal(hit.world.holders.opponent.quantities.vitality, 18);
    assert.equal(hit.world.holders.opponent.quantities[primeval], 1);
    assert.equal(hit.world.laws.length, 0);
    assert.equal(purse(hit)[primeval], 0);
    assert.equal(purse(hit)[redDate], 0);

    const stacked = advance(brace(pending, 'second-brace'), 2);
    assert.equal(stacked.world.holders.opponent.quantities.vitality, 20);
    assert.equal(stacked.world.holders.opponent.quantities[primeval], 0);
    assert.deepEqual(stacked.world.laws.map(field => field.params.capacity), [1]);
    const unfed = applyEngineOps(pending, [{op: 'set', holder: 'jade', quantity: 'satiety', amount: 0}], 'fixture:hungry-jade');
    const failed = advance(restore(unfed), 2);
    assert.equal(failed.records.workings.brace.record.status, 'interrupted');
    assert.equal(failed.world.holders.opponent.quantities[primeval], 2);
    assert.equal(failed.world.holders.opponent.quantities.vitality, 15);
});

test('the revised hand moves a heavy slab only with the stronger paid support pair', () => {
    const ordinary = advance(cast(setup(), 'other'), 2);
    assert.equal(ordinary.world.holders.slab.place, 'yard');
    assert.equal(ordinary.records.workings.hand.record.receipts[1].observed.force, 4);
    assert.equal(purse(ordinary)[primeval], 1);
    const pending = advance(cast(setup(), 'focused'), 1);
    assert.equal(purse(pending)[redDate], 0);
    assert.equal(purse(pending)[primeval], 3);
    const stronger = advance(restore(pending), 2);
    assert.deepEqual(serializeEngineWorld(stronger), serializeEngineWorld(advance(pending, 2)));
    assert.equal(stronger.world.holders.slab.place, 'rest');
    assert.equal(stronger.records.workings.hand.record.receipts[1].observed.force, 5);
    assert.equal(purse(stronger)[primeval], 0);

    const missing = applyEngineOps(pending, [{op: 'move', holder: 'focused', to: 'rest'}], 'fixture:support-withdrawn');
    const failed = advance(restore(missing), 2);
    assert.equal(failed.records.workings.hand.record.status, 'interrupted');
    assert.equal(purse(failed)[redDate], 0);
    assert.equal(purse(failed)[primeval], 3);
    assert.equal(failed.world.holders.slab.place, 'yard');
    const short = applyEngineOps(pending, [{op: 'set', holder: 'caster', quantity: primeval, amount: 2}], 'fixture:short-reserve');
    const unfunded = advance(restore(short), 2);
    assert.equal(unfunded.records.workings.hand.record.status, 'interrupted');
    assert.equal(purse(unfunded)[primeval], 2);
    assert.equal(purse(unfunded)[redDate], 0);
    assert.equal(unfunded.world.holders.slab.place, 'yard');
    const ward = applyEngineOps(pending, [{op: 'law_add', field: {id: 'brace', kind: 'block', scope: 'slab',
        params: {verb: 'move', object: 'position'}}}], 'fixture:ward');
    const stopped = advance(restore(ward), 2);
    assert.equal(stopped.world.holders.slab.place, 'yard');
    assert.equal(purse(stopped)[primeval], 0);
    assert.equal(stopped.records.workings.hand.landed[0].status, 'idle');
});

test('the older hand can save phantoms for one later release before they expire', () => {
    const initial = applyEngineOps(setup(), [
        {op: 'set', holder: 'caster', quantity: primeval, amount: 4},
        {op: 'set', holder: 'caster', quantity: redDate, amount: 2},
        {op: 'property', holder: 'core', property: 'gu_kind', value: 'self-strength'},
        {op: 'holder_add', value: {...guBodyHolder({id: 'older-strength-supports', needs: 'gu'}, {id: 'steady', place: 'yard', satiety: 20}),
            properties: {alive: true, gu_kind: 'older-strength-supports', gu_rank: 1, gu_keeper: 'caster', gu_controller: 'caster'}}},
    ], 'fixture:older-hand');
    const preparing = run(initial, 'prepare', prepareGiantHandWorking);
    const halfway = advance(preparing, 5);
    assert.equal(purse(halfway)[primeval], 3);
    assert.equal(purse(halfway)[redDate], 2);
    const prepared = advance(restore(halfway), 10);
    assert.deepEqual(serializeEngineWorld(prepared), serializeEngineWorld(advance(preparing, 10)));
    assert.equal(purse(prepared)[redDate], 0);
    assert.equal(prepared.world.holders.caster.properties.gu_held_phantom_expiry, 40);
    const absent = applyEngineOps(prepared, [{op: 'move', holder: 'focused', to: 'rest'}], 'fixture:absent-support');
    const failed = advance(run(absent, 'missing-support', releaseGiantHandWorking), 11);
    assert.equal(failed.records.workings['missing-support'].record.status, 'interrupted');
    assert.equal(purse(failed)[primeval], 3);
    assert.equal(failed.world.holders.caster.properties.gu_held_phantom_expiry, 40);
    const later = advance(prepared, 12);
    const pending = run(run(later, 'release-a', releaseGiantHandWorking), 'release-b', releaseGiantHandWorking);
    const cast = advance(restore(pending), 13);
    assert.deepEqual(serializeEngineWorld(cast), serializeEngineWorld(advance(pending, 13)));
    assert.equal(cast.world.holders.slab.place, 'rest');
    assert.equal(cast.records.workings['release-b'].record.receipts[0].reason, 'No prepared phantoms remain.');
    assert.equal(purse(cast)[primeval], 0);
    const expired = advance(run(advance(prepared, 39), 'expired', releaseGiantHandWorking), 40);
    assert.equal(expired.records.workings.expired.record.status, 'interrupted');
    assert.equal(purse(expired)[primeval], 3);
    assert.equal(expired.world.holders.slab.place, 'yard');
});
