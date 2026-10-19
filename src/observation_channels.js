import {check as assert, copy, object} from './basics.js';
import {realmStableId as id, realmNatural as natural, validateRealmJson as json,
    validateRealmEndpoint as endpoint, sameRealmEndpoint as same, validateRealmCosts,
    validateRealmContext, evaluateRealmBoundary, quoteRealmCosts} from './realm_boundary_rules.js';
import {validateRealmConnection, previewRealmPassage} from './realm_connections.js';

// Detached information-only plans. The common durable executor owns all spending,
// source execution, publication and persistence. No import enrolls a channel.
const positive = value => natural(value) && value > 0;
const ids = values => Array.isArray(values) && new Set(values).size === values.length && values.every(id);
const bindingKeys = ['schema', 'id', 'revision', 'connectionId', 'from', 'to', 'subjectId',
    'listener', 'flows', 'activationCosts', 'sampleCosts', 'detectionCosts', 'noticeCosts', 'lifetime'];
const canonical = value => Array.isArray(value) ? value.map(canonical) : object(value)
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const kinds = ['activation', 'sample', 'detection', 'notice', 'claim', 'verified_identity', 'closure'];

export function validateObservationChannel(channel) {
    json(channel);
    assert(object(channel) && Object.keys(channel).length === bindingKeys.length && bindingKeys.every(k => Object.hasOwn(channel, k)), 'Supply the exact observation channel binding.');
    assert(channel.schema === 1 && id(channel.id) && positive(channel.revision) && id(channel.connectionId) && id(channel.subjectId), 'Invalid channel reference.');
    endpoint(channel.from); endpoint(channel.to);
    assert(!same(channel.from, channel.to), 'Observation endpoints must differ.');
    const listener = channel.listener;
    assert(object(listener) && id(listener.sourceId) && positive(listener.sourceRevision) &&
        id(listener.bodyFaculty) && id(listener.anchorId) && id(listener.noticePowerId) && positive(listener.noticePowerRevision), 'Declare actual listener means.');
    assert(object(channel.flows) && ['sample', 'return'].every(k => ids(channel.flows[k]) && channel.flows[k].length > 0 && channel.flows[k].every(v => ['light', 'sound'].includes(v))), 'Declare information-only sample and return flows.');
    for (const key of ['activationCosts', 'sampleCosts', 'detectionCosts', 'noticeCosts']) validateRealmCosts(channel[key]);
    assert(positive(channel.lifetime), 'Declare a finite played-time channel lifetime.');
    return channel;
}
export function createObservationChannel(definition) {
    const channel = {schema: 1, ...copy(definition)};
    return validateObservationChannel(channel);
}
export function observationChannelBinding(channel) { return copy(validateObservationChannel(channel)); }
export function validateObservationChannelBinding(channel, binding) {
    validateObservationChannel(channel); validateObservationChannel(binding);
    assert(JSON.stringify(canonical(channel)) === JSON.stringify(canonical(binding)), 'Saved channel differs from trusted authored binding.');
    return channel;
}
export function createObservationChannelState() { return {schema: 1, sequence: 0, leases: {}, receipts: {}}; }

export function validateObservationChannelState(state) {
    json(state);
    assert(object(state) && state.schema === 1 && natural(state.sequence) && object(state.leases) && object(state.receipts), 'Invalid optional observation state.');
    for (const [key, receipt] of Object.entries(state.receipts)) {
        assert(key === receipt.id && id(key) && id(receipt.cause) && kinds.includes(receipt.kind) && id(receipt.leaseId) &&
            id(receipt.channelId) && positive(receipt.channelRevision) && id(receipt.connectionId) && positive(receipt.connectionRevision) &&
            positive(receipt.sequence) && receipt.sequence <= state.sequence && natural(receipt.at) &&
            id(receipt.operatorId) && id(receipt.subjectId) && id(receipt.actorId) && ids(receipt.recipients) && receipt.recipients.length > 0 &&
            ['private', 'witnessed'].includes(receipt.visibility) && (receipt.visibility !== 'private' || receipt.recipients.length === 1) &&
            typeof receipt.text === 'string' && receipt.text.length <= 4096, 'Invalid scoped observation receipt.');
        endpoint(receipt.operatorBodyEndpoint); endpoint(receipt.subjectBodyEndpoint);
        for (const key of ['operatorBodyRef', 'subjectBodyRef']) assert(object(receipt[key]) && id(receipt[key].id) && positive(receipt[key].revision), 'Invalid receipt current-body reference.');
        if (receipt.kind === 'sample') endpoint(receipt.sampleEndpoint);
        if (['detection', 'notice'].includes(receipt.kind)) assert(id(receipt.sampleId) && state.receipts[receipt.sampleId]?.kind === 'sample' && state.receipts[receipt.sampleId]?.leaseId === receipt.leaseId && state.receipts[receipt.sampleId]?.sequence < receipt.sequence && state.receipts[receipt.sampleId]?.at === receipt.at, 'Detection/reply requires its earlier current sample.');
        if (receipt.kind === 'notice') assert(id(receipt.detectionId) && state.receipts[receipt.detectionId]?.kind === 'detection' && state.receipts[receipt.detectionId]?.leaseId === receipt.leaseId && state.receipts[receipt.detectionId]?.sequence < receipt.sequence, 'Notice lacks an earlier detection.');
        if (receipt.kind === 'closure') assert(['manual', 'expired', 'support_lost'].includes(receipt.reason), 'Invalid closure reason.');
        if (receipt.kind === 'verified_identity') assert(id(receipt.evidenceId), 'Verified identity requires actual evidence.');
        const expectedRecipients = receipt.kind === 'notice' ? [receipt.subjectId, receipt.operatorId] :
            [['detection', 'claim', 'verified_identity'].includes(receipt.kind) ? receipt.subjectId : receipt.operatorId];
        assert(receipt.recipients.length === expectedRecipients.length && expectedRecipients.every(v => receipt.recipients.includes(v)), 'Receipt exceeds its declared knowledge recipients.');
        assert(receipt.informationOnly === true, 'Observation receipts cannot grant physical effects.');
    }
    const sequences = new Set(), causes = new Set();
    for (const receipt of Object.values(state.receipts)) {
        assert(!sequences.has(receipt.sequence) && !causes.has(receipt.cause), 'Duplicate observation sequence/cause.');
        sequences.add(receipt.sequence); causes.add(receipt.cause);
    }
    assert(sequences.size === state.sequence, 'Observation sequence must preserve every committed receipt.');
    for (const [key, lease] of Object.entries(state.leases)) {
        assert(key === lease.id && id(key) && id(lease.channelId) && positive(lease.channelRevision) && id(lease.connectionId) &&
            positive(lease.connectionRevision) && positive(lease.revision) && id(lease.operatorId) && id(lease.subjectId) &&
            ['active', 'closed'].includes(lease.status) && natural(lease.openedAt) && natural(lease.expiresAt) && lease.expiresAt > lease.openedAt, 'Invalid observation lease.');
        endpoint(lease.operatorBodyEndpoint); endpoint(lease.subjectBodyEndpoint);
        for (const field of ['activationId', 'sampleId', 'detectionId', 'noticeId', 'closureId']) {
            const ref = lease[field];
            assert(ref === null || id(ref) && state.receipts[ref]?.leaseId === key && state.receipts[ref]?.kind === field.slice(0, -2), 'Broken observation receipt reference.');
        }
        assert(lease.activationId && (lease.status === 'closed') === !!lease.closureId, 'Lease needs actual activation and closure receipts.');
        if (lease.noticeId) assert(lease.detectionId && lease.sampleId, 'Notice needs a detected actual sample.');
        for (const kind of ['activation', 'detection', 'notice', 'closure']) assert(Object.values(state.receipts).filter(r => r.leaseId === key && r.kind === kind).length <= 1, 'Lease duplicates a once-only receipt.');
        for (const receipt of Object.values(state.receipts).filter(r => r.leaseId === key)) {
            assert(receipt.channelId === lease.channelId && receipt.channelRevision === lease.channelRevision &&
                receipt.connectionId === lease.connectionId && receipt.connectionRevision === lease.connectionRevision &&
                receipt.operatorId === lease.operatorId && receipt.subjectId === lease.subjectId && receipt.at >= lease.openedAt &&
                (receipt.kind === 'closure' || receipt.at < lease.expiresAt), 'Receipt does not belong to this channel lease.');
        }
    }
    for (const r of Object.values(state.receipts)) assert(state.leases[r.leaseId], 'Receipt lacks its retained lease.');
    return state;
}

function validateHost(channel, connection, host) {
    validateObservationChannel(channel); validateRealmConnection(connection); json(host);
    assert(connection.id === channel.connectionId && connection.kind === 'view' && connection.chronology.mode === 'present' &&
        same(connection.from, channel.from) && same(connection.to, channel.to), 'Bind the separate present-time viewing edge.');
    assert(object(host) && natural(host.clock) && natural(host.sequence), 'Supply the durable host sequence and joined played clock.');
    for (const key of ['operator', 'subject']) {
        const context = host[key]; validateRealmContext(context);
        assert(context.clock === host.clock && context.sequence === host.sequence && id(context.body?.id) && positive(context.body?.revision), 'Bind current body reference and the same host clock/sequence.');
        endpoint(context.body.endpoint);
        assert(same(context.body.endpoint, context.endpoint), 'Realm context must locate the actual current body.');
    }
    assert(host.subject.actorId === channel.subjectId && host.operator.actorId !== channel.subjectId, 'Bind distinct operator and actual subject.');
}
function planBase(state, channel, connection, host, request, operation) {
    validateObservationChannelState(state); validateHost(channel, connection, host); json(request);
    assert(object(request) && id(request.cause) && id(request.receiptId), 'Supply explicit fresh executor cause and receipt ID.');
    const reasons = [];
    if (request.expectedSequence !== state.sequence || request.expectedHostSequence !== host.sequence || request.expectedChannelRevision !== channel.revision || request.expectedConnectionRevision !== connection.revision) reasons.push('Observation request is stale.');
    if (state.receipts[request.receiptId] || Object.values(state.receipts).some(r => r.cause === request.cause)) reasons.push('Cause or receipt was already committed.');
    return {schema: 1, operation, allowed: false, reasons, cause: request.cause, expectedSequence: state.sequence,
        expectedHostSequence: host.sequence, channelId: channel.id, channelRevision: channel.revision,
        connectionId: connection.id, connectionRevision: connection.revision, costs: [], guards: [],
        executionRequest: null, knowledgeReceipts: [], nextState: null, informationOnly: true};
}
function finish(plan, next) {
    plan.allowed = plan.reasons.length === 0;
    if (plan.allowed) { validateObservationChannelState(next); plan.nextState = next; }
    else {plan.costs = []; plan.knowledgeReceipts = []; plan.executionRequest = null;}
    json(plan); return plan;
}
function receipt(plan, lease, host, request, kind, actorId, recipients, text, extra = {}) {
    assert(ids(recipients) && recipients.length > 0 && typeof text === 'string', 'Supply scoped receipt text and recipients.');
    const r = {id: request.receiptId, cause: request.cause, kind, leaseId: lease.id,
        sequence: plan.expectedSequence + 1, channelId: lease.channelId, channelRevision: lease.channelRevision,
        connectionId: lease.connectionId, connectionRevision: lease.connectionRevision, at: host.clock,
        operatorId: lease.operatorId, subjectId: lease.subjectId, actorId, recipients: [...recipients],
        visibility: recipients.length === 1 ? 'private' : 'witnessed', text, informationOnly: true,
        operatorBodyEndpoint: copy(host.operator.body.endpoint), subjectBodyEndpoint: copy(host.subject.body.endpoint),
        operatorBodyRef: {id: host.operator.body.id, revision: host.operator.body.revision},
        subjectBodyRef: {id: host.subject.body.id, revision: host.subject.body.revision}, ...extra};
    plan.knowledgeReceipts.push(r); return r;
}
function add(next, r) { next.sequence++; next.receipts[r.id] = r; }
function charge(plan, costs, context) {
    const quote = quoteRealmCosts(costs, context); plan.reasons.push(...quote.reasons); plan.costs = quote.costs;
}
function activeLease(plan, state, channel, connection, host, request) {
    const lease = state.leases[request.leaseId];
    if (!lease || lease.channelId !== channel.id || lease.channelRevision !== channel.revision || lease.connectionId !== connection.id ||
        lease.connectionRevision !== connection.revision || lease.operatorId !== host.operator.actorId || lease.subjectId !== host.subject.actorId) {
        plan.reasons.push('Bind the actual channel lease and actors.'); return null;
    }
    if (request.expectedLeaseRevision !== lease.revision) plan.reasons.push('Lease request is stale.');
    if (lease.status !== 'active') plan.reasons.push('This observation lease is closed.');
    if (host.clock < lease.openedAt || host.clock >= lease.expiresAt) plan.reasons.push('This lease is not live at the joined played clock.');
    plan.guards.push({kind: 'observation_lease', id: lease.id, revision: lease.revision});
    return lease;
}
function liveSupport(plan, channel, connection, host) {
    if (!connection.open || connection.expiresAt !== null && host.clock >= connection.expiresAt) plan.reasons.push('The actual viewing edge is closed or expired.');
    if (!same(host.operator.endpoint, channel.from) || !same(host.subject.endpoint, channel.to)) plan.reasons.push('Current bodies no longer support the declared sampling endpoints.');
    if (host.operator.body.faculties?.pairedViewDevice === false) plan.reasons.push('The operator has lost actual paired-device support.');
    if (host.operator.life !== 'alive' || host.subject.life !== 'alive') plan.reasons.push('The current operator or subject is not alive.');
    for (const flow of channel.flows.sample) if (!connection.flows.includes(flow)) plan.reasons.push('The actual edge lacks a declared sample flow.');
    // Losing the operator's actual supported body also terminates the view.
    // This support probe quotes no extra cost and publishes no effects.
    plan.reasons.push(...evaluateRealmBoundary(connection.requirements, host.operator, 'view').reasons);
}
function listenerSupport(plan, channel, host, operation) {
    const context = host.subject, spec = channel.listener;
    const source = context.sources?.find(s => s.id === spec.sourceId && s.revision === spec.sourceRevision && s.ownerId === context.actorId);
    if (!(source?.owned && source.awakened === true && source.active && !source.suppressed && id(source.receiptId) &&
        natural(source.acquiredAt) && source.acquiredAt <= host.clock && (source.availableAt == null || source.availableAt <= host.clock) &&
        (source.expiresAt == null || source.expiresAt > host.clock) && source.operations.includes(operation) && source.bodyForms.includes(context.body.form))) plan.reasons.push('Listener needs its actually acquired, awake, active source and supported body.');
    if (context.body.faculties?.[spec.bodyFaculty] !== true) plan.reasons.push('The current subject body lacks its actual listener faculty.');
    const anchor = context.anchors?.find(a => a.id === spec.anchorId);
    if (!anchor?.available || !anchor.endpoint || !same(anchor.endpoint, channel.to)) plan.reasons.push('The actual same-endpoint listener anchor is unavailable.');
    const power = context.powers?.find(p => p.id === spec.noticePowerId && p.revision === spec.noticePowerRevision && p.ownerId === context.actorId);
    if (context.powers && (!power?.owned || !id(power.receiptId))) plan.reasons.push('The actual listener notice power is no longer owned.');
    if (source && anchor) plan.guards.push({kind: 'listener_support', ownerId: context.actorId, sourceId: source.id,
        sourceRevision: source.revision, acquisitionReceiptId: source.receiptId ?? null, bodyId: context.body.id,
        bodyRevision: context.body.revision, anchorId: anchor.id, anchorRevision: anchor.revision});
}
function subjectBoundary(plan, channel, connection, host, operation) {
    const boundary = evaluateRealmBoundary(connection.requirements, host.subject, operation);
    plan.reasons.push(...boundary.reasons);
    if (!connection.observationPolicy[operation]) plan.reasons.push('This edge does not admit the declared information interaction.');
    listenerSupport(plan, channel, host, operation);
    return boundary.costs;
}
function currentSample(plan, state, lease, host) {
    const sample = lease && state.receipts[lease.sampleId];
    if (!sample || sample.kind !== 'sample' || sample.at !== host.clock ||
        !same(sample.operatorBodyEndpoint, host.operator.body.endpoint) || !same(sample.subjectBodyEndpoint, host.subject.body.endpoint) ||
        sample.operatorBodyRef.id !== host.operator.body.id || sample.operatorBodyRef.revision !== host.operator.body.revision ||
        sample.subjectBodyRef.id !== host.subject.body.id || sample.subjectBodyRef.revision !== host.subject.body.revision) plan.reasons.push('A current actually committed sender-to-subject sample is required; replay is not sampling.');
    return sample;
}

export function planObservationActivation(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'activate'), next = copy(state);
    assert(id(request.leaseId), 'Supply a fresh lease ID.');
    if (next.leases[request.leaseId] || Object.values(next.leases).some(l => l.channelId === channel.id && l.status === 'active')) plan.reasons.push('Close the existing lease before activating a new one.');
    liveSupport(plan, channel, connection, host);
    const expiresAt = host.clock + channel.lifetime;
    if (!natural(expiresAt) || connection.expiresAt !== null && expiresAt > connection.expiresAt) plan.reasons.push('The connection cannot support the full declared lifetime.');
    const view = previewRealmPassage(connection, host.operator, {operation: 'view', expectedSequence: host.sequence, expectedRevision: connection.revision});
    plan.reasons.push(...view.reasons);
    if (view.duration !== 0) plan.reasons.push('This prototype requires instantaneous activation; duration belongs to the finite lease.');
    charge(plan, [...channel.activationCosts, ...view.costs], host.operator);
    const lease = {id: request.leaseId, revision: 1, channelId: channel.id, channelRevision: channel.revision,
        connectionId: connection.id, connectionRevision: connection.revision, operatorId: host.operator.actorId,
        subjectId: host.subject.actorId, operatorBodyEndpoint: copy(host.operator.body.endpoint),
        subjectBodyEndpoint: copy(host.subject.body.endpoint), status: 'active', openedAt: host.clock, expiresAt,
        activationId: request.receiptId, sampleId: null, detectionId: null, noticeId: null, closureId: null};
    next.leases[lease.id] = lease;
    add(next, receipt(plan, lease, host, request, 'activation', lease.operatorId, [lease.operatorId], 'Activated a finite anonymous information channel; the body remains at its current endpoint.'));
    return finish(plan, next);
}
export function planObservationSample(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'sample'), next = copy(state);
    const lease = activeLease(plan, state, channel, connection, host, request);
    if (!lease) return finish(plan, next);
    liveSupport(plan, channel, connection, host);
    const view = previewRealmPassage(connection, host.operator, {operation: 'view', expectedSequence: host.sequence, expectedRevision: connection.revision});
    plan.reasons.push(...view.reasons);
    if (view.duration !== 0) plan.reasons.push('Current sampling requires instantaneous supported view.');
    charge(plan, [...channel.sampleCosts, ...view.costs], host.operator);
    add(next, receipt(plan, lease, host, request, 'sample', lease.operatorId, [lease.operatorId], request.text ?? 'A current image arrived through the live viewing slit.', {sampleEndpoint: copy(channel.to), anonymous: true}));
    next.leases[lease.id].sampleId = request.receiptId; next.leases[lease.id].revision++;
    return finish(plan, next);
}
export function planObservationDetection(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'detect'), next = copy(state);
    const lease = activeLease(plan, state, channel, connection, host, request);
    if (!lease) return finish(plan, next);
    liveSupport(plan, channel, connection, host); const sample = currentSample(plan, state, lease, host);
    if (lease.detectionId) plan.reasons.push('This lease already has its one detection receipt.');
    charge(plan, [...channel.detectionCosts, ...subjectBoundary(plan, channel, connection, host, 'sense')], host.subject);
    add(next, receipt(plan, lease, host, request, 'detection', lease.subjectId, [lease.subjectId], 'Detected an anonymous current incoming sample; no sender identity was learned.', {sampleId: sample?.id ?? null, anonymous: true}));
    next.leases[lease.id].detectionId = request.receiptId; next.leases[lease.id].revision++;
    return finish(plan, next);
}
export function planObservationNotice(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'notice'), next = copy(state);
    const lease = activeLease(plan, state, channel, connection, host, request);
    if (!lease) return finish(plan, next);
    liveSupport(plan, channel, connection, host); const sample = currentSample(plan, state, lease, host);
    if (!lease.detectionId) plan.reasons.push('Commit actual detection before the notice.');
    if (lease.noticeId) plan.reasons.push('This lease already has its one notice receipt.');
    for (const flow of channel.flows.return) if (!connection.flows.includes(flow)) plan.reasons.push('The actual return flow is unavailable.');
    const power = host.subject.powers?.find(p => p.id === channel.listener.noticePowerId && p.revision === channel.listener.noticePowerRevision && p.ownerId === lease.subjectId);
    if (!power?.owned || !id(power.receiptId)) plan.reasons.push('The subject must actually own its executable notice power.');
    charge(plan, [...channel.noticeCosts, ...subjectBoundary(plan, channel, connection, host, 'reach')], host.subject);
    plan.executionRequest = {actorId: lease.subjectId, powerId: channel.listener.noticePowerId,
        sourceId: channel.listener.sourceId, cause: request.cause, sampleId: sample?.id ?? null,
        targetLeaseId: lease.id, costs: copy(plan.costs), informationOnly: true};
    add(next, receipt(plan, lease, host, request, 'notice', lease.subjectId, [lease.subjectId, lease.operatorId], request.text ?? 'I notice someone at the frame. You need not give a name.', {sampleId: sample?.id ?? null, detectionId: lease.detectionId, anonymous: true}));
    next.leases[lease.id].noticeId = request.receiptId; next.leases[lease.id].revision++;
    return finish(plan, next);
}

// Deliberate disclosure is a claim. Verified identity additionally needs an
// acquired identify source and fresh host-owned evidence addressed to the subject.
export function planObservationIdentity(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'identity'), next = copy(state);
    const lease = activeLease(plan, state, channel, connection, host, request);
    if (!lease) return finish(plan, next);
    liveSupport(plan, channel, connection, host); currentSample(plan, state, lease, host);
    assert(['claim', 'verified_identity'].includes(request.kind) && typeof request.text === 'string' && request.text.length > 0, 'Declare the deliberate identity claim or verified evidence.');
    if (request.kind === 'claim') {
        if (request.disclosedBy !== lease.operatorId || request.recipientId !== lease.subjectId) plan.reasons.push('Only the actual operator can deliberately disclose this claim to the subject.');
    } else {
        if (connection.observationPolicy.identification !== 'qualified_source') plan.reasons.push('This channel does not provide verified identity.');
        const boundary = evaluateRealmBoundary(connection.requirements, host.subject, 'identify');
        plan.reasons.push(...boundary.reasons);
        if (!connection.observationPolicy.identify || !boundary.sourceRef) plan.reasons.push('Verification needs an actual qualified identification source.');
        const source = host.subject.sources?.find(s => s.id === boundary.sourceRef?.id);
        if (!(source?.awakened && id(source.receiptId) && natural(source.acquiredAt) && source.acquiredAt <= host.clock)) plan.reasons.push('Identification source lacks actual acquisition and awakening.');
        const evidence = host.subject.identityEvidence?.find(e => e.id === request.evidenceId && e.actorId === lease.operatorId && e.recipientId === lease.subjectId && e.channelId === channel.id && e.leaseId === lease.id && e.sampleId === lease.sampleId && e.at === host.clock && id(e.cause) && e.sourceId === source?.id && e.sourceRevision === source?.revision);
        if (!evidence) plan.reasons.push('Supply fresh qualified subject-owned identity evidence; a claim is not verification.');
        charge(plan, boundary.costs, host.subject);
    }
    add(next, receipt(plan, lease, host, request, request.kind, request.kind === 'claim' ? lease.operatorId : lease.subjectId,
        [lease.subjectId], request.text, {evidenceId: request.kind === 'verified_identity' ? request.evidenceId ?? null : null}));
    next.leases[lease.id].revision++;
    return finish(plan, next);
}

export function planObservationClosure(state, channel, connection, host, request) {
    const plan = planBase(state, channel, connection, host, request, 'close'), next = copy(state);
    const lease = state.leases[request.leaseId];
    assert(['manual', 'expired', 'support_lost'].includes(request.reason), 'Declare actual closure reason.');
    if (!lease || lease.channelId !== channel.id || lease.channelRevision !== channel.revision || lease.connectionId !== connection.id || lease.operatorId !== host.operator.actorId || lease.subjectId !== host.subject.actorId || lease.status !== 'active' || request.expectedLeaseRevision !== lease.revision) {
        plan.reasons.push('Closure needs the exact active lease and revision.'); return finish(plan, next);
    }
    if (host.clock < lease.openedAt) plan.reasons.push('Closure cannot rewrite time.');
    if (request.reason === 'expired' && host.clock < lease.expiresAt) plan.reasons.push('The declared played-time lease has not expired.');
    if (request.reason === 'manual') {
        const closure = host.closureAuthority;
        if (!closure || closure.actorId !== host.operator.actorId || closure.channelId !== channel.id || closure.connectionId !== connection.id || closure.connectionRevision !== connection.revision || !id(closure.cause) || closure.at !== host.clock || !closure.endpoint || !same(closure.endpoint, host.operator.endpoint) || closure.shutterReachable !== true) plan.reasons.push('Manual closure needs actual local shutter reach and scoped authority.');
    }
    if (request.reason === 'support_lost') {
        const probe = {reasons: [], guards: []}; liveSupport(probe, channel, connection, host);
        subjectBoundary(probe, channel, connection, host, 'sense'); subjectBoundary(probe, channel, connection, host, 'reach');
        if (connection.revision !== lease.connectionRevision) probe.reasons.push('Operating edge revision changed.');
        for (const flow of channel.flows.return) if (!connection.flows.includes(flow)) probe.reasons.push('Return flow lost.');
        if (!probe.reasons.length) plan.reasons.push('No actual channel/body/listener/anchor support loss was supplied.');
    }
    add(next, receipt(plan, lease, host, request, 'closure', host.operator.actorId, [lease.operatorId],
        'The live channel closed; old evidence, people, sources and stock remain.', {reason: request.reason}));
    next.leases[lease.id].status = 'closed'; next.leases[lease.id].closureId = request.receiptId; next.leases[lease.id].revision++;
    return finish(plan, next);
}

// Only scoped stored evidence is returned. No current contexts, sample, cost,
// lease extension or identity disclosure can be created by opening this view.
export function observationReplayView(state, recipientId, leaseId = null) {
    validateObservationChannelState(state); assert(id(recipientId) && (leaseId === null || id(leaseId)), 'Supply actual viewer and optional lease.');
    return {readOnly: true, liveSampling: false, costs: [], records: Object.values(state.receipts)
        .filter(r => r.recipients.includes(recipientId) && (leaseId === null || r.leaseId === leaseId))
        .sort((a, b) => a.sequence - b.sequence)
        .map(r => ({id: r.id, kind: r.kind, at: r.at, text: r.text, cause: r.cause, leaseId: r.leaseId}))};
}
