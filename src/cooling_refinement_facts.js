// Read-only projection from the actual Village calendar, a real current
// preparation condition, paid completed failures and the attributed receipt.
import {FEATURE_OBJECT_IDS} from './feature_expansion_objects.js';
import {recurringWindow} from './world_rhythm.js';
import {statusCareSupportedBody} from './status_care_facts.js';
import {COOLING_REFINEMENT_DEFINITION_MAP, coolingRefinementReceiptEffects} from './cooling_refinement_content.js';

const PREFIX = 'reference.coolingRefinement.';
const WINDOW = Object.freeze({period: 1440, opens: 360, closes: 480});
const natural = value => Number.isSafeInteger(value) && value >= 0;
const record = value => value != null && typeof value === 'object' && !Array.isArray(value);
const check = (ok, message) => {if(!ok) throw new Error(message);};
const ownFacts = state => state.actors?.player?.facts || {};
const ownDone = state => state.actors?.player?.completed || {};
const REFINE_IDS = Object.freeze(['reference_gameplay.refine_first', 'reference_gameplay.refine_second',
    'reference_gameplay.refine_third', 'reference_gameplay.refine_later']);
const REFINE_SET = new Set(REFINE_IDS);
const COMPLETION_KEYS = new Set([...REFINE_IDS, 'reference_gameplay.steady_hook']);
const FACT_KEYS = new Set([`${PREFIX}failedAttempts`, `${PREFIX}applicationAvailable`, `${PREFIX}lastAttempt`]);
const KNOWLEDGE_KEYS = new Set([`${PREFIX}success`, `${PREFIX}failure`, `${PREFIX}steady_hook`]);
const same = (left, right) => {
    if(left === right) return true;
    if(Array.isArray(left) || Array.isArray(right)) return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, i) => same(value, right[i]));
    if(!record(left) || !record(right)) return false;
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length && keys.every(key => Object.hasOwn(right, key) && same(left[key], right[key]));
};

export function coolingRefinementCalendar(state, context = {}) {
    const anchor = context.remainderLivelihoodClock || context.nativeCareFrame;
    if(!anchor || !natural(anchor.calendarMinute) || !natural(anchor.clock) || anchor.clock > state.clock) {
        return {supported: false, minute: null, open: false, remaining: 0, nextIn: null};
    }
    const minute = anchor.calendarMinute + state.clock - anchor.clock;
    if(!natural(minute)) return {supported: false, minute: null, open: false, remaining: 0, nextIn: null};
    return {supported: true, minute, ...recurringWindow(WINDOW, minute)};
}

function focusedPreparation(state) {
    const condition = state.simulation?.conditions?.player?.['status.care.focused'];
    return !!condition && condition.intensity > 0 && condition.expiresAt != null && condition.expiresAt > state.clock;
}

export function coolingRefinementFacts(state, context = {}) {
    const calendar = coolingRefinementCalendar(state, context);
    const failures = ownFacts(state)[`${PREFIX}failedAttempts`] ?? 0;
    const preparedByFocus = focusedPreparation(state);
    const prepared = calendar.open || preparedByFocus;
    const retryBonus = Math.min(failures, 3) * 0.05;
    const baseProbability = prepared ? 0.70 : 0.50;
    const successProbability = Math.min(0.85, baseProbability + retryBonus);
    const applicationAvailable = ownFacts(state)[`${PREFIX}applicationAvailable`] === true;
    const weight = {
        successPrepared: prepared ? successProbability : 0,
        failurePrepared: prepared ? 1 - successProbability : 0,
        successOrdinary: prepared ? 0 : successProbability,
        failureOrdinary: prepared ? 0 : 1 - successProbability,
    };
    return {
        'reference.coolingRefinement.nativeBodySupported': statusCareSupportedBody(state, context),
        'reference.coolingRefinement.calendarSupported': calendar.supported,
        'reference.coolingRefinement.quietWindowOpen': calendar.supported && calendar.open,
        'reference.coolingRefinement.quietWindowRemaining': calendar.supported ? calendar.remaining : 0,
        'reference.coolingRefinement.preparedByFocus': preparedByFocus,
        'reference.coolingRefinement.prepared': prepared,
        'reference.coolingRefinement.failedAttempts': failures,
        'reference.coolingRefinement.retryBonus': retryBonus,
        'reference.coolingRefinement.baseProbability': baseProbability,
        'reference.coolingRefinement.successProbability': successProbability,
        'reference.coolingRefinement.applicationAvailable': applicationAvailable,
        ...Object.fromEntries(Object.entries(weight).map(([name, value]) => [`reference.coolingRefinement.weight.${name}`, value])),
    };
}

function parseReceipt(value) {
    if(typeof value !== 'string') return null;
    try {const parsed = JSON.parse(value); return record(parsed) ? parsed : null;} catch {return null;}
}

function validateReceipt(receipt, state) {
    const fields = ['schema', 'result', 'commandId', 'cause', 'acceptedAt', 'acceptedSequence', 'calendarMinute', 'quietWindowOpen',
        'quietWindowRemaining', 'prepared', 'preparedByFocus', 'retryCountBefore', 'baseProbability', 'successProbability', 'roll', 'outcomeId'];
    check(receipt?.schema === 1 && same(Object.keys(receipt).sort(), fields.sort()) && receipt.result && ['success', 'failure'].includes(receipt.result) &&
        REFINE_SET.has(receipt.commandId) &&
        natural(receipt.acceptedAt) && receipt.acceptedAt <= state.clock && natural(receipt.acceptedSequence) && receipt.acceptedSequence <= state.sequence &&
        natural(receipt.calendarMinute) && typeof receipt.quietWindowOpen === 'boolean' && natural(receipt.quietWindowRemaining) && receipt.quietWindowRemaining <= 120 &&
        typeof receipt.prepared === 'boolean' && typeof receipt.preparedByFocus === 'boolean' && natural(receipt.retryCountBefore) &&
        Number.isFinite(receipt.baseProbability) && receipt.baseProbability >= 0.5 && receipt.baseProbability <= 0.7 &&
        Number.isFinite(receipt.successProbability) && receipt.successProbability >= receipt.baseProbability && receipt.successProbability <= 0.85 &&
        Number.isFinite(receipt.roll) && receipt.roll >= 0 && receipt.roll < 1 &&
        ['success_prepared', 'success_ordinary', 'failure_prepared', 'failure_ordinary'].includes(receipt.outcomeId) &&
        typeof receipt.cause === 'string' && /^simulation:[1-9][0-9]*$/.test(receipt.cause),
        'Invalid frozen cooling-refinement outcome receipt.');
    check(receipt.prepared === (receipt.quietWindowOpen || receipt.preparedByFocus), 'Cooling-refinement preparation differs from its accepted snapshot.');
    const phase = receipt.calendarMinute % WINDOW.period;
    const expectedOpen = phase >= WINDOW.opens && phase < WINDOW.closes;
    check(receipt.quietWindowOpen === expectedOpen && receipt.quietWindowRemaining === (expectedOpen ? WINDOW.closes - phase : 0),
        'Cooling-refinement quiet-window receipt differs from the saved Village calendar.');
    check(receipt.result === (receipt.outcomeId.startsWith('success_') ? 'success' : 'failure'), 'Cooling-refinement result differs from its frozen outcome.');
    check(receipt.prepared === receipt.outcomeId.endsWith('_prepared'), 'Cooling-refinement preparation differs from its frozen outcome.');
    check(receipt.commandId === (receipt.retryCountBefore === 0 ? REFINE_IDS[0] : receipt.retryCountBefore === 1 ? REFINE_IDS[1] :
        receipt.retryCountBefore === 2 ? REFINE_IDS[2] : REFINE_IDS[3]), 'Cooling-refinement command does not match its actual completed retry history.');
    check(receipt.baseProbability === (receipt.prepared ? 0.70 : 0.50) &&
        receipt.successProbability === receipt.baseProbability + Math.min(receipt.retryCountBefore, 3) * 0.05 &&
        (receipt.roll < receipt.successProbability) === (receipt.result === 'success'),
        'Cooling-refinement probability differs from its frozen attempt quote.');
    check(Number(receipt.cause.slice(11)) === receipt.acceptedSequence, 'Cooling-refinement cause differs from its frozen acceptance sequence.');
}

export function validateCoolingRefinement(state, registry) {
    const facts = ownFacts(state), completed = ownDone(state), s = state.simulation;
    const actors = Object.entries(state.actors || {});
    const foreignFacts = actors.flatMap(([actor, value]) => Object.keys(value.facts || {}).filter(key => key.startsWith(PREFIX) && actor !== 'player'));
    const foreignDone = actors.flatMap(([actor, value]) => Object.keys(value.completed || {}).filter(key =>
        (key.startsWith('reference_gameplay.refine_') || key === 'reference_gameplay.steady_hook') && actor !== 'player'));
    const foreignKnowledge = Object.entries(s?.knowledge || {}).flatMap(([actor, entries]) =>
        Object.keys(entries || {}).filter(key => key.startsWith(PREFIX) && actor !== 'player'));
    const saved = Object.entries(facts).filter(([key]) => key.startsWith(PREFIX));
    const done = Object.entries(completed).filter(([key]) => key.startsWith('reference_gameplay.refine_') || key === 'reference_gameplay.steady_hook');
    const pending = (s?.jobs || []).filter(job => job.commandId?.startsWith('reference_gameplay.refine_') || job.group === 'cooling_refinement');
    const extraPending = (state.pending || []).filter(job => job.commandId?.startsWith('reference_gameplay.refine_') || job.group === 'cooling_refinement');
    const soreness = s?.conditions?.player?.['body.sore_hands'];
    const knowledge = s?.knowledge?.player || {};
    const coolingKnowledge = Object.entries(knowledge).filter(([key]) => key.startsWith(PREFIX));
    const programs = Object.values(s?.programs || {}).filter(program => COMPLETION_KEYS.has(program.commandId));
    const allJobs = (s?.jobs || []).filter(job => job.group === 'cooling_refinement' || job.commandId?.startsWith('reference_gameplay.refine_'));
    if(!saved.length && !done.length && !allJobs.length && !coolingKnowledge.length && !programs.length && !extraPending.length) return;
    check(!foreignFacts.length && !foreignDone.length && !foreignKnowledge.length, 'Cooling-refinement receipts belong only to the actual player.');
    check(!programs.length && !extraPending.length, 'Cooling refinement admits neither automation nor a parallel pending command.');
    check(state.referenceGameplay?.schema === 1 && state.referenceGameplay.workshop?.schema === 1,
        'Cooling-refinement state requires the actual optional measured-cooling workshop.');
    const countKey = `${PREFIX}failedAttempts`, appKey = `${PREFIX}applicationAvailable`, lastKey = `${PREFIX}lastAttempt`;
    check(facts[countKey] == null || natural(facts[countKey]), 'Invalid completed cooling-refinement failure count.');
    check(facts[appKey] == null || typeof facts[appKey] === 'boolean', 'Invalid steadied-hook application state.');
    check(saved.every(([key]) => FACT_KEYS.has(key)), 'Unknown cooling-refinement actor fact.');
    check(done.every(([key, value]) => COMPLETION_KEYS.has(key) && natural(value)),
        'Invalid cooling-refinement completion counter.');
    check(coolingKnowledge.every(([key]) => KNOWLEDGE_KEYS.has(key)), 'Unknown cooling-refinement knowledge key.');
    if(registry) for(const [id, definition] of Object.entries(COOLING_REFINEMENT_DEFINITION_MAP)) {
        check(same(registry.simulation.commands.get(id), definition), `Cooling-refinement command ${id} differs from its frozen local definition.`);
    }
    if(registry) check(registry.simulation.conditions.get('body.sore_hands')?.stacking === 'max',
        'Cooling failure must reuse the existing max-stacking body soreness condition.');
    if(facts[lastKey] != null) {
        const receipt = parseReceipt(facts[lastKey]); validateReceipt(receipt, state);
        const expectedFailures = receipt.result === 'failure' ? receipt.retryCountBefore + 1 : receipt.retryCountBefore;
        check(facts[countKey] === expectedFailures, 'Cooling-refinement history does not match its last paid result.');
        check(completed[receipt.commandId] > 0 && receipt.acceptedSequence > 0 && receipt.acceptedSequence <= state.sequence,
            'A cooling-refinement result lacks its actual completed command.');
        const resultKnowledge = knowledge[`${PREFIX}${receipt.result}`];
        check(resultKnowledge?.stage === 'seen' && resultKnowledge.cause === receipt.cause &&
            resultKnowledge.at === receipt.acceptedAt + 3 && resultKnowledge.basis?.kind === 'observation' &&
            resultKnowledge.basis?.attributedTo === 'player' && resultKnowledge.basis?.situationId === FEATURE_OBJECT_IDS.situation &&
            resultKnowledge.value === coolingRefinementReceiptEffects(receipt).at(-1).value,
            'A completed cooling-refinement receipt has no matching attributed result record.');
    } else {
        check(!saved.length && !done.length && !coolingKnowledge.length && allJobs.every(job => pending.includes(job)),
            'Cooling-refinement facts, outcomes or jobs lack their accepted receipt.');
    }
    if(facts[appKey] === true) {
        const receipt = parseReceipt(facts[lastKey]);
        check(receipt?.result === 'success' && knowledge[`${PREFIX}success`]?.cause === receipt.cause &&
            knowledge[`${PREFIX}success`]?.basis?.attributedTo === 'player',
            'The steadied-hook application lacks its attributed successful paid refinement.');
    }
    if(knowledge[`${PREFIX}success`]) check(facts[appKey] !== undefined,
        'A successful refinement receipt has no current application availability state.');
    if(knowledge[`${PREFIX}success`]) check(REFINE_IDS.some(id => completed[id] > 0),
        'An attributed cooling success has no completed paid refinement.');
    if(knowledge[`${PREFIX}failure`]) check((facts[countKey] || 0) > 0,
        'An attributed cooling failure has no completed retry history.');
    if(facts[appKey] === false) check(knowledge[`${PREFIX}success`] && completed['reference_gameplay.steady_hook'] > 0 &&
        knowledge[`${PREFIX}steady_hook`]?.basis?.attributedTo === 'player',
        'A consumed steadied-hook application lacks a completed attributed use.');
    if(completed['reference_gameplay.steady_hook'] > 0) check(knowledge[`${PREFIX}steady_hook`]?.cause && facts[appKey] !== undefined,
        'A steadied-hook use is orphaned from its application state.');
    if(knowledge[`${PREFIX}steady_hook`]) check(completed['reference_gameplay.steady_hook'] > 0,
        'A steadied-hook account has no completed application.');
    check(coolingKnowledge.every(([, entry]) => entry?.stage === 'seen' && natural(entry.at) && entry.at <= state.clock &&
        same(Object.keys(entry).sort(), ['stage', 'value', 'at', 'cause', 'basis'].sort()) && typeof entry.value === 'string' &&
        typeof entry.cause === 'string' && /^simulation:[1-9][0-9]*$/.test(entry.cause) &&
        same(entry.basis, {kind: 'observation', attributedTo: 'player', situationId: FEATURE_OBJECT_IDS.situation})),
        'Invalid attributed cooling-refinement knowledge receipt.');
    const activeFailure = facts[lastKey] == null ? null : parseReceipt(facts[lastKey]);
    if(soreness && activeFailure?.result === 'failure' && soreness.cause === activeFailure.cause) {
        check(soreness.intensity === 1 && soreness.expiresAt === activeFailure.acceptedAt + 8,
            'A completed cooling failure lost its exact five-minute body-soreness expiry.');
    }
    for(const job of pending) {
        const d = COOLING_REFINEMENT_DEFINITION_MAP[job.commandId];
        check(d && (!registry || same(registry.simulation.commands.get(job.commandId), d)) && d.group === 'cooling_refinement' &&
            job.actorId === 'player' && job.targetId === null && job.commandId === d.id && job.revision === d.revision &&
            job.id === `simulation:${job.sequence}` && natural(job.sequence) && job.sequence > 0 && job.sequence <= state.sequence &&
            natural(job.due) && job.due >= state.clock && job.cancellation === d.cancellation && job.label === d.label &&
            job.siteId === d.siteId && job.claim === null && job.reservationReturns === 1 && same(job.costs, d.costs) &&
            same(job.participants, ['player']) && same(job.context, {actorId: 'player', targetId: null, partyIds: s.party}) &&
            same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: false, location: 'Village', failure: 'refund'}) &&
            Number.isFinite(job.roll) && job.roll >= 0 && job.roll < 1 && d.outcomes.some(outcome => outcome.id === job.outcomeId),
            'An active cooling-refinement job differs from its local saved-job contract.');
        const effect = job.effects.find(effect => effect.type === 'fact' && effect.key === lastKey);
        const receipt = parseReceipt(effect?.value); validateReceipt(receipt, state);
        check(receipt.retryCountBefore === (facts[countKey] ?? 0), 'An active cooling-refinement job changed its accepted retry count.');
        check(receipt.cause === job.id && receipt.commandId === job.commandId && receipt.outcomeId === job.outcomeId && receipt.roll === job.roll &&
            receipt.acceptedAt + d.duration === job.due && receipt.acceptedSequence === job.sequence && job.due >= state.clock &&
            same(job.effects, coolingRefinementReceiptEffects(receipt)) && s.sites?.[d.siteId]?.reservations?.[job.id] === 'player',
            'An active cooling-refinement job changed its accepted roll or descriptor.');
    }
}

// Earlier pending jobs froze a misspelled situation ID and could not settle.
// On load, repair only that descriptor. All costs, RNG, receipts and due times
// remain frozen and the normal validator still rejects any other tampering.
export function migrateCoolingRefinementSituation(state) {
    if(!state.simulation?.situations?.[FEATURE_OBJECT_IDS.situation]) return state;
    const repair = entry => {
        if(entry?.basis?.kind === 'observation' && entry.basis.attributedTo === 'player' &&
            entry.basis.situationId === 'feature_objects.joint') entry.basis.situationId = FEATURE_OBJECT_IDS.situation;
    };
    for(const job of state.simulation.jobs || []) {
        if(!REFINE_SET.has(job.commandId) || job.actorId !== 'player') continue;
        for(const effect of job.effects || []) {
            if(effect.type === 'knowledge' && KNOWLEDGE_KEYS.has(effect.key) && effect.actor === 'player') repair(effect);
        }
    }
    for(const [key, entry] of Object.entries(state.simulation.knowledge?.player || {})) if(KNOWLEDGE_KEYS.has(key)) repair(entry);
    return state;
}
