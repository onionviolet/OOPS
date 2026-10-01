import {Location, LocationActivity, locations} from "../../src/locations.js";
import {Material, item_templates} from "../../src/items.js";
import {ItemRecipe, recipes} from "../../src/crafting_recipes.js";
import {REGION} from "./cultivation.js";

export function registerCultivationContent() {
    const descriptions = {
        "Dewleaf": "A spiritual herb from Jade Hollow. Brew 2 into tea with Cooking, or refine 4 into a Meridian pellet with Alchemy.",
        "Dewleaf tea": "Drink in the cultivation panel for 20 + Cooking level qi and 10 preparation. Not an automatic combat consumable.",
        "Meridian pellet": "Use in the cultivation panel for 30 + Alchemy level preparation. Enables a formation route through the trial.",
    };
    for(const [name, description] of Object.entries(descriptions)) {
        item_templates[name] = new Material({name, id: name, description, value: 1, saturates_market: false, material_type: "cultivation preparation"});
    }
    for(const [name, category, skill, count] of [["Dewleaf tea", "cooking", "Cooking", 2], ["Meridian pellet", "alchemy", "Alchemy", 4]]) {
        recipes[category].items[name] = new ItemRecipe({name, id: name, recipe_type: "material",
            materials: [{material_id: "Dewleaf", count}], result: {result_id: name, count: 1},
            recipe_level: [1, 5], recipe_skill: skill, success_chance: [1, 1]});
    }
    const hollow = new Location({name: REGION, id: REGION,
        description: "A narrow trail ends at terraces of dewleaf and a weathered trial circle. The valley's pressure can be endured through body conditioning or guided through alchemy. Both lead to the same first breakthrough.",
        connected_locations: [{location: locations.Village, travel_time: 10}],
        market_region: "Village", is_temperature_static: true, static_temperature: 18,
        crafting: {is_unlocked: true, use_text: "Use the valley workshop", tiers: {...locations.Village.crafting.tiers}},
        entrance_rewards: {skills: ["Meditation"]},
    });
    hollow.activities = {
        meditating: new LocationActivity({activity_name: "meditating", starting_text: "Circulate qi", skill_xp_per_tick: 2}),
        weightlifting: new LocationActivity({activity_name: "weightlifting", starting_text: "Condition your body", skill_xp_per_tick: 2}),
        herbalism: new LocationActivity({activity_name: "herbalism", starting_text: "Harvest dewleaf (sickle required)",
            xp_given_per_working_period: true, skill_xp_per_tick: 8,
            gained_resources: {time_period: [8, 4], skill_required: [0, 20], resources: [{name: "Dewleaf", chance: [1, 1], ammount: [[1,1], [2,2]]}]}}),
    };
    for(const [id, activity] of Object.entries(hollow.activities)) activity.activity_id = id;
    locations[REGION] = hollow;
    locations.Village.connected_locations.push({location: hollow, travel_time: 10});
}
