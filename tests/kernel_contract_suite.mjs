// The kernel working contract suite (docs/KERNEL_WORKING_CONTRACT.md). Any
// consumer fixture runs it: {name, law, method, bindings, things, facts, start,
// leaving, leavesAt, finalEffect}. Not a test file itself; test files call it.
import assert from 'node:assert/strict';
import test from 'node:test';

import {
    WORKING_SCHEMA, beginWorking, interruptWorking, nextWorkingDeadline, quoteWorking,
    restoreWorking, serializeWorking, settleWorking, validateWorkingMethod, viewWorking,
} from '../src/kernel_working.js';

// A world reader that knows when each thing leaves, so every port is asked at
// the step's own boundary time (KW6).
export const reader = (things, gone = {}) => (ref, at) => (gone[ref.id] !== undefined && at >= gone[ref.id]) ? null : things[ref.id];
export const settleIn = (law, record, times, ports) => times.reduce(({record: current, effects}, now) => {
    const step = settleWorking(law, current, {now, ports});
    return {record: step.record, effects: [...effects, ...step.effects]};
}, {record, effects: []});
export const range = (from, to, by = 1) => Array.from({length: Math.floor((to - from) / by) + 1}, (_, i) => from + i * by);
export const lcg = seed => () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;

export function runWorkingContract(c) {
    const begin = (overrides = {}) => beginWorking(c.law, c.method, {id: `${c.method.id}.trial`, bindings: c.bindings,
        facts: c.facts, at: c.start, ...overrides});
    const end = () => begin().deadlines.at(-1);

    test(`${c.name}: the method is data with typed roles, and a wrong kind is refused`, () => {
        validateWorkingMethod(c.law, c.method);
        const role = Object.keys(c.bindings)[0];
        assert.throws(() => begin({bindings: {...c.bindings, [role]: {kind: 'wrong', id: 'x'}}}), /Bind a/);
        assert.throws(() => validateWorkingMethod(c.law, {...c.method, steps: [{op: 'missing'}]}), /does not have/);
        assert.throws(() => validateWorkingMethod(c.law, {...c.method, law: 'other@1'}), /different law/);
    });

    test(`${c.name}: the quote is pure and forecasts what settlement publishes`, () => {
        const ports = {read: reader(c.things)};
        const before = structuredClone({method: c.method, bindings: c.bindings, facts: c.facts, things: c.things});
        const quote = quoteWorking(c.law, c.method, {id: `${c.method.id}.trial`, bindings: c.bindings, facts: c.facts, at: c.start, ports});
        assert.deepEqual({method: c.method, bindings: c.bindings, facts: c.facts, things: c.things}, before);
        assert.equal(quote.ok, true);
        assert.deepEqual(quote.effects.at(-1), c.finalEffect);
        const settled = settleWorking(c.law, begin(), {now: end(), ports});
        assert.deepEqual(settled.effects.map(row => row.effect), quote.effects);
        assert.equal(settled.record.status, 'complete');
        assert.equal(quote.endsAt, end());
    });

    test(`${c.name}: one jump, every minute and random partitions settle the same`, () => {
        const ports = {read: reader(c.things)};
        const finish = end();
        const jump = settleIn(c.law, begin(), [finish + 7], ports);
        const minutes = settleIn(c.law, begin(), range(c.start, finish + 7, finish > 1000 ? 7 : 1), ports);
        const random = lcg(961);
        const cuts = [...new Set(range(c.start, finish).filter(() => random() < 0.01).concat(finish + 7))].sort((a, b) => a - b);
        const partitioned = settleIn(c.law, begin(), cuts, ports);
        assert.deepEqual(minutes, jump);
        assert.deepEqual(partitioned, jump);
        assert.equal(jump.record.status, 'complete');
        assert.equal(nextWorkingDeadline(jump.record), null);
    });

    test(`${c.name}: save mid-run, reload, continue: same as never saved`, () => {
        const ports = {read: reader(c.things)};
        const first = begin().deadlines[0];
        const part = settleWorking(c.law, begin(), {now: first, ports});
        const saved = JSON.stringify(serializeWorking(part.record));
        const restored = restoreWorking(c.law, JSON.parse(saved));
        assert.equal(restored.schema, WORKING_SCHEMA);
        const resumed = settleWorking(c.law, restored, {now: end(), ports});
        const straight = settleWorking(c.law, begin(), {now: end(), ports});
        assert.deepEqual(resumed.record, straight.record);
        assert.deepEqual([...part.effects, ...resumed.effects], straight.effects);
        assert.throws(() => restoreWorking(c.law, {...JSON.parse(saved), schema: 'kernel.working@9'}), /Unsupported/);
        assert.throws(() => restoreWorking(c.law, {...JSON.parse(saved), cursor: 0}), /receipts/);
    });

    test(`${c.name}: a bound thing that leaves interrupts at the same step under any partition`, () => {
        const record = begin();
        const ports = {read: reader(c.things, {[c.leaving]: c.leavesAt})};
        const jump = settleIn(c.law, record, [end() + 1], ports);
        const steps = settleIn(c.law, record, [...record.deadlines, end() + 1], ports);
        assert.deepEqual(steps, jump);
        assert.equal(jump.record.status, 'interrupted');
        const failed = jump.record.receipts.at(-1);
        assert.equal(failed.ok, false);
        assert.equal(failed.cause, 'binding');
        assert.ok(jump.record.receipts.slice(0, -1).every(row => row.ok), 'earlier steps stay settled');
        assert.ok(jump.effects.length > 0 && !jump.effects.some(row => row.step === failed.step));
        assert.equal(settleWorking(c.law, jump.record, {now: end() + 999, ports}).effects.length, 0);
    });

    test(`${c.name}: authority is read at each step's settlement (FG7)`, () => {
        const record = begin();
        const lapse = record.deadlines[0] + 1;
        const offer = {authority: ({at}) => at < lapse ? {ok: true} : {ok: false, reason: 'The offer has expired.'}};
        const ports = {read: reader(c.things), ...offer};
        const jump = settleIn(c.law, record, [end()], ports);
        const steps = settleIn(c.law, record, range(c.start, end(), Math.max(1, Math.floor((end() - c.start) / 50))).concat(end()), ports);
        assert.deepEqual(steps, jump);
        assert.deepEqual(jump.record.receipts.map(row => row.ok), [true, false]);
        assert.equal(jump.record.receipts[1].cause, 'authority');
        assert.equal(jump.record.receipts[1].reason, 'The offer has expired.');
        // An offer valid when the step settled keeps its receipt after it expires.
        const early = settleWorking(c.law, record, {now: record.deadlines[0], ports}).record;
        const later = settleWorking(c.law, early, {now: record.deadlines[0], ports: {...ports, authority: () => ({ok: false, reason: 'gone'})}});
        assert.deepEqual(later.record.receipts, early.receipts);
        assert.equal(restoreWorking(c.law, serializeWorking(early)).receipts[0].ok, true);
    });

    test(`${c.name}: the maker's view keeps observation apart from truth`, () => {
        const ports = {read: reader(c.things)};
        const {record} = settleWorking(c.law, begin(), {now: end(), ports});
        const view = viewWorking(record);
        assert.equal(JSON.stringify(view).includes('"truth"'), false);
        // A refusal's private reason stays in truth unless the port says what was visible.
        const secret = {read: reader(c.things), authority: ({step}) => step === 0 ? {ok: true}
            : {ok: false, reason: 'private-token-7731'}};
        const refused = settleWorking(c.law, begin(), {now: end(), ports: secret}).record;
        assert.equal(refused.receipts.at(-1).reason, 'private-token-7731');
        assert.equal(JSON.stringify(viewWorking(refused)).includes('private-token-7731'), false);
        const shown = settleWorking(c.law, begin(), {now: end(), ports: {...secret,
            authority: args => ({...secret.authority(args), ...(args.step ? {observed: {saw: 'the gate stayed shut'}} : {})})}}).record;
        assert.deepEqual(viewWorking(shown).steps.at(-1).observed, {saw: 'the gate stayed shut'});
        assert.equal(view.steps.length, c.method.steps.length);
        assert.ok(record.receipts.every(row => row.truth && row.observed));
        const stopped = interruptWorking(begin(), {at: c.start + 1, reason: 'The maker walked away.'});
        assert.equal(viewWorking(stopped).steps[0].observed.reason, 'The maker walked away.');
        assert.equal(settleWorking(c.law, stopped, {now: end(), ports}).effects.length, 0);
    });
}
