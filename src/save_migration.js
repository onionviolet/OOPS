// v0.6's native loader migrates the registries. Preserve the older biography
// explicitly and let existing characters continue without creation again.
export function prepareV06Save(original) {
    const save = structuredClone(original);
    const parts = String(save["game version"]).replace(/^v/, "").split(".").map(Number);
    const legacy = parts[0] === 0 && parts[1] < 6;
    if(legacy && save.character) {
        save.character.bio = {race: "nekomimi", height: "average", age: "adult", gender: "ambiguous",
            ...save.character.personal, ...save.character.bio};
        save.global_flags = {...save.global_flags, is_hero_created: true};
    }
    return save;
}
