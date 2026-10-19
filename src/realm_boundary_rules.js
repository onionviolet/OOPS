// Detached prototype rules. The host supplies actual means and owns publication.
import {check as assert, object} from './basics.js';
export const REALM_OPERATIONS = Object.freeze(["passage", "view", "projection", "manifestation", "sense", "identify", "reach", "contact"]);
const bypasses = ["operation", "source", "method", "authority", "anchor", "closed", "expired", "direction", "layer", "observation", "route_cost"];
export const realmStableId = v => typeof v === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !["__proto__", "constructor", "prototype"].includes(v);
export const realmNatural = v => Number.isSafeInteger(v) && v >= 0;

export function validateRealmJson(value, depth = 0) {
    assert(depth < 24, "Realm prototype data is too deeply nested.");
    if (value === null || ["string", "boolean"].includes(typeof value)) return;
    if (typeof value === "number") { assert(Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER, "Invalid realm number."); return; }
    assert(Array.isArray(value) || object(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value)), "Realm prototype data must be plain JSON.");
    assert(Reflect.ownKeys(value).every(key => typeof key === "string") && Object.entries(Object.getOwnPropertyDescriptors(value)).every(([key, d]) => Object.hasOwn(d, "value") && (d.enumerable || Array.isArray(value) && key === "length")), "Realm JSON cannot contain symbols, computed getters or hidden properties.");
    if (Array.isArray(value)) {
        const keys = Object.keys(value);
        assert(keys.length === value.length && keys.every((key, index) => key === String(index)), "Realm JSON arrays must be dense without extra properties.");
    }
    for (const [key, child] of Object.entries(value)) {
        assert(!["__proto__", "constructor", "prototype"].includes(key), "Unsafe realm key.");
        validateRealmJson(child, depth + 1);
    }
}

export function validateRealmEndpoint(endpoint) {
    validateRealmJson(endpoint);
    assert(object(endpoint) && Object.keys(endpoint).length === 4 && ["worldId", "instanceId", "regionId", "layerId"].every(k => realmStableId(endpoint[k])), "Invalid realm endpoint.");
    return endpoint;
}
export const realmEndpointKey = endpoint => {
    validateRealmEndpoint(endpoint);
    return JSON.stringify([endpoint.worldId, endpoint.instanceId, endpoint.regionId, endpoint.layerId]);
};
export const sameRealmEndpoint = (a, b) => realmEndpointKey(a) === realmEndpointKey(b);

function ids(values, label, permitted = null) {
    assert(Array.isArray(values) && new Set(values).size === values.length && values.every(v => realmStableId(v) && (!permitted || permitted.includes(v))), `Invalid ${label}.`);
}
export function validateRealmCosts(costs) {
    validateRealmJson(costs);
    assert(Array.isArray(costs), "Realm costs must be explicit.");
    for (const c of costs) assert(object(c) && (c.ownerId === "$actor" || realmStableId(c.ownerId)) && realmStableId(c.resourceId) && Number.isFinite(c.amount) && c.amount > 0 && c.amount <= Number.MAX_SAFE_INTEGER, "Invalid realm cost.");
    return costs;
}

export function validateRealmBoundaryRule(rule) {
    validateRealmJson(rule);
    assert(object(rule) && realmStableId(rule.id) && realmNatural(rule.revision) && rule.revision > 0, "Invalid realm boundary rule.");
    ids(rule.operations, "boundary operations", REALM_OPERATIONS);
    assert(rule.operations.length > 0, "Boundary needs a supported operation.");
    if (rule.bodyForms != null) ids(rule.bodyForms, "body forms");
    for (const key of ["sourceId", "methodId", "authorityId", "anchorId"]) if (rule[key] != null) assert(realmStableId(rule[key]), `Invalid boundary ${key}.`);
    assert(!rule.methodId || rule.sourceId, "A required method needs its actual source.");
    validateRealmCosts(rule.costs ?? []);
    assert(rule.exceptions == null || Array.isArray(rule.exceptions), "Invalid boundary exceptions.");
    const seen = new Set();
    for (const e of rule.exceptions || []) {
        assert(realmStableId(e.id) && !seen.has(e.id) && realmStableId(e.sourceId) && realmStableId(e.methodId), "Invalid or duplicate boundary exception.");
        seen.add(e.id); ids(e.operations, "exception operations", REALM_OPERATIONS); ids(e.bypass, "exception bypass", bypasses);
        if (e.bodyForms != null) ids(e.bodyForms, "exception body forms");
        if (e.costs != null) validateRealmCosts(e.costs);
        if (e.duration != null) assert(realmNatural(e.duration), "Invalid exception duration.");
    }
    return rule;
}

export function validateRealmContext(context) {
    validateRealmJson(context);
    assert(object(context) && realmStableId(context.actorId) && realmNatural(context.sequence) && realmNatural(context.clock), "Realm planning needs an actual actor, sequence and played clock.");
    validateRealmEndpoint(context.endpoint);
    for (const key of ["sources", "resources", "anchors", "evidence"]) if (context[key] != null) assert(Array.isArray(context[key]) && context[key].length <= 256, `Invalid bounded ${key} snapshot.`);
    if (context.body != null) assert(realmStableId(context.body.id) && realmNatural(context.body.revision) && context.body.revision > 0 && realmStableId(context.body.form), "Invalid actual body reference.");
    for (const key of ["methodIds", "authorityIds", "knownBoundaryIds", "knownConnectionIds"]) if (context[key] != null) ids(context[key], key);
    const sources = new Set();
    for (const s of context.sources || []) {
        assert(realmStableId(s.id) && !sources.has(s.id) && realmStableId(s.ownerId) && realmNatural(s.revision) && s.revision > 0 && typeof s.owned === "boolean" && typeof s.active === "boolean" && typeof s.suppressed === "boolean", "Invalid actual operating source.");
        sources.add(s.id); ids(s.operations, "source operations", REALM_OPERATIONS); ids(s.bodyForms, "source body support");
        if (s.availableAt != null) assert(realmNatural(s.availableAt), "Invalid source recovery time.");
        if (s.expiresAt != null) assert(realmNatural(s.expiresAt), "Invalid source expiry.");
        if (s.sharedPresenceSupport != null) assert(typeof s.sharedPresenceSupport === "boolean", "Invalid source presence support.");
    }
    const resources = new Set();
    for (const r of context.resources || []) {
        const key = JSON.stringify([r.ownerId, r.resourceId]);
        assert(realmStableId(r.ownerId) && realmStableId(r.resourceId) && !resources.has(key) && Number.isFinite(r.amount) && r.amount >= 0 && r.amount <= Number.MAX_SAFE_INTEGER, "Invalid or duplicated actual resource.");
        resources.add(key);
    }
    const anchors = new Set();
    for (const a of context.anchors || []) {
        assert(realmStableId(a.id) && !anchors.has(a.id) && realmNatural(a.revision) && a.revision > 0 && typeof a.available === "boolean", "Invalid or duplicate anchor support."); anchors.add(a.id);
    }
    if (context.presenceIds != null) ids(context.presenceIds, "presence IDs");
    for (const e of context.evidence || []) {
        assert(realmStableId(e.id) && realmStableId(e.recipientId) && realmNatural(e.at) && e.at <= context.clock && ["observation", "report", "recollection", "inference", "instruction"].includes(e.kind) && typeof e.text === "string", "Invalid attributed realm evidence.");
        for (const key of ["connectionSnapshot", "boundarySnapshot"]) if (e[key] != null) assert(object(e[key]) && realmNatural(e[key].revision) && e[key].revision > 0 && (key !== "connectionSnapshot" || typeof e[key].open === "boolean"), "Invalid witnessed realm snapshot.");
    }
    return context;
}

const supportedSource = (context, sourceId, operation) => (context.sources || []).find(s => s.id === sourceId && s.ownerId === context.actorId && s.owned && s.active && !s.suppressed && (s.availableAt == null || s.availableAt <= context.clock) && (s.expiresAt == null || s.expiresAt > context.clock) && s.operations.includes(operation) && context.body && s.bodyForms.includes(context.body.form));

// One explicitly chosen exception supplies actual alternative means. No rank math.
export function evaluateRealmBoundary(rule, context, operation, exceptionId = null) {
    validateRealmBoundaryRule(rule); validateRealmContext(context);
    assert(REALM_OPERATIONS.includes(operation), "Unsupported realm operation.");
    const reasons = [], selected = exceptionId == null ? null : (rule.exceptions || []).find(e => e.id === exceptionId && e.operations.includes(operation));
    if (exceptionId != null && !selected) reasons.push("That boundary exception is not registered for this operation.");
    const exceptionSource = selected && supportedSource(context, selected.sourceId, operation);
    const exceptionReady = !!(exceptionSource && (context.methodIds || []).includes(selected.methodId));
    if (selected && !exceptionReady) reasons.push("The selected exception lacks its acquired method, body support or operating source.");
    const exception = exceptionReady ? selected : null, bypass = exception?.bypass || [];
    if (!rule.operations.includes(operation) && !bypass.includes("operation")) reasons.push("This boundary does not admit that operation.");
    if (context.life !== "alive") reasons.push("The acting person's current life does not support this use.");
    if (!context.body) reasons.push("This operation needs a supported actual body or vessel.");
    const forms = exception?.bodyForms || rule.bodyForms;
    if (forms && !forms.includes(context.body?.form)) reasons.push("The current body is incompatible with this boundary.");
    if (rule.sourceId && !bypass.includes("source") && !supportedSource(context, rule.sourceId, operation)) reasons.push("The required operating source or body support is unavailable.");
    if (rule.methodId && !bypass.includes("method") && !(context.methodIds || []).includes(rule.methodId)) reasons.push("The required execution method has not been acquired.");
    if (rule.authorityId && !bypass.includes("authority") && !(context.authorityIds || []).includes(rule.authorityId)) reasons.push("The required scoped authority is absent.");
    if (rule.anchorId && !bypass.includes("anchor") && !(context.anchors || []).some(a => a.id === rule.anchorId && a.available)) reasons.push("The actual boundary anchor is unavailable.");
    const costs = (exception?.costs || rule.costs || []).map(c => ({...c, ownerId: c.ownerId === "$actor" ? context.actorId : c.ownerId}));
    return {allowed: reasons.length === 0, reasons, costs, exceptionId: exception?.id || null, bypass: [...bypass], sourceRef: exceptionSource && exception ? {id: exceptionSource.id, revision: exceptionSource.revision} : rule.sourceId ? (() => { const s = (context.sources || []).find(s => s.id === rule.sourceId); return s ? {id: s.id, revision: s.revision} : null; })() : null, duration: exception?.duration ?? null};
}

// Aggregate debits before checking means so two costs cannot spend one reserve twice.
export function quoteRealmCosts(costs, context) {
    validateRealmContext(context); validateRealmCosts(costs);
    const totals = new Map();
    for (const c of costs) {
        const ownerId = c.ownerId === "$actor" ? context.actorId : c.ownerId, key = JSON.stringify([ownerId, c.resourceId]);
        const total = totals.get(key) || {ownerId, resourceId: c.resourceId, amount: 0};
        total.amount += c.amount; assert(Number.isFinite(total.amount) && total.amount <= Number.MAX_SAFE_INTEGER, "Realm cost overflow."); totals.set(key, total);
    }
    const reasons = [], resolved = [...totals.values()];
    for (const c of resolved) {
        const r = (context.resources || []).find(r => r.ownerId === c.ownerId && r.resourceId === c.resourceId);
        if (!r || r.amount < c.amount) reasons.push(`The actual ${c.resourceId} reserve cannot pay this use.`);
        if (c.ownerId !== context.actorId && !(context.authorityIds || []).includes(`spend.${c.ownerId}.${c.resourceId}`)) reasons.push("Spending another owner's reserve needs an actual authorization.");
    }
    return {allowed: !reasons.length, reasons, costs: resolved};
}

// Public inspection does not disclose rules, exceptions or identity from registry IDs.
export function realmBoundaryView(rule, context) {
    validateRealmBoundaryRule(rule); validateRealmContext(context);
    if (!(context.knownBoundaryIds || []).includes(rule.id)) return {visible: false};
    const known = (context.evidence || []).filter(e => e.boundaryId === rule.id && e.recipientId === context.actorId);
    const latest = [...known].filter(e => e.boundarySnapshot).sort((a, b) => b.at - a.at || b.id.localeCompare(a.id))[0];
    return {visible: true, id: rule.id, knownRevision: latest?.boundarySnapshot.revision ?? null, observedAt: latest?.at ?? null, observations: structuredClone(known.map(e => ({id: e.id, at: e.at, kind: e.kind, text: e.text})))};
}
