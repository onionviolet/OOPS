// Projects compile into the existing world-fact, claim, owned-input and job
// contracts. There is one progress owner and no parallel construction queue.
import {assert, stableId, natural, validatePredicate, validateSimulationEffect} from "./simulation_contracts.js";
export function compileSiteProject(project) {
    assert(stableId(project.id) && natural(project.revision) && project.revision > 0 && Array.isArray(project.phases) && project.phases.length > 0, "Invalid site project.");
    const ids = new Set(project.phases.map(p => p.id));
    assert(ids.size === project.phases.length && [...ids].every(stableId), "Duplicate/invalid project phase.");
    const visit = (id, path = new Set()) => {
        assert(ids.has(id) && !path.has(id), "Unknown or cyclic project dependency.");
        const phase = project.phases.find(p => p.id === id), next = new Set(path).add(id);
        for(const parent of phase.after || []) visit(parent, next);
    };
    return project.phases.map(phase => {
        visit(phase.id); assert(stableId(phase.actorId) && typeof phase.label === "string" && natural(phase.duration) && phase.duration > 0, "Invalid project worker/timing.");
        validatePredicate(phase.requires); [...(phase.costs || []), ...(phase.effects || [])].forEach(validateSimulationEffect);
        const prefix = `project.${project.id}`;
        return {id: `${project.id}.${phase.id}`, revision: project.revision, worldId: project.worldId, group: "field", actorId: phase.actorId,
            label: phase.label, duration: phase.duration, location: phase.location, siteId: phase.siteId, once: true, claim: `${prefix}.${phase.id}`,
            cancellation: phase.cancellation || "none", costs: phase.costs || [],
            ...Object.fromEntries(["participants", "targetId", "coLocated", "powerId", "completionRequires", "completionCoLocated", "completionFailure"].filter(key => phase[key] != null).map(key => [key, structuredClone(phase[key])])),
            ...(phase.visibleWhen ? {visibleWhen:phase.visibleWhen} : {}), uiSection:phase.uiSection || "workshop",
            requires: {all: [{fact: `world.${prefix}.started`, op: "eq", value: true},
                ...(phase.after || []).map(id => ({fact: `world.${prefix}.${id}`, op: "eq", value: true})), ...(phase.requires ? [phase.requires] : [])]},
            effects: [...(phase.effects || []), {type: "world", worldId: project.worldId, key: `${prefix}.${phase.id}`, value: true}]};
    });
}
export function projectView(state, project, actorId = "player") {
    const known = state.actors[actorId].facts;
    return {id: project.id, phases: project.phases.map(p => ({id:p.id, label:p.label,
        own:p.actorId === actorId,knownComplete: known[`field.project.${p.id}`] === true || p.actorId === actorId && (state.actors[actorId].completed[`${project.id}.${p.id}`] || 0) > 0,
        observedAt: known[`field.project.${p.id}.observedAt`] ?? null}))};
}
