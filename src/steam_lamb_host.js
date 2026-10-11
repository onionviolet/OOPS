// The existing command scheduler stages the plan; the caller publishes it once.
import {STEAM_LAMB_IDS as I} from './steam_lamb_content.js';
import {steamLambFacts, validateSteamLambState} from './steam_lamb_facts.js';
import {guardSteamLambAdmission} from './steam_lamb_runtime.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands, featureWorkControls} from './feature_expansion_host.js';
const check = (ok, message) => {if (!ok) throw new Error(message);};
export function steamLambContext(state, registry, context = {}) {
    return {...context, steamLambHost: true, facts: {...context.facts, ...steamLambFacts(state, context, registry)}};
}
export function commitSteamLambCommand(state, registry, command, context, expectedSequence = state.sequence) {
    check(command.type === I.group && context.actorId === 'player' && expectedSequence === state.sequence &&
        (command.sequence == null || command.sequence === state.sequence), 'This fitting agreement action is stale or unavailable.');
    validateSteamLambState(state, registry);
    if (command.action === 'cancel') {
        const job = state.simulation?.jobs?.find(j => j.id === command.id && j.actorId === 'player');
        check(job && registry.simulation.commands.get(job.commandId)?.group === I.group, 'Choose the current fitting agreement work.');
        const out = cancelSimulationJob(state, registry, job.id, steamLambContext(state, registry, {...context, targetId: job.targetId}), expectedSequence);
        validateSteamLambState(out.state, registry); return out;
    }
    check(command.action == null, 'Unknown fitting agreement action.');
    const d = registry.simulation.commands.get(command.id);
    check(d?.group === I.group && d.actorId === 'player' && (command.targetId == null || command.targetId === (d.targetId || null)), 'Choose the declared fitting agreement action and participant.');
    const current = steamLambContext(state, registry, {...context, targetId: d.targetId || null});
    guardSteamLambAdmission(state, d, current);
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    validateSteamLambState(out.state, registry); return out;
}
export function steamLambPresentation(state, registry, context = {}) {
    if (!state.simulation || state.actors?.player?.facts?.['feature_objects.introduced'] !== true) return {visible: false, sections: []};
    const current = steamLambContext(state, registry, context);
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.group})
        .map(action => ({...action, command: {...action.command, sequence: state.sequence}}));
    const work = featureWorkControls(state, registry, [I.group], current);
    work.actions = work.actions.map(action => ({...action, command: {type: I.group, action: 'cancel', id: action.command.id, sequence: state.sequence}}));
    if (work.work) {
        const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId.startsWith(I.prefix));
        work.work = job.commandId === I.appoint ? 'You and Eda are agreeing the fitting terms at her bench. Stop to leave the appointment unmade.' :
            job.commandId === I.deliver ? 'Your matched stave and Eda’s three coins are set aside for the handover. Stop to return both without settling the order.' :
                'Eda is checking your matched stave with her own fine guide. Stop to recover the coin, her effort and both unchanged items.';
    }
    const records = Object.entries(state.simulation.knowledge?.player || {}).filter(([id]) => id.startsWith(I.prefix)).map(([id, k]) => ({id, text: k.value}));
    return {visible: actions.length > 0 || !!work.work || records.length > 0, sections: [{id: I.group, label: 'Eda’s fitting agreement',
        description: 'Agree a local assessor appointment after Eda’s demonstration and supervised practice. One paid inspection can approve the kind of stave she needs for one small order.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
