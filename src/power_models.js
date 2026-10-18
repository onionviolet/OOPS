import {assert, finite, meets} from "./simulation_contracts.js";

// Models calculate legal scope and cost; effect execution remains shared. No
// fictional rank conversion, mandatory slots or universal proficiency ceiling.
export function previewPowerModel(definition, owned, command, {state, context, facts}) {
    const reasons = [], parameters = command.parameters || {}, actor = context.actorId;
    let capacity = definition.capacity ?? 1, costScale = 1;
    if(definition.model === "practice") {
        capacity += (owned.mastery || 0) * (definition.capacityPerMastery || 0);
        for(const band of definition.masteryBands || []) if(owned.mastery >= band.at) {
            costScale = band.costScale ?? costScale; capacity = band.capacity ?? capacity;
        }
    } else if(definition.model === "design") {
        const functions = parameters.functions || [];
        if(new Set(functions).size !== functions.length) reasons.push("A designed function cannot be paid or applied twice.");
        let used = 0;
        for(const id of functions) {
            const f = definition.functions?.[id];
            if(!f) reasons.push(`Unknown designed function ${id}.`); else used += f.capacity;
        }
        if(used > capacity) reasons.push("Designed functions exceed the source's absolute capacity.");
        if(definition.slots != null && functions.length > definition.slots) reasons.push("This source does not have enough configured slots.");
    } else if(definition.model === "investment") {
        const track = state.simulation.progression[actor]?.[definition.track]?.values || {};
        const invested = track[definition.field || "investment"] || 0;
        capacity = invested * (definition.capacityPerPoint || 1);
        const area = parameters.area ?? 1, intensity = parameters.intensity ?? command.output ?? 1;
        if(!finite(area) || area < 1 || !finite(intensity) || intensity < 0 || area * intensity > capacity) reasons.push("Area and intensity exceed the actual invested capacity.");
        costScale = area * intensity * (definition.upkeepPerUnit ?? 1);
    } else if(definition.model === "authority") {
        const custody = state.simulation.custody[definition.custodyId];
        if(definition.custodyId && (!custody || custody.owner !== actor || custody.holder !== context.targetId)) reasons.push("The specified ownership and custody rule does not apply to this target.");
        if(definition.jurisdiction && state.actors[actor].worldId !== definition.jurisdiction) reasons.push("This authority has no jurisdiction here.");
        if(definition.termination && meets(definition.termination, facts)) reasons.push("This authority's termination condition has been met.");
        // Rule-based effects do not acquire a made-up damage capacity.
        capacity = definition.capacity ?? Number.MAX_SAFE_INTEGER;
    } else if(definition.model === "hybrid") {
        if(!(owned.lineage || []).length) reasons.push("The hybrid has no acquired constituent lineage.");
        if(definition.combination !== "fusion" && (definition.constituents || []).some(id => !state.simulation.powers[actor]?.[id]?.owned)) reasons.push("A required constituent is unavailable.");
    }
    if(!finite(capacity) || capacity < 0 || !finite(costScale) || costScale <= 0) reasons.push("The model produced invalid capacity or upkeep.");
    if(command.output != null && (!finite(command.output) || command.output < 0 || command.output > capacity)) reasons.push("Requested output exceeds this power's capacity.");
    return {model: definition.model, capacity, costScale, reasons};
}

// Typed, JSON expressions permit power output, actor progress and actual native
// stats to affect execution without callbacks/eval inside saved content.
// Fluency from repetition (SLR5, SLR34): practiced work gets faster on a
// falling curve, halfway to its floor after `halfAt` uses of the method. The
// floor is the work's physical minimum; a better tool or method lifts it.
export function fluencyDuration(base, fluency, executions = 0) {
    if(!fluency) return base;
    const value = fluency.floor + (base - fluency.floor) / (1 + Math.max(0, executions) / fluency.halfAt);
    return Math.max(fluency.floor, Math.min(base, Math.round(value)));
}
export function resolveEffectAmount(value, facts, model = {}) {
    if(typeof value === "number") {assert(finite(value), "Invalid numeric effect."); return value;}
    assert(value && typeof value === "object" && typeof value.fact === "string", "Invalid effect formula.");
    const input = value.fact === "power.capacity" ? model.capacity : value.fact === "power.costScale" ? model.costScale : facts[value.fact];
    assert(finite(input), `Unknown numeric input ${value.fact}.`);
    const amount = Math.min(value.max ?? Number.MAX_SAFE_INTEGER, Math.max(value.min ?? -Number.MAX_SAFE_INTEGER, input * (value.scale ?? 1) + (value.add ?? 0)));
    assert(finite(amount), "Effect formula overflow."); return amount;
}
