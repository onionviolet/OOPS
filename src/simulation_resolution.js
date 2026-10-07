import {assert, copy, stableId} from "./simulation_contracts.js";
import {resolveEffectAmount} from "./power_models.js";

export function deriveSimulationSeed(seed, id) {
    let n = seed; for(const ch of id) n = Math.imul(n ^ ch.charCodeAt(0),16777619) >>> 0;
    return n || 1;
}

// Bind new participants once per cause. Frozen jobs retain both their identity
// and their body/template rather than reading a changed template at settlement.
export function prepareSimulationEffects(effects, facts, registry, cause, model = {}) {
    const aliases = new Map();
    return (effects || []).map(original => {
        const e = copy(original);
        if(e.type === "spawn") {
            if(e.instanceKey) {
                assert(!aliases.has(e.instanceKey), "Duplicate new participant binding.");
                e.personId ||= `spawn:${cause}:${e.instanceKey}`;
                assert(stableId(e.personId), "Invalid generated actor identity.");
                aliases.set(e.instanceKey, e.personId);
            }
            e.template ||= copy(registry.simulation.people.get(e.definitionId));
            assert(e.template, "Unknown new actor template.");
        }
        if(e.type === "situation" && e.operation === "begin") {e.definition ||= copy(registry.simulation.situations.get(e.situationId)); assert(e.definition, "Unknown situation definition.");}
        if(e.type === "energy" && e.operation === "learn") {e.policy ||= copy(registry.simulation.energies.get(e.energyId)); assert(e.policy, "Unknown energy policy.");}
        for(const key of ["actor", "target", "from", "to"]) if(e[key]?.startsWith("$spawn.")) {
            const id = aliases.get(e[key].slice(7));
            assert(id, "Create the participant before referring to it."); e[key] = id;
        }
        if(e.amount != null) e.amount = resolveEffectAmount(e.amount, facts, model);
        return e;
    });
}

export function resolveOutcomeWeights(outcomes, facts, model = {}) {
    const weights = outcomes.map(o => resolveEffectAmount(o.weight, facts, model));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    assert(weights.every(w => w >= 0) && Number.isFinite(total) && total > 0 && total <= Number.MAX_SAFE_INTEGER, "No legal weighted outcome under the current circumstances.");
    return weights;
}
