// Player controls and public attributed accounts. Every action uses the
// incumbent staged executor and the root’s single durable publication.
import {assert} from './simulation_contracts.js';
import {commitSimulationCommand} from './simulation.js';
import {WORLD_COMPLETION_LEARNING_IDS as I, worldCompletionLearningDefinitions as D} from './world_completion_learning_content.js';
import {worldCompletionLearningFacts, worldCompletionLearningEnrolled, validateWorldCompletionLearningState, decodeWorldCompletionLearningRecord} from './world_completion_learning_facts.js';
import {installWorldCompletionLearningControllers, frozenWorldCompletionLearningRegistry} from './world_completion_learning_runtime.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

const P = I.prefix;
export function worldCompletionLearningContext(state, context = {}) {
    return {...context, facts: {...context.facts, ...worldCompletionLearningFacts(state, context)}};
}
export function commitWorldCompletionLearningCommand(state, registry, command, context = {}, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === I.group && d.actorId === 'player' && context.actorId === 'player', 'Choose a declared player datum action; Neri owns her own agenda.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the exact declared datum participant.');
    assert(!Object.hasOwn(command, 'sequence') || command.sequence === expectedSequence, 'This datum quote is stale.');
    const current = worldCompletionLearningContext(state, {...context, targetId: d.targetId || null});
    const frozen = frozenWorldCompletionLearningRegistry(state, registry);
    const out = commitSimulationCommand(state, frozen, {id: d.id}, current, expectedSequence);
    installWorldCompletionLearningControllers(out.state, registry);
    validateWorldCompletionLearningState(out.state, registry);
    return out;
}
export function worldCompletionLearningPresentation(state, registry, context = {}) {
    if(state.simulation?.schema < 5 || !state.actors?.player?.facts?.['world.completion.enrolled']) return {visible: false, sections: []};
    const current = worldCompletionLearningContext(state, context), frozen = frozenWorldCompletionLearningRegistry(state, registry), actions = projectFeatureCommands(state, frozen, current,
        {groups: [I.group], commandType: 'world_completion'}), work = featureWorkControls(state, frozen, [I.group], current);
    for(const action of actions) action.command = {...action.command, sequence: state.sequence};
    const cancels = work.actions.map(action => ({...action, command: {type: 'world_completion', action: 'cancel', id: action.command.id, sequence: state.sequence}}));
    const records = featureRecordedKnowledge(state, [P]).filter(r=>!r.id.startsWith(P+"product."));
    // A report requires an actual contact action. Merely rendering controls
    // never publishes Neri’s privately recorded decision, body or purse.
    const report = state.simulation?.knowledge?.player?.[P + 'account'];
    const here = context.facts?.location || state.simulation?.people?.player?.location;
    if(report && current.facts['worldCompletionLearning.neriContact'] && state.simulation.people[I.neri].location === here) {
        const labels = {pending: 'The offered lesson awaits Neri’s answer.', accepted: 'Neri accepted; the actual travel and lesson remain separate.',
            refused: 'Neri declined this offer. The new unchanged offcut and unearned coins can be withdrawn.', learned: 'Neri learned the procedure. Separate material work has not produced a strip yet.',
            made: 'Neri made her measured strip and still owns it. A separate handover is available.', collected: 'Neri handed over her actual produced strip.', withdrawn: 'The unperformed new escrow was withdrawn.'};
        const received = decodeWorldCompletionLearningRecord(state.actors.player.facts[P + 'publicAccount']);
        if(received && received.response !== 'unoffered') records.push({id: P + 'public_response', text: labels[received.response] + (received.released ? ' This new commitment was separately released.' : ''), at: received.at, basis: {...report.basis}});
    }
    const visible = actions.length || work.work || records.length || worldCompletionLearningEnrolled(state);
    return {visible: !!visible, sections: visible ? [{id: I.group, label: 'A taught procedure, useful material',
        description: 'Learn personally, sponsor Neri’s finite willing work, or keep the ordinary larger-material route. Instruction supplies a method; separate work supplies its physical product.',
        ...work, actions: [...actions, ...cancels], records}] : []};
}
export function worldCompletionLearningPublicCommandIds() {return Object.freeze(D.commands.filter(d => d.actorId === 'player').map(d => d.id));}
