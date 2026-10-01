import {prepareFoundationSave, retainRetiredContent} from "./save_compatibility.js";
import {validateExpansionState} from "./expansion_engine.js";

const object = (value, label) => {
    if(!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
};
const number = (value, label, minimum = 0) => {
    if(!Number.isFinite(value) || value < minimum || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
        throw new Error(`${label} must be a finite number in the supported range.`);
    }
};

export function validateSaveEnvelope(original, currentVersion) {
    object(original, "Save");
    const parts = version => {
        if(typeof version !== "string" || !/^v\d+(\.\d+){1,4}$/.test(version)) throw new Error("Unrecognized save version.");
        return version.slice(1).split(".").map(Number);
    };
    const incoming = parts(original["game version"]), current = parts(currentVersion);
    for(let i = 0; i < Math.max(incoming.length, current.length); i++) {
        if((incoming[i] || 0) > (current[i] || 0)) throw new Error("This save needs a newer game version.");
        if((incoming[i] || 0) < (current[i] || 0)) break;
    }
    // Retirement is validated before any active game or storage mutation.
    const {save, retired} = prepareFoundationSave(original);
    if(save.expansion != null) validateExpansionState(save.expansion);
    for(const entry of retired.entries) {
        object(entry, "Retired entry");
        if(!Array.isArray(entry.path) || !entry.path.length || !entry.path.every(key => typeof key === "string") ||
            !Object.hasOwn(entry, "value")) throw new Error("Invalid retired-content entry.");
    }
    for(const key of ["character", "skills", "locations", "activities", "dialogues", "traders", "current time"]) {
        object(save[key], key);
    }
    const c = save.character;
    for(const key of ["xp", "inventory", "equipment"]) object(c[key], `character.${key}`);
    if(typeof c.name !== "string") throw new Error("Character name is missing.");
    number(c.money ?? 0, "Money"); number(c.xp.total_xp, "Character XP");
    for(const skill of Object.values(save.skills)) {
        object(skill, "Skill record"); number(skill.total_xp, "Skill XP");
    }
    if(save.books && !save.skills.Literacy) throw new Error("Book progress needs Literacy XP.");
    for(const key of ["year", "month", "day", "hour", "minute"]) {
        number(save["current time"][key], `Time ${key}`);
    }
    if(typeof save["current location"] !== "string") throw new Error("Current location is missing.");
    // Catch malformed optional containers before the real-loader preflight.
    for(const key of ["books", "stances", "quests", "recipes", "options", "active_effects", "global_flags", "item_log",
        "favourite_locations", "favourite_items", "favourite_consumables", "loot_sold_count", "player_storage", "current_activity"]) {
        if(save[key] != null) object(save[key], key);
    }
    if(save.player_storage) object(save.player_storage.inventory, "Storage inventory");
    if(save.skill_category_order != null && !Array.isArray(save.skill_category_order)) throw new Error("Skill order must be an array.");
    // Remaining definition/reference checks run through the actual isolated loader.
    return retainRetiredContent(save, retired);
}

export function decodeSaveFile(encoded, currentVersion) {
    if(typeof encoded !== "string" || !encoded.trim()) throw new Error("Choose a non-empty save file.");
    let parsed;
    try {
        const text = encoded.trim();
        const prefix = "YAIR-UTF8-1:";
        const decoded = text.startsWith(prefix)
            ? new TextDecoder("utf-8", {fatal: true}).decode(Uint8Array.from(atob(text.slice(prefix.length)), c => c.charCodeAt(0)))
            : atob(text); // Preserve existing Latin-1 exports exactly, including accented names.
        parsed = JSON.parse(decoded);
    }
    catch { throw new Error("The file is not a valid base64 JSON save."); }
    return validateSaveEnvelope(parsed, currentVersion);
}

export function encodeSaveFile(serialized) {
    if(typeof serialized !== "string" || !serialized) throw new Error("No valid save was created; export canceled.");
    object(JSON.parse(serialized), "Save");
    const bytes = new TextEncoder().encode(serialized);
    let binary = "";
    for(const byte of bytes) binary += String.fromCharCode(byte);
    return "YAIR-UTF8-1:" + btoa(binary);
}

// No write until both structural validation and real-loader preflight succeed.
export async function importSaveFile(encoded, {currentVersion, preflight, storage, key}) {
    const save = decodeSaveFile(encoded, currentVersion);
    await preflight(save);
    const serialized = JSON.stringify(save);
    storage.setItem(key, serialized);
    return save;
}
