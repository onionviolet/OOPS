// Optional views and exact saved contracts over existing owners.
import {check} from './basics.js';
import {STEAM_ONI_IDS as I, steamONIDefinitions as D} from './steam_oni_content.js';
import {steamONINatural as natural, steamONIRecord as record, sameSteamONIData as same,
    steamONISupport, steamONITrayPresent, validSteamONIWork} from './steam_oni_runtime.js';
const owned = key => typeof key === 'string' && key.startsWith(I.prefix);
const definitions = new Map(D.commands.map(d => [d.id, d]));
const fixedKnowledge = new Map(D.commands.flatMap(d => d.effects.filter(e => e.type === 'knowledge').map(e => [e.key, {d, e}])));
const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
export function steamONIFacts(state, context = {}, registry) {
    const support = steamONISupport(state, context);
    return {'steamONI.enrolled': state.actors?.player?.facts?.[I.enrolled] === true, 'steamONI.supported': support.supported,
        'steamONI.handsUsable': support.handsUsable, 'steamONI.trayPresent': steamONITrayPresent(state),
        'steamONI.workCurrent': !!context.steamONIWork && validSteamONIWork(state, context.steamONIWork),
        'steamONI.own.logs': support.owns('log', 2), 'steamONI.own.herbs': support.owns('herbs'), 'steamONI.own.sap': support.owns('sap')};
}
export function validateSteamONIState(state, registry) {
    const s = state.simulation, player = state.actors?.player, ownJobs = [];
    let activated = false;
    for (const [actorId, actor] of Object.entries(state.actors || {})) {
        check(!owned(actorId), 'Nursery work creates no second actor.');
        for (const [key, value] of Object.entries(actor.facts || {}).filter(([k]) => owned(k))) {
            activated = true;
            check(actorId === 'player' && [I.enrolled, I.built].includes(key) && value === true, 'Unknown nursery fact or owner.');
        }
        for (const [key, value] of Object.entries(actor.completed || {}).filter(([k]) => owned(k))) {
            activated = true;
            const d = definitions.get(key);
            check(actorId === 'player' && d && natural(value) && value > 0 && (!d.once || value === 1), 'Unknown or replayed nursery completion.');
        }
        for (const family of ['resources', 'sources', 'techniques']) check(!Object.keys(actor[family] || {}).some(owned), 'Nursery work owns no separate currency or skill.');
    }
    for (const world of Object.values(state.worlds || {})) check(!Object.keys(world.facts || {}).some(owned), 'Your nursery is not a world-wide crop.');
    for (const [actorId, records] of Object.entries(s?.knowledge || {})) for (const [key, known] of Object.entries(records).filter(([k]) => owned(k))) {
        activated = true;
        const fixed = fixedKnowledge.get(key);
        check(actorId === 'player' && fixed, 'Unknown nursery knowledge or owner.');
        const {d, e} = fixed;
        check(same(Object.keys(known).sort(), ['at', 'cause', 'stage', 'value']) && known.stage === e.stage && known.value === e.value &&
            natural(known.at) && known.at <= state.clock && natural(causeSequence(known.cause)) && causeSequence(known.cause) > 0 &&
            causeSequence(known.cause) <= state.sequence && player?.completed?.[d.id] > 0,
            'Nursery knowledge needs its exact completed work and account.');
    }
    for (const job of s?.jobs || []) {
        if (owned(job.commandId)) {activated = true; ownJobs.push(job);}
        else check(job.steamONIWork == null, 'A nursery work stamp belongs only to nursery work.');
    }
    for (const [id, site] of Object.entries(s?.sites || {}).filter(([k]) => owned(k))) {
        activated = true;
        check(id === I.site && record(site) && same(Object.keys(site).sort(), ['capacity', 'owner', 'reservations']) &&
            site.owner === 'player' && site.capacity === 1 && record(site.reservations), 'Unknown nursery site or ownership.');
        for (const [jobId, actor] of Object.entries(site.reservations)) check(actor === 'player' && ownJobs.some(j => j.id === jobId && j.commandId === I.cycle), 'The tray can reserve only its actual current nursery round.');
    }
    for (const program of Object.values(s?.programs || {})) check(!owned(program.commandId), 'Choose each nursery round yourself.');
    for (const id of Object.keys(s?.situations || {}).filter(owned)) {activated = true; check(id === I.situation, 'Unknown nursery situation.');}
    for (const family of ['people', 'conditions', 'custody', 'events', 'checks', 'controllers', 'sessions', 'claims', 'energies', 'pursuits', 'causes'])
        check(!Object.keys(s?.[family] || {}).some(owned), 'The nursery creates no duplicate body, crop or execution owner.');
    for (const family of ['conditions', 'faculties', 'powers', 'progression', 'titles', 'equipment', 'owners', 'relationships'])
        for (const rows of Object.values(s?.[family] || {})) check(!Object.keys(rows || {}).some(owned), 'Unknown nursery owned state.');
    if (!activated) return;
    check(s && s.people?.player?.inventory === 'native' && player?.facts?.[I.enrolled] === true && player.completed[I.begin] === 1,
        'Nursery records need your completed optional plan and existing body.');
    const done = id => player.completed[id] > 0;
    for (const [key, {d}] of fixedKnowledge) check(done(d.id) === !!s.knowledge?.player?.[key], 'A nursery completion and its account must stay paired.');
    check((player.facts[I.built] === true) === done(I.build) && !!s.sites[I.site] === done(I.build), 'Only completed construction creates your nursery tray.');
    const knownFor = id => s.knowledge.player[definitions.get(id).effects.find(e => e.type === 'knowledge').key];
    const opening = knownFor(I.begin);
    const situation = D.situations[0];
    check(same(s.situations?.[I.situation], {definitionId: I.situation, revision: situation.revision, context: situation.context,
        privateTruth: situation.privateTruth, participants: ['player'], phases: ['idle'], phase: 'idle', cause: opening.cause,
        openedAt: opening.at, deadline: null, receipts: [{from: null, to: 'idle', at: opening.at, cause: opening.cause}]}),
        'The nursery plan needs its exact player-only opening and unchanged local context.');
    if (done(I.build)) check(knownFor(I.build).at >= opening.at + 4 && causeSequence(knownFor(I.build).cause) > causeSequence(opening.cause), 'Construction follows the nursery plan and four minutes of work.');
    if (done(I.cycle)) check(done(I.build) && knownFor(I.cycle).at >= knownFor(I.build).at + player.completed[I.cycle] * 5 &&
        causeSequence(knownFor(I.cycle).cause) >= causeSequence(knownFor(I.build).cause) + player.completed[I.cycle], 'Every nursery harvest needs its completed tray and five minutes of new work.');
    check(ownJobs.length <= 1, 'You cannot tend parallel nursery rounds.');
    for (const job of ownJobs) {
        const d = definitions.get(job.commandId);
        const jobKeys = ['id', 'sequence', 'commandId', 'revision', 'actorId', 'targetId', 'due', 'effects', 'costs', 'cancellation', 'siteId', 'claim', 'label', 'roll', 'outcomeId', 'context', 'participants', 'reservationReturns', 'completionSupport', 'steamONIWork'];
        check(d?.duration && same(Object.keys(job).sort(), jobKeys.sort()) && job.revision === d.revision && job.actorId === 'player' && job.targetId === null &&
            job.id === `simulation:${job.sequence}` && natural(job.sequence) && job.sequence > 0 && job.sequence <= state.sequence &&
            same(job.participants, ['player']) && job.context?.actorId === 'player' && job.context.targetId === null &&
            same(Object.keys(job.context).sort(), ['actorId', 'partyIds', 'targetId']) && same(job.context.partyIds, s.party) &&
            job.siteId === (d.siteId || null) && job.claim === null && job.label === d.label && job.roll === null && job.outcomeId === null &&
            job.cancellation === 'refund' && job.reservationReturns === 1 && same(job.costs, d.costs) && same(job.effects, d.effects) &&
            validSteamONIWork(state, job) && job.due >= state.clock &&
            same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: false, location: 'Shack', failure: 'refund'}) &&
            (!d.siteId || s.sites[d.siteId]?.reservations[job.id] === 'player') && (!d.once || !done(d.id)),
            'The saved nursery work differs from its exact supplies, returns, participants, time or shelter.');
        check(job.commandId !== I.cycle || steamONITrayPresent(state), 'A nursery round needs your already completed tray.');
        if (registry) check(same(registry.simulation.commands.get(d.id), d), 'Unsupported nursery work definition.');
    }
    if (registry && done(I.build)) check(same(registry.simulation.sites.get(I.site), D.sites[0]), 'Unsupported nursery tray definition.');
    if (registry) check(same(registry.simulation.situations.get(I.situation), situation), 'Unsupported nursery plan definition.');
}
