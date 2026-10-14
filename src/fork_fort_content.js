/* FNA05 opt-in proposal. Connected content pattern adapted from
 * SchokoKaramel/yet-another-idle-rpg, MIT, commits
 * 34df88733842b0f384a509f0aa15ec8b523f1081 and
 * 37c93d9fe0b7a37c5600ca117950318997926a4b.
 * Upstream copyright (c) 2021 Miktaew; LICENSE retains its MIT notice.
 * Fiction and bounded salvage/entry design reauthored for base.frontier.
 * No Cultivation, global XP, drop-rate or progression-curve changes.
 */
export const FORT = Object.freeze({
    lead: 'Frontier fort route notes', journal: 'Frontier fort keeper journal',
    quest: 'frontier.fort.quest', offer: 'frontier.fort.offer', search: 'frontier.fort.search',
    prepare: 'frontier.fort.prepare', outskirts: 'Fort approach',
    court: 'Fort courtyard', dungeon: 'Fort dungeon',
    skeleton: 'Fort skeleton', guard: 'Fort skeleton guard', captive: 'Fort chained skeleton',
    bone: 'Frontier fort old bone', wool: 'Frontier fort torn wool', linen: 'Frontier fort torn linen',
    shackle: 'Frontier fort rusted shackle', brace: 'Frontier fort bone brace',
    boneRecipe: 'frontier.fort.bone_brace', woolRecipe: 'frontier.fort.unravel_wool',
    linenRecipe: 'frontier.fort.unravel_linen', ironRecipe: 'frontier.fort.recycle_shackle',
});
const progress = task_index => ({quest_id: FORT.quest, task_index});
const recipe = (category, recipe_id) => ({category, subcategory: 'items', recipe_id});

export function registerFortItems({item_templates, book_stats, Book, BookData, Material}) {
    for (const [id, description, material_type] of [
        [FORT.bone, 'A dry bone recovered from a moving skeleton. Sound sections can brace the collapsed stair.', 'fort bone'],
        [FORT.wool, 'A ragged wool sleeve, recoverable as ordinary wool.', 'fort cloth'],
        [FORT.linen, 'A linen wrapping with enough sound fibre to unravel.', 'fort cloth'],
        [FORT.shackle, 'A corroded iron restraint. Its sound metal can be recycled.', 'fort scrap'],
        [FORT.brace, 'A fitted brace made for the fort stair. It needs wool packing to sit firmly.', 'fort brace'],
    ]) item_templates[id] = new Material({name: id, description, material_type, value: 0});
    item_templates[FORT.lead] = new Book({name: FORT.lead, value: 0,
        description: 'Optional Fort proposal. A camp survey folio marks a ruined watchpost above the mountain. Reading it begins a separate expedition; the village needs no such detour.'});
    book_stats[FORT.lead] = new BookData({required_time: 6, literacy_xp_rate: 0,
        rewards: {quests: [FORT.quest], actions: [{location: 'Mountain camp', action: FORT.search}]}});
    item_templates[FORT.journal] = new Book({name: FORT.journal, value: 0,
        description: 'The watchpost keeper recorded repairs, shortages and the last safe stair measurements. Reading completes the expedition record.'});
    book_stats[FORT.journal] = new BookData({required_time: 8, literacy_xp_rate: 0,
        rewards: {quest_progress: [progress(4)], messages: ['You finish the keeper’s journal and record the fort expedition.']}});
}

export function registerFortRecipes({recipes, ItemRecipe}) {
    for (const [category, id, name, material, result, count, skill] of [
        ['crafting', FORT.boneRecipe, 'Fit fort bone brace', FORT.bone, FORT.brace, 1, 'Crafting'],
        ['crafting', FORT.woolRecipe, 'Unravel fort wool', FORT.wool, 'Wool', 2, 'Crafting'],
        ['crafting', FORT.linenRecipe, 'Unravel fort linen', FORT.linen, 'Flax', 2, 'Crafting'],
        ['smelting', FORT.ironRecipe, 'Recycle fort shackle', FORT.shackle, 'Iron ingot', 1, 'Smelting'],
    ]) recipes[category].items[id] = new ItemRecipe({id, name, is_unlocked: false, recipe_type: 'material',
        materials: [{material_id: material, count: 1}], result: {result_id: result, count},
        success_chance: [1, 1], recipe_level: [1, 1], recipe_skill: skill});
}

export function registerFortEnemies({enemy_templates, Enemy}) {
    for (const [id, name, health, attack, loot] of [
        [FORT.skeleton, 'Fort skeleton', 150, 60, [FORT.bone]],
        [FORT.guard, 'Fort skeleton guard', 250, 100, [FORT.wool, FORT.linen]],
        [FORT.captive, 'Fort chained skeleton', 280, 120, [FORT.shackle]],
    ]) enemy_templates[id] = new Enemy({id, name, description: 'An animated remnant within the ruined mountain watchpost.',
        xp_value: 0, rank: 5, size: 'medium', tags: ['undead', 'humanoid'],
        stats: {health, attack, agility: 40, dexterity: 40, intuition: 30, magic: 0, attack_speed: 1, defense: 10},
        loot_list: loot.map(item_name => ({item_name, chance: 1}))});
}

export function registerFortQuest({quests, Quest, QuestTask}) {
    quests[FORT.quest] = new Quest({quest_id: FORT.quest, quest_name: 'The mountain watchpost (proposal)',
        quest_description: 'An optional expedition from the established Mountain camp. Follow the folio, recover materials, prepare the stair and retrieve the keeper’s record.',
        quest_tasks: [
            'Follow the route notes from Mountain camp', 'Clear the fort courtyard and learn its salvage recipes',
            'Craft a bone brace and recover wool, then pack the stair at the fort approach',
            'Clear the fort dungeon and retrieve the keeper’s journal', 'Read the keeper’s journal',
        ].map(task_description => new QuestTask({task_description})), quest_rewards: {}});
}

export function registerFortLocations({locations, SafeLocation, CombatZone, LocationCrafting, GameAction}) {
    const camp = locations['Mountain camp'];
    // Physically reaching the earned camp is necessary. No inherited unlock is granted.
    camp.actions[FORT.offer] = new GameAction({action_id: FORT.offer, is_unlocked: true,
        starting_text: 'Take the watchpost route notes (optional proposal)',
        description: 'Choose a separate Fort expedition. You can leave this folio alone and continue the original campaign.',
        action_text: 'Checking the camp folio', success_text: 'You take the watchpost folio for an optional expedition.',
        rewards: {items: [FORT.lead]}});
    camp.actions[FORT.search] = new GameAction({action_id: FORT.search, is_unlocked: false,
        starting_text: 'Follow the watchpost route notes', description: 'An hour of careful scouting from the established camp.',
        action_text: 'Following the survey marks', attempt_duration: 60, keep_progress: true,
        success_text: 'The survey marks lead to a ruined watchpost. You mark a return route to camp.',
        rewards: {locations: [{location: FORT.outskirts}, {location: FORT.court}], quest_progress: [progress(0)]}});
    locations[FORT.outskirts] = new SafeLocation({id: FORT.outskirts, name: 'Fort approach', is_unlocked: false,
        description: 'A ruined watchpost above the mountain camp. Its courtyard and lower store rooms can be explored separately. The return route remains open.',
        connected_locations: [{location: camp, travel_time: 60}],
        crafting: new LocationCrafting({is_unlocked: true, use_text: 'Recover materials at the watchpost bench', tiers: {crafting: 1, smelting: 1}})});
    const approach = locations[FORT.outskirts];
    camp.connected_locations.push({location: approach, travel_time: 60});
    approach.actions[FORT.prepare] = new GameAction({action_id: FORT.prepare, is_unlocked: false,
        starting_text: 'Brace and pack the dungeon stair', description: 'Consumes one crafted fort brace and two wool. The packed stair gives a safe way down and back.',
        action_text: 'Packing the stair', attempt_duration: 5, keep_progress: true,
        failure_texts: {unable_to_begin: ['You need one crafted fort brace and two wool before working on the stair.'],
            conditional_loss: ['The brace and wool are no longer in your pack.']},
        start_conditions: {items_by_id: {[FORT.brace]: {count: 1}, Wool: {count: 2}}},
        success_conditions: [{items_by_id: {[FORT.brace]: {count: 1, remove: true}, Wool: {count: 2, remove: true}}}],
        success_text: 'The brace holds and the wool packing stops it slipping. The lower stair can now be used.',
        rewards: {locations: [{location: FORT.dungeon}], quest_progress: [progress(2)]}});
    locations[FORT.court] = new CombatZone({id: FORT.court, name: 'Fort courtyard', is_unlocked: false,
        description: 'Skeletons move through the broken drill yard. Recover sound bone and cloth before working on the lower stair.',
        parent_location: approach, enemy_count: 4, enemy_groups_list: [{enemies: [FORT.skeleton]}, {enemies: [FORT.guard]}],
        is_enemy_groups_list_random: false, enemy_group_size: [1, 1],
        first_reward: {recipes: [recipe('crafting', FORT.boneRecipe), recipe('crafting', FORT.woolRecipe), recipe('crafting', FORT.linenRecipe)],
            actions: [{location: FORT.outskirts, action: FORT.prepare}], quest_progress: [progress(1)]}});
    locations[FORT.dungeon] = new CombatZone({id: FORT.dungeon, name: 'Fort dungeon', is_unlocked: false,
        description: 'The braced stair descends to cramped store rooms. Chained skeletons block a dry records alcove.',
        parent_location: approach, enemy_count: 4, enemies_list: [FORT.captive], enemy_group_size: [1, 1],
        is_under_roof: true, types: [{type: 'narrow', stage: 1}],
        first_reward: {items: [FORT.journal], recipes: [recipe('smelting', FORT.ironRecipe)], quest_progress: [progress(3)]}});
    approach.connected_locations.push({location: locations[FORT.court], travel_time: 5}, {location: locations[FORT.dungeon], travel_time: 5});
}
