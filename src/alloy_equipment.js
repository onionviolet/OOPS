// D1 balance proposal. Authored material properties, never a new save field.
export const ALLOY_ID = "Springsteel ingot";
export const BRACE_ID = "Springsteel brace";
export const SPRINGSTEEL = Object.freeze({grade: 1, agility: 2, rigidity: -1, kitBonus: 1, driveSaving: 1});
export function deriveBraceStats(material) {
    const profile = material.alloy_profile;
    if(!profile) throw new Error("A brace needs an alloy material profile.");
    return {agility: {flat: profile.agility * profile.grade}, strength: {flat: profile.rigidity * profile.grade}};
}
export function alloyEquipmentFacts(state, context = {}) {
    const actor = context.actorId || "player";
    const native = state.simulation?.people?.[actor]?.inventory === "native";
    const slots = native ? context.equipment?.[actor] : state.simulation?.equipment?.[actor];
    let equipped = false;
    try { equipped = JSON.parse(slots?.amulet || "null")?.id === BRACE_ID; } catch {}
    return {"equipment.springsteel.equipped": equipped,
        "equipment.springsteel.grade": equipped ? SPRINGSTEEL.grade : 0};
}
// One formula hook, restricted to the forceful application of the existing
// field.load_step family. Quotes are frozen at paid job start, including refund.
export function alloyTechniqueEffects(command, effects, facts, resolve) {
    if(command.id !== "field.pack_drive" || command.powerId !== "field.load_step") return effects;
    const formula = (scale, add) => resolve({fact: "equipment.springsteel.grade", scale, add, min: 1, max: 3});
    return (effects || []).map(e => e.type === "energy" && e.energyId === "field.drive" && e.operation === "use"
        ? {...e, output: formula(-SPRINGSTEEL.driveSaving, 3)}
        : e.type === "item" && e.amount > 0 && e.key === JSON.stringify({id: "Prepared survey kit"})
            ? {...e, amount: formula(SPRINGSTEEL.kitBonus, 1)} : e);
}
