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
    // Schema1 kits were extension-owned counters. Move existing stock once,
    // leaving frozen old commitments and their outcomes untouched.
    const kits = save.expansion?.actors?.player?.resources?.kits;
    if(kits != null && kits > 0) {
        if(!Number.isSafeInteger(kits)) throw new Error("Legacy survey kits need whole counts.");
        const inventory = legacy ? save.character.inventory : save.inventories?.person?.main_character;
        if(!inventory) throw new Error("No inventory for legacy survey-kit migration.");
        const key = JSON.stringify({id: "Prepared survey kit"});
        const count = (inventory[key]?.count || 0) + kits;
        if(!Number.isSafeInteger(count)) throw new Error("Survey-kit migration overflow.");
        inventory[key] = {count};
        save.expansion.actors.player.resources.kits = 0;
    }
    return save;
}
