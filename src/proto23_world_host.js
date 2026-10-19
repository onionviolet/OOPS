import {check as assert, copy} from './basics.js';
import {PROTO23_IDS as I, PROTO23_LOCATIONS as L, PROTO23_FOOTPRINTS as footprints,
    PROTO23_INITIAL_FACTS, PROTO23_NATIVE_PEOPLE, PROTO23_SOURCE_SNAPSHOT, PROTO23_SOURCE_HASH, proto23Definitions} from './proto23_world_content.js';
import {proto23Context} from './proto23_world_actions.js';
import {createProto23Connections, activeProto23Visit, validateProto23State, syncProto23Clock,
    PROTO23_VISIT_CAPACITY, previewProto23VisitRoom, stageProto23VisitRoom} from './proto23_world_state.js';
import {createWorldInstance, createWorldVisit, planWorldDeparture} from './world_instances.js';
import {buildNativeRealmCargoSnapshot, previewRealmCargoPassage} from './realm_cargo.js';
import {previewRealmPassage} from './realm_connections.js';
import {previewNativeRealmTraveler} from './native_realm_traveler.js';
import {enrollSimulation, commitSimulationCommand, previewSimulationCommand, cancelSimulationJob,
    simulationOccupiesActor, waitingSimulationChoice} from './simulation.js';
import {applySimulationEffects} from './simulation_effects.js';
import {activePractice} from './techniques.js';
export {proto23Facts, proto23Context} from './proto23_world_actions.js';
export {activeProto23Visit, validateProto23State, syncProto23Clock, nextProto23Boundary} from './proto23_world_state.js';
const base = (state, c) => ({state: copy(state), external: copy(c.external || {}), gameplay: copy(c.gameplay || {}),
    gameplayBefore: copy(c.gameplay || {}), vitals: copy(c.vitals || {}), equipment: copy(c.equipment || {}), acquisitions: [], unlocks: []});
function bodySupported(state, c) {const p = state.simulation?.people.player, b = c.proto23Native?.body;
    return c.nativeAlive === true && b?.id === 'native.player.body' && b.form === 'human' && b.ownerId === 'player' && b.controllerId === 'player' &&
        p?.life === 'alive' && p.body?.mobile !== false && (p.body?.hands ?? 2) >= 2 && (c.vitals?.player?.health ?? 0) > 1 &&
        (p.body?.id == null || p.body.id === b.id) && (p.body?.form == null || p.body.form === 'human');}
function busyReasons(state, c) {const reasons = [];
    if(c.busy || simulationOccupiesActor(state) || state.pending.some(j => j.context.actorId === 'player') || activePractice(state.actors.player) ||
        state.chronicle?.session || state.chronicle?.life.endedAt != null || waitingSimulationChoice(state)) reasons.push('Finish or cancel current work and decisions first.');
    if(state.simulation && !bodySupported(state, c)) reasons.push('Use your actual living controlled human body with supported hands.'); return reasons;}
function otherVisit(state) {return [state.bookWorldCampaign, state.motherOfLearning, state.nestedCampaign, state.featureDestination, state.realmPrototype].some(d => d?.activeVisitId);}
function passage(state, c, direction) {
    const d = state.proto23Village, n = c.proto23Native, connection = d.connections[0];
    assert(n?.bound && n.revision === d.nativeRevision && bodySupported(state, c), 'The actual Proto23 native owners/body changed. Review this passage.');
    assert(!otherVisit(state), 'Return from the other actual retained visit before Proto23 passage.');
    const from = direction === 'reverse' ? connection.to : connection.from, to = direction === 'reverse' ? connection.from : connection.to;
    const snapshot = buildNativeRealmCargoSnapshot({actorId: 'player', bodyId: 'native.player.body', sequence: state.sequence, revision: state.sequence + 1,
        inventory: c.gameplay.player.inventory, equipment: c.equipment.player, custody: state.simulation.custody});
    assert(snapshot.cargo.every(row => row.ownerId === 'player'), 'Return borrowed cargo before Proto23 passage.');
    const cargo = previewRealmCargoPassage(snapshot, connection, {expectedSequence: state.sequence, expectedRevision: connection.revision,
        expectedSnapshotRevision: snapshot.revision, expectedSnapshotBinding: snapshot.binding, purposeId: 'native.proto23.physical_passage', from, to, duration: 0},
    {sequence: state.sequence, clock: state.clock, permissions: [], consents: []});
    assert(cargo.allowed, cargo.reasons.join(' '));
    const rc = {actorId: 'player', sequence: state.sequence, clock: state.clock, endpoint: from, life: state.simulation.people.player.life,
        body: {id: n.body.id, revision: 1, form: n.body.form}, busy: !!c.busy || simulationOccupiesActor(state), knownConnectionIds: [connection.id],
        sources: [], methodIds: [], authorityIds: [], anchors: [], resources: [], cargo: cargo.cargo, cargoComplete: cargo.cargoComplete, bindings: n.endpointBindings};
    const q = previewRealmPassage(connection, rc, {expectedSequence: state.sequence, expectedRevision: connection.revision, direction, operation: 'passage'});
    const traveler = previewNativeRealmTraveler(state, c, rc, q); assert(q.allowed && traveler.allowed, [...q.reasons, ...traveler.reasons].join(' '));
}
const labels = {'proto23.enroll': 'Choose independent Proto23 guest entry', 'proto23.enter': 'Enter your retained Proto23 visitor village',
    'proto23.return': 'Return to Village with your own body and actual cargo'};
const moves = Object.fromEntries(Object.entries(L).map(([key, to]) => ['proto23.move.' + key, to]));
export function previewProto23Command(state, registry, id, context = {}) {
    context = proto23Context(state, {...context, proto23Host: true});
    const d = state.proto23Village, world = state.actors.player.worldId, location = context.facts?.location || state.simulation?.people.player.location;
    const definition = registry.simulation.commands.get(id);
    if(id === 'proto23.chart' && !state.simulation) {const visible = context.facts?.['village.elderMet'] === true && world === 'base.frontier' && location === 'Village';
        return {visible, eligible: visible && !context.busy && context.nativeAlive === true, reasons: context.busy ? ['Finish current work first.'] : [], costs: [], duration: 0};}
    if(definition?.group === I.group && definition.actorId === 'player') {
        if(definition.worldId !== world || definition.location && definition.location !== location || id !== 'proto23.chart' && !d) return {visible: false, eligible: false, reasons: []};
        const q = previewSimulationCommand(state, registry, id, {...context, targetId: definition.targetId || null});
        return {...q, visible: q.visible && !(definition.once && state.actors.player.completed[id])};
    }
    const reasons = busyReasons(state, context); let visible = false;
    if(id === 'proto23.enroll') {visible = world === 'base.frontier' && !d && !!state.simulation?.knowledge.player?.['proto23.chart'];
        if(location !== 'Village') reasons.push('Choose this guest entry from Village.');
        if(otherVisit(state)) reasons.push('Finish the other retained visit first.');
        if(!bodySupported(state, context)) reasons.push('Entry retains your actual controlled human body.');}
    if(!d && id !== 'proto23.enroll') return {visible: false, eligible: false, reasons: []};
    if(id === 'proto23.enter') {visible = world === 'base.frontier' && !!d; if(location !== 'Village') reasons.push('Enter from the actual Village doorway.');
        if(visible && d.visits.length >= PROTO23_VISIT_CAPACITY) reasons.push(...previewProto23VisitRoom(state).reasons);}
    if(id === 'proto23.return') {visible = world === I.world; if(location !== L.center) reasons.push('Return through the actual Village Center doorway.');}
    if(moves[id]) {visible = world === I.world && location !== moves[id];
        if(moves[id] === L.cottage && !state.actors.player.facts['proto23.cottageRight']) reasons.push('Pay for the actual ordinary cottage agreement first.');}
    if(visible && ['proto23.enter', 'proto23.return'].includes(id)) {
        try {passage(state, context, id === 'proto23.return' ? 'reverse' : 'forward');} catch(error) {reasons.push(error.message);}
        if((state.simulation.jobs || []).some(j => (j.participants || [j.actorId]).some(a => proto23Definitions.people.some(p => p.id === a)))) reasons.push('Finish or cancel committed local resident work before passage.');
    }
    return {visible, eligible: visible && !reasons.length, reasons, costs: [], duration: 0};
}
function attach(plan, registry) {
    const state = plan.state;
    for(const p of proto23Definitions.people) {
        assert(!state.actors[p.id] && registry.simulation.people.get(p.id)?.inventory === 'native', 'Bind each independent Proto23 person once.');
        state.actors[p.id] = {facts: {}, resources: copy(p.resources), completed: {}, sources: {}, techniques: {}, worldId: p.worldId};
        state.simulation.people[p.id] = {life: 'alive', inventory: 'native', location: p.location, bornAt: state.clock, definitionId: p.id, definitionRevision: 1,
            body: {...copy(p.body), id: `native.person.${p.id}.body`, ownerId: p.id, controllerId: p.id}, vitals: copy(p.vitals)};
        plan.vitals[p.id] = copy(p.vitals); plan.gameplay[p.id] = copy(PROTO23_NATIVE_PEOPLE[p.id]);
    }
    for(const site of proto23Definitions.sites) state.simulation.sites[site.id] = {capacity: site.capacity, reservations: {}};
    const b = state.simulation.people.player.body || {};
    state.simulation.people.player.body = {...b, id: b.id || 'native.player.body', ownerId: b.ownerId || 'player', controllerId: b.controllerId || 'player',
        form: b.form || 'human', hands: b.hands ?? 2, mobile: b.mobile ?? true};
}
function move(plan, to) {
    const state = plan.state, d = state.proto23Village, f = footprints[0]; syncProto23Clock(state);
    const old = activeProto23Visit(state);
    if(old) {const q = planWorldDeparture(d.instances[0], old, {playedAt: state.clock, visits: d.visits, expectedRevision: d.instances[0].revision}, f.definition);
        assert(q.allowed, q.reasons.join(' ')); d.instances[0] = q.nextInstance; d.visits = d.visits.map(v => v.id === old.id ? q.nextVisit : v); d.activeVisitId = null;}
    if(to === I.world) {assert(d.visits.length < PROTO23_VISIT_CAPACITY, 'Reserve safe bounded visitor history before recording arrival.');
        const visit = createWorldVisit(d.instances[0], {id: `proto23.visit.${state.sequence}`, actorId: 'player', endpoint: f.endpoint, playedAt: state.clock}, f.definition,
            {actorIds: Object.keys(state.actors), visits: d.visits}); d.visits.push(visit); d.activeVisitId = visit.id;}
    state.actors.player.worldId = to; plan.nativeLocation = to === I.world ? L.center : 'Village';
    state.simulation.people.player.location = plan.nativeLocation; plan.nativePatch = {...(plan.nativePatch || {}), 'current location': plan.nativeLocation};
}
export function commitProto23Command(state, registry, command, context, expectedSequence = state.sequence) {
    assert(command.type === I.group && expectedSequence === state.sequence && (command.sequence == null || command.sequence === expectedSequence), 'This Proto23 choice changed. Review its current terms.');
    assert(command.targetId == null, 'Choose the authored Proto23 participant; these actions do not accept arbitrary targets.');
    context = proto23Context(state, {...context, actorId: 'player', proto23Host: true}); const id = command.id;
    if(id === 'proto23.cancel') {const job = state.simulation?.jobs.find(j => j.id === command.jobId && j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === I.group);
        assert(job?.cancellation === 'refund', 'Choose your actual refundable Proto23 work.'); return cancelSimulationJob(state, registry, job.id, context, expectedSequence);}
    const q = previewProto23Command(state, registry, id, context); assert(q.visible && q.eligible, q.reasons.join(' ') || 'This Proto23 choice is unavailable.');
    const definition = registry.simulation.commands.get(id);
    if(definition?.group === I.group && definition.actorId === 'player') {
        const enrolled = state.simulation ? null : enrollSimulation(state, registry, context, expectedSequence), current = enrolled?.state || state;
        const out = commitSimulationCommand(current, registry, {id}, {...context, external: enrolled?.external || context.external,
            gameplay: enrolled?.gameplay || context.gameplay, targetId: definition.targetId || null}, current.sequence);
        if(enrolled) {out.acquisitions = [...enrolled.acquisitions, ...out.acquisitions]; out.unlocks = [...enrolled.unlocks, ...out.unlocks];}
        if(definition.proto23Stock) out.proto23NativeRequests = definition.proto23Stock.map(request => ({...request, cause: id, expectedRevision: context.proto23Native.revision}));
        validateProto23State(out.state); return out;
    }
    const plan = base(state, context); plan.state.sequence++; syncProto23Clock(plan.state);
    if(id === 'proto23.enter') stageProto23VisitRoom(plan.state);
    if(id === 'proto23.enroll') {
        plan.state.schema = 11; const f = footprints[0]; assert(!plan.state.worlds[I.world], 'A different owner already uses Proto23.');
        plan.state.worlds[I.world] = {facts: copy(PROTO23_INITIAL_FACTS[I.world]), resources: {}, completed: {}}; attach(plan, registry);
        plan.state.proto23Village = {schema: 1, definitionRevision: 1, sourceSnapshot: PROTO23_SOURCE_SNAPSHOT, sourceHash: PROTO23_SOURCE_HASH,
            initializedAt: state.clock, nativeRevision: 0, bodyPolicy: 'same_native_body', absence: 'freeze', entryProfile: 'independent_visitor',
            instances: [createWorldInstance(f.definition, {id: f.instanceId, continuityId: f.continuityId, eraId: f.eraId, parentInstanceId: null,
                playedAt: state.clock, actorIds: proto23Definitions.people.map(p => p.id)})], visits: [], activeVisitId: null,
            connections: createProto23Connections().map(c => ({...c, open: true, openedAt: state.clock})), receipts: []};
        applySimulationEffects(plan, [{type: 'knowledge', actor: 'player', key: 'proto23.enrollment', stage: 'understood',
            value: 'Deliberately chose an original independent Proto23 visitor branch in this same actual native body. Source village/dojo, reading and counted furnishings inspire the authored finite ordinary loop. No source pupil, inherited house, tutorial reward, prestige, automatic stock, time reset or copied skill is granted.',
            basis: {kind: 'instruction', attributedTo: 'player', situationId: I.situation}}], context, registry, `proto23:${plan.state.sequence}:enrollment`);
        plan.proto23Activation = true;
    } else if(moves[id]) {plan.nativeLocation = moves[id]; plan.state.simulation.people.player.location = plan.nativeLocation; plan.nativePatch = {'current location': plan.nativeLocation};}
    else if(id === 'proto23.enter' || id === 'proto23.return') {passage(state, context, id === 'proto23.enter' ? 'forward' : 'reverse'); move(plan, id === 'proto23.enter' ? I.world : 'base.frontier');}
    const d = plan.state.proto23Village; if(d) {d.receipts.push({id, at: plan.state.clock, sequence: plan.state.sequence}); d.receipts = d.receipts.slice(-128);}
    validateProto23State(plan.state); return plan;
}
export function proto23SimulationContexts(state, contexts) {
    if(!state.proto23Village) return contexts; const next = {...contexts};
    for(const [id, c] of Object.entries(next)) next[id] = proto23Context(state, {...c, actorId: id});
    for(const p of proto23Definitions.people) if(next[p.id]) next[p.id] = {...next[p.id], busy: state.actors.player.worldId !== I.world || !!next[p.id].busy};
    return next;
}
export function proto23Presentation(state, registry, context = {}) {
    const actions = [], d = state.proto23Village, world = state.actors.player.worldId;
    for(const definition of proto23Definitions.commands) {const q = previewProto23Command(state, registry, definition.id, context); if(q.visible) actions.push({id: definition.id,
        label: definition.label, description: definition.description || 'Original finite visitor work. Current body, right, co-location, owned stock, material, effort and cancellation terms apply.',
        eligible: q.eligible, reasons: q.reasons, costs: q.costs, duration: q.duration, cancellation: definition.cancellation || 'none', command: {type: I.group, id: definition.id}});}
    for(const [id, label] of [...Object.entries(labels), ...Object.entries(moves).map(([id, to]) => [id, 'Walk to ' + to])]) {
        const q = previewProto23Command(state, registry, id, context); if(q.visible) actions.push({id, label, eligible: q.eligible, reasons: q.reasons, costs: q.costs, duration: q.duration,
            description: 'Your one actual body and owned cargo use the existing retained passage; committed work and borrowed goods must be resolved.', command: {type: I.group, id}});
    }
    for(const j of state.simulation?.jobs.filter(j => j.actorId === 'player' && registry.simulation.commands.get(j.commandId)?.group === I.group) || [])
        actions.push({id: j.id + '.cancel', label: `Cancel ${j.label} and return exact reserved inputs`, eligible: true, reasons: [], command: {type: I.group, id: 'proto23.cancel', jobId: j.id}});
    const records = Object.entries(state.simulation?.knowledge.player || {}).filter(([id]) => id.startsWith(I.prefix)).map(([id, r]) => ({id, at: r.at,
        text: r.value, stage: r.stage, cause: r.cause, basis: r.basis, known: true, observerId: 'player', recipientId: 'player'}));
    if(d && state.actors.player.facts['proto23.cottageRight']) {const f = state.worlds[I.world].facts;
        records.push({id: 'proto23.cottage_status', at: state.clock, basis: null,
            text: `Your retained fixed cottage fixtures: bed ${f['proto23.bedInstalled'] ? 'installed' : 'not installed'}, hearth ${f['proto23.hearthInstalled'] ? 'installed' : 'not installed'}, bookstand ${f['proto23.bookstandInstalled'] ? 'installed' : 'not installed'}. Each selected work/rest job shares the actual station. Installed objects remain local; fuel is spent only by supported committed drying.`});}
    const sections = []; if(actions.length || records.length) sections.push({id: 'proto23.visitor', label: 'Proto23 · your furnished visitor life',
        description: d ? `${world === I.world ? 'You occupy this one retained village.' : 'Your changed cottage, residents and finite supplies await your return.'} Choose paid reading or a willing tutor, personally practice, install counted fixtures and prepare actual material. A compiled physical notebook supplies one narrow Shack kit route. No source pupil, inherited deed, global percentage stack or automatic output.` :
            '23html / Proto23; attributed village, reading and counted furnishings inspire an original independent native-body branch. Read its actual guest terms before choosing enrollment.', actions, records});
    return {visible: sections.length > 0, sections};
}
