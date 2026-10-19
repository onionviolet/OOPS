// Stage through the existing scheduler; the caller publishes the returned plan.
import {check} from './basics.js';
import {STEAM_ONI_IDS as I, steamONIDefinitions as D} from './steam_oni_content.js';
import {steamONIFacts, validateSteamONIState} from './steam_oni_facts.js';
import {guardSteamONIAdmission} from './steam_oni_runtime.js';
import {enrollSimulation, commitSimulationCommand, cancelSimulationJob, simulationOccupiesActor} from './simulation.js';
import {activePractice} from './techniques.js';
import {projectFeatureCommands, featureWorkControls} from './feature_expansion_host.js';
export function steamONIContext(state, registry, context = {}) {
    return {...context, steamONIHost: true, facts: {...context.facts, ...steamONIFacts(state, context, registry)}};
}
export function commitSteamONICommand(state, registry, command, context, expectedSequence = state.sequence) {
    check(command.type === I.group && context.actorId === 'player' && expectedSequence === state.sequence &&
        (command.sequence == null || command.sequence === state.sequence), 'This nursery action is stale or unavailable.');
    validateSteamONIState(state, registry);
    if (command.action === 'cancel') {
        const job = state.simulation?.jobs?.find(j => j.id === command.id && j.actorId === 'player');
        check(job && registry.simulation.commands.get(job.commandId)?.group === I.group, 'Choose your current nursery work.');
        const out = cancelSimulationJob(state, registry, job.id, steamONIContext(state, registry, {...context, targetId: null}), expectedSequence);
        validateSteamONIState(out.state, registry); return out;
    }
    check(command.action == null && command.targetId == null, 'Choose a declared nursery action for yourself.');
    const d = registry.simulation.commands.get(command.id);
    check(d?.group === I.group && d.actorId === 'player', 'Choose an action from your nursery controls.');
    guardSteamONIAdmission(state, d, steamONIContext(state, registry, {...context, targetId: null}));
    check(state.simulation || d.id === I.begin, 'Consider the nursery plan before beginning work.');
    const first = state.simulation ? {state, ...context} : enrollSimulation(state, registry, context, expectedSequence);
    const live = {...context, external: first.external, gameplay: first.gameplay, vitals: first.vitals || context.vitals, targetId: null};
    const out = commitSimulationCommand(first.state, registry, {id: d.id}, steamONIContext(first.state, registry, live), first.state.sequence);
    out.acquisitions = [...(first.acquisitions || []), ...(out.acquisitions || [])];
    out.unlocks = [...(first.unlocks || []), ...(out.unlocks || [])];
    validateSteamONIState(out.state, registry); return out;
}
export function steamONIPresentation(state, registry, context = {}) {
    const current = steamONIContext(state, registry, context), f = current.facts;
    const local = state.actors?.player?.worldId === I.world && context.facts?.location === 'Shack' && context.facts?.['village.shackUnlocked'] === true;
    if (!local && !f['steamONI.enrolled']) return {visible: false, sections: []};
    let actions;
    if (!state.simulation) {
        const d = D.commands.find(d => d.id === I.begin);
        const eligible = f['steamONI.supported'] && f['steamONI.handsUsable'] && !context.busy &&
            !state.pending?.some(j => j.context?.actorId === 'player') && !activePractice(state.actors.player) && !simulationOccupiesActor(state);
        actions = [{id: d.id, label: d.label, description: d.description, terms: 'A free plan; construction and shoots are separate choices.', eligible,
            reasons: eligible ? [] : ['Recover your hands, finish your current activity and return beneath the Shack roof.'],
            command: {type: I.group, id: d.id, targetId: null, sequence: state.sequence}}];
    } else actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.group})
        .map(action => ({...action, command: {...action.command, sequence: state.sequence}}));
    const work = featureWorkControls(state, registry, [I.group], current);
    work.actions = work.actions.map(action => ({...action, command: {type: I.group, action: 'cancel', id: action.command.id, sequence: state.sequence}}));
    if (work.work) work.work = `You are ${state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId.startsWith(I.prefix)).commandId === I.build ? 'fitting the tray frame' : 'tending the fresh shoots'} beneath the Shack roof. Stop to recover what you set aside for the work.`;
    const records = Object.entries(state.simulation?.knowledge?.player || {}).filter(([id]) => id.startsWith(I.prefix))
        .map(([id, known]) => ({id, text: known.value}));
    return {visible: actions.length > 0 || !!work.work || records.length > 0, sections: [{id: I.group, label: 'Your sheltered nursery',
        description: 'A tray beside the Shack window gives fresh shoots a sheltered start. Each round needs your herbs, sap and care; carry the harvest to the cookfire.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
