import test from "node:test";
import assert from "node:assert/strict";
import {decodeSaveFile, encodeSaveFile, importSaveFile} from "../src/save_files.js";

const VERSION = "v0.5.5.30";
const fixture = () => ({"game version": VERSION, "current time": {year: 999, month: 4, day: 1, hour: 8, minute: 0},
    "current location": "Village", character: {name: "Hero", money: 102, xp: {total_xp: 0}, inventory: {}, equipment: {}},
    skills: {Literacy: {total_xp: 0}}, locations: {}, activities: {}, dialogues: {}, traders: {}});
const storage = () => ({value: "current-save", writes: 0, setItem(key, value) {this.value = value; this.writes++;}});

test("native file encoding preserves Unicode and legacy Latin-1 saves", () => {
    const save = fixture(); save.character.name = "魏宝 🐉";
    assert.deepEqual(decodeSaveFile(encodeSaveFile(JSON.stringify(save)), VERSION), save);
    save.character.name = "Héro";
    assert.deepEqual(decodeSaveFile(btoa(JSON.stringify(save)), VERSION), save);
    save["game version"] = "v0.4.9";
    assert.deepEqual(decodeSaveFile(btoa(JSON.stringify(save)), VERSION), save);
});

test("malformed and incompatible imports cannot write over the current save", async () => {
    const variants = ["not base64!", btoa("not JSON"), btoa("null"), btoa("[]"), btoa("{}")];
    for(const mutate of [s => delete s.character.xp, s => s.skills.Literacy.total_xp = -1,
        s => s["current time"] = null, s => s["game version"] = "v0.6",
        s => s.retired_content = {schema: 2, entries: []}, s => s.retired_content = {schema: 1, entries: [null]}]) {
        const s = fixture(); mutate(s); variants.push(btoa(JSON.stringify(s)));
    }
    for(const encoded of variants) {
        const target = storage();
        await assert.rejects(importSaveFile(encoded, {currentVersion: VERSION, preflight: () => assert.fail("must not preflight"), storage: target, key: "save data"}));
        assert.equal(target.value, "current-save"); assert.equal(target.writes, 0);
    }
});

test("real-loader rejection and storage failure do not perform premature writes", async () => {
    const target = storage();
    await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(fixture())), {
        currentVersion: VERSION, preflight: () => {throw new Error("unknown book or stance");}, storage: target, key: "save data"}));
    assert.equal(target.writes, 0);
    await assert.rejects(importSaveFile(encodeSaveFile(JSON.stringify(fixture())), {
        currentVersion: VERSION, preflight: async () => {}, storage: {setItem() {throw new Error("quota");}}, key: "save data"}), /quota/);
});

test("successful import commits only after preflight and retains retirement data once", async () => {
    const s = fixture(); s["current location"] = "Jade Hollow";
    s.cultivation = {schema: 1, qi: 78};
    s.character.inventory[JSON.stringify({id: "Dewleaf"})] = {count: 7};
    const target = storage();
    const options = {currentVersion: VERSION, preflight: async save => {
        assert.equal(target.writes, 0); assert.equal(save["current location"], "Village");
    }, storage: target, key: "save data"};
    const imported = await importSaveFile(encodeSaveFile(JSON.stringify(s)), options);
    assert.equal(target.writes, 1);
    assert.equal(imported.retired_content.entries.length, 3);
    const second = decodeSaveFile(encodeSaveFile(target.value), VERSION);
    assert.deepEqual(second, imported);
});

test("failed export creation never encodes an undefined or invalid payload", () => {
    for(const value of [undefined, null, "", "undefined", "null", "[]"]) assert.throws(() => encodeSaveFile(value));
});
