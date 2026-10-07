// Pure current support and exact retained causes. This leaf never reads a
// native save, provisions stock, executes work or publishes another clock.
import {assert, natural, record} from './simulation_contracts.js';
import {statusCareSupportedBody} from './status_care_facts.js';
import {WORLD_COMPLETION_LEARNING_IDS as I, WORLD_COMPLETION_LEARNING_KEYS as K, worldCompletionLearningDefinitions as D} from './world_completion_learning_content.js';
import {REMAINDER_HOME_IDS as H} from './audit_remainder_home_content.js';
import {worldCompletionStripKey, worldCompletionStripStamp} from './world_completion_strip.js';

const P = I.prefix, definitions = new Map(D.commands.map(d => [d.id, d]));
export const sameWorldCompletionLearningData = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => sameWorldCompletionLearningData(v, b[n]));
    if(!record(a) || !record(b)) return false;
    return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameWorldCompletionLearningData(a[k], b[k]));
};
const same = sameWorldCompletionLearningData;
export function decodeWorldCompletionLearningRecord(value) {
    if(typeof value !== 'string') return null;
    try {const result = JSON.parse(value); return record(result) && JSON.stringify(result) === value ? result : null;} catch {return null;}
}
export function worldCompletionLearningBodyId(state, context = {}, actor = context.actorId || 'player') {
    const person = state.simulation?.people?.[actor], body = person?.body;
    if(actor === 'player') {
        const current = body?.id && body.form ? body : context.nativeBody;
        return statusCareSupportedBody(state, context) && typeof current?.id === 'string' ? current.id : null;
    }
    if(!['player', I.neri].includes(actor) || person?.definitionId !== actor || person.inventory !== 'simulation' || !(body?.hands >= 2) ||
        body?.form != null && String(body.form).toLowerCase() !== 'human') return null;
    return body?.id || actor + '.original_human_body';
}
const sequence = cause => /^(simulation|advance):[1-9][0-9]*$/.test(cause || '') ? Number(cause.split(':')[1]) : NaN;
const causeValid = (state, cause) => Number.isSafeInteger(sequence(cause)) && sequence(cause) <= state.sequence;
const count = v => natural(v) ? v : 0;
const done = (state, id, actor = 'player') => count(state.actors?.[actor]?.completed?.[P + id]);
const condition = (state, actor, id) => {
    const c = state.simulation?.conditions?.[actor]?.[id];
    return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
};
const hands = (state, actor) => !['body.sore_hands', 'body.scraped_hands', 'status.care.tired'].some(id => condition(state, actor, id));
const active = (state, actor, id) => {
    const source = state.actors?.[actor]?.sources?.[id], faculty = state.simulation?.faculties?.[actor]?.[id];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.active === true && faculty.awakened === true && faculty.suppressed === false;
};
const participants = d => [...new Set([d.actorId, ...(d.participants || []).map(id => id === '$target' ? d.targetId : id === '$actor' ? d.actorId : id)])];
export function worldCompletionLearningEnrolled(state) {
    return state.schema === 11 && state.auditRemainder?.schema === 1 && state.referenceGameplay?.schema === 1 && state.simulation?.schema >= 5 &&
        state.actors?.player?.facts?.['world.completion.enrolled'] === true && state.actors.player.completed?.['world.completion.begin'] === 1 &&
        state.actors.player.facts?.[P + 'enrolled'] === true && done(state, 'begin') === 1 && !!state.simulation?.situations?.[I.situation];
}
export function validWorldCompletionLearningEvidence(state, evidence, {lesson = false, complete = false} = {}) {
    return record(evidence) && evidence.schema === 1 && Object.keys(evidence).every(k => ['schema', 'sampleCause', 'measuredCause', 'teacherSourceCause', ...(complete ? ['cause', 'at', 'actorId'] : [])].includes(k)) &&
        causeValid(state, evidence.sampleCause) && causeValid(state, evidence.measuredCause) && sequence(evidence.measuredCause) > sequence(evidence.sampleCause) &&
        (lesson ? causeValid(state, evidence.teacherSourceCause) : evidence.teacherSourceCause === null) &&
        (!complete || /^simulation:[1-9][0-9]*$/.test(evidence.cause || '') && causeValid(state, evidence.cause) &&
            sequence(evidence.cause) > sequence(evidence.measuredCause) && natural(evidence.at) && evidence.at <= state.clock && ['player', I.neri].includes(evidence.actorId));
}
export function exactWorldCompletionLearningJob(state, job) {
    const d = definitions.get(job?.commandId), isLesson = ['learn_player', 'learn_neri'].some(id => d?.id === P + id);
    if(!d?.duration || job.revision !== d.revision || job.actorId !== d.actorId || job.targetId !== (d.targetId || null) ||
        !/^simulation:[1-9][0-9]*$/.test(job.id || '') || sequence(job.id) !== job.sequence || !causeValid(state, job.id) ||
        !natural(job.due) || job.due < d.duration || job.due - d.duration > state.clock || job.cancellation !== 'refund' || job.reservationReturns !== 1 ||
        job.siteId !== (d.siteId || null) || job.claim !== null || !same(job.participants, participants(d)) || !same(job.costs, d.costs) || !same(job.effects, d.effects) ||
        job.context?.actorId !== d.actorId || job.context?.targetId !== (d.targetId || null) || !Array.isArray(job.context?.partyIds) ||
        Object.keys(job.context).some(k => !['actorId', 'targetId', 'partyIds'].includes(k)) ||
        !same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'})) return false;
    const clock = job.worldCompletionLearningClock;
    if(!record(clock) || Object.keys(clock).sort().join(',') !== 'acceptedAt,bodyId,pausedMinutes,schema' || clock.schema !== 1 ||
        !natural(clock.acceptedAt) || clock.acceptedAt > state.clock || !natural(clock.pausedMinutes) || typeof clock.bodyId !== 'string' ||
        clock.acceptedAt + d.duration + clock.pausedMinutes !== job.due) return false;
    if(d.siteId && state.simulation?.sites?.[d.siteId]?.reservations?.[job.id] !== d.actorId) return false;
    const measured = isLesson || d.id === P + 'make_player' || d.id === P + 'make_neri';
    return measured ? validWorldCompletionLearningEvidence(state, job.worldCompletionLearning, {lesson: isLesson}) : job.worldCompletionLearning == null;
}
function free(state, actor, ownJob) {
    return !(state.pending || []).some(j => j.context?.actorId === actor) && !Object.values(state.actors?.[actor]?.techniques || {}).some(t => t.practice) &&
        !(state.simulation?.jobs || []).some(j => j.id !== ownJob?.id && (j.participants || [j.actorId]).includes(actor)) &&
        !Object.entries(state.simulation?.sessions || {}).some(([id, s]) => (s.participants || [id]).includes(actor)) &&
        !Object.values(state.simulation?.pursuits || {}).some(p => (p.actorId === actor || p.targetId === actor) && ['moving', 'waiting', 'encounter'].includes(p.status));
}
function npcBody(state, actor) {
    const p = state.simulation?.people?.[actor], b = p?.body;
    // These exact original residents predate explicit form fields. A supplied
    // foreign/clay form or controller cannot pass this old-human adapter.
    return p?.definitionId === actor && p.inventory === 'simulation' && p.life === 'alive' && state.actors?.[actor]?.worldId === I.world &&
        b?.hands >= 2 && (b.form == null || String(b.form).toLowerCase() === 'human') && (b.ownerId == null || b.ownerId === actor) &&
        (b.controllerId == null || b.controllerId === actor) && p.vitals?.health > 1 && hands(state, actor);
}
function unencumbered(state, context, actor, key) {
    return !Object.values(state.simulation?.custody || {}).some(c => (c.owner === actor || c.holder === actor) && c.key === key) &&
        !Object.values(context.equipment?.[actor] || state.simulation?.equipment?.[actor] || {}).includes(key);
}
export function worldCompletionLearningFacts(state, context = {}) {
    const s = state.simulation, actor = context.actorId || 'player', p = s?.people?.[actor], f = state.actors?.player?.facts || {}, w = state.worlds?.[I.world]?.facts || {};
    const global = state.schema === 11 && state.auditRemainder?.schema === 1 && state.referenceGameplay?.schema === 1 && s?.schema >= 5 &&
        f['world.completion.enrolled'] === true && state.actors?.player?.completed?.['world.completion.begin'] === 1;
    const enrolled = worldCompletionLearningEnrolled(state), stock = context.gameplay?.player?.inventory, v = context.vitals?.player;
    const nativeReady = record(stock) && Object.values(stock).every(natural) && record(v) && ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(v[k]) && v[k] >= 0) && v.health <= v.max_health && v.stamina <= v.max_stamina;
    const local = global && state.actors?.player?.worldId === I.world && statusCareSupportedBody(state, context) && nativeReady && v.health > 1 &&
        !state.realmPrototype?.activeVisitId && !state.featureDestination?.activeVisitId && !state.nestedCampaign?.activeVisitId && !state.bookWorldCampaign?.activeVisitId &&
        !state.chronicle?.session && state.chronicle?.life?.endedAt == null && (actor !== 'player' || !s?.sessions?.player);
    const location = actor === 'player' ? context.facts?.location || p?.location : p?.location;
    const candidate = context.worldCompletionLearningReservation || s?.jobs?.find(j => j.actorId === actor && j.commandId?.startsWith(P));
    const ownJob = exactWorldCompletionLearningJob(state, candidate) ? candidate : null;
    const held = (owner, key) => ownJob?.costs.some(e => e.type === 'item' && e.actor === owner && e.key === key && e.amount === -1);
    const owned = (owner, key) => unencumbered(state, context, owner, key) && (count((owner === 'player' ? stock : s?.owners?.[owner])?.[key]) > 0 || held(owner, key));
    const playerBody = local && p?.life === 'alive' && p?.inventory === 'native' && hands(state, 'player');
    const learner = local && (actor === 'player' ? playerBody : actor === I.neri && npcBody(state, I.neri) && state.actors[I.neri].facts?.['remainder_home.willing'] === true) && free(state, actor, ownJob);
    const frozenLearner = !ownJob || ownJob.worldCompletionLearningClock.bodyId === worldCompletionLearningBodyId(state, context, actor);
    const benchSite = s?.sites?.[I.bench], benchRight = global && benchSite?.owner === I.eda && benchSite.capacity === 1 &&
        f['remainder_home.benchRight'] === I.bench && state.actors?.player?.completed?.['remainder_home.terms'] === 1;
    const teacher = local && npcBody(state, I.eda) && s.people[I.eda].location === 'Village' &&
        state.actors?.[I.eda]?.facts?.['feature_objects.willing'] === true && free(state, I.eda, ownJob) && benchRight;
    const teacherMethod = active(state, I.eda, I.teacherMethod) && s?.powers?.[I.eda]?.[I.teacherMethod]?.owned === true;
    const sampleCause = context.facts?.['worldCompletion.sampleCause'], measuredCause = context.facts?.['worldCompletion.measuredCause'];
    const sample = context.facts?.['worldCompletion.measuredSample'] === true && causeValid(state, sampleCause) && causeValid(state, measuredCause) && sequence(measuredCause) > sequence(sampleCause);
    const evidence = ownJob?.worldCompletionLearning;
    const isLesson = ownJob && ['learn_player', 'learn_neri'].some(id => ownJob.commandId === P + id);
    const frozenSample = !evidence || sample && evidence.sampleCause === sampleCause && evidence.measuredCause === measuredCause &&
        (!isLesson || evidence.teacherSourceCause === state.actors?.[I.eda]?.sources?.[I.teacherMethod]?.receiptId);
    const neri = s?.people?.[I.neri], na = state.actors?.[I.neri], neriKnown = !!neri && f['remainder_home.residentMet'] === true && state.actors?.player?.completed?.['remainder_home.meet_resident'] === 1;
    const occupied = s?.claims?.[I.residence]?.owner === I.neri && s.claims[I.residence].status === 'held' && w['remainder_home.roomCompleted'] === true;
    const neriBody = neriKnown && npcBody(state, I.neri) && na.facts?.['remainder_home.willing'] === true;
    const neriContact = local && neriBody && neri.location === (context.facts?.location || s?.people?.player?.location) && free(state, I.neri, ownJob);
    const neriSettled = occupied && state.actors?.[I.neri]?.completed?.['remainder_home.resident_bind'] === 1 && state.actors?.player?.completed?.['remainder_home.collect_resident'] === 1 && !f['remainder_home.departed'];
    const response = w[P + 'response'], released = w[P + 'released'] === true;
    const methodOwned = s?.powers?.[actor]?.[I.method]?.owned === true;
    const method = methodOwned && active(state, actor, I.method) && s?.knowledge?.[actor]?.[P + 'procedure']?.stage === 'understood' &&
        validWorldCompletionLearningEvidence(state, decodeWorldCompletionLearningRecord(state.actors?.[actor]?.facts?.[P + 'lessonEvidence']), {lesson: true, complete: true});
    const neriAccepted = ['accepted', 'learned'].includes(response) && !released;
    const stripStock = actor === 'player' ? stock : s?.owners?.[actor];
    const stripAbsent = !Object.entries(stripStock || {}).some(([key, n]) => count(n) > 0 && (key === K.strip || worldCompletionStripStamp(key)));
    const produced = decodeWorldCompletionLearningRecord(na?.facts?.[P + 'madeEvidence']);
    const neriStripKey = validWorldCompletionLearningEvidence(state, produced, {complete: true}) ? worldCompletionStripKey({sampleCause: produced.sampleCause, measuredCause: produced.measuredCause, productionCause: produced.cause, makerId: I.neri}) : null;
    const collectable = response === 'made' && !released && neriContact && neriStripKey && owned(I.neri, neriStripKey) && count(stock?.[neriStripKey]) === 0 && done(state, 'make_neri', I.neri) === 1;
    const loanFree = !s?.jobs?.some(j => (j.participants || [j.actorId]).includes(I.neri));
    return {'worldCompletionLearning.enrolled': enrolled, 'worldCompletionLearning.local': local, 'worldCompletionLearning.canBegin': local && benchRight && location === 'Village' && playerBody,
        'worldCompletionLearning.benchRight': enrolled && benchRight, 'worldCompletionLearning.atBench': location === 'Village',
        'worldCompletionLearning.teacher': teacher, 'worldCompletionLearning.teacherMethod': teacherMethod,
        'worldCompletionLearning.learner': learner, 'worldCompletionLearning.frozenLearner': frozenLearner,
        'worldCompletionLearning.sample': sample, 'worldCompletionLearning.frozenSample': frozenSample,
        'worldCompletionLearning.offcut': owned(actor, K.offcut), 'worldCompletionLearning.methodOwned': methodOwned, 'worldCompletionLearning.method': method,
        'worldCompletionLearning.stripAbsent': stripAbsent, 'worldCompletionLearning.neriKnown': neriKnown, 'worldCompletionLearning.neriContact': neriContact,
        'worldCompletionLearning.neriHome': neriSettled && neri?.location === 'Shack' && context.facts?.['native.zone.Shack.accessible'] === true,
        'worldCompletionLearning.neriSettled': neriSettled, 'worldCompletionLearning.pending': enrolled && response === 'pending',
        'worldCompletionLearning.neriAccepts': neriSettled && neriBody && free(state, I.neri, ownJob) && na.resources?.attention >= 1 && neri.vitals.stamina >= 4 &&
            na.resources?.[P + 'escrow'] === 2 && owned(I.neri, K.offcut) && teacher && teacherMethod && sample,
        'worldCompletionLearning.neriAccepted': enrolled && neriAccepted, 'worldCompletionLearning.collectable': !!collectable,
        'worldCompletionLearning.neriStripKey': neriStripKey,
        'worldCompletionLearning.collectionVisible': enrolled && decodeWorldCompletionLearningRecord(f[P + 'publicAccount'])?.response === 'made',
        'worldCompletionLearning.releasable': enrolled && ['accepted', 'learned', 'made'].includes(response) && !released && loanFree,
        'worldCompletionLearning.withdrawable': enrolled && (response === 'refused' || released) && !done(state, 'learn_neri', I.neri) && loanFree && na?.resources?.[P + 'escrow'] === 2 && owned(I.neri, K.offcut),
        'worldCompletionLearning.neriReturn': enrolled && neri?.location === 'Village' && (['collected', 'withdrawn'].includes(response) || released) && free(state, I.neri, ownJob),
    };
}

export function validateWorldCompletionLearningState(state, registry) {
    const s = state.simulation, world = state.worlds?.[I.world]?.facts || {};
    const facts = Object.entries(state.actors || {}).flatMap(([actor, a]) => Object.entries(a.facts || {}).filter(([k]) => k.startsWith(P)).map(([k, v]) => [actor, k, v]));
    const completed = Object.entries(state.actors || {}).flatMap(([actor, a]) => Object.entries(a.completed || {}).filter(([k]) => k.startsWith(P)).map(([k, v]) => [actor, k, v]));
    const known = Object.entries(s?.knowledge || {}).flatMap(([actor, r]) => Object.entries(r).filter(([k]) => k.startsWith(P)).map(([k, v]) => [actor, k, v]));
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(P));
    const sources = Object.entries(state.actors || {}).flatMap(([actor, a]) => Object.keys(a.sources || {}).filter(k => k.startsWith(P)).map(k => [actor, k]));
    const powers = Object.entries(s?.powers || {}).flatMap(([actor, a]) => Object.keys(a).filter(k => k.startsWith(P)).map(k => [actor, k]));
    const controllers = Object.entries(s?.controllers || {}).filter(([id, c]) => id.includes(P) || c.definitionId?.startsWith(P));
    const worldRows = Object.entries(world).filter(([k]) => k.startsWith(P));
    const present = facts.length || completed.length || known.length || jobs.length || sources.length || powers.length || controllers.length || worldRows.length || s?.situations?.[I.situation];
    if(!present) return;
    assert(worldCompletionLearningEnrolled(state), 'Datum work needs explicit global and local expansion11/schema5 enrollment; older absence stays inert.');
    const situation = s.situations[I.situation], sd = D.situations[0];
    assert(situation.revision === 1 && same(situation.context, sd.context) && same(situation.privateTruth, sd.privateTruth) && same(situation.participants, sd.participants) &&
        situation.phase === 'open' && situation.receipts.length === 1 && situation.cause === s.knowledge.player?.[P + 'terms']?.cause, 'The datum lesson lost its exact optional terms situation.');
    for(const [actor, key, encoded] of facts) {
        const name = key.slice(P.length);
        const v = ['enrolled', 'ordinary'].includes(name) ? encoded : decodeWorldCompletionLearningRecord(encoded);
        assert(['player', I.neri].includes(actor) && ['enrolled', 'ordinary', 'lessonEvidence', 'madeEvidence', 'receivedEvidence', 'publicAccount'].includes(name), 'Unknown datum fact owner or field.');
        if(['enrolled', 'ordinary'].includes(name)) assert(actor === 'player' && v === true && done(state, name === 'enrolled' ? 'begin' : 'ordinary') === 1, 'Datum decision needs its actual command.');
        else if(name === 'publicAccount') {
            const receipt = s.knowledge?.player?.[P + 'account'];
            assert(actor === 'player' && record(v) && Object.keys(v).sort().join(',') === 'at,cause,location,released,response,schema' && v.schema === 1 &&
                ['unoffered', 'pending', 'accepted', 'refused', 'learned', 'made', 'collected', 'withdrawn'].includes(v.response) && typeof v.released === 'boolean' &&
                ['Village', 'Shack'].includes(v.location) && v.cause === receipt?.cause && v.at === receipt?.at && causeValid(state, v.cause), 'Neri’s public outcome needs an actual retained contact receipt.');
            const prerequisite = {pending: ['sponsor', 'player'], accepted: ['accept', I.neri], refused: ['refuse', I.neri], learned: ['learn_neri', I.neri],
                made: ['make_neri', I.neri], collected: ['collect', 'player']};
            if(prerequisite[v.response]) assert(done(state, ...prerequisite[v.response]) > 0, 'A public datum account cannot invent an unperformed decision.');
            if(v.response === 'withdrawn') assert(done(state, 'withdraw_village') + done(state, 'withdraw_shack') === 1, 'A withdrawal account requires its actual transfer.');
            if(v.released) assert(done(state, 'release_neri') === 1, 'A release account needs actual agreement.');
        }
        else {
            assert(validWorldCompletionLearningEvidence(state, v, {lesson: name === 'lessonEvidence', complete: true}), 'Invalid frozen datum evidence.');
            if(name === 'receivedEvidence') assert(actor === 'player' && done(state, 'collect') === 1 && v.actorId === I.neri && same(v, decodeWorldCompletionLearningRecord(state.actors[I.neri].facts[P + 'madeEvidence'])), 'Received strip needs the same real Neri production.');
            else assert(v.actorId === actor && done(state, name === 'lessonEvidence' ? actor === 'player' ? 'learn_player' : 'learn_neri' : actor === 'player' ? 'make_player' : 'make_neri', actor) > 0 &&
                s.knowledge?.[actor]?.[P + (name === 'lessonEvidence' ? 'procedure' : 'made')]?.cause === v.cause, 'Frozen datum evidence lacks its actual completion receipt.');
        }
    }
    for(const [actor, id, n] of completed) assert(definitions.get(id)?.actorId === actor && natural(n) && n > 0 && (!definitions.get(id).once || n === 1), 'Unknown or duplicate datum completion.');
    for(const [actor, key, r] of known) {
        if(key.startsWith(P + 'product.')) {
            const stamp = decodeWorldCompletionLearningRecord(r.value), expectedKey = stamp && worldCompletionStripKey(stamp);
            assert(stamp && Object.keys(stamp).length === 5 && stamp.schema === 1 && stamp.makerId === actor && ['player', I.neri].includes(actor) &&
                key === P + 'product.' + sequence(stamp.productionCause) && r.cause === stamp.productionCause && r.stage === 'seen' && natural(r.at) && r.at <= state.clock &&
                same(r.basis, {kind: 'observation', attributedTo: actor, situationId: I.situation}) && worldCompletionStripStamp(expectedKey) && causeValid(state, r.cause) &&
                done(state, actor === 'player' ? 'make_player' : 'make_neri', actor) > 0, 'A stamped product needs its actual maker’s unique committed production receipt.');
            continue;
        }
        const matches = D.commands.filter(d => done(state, d.id.slice(P.length), d.actorId) > 0).flatMap(d => d.effects.filter(e => e.type === 'knowledge' && e.actor === actor && e.key === key));
        assert(matches.some(e => r.value === e.value && r.stage === e.stage && same(r.basis, e.basis)) && causeValid(state, r.cause) && r.cause.startsWith('simulation:') && natural(r.at) && r.at <= state.clock,
            'Datum knowledge needs an actual completed action and its precise attributed receipt.');
    }
    for(const d of D.commands) if(done(state, d.id.slice(P.length), d.actorId)) for(const e of d.effects.filter(e => e.type === 'knowledge'))
        assert(s.knowledge?.[e.actor]?.[e.key], 'Completed datum work lost its authored account.');
    if(done(state, 'account_village') + done(state, 'account_shack')) assert(state.actors.player.facts[P + 'publicAccount'], 'An actual contact must retain its received public outcome.');
    for(const [actor, key] of [...sources, ...powers]) assert(['player', I.neri].includes(actor) && key === I.method, 'Datum instruction cannot grant another actor or teacher source.');
    for(const actor of ['player', I.neri]) {
        const learned = done(state, actor === 'player' ? 'learn_player' : 'learn_neri', actor), source = state.actors?.[actor]?.sources?.[I.method], power = s.powers?.[actor]?.[I.method], e = decodeWorldCompletionLearningRecord(state.actors?.[actor]?.facts?.[P + 'lessonEvidence']);
        assert(!!source === !!learned && !!power === !!learned && !!e === !!learned, 'A learned method requires the completed refundable lesson, not a supported profile.');
        if(learned) assert(source.revision === 1 && source.origin === 'trained' && source.receiptId === e.cause && source.acquiredAt === e.at && source.expiresAt == null &&
            power.revision === 1 && power.owned === true && power.cause === e.cause && power.mastery === 0 && power.fragments.length === 0 && power.lineage.length === 0,
            'Datum source/power must remain the actual learner’s taught method without copied teacher progression.');
        const products = Object.keys(s.knowledge?.[actor] || {}).filter(k => k.startsWith(P + 'product.'));
        assert(products.length === done(state, actor === 'player' ? 'make_player' : 'make_neri', actor), 'Each completed material job needs exactly one stamped production receipt.');
    }
    assert(worldRows.every(([k, v]) => k === P + 'response' && ['pending', 'accepted', 'refused', 'learned', 'made', 'collected', 'withdrawn'].includes(v) || k === P + 'released' && v === true), 'Unknown sponsored datum state.');
    const response = world[P + 'response'], offered = done(state, 'sponsor'), neri = state.actors?.[I.neri], withdrawn = done(state, 'withdraw_village') + done(state, 'withdraw_shack');
    assert(!!response === !!offered && withdrawn <= 1 && (!offered || neri && s.people[I.neri]?.definitionId === I.neri), 'Sponsorship needs the actual known resident and one offer.');
    if(offered) {
        const learned = done(state, 'learn_neri', I.neri), making = done(state, 'make_neri', I.neri), collected = done(state, 'collect');
        assert(!(done(state, 'accept', I.neri) && done(state, 'refuse', I.neri)) && (!learned || done(state, 'accept', I.neri) && done(state, 'walk_to_bench', I.neri)) && (!making || learned) && (!collected || making), 'Sponsored instruction keeps consent, travel, learning, production and transfer separate.');
        const reserved = jobs.filter(j => j.commandId === P + 'learn_neri').length;
        assert(neri.resources[P + 'escrow'] === 2 * (offered - learned - withdrawn - reserved), 'Only actual lesson completion or withdrawal can settle the two new escrow coins.');
        assert(['Village', 'Shack'].includes(s.people[I.neri].location) && (!done(state, 'return_home', I.neri) || s.people[I.neri].location === 'Shack' || s.people[I.neri].life === 'departed'), 'The actual resident must return from her own finite travel.');
    } else assert(!controllers.length && !completed.some(([actor]) => actor === I.neri) && neri?.resources?.[P + 'escrow'] == null, 'Unfunded datum terms create no resident agenda or escrow.');
    for(const [, c] of controllers) assert(c.definitionId === I.controller && c.actorId === I.neri && c.interval === 1 && natural(c.due) && c.due >= state.clock, 'Unknown datum controller or second scheduler.');
    for(const job of jobs) assert(exactWorldCompletionLearningJob(state, job) && job.due >= state.clock && job.due <= state.clock + definitions.get(job.commandId).duration,
        'Datum reservation lost its exact revision, participants, costs, support, site or frozen sample.');
    for(const [actor, p] of Object.entries(s.programs || {})) assert(!p.commandId?.startsWith(P), `Datum work is not an unrestricted routine for ${actor}.`);
    if(registry) for(const [family, values] of Object.entries(D)) for(const d of values) {
        const current = registry.simulation?.[family]?.get(d.id);
        const transferred = d.id === P + 'collect' && same({...current, costs: d.costs}, d) && current.costs?.length === 1 &&
            current.costs[0].type === 'transfer' && current.costs[0].from === I.neri && current.costs[0].to === 'player' && current.costs[0].count === 1 && worldCompletionStripStamp(current.costs[0].key)?.makerId === I.neri;
        assert(same(current, d) || transferred, 'Datum definitions differ from the accepted revision or exact maker-key transfer.');
    }
}
