import test from "node:test";
import assert from "node:assert/strict";
import {prepareV06Save} from "../src/save_migration.js";
import {validateSaveEnvelope, encodeSaveFile, decodeSaveFile, importSaveFile} from "../src/save_files.js";

const fixture = () => ({"game version": "v0.6", "current time": {year: 999, month: 4, day: 1, hour: 8, minute: 0},
    "current location": "Village", character: {name: "魏宝 🐉", money: 94, xp: {total_xp: 50}, equipment: {}, titles: {surveyor: true}},
    levels: {person: {main_character: {total_xp: 50, skill_xp: {Literacy: 0, Meditation: 50}}}},
    inventories: {person: {main_character: {}}}, availabilities: {location: {Village: 1}}, npcs: {}, locations: {},
    books: {}, retired_content: {schema: 1, entries: [{path: ["cultivation"], value: {qi: 78}}]}});

test("component saves and upstream unmarked UTF-8 exports preserve progress and dormant data", () => {
    const save = fixture();
    assert.deepEqual(validateSaveEnvelope(save, "v0.6"), save);
    assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(save)), "v0.6"), save);
    const bytes = new TextEncoder().encode(JSON.stringify(save));
    const upstreamFile = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(""));
    assert.deepEqual(decodeSaveFile(upstreamFile, "v0.6"), save);
});

test("a fresh component save needs no Literacy record until it contains book progress", () => {
    const save = fixture(); delete save.levels.person.main_character.skill_xp.Literacy;
    assert.deepEqual(validateSaveEnvelope(save, "v0.6"), save);
    save.books["Medicine for dummies"] = {accumulated_time: 1};
    assert.throws(() => validateSaveEnvelope(save, "v0.6"), /Literacy/);
});

test("invalid component owners, XP, status flags and future fork schemas cannot replace storage", async () => {
    for(const mutate of [s => delete s.levels.person.main_character, s => s.levels.person.main_character.total_xp = 51,
        s => s.levels.person.main_character.skill_xp.Meditation = -1, s => delete s.inventories.person.main_character,
        s => s.inventories.person.main_character.bad = {count: -1}, s => s.availabilities.location.Village = 8,
        s => s.fork_schema = 2, s => s.npcs = null, s => s.character.titles = []]) {
        const bad = fixture(); mutate(bad); let writes = 0;
        await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(bad)), {currentVersion: "v0.6",
            preflight: () => assert.fail("must reject before loader"), key: "test", storage: {setItem() {writes++;}}}));
        assert.equal(writes, 0);
    }
});

test("legacy biography migrates without mutating input or recreating an existing hero", () => {
    const legacy = {"game version": "v0.5.5.30", character: {name: "Héro", personal: {race: "elf", age: "adult", height: "tall"}},
        global_flags: {is_hero_created: false}, expansion: {pending: [{draw: 0.25}]}};
    const before = structuredClone(legacy), migrated = prepareV06Save(legacy);
    assert.deepEqual(legacy, before);
    assert.equal(migrated.character.bio.race, "elf"); assert.equal(migrated.character.bio.height, "tall");
    assert.equal(migrated.global_flags.is_hero_created, true);
    assert.deepEqual(migrated.expansion, legacy.expansion);
    assert.deepEqual(prepareV06Save(migrated), migrated);
    assert.deepEqual(prepareV06Save(fixture()), fixture());
});
