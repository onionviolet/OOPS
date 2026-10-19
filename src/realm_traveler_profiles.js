// Detached, unverified traveler prototype. Snapshots refer to actual owners;
// returned intents are NOT registered simulation effects or native commands.
// No imports, DOM, timers, stock mutation, save owner, origin reset or enrollment.
import {check as assert, copy, natural, positive} from './basics.js';
export const REALM_TRAVELER_SCHEMA = 1;
export const REALM_TRAVELER_MODES = Object.freeze(["physical", "projection", "alternate_body", "shared_body"]);

const object = value => value !== null && typeof value === "object" && !Array.isArray(value) &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
const id = value => typeof value === "string" && /^[a-z][a-z0-9_.:-]*$/i.test(value) &&
    !["__proto__", "constructor", "prototype"].includes(value);
const amount = value => Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
const sameEndpoint = (a, b) => ["worldId", "instanceId", "regionId", "layerId"].every(key => a[key] === b[key]);
const ref = (domain, value) => ({domain, id: value.id, revision: value.revision});

function json(value, ancestors = new Set(), depth = 0) {
    assert(depth < 32, "Traveler data exceeds the supported JSON depth.");
    if (value === null || typeof value === "string" || typeof value === "boolean") return;
    if (typeof value === "number") { assert(Number.isFinite(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER, "Invalid traveler number."); return; }
    assert(Array.isArray(value) || object(value), "Traveler data must be plain JSON.");
    assert(!ancestors.has(value), "Traveler data contains a cycle.");
    const keys = Reflect.ownKeys(value), descriptors = Object.getOwnPropertyDescriptors(value);
    assert(keys.every(key => typeof key === "string"), "Traveler JSON cannot contain symbol keys.");
    if (Array.isArray(value)) assert(keys.length === value.length + 1 && keys.every(key => key === "length" ||
        /^(0|[1-9][0-9]*)$/.test(key) && Number(key) < value.length), "Traveler arrays must be dense JSON arrays.");
    ancestors.add(value);
    for (const key of keys) {
        if (Array.isArray(value) && key === "length") continue;
        const descriptor = descriptors[key];
        assert(Object.hasOwn(descriptor, "value") && descriptor.enumerable, "Traveler JSON cannot invoke getters or hide properties.");
        assert(!["__proto__", "constructor", "prototype"].includes(key), "Unsafe traveler key.");
        json(descriptor.value, ancestors, depth + 1);
    }
    ancestors.delete(value);
}
function ids(values, label) {
    assert(Array.isArray(values) && values.every(id) && new Set(values).size === values.length, `Invalid ${label} IDs.`);
}
function records(values, label) {
    assert(Array.isArray(values), `Supply ${label} records.`);
    ids(values.map(value => value?.id), label);
    for (const value of values) assert(object(value) && positive(value.revision), `Invalid ${label} revision.`);
    return new Map(values.map(value => [value.id, value]));
}
function endpoint(value) {
    assert(object(value) && Object.keys(value).length === 4 &&
        ["worldId", "instanceId", "regionId", "layerId"].every(key => id(value[key])), "Supply all four traveler endpoint IDs.");
}
function ownerRef(value) {
    assert(object(value) && id(value.domain) && id(value.id) && positive(value.revision), "Invalid authoritative owner reference.");
}
function body(value) {
    assert(object(value) && id(value.id) && positive(value.revision) && id(value.ownerId) &&
        id(value.identityId) && id(value.mindId) && id(value.form), "Invalid actual body reference.");
    endpoint(value.endpoint); ownerRef(value.conditionRef);
    assert(["alive", "incapacitated", "dead", "departed"].includes(value.life) && typeof value.available === "boolean", "Declare actual body life and availability.");
    ids(value.functions, "body function"); ids(value.poolIds, "body pool");
}

/** A read snapshot, never a new persistent character/inventory/resource owner. */
export function validateRealmTraveler(profile) {
    json(profile);
    assert(object(profile) && profile.schema === REALM_TRAVELER_SCHEMA && id(profile.id) &&
        positive(profile.revision) && id(profile.actorId), "Invalid traveler snapshot.");
    ownerRef(profile.identityRef); ownerRef(profile.mindRef);
    const bodies = records(profile.bodies, "body"), pools = records(profile.pools, "pool");
    assert(bodies.has(profile.currentBodyId), "Bind the traveler's existing current body.");
    const conditions = new Set();
    for (const b of bodies.values()) {
        body(b);
        assert(b.ownerId === profile.actorId && b.identityId === profile.identityRef.id && b.mindId === profile.mindRef.id,
            "A traveler body must reference its one actual identity and mind.");
        assert(b.poolIds.every(poolId => pools.has(poolId)), "Body references a missing resource pool.");
        const key = JSON.stringify([b.conditionRef.domain, b.conditionRef.id]);
        assert(!conditions.has(key), "Independent bodies need independent condition/vital owners."); conditions.add(key);
    }
    const poolOwners = new Set();
    for (const p of pools.values()) {
        assert(id(p.ownerId), "Bind the actual resource owner.");
        ownerRef(p.ownerRef);
        const key = JSON.stringify([p.ownerRef.domain, p.ownerRef.id]);
        assert(!poolOwners.has(key), "Two pool snapshots cannot alias the same actual reserve owner."); poolOwners.add(key);
        ids(p.balances?.map(balance => balance.resourceId), "pool resource");
        assert(p.balances.every(balance => amount(balance.amount)), "Invalid current fuel snapshot.");
    }
    const sources = records(profile.sources, "source"), methods = records(profile.methods, "method");
    for (const s of sources.values()) {
        assert(s.ownerId === profile.actorId && [s.acquired, s.active, s.suppressed].every(value => typeof value === "boolean"), "Declare source acquisition and operating state.");
        ids(s.bodyIds, "source body"); ids(s.supportIds, "source support"); ids(s.intrinsicControlIds, "intrinsic source control");
        assert(s.intrinsicControlIds.every(supportId => s.supportIds.includes(supportId)) && natural(s.availableAt) &&
            (s.expiresAt === null || natural(s.expiresAt) && s.expiresAt > s.availableAt), "Declare actual source availability and intrinsic control support.");
        assert(s.bodyIds.every(bodyId => bodies.has(bodyId)), "Source references an unbound existing body.");
    }
    for (const m of methods.values()) {
        assert(m.ownerId === profile.actorId && ["fragment", "learned"].includes(m.stage), "Declare actual learned-method ownership.");
        assert(m.sourceId === null || sources.has(m.sourceId), "Method references an unbound source.");
    }
    for (const memory of records(profile.memories, "memory").values()) {
        assert(memory.ownerId === profile.actorId && ["role", "experience", "description"].includes(memory.kind) &&
            id(memory.subjectId) && memory.stage === "remembered", "Invalid remembered information.");
    }
    const embodiment = profile.embodiment;
    assert(object(embodiment) && ["single", "exclusive", "shared"].includes(embodiment.mode), "Declare the embodiment policy.");
    if (embodiment.mode === "single") assert(bodies.size === 1 && embodiment.sourceId === null && embodiment.supportId === null, "A single-body profile cannot silently share a mind.");
    else {
        const source = sources.get(embodiment.sourceId);
        assert(source && source.acquired && source.supportIds.includes(embodiment.supportId) &&
            [...bodies.keys()].every(bodyId => source.bodyIds.includes(bodyId)), "Multiple bodies need a named acquired embodiment source for each actual body.");
        if (embodiment.mode === "exclusive") {
            const poolIds = [...bodies.values()].flatMap(b => b.poolIds);
            assert(new Set(poolIds).size === poolIds.length, "An exclusive alternate-body policy preserves independent resources.");
        }
    }
    const obligations = records(profile.obligations, "obligation");
    for (const o of obligations.values()) {
        assert(o.ownerId === profile.actorId && ["active", "fulfilled"].includes(o.state) &&
            (o.bodyId === null || bodies.has(o.bodyId)) && typeof o.kind === "string", "Invalid traveler obligation.");
        ids(o.blocksModes, "obligation mode"); assert(o.blocksModes.every(mode => REALM_TRAVELER_MODES.includes(mode)), "Unsupported obligation mode.");
        ownerRef(o.ownerRef);
    }
    const stockRecords = new Set();
    for (const c of records(profile.cargo, "cargo").values()) {
        assert(id(c.ownerId) && bodies.has(c.holderBodyId) && typeof c.itemKey === "string" && c.itemKey.length > 0 &&
            positive(c.count) && ["owned", "loaned"].includes(c.kind), "Invalid held cargo snapshot.");
        ownerRef(c.stockRef);
        const stockKey = JSON.stringify([c.stockRef.domain, c.stockRef.id, c.itemKey]);
        assert(!stockRecords.has(stockKey), "Two cargo records cannot duplicate the same held stock."); stockRecords.add(stockKey);
        if (c.kind === "owned") assert(c.ownerId === profile.actorId && c.loan === null, "Owned cargo must retain its actual owner.");
        else {
            const loan = c.loan;
            assert(object(loan) && id(loan.id) && positive(loan.revision) && loan.lenderId === c.ownerId &&
                c.ownerId !== profile.actorId && obligations.has(loan.obligationId) &&
                (loan.expiresAt === null || natural(loan.expiresAt)), "Loaned cargo needs its actual lender and return obligation.");
            assert(Array.isArray(loan.destinations), "Declare loan passage permission."); loan.destinations.forEach(endpoint);
        }
    }
    const companions = records(profile.companions, "companion");
    ids([...companions.values()].map(c => c.actorId), "companion actor");
    ids([...companions.values()].map(c => c.body?.id), "companion body");
    ids([...companions.values()].map(c => c.body?.identityId), "companion identity");
    ids([...companions.values()].map(c => c.body?.mindId), "companion mind");
    for (const c of companions.values()) {
        assert(id(c.actorId) && c.actorId !== profile.actorId, "A companion retains a separate person identity.");
        body(c.body); assert(c.body.ownerId === c.actorId, "Companion body belongs to the companion.");
        assert(!bodies.has(c.body.id) && c.body.identityId !== profile.identityRef.id && c.body.mindId !== profile.mindRef.id,
            "Companion travel cannot absorb a body, identity or mind into the traveler.");
        const conditionKey = JSON.stringify([c.body.conditionRef.domain, c.body.conditionRef.id]);
        assert(!conditions.has(conditionKey), "Companion bodies retain independent condition/vital owners."); conditions.add(conditionKey);
        if (c.consent !== null) {
            const consent = c.consent;
            assert(object(consent) && id(consent.id) && positive(consent.revision) && consent.actorId === c.actorId &&
                typeof consent.granted === "boolean" && REALM_TRAVELER_MODES.includes(consent.mode) &&
                (consent.expiresAt === null || natural(consent.expiresAt)), "Invalid companion consent.");
            endpoint(consent.from); endpoint(consent.to);
        }
    }
    return true;
}

function costs(values) {
    assert(Array.isArray(values), "Declare support costs explicitly.");
    for (const c of values) assert(id(c.poolId) && id(c.resourceId) && amount(c.amount) && c.amount > 0, "Invalid source-qualified cost.");
}
export function validateRealmTravelerSupport(support) {
    json(support);
    assert(object(support) && id(support.id) && positive(support.revision) && id(support.sourceId) && (support.methodId === null || id(support.methodId)) &&
        ["projection", "alternate_body", "shared_body"].includes(support.mode) && positive(support.maxBodies), "Invalid traveler support definition.");
    for (const key of ["originForms", "arrivalForms", "requiredFunctions", "grantedFunctions", "poolIds", "sharedSourceIds"])
        ids(support[key], `support ${key}`);
    assert(support.originForms.length && support.arrivalForms.length, "Define actual body compatibility.");
    costs(support.setupCosts); costs(support.sustainCosts);
    assert([...support.setupCosts, ...support.sustainCosts].every(c => support.poolIds.includes(c.poolId)), "Support cannot spend an undeclared shared/independent pool.");
    assert(typeof support.material === "boolean" && typeof support.permitsCargoTransfer === "boolean", "Declare material presence and actual cargo support.");
    assert(support.mode !== "projection" || !support.material && !support.permitsCargoTransfer, "An information projection cannot carry physical stock.");
    assert(support.mode === "projection" || support.material, "Alternate/shared bodies need material support.");
    assert(support.mode !== "alternate_body" || support.sharedSourceIds.length === 0 && support.manifestations.length === 0,
        "An existing alternate-body switch cannot grant shared faculties or new manifestations.");
    for (const m of records(support.manifestations, "source manifestation").values()) {
        assert(m.kind === "attribute" && m.sourceId === support.sourceId, "A manifestation is source output, never duplicated held gear."); ids(m.functions, "manifestation function");
    }
    return true;
}

function validateInputs(context, request) {
    json(context); json(request);
    assert(object(context) && natural(context.sequence) && natural(context.clock), "Supply the joined played clock and durable sequence.");
    assert(object(request) && REALM_TRAVELER_MODES.includes(request.mode) && id(request.bodyId) &&
        positive(request.expectedRevision) && natural(request.expectedSequence) && natural(request.duration), "Invalid traveler request.");
    assert(natural(context.clock + request.duration), "Traveler duration exceeds the joined clock."); endpoint(request.to);
    ids(request.cargoIds, "requested cargo"); ids(request.companionIds, "requested companion"); ids(request.presenceIds, "requested presence");
    assert(Array.isArray(request.presencePositions) && request.presencePositions.length === request.presenceIds.length,
        "Bind an actual arrival position for each new presence.");
    ids(request.presencePositions.map(p => p.presenceId), "position presence");
    assert(request.presencePositions.every(p => request.presenceIds.includes(p.presenceId) && id(p.positionId)), "Invalid presence-position binding.");
    if (request.mode === "physical") assert(request.presenceIds.length === 0 && request.targetBodyId === null && request.supportId === null, "Physical travel moves the existing body.");
    else if (request.mode === "alternate_body") assert(id(request.targetBodyId) && request.presenceIds.length === 0 && id(request.supportId), "Name the existing alternate body.");
    else assert(request.targetBodyId === null && request.presenceIds.length > 0 && id(request.supportId) && id(request.presenceForm), "Name source-qualified new presences.");
    const supports = records(context.supports, "support"); supports.forEach(validateRealmTravelerSupport);
    assert(Array.isArray(context.ownerBindings) && Array.isArray(context.stockBindings), "Supply actual owner/stock binding snapshots.");
    const owners = new Set(), stocks = new Set();
    for (const binding of context.ownerBindings) {
        ownerRef(binding); assert(id(binding.ownerId) && typeof binding.available === "boolean", "Invalid actual owner binding.");
        const key = JSON.stringify([binding.domain, binding.id]);
        assert(!owners.has(key), "Duplicate actual owner binding."); owners.add(key);
    }
    for (const binding of context.stockBindings) {
        ownerRef(binding.stockRef);
        assert(id(binding.ownerId) && id(binding.holderBodyId) && typeof binding.itemKey === "string" &&
            binding.itemKey.length > 0 && positive(binding.count), "Invalid actual stock binding.");
        const key = JSON.stringify([binding.stockRef.domain, binding.stockRef.id, binding.itemKey]);
        assert(!stocks.has(key), "Duplicate actual stock binding."); stocks.add(key);
    }
    const access = context.access;
    if (access !== null) {
        assert(object(access) && id(access.id) && positive(access.revision) && id(access.actorId) && id(access.bodyId) &&
            natural(access.sequence) && natural(access.duration) && REALM_TRAVELER_MODES.includes(access.mode) && typeof access.allowed === "boolean" &&
            (access.expiresAt === null || natural(access.expiresAt)), "Invalid host boundary-access snapshot.");
        endpoint(access.from); endpoint(access.to);
        for (const key of ["cargoIds", "companionIds", "presenceIds"]) ids(access[key], `access ${key}`);
        assert(Array.isArray(access.presencePositions), "Supply boundary-qualified presence positions.");
        ids(access.presencePositions.map(p => p.presenceId), "access position presence");
        assert(access.presencePositions.length === access.presenceIds.length &&
            access.presencePositions.every(p => access.presenceIds.includes(p.presenceId) && id(p.positionId)), "Invalid access-position binding.");
        assert(Array.isArray(access.reasons) && access.reasons.every(reason => typeof reason === "string"), "Supply boundary denial reasons.");
    }
}

function nativeBindings(profile, plan) {
    const binding = (domain, owner, purpose, refs) => ({domain, owner, purpose, refs: copy(refs)});
    return [
        binding("actor_identity_and_mind", "src/native_gameplay_adapter.js", "Read the one actor/identity/controller; do not create a replacement player.", [profile.identityRef, profile.mindRef]),
        binding("body_instances", "Engine GM: native body adapter required", "Bind independent position, senses, condition/vitals and legal actions for every material body.",
            plan.bodyRefs.concat(plan.requestedPresenceIds.map(presenceId => ({id: presenceId, pendingNativeBinding: true})))),
        binding("boundary_access", "src/realm_connections.js + src/realm_boundary_rules.js", "Reconcile the exact operation, endpoints, admissions and boundary costs before publication.", plan.accessRef ? [plan.accessRef] : []),
        binding("resource_pools_and_sources", "src/energy_resources.js + src/simulation.js", "Bind pools once; aggregate these source costs with route/native costs; reserve source, control and common-clock sustain.", plan.supportRefs),
        binding("cargo_and_consent", "src/native_storage_transaction.js + src/simulation.js", "Move actual stock/custody, keep each held weapon singular, and validate consenting independent companions.", plan.cargoRefs.concat(plan.companionRefs)),
        binding("durable_publication", "src/expansion_persistence.js + src/gameplay_publication.js", "Revalidate all guards, settle one receipt, apply together, and preserve obligations on interruption/return.", plan.guards)
    ];
}

/** Eligibility from supplied actual snapshots; it never commits or enforces physiology. */
export function previewRealmTraveler(profile, context, request) {
    validateRealmTraveler(profile); validateInputs(context, request);
    const plan = {schema: 1, implementationStatus: "implemented_unverified", nativeExecutable: false, allowed: false, eligible: false,
        travelerId: profile.id, actorId: profile.actorId, mode: request.mode, expectedSequence: context.sequence,
        duration: request.duration, reasons: [], costs: [], costScope: "traveler_source_only", requestedPresenceIds: copy(request.presenceIds),
        accessRef: null, bodyRefs: [], cargoRefs: [], companionRefs: [], supportRefs: [], guards: [ref("traveler_snapshot", profile),
            copy(profile.identityRef), copy(profile.mindRef)], support: null, arrival: null, intents: [],
        retained: {identityRef: copy(profile.identityRef), mindRef: copy(profile.mindRef), memoryRefs: profile.memories.map(m => ref("memory", m)),
            methodRefs: profile.methods.map(m => ref("method", m)), sourceRefs: profile.sources.map(s => ref("source", s)),
            obligations: profile.obligations.map(o => ({...ref("obligation", o), ownerRef: copy(o.ownerRef), state: o.state})),
            homeBodies: [], resourcePoolRefs: profile.pools.map(p => ref("resource_pool", p))},
        requiredNativeBindings: [], receiptKey: `traveler:${profile.actorId}:${context.sequence}:${profile.id}:${profile.revision}`};
    const reason = text => plan.reasons.push(text), guard = (domain, value) => plan.guards.push(ref(domain, value));
    const sourceReady = source => source && source.acquired && source.active && !source.suppressed &&
        source.availableAt <= context.clock && (source.expiresAt === null || context.clock + request.duration < source.expiresAt);
    const actualOwner = (owner, actorId) => {
        const binding = context.ownerBindings.find(b => b.domain === owner.domain && b.id === owner.id);
        if (!binding || binding.revision !== owner.revision || binding.ownerId !== actorId || !binding.available)
            reason("The actual owner binding is absent, stale or belongs to another actor.");
    };
    actualOwner(profile.identityRef, profile.actorId); actualOwner(profile.mindRef, profile.actorId);
    const current = profile.bodies.find(b => b.id === request.bodyId);
    if (request.expectedRevision !== profile.revision || request.expectedSequence !== context.sequence) reason("The traveler request is stale.");
    if (!current || request.bodyId !== profile.currentBodyId) reason("Use the actual currently controlled body.");
    if (current && (current.life !== "alive" || !current.available)) reason("The current body is unavailable for this use.");
    if (current) { guard("body", current); plan.guards.push(copy(current.conditionRef)); actualOwner(current.conditionRef, profile.actorId); plan.bodyRefs.push(ref("body", current)); }
    const access = context.access;
    if (!access) reason("An actual boundary-access plan is required.");
    else {
        plan.accessRef = ref("boundary_access", access); guard("boundary_access", access);
        if (!access.allowed) reason(access.reasons.join(" ") || "The boundary does not support this use.");
        if (access.actorId !== profile.actorId || access.bodyId !== request.bodyId || access.sequence !== context.sequence ||
            access.mode !== request.mode || access.duration !== request.duration || !current ||
            !sameEndpoint(access.from, current.endpoint) || !sameEndpoint(access.to, request.to))
            reason("Boundary support belongs to a different body, operation, endpoint or sequence.");
        if (access.expiresAt !== null && context.clock + request.duration >= access.expiresAt) reason("The access expires before this planned use completes.");
    }
    if (request.mode === "physical" && current && !current.functions.includes("travel.physical")) reason("This body has no actual physical-passage function.");
    let support = null, source = null, target = null;
    if (request.mode !== "physical") {
        support = context.supports.find(s => s.id === request.supportId);
        if (!support || support.mode !== request.mode) reason("Select a defined source-qualified support for this mode.");
        else {
            source = profile.sources.find(s => s.id === support.sourceId);
            const method = profile.methods.find(m => m.id === support.methodId);
            guard("traveler_support", support); plan.supportRefs.push(ref("traveler_support", support));
            if (!sourceReady(source) || !source.bodyIds.includes(request.bodyId) || !source.supportIds.includes(support.id))
                reason("The actual acquired source cannot supply this support now.");
            if (support.methodId === null) {
                if (!source?.intrinsicControlIds.includes(support.id)) reason("The acquired source does not supply this intrinsic execution guidance.");
            } else if (!method || method.stage !== "learned" || method.sourceId !== support.sourceId)
                reason("Remembered roles/descriptions do not supply the learned execution method.");
            if (source) { guard("source", source); plan.supportRefs.push(ref("source", source)); }
            if (method) { guard("method", method); plan.supportRefs.push(ref("method", method)); }
            if (!current || !support.originForms.includes(current.form) || !support.requiredFunctions.every(f => current.functions.includes(f)))
                reason("The current body's actual functions do not support this method.");
            if (request.mode === "alternate_body") {
                target = profile.bodies.find(b => b.id === request.targetBodyId);
                if (profile.embodiment.mode !== "exclusive" || profile.embodiment.sourceId !== support.sourceId || profile.embodiment.supportId !== support.id ||
                    !target || target.id === request.bodyId || target.life !== "alive" || !target.available || !source?.bodyIds.includes(target.id) ||
                    !sameEndpoint(target.endpoint, request.to) || !support.arrivalForms.includes(target.form))
                    reason("The alternate-body switch needs an available existing independently resourced body under its defined exclusive control policy.");
                if (target) { guard("body", target); plan.guards.push(copy(target.conditionRef)); actualOwner(target.conditionRef, profile.actorId); plan.bodyRefs.push(ref("body", target)); }
            } else {
                if (!support.arrivalForms.includes(request.presenceForm)) reason("This source cannot supply the requested presence form.");
                if (profile.bodies.length + request.presenceIds.length > support.maxBodies) reason("This source's declared simultaneous-body support is exceeded.");
                const usedIds = [profile.identityRef.id, profile.mindRef.id, ...profile.bodies.map(b => b.id), ...profile.companions.map(c => c.body.id)];
                if (request.presenceIds.some(presenceId => usedIds.includes(presenceId))) reason("A new presence must not replace an existing body, identity or mind.");
                if (access && request.presenceIds.some(presenceId => !access.presenceIds.includes(presenceId))) reason("Boundary support does not admit every requested presence.");
                if (access && request.presencePositions.some(p => !access.presencePositions.some(a => a.presenceId === p.presenceId && a.positionId === p.positionId)))
                    reason("A requested body's independent position lacks actual boundary support.");
            }
            for (const sourceId of support.sharedSourceIds) {
                const shared = profile.sources.find(s => s.id === sourceId);
                if (!sourceReady(shared) || !shared.bodyIds.includes(request.bodyId)) reason("A declared shared faculty is unavailable.");
                else { guard("source", shared); plan.supportRefs.push(ref("source", shared)); }
            }
            plan.support = {definitionRef: ref("traveler_support", support), sourceRef: source ? ref("source", source) : null,
                learnedMethodRef: method ? ref("method", method) : null, mindPolicy: request.mode === "alternate_body" ? "exclusive_control" : "one_shared_mind",
                controlPolicy: support.methodId === null ? "intrinsic_source_guidance" : "learned_method",
                poolPolicy: request.mode === "alternate_body" ? "retain_independent_body_pools" : "one_declared_shared_pool_set",
                poolRefs: [], sharedSourceRefs: support.sharedSourceIds.flatMap(sourceId => {
                    const actual = profile.sources.find(s => s.id === sourceId); return actual ? [ref("source", actual)] : [];
                }),
                material: support.material, functions: copy(support.grantedFunctions)};
            for (const poolId of support.poolIds) {
                const pool = profile.pools.find(p => p.id === poolId);
                if (!pool || pool.ownerId !== profile.actorId || !current?.poolIds.includes(poolId)) reason("The source lacks its actual authorized resource pool.");
                if (pool) { guard("resource_pool", pool); plan.guards.push(copy(pool.ownerRef)); actualOwner(pool.ownerRef, pool.ownerId);
                    plan.support.poolRefs.push(ref("resource_pool", pool)); plan.supportRefs.push(ref("resource_pool", pool)); }
            }
            const totals = new Map(), count = Math.max(1, request.presenceIds.length);
            for (const [values, factor] of [[support.setupCosts, count], [support.sustainCosts, count * request.duration]]) {
                for (const c of values) {
                    const key = JSON.stringify([c.poolId, c.resourceId]), previous = totals.get(key) || {poolId: c.poolId, resourceId: c.resourceId, amount: 0};
                    previous.amount += c.amount * factor; assert(amount(previous.amount), "Traveler cost overflow."); totals.set(key, previous);
                }
            }
            for (const c of totals.values()) {
                if (c.amount === 0) continue;
                const pool = profile.pools.find(p => p.id === c.poolId), balance = pool?.balances.find(b => b.resourceId === c.resourceId);
                plan.costs.push({...c, ownerId: pool?.ownerId || profile.actorId, poolRevision: pool?.revision || null});
                if (!balance || balance.amount < c.amount) reason(`The one actual ${c.resourceId} pool cannot fund this use.`);
            }
        }
    }
    // An already shared/exclusive profile also needs its operative controller.
    if (profile.embodiment.mode !== "single") {
        const embodimentSource = profile.sources.find(s => s.id === profile.embodiment.sourceId);
        const embodimentSupport = context.supports.find(s => s.id === profile.embodiment.supportId);
        if (!sourceReady(embodimentSource) || !embodimentSupport || embodimentSupport.sourceId !== embodimentSource.id ||
            embodimentSupport.mode !== (profile.embodiment.mode === "shared" ? "shared_body" : "alternate_body")) reason("The multiple-body control policy is unsupported now.");
        if (embodimentSupport && embodimentSource) {
            const method = profile.methods.find(m => m.id === embodimentSupport.methodId);
            if (embodimentSupport.methodId === null ? !embodimentSource.intrinsicControlIds.includes(embodimentSupport.id) :
                !method || method.stage !== "learned" || method.sourceId !== embodimentSource.id)
                reason("The actual multiple-body controller lacks learned or intrinsic execution support.");
            if (profile.bodies.length > embodimentSupport.maxBodies || profile.embodiment.mode === "shared" &&
                profile.bodies.some(b => !embodimentSupport.poolIds.every(poolId => b.poolIds.includes(poolId))))
                reason("The existing bodies do not match their explicit simultaneous-body/shared-pool support.");
            if (method) guard("method", method);
        }
        if (embodimentSource) guard("source", embodimentSource);
        if (embodimentSupport) guard("traveler_support", embodimentSupport);
    }
    if (request.mode === "physical" && profile.cargo.some(c => c.holderBodyId === request.bodyId && !request.cargoIds.includes(c.id)))
        reason("Admit every actually held cargo record, or leave it in actual custody before physical travel.");
    const carried = [];
    for (const cargoId of request.cargoIds) {
        const cargo = profile.cargo.find(c => c.id === cargoId);
        if (!cargo || cargo.holderBodyId !== request.bodyId) { reason("Selected cargo is not held by the departing body."); continue; }
        guard("cargo", cargo); plan.cargoRefs.push(ref("cargo", cargo)); plan.guards.push(copy(cargo.stockRef));
        const stock = context.stockBindings.find(s => s.stockRef.domain === cargo.stockRef.domain && s.stockRef.id === cargo.stockRef.id && s.itemKey === cargo.itemKey);
        if (!stock || stock.stockRef.revision !== cargo.stockRef.revision || stock.ownerId !== cargo.ownerId ||
            stock.holderBodyId !== cargo.holderBodyId || stock.count !== cargo.count) reason("The selected cargo differs from its actual owned/loaned stock binding.");
        if (!access?.cargoIds.includes(cargoId)) reason("Boundary support does not admit this actual cargo.");
        if (request.mode !== "physical" && !(request.mode === "shared_body" && support?.permitsCargoTransfer && request.presenceIds.length === 1))
            reason("This mode has no defined one-owner physical cargo transfer.");
        if (cargo.loan) {
            guard("loan", cargo.loan);
            if (!cargo.loan.destinations.some(to => sameEndpoint(to, request.to)) ||
                cargo.loan.expiresAt !== null && context.clock + request.duration >= cargo.loan.expiresAt)
                reason("The lender's permission does not cover this destination or duration.");
        }
        carried.push({...ref("cargo", cargo), stockRef: copy(cargo.stockRef), itemKey: cargo.itemKey, count: cargo.count,
            ownerId: cargo.ownerId, fromBodyId: cargo.holderBodyId, toBodyId: request.mode === "physical" ? request.bodyId : request.presenceIds[0],
            loanRef: cargo.loan ? ref("loan", cargo.loan) : null, operation: "move_existing_stock"});
    }
    const companions = [];
    for (const companionId of request.companionIds) {
        const companion = profile.companions.find(c => c.id === companionId);
        if (!companion) { reason("The selected companion has no actual person/body binding."); continue; }
        guard("companion", companion); guard("body", companion.body); plan.guards.push(copy(companion.body.conditionRef));
        actualOwner(companion.body.conditionRef, companion.actorId);
        plan.companionRefs.push(ref("companion", companion)); plan.bodyRefs.push(ref("body", companion.body));
        const consent = companion.consent;
        if (consent) guard("companion_consent", consent);
        if (request.mode !== "physical") reason("This prototype does not project or share a companion's body/mind.");
        if (!access?.companionIds.includes(companionId)) reason("Boundary support does not admit this companion.");
        if (!current || !sameEndpoint(companion.body.endpoint, current.endpoint) || companion.body.life !== "alive" ||
            !companion.body.available || !companion.body.functions.includes("travel.physical")) reason("The companion's actual body cannot make this passage.");
        if (!consent?.granted || consent.mode !== request.mode || !current || !sameEndpoint(consent.from, current.endpoint) ||
            !sameEndpoint(consent.to, request.to) || consent.expiresAt !== null && context.clock + request.duration >= consent.expiresAt)
            reason("The companion has not consented to this exact passage.");
        companions.push({actorId: companion.actorId, bodyRef: ref("body", companion.body), consentRef: consent ? ref("companion_consent", consent) : null,
            operation: "move_independent_person", to: copy(request.to), propertyPolicy: "retain_existing_companion_owner"});
    }
    for (const obligation of profile.obligations) {
        guard("obligation", obligation); plan.guards.push(copy(obligation.ownerRef));
        if (obligation.state === "active" && (obligation.bodyId === null || obligation.bodyId === request.bodyId) && obligation.blocksModes.includes(request.mode))
            reason("An active obligation prevents this operation; it is not erased by travel.");
    }
    plan.retained.homeBodies = profile.bodies.filter(b => request.mode === "physical" ? b.id !== request.bodyId :
        request.mode === "alternate_body" ? b.id !== request.targetBodyId : true).map(b =>
        ({bodyRef: ref("body", b), endpoint: copy(b.endpoint), conditionRef: copy(b.conditionRef), poolRefs: b.poolIds.map(poolId => ref("resource_pool", profile.pools.find(p => p.id === poolId)))}));
    plan.allowed = plan.eligible = plan.reasons.length === 0;
    if (plan.allowed) {
        const presences = request.presenceIds.map(presenceId => ({id: presenceId, form: request.presenceForm, material: support.material,
            positionId: request.presencePositions.find(p => p.presenceId === presenceId).positionId,
            endpoint: copy(request.to), identityRef: copy(profile.identityRef), mindRef: copy(profile.mindRef), poolRefs: copy(plan.support.poolRefs),
            sourceRefs: copy(plan.support.sharedSourceRefs), functions: copy(support.grantedFunctions),
            conditionPolicy: support.material ? "new_independent_body_owner_required" : "no_physical_vitals",
            heldCargoRefs: carried.filter(c => c.toBodyId === presenceId).map(c => ({id: c.id, revision: c.revision})),
            manifestations: support.manifestations.map(m => ({definitionRef: ref("source_manifestation", m), sourceId: m.sourceId, kind: "attribute", functions: copy(m.functions), createsInventoryItem: false}))}));
        plan.arrival = {endpoint: copy(request.to), existingBodyRef: request.mode === "physical" ? ref("body", current) : target ? ref("body", target) : null,
            presences, cargo: carried, companions};
        plan.intents.push({kind: request.mode === "physical" ? "move_existing_body" : request.mode === "alternate_body" ? "switch_existing_body_control" : "open_source_presence",
            actorId: profile.actorId, fromBodyRef: ref("body", current), targetBodyRef: target ? ref("body", target) : null,
            arrival: copy(plan.arrival), retainedHomeBodies: copy(plan.retained.homeBodies), mindPolicy: request.mode === "physical" ? "retain" : plan.support.mindPolicy});
        if (plan.costs.length) plan.intents.push({kind: "reserve_actual_pool_costs", costs: copy(plan.costs), duration: request.duration, clockOwner: "joined_played_clock"});
        if (request.mode !== "physical") plan.intents.push({kind: "bind_presence_termination", plannedUntil: context.clock + request.duration,
            requiresNativeResolution: true, retainsIdentity: true, retainsHomeBodies: true, cargoPolicy: "resolve_actual_custody_before_ending_material_body",
            interruptionPolicy: "revalidate_source_access_body_and_pool_without_implicit_refund_or_recall"});
        plan.intents.push({kind: "single_receipt", key: plan.receiptKey, grantsIdentity: false, grantsMethods: false, grantsHeldItems: false, grantsRewards: false});
    }
    plan.requiredNativeBindings = nativeBindings(profile, plan);
    json(plan); return plan;
}

export function planRealmProjection(profile, context, request) {
    assert(request && ["projection", "alternate_body", "shared_body"].includes(request.mode), "Choose projection or a source-qualified body mode.");
    return previewRealmTraveler(profile, context, request);
}

/** Other observers see only supplied attributed observations, never private means. */
export function realmTravelerView(profile, viewContext) {
    validateRealmTraveler(profile); json(viewContext);
    assert(object(viewContext) && id(viewContext.viewerActorId) && Array.isArray(viewContext.evidence), "Supply an actual viewer and attributed evidence.");
    if (viewContext.viewerActorId === profile.actorId) return {visible: true, self: true, actorId: profile.actorId,
        identityRef: copy(profile.identityRef), mindRef: copy(profile.mindRef), currentBodyId: profile.currentBodyId,
        bodies: copy(profile.bodies), memories: copy(profile.memories), methods: copy(profile.methods), sources: copy(profile.sources),
        currentFuel: copy(profile.pools), cargo: copy(profile.cargo), obligations: copy(profile.obligations), embodiment: copy(profile.embodiment),
        status: "snapshot_only_native_body_actions_require_binding"};
    const observations = viewContext.evidence.filter(e => e.recipientId === viewContext.viewerActorId && e.subjectActorId === profile.actorId)
        .map(e => { assert(id(e.id) && natural(e.at) && typeof e.text === "string", "Invalid attributed traveler observation."); return {id: e.id, at: e.at, text: e.text}; });
    return observations.length ? {visible: true, self: false, observations: copy(observations)} : {visible: false};
}

/** Fresh original author inputs, not registrations, test fixtures or canon actors. */
export function realmTravelerCases() {
    const home = {worldId: "base.frontier", instanceId: "frontier.main", regionId: "frontier.village", layerId: "material"};
    const away = {worldId: "pocket.folded_glasshouse", instanceId: "glasshouse.main", regionId: "glasshouse.room", layerId: "material"};
    const owner = (domain, ownerId) => ({domain, id: ownerId, revision: 1});
    const bodyAt = (bodyId, actorId, identityId, mindId, at, poolIds) => ({id: bodyId, revision: 1, ownerId: actorId, identityId, mindId,
        form: "human", endpoint: copy(at), life: "alive", available: true, functions: ["travel.physical", "hands.grip", "attention.control"],
        poolIds, conditionRef: owner("native_vitals", `${bodyId}.vitals`)});
    const base = () => ({schema: 1, id: "traveler.player", revision: 1, actorId: "player", identityRef: owner("actor", "player.identity"),
        mindRef: owner("mind", "player.mind"), currentBodyId: "player.home_body", embodiment: {mode: "single", sourceId: null, supportId: null},
        memories: [{id: "memory.protagonist_role", revision: 1, ownerId: "player", kind: "role", subjectId: "remembered.hero", stage: "remembered"}],
        methods: [], sources: [], bodies: [bodyAt("player.home_body", "player", "player.identity", "player.mind", home, ["player.fuel"])],
        pools: [{id: "player.fuel", revision: 1, ownerId: "player", ownerRef: owner("actual_pool", "player.fuel"),
            balances: [{resourceId: "focus", amount: 12}, {resourceId: "essence", amount: 30}]}],
        cargo: [], companions: [], obligations: []});
    const requestFor = mode => ({mode, bodyId: "player.home_body", expectedRevision: 1, expectedSequence: 4, duration: 2, to: copy(away),
        supportId: null, targetBodyId: null, presenceIds: [], presencePositions: [], cargoIds: [], companionIds: []});
    const contextFor = (request, profile) => ({sequence: 4, clock: 10, supports: [],
        ownerBindings: [profile.identityRef, profile.mindRef, ...profile.bodies.map(b => b.conditionRef), ...profile.pools.map(p => p.ownerRef)]
            .map(r => ({...copy(r), ownerId: "player", available: true})).concat(profile.companions.map(c => ({...copy(c.body.conditionRef), ownerId: c.actorId, available: true}))),
        stockBindings: profile.cargo.map(c => ({stockRef: copy(c.stockRef), ownerId: c.ownerId, holderBodyId: c.holderBodyId, itemKey: c.itemKey, count: c.count})),
        access: {id: `access.${request.mode}`, revision: 1, actorId: "player",
        bodyId: request.bodyId, sequence: 4, duration: request.duration, mode: request.mode, from: copy(home), to: copy(away), allowed: true, reasons: [], expiresAt: null,
        cargoIds: copy(request.cargoIds), companionIds: copy(request.companionIds), presenceIds: copy(request.presenceIds), presencePositions: copy(request.presencePositions)}});
    const supportFor = (mode, sourceId) => ({id: `support.${mode}`, revision: 1, sourceId, methodId: `method.${mode}`, mode,
        originForms: ["human"], arrivalForms: [mode === "projection" ? "light_presence" : "human"], requiredFunctions: ["attention.control"],
        grantedFunctions: mode === "projection" ? ["sense.light", "signal.light"] : ["travel.physical", "hands.grip", "sense.light"],
        poolIds: ["player.fuel"], sharedSourceIds: [sourceId], maxBodies: mode === "shared_body" ? 7 : 2,
        setupCosts: [{poolId: "player.fuel", resourceId: mode === "projection" ? "focus" : "essence", amount: 1}],
        sustainCosts: [{poolId: "player.fuel", resourceId: mode === "projection" ? "focus" : "essence", amount: 1}],
        material: mode !== "projection", permitsCargoTransfer: mode === "shared_body", manifestations: []});
    const acquire = (profile, support) => {
        profile.sources.push({id: support.sourceId, revision: 1, ownerId: "player", acquired: true, active: true, suppressed: false,
            bodyIds: ["player.home_body"], supportIds: [support.id], intrinsicControlIds: [], availableAt: 0, expiresAt: null});
        profile.methods.push({id: support.methodId, revision: 1, ownerId: "player", sourceId: support.sourceId, stage: "learned"});
    };
    const ordinary = base(), physical = requestFor("physical");
    ordinary.obligations.push({id: "duty.return_gauge", revision: 1, ownerId: "player", kind: "loan_return", bodyId: "player.home_body",
        state: "active", blocksModes: [], ownerRef: owner("custody", "exchange.gauge_loan")});
    ordinary.cargo.push({id: "cargo.own_rope", revision: 1, ownerId: "player", holderBodyId: "player.home_body", itemKey: "Survey rope", count: 1,
        kind: "owned", stockRef: owner("native_inventory", "player.rope_stock"), loan: null},
    {id: "cargo.loaned_gauge", revision: 1, ownerId: "exchange.caretaker", holderBodyId: "player.home_body", itemKey: "Fitting gauge", count: 1,
        kind: "loaned", stockRef: owner("custody", "exchange.gauge_stock"), loan: {id: "loan.gauge", revision: 1, lenderId: "exchange.caretaker",
            obligationId: "duty.return_gauge", destinations: [copy(away)], expiresAt: null}});
    ordinary.companions.push({id: "companion.mara", revision: 1, actorId: "mara", body: bodyAt("mara.body", "mara", "mara.identity", "mara.mind", home, []),
        consent: {id: "consent.mara_glasshouse", revision: 1, actorId: "mara", granted: true, mode: "physical", from: copy(home), to: copy(away), expiresAt: null}});
    physical.cargoIds = ordinary.cargo.map(c => c.id); physical.companionIds = ["companion.mara"];
    const projected = base(), projection = requestFor("projection"), prism = supportFor("projection", "source.prism_link");
    acquire(projected, prism); projection.supportId = prism.id; projection.presenceIds = ["presence.prism"]; projection.presenceForm = "light_presence";
    projection.presencePositions = [{presenceId: "presence.prism", positionId: "glasshouse.signal_pane"}];
    const projectionContext = contextFor(projection, projected); projectionContext.supports = [prism];
    const shared = base(), sharedRequest = requestFor("shared_body"), sevenfold = supportFor("shared_body", "source.sevenfold_conduit");
    acquire(shared, sevenfold); sharedRequest.supportId = sevenfold.id; sharedRequest.presenceIds = ["body.left_work", "body.right_work"]; sharedRequest.presenceForm = "human";
    sharedRequest.presencePositions = [{presenceId: "body.left_work", positionId: "glasshouse.left_bench"}, {presenceId: "body.right_work", positionId: "glasshouse.right_bench"}];
    sevenfold.manifestations = [{id: "manifestation.conduit_coat", revision: 1, kind: "attribute", sourceId: sevenfold.sourceId, functions: ["cover.material"]}];
    sevenfold.sustainCosts.push({poolId: "player.fuel", resourceId: "focus", amount: 1});
    shared.cargo.push({id: "cargo.singular_blade", revision: 1, ownerId: "player", holderBodyId: "player.home_body", itemKey: "Work blade", count: 1,
        kind: "owned", stockRef: owner("native_inventory", "player.work_blade"), loan: null});
    const sharedContext = contextFor(sharedRequest, shared); sharedContext.supports = [sevenfold];
    return [
        {id: "case.ordinary_cargo_companion", status: "original_proposal_unverified", purpose: "Move the same rope, lender-owned gauge and consenting independent companion; retain the return duty.",
            profile: ordinary, context: contextFor(physical, ordinary), request: physical},
        {id: "case.retained_home_projection", status: "original_proposal_unverified", purpose: "A learned acquired prism faculty supplies a paid light presence; the home body and physical stock remain at home.",
            profile: projected, context: projectionContext, request: projection},
        {id: "case.source_qualified_shared_bodies", status: "source_informed_original_proposal_unverified", purpose: "Two separately positioned work bodies share one mind and one essence pool; source coats manifest while the one held blade remains at home.",
            sourceBasis: {owner: "docs/research/novels/shadow-slave/observation-emergence/SOURCE_NOTES.md", observations: ["OE15:1583:p1-62", "OE16:1584:p1-44", "1584:p28"],
                provenance: "supplied English compilation; authenticity uncorroborated; source notes inspected, no independent book reading"},
            profile: shared, context: sharedContext, request: sharedRequest}
    ];
}
