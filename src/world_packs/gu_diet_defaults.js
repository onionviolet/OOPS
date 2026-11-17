// Mechanism diet defaults for catalogue Gu whose food the chapters leave unstated (GKM440, proposal under AD32,
// 2026-11-16). Every row is authored, not canon: the chapter feeding search in gu_catalogue.js `body` found no
// food for these kinds, so each gets a default with its reason and its cost to the keeper. A stated food in the
// catalogue body always wins; gu_body_cases.js reads these only where `body.diet` is absent.
// Order of reasons (dial: per row): lineage first (a Gu made from another eats like it, the RI_DAY_DIETS
// precedent in ri_lead_day_facts.js), then a stated diet on the same path (all three stated time-path Gu drink
// River of Time water: spring-autumn-cicada, years-flow-like-water, year-gu), then the path and what the Gu does
// (wood eats plants, light eats light, a Gu that works stone eats stone). Rank six and up eat their path's
// immortal materials, as After does through its ants (ch1129) and as Snack exists to solve (ch1457).
// Food is never primeval essence: essence is what activation spends (GKM439).
// `luna` is the Luna pass's category where it proposed one (label_followups gu_diet; 12 of 44 stated foods
// matched its category), kept only as a weak prior and a tie-breaker; `carried` marks the kinds Fang Yuan holds
// or meets by chapter 140, filled first (GKM446).
import {deepFreeze} from '../basics.js';

const d = (food, category, basis, reason, cost, extra = {}) => ({food, category, basis, reason, cost, ...extra});
const IMMORTAL = 'Rank six and up eat their path\'s immortal materials (After ch1129, Snack ch1457)';

export const GU_DIET_DEFAULTS = deepFreeze({
    // Fang Yuan's early Gu (GKM446): chapters 70 to 140.
    'little-light': d(['moonlight'], 'element-or-weather', 'path', 'A light-path support for the Moonblade; light Gu take in the light they work with, as Photo Audio eats light (stated).', 'Free on a clear night; a keeper in a cave or a moonless week must carry it to open sky.', {carried: true}),
    'moon-scar': d(['moon orchid petals'], 'plants', 'lineage', 'Made from Moonlight Gu with Stone Scar; it eats like Moonlight (ch23 food).', 'Two petals a meal like its parent, so the same stall price as any Moonlight Gu.', {carried: true}),
    'stone-scar': d(['rock'], 'minerals-or-metal', 'mechanism', 'A stone fusion ingredient; it takes in the material it marks, as White Jade eats jade rock (stated).', 'Common rock is cheap; the cost is carrying it, not buying it.', {carried: true}),
    'vitality-leaf': d(['water', 'sunlight'], 'plants', 'lineage', 'A leaf detached from Vitality Grass keeps its grass\'s needs (water and sunlight, stated together).', 'Cheap, but a leaf is spent when used, so feeding only keeps it fresh until then.', {carried: true}),
    'stealth-rock': d(['rock'], 'minerals-or-metal', 'path', 'An earth-path Gu that hides the body like stone; earth Gu eat raw stone, as White Jade eats jade rock (stated).', 'Cheap and heavy: a pouch of rock per meal.', {carried: true}),
    'fish-scale': d(['fish scales'], 'meat-or-blood', 'mechanism', 'It works with scales and is fused into armour; it eats the raw scales it grows from.', 'Cheap at a fishing village, scarce in the mountains.', {carried: true, luna: 'other'}),
    'stealth-scales': d(['rock', 'fish scales'], 'minerals-or-metal', 'lineage', 'Fused from Stealth Rock and Fish Scale; either parent\'s food feeds it.', 'Cheap: rock or scales, whichever is nearer.', {carried: true}),
    'scale-armor': d(['fish scales'], 'meat-or-blood', 'lineage', 'Fused from Fish Scale; it keeps its parent\'s food.', 'Cheap where fish are caught.', {carried: true}),
    plunder: d(['wild Gu worms'], 'other-gu-or-insects', 'mechanism', 'A theft Gu that pulls Gu out of others; it feeds on the Gu it takes, a food that is itself a living thing (GKM442).', 'Very dear: each meal is a Gu someone could have used.', {carried: true, luna: 'other'}),
    // Lightning and wolf-hosted Gu (ch150 onward).
    thunderclap: d(['storm charge'], 'element-or-weather', 'path', 'A lightning-path Gu; it takes in the charge it throws. Hosted in a lightning wolf it draws on its host.', 'Free in a storm season or while hosted; a kept specimen must be taken out under thunder.'),
    'lightning-eye': d(['storm charge'], 'element-or-weather', 'path', 'A lightning-path Gu hosted in wolves; lightning Gu take in charge.', 'As Thunderclap.'),
    thunderwings: d(['storm charge'], 'element-or-weather', 'path', 'A lightning-path flying Gu hosted in wolves; lightning Gu take in charge.', 'As Thunderclap.'),
    'thunder-shield': d(['storm charge'], 'element-or-weather', 'mechanism', 'It raises a lightning shield and fled a lightning wolf; lightning Gu take in charge.', 'As Thunderclap.'),
    'water-shield': d(['water'], 'element-or-weather', 'path', 'A water-path guard; water Gu drink the water they shape.', 'Cheap; the cost is a filled jar on the march.'),
    // Fire set (ch266 to 275).
    'red-fire': d(['embers'], 'element-or-weather', 'mechanism', 'The fire set\'s attack; fire Gu feed on burning fuel.', 'Cheap where wood burns, a chore on a long road.'),
    'fire-discharge': d(['embers'], 'element-or-weather', 'path', 'A fire-path movement Gu; fire Gu feed on burning fuel.', 'As Red Fire.'),
    'moving-fire': d(['embers'], 'element-or-weather', 'path', 'A fire-path Gu that leaves flames behind; fire Gu feed on burning fuel.', 'As Red Fire.'),
    'fire-source': d(['embers'], 'element-or-weather', 'mechanism', 'It lowers the fire set\'s cost; a fire support eats what the set burns.', 'As Red Fire.'),
    duplicate: d(['embers'], 'element-or-weather', 'mechanism', 'It multiplies flames; a flame support eats what it works on.', 'As Red Fire.'),
    enlarge: d(['embers'], 'element-or-weather', 'mechanism', 'It enlarges flames; a flame support eats what it works on.', 'As Red Fire.'),
    'light-source': d(['sunlight'], 'element-or-weather', 'path', 'A light-path support; light Gu take in light, as Photo Audio does (stated).', 'Free by day, a problem underground.', {luna: 'element-or-weather'}),
    'rainbow-light': d(['sunlight'], 'element-or-weather', 'path', 'A light-path movement Gu; light Gu take in light.', 'Free by day, a problem underground.'),
    'charging-crash': d(['beast meat'], 'meat-or-blood', 'mechanism', 'A charging movement Gu fused from Horizontal Charge and Vertical Crash; a body-driving Gu eats meat.', 'Moderate: meat must be bought or hunted.'),
    'charred-thunder-potato': d(['fertile soil'], 'plants', 'mechanism', 'Grown in fertile soil as an immobile plant-like Gu; it feeds from the soil it sits in.', 'Cheap, but the soil wears out and needs renewing.'),
    'charred-thunder-potato-mother': d(['fertile soil'], 'plants', 'lineage', 'The mother of Charred Thunder Potatoes; it eats what its sprouts eat.', 'Cheap, but the soil wears out and needs renewing.'),
    'starlight-firefly': d(['starlight'], 'element-or-weather', 'path', 'A star-path insect Gu that gives light; light and star Gu take in light.', 'Free under open sky; a hive kept indoors starves.'),
    // Liquor worms: lineage from the stated wines.
    'seven-fragrances-liquor-worm': d(['fine liquor'], 'liquor-or-prepared-food', 'lineage', 'Made from two Four Flavors Liquor Worms, which drink fine liquor (stated).', 'Dear: fine liquor costs more than green bamboo wine.'),
    'nine-eyes-liquor-worm': d(['fine liquor'], 'liquor-or-prepared-food', 'lineage', 'Made from two Seven Fragrances Liquor Worms; it keeps the Liquor Worm line\'s drink.', 'Dear, as Seven Fragrances.'),
    // Wind and ice (ch167 Iceblade Storm).
    swirl: d(['wind'], 'element-or-weather', 'mechanism', 'It spins the iceblades; a wind Gu takes in moving air.', 'Free outdoors, scarce in still valleys.', {luna: 'element-or-weather'}),
    'fierce-wind': d(['wind'], 'element-or-weather', 'path', 'A wind-path Gu; wind Gu take in moving air.', 'Free outdoors, scarce in still valleys.', {luna: 'element-or-weather'}),
    'ice-blade': d(['snow'], 'element-or-weather', 'mechanism', 'It forms ice; an ice Gu takes in cold water and snow.', 'Free in winter or on peaks, a melt problem in summer.'),
    // Strength path, mortal: they eat meat (a muscle-building Gu eats muscle).
    'all-out-effort': d(['beast meat'], 'meat-or-blood', 'path', 'A strength-path Gu spanning ranks one to five; strength Gu eat meat.', 'Moderate: meat must be bought or hunted.'),
    'borrow-strength': d(['beast meat'], 'meat-or-blood', 'path', 'A strength-path support; strength Gu eat meat.', 'Moderate.'),
    'earth-overlord': d(['rock'], 'minerals-or-metal', 'mechanism', 'A strength Gu that borrows force from the ground; it eats stone.', 'Cheap and heavy.'),
    'group-strength': d(['beast meat'], 'meat-or-blood', 'path', 'A strength-path support; strength Gu eat meat.', 'Moderate.', {luna: 'other'}),
    'tyrant-strength': d(['beast meat'], 'meat-or-blood', 'path', 'A strength-path support; strength Gu eat meat.', 'Moderate.', {luna: 'meat-or-blood'}),
    'wind-overlord': d(['wind'], 'element-or-weather', 'mechanism', 'A strength Gu that borrows force from the wind; it takes in moving air.', 'Free outdoors, scarce in still valleys.', {luna: 'element-or-weather'}),
    'self-reliance': d(['beast meat'], 'meat-or-blood', 'mechanism', 'It heals by the Gu Master\'s own strength; a strength-linked Gu eats meat.', 'Moderate, and hundreds of them were kept at once.'),
    // Time path: the stated precedent.
    'mountain-as-before': d(['River of Time water'], 'element-or-weather', 'path', 'A time-path Gu; every stated time-path diet is River of Time water.', 'Rare: River of Time water is hard to reach, so a mortal keeper may not manage it at all.'),
    'river-as-before': d(['River of Time water'], 'element-or-weather', 'path', 'A time-path Gu; every stated time-path diet is River of Time water.', 'As Mountain as Before.'),
    'landscape-as-before': d(['River of Time water'], 'element-or-weather', 'path', 'A time-path Immortal Gu made from River and Mountain as Before; both the path and its parents point to River of Time water.', 'Rare.'),
    'man-as-before': d(['River of Time water'], 'element-or-weather', 'path', 'A time-path vital Gu raised to Immortal; time-path Gu drink River of Time water.', 'Rare.', {luna: 'other'}),
    // Immortal Gu (rank six and up): their path's immortal materials.
    'ant-nest': d(['immortal materials'], 'other', 'mechanism', `It already turns immortal materials into ants; ${IMMORTAL}.`, 'Dear: immortal materials, and more as the nest grows.'),
    'beast-enslavement': d(['enslavement path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'meat-or-blood'}),
    slavery: d(['enslavement path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'emotion-thought-or-soul'}),
    'blood-asset': d(['fresh blood'], 'meat-or-blood', 'path', 'A blood-path Immortal Gu; blood Gu take in blood, the raw form of what they work.', 'Cheap per jar, but an Immortal Gu drinks a lot.', {luna: 'meat-or-blood'}),
    'change-form': d(['transformation path immortal materials'], 'other', 'mechanism', `${IMMORTAL}. Luna's blood pick does not follow from a form-changing Gu.`, 'Dear.', {luna: 'meat-or-blood'}),
    'eat-strength': d(['strength path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'meat-or-blood'}),
    'pulling-mountain': d(['strength path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'minerals-or-metal'}),
    'pulling-water': d(['strength path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'element-or-weather'}),
    'self-strength': d(['strength path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'other'}),
    'myriad-self': d(['strength path immortal materials'], 'other', 'mechanism', `A rank-seven Gu whose phantoms are strength; ${IMMORTAL}.`, 'Dear.'),
    fight: d(['rule path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'other'}),
    permanence: d(['rule path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'minerals-or-metal'}),
    'formation-plate': d(['formation path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.'),
    'fixed-space': d(['space path immortal materials'], 'other', 'mechanism', `A space-path Gu stable only once its marks were stripped; ${IMMORTAL}.`, 'Dear.', {luna: 'primeval-stones-or-essence'}),
    'heavenly-essence-treasure-imperial-lotus': d(['wood path immortal materials'], 'plants', 'mechanism', `A wood-path rank-eight lotus; ${IMMORTAL}, and wood eats what grows.`, 'Dear.', {luna: 'plants'}),
    light: d(['light path immortal materials'], 'element-or-weather', 'mechanism', `A wild rank-nine light Gu; ${IMMORTAL}.`, 'Very dear at rank nine.', {luna: 'element-or-weather'}),
    'reputation-restriction': d(['information path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.', {luna: 'other'}),
    'responsive-luck': d(['luck path immortal materials'], 'other', 'mechanism', IMMORTAL, 'Dear.'),
    small: d(['rule path immortal materials'], 'other', 'mechanism', `A rank-seven rule-path Gu; ${IMMORTAL}.`, 'Dear.'),
    'great-thief': d(['theft path immortal materials'], 'other', 'mechanism', `A rank-eight theft-path Gu; ${IMMORTAL}.`, 'Very dear at rank eight.'),
    'heavenly-web': d(['heaven path immortal materials'], 'other', 'mechanism', `A heaven-path Gu of rank eight and nine; ${IMMORTAL}. Heavenly Secret, also heaven path, eats splendid clouds (stated), the dial to try when a reading settles it.`, 'Very dear.'),
    // A provisional sighting inside an ancient beast: hosted, it lives on its host.
    'yaksha-octopus-king-wild-immortal': d(['host beast'], 'other', 'mechanism', 'Seen only living inside an ancient beast; a hosted Gu draws on its host.', 'Nothing while hosted; unknown once taken.'),
});
