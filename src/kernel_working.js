// Kernel working contract v0 (docs/KERNEL_WORKING_CONTRACT.md, KW1-KW14).
// A working is a reusable method of typed roles and ordered steps, bound to
// actual things for one attempt. The kernel quotes it, settles each step at its
// own deadline, keeps a receipt with the truth and what the maker observed in
// separate fields, and saves one versioned record. It names no domain and no
// world: operations, durations, readers and authority come from the caller.
// Not to be confused with working_state.js, which is the UI busy note.
import {check, natural, object} from './basics.js';

export const KERNEL_CONTRACT_VERSION = '0.1';
export const WORKING_SCHEMA = 'kernel.working@1';
export const MAX_WORKING_STEPS = 64;

const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value);
const own = (table, key) => object(table) && Object.hasOwn(table, key) ? table[key] : undefined;
const clone = value => value === undefined ? undefined : structuredClone(value);

// KW1. A law is a table of operations. Each operation declares the kinds of
// thing it acts on and settles one step: settle({bound, facts, options, at,
// address, step}) -> {ok: true, facts?, effects?, observed?} | {ok: false, reason, observed?}.
export function defineWorkingLaw({id: lawId, revision, operations}) {
    check(id(lawId) && natural(revision) && object(operations) && Object.keys(operations).length > 0,
        'A working law needs an id, a revision and operations.');
    for (const [op, operation] of Object.entries(operations)) {
        check(id(op) && object(operation) && object(operation.roles) && typeof operation.settle === 'function',
            `Operation ${op} needs roles and a settle rule.`);
        for (const [role, kind] of Object.entries(operation.roles)) check(id(role) && id(kind), `Operation ${op} has an invalid role.`);
        check(operation.minutes === undefined || natural(operation.minutes), `Operation ${op} has an invalid duration.`);
    }
    return Object.freeze({id: lawId, revision, ref: `${lawId}@${revision}`, operations: Object.freeze({...operations})});
}

// KW2. A method is data: roles with kinds, ordered steps naming an operation,
// which working role fills each operation role, and an optional duration dial.
export function validateWorkingMethod(law, method) {
    check(object(method) && id(method.id) && natural(method.revision) && method.law === law.ref,
        'This method was written for a different law.');
    check(object(method.roles) && Array.isArray(method.steps) && method.steps.length > 0 &&
        method.steps.length <= MAX_WORKING_STEPS, 'Choose at least one step.');
    for (const [role, kind] of Object.entries(method.roles)) check(id(role) && id(kind), 'The method has an invalid role.');
    method.steps.forEach((step, index) => {
        const operation = own(law.operations, step?.op);
        check(object(step) && operation, `Step ${index + 1} uses an operation this law does not have.`);
        check(step.minutes === undefined || natural(step.minutes), `Step ${index + 1} has an invalid duration.`);
        const bindings = step.bindings ?? {};
        check(object(bindings) && Object.keys(bindings).length === Object.keys(operation.roles).length,
            `Step ${index + 1} must fill every role of ${step.op}.`);
        for (const [slot, kind] of Object.entries(operation.roles)) {
            const role = own(bindings, slot);
            check(own(method.roles, role) === kind, `Step ${index + 1} needs a ${kind} for ${slot}.`);
        }
    });
    return method;
}

const stepMinutes = (law, step) => step.minutes ?? law.operations[step.op].minutes ?? 0;

// KW5. Deadlines are absolute minutes from the start, never accumulated deltas.
export function workingDeadlines(law, method, startedAt) {
    check(natural(startedAt), 'A working needs a whole-minute start time.');
    let at = startedAt;
    return method.steps.map(step => {
        at += stepMinutes(law, step);
        check(Number.isSafeInteger(at), 'The working runs past the clock range.');
        return at;
    });
}

function checkBindings(method, bindings) {
    check(object(bindings), 'Bind every role of the working.');
    for (const [role, kind] of Object.entries(method.roles)) {
        const ref = own(bindings, role);
        check(object(ref) && ref.kind === kind && id(ref.id), `Bind a ${kind} to ${role}.`);
    }
    check(Object.keys(bindings).every(role => Object.hasOwn(method.roles, role)), 'A binding names a role the method does not have.');
}

// KW3 and KW6. One step at its own boundary time. Roles are read through the
// caller's reader at `at`, authority is asked at `at`, then the operation settles.
function settleStep({law, method, workingId, bindings, facts, index, at, ports}) {
    const step = method.steps[index];
    const operation = law.operations[step.op];
    const bound = {};
    const used = {};
    for (const [slot, role] of Object.entries(step.bindings ?? {})) {
        const ref = bindings[role];
        const thing = ports.read ? ports.read(ref, at) : ref;
        if (!object(thing) || thing.kind !== ref.kind || thing.id !== ref.id) {
            return {ok: false, reason: `${role} is no longer available.`, cause: 'binding', used};
        }
        bound[slot] = clone(thing);
        used[slot] = ref.id;
    }
    if (ports.authority) {
        const answer = ports.authority({working: workingId, method: {id: method.id, revision: method.revision},
            step: index, op: step.op, at, bindings: clone(bindings)});
        check(object(answer) && typeof answer.ok === 'boolean', 'Authority must answer ok or not.');
        if (!answer.ok) return {ok: false, reason: answer.reason || 'No one with the right permits this.', cause: 'authority', used,
            observed: clone(answer.observed)};
    }
    const outcome = operation.settle({bound, facts: clone(facts), options: clone(step.options ?? {}), at,
        address: `${workingId}/${index}`, step: index});
    check(object(outcome) && typeof outcome.ok === 'boolean', `Operation ${step.op} must answer ok or not.`);
    if (!outcome.ok) {
        check(typeof outcome.reason === 'string' && outcome.reason.length > 0, `Operation ${step.op} needs a reason.`);
        return {ok: false, reason: outcome.reason, cause: 'operation', used, observed: clone(outcome.observed)};
    }
    check(outcome.facts === undefined || object(outcome.facts), `Operation ${step.op} returned invalid facts.`);
    check(outcome.effects === undefined || Array.isArray(outcome.effects), `Operation ${step.op} returned invalid effects.`);
    return {ok: true, used, facts: clone(outcome.facts ?? {}), effects: clone(outcome.effects ?? []),
        observed: clone(outcome.observed)};
}

// KW4. A quote is the same settlement run as a forecast: nothing is kept and
// nothing is published. It reads the world through the same ports.
// Pass the same id the working will begin with: draws and authority see the
// same address in the quote and in settlement.
export function quoteWorking(law, method, {bindings, facts = {}, at, ports = {}, id: workingId}) {
    check(id(workingId), 'Quote with the id the working will begin with.');
    validateWorkingMethod(law, method);
    checkBindings(method, bindings);
    const record = beginWorking(law, method, {id: workingId, bindings, facts, at});
    const {record: done, effects} = settleWorking(law, record, {now: record.deadlines.at(-1), ports});
    const last = done.receipts.at(-1);
    return {ok: done.status === 'complete', startsAt: at, endsAt: record.deadlines.at(-1),
        deadlines: [...record.deadlines], effects: effects.map(row => row.effect), facts: done.facts,
        ...(done.status === 'interrupted' ? {failedStep: last.step, reason: last.reason} : {}),
        steps: done.receipts.map(({step, op, at: stepAt, ok, reason}) => ({step, op, at: stepAt, ok, ...(reason ? {reason} : {})}))};
}

// KW7. Beginning keeps only references to bound things and the method snapshot.
export function beginWorking(law, method, {id: workingId, bindings, facts = {}, at}) {
    validateWorkingMethod(law, method);
    checkBindings(method, bindings);
    check(id(workingId) && object(facts), 'A working needs an id and facts.');
    return {schema: WORKING_SCHEMA, id: workingId, law: law.ref, method: clone(method),
        bindings: Object.fromEntries(Object.entries(bindings).map(([role, {kind, id: ref}]) => [role, {kind, id: ref}])),
        startedAt: at, deadlines: workingDeadlines(law, method, at), cursor: 0, status: 'running',
        facts: clone(facts), receipts: []};
}

export function nextWorkingDeadline(record) {
    return record.status === 'running' ? record.deadlines[record.cursor] : null;
}

// KW5 and KW6. Settle every step whose deadline has passed, in order, each at
// its own deadline. One call to `now` and many calls up to `now` give the same
// record because no step reads the call time. Earlier steps stay settled when a
// later step is interrupted. The input record is not changed.
export function settleWorking(law, record, {now, ports = {}}) {
    check(record?.schema === WORKING_SCHEMA && record.law === law.ref, 'This working belongs to a different law.');
    check(natural(now), 'Settle at a whole minute.');
    const next = clone(record);
    const effects = [];
    while (next.status === 'running' && next.cursor < next.deadlines.length && next.deadlines[next.cursor] <= now) {
        const index = next.cursor;
        const at = next.deadlines[index];
        const op = next.method.steps[index].op;
        const result = settleStep({law, method: next.method, workingId: next.id, bindings: next.bindings,
            facts: next.facts, index, at, ports});
        if (!result.ok) {
            next.status = 'interrupted';
            next.receipts.push({step: index, op, at, ok: false, cause: result.cause, reason: result.reason,
                bindings: result.used, truth: {facts: {}, effects: []}, observed: result.observed ?? {}});
            break;
        }
        next.facts = {...next.facts, ...result.facts};
        next.receipts.push({step: index, op, at, ok: true, bindings: result.used,
            truth: {facts: result.facts, effects: result.effects}, observed: result.observed ?? {}});
        effects.push(...result.effects.map(effect => ({working: next.id, step: index, at, effect})));
        next.cursor = index + 1;
        if (next.cursor === next.deadlines.length) next.status = 'complete';
    }
    return {record: next, effects};
}

// KW8. The host stops a working (the maker walks away). Settled steps stay.
export function interruptWorking(record, {at, reason}) {
    check(record.status === 'running' && natural(at) && typeof reason === 'string' && reason.length, 'Only a running working can be stopped.');
    const next = clone(record);
    next.status = 'interrupted';
    next.receipts.push({step: next.cursor, op: next.method.steps[next.cursor].op, at, ok: false, cause: 'host',
        reason, bindings: {}, truth: {facts: {}, effects: []}, observed: {reason}});
    return next;
}

// KW9. What the maker can see: the observed field of each receipt, never truth.
// A failure shows only what its operation or port said was visible; the
// private reason stays in truth. A host's own stop is seen by the maker.
export function viewWorking(record) {
    return {id: record.id, status: record.status, startedAt: record.startedAt, next: nextWorkingDeadline(record),
        steps: record.receipts.map(({step, op, at, ok, observed}) => ({step, op, at, ok, observed: clone(observed)}))};
}

// KW10 and OS8. One versioned save record. Unknown versions are refused so an
// owner can keep the original save rather than guess.
export function validateWorkingRecord(law, record) {
    check(object(record) && record.schema === WORKING_SCHEMA, 'Unsupported working save version.');
    check(record.law === law.ref && id(record.id) && natural(record.startedAt), 'This working belongs to a different law.');
    validateWorkingMethod(law, record.method);
    checkBindings(record.method, record.bindings);
    const deadlines = workingDeadlines(law, record.method, record.startedAt);
    check(JSON.stringify(deadlines) === JSON.stringify(record.deadlines), 'The saved step times do not match the method.');
    check(natural(record.cursor) && record.cursor <= deadlines.length && Array.isArray(record.receipts) && object(record.facts),
        'The saved working position is invalid.');
    const settled = record.receipts.filter(row => row.ok).length;
    check(settled === record.cursor && ['running', 'complete', 'interrupted'].includes(record.status) &&
        (record.status === 'complete') === (record.cursor === deadlines.length),
    'The saved working receipts do not match its position.');
    return record;
}

export const serializeWorking = record => JSON.parse(JSON.stringify(record));

// One migration path. Each entry upgrades one older shape by one version.
// The first entry reads making_procedure's saved progress, the actor fact
// procedure.<command>.step (the count of finished steps; 0 when idle or done).
// Its effects were already published by the old owner, so migrated receipts
// carry no truth and are marked as migrated.
export const WORKING_MIGRATIONS = Object.freeze([
    {from: 'making.procedure-step@1', to: WORKING_SCHEMA, migrate(raw, {law, method, bindings, startedAt}) {
        check(natural(raw.completed) && raw.completed < method.steps.length, 'Only unfinished procedure progress can be migrated.');
        const record = beginWorking(law, method, {id: raw.commandId, bindings, facts: {}, at: startedAt});
        record.cursor = raw.completed;
        record.receipts = method.steps.slice(0, raw.completed).map(({op}, step) => ({step, op, at: record.deadlines[step],
            ok: true, migrated: true, bindings: {}, truth: {facts: {}, effects: []}, observed: {}}));
        return record;
    }},
]);

export function restoreWorking(law, raw, context = {}) {
    let record = raw;
    for (let guard = 0; record?.schema !== WORKING_SCHEMA && guard <= WORKING_MIGRATIONS.length; guard += 1) {
        const path = WORKING_MIGRATIONS.find(row => row.from === record?.schema);
        check(path, 'Unsupported working save version.');
        record = path.migrate(clone(record), {law, ...context});
    }
    return validateWorkingRecord(law, clone(record));
}
