import test from 'node:test';
import assert from 'node:assert/strict';
import {paceCourse, pacedDeadlines, pacedMethod, retimeWorking, paceContest} from '../src/pace.js';
import {quoteActivation} from '../src/body_alteration.js';
import {landEffect} from '../src/effect_host.js';
import {createEngineWorld, applyEngineOps, advanceEngineWorld, serializeEngineWorld, restoreEngineWorld} from '../src/engine_world.js';
import {beginWorking, defineWorkingLaw, settleWorking, validateWorkingRecord, serializeWorking, restoreWorking} from '../src/kernel_working.js';

const pack = 'l.body_alteration';
const rig = {id: 'sandevistan', carrier: 'hardware', slot: 'spine', load: {body: 2, mind: 1},
    upkeep: [], course: {key: 'strain', perMinute: 0, overPerMinute: 0},
    activation: {permille: 2000, ticks: 60, per: 60, perTick: 0.001, thresholds: [{at: 40, factorPermille: 3000}]}};
const config = {packs: [pack], settings: {[pack]: {rows: [rig], budgets: {body: {capacity: 3, curve: [{at: 0, slope: 1}]}, mind: {capacity: 2, curve: [{at: 0, slope: 1}]}},
    slots: {spine: {room: 1, crowdPermille: 2000}}, courses: {strain: {recoverPerMinute: 5, stages: [{id: 'shaking', at: 40}]}}}}};
function scene() {
    let e = createEngineWorld({...config, holders: [{id: 'room', kind: 'place'}, ...['fast', 'faster', 'plain'].map(id => ({id, kind: 'body', place: 'room'}))]});
    for (const target of ['fast', 'faster']) e = applyEngineOps(e, [{op: 'publish', kind: 'alteration.install', place: 'room', detail: {target, row: rig.id}}], 'fit');
    return e;
}
function activate(e, target, {tick = 0, row = rig, mindPressure = 1000} = {}) {
    const strain = e.world.holders[target].quantities['alteration_course:strain'];
    const quote = quoteActivation(row, {target, tick, clock: e.world.clock, strain, mindPressure});
    const landed = landEffect(e.rules, e.world, quote.effect, {cause: `activate.${target}.${tick}`, by: target});
    assert.equal(landed.status, 'landed');
    e = applyEngineOps({...e, world: landed.world}, [{op: 'add', holder: target, quantity: 'alteration_course:strain', amount: quote.strain}], 'activation.price');
    return {engine: e, quote};
}
const verbs = ['move', 'carry', 'sense', 'strike'];
const law = defineWorkingLaw({id: 'scene', revision: 1, operations: Object.fromEntries(verbs.map(op => [op,
    {roles: {actor: 'body'}, minutes: 10, settle: ({at, bound}) => ({ok: true, facts: {[op]: at}, effects: [{kind: op, actor: bound.actor.id}]})}]))});
const method = {id: 'actions', revision: 1, law: law.ref, roles: {actor: 'body'}, steps: Array.from({length: 64}, (_, i) =>
    ({op: verbs[i % verbs.length], bindings: {actor: 'actor'}}))};
const ports = {read: ref => ({...ref, place: 'room'})};
function start(holder, course, at = 0, m = method) {
    return beginWorking(law, pacedMethod(law, m, at, course), {id: `work.${holder}`, at, bindings: {actor: {kind: 'body', id: holder}}});
}

test('speed rig activation lands a time field; near move/carry/sense/strike equal coarse pace', () => {
    let e = activate(scene(), 'fast').engine;
    e = activate(e, 'faster', {row: {...rig, activation: {...rig.activation, permille: 3000}}}).engine;
    const entrants = ['fast', 'faster', 'plain'].map(id => ({id, course: paceCourse(e.world, id)}));
    const contest = paceContest(entrants, {from: 0, to: 60, stepTicks: 10});
    assert.deepEqual(contest.order, ['faster', 'fast', 'plain']);
    assert.deepEqual(Object.values(contest.entrants).map(x => x.actions), [12, 18, 6]);
    assert.equal(contest.entrants.faster.actions / contest.entrants.fast.actions, 3000 / 2000);
    for (const {id, course} of entrants) {
        const initial = start(id, course), once = settleWorking(law, initial, {now: 60, ports}).record;
        let partitioned = initial;
        for (const now of [1, 4, 9, 17, 31, 60]) partitioned = settleWorking(law, partitioned, {now, ports}).record;
        assert.deepEqual(partitioned, once);
        assert.equal(once.cursor, contest.entrants[id].actions);
        assert.equal(once.receipts[0].at, contest.entrants[id].firstAt);
        assert.ok(verbs.every(op => once.receipts.some(r => r.op === op)));
        assert.equal(validateWorkingRecord(law, once), once);
        assert.deepEqual(restoreWorking(law, JSON.parse(JSON.stringify(serializeWorking(once)))), once);
        const complete = settleWorking(law, initial, {now: initial.deadlines.at(-1), ports}).record;
        assert.equal(complete.status, 'complete');
    }
});
test('overlap multiplies and cumulative deadlines use the first whole tick, including window edges', () => {
    const course = [{permille: 1500, from: 1, to: 5, per: 60}, {permille: 2000, from: 3, to: 7, per: 60}];
    assert.deepEqual(pacedDeadlines([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 0, course), [1, 2, 3, 3, 4, 4, 4, 5, 5, 5]);
    assert.deepEqual(pacedDeadlines([0, 1, 10], 7, course), [7, 8, 18]);
    const exact = Array.from({length: 3}, () => ({permille: 1100, from: 0, to: 1000, per: 60}));
    assert.equal(paceContest([{id: 'exact', course: exact}], {from: 0, to: 1000, stepTicks: 1}).entrants.exact.actions, 1331);
    assert.equal(pacedDeadlines([1331], 0, exact)[0], 1000);
    const stopped = [{permille: 0, from: 0, to: 5, per: 60}];
    assert.deepEqual(pacedDeadlines([1, 1], 0, stopped), [6, 7]);
});
test('a working begun before a later speed window is retimed without changing settled receipts', () => {
    const initial = start('fast', []);
    const before = settleWorking(law, initial, {now: 10, ports}).record;
    const e = activate(scene(), 'fast', {tick: 20}).engine;
    const course = paceCourse(e.world, 'fast');
    const retimed = retimeWorking(law, before, course);
    assert.deepEqual(retimed.receipts, before.receipts);
    assert.deepEqual(retimed.deadlines.slice(0, 5), [10, 20, 25, 30, 35]);
    assert.equal(validateWorkingRecord(law, retimed), retimed);
    const once = settleWorking(law, retimed, {now: 80, ports}).record;
    let many = retimed;
    for (const now of [20, 25, 43, 80]) many = settleWorking(law, many, {now, ports}).record;
    assert.deepEqual(once, many);
    assert.deepEqual(restoreWorking(law, serializeWorking(once)), once);
    assert.deepEqual(retimeWorking(law, retimed, course), retimed);
});
test('strain is paid on the body, crosses a stage, makes a second activation dearer and recovers in world minutes', () => {
    const first = activate(scene(), 'fast');
    assert.equal(first.quote.strain, 60);
    assert.equal(first.engine.world.holders.fast.quantities['alteration_course:strain'], 60);
    const second = activate(first.engine, 'fast', {tick: 1});
    assert.equal(second.quote.strain, 180);
    assert.ok(second.quote.strain > first.quote.strain);
    assert.equal(paceCourse(second.engine.world, 'fast').length, 2);
    assert.equal(quoteActivation(rig, {target: 'fast', tick: 0, clock: 0, strain: 60, mindPressure: 2000}).strain, 360);
    const warning = advanceEngineWorld(first.engine, 1).engine;
    assert.equal(warning.world.holders.fast.state[pack].stages.strain, 'shaking');
    assert.ok(warning.world.chain.some(x => x.kind === 'alteration.stage'));
    const rested = advanceEngineWorld(first.engine, 12).engine;
    assert.equal(rested.world.holders.fast.quantities['alteration_course:strain'], 0);
    assert.equal(paceCourse(rested.world, 'fast').length, 0);
    let steps = first.engine;
    for (let to = 1; to <= 12; to++) steps = advanceEngineWorld(steps, to).engine;
    assert.deepEqual(serializeEngineWorld(steps), serializeEngineWorld(rested));
    const restored = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(warning))), config);
    assert.deepEqual(serializeEngineWorld(advanceEngineWorld(restored, 12).engine), serializeEngineWorld(rested));
});
