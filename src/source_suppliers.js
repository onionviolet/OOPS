// Per-supplier source counting (G4, AR2: one authority for who supplies a source).
// A source instance on state.actors[id].sources[sourceId] may be supplied by
// several named suppliers (an implant, a trained lesson, a temporary copy).
// Default: an unnamed grant is the single legacy supplier "self" and the saved
// shape is unchanged (no `suppliers` field), so old saves and unnamed callers
// behave as before. Dial: a named supplier adds an entry; each live supplier
// counts once in capability queries, and removing one keeps the others.
// Shifts (body properties and conditions a source applies) belong to the
// source: they are applied when the instance is created and restored when its
// last supplier leaves.
import {check as assert} from './basics.js';

export const SELF_SUPPLIER = 'self';
const live = (entry, clock) => entry.expiresAt == null || entry.expiresAt > clock;

/** Normalized supplier map, including the implicit legacy supplier. */
export function suppliersOf(instance) {
    return instance.suppliers || {[SELF_SUPPLIER]: {receiptId: instance.receiptId, expiresAt: instance.expiresAt ?? null}};
}
export function liveSuppliers(instance, clock) {
    return Object.entries(suppliersOf(instance)).filter(([, entry]) => live(entry, clock));
}
const spanEnd = suppliers => {
    const ends = Object.values(suppliers).map(entry => entry.expiresAt);
    return ends.some(end => end == null) ? null : Math.max(...ends);
};

function applyShifts(state, actorId, sourceId, shifts) {
    const person = state.simulation.people[actorId], applied = [];
    for(const shift of shifts) {
        if(shift.type === 'body') {
            const body = person.body ||= {};
            applied.push({type: 'body', key: shift.key, had: Object.hasOwn(body, shift.key), previous: body[shift.key]});
            body[shift.key] = shift.value;
        } else {
            const conditions = state.simulation.conditions[actorId] ||= {};
            applied.push({type: 'condition', id: shift.id, previous: conditions[shift.id] ?? null});
            conditions[shift.id] = {intensity: shift.intensity ?? 1, expiresAt: null, cause: `source:${sourceId}`, ownerSourceId: sourceId};
        }
    }
    return applied;
}
function clearShifts(state, actorId, sourceId, shifts) {
    const person = state.simulation.people[actorId], conditions = state.simulation.conditions[actorId];
    for(const shift of [...shifts].reverse()) {
        if(shift.type === 'body' && person.body) {
            if(shift.had) person.body[shift.key] = shift.previous; else delete person.body[shift.key];
        } else if(shift.type === 'condition' && conditions) {
            if(conditions[shift.id]?.ownerSourceId === sourceId) {
                if(shift.previous) conditions[shift.id] = shift.previous; else delete conditions[shift.id];
            }
        }
    }
    // Any other condition this source still owns goes with it.
    if(conditions) for(const [id, c] of Object.entries(conditions)) if(c.ownerSourceId === sourceId) delete conditions[id];
}

/** Grant a source, or add a supplier to a present one. Returns the instance. */
export function grantSource(state, actorId, definition, {supplier = null, duration = null, origin = 'unknown', receiptId, awakened = false, active = false, shifts = null} = {}) {
    const a = state.actors[actorId], faculties = state.simulation.faculties[actorId] ||= {};
    const expiresAt = duration ? state.clock + duration : null;
    let instance = a.sources[definition.id];
    if(!instance) {
        instance = a.sources[definition.id] = {acquiredAt: state.clock, expiresAt, receiptId, worldId: a.worldId, revision: definition.revision, origin};
        if(supplier != null && supplier !== SELF_SUPPLIER) instance.suppliers = {[supplier]: {receiptId, expiresAt}};
        if(shifts?.length) instance.shifts = applyShifts(state, actorId, definition.id, shifts);
    } else if(supplier != null) {
        assert(supplier !== SELF_SUPPLIER || !instance.suppliers, 'Name this source supplier.');
        const suppliers = instance.suppliers ||= suppliersOf(instance);
        if(!suppliers[supplier]) suppliers[supplier] = {receiptId, expiresAt};
        else if(!live(suppliers[supplier], state.clock)) suppliers[supplier] = {receiptId, expiresAt};
        instance.expiresAt = spanEnd(suppliers);
    }
    faculties[definition.id] ||= {awakened, active, suppressed: false, development: 0};
    return instance;
}

/**
 * Remove one named supplier, or (no supplier) the whole source as before.
 * Returns true when the source itself is gone, so its faculty and shifts too.
 */
export function removeSource(state, actorId, sourceId, {supplier = null} = {}) {
    const a = state.actors[actorId], instance = a.sources[sourceId];
    if(!instance) return false;
    if(supplier != null && instance.suppliers) {
        if(!instance.suppliers[supplier]) return false;
        delete instance.suppliers[supplier];
        if(Object.keys(instance.suppliers).length) {instance.expiresAt = spanEnd(instance.suppliers); return false;}
    }
    clearShifts(state, actorId, sourceId, instance.shifts || []);
    delete a.sources[sourceId]; delete state.simulation.faculties[actorId]?.[sourceId];
    return true;
}

export function validateSourceSuppliers(state) {
    for(const [actorId, a] of Object.entries(state.actors)) for(const [id, instance] of Object.entries(a.sources || {})) {
        if(instance.suppliers == null) continue;
        const entries = Object.entries(instance.suppliers);
        assert(entries.length > 0 && entries.every(([key, entry]) => key.length > 0 && key.length <= 300 && !['__proto__', 'constructor', 'prototype'].includes(key) && entry && (entry.expiresAt == null || Number.isSafeInteger(entry.expiresAt))),
            `Invalid suppliers for ${id} on ${actorId}.`);
        assert(instance.expiresAt === spanEnd(instance.suppliers), `Source ${id} on ${actorId} disagrees with its suppliers.`);
    }
}

/**
 * Drop suppliers whose time has run out, and with the last one the source and
 * the shifts it owns. Plain unnamed sources without shifts are left alone, as
 * before: queries already ignore them once expired.
 */
export function pruneExpiredSuppliers(state) {
    let work = 0;
    for(const [actorId, a] of Object.entries(state.actors)) for(const [sourceId, instance] of Object.entries(a.sources || {})) {
        if(!instance.suppliers && !(instance.shifts && instance.expiresAt != null && instance.expiresAt <= state.clock)) continue;
        if(!instance.suppliers) {removeSource(state, actorId, sourceId); work++; continue;}
        for(const [supplier, entry] of Object.entries(instance.suppliers)) {
            if(entry.expiresAt == null || entry.expiresAt > state.clock || !a.sources[sourceId]) continue;
            removeSource(state, actorId, sourceId, {supplier}); work++;
        }
    }
    return work;
}
export function nextSupplierBoundary(state) {
    let at = Infinity;
    for(const a of Object.values(state.actors)) for(const instance of Object.values(a.sources || {})) {
        if(instance.suppliers) for(const entry of Object.values(instance.suppliers)) {if(entry.expiresAt != null && entry.expiresAt > state.clock) at = Math.min(at, entry.expiresAt);}
        else if(instance.shifts && instance.expiresAt != null && instance.expiresAt > state.clock) at = Math.min(at, instance.expiresAt);
    }
    return at;
}
