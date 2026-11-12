import {deepFreeze} from './basics.js';

// body is chapter-source data for the later L adapter (PC23 Body, PC86).
// Shape: {status, searchedChapters, diet?, interval?, ration?, starves?, notes?}.
// status describes the diet: stated requires diet; unknown leaves the food unresolved.
// diet: {food: string[], chapters: number[], observed: short paraphrase}.
// Read food alternatives and combinations with observed. Gu rank and context live there too.
// interval: {days?: number, years?: number, chapters, observed}; a qualitative interval
// can omit both numbers. Experienced time and activation effects stay in observed.
// ration: {amount, unit, days, chapters, observed} records supply duration.
// starves and notes: {chapters, observed}. Missing fields remain unknown.
// searchedChapters records existing citations and name-hit chapters checked for feeding
// terms across the private English copy, ch1-2334. Searches include catalogue names,
// spelling variants, and nearby feed/food/eat/starve/raise terms. This is a bounded pass.
// Feeding citations may extend beyond the identity index's original behavior citations.
// Private source prose stays out of this catalogue. Facts carry no authored body defaults.

// Stable kind ids join to docs/research/gu-identity-evidence.json.
// Each binding records the checked behavior and the authored choices in
// its runtime value. Source gaps and legends live in the evidence index.
const bindings = {
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
};

// Grammar parts for every chapter-checked kind (foundation chat G proposal, 2026-11-12). A parts row is
// identity data, not a playable default: no resolver reads it yet. `rank` and `path` hold only what the
// cited chapters state; wiki rank, path and type labels stay in `wiki`, a separate tentative layer (SKR3).
// `roles` are the parts a kind was seen playing in a working; `function` is its effect family, null when
// the cited scenes do not show one. `inputs` lists catalogued kinds a fusion product was seen made from.
// Open questions name what the chapters leave unsettled.
export const guFunctions = deepFreeze(['attack', 'guard', 'conceal', 'sense', 'move', 'fly', 'travel', 'heal',
    'convert-essence', 'produce', 'record', 'strength', 'amplify', 'economize', 'restore', 'stabilize', 'mind',
    'suppress', 'formation', 'time', 'illuminate', 'steal']);
export const guRoles = deepFreeze(['core', 'support', 'ingredient', 'product', 'producer', 'converter', 'consumable',
    'vital', 'hosted', 'wild', 'loaned', 'emergent', 'formation', 'substitute']);
const readFromScene = 'Roles and function read from the cited scenes by the catalogue author; wiki labels kept apart.';

function parts(chapters, observed, {rank = [], path = null, roles = [], fn = null, fuel = null, marks, inputs, wiki = {}}, open = [],
    authored = readFromScene) {
    const gaps = [...open];
    if (!rank.length && !gaps.some(gap => /rank/.test(gap))) gaps.push('rank in the cited scene');
    if (!path && !gaps.some(gap => /path/.test(gap))) gaps.push('path in the cited scene');
    if (!fn && !gaps.some(gap => /standalone|effect|operation|contribution/.test(gap))) gaps.push('standalone effect');
    return {parts: {chapters, observed, authored, open: gaps, value: {rank, path, roles, function: fn, fuel,
        ...(marks && {marks}), ...(inputs && {inputs}), wiki: {rank: wiki.rank ?? [], path: wiki.path ?? [], type: wiki.type ?? []}}}};
}
const partsRows = {
    thunderclap: parts([150], 'A frenzy lightning wolf carries two and the Gu throws a thunderball.',
        {rank: [3], roles: ['hosted'], fn: 'attack', wiki: {rank: [3], path: ['lightning'], type: ['offensive']}}),
    'water-shield': parts([150], 'Thunderclap breaks the outer shield; the Gu dulls and repeated breaches can damage or kill it.',
        {roles: [], fn: 'guard', wiki: {rank: [2], path: ['water'], type: ['defensive']}}, ['rank in the cited scene', 'repair time and damage threshold']),
    'white-jade': parts([64, 150], 'White Boar and Jade Skin produce it; it reduces residual lightning harm but not the landing.',
        {rank: [2], roles: ['product'], fn: 'guard', wiki: {rank: [2], type: ['defensive']}}, ['exact lightning resistance']),
    'scale-armor': parts([123], 'Fish Scale is an input to the rank-two Gu, which is recommended for defense.',
        {rank: [2], roles: ['product'], fn: 'guard', wiki: {rank: [2], type: ['defensive']}},
        ['other refinement inputs', 'exact activation cost', 'protection by damage type']),
    'stealth-rock': parts([121, 123], 'Hides the body while clothes stay visible; one of two inputs to Stealth Scales.',
        {rank: [1], roles: ['ingredient'], fn: 'conceal', wiki: {rank: [1], path: ['earth'], type: ['concealment']}}, ['exact essence cost']),
    'fish-scale': parts([123, 127], 'Obtained by trade and fused with Stealth Rock.',
        {roles: ['ingredient'], wiki: {rank: [1], type: ['defensive']}}, ["Fish Scale's own rank in these chapters", 'standalone activation']),
    'earth-communication-ear-grass': parts([129, 169], 'Grounded roots hear about two hundred steps through smoke.',
        {rank: [2], fn: 'sense', wiki: {rank: [2], type: ['grass', 'investigative']}}, ['exact essence cost in the smoke passage']),
    'thunder-shield': parts([167], 'Flees a dying crown wolf and raises a semicircular lightning shield before capture.',
        {roles: ['hosted', 'wild'], fn: 'guard'}, ['rank of the wolf-hosted specimen', 'diet', 'fuel cost']),
    'stealth-scales': parts([121, 123, 127, 167], 'Masks ordinary sight; smell and Lightning Eye still find the user.',
        {rank: [2], roles: ['product'], fn: 'conceal', wiki: {rank: [2], type: ['concealment']}}, ['exact essence cost and concealment duration']),
    'lightning-eye': parts([127, 167, 169], 'Exposes cloaked targets; smoke shortens its range and cover still blocks it.',
        {rank: [3], roles: ['hosted'], fn: 'sense', wiki: {path: ['lightning']}},
        ['hosted specimen rank in chapter 127', 'diet', 'how Bai Ning Bing obtained his specimen']),
    thunderwings: parts([150, 155, 159], 'A frenzy wolf flies with it; a rank-three specimen carries a person.',
        {rank: [3], roles: ['hosted'], fn: 'fly', wiki: {rank: [3], path: ['lightning'], type: ['movement', 'flying']}},
        ['distribution across wolf populations', 'exact flight fuel and reach']),
    'nine-eyes-liquor-worm': parts([326, 345], 'Two Seven Fragrances Worms and nine beast-king eyes make it; it purifies yellow-gold essence one substage.',
        {rank: [4], roles: ['product', 'converter'], fn: 'convert-essence', wiki: {rank: [4], path: ['food'], type: ['support']}},
        ['identity of the nine source beast kings', 'exact conversion ratio']),
    'charging-crash': parts([345], 'Fuses Horizontal Charge and Vertical Crash and reaches two hundred steps with extra draw.',
        {rank: [4], roles: ['product'], fn: 'move', wiki: {rank: [4], type: ['movement']}}, ['exact supplementary materials', 'exact essence cost']),
    'seven-fragrances-liquor-worm': parts([105, 326], 'Two Four Flavors Worms and seven spices make it; it raises white-silver essence one substage.',
        {rank: [3], roles: ['product', 'ingredient', 'converter'], fn: 'convert-essence', wiki: {rank: [3], path: ['food'], type: ['support']}},
        ['identity of all seven spices', 'exact conversion ratio']),
    'red-fire': parts([275], 'The main offensive Gu of Xiao Yan’s set.', {roles: ['core'], fn: 'attack'},
        ['rank in the cited scene', 'exact essence cost']),
    duplicate: parts([275], 'Increases the number of flames.', {roles: ['support'], fn: 'amplify'},
        ['rank in the cited scene', 'exact flame multiplier']),
    enlarge: parts([275], 'Makes the flames larger and stronger.', {roles: ['support'], fn: 'amplify'},
        ['rank in the cited scene', 'exact flame multiplier']),
    'fire-source': parts([275], 'Lowers the primeval expenditure of the set.', {roles: ['support'], fn: 'economize'},
        ['rank in the cited scene', 'exact fuel discount']),
    'fire-discharge': parts([275], 'The movement component of the set.', {fn: 'move', wiki: {path: ['fire'], type: ['movement']}},
        ['rank in the cited scene', 'movement speed and range', 'possible identity with Moving Fire Gu']),
    'moving-fire': parts([2226], 'A fire-path Gu that leaves flames along the traveller’s route.', {path: 'fire', fn: 'move'},
        ['Gu rank', 'possible identity with Fire Discharge Gu']),
    moonlight: parts([8, 22, 34, 70, 157], 'Cuts with a moonblade; clan stock varies little and middle-stage essence strengthens it.',
        {rank: [1], roles: ['core'], fn: 'attack', wiki: {rank: [1], type: ['offensive']}}, ['reverse-fusion precursor']),
    'little-light': parts([70, 106], 'Supports a Moonblade; a second support adds nothing.',
        {rank: [1], roles: ['support'], fn: 'amplify', wiki: {rank: [1], path: ['light']}}),
    moonglow: parts([106], 'A fusion product distinct from Moonlight with a stronger blade.',
        {rank: [2], roles: ['product'], fn: 'attack', wiki: {rank: [2], type: ['offensive']}}),
    'moon-scar': parts([106], 'Moonlight fused with Stone Scar keeps its force and doubles its reach to twenty meters.',
        {roles: ['product'], fn: 'attack', inputs: ['moonlight', 'stone-scar']}, ['rank in the cited scene', 'standalone fuel cost']),
    'stone-scar': parts([106], 'The living fusion ingredient for Moon Scar.', {roles: ['ingredient']},
        ['rank in the cited scene', 'standalone power']),
    'liquor-worm': parts([7, 14, 17, 19, 34, 105], 'Refines green-copper essence at half volume; a wild Worm flees and takes wine.',
        {rank: [1], roles: ['wild', 'ingredient', 'converter'], fn: 'convert-essence', wiki: {rank: [1, 8], path: ['food'], type: ['support']}}),
    'four-flavors-liquor-worm': parts([105, 107, 120, 121], 'Two Liquor Worms and four wines make it; it raises rank-two essence one substage.',
        {rank: [2], roles: ['product', 'ingredient', 'converter'], fn: 'convert-essence', wiki: {rank: [2], path: ['food'], type: ['support']}}),
    'light-source': parts([266, 275], 'Reduces the operating cost of light Gu.',
        {roles: ['support'], fn: 'economize', wiki: {path: ['light'], type: ['support']}}, ['rank in the cited scene', 'exact fuel discount']),
    'rainbow-light': parts([266, 275], 'A rank-three movement Gu sustained with Light Source support.',
        {rank: [3], roles: ['core'], fn: 'move', wiki: {rank: [3], path: ['light'], type: ['movement']}}),
    'vitality-grass': parts([102, 106], 'A living plant holds up to nine leaves and regrows them from essence, water and sunlight.',
        {rank: [2], roles: ['producer'], fn: 'produce', wiki: {rank: [2], type: ['grass', 'healing']}}),
    'vitality-leaf': parts([102, 106, 107], 'A detached leaf heals once; a recipient waits an hour for the next.',
        {rank: [1], roles: ['product', 'consumable'], fn: 'heal', wiki: {rank: [1], type: ['healing', 'consumable']}}),
    plunder: parts([132], 'Pulls at a Gu inside a bold lightning wolf; running short of essence interrupts it with backlash.',
        {fn: 'steal', wiki: {rank: [2], path: ['theft']}}),
    'starlight-firefly': parts([466, 467, 469, 474, 490, 616], 'Ordinary insects breed and Gu emerge under habitat care; the Gu give light and are spent through Stargate use.',
        {roles: ['emergent', 'consumable'], fn: 'illuminate', wiki: {rank: [3], path: ['star'], type: ['support', 'amplification']}}),
    'charred-thunder-potato-mother': parts([213], 'Lent to an operator who supplies essence; its sprouts give fruit sorted for viable Gu.',
        {rank: [3], roles: ['producer', 'loaned'], fn: 'produce'}),
    'charred-thunder-potato': parts([213], 'Refined from viable fruit and grown in fertile soil into an immobile vibration-triggered Gu.',
        {rank: [2], roles: ['product'], fn: 'attack', wiki: {rank: [2]}}),
    'ant-nest': parts([1827, 1848, 1862, 1868, 1879], 'Produces army ants from immortal essence and materials; queens breed the other castes.',
        {rank: [8], roles: ['producer'], fn: 'produce', fuel: 'immortal', wiki: {rank: [8]}}),
    'fixed-immortal-travel': parts([378, 405, 407, 1003, 1540, 1754, 1769],
        'Travels to a place the operator holds a concrete impression of; a blocking formation can stop it; more dao marks on the passenger outgrew the rank-seven Gu alone.',
        {rank: [6, 7], roles: ['core', 'loaned'], fn: 'travel', fuel: 'immortal', marks: {passengerLoad: 'chapter 1769'},
            wiki: {rank: [6], path: ['space'], type: ['movement']}},
        ['source of the exact impression used to reach Dang Hun Mountain', 'tolerance for scene changes',
            'fuel cost if an unexpected counter intervenes', 'carrying capacity by rank and dao mark composition']),
    attitude: parts([974, 975, 976, 1023, 1043, 1083, 1292], 'Uses mental energy and, as the core of Familiar Face, affects how observers see the operator; lent for a year.',
        {rank: [8], roles: ['core', 'loaned'], fn: 'mind', fuel: 'mental', wiki: {rank: [8]}},
        ['exact enforcement and expiry behavior beyond loss of use', 'which restrictions survive a separate breach',
            'feeding quantity and supply rate', 'cost of the full disguise']),
    'change-form': parts([976], 'One of two Immortal supports of the original Familiar Face, replaced by a larger mortal set.',
        {roles: ['support'], wiki: {rank: [6, 7, 8, 9], path: ['transformation']}},
        ['exact rank in this passage', 'standalone scope and charge', 'full original Familiar Face support list']),
    'blood-asset': parts([1217], 'Recovers from injury and becomes the core of a simplified spirit-suppression move.',
        {roles: ['core'], fn: 'suppress', wiki: {rank: [7], path: ['blood', 'refinement']}},
        ['exact rank in the cited scene', 'method and cost of its recovery', 'complete support Gu for the simplified move']),
    'formation-plate': parts([1089, 1415], 'Arranges a sub-formation while the operator supplies essence; its stored arrangement can be overwritten.',
        {rank: [6], roles: ['formation'], fn: 'formation', wiki: {rank: [6], path: ['formation']}},
        ['exact activation charge', 'storage capacity beyond the recorded overwrite case', 'identity of the travel key']),
    'man-as-before': parts([609, 610, 611], 'A vital mortal Gu carried into ascension and raised to Immortal form by a theoretical recipe.',
        {rank: [6], roles: ['vital', 'product'], wiki: {rank: [5, 6, 7], path: ['time'], type: ['healing']}},
        ['exact rank of the mortal precursor in these passages', 'success odds of the theoretical recipe',
            'which source fields apply to later incarnations', 'standalone effect']),
    'mountain-as-before': parts([554, 609, 611], 'Steadies a growing aperture; with River as Before it combines into Landscape as Before.',
        {rank: [5], roles: ['ingredient'], fn: 'stabilize', wiki: {rank: [5], path: ['time'], type: ['healing']}},
        ['complete standalone operation', 'whether the pair has a reusable recipe away from ascension']),
    'river-as-before': parts([554, 609, 611], 'Steadies a growing aperture; with Mountain as Before it combines into Landscape as Before.',
        {rank: [5], roles: ['ingredient'], fn: 'stabilize', wiki: {rank: [5], path: ['time'], type: ['healing']}},
        ['complete standalone operation', 'whether the pair has a reusable recipe away from ascension']),
    'landscape-as-before': parts([554, 609, 611], 'Emerges from River and Mountain as Before during ascension and restores terrain with green grape essence.',
        {rank: [6], roles: ['product'], fn: 'restore', fuel: 'immortal', inputs: ['river-as-before', 'mountain-as-before'], wiki: {rank: [6, 7, 8], path: ['time'], type: ['healing']}},
        ['ordinary repeatable refinement recipe', 'alternative inputs', 'limits across objects, injuries and independent ongoing threats']),
    'yaksha-octopus-king-wild-immortal': parts([933], 'A provisional sighting: one Gu living in an ancient beast emerged as a wild Immortal over a long period.',
        {roles: ['wild', 'hosted', 'emergent']},
        ['name and exact rank', 'path', 'effect', 'precursor kind', 'trigger and rate of emergence', 'same specimen seen elsewhere']),
    'heavenly-essence-treasure-imperial-lotus': parts([2233, 2234], 'A rank-eight precursor advanced to rank nine after repeated failures; failure can injure or destroy it.',
        {rank: [8, 9], roles: ['product'], wiki: {rank: [3], path: ['wood'], type: ['grass']}},
        ['complete material schedule', 'how much of the old specimen is exposed at each stage',
            'whether and when the Gu can be activated during advancement', 'standalone effect']),
    'heavenly-secret': parts([2275, 2279, 2285], 'A heaven-path Gu once taken for wisdom path; a destroyed specimen was refined anew and advanced.',
        {rank: [9], path: 'heaven', roles: ['product'], wiki: {rank: [7, 8, 9], path: ['heaven'], type: ['investigative']}},
        ['full ingredient list', 'exact activation requirements at each lower rank', 'timing and accounting of deferred material cost', 'standalone effect']),
    light: parts([2279, 2280, 2281, 2287, 2318, 2320], 'A wild rank-nine Gu flees by instinct and picks a carrier whose light-path dao marks are familiar.',
        {rank: [9], path: 'light', roles: ['wild'], marks: {carrierChoice: 'chapter 2280'}, wiki: {rank: [9], path: ['light']}},
        ['how the wild specimen originated', 'whether Light Emperor ultimately completes vital refinement', 'time and cost of recovery', 'standalone commanded use']),
    love: parts([1230, 1254, 2330], 'Acknowledges rather than obeys; forceful refinement failed even for a venerable; it moved five people to another peak.',
        {rank: [9], roles: ['wild'], fn: 'travel', wiki: {rank: [9], path: ['emotion', 'wisdom']}},
        ['exact conditions for acknowledgement', 'action selection and trigger conditions', 'cost for a given effect', 'possibility of a different control method']),
    'ice-blade': parts([167], 'Bai Ning Bing forms the iceblade; Swirl and Fierce Wind carry it in a freezing storm.',
        {roles: ['core'], fn: 'attack'}, ['rank', 'fuel', 'standalone blade output']),
    swirl: parts([167], 'Activated with Fierce Wind to carry the iceblades.', {roles: ['support'], wiki: {type: ['movement']}},
        ['rank', 'fuel', 'independent contribution to storm speed and radius']),
    'fierce-wind': parts([167], 'Activated with Swirl to carry the iceblades.', {roles: ['support'], wiki: {path: ['wind'], type: ['support', 'defensive']}},
        ['rank', 'fuel', 'independent contribution to storm speed and radius']),
    'earth-overlord': parts([543], 'Blamed for the severe body and soul aftermath of a ground-based strength move used while flying.',
        {rank: [5], roles: ['support'], fn: 'strength', wiki: {rank: [5], path: ['strength'], type: ['support', 'amplification']}},
        ['ground contact and duration response curves', 'standalone cost']),
    'borrow-strength': parts([560], 'Needs a matching Gu to borrow strength from a particular environmental source; a substitute pair gives under half.',
        {rank: [5], roles: ['support'], fn: 'strength', wiki: {rank: [5], path: ['strength'], type: ['support', 'amplification']}},
        ['full revised Wind King procedure', 'standalone fuel cost', 'realized full-move strength after substitution']),
    'wind-overlord': parts([560], 'With Tyrant Strength, substitutes for Borrow Strength in Four Arm Wind King.',
        {roles: ['support', 'substitute'], fn: 'strength', wiki: {rank: [5], path: ['strength'], type: ['support', 'amplification']}},
        ['rank in this passage', 'exact independent effect', 'fuel cost']),
    'tyrant-strength': parts([560], 'With Wind Overlord, substitutes for Borrow Strength in Four Arm Wind King.',
        {roles: ['support', 'substitute'], fn: 'strength', wiki: {rank: [4], path: ['strength']}},
        ['rank in this passage', 'exact independent effect', 'fuel cost']),
    'photo-audio': parts([16], 'Records and loops a scene’s image and sound; light and sound feed it.',
        {fn: 'record', wiki: {rank: [3], type: ['storage']}},
        ['rank', 'path', 'activation cost', 'whether replay can reproduce mechanical effects beyond light and sound']),
    'myriad-self': parts([1560, 1561, 1570, 1571], 'Derived from the killer move; one activation makes slightly weaker strength phantoms for less essence; core of the redesigned Giant Hand.',
        {rank: [7], roles: ['product', 'core'], fn: 'strength', wiki: {rank: [7], path: ['human']}},
        ['complete ingredient counts', 'exact activation cost', 'standalone capacity across targets', 'full alternative recipe using Immortal inputs']),
    'self-reliance': parts([1561, 1570], 'Heals by the Gu Master’s strength; hundreds were consumed for their dao marks in a refinement stage.',
        {rank: [3], roles: ['support', 'ingredient'], fn: 'heal', marks: {consumedForMarks: 'chapter 1570'}, wiki: {rank: [2, 3, 4], type: ['healing']}},
        ['other ranks', 'strength-to-healing curve', 'exact refinement quantity and individual contribution']),
    'all-out-effort': parts([1561, 1570], 'Mortal specimens spanning ranks one to five fuse with floating life fire into an intermediate.',
        {rank: [1, 2, 3, 4, 5], roles: ['support', 'ingredient'], fn: 'strength', wiki: {rank: [1, 2, 3, 4, 5, 6], path: ['strength'], type: ['support']}},
        ['counts of each rank in the batch', 'whether every individual mortal rank was present', 'standalone effect calibration']),
    'group-strength': parts([1561, 1571], 'Combines strength phantoms; mortal supplements to Myriad Self in the revised Giant Hand.',
        {roles: ['support'], fn: 'strength', wiki: {rank: [5], path: ['strength'], type: ['support']}},
        ['exact mortal ranks in the revised Giant Hand', 'supplement count by rank', 'activation cost']),
    'self-strength': parts([777, 1561], 'Hei Lou Lan’s vital Immortal Gu in her move, and one of Myriad Self’s cores.',
        {roles: ['vital', 'core'], fn: 'strength', wiki: {rank: [6, 7], path: ['strength']}},
        ['exact rank of each Gu incarnation in these passages', 'complete recipe', 'link between the mortal and Immortal specimens']),
    wisdom: parts([817], 'Shows unusually strong intelligence and responds to a person.',
        {rank: [9], wiki: {rank: [6, 7, 8, 9], path: ['wisdom']}}),
    'spring-autumn-cicada': parts([7, 19, 106, 1481, 1645, 1777], 'Bonded across rebirth and later attached to a clone; rank-seven advancement keeps the kind.',
        {rank: [6, 7], roles: ['vital'], fn: 'time', wiki: {rank: [6, 7, 8, 9], path: ['time']}}),
    'fixed-space': parts([1795], 'Detonates when removed from its aperture; a formation strips the destructive marks and leaves it stable.',
        {marks: {destructiveMarksRemoved: 'chapter 1795'}, wiki: {rank: [7], path: ['space']}},
        ['exact Gu rank', 'formation recipe and operating cost']),
    permanence: parts([1795], 'A rule-path Immortal Gu taken as the core of Eternal Yacht; supports were damaged or lost in the failed build.',
        {path: 'rule', roles: ['core']}, ['exact Gu rank', 'standalone operating cost']),
    'years-flow-like-water': parts([1129, 1130, 1132, 1401, 1452, 1795], 'Produces Year Gu; an existing Immortal Year Gu limits it to mortal output and its aura draws Year Beasts.',
        {rank: [8], roles: ['producer', 'core'], fn: 'produce', fuel: 'immortal', wiki: {rank: [8], path: ['time']}},
        ['conditions behind conflicting green-grape activation claims', 'exact output curve and Immortal threshold',
            'complete Gu House recipe', 'exact assembly cost']),
    'year-gu': parts([1129, 1130, 1401, 1452], 'Holds expendable years; the years held set its rank and use can drop it.',
        {rank: [5, 6, 7, 8], roles: ['product', 'consumable'], fn: 'time', wiki: {rank: [1, 2, 3, 4, 5, 6, 7, 8], path: ['time'], type: ['consumable']}},
        ['mortal ranks other than five in these passages', 'wild reproduction and managed recruitment rates', 'theoretical rank-nine case',
            'when falling below Immortal rank releases uniqueness', "apparent discrepancy in inherited specimen's year count"]),
    after: parts([1129, 1130], 'Produces black ant Gu that gather for it, one a month, and starves without them; core of Endless Trouble.',
        {rank: [7], roles: ['producer', 'core'], fn: 'produce', wiki: {rank: [7], path: ['time']}},
        ['replacement of lost gatherers in other settings', 'individual black-ant ranks', 'minimum viable gatherer cohort']),
    'beast-enslavement': parts([463, 701], 'A rank-seven Immortal of a wider rank family.',
        {rank: [7], wiki: {rank: [1, 2, 3, 4, 5, 6, 7], path: ['enslavement'], type: ['support', 'consumable']}}),
    slavery: parts([656], 'Hei Lou Lan’s Gu, a kind separate from Beast Enslavement.',
        {rank: [6], wiki: {rank: [1, 2, 3, 4, 5, 6], path: ['enslavement']}}),
    'responsive-luck': parts([1919], 'A rank-eight luck-path Gu handed over by Qin Ding Ling as a candidate core.',
        {rank: [8], path: 'luck', roles: ['loaned', 'core'], wiki: {path: ['luck']}},
        ['complete Destiny Song working and activation outcome in this passage', 'standalone effect', "exact transfer or use terms after Qin Ding Ling's offer"]),
    'reputation-restriction': parts([1370], 'A rank-seven information-path Gu lent by the Wu clan after weighing the applicant’s reasons.',
        {rank: [7], path: 'information', roles: ['loaned'], wiki: {rank: [7], path: ['information', 'enslavement']}},
        ['actual restraint against the eagle at a given reputation', 'duration and return terms of the loan', 'full operating cost']),
    'eat-strength': parts([961], 'One of three Immortal cores of Strength Reversing Life and Death.',
        {roles: ['core'], wiki: {rank: [6], path: ['strength', 'food'], type: ['support']}}),
    'pulling-mountain': parts([961], 'One of three Immortal cores of Strength Reversing Life and Death.',
        {roles: ['core'], wiki: {rank: [6], path: ['strength', 'earth']}}),
    'pulling-water': parts([961], 'One of three Immortal cores of Strength Reversing Life and Death.',
        {roles: ['core'], wiki: {rank: [6], path: ['strength', 'water']}}),
    fight: parts([1394, 1395, 1396], 'A formation core, then sole Immortal core of Soaring Fighting Spirit; a failed activation spent three red date beads and destroyed the mortal supports.',
        {rank: [7], roles: ['core', 'formation'], fuel: 'immortal', wiki: {rank: [7], path: ['rule']}}),
};

// Feeding evidence for the 78 chapter-checked kinds (PC86, proposal under AD32).
const bodyRows = {
    'thunderclap': {
        status: 'unknown',
        searchedChapters: [150, 353, 367, 472],
    },
    'water-shield': {
        status: 'unknown',
        searchedChapters: [134, 136, 137, 141, 143, 144, 145, 148, 149, 150, 155, 187, 230],
    },
    'white-jade': {
        status: 'stated',
        searchedChapters: [13, 64, 79, 90, 98, 99, 100, 104, 105, 107, 111, 113, 114, 115, 116, 123, 128, 129, 130,
            134, 136, 137, 143, 144, 145, 148, 149, 150, 155, 156, 157, 162, 406, 560, 575, 602, 603, 656, 780, 845,
            871, 1180, 1191, 1238, 1335, 1438, 1540, 1542, 1708, 1710, 1913, 1923, 1931, 1971, 2035, 2077, 2175,
            2235, 2244],
        diet: {
            food: ['jade rocks'],
            chapters: [100],
            observed: 'The rank-two Gu takes eight liang of jade per meal.',
        },
        interval: {
            days: 20,
            chapters: [100],
            observed: 'Meals are twenty days apart.',
        },
    },
    'scale-armor': {
        status: 'unknown',
        searchedChapters: [123, 480, 701],
    },
    'earth-communication-ear-grass': {
        status: 'stated',
        searchedChapters: [128, 129, 130, 131, 133, 137, 138, 145, 148, 157, 161, 162, 167, 168, 169, 188, 190, 191,
            202, 209, 210],
        diet: {
            food: ['ginseng roots'],
            chapters: [128, 202],
            observed: 'Ginseng feeds it. A purchased ration restores its vitality.',
        },
    },
    'thunder-shield': {
        status: 'unknown',
        searchedChapters: [167, 168],
    },
    'stealth-scales': {
        status: 'unknown',
        searchedChapters: [121, 123, 127, 128, 129, 130, 131, 136, 137, 138, 142, 145, 159, 165, 167, 180, 211, 227,
            228],
    },
    'stealth-rock': {
        status: 'unknown',
        searchedChapters: [116, 121, 123],
    },
    'lightning-eye': {
        status: 'unknown',
        searchedChapters: [127, 131, 167, 169, 190],
    },
    'thunderwings': {
        status: 'unknown',
        searchedChapters: [150, 155, 157, 159, 165, 166, 168, 170, 182, 183, 184, 188, 196],
    },
    'nine-eyes-liquor-worm': {
        status: 'unknown',
        searchedChapters: [326, 344, 345, 355, 358, 365, 422, 424],
    },
    'charging-crash': {
        status: 'unknown',
        searchedChapters: [288, 317, 331, 344, 345, 352, 360, 368, 434, 504, 516, 517, 522, 543],
    },
    'seven-fragrances-liquor-worm': {
        status: 'unknown',
        searchedChapters: [105, 326],
    },
    'vitality-grass': {
        status: 'stated',
        searchedChapters: [102, 103, 106, 107, 109, 112, 123, 124, 137, 141, 147, 148, 149, 153, 157, 158, 159, 161,
            163, 262, 770],
        diet: {
            food: ['water', 'sunlight'],
            chapters: [106],
            observed: 'The grass survives with water and exposure to sunlight.',
        },
    },
    'vitality-leaf': {
        status: 'unknown',
        searchedChapters: [102, 106, 107, 112, 116, 124, 145, 146, 147],
    },
    'red-fire': {
        status: 'unknown',
        searchedChapters: [54, 275, 634, 861, 1265, 1500, 1570],
    },
    'duplicate': {
        status: 'unknown',
        searchedChapters: [275],
    },
    'enlarge': {
        status: 'unknown',
        searchedChapters: [275],
    },
    'fire-source': {
        status: 'unknown',
        searchedChapters: [275],
    },
    'fire-discharge': {
        status: 'unknown',
        searchedChapters: [275],
    },
    'moonlight': {
        status: 'stated',
        searchedChapters: [7, 8, 10, 11, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 32, 34, 35, 36, 39, 40, 41,
            43, 60, 61, 62, 63, 64, 69, 70, 72, 73, 75, 80, 82, 83, 84, 85, 86, 98, 99, 100, 104, 106, 108, 109,
            114, 123, 156, 157, 159, 176, 184, 203, 212, 222],
        diet: {
            food: ['moon orchid petals'],
            chapters: [23, 39],
            observed: 'Each meal uses two petals. Intimate Grass can supplement the petals.',
        },
        interval: {
            days: 0.5,
            chapters: [23],
            observed: 'It eats in the morning and again at night.',
        },
        starves: {
            chapters: [40],
            observed: 'Food shortage can trigger rock-enclosed dormancy. This survival response is uncommon among Gu.',
        },
    },
    'little-light': {
        status: 'unknown',
        searchedChapters: [62, 63, 64, 70, 73, 75, 85, 86, 91, 98, 99, 106, 114, 156, 563],
    },
    'light-source': {
        status: 'unknown',
        searchedChapters: [266, 267, 275, 288, 723, 959],
    },
    'moonglow': {
        status: 'stated',
        searchedChapters: [98, 104, 106, 107, 108, 109, 111, 114, 115, 116, 119, 122, 127, 128, 137, 138, 142, 148,
            149, 156, 157, 162],
        diet: {
            food: ['moon orchid petals'],
            chapters: [127],
            observed: 'Fang Yuan obtains petals with battle merits to maintain this Gu.',
        },
    },
    'liquor-worm': {
        status: 'stated',
        searchedChapters: [7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 29, 34, 35, 40, 43, 44, 46, 47, 50,
            52, 53, 55, 56, 58, 59, 60, 61, 62, 64, 66, 69, 70, 71, 72, 73, 75, 80, 81, 86, 91, 96, 98, 99, 101,
            104, 105, 106, 107, 109, 110, 111, 113, 114, 116, 117, 120, 121, 122, 123, 124, 131, 137, 145, 147, 148,
            153, 159, 176, 177, 178, 179, 202, 205, 212, 213, 214, 226, 231, 239, 261, 262, 273, 278, 282, 283, 319,
            326, 344, 345, 355, 358, 363, 365, 409, 422, 424, 465, 593, 695, 770, 860, 916, 1093, 1191],
        diet: {
            food: ['wine'],
            chapters: [14, 23, 55],
            observed: 'It drinks wine, including green bamboo and monkey wines. Poorer wine requires greater volume.',
        },
        ration: {
            amount: 1,
            unit: 'jar of green bamboo wine',
            days: 4,
            chapters: [23],
            observed: 'A single jar of green bamboo wine supplies four days of sustenance.',
        },
        starves: {
            chapters: [40],
            observed: 'Food shortage can trigger cocoon-enclosed dormancy. Many Gu instead die when unfed.',
        },
    },
    'four-flavors-liquor-worm': {
        status: 'stated',
        searchedChapters: [105, 107, 114, 120, 121, 145, 159, 202, 213, 239, 326],
        diet: {
            food: ['fine liquor', 'monkey wine'],
            chapters: [202, 213],
            observed: 'Fine liquor sustains it. Monkey wine is considered a reserve food.',
        },
    },
    'fixed-immortal-travel': {
        status: 'stated',
        searchedChapters: [307, 371, 378, 398, 405, 406, 407, 408, 410, 411, 416, 417, 418, 419, 421, 423, 425, 426,
            429, 430, 431, 433, 436, 437, 445, 446, 448, 449, 459, 466, 467, 468, 469, 492, 493, 494, 500, 516, 568,
            596, 603, 616, 622, 625, 626, 630, 631, 633, 634, 636, 645, 649, 650, 653, 654, 658, 659, 660, 664, 665,
            672, 673, 676, 677, 678, 679, 680, 688, 689, 690, 691, 692, 700, 702, 713, 720, 723, 725, 726, 728, 729,
            739, 743, 758, 763, 764, 765, 768, 774, 836, 851, 857, 872, 878, 879, 881, 886, 897, 900, 902, 903, 907,
            932, 933, 934, 938, 942, 947, 948, 952, 961, 965, 969, 971, 972, 973, 977, 980, 987, 988, 989, 990, 991,
            992, 995, 1003, 1006, 1009, 1012, 1014, 1017, 1018, 1021, 1023, 1025, 1026, 1027, 1028, 1029, 1030,
            1038, 1039, 1043, 1044, 1045, 1051, 1052, 1060, 1063, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1073,
            1077, 1079, 1090, 1096, 1110, 1210, 1212, 1405, 1540, 1548, 1550, 1552, 1554, 1577, 1578, 1579, 1583,
            1584, 1585, 1589, 1590, 1592, 1593, 1594, 1595, 1596, 1599, 1600, 1603, 1604, 1610, 1611, 1615, 1616,
            1620, 1621, 1622, 1623, 1626, 1627, 1631, 1634, 1635, 1636, 1638, 1647, 1662, 1680, 1682, 1684, 1698,
            1699, 1702, 1728, 1729, 1730, 1731, 1748, 1750, 1753, 1754, 1755, 1758, 1760, 1761, 1762, 1764, 1767,
            1769, 1770, 1771, 1775, 1777, 1778, 1783, 1785, 1789, 1792, 1793, 1807, 1874, 1926, 1963, 2032, 2079,
            2088, 2124, 2194],
        diet: {
            food: ['green grape immortal essence'],
            chapters: [410, 672],
            observed: 'The rank-six specimen consumes one bead per feeding.',
        },
        interval: {
            years: 6,
            chapters: [410, 672],
            observed: 'Six years of its experienced time is a theoretical interval. Activation shortens it.',
        },
        starves: {
            chapters: [410],
            observed: 'The unfed, newly refined specimen is hungry with dim wings after seven days of sleep.',
        },
    },
    'attitude': {
        status: 'stated',
        searchedChapters: [59, 87, 112, 131, 144, 709, 870, 948, 949, 952, 973, 974, 975, 976, 980, 985, 986, 998,
            1019, 1021, 1023, 1024, 1025, 1027, 1033, 1040, 1043, 1082, 1083, 1087, 1088, 1098, 1099, 1115, 1116,
            1117, 1118, 1120, 1121, 1126, 1129, 1130, 1132, 1134, 1142, 1148, 1159, 1168, 1209, 1213, 1217, 1221,
            1291, 1292, 1293, 1297, 1299, 1300, 1302, 1304, 1305, 1331, 1333, 1379, 1417, 1431, 1458, 1459, 1468,
            1507, 1524, 1572, 1633, 1651, 1762, 1954, 1956, 1963, 2041, 2052, 2053, 2184],
        diet: {
            food: ['flowing light fruits'],
            chapters: [1082, 1083],
            observed: 'The rank-eight Gu needs a very large quantity of these fruits per meal.',
        },
        interval: {
            chapters: [1083],
            observed: 'Feeding intervals are described as very long. No duration is given.',
        },
    },
    'fish-scale': {
        status: 'unknown',
        searchedChapters: [123, 127],
    },
    'moving-fire': {
        status: 'unknown',
        searchedChapters: [2226],
    },
    'moon-scar': {
        status: 'unknown',
        searchedChapters: [106],
    },
    'stone-scar': {
        status: 'unknown',
        searchedChapters: [106],
    },
    'rainbow-light': {
        status: 'unknown',
        searchedChapters: [207, 266, 275, 288, 292, 420, 611, 621, 833, 991, 1000, 1019, 1021, 1050, 1089, 1270,
            1338, 1357, 1533, 1628, 1710, 1712, 1719, 1728, 1919, 1922, 1966, 1978, 2234],
    },
    'plunder': {
        status: 'unknown',
        searchedChapters: [131, 132, 133, 134, 135, 138, 143, 148, 202, 210, 211, 260, 273],
        starves: {
            chapters: [273],
            observed: 'The caravan specimen dies after its food runs out.',
        },
    },
    'starlight-firefly': {
        status: 'unknown',
        searchedChapters: [462, 465, 466, 467, 469, 474, 476, 485, 490, 491, 500, 508, 548, 551, 615, 616, 636, 649,
            666, 667, 668, 670, 672, 711, 769, 809, 810, 819, 851, 858],
        notes: {
            chapters: [467, 490],
            observed: 'Star fragment grass feeds the ordinary firefly cohort. These passages distinguish the emergent Gu and leave its own diet unresolved.',
        },
    },
    'charred-thunder-potato-mother': {
        status: 'unknown',
        searchedChapters: [213, 256, 273, 293, 294],
    },
    'charred-thunder-potato': {
        status: 'unknown',
        searchedChapters: [210, 211, 213, 217, 220, 222, 256, 273, 293, 294, 515],
    },
    'ant-nest': {
        status: 'unknown',
        searchedChapters: [1827, 1830, 1848, 1862, 1868, 1879, 2145, 2322],
        starves: {
            chapters: [1862],
            observed: 'The sealed rank-eight specimen survives storage but emerges weak and hungry. Timely feeding prevents death.',
        },
    },
    'change-form': {
        status: 'unknown',
        searchedChapters: [843, 847, 858, 859, 861, 862, 863, 870, 872, 876, 894, 904, 907, 970, 971, 972, 973, 975,
            976, 993, 1040, 1043, 1065, 1066, 1067, 1068, 1074, 1076, 1080, 1081, 1082, 1085, 1087, 1088, 1092,
            1096, 1097, 1098, 1099, 1101, 1197, 1291, 1295, 1298, 1300, 1302, 1310, 1377, 1405, 1461, 1924, 2143,
            2205, 2229],
    },
    'blood-asset': {
        status: 'unknown',
        searchedChapters: [1058, 1061, 1063, 1082, 1086, 1118, 1126, 1128, 1136, 1140, 1141, 1151, 1161, 1167, 1179,
            1217, 1220, 1291, 1334, 1444, 1461, 2077, 2079, 2080, 2246, 2252, 2265],
    },
    'formation-plate': {
        status: 'unknown',
        searchedChapters: [1089, 1410, 1415, 1416, 1418, 1758],
    },
    'man-as-before': {
        status: 'unknown',
        searchedChapters: [533, 534, 535, 538, 551, 584, 591, 604, 609, 610, 611, 615, 618, 635, 636, 641, 647, 651,
            652, 664, 672, 689, 693, 708, 709, 746, 750, 818, 819, 858, 867, 869, 888, 892, 938, 947, 981, 1011,
            1077, 1078, 1079, 1082, 1097, 1098, 1141, 1171, 1257, 1258, 1259, 1288, 1291, 1302, 1314, 1374, 1376,
            1380, 1381, 1385, 1396, 1407, 1431, 1441, 1461, 1465, 1469, 1605, 1610, 1617, 1645, 1680, 1683, 2204,
            2215],
    },
    'mountain-as-before': {
        status: 'unknown',
        searchedChapters: [524, 543, 544, 554, 592, 604, 609, 611],
    },
    'river-as-before': {
        status: 'unknown',
        searchedChapters: [524, 544, 545, 554, 592, 604, 609, 611],
    },
    'landscape-as-before': {
        status: 'unknown',
        searchedChapters: [544, 545, 552, 554, 574, 591, 592, 596, 603, 608, 609, 611, 612, 615, 616, 618, 634, 641,
            647, 651, 652, 661, 664, 670, 672, 683, 690, 693, 708, 709, 745, 746, 750, 814, 815, 824, 826, 827, 865,
            866, 893, 902, 907, 947, 953, 974, 978, 981, 1077, 1078, 1079, 1082, 1095, 1096, 1098, 1113, 1159, 1167,
            1257, 1291, 1302, 1461, 1550, 1561, 1596, 1610, 1634, 1645, 1680, 1683, 1777, 2136, 2215, 2253],
    },
    'yaksha-octopus-king-wild-immortal': {
        status: 'unknown',
        searchedChapters: [741, 931, 932, 933, 934, 1265],
    },
    'heavenly-essence-treasure-imperial-lotus': {
        status: 'unknown',
        searchedChapters: [162, 163, 169, 171, 174, 177, 180, 182, 187, 188, 195, 196, 197, 200, 201, 202, 204, 205,
            210, 211, 214, 216, 222, 224, 227, 230, 231, 239, 243, 273, 278, 297, 299, 301, 308, 309, 312, 314, 315,
            319, 320, 345, 363, 463, 464, 468, 558, 650, 666, 872, 880, 1053, 1147, 1200, 1235, 1447, 1551, 1758,
            1767, 1777, 2073, 2081, 2082, 2119, 2155, 2207, 2215, 2227, 2229, 2230, 2231, 2232, 2233, 2234, 2235,
            2236, 2237, 2240, 2247, 2250, 2253, 2279, 2292],
        notes: {
            chapters: [2292],
            observed: 'The rank-nine Gu is described as easier to feed than Heavenly Secret, without naming its food.',
        },
    },
    'heavenly-secret': {
        status: 'stated',
        searchedChapters: [467, 492, 657, 904, 968, 1017, 1031, 1442, 1459, 1462, 1467, 1468, 1469, 1475, 1476,
            1481, 1482, 1490, 1599, 1617, 1701, 1798, 1810, 2042, 2048, 2227, 2228, 2229, 2230, 2231, 2232, 2233,
            2234, 2235, 2236, 2240, 2247, 2253, 2260, 2267, 2271, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2283,
            2285, 2290, 2291, 2292, 2293, 2295, 2300, 2301, 2306, 2307, 2309, 2310, 2311, 2313, 2314, 2317, 2320,
            2329],
        diet: {
            food: ['splendid clouds'],
            chapters: [2292],
            observed: 'Rank nine requires a broad cloud field. The described stock mixes several material ranks.',
        },
    },
    'light': {
        status: 'unknown',
        searchedChapters: [62, 63, 64, 70, 73, 75, 85, 86, 91, 98, 99, 106, 114, 156, 164, 265, 266, 275, 280, 288,
            292, 389, 390, 393, 397, 402, 404, 405, 466, 495, 563, 829, 830, 856, 1039, 1083, 1209, 1297, 1898,
            2278, 2279, 2280, 2281, 2283, 2285, 2287, 2291, 2296, 2297, 2307, 2308, 2318, 2320, 2329],
        notes: {
            chapters: [2318],
            observed: 'Light Emperor nourishes the Gu with his body during their ongoing union. This passage leaves an ordinary feeding regimen unresolved.',
        },
    },
    'love': {
        status: 'stated',
        searchedChapters: [435, 547, 567, 570, 1016, 1083, 1175, 1221, 1222, 1228, 1229, 1230, 1234, 1237, 1238,
            1241, 1245, 1246, 1248, 1249, 1250, 1251, 1252, 1254, 1266, 1273, 1277, 1278, 1284, 1291, 1619, 1646,
            1698, 1746, 1964, 2021, 2091, 2099, 2224, 2225, 2227, 2279, 2330, 2334],
        diet: {
            food: ['hope', 'fear'],
            chapters: [1175, 1291],
            observed: 'Both emotions sustain it together. The later Affection discussion confirms this diet beyond the Ren Zu tale.',
        },
    },
    'ice-blade': {
        status: 'unknown',
        searchedChapters: [2, 132, 133, 134, 135, 136, 140, 141, 142, 166, 167, 230, 299, 314, 395, 396, 600, 874,
            1421, 1429],
    },
    'swirl': {
        status: 'unknown',
        searchedChapters: [167, 314],
    },
    'fierce-wind': {
        status: 'unknown',
        searchedChapters: [167, 317, 373, 394, 621, 626, 1341, 1381, 1389, 1390, 1564, 1873, 1925, 2178, 2193, 2304,
            2312],
    },
    'earth-overlord': {
        status: 'unknown',
        searchedChapters: [359, 360, 362, 363, 364, 539, 543, 546],
    },
    'borrow-strength': {
        status: 'unknown',
        searchedChapters: [168, 402, 560, 569, 574, 579, 586, 650, 782, 1561, 1571, 1774, 1792, 1985],
    },
    'wind-overlord': {
        status: 'unknown',
        searchedChapters: [546, 560],
    },
    'tyrant-strength': {
        status: 'unknown',
        searchedChapters: [360, 363, 560],
    },
    'photo-audio': {
        status: 'stated',
        searchedChapters: [16, 45, 60, 156, 179, 180, 183, 186],
        diet: {
            food: ['light', 'sound'],
            chapters: [16],
            observed: 'The cave supplies illumination and outside noise that keep the recording Gu alive.',
        },
    },
    'myriad-self': {
        status: 'unknown',
        searchedChapters: [649, 650, 661, 662, 663, 664, 672, 679, 681, 682, 684, 685, 687, 688, 689, 690, 692, 693,
            694, 696, 710, 720, 723, 731, 732, 736, 748, 763, 765, 769, 777, 779, 780, 782, 783, 785, 787, 790, 800,
            809, 811, 817, 820, 822, 824, 825, 837, 846, 850, 862, 863, 865, 867, 870, 875, 878, 885, 886, 888, 914,
            916, 975, 1086, 1095, 1096, 1097, 1098, 1112, 1127, 1129, 1136, 1137, 1138, 1139, 1140, 1141, 1170,
            1171, 1177, 1236, 1240, 1259, 1263, 1282, 1287, 1288, 1289, 1302, 1394, 1421, 1422, 1423, 1424, 1426,
            1427, 1429, 1430, 1440, 1465, 1505, 1515, 1537, 1538, 1555, 1560, 1561, 1562, 1563, 1568, 1569, 1570,
            1571, 1572, 1580, 1583, 1589, 1596, 1597, 1599, 1631, 1633, 1728, 1736, 1739, 1751, 1752, 1753, 1755,
            1756, 1757, 1758, 1769, 1774, 1777, 1936, 1937, 1938, 1942, 1946, 1974, 2065],
    },
    'self-reliance': {
        status: 'unknown',
        searchedChapters: [161, 286, 292, 296, 299, 300, 318, 319, 321, 342, 345, 360, 362, 428, 504, 516, 517, 522,
            650, 782, 1561, 1570, 1571, 1774],
    },
    'all-out-effort': {
        status: 'unknown',
        searchedChapters: [109, 285, 286, 287, 288, 289, 290, 291, 292, 293, 296, 297, 299, 300, 301, 307, 315, 316,
            317, 318, 319, 320, 321, 340, 343, 345, 349, 353, 361, 363, 368, 378, 388, 397, 494, 500, 504, 516, 534,
            560, 585, 627, 628, 630, 647, 650, 695, 758, 763, 770, 776, 777, 782, 822, 863, 872, 887, 916, 941, 952,
            971, 979, 980, 982, 987, 988, 997, 1561, 1570, 1774],
    },
    'group-strength': {
        status: 'unknown',
        searchedChapters: [678, 679, 682, 685, 687, 732, 735, 750, 782, 783, 803, 1561, 1571, 1655],
    },
    'self-strength': {
        status: 'unknown',
        searchedChapters: [693, 714, 720, 736, 765, 766, 769, 777, 778, 779, 782, 783, 784, 785, 793, 794, 796, 811,
            822, 836, 863, 875, 877, 945, 946, 947, 948, 952, 969, 971, 972, 973, 974, 975, 983, 988, 1058, 1077,
            1078, 1079, 1082, 1291, 1461, 1561, 1571, 1645, 1680, 1683, 1774, 2017],
    },
    'wisdom': {
        status: 'stated',
        searchedChapters: [5, 38, 58, 213, 371, 378, 404, 405, 410, 411, 490, 495, 547, 561, 591, 601, 617, 622,
            637, 638, 639, 641, 642, 643, 645, 646, 647, 649, 650, 651, 652, 655, 657, 658, 659, 663, 664, 665, 670,
            682, 687, 693, 695, 705, 706, 708, 711, 722, 729, 736, 739, 743, 745, 746, 748, 760, 763, 769, 776, 777,
            783, 809, 816, 817, 827, 829, 836, 843, 846, 852, 853, 865, 904, 906, 907, 916, 926, 947, 951, 965, 972,
            986, 995, 1027, 1028, 1029, 1032, 1038, 1039, 1045, 1050, 1051, 1063, 1073, 1074, 1077, 1078, 1079,
            1081, 1082, 1083, 1084, 1085, 1095, 1112, 1128, 1131, 1148, 1152, 1187, 1189, 1221, 1253, 1276, 1283,
            1285, 1291, 1343, 1362, 1380, 1424, 1441, 1446, 1447, 1461, 1465, 1473, 1474, 1476, 1477, 1481, 1540,
            1547, 1548, 1549, 1550, 1551, 1552, 1554, 1557, 1562, 1573, 1575, 1576, 1577, 1580, 1595, 1598, 1599,
            1608, 1617, 1643, 1680, 1694, 1746, 1749, 1750, 1751, 1757, 1758, 1760, 1762, 1934, 1966, 1968, 1980,
            1993, 1996, 2003, 2025, 2036, 2099, 2117, 2121, 2160, 2161, 2176, 2177, 2184, 2192, 2216, 2237, 2245,
            2279, 2292, 2300, 2307, 2309, 2310, 2323, 2329],
        diet: {
            food: ['lifespan Gu'],
            chapters: [1074, 1083],
            observed: 'Rank-nine Wisdom consumes lifespan Gu.',
        },
        starves: {
            chapters: [1074],
            observed: 'Prolonged hunger forces it into deep sleep and prevents use.',
        },
    },
    'spring-autumn-cicada': {
        status: 'stated',
        searchedChapters: [1, 2, 7, 18, 19, 20, 23, 29, 52, 57, 59, 63, 64, 70, 75, 81, 84, 86, 96, 98, 99, 105,
            106, 115, 116, 119, 129, 137, 138, 143, 145, 156, 157, 158, 159, 162, 163, 165, 167, 177, 180, 182, 183,
            184, 186, 187, 196, 197, 202, 204, 212, 222, 226, 228, 230, 231, 258, 269, 271, 273, 277, 278, 283, 286,
            304, 312, 326, 331, 346, 347, 348, 349, 351, 355, 356, 358, 373, 375, 377, 379, 380, 382, 383, 385, 387,
            388, 389, 394, 395, 397, 399, 400, 401, 404, 408, 410, 411, 412, 422, 423, 424, 425, 429, 430, 431, 436,
            437, 445, 449, 459, 463, 464, 469, 475, 477, 493, 494, 500, 504, 507, 508, 544, 558, 564, 567, 568, 572,
            582, 593, 600, 604, 619, 622, 625, 627, 631, 632, 633, 634, 643, 644, 645, 646, 647, 650, 652, 658, 661,
            663, 664, 667, 668, 671, 672, 673, 678, 681, 710, 746, 748, 751, 752, 761, 763, 778, 788, 820, 830, 916,
            945, 965, 969, 970, 971, 972, 975, 988, 1001, 1009, 1011, 1017, 1020, 1021, 1022, 1023, 1027, 1029,
            1030, 1032, 1039, 1044, 1052, 1058, 1060, 1063, 1064, 1067, 1069, 1071, 1073, 1075, 1076, 1079, 1085,
            1088, 1093, 1095, 1101, 1110, 1111, 1129, 1139, 1140, 1144, 1145, 1166, 1175, 1192, 1238, 1239, 1285,
            1291, 1362, 1386, 1388, 1397, 1403, 1406, 1408, 1420, 1422, 1427, 1431, 1435, 1446, 1448, 1461, 1476,
            1477, 1478, 1479, 1480, 1481, 1482, 1490, 1500, 1536, 1559, 1580, 1589, 1593, 1594, 1620, 1628, 1630,
            1634, 1636, 1645, 1647, 1649, 1679, 1680, 1692, 1693, 1695, 1697, 1698, 1702, 1704, 1720, 1724, 1729,
            1745, 1747, 1748, 1749, 1750, 1753, 1754, 1756, 1760, 1761, 1764, 1773, 1774, 1777, 1789, 1793, 1796,
            1807, 1808, 1810, 1814, 1817, 1823, 1887, 1918, 1940, 1946, 1962, 1963, 1973, 1993, 2000, 2032, 2046,
            2096, 2129, 2224, 2232, 2236, 2247, 2250, 2264, 2286],
        diet: {
            food: ['River of Time water'],
            chapters: [23, 346, 672],
            observed: 'It draws sustenance from the river itself without a keeper supplying meals.',
        },
        starves: {
            chapters: [1079, 1095],
            observed: 'A seal cutting off the river leaves it starving, weakening and close to death.',
        },
    },
    'fixed-space': {
        status: 'unknown',
        searchedChapters: [1600, 1603, 1604, 1610, 1611, 1615, 1760, 1783, 1789, 1795, 1852, 1874, 1880],
    },
    'permanence': {
        status: 'unknown',
        searchedChapters: [1795, 2231, 2237, 2308],
    },
    'years-flow-like-water': {
        status: 'stated',
        searchedChapters: [1129, 1130, 1131, 1132, 1138, 1169, 1179, 1221, 1291, 1293, 1299, 1302, 1401, 1402, 1403,
            1416, 1428, 1432, 1452, 1455, 1458, 1461, 1468, 1470, 1572, 1577, 1585, 1599, 1601, 1602, 1606, 1609,
            1679, 1751, 1795, 1812, 1813, 1854, 1883, 2025, 2066],
        diet: {
            food: ['River of Time water'],
            chapters: [1129, 1458],
            observed: 'River water sustains the rank-eight Gu without the usual food-supply burden.',
        },
    },
    'year-gu': {
        status: 'stated',
        searchedChapters: [109, 278, 739, 1129, 1130, 1131, 1132, 1137, 1138, 1139, 1148, 1177, 1179, 1257, 1299,
            1313, 1400, 1401, 1428, 1431, 1451, 1452, 1453, 1454, 1455, 1456, 1458, 1459, 1461, 1462, 1470, 1471,
            1475, 1572, 1585, 1599, 1606, 1609, 1701, 1795, 1884, 2294, 2309],
        diet: {
            food: ['River of Time water'],
            chapters: [1129, 1456],
            observed: 'Year Gu consume river water, making stockpiles straightforward to maintain.',
        },
    },
    'after': {
        status: 'stated',
        searchedChapters: [78, 107, 143, 178, 222, 460, 494, 516, 560, 667, 731, 752, 1007, 1129, 1130, 1131, 1132,
            1136, 1187, 1299, 1374, 1599, 1606, 1658, 1659, 1730, 2163, 2215, 2244, 2284, 2299],
        diet: {
            food: ['immortal materials via black ant mortal Gu'],
            chapters: [1129],
            observed: 'Its ants digest varied immortal materials and deliver nutrients to the parent Gu.',
        },
        starves: {
            chapters: [1129],
            observed: 'Losing too many gatherer ants prevents feeding and can kill the parent through hunger.',
        },
    },
    'beast-enslavement': {
        status: 'unknown',
        searchedChapters: [152, 437, 442, 454, 463, 557, 661, 666, 701, 796, 797, 1080, 1081, 1082, 1094, 1095,
            1098, 1099, 1199, 1200, 1540, 1551, 1758],
    },
    'slavery': {
        status: 'unknown',
        searchedChapters: [330, 348, 384, 387, 399, 400, 401, 407, 422, 442, 467, 484, 492, 495, 581, 649, 656],
    },
    'responsive-luck': {
        status: 'unknown',
        searchedChapters: [1919, 1962, 1966],
    },
    'reputation-restriction': {
        status: 'unknown',
        searchedChapters: [1306, 1369, 1370, 1374, 1461],
    },
    'eat-strength': {
        status: 'unknown',
        searchedChapters: [758, 759, 760, 769, 778, 779, 784, 836, 850, 852, 886, 907, 909, 961, 972, 1079, 1080,
            1133, 1465, 1467, 1571, 2083],
    },
    'pulling-mountain': {
        status: 'unknown',
        searchedChapters: [752, 754, 758, 769, 777, 780, 790, 791, 799, 809, 817, 822, 824, 837, 850, 875, 961, 972,
            990, 1079, 1082, 1095, 1096, 1113, 1133, 1148, 1152, 1158, 1167, 1291, 1312, 1461, 1488, 1550, 1561,
            1590, 1591, 1645, 1680, 1683, 1752],
    },
    'pulling-water': {
        status: 'unknown',
        searchedChapters: [753, 754, 758, 769, 777, 780, 797, 800, 817, 824, 846, 850, 875, 910, 961, 972, 1079,
            1082, 1133, 1248, 1287, 1288, 1291, 1293, 1461, 1561, 1571, 1590, 1645, 1683, 1770],
    },
    'fight': {
        status: 'unknown',
        searchedChapters: [457, 458, 876, 1394, 1395, 1396, 1401, 1937],
    },
};

function merged() {
    const kinds = new Set([...Object.keys(bindings), ...Object.keys(partsRows)]);
    return Object.fromEntries([...kinds].map(kind => [kind, {...bindings[kind], ...partsRows[kind], body: bodyRows[kind]}]));
}
export const guCatalogue = deepFreeze(merged());
