import {NETHACK_FIELDCRAFT_IDS as I} from './nethack_fieldcraft_content.js';
import {nethackFieldcraftFacts, validateNethackFieldcraft} from './nethack_fieldcraft_facts.js';
import {commitSimulationCommand} from './simulation.js';
import {assert} from './simulation_contracts.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';
export function nethackFieldcraftContext(state, registry, context = {}) {
    return {...context, facts: {...context.facts, ...nethackFieldcraftFacts(state, context, registry)}};
}
// Plans through the existing executor only. The shared host remains the sole
// durable publisher; no second native inventory, scheduler or save owner.
export function commitNethackFieldcraftCommand(state, registry, command, context, expectedSequence = state.sequence) {
    const d = registry.simulation.commands.get(command.id);
    assert(d?.group === I.group && d.actorId === 'player' && context.actorId === 'player', 'Unsupported fieldcraft command.');
    assert(!command.targetId || command.targetId === d.targetId, 'Choose the actual declared fieldcraft participant.');
    assert(state.referenceGameplay?.schema === 1 && state.referenceGameplay.workshop?.schema === 1, 'Meet Eda at the enrolled cooling workshop first.');
    const out = commitSimulationCommand(state, registry, {id: d.id}, nethackFieldcraftContext(state, registry, {...context, targetId: d.targetId || null}), expectedSequence);
    if(d.id === I.open) {
        assert(!out.state.referenceGameplay.fieldcraft && out.state.actors.player.completed[I.open] === 1, 'The once-only fieldcraft meeting must actually complete.');
        out.state.referenceGameplay.fieldcraft = {schema: 1, openedAt: out.state.clock, openedSequence: out.state.sequence};
    }
    validateNethackFieldcraft(out.state, registry);
    return out;
}
export function nethackFieldcraftPresentation(state, registry, context = {}) {
    if(state.referenceGameplay?.schema !== 1) return {visible: false, sections: []};
    const current = nethackFieldcraftContext(state, registry, context), f = current.facts;
    const actions = projectFeatureCommands(state, registry, current, {groups: [I.group], commandType: 'nethack_fieldcraft'});
    const work = featureWorkControls(state, registry, [I.group], current);
    if(!f['fieldcraft.opened'] && !actions.length && !work.work) return {visible: false, sections: []};
    const records = featureRecordedKnowledge(state, ['nethack_fieldcraft.']);
    if(f['fieldcraft.opened']) {
        const dog = state.simulation.people[I.dog];
        records.push({id: 'fieldcraft.current_care', text: `Rill: ${f['fieldcraft.dogLessons']}/2 completed scent lessons · ${f['fieldcraft.dogSatiety']}/4 satiety · ${f['fieldcraft.dogStamina']}/4 stamina · ${dog.vitals.health}/10 health. ${f['fieldcraft.dogWilling'] ? 'Willing local workshop practice.' : 'Attention handed back to Eda; practice paused.'} Care changes only with accepted effort and actual feeding.`});
        if(f['fieldcraft.identified']) records.push({id: 'fieldcraft.known_identity', text: 'Identified by your actual bench application: full pale vials contain reed oil. Empty bench vials have no charge. External applications only; Workshop rations alone feed Rill.'});
        const receipt = state.simulation.knowledge.player?.['nethack_fieldcraft.scent'];
        if(receipt && state.actors.player.worldId === I.world && (context.facts?.location || state.simulation.people.player.location) === 'Village') {
            const field = state.simulation.conditions[I.eda]?.[I.scent];
            records.push({id: 'fieldcraft.current_scent', text: field?.expiresAt > state.clock ? `Your applied recess scent: ${field.expiresAt - state.clock} played minutes remain. Retrieval rechecks it at completion.` : 'Your previous recess scent has expired. Manual retrieval remains available without oil or training.'});
        }
    }
    return {visible: true, sections: [{id: 'nethack_fieldcraft', label: 'Eda\'s bench fieldcraft',
        description: 'Identify a substance through useful external bench work, care for a local dog, and recover the same finite pins by hand or trained help.',
        ...work, actions: [...actions, ...work.actions], records}]};
}
