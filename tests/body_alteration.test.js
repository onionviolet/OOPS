import test from 'node:test';
import assert from 'node:assert/strict';
import {pressurePermille, crowdedLoad, validateAlterationRow} from '../src/body_alteration.js';
import {createEngineWorld, applyEngineOps, advanceEngineWorld, serializeEngineWorld, restoreEngineWorld, exercisedCouplings} from '../src/engine_world.js';
import {livingBodyState} from '../src/world_substrate_packs/living_body.js';
import {beginWorking, defineWorkingLaw, settleWorking} from '../src/kernel_working.js';
import {substratePort} from '../src/world_substrate.js';

const pack = 'l.body_alteration';
const curve = [{at: 0, slope: 1}, {at: 1000, slope: 3}];
const budget = capacity => ({capacity, curve});
const course = (recoverPerMinute = 0) => ({recoverPerMinute, relief: {blocksPermille: 750, decayPerMinute: 1},
    stages: [{id: 'warning', at: 10, publish: {kind: 'living.harm', detail: {kind: 'backlash', amount: 1}}}, {id: 'severe', at: 40}]});
const row = (id, carrier, slot, load, key, changes = {}) => ({id, carrier, slot, load, upkeep: [], unmetPerMinute: 0,
    course: {key, perMinute: 0, overPerMinute: 4}, grants: {quantities: []}, ...changes});
const rows = [
    row('moonlight-gu', 'magical', 'aperture', {aperture: 2}, 'backlash', {upkeep: [{quantity: 'feed', perMinute: 1}], unmetPerMinute: 5}),
    row('seer-potion', 'chemical', 'pathway', {power: 1}, 'instability', {grants: {quantities: [{quantity: 'power', amount: 1}]}}),
    row('stabilizer', 'chemical', 'blood', {tolerance: 1}, 'dependence', {lasts: 4, upkeep: [{quantity: 'feed', perMinute: 1}],
        grants: {quantities: [{quantity: 'alteration_relief:instability', amount: 8}]}}),
    row('digesting-potion', 'chemical', 'pathway', {power: 3}, 'instability', {settles: {perMinute: 1, floor: 0}}),
    row('muscle', 'bioware', 'body', {body: 2, mind: 1}, 'rejection', {course: {key: 'rejection', perMinute: 5, overPerMinute: 4}, upkeep: [{quantity: 'satiety', perMinute: 2}]}),
    row('arm', 'hardware', 'arm', {body: 2, mind: 1}, 'rejection', {grants: {quantities: [{quantity: 'strength', amount: 3}]}}),
    row('suppressant', 'chemical', 'blood', {tolerance: 1}, 'dependence', {lasts: 4, grants: {quantities: [{quantity: 'alteration_relief:rejection', amount: 8}]}}),
    row('repair-cloud', 'nanotech', 'blood', {body: 1}, 'rejection'),
    row('gene-edit', 'genetic', 'body', {body: 1}, 'rejection'),
];
const settings = {[pack]: {rows, budgets: {aperture: budget(2), power: budget(1), tolerance: budget(2), body: budget(3), mind: budget(2)},
    slots: {aperture: {room: 1, crowdPermille: 2000}},
    courses: {backlash: course(), instability: course(), dependence: course(), rejection: course(2)}}};
const shared = {quantities: ['feed', 'power', 'strength', 'credits'].map(id => ({id, unit: 'unit', min: 0, max: 100000}))};
const config = {packs: ['l.living_body', pack], settings, shared, dials: {chainCap: 1000}};
function fixture({care = false} = {}) {
    return createEngineWorld({...config, lawFields: care ? [{id: 'clinic', scope: 'room', kind: 'alteration.care', params: {numerator: 3, denominator: 1}}] : [],
        holders: [{id: 'room', kind: 'place'},
            {id: 'body', kind: 'body', place: 'room', tags: ['living.body'], quantities: {satiety: 100, feed: 20, credits: 10},
                state: {'l.living_body': livingBodyState({species: 'human', rate: 1})}},
            {id: 'item', kind: 'thing', place: 'room', quantities: {satiety: 100, feed: 20}},
            {id: 'flask', kind: 'thing', as: ['item'], place: 'room', quantities: {feed: 10}}]});
}
const n = (e, key, id = 'body') => e.world.holders[id].quantities[key] ?? 0;
const op = (e, ops) => applyEngineOps(e, ops, 'fixture');
const install = (e, row, bearer) => op(e, [{op: 'publish', kind: 'alteration.install', place: 'room', detail: {target: 'body', row, ...(bearer ? {bearer} : {})}}]);
const remove = (e, row) => op(e, [{op: 'publish', kind: 'alteration.remove', place: 'room', detail: {target: 'body', row}}]);
const advance = (e, to) => { const r = advanceEngineWorld(e, to); assert.equal(r.pending, false); return r.engine; };
function exact(e, to) {
    const jump = advance(e, to);
    let steps = e;
    for (let t = e.world.clock + 1; t <= to; t++) steps = advance(steps, t);
    assert.deepEqual(serializeEngineWorld(steps), serializeEngineWorld(jump));
    const mid = advance(e, e.world.clock + Math.floor((to - e.world.clock) / 2));
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(mid))), config);
    assert.deepEqual(serializeEngineWorld(advance(restored, to)), serializeEngineWorld(jump));
    return jump;
}

test('pressure and slot costs steepen; row validation concerns malformed data', () => {
    assert.deepEqual([2, 4, 6].map(n => pressurePermille(n, 2, curve)), [1000, 2000, 5000]);
    assert.deepEqual(crowdedLoad(rows[0], 2, settings[pack].slots.aperture), {aperture: 8});
    assert.throws(() => validateAlterationRow({...rows[0], load: {aperture: -1}}), /malformed/);
    assert.equal(validateAlterationRow(rows[0]), rows[0]);
});
test('Gu feeding, crowded second and third installs, backlash stage and harm use one engine law', () => {
    const one = install(fixture(), 'moonlight-gu');
    const two = install(one, 'moonlight-gu'), three = install(two, 'moonlight-gu');
    assert.deepEqual([one, two, three].map(e => n(e, 'alteration_load:aperture')), [2, 6, 14]);
    const first = advance(one, 1), second = advance(two, 1), third = advance(three, 1);
    assert.ok(n(first, 'feed') > n(second, 'feed') && n(second, 'feed') > n(third, 'feed'));
    const unfed = op(one, [{op: 'set', holder: 'body', quantity: 'feed', amount: 0}]);
    const end = exact(unfed, 4);
    assert.equal(n(end, 'alteration_course:backlash'), 20);
    assert.equal(end.world.holders.body.state[pack].stages.backlash, 'warning');
    assert.equal(end.world.holders.body.state['l.living_body'].inbox.length, 1);
    exact(three, 8);
    assert.equal(n(remove(three, 'moonlight-gu'), 'alteration_load:aperture'), 12);
});

const drinkLaw = defineWorkingLaw({id: 'dose', revision: 1, operations: {drink: {roles: {flask: 'item', body: 'body'}, minutes: 1,
    settle: ({bound, facts}) => bound.flask.quantities.feed > 0 && bound.flask.place === bound.body.place
        ? {ok: true, effects: [{op: 'add', holder: 'flask', quantity: 'feed', amount: -1},
            {op: 'publish', kind: 'alteration.install', place: bound.body.place, detail: {target: bound.body.id, row: facts.row}}]}
        : {ok: false, reason: 'dose-unavailable'}}}});
const method = {id: 'drink', revision: 1, law: drinkLaw.ref, roles: {flask: 'item', body: 'body'}, steps: [{op: 'drink', bindings: {flask: 'flask', body: 'body'}}]};
function drink(e, row) {
    const record = beginWorking(drinkLaw, method, {id: `dose.${e.world.clock}`, at: e.world.clock,
        bindings: {flask: {kind: 'item', id: 'flask'}, body: {kind: 'body', id: 'body'}}, facts: {row}});
    e = advance(e, record.deadlines[0]);
    const result = settleWorking(drinkLaw, record, {now: e.world.clock, ports: {read: substratePort(e.world)}});
    assert.equal(result.record.status, 'complete');
    return op(e, result.effects.map(x => x.effect));
}
test('lasting potion doses go past capacity; stabilization, capacity work and digestion carry prices', () => {
    const first = drink(fixture(), 'seer-potion');
    assert.equal(n(exact(first, 4), 'alteration_course:instability'), 0);
    const second = drink(first, 'seer-potion');
    assert.equal(n(second, 'power'), 2);
    assert.equal(n(second, 'alteration_load:power'), 2);
    const secondEnd = exact(second, 6);
    assert.ok(n(secondEnd, 'alteration_course:instability') > n(advance(first, 6), 'alteration_course:instability'));
    const stabilized = drink(second, 'stabilizer'), control = advance(second, stabilized.world.clock);
    assert.equal(n(stabilized, 'alteration_load:tolerance'), 1);
    const helped = exact(stabilized, 5);
    assert.ok(n(helped, 'alteration_course:instability') < n(advance(control, 5), 'alteration_course:instability'));
    assert.ok(n(helped, 'feed') < n(stabilized, 'feed'));
    const expired = exact(stabilized, 8);
    assert.equal(n(expired, 'alteration_load:tolerance'), 0);
    // A paid, timed clinic working raises capacity through ordinary quantity ops.
    const clinic = defineWorkingLaw({id: 'clinic', revision: 1, operations: {raise: {roles: {}, minutes: 2,
        settle: () => ({ok: true, effects: [{op: 'add', holder: 'body', quantity: 'credits', amount: -3},
            {op: 'add', holder: 'body', quantity: 'alteration_capacity:power', amount: 1}]})}}});
    const m = {id: 'raise', revision: 1, law: clinic.ref, roles: {}, steps: [{op: 'raise', bindings: {}}]};
    const r = beginWorking(clinic, m, {id: 'raise', at: second.world.clock, bindings: {}});
    let raised = advance(second, r.deadlines[0]);
    raised = op(raised, settleWorking(clinic, r, {now: raised.world.clock}).effects.map(x => x.effect));
    assert.equal(n(raised, 'credits'), 7);
    assert.equal(raised.world.clock - second.world.clock, 2);
    assert.equal(n(exact(raised, 8), 'alteration_course:instability'), n(raised, 'alteration_course:instability'));
    const digesting = install(fixture(), 'digesting-potion');
    assert.equal(n(digesting, 'alteration_load:power'), 3);
    const digested = exact(digesting, 4);
    assert.equal(n(digested, 'alteration_load:power'), 0);
    assert.ok(n(digested, 'alteration_course:instability') > 0);
    assert.equal(n(remove(digested, 'digesting-potion'), 'alteration_load:power'), 0);
    const reversed = remove(second, 'seer-potion');
    assert.equal(n(reversed, 'power'), 1);
    assert.equal(n(reversed, 'alteration_load:power'), 1);
});

test('body and mind loads, relief, clinic recovery and item bearer couple with living satiety', () => {
    const firstSuppressant = install(fixture(), 'suppressant');
    assert.equal(n(firstSuppressant, 'alteration_relief:rejection'), 8);
    exact(firstSuppressant, 5);
    const baseline = install(install(fixture(), 'muscle'), 'arm');
    const suppressed = install(baseline, 'suppressant');
    const end = exact(baseline, 8), helped = exact(suppressed, 8);
    assert.ok(n(helped, 'alteration_course:rejection') < n(end, 'alteration_course:rejection'));
    const clinic = install(install(fixture({care: true}), 'muscle'), 'arm');
    assert.ok(n(exact(clinic, 8), 'alteration_course:rejection') < n(end, 'alteration_course:rejection'));
    assert.ok(exercisedCouplings(end).some(c => c.name === 'satiety' && c.packs.includes(pack) && c.packs.includes('l.living_body')));
    assert.ok(n(end, 'satiety') < 100 - 8);
    const carried = install(install(fixture(), 'muscle'), 'arm', 'item');
    assert.equal(n(carried, 'alteration_load:body'), 2);
    assert.equal(n(carried, 'alteration_load:body', 'item'), 2);
    assert.equal(n(carried, 'strength'), 3);
    exact(carried, 8);
    const loadedItem = op(carried, [{op: 'set', holder: 'item', quantity: 'alteration_capacity:body', amount: 1}]);
    assert.ok(n(exact(loadedItem, 2), 'alteration_course:rejection', 'item') > 0);
    const missingFeed = op(fixture(), [{op: 'holder_add', value: {id: 'empty', kind: 'thing', place: 'room'}}]);
    const supplied = install(missingFeed, 'moonlight-gu', 'empty');
    assert.equal(n(supplied, 'feed', 'empty'), 0);
    assert.ok(n(exact(supplied, 2), 'alteration_course:backlash', 'empty') > 0);
    const left = op(carried, [{op: 'holder_add', value: {id: 'away', kind: 'place'}}, {op: 'move', holder: 'item', to: 'away'}]);
    const lost = advance(left, 1);
    assert.equal(n(lost, 'strength'), 0);
    assert.equal(n(lost, 'alteration_load:body', 'item'), 0);
    const six = install(install(baseline, 'repair-cloud'), 'gene-edit');
    assert.equal(six.world.holders.body.state[pack].installed.length, 4);
    exact(six, 5);
});
