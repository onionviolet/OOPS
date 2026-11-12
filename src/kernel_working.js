// Kernel working contract v0 (docs/KERNEL_WORKING_CONTRACT.md, KW1-KW14).
// A working is a reusable method of typed roles and ordered steps, bound to
// actual things for one attempt. The kernel quotes it, settles each step at its
// own deadline, keeps a receipt with the truth and what the maker observed in
// separate fields, and saves one versioned record. It names no domain and no
// world: operations, durations, readers and authority come from the caller.
// Not to be confused with working_state.js, which is the UI busy note.
import {check, natural, object} from './basics.js';

export const KERNEL_CONTRACT_VERSION = '0.5';
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
    // KW31 (PR2): a generated method keeps the grammar ref it was frozen under.
    check(method.grammar === undefined || (typeof method.grammar === 'string' && method.grammar.length > 0),
        'A method\'s grammar ref is a string.');
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
// Optional forecast fields an operation may add (KW15): costs it would draw,
// odds in permille, and a short cause the host turns into words.
function extras(op, outcome) {
    const out = {};
    if (outcome.costs !== undefined) {
        check(Array.isArray(outcome.costs) && outcome.costs.every(object), `Operation ${op} returned invalid costs.`);
        out.costs = clone(outcome.costs);
    }
    if (outcome.odds !== undefined) {
        check(natural(outcome.odds) && outcome.odds <= 1000, `Operation ${op} odds must be whole permille.`);
        out.odds = outcome.odds;
    }
    if (outcome.cause !== undefined) {
        check(typeof outcome.cause === 'string' && outcome.cause.length > 0, `Operation ${op} returned an invalid cause.`);
        out.cause = outcome.cause;
    }
    return out;
}

function withConsequence(own, effects, consequence) {
    if (!consequence) return {effects, extras: own};
    const merged = {...own};
    if (own.costs || consequence.extras.costs) merged.costs = [...(own.costs ?? []), ...(consequence.extras.costs ?? [])];
    if (consequence.extras.cause) merged.cause = consequence.extras.cause;
    if (consequence.extras.odds !== undefined) merged.odds = consequence.extras.odds;
    if (consequence.breach) merged.breach = consequence.breach;
    return {effects: [...effects, ...consequence.effects], extras: merged};
}

function settleStep({law, method, workingId, bindings, facts, index, at, ports, fingerprint}) {
    const step = method.steps[index];
    const operation = law.operations[step.op];
    const bound = {};
    const used = {};
    for (const [slot, role] of Object.entries(step.bindings ?? {})) {
        const ref = bindings[role];
        const thing = ports.read ? ports.read(ref, at) : ref;
        if (!object(thing) || thing.kind !== ref.kind || thing.id !== ref.id) {
            return {ok: false, reason: 'role-unavailable', role, cause: 'binding', used};
        }
        bound[slot] = clone(thing);
        used[slot] = ref.id;
    }
    // KW35. An authority that allows a step may attach consequences to it:
    // effects published after the operation's own, costs, a cause and a
    // breach mark (a binding vow broken by this step, LR13). One that refuses
    // may attach costs and a cause too.
    let consequence = null;
    if (ports.authority) {
        const answer = ports.authority({working: workingId, method: {id: method.id, revision: method.revision},
            step: index, op: step.op, at, bindings: clone(bindings), ...(fingerprint ? {fingerprint} : {})});
        check(object(answer) && typeof answer.ok === 'boolean', 'Authority must answer ok or not.');
        check(answer.effects === undefined || Array.isArray(answer.effects), 'Authority returned invalid effects.');
        check(answer.breach === undefined || object(answer.breach), 'Authority returned an invalid breach.');
        consequence = {extras: extras('authority', answer), effects: clone(answer.effects ?? []),
            ...(answer.breach ? {breach: clone(answer.breach)} : {})};
        if (!answer.ok) return {ok: false, reason: answer.reason || 'not-permitted', cause: 'authority', used,
            observed: clone(answer.observed), extras: {...consequence.extras, ...(consequence.breach ? {breach: consequence.breach} : {})}};
    }
    const outcome = operation.settle({bound, facts: clone(facts), options: clone(step.options ?? {}), at,
        address: `${workingId}/${index}`, step: index});
    check(object(outcome) && typeof outcome.ok === 'boolean', `Operation ${step.op} must answer ok or not.`);
    if (!outcome.ok) {
        check(typeof outcome.reason === 'string' && outcome.reason.length > 0, `Operation ${step.op} needs a reason.`);
        return {ok: false, reason: outcome.reason, cause: 'operation', used, observed: clone(outcome.observed),
            extras: extras(step.op, outcome)};
    }
    check(outcome.facts === undefined || object(outcome.facts), `Operation ${step.op} returned invalid facts.`);
    check(outcome.effects === undefined || Array.isArray(outcome.effects), `Operation ${step.op} returned invalid effects.`);
    return {ok: true, used, facts: clone(outcome.facts ?? {}),
        observed: clone(outcome.observed), ...withConsequence(extras(step.op, outcome), clone(outcome.effects ?? []), consequence)};
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
    const quote = {ok: done.status === 'complete', startsAt: at, endsAt: record.deadlines.at(-1),
        deadlines: [...record.deadlines], effects: effects.map(row => row.effect), facts: done.facts,
        costs: done.receipts.flatMap(row => row.truth.costs ?? []),
        odds: done.receipts.map(row => row.truth.odds ?? null),
        cause: done.receipts.map(row => row.truth.cause ?? null),
        ...(done.status === 'interrupted' ? {failedStep: last.step, reason: last.reason,
            ...(last.role ? {role: last.role} : {}), failure: last.cause} : {}),
        steps: done.receipts.map(({step, op, at: stepAt, ok, reason, cause, role}) => ({step, op, at: stepAt, ok,
            ...(ok ? {} : {cause, reason, ...(role ? {role} : {})})}))};
    quote.fingerprint = workingFingerprint({law: law.ref, method, bindings: record.bindings, facts, quote});
    return quote;
}

// KW16. A fingerprint names one quote: the law, method, bound references,
// starting facts, times, effects, costs and outcome. A host shows a quote,
// the maker commits to its fingerprint, and beginQuotedWorking re-quotes and
// refuses a changed one. The record keeps it and authority receives it at
// each step, so standing terms can be checked against what was quoted.
const canonical = value => Array.isArray(value) ? `[${value.map(canonical).join(',')}]`
    : object(value) ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`
        : JSON.stringify(value ?? null);
export function workingFingerprint({law, method, bindings, facts, quote}) {
    const text = canonical({law, method: {id: method.id, revision: method.revision, steps: method.steps, grammar: method.grammar ?? null}, bindings, facts,
        deadlines: quote.deadlines, effects: quote.effects, costs: quote.costs, odds: quote.odds, ok: quote.ok,
        failedStep: quote.failedStep ?? null});
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193) >>> 0;
    return `kw1:${hash.toString(16).padStart(8, '0')}:${text.length}`;
}

export function beginQuotedWorking(law, method, {id: workingId, bindings, facts = {}, at, ports = {}, fingerprint}) {
    const quote = quoteWorking(law, method, {id: workingId, bindings, facts, at, ports});
    if (quote.fingerprint !== fingerprint) return {stale: true, quote};
    return {stale: false, quote, record: beginWorking(law, method, {id: workingId, bindings, facts, at, fingerprint})};
}

// KW17. The quote an actor can make: every read and every authority answer
// comes from what that actor knows or believes, never from the truth. A role
// the actor knows nothing of is reported, not looked up. Reasons are data
// ({step, role, cause, reason}); the host or the operation supplies the words.
// The same knowledge gives the same quote to the player and to anyone else.
// knownFacts are the actor's beliefs about the starting facts, never the truth.
// knowsMethod(actor, method) answers whether the actor knows the method at all
// (spell_world_rules' knows, craft_state's readCraftWorking by observer).
export function quoteForActor(law, method, {id: workingId, actor, bindings, known, believedAuthority, knowsMethod, knownFacts = {}, at}) {
    check(id(actor) && typeof known === 'function', 'An actor quote needs an actor and what they know.');
    validateWorkingMethod(law, method);
    checkBindings(method, bindings);
    const blank = reasons => ({actor, eligible: false, reasons, startsAt: at, endsAt: null, minutes: null,
        effects: [], costs: [], odds: [], cause: [], fingerprint: null});
    if (knowsMethod && !knowsMethod(actor, {id: method.id, revision: method.revision})) {
        return blank([{step: null, role: null, cause: 'method-unknown', reason: 'method-unknown'}]);
    }
    const unknown = Object.entries(bindings).filter(([, ref]) => {
        const thing = known(ref, at);
        return !object(thing) || thing.kind !== ref.kind || thing.id !== ref.id;
    }).map(([role]) => ({step: null, role, cause: 'unknown', reason: 'role-unknown'}));
    if (unknown.length) return blank(unknown);
    const quote = quoteWorking(law, method, {id: workingId, bindings, facts: knownFacts, at,
        ports: {read: known, ...(believedAuthority ? {authority: believedAuthority} : {})}});
    const failed = quote.steps.find(row => !row.ok);
    return {actor, eligible: quote.ok, reasons: failed ? [{step: failed.step, role: failed.role ?? null, cause: failed.cause,
        reason: failed.reason}] : [], startsAt: at, endsAt: quote.endsAt, minutes: quote.endsAt - at,
    effects: quote.effects, costs: quote.costs, odds: quote.odds, cause: quote.cause, fingerprint: quote.fingerprint};
}

// KW7. Beginning keeps only references to bound things and the method snapshot.
export function beginWorking(law, method, {id: workingId, bindings, facts = {}, at, fingerprint}) {
    validateWorkingMethod(law, method);
    checkBindings(method, bindings);
    check(id(workingId) && object(facts), 'A working needs an id and facts.');
    check(fingerprint === undefined || typeof fingerprint === 'string', 'A fingerprint is a string.');
    return {schema: WORKING_SCHEMA, id: workingId, law: law.ref, method: clone(method),
        bindings: Object.fromEntries(Object.entries(bindings).map(([role, {kind, id: ref}]) => [role, {kind, id: ref}])),
        startedAt: at, deadlines: workingDeadlines(law, method, at), cursor: 0, status: 'running',
        facts: clone(facts), receipts: [], ...(fingerprint ? {fingerprint} : {})};
}

export function nextWorkingDeadline(record) {
    return record.status === 'running' ? record.deadlines[record.cursor] : null;
}

// KW5 and KW6. Settle every step whose deadline has passed, in order, each at
// its own deadline. One call to `now` and many calls up to `now` give the same
// record because no step reads the call time. Earlier steps stay settled when a
// later step is interrupted. The input record is not changed.
export function settleWorking(law, record, {now, ports = {}, maxSteps = Infinity}) {
    check(record?.schema === WORKING_SCHEMA && record.law === law.ref, 'This working belongs to a different law.');
    check(natural(now), 'Settle at a whole minute.');
    const next = clone(record);
    const effects = [];
    let settled = 0;
    while (settled < maxSteps && next.status === 'running' && next.cursor < next.deadlines.length && next.deadlines[next.cursor] <= now) {
        settled += 1;
        const index = next.cursor;
        const at = next.deadlines[index];
        const op = next.method.steps[index].op;
        const result = settleStep({law, method: next.method, workingId: next.id, bindings: next.bindings,
            facts: next.facts, index, at, ports, fingerprint: next.fingerprint});
        if (!result.ok) {
            next.status = 'interrupted';
            next.receipts.push({step: index, op, at, ok: false, cause: result.cause, reason: result.reason,
                ...(result.role ? {role: result.role} : {}), bindings: result.used,
                truth: {facts: {}, effects: [], ...(result.extras ?? {})}, observed: result.observed ?? {}});
            break;
        }
        next.facts = {...next.facts, ...result.facts};
        next.receipts.push({step: index, op, at, ok: true, bindings: result.used,
            truth: {facts: result.facts, effects: result.effects, ...result.extras}, observed: result.observed ?? {}});
        effects.push(...result.effects.map(effect => ({working: next.id, step: index, at, effect})));
        next.cursor = index + 1;
        if (next.cursor === next.deadlines.length) next.status = 'complete';
    }
    return {record: next, effects};
}

// KW8. The host stops a working (the maker walks away). Settled steps stay.
// With `by` ({working, step}), the stop came from another working's settled
// step (KW27): cause 'interrupt', and the maker sees only `observed`.
export function interruptWorking(record, {at, reason, by, observed}) {
    check(record.status === 'running' && natural(at) && typeof reason === 'string' && reason.length, 'Only a running working can be stopped.');
    check(by === undefined || (object(by) && id(by.working) && natural(by.step)), 'An interrupt names the working and step that caused it.');
    const next = clone(record);
    next.status = 'interrupted';
    next.receipts.push({step: next.cursor, op: next.method.steps[next.cursor].op, at, ok: false, cause: by ? 'interrupt' : 'host',
        reason, ...(by ? {by: clone(by)} : {}), bindings: {}, truth: {facts: {}, effects: []},
        observed: by ? clone(observed ?? {}) : {reason}});
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
    check(record.fingerprint === undefined || typeof record.fingerprint === 'string', 'The saved fingerprint is invalid.');
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
