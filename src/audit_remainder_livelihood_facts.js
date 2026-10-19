// Pure current owner projection. Root binds the actual played-calendar anchor
// and exact transient popped job; neither is retained in a second state owner.
import {check as assert, natural, object as record} from './basics.js';
import {REMAINDER_LIVELIHOOD_IDS as I, REMAINDER_LIVELIHOOD_ITEMS as K,
    REMAINDER_LIVELIHOOD_SCHEDULE as S, REMAINDER_LIVELIHOOD_COMMISSIONS as C,
    remainderLivelihoodDefinitions, remainderLivelihoodCommand} from './audit_remainder_livelihood_content.js';
import {recurringWindow} from './world_rhythm.js';
const P = I.prefix, key = suffix => `${P}.${suffix}`;
export function remainderLivelihoodSame(a, b) {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => remainderLivelihoodSame(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && remainderLivelihoodSame(a[k], b[k]));
}
const same = remainderLivelihoodSame;
const actorFact = (state, id, name) => state.actors?.[id]?.facts?.[key(name)];
const done = (state, id, command) => state.actors?.[id]?.completed?.[key(command)] || 0;
const worldFact = (state, name) => state.worlds?.[I.world]?.facts?.[key(name)];
const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
function toolFree(state, actor, itemKey) {
    return !Object.values(state.simulation?.custody || {}).some(c => c.holder === actor && c.key === itemKey) &&
        !Object.values(state.simulation?.equipment?.[actor] || {}).includes(itemKey);
}
function currentWorker(state, id) {
    const a = state.actors?.[id], p = state.simulation?.people?.[id];
    return !!a && p?.life === 'alive' && p.inventory === 'simulation' && p.location === 'Village' && a.worldId === I.world && p.vitals?.health > 1;
}
function operation(state, id, sourceId, power = false) {
    const a = state.actors?.[id], s = state.simulation, source = a?.sources?.[sourceId], faculty = s?.faculties?.[id]?.[sourceId];
    return !!source && source.worldId === I.world && source.acquiredAt <= state.clock &&
        (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.active === true && faculty.awakened === true && !faculty.suppressed &&
        (!power || s?.powers?.[id]?.[sourceId]?.owned === true);
}
function workerSupported(state, id) {
    if(!currentWorker(state, id)) return false;
    const a = state.actors[id], p = state.simulation.people[id];
    if(id === I.lio) return a.facts?.['party.willing'] === true && p.body?.can_brace === true && operation(state, id, 'party.guard_control');
    return (p.body?.hands || 0) >= 2 && operation(state, id, I.method, true) &&
        (id === I.orr ? a.facts?.['feature_society.ordinaryIntent'] === true :
            a.facts?.['feature_society.willingBounded'] === true && a.facts?.['feature_society.agreed'] === true && a.facts?.['feature_society.taught'] === true);
}
export function remainderLivelihoodWorkerFree(state, id) {
    const s = state.simulation;
    return currentWorker(state, id) && !(s?.jobs || []).some(j => (j.participants || [j.actorId]).includes(id)) &&
        !Object.entries(s?.sessions || {}).some(([owner, session]) => (session.participants || [owner]).includes(id)) &&
        !(state.pending || []).some(j => j.context?.actorId === id) &&
        !Object.values(state.actors?.[id]?.techniques || {}).some(t => !!t.practice);
}
// This is accepted only for this exact frozen revision1 job, after root popped
// it for completion. A generic held count cannot support a removed native tool.
export function remainderLivelihoodReservedKit(state, context, c) {
    const j = context.remainderLivelihoodReservation, d = remainderLivelihoodCommand(key(`work_${c.topic}`));
    return j && j.commandId === d.id && j.actorId === c.worker && j.revision === 1 && j.reservationReturns === 1 &&
        natural(j.sequence) && j.sequence === causeSequence(j.id) && j.sequence <= state.sequence && j.due === state.clock &&
        same(j.costs, d.costs) && same(j.effects, d.effects) && same(j.participants, [c.worker]) &&
        j.costs.some(e => e.type === 'item' && e.actor === c.worker && e.key === K.kit && e.amount === -1) ? 1 : 0;
}
export function remainderLivelihoodWindow(state, context = {}) {
    const anchor = context.remainderLivelihoodClock;
    if(!anchor || !natural(anchor.calendarMinute) || !natural(anchor.clock) || anchor.clock > state.clock) return {supported: false, open: false, remaining: 0, nextIn: null, minute: null};
    const minute = anchor.calendarMinute + state.clock - anchor.clock;
    if(!natural(minute)) return {supported: false, open: false, remaining: 0, nextIn: null, minute: null};
    const window = recurringWindow(S, minute);
    return {...window, supported: true, minute};
}
export function remainderLivelihoodFacts(state, context = {}, registry) {
    const s = state.simulation, p = state.actors?.player, window = remainderLivelihoodWindow(state, context);
    const admitted = state.auditRemainder?.schema === 1 && context.facts?.['auditRemainder.enrolled'] === true;
    const local = admitted && p?.worldId === I.world && !state.realmPrototype?.activeVisitId && !!s && window.supported;
    const terms = name => actorFact(state, 'player', `${name}Terms`) === true && done(state, 'player', `${name}_terms`) === 1;
    const residentRight = s?.claims?.[I.residentRight], residentBench = s?.sites?.[I.residentBench];
    const residentAccess = !!residentBench && residentBench.capacity === 1 && residentRight?.owner === I.orr && residentRight.status === 'held';
    const localBench = s?.sites?.[I.localBench], craftsman = s?.people?.[I.craftsman];
    const irritated = s?.conditions?.[I.craftsman]?.['mood.irritated'];
    const craftsmanConsent = craftsman?.life === 'alive' && craftsman.location === 'Village' && state.actors?.[I.craftsman]?.worldId === I.world &&
        !(irritated && irritated.intensity > 0 && (irritated.expiresAt == null || irritated.expiresAt > state.clock));
    const facts = {
        'remainder.livelihood.local': local,
        'remainder.livelihood.windowOpen': local && window.open,
        'remainder.livelihood.window4': local && window.open && window.remaining > 4,
        'remainder.livelihood.window5': local && window.open && window.remaining > 5,
        'remainder.livelihood.residentTerms': admitted && terms('resident'),
        'remainder.livelihood.lioTerms': admitted && terms('lio'),
        'remainder.livelihood.allocationTerms': admitted && terms('allocation'),
        'remainder.livelihood.orrSupported': workerSupported(state, I.orr),
        'remainder.livelihood.lioSupported': workerSupported(state, I.lio) && (s?.owners?.[I.lio]?.[K.kit] || 0) > 0 && toolFree(state, I.lio, K.kit),
        'remainder.livelihood.residentAccess': residentAccess,
        'remainder.livelihood.localBenchPresent': !!localBench && localBench.capacity === 1 && (!localBench.owner || localBench.owner === I.craftsman),
        'remainder.livelihood.craftsmanConsent': !!craftsmanConsent,
        'remainder.livelihood.allocationPeopleReady': workerSupported(state, I.orr) && workerSupported(state, I.vale),
        'remainder.livelihood.allocationUnchosen': !s?.claims?.[key('allocation.funding')],
        'remainder.livelihood.playerKitAvailable': s?.people?.player?.inventory === 'native' && (context.gameplay?.player?.inventory?.[K.kit] || 0) >= 1 &&
            toolFree(state, 'player', K.kit) && !Object.values(context.equipment?.player || {}).includes(K.kit),
    };
    for(const c of C) {
        const f = name => `remainder.livelihood.${c.topic}.${name}`, allocation = c.topic.startsWith('allocation_');
        const funded = actorFact(state, 'player', `funded.${c.topic}`) === true && done(state, 'player', `fund_${c.topic}`) === 1;
        const withdrawn = done(state, 'player', `withdraw_${c.topic}`) === 1;
        const complete = done(state, c.worker, `work_${c.topic}`) === 1 && worldFact(state, `result.${c.topic}`) === c.worker;
        const permission = s?.claims?.[allocation ? I.localRight : I.lioRight];
        const access = allocation ? facts['remainder.livelihood.localBenchPresent'] && !!permission && permission.status === 'held' &&
            [c.worker, 'player'].includes(permission.owner) : c.worker === I.lio ? facts['remainder.livelihood.localBenchPresent'] &&
            permission?.owner === I.lio && permission.status === 'held' : residentAccess;
        const kit = (s?.owners?.[c.worker]?.[K.kit] || 0) + remainderLivelihoodReservedKit(state, context, c);
        facts[f('supported')] = local && workerSupported(state, c.worker) && !!access && kit >= 1 && toolFree(state, c.worker, K.kit) &&
            (c.worker !== I.lio || p?.facts?.['field.member'] === true);
        // Allocation sponsorship supplies the worker's tool. Actual work still
        // requires that transferred kit in the worker's own stock/reservation.
        facts[f('fundSupported')] = facts[f('supported')] || allocation && local && workerSupported(state, c.worker) &&
            !!access && toolFree(state, c.worker, K.kit) && facts['remainder.livelihood.playerKitAvailable'];
        facts[f('funded')] = funded;
        facts[f('unfunded')] = !s?.claims?.[c.fundingClaim] && !funded;
        facts[f('offered')] = funded && !withdrawn && actorFact(state, c.worker, `offered.${c.topic}`) === true;
        facts[f('unfinished')] = !complete;
        facts[f('complete')] = funded && !withdrawn && complete;
        facts[f('workerFree')] = remainderLivelihoodWorkerFree(state, c.worker);
        facts[f('notWithdrawn')] = !withdrawn;
        facts[f('notCollected')] = done(state, 'player', `${c.outputs ? 'collect' : 'report'}_${c.topic}`) === 0;
    }
    return facts;
}

function receipt(state, commandId, name, actor = 'player') {
    const d = remainderLivelihoodCommand(commandId), expected = d?.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === key(name));
    const actual = state.simulation?.knowledge?.[actor]?.[key(name)], sequence = causeSequence(actual?.cause);
    assert(expected && actual && actual.stage === expected.stage && actual.value === expected.value && same(actual.basis, expected.basis) &&
        Object.keys(actual).every(k => ['stage', 'value', 'at', 'cause', 'basis'].includes(k)) && natural(actual.at) && actual.at <= state.clock &&
        natural(sequence) && sequence > 0 && sequence <= state.sequence, 'Livelihood work lost its exact dated command receipt.');
    return {...actual, sequence};
}
function validateJob(state, j, c, funding, registry) {
    const d = remainderLivelihoodCommand(key(`work_${c.topic}`)), s = state.simulation;
    assert(j.actorId === c.worker && j.commandId === d.id && j.revision === 1 && j.targetId === null && j.siteId === c.site && j.claim === c.workClaim &&
        j.cancellation === 'refund' && j.reservationReturns === 1 && same(j.costs, d.costs) && same(j.effects, d.effects) && same(j.participants, [c.worker]) &&
        same(j.audience, [c.worker]) && same(j.context, {actorId: c.worker, targetId: null, partyIds: j.context?.partyIds}) && Array.isArray(j.context.partyIds) &&
        natural(j.sequence) && j.sequence === causeSequence(j.id) && j.sequence > funding.sequence && j.sequence <= state.sequence &&
        natural(j.due) && j.due >= state.clock && j.due <= state.clock + c.duration && j.due >= funding.at + c.duration &&
        same(j.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'}) &&
        s.sites?.[c.site]?.reservations?.[j.id] === c.worker && s.claims?.[c.workClaim]?.owner === c.worker && s.claims[c.workClaim].status === 'held' &&
        s.claims[c.workClaim].cause === j.id, 'Livelihood work lost its exact owned, refundable frozen reservation.');
    if(registry) assert(same(registry.simulation?.commands?.get(d.id), d), 'Unsupported current livelihood command revision.');
}
export function validateRemainderLivelihood(state, registry) {
    const s = state.simulation, actors = state.actors || {}, w = state.worlds?.[I.world]?.facts || {};
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(`${P}.`));
    const owned = Object.entries(actors).flatMap(([actor, a]) => ['facts', 'resources', 'completed'].flatMap(domain =>
        Object.entries(a[domain] || {}).filter(([k]) => k.startsWith(`${P}.`)).map(([k, value]) => ({actor, domain, k, value}))));
    const knowledge = Object.entries(s?.knowledge || {}).flatMap(([actor, entries]) => Object.keys(entries).filter(k => k.startsWith(`${P}.`)).map(k => ({actor, k})));
    const claims = Object.keys(s?.claims || {}).filter(k => k.startsWith(`${P}.`)), worlds = Object.keys(w).filter(k => k.startsWith(`${P}.`));
    if(!owned.length && !knowledge.length && !claims.length && !worlds.length && !jobs.length) return;
    assert(state.schema === 11 && state.auditRemainder?.schema === 1 && s?.schema >= 4,
        'New livelihood work requires the explicit expansion11/auditRemainder1 reader. Preserve older frozen work.');
    assert(state.auditRemainder.modules?.livelihood == null, 'Livelihood uses existing typed owners; no duplicate modules record is supported.');
    const allowed = {facts: new Set(), resources: new Set(), completed: new Set(), knowledge: new Set(), claims: new Set(), worlds: new Set()};
    for(const d of remainderLivelihoodDefinitions.commands) {
        allowed.completed.add(`${d.actorId}:${d.id}`);
        if(d.claim) allowed.claims.add(d.claim);
        for(const e of d.effects) {
            if(e.type === 'fact') allowed.facts.add(`${e.actor}:${e.key}`);
            if(e.type === 'resource' && e.key.startsWith(`${P}.`)) allowed.resources.add(`${e.actor}:${e.key}`);
            if(e.type === 'knowledge') allowed.knowledge.add(`${e.actor}:${e.key}`);
            if(e.type === 'claim') allowed.claims.add(e.key);
            if(e.type === 'world' && e.key.startsWith(`${P}.`)) allowed.worlds.add(e.key);
        }
        if(registry) assert(same(registry.simulation?.commands?.get(d.id), d), 'Unsupported frozen livelihood definition.');
    }
    for(const entry of owned) {
        assert(allowed[entry.domain].has(`${entry.actor}:${entry.k}`), 'Unsupported livelihood actor field or owner.');
        assert(entry.domain === 'facts' ? typeof entry.value === 'boolean' : natural(entry.value) && entry.value <= (entry.domain === 'resources' && entry.k.endsWith('.escrow') ? 2 : 1),
            'Livelihood facts, once completions and finite funded work purses are bounded.');
    }
    assert(knowledge.every(e => allowed.knowledge.has(`${e.actor}:${e.k}`)) && claims.every(k => allowed.claims.has(k)) && worlds.every(k => allowed.worlds.has(k)),
        'Unsupported livelihood receipt, world result or claim.');
    for(const name of ['resident', 'lio', 'allocation']) {
        const count = done(state, 'player', `${name}_terms`);
        assert([0, 1].includes(count) && (actorFact(state, 'player', `${name}Terms`) === true) === (count === 1), 'Livelihood terms require an actual once-only meeting.');
        if(count) receipt(state, key(`${name}_terms`), `${name}.terms`);
    }
    let allocationCount = 0;
    for(const c of C) {
        const funded = done(state, 'player', `fund_${c.topic}`), work = done(state, c.worker, `work_${c.topic}`),
            withdrawal = done(state, 'player', `withdraw_${c.topic}`), collect = done(state, 'player', `${c.outputs ? 'collect' : 'report'}_${c.topic}`);
        const active = jobs.filter(j => j.commandId === key(`work_${c.topic}`));
        assert(active.length <= 1 && !(work && withdrawal) && !(work && active.length) && (!collect || work), 'A finite livelihood commission cannot duplicate a job, refund or collection.');
        assert((actorFact(state, 'player', `funded.${c.topic}`) === true) === (funded === 1) &&
            (actorFact(state, 'player', `withdrawn.${c.topic}`) === true) === (withdrawal === 1) &&
            (actorFact(state, 'player', `collected.${c.topic}`) === true) === (collect === 1), 'Livelihood funding/refund/collection must match actual commands.');
        const r = actors[c.worker]?.resources || {}, escrow = r[key(c.escrow)], demand = r[key(c.demand)];
        if(!funded) {
            assert(!work && !withdrawal && !collect && !active.length && escrow == null && demand == null &&
                actorFact(state, c.worker, `offered.${c.topic}`) == null && worldFact(state, `result.${c.topic}`) == null,
                'Unfunded livelihood work has no demand, purse, reservation or result.');
            continue;
        }
        if(c.topic.startsWith('allocation_')) allocationCount++;
        const terms = c.topic.startsWith('shift') ? 'resident' : c.topic.startsWith('allocation_') ? 'allocation' : 'lio';
        assert(done(state, 'player', `${terms}_terms`) === 1 && s.people?.[c.worker]?.inventory === 'simulation' &&
            actors[c.worker]?.worldId === I.world && record(s.owners?.[c.worker]) && natural(actors[c.worker].resources.coins),
            'Funded livelihood work requires its retained existing worker, stock and separate purse.');
        const funding = receipt(state, key(`fund_${c.topic}`), `${c.topic}.funding`), workerFunding = receipt(state, key(`fund_${c.topic}`), `${c.topic}.funding`, c.worker);
        assert(funding.cause === workerFunding.cause && funding.at === workerFunding.at &&
            s.claims?.[c.fundingClaim]?.owner === 'player' && s.claims[c.fundingClaim].status === 'settled' && s.claims[c.fundingClaim].cause === funding.cause,
            'A funded commission must retain its paired actual stock-transfer receipt and once-only funding claim.');
        const reservedOrEnded = !!work || !!withdrawal || active.length > 0;
        assert(escrow === (reservedOrEnded ? 0 : 2) && demand === (reservedOrEnded ? 0 : 1), 'Exactly two real funded coins and one finite demand remain before reservation; none remain after completion or withdrawal.');
        for(const j of active) validateJob(state, j, c, funding, registry);
        if(work) {
            const result = receipt(state, key(`work_${c.topic}`), `${c.topic}.result`, c.worker), claim = s.claims?.[c.workClaim];
            assert(result.sequence > funding.sequence && result.at >= funding.at + c.duration && worldFact(state, `result.${c.topic}`) === c.worker &&
                claim?.owner === c.worker && claim.status === 'settled' && claim.cause === result.cause && actorFact(state, c.worker, `offered.${c.topic}`) === false,
                'Livelihood output and wage need the one later actual timed actor completion.');
            if(collect) {const report = receipt(state, key(`${c.outputs ? 'collect' : 'report'}_${c.topic}`), `${c.topic}.report`); assert(report.sequence > result.sequence && report.at >= result.at, 'Collection needs a separate later stock-backed meeting.');}
        } else assert(worldFact(state, `result.${c.topic}`) == null && !s.knowledge?.[c.worker]?.[key(`${c.topic}.result`)] &&
            (active.length ? s.claims[c.workClaim]?.status === 'held' : !s.claims?.[c.workClaim]), 'Unfinished work creates no retained product, wage or completed claim.');
        if(withdrawal) {
            const withdrawn = receipt(state, key(`withdraw_${c.topic}`), `${c.topic}.withdrawal`);
            assert(withdrawn.sequence > funding.sequence && actorFact(state, c.worker, `offered.${c.topic}`) === false, 'Withdrawal must close the same actually funded unfinished commission.');
        } else if(!work && !(c.topic === 'lio' && done(state, I.lio, 'lio_refuse'))) assert(actorFact(state, c.worker, `offered.${c.topic}`) === true, 'The funded worker must retain the offered finite demand.');
    }
    assert(allocationCount <= 1 && !(allocationCount && done(state, 'player', 'keep_toolkit')), 'One actual toolkit allocation can fund only one independently owned job.');
    if(allocationCount) {
        const selected = C.find(c => c.topic.startsWith('allocation_') && done(state, 'player', `fund_${c.topic}`));
        assert(worldFact(state, 'allocationChoice') === selected.worker,
            'The finite toolkit commission must retain its selected actual worker identity.');
    }
    if(done(state, 'player', 'keep_toolkit')) assert(worldFact(state, 'allocationChoice') === 'player' && actorFact(state, 'player', 'kept.allocation') === true,
        'Keeping the actual toolkit supplies no worker.');
    if(done(state, 'player', 'keep_lio')) assert(!done(state, 'player', 'fund_lio') && actorFact(state, 'player', 'kept.lio') === true,
        'Lio cannot simultaneously take a packing commission and remain free by this choice.');
    const keptLio = done(state, 'player', 'keep_lio'), keptKit = done(state, 'player', 'keep_toolkit');
    assert((actorFact(state, 'player', 'kept.lio') === true) === (keptLio === 1) &&
        (actorFact(state, 'player', 'kept.allocation') === true) === (keptKit === 1), 'Retained finite choices need their actual commands.');
    assert(allocationCount || keptKit || worldFact(state, 'allocationChoice') == null, 'An unchosen toolkit commission grants no selected worker.');
    if(done(state, I.lio, 'lio_refuse')) assert(done(state, 'player', 'fund_lio') === 1 && !done(state, I.lio, 'work_lio') &&
        actorFact(state, I.lio, 'offered.lio') === false, 'Lio can refuse only the actual funded unfinished offer.');
    for(const c of C.filter(c => c.topic.startsWith('shift'))) {
        const declined = done(state, 'player', `decline_${c.topic}`);
        assert((actorFact(state, 'player', `kept.${c.topic}`) === true) === (declined === 1) &&
            !(declined && done(state, 'player', `fund_${c.topic}`)), 'A declined finite shift grants no funded work.');
        if(declined) {
            const r = receipt(state, key(`decline_${c.topic}`), `${c.topic}.choice`), claim = s.claims?.[c.fundingClaim];
            assert(claim?.owner === 'player' && claim.status === 'settled' && claim.cause === r.cause, 'A free decline must settle that exact finite shift choice.');
        }
    }
    for(const name of ['lio', 'allocation']) {
        const permission = s.claims?.[name === 'lio' ? I.lioRight : I.localRight], terms = done(state, 'player', `${name}_terms`);
        assert(!!permission === !!terms, 'A local bench right requires the actual explicit permission meeting.');
        if(!permission) continue;
        const lioEnded = done(state, I.lio, 'work_lio') || done(state, 'player', 'withdraw_lio') || keptLio;
        const selected = C.find(c => c.topic.startsWith('allocation_') && done(state, 'player', `fund_${c.topic}`));
        const owner = name === 'lio' ? I.lio : selected && !done(state, 'player', `withdraw_${selected.topic}`) ? selected.worker : 'player';
        const ended = name === 'lio' ? lioEnded : selected && done(state, selected.worker, `work_${selected.topic}`);
        assert(permission.owner === owner && permission.status === (ended ? 'settled' : 'held') && natural(permission.at) && permission.at <= state.clock &&
            natural(causeSequence(permission.cause)) && causeSequence(permission.cause) <= state.sequence, 'The exact actual local bench right must follow its selected worker and completion.');
    }
    for(const choice of [['keep_lio', 'lio.choice', 'lio.funding'], ['keep_toolkit', 'allocation.choice', 'allocation.funding']]) if(done(state, 'player', choice[0])) {
        const r = receipt(state, key(choice[0]), choice[1]), claim = s.claims?.[key(choice[2])];
        assert(claim?.owner === 'player' && claim.status === 'settled' && claim.cause === r.cause, 'Keeping a real tool/helper must close the same finite commission choice.');
    }
    for(const d of remainderLivelihoodDefinitions.commands) {
        const completed = done(state, d.actorId, d.id.slice(P.length + 1));
        for(const e of d.effects.filter(e => e.type === 'knowledge')) {
            const actual = s.knowledge?.[e.actor]?.[e.key];
            assert(!!actual === !!completed, 'No livelihood receipt may predate its actual command completion.');
            if(completed) receipt(state, d.id, e.key.slice(P.length + 1), e.actor);
        }
    }
    for(const id of claims) if(id.endsWith('.funding')) {
        const c = C.find(c => c.fundingClaim === id && done(state, 'player', `fund_${c.topic}`));
        const declined = C.some(c => c.fundingClaim === id && c.topic.startsWith('shift') && done(state, 'player', `decline_${c.topic}`));
        assert(!!c || declined || id === key('lio.funding') && keptLio || id === key('allocation.funding') && keptKit,
            'A finite funding claim requires its actual funded or keep choice.');
    }
    for(const id of claims) if(id.endsWith('.work')) assert(C.some(c => c.workClaim === id &&
        (done(state, c.worker, `work_${c.topic}`) === 1 || jobs.some(j => j.commandId === key(`work_${c.topic}`)))),
        'A finite work claim cannot exist without its actual frozen job or completed actor result.');
}
