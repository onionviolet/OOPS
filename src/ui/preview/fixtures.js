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

// R20 combat fixtures in the public opponent projection shape (opponent_board.js). Knowledge is
// stated per fact. "All known" is a labelled fixture case only; the game has no knowledge system
// yet and missing knowledge renders as unknown (NX22). Names and numbers mirror the base game's
// first field fight; nothing sealed.
const facts = (known, values = {}) => [['Attack', '4 dmg'], ['Speed', '0.82 /s'], ['Hit you', '35%'], ['Evade you', '18%'], ['Defense', '0'], ['You hit them', '82%']]
    .map(([label, value]) => ({label, value: values[label] ?? value, knowledge: typeof known === 'function' ? known(label) : known}));
const opponent = (slot, name, hp, knowledge, extra = {}) => ({id: `preview_opponent_${slot}`, slot, letter: String.fromCharCode(65 + slot), name,
    defeated: hp === 0, cycle: (slot * 23) % 100, health: {text: `${hp}/20 hp`, progress: hp * 5, knowledge: knowledge === 'unknown' ? 'unknown' : knowledge === 'partial' ? 'known' : knowledge},
    facts: facts(knowledge === 'partial' ? label => ['Attack', 'Speed'].includes(label) ? 'known' : label === 'Hit you' ? 'partial' : 'unknown' : knowledge, knowledge === 'partial' ? {'Hit you': '30–40%'} : {}), ...extra});
const combat = (title, opponents) => ({
    title, legacy: {location_description_div: 'Fields infested by huge rats.'},
    village: {inVillage: false, place: 'Infested field', placeTypes: [], clock: 'Infested field · 01/04/999 08:17, Summer, Mon · Day · Dry · 15.0°C',
        people: [], things: [], actions: [], enemies: [], enemy: null, dialogue: null, history: [],
        opponents: {source: 'fixture', encounter: {groupsLeft: '15 / 15', clears: 'Clears: [0]'}, opponents}},
    work: {work: [], waiting: false, canWrite: true, error: null, world: 'base.frontier', away: false},
});
const rats = (n, knowledge, down = -1) => Array.from({length: n}, (_, i) => opponent(i, 'Starving wolf rat', i === down ? 0 : Math.max(1, 20 - (i * 3) % 17), knowledge));

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
    'combat-unknown': combat('Fight · 3 opponents · unknown (nothing learned)', rats(3, 'unknown')),
    'combat-partial': combat('Fight · 3 opponents · partial (some facts, one estimate)', rats(3, 'partial')),
    'combat-known': combat('Fight · 1 opponent · ALL-KNOWN fixture case (not the game default)', rats(1, 'known')),
    'combat-five': combat('Fight · 5 opponents · native readout, one defeated', rats(5, 'native', 1)),
    'combat-nine': combat('Fight · 9 opponents · native readout, one defeated', rats(9, 'native', 4)),
};
// Combat fixtures stand on the same placeholder panels as the Village.
for (const fixture of Object.values(FIXTURES)) fixture.placeholders ||= FIXTURES.village.placeholders;
