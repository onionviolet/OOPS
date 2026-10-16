import {simulationValidationMemo} from './simulation_render.js';
// Retired prototype content stays recoverable without registering playable content.
const RETIRED_IDS = new Set(["Jade Hollow", "Dewleaf", "Dewleaf tea", "Meridian pellet"]);

function retiredKey(key) {
    const memo = simulationValidationMemo(retiredKey);
    if(!memo) return classifyRetiredKey(key);
    if(!memo.has(key)) memo.set(key, classifyRetiredKey(key));
    return memo.get(key);
}

// Every save walk visits every key, so plain keys skip the throwing JSON.parse:
// only text whose first non-whitespace character is "{" can parse to an object with an id.
function classifyRetiredKey(key) {
    if(RETIRED_IDS.has(key)) return true;
    if(!/^[ \t\n\r]*\{/.test(key)) return false;
    try { return RETIRED_IDS.has(JSON.parse(key)?.id); } catch { return false; }
}

export function prepareFoundationSave(original) {
    const save = structuredClone(original);
    const retired = structuredClone(save.retired_content || {schema: 1, entries: []});
    if(retired.schema !== 1 || !Array.isArray(retired.entries)) {
        throw new Error("Unsupported retired-content schema; original save must be preserved.");
    }
    delete save.retired_content;
    const keep = (path, value) => {
        const key = JSON.stringify(path);
        const index = retired.entries.findIndex(entry => JSON.stringify(entry.path) === key);
        const entry = {path, value: structuredClone(value)};
        if(index < 0) retired.entries.push(entry);
        else retired.entries[index] = entry;
    };
    if(Object.hasOwn(save, "cultivation")) {
        keep(["cultivation"], save.cultivation);
        delete save.cultivation;
    }
    if(save["current location"] === "Jade Hollow") {
        keep(["current location"], save["current location"]);
        save["current location"] = "Village";
        if(Object.hasOwn(save, "current_activity")) {
            keep(["current_activity"], save.current_activity);
            delete save.current_activity;
        }
    }
    for(const key of ["last_combat_location", "last_location_with_bed"]) {
        if(save[key] === "Jade Hollow") {
            keep([key], save[key]);
            save[key] = "Village";
        }
    }
    // Includes inventory keys, recipe/location IDs, favorites and discovery logs.
    const detach = (node, path = []) => {
        if(!node || typeof node !== "object" || Array.isArray(node)) return;
        for(const key of Object.keys(node)) {
            const childPath = [...path, key];
            if(retiredKey(key)) {
                keep(childPath, node[key]);
                delete node[key];
            } else detach(node[key], childPath);
        }
    };
    // Suppressed rendering already scopes the pure classifier memo. Reuse a
    // traversal cursor there, allocating paths only for actual retired entries.
    // Each retained path owns its copy; sibling traversal cannot change it.
    const detachBatched = (node, path = []) => {
        if(!node || typeof node !== "object" || Array.isArray(node)) return;
        for(const key of Object.keys(node)) {
            path.push(key);
            if(retiredKey(key)) {
                keep([...path], node[key]);
                delete node[key];
            } else detachBatched(node[key], path);
            path.pop();
        }
    };
    if(simulationValidationMemo(retiredKey)) detachBatched(save);
    else detach(save);
    return {save, retired};
}

export function retainRetiredContent(save, retired) {
    return retired.entries.length ? {...save, retired_content: structuredClone(retired)} : save;
}
