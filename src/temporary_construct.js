// Executing owner of the `temporary-construct` ability kind (G4, AR2).
// A construct is a temporary copy of an item held by an actor, with an
// `expiresAt`. It can hold contents (items moved in from the owner) and child
// constructs. Default: expiry removes the copy and returns contents to the
// owner (`contents: 'return'`); a world may author 'vanish' with its in-world
// reason. Children always expire with their parent, and a child never outlives
// it. A construct may also supply a capability source; that supply ends with it.
// Stored lazily at state.simulation.constructs; absent means none, so old
// saves need no migration (explicit compat decision, additive field).
// The same expiresAt pattern as conditions: nextConstructBoundary feeds the
// shared clock, advanceConstructs settles due constructs at that boundary.
import {check, natural} from './basics.js';
import {stageAcquisition} from './acquisition.js';
import {validateItemKey} from './gameplay_transactions.js';
import {grantSource, removeSource, pruneExpiredSuppliers, nextSupplierBoundary} from './source_suppliers.js';

const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
export const constructSupplier = constructId => `construct:${constructId}`;

export function validateConstructEffect(e) {
    check(['create', 'dismiss'].includes(e.operation) && id(e.constructId), 'Invalid construct effect.');
    if(e.operation === 'dismiss') return;
    check(natural(e.duration) && e.duration > 0, 'A temporary construct needs a finite duration.');
    if(e.key != null) validateItemKey(e.key);
    check(e.parentId == null || id(e.parentId), 'Invalid parent construct.');
    check(e.contents == null || ['return', 'vanish'].includes(e.contents), 'Invalid contents policy.');
    check(e.sourceId == null || id(e.sourceId), 'Invalid construct source.');
    check(e.store == null || Array.isArray(e.store) && e.store.every(x => x && natural(x.count) && x.count > 0 && (validateItemKey(x.key), true)), 'Invalid stored contents.');
}

const records = state => state.simulation.constructs ||= {};
function add(bag, key, count) {bag[key] = (bag[key] || 0) + count;}

function dropCopy(plan, record, io) {
    if(record.key == null) return;
    const held = io.readInventory(plan, record.holderId);
    if((held[record.key] || 0) > 0) io.writeInventory(plan, record.holderId, stageAcquisition({owner: held}, {consumes: [{owner: 'owner', key: record.key, count: 1}]}).owner);
}

/** Expire one construct: children first, then its contents, copy and supply. */
export function expireConstruct(plan, constructId, io, registry) {
    const state = plan.state, all = records(state), record = all[constructId];
    if(!record) return 0;
    let work = 0;
    for(const child of Object.values(all).filter(c => c.parentId === constructId).sort((a, b) => a.id.localeCompare(b.id))) work += expireConstruct(plan, child.id, io, registry);
    if(record.contents === 'return' && Object.keys(record.stored).length) {
        let bag = io.readInventory(plan, record.ownerId);
        bag = stageAcquisition({owner: bag}, {grants: Object.entries(record.stored).map(([key, count]) => ({owner: 'owner', key, count}))}).owner;
        io.writeInventory(plan, record.ownerId, bag);
    }
    dropCopy(plan, record, io);
    if(record.sourceId) removeSource(state, record.ownerId, record.sourceId, {supplier: constructSupplier(constructId)});
    delete all[constructId];
    return work + 1;
}

export function applyConstructEffect(plan, e, actorId, cause, registry, io) {
    const state = plan.state, all = records(state);
    if(e.operation === 'dismiss') {
        const record = all[e.constructId];
        check(record && record.ownerId === actorId, 'No such construct to dismiss.');
        expireConstruct(plan, e.constructId, io, registry);
        return;
    }
    check(!all[e.constructId], 'This construct already exists.');
    const parent = e.parentId == null ? null : all[e.parentId];
    check(e.parentId == null || parent && parent.ownerId === actorId, 'A child construct needs its owner\'s live parent.');
    const expiresAt = Math.min(state.clock + e.duration, parent ? parent.expiresAt : Infinity);
    const record = {id: e.constructId, ownerId: actorId, holderId: actorId, parentId: e.parentId ?? null, key: e.key ?? null,
        createdAt: state.clock, expiresAt, contents: e.contents ?? 'return', stored: {}, sourceId: e.sourceId ?? null, cause};
    let bag = io.readInventory(plan, actorId);
    if(e.store?.length) {
        bag = stageAcquisition({owner: bag}, {consumes: e.store.map(x => ({owner: 'owner', key: x.key, count: x.count}))}).owner;
        for(const x of e.store) add(record.stored, x.key, x.count);
    }
    if(e.key != null) bag = stageAcquisition({owner: bag}, {grants: [{owner: 'owner', key: e.key, count: 1}]}).owner;
    io.writeInventory(plan, actorId, bag);
    if(e.sourceId) {
        const definition = registry.sources.get(e.sourceId);
        check(definition, 'Unknown capability source.');
        grantSource(state, actorId, definition, {supplier: constructSupplier(e.constructId), duration: expiresAt - state.clock, origin: 'acquired', receiptId: cause, awakened: true, active: true});
    }
    all[e.constructId] = record;
}

export function nextConstructBoundary(state) {
    let at = nextSupplierBoundary(state);
    for(const c of Object.values(state.simulation?.constructs || {})) at = Math.min(at, c.expiresAt > state.clock ? c.expiresAt : Infinity);
    return at;
}

/** Settle due constructs at the shared clock boundary. Returns the work done. */
export function advanceConstructs(plan, registry, io) {
    const state = plan.state;
    let work = 0;
    for(const record of Object.values(records(state)).filter(c => c.expiresAt <= state.clock).sort((a, b) => a.expiresAt - b.expiresAt || a.id.localeCompare(b.id)))
        work += expireConstruct(plan, record.id, io, registry);
    return work + pruneExpiredSuppliers(state);
}

export function validateConstructState(state) {
    const all = state.simulation?.constructs;
    if(all == null) return;
    check(all && typeof all === 'object' && !Array.isArray(all), 'Invalid construct records.');
    for(const [key, c] of Object.entries(all)) {
        check(id(key) && c.id === key && state.actors[c.ownerId] && state.actors[c.holderId] && natural(c.createdAt) && natural(c.expiresAt) &&
            c.expiresAt > c.createdAt && ['return', 'vanish'].includes(c.contents) && c.stored && typeof c.stored === 'object', 'Invalid temporary construct.');
        check(c.parentId == null || all[c.parentId]?.ownerId === c.ownerId && c.expiresAt <= all[c.parentId].expiresAt, 'A child construct cannot outlive its parent.');
        for(const [item, count] of Object.entries(c.stored)) {validateItemKey(item); check(natural(count) && count > 0, 'Invalid stored construct contents.');}
    }
}

/** Public lines for the existing body panel: each live copy, its contents and supply. */
export function constructRecords(state) {
    const all = state.simulation?.constructs || {};
    return Object.values(all).sort((a, b) => a.id.localeCompare(b.id)).map(c => {
        const held = Object.entries(c.stored).map(([key, count]) => `${count} x ${itemName(key)}`);
        const bits = [`${Math.max(0, c.expiresAt - state.clock)} min remaining`,
            held.length ? `holds ${held.join(', ')} (${c.contents === 'return' ? 'returned when it ends' : 'lost when it ends'})` : 'holds nothing'];
        if(c.sourceId) bits.push(`supplies ${c.sourceId}`);
        if(c.parentId) bits.push(`inside ${c.parentId}`);
        return `Temporary copy ${c.id}${c.key ? ` of ${itemName(c.key)}` : ''}: ${bits.join('; ')}.`;
    });
}
function itemName(key) {try {return JSON.parse(key).id ?? key;} catch {return key;}}
