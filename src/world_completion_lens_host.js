// Public host for the separate current-sample service. Root owns shared routing,
// admission, simulation joins, native publication and the rebuilt game.
import {check} from './basics.js';
import {WORLD_COMPLETION_LENS_IDS as I, WORLD_COMPLETION_LENS_POLICY as P, worldCompletionLensCommand} from './world_completion_lens_content.js';
import {worldCompletionLensFacts, worldCompletionLensEnrolled, worldCompletionLensLoan, exactWorldCompletionLensJob,
    validateWorldCompletionLensState} from './world_completion_lens_facts.js';
import {frozenWorldCompletionLensRegistry, recordWorldCompletionLensCommandCommit} from './world_completion_lens_runtime.js';
import {commitSimulationCommand, cancelSimulationJob} from './simulation.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
import {projectFeatureCommands, featureWorkControls, featureRecordedKnowledge} from './feature_expansion_host.js';

export function worldCompletionLensContext(state, context = {}) {
    return {...context, facts: {...context.facts, ...worldCompletionLensFacts(state, context)}};
}
export function commitWorldCompletionLensCommand(state, registry, command, context = {}, sequence = state.sequence) {
    check(context.actorId === 'player' && state.sequence === sequence && (command.sequence == null || command.sequence === sequence), 'This lens request changed. Review its current terms.');
    check(state.simulation, 'Explicitly enter the optional connected home-world record first.');
    validateWorldCompletionLensState(state, registry);
    if(command.action === 'cancel') {
        const job = state.simulation.jobs.find(j => j.id === command.id && j.actorId === 'player');
        check(exactWorldCompletionLensJob(state, job), 'Choose the actual accepted lens job.');
        const out = cancelSimulationJob(state, registry, job.id, worldCompletionLensContext(state, context), sequence);
        validateWorldCompletionLensState(out.state, registry);
        return out;
    }
    check(!command.action, 'Unsupported lens action.');
    const d = worldCompletionLensCommand(command.id), registered = registry.simulation.commands.get(command.id);
    check(d && registered?.group === I.group && registered.revision === P.revision && (!command.targetId || command.targetId === d.targetId), 'Choose the actual admitted lens command and participant.');
    check(command.id === I.open || worldCompletionLensEnrolled(state), 'Hear Vela’s distinct sample-service and return terms first.');
    const current = worldCompletionLensContext(state, {...context, actorId: 'player', targetId: d.targetId || null, worldCompletionLensHost: true, worldCompletionLensPreview: false, worldCompletionLensCommandId: d.id});
    const reasons = artifactEquipmentReasons(d.costs, state, current);
    check(!reasons.length, reasons.join(' '));
    const frozen = frozenWorldCompletionLensRegistry(state, registry);
    const out = commitSimulationCommand(state, frozen, {id: d.id}, current, sequence);
    recordWorldCompletionLensCommandCommit(state, out, d.id, current);
    validateWorldCompletionLensState(out.state, registry);
    return out;
}
export function worldCompletionLensPresentation(state, registry, context = {}) {
    const current = worldCompletionLensContext(state, {...context, worldCompletionLensHost: true, worldCompletionLensPreview: true}), f = state.actors?.player?.facts || {}, enrolled = worldCompletionLensEnrolled(state);
    if(!state.simulation || !current.facts['worldCompletionLens.rootEnrolled'] || !f['artifact_collection.opened']) return {sections: []};
    const location = current.facts.location || state.simulation.people.player.location;
    const here = state.actors.player.worldId === I.world && ['Village', 'Shack'].includes(location);
    const jobs = state.simulation.jobs.filter(j => j.commandId?.startsWith(I.prefix));
    if(!here && !jobs.length) return {sections: []};
    const frozen = frozenWorldCompletionLensRegistry(state, registry);
    let actions = here ? projectFeatureCommands(state, frozen, current, {groups: [I.group], commandType: 'world_completion'}) : [];
    actions = actions.map(a => {
        const d = frozen.simulation.commands.get(a.id), reasons = artifactEquipmentReasons(d?.costs || [], state, {...current, targetId: d?.targetId || null});
        return {...a, eligible: a.eligible && !reasons.length, reasons: [...(a.reasons || []), ...reasons],
            command: {...a.command, sequence: state.sequence}, ...(reasons.length && a.legibility ? {legibility: {...a.legibility, status: 'blocked',
                control: {...a.legibility.control, enabled: false}, blockers: [...(a.legibility.blockers || []), ...reasons.map((text, i) => ({id: `lens-equipment-${i}`, text}))]}} : {})};
    });
    const work = featureWorkControls(state, frozen, [I.group], current);
    const cancels = work.actions.map(a => ({...a, command: {type: 'world_completion', action: 'cancel', id: a.command.id, sequence: state.sequence}}));
    const records = featureRecordedKnowledge(state, [I.prefix]);
    const loan = worldCompletionLensLoan(state);
    if(loan) records.unshift({id: I.prefix + 'obligation', text: `Vela’s same amber prism remains borrowed. ${P.deposit} original coins are in deposit escrow. ${f[I.prefix + 'overdue'] ? 'The agreed return is overdue.' : `${Math.max(0, f[I.prefix + 'loanDue'] - state.clock)} supported home-world minutes remain.`} Exact return refunds the original deposit once.`});
    else if(f[I.prefix + 'returned']) records.unshift({id: I.prefix + 'settled', text: `The exact prism returned and its ${P.deposit}-coin deposit was refunded once.${f[I.prefix + 'overdue'] ? ' The earlier lateness remains recorded.' : ''} Your observed sample measurements remain separate from ownership.`});
    if(enrolled && !current.facts['worldCompletionLens.custodySupported']) records.unshift({id: I.prefix + 'custody_support',
        text: 'Loan use awaits the exact custody-safe native reserve/restore consumer. Owned and owner-operated sample work keep their own availability.'});
    return {sections: [{id: I.group, label: 'A useful lens with a return obligation',
        description: 'Vela keeps her existing finite pieces and earned purse. Buy through her original four-coin offer, pay her for a current sample check, or agree to one exact deposit-backed loan. Current width and alignment support the datum procedure and smaller-material fit.',
        work: work.work, actions: [...actions, ...cancels], records}]};
}
