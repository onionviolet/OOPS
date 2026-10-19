// Detached prototype records. The integrator owns registration, native bindings
// and durable publication. This module never advances the joined game clock.
import {check as assert, copyJson as copy, natural} from './basics.js';
export const WORLD_INSTANCE_SCHEMA = 1;
export const WORLD_BINDING_SCHEMA = 1;

const record = value => value !== null && typeof value === "object" &&
    !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const stableId = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["__proto__", "prototype", "constructor"].includes(value);
const scalar = value => ["boolean", "string"].includes(typeof value) ||
    typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
const sameEndpoint = (a, b) => ["worldId", "instanceId", "regionId", "layerId"].every(key => a[key] === b[key]);

function json(value, depth = 0, ancestors = new Set()) {
    assert(depth < 32, "World data exceeds the supported JSON depth.");
    if (value === null || scalar(value)) return;
    assert(Array.isArray(value) || record(value), "World data must contain only plain JSON values.");
    assert(Object.getOwnPropertySymbols(value).length === 0, "World JSON cannot contain symbol keys.");
    assert(Object.values(Object.getOwnPropertyDescriptors(value)).every(descriptor => Object.hasOwn(descriptor, "value")),
        "World JSON cannot contain accessors.");
    assert(Array.isArray(value) || Object.getOwnPropertyNames(value).length === Object.keys(value).length,
        "World JSON object fields must be enumerable.");
    assert(!Array.isArray(value) || Object.getPrototypeOf(value) === Array.prototype &&
        Object.keys(value).length === value.length && Object.getOwnPropertyNames(value).length === value.length + 1,
        "World JSON arrays must be plain, dense and undecorated.");
    assert(!ancestors.has(value), "World data contains a cyclic object.");
    ancestors.add(value);
    if (Array.isArray(value)) for (const child of value) json(child, depth + 1, ancestors);
    else for (const [key, child] of Object.entries(value)) {
        assert(!["__proto__", "prototype", "constructor"].includes(key), "Unsafe world data key.");
        json(child, depth + 1, ancestors);
    }
    ancestors.delete(value);
}

function shape(value, fields, name) {
    assert(record(value) && Object.keys(value).every(key => fields.includes(key)), `Invalid ${name} fields.`);
}

function ids(values, name) {
    assert(Array.isArray(values) && values.every(stableId) && new Set(values).size === values.length,
        `Invalid or duplicate ${name} IDs.`);
}

function index(values, name) {
    assert(Array.isArray(values), `Missing ${name} records.`);
    ids(values.map(value => value?.id), name);
    return new Map(values.map(value => [value.id, value]));
}

export function validateWorldDefinition(definition) {
    json(definition);
    shape(definition, ["id", "worldId", "revision", "label", "unidentifiedLabel", "regions", "sites",
        "initialFacts", "uniqueClaimIds"], "world definition");
    assert(stableId(definition.id) && stableId(definition.worldId) && natural(definition.revision) &&
        definition.revision > 0 && typeof definition.label === "string" && definition.label.length > 0 &&
        typeof definition.unidentifiedLabel === "string" && definition.unidentifiedLabel.length > 0,
    "Missing world definition identity/revision/labels.");
    const regions = index(definition.regions, "region");
    assert(regions.size > 0, "A represented world needs a region.");
    for (const region of regions.values()) {
        shape(region, ["id", "layerIds"], "region");
        ids(region.layerIds, "region layer");
        assert(region.layerIds.length > 0, "A region needs a supported layer.");
    }
    for (const site of index(definition.sites, "site").values()) {
        shape(site, ["id", "label", "regionId", "layerId", "initialOpen"], "site definition");
        assert(typeof site.label === "string" && site.label.length > 0 && typeof site.initialOpen === "boolean" &&
            regions.get(site.regionId)?.layerIds.includes(site.layerId), "Unbound world site.");
    }
    assert(record(definition.initialFacts), "Missing initial world facts.");
    ids(Object.keys(definition.initialFacts), "world fact");
    assert(Object.values(definition.initialFacts).every(scalar), "World facts must be scalar.");
    ids(definition.uniqueClaimIds, "unique claim");
    return true;
}

export function validateWorldEndpoint(endpoint, instance, definition) {
    json(endpoint);
    shape(endpoint, ["worldId", "instanceId", "regionId", "layerId"], "world endpoint");
    assert(["worldId", "instanceId", "regionId", "layerId"].every(key => stableId(endpoint[key])),
        "World endpoints require all four bound IDs.");
    if (instance || definition) {
        assert(instance && definition, "Endpoint validation needs both instance and definition.");
        validateWorldInstance(instance, definition);
        assert(endpoint.worldId === definition.worldId && endpoint.instanceId === instance.id &&
            instance.definitionId === definition.id &&
            definition.regions.some(region => region.id === endpoint.regionId && region.layerIds.includes(endpoint.layerId)),
        "Endpoint does not belong to this represented instance/layer.");
    }
    return true;
}

export function validateWorldInstance(instance, definition) {
    validateWorldDefinition(definition);
    json(instance);
    shape(instance, ["schema", "id", "definitionId", "definitionRevision", "worldId", "continuityId", "eraId",
        "revision", "parentInstanceId", "clock", "sites", "facts", "claims", "actorIds"], "world instance");
    assert(instance.schema === WORLD_INSTANCE_SCHEMA && stableId(instance.id) && instance.definitionId === definition.id &&
        instance.definitionRevision === definition.revision && instance.worldId === definition.worldId &&
        stableId(instance.continuityId) && stableId(instance.eraId) && natural(instance.revision) && instance.revision > 0,
    "Unbound or incompatible world instance.");
    assert(instance.parentInstanceId === null || stableId(instance.parentInstanceId) && instance.parentInstanceId !== instance.id,
        "Invalid/self-nested world instance.");
    shape(instance.clock, ["elapsed", "observedAt", "unit", "absence"], "world clock");
    assert(natural(instance.clock.elapsed) && natural(instance.clock.observedAt) &&
        instance.clock.elapsed <= instance.clock.observedAt && instance.clock.unit === "played_minutes" &&
        instance.clock.absence === "freeze", "Unsupported world clock/absence policy.");
    assert(record(instance.sites) && record(instance.facts) && record(instance.claims), "Missing world state records.");
    const siteIds = definition.sites.map(site => site.id);
    assert(Object.keys(instance.sites).length === siteIds.length && siteIds.every(id => Object.hasOwn(instance.sites, id)),
        "World site bindings differ from the frozen definition.");
    for (const site of Object.values(instance.sites)) {
        shape(site, ["open"], "world site state");
        assert(typeof site.open === "boolean", "Invalid site state.");
    }
    const factKeys = Object.keys(definition.initialFacts);
    assert(Object.keys(instance.facts).length === factKeys.length && factKeys.every(key =>
        Object.hasOwn(instance.facts, key) && scalar(instance.facts[key]) && typeof instance.facts[key] === typeof definition.initialFacts[key]),
    "World fact bindings/types differ from the frozen definition.");
    for (const [key, claim] of Object.entries(instance.claims)) {
        assert(definition.uniqueClaimIds.includes(key), "Unknown unique world claim.");
        shape(claim, ["holderId", "settledAt"], "world claim");
        assert(stableId(claim.holderId) && natural(claim.settledAt) && claim.settledAt <= instance.clock.observedAt,
            "Invalid world claim receipt.");
    }
    ids(instance.actorIds, "referenced actor");
    return true;
}

// Authoring maps only. No registered site, reward, fact owner or world instance
// is created by making a manifest; the integrator binds the actual owners.
export function createWorldBindings(definition, options) {
    validateWorldDefinition(definition); json(options);
    shape(options, ["instanceId", "worldFactPrefix", "siteBindings", "claimBindings"], "world binding options");
    assert(stableId(options.instanceId), "World authoring bindings need an instance ID.");
    const prefix = options.worldFactPrefix ?? options.instanceId;
    assert(stableId(prefix), "Invalid world fact namespace.");
    const siteBindings = options.siteBindings ?? Object.fromEntries(definition.sites.map(site =>
        [site.id, `${options.instanceId}.${site.id}`]));
    const claimBindings = options.claimBindings ?? Object.fromEntries(definition.uniqueClaimIds.map(key =>
        [key, `${options.instanceId}.${key}`]));
    for (const [mapping, localIds, name] of [[siteBindings, definition.sites.map(site => site.id), "site"],
        [claimBindings, definition.uniqueClaimIds, "unique claim"]]) {
        assert(record(mapping) && Object.keys(mapping).length === localIds.length &&
            localIds.every(key => Object.hasOwn(mapping, key)), `Incomplete/unknown local ${name} binding.`);
        ids(Object.values(mapping), `registered ${name}`);
    }
    const bindings = {schema: WORLD_BINDING_SCHEMA, definitionId: definition.id, definitionRevision: definition.revision,
        worldId: definition.worldId, instanceId: options.instanceId, worldFactPrefix: prefix,
        factKeys: Object.fromEntries(Object.keys(definition.initialFacts).map(key => [`${prefix}.${key}`, key])),
        sites: Object.fromEntries(Object.entries(siteBindings).map(([local, registered]) => [registered, local])),
        uniqueClaims: Object.fromEntries(Object.entries(claimBindings).map(([local, registered]) => [registered, local]))};
    validateWorldBindings(bindings, definition);
    return bindings;
}

export function validateWorldBindings(bindings, definition, instance) {
    validateWorldDefinition(definition); json(bindings);
    shape(bindings, ["schema", "definitionId", "definitionRevision", "worldId", "instanceId", "worldFactPrefix",
        "factKeys", "sites", "uniqueClaims"], "world authoring bindings");
    assert(bindings.schema === WORLD_BINDING_SCHEMA && bindings.definitionId === definition.id &&
        bindings.definitionRevision === definition.revision && bindings.worldId === definition.worldId &&
        stableId(bindings.instanceId) && stableId(bindings.worldFactPrefix), "Incompatible world binding manifest.");
    for (const [mapping, localIds, name] of [[bindings.factKeys, Object.keys(definition.initialFacts), "fact"],
        [bindings.sites, definition.sites.map(site => site.id), "site"],
        [bindings.uniqueClaims, definition.uniqueClaimIds, "unique claim"]]) {
        assert(record(mapping), `Missing world ${name} binding map.`);
        ids(Object.keys(mapping), `registered ${name}`); ids(Object.values(mapping), `local ${name}`);
        assert(Object.keys(mapping).length === localIds.length && Object.values(mapping).every(id => localIds.includes(id)),
            `World ${name} mapping differs from the frozen definition.`);
    }
    assert(Object.entries(bindings.factKeys).every(([registered, local]) => registered === `${bindings.worldFactPrefix}.${local}`),
        "World fact mapping does not match its declared namespace.");
    if (instance != null) {
        validateWorldInstance(instance, definition);
        assert(instance.id === bindings.instanceId, "Authoring bindings refer to another world instance.");
    }
    return true;
}

// Runtime predicate inputs, not a player-visible knowledge view. Each value is
// projected from the one instance owner; no duplicated durable mirror is made.
export function worldInstanceFacts(instance, definition, bindings) {
    validateWorldBindings(bindings, definition, instance);
    return Object.fromEntries(Object.entries(bindings.factKeys).map(([registered, local]) =>
        [`world.${registered}`, instance.facts[local]]));
}

function visitShape(visit) {
    json(visit);
    shape(visit, ["schema", "id", "revision", "actorId", "instanceId", "endpoint", "enteredAt", "exitedAt", "status"], "world visit");
    assert(visit.schema === WORLD_INSTANCE_SCHEMA && stableId(visit.id) && natural(visit.revision) && visit.revision > 0 &&
        stableId(visit.actorId) && stableId(visit.instanceId) && natural(visit.enteredAt), "Invalid visit identity/time.");
    validateWorldEndpoint(visit.endpoint);
    assert(visit.endpoint.instanceId === visit.instanceId, "Visit and endpoint instances differ.");
    assert(visit.status === "active" && visit.exitedAt === null || visit.status === "ended" &&
        natural(visit.exitedAt) && visit.exitedAt >= visit.enteredAt, "Invalid visit status/exit time.");
}

export function validateWorldVisit(visit, instance, definition) {
    validateWorldInstance(instance, definition);
    visitShape(visit);
    validateWorldEndpoint(visit.endpoint, instance, definition);
    assert(visit.enteredAt <= instance.clock.observedAt && (visit.exitedAt === null || visit.exitedAt <= instance.clock.observedAt),
        "Visit time is ahead of its reconciled instance clock.");
    return true;
}

// Collection validation is the binding gate. External entries are references to
// existing owners, never copies of their bodies, inventory or native domains.
export function validateWorldRecords(records, bindings) {
    json(records); json(bindings);
    shape(records, ["definitions", "instances", "visits"], "world records");
    shape(bindings, ["actorIds", "externalInstances"], "world owner bindings");
    ids(bindings.actorIds, "bound actor");
    const definitions = index(records.definitions, "world definition");
    for (const definition of definitions.values()) validateWorldDefinition(definition);
    const instances = index(records.instances, "world instance");
    const external = index(bindings.externalInstances, "external instance");
    for (const entry of external.values()) {
        shape(entry, ["id", "worldId", "parentInstanceId"], "external instance reference");
        assert(stableId(entry.worldId) && (entry.parentInstanceId === null || stableId(entry.parentInstanceId)) &&
            !instances.has(entry.id), "Ambiguous external instance binding.");
    }
    for (const instance of instances.values()) {
        const definition = definitions.get(instance.definitionId);
        assert(definition, "Missing frozen world definition.");
        validateWorldInstance(instance, definition);
        assert(instance.actorIds.every(id => bindings.actorIds.includes(id)) &&
            Object.values(instance.claims).every(claim => bindings.actorIds.includes(claim.holderId)),
        "Missing existing actor/claim-holder binding.");
    }
    const graph = new Map([...external, ...instances]);
    for (const entry of graph.values()) {
        const seen = new Set([entry.id]);
        let parentId = entry.parentInstanceId;
        while (parentId !== null) {
            assert(graph.has(parentId), "Missing enclosing instance binding.");
            assert(!seen.has(parentId), "Cyclic instance ownership/nesting.");
            seen.add(parentId); parentId = graph.get(parentId).parentInstanceId;
        }
    }
    const actorsVisiting = new Set(), actorIntervals = new Map();
    for (const visit of index(records.visits, "world visit").values()) {
        const instance = instances.get(visit.instanceId);
        assert(instance, "Missing visited instance binding.");
        validateWorldVisit(visit, instance, definitions.get(instance.definitionId));
        assert(bindings.actorIds.includes(visit.actorId), "Missing traveler owner binding.");
        const intervals = actorIntervals.get(visit.actorId) ?? [];
        intervals.push([visit.enteredAt, visit.exitedAt ?? Infinity]); actorIntervals.set(visit.actorId, intervals);
        if (visit.status === "active") {
            assert(!actorsVisiting.has(visit.actorId), "An actor has two active world visits.");
            actorsVisiting.add(visit.actorId);
        }
    }
    for (const intervals of actorIntervals.values()) {
        intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        let through = 0;
        for (const [start, end] of intervals) {
            assert(start >= through, "One actor has overlapping visit histories.");
            through = end;
        }
    }
    return true;
}

export function createWorldInstance(definition, seed) {
    validateWorldDefinition(definition); json(seed);
    shape(seed, ["id", "continuityId", "eraId", "playedAt", "parentInstanceId", "actorIds"], "world instance seed");
    assert(natural(seed.playedAt), "Bind a new instance to the actual joined played clock.");
    const instance = {schema: WORLD_INSTANCE_SCHEMA, id: seed.id, definitionId: definition.id,
        definitionRevision: definition.revision, worldId: definition.worldId, continuityId: seed.continuityId,
        eraId: seed.eraId, revision: 1, parentInstanceId: seed.parentInstanceId ?? null,
        clock: {elapsed: 0, observedAt: seed.playedAt, unit: "played_minutes", absence: "freeze"},
        sites: Object.fromEntries(definition.sites.map(site => [site.id, {open: site.initialOpen}])),
        facts: copy(definition.initialFacts), claims: {}, actorIds: copy(seed.actorIds ?? [])};
    validateWorldInstance(instance, definition);
    return instance;
}

// Record an already-authorized arrival. This constructor grants no passage.
export function createWorldVisit(instance, seed, definition, bindings) {
    validateWorldInstance(instance, definition); json(seed); json(bindings);
    shape(seed, ["id", "actorId", "endpoint", "playedAt"], "visit seed");
    shape(bindings, ["actorIds", "visits"], "visit owner bindings");
    ids(bindings.actorIds, "bound actor");
    const visits = index(bindings.visits, "existing visit");
    for (const visit of visits.values()) visitShape(visit);
    assert(bindings.actorIds.includes(seed.actorId), "Missing existing traveler binding.");
    assert(!visits.has(seed.id) && ![...visits.values()].some(visit => visit.actorId === seed.actorId && visit.status === "active"),
        "Duplicate visit or traveler already visiting.");
    assert([...visits.values()].filter(visit => visit.actorId === seed.actorId).every(visit => visit.exitedAt <= seed.playedAt),
        "Arrival predates an existing traveler visit.");
    assert(seed.playedAt === instance.clock.observedAt, "Reconcile absent world clock before recording arrival.");
    const visit = {schema: WORLD_INSTANCE_SCHEMA, id: seed.id, revision: 1, actorId: seed.actorId,
        instanceId: instance.id, endpoint: copy(seed.endpoint), enteredAt: seed.playedAt, exitedAt: null, status: "active"};
    validateWorldVisit(visit, instance, definition);
    return visit;
}

const expected = instance => ({instanceId: instance.id, instanceRevision: instance.revision, observedAt: instance.clock.observedAt});
const denied = (instance, reasons) => ({allowed: false, reasons, expected: expected(instance), nextInstance: null});

// Occupied intervals are unioned: two visitors do not make local time run twice.
// No active visit means frozen local time, even while the joined clock advances.
export function planWorldClock(instance, request, definition) {
    validateWorldInstance(instance, definition); json(request);
    shape(request, ["playedAt", "visits", "expectedRevision"], "world clock request");
    assert(natural(request.playedAt), "World clock needs a joined played-minute value.");
    if (request.expectedRevision != null) assert(natural(request.expectedRevision), "Invalid clock revision guard.");
    if (request.expectedRevision != null && request.expectedRevision !== instance.revision)
        return denied(instance, ["This world clock request is stale."]);
    if (request.playedAt < instance.clock.observedAt) return denied(instance, ["Joined played time cannot move backward."]);
    const intervals = [], activeActors = new Set();
    for (const visit of index(request.visits, "clock visit").values()) {
        visitShape(visit);
        if (visit.status === "active") {
            assert(!activeActors.has(visit.actorId), "Clock ledger has duplicate active traveler visits.");
            activeActors.add(visit.actorId);
        }
        if (visit.instanceId !== instance.id) continue;
        validateWorldVisit(visit, instance, definition);
        assert(visit.enteredAt <= request.playedAt && (visit.exitedAt === null || visit.exitedAt <= request.playedAt),
            "Visit refers to future played time.");
        const start = Math.max(instance.clock.observedAt, visit.enteredAt);
        const end = Math.min(request.playedAt, visit.exitedAt ?? request.playedAt);
        if (end > start) intervals.push([start, end]);
    }
    intervals.sort((a, b) => a[0] - b[0]);
    let advancedBy = 0, through = instance.clock.observedAt;
    for (const [start, end] of intervals) {
        advancedBy += Math.max(0, end - Math.max(start, through)); through = Math.max(through, end);
    }
    const nextInstance = copy(instance);
    nextInstance.clock.elapsed += advancedBy;
    nextInstance.clock.observedAt = request.playedAt;
    if (request.playedAt !== instance.clock.observedAt) nextInstance.revision++;
    validateWorldInstance(nextInstance, definition);
    return {allowed: true, reasons: [], expected: expected(instance), nextInstance, advancedBy,
        absentBy: request.playedAt - instance.clock.observedAt - advancedBy};
}

export function planWorldDeparture(instance, visit, request, definition) {
    validateWorldVisit(visit, instance, definition); json(request);
    shape(request, ["playedAt", "visits", "expectedRevision"], "world departure request");
    const saved = index(request.visits, "departure visit").get(visit.id);
    assert(saved && saved.revision === visit.revision && saved.actorId === visit.actorId &&
        saved.instanceId === visit.instanceId && saved.enteredAt === visit.enteredAt &&
        saved.exitedAt === visit.exitedAt && saved.status === visit.status && sameEndpoint(saved.endpoint, visit.endpoint),
    "Departure needs the actual current visit record.");
    if (visit.status !== "active") return denied(instance, ["This visit already ended."]);
    const clock = planWorldClock(instance, request, definition);
    if (!clock.allowed) return clock;
    assert(request.playedAt >= visit.enteredAt, "Departure predates arrival.");
    return {...clock, expected: {...clock.expected, visitId: visit.id, visitRevision: visit.revision},
        nextVisit: {...copy(visit), revision: visit.revision + 1, status: "ended", exitedAt: request.playedAt}};
}

// The caller must first pay actual costs through the existing durable publisher.
// Unique receipts cannot be reset or paid again by this local-state planner.
export function planWorldInstanceUpdate(instance, request, definition, bindings) {
    validateWorldInstance(instance, definition); json(request); json(bindings);
    shape(request, ["expectedRevision", "facts", "sites", "settleClaims", "attachActorIds"], "world update request");
    shape(bindings, ["actorIds"], "update owner bindings");
    ids(bindings.actorIds, "bound actor");
    assert(instance.actorIds.every(id => bindings.actorIds.includes(id)) &&
        Object.values(instance.claims).every(claim => bindings.actorIds.includes(claim.holderId)),
        "Missing existing instance actor/claim-holder binding.");
    assert(natural(request.expectedRevision), "World updates need an explicit revision guard.");
    if (request.expectedRevision !== instance.revision) return denied(instance, ["This world update is stale."]);
    const facts = request.facts ?? {}, sites = request.sites ?? {}, claims = request.settleClaims ?? [];
    assert(record(facts) && record(sites), "Invalid local state patch.");
    const nextInstance = copy(instance);
    for (const [key, value] of Object.entries(facts)) {
        assert(Object.hasOwn(definition.initialFacts, key) && scalar(value) && typeof value === typeof definition.initialFacts[key],
            "Unsupported local fact patch.");
        nextInstance.facts[key] = value;
    }
    for (const [key, open] of Object.entries(sites)) {
        assert(Object.hasOwn(nextInstance.sites, key) && typeof open === "boolean", "Unsupported local site patch.");
        nextInstance.sites[key].open = open;
    }
    assert(Array.isArray(claims), "Invalid unique-claim patch.");
    ids(claims.map(claim => claim?.key), "claim patch");
    for (const claim of claims) {
        shape(claim, ["key", "holderId"], "claim patch");
        assert(definition.uniqueClaimIds.includes(claim.key) && bindings.actorIds.includes(claim.holderId),
            "Missing unique claim/holder binding.");
        if (Object.hasOwn(instance.claims, claim.key)) return denied(instance, [`Unique claim ${claim.key} is already settled.`]);
        nextInstance.claims[claim.key] = {holderId: claim.holderId, settledAt: instance.clock.observedAt};
    }
    ids(request.attachActorIds ?? [], "attached actor");
    for (const id of request.attachActorIds ?? []) {
        assert(bindings.actorIds.includes(id), "Attach only an actor in the actual owner registry.");
        if (!nextInstance.actorIds.includes(id)) nextInstance.actorIds.push(id);
    }
    const changed = JSON.stringify(nextInstance) !== JSON.stringify(instance);
    if (changed) nextInstance.revision++;
    validateWorldInstance(nextInstance, definition);
    return {allowed: true, reasons: [], expected: expected(instance), nextInstance, changed};
}

export function worldInstanceView(instance, definition, knowledge) {
    validateWorldInstance(instance, definition); json(knowledge);
    shape(knowledge, ["discovered", "identityKnown", "clockKnown", "factKeys", "siteIds", "actorIds", "claimIds"], "world view knowledge");
    for (const flag of ["discovered", "identityKnown", "clockKnown"])
        assert(knowledge[flag] == null || typeof knowledge[flag] === "boolean", "Invalid world discovery flag.");
    if (!knowledge.discovered) return {visible: false};
    for (const key of ["factKeys", "siteIds", "actorIds", "claimIds"]) ids(knowledge[key] ?? [], `known ${key}`);
    assert((knowledge.factKeys ?? []).every(key => Object.hasOwn(instance.facts, key)) &&
        (knowledge.siteIds ?? []).every(id => Object.hasOwn(instance.sites, id)) &&
        (knowledge.actorIds ?? []).every(id => instance.actorIds.includes(id)) &&
        (knowledge.claimIds ?? []).every(id => definition.uniqueClaimIds.includes(id)), "Unbound world view knowledge.");
    const view = {visible: true, label: knowledge.identityKnown ? definition.label : definition.unidentifiedLabel,
        facts: Object.fromEntries((knowledge.factKeys ?? []).map(key => [key, instance.facts[key]])),
        sites: definition.sites.filter(site => (knowledge.siteIds ?? []).includes(site.id))
            .map(site => ({id: site.id, label: site.label, open: instance.sites[site.id].open})),
        actorIds: copy(knowledge.actorIds ?? []),
        claims: Object.fromEntries((knowledge.claimIds ?? []).filter(id => Object.hasOwn(instance.claims, id))
            .map(id => [id, copy(instance.claims[id])]))};
    if (knowledge.identityKnown) view.identity = {worldId: instance.worldId, instanceId: instance.id,
        definitionId: instance.definitionId, continuityId: instance.continuityId, eraId: instance.eraId};
    if (knowledge.clockKnown) view.elapsedPlayedMinutes = instance.clock.elapsed;
    return view;
}
