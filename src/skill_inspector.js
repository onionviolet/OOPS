// Read-only view of why a skill is where it is (SLC37, SLC42). Two stores stay separate:
// native skills (level, parent, milestones) and simulation methods (owned, mastery, fragments, donor).
// Nothing here writes state; callers pass plain data.
const carries=(source)=>source.kind==="trait" && source.origin==="trained" ? "stays with this body" : source.kind==="equipment" ? "stays with the item" : "stays with you";

export function nativeSkillLayers(skill, progress = {}) {
    const milestones=Object.entries(skill.milestones || {}).map(([level,m])=>({level:+level,
        reached:(progress.level ?? 0)>=+level,effects:[m.stats&&"stats",m.xp_multipliers&&"xp multipliers",m.unlocks&&"unlocks"].filter(Boolean)}));
    return {id:skill.skill_id,store:"native",label:skill.category ? `${skill.skill_id} (${skill.category})` : skill.skill_id,
        layers:[{layer:"Level",detail:`Level ${progress.level ?? 0} of ${skill.max_level}, ${Math.floor(progress.totalXp ?? 0)} total XP`,source:"practice (native XP)"},
            {layer:"Parent",detail:skill.parent_skill ? `Learns faster when ${skill.parent_skill} is higher (×${skill.parent_multiplier} per level)` : "None",source:skill.parent_skill || "none"},
            {layer:"Milestones",detail:milestones.length ? milestones.map(m=>`${m.reached ? "reached" : "at"} ${m.level}${m.effects.length ? ` (${m.effects.join(", ")})` : ""}`).join(" · ") : "None",source:"skill definition"}],
        carry:"Native XP is kept by the person; no relearning rule is applied here"};
}

export function simulationMethodLayers(state, registry, actorId = "player") {
    const powers=state.simulation?.powers?.[actorId] || {}, held=state.actors?.[actorId]?.sources || {};
    const sources=Object.entries(held).flatMap(([id,instance])=>{
        const definition=registry.sources.get(id); if(!definition) return [];
        return [{id,label:definition.label,kind:definition.kind,origin:instance.origin || definition.origin || "unknown",
            expires:instance.expiresAt ?? null,receipt:instance.receiptId ?? null,grants:(definition.grants||[]).map(g=>g.capability),carry:carries(definition)}];
    });
    const methods=Object.entries(powers).map(([id,p])=>({id,store:"simulation",label:registry.simulation?.powers?.get?.(id)?.label || id,
        layers:[{layer:"Held",detail:p.owned ? "Owned" : "Not owned",source:p.donor ? `copied from ${p.donor}` : p.cause || "unrecorded"},
            {layer:"Mastery",detail:`${+(+p.mastery).toFixed(2)} after ${p.executions} ${p.executions===1 ? "use" : "uses"}`,source:"authored mastery effects only"},
            {layer:"Understanding",detail:`${(p.fragments||[]).length} fragment${(p.fragments||[]).length===1 ? "" : "s"}`,source:(p.lineage||[]).length ? `built from ${p.lineage.join(", ")}` : "direct"}],
        carry:p.owned ? "Held method stays with you; body-bound grants stay with their body" : "Nothing held"}));
    return {methods,sources};
}

export function skillInspectorView({state, registry, nativeSkills = [], actorId = "player"}) {
    return {native:nativeSkills.map(({skill,progress})=>nativeSkillLayers(skill,progress)),...simulationMethodLayers(state,registry,actorId)};
}
