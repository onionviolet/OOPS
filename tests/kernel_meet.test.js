// Workings that meet (KB8, KW27-KW30): a C-shaped hit against the three-core
// killer move (G adapter) and a Counterspell against the Hogwarts bench cast
// (S adapter). Adapters come from tests/kernel_adapters.mjs.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, restoreWorking, serializeWorking, validateWorkingRecord, viewWorking} from '../src/kernel_working.js';
import {composeWorking} from '../src/kernel_compose.js';
import {settleTogether} from '../src/kernel_meet.js';
import {guBindings, hpBindings, hpComposed, hpThings, pair, reversalThings, single, threeCore} from './kernel_adapters.mjs';
import {lcg, range, reader} from './kernel_contract_suite.mjs';

// A strike or a counter is an ordinary working; whether it stops another one
// is the caller's meets rule, read from the settled step's effects.
const actLaw = defineWorkingLaw({id: 'kernel.test.act', revision: 1, operations: {
    strike: {roles: {attacker: 'actor', target: 'cultivator'}, minutes: 2, settle: ({bound}) => ({ok: true,
        effects: [{kind: 'hit', target: bound.target.id}]})},
    counter: {roles: {caster: 'actor', board: 'object'}, minutes: 2, settle: ({bound}) => ({ok: true,
        effects: [{kind: 'end-cast', target: bound.board.id}]})},
}});
const strikeMethod = {id: 'strike', revision: 1, law: actLaw.ref, roles: {attacker: 'actor', target: 'cultivator'},
    steps: [{op: 'strike', bindings: {attacker: 'attacker', target: 'target'}}]};
const counterMethod = {id: 'counterspell', revision: 1, law: actLaw.ref, roles: {caster: 'actor', board: 'object'},
    steps: [{op: 'counter', bindings: {caster: 'caster', board: 'board'}}]};

// The meets rule: a hit on a working's operator, or an end-cast on its board,
// stops that working. Only words for the maker are in observed.
const meets = ({settled, running}) => settled.effects.flatMap(effect => running.filter(other =>
    (effect.kind === 'hit' && other.bindings.operator?.id === effect.target) ||
    (effect.kind === 'end-cast' && other.bindings.board?.id === effect.target))
    .map(other => ({working: other.working, reason: effect.kind === 'hit' ? 'struck' : 'countered', observed: {felt: effect.kind}})));

const things = {...reversalThings, ...hpThings, rival: {kind: 'actor', id: 'rival'}};
const ports = {read: (ref, at) => reader(things)(ref, at) ?? (ref.kind === 'actor' ? {kind: 'actor', id: ref.id} : null)};
const move = composeWorking(threeCore, {lead: single, pair});
const cast = hpComposed();

function fight({strikeAt = 0, strikeOrder = 0, moveOrder = 1} = {}) {
    return [
        {law: move.law, order: moveOrder, record: beginWorking(move.law, move.method, {id: 'fang.move',
            bindings: guBindings('eat-strength', 'pulling-mountain', 'pulling-water'), facts: {reserves: {player: {immortal: 6}}}, at: 0})},
        {law: actLaw, order: strikeOrder, record: beginWorking(actLaw, strikeMethod, {id: 'rival.strike',
            bindings: {attacker: {kind: 'actor', id: 'rival'}, target: {kind: 'cultivator', id: 'player'}}, at: strikeAt})},
    ];
}
function duel({counterAt = 0, counterOrder = 0} = {}) {
    return [
        {law: cast.law, order: 1, record: beginWorking(cast.law, cast.method, {id: 'student.cast', bindings: hpBindings, at: 0})},
        {law: actLaw, order: counterOrder, record: beginWorking(actLaw, counterMethod, {id: 'rival.counter',
            bindings: {caster: {kind: 'actor', id: 'rival'}, board: {kind: 'object', id: 'board'}}, at: counterAt})},
    ];
}
const byId = (records, id) => records.find(record => record.id === id);
const settleIn = (entries, times) => times.reduce(({entries: current, effects}, now) => {
    const out = settleTogether(current, {now, ports, meets});
    return {entries: current.map((entry, i) => ({...entry, record: out.records[i]})), effects: [...effects, ...out.effects]};
}, {entries, effects: []});

test('a hit that lands before the pair beat stops the move; earlier beats stay spent (C)', () => {
    const {records, effects} = settleTogether(fight(), {now: 20, ports, meets});
    const fang = byId(records, 'fang.move');
    assert.equal(fang.status, 'interrupted');
    assert.deepEqual(fang.receipts.map(row => [row.op, row.ok, row.cause ?? null]), [['lead/beat-1', true, null], ['pair/beat-2', false, 'interrupt']]);
    assert.deepEqual(fang.receipts[1].by, {working: 'rival.strike', step: 0});
    assert.equal(fang.receipts[1].at, 2);
    assert.deepEqual(fang.facts.reserves, {player: {immortal: 5}});
    assert.deepEqual(viewWorking(fang).steps[1].observed, {felt: 'hit'});
    assert.equal(effects.filter(row => row.working === 'fang.move').length, 1);
    // Later, or later in the same minute, and the move finishes first.
    assert.equal(byId(settleTogether(fight({strikeAt: 1}), {now: 20, ports, meets}).records, 'fang.move').status, 'complete');
    assert.equal(byId(settleTogether(fight({strikeOrder: 2}), {now: 20, ports, meets}).records, 'fang.move').status, 'complete');
});

test('Counterspell ends the cast in flight before the summoning (S)', () => {
    const {records, effects} = settleTogether(duel(), {now: 20, ports, meets});
    const student = byId(records, 'student.cast');
    assert.equal(student.status, 'interrupted');
    assert.deepEqual(student.receipts.map(row => row.ok), [true, false]);
    assert.equal(student.receipts[1].reason, 'countered');
    assert.deepEqual(effects.filter(row => row.working === 'student.cast').map(row => row.step), [0]);
    assert.equal(byId(settleTogether(duel({counterAt: 2}), {now: 20, ports, meets}).records, 'student.cast').status, 'complete');
});

test('one jump, every minute and random partitions settle a meeting the same', () => {
    for (const make of [fight, duel, () => fight({strikeOrder: 2}), () => duel({counterOrder: 5})]) {
        const jump = settleIn(make(), [20]);
        const minutes = settleIn(make(), range(0, 20));
        const random = lcg(1561);
        const cuts = range(0, 20).filter(() => random() < 0.3).concat(20);
        assert.deepEqual(minutes, jump);
        assert.deepEqual(settleIn(make(), cuts), jump);
    }
});

test('each record saves alone mid-meeting and the meeting continues the same', () => {
    const half = settleIn(fight({strikeAt: 0}), [1]);
    const reloaded = half.entries.map(entry => ({...entry, record: restoreWorking(entry.law, JSON.parse(JSON.stringify(serializeWorking(entry.record))))}));
    const resumed = settleTogether(reloaded, {now: 20, ports, meets});
    const straight = settleTogether(fight({strikeAt: 0}), {now: 20, ports, meets});
    assert.deepEqual(resumed.records, straight.records);
    assert.deepEqual([...half.effects, ...resumed.effects], straight.effects);
    for (const [i, record] of straight.records.entries()) validateWorkingRecord([move.law, actLaw][i], record);
});

test('interrupts do not cascade, and meets is asked only after a settled step', () => {
    const calls = [];
    const counting = args => { calls.push(args.settled.working); return meets(args); };
    settleTogether(fight(), {now: 20, ports, meets: counting});
    assert.deepEqual(calls, ['fang.move', 'rival.strike']);
    assert.throws(() => settleTogether(fight(), {now: 20, ports, meets: () => [{working: 'nobody', reason: 'x'}]}), /another working/);
    const same = fight();
    assert.throws(() => settleTogether([same[0], same[0]], {now: 20, ports, meets}), /own id/);
});
