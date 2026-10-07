// One optional project router. Each lane retains its actual executor/actor/
// stock/receipt contract; the existing application remains the only publisher.
import {assert} from './simulation_contracts.js';
import {commitSimulationCommand, simulationFacts} from './simulation.js';
import {referenceGameplayContext} from './reference_gameplay_host.js';
import {AUDIT_REMAINDER_ENROLL, stageAuditRemainderEnrollment} from './audit_remainder_state.js';
import {auditRemainderCombinedFacts, validateAuditRemainderProjects} from './audit_remainder_facts.js';
import {commitRemainderLivelihoodCommand, remainderLivelihoodPresentation} from './audit_remainder_livelihood_host.js';
import {commitRemainderHomeCommand, remainderHomePresentation} from './audit_remainder_home_host.js';
import {commitRemainderOffersCommand, remainderOffersPresentation} from './audit_remainder_offers_host.js';
import {commitRemainderConsequencesCommand, remainderConsequencesPresentation} from './audit_remainder_consequences_host.js';
import {commitRemainderCombatFitCommand, remainderCombatFitPresentation} from './audit_remainder_combat_fit_host.js';
import {commitRemainderCombatObjectivesCommand, remainderCombatObjectivesPresentation} from './audit_remainder_combat_objectives_host.js';
import {projectFeatureCommands, featureCostText} from './feature_expansion_host.js';

export const AUDIT_REMAINDER_GROUPS = Object.freeze(['remainder_livelihood', 'remainder_home', 'remainder_offers', 'remainder_consequences', 'remainder_combat_fit', 'remainder_combat_objectives']);
const lanes = [
    ['remainder_livelihood', commitRemainderLivelihoodCommand, remainderLivelihoodPresentation],
    ['remainder_home', commitRemainderHomeCommand, remainderHomePresentation],
    ['remainder_offers', commitRemainderOffersCommand, remainderOffersPresentation],
    ['remainder_consequences', commitRemainderConsequencesCommand, remainderConsequencesPresentation],
    ['remainder_combat_fit', commitRemainderCombatFitCommand, remainderCombatFitPresentation],
    ['remainder_combat_objectives', commitRemainderCombatObjectivesCommand, remainderCombatObjectivesPresentation],
];
export function auditRemainderContext(state, registry, context = {}) {
    const current = referenceGameplayContext(state, registry, context);
    const calendar = context.remainderLivelihoodClock || (Number.isSafeInteger(context.facts?.calendarMinute) ? {calendarMinute: context.facts.calendarMinute, clock: state.clock} : null);
    const joined = {...current, ...(calendar ? {remainderLivelihoodClock: calendar} : {})};
    return {...joined, facts: {...joined.facts, ...auditRemainderCombinedFacts(state, joined, registry)}};
}
export function commitAuditRemainderCommand(state, registry, command, context, sequence = state.sequence) {
    assert(context.actorId === 'player' && sequence === state.sequence, 'This local project request is stale.');
    const current = auditRemainderContext(state, registry, context);
    if(command.id === AUDIT_REMAINDER_ENROLL) {
        const enrolled = stageAuditRemainderEnrollment(state);
        return commitSimulationCommand(enrolled, registry, {id: command.id}, current, sequence);
    }
    assert(state.schema === 11 && state.auditRemainder?.schema === 1, 'Open the optional local projects first.');
    const request = command.laneCommand || command;
    const definition = registry.simulation.commands.get(request.id);
    const lane = lanes.find(([group]) => definition?.group === group || command.routeGroup === group || request.group === group || request.id?.startsWith(`${group}.`));
    assert(lane, 'Choose a known local project control.');
    return lane[1](state, registry, request, current, sequence);
}
export function auditRemainderPresentation(state, registry, context = {}) {
    if(state.referenceGameplay?.schema !== 1) return {visible: false, sections: []};
    const current = auditRemainderContext(state, registry, context);
    if(!state.auditRemainder) {
        const actions = projectFeatureCommands(state, registry, current, {groups: ['audit_remainder'], commandType: 'audit_remainder'});
        return {visible: actions.length > 0, sections: actions.length ? [{id: 'audit_remainder.enrollment', label: 'Local projects and commissions',
            description: 'Additional work, home, supplies and encounter choices. Each has separate disclosed terms and real costs.', actions, records: []}] : []};
    }
    const sections = [];
    for(const [group, , present] of lanes) {
        const view = present(state, registry, current);
        const supplied = view.sections || (view.visible ? [{id: group, label: view.title || 'Local work', description: view.terms || '',
            actions: [...(view.actions || []), ...(view.duties || []).filter(d => d.cancellation).map(d => ({...d.cancellation, eligible: true, reasons: [], description: d.phase}))],
            records: [...(view.records || []), ...(view.duties || []).map(d => ({id: `duty:${d.id}`, text: `${d.phase}${d.remaining == null ? '' : ` · ${d.remaining} played minutes remain`}`})),
                ...(view.schedule ? [{id: 'work_window', text: view.schedule.text}] : [])]}] : []);
        for(const section of supplied) {
            section.actions = (section.actions || []).map(action => {
                const request = action.command || Object.fromEntries(['id', 'type', 'action', 'targetId', 'cursorId', 'attemptId', 'rosterCause', 'occurrenceCause'].filter(key => action[key] != null).map(key => [key, action[key]]));
                const command = request.type === 'audit_remainder' || request.type === 'cancel_job'
                    ? {type: 'audit_remainder', routeGroup: group, laneCommand: request} : request;
                const terms = action.terms || (action.costs ? `${featureCostText(action.costs)}${action.duration ? ` · ${action.duration} played minutes` : ''}` : '');
                return {...action, command, terms};
            });
            sections.push(section);
        }
    }
    return {visible: sections.length > 0, sections};
}
