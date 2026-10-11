// Optional projection and history checks over the same Eda, items and jobs.
import {STEAM_LAMB_IDS as I, steamLambDefinitions as D} from './steam_lamb_content.js';
import {steamLambNatural as natural, steamLambRecord as record, sameSteamLambData as same, steamLambCauseSequence as sequence,
    steamLambSupport, steamLambQualified, steamLambOffice, steamLambApproval, steamLambInspectionAvailable,
    steamLambUnappointed, validSteamLambWork, steamLambWorkCurrent} from './steam_lamb_runtime.js';
const check = (ok, message) => {if (!ok) throw new Error(message);};
const owned = key => typeof key === 'string' && key.startsWith(I.prefix);
const definitions = new Map(D.commands.map(d => [d.id, d]));
const fixedKnowledge = new Map(D.commands.flatMap(d => d.effects.filter(e => e.type === 'knowledge').map(e => [e.key, {d, e}])));
export function steamLambFacts(state, context = {}, registry) {
    const support = steamLambSupport(state, context);
    return {'steamLamb.supported': support.supported, 'steamLamb.handsUsable': support.handsUsable,
        'steamLamb.ownerSupported': support.ownerSupported, 'steamLamb.benchSupported': support.benchSupported,
        'steamLamb.qualified': steamLambQualified(state), 'steamLamb.unappointed': steamLambUnappointed(state),
        'steamLamb.office': steamLambOffice(state), 'steamLamb.approval': steamLambApproval(state),
        'steamLamb.inspectionAvailable': steamLambInspectionAvailable(state), 'steamLamb.own.matched': support.ownMatched,
        'steamLamb.guide.fine': support.guide('fine'), 'steamLamb.guide.fineDull': support.guide('fineDull'),
        'steamLamb.purseReady': support.purseReady, 'steamLamb.workCurrent': !!context.steamLambWork && steamLambWorkCurrent(state, context.steamLambWork)};
}
export function validateSteamLambState(state, registry) {
    const s = state.simulation, player = state.actors?.player, eda = state.actors?.[I.owner], ownJobs = [];
    let activated = false;
    check(state.steamLamb == null && state.steam_lamb == null && !Object.keys(state).some(owned), 'The fitting agreement creates no second saved domain.');
    check(!s || s.steamLamb == null && s.steam_lamb == null && !Object.keys(s).some(owned), 'The agreement creates no parallel simulation domain.');
    check(!Object.keys(state.worlds || {}).some(owned), 'The fitting agreement creates no separate world.');
    for (const [actorId, actor] of Object.entries(state.actors || {})) {
        check(!owned(actorId), 'The fitting agreement creates no second Eda.');
        for (const [key, value] of Object.entries(actor.facts || {}).filter(([k]) => owned(k))) {
            activated = true;
            check((actorId === I.owner && key === I.office || actorId === 'player' && key === I.approval) && typeof value === 'boolean', 'Unknown fitting agreement fact or owner.');
        }
        for (const [key, value] of Object.entries(actor.completed || {}).filter(([k]) => owned(k))) {
            activated = true;
            check(actorId === 'player' && definitions.has(key) && value === 1, 'Unknown or replayed fitting agreement completion.');
        }
        for (const family of ['resources', 'sources', 'techniques']) check(!Object.keys(actor[family] || {}).some(owned), 'The agreement owns no new currency, source or ability.');
    }
    for (const domain of [...Object.values(state.worlds || {}), state.campaign, state.journey].filter(Boolean))
        for (const family of ['facts', 'resources', 'completed', 'sources', 'techniques']) check(!Object.keys(domain[family] || {}).some(owned), 'This fitting agreement belongs to its actual two people.');
    for (const [actorId, records] of Object.entries(s?.knowledge || {})) for (const [key, known] of Object.entries(records).filter(([k]) => owned(k))) {
        activated = true;
        const fixed = fixedKnowledge.get(key);
        check(actorId === 'player' && fixed, 'Unknown fitting agreement history or owner.');
        const {d, e} = fixed, seq = sequence(known?.cause);
        check(record(known) && same(Object.keys(known).sort(), ['at', 'basis', 'cause', 'stage', 'value']) &&
            known.stage === e.stage && known.value === e.value && same(known.basis, e.basis) && natural(known.at) && known.at <= state.clock &&
            natural(seq) && seq > 0 && seq <= state.sequence && player?.completed?.[d.id] === 1,
            'Fitting history needs its exact completed agreement or service.');
    }
    for (const job of s?.jobs || []) {
        if (owned(job.commandId)) {activated = true; ownJobs.push(job);}
        else check(job.steamLambWork == null, 'A fitting work stamp belongs only to this agreement.');
    }
    for (const program of Object.values(s?.programs || {})) check(!owned(program.commandId), 'Choose the fitting appointment and each service yourself.');
    for (const family of ['people', 'sites', 'situations', 'custody', 'events', 'checks', 'controllers', 'sessions', 'claims', 'energies', 'pursuits', 'causes'])
        check(!Object.keys(s?.[family] || {}).some(owned), 'The agreement creates no parallel person, bench or execution owner.');
    for (const family of ['conditions', 'faculties', 'powers', 'progression', 'titles', 'equipment', 'owners', 'relationships']) {
        check(!Object.keys(s?.[family] || {}).some(owned), 'The agreement owns no parallel actor state.');
        for (const rows of Object.values(s?.[family] || {})) check(!Object.keys(rows || {}).some(owned), 'Unknown fitting agreement owned state.');
    }
    if (!activated) return;
    check(s && player?.facts?.['feature_objects.introduced'] === true && s.people?.player?.inventory === 'native' &&
        s.people?.[I.owner]?.definitionId === I.owner && s.people[I.owner].inventory === 'simulation' && eda?.worldId === I.world && record(s.owners?.[I.owner]) &&
        s.sites?.[I.site]?.owner === I.owner && s.sites[I.site].capacity === 1 && record(s.sites[I.site].reservations) &&
        s.situations?.[I.situation]?.definitionId === I.situation && s.situations[I.situation].revision === 1 && steamLambQualified(state),
        'The agreement needs the actual introduced Eda, her bench and retained completed demonstration and practice.');
    const done = id => player.completed?.[id] === 1;
    const knownFor = id => s.knowledge?.player?.[definitions.get(id).effects.find(e => e.type === 'knowledge').key];
    for (const [key, {d}] of fixedKnowledge) check(done(d.id) === !!s.knowledge?.player?.[key], 'A fitting completion and its exact history must stay paired.');
    const appointed = done(I.appoint), ended = done(I.end), inspections = Number(done(I.inspectFine)) + Number(done(I.inspectFineDull)), delivered = done(I.deliver);
    check(inspections <= 1, 'Only one guide route may issue the one fitting approval.');
    check((eda.facts[I.office] != null) === appointed && (!appointed || eda.facts[I.office] === !ended), 'The office belongs to Eda’s completed appointment and explicit ending.');
    check(!ended || appointed, 'End an actual appointment, preserving its history.');
    check(!inspections || appointed, 'An inspection needs the completed appointment.');
    check(!delivered || inspections === 1, 'A settled order needs its one inspection approval.');
    check((player.facts[I.approval] != null) === (inspections === 1) && (!inspections || player.facts[I.approval] === !delivered), 'The class approval is issued once and consumed only by its completed order.');
    const follows = (later, earlier, minutes) => later.at >= earlier.at + minutes && sequence(later.cause) > sequence(earlier.cause);
    const appointment = appointed ? knownFor(I.appoint) : null;
    const inspection = inspections ? knownFor(done(I.inspectFine) ? I.inspectFine : I.inspectFineDull) : null;
    const delivery = delivered ? knownFor(I.deliver) : null;
    const ending = ended ? knownFor(I.end) : null;
    const learned = s.knowledge.player['feature_objects.method'];
    if (appointment) check(follows(appointment, learned, 1), 'The appointment follows completed practice and one minute together.');
    if (inspection) check(follows(inspection, appointment, 2), 'The inspection follows the appointment and two paid minutes.');
    if (delivery) check(follows(delivery, inspection, 1), 'The paid handover follows the inspection and one new minute.');
    if (ending) check(follows(ending, delivery || inspection || appointment, 0), 'The ending preserves the actual earlier work in order.');
    check(ownJobs.length <= 1, 'You cannot accept parallel fitting agreement work.');
    for (const job of ownJobs) {
        const d = definitions.get(job.commandId);
        const jobKeys = ['id', 'sequence', 'commandId', 'revision', 'actorId', 'targetId', 'due', 'effects', 'costs', 'cancellation', 'siteId', 'claim', 'label', 'roll', 'outcomeId', 'context', 'participants', 'reservationReturns', 'completionSupport', 'steamLambWork'];
        check(d?.duration && same(Object.keys(job).sort(), jobKeys.sort()) && job.id === `simulation:${job.sequence}` && natural(job.sequence) &&
            job.sequence > 0 && job.sequence <= state.sequence && job.context?.actorId === 'player' && job.context.targetId === I.owner &&
            same(Object.keys(job.context).sort(), ['actorId', 'partyIds', 'targetId']) && same(job.context.partyIds, s.party) &&
            job.claim === null && job.label === d.label && job.roll === null && job.outcomeId === null &&
            job.cancellation === 'refund' && job.reservationReturns === 1 && validSteamLambWork(state, job) && job.due >= state.clock &&
            steamLambWorkCurrent(state, job) && !done(d.id),
            'The pending fitting work differs from its exact fee, held items, guide, participants, bench, time or support.');
        const prior = job.commandId === I.appoint ? learned : job.commandId === I.deliver ? inspection : appointment;
        check(prior && job.steamLambWork.acceptedAt >= prior.at && job.sequence > sequence(prior.cause), 'Pending fitting work follows its actual completed prerequisite.');
        if (job.commandId === I.appoint) check(!appointed && !ended, 'A pending appointment cannot also be completed.');
        else check(steamLambOffice(state) && (job.commandId === I.deliver ? steamLambApproval(state) : steamLambInspectionAvailable(state)), 'The pending service needs its still unspent appointment and approval route.');
        if (registry) check(same(registry.simulation.commands.get(d.id), d), 'Unsupported fitting agreement definition.');
    }
}
