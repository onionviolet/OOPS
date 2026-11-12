"use strict";
import { Armor, ArmorComponent, item_templates, ShieldComponent, WeaponComponent } from "./items.js";
import { materialToughness, paddingDimensions, shellDimensions } from "./gear_dimensions.js";
import { capitalize_first_letter } from "./display.js";
import { component_types, ALL_WEAPON_HEADS, ALL_WEAPON_HANDLES, ALL_SHIELD_COMPS, ALL_INTERIORS, ALL_EXTERIORS, material_properties } from "./component_materials.js";





const base_value = 35; // * tier * mat_count



const custom_names = {"linen": {}, "wool": {}, "silk": {}, "iron chainmail": {}, "steel chainmail": {}, "snakeskin": {}};
custom_names["linen"][component_types.HELMET_INTERIOR] = "Linen bandanna";
custom_names["silk"][component_types.HELMET_INTERIOR] = "Silk bandanna";
custom_names["linen"][component_types.LEG_ARMOR_INTERIOR] = "Linen leggings";
custom_names["wool"][component_types.CHESTPLATE_INTERIOR] = "Wool shirt";
custom_names["silk"][component_types.CHESTPLATE_INTERIOR] = "Silk shirt";
custom_names["iron chainmail"][component_types.CHESTPLATE_EXTERIOR] = "Iron chainmail vest";
custom_names["steel chainmail"][component_types.CHESTPLATE_EXTERIOR] = "Steel chainmail vest";
custom_names["snakeskin"][component_types.LEG_ARMOR_INTERIOR] = "Snakeskin leggings";
custom_names["snakeskin"][component_types.SHOE_INTERIOR] = "Snakeskin boots";


const armor_names = {};
armor_names[component_types.CHESTPLATE_EXTERIOR] = "armor";
armor_names[component_types.GLOVE_EXTERIOR] = "gloves";
armor_names[component_types.HELMET_EXTERIOR] = "helmet";
armor_names[component_types.SHOE_EXTERIOR] = "shoes";
armor_names[component_types.LEG_ARMOR_EXTERIOR] = "armored pants";

/**
 * weight impact on dmg
 */
const weight_impact_per_type = {
    "short handle": 1,
    "medium handle": 3,
    "long handle": 8,

    "short blade": 0,
    "long blade": 0.5,
    "axe head": 5,
    "hammer head": 12,
};

const weight_impact_on_speed_per_type = {
    "short handle": 1,
    "medium handle": 5,
    "long handle": 12,

    "short blade": 0.5,
    "long blade": 2,
    "axe head": 4,
    "hammer head": 6,
};

/**
 * material str impact on damage
 */
const strength_impact_per_type = {
    "short blade": 8,
    "long blade": 7,
    "axe head": 2,
    "hammer head": 1,
}

const material_count_per_type = {
    "short blade": 2,
    "long blade": 3,
    "axe head": 4,
    "hammer head": 4,

    "short handle": 1,
    "medium handle": 2,
    "long handle": 4,
    
    "shield handle": 4,
    "shield base": 6,

    "helmet interior": 3,
    "chestplate interior": 5,
    "leg armor interior": 3,
    "glove interior": 2,
    "shoes interior": 2,

    "helmet exterior": 3,
    "chestplate exterior": 5,
    "leg armor exterior": 3,
    "glove exterior": 2,
    "shoes exterior": 2,
};

/**
 * exactly what it says
 * @param {*} comp_type 
 * @returns proper name used in items, defaulting to comp type if not needed
 */
const type_to_name = (comp_type)=>{
    switch(comp_type) {
        case "chestplate interior": 
            return "vest";
        case "helmet interior":
            return "hat";
        case "leg armor interior":
            return "pants";
        case "glove interior":
            return "gloves";
        case "shoes interior":
            return "shoes";
        case "chestplate exterior": 
            return "chestplate armor";
        case "helmet exterior":
            return "helmet armor";
        case "leg armor exterior":
            return "greaves";
        case "glove exterior":
            return "glove armor";
        case "shoes exterior":
            return "shoe armor";
        default:
            return comp_type;
    }
}

const base_attack = 3;


/**
 * quickie for adding stats to component_stats
 * @param {*} target component_stats
 * @param {*} properties e.g. {agility: {multiplier: some_value}}
 */
const add_properties = (target, properties) => {
    Object.keys(properties).forEach(property => {
        if(!target[property]) {
            target[property] = {};
        }

        Object.keys(properties[property]).forEach(subproperty => {
            if(!target[property][subproperty]) {
                target[property][subproperty] = properties[property][subproperty];
            } else {
                if(subproperty === "flat") {
                    target[property][subproperty] = Math.round(100*(properties[property][subproperty] + target[property][subproperty]))/100;
                } else if(subproperty === "multiplier") {
                    target[property][subproperty] = Math.round(100*(properties[property][subproperty] * target[property][subproperty]))/100;
                }
            }
        });
    });
}

const crafting_component_manager = {

    /**
     * Fills components for item_templates; does NOT create crafting recipes
     */
    fill_components: () => {
        Object.keys(material_properties).forEach(material_key => {
            const material = material_properties[material_key];
            
            for(let i = 0; i < material.types.length; i++) {
                let description;
                let component_stats = structuredClone(material.additional_stats) || {};

                const item_id = custom_names[material_key]?.[material.types[i]] || (capitalize_first_letter(material.name || material_key) + " " + type_to_name(material.types[i]));
                let item;

                let material_count = material_count_per_type[material.types[i]];
                const item_value = (material.value ? Math.round(material.value * material_count) : Math.round(material.tier * base_value * material_count))+10;

                switch(material.types[i]) {
                    case component_types.SHORT_BLADE:
                        description = `A short blade made of ${material_key}, perfect for a dagger or a spear`;
                        break;
                    case component_types.LONG_BLADE:
                        description = `A long blade made of ${material_key}, perfect for a sword`;
                        break;
                    case component_types.AXE_HEAD:
                        description = `An axe head made of ${material_key}`;
                        break;
                    case component_types.HAMMER_HEAD:
                        description = `A hammer head made of ${material_key}`;
                        break;       
                }
                
                if(ALL_WEAPON_HEADS.includes(material.types[i])) {
                    //WEAPON HEADS

                    let attack_value = base_attack * (1 + strength_impact_per_type[material.types[i]]*(material.strength/100)) * material.tier * (1 + weight_impact_per_type[material.types[i]]*(material.weight/100))/8;

                    let attack_speed = Math.round(100*
                        (1 + (material.tier-1)/10)/(1 + (weight_impact_on_speed_per_type[material.types[i]]*material.weight)/1000)
                    )/100;

                    if(material.types[i] === component_types.SHORT_BLADE) {
                        //CRIT BONUS FOR SHORT BLADES
                        let crit_rate = Math.round(100 * 0.05 * (material.tier)**0.6)/100; //scaling with tier **0.6 to reduce it on higher ranks
                        if(component_stats.crit_rate?.flat) {
                            component_stats.crit_rate.flat += crit_rate;
                        } else {
                            if(!component_stats.crit_rate) component_stats.crit_rate = {};
                            component_stats.crit_rate.flat = crit_rate;
                        }
                        let EP_multi = 1 +  0.05 * material.tier;
                        if(component_stats.evasion_points?.multiplier) {
                            component_stats.evasion_points.multiplier *= EP_multi;
                        } else {
                            if(!component_stats.evasion_points) component_stats.evasion_points = {};
                            component_stats.evasion_points.multiplier = EP_multi;
                        }
                    } else if(material.types[i] === component_types.LONG_BLADE) {
                        //AP BONUS FOR LONG BLADES 
                        let AP_multi = 1 +  0.05 * material.tier;
                        if(component_stats.attack_points?.multiplier) {
                            component_stats.attack_points.multiplier *= AP_multi;
                        } else {
                            if(!component_stats.attack_points) component_stats.attack_points = {};
                            component_stats.attack_points.multiplier = AP_multi;
                        }

                        //SMALLER CRIT BONUS FOR SHORT BLADES
                        let crit_rate = Math.round(100 * 0.02 * (material.tier)**0.6)/100;
                        if(component_stats.crit_rate?.flat) {
                            component_stats.crit_rate.flat += crit_rate;
                        } else {
                            if(!component_stats.crit_rate) component_stats.crit_rate = {};
                            component_stats.crit_rate.flat = crit_rate;
                        }
                    }
                    
                
                    item = new WeaponComponent({
                        name: item_id,
                        id: item_id,
                        description,
                        component_type: material.types[i],
                        value: item_value,
                        name_prefix: capitalize_first_letter(material.name || material_key),
                        component_tier: material.tier,
                        attack_value: Math.abs(attack_value)<10?Math.floor(attack_value*10)/10:Math.floor(attack_value),
                                    
                        component_stats: {
                            ...component_stats,
                            attack_speed: {
                                multiplier: attack_speed,
                            },
                        }
                    });

                } else if(ALL_WEAPON_HANDLES.includes(material.types[i])) {
                    //WEAPON HANDLES
                    
                    let attack_multiplier = Math.floor(100*(
                        1 + (1 + material.tier/20) * (1 + weight_impact_per_type[material.types[i]]*(material.weight - 40))/1000
                    ))/100;

                    let attack_speed = Math.floor(100*(
                        (1 + material.tier/20)/(1 + (weight_impact_on_speed_per_type[material.types[i]]*(material.weight - 50))/1000)
                    ))/100;

                    if(component_stats.attack_speed?.multiplier) {
                        component_stats.attack_speed.multiplier *= attack_speed;
                    } else {
                        if(!component_stats.attack_speed) component_stats.attack_speed = {};
                        component_stats.attack_speed.multiplier = attack_speed;
                    }

                    if(component_stats.attack_power?.multiplier) {
                        component_stats.attack_power.multiplier *= attack_multiplier;
                    } else {
                        if(!component_stats.attack_power) component_stats.attack_power = {};
                        component_stats.attack_power.multiplier = attack_multiplier;
                    }
                    
                    item = new WeaponComponent({ 
                        name: item_id,
                        description,
                        component_type: material.types[i],
                        value: item_value,
                        name_prefix: capitalize_first_letter(material.name || material_key),
                        component_tier: material.tier,
                        component_stats,
                    });
                } else if(material.types[i] === component_types.SHIELD_HANDLE) {
                    item = new ShieldComponent({ 
                        name: item_id,
                        description,
                        component_type: material.types[i],
                        value: item_value,
                        name_prefix: capitalize_first_letter(material.name || material_key),
                        component_tier: material.tier,
                        component_stats: {
                             block_strength: {
                                multiplier: 1+Math.floor((material.tier-1)*2)/10,
                            }
                        }
                    });
                } else if(material.types[i] === component_types.SHIELD_BASE) {
                    item = new ShieldComponent({ 
                        name: item_id,
                        description,
                        component_type: material.types[i],
                        value: item_value,
                        //name_prefix: capitalize_first_letter(material.name || material_key),
                        component_tier: material.tier,
                        shield_name: capitalize_first_letter(material.name || material_key) + " shield",

                        shield_strength: Math.floor(
                            (1+(material.strength)/50)**2 * (1+(material.tier-1)/4)**2 * (1+(material.tier-2)/10)**2 * (1+(material.weight-30)/150)**2
                            //way too complicated
                        ),
                        component_stats: {
                            attack_speed: {
                                multiplier: Math.min(1,Math.floor(100*(1-((material.weight-50)/200)))/100)
                            },
                            attack_power: Math.min(1,Math.floor(100*(1-((material.weight-50)/250)))/100)
                        },
                    });
                } else if(ALL_INTERIORS.includes(material.types[i])) {

                        let agility_multiplier = 1;
                        let dexterity_multiplier = 1;
                        let attack_speed_multiplier = 1;
                        let cold_tolerance_bonus = 0;

                        if(material.types[i] ===  component_types.SHOE_INTERIOR) {
                            agility_multiplier = 1 + material.tier * 0.05;
                            attack_speed_multiplier = Math.round(100*(1.1 + (material.tier-1)*4/100))/100;
                        } else {
                            if(material.types[i] ===  component_types.GLOVE_INTERIOR) {
                                dexterity_multiplier = 1 + Math.round(material.tier * 0.05 * material.handling)/100;
                            } else {
                                agility_multiplier = Math.round(100*(1 - (material_count*(material.weight-50))/2500))/100;
                            }
                            attack_speed_multiplier = Math.round(100*Math.max(1,(1+(material.tier-1)/100) * (1+(50-material.weight)/500)))/100;
                        }

                        cold_tolerance_bonus = (material.warmth-100)/20;

                        if(agility_multiplier !== 1) {
                            add_properties(component_stats, {agility: {multiplier: agility_multiplier}});
                        }
                        if(dexterity_multiplier !== 1) {
                            add_properties(component_stats, {dexterity: {multiplier: dexterity_multiplier}});
                        }
                        if(attack_speed_multiplier !== 1) {
                            add_properties(component_stats, {attack_speed: {multiplier: attack_speed_multiplier}});
                        }
                        if(cold_tolerance_bonus !== 0) {
                            add_properties(component_stats, {cold_tolerance: {flat: cold_tolerance_bonus}});
                        }

                        add_properties(component_stats, paddingDimensions({tier: material.tier, warmth: material.warmth, partCount: material_count}));

                        item = new Armor({
                            name: item_id,
                            description,
                            component_type: material.types[i],
                            value: item_value,
                            name_prefix: capitalize_first_letter(material.name || material_key),
                            component_tier: material.tier,
                            base_defense: Math.floor(material.tier * material_count * (material.strength-50)/100),
                            component_stats,
                        });
                } else if(ALL_EXTERIORS.includes(material.types[i])) {

                        let agility_multiplier = 1;
                        let attack_speed_multiplier = 1;
                        let cold_tolerance_bonus = 0;
                        let stamina_efficiency_multiplier = 1;

                        agility_multiplier = Math.min(1,Math.round(100*(
                                1 - (material_count*(material.weight-50))/2500
                            ))/100);

                        attack_speed_multiplier = Math.min(1,Math.round(100*(
                            1 - (material_count*(material.weight-50))/5000
                        ))/100);

                        stamina_efficiency_multiplier = Math.min(1,Math.round(100*(
                            1 - (material_count*(material.weight-50))/2500
                        ))/100);

                        cold_tolerance_bonus = ((material.warmth || 100) - 100)/20;

                        if(agility_multiplier !== 1) {
                            add_properties(component_stats, {agility: {multiplier: agility_multiplier}});
                        }

                        if(attack_speed_multiplier !== 1) {
                            add_properties(component_stats, {attack_speed: {multiplier: attack_speed_multiplier}});
                        }

                        if(cold_tolerance_bonus !== 0) {
                            add_properties(component_stats, {cold_tolerance: {flat: cold_tolerance_bonus}});
                        }

                        if(stamina_efficiency_multiplier !== 1) {
                            add_properties(component_stats, {stamina_efficiency: {multiplier: stamina_efficiency_multiplier}});
                        }

                        add_properties(component_stats, shellDimensions({tier: material.tier, strength: material.strength, partCount: material_count}));

                        item = new ArmorComponent({
                            name: item_id,
                            description,
                            full_armor_name: capitalize_first_letter(material.name || material_key) + " " + armor_names[material.types[i]],
                            component_type: material.types[i],
                            value: item_value,
                            name_prefix: capitalize_first_letter(material.name || material_key),
                            component_tier: material.tier,
                            defense_value: Math.floor(material.tier * material_count * material.strength/100),
                            component_stats,
                        });
                }

                if(item) { //authored or derived material data, read by wear and the Attributes view (no save data)
                    const toughness = materialToughness(material);
                    item.material_strength = material.strength;
                    item.material_toughness = toughness.value;
                    item.material_toughness_source = toughness.source;
                    item.material_label = material.name || material_key;
                    item.material_weight = material.weight ?? 100;
                    item.material_warmth = material.warmth ?? 100;
                    item.material_family = material.family;
                }
                if(!item_templates[item_id]) {
                    item_templates[item_id] = item;
                } else {
                    console.error(`Item templates already include something with an id of "${item_id}",`
                        + ` please either remove it or remove "${material.types[i]}" from component types for material "${material_key}"`);
                }
            }
        });
    }
};



export { crafting_component_manager };