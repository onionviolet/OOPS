// One identity for a thing that is several kinds at once (SC7, SB1; docs/
// KERNEL_WORKING_CONTRACT.md KW22-KW26). A Gu is an item someone holds and a
// living body; a Beyonder characteristic is a person's remnant, then an item,
// then a potion input. The registry maps one id to facets, and each facet to
// the owner key that already holds that aspect (an individual item key, a W
// holder, a lifecycle individual, a claim). It is a cross-reference, not an
// authority (AR3): it copies no count, health, custody or position. Owners
// stay the one writer of their facts; the kernel reads them through
// identityReader, which is an ordinary ports.read.
import {check, natural, object} from './basics.js';

export const IDENTITY_SCHEMA = 'kernel.identity@1';
const id = value => typeof value === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(value) &&
    !['__proto__', 'constructor', 'prototype'].includes(value);
const facetOk = facet => object(facet) && id(facet.owner) && typeof facet.key === 'string' && facet.key.length > 0;
const clone = value => structuredClone(value);

export const createIdentities = () => ({schema: IDENTITY_SCHEMA, entries: {}});

// KW23. One owner key belongs to at most one identity.
function claimed(registry, owner, key, except) {
    return Object.entries(registry.entries).some(([other, entry]) => other !== except &&
        Object.values(entry.facets).some(facet => facet.owner === owner && facet.key === key));
}

// KW22. Mint an identity with its first facets ({kind: {owner, key}}).
// grammar: the ref of the grammar that generated this thing (PR2, KW31); the
// owners keep its frozen values, the identity keeps which grammar made them.
export function addIdentity(registry, {id: thingId, facets, at, cause, grammar}) {
    check(registry?.schema === IDENTITY_SCHEMA, 'Unsupported identity registry.');
    check(id(thingId) && !Object.hasOwn(registry.entries, thingId), 'Choose a new identity id.');
    check(grammar === undefined || (typeof grammar === 'string' && grammar.length > 0), 'A grammar ref is a string.');
    return changeFacets({...registry, entries: {...registry.entries, [thingId]: {facets: {}, history: [], ...(grammar ? {grammar} : {})}}},
        thingId, {add: facets, at, cause});
}

// KW24. A thing changes what it is without becoming another thing (MR41):
// facets are removed and added in one change, with the time and cause kept.
export function changeFacets(registry, thingId, {add = {}, remove = [], at, cause}) {
    check(registry?.schema === IDENTITY_SCHEMA && Object.hasOwn(registry.entries, thingId), 'Unknown identity.');
    check(object(add) && Array.isArray(remove) && natural(at) && typeof cause === 'string' && cause.length > 0,
        'A facet change needs facets, a time and a cause.');
    const next = clone(registry);
    const entry = next.entries[thingId];
    for (const kind of remove) {
        check(Object.hasOwn(entry.facets, kind), `This identity has no ${kind} facet.`);
        entry.history.push({at, change: 'remove', kind, ...entry.facets[kind], cause});
        delete entry.facets[kind];
    }
    for (const [kind, facet] of Object.entries(add)) {
        check(id(kind) && facetOk(facet) && !Object.hasOwn(entry.facets, kind), `Invalid or duplicate ${kind} facet.`);
        check(!claimed(next, facet.owner, facet.key, thingId), 'That owner key already belongs to another identity.');
        entry.facets[kind] = {owner: facet.owner, key: facet.key};
        entry.history.push({at, change: 'add', kind, owner: facet.owner, key: facet.key, cause});
    }
    check(Object.keys(entry.facets).length > 0 || remove.length > 0, 'An identity needs at least one facet.');
    return next;
}

export const facetsOf = (registry, thingId) => clone(registry.entries[thingId]?.facets ?? {});
export const identityHistory = (registry, thingId) => clone(registry.entries[thingId]?.history ?? []);
export const identityGrammar = (registry, thingId) => registry.entries[thingId]?.grammar ?? null;

// From an owner's key back to the identity (an inventory row to the Gu).
export function identityFor(registry, owner, key) {
    for (const [thingId, entry] of Object.entries(registry.entries)) {
        for (const [kind, facet] of Object.entries(entry.facets)) if (facet.owner === owner && facet.key === key) return {id: thingId, kind};
    }
    return null;
}

// KW25. A kernel reader over the registry. A binding {kind, id} reads the
// facet of that kind through its owner's reader(key, at). The answer keeps
// the owner's fields and carries the identity id and the bound kind. A stack
// (an owner answer with count above one) is not one thing, so it reads as
// absent: an identity points at an individual key.
export function identityReader(registry, owners) {
    check(object(owners) && Object.values(owners).every(fn => typeof fn === 'function'), 'Give a reader for each owner.');
    return (ref, at) => {
        const facet = registry.entries[ref?.id]?.facets[ref.kind];
        if (!facet || typeof owners[facet.owner] !== 'function') return null;
        const thing = owners[facet.owner](facet.key, at);
        if (!object(thing) || (thing.count !== undefined && thing.count !== 1)) return null;
        return {...clone(thing), kind: ref.kind, id: ref.id, facet: {owner: facet.owner, key: facet.key}};
    };
}

// KW26. Versioned save; unknown versions are refused.
export function validateIdentities(registry) {
    check(object(registry) && registry.schema === IDENTITY_SCHEMA && object(registry.entries), 'Unsupported identity registry.');
    const keys = new Set();
    for (const [thingId, entry] of Object.entries(registry.entries)) {
        check(id(thingId) && object(entry) && object(entry.facets) && Array.isArray(entry.history) &&
            (entry.grammar === undefined || (typeof entry.grammar === 'string' && entry.grammar.length > 0)), `Invalid identity ${thingId}.`);
        for (const [kind, facet] of Object.entries(entry.facets)) {
            check(id(kind) && facetOk(facet), `Invalid facet on ${thingId}.`);
            const key = JSON.stringify([facet.owner, facet.key]);
            check(!keys.has(key), 'Two identities claim one owner key.');
            keys.add(key);
        }
        for (const row of entry.history) check(object(row) && natural(row.at) && ['add', 'remove'].includes(row.change), `Invalid history on ${thingId}.`);
    }
    return registry;
}

export const serializeIdentities = registry => JSON.parse(JSON.stringify(registry));
export const restoreIdentities = raw => validateIdentities(clone(raw));
