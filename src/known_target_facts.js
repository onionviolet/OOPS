// U06 adapter: what an actor KNOWS about another actor, as opposed to what is true of them.
// Default: a rule that appraises someone else reads `person.<targetId>.*` observations the actor has recorded
// (simulation.knowledge[actor], written by the `knowledge` effect), never the raw `target.*` state.
// Dial: a world may allow appraisal from fresh sight by writing the observation when the sight happens
// (a knowledge effect on arrival or inspection); the rule text does not change, only when the record is made.
// Reason: display is a presentation concern, truth is a rules concern (AD7). Hidden state still decides the
// fight, the fever or the lie; only what the actor can state, plan around or be TOLD is gated by observation.
// Pure leaf: no imports, no new save key. It reads the existing knowledge store and writes nothing.
// Accepts the simulation slice or the whole expansion state that holds it.
const store = sim => sim?.simulation || sim || {};
const prefix = targetId => `person.${targetId}.`;
// Rule authors: true for a fact key that must come from a recorded observation rather than raw target state.
export const requiresObservation = key => typeof key === 'string' && key.startsWith('person.');
// Recorded observations about the target, each with how it was learned: {value, stage, at, cause, basis?}.
export function knownTargetFacts(simulationState, actorId, targetId) {
    const out = {}, known = store(simulationState).knowledge?.[actorId] || {}, p = prefix(targetId);
    for(const [key, record] of Object.entries(known)) {
        if(!key.startsWith(p)) continue;
        out[key] = {value: record.value, stage: record.stage, at: record.at, cause: record.cause, ...(record.basis ? {basis: record.basis} : {})};
    }
    return out;
}
// The same observations as a flat fact bag (`person.<id>.<k>` -> value) for rule evaluation.
export function knownTargetFactValues(simulationState, actorId, targetId) {
    const out = {};
    for(const [key, record] of Object.entries(knownTargetFacts(simulationState, actorId, targetId))) out[key] = record.value;
    return out;
}
