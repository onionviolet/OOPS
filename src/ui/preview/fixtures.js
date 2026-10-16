// R17 preview fixtures (PV7): hand-made, observer-safe frames in the shape `read()` returns in the
// game. Only facts a new player already sees in the Village at the start; no sealed content. The
// place text is the public base-game Village description, as the game shows it at the start.

const villageDescription = "Medium-sized village, built at the foot of the mountains, with rocks preventing any expansions towards north. It's surrounded by many fields, most of them infested by huge rats. There is a relatively calm, somewhat small river south of it with no bridges over it, and with some old structures on the other side, clearly not used for years if not longer. Many villagers seem to have nothing to do and are just sitting around.";

const villagePeople = [
    {id: 'village elder', name: 'village elder', role: 'Village neighbor', met: true, traits: [], relationship: null},
    {id: 'village trader', name: 'village trader', role: 'Merchant', met: true, traits: [], relationship: null},
];
const villageThings = [
    {id: 'mixing', name: 'Village mixing counter', description: 'Mix and observe your own ingredients.'},
    {id: 'crafting', name: 'Crafting stations', description: 'Use the available native crafting stations.'},
    {id: 'projects', name: 'Projects', description: 'Read optional proposals before opting in.'},
];

export const FIXTURES = {
    village: {
        title: 'Village, morning, populated save',
        legacy: {location_description_div: villageDescription},
        village: {
            inVillage: true, place: 'Village', placeTypes: [],
            clock: 'Village · 01/04/999 08:01, Summer, Mon · Day · Dry · 14.7°C',
            people: villagePeople, things: villageThings,
            actions: [...villagePeople.map(p => ({id: `talk:${p.id}`, target: p.id, label: `Talk with ${p.name}`, disabled: false, reason: ''})),
                ...villageThings.map(t => ({id: t.id, target: t.id, label: t.id === 'projects' ? 'Open Projects' : `Open ${t.name}`, disabled: false, reason: ''}))],
            enemies: [], enemy: null, dialogue: null, history: [],
        },
        work: {work: [], waiting: false, canWrite: true, error: null, world: 'base.frontier', away: false},
        // Placeholders stand in for panels still drawn by display.js or proto23_shell.js; `rows`
        // approximates their height so regions size like the game's.
        placeholders: {
            vitals: {rows: 4, note: 'Name, level, health, xp and stamina bars'},
            'shell-character': {rows: 7, note: 'Core and secondary stats, Attributes, Gear'},
            'shell-inventory-tools': {rows: 1, note: 'Category, sort and reverse'},
            belongings: {rows: 16, note: 'Purse, search and item rows'},
            'local-actions': {rows: 8, note: 'Local actions list'},
            'pane-navigation': {rows: 1, note: 'Here · Skills · Crafting · Mixing · ?'},
            records: {rows: 3, note: 'Journal: active quests'},
            skills: {rows: 5, note: 'Skills groups and Stances'},
            messages: {rows: 3, note: 'Reports log'},
            'shell-log-tools': {rows: 2, note: 'Filters, follow, latest, clear'},
        },
    },
};
