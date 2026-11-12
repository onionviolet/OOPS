// Component materials: the native material table that fills crafting
// components (crafting_component_filling.js) and that the fabrication
// packs read for part strength (craft_assembly_village.js). Data only.
/*
    GENERATES CRAFTING COMPONENTS BASED ON PROVIDED PROPERTIES AND PARAMETERS
    EACH MATERIAL CAN SPECIFY WHICH COMPONENT TYPES TO CREATE, USE THAT TO SKIP ONES YOU WANT TO FILL YOURSELF
    DOES NOT (YET?) SUPPORT CUSTOM DESCRIPTIONS FOR EACH TYPE

    DOES NOT AUTO-FILL CRAFTING RECIPES, DO IT MANUALLY AND MAKE SURE NAMES MATCH

    PROVIDED DATA HAS NO DIRECT RELATION TO MATERIALS DEFINED IN items.js, ALLOWING SLIGHTLY INCREASED DEGREE OF FREEDOM,
    e.g. YOU CAN SPLIT SOME MATERIAL INTO MULTIPLE SEPARATE ENTRIES USED FOR DIFFERENT COMPONENTS

    CAPES ARE SKIPPED, AS THEY ARE EXPECTED TO BE MUCH MORE VARIED IN STATS

    THIS IS ONLY A TOOL TO MAKE ADDING NEW MATERIALS TAKE LESS WORK,
    IF NEEDED ANYTHING CAN BE SKIPPED IN FAVOUR OF ADDING IT MANUALLY IN items.js

    STATS:
        tier - affects multiple stats and value
        weight - affects weapon dmg, attack speed (negatively), and shield block
        strength - affects weapon dmg and shield block; hardness = strength/100 slows wear
        toughness - optional; slows wear (chipping/fracture), derived from strength when absent
        handling - affects dexterity on clothing
        warmth - affects cold resistance

    "name": {
        tier: Number,
        weight: Number,
        strength: Number,
        warmth: Number,
        handling: Number,
        types: Array,
        additional_stats: {
            stat_name: {
                stat bonus type (multiplier/flat): Number,
            }
        }
    },
*/

export const component_types = {
    SHORT_BLADE: "short blade",
    LONG_BLADE: "long blade",
    AXE_HEAD: "axe head",
    HAMMER_HEAD: "hammer head",

    SHORT_HANDLE: "short handle",
    MEDIUM_HANDLE: "medium handle",
    LONG_HANDLE: "long handle",
    
    SHIELD_HANDLE: "shield handle",
    SHIELD_BASE: "shield base",

    HELMET_INTERIOR: "helmet interior",
    CHESTPLATE_INTERIOR: "chestplate interior",
    LEG_ARMOR_INTERIOR: "leg armor interior",
    SHOE_INTERIOR: "shoes interior",
    GLOVE_INTERIOR: "glove interior",

    HELMET_EXTERIOR: "helmet exterior",
    CHESTPLATE_EXTERIOR: "chestplate exterior",
    LEG_ARMOR_EXTERIOR: "leg armor exterior",
    SHOE_EXTERIOR: "shoes exterior",
    GLOVE_EXTERIOR: "glove exterior",
};

export const ALL_WEAPON_HEADS = [component_types.SHORT_BLADE, component_types.LONG_BLADE, component_types.AXE_HEAD, component_types.HAMMER_HEAD];
export const ALL_WEAPON_HANDLES = [component_types.SHORT_HANDLE, component_types.MEDIUM_HANDLE, component_types.LONG_HANDLE];
export const ALL_SHIELD_COMPS = [component_types.SHIELD_HANDLE, component_types.SHIELD_BASE];

export const ALL_INTERIORS = [component_types.HELMET_INTERIOR, component_types.CHESTPLATE_INTERIOR, component_types.LEG_ARMOR_INTERIOR, component_types.SHOE_INTERIOR, component_types.GLOVE_INTERIOR];
export const ALL_EXTERIORS = [component_types.HELMET_EXTERIOR, component_types.CHESTPLATE_EXTERIOR, component_types.LEG_ARMOR_EXTERIOR, component_types.SHOE_EXTERIOR, component_types.GLOVE_EXTERIOR];

/**
 * 100 is a default value for most cases
 * 50 is the minimum weight for weapon handles, going lower will result in heavier components of same material being faster (i.e. long faster than short)
 * 60 is the minimum strength for shield bases
 * 
 * 
 */
export const material_properties = {
    "rough wood": {
        family: "wood",
        tier: 1,
        weight: 60,
        strength: 60,
        name: "simple wooden",
        types: [
            ...ALL_WEAPON_HANDLES,
            ...ALL_SHIELD_COMPS
        ],
    },
    "cheap iron": {
        family: "metal",
        tier: 1,
        weight: 100,
        strength: 100,
        toughness: 45, //cheap cast iron: as hard as steel but brittle, it chips and cracks sooner (dial; derived default would be 70)
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 35,
    },
    "cheap leather": {
        family: "fiber",
        tier: 1,
        weight: 60,
        strength: 70,
        handling: 50,
        warmth: 110,
        types: [
            component_types.HELMET_INTERIOR, component_types.CHESTPLATE_INTERIOR, component_types.LEG_ARMOR_INTERIOR, component_types.SHOE_INTERIOR
            //no glove, material implied to be too crappy for them
        ]
    },
    "wood": {
        family: "wood",
        tier: 2,
        weight: 60,
        strength: 60,
        types: [
            ...ALL_WEAPON_HANDLES,
            ...ALL_SHIELD_COMPS,
        ],
        name: "wooden",
    },
    "iron": {
        family: "metal",
        tier: 2,
        weight: 100,
        strength: 100,
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 80,
    },
    "iron chainmail": {
        family: "metal",
        tier: 2,
        weight: 100,
        strength: 100,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        base_value: 120,
    },
    "wolf leather": {
        family: "fiber",
        tier: 2,
        weight: 60,
        strength: 60,
        warmth: 100,
        types: [
            ...ALL_EXTERIORS,
        ],
    },
    "leather": {
        family: "fiber", //this is wolf leather too, but different stats for interiors
        tier: 2,
        weight: 60,
        strength: 70,
        warmth: 110,
        handling: 20,
        types: [
            ...ALL_INTERIORS,
        ],
    },
    "wool": {
        family: "fiber",
        tier: 2,
        weight: 40,
        strength: 50,
        warmth: 140,
        handling: 80,
        types: [
            ...ALL_INTERIORS,
        ],
    },
    "ash wood": {
        family: "wood",
        tier: 3,
        weight: 60,
        strength: 60,
        types: [
            ...ALL_WEAPON_HANDLES,
            ...ALL_SHIELD_COMPS,
        ]
    },
    "weak bone": {
        family: "bone",
        tier: 3,
        weight: 80,
        strength: 80,
        types: [
            ...ALL_WEAPON_HANDLES,
        ]
    },
    "steel": {
        family: "metal",
        tier: 3,
        weight: 100,
        strength: 100,
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 120,
    },
    "steel chainmail": {
        family: "metal",
        tier: 3,
        weight: 100,
        strength: 100,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 240,
    },
    "steel plate": {
        family: "metal",
        tier: 3,
        weight: 160,
        strength: 160,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 360,
    },
    "boar leather": {
        family: "fiber",
        tier: 3,
        weight: 60,
        strength: 60,
        warmth: 100,
        types: [
            ...ALL_EXTERIORS,
        ]
    },
    "goat leather": {
        family: "fiber",
        tier: 3,
        weight: 60,
        strength: 100,
        warmth: 110,
        handling: 20,
        types: [
            ...ALL_INTERIORS,
        ]
    },
    "hickory": {
        family: "wood",
        tier: 4,
        weight: 60,
        strength: 60,
        types: [
            ...ALL_WEAPON_HANDLES,
            ...ALL_SHIELD_COMPS
        ]
    },
    "turtleshell": {
        family: "bone",
        tier: 4,
        weight: 80,
        strength: 80,
        types: [
            ...ALL_WEAPON_HANDLES,
        ],
        additional_stats: {
            attack_points: {
                multiplier: 1.1,
            }
        }
    },
    "turtleshell plate": {
        family: "bone",
        tier: 4,
        weight: 80,
        strength: 80,
        types: [
            ...ALL_SHIELD_COMPS,
            ...ALL_EXTERIORS,
        ],
        name: "turtleshell"
    },
    "frumious": {
        family: "unclassified",
        tier: 4,
        weight: 80,
        strength: 80,
        types: [
            component_types.SHORT_BLADE,
        ]
    },
    "white iron": {
        family: "metal",
        tier: 4,
        weight: 130,
        strength: 100,
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 160,
    },
    "white iron chainmail": {
        family: "metal",
        tier: 4,
        weight: 130,
        strength: 100,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 320,
    },
    "white iron plate": {
        family: "metal",
        tier: 4,
        weight: 200,
        strength: 200,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 480,
    },
    "black iron": {
        family: "metal",
        tier: 4,
        weight: 80,
        strength: 110,
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 160,
    },
    "black iron chainmail": {
        family: "metal",
        tier: 4,
        weight: 80,
        strength: 110,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 320,
    },
    "black iron plate": {
        family: "metal",
        tier: 4,
        weight: 140,
        strength: 180,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 480,
    },
    "bear leather": {
        family: "fiber",
        tier: 4,
        weight: 60,
        strength: 60,
        warmth: 100,
        types: [
            ...ALL_EXTERIORS,
        ]
    },
    "turtle shellplate": {
        family: "bone",
        tier: 4,
        weight: 100,
        strength: 140,
        warmth: 100,
        types: [
            ...ALL_EXTERIORS,
        ]
    },
    "linen": {
        family: "fiber",
        tier: 4,
        weight: 50,
        strength: 50,
        warmth: 110,
        handling: 80,
        types: [
            ...ALL_INTERIORS,
        ],
    },
    "silk": {
        family: "fiber",
        tier: 5,
        weight: 40,
        strength: 40,
        warmth: 110,
        handling: 100,
        types: [
            ...ALL_INTERIORS,
        ],
    },
    "alchemical wood": {
        family: "wood",
        tier: 5,
        weight: 60,
        strength: 60,
        types: [
            ...ALL_WEAPON_HANDLES,
            ...ALL_SHIELD_COMPS,
        ]
    },
    "white steel": {
        family: "metal",
        tier: 5,
        weight: 130,
        strength: 100,
        warmth: 80,
        name: "white",
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 200,
    },
    "white chainmail": {
        family: "metal",
        tier: 5,
        weight: 100,
        strength: 120,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 400,
    },
    "white plate": {
        family: "metal",
        tier: 5,
        weight: 200,
        strength: 240,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 600,
    },
    "black steel": {
        family: "metal",
        tier: 5,
        weight: 80,
        strength: 110,
        warmth: 80,
        name: "black",
        types: [
            ...ALL_WEAPON_HEADS,
            ...ALL_WEAPON_HANDLES,
            component_types.SHIELD_BASE,
        ],
        value: 200,
    },
    "black chainmail": {
        family: "metal",
        tier: 5,
        weight: 80,
        strength: 110,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 400,
    },
    "black plate": {
        family: "metal",
        tier: 5,
        weight: 140,
        strength: 180,
        warmth: 80,
        types: [
            ...ALL_EXTERIORS,
        ],
        value: 600
    },
    "alligator": {
        family: "fiber",
        tier: 5,
        weight: 60,
        strength: 60,
        warmth: 90,
        types: [
            ...ALL_EXTERIORS,
        ]
    },
    "snakeskin": {
        family: "fiber",
        tier: 5,
        weight: 60, //a bit heavier than usual but with separate atk spd bonus
        strength: 100,
        warmth: 90,
        handling: 100,
        types: [
            ...ALL_INTERIORS,
        ],
        additional_stats: {
            attack_speed: {
                multiplier: 1.02,
            }
        }
    },
    "monster bone": {
        family: "bone",
        tier: 5,
        weight: 80,
        strength: 80,
        types: [
            ...ALL_WEAPON_HANDLES,
        ]
    },
};
