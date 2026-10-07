// Authored identity and the player's knowledge are different owners. Missing
// knowledge in an old save means unknown, not an automatic cosmology reveal.
export function worldIdentityView(state, registry, actorId = "player") {
    const actor = state.actors[actorId], world = registry.worlds.get(actor.worldId);
    const prefix = `world.${actor.worldId}`;
    const nameKnown = actor.facts[`${prefix}.nameKnown`] === true && typeof world?.publicName === "string" && !!world.publicName.trim();
    const branchKnown = actor.facts[`${prefix}.branchKnown`] === true && ["branch","original"].includes(world?.continuity);
    const name = nameKnown ? world.publicName : "Unknown world";
    const branch = branchKnown ? world?.continuity === "branch" ? "Branch dimension" : "Original continuity" : "Unknown branch";
    // An empty field does not advertise that a cosmology discovery exists.
    const learned = [nameKnown ? name : "", branchKnown ? branch : ""].filter(Boolean);
    return {name, branch, nameKnown, branchKnown, label: learned.join(" · "),
        description: learned.length ? `Known identity: ${learned.join(" · ")}.` : ""};
}
