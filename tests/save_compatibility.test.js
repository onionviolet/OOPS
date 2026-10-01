import test from "node:test";
import assert from "node:assert/strict";
import {prepareFoundationSave, retainRetiredContent} from "../src/save_compatibility.js";

test("base saves gain no dormant payload and their state is unchanged", () => {
    const original = {"current location": "Village", character: {money: 50}, skills: {Combat: {total_xp: 100}}};
    const {save, retired} = prepareFoundationSave(original);
    assert.deepEqual(retainRetiredContent(save, retired), original);
});

test("prototype location, items, recipes and activity are preserved outside active content", () => {
    const herb = JSON.stringify({id: "Dewleaf"});
    const original = {"current location": "Jade Hollow", cultivation: {schema: 1, qi: 78, trial: {progress: 6}},
        current_activity: {activity_id: "meditating"}, character: {money: 50, inventory: {[herb]: {count: 7}, bread: {count: 2}}},
        player_storage: {inventory: {[herb]: {count: 4}}}, locations: {"Jade Hollow": {is_unlocked: true}, Village: {}},
        recipes: {cooking: {items: {"Dewleaf tea": {is_unlocked: true}}}}, favourite_locations: {"Jade Hollow": true},
        skills: {Meditation: {total_xp: 50}}};
    const before = structuredClone(original);
    const {save, retired} = prepareFoundationSave(original);
    assert.deepEqual(original, before);
    assert.equal(save["current location"], "Village");
    assert.equal(save.current_activity, undefined);
    assert.equal(save.character.inventory[herb], undefined);
    assert.equal(save.player_storage.inventory[herb], undefined);
    assert.equal(save.character.money, 50);
    assert.deepEqual(save.skills, original.skills);
    assert.deepEqual(retired.entries.find(e => e.path[0] === "cultivation").value, original.cultivation);
    assert.equal(retired.entries.find(e => e.path.join("/") === `character/inventory/${herb}`).value.count, 7);
    const encoded = JSON.parse(JSON.stringify(retainRetiredContent(save, retired)));
    const again = prepareFoundationSave(encoded);
    assert.deepEqual(again.save, save);
    assert.deepEqual(again.retired, retired);
});

test("unsupported cultivation payloads stay opaque, but unknown retirement schemas block migration", () => {
    const state = {cultivation: {schema: 99, newField: "preserve"}};
    assert.deepEqual(prepareFoundationSave(state).retired.entries[0].value, state.cultivation);
    assert.throws(() => prepareFoundationSave({retired_content: {schema: 2, entries: []}}), /Unsupported/);
});
