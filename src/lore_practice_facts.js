// Pure owner/support projection and exact new-prefix reader. No initialization,
// material grants, private player-sheet projection or mutation happens here.
import {assert, natural, record} from './simulation_contracts.js';
import {REMAINDER_HOME_IDS as H} from './audit_remainder_home_content.js';
import {REMAINDER_LIVELIHOOD_IDS as L} from './audit_remainder_livelihood_content.js';
import {REMAINDER_SUPPLY} from './audit_remainder_offers_content.js';
import {statusCareSupportedBody, statusCareEnrolled, statusCareCondition} from './status_care_facts.js';
import {STATUS_CARE_IDS as C} from './status_care_content.js';
import {LORE_PRACTICE_IDS as I, LORE_PRACTICE_KEYS as K, lorePracticeDefinitions as D, lorePracticeCommand} from './lore_practice_content.js';

export function lorePracticeSame(a, b) {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => lorePracticeSame(v, b[i]));
    return record(a) && record(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && lorePracticeSame(a[k], b[k]));
}
const same = lorePracticeSame;
const done = (state, id, actor = 'player') => state.actors?.[actor]?.completed?.[id] || 0;
const world = state => state.worlds?.[I.world]?.facts || {};
const activeCondition = (state, actor, id) => {
    const c = state.simulation?.conditions?.[actor]?.[id];
    return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
};
const source = (state, actor, id) => {
    const v = state.actors?.[actor]?.sources?.[id], faculty = state.simulation?.faculties?.[actor]?.[id];
    return !!v && v.worldId === I.world && (v.expiresAt == null || v.expiresAt > state.clock) && faculty?.active === true && faculty.awakened === true && !faculty.suppressed && state.simulation?.powers?.[actor]?.[id]?.owned === true;
};
export function lorePracticeLocalSupported(state, context = {}) {
    const p = state.simulation?.people?.player, native = context.vitals?.player;
    return state.schema === 11 && state.referenceGameplay?.schema === 1 && state.auditRemainder?.schema === 1 &&
        state.actors?.player?.facts?.['audit_remainder.enrolled'] === true && done(state, 'audit_remainder.enroll') === 1 &&
        state.actors.player.worldId === I.world && !state.realmPrototype?.activeVisitId && !state.featureDestination?.activeVisitId && !state.nestedCampaign?.activeVisitId && !state.bookWorldCampaign?.activeVisitId &&
        !state.chronicle?.session && state.chronicle?.life?.endedAt == null && p?.life === 'alive' && p.inventory === 'native' &&
        statusCareSupportedBody(state, context) &&
        record(context.gameplay?.player?.inventory) && record(native) && native.health > 1;
}
const participants = d => [...new Set([d.actorId, ...(d.participants || []).map(id => id === '$target' ? d.targetId : id === '$actor' ? d.actorId : id)])];
export function exactLorePracticeJob(state, job, {popped = false} = {}) {
    const d = lorePracticeCommand(job?.commandId), t = job?.loreTiming;
    if(!d || !d.duration || job.actorId !== d.actorId || job.targetId !== (d.targetId || null) || job.revision !== 1 || job.id !== `simulation:${job.sequence}` || !natural(job.sequence) || job.sequence > state.sequence || job.reservationReturns !== 1 || !same(job.costs, d.costs) || !same(job.effects, d.effects) ||
        job.cancellation !== d.cancellation || job.siteId !== (d.siteId || null) || job.claim !== (d.claim || null) || !same(job.participants, participants(d)) ||
        !record(t) || Object.keys(t).length !== 4 || t.schema !== 1 || !natural(t.startedAt) || t.startedAt > state.clock || !natural(t.duration) || t.duration < 1 || !natural(t.paused) || t.startedAt + t.duration + t.paused !== job.due ||
        !record(job.context) || job.context.actorId !== d.actorId || job.context.targetId !== (d.targetId || null) || !Array.isArray(job.context.partyIds) || Object.keys(job.context).some(k => !['actorId', 'targetId', 'partyIds'].includes(k)) ||
        (d.siteId && state.simulation?.sites?.[d.siteId]?.reservations?.[job.id] !== d.actorId)) return false;
    if(d.audience && !same(job.audience, d.audience.map(id => id === '$actor' ? d.actorId : id))) return false;
    if(['lore.warning.signed', 'lore.warning.orr_relay'].includes(d.id)) {
        const sample = job.loreSample, rain = state.simulation?.situations?.[I.rain];
        if(!sample || Object.keys(sample).length !== 8 || sample.schema !== 1 || sample.situationId !== I.rain || sample.situationCause !== rain?.cause || sample.sourceActor !== 'player' ||
            !/^simulation:[1-9][0-9]*$/.test(sample.sourceCause || '') || Number(sample.sourceCause.slice(11)) > job.sequence || !natural(sample.observedAt) || sample.observedAt < rain.openedAt || sample.observedAt > t.startedAt ||
            sample.location !== 'Village' || typeof sample.drainOpen !== 'boolean') return false;
        if(d.id === 'lore.warning.signed' && state.simulation.knowledge.player?.['lore.warning.sample']?.cause !== sample.sourceCause) return false;
        if(d.id === 'lore.warning.orr_relay' && state.simulation.knowledge[I.orr]?.['lore.warning.relay_source']?.value !== JSON.stringify(sample)) return false;
    }
    if(d.id === 'lore.work.orr_repair' && !(job.loreOverlap?.schema === 1 && Object.keys(job.loreOverlap).length === 2 && Array.isArray(job.loreOverlap.funded) && job.loreOverlap.funded.length <= 2 &&
        new Set(job.loreOverlap.funded.map(f => f.name)).size === job.loreOverlap.funded.length && job.loreOverlap.funded.every(f => Object.keys(f).length === 2 && ['shift1', 'shift2'].includes(f.name) &&
            state.simulation.knowledge.player?.[`remainder_livelihood.${f.name}.funding`]?.cause === f.cause && done(state, `remainder_livelihood.fund_${f.name}`) === 1))) return false;
    if(d.id === I.exposure) return exactLorePracticeExposure(state, job, {popped});
    return t.duration === d.duration && same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'}) &&
        (popped ? job.due <= state.clock : job.due >= state.clock);
}
export function exactLorePracticeExposure(state, job, {popped = false} = {}) {
    const x = job?.loreExposure, t = job?.loreTiming, rain = state.simulation?.situations?.[I.rain], w = world(state);
    return !!x && Object.keys(x).length === 10 && x.schema === 1 && x.situationId === I.rain && x.operation === 'expose_stave' && x.ownerId === I.ressa && x.key === K.sound && x.count === 1 &&
        x.situationCause === rain?.cause && x.admittedAt === t?.startedAt && x.remaining === t?.duration && natural(x.remaining) && x.remaining > 0 && x.remaining <= 20 &&
        natural(x.pauseAtAdmission) && x.pauseAtAdmission <= (w['lore.warning.pauseMinutes'] || 0) && t.paused === (w['lore.warning.pauseMinutes'] || 0) - x.pauseAtAdmission &&
        x.admittedAt + x.remaining === rain.openedAt + 20 + x.pauseAtAdmission && job.due === rain.deadline &&
        w['lore.warning.trialEntrusted'] === true && w['lore.warning.trialConsent'] === 'accepted' && done(state, 'lore.warning.ressa_trial_accept', I.ressa) === 1 && !w['lore.warning.trialResult'] && w['lore.warning.trialCancelled'] !== true &&
        (popped ? job.due <= state.clock : job.due >= state.clock) && !job.completionSupport;
}
function free(state, id, own) {
    const s = state.simulation;
    return !(s?.jobs || []).some(j => j.id !== own?.id && (j.participants || [j.actorId]).includes(id)) &&
        !Object.entries(s?.sessions || {}).some(([actor, value]) => (value.participants || [actor]).includes(id)) &&
        !(state.pending || []).some(j => j.context?.actorId === id) && !Object.values(state.actors?.[id]?.techniques || {}).some(t => t.practice) &&
        !Object.values(s?.pursuits || {}).some(p => p.actorId === id && ['investigating', 'moving', 'searching', 'waiting', 'sheltered'].includes(p.status));
}
export function lorePracticeFacts(state, context = {}) {
    const s = state.simulation, w = world(state), a = state.actors?.player, actor = context.actorId || 'player';
    const local = lorePracticeLocalSupported(state, context);
    const candidate = context.lorePracticeReservation || s?.jobs?.find(j => j.actorId === actor && lorePracticeCommand(j.commandId));
    const own = exactLorePracticeJob(state, candidate, {popped: !!context.lorePracticeReservation}) ? candidate : null;
    const held = (id, key) => own?.actorId === id && own.costs.some(e => e.type === 'item' && e.actor === id && e.key === key && e.amount === -1) && own.effects.some(e => e.type === 'item' && e.actor === id && e.key === key && e.amount === 1 && e.reservationReturn);
    const stock = (id, key) => (id === 'player' ? context.gameplay?.player?.inventory : s?.owners?.[id])?.[key] || 0;
    const unencumbered = (id, key) => !Object.values((id === 'player' ? context.equipment?.player : null) || s?.equipment?.[id] || {}).includes(key) && !Object.values(s?.custody || {}).some(c => (c.holder === id || c.owner === id) && c.key === key);
    const tool = id => unencumbered(id, K.kit) && (stock(id, K.kit) > 0 || held(id, K.kit));
    const hands = id => {
        const p = s?.people?.[id], v = id === 'player' ? context.vitals?.player : p?.vitals;
        return local && p?.life === 'alive' && state.actors?.[id]?.worldId === I.world && (p.body?.form == null || p.body.form === 'human') &&
            (p.body?.hands ?? (id === 'player' ? 2 : 0)) >= 2 && p.body?.mobile !== false && v?.health > 1 &&
            !activeCondition(state, id, 'body.sore_hands') && !activeCondition(state, id, 'body.scraped_hands') && free(state, id, own);
    };
    const location = actor === 'player' ? context.facts?.location || s?.people?.player?.location : s?.people?.[actor]?.location;
    const contact = (id, place) => local && s?.people?.[id]?.life === 'alive' && state.actors?.[id]?.worldId === I.world && s.people[id].location === place && location === place && free(state, id, own);
    const workshop = s?.sites?.[I.workshop], right = s?.claims?.[I.residence], n = s?.people?.[I.neri];
    const roomRight = local && workshop?.owner === 'player' && workshop.capacity === 1 && a?.facts?.['field.facility'] === true && done(state, 'field.workshop.assembly') === 1 && w['project.field.workshop.assembly'] === true &&
        w['remainder_home.roomCompleted'] === true && done(state, 'remainder_home.room.finish') === 1 && right?.owner === I.neri && right.status === 'held' && n?.life === 'alive' && n.location === 'Shack' &&
        state.actors?.[I.neri]?.facts?.['remainder_home.willing'] === true && a?.facts?.['remainder_home.departed'] !== true && context.facts?.['native.zone.Shack.accessible'] === true;
    const shift = s?.situations?.[I.shift], rain = s?.situations?.[I.rain], shiftActive = !!shift && !['declined', 'withdrawn', 'delivered'].includes(shift.phase);
    const orrWilling = state.actors?.[I.orr]?.facts?.['feature_society.ordinaryIntent'] === true && source(state, I.orr, L.method);
    const neriMethod = source(state, I.neri, H.method);
    const noJob = id => !(s?.jobs || []).some(j => j.actorId === id);
    const neriResponse = w['lore.work.neriResponse'], orrResponse = w['lore.work.orrResponse'], response = w['lore.warning.ressaResponse'], relay = w['lore.warning.relayResponse'];
    const sample = s?.knowledge?.player?.['lore.warning.sample'], sampleState = a?.facts?.['lore.warning.sampleDrainOpen'];
    const currentSample = !!rain && sample?.basis?.situationId === I.rain && sample.basis.attributedTo === 'player' && natural(sample.at) && sample.at >= rain.openedAt && sample.at <= state.clock && typeof sampleState === 'boolean' && sampleState === w['lore.warning.drainOpen'] &&
        (actor === 'player' ? ['Village', 'Shack'].includes(location) : s?.people?.[actor]?.location === 'Village');
    const beforeRain = !!rain && !w['lore.warning.rainOccurred'] && state.clock < rain.deadline;
    const funded = (state.actors?.[I.ressa]?.resources?.['lore.warning.workEscrow'] || 0) >= 2 || own?.commandId === 'lore.warning.ressa_check';
    const ressaAble = hands(I.ressa) && s?.people?.[I.ressa]?.location === 'Village' && (s.people[I.ressa].vitals.stamina >= 1 || own?.commandId === 'lore.warning.ressa_check');
    const canPaid = ressaAble && tool(I.ressa) && funded && beforeRain && (state.clock + 3 < rain.deadline || own?.commandId === 'lore.warning.ressa_check');
    const small = !canPaid && ressaAble && beforeRain && w['lore.warning.messageKind'] === 'signed' && (state.clock + 1 < rain.deadline || own?.commandId === 'lore.warning.ressa_small_check');
    const prepared = (id, commandId, key) => {
        const c = statusCareCondition(state, id), r = s?.knowledge?.player?.[key];
        return statusCareEnrolled(state) && statusCareSupportedBody(state, context) && done(state, commandId) > 0 && c?.intensity === 1 && r?.cause === c.cause;
    };
    return {
        'lore.enrolled': state.schema === 11 && state.auditRemainder?.schema === 1, 'lore.local': local,
        'lore.playerHands': hands('player'), 'lore.playerKit': tool('player'), 'lore.neriHands': hands(I.neri), 'lore.orrHands': hands(I.orr), 'lore.ressaHands': hands(I.ressa),
        'lore.neriKit': tool(I.neri), 'lore.orrKit': tool(I.orr), 'lore.ressaKit': tool(I.ressa), 'lore.neriMethod': neriMethod,
        'lore.orrMethod': orrWilling, 'lore.steadyGrip': prepared(C.steady, C.grip, 'status.care.grip'), 'lore.focusedInspection': prepared(C.focused, C.focusedBreak, 'status.care.focused_break'),
        'lore.neriContact': contact(I.neri, 'Shack'), 'lore.orrContact': contact(I.orr, 'Village'), 'lore.ressaContact': contact(I.ressa, 'Village'),
        'lore.orrAccepts': hands(I.orr) && orrWilling && tool(I.orr) && roomRight && (state.actors[I.orr].resources.attention || 0) >= 1 && s.people[I.orr].vitals.stamina >= 2,
        'lore.neriAccepts': hands(I.neri) && neriMethod && roomRight && tool(I.neri) && (state.actors[I.neri].resources.attention || 0) >= 1 && s.people[I.neri].vitals.stamina >= 2,
        'lore.orrRelayAccepts': hands(I.orr) && orrWilling && s?.people?.[I.orr]?.location === 'Village' && s.people[I.orr].vitals.stamina >= 1 && beforeRain && currentSample,
        'lore.work.canBegin': !shift && roomRight && hands(I.neri) && done(state, 'remainder_home.resident_bind', I.neri) === 1 && done(state, 'remainder_home.collect_resident') === 1 &&
            done(state, 'remainder_home.meet_resident') === 1 && !!s?.knowledge?.player?.['feature_society.meeting'] && s?.people?.[I.orr]?.life === 'alive' && free(state, I.orr, own),
        'lore.work.started': !!shift, 'lore.work.active': shiftActive, 'lore.work.roomRight': !!roomRight,
        'lore.work.shutterRepaired': w['lore.work.shutterRepaired'] === true, 'lore.work.indoorSupport': !!shift && roomRight && location === 'Shack' && w['lore.work.shutterRepaired'] === true,
        'lore.work.noOrrOffer': !orrResponse || orrResponse === 'withdrawn', 'lore.work.noRepairJob': !(s?.jobs || []).some(j => ['lore.work.repair_player', 'lore.work.repair_steady', 'lore.work.orr_repair'].includes(j.commandId)),
        'lore.work.orrPending': orrResponse === 'pending', 'lore.work.orrAccepted': orrResponse === 'accepted', 'lore.work.orrReturn': ['complete', 'withdrawn'].includes(orrResponse),
        'lore.work.orrWithdrawable': ['pending', 'accepted', 'refused'].includes(orrResponse) && noJob(I.orr) && (state.actors?.[I.orr]?.resources?.['lore.work.orrEscrow'] || 0) === 1 && stock(I.orr, K.offcut) >= 1,
        'lore.work.neriPending': neriResponse === 'pending', 'lore.work.neriAccepted': neriResponse === 'accepted', 'lore.work.neriComplete': neriResponse === 'complete',
        'lore.work.neriCollectable': neriResponse === 'complete' && w['lore.work.kitCollected'] !== true && stock(I.neri, K.kit) >= 2 && unencumbered(I.neri, K.kit),
        'lore.work.neriWithdrawable': ['pending', 'accepted', 'refused'].includes(neriResponse) && noJob(I.neri) && (state.actors?.[I.neri]?.resources?.['lore.work.neriEscrow'] || 0) === 2 && stock(I.neri, K.log) >= 1,
        'lore.work.noFunding': !neriResponse && (!orrResponse || orrResponse === 'withdrawn'),
        'lore.warning.canBegin': !rain && !!s?.situations?.[REMAINDER_SUPPLY.situation] && !!s?.knowledge?.player?.['remainder.offers.supply.report'] &&
            !!s?.knowledge?.player?.['feature_society.meeting'] && s?.people?.[I.orr]?.life === 'alive' && free(state, I.ressa, own),
        'lore.warning.started': !!rain, 'lore.warning.beforeRain': beforeRain, 'lore.warning.currentSample': currentSample,
        'lore.warning.preResponse': !!rain && !w['lore.warning.messageDelivered'] && !['pending', 'accepted', 'delivered'].includes(relay) && !w['lore.warning.trialEntrusted'] && !w['lore.warning.left'],
        'lore.warning.ressaPending': response === 'pending' && !!s?.knowledge?.[I.ressa]?.['lore.warning.received'], 'lore.warning.ressaFunded': funded,
        'lore.warning.ressaPaidChoice': canPaid, 'lore.warning.ressaSmallChoice': small, 'lore.warning.ressaRefuses': !canPaid && !small,
        'lore.warning.responseSettled': ['sheltered', 'checked', 'declined'].includes(response) && noJob(I.ressa),
        'lore.warning.trialUndecided': !w['lore.warning.trialConsent'], 'lore.warning.trialWilling': ['sheltered', 'checked'].includes(response) && hands(I.ressa) && beforeRain && !activeCondition(state, I.ressa, 'mood.irritated'),
        'lore.warning.trialAccepted': w['lore.warning.trialConsent'] === 'accepted' && done(state, 'lore.warning.ressa_trial_accept', I.ressa) === 1,
        'lore.warning.relayPending': relay === 'pending', 'lore.warning.relayAccepted': relay === 'accepted',
        'lore.warning.relayWithdrawable': ['pending', 'accepted', 'refused'].includes(relay) && noJob(I.orr) && (state.actors?.[I.orr]?.resources?.['lore.warning.relayEscrow'] || 0) === 1,
        'lore.warning.checkWithdrawable': w['lore.warning.fundingOffered'] === true && !w['lore.warning.fundingWithdrawn'] && noJob(I.ressa) && (state.actors?.[I.ressa]?.resources?.['lore.warning.workEscrow'] || 0) === 2,
        'lore.warning.noTrial': !w['lore.warning.trialEntrusted'], 'lore.warning.noPendingRelay': !['pending', 'accepted'].includes(relay),
        'lore.warning.noUnperformedFunding': !(state.actors?.[I.ressa]?.resources?.['lore.warning.workEscrow'] || 0) && !(state.actors?.[I.orr]?.resources?.['lore.warning.relayEscrow'] || 0),
        'lore.warning.wetResult': w['lore.warning.trialResult'] === 'wet', 'lore.warning.wetBuyable': w['lore.warning.trialResult'] === 'wet' && !w['lore.warning.wetBought'] && stock(I.ressa, K.wet) >= 1 && unencumbered(I.ressa, K.wet),
        'lore.warning.left': w['lore.warning.left'] === true, 'lore.warning.exposureHost': context.lorePracticeHost === true && context.loreExposureHost === true,
    };
}

// Root adds these exact deltas to the earlier owners' equations, rather than
// loosening old service/purse conservation. Only real frozen reservations and
// completed commands contribute; pure offers never manufacture a tool.
export function lorePracticeOwnerDeltas(state) {
    const s = state.simulation, active = id => (s?.jobs || []).some(j => j.commandId === id && exactLorePracticeJob(state, j)) ? 1 : 0;
    const nf = done(state, 'lore.work.fund_neri'), nw = done(state, 'lore.work.neri_bind', I.neri), np = active('lore.work.neri_bind'),
        nr = done(state, 'lore.work.withdraw_neri'), nc = done(state, 'lore.work.collect_kit');
    const rf = done(state, 'lore.warning.fund_check'), rw = done(state, 'lore.warning.ressa_check', I.ressa), rp = active('lore.warning.ressa_check'),
        rr = done(state, 'lore.warning.withdraw_check'), small = done(state, 'lore.warning.ressa_small_check', I.ressa) + active('lore.warning.ressa_small_check'), buy = done(state, 'lore.warning.buy_wet');
    const of = done(state, 'lore.work.ask_orr'), ow = done(state, 'lore.work.orr_repair', I.orr), op = active('lore.work.orr_repair'), or = done(state, 'lore.work.withdraw_orr');
    const relayFund = done(state, 'lore.warning.ask_relay'), relayDone = done(state, 'lore.warning.orr_relay', I.orr), relayPending = active('lore.warning.orr_relay'), relayReturned = done(state, 'lore.warning.withdraw_relay');
    return {
        [I.neri]: {resources: {'lore.work.neriEscrow': 2 * (nf - nw - np - nr)}, coins: nw, attention: -nw - np, stamina: -2 * (nw + np), log: nf - nw - np - nr, kit: nw - np - nc},
        [I.orr]: {resources: {'lore.work.orrEscrow': of - ow - op - or, 'lore.warning.relayEscrow': relayFund - relayDone - relayPending - relayReturned},
            coins: ow + relayDone, attention: -ow - op, stamina: -2 * (ow + op) - relayDone - relayPending, offcut: of - ow - op - or, kit: -op},
        [I.ressa]: {resources: {'lore.warning.workEscrow': 2 * (rf - rw - rp - rr), 'lore.warning.earnedCoins': rw + buy}, kit: -rp, stamina: -rw - rp - small},
    };
}

export function validateLorePractice(state, registry) {
    const s = state.simulation, w = world(state), situations = [I.shift, I.rain].filter(id => s?.situations?.[id]);
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith('lore.'));
    const owned = Object.entries(state.actors || {}).flatMap(([actor, a]) => ['facts', 'resources', 'completed'].flatMap(domain => Object.keys(a[domain] || {}).filter(k => k.startsWith('lore.')).map(key => ({actor, domain, key}))));
    const known = Object.entries(s?.knowledge || {}).flatMap(([actor, a]) => Object.keys(a).filter(k => k.startsWith('lore.')).map(key => ({actor, key})));
    if(!situations.length && !jobs.length && !owned.length && !known.length && !Object.keys(w).some(k => k.startsWith('lore.'))) return;
    assert(state.schema === 11 && state.auditRemainder?.schema === 1 && state.referenceGameplay?.schema === 1 && s?.schema >= 4, 'Original lore work needs the explicit current expansion11 reader.');
    const allowed = {facts: new Set(), resources: new Set(), completed: new Set(), knowledge: new Set(), world: new Set()};
    for(const d of D.commands) {
        allowed.completed.add(`${d.actorId}:${d.id}`);
        if(registry) assert(same(registry.simulation.commands.get(d.id), d), 'Unsupported frozen lore command revision.');
        for(const e of [...d.costs, ...d.effects]) {
            if(e.type === 'fact') allowed.facts.add(`${e.actor}:${e.key}`);
            if(e.type === 'resource' && e.key.startsWith('lore.')) allowed.resources.add(`${e.actor}:${e.key}`);
            if(e.type === 'knowledge') allowed.knowledge.add(`${e.actor}:${e.key}`);
            if(e.type === 'world') allowed.world.add(e.key);
            if(e.type === 'observation') {allowed.facts.add(`${d.actorId}:${e.as}`); allowed.facts.add(`${d.actorId}:${e.as}.observedAt`);}
        }
    }
    allowed.knowledge.add(`${I.orr}:lore.warning.relay_source`);
    allowed.knowledge.add(`${I.ressa}:lore.warning.received_source`);
    allowed.knowledge.add(`${I.ressa}:lore.warning.rain_result`);
    allowed.knowledge.add('player:lore.work.inspection_result');
    allowed.knowledge.add(`${I.orr}:lore.work.orr_overlap`);
    for(const key of ['lore.warning.trialResult', 'lore.warning.trialCancelled', 'lore.warning.siteWet', 'lore.warning.rainAt', 'lore.warning.trialCause', 'lore.work.inspectionStatus']) allowed.world.add(key);
    for(const e of owned) {
        assert(allowed[e.domain].has(`${e.actor}:${e.key}`), 'Unsupported lore owner or typed field.');
        const value = state.actors[e.actor][e.domain][e.key];
        assert(e.domain === 'completed' ? natural(value) && (!lorePracticeCommand(e.key)?.once || value <= 1) : e.domain === 'resources' ? natural(value) && value <= 2 : typeof value === 'boolean' || natural(value), 'Invalid finite lore record.');
    }
    assert(known.every(e => allowed.knowledge.has(`${e.actor}:${e.key}`)), 'Unsupported lore receipt owner.');
    assert(Object.keys(w).filter(k => k.startsWith('lore.')).every(k => allowed.world.has(k)), 'Unsupported lore world field.');
    for(const e of known) {
        const value = s.knowledge[e.actor][e.key], possible = D.commands.filter(d => d.effects.some(effect => effect.type === 'knowledge' && effect.actor === e.actor && effect.key === e.key));
        assert(value.stage === 'seen' && natural(value.at) && value.at <= state.clock && /^simulation:[1-9][0-9]*$/.test(value.cause || '') && Number(value.cause.slice(11)) <= state.sequence &&
            value.basis?.situationId === (e.key.startsWith('lore.work.') ? I.shift : I.rain) && s.situations?.[value.basis.situationId], 'Lore knowledge needs its actual dated command and existing situation.');
        if(possible.length) assert(possible.some(d => done(state, d.id, d.actorId) > 0), 'A lore account cannot predate its actual command.');
    }
    for(const [key, values] of [['lore.work.orrResponse', ['pending', 'accepted', 'refused', 'complete', 'withdrawn']],
        ['lore.work.neriResponse', ['pending', 'accepted', 'refused', 'complete', 'withdrawn']], ['lore.warning.relayResponse', ['pending', 'accepted', 'refused', 'delivered', 'withdrawn']],
        ['lore.warning.ressaResponse', ['pending', 'sheltered', 'checked', 'declined']], ['lore.warning.messageKind', ['signed', 'anonymous']], ['lore.warning.trialConsent', ['accepted', 'refused']],
        ['lore.work.inspectionStatus', ['prepared_before_window', 'missed']]]) assert(w[key] == null || values.includes(w[key]), 'Unknown lore decision/outcome meaning.');
    assert((w['lore.work.neriResponse'] === 'complete') === (done(state, 'lore.work.neri_bind', I.neri) === 1) &&
        (w['lore.work.orrResponse'] === 'complete') === (done(state, 'lore.work.orr_repair', I.orr) === 1), 'An actor’s extra completed work needs its exact material job.');
    if(w['lore.work.neriResponse']) assert(done(state, 'lore.work.fund_neri') === 1, 'Neri’s new response must belong to her separate real funded offer.');
    if(w['lore.work.orrResponse']) assert(done(state, 'lore.work.ask_orr') === 1, 'Orr’s new cover response must belong to the separate supplied request.');
    if(w['lore.warning.relayResponse']) assert(done(state, 'lore.warning.ask_relay') === 1, 'A private relay response requires its actual escrowed request.');
    if(w['lore.warning.ressaResponse']) assert(done(state, 'lore.warning.signed') || done(state, 'lore.warning.orr_relay', I.orr), 'Ressa can respond only to an actually received message.');
    if(s.knowledge?.[I.orr]?.['lore.warning.relay_source']) assert(done(state, 'lore.warning.ask_relay') === 1, 'Orr’s private message source requires the actual paid request.');
    if(s.knowledge?.[I.ressa]?.['lore.warning.received_source']) assert(done(state, 'lore.warning.signed') || done(state, 'lore.warning.orr_relay', I.orr), 'Recipient source attribution requires performed delivery.');
    if(s.knowledge?.[I.orr]?.['lore.work.orr_overlap']) assert(done(state, 'lore.work.orr_repair', I.orr) === 1, 'An overlapping work account requires Orr’s actual admitted completed repair.');
    for(const id of situations) {
        const r = s.situations[id], d = D.situations.find(d => d.id === id), prefix = id === I.shift ? 'lore.work' : 'lore.warning', paused = w[`${prefix}.pauseMinutes`];
        assert(r.revision === 1 && same(r.context, d.context) && same(r.privateTruth, d.privateTruth) && same(r.participants, d.participants) && same(r.phases, d.phases) && natural(paused) && r.deadline === r.openedAt + d.responseWindow + paused &&
            done(state, `${prefix}.begin`) === 1 && s.knowledge.player[`${prefix === 'lore.work' ? 'lore.work.terms' : 'lore.warning.terms'}`]?.cause === r.cause, 'Lore windows need their actual opt-in cause, immutable reference and exact retained pause accounting.');
    }
    for(const j of jobs) assert(exactLorePracticeJob(state, j), 'Unsupported frozen lore job or forged remaining rain window.');
    const personal = done(state, 'lore.work.repair_player') + done(state, 'lore.work.repair_steady');
    const repaired = personal + done(state, 'lore.work.orr_repair', I.orr);
    assert(repaired <= 1, 'The same shutter installation cannot earn two repairs.');
    assert((w['lore.work.shutterRepaired'] === true) === (repaired === 1), 'An installed shutter requires one actual supported completed repair.');
    if(repaired) assert(w['lore.work.repairWorker'] === (personal ? 'player' : I.orr), 'Installation lost its actual worker.');
    const nf = done(state, 'lore.work.fund_neri'), nb = done(state, 'lore.work.neri_bind', I.neri), nc = done(state, 'lore.work.collect_kit'), nwithdraw = done(state, 'lore.work.withdraw_neri');
    assert(!nb || nf && repaired && done(state, 'lore.work.neri_accept', I.neri), 'Neri’s extra product needs her funded, consented actual job.');
    assert(!nc || nb && !nwithdraw, 'Collection cannot predate or duplicate the separate actual kit.');
    assert(!(nb && nwithdraw) && (w['lore.work.kitCollected'] === true) === !!nc, 'Completed extra work cannot be refunded or silently collected.');
    for(const [actor, delta] of Object.entries(lorePracticeOwnerDeltas(state))) for(const [key, expected] of Object.entries(delta.resources))
        assert((state.actors?.[actor]?.resources?.[key] || 0) === expected, 'Lore work escrow and earned wages must match actual funding, reservation, output and withdrawal.');
    const check = done(state, 'lore.warning.ressa_check', I.ressa), small = done(state, 'lore.warning.ressa_small_check', I.ressa), refused = done(state, 'lore.warning.ressa_refuse', I.ressa);
    assert(check + small + refused <= 1 && (!check || done(state, 'lore.warning.fund_check')), 'Ressa has one independent response, with paid work actually funded.');
    assert(!(done(state, 'lore.warning.signed') && done(state, 'lore.warning.orr_relay', I.orr)), 'One new warning chooses one delivery channel.');
    const consent = done(state, 'lore.warning.ressa_trial_accept', I.ressa), denial = done(state, 'lore.warning.ressa_trial_refuse', I.ressa);
    assert(consent + denial <= 1 && (!consent || check + small === 1) && (!denial || check + small + refused === 1) &&
        (w['lore.warning.trialConsent'] === 'accepted') === !!consent && (w['lore.warning.trialConsent'] === 'refused') === !!denial, 'A newly entrusted trial needs the actual independent recipient’s separate consent decision.');
    const trial = done(state, 'lore.warning.entrust_stave'), result = w['lore.warning.trialResult'], cancelled = w['lore.warning.trialCancelled'] === true, exposure = jobs.filter(j => j.commandId === I.exposure);
    assert(exposure.length <= 1 && (!trial || ['sheltered', 'checked', 'declined'].includes(w['lore.warning.ressaResponse'])), 'Trial admission requires Ressa’s settled prior independent response.');
    assert(!trial || Number(!!result) + Number(cancelled) + exposure.length === 1, 'Exactly one owned trial reservation, cancellation or material result must remain.');
    if(result) assert(['sound', 'wet'].includes(result) && done(state, I.exposure, I.ressa) === 1 && w['lore.warning.rainOccurred'] === true && s.knowledge[I.ressa]?.['lore.warning.rain_result']?.cause === w['lore.warning.trialCause'], 'Trial material requires its actual once-settled rain cause.');
    if(w['lore.warning.wetBought']) assert(result === 'wet' && done(state, 'lore.warning.buy_wet') === 1, 'A wet result enters the player bag only through its actual willing purchase.');
    for(const d of D.controllers) {
        const saved = Object.entries(s.controllers || {}).find(([id, v]) => (v.definitionId || id) === d.id);
        const enabled = d.id.startsWith('lore.work.') ? !!s.situations?.[I.shift] : !!s.situations?.[I.rain];
        assert(!saved || enabled && saved[1].actorId === d.actorId && saved[1].interval === 1, 'Lore controller installation requires its exact explicitly opted-in existing person.');
    }
}
