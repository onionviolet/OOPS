// The caller publishes this ordinary staged plan once through persistExpansion.
import {GAME_ABSORPTION_ASSAY_IDS as I} from './game_absorption_assay_content.js';
import {gameAbsorptionAssayFacts, gameAbsorptionAssayCandidates, freezeGameAbsorptionAssayEffects,
    validateGameAbsorptionAssay} from './game_absorption_assay_facts.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {assert} from './simulation_contracts.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

export function gameAbsorptionAssayContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...gameAbsorptionAssayFacts(state, context, registry)}};
}
export function commitGameAbsorptionAssayCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === I.group && d.actorId === 'player' && context.actorId === 'player', 'Choose a known external bench action.');
    assert(command.targetId == null || command.targetId === d.targetId, 'The declared batch participant changed.');
    assert(state.referenceGameplay?.schema === 1 && state.referenceGameplay.fieldcraft?.schema === 1, 'Meet Eda at the existing fieldcraft workshop first.');
    const current = gameAbsorptionAssayContext(state, registry, {...context, targetId: d.targetId || null});
    // Capture the actual prior control before this one-minute job is accepted.
    // Its supported output is frozen into the same standard knowledge owner.
    const effects = command.id === I.compare ? freezeGameAbsorptionAssayEffects(state, command.id) : null;
    const out = commitSimulationCommand(state, registry, {id: d.id}, current, expectedSequence);
    if(effects) {
        const job = out.state.simulation.jobs.find(j => j.id === out.commitment?.id && j.commandId === I.compare);
        assert(job && job.sequence === out.state.sequence, 'The comparison must retain its actual newly accepted job.');
        job.effects = effects;
        out.commitment = structuredClone(job);
    }
    validateGameAbsorptionAssay(out.state, registry, out);
    return out;
}
export function cancelGameAbsorptionAssayJob(state, registry, jobId, context, expectedSequence = state.sequence) {
    const job = state.simulation?.jobs.find(j => j.id === jobId && j.actorId === 'player');
    assert(job && registry.simulation.commands.get(job.commandId)?.group === I.group, 'That bench job is unavailable.');
    const out = cancelSimulationJob(state, registry, jobId,
        gameAbsorptionAssayContext(state, registry, {...context, targetId: job.targetId}), expectedSequence);
    validateGameAbsorptionAssay(out.state, registry, out);
    return out;
}
export function gameAbsorptionAssayPresentation(state, registry, context = {}) {
    if(state.referenceGameplay?.schema !== 1 || state.referenceGameplay.fieldcraft?.schema !== 1) return {visible: false, sections: []};
    const current = gameAbsorptionAssayContext(state, registry, context), f = current.facts;
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: I.commandType});
    const work = featureWorkControls(state, registry, [I.group], current);
    // Structured provenance is validated and used, never rendered as JSON or
    // presented as another observation by an actor who did not acquire it.
    const records = featureRecordedKnowledge(state, [I.prefix]).filter(r => r.id !== `${I.prefix}control`);
    if(f['absorption.assay.opened']) {
        const candidates = gameAbsorptionAssayCandidates(state);
        records.push({id: `${I.prefix}supported_candidates`, text: f['absorption.assay.identified']
            ? 'Recorded identity: gum wash. Full vials retain one wash charge each; empty vials remain empty.'
            : candidates.length === 1 ? 'Your acquired evidence leaves gum wash as the only supported candidate. The separate one-minute comparison records that deduction.'
                : 'Supported candidates: reed oil or gum wash. Appearance and purchase do not distinguish them.'});
        if(f['absorption.assay.negativeObserved'] && !f['absorption.assay.identified']) records.push({id: `${I.prefix}evidence_status`,
            text: f['absorption.assay.controlKnown'] ? 'The failed edge trial and your own reed-oil evidence are both available for comparison.'
                : 'The failed edge trial remains inconclusive. The existing pale-oil assay or useful sharpening trial can supply the missing independent control.'});
    }
    return {visible: actions.length > 0 || !!work.work || records.length > 0, sections: [{id: I.group,
        label: 'Eda\'s clouded batch', description: 'Compare acquired evidence, test a finite charge, clean a real pin, or use the ordinary knife-spine route.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
