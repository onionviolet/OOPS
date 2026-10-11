// Caller publishes the existing returned staged native plan exactly once.
import {STEAM_BOH_IDS as I} from './steam_boh_content.js';
import {steamBOHFacts, validateSteamBOHState} from './steam_boh_facts.js';
import {guardSteamBOHAdmission} from './steam_boh_runtime.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

const check = (ok, message) => {if (!ok) throw new Error(message);};
export function steamBOHContext(state, registry, context = {}) {
    return {...context, steamBOHHost: true, facts: {...context.facts, ...steamBOHFacts(state, context, registry)}};
}
export function commitSteamBOHCommand(state, registry, command, context, expectedSequence = state.sequence) {
    check(command.type === I.group && context.actorId === 'player' && expectedSequence === state.sequence &&
        (command.sequence == null || command.sequence === state.sequence), 'This clearance-manual action is stale or unavailable.');
    validateSteamBOHState(state, registry);
    if (command.action === 'cancel') {
        const job = state.simulation?.jobs?.find(j => j.id === command.id && j.actorId === 'player');
        check(job && registry.simulation.commands.get(job.commandId)?.group === I.group, 'Choose the current clearance work job.');
        const out = cancelSimulationJob(state, registry, job.id, steamBOHContext(state, registry, {...context, targetId: job.targetId}), expectedSequence);
        validateSteamBOHState(out.state, registry); return out;
    }
    check(command.action == null, 'Unknown clearance-manual action.');
    const d = registry.simulation.commands.get(command.id);
    check(d?.group === I.group && d.actorId === 'player' && (command.targetId == null || command.targetId === (d.targetId || null)), 'Choose the declared clearance action and participant.');
    const current = steamBOHContext(state, registry, {...context, targetId: d.targetId || null});
    guardSteamBOHAdmission(state, d, current);
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    validateSteamBOHState(out.state, registry); return out;
}
export function steamBOHPresentation(state, registry, context = {}) {
    if (!state.simulation || state.actors?.player?.facts?.['feature_objects.introduced'] !== true) return {visible: false, sections: []};
    const current = steamBOHContext(state, registry, context);
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.group})
        .map(action => ({...action, command: {...action.command, sequence: state.sequence}}));
    const work = featureWorkControls(state, registry, [I.group], current);
    work.actions = work.actions.map(action => ({...action, command: {type: I.group, action: 'cancel', id: action.command.id, sequence: state.sequence}}));
    const records = featureRecordedKnowledge(state, [I.prefix]);
    if (current.facts['steamBOH.fatigued']) records.push({id: `${I.prefix}fatigue_status`,
        text: `The clearance diagrams still blur together. Study fatigue will clear in ${Math.max(0, state.simulation.conditions.player[I.fatigue].expiresAt - state.clock)} game minutes; two minutes of quiet study rest can clear it sooner. The missing comparison is still there to revisit.`});
    if (state.actors.player.facts[I.diagnostic] === false) records.push({id: `${I.prefix}diagnostic_status`, text: 'You have settled the edge-clearance question that stopped your first reading. You remember the failed attempt and are ready to read for the method.'});
    return {visible: actions.length > 0 || !!work.work || records.length > 0, sections: [{id: I.group, label: 'Bench clearance study',
        description: 'Eda’s manual explains a quicker way to fit survey kits. Settle the edge-clearance comparison, learn the method, then keep a copy beside you at the bench.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
