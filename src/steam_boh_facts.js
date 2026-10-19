// Optional reads and exact compatibility checks over existing saved owners.
import {check} from './basics.js';
import {STEAM_BOH_IDS as I, steamBOHDefinitions as D} from './steam_boh_content.js';
import {steamBOHNatural as natural, steamBOHRecord as record, sameSteamBOHData as same,
    steamBOHSupport, steamBOHLearned, validSteamBOHWork} from './steam_boh_runtime.js';
import {statusCareCondition} from './status_care_facts.js';

const owned = key => typeof key === 'string' && key.startsWith(I.prefix);
const definitions = new Map(D.commands.map(d => [d.id, d]));
const fixedKnowledge = new Map(D.commands.flatMap(d => d.effects.filter(e => e.type === 'knowledge').map(e => [e.key, {d, e}])));
const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
export function steamBOHFacts(state, context = {}, registry) {
    const support = steamBOHSupport(state, context), f = state.actors?.player?.facts, completed = state.actors?.player?.completed;
    const prepared = f?.[I.prepared] === I.version && (completed?.[I.compare] === 1 || completed?.[I.guided] === 1);
    return {'steamBOH.enrolled': f?.[I.enrolled] === true, 'steamBOH.supported': support.supported,
        'steamBOH.handsUsable': support.handsUsable, 'steamBOH.authorSupported': support.authorSupported,
        'steamBOH.benchSupported': support.benchSupported, 'steamBOH.prepared': prepared,
        'steamBOH.learned': steamBOHLearned(state), 'steamBOH.fatigued': !!statusCareCondition(state, I.fatigue),
        'steamBOH.diagnosticAvailable': f?.[I.diagnostic] === true && completed?.[I.trial] === 1 && !!state.simulation?.knowledge?.player?.[`${I.prefix}diagnostic`],
        'steamBOH.workCurrent': !!context.steamBOHWork && validSteamBOHWork(state, context.steamBOHWork),
        ...Object.fromEntries(['manual', 'sound', 'sharp', 'fine'].map(name => [`steamBOH.own.${name}`, support.owns(name)]))};
}

export function validateSteamBOHState(state, registry) {
    const s = state.simulation, player = state.actors?.player, ownJobs = [];
    let activated = false;
    for (const [actorId, actor] of Object.entries(state.actors || {})) {
        check(!owned(actorId), 'Clearance study creates no second actor.');
        for (const [key, value] of Object.entries(actor.facts || {}).filter(([k]) => owned(k))) {
            activated = true;
            check(actorId === 'player' && [I.enrolled, I.diagnostic, I.prepared, I.procedure].includes(key), 'Unknown clearance fact or owner.');
            if (key === I.enrolled) check(value === true, 'Unsupported clearance enrollment.');
            else if (key === I.diagnostic) check(typeof value === 'boolean', 'A diagnostic is available or consumed, not an invented score.');
            else check(value === I.version, 'Unsupported clearance manual/procedure version.');
        }
        for (const [key, value] of Object.entries(actor.completed || {}).filter(([k]) => owned(k))) {
            activated = true;
            const d = definitions.get(key);
            check(actorId === 'player' && d && natural(value) && value > 0 && (!d.once || value === 1), 'Unknown or replayed clearance completion.');
        }
        for (const family of ['resources', 'sources', 'techniques']) check(!Object.keys(actor[family] || {}).some(owned), 'Clearance study owns no separate currency, source or practice.');
    }
    for (const world of Object.values(state.worlds || {})) check(!Object.keys(world.facts || {}).some(owned), 'A learned clearance procedure is not world truth.');
    for (const [actorId, records] of Object.entries(s?.knowledge || {})) for (const [key, known] of Object.entries(records).filter(([k]) => owned(k))) {
        activated = true;
        const fixed = fixedKnowledge.get(key);
        check(actorId === 'player' && fixed, 'Unknown clearance knowledge or owner.');
        const {d, e} = fixed;
        check(same(Object.keys(known).sort(), ['at', 'basis', 'cause', 'stage', 'value']) && known.stage === e.stage && known.value === e.value && same(known.basis, e.basis) &&
            natural(known.at) && known.at <= state.clock && natural(causeSequence(known.cause)) && causeSequence(known.cause) > 0 &&
            causeSequence(known.cause) <= state.sequence && player?.completed?.[d.id] > 0,
            'Clearance knowledge needs its exact completed work, topic and attribution.');
    }
    for (const [actorId, records] of Object.entries(s?.conditions || {})) for (const [key, condition] of Object.entries(records).filter(([k]) => owned(k))) {
        activated = true;
        const diagnostic = s?.knowledge?.player?.[`${I.prefix}diagnostic`];
        check(actorId === 'player' && key === I.fatigue && same(Object.keys(condition).sort(), ['cause', 'expiresAt', 'intensity']) &&
            condition.intensity === 1 && natural(condition.expiresAt) && condition.expiresAt === diagnostic?.at + 4 && condition.cause === diagnostic?.cause &&
            player?.completed?.[I.trial] === 1 && !player?.completed?.[I.rest] && !player?.completed?.[I.compare] && !player?.completed?.[I.guided] && !player?.completed?.[I.read],
            'Study fatigue must be the actual four-minute failed-trial aftermath.');
    }
    for (const job of s?.jobs || []) {
        if (owned(job.commandId)) {activated = true; ownJobs.push(job);}
        else check(job.steamBOHWork == null, 'A clearance work stamp belongs only to declared clearance work.');
    }
    for (const program of Object.values(s?.programs || {})) check(!owned(program.commandId), 'Clearance study admits no automated program.');
    for (const family of ['people', 'sites', 'custody', 'events', 'checks', 'controllers', 'sessions', 'claims', 'situations', 'energies', 'pursuits', 'causes'])
        check(!Object.keys(s?.[family] || {}).some(owned), 'Clearance study creates no duplicate people, site, custody or execution owner.');
    for (const family of ['faculties', 'powers', 'progression', 'titles', 'equipment', 'owners', 'relationships'])
        for (const rows of Object.values(s?.[family] || {})) check(!Object.keys(rows || {}).some(owned), 'Unknown clearance owned state.');
    if (!activated) return; // Old optional absence is inert: no item, fatigue or knowledge is inferred.
    check(s && player?.facts?.['feature_objects.introduced'] === true && s.people?.[I.owner]?.definitionId === I.owner &&
        s.people[I.owner].inventory === 'simulation' && state.actors?.[I.owner]?.worldId === I.world && record(s.owners?.[I.owner]) &&
        s.sites?.[I.site]?.owner === I.owner && s.situations?.[I.situation]?.revision === 1, 'Clearance study needs the actual introduced Eda, workshop bench and case.');
    check(player.facts[I.enrolled] === true && player.completed[I.begin] === 1, 'Clearance records need their explicit completed opening.');
    const done = id => player.completed[id] > 0;
    for (const [key, {d}] of fixedKnowledge) check(done(d.id) === !!s.knowledge?.player?.[key], 'A clearance completion and its retained history must stay paired.');
    const knownFor = id => s.knowledge.player[definitions.get(id).effects.find(e => e.type === 'knowledge').key];
    const opening = knownFor(I.begin);
    for (const [key, {d}] of fixedKnowledge) if (d.id !== I.begin && done(d.id)) check(s.knowledge.player[key].at >= opening.at + d.duration &&
        causeSequence(s.knowledge.player[key].cause) > causeSequence(opening.cause), 'Clearance results must follow their completed opening and real work time.');
    check(!(done(I.compare) && done(I.guided)), 'The clearance preparation routes are alternatives.');
    check((player.facts[I.prepared] === I.version) === (done(I.compare) || done(I.guided)), 'Preparation needs the actual completed comparison or guided work.');
    check((player.facts[I.procedure] === I.version) === done(I.read) && (!done(I.read) || player.facts[I.prepared] === I.version), 'The retained procedure needs prepared reading.');
    check((player.facts[I.diagnostic] != null) === done(I.trial) && (!done(I.trial) || player.facts[I.diagnostic] === !done(I.compare)), 'The diagnostic is created by trial and consumed only by the topic comparison.');
    check(!done(I.compare) || done(I.trial), 'Diagnostic comparison requires the failed-reading history.');
    check(!done(I.rest) || done(I.trial), 'Study rest requires its actual failed-trial history.');
    if (done(I.trial) && !done(I.rest) && state.clock < knownFor(I.trial).at + 4)
        check(!!s.conditions?.player?.[I.fatigue], 'Study fatigue cannot disappear before its completed rest or actual expiry.');
    for (const [earlier, later] of [[I.trial, I.rest], [I.trial, I.compare], [I.trial, I.guided], [I.compare, I.read], [I.guided, I.read]]) if (done(earlier) && done(later)) {
        const a = knownFor(earlier), b = knownFor(later);
        check(a.at + definitions.get(later).duration <= b.at && causeSequence(a.cause) < causeSequence(b.cause), 'Clearance preparation history must precede its consumer and work time.');
    }
    if (done(I.trial)) for (const id of [I.compare, I.guided]) if (done(id)) {
        const recoveryAt = done(I.rest) ? knownFor(I.rest).at : knownFor(I.trial).at + 4;
        check(knownFor(id).at >= recoveryAt + definitions.get(id).duration && (!done(I.rest) || causeSequence(knownFor(I.rest).cause) < causeSequence(knownFor(id).cause)), 'Preparation must follow actual played recovery or the completed specific study rest.');
    }
    for (const variant of ['sharp', 'fine']) if (done(`${I.prefix}kits_${variant}`)) check(done(I.read) &&
        knownFor(`${I.prefix}kits_${variant}`).at >= knownFor(I.read).at + 3 &&
        causeSequence(knownFor(`${I.prefix}kits_${variant}`).cause) > causeSequence(knownFor(I.read).cause), 'The useful kit route needs the actual learned procedure and work time.');
    check(ownJobs.length <= 1, 'The player cannot run parallel clearance study jobs.');
    for (const job of ownJobs) {
        const d = definitions.get(job.commandId);
        const jobKeys = ['id', 'sequence', 'commandId', 'revision', 'actorId', 'targetId', 'due', 'effects', 'costs', 'cancellation', 'siteId', 'claim', 'label', 'roll', 'outcomeId', 'context', 'participants', 'reservationReturns', 'completionSupport', 'steamBOHWork'];
        check(d?.duration && same(Object.keys(job).sort(), jobKeys.sort()) && job.revision === d.revision && job.actorId === 'player' && job.targetId === (d.targetId || null) &&
            job.id === `simulation:${job.sequence}` && natural(job.sequence) && job.sequence > 0 && job.sequence <= state.sequence &&
            same(job.participants, d.targetId ? ['player', I.owner] : ['player']) && job.context?.actorId === 'player' && job.context.targetId === (d.targetId || null) &&
            same(Object.keys(job.context), ['actorId', 'targetId', 'partyIds']) && same(job.context.partyIds, s.party) &&
            job.siteId === (d.siteId || null) && job.claim === null && job.label === d.label && job.roll === null && job.outcomeId === null &&
            job.cancellation === 'refund' && job.reservationReturns === 1 && same(job.costs, d.costs) && same(job.effects, d.effects) &&
            validSteamBOHWork(state, job) && job.due >= state.clock &&
            same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: 'Village', failure: 'refund'}) &&
            (!d.siteId || s.sites[d.siteId].reservations[job.id] === 'player') && (!d.once || !done(d.id)),
            'The saved clearance work differs from its exact admitted costs, held returns, participants, time or support.');
        if (job.commandId === I.trial || job.commandId === I.compare || job.commandId === I.guided) check(!done(I.compare) && !done(I.guided) && !done(I.read), 'Preparation work cannot begin after its result.');
        if (job.commandId === I.compare) check(player.facts[I.diagnostic] === true, 'The comparison must reserve an unused diagnostic.');
        if (job.commandId === I.rest) check(done(I.trial), 'Study rest needs an actual failed trial.');
        if (job.commandId === I.read) check(player.facts[I.prepared] === I.version && !done(I.read), 'Reading needs completed preparation.');
        if (job.commandId.startsWith(`${I.prefix}kits_`)) check(steamBOHLearned(state), 'The accepted kit job needs the retained learned procedure.');
        if (registry) check(same(registry.simulation.commands.get(d.id), d), 'Unsupported clearance work definition.');
    }
}
