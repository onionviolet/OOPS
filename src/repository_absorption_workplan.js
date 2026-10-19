// Original finite projections over YAIR's command/job/stock owners. Pattern
// provenance: RB-PRO-01, RB-LIV-03 and RB-CAM-02. No upstream code is copied.
import {deepFreeze as freeze, positive} from './basics.js';
import {assert, natural, stableId, copy, jsonData} from './simulation_contracts.js';
import {previewSimulationCommand} from './simulation.js';
import {inventory, participant} from './simulation_effects.js';
import {validateItemKey} from './gameplay_transactions.js';

export const REPOSITORY_WORKPLAN_LIMITS = Object.freeze({steps: 16, starts: 10000});
const commandsOf = registry => registry?.simulation?.commands;
const unique = values => [...new Set(values)];
const targetNeeded = d => d.targetId || d.targetDefinitionId || d.participants?.includes('$target') ||
    [...(d.costs || []), ...(d.effects || []), ...(d.outcomes || []).flatMap(o => o.effects || [])]
        .some(e => ['actor', 'target', 'from', 'to'].some(k => e[k] === '$target'));
const itineraryIdentity = d => JSON.stringify([d.id, d.revision, d.actorId,
    d.steps.map(s => [s.id, s.commandId, s.commandRevision, s.targetId, s.count])]);
const stockIdentity = d => JSON.stringify([d.id, d.revision, d.actorId, d.ownerId, d.targetId,
    d.commandId, d.commandRevision, d.key, d.lower, d.upper, d.batchSize, d.maxStarts]);
function header(d) {
    assert(d && stableId(d.id) && positive(d.revision) && typeof d.label === 'string' &&
        stableId(d.actorId), 'A work projection needs a stable identity, revision, label and actor.');
}
function commandBinding(d, commandId, commandRevision, targetId, registry) {
    const command = commandsOf(registry)?.get(commandId);
    assert(command, `Unknown work command ${commandId}.`);
    assert(!command.actorId || command.actorId === d.actorId, 'The work command belongs to another actor.');
    assert(commandRevision == null || commandRevision === command.revision, 'The work command revision changed.');
    assert(targetId == null || stableId(targetId), 'Invalid work participant.');
    assert(!command.targetId || command.targetId === targetId, 'The work command requires its declared participant.');
    assert(!targetNeeded(command) || targetId, 'Bind the work command to an explicit participant.');
    return command;
}
function supported(definition, commandId, commandRevision, registry) {
    const d = commandsOf(registry)?.get(commandId);
    if(!d || d.revision !== commandRevision) return null;
    if(d.actorId && d.actorId !== definition.actorId) return null;
    return d;
}
function actorReasons(state, definition, context, expectedSequence) {
    const reasons = [];
    if(state.sequence !== expectedSequence) reasons.push('This work preview is stale.');
    if(!state.simulation?.people[definition.actorId] || !state.actors[definition.actorId]) reasons.push('This worker is not enrolled.');
    if(context.actorId !== definition.actorId) reasons.push('This plan belongs to another actor.');
    return reasons;
}
function targetReasons(state, targetId, context) {
    if(targetId == null) return [];
    if(context.targetId !== targetId) return ['Choose the declared work participant.'];
    if(!state.simulation?.people[targetId] || !state.actors[targetId]) return ['That work participant is unavailable.'];
    return [];
}
function safeQuote(state, registry, commandId, targetId, context) {
    try {return previewSimulationCommand(state, registry, commandId, {...context, targetId});}
    catch(error) {return {visible: false, eligible: false, reasons: [error.message], costs: [], duration: null};}
}
function completed(state, actorId, commandId) {
    const count = state.actors[actorId]?.completed?.[commandId] ?? 0;
    assert(natural(count), 'Invalid existing work completion count.'); return count;
}
function matchingJobs(state, actorId, commandId, revision, targetId) {
    return (state.simulation?.jobs || []).filter(j => j.actorId === actorId && j.commandId === commandId &&
        j.revision === revision && (j.targetId || null) === targetId);
}
function request(definition, step, sequence) {
    return {id: step.commandId, sequence, actorId: definition.actorId, targetId: step.targetId,
        commandRevision: step.commandRevision, projectionId: definition.id,
        projectionRevision: definition.revision, projectionIdentity: definition.identity, stepId: step.id};
}
function validateItinerary(d) {
    header(d);
    assert(d.schema === 1 && Array.isArray(d.steps) && d.steps.length > 0 &&
        d.steps.length <= REPOSITORY_WORKPLAN_LIMITS.steps, 'Unsupported work itinerary.');
    assert(d.steps.every(s => stableId(s.id) && stableId(s.commandId) && positive(s.commandRevision) &&
        (s.targetId === null || stableId(s.targetId)) && positive(s.count)) &&
        unique(d.steps.map(s => s.id)).length === d.steps.length &&
        unique(d.steps.map(s => s.commandId)).length === d.steps.length &&
        d.steps.reduce((n,s) => n + s.count, 0) <= REPOSITORY_WORKPLAN_LIMITS.starts &&
        d.identity === itineraryIdentity(d), 'The itinerary identity, order or finite target changed.');
}
function validateStockBand(d) {
    header(d); validateItemKey(d.key);
    assert(d.schema === 1 && stableId(d.ownerId) && stableId(d.commandId) && positive(d.commandRevision) &&
        (d.targetId === null || stableId(d.targetId)) && natural(d.lower) && positive(d.upper) && d.lower < d.upper &&
        positive(d.batchSize) && positive(d.maxStarts) && d.maxStarts <= REPOSITORY_WORKPLAN_LIMITS.starts &&
        d.identity === stockIdentity(d), 'The stock policy identity or finite target changed.');
}

/** A completion-target itinerary, not a saved mixed queue or an editable cursor.
 * Each distinct command has an absolute finite completion target. Existing
 * completions count; they do not establish the order of historical work. */
export function defineRepositoryWorkItinerary(definition, registry) {
    header(definition);
    assert(Array.isArray(definition.steps) && definition.steps.length > 0 &&
        definition.steps.length <= REPOSITORY_WORKPLAN_LIMITS.steps, 'Invalid finite work itinerary.');
    const steps = definition.steps.map(step => {
        assert(stableId(step.id) && stableId(step.commandId), 'A work step needs stable step and command IDs.');
        const count = step.count ?? 1;
        assert(positive(count) && count <= REPOSITORY_WORKPLAN_LIMITS.starts, 'Invalid bounded work target.');
        const command = commandsOf(registry)?.get(step.commandId);
        const targetId = step.targetId ?? definition.targetId ?? command?.targetId ?? null;
        const bound = commandBinding(definition, step.commandId, step.commandRevision, targetId, registry);
        assert(count === 1 || !bound.once, 'A one-time command cannot be a repeated work step.');
        return {id: step.id, commandId: bound.id, commandRevision: bound.revision, targetId, count};
    });
    assert(unique(steps.map(s => s.id)).length === steps.length &&
        unique(steps.map(s => s.commandId)).length === steps.length, 'Work steps must have distinct IDs and commands.');
    assert(steps.reduce((n,s) => n + s.count, 0) <= REPOSITORY_WORKPLAN_LIMITS.starts, 'The itinerary exceeds its finite work bound.');
    const out = {schema: 1, id: definition.id, revision: definition.revision, label: definition.label,
        actorId: definition.actorId, steps};
    out.identity = itineraryIdentity(out);
    jsonData(out); return freeze(out);
}

/** Read-only next-step selection. Costs of later steps remain declarations,
 * never a claim that all future steps are affordable or already reserved. */
export function previewRepositoryWorkItinerary(state, registry, definition, context, expectedSequence = state.sequence) {
    validateItinerary(definition);
    const reasons = actorReasons(state, definition, context, expectedSequence);
    const rows = definition.steps.map(step => {
        const d = supported(definition, step.commandId, step.commandRevision, registry);
        const done = Math.min(step.count, completed(state, definition.actorId, step.commandId));
        const jobs = matchingJobs(state, definition.actorId, step.commandId, step.commandRevision, step.targetId);
        return {...copy(step), label: d?.label || step.commandId, completed: done, remaining: step.count - done,
            status: done >= step.count ? 'complete' : 'later', supported: !!d,
            duration: d?.duration ?? null, declaredCosts: copy(d?.costs || []), costs: null,
            quoteKind: 'declaration', jobs: jobs.map(j => ({id: j.id, due: j.due,
                remainingMinutes: Math.max(0, j.due - state.clock), costs: copy(j.costs)}))};
    });
    const next = rows.find(row => row.remaining > 0) || null;
    let status = next ? 'paused' : 'complete', quote = null;
    if(next) {
        reasons.push(...targetReasons(state, next.targetId, context));
        if(!next.supported) reasons.push('The next work command or its pinned revision is unavailable.');
        if(!reasons.length && next.jobs.length) {
            status = 'working'; next.status = 'working'; next.quoteKind = 'frozen-job';
            next.costs = copy(next.jobs[0].costs);
            reasons.push('The next step already has reserved work. Wait for its settlement.');
        } else if(!reasons.length) {
            quote = safeQuote(state, registry, next.commandId, next.targetId, context);
            reasons.push(...quote.reasons);
            status = quote.eligible ? 'ready' : 'paused'; next.status = status;
            next.costs = quote.eligible ? copy(quote.costs) : null; next.quoteKind = quote.eligible ? 'live-next-step' : 'unavailable';
        }
        next.status = status;
    }
    if(reasons.length && status !== 'working') status = 'paused';
    const durationKnown = rows.every(row => row.remaining === 0 || row.duration != null);
    const durationTotal = durationKnown ? rows.reduce((total,row) => {
        const active = Math.min(row.remaining, row.jobs.length);
        return total + row.duration * (row.remaining - active) +
            row.jobs.slice(0, active).reduce((n,j) => n + j.remainingMinutes, 0);
    }, 0) : null;
    const workMinutes = natural(durationTotal) ? durationTotal : null;
    return {id: definition.id, revision: definition.revision, identity: definition.identity, label: definition.label,
        sequence: state.sequence, actorId: definition.actorId, status, eligible: status === 'ready', reasons: unique(reasons),
        rows, next, quote, remainingCount: rows.reduce((n,row) => n + row.remaining, 0),
        workMinutes, durationKind: 'conditional-work-only',
        durationNote: 'Known work time only; travel, waiting, interruptions and changed eligibility are not included.',
        reservation: 'next-step-only', request: status === 'ready' ? request(definition, next, state.sequence) : null};
}

/** Restrict stock policies to a known deterministic item output of one existing
 * finite job. Conditional recipe outputs require a separate qualified adapter. */
export function defineRepositoryStockBand(definition, registry) {
    header(definition); validateItemKey(definition.key);
    assert(natural(definition.lower) && positive(definition.upper) && definition.lower < definition.upper &&
        positive(definition.batchSize) && positive(definition.maxStarts) && definition.maxStarts <= REPOSITORY_WORKPLAN_LIMITS.starts,
        'Invalid finite stock band.');
    const targetId = definition.targetId ?? commandsOf(registry)?.get(definition.commandId)?.targetId ?? null;
    const d = commandBinding(definition, definition.commandId, definition.commandRevision, targetId, registry);
    assert(d.duration > 0 && !d.once && !d.claim && !d.encounterId,
        'Stock maintenance needs an existing repeatable deterministic job.');
    const ownerId = definition.ownerId ?? definition.actorId;
    assert(stableId(ownerId), 'Invalid stock owner.');
    const context = {actorId: definition.actorId, targetId};
    const output = (d.effects || []).filter(e => e.type === 'item' && e.key === definition.key && participant(e.actor, context) === ownerId);
    assert(output.length > 0 && output.every(e => positive(e.amount)) &&
        output.reduce((n,e) => n + e.amount, 0) === definition.batchSize, 'The stock batch must match the declared item output.');
    const changesStock = e => e.key === definition.key &&
        (e.type === 'item' && participant(e.actor, context) === ownerId ||
        ['transfer', 'custody'].includes(e.type) && [participant(e.from, context), participant(e.to, context)].includes(ownerId));
    assert(!(d.costs || []).some(changesStock) &&
        !(d.effects || []).some(e => changesStock(e) && !output.includes(e)) &&
        !(d.outcomes || []).some(o => (o.effects || []).some(changesStock)), 'The producer has an unsupported variable or competing stock effect.');
    const out = {schema: 1, id: definition.id, revision: definition.revision, label: definition.label,
        actorId: definition.actorId, ownerId, targetId, commandId: d.id, commandRevision: d.revision,
        key: definition.key, lower: definition.lower, upper: definition.upper,
        batchSize: definition.batchSize, maxStarts: definition.maxStarts};
    out.identity = stockIdentity(out);
    jsonData(out); return freeze(out);
}

/** Hysteresis latch is an explicit caller input, never an implicit save or timer.
 * A fresh idle latch starts below lower; refilling continues until upper. Every
 * decision offers at most ONE newly quoted job and counts existing paid work. */
export function previewRepositoryStockBand(state, registry, definition, context, control = null, expectedSequence = state.sequence) {
    validateStockBand(definition);
    assert(control == null || control.identity === definition.identity && ['idle', 'refilling'].includes(control.phase) &&
        typeof control.enabled === 'boolean', 'The stock-policy continuation is stale or invalid.');
    const enabled = control?.enabled ?? true, previousPhase = control?.phase ?? 'idle';
    const reasons = actorReasons(state, definition, context, expectedSequence);
    reasons.push(...targetReasons(state, definition.targetId, context));
    const d = supported(definition, definition.commandId, definition.commandRevision, registry);
    if(!d) reasons.push('The stock producer or its pinned revision is unavailable.');
    let stock = null;
    try {
        const owned = inventory({state, gameplay: context.gameplay || {}}, definition.ownerId);
        stock = owned[definition.key] ?? 0;
        assert(natural(stock), 'The stock owner has no exact item-count binding.');
    } catch(error) {reasons.push(error.message);}
    const jobs = matchingJobs(state, definition.actorId, definition.commandId, definition.commandRevision, definition.targetId);
    const done = completed(state, definition.actorId, definition.commandId);
    const remainingStarts = Math.max(0, definition.maxStarts - done - jobs.length);
    const phase = !enabled || stock != null && stock >= definition.upper ? 'idle' :
        stock != null && stock < definition.lower ? 'refilling' : previousPhase;
    let status = 'paused', quote = null, nextRequest = null;
    if(!enabled) status = 'disabled';
    else if(!reasons.length && jobs.length) status = 'working';
    else if(!reasons.length && !remainingStarts) status = 'exhausted';
    else if(!reasons.length && phase === 'idle') status = 'idle';
    else if(!reasons.length && stock + definition.batchSize > definition.upper) {
        reasons.push('The next whole batch would exceed the upper stock target.');
    } else if(!reasons.length) {
        quote = safeQuote(state, registry, definition.commandId, definition.targetId, context);
        reasons.push(...quote.reasons); status = quote.eligible ? 'ready' : 'paused';
        if(quote.eligible) nextRequest = {...request(definition, {id: definition.id, ...definition}, state.sequence), count: 1};
    }
    const committedOutput = jobs.reduce((n,j) => n + (j.effects || []).filter(e => e.type === 'item' &&
        e.key === definition.key && participant(e.actor, j.context) === definition.ownerId)
        .reduce((sum,e) => sum + e.amount, 0), 0);
    return {id: definition.id, revision: definition.revision, identity: definition.identity, label: definition.label,
        sequence: state.sequence, actorId: definition.actorId, ownerId: definition.ownerId,
        stock, lower: definition.lower, upper: definition.upper, batchSize: definition.batchSize,
        previousPhase, phase, status, eligible: status === 'ready', reasons: unique(reasons),
        completedStarts: done, remainingStarts, committedOutput,
        stockAfterCommittedWork: stock == null ? null : stock + committedOutput,
        committedOutputKind: 'conditional-on-successful-settlement',
        maxStartsByBand: stock == null ? 0 : Math.min(remainingStarts, Math.max(0, Math.floor((definition.upper - stock) / definition.batchSize))),
        jobs: jobs.map(j => ({id: j.id, due: j.due, remainingMinutes: Math.max(0, j.due - state.clock), costs: copy(j.costs)})),
        quote, duration: quote?.duration ?? d?.duration ?? null,
        costs: quote?.eligible ? copy(quote.costs) : null, declaredCosts: copy(d?.costs || []),
        continuation: {identity: definition.identity, phase, enabled},
        reservation: 'one-next-job-only', request: nextRequest};
}
