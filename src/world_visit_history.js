// Compact only reconciled ended visits in an already detached command plan.
// Existing instance clocks own elapsed time; no new save field or counter is added.

import {check as assert, natural} from './basics.js';
function referencedVisits(state, visits) {
    const ids = new Set(visits.map(visit => visit.id)), retained = new Set(), seen = new Set(), pending = [state];
    while (pending.length) {
        const value = pending.pop();
        if (typeof value === 'string') { if (ids.has(value)) retained.add(value); continue; }
        if (!value || typeof value !== 'object' || value === visits || seen.has(value)) continue;
        seen.add(value);
        for (const [key, child] of Object.entries(value)) {
            if (ids.has(key)) retained.add(key);
            pending.push(child);
        }
    }
    return retained;
}

export function compactEndedWorldVisits(state, ownerKey, {capacity, additional = 1, synchronize, validate}) {
    assert(natural(capacity) && capacity > 0 && natural(additional) && additional <= capacity,
        'Invalid retained visit capacity request.');
    // Validate every original row before pruning, including corrupt rows that
    // would otherwise disappear. Reconcile all instances with the full ledger.
    validate(state);
    synchronize(state);
    validate(state);
    const owner = state[ownerKey];
    assert(owner && owner.instances.every(instance => instance.clock.observedAt === state.clock),
        'Reconcile every retained instance clock before compacting visits.');
    if (owner.visits.length + additional <= capacity) return state;

    const keep = referencedVisits(state, owner.visits), groups = new Map();
    owner.visits.forEach((visit, index) => {
        if (visit.status === 'active' || owner.mission && visit.exitedAt >= owner.mission.acceptedAt) keep.add(visit.id);
        if (visit.status !== 'ended') return;
        const key = JSON.stringify([visit.instanceId, visit.actorId]), rows = groups.get(key) || [];
        rows.push({visit, index}); groups.set(key, rows);
    });
    for (const rows of groups.values()) {
        rows.sort((a, b) => a.visit.enteredAt - b.visit.enteredAt || a.index - b.index);
        // Keep actual unchanged rows: first arrival/earlier revisit and latest
        // return remain readable by existing per-instance history consumers.
        for (const row of [rows[0], rows[1], rows.at(-1)]) if (row) keep.add(row.visit.id);
    }
    const limit = capacity - additional;
    assert(keep.size <= limit, 'Live visit references and retained return history leave no safe passage room.');
    const recent = owner.visits.map((visit, index) => ({visit, index}))
        .filter(row => !keep.has(row.visit.id))
        .sort((a, b) => b.visit.enteredAt - a.visit.enteredAt || b.index - a.index);
    for (const {visit} of recent) {
        if (keep.size === limit) break;
        keep.add(visit.id);
    }
    owner.visits = owner.visits.filter(visit => keep.has(visit.id));
    validate(state);
    return state;
}

// Quotes use the same policy on a detached copy and never synchronize or prune
// the live state. A later failed publisher still leaves that live state intact.
export function previewWorldVisitRoom(state, ownerKey, options) {
    try {
        compactEndedWorldVisits(structuredClone(state), ownerKey, options);
        return {allowed: true, reasons: []};
    } catch (error) {
        return {allowed: false, reasons: [error.message]};
    }
}
