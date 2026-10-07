// Optional native-facing controls. All spends/jobs/progression go through the
// existing staged executor; the root remains the single durable publisher.
import {assert, meets} from './simulation_contracts.js';
import {commitSimulationCommand, advancePowerProgression, simulationFacts} from './simulation.js';
import {referenceGameplayContext} from './reference_gameplay_host.js';
import {REMAINDER_HOME_IDS as I, remainderHomeDefinitions as D} from './audit_remainder_home_content.js';
import {remainderHomeFacts, validateRemainderHome} from './audit_remainder_home_facts.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

export function remainderHomeContext(state, registry, context = {}) {
    const current = referenceGameplayContext(state, registry, context);
    return {...current, facts: {...current.facts, ...remainderHomeFacts(state, current, registry)}};
}
export function commitRemainderHomeCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(state.schema === 11 && state.auditRemainder?.schema === 1, 'Enroll the optional remainder work before choosing a home action.');
    assert(d?.group === I.group && d.actorId === 'player' && context.actorId === 'player', 'Choose a known player home-work action.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the actual declared home-work participant.');
    const current = remainderHomeContext(state, registry, {...context, targetId: d.targetId || null});
    const out = d.advancementId ? advancePowerProgression(state, registry, d.advancementId, current, expectedSequence) :
        commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    validateRemainderHome(out.state, registry);
    return out;
}

export function remainderHomePresentation(state, registry, context = {}) {
    if(state.auditRemainder?.schema !== 1) return {visible: false, sections: []};
    const current = remainderHomeContext(state, registry, context);
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: 'audit_remainder'});
    for(const action of actions) {
        const d = registry.simulation.commands.get(action.id);
        if(!d?.advancementId) continue;
        const a = registry.simulation.advancements.get(d.advancementId);
        const ctx = {...current, targetId: I.eda}, facts = simulationFacts(state, ctx, registry);
        const eligible = meets(a.requires, facts) && meets(d.requires, facts);
        // The visible descriptor quotes exactly the actual advancement costs.
        // Only this host dispatches the choice to advancePowerProgression.
        action.eligible = action.eligible && eligible;
        if(!eligible && !action.reasons.length) action.reasons.push('Earn the recovered ordinary trial and choose only one available local specialization.');
    }
    const work = featureWorkControls(state, registry, [I.group], current), records = featureRecordedKnowledge(state, ['remainder_home.']);
    const choice = state.actors?.player?.facts?.['remainder_home.specialization'];
    if(choice) records.push({id: 'remainder_home.foregone', text: `Chosen local training: ${choice === 'loaded' ? 'loaded survey' : 'delicate fitting'}. Foregone: ${choice === 'loaded' ? 'delicate fitting' : 'loaded survey'}. Ordinary loaded surveying and ordinary jig salvage remain available.`, at: state.clock, basis: null});
    // A player's own funded invitation grants knowledge of Neri's arrival/work
    // status only at an actual supported meeting, without exposing her private
    // purse, body or controller plans as a character sheet.
    const meeting = current.facts['remainderHome.workshopSupported'] && current.facts['remainderHome.residentSupported'];
    if(meeting && state.actors.player.facts['remainder_home.invited']) records.push({id: 'remainder_home.public_residence', at: state.clock, basis: null,
        text: current.facts['remainderHome.residentDone'] ? 'Neri completed her supplied kit-binding service. Collect the agreed actual product once while she is still present.' :
            current.facts['remainderHome.occupied'] ? 'Neri accepted the funded stay and occupies the completed room. Her one supported service is separate from arrival.' : 'Your funded invitation is supplied; Neri has not yet accepted occupancy.'});
    const visible = actions.length || work.work || records.length;
    return {visible: !!visible, sections: visible ? [{id: I.group, label: 'Permitted home & measuring work',
        description: 'One useful local cover, a paid measured salvage chain, one earned training choice and an actually constructed, funded residence.',
        ...work, actions: [...actions, ...work.actions], records}] : []};
}

// The root adds these to its existing scheduler-context join. Neri is a real
// simulation-owned person in the actual Shack and never the player's body.
export function remainderHomeSimulationContexts(state, context = {}) {
    if(!state.simulation?.people?.[I.resident]) return {};
    return {[I.resident]: {...context, actorId: I.resident, targetId: null, busy: false,
        facts: {...context.facts, location: state.simulation.people[I.resident].location}}};
}

export function remainderHomePublicCommandIds(){return Object.freeze(D.commands.filter(d => d.actorId === 'player').map(d => d.id));}
