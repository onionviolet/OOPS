import {assert, stableId, natural, validateSimulationEffect} from "./simulation_contracts.js";
// Each phase is an existing caused occurrence, frozen and advanced by the
// common scheduler. No rendering, observation or missed deadline accepts work.
export function compileSituation(scene) {
    assert(stableId(scene.id) && natural(scene.revision) && scene.revision > 0 && scene.phases.length > 0, "Invalid situation.");
    const ids = new Set(scene.phases.map(p=>p.id)); assert(ids.size === scene.phases.length && [...ids].every(stableId), "Duplicate situation phase.");
    for(const phase of scene.phases) {
        assert(natural(phase.delay) && phase.delay > 0 && ["ambient","offer"].includes(phase.mode), "Invalid situation timing.");
        assert(phase.mode !== "offer" || natural(phase.lifetime) && phase.lifetime > 0, "Situation offers need an expiry.");
        [...(phase.effects || []), ...(phase.onExpire || [])].forEach(validateSimulationEffect);
    }
    return scene.phases.map((phase,index) => {
        const next = scene.phases[index+1];
        return {id:`${scene.id}.${phase.id}`,revision:scene.revision,label:phase.label,group:"field",interval:1,chance:1,maxOccurrences:1,
            mode:phase.mode,public:!!phase.public,lifetime:phase.lifetime || 0,
            effects:[{type:"world",worldId:scene.worldId,key:`situation.${scene.id}.stage`,value:phase.id},...(phase.effects || []),
                ...(phase.mode === "ambient" && next ? [{type:"event",eventId:`${scene.id}.${next.id}`,delay:next.delay}] : [])],
            responses:(phase.responses || []).map(r=>({requiresIdle:true,...r})),onExpire:[...(phase.onExpire || []),
                ...(phase.mode === "offer" && next ? [{type:"event",eventId:`${scene.id}.${next.id}`,delay:next.delay}] : [])]};
    });
}
