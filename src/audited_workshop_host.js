// These optional local actions use the same executor and durable publisher as
// Eda's existing work. The host only binds current context and known controls.
import {commitSimulationCommand} from './simulation.js';
import {assert} from './simulation_contracts.js';
import {referenceGameplayContext} from './reference_gameplay_host.js';
import {auditedWorkshopFacts, validateAuditedWorkshop} from './audited_workshop_facts.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

export const AUDITED_WORKSHOP_GROUPS = Object.freeze(['audit_fixture', 'audit_lesson']);

export function auditedWorkshopContext(state, registry, context = {}) {
    const current = referenceGameplayContext(state, registry, context);
    return {...current, facts: {...current.facts, ...auditedWorkshopFacts(state, current, registry)}};
}

export function commitAuditedWorkshopCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const definition = registry.simulation.commands.get(command.id);
    assert(definition?.actorId === 'player' && AUDITED_WORKSHOP_GROUPS.includes(definition.group) && context.actorId === 'player', 'Choose a known local workshop action.');
    assert(!command.targetId || command.targetId === definition.targetId, 'The workshop participant changed.');
    assert(state.referenceGameplay?.schema === 1, 'Enroll the optional reference gameplay before this workshop action.');
    if(definition.group === 'audit_lesson') assert(state.referenceGameplay.workshop?.schema === 1, 'Hear Eda’s cooling offer before choosing the focused lesson or sleeve.');
    const current = auditedWorkshopContext(state, registry, {...context, targetId: definition.targetId || null});
    const out = commitSimulationCommand(state, registry, {id: definition.id}, current, expectedSequence);
    validateAuditedWorkshop(out.state, registry);
    return out;
}

export function auditedWorkshopPresentation(state, registry, context = {}) {
    if(state.referenceGameplay?.schema !== 1) return {visible: false, sections: []};
    const current = auditedWorkshopContext(state, registry, context), sections = [];
    for(const [group, label, description, prefix] of [
        ['audit_fixture', 'Eda’s clamping frame', 'Build a retained local fixture, then bind sap and sound staves into kits without a sleeve charge.', 'audit_fixture.'],
        ['audit_lesson', 'Eda’s earned workshop choice', 'A completed repair and funded order earn one choice: a focused application lesson or one actual stocked sleeve.', 'audit_lesson.'],
    ]) {
        const actions = projectFeatureCommands(state, registry, current, {groups: [group], commandType: 'audit_workshop'});
        const work = featureWorkControls(state, registry, [group], current);
        const records = featureRecordedKnowledge(state, [prefix]);
        if(actions.length || work.work || records.length) sections.push({id: group, label, description, ...work, actions: [...actions, ...work.actions], records});
    }
    return {visible: sections.length > 0, sections};
}
