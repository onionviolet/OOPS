// Pure read/validation of typed existing owners. No simulation executor, host,
// namespace initialization, inventory mirror or alternative clock is used.
import {assert, natural, record} from './simulation_contracts.js';
import {HOME_FURNISHING_IDS as I, HOME_FURNISHING_KEYS as K, homeFurnishingDefinitions as D,
    homeFurnishingProjects} from './home_furnishing_content.js';
import {MOL_IDS as M, MOL_SOURCE_HASH, MOL_SOURCE_SNAPSHOT} from './book_world_mol_ids.js';
import {molCommands} from './book_world_mol_actions.js';

const P = I.prefix, definitions = new Map(D.commands.map(d => [d.id, d]));
const count = n => natural(n) ? n : 0;
const done = (state, id) => count(state.actors?.player?.completed?.[id]);
const same = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
};
const sequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.split(':')[1]) : NaN;
const shape = (v, keys) => record(v) && Object.keys(v).length === keys.length && keys.every(k => Object.hasOwn(v, k));
const receiptMatches = (state, actual, expected) => shape(actual, ['stage', 'value', 'at', 'cause', 'basis']) && !!expected && actual.value === expected.value && actual.stage === expected.stage &&
    same(actual.basis, expected.basis) && natural(actual.at) && actual.at <= state.clock &&
    Number.isSafeInteger(sequence(actual.cause)) && sequence(actual.cause) <= state.sequence;
const receipt = (state, id) => {
    const expected = definitions.get(id)?.effects.find(e => e.type === 'knowledge' && e.actor === 'player');
    const r = state.simulation?.knowledge?.player?.[expected?.key];
    return receiptMatches(state, r, expected) && done(state, id) > 0 ? r : null;
};
const activeCondition = (state, id) => {
    const c = state.simulation?.conditions?.player?.[id];
    return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
};
export function homeFurnishingsEnrolled(state) {
    return state.schema === 11 && state.auditRemainder?.schema === 1 && state.auditRemainder.definitionRevision === 1 &&
        state.referenceGameplay?.schema === 1 && state.actors?.player?.facts?.['audit_remainder.enrolled'] === true &&
        done(state, 'audit_remainder.enroll') === 1;
}
export function homeFurnishingWorkshopEarned(state) {
    const site = state.simulation?.sites?.[I.site], w = state.worlds?.[I.world]?.facts;
    return homeFurnishingsEnrolled(state) && site?.owner === 'player' && site.capacity === 1 &&
        state.actors?.player?.facts?.['field.facility'] === true && done(state, 'field.workshop.assembly') === 1 &&
        w?.['project.field.workshop.assembly'] === true;
}
// A notebook count alone cannot impersonate the actual mature campaign result.
// The original compiled receipt stays distinct from later extensions and uses.
export function homeFurnishingMatureRecord(state) {
    const owner = state.motherOfLearning, a = state.actors?.player, w = state.worlds?.[M.world]?.facts;
    const molReceipt = (id, key, actor = 'player') => {
        const expected = molCommands.find(d => d.id === id)?.effects.find(e => e.type === 'knowledge' && e.key === key && e.actor === actor);
        const actual = state.simulation?.knowledge?.[actor]?.[key];
        return done(state, id) === 1 && receiptMatches(state, actual, expected) ? actual : null;
    };
    const r = molReceipt('book.mol.compile_notebook', 'book.mol.notebook'),
        tested = molReceipt('book.mol.lamp_test', 'book.mol.lampTest'),
        deposited = molReceipt('book.mol.deposit_research', 'book.mol.researchDeposit'),
        received = molReceipt('book.mol.deposit_research', 'book.mol.receivedResearch', M.ibery),
        closed = molReceipt('book.mol.close_service_arc', 'book.mol.closure');
    return !!owner && owner.schema === 1 && owner.definitionRevision === 1 && owner.bodyPolicy === 'same_native_body' &&
        owner.sourceSnapshot === MOL_SOURCE_SNAPSHOT && owner.sourceHash === MOL_SOURCE_HASH &&
        a?.facts?.['book.mol.matureResearch'] === true && done(state, 'book.mol.compile_notebook') === 1 &&
        done(state, 'book.mol.deposit_research') === 1 && a.facts['book.mol.researchStanding'] === true &&
        done(state, 'book.mol.lamp_test') === 1 && a.facts['book.mol.lampTested'] === true && w?.['book.mol.arcClosed'] === true &&
        w['book.mol.researchDeposited'] === true && !!r && !!tested && !!deposited && !!received && !!closed &&
        received.cause === deposited.cause && received.at === deposited.at &&
        [tested, deposited, closed].every(before => sequence(before.cause) < sequence(r.cause) && before.at + 5 <= r.at);
}
// The scheduler supplies its popped exact reservation transiently at settlement.
// Only tools actually debited by this accepted revision can count as held.
export function exactHomeFurnishingJob(state, job) {
    const d = definitions.get(job?.commandId);
    return !!d?.duration && shape(job, ['id', 'sequence', 'commandId', 'revision', 'actorId', 'targetId', 'due', 'effects', 'costs',
        'cancellation', 'siteId', 'claim', 'label', 'roll', 'outcomeId', 'context', 'participants', 'reservationReturns', 'completionSupport']) &&
        job.actorId === 'player' && job.targetId === null && job.revision === d.revision && job.label === d.label && job.roll === null && job.outcomeId === null &&
        Number.isSafeInteger(sequence(job.id)) && sequence(job.id) === job.sequence && job.sequence <= state.sequence &&
        natural(job.due) && job.due >= d.duration && job.due - d.duration <= state.clock &&
        job.reservationReturns === 1 && job.cancellation === 'refund' && job.siteId === I.site && job.claim === (d.claim || null) &&
        state.simulation?.sites?.[I.site]?.reservations?.[job.id] === 'player' && same(job.participants, ['player']) &&
        shape(job.context, ['actorId', 'targetId', 'partyIds']) && job.context.actorId === 'player' && job.context.targetId === null && Array.isArray(job.context.partyIds) &&
        new Set(job.context.partyIds).size === job.context.partyIds.length && job.context.partyIds.every(id => !!state.simulation?.people?.[id]) &&
        same(job.costs, d.costs) && same(job.effects, d.effects) &&
        same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: false, location: I.location, failure: 'refund'});
}
function unencumbered(state, context, key) {
    return !Object.values(context.equipment?.player || {}).includes(key) && !Object.values(state.simulation?.equipment?.player || {}).includes(key) &&
        !Object.values(state.simulation?.custody || {}).some(c => (c.holder === 'player' || c.owner === 'player') && (c.key === key || c.itemKey === key));
}
function physicallySupported(state, context) {
    const p = state.simulation?.people?.player, saved = p?.body, actual = context.nativeBody;
    const v = context.vitals?.player, stock = context.gameplay?.player?.inventory;
    const body = actual?.id === 'native.player.body' && actual.form === 'human' && actual.ownerId === 'player' && actual.controllerId === 'player' &&
        actual.hands >= 2 && actual.mobile === true && (!saved ||
            ['id', 'form', 'ownerId', 'controllerId'].every(k => saved[k] == null || saved[k] === actual[k]) &&
            (saved.hands ?? 2) >= 2 && saved.mobile !== false);
    const native = record(stock) && Object.values(stock).every(natural) && record(v) &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(v[k]) && v[k] >= 0) &&
        v.health > 1 && v.health <= v.max_health && v.stamina <= v.max_stamina;
    const hands = !['body.sore_hands', 'body.scraped_hands', 'status.care.tired', 'book.care.load_strain', M.burn].some(id => activeCondition(state, id));
    const absent = [state.realmPrototype, state.featureDestination, state.nestedCampaign, state.bookWorldCampaign, state.motherOfLearning].some(d => d?.activeVisitId != null);
    return homeFurnishingWorkshopEarned(state) && (context.actorId || 'player') === 'player' && context.nativeAlive === true && body && native && hands &&
        state.actors.player.worldId === I.world && p.life === 'alive' && p.inventory === 'native' && !absent &&
        !state.chronicle?.session && state.chronicle?.life?.endedAt == null && !state.simulation.sessions?.player &&
        (context.facts?.location || p.location) === I.location && context.facts?.['native.zone.Shack.accessible'] === true;
}
export function homeFurnishingFacts(state, context = {}) {
    const s = state.simulation, f = state.actors?.player?.facts || {}, w = state.worlds?.[I.world]?.facts || {};
    const candidate = context.homeFurnishingReservation || s?.jobs?.find(j => definitions.has(j.commandId) && j.actorId === 'player');
    const ownJob = exactHomeFurnishingJob(state, candidate) ? candidate : null;
    const held = key => ownJob?.costs.some(e => e.type === 'item' && e.actor === 'player' && e.key === key && e.amount === -1) &&
        ownJob.effects.some(e => e.type === 'item' && e.actor === 'player' && e.key === (key === K.sharp ? K.dull : key) && e.amount === 1 && e.reservationReturn === true);
    const owned = key => unencumbered(state, context, key) && (count(context.gameplay?.player?.inventory?.[key]) > 0 || held(key));
    const survey = receipt(state, I.survey), rights = !!survey && f[P + 'right'] === I.site &&
        homeFurnishingProjects.every(project => w[`project.${project.id}.started`] === true);
    const completed = (project, phase) => rights && done(state, `${project}.${phase}`) === 1 && w[`project.${project}.${phase}`] === true;
    const rackFrame = completed(I.rack, 'frame'), rackBuilt = rackFrame && completed(I.rack, 'finish') && w[P + 'rackBuilt'] === true;
    const benchFrame = completed(I.bench, 'frame'), benchBuilt = benchFrame && completed(I.bench, 'finish') && w[P + 'benchBuilt'] === true;
    const matureRecord = homeFurnishingMatureRecord(state);
    return {'homeFurnishings.workshopEarned': homeFurnishingWorkshopEarned(state), 'homeFurnishings.supported': physicallySupported(state, context),
        'homeFurnishings.rights': rights, 'homeFurnishings.kit': owned(K.kit), 'homeFurnishings.sharpKnife': owned(K.sharp),
        'homeFurnishings.rackFrame': rackFrame, 'homeFurnishings.rackBuilt': rackBuilt, 'homeFurnishings.rackUsed': rackBuilt && !!receipt(state, I.dryFirst),
        'homeFurnishings.benchFrame': benchFrame, 'homeFurnishings.benchBuilt': benchBuilt,
        'homeFurnishings.matureRecord': matureRecord, 'homeFurnishings.matureNotebook': matureRecord && owned(K.notebook),
        'homeFurnishings.adapted': benchBuilt && f[P + 'adapted'] === true && done(state, I.adapt) === 1 && !!receipt(state, I.adapt)};
}
const scoped = key => key.startsWith(P) || key.startsWith(`project.${P}`);
function after(before, result, duration = 0) {
    assert(before && result && sequence(result.cause) > sequence(before.cause) && result.at >= before.at + duration,
        'Workshop furnishing results need their actual earlier paid or physical prerequisite.');
}
export function validateHomeFurnishings(state, registry) {
    const s = state.simulation, actorRows = Object.entries(state.actors || {}), worldRows = Object.entries(state.worlds || {});
    const actorPresent = actorRows.some(([, a]) => ['facts', 'completed', 'resources', 'sources', 'techniques'].some(key => Object.keys(a[key] || {}).some(scoped)));
    const simPresent = ['knowledge', 'powers', 'faculties', 'conditions', 'progression', 'titles', 'equipment', 'energies'].some(key =>
        Object.values(s?.[key] || {}).some(rows => Object.keys(rows).some(scoped)));
    const directPresent = ['people', 'owners', 'sites', 'claims', 'controllers', 'situations', 'custody'].some(key => Object.keys(s?.[key] || {}).some(scoped));
    const worldPresent = worldRows.some(([, w]) => ['facts', 'resources', 'completed'].some(key => Object.keys(w[key] || {}).some(scoped)));
    const jobs = (s?.jobs || []).filter(j => scoped(j.commandId || ''));
    const automated = Object.values(s?.programs || {}).some(p => scoped(p.commandId || '')) || Object.values(s?.sessions || {}).some(p => scoped(p.commandId || ''));
    const foreignOwners = [state.campaign, state.journey, ...Object.values(state.scenarios || {})];
    const foreignPresent = foreignOwners.some(owner => ['facts', 'resources', 'completed', 'sources', 'techniques'].some(key => Object.keys(owner?.[key] || {}).some(scoped)));
    assert(!foreignPresent && state.homeFurnishings == null && state.home_furnishings == null,
        'Furnishings have only their existing player, local world, knowledge, situation and job owners.');
    if(!actorPresent && !simPresent && !directPresent && !worldPresent && !jobs.length && !automated) return true;
    assert(homeFurnishingsEnrolled(state) && s?.schema >= 4 && homeFurnishingWorkshopEarned(state),
        'Furnishing work needs deliberate existing audit enrollment and the actual assembled player-owned Shack workshop. Absence remains inert.');
    assert(!automated && state.auditRemainder.modules?.home_furnishings == null, 'Furnishings use existing typed owners and deliberately accepted jobs, not a routine or mirrored module.');
    for(const [actor, a] of actorRows) {
        const facts = Object.entries(a.facts || {}).filter(([key]) => scoped(key));
        const completions = Object.entries(a.completed || {}).filter(([key]) => scoped(key));
        assert((actor === 'player' || !facts.length && !completions.length) &&
            facts.every(([key, value]) => key === P + 'right' && value === I.site || key === P + 'adapted' && value === true),
            'Furnishings retain only the player\'s specific build right and own mundane adaptation.');
        assert(completions.every(([id, n]) => definitions.has(id) && natural(n) && n > 0 && (!definitions.get(id).once || n === 1)),
            'Unknown, repeated once-only or foreign-owner furnishing completion.');
        assert(['resources', 'sources', 'techniques'].every(key => !Object.keys(a[key] || {}).some(scoped)),
            'A fixture cannot create a currency, power source or separate player method.');
    }
    for(const key of ['powers', 'faculties', 'conditions', 'progression', 'titles', 'equipment', 'energies']) assert(!Object.values(s[key] || {}).some(rows => Object.keys(rows).some(scoped)), 'Furnishings grant no source, power, body effect, prestige, title, energy or equipment owner.');
    for(const key of ['people', 'owners', 'sites', 'controllers', 'custody']) assert(!Object.keys(s[key] || {}).some(scoped), 'Furnishings do not duplicate residents, stock, sites, controllers or custody.');
    for(const [actor, rows] of Object.entries(s.knowledge || {})) for(const [key, r] of Object.entries(rows).filter(([key]) => scoped(key))) {
        const d = D.commands.find(d => d.effects.some(e => e.type === 'knowledge' && e.key === key));
        assert(actor === 'player' && d && receiptMatches(state, r, d.effects.find(e => e.type === 'knowledge' && e.key === key)) && done(state, d.id) > 0,
            'Furnishing knowledge needs the exact matching completed player action, cause and disclosed account.');
    }
    for(const d of D.commands) if(done(state, d.id)) assert(receipt(state, d.id), 'A completed furnishing action lost its actual knowledge receipt.');
    const w = state.worlds[I.world].facts, allowedWorld = new Set([P + 'rackBuilt', P + 'benchBuilt',
        ...homeFurnishingProjects.flatMap(project => ['started', ...project.phases.map(p => p.id)].map(phase => `project.${project.id}.${phase}`))]);
    for(const [world, owner] of worldRows) {
        assert(!['resources', 'completed'].some(key => Object.keys(owner[key] || {}).some(scoped)), 'Furnishings use only their existing local world-fact owner.');
        for(const [key, value] of Object.entries(owner.facts || {}).filter(([key]) => scoped(key))) assert(world === I.world && allowedWorld.has(key) && value === true, 'A furnishing phase cannot be imported into another world or forged as a loose bonus.');
    }
    assert(jobs.length <= 1 && jobs.every(j => exactHomeFurnishingJob(state, j) && j.due >= state.clock &&
        j.due <= state.clock + definitions.get(j.commandId).duration && (!definitions.get(j.commandId).once || !done(state, j.commandId))),
        'Furnishing jobs need this exact refundable revision, own participant, current reserved tool, site and frozen completion support.');
    const f = state.actors.player.facts, survey = receipt(state, I.survey), surveying = jobs.find(j => j.commandId === I.survey);
    if(!survey) assert(surveying && !actorRows.some(([, a]) => Object.keys(a.facts || {}).some(scoped)) &&
        D.commands.every(d => !done(state, d.id)) && !worldPresent && !simPresent && !s.situations[I.situation],
        'An unfinished survey grants no permission, project progress, fixture or knowledge.');
    else {
        assert(!surveying && done(state, I.survey) === 1 && f[P + 'right'] === I.site &&
            homeFurnishingProjects.every(project => w[`project.${project.id}.started`] === true), 'Only the completed paid survey can open the two declared build projects.');
        const situation = s.situations[I.situation];
        assert(same(situation, {definitionId: I.situation, revision: 1, context: D.situations[0].context, privateTruth: D.situations[0].privateTruth,
            participants: ['player'], phases: ['surveyed'], phase: 'surveyed', cause: survey.cause, openedAt: survey.at, deadline: null,
            receipts: [{from: null, to: 'surveyed', at: survey.at, cause: survey.cause}]}),
            'Workshop rights lost the actual committed survey situation.');
    }
    assert(Object.keys(s.situations || {}).filter(scoped).every(id => id === I.situation), 'Unknown furnishing situation.');
    for(const project of homeFurnishingProjects) {
        const frameId = project.id + '.frame', finishId = project.id + '.finish', frame = receipt(state, frameId), finish = receipt(state, finishId);
        assert((w[`project.${project.id}.frame`] === true) === !!frame && (w[`project.${project.id}.finish`] === true) === !!finish &&
            (w[P + (project.id === I.rack ? 'rackBuilt' : 'benchBuilt')] === true) === !!finish,
            'Fixture flags require both actual supplied construction phases.');
        if(frame) after(survey, frame, definitions.get(frameId).duration);
        if(finish) after(frame, finish, definitions.get(finishId).duration);
        for(const job of jobs.filter(j => [frameId, finishId].includes(j.commandId))) {
            assert(survey, 'Construction admission needs the earlier completed paid survey.');
            if(job.commandId === finishId) assert(frame, 'Finishing admission needs the earlier real frame.');
        }
    }
    const rackFinish = receipt(state, I.rack + '.finish'), firstDried = receipt(state, I.dryFirst), dried = receipt(state, I.dry),
        benchFrame = receipt(state, I.bench + '.frame'), benchFinish = receipt(state, I.bench + '.finish');
    if(firstDried) after(rackFinish, firstDried, definitions.get(I.dryFirst).duration);
    if(dried) after(rackFinish, dried, definitions.get(I.dry).duration);
    if(dried) after(firstDried, dried, definitions.get(I.dry).duration);
    if(benchFrame || jobs.some(j => j.commandId === I.bench + '.frame')) assert(firstDried && homeFurnishingMatureRecord(state), 'The later bench needs actual rack experience and actual mature Cyoria compilation.');
    if(benchFrame) {after(firstDried, benchFrame, definitions.get(I.bench + '.frame').duration);
        after(s.knowledge.player['book.mol.notebook'], benchFrame, definitions.get(I.bench + '.frame').duration);}
    const adapted = receipt(state, I.adapt);
    assert((f[P + 'adapted'] === true) === !!adapted, 'Mundane adaptation requires actual separate notebook work.');
    if(adapted) {assert(homeFurnishingMatureRecord(state), 'Bench adaptation cannot manufacture a mature research notebook.'); after(benchFinish, adapted, definitions.get(I.adapt).duration);}
    for(const id of [I.salvage, I.pack]) if(done(state, id)) after(adapted, receipt(state, id), definitions.get(id).duration);
    for(const j of jobs) {
        const start = j.due - definitions.get(j.commandId).duration, previous = receipt(state, j.commandId);
        assert(!previous || sequence(previous.cause) < j.sequence && previous.at <= start, 'Repeated fixture work must follow its own actual earlier completed batch.');
        if(j.commandId !== I.survey) assert(survey, 'Accepted furnishing work requires its completed paid right.');
        if([I.dryFirst, I.dry].includes(j.commandId)) assert(rackFinish, 'Accepted drying needs the finished rack.');
        if(j.commandId === I.dry) assert(firstDried, 'Further drying needs the actual first supported batch.');
        if([I.adapt, I.salvage, I.pack].includes(j.commandId)) assert(benchFinish && homeFurnishingMatureRecord(state), 'Accepted drafting needs the real finished bench and original mature notebook provenance.');
        if([I.salvage, I.pack].includes(j.commandId)) assert(adapted, 'Accepted drafted outputs need the separate actual adaptation.');
        const prerequisites = [
            ...(j.commandId === I.survey ? [] : [survey]),
            ...(j.commandId === I.rack + '.finish' ? [receipt(state, I.rack + '.frame')] : []),
            ...([I.dryFirst, I.dry].includes(j.commandId) ? [rackFinish] : []),
            ...([I.dry, I.bench + '.frame'].includes(j.commandId) ? [firstDried] : []),
            ...(j.commandId === I.bench + '.finish' ? [benchFrame] : []),
            ...([I.adapt, I.salvage, I.pack].includes(j.commandId) ? [benchFinish] : []),
            ...([I.bench + '.frame', I.adapt, I.salvage, I.pack].includes(j.commandId) ? [s.knowledge.player['book.mol.notebook']] : []),
            ...([I.salvage, I.pack].includes(j.commandId) ? [adapted] : []),
        ];
        assert(prerequisites.every(r => !!r && sequence(r.cause) < j.sequence && r.at <= start), 'A fixture job cannot predate the actual paid, built, observed or learned support it reserved.');
    }
    const allowedClaims = new Map(D.commands.filter(d => d.claim).map(d => [d.claim, d]));
    for(const [key, claim] of Object.entries(s.claims || {}).filter(([key]) => scoped(key))) {
        const d = allowedClaims.get(key), r = d && receipt(state, d.id), job = d && jobs.find(j => j.commandId === d.id);
        assert(d && shape(claim, ['owner', 'status', 'cause', 'at']) && claim.owner === 'player' && natural(claim.at) && claim.at <= state.clock && (r ?
            claim.status === 'settled' && claim.cause === r.cause && claim.at + d.duration === r.at :
            !!job && claim.status === 'held' && claim.cause === job.id && claim.at + d.duration === job.due),
            'Furnishing claims cannot duplicate a right or phase, survive a refund or impersonate residence.');
    }
    for(const d of D.commands.filter(d => d.claim)) if(done(state, d.id) || jobs.some(j => j.commandId === d.id)) assert(s.claims[d.claim], 'A once-only furnishing admission lost its exact unique claim.');
    if(registry) for(const [family, rows] of Object.entries(D)) for(const d of rows) assert(same(registry.simulation?.[family]?.get(d.id), d), 'Furnishing reader definitions differ from this immutable accepted revision.');
    return true;
}
