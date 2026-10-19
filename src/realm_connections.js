import {check as assert, copy} from './basics.js';
import {REALM_OPERATIONS, realmStableId, realmNatural, validateRealmJson, validateRealmEndpoint, realmEndpointKey, sameRealmEndpoint, validateRealmBoundaryRule, validateRealmContext, validateRealmCosts, evaluateRealmBoundary, quoteRealmCosts, realmBoundaryView} from "./realm_boundary_rules.js";

// Plans are JSON descriptions for a future adapter, not simulation effects.
const movement = ["passage", "manifestation"];
const interactions = ["sense", "identify", "reach", "contact"];
const kinds = {physical: "passage", view: "view", projection: "projection", manifestation: "manifestation"};
const bindingFields = ["schema", "id", "from", "to", "kind", "controllerId", "bidirectional", "lifetime", "duration", "requirements", "costs", "openingCosts", "chronology", "layerPolicy", "cargoPolicy", "observationPolicy", "flows"];
const canonical = value => Array.isArray(value) ? value.map(canonical) : value !== null && typeof value === "object" ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;

export function validateRealmConnection(connection) {
    validateRealmJson(connection);
    assert(connection && connection.schema === 1 && realmStableId(connection.id) && realmNatural(connection.revision) && connection.revision > 0 && Object.hasOwn(kinds, connection.kind), "Invalid realm connection.");
    validateRealmEndpoint(connection.from); validateRealmEndpoint(connection.to);
    assert(!sameRealmEndpoint(connection.from, connection.to), "A connection needs distinct endpoints.");
    assert(typeof connection.open === "boolean" && typeof connection.bidirectional === "boolean" && realmStableId(connection.controllerId), "Invalid connection control.");
    assert(connection.openedAt === null || realmNatural(connection.openedAt), "Invalid route opening time.");
    assert(connection.expiresAt === null || realmNatural(connection.expiresAt) && connection.openedAt !== null && connection.expiresAt > connection.openedAt, "Invalid route expiry.");
    assert(!connection.open || connection.openedAt !== null, "An open connection needs its actual opening time.");
    assert(connection.lifetime === null || realmNatural(connection.lifetime) && connection.lifetime > 0, "Invalid route lifetime.");
    const leaseEnd = connection.openedAt === null || connection.lifetime === null ? null : connection.openedAt + connection.lifetime;
    assert(leaseEnd === null || realmNatural(leaseEnd), "Route lifetime exceeds the supported clock.");
    assert(connection.expiresAt === leaseEnd, "Route expiry must match its declared lifetime and actual opening.");
    assert(realmNatural(connection.duration), "Invalid passage duration.");
    validateRealmBoundaryRule(connection.requirements);
    validateRealmCosts(connection.costs); validateRealmCosts(connection.openingCosts);
    assert(connection.chronology && ["present", "record", "historical"].includes(connection.chronology.mode), "Declare the connection chronology.");
    assert(connection.layerPolicy && movement.every(k => typeof connection.layerPolicy[k] === "boolean") && typeof connection.layerPolicy.contact === "boolean", "Declare layer crossing/contact permissions.");
    const cargo = connection.cargoPolicy;
    assert(cargo && typeof cargo.allowed === "boolean" && realmNatural(cargo.maxUnits) && typeof cargo.allowEquipped === "boolean" && Array.isArray(cargo.classes) && new Set(cargo.classes).size === cargo.classes.length && cargo.classes.every(realmStableId), "Invalid cargo policy.");
    const policy = connection.observationPolicy;
    assert(policy && interactions.every(k => typeof policy[k] === "boolean") && ["none", "disclosure", "qualified_source"].includes(policy.identification), "Declare distinct observation permissions.");
    assert(Array.isArray(connection.flows) && new Set(connection.flows).size === connection.flows.length && connection.flows.every(k => ["light", "sound", "air", "liquid", "energy", "body", "cargo"].includes(k)), "Invalid route permeability.");
    if (connection.closure) {
        assert(!connection.open && connection.openedAt !== null && realmStableId(connection.closure.cause) && realmNatural(connection.closure.at) && connection.closure.at >= connection.openedAt && ["manual", "expired", "anchor_lost"].includes(connection.closure.reason), "Invalid closure receipt.");
        assert(connection.closure.reason !== "expired" || connection.expiresAt !== null && connection.closure.at >= connection.expiresAt, "Expiry closure needs an elapsed route lease.");
    }
    assert(connection.open || connection.openedAt === null || connection.closure, "A previously opened closed route needs its closure receipt.");
    return connection;
}

export function createRealmConnection(definition) {
    validateRealmJson(definition);
    assert(definition && typeof definition === "object" && !Array.isArray(definition), "Supply a realm connection definition record.");
    const connection = {schema: 1, open: false, bidirectional: false, openedAt: null, expiresAt: null, lifetime: null, duration: 0, costs: [], openingCosts: [], chronology: {mode: "present"}, layerPolicy: {passage: false, manifestation: false, contact: false}, cargoPolicy: {allowed: false, maxUnits: 0, allowEquipped: false, classes: []}, observationPolicy: {sense: false, identify: false, reach: false, contact: false, identification: "none"}, flows: [], ...copy(definition)};
    validateRealmConnection(connection); return connection;
}

// Derive only from the host's trusted authored route, never the imported save.
// Mutable open/closed receipts and revisions deliberately stay outside this binding.
export function realmConnectionBinding(connection) {
    validateRealmConnection(connection);
    return Object.fromEntries(bindingFields.map(key => [key, copy(connection[key])]));
}

export function validateRealmConnectionBinding(connection, binding) {
    validateRealmConnection(connection); validateRealmJson(binding);
    assert(binding && typeof binding === "object" && !Array.isArray(binding) && Object.keys(binding).length === bindingFields.length && bindingFields.every(key => Object.hasOwn(binding, key)), "Supply the complete authored connection binding.");
    for (const key of bindingFields) assert(JSON.stringify(canonical(connection[key])) === JSON.stringify(canonical(binding[key])), `Saved realm connection disagrees with its authored ${key} binding.`);
    return connection;
}

function bindings(context) {
    const seen = new Set();
    assert(Array.isArray(context.bindings) && context.bindings.length <= 128, "Supply bounded existing endpoint bindings.");
    for (const b of context.bindings) {
        validateRealmEndpoint(b.endpoint);
        const id = realmEndpointKey(b.endpoint);
        assert(!seen.has(id) && typeof b.available === "boolean", "Duplicate or unsupported endpoint binding.");
        seen.add(id);
        assert(Array.isArray(b.positions) && new Set(b.positions.map(p => p.id)).size === b.positions.length, "Invalid arrival positions.");
        for (const p of b.positions) assert(realmStableId(p.id) && typeof p.free === "boolean" && Array.isArray(p.bodyForms) && p.bodyForms.every(realmStableId), "Invalid actual arrival position.");
    }
}
function endpoints(connection, direction) {
    assert(["forward", "reverse"].includes(direction), "Invalid passage direction.");
    return direction === "forward" ? {from: connection.from, to: connection.to} : {from: connection.to, to: connection.from};
}
function requestReasons(connection, context, request) {
    const reasons = [];
    if (request.expectedSequence !== context.sequence || request.expectedRevision !== connection.revision) reasons.push("This connection request is stale.");
    if (!(context.knownConnectionIds || []).includes(connection.id)) reasons.push("Discover this connection through actual evidence first.");
    if (connection.openedAt !== null && connection.openedAt > context.clock || connection.closure && connection.closure.at > context.clock) reasons.push("The route's saved time is ahead of the supplied played clock.");
    return reasons;
}
const causeFor = (c, context, operation) => `realm:${context.actorId}:${context.sequence + 1}:${c.id}:${c.revision}:${operation}`;
const basePlan = (connection, context, operation, reasons = []) => ({schema: 1, connectionId: connection.id, connectionRevision: connection.revision, expectedSequence: context.sequence, operation, allowed: reasons.length === 0, reasons, costs: [], duration: 0, arrival: null, effects: [], guards: [], cause: causeFor(connection, context, operation), unsupported: []});
const finish = plan => {plan.allowed = plan.reasons.length === 0; if (!plan.allowed) {plan.effects = []; plan.arrival = null;} validateRealmJson(plan); return plan;};

function resolveCargo(connection, context, request, operation, reasons) {
    const cargo = context.cargo || [];
    assert(Array.isArray(cargo) && cargo.length <= 256 && new Set(cargo.map(c => c.itemId)).size === cargo.length, "Invalid or duplicated actual cargo manifest.");
    for (const c of cargo) assert(realmStableId(c.itemId) && realmStableId(c.ownerId) && realmStableId(c.holderId) && realmStableId(c.classId) && realmNatural(c.count) && c.count > 0 && typeof c.equipped === "boolean" && typeof c.transferable === "boolean" && Array.isArray(c.authorizedConnectionIds) && c.authorizedConnectionIds.every(realmStableId), "Invalid actual cargo reference.");
    const selected = request.cargo == null ? operation === "passage" ? cargo.filter(c => c.holderId === context.actorId).map(c => ({itemId: c.itemId, count: c.count})) : [] : request.cargo;
    assert(Array.isArray(selected) && new Set(selected.map(c => c.itemId)).size === selected.length && selected.every(c => realmStableId(c.itemId) && realmNatural(c.count) && c.count > 0), "Invalid requested cargo.");
    if (operation !== "passage") {
        if (selected.length) reasons.push("Viewing/projection/manifestation does not copy or carry physical stock in this prototype.");
        return [];
    }
    if (context.cargoComplete !== true) reasons.push("Bind the complete actual carried inventory before bodily passage.");
    const held = cargo.filter(c => c.holderId === context.actorId);
    if (held.length !== selected.length || held.some(c => !selected.some(s => s.itemId === c.itemId && s.count === c.count))) reasons.push("Deposit or transfer omitted cargo through its actual owner before passage.");
    const resolved = [];
    let units = 0;
    for (const s of selected) {
        const actual = cargo.find(c => c.itemId === s.itemId);
        if (!actual || actual.holderId !== context.actorId || s.count > actual.count) {reasons.push("Requested cargo is not actually held by this actor."); continue;}
        units += s.count;
        if (!actual.transferable || !connection.cargoPolicy.allowed || !connection.cargoPolicy.classes.includes(actual.classId)) reasons.push("The route cannot admit this actual cargo.");
        if (actual.equipped && !connection.cargoPolicy.allowEquipped) reasons.push("This route does not admit the equipped item.");
        if (actual.ownerId !== context.actorId && !actual.authorizedConnectionIds.includes(connection.id)) reasons.push("Borrowed cargo lacks this route's custody permission.");
        resolved.push({itemId: actual.itemId, ownerId: actual.ownerId, holderId: actual.holderId, count: s.count});
    }
    if (!Number.isSafeInteger(units) || units > connection.cargoPolicy.maxUnits) reasons.push("Actual cargo exceeds the declared route capacity.");
    return resolved;
}

export function previewRealmPassage(connection, context, request) {
    validateRealmConnection(connection); validateRealmContext(context); validateRealmJson(request); bindings(context);
    assert(request && typeof request === "object" && !Array.isArray(request), "Supply a realm passage request record.");
    const operation = request.operation || kinds[connection.kind], direction = request.direction || "forward";
    assert(REALM_OPERATIONS.includes(operation), "Unsupported realm operation.");
    const edge = endpoints(connection, direction), plan = basePlan(connection, context, operation, requestReasons(connection, context, request));
    const boundary = evaluateRealmBoundary(connection.requirements, context, operation, request.exceptionId || null);
    plan.reasons.push(...boundary.reasons); plan.exceptionId = boundary.exceptionId;
    if (context.busy === true) plan.reasons.push("Finish the current committed activity before this use.");
    if (!sameRealmEndpoint(context.endpoint, edge.from)) plan.reasons.push("The actor is not at this route's actual origin endpoint.");
    const destination = context.bindings.find(b => sameRealmEndpoint(b.endpoint, edge.to));
    if (!destination?.available) plan.reasons.push("The existing destination binding is unavailable; a route cannot create it.");
    if (connection.chronology.mode !== "present") {plan.unsupported.push("Historical/replayed record causation needs a separate registered adapter."); plan.reasons.push("This prototype supports present-time connections only.");}
    if (!connection.open && !boundary.bypass.includes("closed")) plan.reasons.push("This route is closed.");
    if (connection.expiresAt !== null && context.clock >= connection.expiresAt && !boundary.bypass.includes("expired")) plan.reasons.push("This route's access lease has expired.");
    if (direction === "reverse" && !connection.bidirectional && !boundary.bypass.includes("direction") && !interactions.includes(operation)) plan.reasons.push("This route does not admit reverse passage.");
    if (!interactions.includes(operation) && operation !== kinds[connection.kind] && !boundary.bypass.includes("operation")) plan.reasons.push("A viewing/projection route is not bodily passage.");
    if (operation === "view" && !connection.flows.some(f => ["light", "sound"].includes(f)) && !boundary.sourceRef) plan.reasons.push("Viewing requires an actual sensory channel or acquired sensing source.");
    if (operation === "passage" && !connection.flows.includes("body") && !boundary.sourceRef) plan.reasons.push("Bodily passage requires a real admitted body channel or transport source.");
    if (edge.from.layerId !== edge.to.layerId && (movement.includes(operation) || operation === "contact") && !connection.layerPolicy[operation] && !boundary.bypass.includes("layer")) plan.reasons.push("The source/channel does not provide actual cross-layer body/contact support.");
    if (interactions.includes(operation)) {
        if (!connection.observationPolicy[operation] && !boundary.bypass.includes("observation")) plan.reasons.push("This channel does not supply that observation interaction.");
        if (["sense", "identify"].includes(operation)) {
            const o = context.observation;
            if (!o || o.connectionId !== connection.id || o.connectionRevision !== connection.revision || o.active !== true || o.subjectId !== context.actorId || !realmStableId(o.observerId) || !realmStableId(o.id)) plan.reasons.push("No actual current sampling relationship supports this detection.");
            if (operation === "identify") {
                const disclosure = o?.disclosure;
                const disclosed = disclosure?.recipientId === context.actorId && disclosure?.actorId === o?.observerId && realmStableId(disclosure?.cause);
                if (!(connection.observationPolicy.identification === "disclosure" && disclosed) && !(connection.observationPolicy.identification === "qualified_source" && boundary.sourceRef)) plan.reasons.push("A detected trace does not identify its observer.");
            }
        }
    }
    if (["projection", "manifestation"].includes(operation) && !boundary.sourceRef) plan.reasons.push("Projection/manifestation needs its actual acquired operating source.");
    if (["projection", "manifestation"].includes(operation)) {
        if (!realmStableId(request.presenceId) || (context.presenceIds || []).includes(request.presenceId)) plan.reasons.push("Supply a fresh, nonduplicated presence receipt.");
        const source = (context.sources || []).find(s => s.id === boundary.sourceRef?.id);
        if (!Array.isArray(context.presenceIds) || source?.sharedPresenceSupport !== true) plan.reasons.push("Bind this source's shared-identity/resource support and existing presence receipts.");
    }
    const duration = boundary.duration ?? connection.duration;
    plan.duration = duration;
    const operatingSource = (context.sources || []).find(s => s.id === boundary.sourceRef?.id);
    if (operatingSource?.expiresAt != null && context.clock + duration >= operatingSource.expiresAt) plan.reasons.push("The actual source cannot support the full action before expiring.");
    if (operation === "contact") {
        const contact = context.contact;
        if (!contact || !realmStableId(contact.id) || !realmStableId(contact.targetId) || contact.actorId !== context.actorId || contact.connectionId !== connection.id || contact.connectionRevision !== connection.revision || !contact.targetEndpoint || !sameRealmEndpoint(contact.targetEndpoint, edge.to) || !realmNatural(contact.validThrough) || contact.validThrough < context.clock + duration || !["touch", "impact", "material_signal"].includes(contact.channel)) plan.reasons.push("Supply an actual unexpired target/contact receipt for this boundary.");
    }
    if (!realmNatural(context.clock + duration)) plan.reasons.push("Passage arrival time exceeds the supported clock.");
    if (connection.expiresAt !== null && context.clock + duration >= connection.expiresAt && !boundary.bypass.includes("expired")) plan.reasons.push("The declared route cannot support the full action before closure.");
    const costs = quoteRealmCosts([...(boundary.bypass.includes("route_cost") ? [] : connection.costs), ...boundary.costs], context);
    plan.reasons.push(...costs.reasons); plan.costs = costs.costs;
    const cargo = resolveCargo(connection, context, request, operation, plan.reasons);
    let position = null;
    if (movement.includes(operation)) {
        position = destination?.positions.find(p => (!request.arrivalPositionId || p.id === request.arrivalPositionId) && p.free && p.bodyForms.includes(context.body?.form));
        if (!position) plan.reasons.push("No currently free, compatible arrival position is bound.");
    }
    plan.guards = [{phase: "commit", sequence: context.sequence, connectionId: connection.id, revision: connection.revision}, {phase: "resolution", destination: copy(edge.to), sourceRef: boundary.sourceRef, bodyRef: context.body ? {id: context.body.id, revision: context.body.revision} : null, positionId: position?.id || null, contactRef: operation === "contact" ? context.contact?.id || null : null, checkSupportAgain: true}];
    if (!plan.reasons.length) {
        const common = {cause: plan.cause, actorId: context.actorId, connectionId: connection.id, sourceRef: boundary.sourceRef, from: copy(edge.from), to: copy(edge.to), at: context.clock + duration};
        if (operation === "passage") {
            plan.arrival = {endpoint: copy(edge.to), positionId: position.id, bodyRef: {id: context.body.id, revision: context.body.revision}, cargo};
            plan.effects.push({type: "realm.body_passage", ...common, arrival: copy(plan.arrival), retainIdentity: true, moveExistingCargo: true});
        } else if (operation === "view") plan.effects.push({type: "realm.observation_open", ...common, bodyRemains: copy(context.endpoint), admittedFlows: connection.flows.filter(f => ["light", "sound"].includes(f))});
        else if (["projection", "manifestation"].includes(operation)) {
            plan.arrival = {endpoint: copy(edge.to), positionId: position?.id || null, presenceId: request.presenceId};
            plan.effects.push({type: `realm.${operation}_open`, ...common, presenceId: request.presenceId, material: operation === "manifestation", ownerActorId: context.actorId, sharedBodyOwnerId: context.actorId, sharedResourceOwnerId: context.actorId, originalBodyRemains: copy(context.endpoint), duplicateCargo: false});
        } else plan.effects.push({type: "realm.interaction", ...common, operation, observationRef: context.observation?.id || null, contactRef: operation === "contact" ? context.contact.id : null, targetId: operation === "contact" ? context.contact.targetId : null, identifiedActorId: operation === "identify" ? context.observation.observerId : null, informationOnly: ["sense", "identify"].includes(operation), grantsContact: operation === "contact"});
        plan.effects.push({type: "realm.use_receipt", cause: plan.cause, actorId: context.actorId, connectionId: connection.id, operation, at: context.clock + duration, knowledgePolicy: "qualified_witnesses_only"});
    }
    return finish(plan);
}

export function planRealmOpening(connection, context, request) {
    validateRealmConnection(connection); validateRealmContext(context); validateRealmJson(request); bindings(context);
    assert(request && typeof request === "object" && !Array.isArray(request), "Supply a realm opening request record.");
    const plan = basePlan(connection, context, "open", requestReasons(connection, context, request));
    if (connection.open && (connection.expiresAt === null || context.clock < connection.expiresAt)) plan.reasons.push("This route is already open.");
    if (context.actorId !== connection.controllerId && !(context.authorityIds || []).includes(`connection.open.${connection.id}`)) plan.reasons.push("Opening needs this route's actual controller or scoped authority.");
    if (context.life !== "alive" || !context.body || context.busy === true) plan.reasons.push("The operator lacks available bodily support.");
    if (!sameRealmEndpoint(context.endpoint, connection.from)) plan.reasons.push("Open this route at its authored origin.");
    if (!context.bindings.some(b => sameRealmEndpoint(b.endpoint, connection.to) && b.available)) plan.reasons.push("The existing interior/endpoint is unavailable.");
    const support = evaluateRealmBoundary(connection.requirements, context, kinds[connection.kind], request.exceptionId || null);
    plan.reasons.push(...support.reasons); plan.exceptionId = support.exceptionId;
    if (connection.chronology.mode !== "present") plan.reasons.push("Historical connection opening is unsupported.");
    const quote = quoteRealmCosts([...(support.bypass.includes("route_cost") ? [] : connection.openingCosts), ...support.costs], context); plan.costs = quote.costs; plan.reasons.push(...quote.reasons);
    const expiresAt = connection.lifetime === null ? null : context.clock + connection.lifetime;
    if (expiresAt !== null && !realmNatural(expiresAt)) plan.reasons.push("Route lifetime exceeds the supported clock.");
    if (!plan.reasons.length) {
        const next = {...copy(connection), open: true, revision: connection.revision + 1, openedAt: context.clock, expiresAt}; delete next.closure;
        validateRealmConnection(next);
        plan.nextConnection = next;
        plan.effects = [{type: "realm.connection_replace", connectionId: connection.id, expectedRevision: connection.revision, value: copy(next), cause: plan.cause}, {type: "realm.route_opened", connectionId: connection.id, from: copy(connection.from), to: copy(connection.to), cause: plan.cause, at: context.clock, createInterior: false, resetInterior: false}];
    }
    return finish(plan);
}

export function planRealmClosure(connection, context, request) {
    validateRealmConnection(connection); validateRealmContext(context); validateRealmJson(request);
    assert(request && typeof request === "object" && !Array.isArray(request), "Supply a realm closure request record.");
    const reason = request.reason || "manual", plan = basePlan(connection, context, "close", requestReasons(connection, context, request));
    assert(["manual", "expired", "anchor_lost"].includes(reason), "Unsupported realm closure reason.");
    if (!connection.open) plan.reasons.push("This route is already closed.");
    if (reason === "expired") {
        if (connection.expiresAt === null || context.clock < connection.expiresAt) plan.reasons.push("This route has not expired.");
    } else if (reason === "anchor_lost") {
        if (!connection.requirements.anchorId || !(context.anchors || []).some(a => a.id === connection.requirements.anchorId && !a.available)) plan.reasons.push("No actual lost anchor supports this closure.");
    } else {
        if (context.actorId !== connection.controllerId && !(context.authorityIds || []).includes(`connection.close.${connection.id}`)) plan.reasons.push("Closing needs this route's controller or scoped authority.");
        if (context.life !== "alive" || !context.body || context.busy === true) plan.reasons.push("The manual operator lacks available bodily support.");
        if (!sameRealmEndpoint(context.endpoint, connection.from) && !sameRealmEndpoint(context.endpoint, connection.to) && !(context.authorityIds || []).includes(`connection.close.remote.${connection.id}`)) plan.reasons.push("Remote closure needs an actual scoped remote-control authority.");
    }
    if (!plan.reasons.length) {
        const next = {...copy(connection), open: false, revision: connection.revision + 1, closure: {cause: plan.cause, at: context.clock, reason}};
        validateRealmConnection(next); plan.nextConnection = next;
        plan.effects = [{type: "realm.connection_replace", connectionId: connection.id, expectedRevision: connection.revision, value: copy(next), cause: plan.cause}, {type: "realm.route_closed", connectionId: connection.id, cause: plan.cause, at: context.clock, stoppedFlows: copy(connection.flows), retainInterior: true, retainResidents: true, retainCargoOwners: true, moveOccupants: false, retainedEvidence: true}];
    }
    return finish(plan);
}

export function realmConnectionView(connection, context) {
    validateRealmConnection(connection); validateRealmContext(context);
    if (!(context.knownConnectionIds || []).includes(connection.id)) return {visible: false};
    const known = (context.evidence || []).filter(e => e.connectionId === connection.id && e.recipientId === context.actorId);
    const latest = [...known].filter(e => e.connectionSnapshot).sort((a, b) => b.at - a.at || b.id.localeCompare(a.id))[0];
    return {visible: true, id: connection.id, knownState: latest ? {revision: latest.connectionSnapshot.revision, open: latest.connectionSnapshot.open, observedAt: latest.at} : null, boundary: realmBoundaryView(connection.requirements, context), observations: copy(known.map(e => ({id: e.id, at: e.at, kind: e.kind, text: e.text})))};
}
