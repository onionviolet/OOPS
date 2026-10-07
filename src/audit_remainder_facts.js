import {auditRemainderFacts, validateAuditRemainder} from './audit_remainder_state.js';
import {remainderLivelihoodFacts, validateRemainderLivelihood} from './audit_remainder_livelihood_facts.js';
import {remainderHomeFacts, validateRemainderHome} from './audit_remainder_home_facts.js';
import {remainderOffersFacts, validateRemainderOffers} from './audit_remainder_offers_state.js';
import {remainderConsequencesFacts, validateRemainderConsequences} from './audit_remainder_consequences_facts.js';
import {remainderCombatFitFacts, validateRemainderCombatFit} from './audit_remainder_combat_fit_facts.js';
import {remainderCombatObjectivesFacts} from './audit_remainder_combat_objectives_content.js';
import {validateRemainderCombatObjectives, validateRemainderCombatObjectivesNative} from './audit_remainder_combat_objectives_state.js';

const projections = [remainderLivelihoodFacts, remainderHomeFacts, remainderOffersFacts,
    remainderConsequencesFacts, remainderCombatFitFacts, remainderCombatObjectivesFacts];
export function auditRemainderCombinedFacts(state, context = {}, registry) {
    const facts = auditRemainderFacts(state);
    for(const project of projections) {
        const projected = project(state, {...context, facts: {...context.facts, ...facts}}, registry);
        delete projected['auditRemainder.enrolled']; // Root receipt alone owns this admission fact.
        Object.assign(facts, projected);
    }
    return facts;
}
export function validateAuditRemainderProjects(state, registry) {
    validateAuditRemainder(state);
    for(const validate of [validateRemainderLivelihood, validateRemainderHome, validateRemainderOffers,
        validateRemainderConsequences, validateRemainderCombatFit, validateRemainderCombatObjectives]) validate(state, registry);
}
export function validateAuditRemainderNative(state, gameplay) {
    validateRemainderCombatObjectivesNative(state, gameplay);
}
