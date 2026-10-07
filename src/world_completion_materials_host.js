// Public controls delegate to the existing staged simulation/native publisher.
// Root supplies current, qualified P2/P3 facts before calling this leaf.
import {assert, copy} from './simulation_contracts.js';
import {commitSimulationCommand} from './simulation.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';
import {WORLD_COMPLETION_MATERIALS_IDS as I, worldCompletionMaterialsFrozenDefinition} from './world_completion_materials_content.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';
import {worldCompletionMaterialsFacts, worldCompletionMaterialsEnrolled,
    validateWorldCompletionMaterialsState, worldCompletionMaterialsBody, exactWorldCompletionMaterialsJob} from './world_completion_materials_facts.js';

export function worldCompletionMaterialsContext(state, context = {}) {
    return {...context, facts: {...context.facts, ...worldCompletionMaterialsFacts(state, context)}};
}

export function worldCompletionMaterialsRuntimeRegistry(state, registry, context = {}) {
    const candidate = context.worldCompletionMaterialsReservation || state.simulation?.jobs?.find(j => j.commandId === I.coverMeasured);
    const accepted = exactWorldCompletionMaterialsJob(state, candidate, registry, {popped: !!context.worldCompletionMaterialsReservation}) ? candidate : null;
    const key = accepted?.worldCompletionMaterials?.measuredStripKey || context.facts?.['worldCompletion.measuredStripKey'];
    if(!worldCompletionStripStamp(key)) return registry;
    const commands = new Map(registry.simulation.commands), d = commands.get(I.coverMeasured);
    assert(d?.group === I.group, 'Bind only the declared measured crop cover.');
    commands.set(d.id, worldCompletionMaterialsFrozenDefinition(d, key));
    return {...registry, simulation: {...registry.simulation, commands}};
}

export function commitWorldCompletionMaterialsCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(command.sequence == null || command.sequence === expectedSequence, 'This material request changed; review the current terms.');
    assert(worldCompletionMaterialsEnrolled(state) && context.actorId === 'player' && command.type === 'world_completion' &&
        d?.group === I.group && d.actorId === 'player', 'Choose the explicitly enrolled connected material action.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the actual declared crop steward.');
    const current = worldCompletionMaterialsContext(state, {...context, actorId: 'player', targetId: d.targetId || null});
    const bound = worldCompletionMaterialsRuntimeRegistry(state, registry, current);
    const out = commitSimulationCommand(state, bound, {id: d.id}, current, expectedSequence);
    if(d.duration) {
        const job = out.state.simulation.jobs.find(j => j.id === out.commitment?.id && j.commandId === d.id);
        assert(job, 'Material admission must freeze one actual supported job.');
        job.worldCompletionMaterials = {schema: 1, acceptedAt: state.clock, pausedMinutes: 0,
            sampleCause: [I.coverOffcuts, I.coverMeasured].includes(d.id) ? current.facts['worldCompletion.sampleCause'] : null,
            measuredCause: [I.coverOffcuts, I.coverMeasured].includes(d.id) ? current.facts['worldCompletion.measuredCause'] : null,
            measuredStripKey: d.id === I.coverMeasured ? current.facts['worldCompletion.measuredStripKey'] : null,
            bodyId: worldCompletionMaterialsBody(state, current)?.id,
            notchLocation: 'Village', notchSiteId: 'lore.warning.notch'};
        out.commitment = copy(job);
    }
    validateWorldCompletionMaterialsState(out.state, bound);
    return out;
}

export function worldCompletionMaterialsPresentation(state, registry, context = {}) {
    if(!worldCompletionMaterialsEnrolled(state)) return {visible: false, sections: []};
    const current = worldCompletionMaterialsContext(state, context), location = current.facts.location || state.simulation.people.player?.location;
    const bound = worldCompletionMaterialsRuntimeRegistry(state, registry, current);
    const actions = projectFeatureCommands(state, bound, current, {groups: [I.group], commandType: 'world_completion'})
        .filter(a => registry.simulation.commands.get(a.id)?.location === location);
    const work = featureWorkControls(state, bound, [I.group], current);
    const records = featureRecordedKnowledge(state, [I.prefix]);
    // Show current physical support only at a supported inspection. Historical
    // disposal never silently overwrites a later actual clearance in this view.
    if(current.facts['worldCompletionMaterials.notchInspected'] && current.facts['worldCompletionMaterials.notchSupported']) {
        const open = current.facts['worldCompletionMaterials.drainOpen'];
        records.push({id: I.prefix + 'current_notch', at: state.clock, basis: null,
            text: `Current inspected notch: ${open ? 'open' : 'blocked'}. ${state.worlds[I.world].facts[I.prefix + 'afterRain'] === true ? 'Your scrap disposal happened after the single rain boundary; that storm stays settled.' : 'The retained warning and the one rain boundary keep their own actual account.'}`});
    }
    const visible = !!(actions.length || work.work || records.length);
    return {visible, sections: visible ? [{id: I.group, label: 'Timber, drain and the finite herb bed',
        description: 'Trace real trimmed timber into drying, two crop-cover alternatives or a deliberate drain obstruction. The original one-log cover, early harvest and one-herb salvage remain available. Cooking consumes the actual herbs.',
        ...work, actions: [...actions, ...work.actions], records}] : []};
}
