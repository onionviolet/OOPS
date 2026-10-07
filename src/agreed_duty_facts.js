// Read-only facts and exact durable-receipt validation for ACS-P03.
import {assert, natural, record, stableId} from './simulation_contracts.js';
import {SOCIETY_IDS as S, SOCIETY_ITEMS} from './feature_expansion_society.js';
import {AGREED_DUTY_IDS as I, AGREED_DUTY_POLICY as P, agreedDutyDefinitions} from './agreed_duty_content.js';

const seq = cause => {
    const match = /^(?:simulation|cancel|unsupported):([1-9][0-9]*)$/.exec(cause || '');
    return match ? Number(match[1]) : NaN;
};
const caused = (state, receipt) => natural(receipt?.at) && receipt.at <= state.clock && Number.isSafeInteger(seq(receipt?.cause)) &&
    seq(receipt.cause) > 0 && seq(receipt.cause) <= state.sequence;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const W = S.world, PFX = S.prefix;
const idForPreference = value => value === P.values.repairFirst ? 'repair' : value === P.values.lessonFirst ? 'lesson' : value === P.values.ordinary ? 'ordinary' : null;
const choiceFor = route => route === 'repair' ? I.repairFirst : route === 'lesson' ? I.lessonFirst : I.ordinary;
const resultRecord = state => state.simulation?.knowledge?.player?.[I.resultKey];
const agreementRecord = state => state.simulation?.knowledge?.player?.[I.agreementKey];
const actorDone = (state, actorId, commandId) => state.actors?.[actorId]?.completed?.[commandId] || 0;
const jobHasActor = (state, id) => state.simulation?.jobs?.some(job => job.id === id) || false;
const itemCount = (state, id, key) => state.simulation?.people?.[id]?.inventory === 'native'
    ? state.actors?.[id]?.inventory?.[key] || 0
    : state.simulation?.owners?.[id]?.[key] || 0;
const resources = (state,id) => state.actors?.[id]?.resources || {};
const busy = (state, id) => state.simulation?.jobs?.some(j => (j.participants || [j.actorId]).includes(id)) ||
    Object.entries(state.simulation?.sessions || {}).some(([owner, session]) => (session.participants || [owner]).includes(id));

const meetingDefinition = commandId => agreedDutyDefinitions.commands.find(definition=>definition.id===commandId);
const dutyMeetingParticipants = ['player',S.household,S.craftsperson,S.apprentice];
export function agreedDutyReservationValid(state,job) {
    const d=job&&meetingDefinition(job.commandId),sequence=seq(job?.id),expectedSupport={schema:1,requires:d?.completionRequires||null,
        coLocated:!!d?.completionCoLocated,location:'Village',failure:d?.completionFailure||'refund'};
    const frozenContext=record(job?.context)&&same(Object.keys(job.context).sort(),['actorId','targetId','partyIds'])&&job.context.actorId==='player'&&
        job.context.targetId===S.household&&Array.isArray(job.context.partyIds)&&job.context.partyIds.length<=8&&
        new Set(job.context.partyIds).size===job.context.partyIds.length&&job.context.partyIds.every(stableId);
    return !!d && d.revision===1 && Number.isSafeInteger(sequence) && sequence>0 && sequence<=state.sequence && job.sequence===sequence &&
        job.id===`simulation:${sequence}` && job.actorId==='player' && job.targetId===S.household && job.due<=state.clock &&
        job.due>=1 && job.cancellation==='refund' && job.siteId===S.bench && job.claim==null && job.reservationReturns===1 &&
        same(job.costs,d.costs) && same(job.effects,d.effects) && same(job.completionSupport,expectedSupport) &&
        frozenContext && same(job.participants,dutyMeetingParticipants) &&
        state.simulation?.sites?.[S.bench]?.reservations?.[job.id]==='player';
}

function actorAvailable(state, id, ignoreMeetingLocks = false) {
    const person = state.simulation?.people?.[id], actor = state.actors?.[id];
    return !!person && person.life === 'alive' && actor?.worldId === W && person.location === 'Village' &&
        (person.body?.hands ?? 0) >= 2 && (person.vitals?.health ?? 0) > 1 && (ignoreMeetingLocks || !busy(state, id));
}

const dutyChoiceIds = [I.repairFirst,I.lessonFirst,I.ordinary];
export function agreedDutyReadiness(state, {ignoreMeetingLocks = false,reservation = null} = {}) {
    const s = state.simulation, facts = state.worlds?.[W]?.facts || {}, claims = s?.claims || {}, actorFacts = state.actors || {};
    const meeting = s?.jobs?.find(job => dutyChoiceIds.includes(job.commandId) && job.actorId === 'player') ||
        (ignoreMeetingLocks&&agreedDutyReservationValid(state,reservation)?reservation:null);
    const reservationValid = !!meeting && (s?.jobs?.some(job=>job.id===meeting.id&&job.commandId===meeting.commandId) || agreedDutyReservationValid(state,meeting));
    const canIgnoreLocks = ignoreMeetingLocks && reservationValid && dutyChoiceIds.includes(meeting.commandId) && meeting.actorId==='player' &&
        (meeting.participants||[]).includes(S.household) && (meeting.participants||[]).includes(S.craftsperson) && (meeting.participants||[]).includes(S.apprentice);
    if(!s || !state.actors?.player || state.actors.player.worldId !== W || state.realmPrototype?.activeVisitId ||
        s.people?.player?.location !== 'Village' || busy(state, 'player') && !canIgnoreLocks)
        return {ready: false, reason: 'Meet at the supported Village bench when the player and all participants are free.'};
    if(!actorAvailable(state, S.household,canIgnoreLocks) || !actorAvailable(state, S.craftsperson,canIgnoreLocks) || !actorAvailable(state, S.apprentice,canIgnoreLocks))
        return {ready: false, reason: 'Hessa, Orr and Vale must be alive, present and free for this one-minute meeting.'};
    const hessa = resources(state,S.household), orr = resources(state,S.craftsperson), vale = resources(state,S.apprentice);
    if(!actorFacts.player.completed?.[`${PFX}.terms`] || !actorFacts.player.completed?.[`${PFX}.supply`] ||
        facts[`${PFX}.supplied`] !== true || actorFacts[S.craftsperson]?.facts?.[`${PFX}.ordinaryIntent`] !== true ||
        actorFacts[S.apprentice]?.facts?.[`${PFX}.willingBounded`] !== true || (hessa.repairDemand || 0) < 1)
        return {ready: false, reason: 'Use the original household terms and log sale first; Orr must still intend ordinary work, Vale must still want a bounded lesson, and Hessa must still need this repair.'};
    const method=actorFacts[S.craftsperson]?.sources?.[S.method],faculty=s.faculties?.[S.craftsperson]?.[S.method],power=s.powers?.[S.craftsperson]?.[S.method];
    if(!method || method.expiresAt != null && method.expiresAt <= state.clock || !faculty?.active || !faculty.awakened || faculty.suppressed || !power?.owned)
        return {ready:false,reason:'Orr must retain his own active ordinary join before he can accept either existing duty.'};
    if(facts[`${PFX}.dutyPrebooked`] === true || facts[`${PFX}.closed`] === true || facts[`${PFX}.homeRepaired`] === true ||
        actorFacts.player.facts?.[`${PFX}.homeAuthorized`] === true || claims[S.homeRight]?.owner !== S.household ||
        claims[S.benchRight]?.owner !== S.craftsperson)
        return {ready: false, reason: 'The optional order must be agreed before home authorization, repair acceptance or household closure.'};
    const log = SOCIETY_ITEMS.wood, kit = SOCIETY_ITEMS.kit;
    if(itemCount(state, S.household, log) < 2 || (hessa.coins || 0) < 3 || itemCount(state, S.craftsperson, kit) < 1 ||
        (orr.attention || 0) < 2 || (s.people[S.craftsperson].vitals?.stamina || 0) < 3)
        return {ready: false, reason: 'The repair no longer has its exact two logs, three available Hessa coins, Orr kit, attention or stamina.'};
    if((vale.attention || 0) < 1 || (s.people[S.apprentice].vitals?.stamina || 0) < 1)
        return {ready: false, reason: 'Vale no longer has their own attention and stamina for the bounded lesson.'};
    const occupied = site => Object.keys(s.sites?.[site]?.reservations || {}).some(id => !canIgnoreLocks || id !== meeting.id);
    if(!s.sites?.[S.home] || !s.sites?.[S.bench] || occupied(S.home) || occupied(S.bench))
        return {ready: false, reason: 'A required work site is occupied; wait for the current reservation to end.'};
    return {ready: true, reason: ''};
}

export function agreedDutyFacts(state,context={}) {
    const readiness = agreedDutyReadiness(state), preference = state.worlds?.[W]?.facts?.[`${PFX}.dutyPreference`];
    const priorAgreement = agreementRecord(state), priorResult = resultRecord(state);
    const recognizedAgreement = validAgreementReceipt(state, priorAgreement);
    return {
        'society.agreedDutyAvailable': readiness.ready && !idForPreference(preference) && !recognizedAgreement,
        'society.agreedDutySupport': agreedDutyReadiness(state,{ignoreMeetingLocks:true,reservation:context.agreedDutyReservation}).ready,
        'society.agreedDutyFollowupUnused': validResultReceipt(state, priorResult) && state.worlds?.[W]?.facts?.[`${PFX}.duty.followupUsed`] !== true,
    };
}

function validAgreementReceipt(state, receipt) {
    if(!record(receipt) || Object.keys(receipt).length !== 5 || !['stage','value','at','cause','basis'].every(k => Object.hasOwn(receipt,k)) ||
        receipt.stage !== 'seen' || !caused(state,receipt) || receipt.basis?.kind !== 'observation' ||
        receipt.basis?.situationId !== `${PFX}.home_agreement`) return false;
    const id = Object.entries(P.currentReceipts).find(([,texts]) => texts.agreement === receipt.value)?.[0];
    const choice = id && choiceFor(id);
    const attributedTo = id === 'lesson' ? S.apprentice : S.household;
    return !!choice && receipt.basis.attributedTo === attributedTo && (actorDone(state,'player',choice) > 0 ||
        state.simulation?.jobs?.some(job => job.id === receipt.cause && job.commandId === choice)) &&
        seq(receipt.cause) > 0 && seq(receipt.cause) <= state.sequence && validAssents(state,id,receipt);
}

function validAssents(state,route,agreement) {
    const texts = P.currentReceipts[route].assent, actors = {hessa:S.household,orr:S.craftsperson,vale:S.apprentice};
    return Object.entries(actors).every(([name,actor]) => {
        const receipt = state.simulation?.knowledge?.player?.[I.assentKeys[{hessa:'household',orr:'craftsperson',vale:'apprentice'}[name]]];
        return record(receipt) && Object.keys(receipt).length === 5 && receipt.stage === 'seen' && receipt.value === texts[name] &&
            receipt.cause === agreement.cause && receipt.at === agreement.at && caused(state,receipt) && receipt.basis?.kind === 'observation' &&
            receipt.basis?.attributedTo === actor && receipt.basis?.situationId === `${PFX}.home_agreement`;
    });
}

function validResultReceipt(state, receipt) {
    if(!record(receipt) || Object.keys(receipt).length !== 5 || !['stage','value','at','cause','basis'].every(k => Object.hasOwn(receipt,k)) ||
        receipt.stage !== 'seen' || !caused(state,receipt) || receipt.basis?.kind !== 'observation' ||
        receipt.basis?.attributedTo !== S.craftsperson || receipt.basis?.situationId !== `${PFX}.home_agreement`) return false;
    let data;
    try {data = JSON.parse(receipt.value);} catch {return false;}
    if(!record(data) || !same(Object.keys(data).sort(), ['schema','status','preference','agreementCause','dutyCommandId','jobId','note'].sort()) ||
        data.schema !== 1 || !['kept','cancelled','stopped','refused'].includes(data.status) || !['repair','lesson','ordinary'].includes(data.preference) ||
        data.dutyCommandId !== (data.preference === 'lesson' ? I.lesson : I.repair) ||
        data.note !== P.currentReceipts[data.preference][data.status] || agreementRecord(state)?.value !== P.currentReceipts[data.preference].agreement ||
        !Number.isSafeInteger(seq(data.agreementCause)) || seq(data.agreementCause) <= 0 || seq(data.agreementCause) >= seq(receipt.cause) ||
        !validAgreementReceipt(state, agreementRecord(state)) || agreementRecord(state).cause !== data.agreementCause ||
        idForPreference(state.worlds?.[W]?.facts?.[`${PFX}.dutyPreference`]) !== null) return false;
    if(data.status === 'kept') return data.jobId === receipt.cause && data.jobId.startsWith('simulation:') &&
        (actorDone(state,S.craftsperson,data.dutyCommandId) > 0 || state.simulation?.jobs?.some(job => job.id === data.jobId && job.commandId === data.dutyCommandId));
    if(data.status === 'cancelled') return typeof data.jobId === 'string' && data.jobId.startsWith('simulation:') && receipt.cause.startsWith('cancel:') &&
        !jobHasActor(state,data.jobId) && state.worlds?.[W]?.facts?.[`${PFX}.dutyTerminalCommand`] === data.dutyCommandId;
    if(data.status === 'stopped') return typeof data.jobId === 'string' && data.jobId.startsWith('simulation:') && receipt.cause.startsWith('unsupported:') &&
        !jobHasActor(state,data.jobId) && state.worlds?.[W]?.facts?.[`${PFX}.dutyTerminalCommand`] === data.dutyCommandId;
    return data.jobId === null && receipt.cause.startsWith('simulation:') &&
        state.worlds?.[W]?.facts?.[`${PFX}.dutyTerminalCommand`] === data.dutyCommandId;
}

export function validateAgreedDutyState(state) {
    const agreement = agreementRecord(state), result = resultRecord(state), preference = state.worlds?.[W]?.facts?.[`${PFX}.dutyPreference`];
    if(agreement) assert(validAgreementReceipt(state,agreement), 'The household duty agreement lost its exact choice, actor attribution or committed cause.');
    if(result) assert(validResultReceipt(state,result), 'The household duty result lost its exact agreement, duty, outcome or committed cause.');
    const route = idForPreference(preference);
    if(route) assert(validAgreementReceipt(state,agreement) && agreement.value === P.currentReceipts[route].agreement &&
        seq(agreement.cause) <= state.sequence && !validResultReceipt(state,result), 'The active duty preference lacks its live exact agreement or already has a terminal receipt.');
    else assert(preference == null || preference === false, 'Unsupported saved household duty preference.');
    const followup = state.simulation?.knowledge?.player?.[I.followupKey];
    if(followup) {
        const followupChoice=Object.entries(P.followupValues).find(([,value])=>value===followup.value)?.[0];
        const followupCommand=followupChoice==='repair'?I.followupRepair:followupChoice==='lesson'?I.followupLesson:null;
        assert(!!followupCommand && (actorDone(state,'player',followupCommand)>0||state.simulation?.jobs?.some(job=>job.id===followup.cause&&job.commandId===followupCommand)) &&
            validResultReceipt(state,result) && caused(state,followup) && seq(followup.cause) > seq(result.cause) &&
            followup.basis?.kind === 'observation' && followup.basis?.attributedTo === S.household &&
            followup.basis?.situationId === `${PFX}.home_agreement` && state.worlds?.[W]?.facts?.[`${PFX}.duty.followupUsed`] === true,
        'The optional second request must follow and consume the retained attributed duty result.');
    }
    return true;
}

export function agreedDutyReceiptMatches(state) {
    return validAgreementReceipt(state, agreementRecord(state)) && validResultReceipt(state, resultRecord(state));
}

// Exposed for the join host to keep readiness reports tied to existing owners.
export function agreedDutySelectedCommand(state) {
    const route = idForPreference(state.worlds?.[W]?.facts?.[`${PFX}.dutyPreference`]);
    return route === 'lesson' ? I.lesson : route ? I.repair : null;
}

export function agreedDutyReceiptData(state, job, outcome) {
    const preference = state.worlds?.[W]?.facts?.[`${PFX}.dutyPreference`], route = idForPreference(preference), agreement = agreementRecord(state);
    if(!route || !validAgreementReceipt(state,agreement) || !job || !['kept','cancelled','stopped','refused'].includes(outcome)) return null;
    const dutyCommandId = route === 'lesson' ? I.lesson : I.repair;
    if(job.commandId !== dutyCommandId) return null;
    const note = P.currentReceipts[route][outcome];
    return {schema:1,status:outcome,preference:route,agreementCause:agreement.cause,dutyCommandId,jobId:job.id || null,note};
}

export function agreedDutyReceiptValue(state, job, outcome) {
    const data = agreedDutyReceiptData(state,job,outcome);
    return data ? JSON.stringify(data) : null;
}

export function agreedDutyAgreementValueForChoice(state, value) {
    const route = idForPreference(value), agreement = agreementRecord(state);
    return route && validAgreementReceipt(state,agreement) && choiceFor(route) ? agreement.value : null;
}
