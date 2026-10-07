// Pure proposals over the existing joined played clock. The host owns payment,
// support projection, simulation boundaries and atomic durable publication.
import {validateWorldInstance, validateWorldEndpoint, validateWorldVisit} from './world_instances.js';
import {validateRealmJson, realmNatural as natural, realmStableId as id} from './realm_boundary_rules.js';

export const REALM_CLOCK_LEASE_SCHEMA = 1;
const assert = (ok, message) => { if (!ok) throw Error(message); };
const clone = value => JSON.parse(JSON.stringify(value));
const fields = (value, keys, name) => {
    validateRealmJson(value);
    assert(value && typeof value === 'object' && !Array.isArray(value) &&
        Object.keys(value).every(key => keys.includes(key)), `Invalid ${name} fields.`);
};
const endpointEqual = (a, b) => ['worldId', 'instanceId', 'regionId', 'layerId'].every(key => a[key] === b[key]);
const leaseKeys = ['schema', 'id', 'revision', 'instanceId', 'endpoint', 'purpose', 'policyId', 'causeId',
    'issuerId', 'ownerId', 'sourceId', 'anchorId', 'contactId', 'clockAuthorized', 'openedAt', 'closedAt',
    'expiresAt', 'lastSupportedAt', 'status'];
const bindingKeys = ['policyId', 'causeId', 'issuerId', 'ownerId', 'sourceId', 'anchorId', 'contactId'];
const supportKeys = ['leaseId', 'leaseRevision', 'endpoint', ...bindingKeys, 'from', 'through',
    'sourceActive', 'anchorActive', 'contactActive', 'clockAuthorized'];

function validateLease(lease, instance, definition) {
    fields(lease, leaseKeys, 'realm clock lease');
    assert(lease.schema === REALM_CLOCK_LEASE_SCHEMA && id(lease.id) && natural(lease.revision) && lease.revision > 0 &&
        lease.instanceId === instance.id && bindingKeys.every(key => id(lease[key])) &&
        ['observation', 'work'].includes(lease.purpose) && lease.clockAuthorized === true, 'Unbound or unauthorized clock lease.');
    validateWorldEndpoint(lease.endpoint, instance, definition);
    assert(natural(lease.openedAt) && natural(lease.expiresAt) && lease.expiresAt > lease.openedAt &&
        natural(lease.lastSupportedAt) && lease.lastSupportedAt >= lease.openedAt &&
        lease.lastSupportedAt <= Math.min(instance.clock.observedAt, lease.expiresAt), 'Invalid lease support/expiry times.');
    assert(lease.openedAt <= instance.clock.observedAt &&
        (lease.status === 'active' && lease.closedAt === null && lease.expiresAt > instance.clock.observedAt ||
        lease.status === 'closed' && natural(lease.closedAt) && lease.closedAt >= lease.lastSupportedAt &&
        lease.closedAt <= Math.min(instance.clock.observedAt, lease.expiresAt)), 'Invalid lease closure/status.');
}

export function validateRealmClockLedger(ledger, instance, definition) {
    validateWorldInstance(instance, definition);
    fields(ledger, ['schema', 'instanceId', 'revision', 'sequence', 'leases'], 'realm clock ledger');
    assert(ledger.schema === REALM_CLOCK_LEASE_SCHEMA && ledger.instanceId === instance.id &&
        natural(ledger.revision) && ledger.revision > 0 && natural(ledger.sequence) &&
        Array.isArray(ledger.leases) && ledger.leases.length <= 128, 'Invalid clock ledger identity/guards.');
    const ids = new Set(), groups = new Map();
    for (const lease of ledger.leases) {
        validateLease(lease, instance, definition);
        assert(!ids.has(lease.id), 'Duplicate clock lease ID.'); ids.add(lease.id);
        // Repeated authorization of the same owner's contact/purpose must not
        // overlap, even when a caller supplies a different cause or lease ID.
        const key = JSON.stringify([lease.ownerId, lease.purpose, lease.contactId,
            lease.endpoint.worldId, lease.endpoint.instanceId, lease.endpoint.regionId, lease.endpoint.layerId]);
        const intervals = groups.get(key) ?? [];
        intervals.push([lease.openedAt, lease.closedAt ?? lease.expiresAt]); groups.set(key, intervals);
    }
    for (const intervals of groups.values()) {
        intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        let through = 0;
        for (const [start, end] of intervals) {
            assert(start >= through, 'Overlapping duplicate contact leases.'); through = end;
        }
    }
    return true;
}

// Explicit host enrollment only. Missing old-save namespace stays absent until
// selected by root; constructing this empty record grants no activity/history.
export function createRealmClockLedger(instance, definition, sequence) {
    const ledger = {schema: REALM_CLOCK_LEASE_SCHEMA, instanceId: instance.id, revision: 1, sequence, leases: []};
    validateRealmClockLedger(ledger, instance, definition);
    return ledger;
}

const expected = (instance, ledger, context) => ({instanceId: instance.id, instanceRevision: instance.revision,
    observedAt: instance.clock.observedAt, leaseRevision: ledger.revision, sequence: context.sequence});
const deny = (instance, ledger, context, reason, extra = {}) => ({allowed: false, reasons: [reason],
    expected: expected(instance, ledger, context), nextInstance: null, nextLeases: null, ...extra});

function prepare(instance, ledger, request, definition, context, extraKeys) {
    validateRealmClockLedger(ledger, instance, definition);
    fields(request, ['expectedRevision', 'expectedLeaseRevision', 'expectedSequence', 'playedAt', ...extraKeys], 'clock request');
    fields(context, ['sequence', 'policyIds', 'supports', 'pendingBoundaryAt'], 'clock host context');
    assert(natural(context.sequence) && Array.isArray(context.policyIds) && context.policyIds.every(id) &&
        new Set(context.policyIds).size === context.policyIds.length && Array.isArray(context.supports) &&
        context.supports.length <= 128 && (context.pendingBoundaryAt === null ||
        natural(context.pendingBoundaryAt) && context.pendingBoundaryAt >= instance.clock.observedAt), 'Invalid clock host guards/boundary.');
    assert(['expectedRevision', 'expectedLeaseRevision', 'expectedSequence', 'playedAt'].every(key => natural(request[key])),
        'Clock requests need explicit revision, sequence and played-minute guards.');
    if (request.expectedRevision !== instance.revision || request.expectedLeaseRevision !== ledger.revision ||
        request.expectedSequence !== context.sequence || context.sequence < ledger.sequence)
        return deny(instance, ledger, context, 'This realm activity request is stale.');
    if (request.playedAt < instance.clock.observedAt)
        return deny(instance, ledger, context, 'Joined played time cannot move backward.');
    return null;
}

function supportIndex(context) {
    const result = new Map();
    for (const support of context.supports) {
        fields(support, supportKeys, 'clock support');
        assert(id(support.leaseId) && natural(support.leaseRevision) && support.leaseRevision > 0 &&
            bindingKeys.every(key => id(support[key])) && natural(support.from) && natural(support.through) &&
            support.through >= support.from && ['sourceActive', 'anchorActive', 'contactActive', 'clockAuthorized']
                .every(key => typeof support[key] === 'boolean'), 'Invalid live clock support.');
        validateWorldEndpoint(support.endpoint);
        assert(!result.has(support.leaseId), 'Duplicate or overlapping support slices for one lease.');
        result.set(support.leaseId, support);
    }
    return result;
}

function matches(lease, support) {
    return support && support.leaseId === lease.id && support.leaseRevision === lease.revision &&
        bindingKeys.every(key => support[key] === lease[key]) && endpointEqual(support.endpoint, lease.endpoint);
}
const live = support => support.sourceActive && support.anchorActive && support.contactActive && support.clockAuthorized;
const admitted = (lease, support, context) => matches(lease, support) && live(support) && context.policyIds.includes(lease.policyId);

function proposal(instance, ledger, context, nextInstance, nextLeases, extra = {}) {
    validateRealmClockLedger(nextLeases, nextInstance, context.definition);
    return {allowed: true, reasons: [], expected: expected(instance, ledger, context), nextInstance, nextLeases, ...extra};
}

export function planRealmClockLeaseOpen(instance, ledger, request, definition, context) {
    const rejected = prepare(instance, ledger, request, definition, context, ['lease']); if (rejected) return rejected;
    if (request.playedAt !== instance.clock.observedAt)
        return deny(instance, ledger, context, 'Reconcile the realm clock before opening a lease.');
    fields(request.lease, ['id', 'endpoint', 'purpose', ...bindingKeys, 'expiresAt'], 'clock lease seed');
    const lease = {...clone(request.lease), schema: REALM_CLOCK_LEASE_SCHEMA, revision: 1, instanceId: instance.id,
        clockAuthorized: true, openedAt: request.playedAt, closedAt: null, lastSupportedAt: request.playedAt, status: 'active'};
    validateLease(lease, instance, definition);
    const supports = supportIndex(context), support = supports.get(lease.id);
    if (ledger.leases.some(entry => entry.id === lease.id) || !admitted(lease, support, context) ||
        support.from !== request.playedAt || support.through !== request.playedAt || supports.size !== 1)
        return deny(instance, ledger, context, 'Opening needs a unique lease and exact authorized live support now.');
    const next = clone(ledger); next.leases.push(lease); next.revision++; next.sequence = context.sequence;
    return proposal(instance, ledger, {...context, definition}, clone(instance), next, {leaseId: lease.id});
}

export function planRealmClockLeaseClose(instance, ledger, request, definition, context) {
    const rejected = prepare(instance, ledger, request, definition, context, ['leaseId', 'leaseRevision']); if (rejected) return rejected;
    assert(id(request.leaseId) && natural(request.leaseRevision), 'Invalid lease closure guard.');
    const lease = ledger.leases.find(entry => entry.id === request.leaseId);
    if (!lease || lease.revision !== request.leaseRevision || lease.status !== 'active')
        return deny(instance, ledger, context, 'This lease closure is stale or already closed.');
    if (request.playedAt !== instance.clock.observedAt)
        return deny(instance, ledger, context, 'Reconcile supported time before closing a lease.');
    const next = clone(ledger), closing = next.leases.find(entry => entry.id === lease.id);
    closing.status = 'closed'; closing.closedAt = request.playedAt; closing.revision++;
    next.revision++; next.sequence = context.sequence;
    return proposal(instance, ledger, {...context, definition}, clone(instance), next, {leaseId: lease.id});
}

function visitIntervals(visits, instance, definition, playedAt) {
    assert(Array.isArray(visits), 'Clock planning needs the actual body visit ledger.');
    const seen = new Set(), actors = new Map(), intervals = [];
    // Allow already-recorded departures within this reconciliation interval.
    const horizon = clone(instance); horizon.clock.observedAt = playedAt;
    for (const visit of visits) {
        fields(visit, ['schema', 'id', 'revision', 'actorId', 'instanceId', 'endpoint', 'enteredAt', 'exitedAt', 'status'], 'clock body visit');
        assert(visit.schema === 1 && id(visit.id) && !seen.has(visit.id) && id(visit.actorId) && id(visit.instanceId) &&
            natural(visit.revision) && visit.revision > 0 && natural(visit.enteredAt) && visit.enteredAt <= playedAt &&
            (visit.status === 'active' && visit.exitedAt === null || visit.status === 'ended' && natural(visit.exitedAt) &&
            visit.exitedAt >= visit.enteredAt && visit.exitedAt <= playedAt), 'Malformed/duplicate body visit.');
        seen.add(visit.id); validateWorldEndpoint(visit.endpoint);
        assert(visit.endpoint.instanceId === visit.instanceId, 'Body visit endpoint differs from its instance.');
        const history = actors.get(visit.actorId) ?? [];
        history.push([visit.enteredAt, visit.exitedAt ?? Infinity]); actors.set(visit.actorId, history);
        if (visit.instanceId !== instance.id) continue;
        validateWorldVisit(visit, horizon, definition);
        const start = Math.max(instance.clock.observedAt, visit.enteredAt), end = Math.min(playedAt, visit.exitedAt ?? playedAt);
        if (end > start) intervals.push([start, end]);
    }
    for (const history of actors.values()) {
        history.sort((a, b) => a[0] - b[0] || a[1] - b[1]); let through = 0;
        for (const [start, end] of history) { assert(start >= through, 'One body has overlapping visits.'); through = end; }
    }
    return intervals;
}

export function planRealmActivityClock(instance, ledger, request, definition, context) {
    const rejected = prepare(instance, ledger, request, definition, context, ['visits']); if (rejected) return rejected;
    const from = instance.clock.observedAt, to = request.playedAt;
    const boundaries = ledger.leases.filter(lease => lease.status === 'active').map(lease => lease.expiresAt);
    if (context.pendingBoundaryAt !== null) boundaries.push(context.pendingBoundaryAt);
    const boundary = boundaries.length ? Math.min(...boundaries) : null;
    if (boundary !== null && to > boundary)
        return deny(instance, ledger, context, 'Reconcile the next simulation/lease boundary before advancing further.', {nextBoundaryAt: boundary});
    const intervals = visitIntervals(request.visits, instance, definition, to), supports = supportIndex(context);
    const next = clone(ledger);
    for (const [leaseId, support] of supports) {
        const lease = ledger.leases.find(entry => entry.id === leaseId);
        if (!lease || lease.status !== 'active' || !admitted(lease, support, context) ||
            support.from < from || support.from < lease.openedAt || support.through !== to || support.through > lease.expiresAt)
            return deny(instance, ledger, context, 'This activity interval lacks exact current authorized support.');
        if (support.through > support.from) intervals.push([support.from, support.through]);
        const updated = next.leases.find(entry => entry.id === leaseId);
        if (updated.lastSupportedAt !== to) { updated.lastSupportedAt = to; updated.revision++; }
    }
    for (const lease of next.leases) if (lease.status === 'active' && to === lease.expiresAt) {
        lease.status = 'closed'; lease.closedAt = to; lease.revision++;
    }
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let advancedBy = 0, through = from;
    for (const [start, end] of intervals) { advancedBy += Math.max(0, end - Math.max(start, through)); through = Math.max(through, end); }
    const nextInstance = clone(instance);
    nextInstance.clock.elapsed += advancedBy; nextInstance.clock.observedAt = to;
    if (to !== from) nextInstance.revision++;
    if (to !== from || context.sequence !== ledger.sequence || JSON.stringify(next.leases) !== JSON.stringify(ledger.leases)) next.revision++;
    next.sequence = context.sequence;
    return proposal(instance, ledger, {...context, definition}, nextInstance, next, {advancedBy, absentBy: to - from - advancedBy});
}

// This only activates local scheduling. It grants no remote actor a legal body,
// source, stock, target, cost exemption, knowledge or contact capability.
export function realmClockActivation(instance, ledger, definition, context) {
    validateRealmClockLedger(ledger, instance, definition);
    fields(context, ['sequence', 'policyIds', 'supports', 'pendingBoundaryAt'], 'clock activation context');
    assert(natural(context.sequence) && context.sequence >= ledger.sequence && Array.isArray(context.policyIds) &&
        context.policyIds.every(id), 'Invalid activation sequence/policies.');
    const supports = supportIndex(context);
    const leaseIds = ledger.leases.filter(lease => {
        const support = supports.get(lease.id);
        return lease.status === 'active' && lease.expiresAt > instance.clock.observedAt && admitted(lease, support, context) &&
            support.from === instance.clock.observedAt && support.through === instance.clock.observedAt;
    }).map(lease => lease.id);
    return {instanceId: instance.id, observedAt: instance.clock.observedAt, sequence: context.sequence,
        supportedActivity: leaseIds.length > 0, leaseIds};
}
