import test from 'node:test';
import assert from 'node:assert/strict';
import {FORT, registerFortItems, registerFortRecipes, registerFortEnemies, registerFortQuest, registerFortLocations} from '../src/fork_fort_content.js';
import {process_conditions} from '../src/conditions.js';
class Definition {constructor(data) {Object.assign(this, data); this.actions ??= {}; this.connected_locations ??= [];}}
function content() {
    const item_templates = {}, book_stats = {}, enemy_templates = {}, quests = {};
    const recipes = {crafting: {items: {}}, smelting: {items: {}}};
    const camp = new Definition({name: 'Mountain camp'}), village = new Definition({name: 'Village'});
    const locations = {'Mountain camp': camp, Village: village};
    registerFortItems({item_templates, book_stats, Book: Definition, BookData: Definition, Material: Definition});
    registerFortRecipes({recipes, ItemRecipe: Definition});
    registerFortEnemies({enemy_templates, Enemy: Definition});
    registerFortQuest({quests, Quest: Definition, QuestTask: Definition});
    registerFortLocations({locations, SafeLocation: Definition, CombatZone: Definition, LocationCrafting: Definition, GameAction: Definition});
    return {item_templates, book_stats, enemy_templates, quests, recipes, locations, village, camp};
}
test('Fort remains a separately opted-in branch of the earned camp; opening untouched', () => {
    const c = content();
    assert.deepEqual(c.village.actions, {}); assert.deepEqual(c.village.connected_locations, []);
    assert.equal(c.camp.actions[FORT.offer].is_unlocked, true);
    assert.equal(c.camp.actions[FORT.offer].repeatable, undefined); // native default false
    for (const id of [FORT.outskirts, FORT.court, FORT.dungeon]) {
        assert.equal(c.locations[id].is_unlocked, false);
        assert.equal(c.locations[id].name, id); // native reward/action joins key by displayed name
    }
    assert.equal(c.camp.actions[FORT.search].is_unlocked, false);
    assert.equal(c.locations[FORT.outskirts].actions[FORT.prepare].is_unlocked, false);
});
test('generated definition graph connects books, quest tasks, drops, native recipes and dungeon', () => {
    const c = content();
    assert.deepEqual(c.book_stats[FORT.lead].rewards.quests, [FORT.quest]);
    assert.deepEqual(c.camp.actions[FORT.search].rewards.quest_progress, [{quest_id: FORT.quest, task_index: 0}]);
    const court = c.locations[FORT.court];
    for (const group of court.enemy_groups_list) for (const id of group.enemies) {
        assert.ok(c.enemy_templates[id]);
        assert.equal(c.enemy_templates[id].name, id); // native bestiary keys by displayed name
        for (const drop of c.enemy_templates[id].loot_list) assert.ok(c.item_templates[drop.item_name]);
    }
    for (const r of court.first_reward.recipes) assert.ok(c.recipes[r.category][r.subcategory][r.recipe_id]);
    assert.deepEqual(c.locations[FORT.dungeon].first_reward.items, [FORT.journal]);
    assert.equal(c.locations[FORT.dungeon].repeatable_reward, undefined);
    assert.equal(c.book_stats[FORT.journal].rewards.quest_progress[0].task_index, 4);
    assert.equal(c.quests[FORT.quest].quest_tasks.length, 5);
    assert.equal(new Set(Object.values(FORT)).size, Object.values(FORT).length);
});
test('stair requires actual crafted brace and wool and consumes both only at settlement', () => {
    const c = content(), action = c.locations[FORT.outskirts].actions[FORT.prepare];
    let inventory = {}, removals = [];
    const character = {getFullStats: () => ({}), getTotalSkillLevel: () => 0, getItems: () => inventory, getLevelableComponent: () => ({})};
    const context = {character, full_stats: {}, remove_items_from_character_inventory: rows => {removals.push(...rows);}};
    assert.equal(process_conditions([action.start_conditions], context), 0);
    inventory = {[JSON.stringify({id: FORT.brace})]: {count: 1}, [JSON.stringify({id: 'Wool'})]: {count: 2}};
    assert.equal(process_conditions([action.start_conditions], context), 1);
    assert.deepEqual(removals, []);
    assert.equal(process_conditions(action.success_conditions, context), 1);
    assert.deepEqual(removals, []); // conditions are read-only; native action settlement consumes
    for (const id of [FORT.brace, 'Wool']) assert.equal(action.success_conditions[0].items_by_id[id].remove, true);
});
test('only additive registries, no foreign progression bonuses', () => {
    const c = content();
    for (const data of Object.values(c.book_stats)) {assert.equal(data.literacy_xp_rate, 0); assert.equal(data.bonuses, undefined);}
    for (const category of Object.values(c.recipes)) for (const r of Object.values(category.items)) {
        assert.equal(r.is_unlocked, false); assert.deepEqual(r.success_chance, [1, 1]);
    }
});
