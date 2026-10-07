import {worldCompletionLearningControllerAllowed} from './world_completion_learning_runtime.js';
import {lorePracticeControllerAllowed} from './lore_practice_runtime.js';
import {bookCareControllerAllowed} from './book_care_runtime.js';
// Explicit optional reader for the admitted audit remainder. No migration of
// existing characters, second publisher, inventory, or local clock is created.
import {assert, record, natural, copy, jsonData} from './simulation_contracts.js';

export const AUDIT_REMAINDER_ENGINE_SCHEMA = 11;
export const AUDIT_REMAINDER_ENROLL = 'audit_remainder.enroll';
export const AUDIT_REMAINDER_MODULES = Object.freeze(['livelihood', 'home', 'offers', 'consequences', 'combat_fit', 'combat_objectives', 'causal', 'artifacts']);

export const auditRemainderDefinitions = {commands: [{id: AUDIT_REMAINDER_ENROLL, revision: 1,
    label: 'Explore optional local projects and commissions', worldId: 'base.frontier', actorId: 'player', location: 'Village', group: 'audit_remainder', once: true,
    visibleWhen: {all: [{fact: 'actor.feature_objects.introduced', op: 'eq', value: true}, {not: {fact: 'auditRemainder.enrolled', op: 'eq', value: true}}]},
    requires: {all: [{fact: 'reference.workshop.supported', op: 'eq', value: true, reason: 'Return to the Village with your living supported native body and local clock.'},
        {fact: 'reference.workshop.handsUsable', op: 'eq', value: true, reason: 'Recover your usable hands first.'},
        {fact: 'actor.feature_objects.introduced', op: 'eq', value: true}]}, costs: [],
    effects: [{type: 'fact', scope: 'actor', actor: 'player', key: 'audit_remainder.enrolled', value: true},
        {type: 'knowledge', actor: 'player', key: 'audit_remainder.terms', stage: 'understood',
            value: 'You deliberately opened the additional local project and commission choices. Each invitation, construction, lesson, stocked offer, preparation and challenge still needs its own current terms, means and commitment. This reading grants no person, material, power, payment or obligation.'}],
    description: 'Optional. Existing local work stays available. Opening these choices creates no stocked reward or accepted commission.'}]};

export function auditRemainderFacts(state) {
    return {'auditRemainder.enrolled': state.auditRemainder?.schema === 1 && state.auditRemainder.definitionRevision === 1 &&
        state.actors?.player?.facts?.['audit_remainder.enrolled'] === true && state.actors.player.completed[AUDIT_REMAINDER_ENROLL] === 1};
}

export function auditRemainderControllerAllowed(state, definition) {
    if(!worldCompletionLearningControllerAllowed(state,definition)||!bookCareControllerAllowed(state,definition)||!lorePracticeControllerAllowed(state,definition))return false;
    return !/^remainder[_.]/.test(definition.id) || state.schema === 11 && auditRemainderFacts(state)['auditRemainder.enrolled'];
}

export function installAuditRemainderControllers(state, registry) {
    if(!auditRemainderFacts(state)['auditRemainder.enrolled']) return;
    for(const definition of registry.simulation.controllers.values()) {
        if(!/^remainder[_.]/.test(definition.id) || state.simulation.people[definition.actorId]?.life !== 'alive') continue;
        const exists = Object.entries(state.simulation.controllers).some(([id, saved]) => saved.actorId === definition.actorId && (saved.definitionId || id) === definition.id);
        if(!exists) state.simulation.controllers[`${definition.actorId}:${definition.id}`] = {definitionId: definition.id,
            actorId: definition.actorId, due: state.clock + definition.interval, interval: definition.interval};
    }
}

export function stageAuditRemainderEnrollment(state) {
    assert(!state.auditRemainder && state.referenceGameplay?.schema === 1 &&
        ([9, 10].includes(state.schema) || state.schema === AUDIT_REMAINDER_ENGINE_SCHEMA && (state.causalStories?.schema === 1 || state.motherOfLearning?.schema === 1 || state.proto23Village?.schema === 1)),
        'Enroll the existing reference gameplay before opening these optional projects.');
    const next = copy(state);
    next.schema = AUDIT_REMAINDER_ENGINE_SCHEMA;
    next.auditRemainder = {schema: 1, definitionRevision: 1, enrolledAt: state.clock, enrolledSequence: state.sequence + 1, modules: {}};
    return next;
}

export function validateAuditRemainder(state) {
    const value = state.auditRemainder;
    if(value == null) {
        assert(state.actors?.player?.facts?.['audit_remainder.enrolled'] == null &&
            !state.actors?.player?.completed?.[AUDIT_REMAINDER_ENROLL] && !state.simulation?.knowledge?.player?.['audit_remainder.terms'],
            'The optional audit reader is missing. Preserve this save for its matching reader.');
        return;
    }
    jsonData(value);
    assert(state.schema === AUDIT_REMAINDER_ENGINE_SCHEMA && record(value) && value.schema === 1 && value.definitionRevision === 1 &&
        Object.keys(value).every(key => ['schema', 'definitionRevision', 'enrolledAt', 'enrolledSequence', 'modules'].includes(key)) &&
        record(value.modules) && Object.keys(value.modules).every(key => AUDIT_REMAINDER_MODULES.includes(key)), 'Unsupported optional local-project reader.');
    assert(state.referenceGameplay?.schema === 1 && natural(value.enrolledAt) && value.enrolledAt <= state.clock && natural(value.enrolledSequence) &&
        value.enrolledSequence > 0 && value.enrolledSequence <= state.sequence && auditRemainderFacts(state)['auditRemainder.enrolled'], 'Local projects need their actual deliberate enrollment receipt.');
    const receipt = state.simulation?.knowledge?.player?.['audit_remainder.terms'];
    assert(receipt?.stage === 'understood' && receipt.value === auditRemainderDefinitions.commands[0].effects[1].value && receipt.at === value.enrolledAt &&
        receipt.cause === `simulation:${value.enrolledSequence}`, 'Local project enrollment lost its exact initial terms.');
}
