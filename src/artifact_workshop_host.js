import {artifactCollectionView, artifactEquipmentReasons} from './artifact_collection.js';
import {ARTIFACT_WORKSHOP_IDS as I, artifactWorkshopCollection} from './artifact_workshop_content.js';
import {assert} from './simulation_contracts.js';
import {enrollSimulation, commitSimulationCommand, answerSimulationEncounter, withdrawSimulationEncounter, cancelSimulationJob} from './simulation.js';
import {projectFeatureCommands, featureWorkControls, featureEncounterControls, featureRecordedKnowledge} from './feature_expansion_host.js';

// The normal host publishes this plan once. Reads/rendering never enroll the
// service, seed a seller, create pieces or grant apparatus-derived powers.
export function commitArtifactWorkshopCommand(state, registry, command, context, expectedSequence = state.sequence) {
    assert(context.actorId === 'player', 'This local artifact workshop belongs to your current character.');
    assert(state.sequence === expectedSequence, 'This artifact choice changed; review it again.');
    if(command.action === 'cancel') {
        const job = state.simulation?.jobs.find(j => j.id === command.id && j.actorId === 'player');
        assert(registry.simulation.commands.get(job?.commandId)?.group === I.group, 'No accepted artifact work.');
        return cancelSimulationJob(state, registry, job.id, context, expectedSequence);
    }
    if(['response', 'withdraw'].includes(command.action)) {
        const session = state.simulation?.sessions.player;
        assert(session?.definitionId === I.scene && registry.simulation.commands.get(session.commandId)?.group === I.group, 'No current artifact encounter.');
        if(command.action === 'response') {
            const response = session.turns[session.turn]?.responses.find(r => r.id === command.responseId);
            assert(response, 'Unknown artifact response.');
            const reasons = artifactEquipmentReasons(response.costs, state, {...context, targetId: I.maker});
            assert(!reasons.length, reasons.join(' '));
        }
        return command.action === 'response' ? answerSimulationEncounter(state, registry, command.responseId, {...context, targetId: I.maker}, expectedSequence)
            : withdrawSimulationEncounter(state, context, expectedSequence);
    }
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === I.group && d.actorId === 'player', 'Unsupported artifact collection action.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the actual declared artifact participant.');
    const reasons = artifactEquipmentReasons(d.costs, state, {...context, targetId: d.targetId || null});
    assert(!reasons.length, reasons.join(' '));
    let current = state;
    if(!current.simulation) {
        assert(d.id === I.open, 'Meet the instrument maker first.');
        current = enrollSimulation(current, registry, context, expectedSequence).state;
    }
    return commitSimulationCommand(current, registry, {id: d.id}, {...context, targetId: d.targetId || null}, current.sequence);
}

export function artifactWorkshopPresentation(state, registry, context = {}) {
    const here = state.actors?.player?.worldId === I.world && (context.facts?.location || state.simulation?.people.player?.location) === 'Village';
    const opened = state.actors?.player?.facts?.['artifact_collection.opened'] === true;
    if(!opened && (!here || !context.facts?.['village.craftsmanMet'])) return {visible: false, sections: []};
    const actions = !here ? [] : state.simulation ? projectFeatureCommands(state, registry, context, {groups: [I.group], commandType: 'artifact_collection'}) : [{
        id: I.open, label: 'Ask Vela about her prism collection', eligible: here && !context.busy, reasons: [],
        description: 'An optional local meeting. Asking commits no purchase or job.', command: {type: 'artifact_collection', id: I.open}}];
    const work = featureWorkControls(state, registry, [I.group], context);
    const encounter = featureEncounterControls(state, registry, context, [I.group]);
    const route = action => {
        const source = action.command.type === 'response'
            ? state.simulation?.sessions.player?.turns[state.simulation.sessions.player.turn]?.responses.find(r => r.id === action.command.responseId)
            : registry.simulation.commands.get(action.command.id);
        const extra = action.command.type === 'cancel' || action.command.type === 'withdraw' ? []
            : artifactEquipmentReasons(source?.costs, state, {...context, targetId: I.maker});
        return {...action, eligible: action.eligible && !extra.length, reasons: [...(action.reasons || []), ...extra],
            ...(extra.length && action.legibility ? {legibility: {...action.legibility, status: 'blocked',
                control: {...action.legibility.control, enabled: false},
                blockers: [...(action.legibility.blockers || []), ...extra.map((text, i) => ({id: `artifact-equipment-${i}`, text}))]}} : {}),
            command: {...action.command, type: 'artifact_collection',
                ...(action.command.type === 'artifact_collection' ? {} : {action: action.command.type})}};
    };
    const inventory = context.gameplay?.player?.inventory || {};
    const carried = artifactCollectionView(artifactWorkshopCollection, inventory).filter(d => d.carried > 0);
    const records = opened ? featureRecordedKnowledge(state, ['artifact_collection.']) : [];
    if(opened && carried.length) records.push({id: 'artifact_collection.carried', text: `Carried now: ${carried.map(d => `${d.carried} ${d.label}`).join(', ')}.`});
    return {visible: true, sections: [{id: I.group, label: 'Vela\'s prism collection',
        description: 'Useful loose pieces, exact partial assemblies and a paired local projection. Apparatus functions require the actual carried item; remembered observations remain separate.',
        work: [work.work, encounter?.work || ''].filter(Boolean).join(' '),
        actions: (encounter ? encounter.actions : [...actions, ...work.actions]).map(route), records}]};
}
