import {deepFreeze} from './basics.js';

// Stable kind ids join to docs/research/gu-identity-evidence.json.
// Each binding records the checked behavior and the authored choices in
// its runtime value. Source gaps and legends live in the evidence index.
export const guCatalogue = deepFreeze({
    thunderclap: {
        ability: {chapters: [150], observed: 'A frenzy wolf fires a fast thunderball and another specimen fires while the first is recovering.',
            authored: 'The Keeper uses two stored measures and doubles the effect with upper-stage essence.',
            value: {fuel: 'primeval', cost: 2, effect: {kind: 'lightning', magnitude: 1},
                stageFuel: {upper: {costFactor: 1, magnitudeFactor: 2}}}},
    },
    'water-shield': {
        ability: {chapters: [150], observed: 'The outer water shield breaks under Thunderclap and its Gu becomes dull.',
            authored: 'The loan uses rank two, stops five lightning damage and recovers from a break after twenty minutes.',
            value: {fuel: 'primeval', cost: 1, effect: {kind: 'water-guard', magnitude: 5}}},
    },
    'white-jade': {
        ability: {chapters: [150], observed: 'White Jade reduces the effect of the remaining electricity but does not soften the fall.',
            authored: 'The trial stops two residual lightning damage.',
            value: {fuel: 'primeval', cost: 1, effect: {kind: 'jade-guard', magnitude: 2}}},
    },
    'scale-armor': {
        recipe: {chapters: [123], observed: 'Fish Scale Gu can be fused into rank-two Scale Armor Gu.',
            authored: 'A shell laminate supplies the missing part of this local recipe.',
            value: {id: 'scale-armor-fusion', revision: 1, kind: 'scale-armor', rank: 2, recordLineage: true,
                ingredients: {scales: 'fish-scale'}, stages: [{id: 'laminate', inputs: [{material: 'shell-laminate', amount: 1}]},
                    {id: 'settle', inputs: []}]}},
        ability: {chapters: [123], observed: 'Qing Shu recommends the resulting rank-two Gu for defense.',
            authored: 'The Keeper trial spends two rank-one measures and stops three points of falling-stone impact.',
            value: {fuel: 'primeval', cost: 1, effect: {kind: 'impact-guard', magnitude: 3}}},
    },
    'earth-communication-ear-grass': {
        ability: {chapters: [129, 169], observed: 'Roots in the ground receive distant sounds through smoke, reaching about two hundred steps.',
            authored: 'The steward lends his attention and spends one stored dose per listening action.',
            value: {fuel: 'primeval', cost: 1, effect: {kind: 'ground-hearing', magnitude: 1, range: 200}}},
    },
    'thunder-shield': {
        ability: {chapters: [167], observed: 'A fleeing Gu forms a semicircular lightning shield and resists a grasp.',
            authored: 'Rank three and two stored white-silver measures power the ravine crossing.',
            value: {fuel: 'primeval', cost: 2, path: 'lightning', effect: {kind: 'lightning-shield', magnitude: 1}}},
    },
    'stealth-scales': {
        recipe: {chapters: [123, 127], observed: 'Fish Scale Gu and Stealth Rock Gu produce Stealth Scales.',
            authored: 'The Keeper aligns the specimens, then completes the fusion after a settling interval.',
            value: {id: 'stealth-scales-fusion', revision: 1, kind: 'stealth-scales', rank: 2, recordLineage: true,
                ingredients: {rock: 'stealth-rock', scales: 'fish-scale'},
                stages: [{id: 'align', inputs: []}, {id: 'settle', inputs: []}]}},
        ability: {chapters: [127, 167], observed: 'Conceals a cultivator from ordinary sight. Lightning Eye can pierce the cloak.',
            authored: 'The hunter lends a rank-two specimen. One rank-two measure or two rank-one measures power a short approach.',
            value: {fuel: 'primeval', cost: 1, maskedSurfaces: ['body', 'clothing'], effect: {kind: 'visual-concealment', magnitude: 2}}},
    },
    'stealth-rock': {
        ability: {chapters: [121], observed: 'Conceals the body while visible clothes and accessories remain exposed.',
            authored: 'One rank-one measure powers the Keeper’s short approach.',
            value: {fuel: 'primeval', cost: 1, maskedSurfaces: ['body'], effect: {kind: 'visual-concealment', magnitude: 2}}},
    },
    'lightning-eye': {
        ability: {chapters: [127, 167, 169], observed: 'Lightning Eye exposes cloaked targets and can see through smoke.',
            authored: 'One stored white-silver dose powers the Keeper’s search.',
            value: {fuel: 'primeval', cost: 2, effect: {kind: 'pierce-visual-concealment', magnitude: 2}}},
    },
    thunderwings: {
        ability: {chapters: [150, 155, 159], observed: 'Rank-three lightning wings enable flight. A specimen survived a wolf hunt.',
            authored: 'One stored two-measure dose reaches the Keeper’s lookout shelf.',
            value: {fn: 'fly', fuel: 'primeval', cost: 2, path: 'lightning', effect: {kind: 'flight', magnitude: 1}}},
    },
    'nine-eyes-liquor-worm': {
        recipe: {
            chapters: [326], observed: 'Two Seven Fragrances Worms and eyes from nine distinct hundred-beast kings make the rank-four Gu.',
            authored: 'Three market lots record different king types. Prepare the eyes, then bind the worms in the settling window.',
            value: {id: 'nine-eyes-fusion', revision: 1, kind: 'nine-eyes-liquor-worm', rank: 4,
                recordLineage: true, ingredients: {first: 'seven-fragrances-liquor-worm', second: 'seven-fragrances-liquor-worm'},
                stages: [{id: 'prepare', inputs: ['ridge-boar', 'crag-ram', 'iron-bear', 'river-crocodile', 'fen-tortoise',
                    'reed-serpent', 'ash-ape', 'dusk-leopard', 'stone-jackal'].map(king => ({material: `${king}-eye`, amount: 1}))},
                {id: 'fuse', inputs: []}]},
        },
        conversion: {
            chapters: [326], observed: 'Improves yellow-gold essence by one substage.',
            authored: 'Four initial measures yield two middle-stage measures in the Keeper trial.',
            value: {cost: 4, yield: 2, rank: 4, from: 'initial', stage: 'middle'},
        },
    },
    'charging-crash': {
        ability: {
            chapters: [345], observed: 'Rank-four fusion of Horizontal Charge and Vertical Crash reaches two hundred steps.',
            authored: 'The drill uses two measures. The initial stage delivers half the distance against the cut’s slope.',
            value: {fn: 'charge', fuel: 'primeval', cost: 2, path: 'movement', effect: {kind: 'dash', magnitude: 200},
                stageFuel: {initial: {magnitudeFactor: 0.5, costFactor: 1}}},
        },
    },
    'seven-fragrances-liquor-worm': {
        recipe: {
            chapters: [326], observed: 'Two Four Flavors Worms and seven spices make the rank-three Gu.',
            authored: 'The spice names, one measure each, and preparation followed by a settling stage.',
            value: {id: 'seven-fragrances-fusion', revision: 1, kind: 'seven-fragrances-liquor-worm', rank: 3,
                recordLineage: true, ingredients: {first: 'four-flavors-liquor-worm', second: 'four-flavors-liquor-worm'},
                stages: [{id: 'prepare', inputs: ['cassia', 'clove', 'ginger', 'pepper', 'star-anise', 'fennel', 'cardamom']
                    .map(material => ({material, amount: 1}))}, {id: 'fuse', inputs: []}]},
        },
        conversion: {
            chapters: [326], observed: 'Improves white-silver essence by one substage.',
            authored: 'Four middle-stage measures yield two upper-stage measures in the Keeper trial.',
            value: {cost: 4, yield: 2, rank: 3, from: 'middle', stage: 'upper'},
        },
    },
    'vitality-grass': {
        growth: {
            chapters: [102, 106], observed: 'Water and sunlight sustain the producer. Essence grows new leaves up to nine.',
            authored: 'One water unit and two essence measures for each leaf.',
            value: {capacity: 9, rank: 2, waterCost: 1, essenceCost: 2},
        },
    },
    'vitality-leaf': {
        treatment: {
            chapters: [102], observed: 'One leaf is used up in treatment. The same person gains no further leaf healing for an hour.',
            authored: 'Restores two health in the Keeper trial.',
            value: {rank: 1, restMinutes: 60, health: 2},
        },
    },
    'red-fire': {
        ability: {
            chapters: [275], observed: 'Xiao Yan uses Red Fire as the attack core.',
            authored: 'Six units of essence for one flame at force one.',
            value: {fn: 'ignite', fuel: 'primeval', cost: 6, path: 'fire', effect: {kind: 'flame', magnitude: 1, count: 1}},
        },
    },
    duplicate: {
        ability: {
            chapters: [275], observed: 'Duplicate increases the number of flames.',
            authored: 'One unit of essence, a doubled count and a trial binding to Red Fire.',
            value: {fuel: 'primeval', cost: 1, modifier: {property: 'count', factor: 2, kind: 'red-fire'}},
        },
    },
    enlarge: {
        ability: {
            chapters: [275], observed: 'Enlarge makes the flame larger and stronger.',
            authored: 'One unit of essence, doubled per-flame force and a trial binding to Red Fire.',
            value: {fuel: 'primeval', cost: 1, modifier: {property: 'magnitude', factor: 2, kind: 'red-fire'}},
        },
    },
    'fire-source': {
        ability: {
            chapters: [275], observed: 'Fire Source lowers the primeval expenditure of the attack set.',
            authored: 'One unit of essence and a half-cost modifier for the Red Fire attack.',
            value: {fuel: 'primeval', cost: 1, modifier: {property: 'cost', factor: 0.5, kind: 'red-fire'}},
        },
    },
    'fire-discharge': {
        ability: {
            chapters: [275], observed: 'Fire Discharge serves as the movement Gu.',
            authored: 'Two units of essence and enough movement to reach the kiln ledge.',
            value: {fn: 'cross', fuel: 'primeval', cost: 2, path: 'fire', effect: {kind: 'travel', magnitude: 1}},
        },
    },
    moonlight: {
        ability: {
            chapters: [22, 34],
            observed: 'Cuts with a moonblade. Middle-stage essence can produce a stronger blade.',
            authored: 'Base power, range units, essence cost, stage multipliers and the trait modifier.',
            value: {
                fn: 'cut', fuel: 'primeval', cost: 4, path: 'light',
                effect: {kind: 'damage', magnitude: 1, range: 1, trait: 'bladeForce'},
                stageFuel: {middle: {costFactor: 0.25, magnitudeFactor: 2}},
            },
        },
        traits: {
            chapters: [8],
            observed: 'The clan specimens are broadly similar.',
            authored: 'Focus variation and its frequency in clan stock.',
            value: {focus: [{id: 'standard', weight: 2}, {id: 'tight', weight: 1}]},
        },
        move: {
            chapters: [70],
            observed: 'Little Light supports a Moonlight Gu cast.',
            authored: 'Ordered role bindings for the two-stage cast.',
            value: {
                id: 'little-light-moonblade', chapter: 70,
                roles: [
                    {id: 'light', fn: 'brighten', kind: 'little-light'},
                    {id: 'blade', fn: 'cut', kind: 'moonlight'},
                ],
            },
        },
    },
    'little-light': {
        ability: {
            chapters: [70, 106],
            observed: 'Doubles Moonblade size and reach. Repeated support does not increase the boost.',
            authored: 'Essence cost and mapping of blade size to magnitude.',
            value: {
                fn: 'brighten', fuel: 'primeval', cost: 1,
                modifiers: [
                    {property: 'magnitude', factor: 2, kind: 'moonlight'},
                    {property: 'range', factor: 2, kind: 'moonlight'},
                ],
            },
        },
    },
    'light-source': {
        ability: {
            chapters: [275],
            observed: 'Reduces the fuel burden of Rainbow Light.',
            authored: 'Fuel cost, discount fraction and compatibility with other light Gu.',
            value: {
                fuel: 'primeval', cost: 1, modifier: {property: 'cost', factor: 0.5, path: 'light'},
            },
        },
    },
    moonglow: {
        ability: {
            chapters: [106],
            observed: 'Moonglow triples ordinary Moonblade attack power at the ordinary reach.',
            authored: 'Base essence cost, upper-stage multipliers and the trait modifier.',
            value: {
                fn: 'cut', fuel: 'primeval', cost: 5, path: 'light',
                effect: {kind: 'damage', magnitude: 3, trait: 'bladeForce'},
                stageFuel: {upper: {costFactor: 0.4, magnitudeFactor: 4 / 3}},
            },
        },
    },
    'liquor-worm': {
        traits: {
            chapters: [7, 14],
            observed: 'A wild Worm flees and can be lured with wine.',
            authored: 'Bold and wary temperaments and their frequencies.',
            value: {temperament: [{id: 'bold', weight: 1}, {id: 'wary', weight: 1}]},
        },
        conversion: {
            chapters: [34],
            observed: 'Refines initial-stage green copper to middle stage at half the volume.',
            authored: 'Discrete batch unit.',
            value: {cost: 2, yield: 1, rank: 1, stage: 'middle'},
        },
    },
    'four-flavors-liquor-worm': {
        recipe: {
            chapters: [105, 121],
            observed: 'Two Liquor Worms and four wine flavors produce the rank-two Gu. A failure can injure or kill.',
            authored: 'One unit per stage and which bound Worm suffers each consequence on bitter-stage failure.',
            value: {
                id: 'four-flavors-fusion', revision: 1, kind: 'four-flavors-liquor-worm', rank: 2,
                ingredients: {first: 'liquor-worm', second: 'liquor-worm'},
                stages: ['sour', 'sweet', 'bitter', 'spicy'].map(flavor => ({
                    id: flavor, inputs: [{material: flavor, amount: 1}],
                    ...(flavor === 'bitter' && {onControlFailure: {first: 'injure', second: 'destroy'}}),
                })),
            },
        },
        conversion: {
            chapters: [121],
            observed: 'Raises already rank-two essence by one substage.',
            authored: 'Trial batch quantity and yield, with this binding testing middle to upper.',
            value: {cost: 4, yield: 2, rank: 2, from: 'middle', stage: 'upper'},
        },
    },
    'fixed-immortal-travel': {
        ability: {
            chapters: [378, 405, 1754],
            observed: 'Uses immortal essence to travel to a place for which the operator has an impression.',
            authored: 'One stored dose per activation and unit effect magnitude.',
            value: {fuel: 'immortal', cost: 1, effect: {kind: 'travel', magnitude: 1}},
        },
    },
    attitude: {
        ability: {
            chapters: [974, 976, 1023, 1043, 1083],
            observed: 'Uses mental energy and affects how observers perceive the operator.',
            authored: 'Mental cost and impression magnitude for the standalone trial.',
            value: {fuel: 'mental', cost: 2, effect: {kind: 'project-demeanor', magnitude: 1}},
        },
    },
});
