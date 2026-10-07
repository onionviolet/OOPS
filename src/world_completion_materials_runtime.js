// Root runs this at the current popped-job boundary before the single P2 rain
// reducer. Effects stay inside that same staged plan and durable publisher.
import {assert, natural} from './simulation_contracts.js';
import {applySimulationEffects} from './simulation_effects.js';
import {WORLD_COMPLETION_MATERIALS_IDS as I} from './world_completion_materials_content.js';
import {worldCompletionMaterialsEnrolled, worldCompletionMaterialsCaused, exactWorldCompletionMaterialsJob} from './world_completion_materials_facts.js';
import {worldCompletionMaterialsLocalSupported} from './world_completion_materials_facts.js';
import {worldCompletionMaterialsContext} from './world_completion_materials_host.js';

const covers = [I.coverOffcuts, I.coverMeasured];
const worldFact = (key, value) => ({type: 'world', worldId: I.world, key: I.prefix + key, value});
const completed = (state, id) => state.actors?.player?.completed?.[id] || 0;

export function retainWorldCompletionMaterialsWindows(state, from, through, contexts = {}) {
    assert(natural(from) && natural(through) && through >= from, 'Invalid material retention interval.');
    if(!worldCompletionMaterialsEnrolled(state) || through <= from) return;
    // Preserve this lane's already admitted jobs when the local realm/body
    // adapter is unsupported. This shifts their existing deadline, not a second
    // played-time owner. Root retains the existing frost/rain owners separately.
    const supported = worldCompletionMaterialsLocalSupported(state, contexts.player || contexts);
    if(supported) return;
    const delta = through - from;
    for(const j of state.simulation.jobs) if(j.commandId.startsWith(I.prefix)) {
        assert(j.worldCompletionMaterials?.schema === 1 && natural(j.worldCompletionMaterials.pausedMinutes), 'Retain only an admitted new material job.');
        j.due += delta;
        j.worldCompletionMaterials.pausedMinutes += delta;
    }
}

export function reconcileWorldCompletionMaterials(before, out, registry, context = {}, {drainEffects} = {}) {
    if(!worldCompletionMaterialsEnrolled(out.state)) return 0;
    const state = out.state, w = state.worlds[I.world].facts, known = state.simulation.knowledge.player || {};
    const current = worldCompletionMaterialsContext(state, {...context, actorId: 'player', external: out.external,
        gameplay: out.gameplay, vitals: out.vitals, equipment: out.equipment});
    let reconciled = 0;
    for(const id of [...covers, I.discard]) {
        if(!completed(state, id) || completed(before, id) ||
            (id === I.discard ? w[I.prefix + 'drainApplied'] : w[I.prefix + 'coverCause'])) continue;
        const receipt = known[I.prefix + (id === I.discard ? 'disposal' : 'cover')];
        const job = before.simulation?.jobs?.find(j => j.commandId === id && j.id === receipt?.cause);
        assert(job && exactWorldCompletionMaterialsJob(before, job, registry, {popped: true}) &&
            !state.simulation.jobs.some(j => j.id === job.id) && worldCompletionMaterialsCaused(state, receipt) &&
            receipt.cause === job.id && receipt.at === state.clock,
            'Reconcile only the exact actually popped supported material job at this played boundary.');
        const effects = [];
        if(id === I.discard) {
            assert(current.facts['worldCompletionMaterials.notchSupported'] && current.facts['worldCompletionMaterials.notchRight'] &&
                current.facts['worldCompletionMaterials.notchInspected'] && typeof current.facts['worldCompletion.rainOccurred'] === 'boolean',
                'Apply actual disposal only at the current supported inspected drain completion.');
            assert(typeof drainEffects === 'function', 'Root must join disposal to the actual opted-in P2 drain owner before rain settlement.');
            const joined = drainEffects({state, context: current, job, receipt, open: false});
            assert(Array.isArray(joined) && joined.length === 1 && joined[0].type === 'world' && joined[0].worldId === I.world &&
                joined[0].key === 'lore.warning.drainOpen' && joined[0].value === false,
                'The physical drain join must return narrow root-owned world effects, without stock or storm replay.');
            effects.push(...joined, worldFact('drainApplied', true), worldFact('disposalCause', job.id),
                worldFact('afterRain', current.facts['worldCompletion.rainOccurred']));
        } else {
            effects.push(worldFact('coverCause', job.id), worldFact('coverSampleCause', job.worldCompletionMaterials.sampleCause),
                worldFact('coverMeasuredCause', job.worldCompletionMaterials.measuredCause));
            if(id === I.coverMeasured) effects.push(worldFact('coverStripKey', job.worldCompletionMaterials.measuredStripKey));
        }
        applySimulationEffects(out, effects, current, registry, job.id);
        reconciled++;
    }
    return reconciled;
}
