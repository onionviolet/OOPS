// Save parts (S0 and S1 of the save architecture, docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md round 3).
// A save splits into named parts: one per top-level key, with the world simulation split
// per table, because it is most of a developed save. Parts join back to the same bytes.
// Pure and dependency-free: the Node bench, tests and a later chunked store share it.

// Every top-level key create_save writes by hand, with its owner. Registry domains own
// their own keys and are not listed. `rename` is the proposed meaningful name for the
// wave-named keys, applied with a load alias before v0.1.0 (S0 step 2).
export const HAND_SAVE_KEYS = Object.freeze({
    // Upstream YAIR keys (kept as upstream named them).
    'game version': {owner: 'upstream'}, 'current time': {owner: 'upstream'}, language: {owner: 'upstream'},
    saved_at: {owner: 'upstream'}, total_playtime: {owner: 'upstream'}, total_deaths: {owner: 'upstream'},
    total_crafting_attempts: {owner: 'upstream'}, total_crafting_successes: {owner: 'upstream'}, total_kills: {owner: 'upstream'},
    total_crits_done: {owner: 'upstream'}, total_crits_taken: {owner: 'upstream'}, total_hits_done: {owner: 'upstream'},
    total_hits_taken: {owner: 'upstream'}, strongest_hit: {owner: 'upstream'}, gathered_materials: {owner: 'upstream'},
    global_flags: {owner: 'upstream'}, last_rewarded_export: {owner: 'upstream'}, character: {owner: 'upstream'},
    rain_counter: {owner: 'upstream'}, cold_status_counters: {owner: 'upstream'}, are_finished_quests_hidden: {owner: 'upstream'},
    favourite_consumables: {owner: 'upstream'}, favourite_items: {owner: 'upstream'}, favourite_locations: {owner: 'upstream'},
    skill_category_order: {owner: 'upstream'}, 'current location': {owner: 'upstream'}, locations: {owner: 'upstream'},
    books: {owner: 'upstream'}, quests: {owner: 'upstream'}, is_reading: {owner: 'upstream'}, is_sleeping: {owner: 'upstream'},
    active_effects: {owner: 'upstream'}, enemy_killcount: {owner: 'upstream'}, item_log: {owner: 'upstream'},
    loot_sold_count: {owner: 'upstream'}, last_combat_location: {owner: 'upstream'}, last_location_with_bed: {owner: 'upstream'},
    options: {owner: 'upstream'}, stances: {owner: 'upstream'}, current_stance: {owner: 'upstream'},
    selected_stance: {owner: 'upstream'}, faved_stances: {owner: 'upstream'}, message_filters: {owner: 'upstream'},
    skill_list_state: {owner: 'upstream'}, current_activity: {owner: 'upstream'},
    // Fork keys with lasting names.
    fork_schema: {owner: 'src/save_files.js'}, expansion: {owner: 'src/expansion_engine.js'},
    levels: {owner: 'src/main.js'}, inventories: {owner: 'src/main.js'}, availabilities: {owner: 'src/main.js'},
    npcs: {owner: 'src/main.js'}, npc_equipment: {owner: 'src/main.js'}, native_encounter: {owner: 'src/seeded_streams.js'},
    content_packs: {owner: 'src/content_packs.js'}, customization: {owner: 'src/customization_profiles.js'},
    customization_default: {owner: 'src/customization_profiles.js'}, display_preferences: {owner: 'src/main.js'},
    continuation: {owner: 'src/continuation_state.js'}, life_record: {owner: 'src/life_record.js'},
    npc_lives: {owner: 'src/npc_lives.js'}, generated_people: {owner: 'src/generated_people.js'},
    village_career: {owner: 'src/village_career.js'}, work_ledger: {owner: 'src/work_ledger_system.js'},
    mixtures: {owner: 'src/mixture_state.js'}, household: {owner: 'src/main.js'},
    equipment_durability: {owner: 'src/absorb_e2/durability.js'}, combatOptions: {owner: 'src/main.js'},
    // Wave-named keys: owner plus a proposed lasting name.
    p23_drop_observations: {owner: 'src/absorb_p23/host_joins/known_detail.js', rename: 'drop_observations'},
    p23_exposure: {owner: 'src/absorb_p23/host_joins/tranche_one.js', rename: 'exposure'},
    p23_growth_profile: {owner: 'src/absorb_p23/host_joins/growth_profile.js', rename: 'growth_profile'},
    p23_growth_earned: {owner: 'src/absorb_p23/host_joins/growth_profile.js', rename: 'growth_earned'},
    p23_living_gear: {owner: 'src/absorb_p23/host_joins/tranche_two.js', rename: 'living_gear'},
    p23_salvage: {owner: 'src/absorb_p23/host_joins/tranche_three.js', rename: 'salvage'},
    p23EncounterProfile: {owner: 'src/absorb_p23/host_joins/encounter_profiles.js', rename: 'training_profile'},
    p23EncounterReceipt: {owner: 'src/absorb_p23/host_joins/encounter_profiles.js', rename: 'training_receipt'},
    p23_market_life: {owner: 'src/absorb_p23/host_joins/tranche_four.js', rename: 'market_life'},
    p23_leisure_memory: {owner: 'src/absorb_p23/host_joins/tranche_four.js', rename: 'leisure_memory'},
    field_familiarity_p07: {owner: 'src/absorb_p23/host_joins/tranche_four.js', rename: 'field_familiarity'},
    absorb_repeat_search: {owner: 'src/absorb_p23/host_joins/tranche_four.js', rename: 'repeat_search'},
    absorb_local_life: {owner: 'src/absorb_c2/local_life.js', rename: 'local_life'},
    pacing_e1: {owner: 'src/absorb_e1/pacing.js', rename: 'pacing'},
    fort_supply: {owner: 'src/absorb_d/fort.js'},
});

const SIM = 'expansion.simulation/';

// FNV-1a over UTF-16 code units, 53 bits: a fast synchronous change detector, not a
// security hash. Content-addressed storage (S3) uses SHA-256 over the same part bytes.
export function partHash(text) {
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    for(let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
        h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
    }
    return ((h2 & 0x1fffff) * 0x100000000 + h1).toString(36);
}

// Splits a save object into parts. The manifest keeps key order, so joinSave rebuilds
// an object that stringifies to the same bytes as the input.
export function splitSave(save) {
    if(!save || typeof save !== 'object' || Array.isArray(save)) throw Error('A save must be an object.');
    // A key holding undefined is dropped by JSON.stringify, so it is not a part either.
    const parts = {}, order = Object.keys(save).filter(key => save[key] !== undefined);
    let simulationOrder = null;
    for(const key of order) {
        if(key === 'expansion' && save.expansion?.simulation && typeof save.expansion.simulation === 'object' && !Array.isArray(save.expansion.simulation)) {
            const {simulation} = save.expansion;
            simulationOrder = Object.keys(simulation);
            parts.expansion = JSON.stringify({...save.expansion, simulation: null});
            for(const table of simulationOrder) parts[SIM + table] = JSON.stringify(simulation[table]);
        } else parts[key] = JSON.stringify(save[key]);
    }
    const hashes = Object.fromEntries(Object.entries(parts).map(([name, text]) => [name, partHash(text)]));
    return {manifest: {format: 'parts-1', order, simulationOrder, hashes}, parts};
}

export function joinSave({manifest, parts}) {
    const save = {};
    for(const key of manifest.order) {
        const text = parts[key];
        if(text === undefined) throw Error(`Missing save part: ${key}`);
        save[key] = JSON.parse(text);
    }
    if(manifest.simulationOrder) {
        const simulation = {};
        for(const table of manifest.simulationOrder) {
            const text = parts[SIM + table];
            if(text === undefined) throw Error(`Missing save part: ${SIM + table}`);
            simulation[table] = JSON.parse(text);
        }
        save.expansion.simulation = simulation;
    }
    return save;
}

// Which parts differ between two manifests: the S2 payoff measure (how much of a
// commit's rebuild was needed).
export function changedParts(before, after) {
    const names = new Set([...Object.keys(before?.hashes || {}), ...Object.keys(after.hashes)]);
    return [...names].filter(name => before?.hashes?.[name] !== after.hashes[name]);
}

// Top-level keys with no declared owner: neither a hand key nor a registry domain id.
export function unownedKeys(save, domainIds = []) {
    const domains = new Set(domainIds);
    return Object.keys(save).filter(key => !Object.hasOwn(HAND_SAVE_KEYS, key) && !domains.has(key));
}
