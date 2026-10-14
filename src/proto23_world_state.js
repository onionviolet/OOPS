import {PROTO23_IDS as I, PROTO23_LOCATIONS as L, PROTO23_OPTIONAL_NATIVE_LOCATIONS, PROTO23_FOOTPRINTS as footprints, PROTO23_FRONTIER,
    PROTO23_SOURCE_SNAPSHOT, PROTO23_SOURCE_HASH, PROTO23_INITIAL_FACTS, proto23Definitions} from './proto23_world_content.js';
import {createRealmConnection, realmConnectionBinding, validateRealmConnectionBinding} from './realm_connections.js';
import {validateWorldRecords, planWorldClock} from './world_instances.js';
import {jsonData} from './simulation_contracts.js';
import {compactEndedWorldVisits, previewWorldVisitRoom} from './world_visit_history.js';
const assert = (ok, text) => {if(!ok) throw Error(text);}, natural = x => Number.isSafeInteger(x) && x >= 0;
const shape = (v, keys, label) => assert(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k)), `Unsupported ${label} fields.`);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const prefix = key => key.startsWith(I.prefix);
export const PROTO23_VISIT_CAPACITY = 128;
export const proto23LocationWorld = Object.fromEntries([...Object.values(L), ...PROTO23_OPTIONAL_NATIVE_LOCATIONS].map(id => [id, I.world]));
export function createProto23Connections() {return [createRealmConnection({id: 'proto23.entry', revision: 1,
    from: PROTO23_FRONTIER, to: footprints[0].endpoint, kind: 'physical', controllerId: 'player', bidirectional: true,
    duration: 0, lifetime: null, requirements: {id: 'proto23.entry.approval', revision: 1, operations: ['passage'], bodyForms: ['human'], costs: []},
    layerPolicy: {passage: true, manifestation: false, contact: false}, cargoPolicy: {allowed: true, maxUnits: Number.MAX_SAFE_INTEGER, allowEquipped: true, classes: ['carried']}, flows: ['body', 'cargo']})];}
const bindings = createProto23Connections().map(realmConnectionBinding);
export function activeProto23Visit(state) {const d = state.proto23Village; return d?.visits.find(v => v.id === d.activeVisitId && v.status === 'active') || null;}
export function validateProto23State(state) {
    const d = state.proto23Village, s = state.simulation, people = proto23Definitions.people;
    const residentIds = new Set(people.map(p => p.id));
    for(const id of Object.keys(state.actors || {}).filter(prefix)) assert(residentIds.has(id), 'Unknown Proto23 actor identity.');
    for(const id of Object.keys(s?.people || {}).filter(prefix)) assert(residentIds.has(id), 'Unknown Proto23 native person identity.');
    if(d == null) {
        assert(!state.worlds?.[I.world] && !people.some(p => state.actors?.[p.id] || s?.people?.[p.id]) && state.actors?.player?.worldId !== I.world, 'Proto23 presence needs its deliberately activated optional owner.');
        assert(!(s?.jobs || []).some(j => prefix(j.commandId || '')), 'Proto23 work cannot outlive its owner.');
        assert(!Object.keys(s?.sites || {}).some(prefix), 'Absent Proto23 cannot retain its local work stations.');
        for(const [id, actor] of Object.entries(state.actors || {})) {
            assert(!Object.keys(actor.resources || {}).some(prefix) && !Object.keys(actor.sources || {}).some(prefix), 'Absent Proto23 cannot retain local means.');
            if(id === 'player') assert(!Object.keys(actor.completed || {}).some(k => prefix(k) && k !== 'proto23.chart') && !Object.keys(actor.facts || {}).some(k => prefix(k) && k !== 'proto23.chart'), 'Absent Proto23 retains only deliberate entry reading.');
        }
        assert(!Object.keys(s?.knowledge?.player || {}).some(k => prefix(k) && k !== 'proto23.chart'), 'Absent Proto23 retains only its explicit terms.');
        return true;
    }
    jsonData(d); shape(d, ['schema', 'definitionRevision', 'sourceSnapshot', 'sourceHash', 'initializedAt', 'nativeRevision', 'bodyPolicy', 'absence', 'entryProfile', 'instances', 'visits', 'activeVisitId', 'connections', 'receipts'], 'Proto23 state');
    assert(state.schema === 11 && d.schema === 1 && d.definitionRevision === 1 && d.sourceSnapshot === PROTO23_SOURCE_SNAPSHOT && d.sourceHash === PROTO23_SOURCE_HASH &&
        d.bodyPolicy === 'same_native_body' && d.absence === 'freeze' && d.entryProfile === 'independent_visitor', 'Unsupported exact Proto23 source/body/clock semantics. Preserve this save for its matching reader.');
    assert(natural(d.initializedAt) && d.initializedAt <= state.clock && natural(d.nativeRevision) && Array.isArray(d.instances) && d.instances.length === 1 &&
        Array.isArray(d.visits) && d.visits.length <= PROTO23_VISIT_CAPACITY, 'Invalid retained Proto23 owner/history.');
    validateWorldRecords({definitions: footprints.map(f => f.definition), instances: d.instances, visits: d.visits},
        {actorIds: Object.keys(state.actors), externalInstances: [{id: 'frontier.main', worldId: 'base.frontier', parentInstanceId: null}]});
    const f = footprints[0], instance = d.instances[0];
    assert(instance.id === f.instanceId && instance.worldId === I.world && instance.continuityId === f.continuityId && instance.eraId === f.eraId &&
        instance.parentInstanceId === null && instance.clock.observedAt <= state.clock, 'Proto23 retained era/continuity changed.');
    const facts = state.worlds?.[I.world]?.facts;
    assert(facts && Object.keys(facts).length === Object.keys(PROTO23_INITIAL_FACTS[I.world]).length &&
        Object.keys(PROTO23_INITIAL_FACTS[I.world]).every(k => typeof facts[k] === 'boolean'), 'Unknown or missing exact Proto23 local facts.');
    assert(Array.isArray(d.connections) && d.connections.length === 1, 'Missing Proto23 physical doorway.');
    d.connections.forEach((c, index) => {validateRealmConnectionBinding(c, bindings[index]); assert(c.open && c.openedAt === d.initializedAt, 'Proto23 doorway approval changed.');});
    const visit = activeProto23Visit(state), active = d.visits.filter(v => v.status === 'active');
    assert(d.activeVisitId === null ? active.length === 0 : !!visit && active.length === 1 && visit.actorId === 'player', 'One actual native body needs one Proto23 visit.');
    assert((state.actors.player.worldId === I.world) === !!visit && (!visit || visit.endpoint.worldId === I.world && proto23LocationWorld[s?.people.player?.location] === I.world), 'Proto23 active body, visit and place disagree.');
    assert(!visit || ![state.bookWorldCampaign, state.motherOfLearning, state.nestedCampaign, state.featureDestination, state.realmPrototype].some(x => x?.activeVisitId), 'The actual body cannot occupy another retained visit.');
    for(const p of people) {
        const a = state.actors[p.id], person = s?.people[p.id], b = person?.body;
        assert(a?.worldId === I.world && person?.inventory === 'native' && person.definitionId === p.id && person.definitionRevision === 1 && person.location === p.location,
            'Missing exact independently retained Proto23 resident/place.');
        assert(b?.id === `native.person.${p.id}.body` && b.ownerId === p.id && b.controllerId === p.id && b.form === 'human', 'Proto23 resident body belongs to its own independent owner.');
        assert(natural(a.resources.coins) && natural(a.resources.attention) && a.resources.attention <= p.resources.attention, 'Resident purse/attention must be finite nonnegative owned means.');
    }
    for(const site of proto23Definitions.sites) assert(s.sites[site.id]?.capacity === site.capacity, 'Missing actual Proto23 work-station capacity.');
    for(const j of (s.jobs || []).filter(j => prefix(j.commandId))) {
        const def = proto23Definitions.commands.find(c => c.id === j.commandId);
        assert(def?.duration > 0 && state.actors.player.worldId === def.worldId && s.people.player.location === def.location &&
            j.actorId === 'player' && j.targetId === (def.targetId || null) && j.context?.actorId === 'player' && j.context.targetId === (def.targetId || null) &&
            j.revision === 1 && j.reservationReturns === 1 && j.cancellation === 'refund' && j.siteId === (def.siteId || null) && j.claim === (def.claim || null) &&
            same(j.costs, def.costs) && same(j.effects, def.effects) && same(j.participants, ['player', ...(def.targetId ? [def.targetId] : [])]) &&
            j.completionSupport?.schema === 1 && j.completionSupport.failure === 'refund' && j.completionSupport.location === def.location &&
            j.completionSupport.coLocated === !!def.completionCoLocated && same(j.completionSupport.requires, def.completionRequires), 'Proto23 work differs from its exact frozen owner, reservations or completion support.');
    }
    for(const session of Object.values(s.sessions || {})) assert(!prefix(session.commandId || ''), 'No Proto23 opposed session is selected in this slice.');
    for(const program of Object.values(s.programs || {})) assert(!prefix(program.commandId || ''), 'Choose each Proto23 operation deliberately; no autonomous infinite work routine is admitted.');
    const player = state.actors.player, done = player.completed || {}, pf = player.facts || {};
    const claims = new Set(proto23Definitions.commands.map(c => c.claim).filter(Boolean));
    for(const id of Object.keys(s.claims || {}).filter(prefix)) assert(claims.has(id) && s.claims[id].owner === 'player', 'Unknown Proto23 claim or changed physical owner.');
    const knownPlayerRecords = new Set(['proto23.enrollment', ...proto23Definitions.commands.flatMap(c => c.effects || []).filter(e => e.type === 'knowledge' && e.actor === 'player').map(e => e.key)]);
    for(const [actor, records] of Object.entries(s.knowledge || {})) for(const key of Object.keys(records).filter(prefix))
        assert(actor === 'player' ? knownPlayerRecords.has(key) : actor === I.steward && key === 'proto23.received_note', 'Unknown Proto23 observed/delivered record.');
    for(const [actor, record] of Object.entries(state.actors)) if(actor !== 'player') assert(!Object.entries(record.completed || {}).some(([id, count]) => prefix(id) && count !== 0), 'Proto23 action receipts belong to the actual player.');
    const commandIds = new Set(proto23Definitions.commands.map(c => c.id));
    const factKeys = new Set(proto23Definitions.commands.flatMap(c => c.effects || []).filter(e => e.type === 'fact' && e.actor === 'player').map(e => e.key));
    for(const key of Object.keys(done).filter(prefix)) assert(commandIds.has(key), 'Unknown Proto23 action receipt.');
    for(const key of Object.keys(pf).filter(prefix)) assert(factKeys.has(key), 'Unknown Proto23 player fact.');
    for(const def of proto23Definitions.commands) {
        const count = done[def.id] || 0; assert(natural(count) && count <= state.sequence && (!def.once || count <= 1), 'Invalid Proto23 action completion count.');
    }
    const complete = name => done[I.prefix + name] === 1;
    const exactFlag = (key, expected) => assert(expected ? pf[I.prefix + key] === true : pf[I.prefix + key] == null, 'Proto23 learned/right fact needs its actual once completion.');
    exactFlag('chart', complete('chart')); exactFlag('stewardMet', complete('arrival'));
    assert(facts['proto23.arrivalMet'] === complete('arrival'), 'Proto23 arrival knowledge needs its actual board observation.');
    exactFlag('cottageRight', complete('cottage_agreement'));
    const learned = complete('read_handling') || complete('instruction_handling');
    assert(!(complete('read_handling') && complete('instruction_handling')), 'The two lesson approaches share one actual learned claim.');
    exactFlag('handlingLearned', learned); exactFlag('handlingPracticed', complete('practice_handling')); exactFlag('bookstandUsed', complete('bookstand_compare')); exactFlag('noteCompiled', complete('compile_notebook'));
    assert(learned ? pf['proto23.learningRoute'] === (complete('read_handling') ? 'reading' : 'instruction') : pf['proto23.learningRoute'] == null, 'Lesson route attribution changed.');
    const lesson = s.knowledge?.player?.['proto23.handling'];
    assert(learned ? lesson?.stage === 'understood' && lesson.basis?.kind === 'instruction' && lesson.basis.attributedTo ===
        (complete('read_handling') ? I.steward : I.tutor) && lesson.basis.situationId === I.situation : lesson == null, 'The handling lesson needs its actual observed paid approach.');
    for(const name of ['bed', 'hearth', 'bookstand']) {
        const completed = complete('install_' + name), claim = s.claims[I.prefix + 'fixture.' + name];
        assert(facts[I.prefix + name + 'Installed'] === completed && (!completed || claim?.status === 'settled' && claim.owner === 'player'), 'A fixed cottage fixture needs its exact consumed-item installation claim.');
    }
    assert(facts['proto23.arcClosed'] === complete('compile_notebook'), 'Local quest closure needs the actual physical notebook compilation.');
    for(const [flag, ids] of Object.entries({worked: ['sorting_work'], declined: ['decline'], bedUsed: ['bed_rest'],
        staveShaped: ['shape_ordinary', 'shape_practiced'], hearthUsed: ['hearth_dry_stave', 'hearth_dry_offcuts'], stavePrepared: ['hearth_dry_stave']}))
        exactFlag(flag, ids.some(id => (done[I.prefix + id] || 0) > 0));
    for(const p of people) for(const key of ['coins', 'attention']) {
        let expected = p.resources[key];
        for(const def of proto23Definitions.commands) for(const e of [...def.costs, ...def.effects])
            if(e.type === 'resource' && !e.native && e.actor === p.id && e.key === key) expected += e.amount * (done[def.id] || 0);
        for(const j of s.jobs.filter(j => prefix(j.commandId))) for(const e of j.costs)
            if(e.type === 'resource' && !e.native && e.actor === p.id && e.key === key) expected += e.amount;
        assert(natural(expected) && state.actors[p.id].resources[key] === expected, 'Proto23 resident purse/attention differs from actual completed payments and current reservations.');
    }
    const received = s.knowledge?.[I.steward]?.['proto23.received_note'];
    assert(complete('received_review') ? received?.stage === 'understood' && received.basis?.kind === 'instruction' && received.basis.attributedTo === 'player' && received.basis.situationId === I.situation : received == null,
        'Mara knows only the notebook account actually delivered to her.');
    assert(Array.isArray(d.receipts) && d.receipts.length <= 128, 'Invalid bounded Proto23 passage receipts.');
    const hostIds = new Set(['proto23.enroll', 'proto23.enter', 'proto23.return', ...Object.keys(L).map(k => 'proto23.move.' + k)]);
    for(const r of d.receipts) {shape(r, ['id', 'at', 'sequence'], 'Proto23 receipt'); assert(hostIds.has(r.id) && natural(r.at) && r.at <= state.clock && natural(r.sequence) && r.sequence <= state.sequence, 'Unknown Proto23 host receipt or invalid time.');}
    return true;
}
export function syncProto23Clock(state) {const d = state.proto23Village; if(!d) return state; const instance = d.instances[0];
    if(instance.clock.observedAt !== state.clock) {const q = planWorldClock(instance, {playedAt: state.clock, visits: d.visits, expectedRevision: instance.revision}, footprints[0].definition);
        assert(q.allowed, q.reasons.join(' ')); d.instances[0] = q.nextInstance;} return state;}
export function nextProto23Boundary() {return Infinity;}
const room = additional => ({capacity: PROTO23_VISIT_CAPACITY, additional, synchronize: syncProto23Clock, validate: validateProto23State});
export const previewProto23VisitRoom = (state, additional = 1) => previewWorldVisitRoom(state, 'proto23Village', room(additional));
export const stageProto23VisitRoom = (state, additional = 1) => compactEndedWorldVisits(state, 'proto23Village', room(additional));
