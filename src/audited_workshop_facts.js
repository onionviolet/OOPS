// Recomputed from the current staged owners, including at job settlement.
// No inventory, clock, publication, or persisted context is introduced here.
import {auditedFixtureFacts, validateAuditedFixture} from './audited_workshop_fixture.js';
import {auditedLessonFacts, validateAuditedLesson} from './audited_workshop_lesson.js';
import {auditedKitReserveFacts} from './audited_kit_reserve_facts.js';

export function auditedWorkshopFacts(state, context = {}, registry) {
    const fixture = auditedFixtureFacts(state, context, registry);
    const lesson = auditedLessonFacts(state, {...context, facts: {...context.facts, ...fixture}}, registry);
    return {...fixture, ...lesson, ...auditedKitReserveFacts(state, context, context.facts)};
}

export function validateAuditedWorkshop(state, registry) {
    validateAuditedFixture(state, registry);
    validateAuditedLesson(state, registry);
}
