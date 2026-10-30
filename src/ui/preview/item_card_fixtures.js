// Generic item fixtures for the item card gallery and tests (no canon names, CLR3). Each is a plain object
// exposing the same readers the live item classes do.
const make = ({name, slot, quality, defense = 0, attack = 0, stats = {}, gearwork = null}) => ({
    equip_slot: slot, quality, gearwork, tags: {equippable: true}, getName: () => name, name,
    getDefense: () => defense, getAttack: () => attack, getShieldStrength: () => 0, getStats: () => stats,
});
const jerkin = make({name: 'Patched jerkin', slot: 'torso', quality: 40, defense: 2, stats: {cold_tolerance: {flat: 0.5}, agility: {multiplier: 0.99}}});
const mailShirt = make({name: 'Riveted shirt', slot: 'torso', quality: 112, defense: 6, stats: {cold_tolerance: {flat: 0.2}, agility: {multiplier: 0.93}, damage_taken: {multiplier: 0.95}},
    gearwork: {history: [{action: 'reforge', maker: 'oldCraftsman', location: 'the lower forge'}, {action: 'repair', maker: 'you', location: 'the village'}], roles: {plate: {name: 'Scrap steel', grade: 3}}, treatment: {stage: 'tempered'}}});
export const ITEM_CARD_FIXTURES = [
    {id: 'first-gear', title: 'First minutes: a carried jerkin, nothing worn', item: jerkin, worn: null, info: {rarity: 'trash'}},
    {id: 'upgrade', title: 'Worn jerkin vs a reforged shirt (in hand)', item: mailShirt, worn: jerkin, info: {rarity: 'common', wearFactor: 0.62, count: 1}},
    {id: 'unappraised', title: 'The same shirt through a glance (AP1)', item: mailShirt, worn: jerkin, info: {rarity: 'common', level: 'AP1'}},
    {id: 'estimated', title: 'Estimate only (AP2): band, no numbers', item: mailShirt, worn: jerkin, info: {rarity: 'common', level: 'AP2'}},
    {id: 'measured', title: 'Measured (AP3): numbers, no past', item: mailShirt, worn: jerkin, info: {rarity: 'common', level: 'AP3'}},
];
