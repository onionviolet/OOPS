// Internal authoritative reads, not an observer's knowledge or a disclosure grant.
// No store merge: simulation edges are directed; chronicle rows belong to a life
// and describe its counterpart, without proving either person's private opinion.
import {check, finite, object} from './basics.js';
import {bondStatuses} from './npc_lives.js';
const key = value => typeof value === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value);
const own = (record, id) => record && Object.hasOwn(record, id) ? record[id] : undefined;

export const RELATIONSHIP_READ_RULES = Object.freeze({
    simulation: Object.freeze({min: -Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER,
        writerClamps: false, direction: 'viewer-to-target'}),
    chronicle: Object.freeze({min: -100, max: 100,
        writerClamps: true, direction: 'life-counterpart'}),
    memoryLimitPerSource: 32,
});

function axesView(axes, source) {
    check(object(axes), `Invalid ${source} relationship axes.`);
    const {min, max} = RELATIONSHIP_READ_RULES[source];
    for (const [id, value] of Object.entries(axes)) {
        check(key(id) && finite(value) && value >= min && value <= max,
            `Invalid ${source} relationship axis.`);
    }
    // Readers never clamp or repair saves. Simulation values above 100 remain
    // intact; chronicle writers already clamp and its validator rejects excess.
    return {...axes};
}

function tiesView(ties) {
    check(object(ties), 'Invalid chronicle relationship ties.');
    for (const [id, value] of Object.entries(ties)) {
        check(key(id) && (typeof value === 'boolean' || typeof value === 'string' || finite(value)),
            'Invalid chronicle relationship tie.');
    }
    return {...ties};
}

function memoriesView(memories, source) {
    check(Array.isArray(memories) && memories.length <= RELATIONSHIP_READ_RULES.memoryLimitPerSource,
        `Invalid ${source} relationship memories.`);
    return memories.map((memory, index) => {
        // Keep receipts local to their source. Equal ids across stores, or two
        // memories sharing a simulation cause, are not duplicate evidence.
        check(object(memory), `Invalid ${source} relationship memory.`);
        const id = source === 'simulation' ? memory.cause : memory.id;
        check(key(id) && Number.isSafeInteger(memory.at) && memory.at >= 0 && typeof memory.text === 'string',
            `Invalid ${source} relationship memory.`);
        return {source, index, id, at: memory.at, text: memory.text};
    });
}

/**
 * Detached snapshot for one actor. Pass the expansion state, not a native save
 * envelope. Missing owners mean absent records, not neutral scores.
 * chronicleOwnerId defaults to the current player life; an adapter may bind a
 * different actual life id explicitly. It must never map by display name.
 * Shape: {viewerId, scope, relationships: {[target]: {viewerId, targetId,
 * sources, axes: {simulation, chronicle}, ties: {chronicle}, memories}}}.
 * Axes/ties keep source names and semantics. Memories are oldest first, then
 * simulation before chronicle on equal times, retaining each source's order.
 */
export function relationshipView(state, viewerId = 'player', {chronicleOwnerId = 'player'} = {}) {
    check(object(state) && key(viewerId) && key(chronicleOwnerId), 'Invalid relationship viewer.');
    check(state.simulation == null || object(state.simulation), 'Invalid simulation owner.');
    check(state.chronicle == null || object(state.chronicle), 'Invalid chronicle owner.');
    const simulation = state.simulation?.relationships;
    const chronicle = viewerId === chronicleOwnerId ? state.chronicle?.relationships : undefined;
    check(simulation == null || object(simulation), 'Invalid simulation relationships.');
    check(chronicle == null || object(chronicle), 'Invalid chronicle relationships.');
    const directed = own(simulation, viewerId);
    check(directed === undefined || object(directed), 'Invalid directed relationships.');
    const relationships = {};
    const targets = [...new Set([...Object.keys(directed || {}), ...Object.keys(chronicle || {})])].sort();
    for (const targetId of targets) {
        check(key(targetId), 'Invalid relationship target.');
        const s = own(directed, targetId), c = own(chronicle, targetId);
        check(s === undefined || object(s), 'Invalid simulation relationship.');
        check(c === undefined || object(c), 'Invalid chronicle relationship.');
        const memories = [...(s ? memoriesView(s.memories, 'simulation') : []),
            ...(c ? memoriesView(c.memories, 'chronicle') : [])].sort((a, b) => a.at - b.at);
        relationships[targetId] = {viewerId, targetId, sources: {simulation: !!s, chronicle: !!c},
            axes: {simulation: s ? axesView(s.axes, 'simulation') : {},
                chronicle: c ? axesView(c.axes, 'chronicle') : {}},
            ties: {chronicle: c ? tiesView(c.ties) : {}}, memories};
    }
    return {viewerId, scope: 'authoritative', relationships};
}

/** Flat rules.js facts for a target id, from a relationshipView snapshot.
 * No reverse edge, willingness, knowledge grant, legacy reputation or text facts.
 * Only presence is false when absent; missing axes/ties remain unknown to rules.
 * Use explicit namespaces, e.g. relationship.simulation.axis.trust. Chronicle
 * never populates the existing simulation-only relationship.trust fact family.
 */
export function relationshipFacts(viewer, target) {
    check(object(viewer) && key(viewer.viewerId) && viewer.scope === 'authoritative' &&
        object(viewer.relationships) && key(target), 'Invalid relationship fact context.');
    const relation = own(viewer.relationships, target);
    const facts = {'relationship.simulation.present': !!relation?.sources.simulation,
        'relationship.chronicle.present': !!relation?.sources.chronicle};
    if (!relation) return facts;
    check(relation.viewerId === viewer.viewerId && relation.targetId === target,
        'Relationship fact direction mismatch.');
    for (const source of ['simulation', 'chronicle']) {
        if (!relation.sources[source]) continue;
        for (const [axis, value] of Object.entries(relation.axes[source])) {
            facts[`relationship.${source}.axis.${axis}`] = value;
        }
        facts[`relationship.${source}.memoryCount`] = relation.memories.filter(m => m.source === source).length;
    }
    for (const [tie, value] of Object.entries(relation.ties.chronicle)) {
        facts[`relationship.chronicle.tie.${tie}`] = value;
    }
    return facts;
}

/**
 * Household reads (W3 G03/G06, 2026-10-23): relationship statuses (courting, married, estranged, widowed) derived from the
 * village lives plus the life-events overlay, and the capped memories one broadcast fact left in each person. A separate
 * export, so relationshipView's shape and tests are unchanged. `lives` is a validated village-lives state, `slice` the
 * life_events slice. Memories are a named source ('household'), kept local to it like the other sources.
 */
export function householdRelationships(lives, slice, year = lives.lastYear) {
    check(object(lives) && Array.isArray(lives.people) && object(slice) && object(slice.bonds) && object(slice.memories), 'Invalid household owners.');
    const names = new Map(lives.people.map(p => [p.id, p.name])), out = {};
    for (const row of bondStatuses(lives, slice.bonds, year)) {
        out[row.key] = {a: row.a, b: row.b, names: [names.get(row.a), names.get(row.b)], status: row.status, since: row.since ?? null};
    }
    const memories = {};
    for (const [id, list] of Object.entries(slice.memories)) {
        check(key(id) && list.length <= RELATIONSHIP_READ_RULES.memoryLimitPerSource, 'Invalid household memories.');
        memories[id] = list.map((m, index) => ({source: 'household', index, id: m.id, at: m.at, text: m.text}));
    }
    return {scope: 'authoritative', statuses: out, memories};
}
