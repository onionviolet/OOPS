import {worldCompletionLearningNeriConservation} from './world_completion_learning_runtime.js';
import {lorePracticeOwnerDeltas} from './lore_practice_facts.js';
// Pure current support and strict typed-owner validation. No host, simulation
// executor, UI, inventory mirror, second clock or namespace initialization.
import {assert, natural, record} from './simulation_contracts.js';
import {REMAINDER_HOME_IDS as I, REMAINDER_HOME_KEYS as K, remainderHomeDefinitions as D} from './audit_remainder_home_content.js';

const P = 'remainder_home.', defs = {get: id => D.commands.find(d => d.id === id), has: id => D.commands.some(d => d.id === id)}, advances = {get: id => D.advancements.find(d => d.id === id)};
const count = value => natural(value) ? value : 0;
const same = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
};
const sequence = cause => /^(simulation|advance):[1-9][0-9]*$/.test(cause || '') ? Number(cause.split(':')[1]) : NaN;
const currentCondition = (state, actor, id) => {
    const c = state.simulation?.conditions?.[actor]?.[id];
    return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
};
const activeSource = (state, actor, id) => {
    const source = state.actors?.[actor]?.sources?.[id], faculty = state.simulation?.faculties?.[actor]?.[id];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true && faculty.active === true && faculty.suppressed !== true;
};
function jobParticipants(d) {return [...new Set([d.actorId, ...(d.participants || []).map(id => id === '$target' ? d.targetId : id === '$actor' ? d.actorId : id)])];}
// Only this immutable revision's actual reservation can stand in for a held
// native tool. The root passes the popped job transiently during settlement.
export function exactRemainderHomeJob(state, job) {
    const d = defs.get(job?.commandId);
    return !!d?.duration && job.revision === d.revision && job.actorId === d.actorId && job.targetId === (d.targetId || null) &&
        /^simulation:[1-9][0-9]*$/.test(job.id || '') && sequence(job.id) === job.sequence && natural(job.sequence) && job.sequence <= state.sequence &&
        natural(job.due) && job.due >= d.duration && job.due - d.duration <= state.clock && job.cancellation === 'refund' && job.reservationReturns === 1 &&
        job.siteId === d.siteId && job.claim === (d.claim || null) && state.simulation?.sites?.[d.siteId]?.reservations?.[job.id] === d.actorId &&
        same(job.participants, jobParticipants(d)) && job.context?.actorId === d.actorId && job.context.targetId === (d.targetId || null) &&
        Array.isArray(job.context.partyIds) && Object.keys(job.context).every(k => ['actorId', 'targetId', 'partyIds'].includes(k)) &&
        same(job.costs, d.costs) && same(job.effects, d.effects) &&
        same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'});
}
function freeActor(state, id, ownJob) {
    const s = state.simulation;
    return !(state.pending || []).some(j => j.context?.actorId === id) && !Object.values(state.actors?.[id]?.techniques || {}).some(t => !!t.practice) &&
        !(s?.jobs || []).some(j => j.id !== ownJob?.id && (j.participants || [j.actorId]).includes(id)) &&
        !Object.entries(s?.sessions || {}).some(([actor, session]) => (session.participants || [actor]).includes(id)) &&
        !Object.values(s?.pursuits || {}).some(p => p.actorId === id && ['investigating', 'moving', 'searching', 'waiting', 'sheltered'].includes(p.status));
}
const unencumbered = (state, context, actor, key) =>
    !Object.values((state.simulation?.people?.[actor]?.inventory === 'native' ? context.equipment?.[actor] : null) || state.simulation?.equipment?.[actor] || {}).includes(key) &&
    !Object.values(state.simulation?.custody || {}).some(c => (c.holder === actor || c.owner === actor) && c.key === key);
function firsthand(state, key, commandIds) {
    const r = state.simulation?.knowledge?.player?.[key];
    return !!r && r.stage === 'seen' && r.basis?.kind === 'observation' && r.basis.attributedTo === 'player' &&
        r.basis.situationId === (key.startsWith(P) ? I.situation : 'feature_objects.sluice') &&
        /^simulation:[1-9][0-9]*$/.test(r.cause || '') && natural(r.at) && r.at <= state.clock && sequence(r.cause) <= state.sequence &&
        commandIds.some(id => count(state.actors?.player?.completed?.[id]) > 0);
}
const cutCommands = ['sharp', 'fine'].flatMap(variant => ['own', 'loan'].map(owner => `feature_objects.cut_${variant}_${owner}`));
const dryCommands = ['shade', 'braced', 'shelf'].map(route => `feature_objects.dry_${route}`);
const hasObservations = state => firsthand(state, 'feature_objects.cut', cutCommands) && dryCommands.some(id => firsthand(state, id, [id])) &&
    dryCommands.some(id => state.simulation?.knowledge?.player?.[id]?.cause !== state.simulation?.knowledge?.player?.['feature_objects.cut']?.cause && firsthand(state, id, [id]));
const done = (state, id, actor = 'player') => count(state.actors?.[actor]?.completed?.[id]);

export function remainderHomeFacts(state, context = {}, registry) {
    const s = state.simulation, a = state.actors?.player, f = a?.facts || {}, actorId = context.actorId || 'player';
    const enabled = state.schema === 11 && state.auditRemainder?.schema === 1;
    const localClock = enabled && a?.worldId === I.world && !state.realmPrototype?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null;
    const stock = context.gameplay?.player?.inventory, vitals = context.vitals?.player;
    const nativeReady = record(stock) && Object.values(stock).every(natural) && record(vitals) &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) && vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const location = actorId === 'player' ? context.facts?.location || s?.people?.player?.location : s?.people?.[actorId]?.location;
    const candidate = context.auditRemainderHomeReservation || (s?.jobs || []).find(j => defs.has(j.commandId) && j.actorId === actorId);
    const ownJob = exactRemainderHomeJob(state, candidate) && candidate.actorId === actorId ? candidate : null;
    const held = (actor, key) => ownJob?.actorId === actor && ownJob.costs.some(e => e.type === 'item' && e.actor === actor && e.key === key && e.amount === -1);
    const owned = (actor, key) => unencumbered(state, context, actor, key) && (count((actor === 'player' ? stock : s?.owners?.[actor])?.[key]) >= 1 || held(actor, key));
    const player = s?.people?.player;
    const usableHands = (player?.body?.hands ?? 2) >= 2 && !currentCondition(state, 'player', 'body.sore_hands') && !currentCondition(state, 'player', 'body.scraped_hands');
    const playerSupported = localClock && actorId === 'player' && nativeReady && player?.life === 'alive' && player.inventory === 'native' && vitals.health > 1 && usableHands && !s?.sessions?.player;
    const site = s?.sites?.[I.bench], eda = s?.people?.[I.eda], ea = state.actors?.[I.eda];
    const sitePresent = site?.owner === I.eda && site.capacity === 1 && eda?.definitionId === I.eda && ea?.worldId === I.world;
    const right = enabled && sitePresent && f[P + 'benchRight'] === I.bench && done(state, P + 'terms') === 1 && s?.knowledge?.player?.[P + 'terms']?.stage === 'understood';
    const edaSupported = localClock && location === 'Village' && eda?.life === 'alive' && eda.inventory === 'simulation' && eda.location === 'Village' && eda.body?.hands >= 2 &&
        eda.vitals?.health > 1 && ea?.facts?.['feature_objects.willing'] === true && freeActor(state, I.eda, ownJob);
    const workshop = s?.sites?.[I.workshop], w = state.worlds?.[I.world]?.facts || {};
    const workshopNativeAvailable = context.facts?.['native.zone.Shack.accessible'] === true;
    const workshopEarned = enabled && workshop?.owner === 'player' && workshop.capacity === 1 && f['field.facility'] === true && done(state, 'field.workshop.assembly') === 1 && w['project.field.workshop.assembly'] === true;
    const roomTerms = f[P + 'roomTerms'] === I.workshop && done(state, P + 'room_terms') === 1 && w[`project.${I.room}.started`] === true;
    const roomFrame = done(state, I.room + '.frame') === 1 && w[`project.${I.room}.frame`] === true;
    const roomCompleted = roomFrame && done(state, I.room + '.finish') === 1 && w[`project.${I.room}.finish`] === true && w[P + 'roomCompleted'] === true;
    const claim = s?.claims?.[I.residence], n = s?.people?.[I.resident], na = state.actors?.[I.resident];
    const nbody = n?.definitionId === I.resident && n.inventory === 'simulation' && n.life === 'alive' && n.location === 'Shack' && na?.worldId === I.world && n.body?.hands >= 2 && n.vitals?.health > 1;
    const learningResponse=w['world.completion.learning.response'];
    const learningReserved=(state.actors?.[I.resident]?.resources?.['world.completion.learning.escrow']||0)>0||(['pending','accepted','learned','made','collected'].includes(learningResponse)&&w['world.completion.learning.released']!==true&&!done(state,'world.completion.learning.return_home',I.resident));
    const nfree = freeActor(state, I.resident, ownJob)&&!learningReserved;
    const residentSupported = enabled && workshopNativeAvailable && nbody && na?.facts?.[P + 'willing'] === true && nfree;
    const residentMethod = enabled && activeSource(state, I.resident, I.method) && s?.powers?.[I.resident]?.[I.method]?.owned === true && s?.knowledge?.[I.resident]?.[P + 'resident_method']?.stage === 'understood';
    const occupied = roomCompleted && claim?.status === 'held' && claim.owner === I.resident && done(state, P + 'resident_accept', I.resident) === 1 && f[P + 'departed'] !== true;
    const unoccupied = workshopEarned && roomCompleted && claim?.status === 'held' && claim.owner === 'player';
    const tracks = s?.progression?.player?.[I.track], chosen = f[P + 'specialization'];
    const branchSupported = name => enabled && chosen === name && tracks?.branches?.[name]?.group === I.exclusive &&
        tracks.receipts?.[name === 'loaded' ? I.loadedAdvance : I.fineAdvance] === tracks.branches[name].cause;
    const conditioned = enabled && f['body.gripLearned'] === true && done(state, 'body.grip_drill') >= 2 && done(state, 'body.condition_grip') === 1 &&
        player?.body?.['palms.callused'] === true && usableHands && activeSource(state, 'player', 'body.conditioned_grip') && s?.knowledge?.player?.['body.grip']?.stage === 'understood';
    const ordinarySkill = Number.isFinite(context.nativeSkillLevels?.Climbing) && context.nativeSkillLevels.Climbing >= 1;
    const fieldTrial = done(state, P + 'ordinary_trial') === 1 && firsthand(state, P + 'ordinary_trial', [P + 'ordinary_trial']) && !!s?.knowledge?.[I.eda]?.[P + 'trial_witness'];
    const researchKnown = done(state, P + 'research') === 1 && s?.knowledge?.player?.[P + 'research']?.stage === 'understood';
    return {
        'remainderHome.localClock': localClock, 'remainderHome.benchSupported': playerSupported && location === 'Village' && sitePresent,
        'remainderHome.edaSupported': edaSupported, 'remainderHome.edaMeasuringMethod': edaSupported && activeSource(state, I.eda, I.grain) && s?.powers?.[I.eda]?.[I.grain]?.owned === true,
        'remainderHome.benchRight': right,
        'remainderHome.coverBuilt': right && done(state, P + 'cover') === 1 && w[P + 'cover'] === I.bench,
        // Missing native weather evidence blocks the uncovered route rather
        // than guessing that an unsupported or absent world is dry.
        'remainderHome.dryWeather': typeof context.facts?.['weather.raining'] === 'boolean' && context.facts['weather.raining'] === false,
        'remainderHome.sharpKnife': nativeReady && owned('player', K.sharp),
        'remainderHome.playerKit': nativeReady && owned('player', K.kit), 'remainderHome.jig': nativeReady && owned('player', K.jig),
        'remainderHome.observations': enabled && hasObservations(state), 'remainderHome.researchKnown': researchKnown,
        'remainderHome.jigBuilt': researchKnown && done(state, P + 'build_jig') === 1 && !!s?.knowledge?.player?.[P + 'jig'],
        'remainderHome.conditioned': conditioned, 'remainderHome.ordinarySkill': ordinarySkill, 'remainderHome.fieldTrial': fieldTrial,
        'remainderHome.noSpecialization': enabled && !chosen && !Object.keys(tracks?.branches || {}).length && !Object.keys(tracks?.receipts || {}).length,
        'remainderHome.loadedSpecialist': branchSupported('loaded') && conditioned, 'remainderHome.fineSpecialist': branchSupported('fine') && conditioned,
        'remainderHome.workshopEarned': workshopEarned, 'remainderHome.workshopSupported': playerSupported && location === 'Shack' && workshopEarned && workshopNativeAvailable,
        'remainderHome.roomTerms': roomTerms, 'remainderHome.roomFrame': roomFrame, 'remainderHome.roomCompleted': roomCompleted,
        'remainderHome.unoccupied': unoccupied, 'remainderHome.occupied': occupied,
        'remainderHome.residentMet': done(state, P + 'meet_resident') === 1 && !!n && f[P + 'residentMet'] === true,
        'remainderHome.residentSupported': residentSupported, 'remainderHome.residentMethod': residentMethod,
        'remainderHome.invitationOpen': done(state, P + 'meet_resident') === 1 && !done(state, P + 'invite') && !done(state, P + 'decline') && !f[P + 'invited'] && !f[P + 'declined'],
        'remainderHome.invitationFunded': done(state, P + 'invite') === 1 && f[P + 'invited'] === true && na?.facts?.[P + 'invitationPending'] === true &&
            count(s?.owners?.[I.resident]?.[K.kit]) >= 1 && count(s?.owners?.[I.resident]?.[K.log]) >= 1 && na?.resources?.coins >= 2,
        'remainderHome.residentKit': owned(I.resident, K.kit),
        'remainderHome.serviceFunded': done(state, P + 'invite') === 1 && na?.facts?.[P + 'serviceOffered'] === true && !done(state, P + 'resident_bind', I.resident),
        'remainderHome.residentDone': done(state, P + 'resident_bind', I.resident) === 1 && na?.facts?.[P + 'serviceDone'] === true,
        'remainderHome.residentFree': enabled && nfree,
    };
}

function receipt(state, actor, key, commandId, advancement = false) {
    const d = advancement ? advances.get(commandId) : defs.get(commandId);
    const expected = d?.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === P + key);
    const r = state.simulation?.knowledge?.[actor]?.[P + key];
    assert(expected && r && r.stage === expected.stage && r.value === expected.value && same(r.basis, expected.basis) && natural(r.at) && r.at <= state.clock &&
        Number.isSafeInteger(sequence(r.cause)) && sequence(r.cause) > 0 && sequence(r.cause) <= state.sequence &&
        r.cause.startsWith(advancement ? 'advance:' : 'simulation:'), 'Local home work lost its exact committed, attributed receipt.');
    return r;
}
function pair(state, key, witness, id, advancement = false) {
    const p = receipt(state, 'player', key, id, advancement), e = receipt(state, I.eda, witness, id, advancement);
    assert(p.cause === e.cause && p.at === e.at, 'The paid home-work account lost its actual shared witness.'); return p;
}
function later(before, after, duration = 0) {
    assert(sequence(after.cause) > sequence(before.cause) && after.at >= before.at + duration, 'Home work requires its actual earlier paid prerequisite.');
}

export function validateRemainderHome(state, registry) {
    const s = state.simulation, a = state.actors?.player, f = a?.facts || {}, w = state.worlds?.[I.world]?.facts || {};
    const actorRows = Object.entries(state.actors || {}).flatMap(([actor, value]) => [...Object.keys(value.facts || {}), ...Object.keys(value.completed || {})].filter(k => k.startsWith(P)).map(k => [actor, k]));
    const knowledgeRows = Object.entries(s?.knowledge || {}).flatMap(([actor, value]) => Object.keys(value).filter(k => k.startsWith(P)).map(k => [actor, k]));
    const worldKeys = Object.keys(w).filter(k => k.startsWith(P) || k.startsWith(`project.${I.room}.`));
    const jobs = (s?.jobs || []).filter(j => defs.has(j.commandId) || j.commandId?.startsWith(P));
    const track = s?.progression?.player?.[I.track];
    const sources = Object.entries(state.actors || {}).flatMap(([actor, value]) => Object.keys(value.sources || {}).filter(k => k.startsWith(P)).map(k => [actor, k]));
    const powers = Object.entries(s?.powers || {}).flatMap(([actor, value]) => Object.keys(value).filter(k => k.startsWith(P)).map(k => [actor, k]));
    const present = actorRows.length || knowledgeRows.length || worldKeys.length || jobs.length || track || sources.length || powers.length || s?.people?.[I.resident] || s?.claims?.[I.residence] || s?.situations?.[I.situation];
    if(!present) return;
    assert(state.schema === 11 && state.auditRemainder?.schema === 1 && s?.schema >= 4, 'Home work requires explicit expansion11/auditRemainder1 enrollment; preserve older and absent state.');
    assert(state.auditRemainder?.modules?.home == null, 'Home work uses typed facts, knowledge, claims and progression only; no mirrored module state is accepted.');
    assert(sources.every(([actor, id]) => actor === I.resident && id === I.method) && powers.every(([actor, id]) => actor === I.resident && id === I.method),
        'Neri owns her declared learned operation; home work cannot grant a player or another actor a free source.');
    assert(done(state, P + 'terms') === 1 && f[P + 'benchRight'] === I.bench && s.sites?.[I.bench]?.owner === I.eda && s.sites[I.bench].capacity === 1 &&
        s.people?.[I.eda]?.definitionId === I.eda && state.actors?.[I.eda]?.worldId === I.world && s.situations?.[I.situation]?.revision === 1,
        'Home work needs its actual Eda site owner, declared permission and explicit local terms.');
    const allowedFacts = {player: ['benchRight', 'specialization', 'roomTerms', 'residentMet', 'invited', 'declined', 'collected', 'departed'],
        [I.resident]: ['willing', 'invitationPending', 'accepted', 'serviceOffered', 'serviceDone']};
    for(const [actor, key] of actorRows) {
        const v = state.actors[actor];
        if(Object.hasOwn(v.facts, key)) {
            assert(allowedFacts[actor]?.includes(key.slice(P.length)), 'Unsupported home actor fact or owner.');
            if(actor === I.resident) assert(typeof v.facts[key] === 'boolean', 'Resident decisions require exact boolean facts.');
        }
        if(Object.hasOwn(v.completed, key)) {
            const d = defs.get(key); assert(d && d.actorId === actor && natural(v.completed[key]) && (!d.once || v.completed[key] <= 1) && !d.advancementId,
                'Unsupported home completion, once-only action or command-only specialization substitute.');
        }
    }
    assert(worldKeys.every(k => ['cover', 'roomCompleted'].map(n => P + n).concat(['started', 'frame', 'finish'].map(n => `project.${I.room}.${n}`)).includes(k)), 'Unsupported local home world fact.');
    const allowedKnowledge = {};
    for(const d of [...D.commands, ...D.advancements]) for(const e of d.effects) if(e.type === 'knowledge') (allowedKnowledge[e.actor] ||= new Set()).add(e.key);
    assert(knowledgeRows.every(([actor, key]) => allowedKnowledge[actor]?.has(key)), 'Unsupported local home knowledge owner or field.');
    if(registry) for(const [family, values] of Object.entries(D)) for(const d of values) assert(same(registry.simulation?.[family]?.get(d.id), d), 'Current home definitions differ from the immutable accepted revision.');
    const termsReceipt = pair(state, 'terms', 'permission', P + 'terms');
    assert(f['feature_objects.jointInspected'] === true && done(state, 'feature_objects.inspect') === 1, 'Build permission follows actual joint inspection.');
    const cover = done(state, P + 'cover');
    assert((w[P + 'cover'] === I.bench) === (cover === 1) && (w[P + 'cover'] == null || w[P + 'cover'] === I.bench), 'An unfinished cover cannot affect the local wet job.');
    if(cover) later(termsReceipt, pair(state, 'cover', 'cover_witness', P + 'cover'), 5);
    const research = done(state, P + 'research'), jig = done(state, P + 'build_jig');
    if(research) {
        assert(hasObservations(state), 'Research requires two distinct committed firsthand cutting and drying results.');
        later(termsReceipt, pair(state, 'research', 'research_witness', P + 'research'), 4);
    }
    if(jig) {assert(research === 1, 'Physical jig construction requires completed paid research.'); later(receipt(state, 'player', 'research', P + 'research'), receipt(state, 'player', 'jig', P + 'build_jig'), 3);}
    const receiptCommand = new Map();
    for(const d of D.commands) if(!d.advancementId) for(const e of d.effects) if(e.type === 'knowledge') {
        const token = `${e.actor}:${e.key}`;
        if(done(state, d.id, d.actorId) > 0) receiptCommand.set(token, {actor: e.actor, key: e.key.slice(P.length), id: d.id});
    }
    // Shared trim account is the latest of two exact alternate commands.
    for(const [actor, key] of knowledgeRows) {
        if(key === P + 'specialization' || key === P + 'specialization_witness') continue;
        const options = D.commands.filter(d => done(state, d.id, d.actorId) > 0 && d.effects.some(e => e.type === 'knowledge' && e.actor === actor && e.key === key));
        assert(options.some(d => {
            const expected = d.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === key), r = s.knowledge[actor][key];
            return expected.value === r.value && expected.stage === r.stage && same(expected.basis, r.basis) && r.cause?.startsWith('simulation:') &&
                natural(r.at) && r.at <= state.clock && Number.isSafeInteger(sequence(r.cause)) && sequence(r.cause) <= state.sequence;
        }), 'A local home knowledge receipt has no actual matching completed action.');
    }
    for(const entry of receiptCommand.values()) assert(s.knowledge?.[entry.actor]?.[P + entry.key], 'A completed home action lost its result receipt.');
    for(const name of ['salvage_ordinary', 'salvage_delicate']) if(done(state, P + name)) {
        assert(jig === 1, 'Salvage needs an actually built reusable jig.'); later(receipt(state, 'player', 'jig', P + 'build_jig'), receipt(state, 'player', name, P + name), name.endsWith('delicate') ? 2 : 4);
    }
    const trial = done(state, P + 'ordinary_trial');
    if(trial) {assert(f['body.gripLearned'] === true && done(state, 'body.grip_drill') >= 2 && done(state, 'body.condition_grip') === 1, 'Ordinary field trial requires the actual earned conditioning.'); later(termsReceipt, pair(state, 'ordinary_trial', 'trial_witness', P + 'ordinary_trial'), 3);}
    if(track || f[P + 'specialization'] != null) {
        assert(record(track) && same(track.values, {}) && record(track.branches) && record(track.receipts) && Object.keys(track.branches).length === 1 && Object.keys(track.receipts).length === 1 && trial === 1,
            'Only one actually earned exclusive local specialization may be retained.');
        const name = f[P + 'specialization'], id = name === 'loaded' ? I.loadedAdvance : name === 'fine' ? I.fineAdvance : null, b = track.branches[name];
        assert(id && b && Object.keys(b).every(k => ['group', 'cause', 'at'].includes(k)) && b.group === I.exclusive && track.receipts[id] === b.cause,
            'The specialization fact must match its actual mutually exclusive advancement.');
        const r = pair(state, 'specialization', 'specialization_witness', id, true);
        assert(r.cause === b.cause && r.at === b.at, 'Specialization lost its actual paid advancement cause.'); later(receipt(state, 'player', 'ordinary_trial', P + 'ordinary_trial'), r);
    } else assert(!s.knowledge?.player?.[P + 'specialization'] && !s.knowledge?.[I.eda]?.[P + 'specialization_witness'], 'Unchosen training grants no knowledge.');
    if(done(state, P + 'salvage_delicate')) assert(f[P + 'specialization'] === 'fine', 'Delicate fitting requires its own earned branch.');
    if(done(state, P + 'survey_loaded')) assert(f[P + 'specialization'] === 'loaded', 'Loaded control requires its own earned branch.');
    const rt = done(state, P + 'room_terms'), frame = done(state, I.room + '.frame'), finish = done(state, I.room + '.finish');
    if(rt) {
        assert(f[P + 'roomTerms'] === I.workshop && w[`project.${I.room}.started`] === true && s.sites?.[I.workshop]?.owner === 'player' && s.sites[I.workshop].capacity === 1 &&
            f['field.facility'] === true && done(state, 'field.workshop.assembly') === 1 && w['project.field.workshop.assembly'] === true,
            'Room terms require the actual earned player-owned Shack field-workshop site.');
        later(termsReceipt, receipt(state, 'player', 'room_terms', P + 'room_terms'));
    } else assert(!frame && !finish && f[P + 'roomTerms'] == null && !worldKeys.some(k => k.startsWith(`project.${I.room}.`)), 'Unaccepted room terms grant no construction phase.');
    assert((w[`project.${I.room}.frame`] === true) === (frame === 1) && (w[`project.${I.room}.finish`] === true) === (finish === 1) && (w[P + 'roomCompleted'] === true) === (finish === 1), 'Room completion must follow both actual material phases.');
    assert([w[`project.${I.room}.frame`], w[`project.${I.room}.finish`], w[P + 'roomCompleted']].every(v => v == null || v === true), 'Only a completed phase may write its exact true construction fact.');
    if(frame) {assert(rt === 1, 'Room framing requires its declared terms.'); later(receipt(state, 'player', 'room_terms', P + 'room_terms'), receipt(state, 'player', 'room_frame', I.room + '.frame'), 4);}
    if(finish) {assert(frame === 1, 'Habitable completion requires the actual frame.'); later(receipt(state, 'player', 'room_frame', I.room + '.frame'), receipt(state, 'player', 'room_finished', I.room + '.finish'), 3);}
    const met = done(state, P + 'meet_resident'), invite = done(state, P + 'invite'), decline = done(state, P + 'decline'), accept = done(state, P + 'resident_accept', I.resident), service = done(state, P + 'resident_bind', I.resident), collection = done(state, P + 'collect_resident'), depart = done(state, P + 'departure');
    const n = s.people?.[I.resident], na = state.actors?.[I.resident], claim = s.claims?.[I.residence];
    assert(invite + decline <= 1 && (!invite || met) && (!decline || met) && (!accept || invite) && (!service || accept) && (!collection || service) && (!depart || accept), 'Invitation, occupation, funded service, collection and departure have distinct once-only prerequisites.');
    for(const [key, value] of [['residentMet', met], ['invited', invite], ['declined', decline], ['collected', collection], ['departed', depart]]) assert((f[P + key] === true) === (value === 1) && (f[P + key] == null || f[P + key] === true), 'Unsupported residence decision fact.');
    if(finish) {
        assert(claim?.status === 'held' && claim.owner === (accept && !depart ? I.resident : 'player') && natural(claim.at) && claim.at === receipt(state, 'player', 'room_finished', I.room + '.finish').at,
            'The one real room must retain exactly one correct residence claim.');
        const ownerCause = depart ? receipt(state, 'player', 'departure', P + 'departure').cause : accept ? receipt(state, I.resident, 'acceptance', P + 'resident_accept').cause : receipt(state, 'player', 'room_finished', I.room + '.finish').cause;
        assert(claim.cause === ownerCause, 'Residence occupancy lost its actual construction/acceptance/departure cause.');
    } else assert(!claim && !met && !n && !na, 'An unfinished room grants no residence claim or new helper.');
    if(met) {
        const extra=lorePracticeOwnerDeltas(state)[I.resident], learning=worldCompletionLearningNeriConservation(state);
        assert(finish === 1 && n?.definitionId === I.resident && n.definitionRevision === 1 && n.inventory === 'simulation' && n.location === learning.location && na?.worldId === I.world &&
            record(s.owners?.[I.resident]) && Object.keys(na.resources).every(k => ['coins', 'attention', ...Object.keys(extra.resources),...learning.resourceKeys].includes(k)) && n.vitals?.max_health === 18 && n.vitals?.max_stamina === 8 &&
            ['alive', 'departed'].includes(n.life) && (n.life === 'departed') === !!depart,
            'Resident identity/body/stock must remain the actual independent once-met actor.');
        const meetReceipt = receipt(state, 'player', 'resident_terms', P + 'meet_resident'), method = receipt(state, I.resident, 'resident_method', P + 'meet_resident');
        assert(meetReceipt.cause === method.cause && meetReceipt.at === method.at && n.bornAt === meetReceipt.at && n.createdBy === 'player' && na.sources?.[I.method] && s.powers?.[I.resident]?.[I.method]?.owned === true,
            'The resident needs her declared own body and learned operation; funding cannot manufacture competence.');
        later(receipt(state, 'player', 'room_finished', I.room + '.finish'), meetReceipt);
        const controller = s.controllers?.[`${I.resident}:remainder_home.resident_controller`];
        assert(controller?.actorId === I.resident && controller.definitionId === 'remainder_home.resident_controller' && controller.interval === 1 && natural(controller.due),
            'The willing resident requires her actual own one-minute controller, not player puppeteering or free automatic material.');
        const pending = jobs.find(j => j.actorId === I.resident && j.commandId === P + 'resident_bind'), spent = service + (pending ? 1 : 0);
        assert(na.resources.coins === invite * 2 - spent + extra.coins && na.resources.attention === 2 - spent + extra.attention - learning.attentionSpent && n.vitals?.stamina === 8 - spent * 2 + extra.stamina - learning.staminaSpent &&
            count(s.owners[I.resident][K.log]) === invite - spent + extra.log && count(s.owners[I.resident][K.kit]) === invite - (pending ? 1 : 0) + service - collection + extra.kit &&
            count(s.owners[I.resident][K.offcut])===learning.offcut&&(!learning.stripKey||count(s.owners[I.resident][learning.stripKey])===learning.strip)&&
            (na.resources['world.completion.learning.escrow']||0)===learning.escrow&&
            Object.keys(s.owners[I.resident]).every(k => [K.log, K.kit,...learning.stockKeys].includes(k)), 'Resident funding, material, returned kit, purse and effort must conserve exactly; no refill is accepted.');
        assert((na.facts[P + 'accepted'] === true) === !!accept && (na.facts[P + 'serviceDone'] === true) === !!service && na.facts[P + 'willing'] === !depart &&
            (na.facts[P + 'invitationPending'] === true) === !!(invite && !accept) && (na.facts[P + 'serviceOffered'] === true) === !!(accept && !service && !depart), 'The independent resident decisions must match their actual outcomes.');
        if(invite) later(meetReceipt, receipt(state, 'player', 'invitation', P + 'invite'));
        if(accept) later(receipt(state, 'player', 'invitation', P + 'invite'), receipt(state, I.resident, 'acceptance', P + 'resident_accept'));
        if(service) later(receipt(state, I.resident, 'acceptance', P + 'resident_accept'), receipt(state, I.resident, 'service', P + 'resident_bind'), 5);
        if(collection) later(receipt(state, I.resident, 'service', P + 'resident_bind'), receipt(state, 'player', 'collected', P + 'collect_resident'));
        if(depart) assert(!pending, 'An occupied room cannot release its resident during reserved work.');
    } else assert(!n && !na, 'Opening a room/menu cannot create a prospective resident.');
    for(const j of jobs) {
        const d = defs.get(j.commandId);
        assert(exactRemainderHomeJob(state, j) && j.due >= state.clock && j.due <= state.clock + d.duration && (!d.once || done(state, d.id, d.actorId) === 0), 'Home work lost its exact refundable costs, site, participant support or frozen revision.');
        if(d.claim) assert(s.claims?.[d.claim]?.status === 'held' && s.claims[d.claim].owner === d.actorId && s.claims[d.claim].cause === j.id, 'A construction phase lost its exact reserved unique claim.');
    }
    assert(jobs.filter(j => j.actorId === 'player').length <= 1 && jobs.filter(j => j.actorId === I.resident).length <= 1, 'One body cannot reserve simultaneous home jobs.');
}
