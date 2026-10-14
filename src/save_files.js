import {validateStreams,validateNativeEncounter} from "./seeded_streams.js";
import {validateStoryletState} from './storylet_deck.js';
import {validateCheatState} from './cheat_cards.js';
import {validateCustomizationState} from './customization_profiles.js';
import {migrateWorkLedger} from './work_ledger_system.js';
import {createDurability} from './absorb_e2/durability.js';
import {normalizePacing} from './absorb_e1/pacing.js';
import {migrateFortSupply} from './absorb_d/fort.js';
import {normalizeLocalLife} from './absorb_c2/local_life.js';
import {validatePackState} from './content_packs.js';
import {validateStructuredEnvelope} from './structured_pack_state.js';
import {validateWorldCompletionNativeEnvelope} from './world_completion_native.js';
import {validateCausalStoryEnvelope} from './causal_story_native.js';
import {validateParadiseEnvelope} from './book_world_paradise_native.js';
import {validateMolEnvelope} from './book_world_mol_native.js';
import {validateFactorioRetortNativeEnvelope} from './factorio_retort_native.js';
import {validateProto23Envelope} from './proto23_world_native.js';
import {validateBacklogEnvelope} from './backlog_expansion_host.js';
import {validateNestedEnvelope} from './feature_expansion_nested_native.js';
import {validateTidemarkEnvelope} from './feature_expansion_destination_native.js';
import {validateRealmEnvelope} from './realm_state.js';
import {prepareFoundationSave, retainRetiredContent} from "./save_compatibility.js";
import {validateExpansionState} from "./expansion_engine.js";
import {validateChronicleCalendar} from "./chronicle.js";
import {validateItemKey} from "./gameplay_transactions.js";
import {stableId} from "./simulation_contracts.js";

import {validateVillageCareer, WATCHCRAFT_BOOK, WATCHCRAFT_READING, WATCHCRAFT_PRACTICE} from './village_career.js';

import {validateLifeRecord} from './life_record.js';
import {validateVillageLives} from './npc_lives.js';

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
    if(Object.hasOwn(original, "cheats"))validateCheatState(original.cheats);
    if(original.customization!=null)validateCustomizationState(original.customization);
    if(original.work_ledger!=null)migrateWorkLedger(original.work_ledger);
    if(original.content_packs!=null)validatePackState(original.content_packs);
    validateStructuredEnvelope(original);
    if(original.village_career != null) {
        validateVillageCareer(original.village_career);
        if(original.village_career.recruit && !original.npc_lives?.people?.some(p=>p.id==='iona' && p.name==='Iona'))throw new Error('Village recruit needs her public life.');
        if(original.village_career.recruit?.known && !(original.books?.[WATCHCRAFT_BOOK]?.accumulated_time>=WATCHCRAFT_READING || (original.village_career.schema>=4 && original.village_career.watchcraft.tutorMinutes===6)))throw new Error('Teaching needs completed native reading.');
        if(original.village_career.schema>=2 && original.village_career.watchcraft.practiceMinutes>0 &&
            !(original.books?.[WATCHCRAFT_BOOK]?.accumulated_time>=WATCHCRAFT_READING || (original.village_career.schema>=4 && original.village_career.watchcraft.tutorMinutes===6)))throw new Error('Watchcraft practice needs completed native reading.');
        if(original.village_career.loan?.watchcraft && original.village_career.watchcraft.practiceMinutes!==WATCHCRAFT_PRACTICE)throw new Error('Executable watchcraft needs completed practice.');
        if(original.village_career.loan?.status==='active' && (original['current location']!=='Village' || original.current_activity?.activity_id!=='patrolling'))throw new Error('Active Village career must have its native patrol.');
    }
    if(original.life_record != null) validateLifeRecord(original.life_record);
    if(original.npc_lives != null) {validateVillageLives(original.npc_lives);if(original.npc_lives.lastYear > original["current time"]?.year)throw new Error("Village lives are ahead of this calendar.");}
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
    if(Object.hasOwn(original,"equipment_durability")){object(original.equipment_durability,"Equipment durability");createDurability(original.equipment_durability);}
    if(Object.hasOwn(original,"pacing_e1")){object(original.pacing_e1,"Home pacing");normalizePacing(original.pacing_e1);}
    migrateFortSupply(original);
    if(Object.hasOwn(original,"absorb_local_life"))normalizeLocalLife(original.absorb_local_life);
    const {save, retired} = prepareFoundationSave(original);
    if(save.expansion != null) {validateExpansionState(save.expansion);validateStoryletState(save.expansion);}
    if(save.expansion?.streams != null) validateStreams(save.expansion.streams);
    validateNativeEncounter(save.native_encounter,save["current location"]);
    if(save.native_encounter && !save.expansion?.streams)throw Error("Saved encounter needs its random streams.");
    validateRealmEnvelope(save);
    validateTidemarkEnvelope(save);
    validateNestedEnvelope(save);
    validateParadiseEnvelope(save);
    validateMolEnvelope(save);
    validateProto23Envelope(save);
    validateFactorioRetortNativeEnvelope(save);
    validateCausalStoryEnvelope(save);
    validateBacklogEnvelope(save);
    validateWorldCompletionNativeEnvelope(save);
    if(save.npc_equipment != null) {
        object(save.npc_equipment, "NPC equipment");
        for(const [id, slots] of Object.entries(save.npc_equipment)) {
            if(!stableId(id)) throw new Error("Invalid NPC equipment owner.");
            object(slots, "NPC equipment slots");
            for(const [slot, key] of Object.entries(slots)) {
                if(!stableId(slot)) throw new Error("Invalid NPC equipment slot."); validateItemKey(key);
            }
        }
    }
    for(const entry of retired.entries) {
        object(entry, "Retired entry");
        if(!Array.isArray(entry.path) || !entry.path.length || !entry.path.every(key => typeof key === "string") ||
            !Object.hasOwn(entry, "value")) throw new Error("Invalid retired-content entry.");
    }
    if(save.fork_schema != null && ![1,2].includes(save.fork_schema)) throw new Error("Unsupported fork save schema.");
    const componentSave = incoming[0] > 0 || incoming[1] >= 6;
    for(const key of ["character", "locations", "current time", ...(componentSave
        ? ["levels", "inventories", "availabilities", "npcs"] : ["skills", "activities", "dialogues", "traders"])]) {
        object(save[key], key);
    }
    const travel=save.expansion?.actors.player.facts;
    if(travel?.['original_frontier.travel.remaining']>0 && (save['current location']!==travel['original_frontier.travel.from'] ||
        !Object.hasOwn(save.locations,travel['original_frontier.travel.from']) || !Object.hasOwn(save.locations,travel['original_frontier.travel.to']))) throw new Error('Saved native journey does not match its actual origin and supported destination.');
    const c = save.character;
    if(c.titles != null) object(c.titles, "Character titles");
    for(const key of ["xp", "equipment", ...(!componentSave ? ["inventory"] : [])]) object(c[key], `character.${key}`);
    if(typeof c.name !== "string") throw new Error("Character name is missing.");
    number(c.money ?? 0, "Money"); number(c.xp.total_xp, "Character XP");
    if(componentSave) {
        for(const owners of Object.values(save.levels)) {
            object(owners, "Level owners");
            for(const owner of Object.values(owners)) {
                object(owner, "Level record"); number(owner.total_xp, "Owner XP"); object(owner.skill_xp, "Skill XP");
                for(const xp of Object.values(owner.skill_xp)) number(xp, "Skill XP");
            }
        }
        const hero = save.levels.person?.main_character;
        if(!hero || hero.total_xp !== c.xp.total_xp) throw new Error("Missing or inconsistent hero XP.");
        for(const owners of Object.values(save.inventories)) {
            object(owners, "Inventory owners");
            for(const inventory of Object.values(owners)) {
                object(inventory, "Inventory");
                for(const entry of Object.values(inventory)) {object(entry, "Item"); number(entry.count, "Item count");}
            }
        }
        object(save.inventories.person?.main_character, "Hero inventory");
        for(const entries of Object.values(save.availabilities)) {
            object(entries, "Availability records");
            for(const flag of Object.values(entries)) {
                if(!Number.isInteger(flag) || flag < 0 || flag > 7) throw new Error("Invalid availability status.");
            }
        }
        if(save.books && Object.keys(save.books).length && !Object.hasOwn(hero.skill_xp, "Literacy")) throw new Error("Book progress needs Literacy XP.");
    } else {
        for(const skill of Object.values(save.skills)) {object(skill, "Skill record"); number(skill.total_xp, "Skill XP");}
        if(save.books && Object.keys(save.books).length && !save.skills.Literacy) throw new Error("Book progress needs Literacy XP.");
    }
    for(const key of ["year", "month", "day", "hour", "minute"]) {
        number(save["current time"][key], `Time ${key}`);
    }
    if(save.expansion?.chronicle) validateChronicleCalendar(save.expansion.chronicle, save.expansion.clock, save["current time"]);
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
            : atob(text); // Older unmarked files used Latin-1. v0.6 upstream uses UTF-8.
        parsed = JSON.parse(decoded);
        if(!text.startsWith(prefix) && /^v0\.([6-9]|[1-9]\d)/.test(parsed?.["game version"])) {
            parsed = JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(Uint8Array.from(decoded, c => c.charCodeAt(0))));
        }
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
    writeGuardedSave(storage, key, serialized);
    return save;
}

// Conservative shared origin budget, measured in UTF-16 storage bytes. Browsers
// may enforce a smaller quota; their failure is handled without deleting saves.
export const SAVE_STORAGE_BUDGET = 4 * 1024 * 1024;
export function measureSaveSize(serialized) {
    if(typeof serialized !== 'string') throw new Error('No save was written.');
    return {utf8Bytes:new TextEncoder().encode(serialized).length,storageBytes:serialized.length*2};
}
export function checkSaveSize(serialized,{storage,key,budget=SAVE_STORAGE_BUDGET}={}) {
    const size=measureSaveSize(serialized);let total=size.storageBytes+2*(key?.length || 0);
    if(storage && Number.isInteger(storage.length) && typeof storage.key==='function') {
        for(let i=0;i<storage.length;i++) {const k=storage.key(i);if(k!==null && k!==key)total+=2*(k.length+(storage.getItem(k)?.length || 0));}
    }
    if(total>budget) throw Object.assign(new Error('There is no room to safely keep this life in your browser. Export your save to a file before continuing; your last saved life is still safe.'),{code:'SAVE_STORAGE_FULL'});
    return {...size,originStorageBytes:total,budget};
}
export function writeGuardedSave(storage,key,serialized) {
    checkSaveSize(serialized,{storage,key});
    try {storage.setItem(key,serialized);}
    catch(error) {
        if(error?.name==='QuotaExceededError') throw Object.assign(new Error('Your browser has no room for this life. Export your save to a file; your last saved life is still safe.',{cause:error}),{code:'SAVE_STORAGE_FULL'});
        throw error;
    }
    return serialized;
}
