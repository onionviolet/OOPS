// Fixture for the whole-UI directions gallery (docs/audits/UI_DIRECTIONS_2026-10-30.md). Proposals only.
// Village and Tingen strings are copied from fresh lives played through the game MCP on 2026-10-30 (seeds 3001, 3002;
// Tingen as a Nighthawk probationer). Illustrative, not played: agenda rows, Village place times, and the Tingen next-step line.
export const ROUTES = ['Stats', 'Condition', 'Inventory', 'Journal', 'Data', 'Knows', 'Travelers', 'Projects', 'Ledger', 'Worlds', 'Beginning', 'Connection', 'Settings'];
// The six task hubs from round 8 O2, with the real routes each one absorbs (UR13: each move logs a line and a dot).
export const HUBS = [
    {id: 'you', label: 'You', routes: ['Stats', 'Condition', 'Beginning']},
    {id: 'belongings', label: 'Belongings', routes: ['Inventory']},
    {id: 'people', label: 'People', routes: ['Knows', 'Travelers']},
    {id: 'work', label: 'Work and time', routes: ['Journal', 'Projects', 'Ledger']},
    {id: 'world', label: 'World', routes: ['Worlds', 'Data']},
    {id: 'system', label: 'System', routes: ['Connection', 'Settings']},
];
export const COUNTS = {routes: 13, registeredPanels: 83, allPanelsList: 56, firstScreenClickables: 145};

export const FIXTURES = {
    village: {
        id: 'village', title: 'Fresh Village life', place: 'Village', world: 'village',
        clock: '01/04/999 08:00, Mon · ☼ Day', scene: 'Daylight falls across the village path.', weather: '☀ Summer · Dry · 14.7 °C · comfortable',
        nextStep: {text: 'Talk to the village elder.', how: 'In Local actions: Talk to someone, then Talk to village elder.'},
        vitals: {level: 0, xp: [0, 10], stamina: [40, 40], hp: [60, 60]},
        stats: [['STR', '12.0'], ['AGL', '8.0'], ['DEX', '10.0'], ['INT', '10.0'], ['Defense', '1.0'], ['Attack', '1.2']],
        people: [{id: 'village-elder', name: 'village elder', role: 'Village neighbor', want: 'Wants a word. Quest: Lost memory.'}, {id: 'village-trader', name: 'village trader', role: 'Merchant'}],
        services: [{name: 'Waypost supply clerk', note: 'Supply clerk'}, {name: 'Homes', note: 'Residence rights, furnishings, storage and optional home beginnings.'},
            {name: 'Village mixing counter', note: 'Mix and observe your own ingredients.'}, {name: 'Village common herb verge', note: 'Gather common herbs and inspect your carried materials and preparations.'},
            {name: 'Gear workshop', note: 'Inspect and work on carried gear: fittings, treatment, repair, reforge and salvage.'}],
        actions: [
            {id: 'move', verb: 'Travel', label: 'Move somewhere else', time: '', cost: ''},
            {id: 'talk', verb: 'Talk', label: 'Talk to someone', time: '5 min', cost: '', pick: true},
            {id: 'work', verb: 'Work', label: 'Find work', time: '2 h', cost: 'Pays 5C per 2 hours worked'},
            {id: 'cross', verb: 'Travel', label: 'Cross to another world: Tingen', time: '', cost: ''},
            {id: 'mix', verb: 'Make', label: 'Mix at the Village counter', time: '', cost: ''},
        ],
        items: [{name: 'Stale bread', count: 5, value: '2 C'}, {name: 'Cheap leather pants [40%]', count: 1, value: '4 C'}],
        money: '10C 2W',
        reports: ['[ Home · 01/04/999, Summer, Mon ]', 'Started a new quest: Lost memory', 'Your name is set in the You panel header. Click it to rename.'],
        // Illustrative agenda and place times.
        agenda: [{at: '08:00', text: 'Now: the elder is waiting.', state: 'now'}, {at: '10:00', text: 'Work pays 5C per 2 hours.', state: 'open'}, {at: 'Dusk', text: 'Nothing due yet.', state: 'quiet'}],
        returnNote: 'First morning. Nothing has changed while you were away.',
        places: [{id: 'v-path', name: 'Village', x: 50, y: 52, here: true}, {id: 'v-willow', name: 'Wild willow stand', x: 22, y: 30, time: '~10 min'}, {id: 'v-field', name: 'Infested field', x: 80, y: 28, time: '~25 min'}, {id: 'v-tingen', name: 'Tingen (another world)', x: 24, y: 76, time: 'crossing'}],
        // Village has no ladder yet: skills are one flat list, shown as one ladder of ordinary practice.
        ladders: [{name: 'Practice', shape: 'ladder', now: 'Level 0', next: 'Level 1 at 10 xp'}, {name: 'Everyday skills', shape: 'field', now: 'none practised', next: 'any skill grows with use; no order'}],
        blocked: null, discoveryDots: ['Journal', 'Knows'],
    },
    tingen: {
        id: 'tingen', title: 'Tingen life, first hour (Nighthawk probationer)', place: 'Tingen supervised workroom', world: 'tingen',
        clock: 'Day 1 09:00', scene: 'You are at Tingen supervised workroom, North quarter.', weather: 'Local weather unavailable · Local date unavailable',
        // Real Tingen shell has no next-step line once the first report is made (band vanished after declining the dose); this one is a proposal.
        nextStep: {text: 'Find out what the night watch needs.', how: 'Both watch tasks are blocked. Warden Hale issues them; his attention is 6. (Proposed line.)'},
        vitals: {level: 0, xp: [0, 10], stamina: [40, 40], hp: [60, 60]},
        stats: [['STR', '12.0'], ['AGL', '8.0'], ['DEX', '10.0'], ['INT', '10.0'], ['Defense', '1.0'], ['Attack', '1.2']],
        people: [{id: 'hale', name: 'Warden Hale', role: 'Supervisor, Nighthawks workroom', want: 'Holds an allocated dose. The offer stands while he holds it.'}],
        services: [{name: 'Tingen workroom', note: 'Pathway, clearance, merit and the brewing bench.'}, {name: 'Evidence store', note: 'Merit buys a formula or a lot.'}, {name: 'Continuing connection', note: 'Your Village life is paused where you left it.'}],
        actions: [
            {id: 'watch', verb: 'Work', label: 'Stand a night watch over the cold room for Warden Hale', time: '60 min', cost: 'earns 2 merit', blocked: 'The required knowledge, means or circumstances are missing.'},
            {id: 'copy', verb: 'Work', label: 'Copy a closed case file into the church records', time: '30 min', cost: 'earns 1 merit', blocked: 'The required knowledge, means or circumstances are missing.'},
            {id: 'formula', verb: 'Study', label: 'A recovered copy of the Sequence 8 Light Supplicant formula', time: '', cost: '8 merit', blocked: 'It costs 8 merit; you hold 0.'},
            {id: 'walk', verb: 'Travel', label: 'Walk to Tingen probationer lodging', time: '2 min', cost: ''},
        ],
        items: [{name: 'Clerk purse', count: 1, value: '2 pounds'}],
        money: '2 pounds',
        reports: ['[ Entering Tingen supervised workroom ]', 'Your first day in Tingen begins.', 'You declined. Nothing was spent and no faculty was granted; your post and the supervisor\'s goodwill are unchanged.'],
        // Illustrative agenda: the shell has no agenda; rows restate real facts (merit 0, notebook entries, watch blocked).
        agenda: [{at: '09:00', text: 'Notebook has 2 new entries.', state: 'now'}, {at: 'Open', text: 'Night watch, 60 min: blocked, reason unnamed.', state: 'open'}, {at: 'Later', text: 'Evidence store: 3 merit buys crystal sunflower.', state: 'soon'}],
        returnNote: 'An hour passed. Statistics and World events are now available in navigation.',
        places: [{id: 't-work', name: 'Tingen supervised workroom', x: 46, y: 50, here: true}, {id: 't-lodging', name: 'Probationer lodging', x: 22, y: 70, time: '2 min'}, {id: 't-docks', name: 'Tingen docks', x: 78, y: 28, time: '20 min'}, {id: 't-uni', name: 'University area', x: 24, y: 24, time: '25 min'}],
        // Both pathways were listed in the played workroom; one pathway per life is the stated rule, so the two pathways are shown as branches of one fork; mixing is possible by the world's own risk and cost, not drawn here. Shapes: ladder, branch (tree), field (no order), wheel, web, none.
        ladders: [{name: 'Seer pathway', shape: 'branch', now: 'Ordinary clerk', next: 'Sequence 9 · Seer (dose offered)'}, {name: 'Corpse Collector pathway', shape: 'branch', now: 'Ordinary clerk', next: 'Sequence 9 · Corpse Collector (offered)'}, {name: 'Nighthawk merit', shape: 'ladder', now: '0 merit', next: '2 merit per watch'}],
        blocked: 'The required knowledge, means or circumstances are missing.', discoveryDots: ['Ledger'],
    },
};

// What each of the 21 representation views is, and where each direction puts it (verb, hub, desk object).
export const VIEWS = [
    ['First hour', 'Today', 'Learn', 'Notebook, first page'], ['Character sheet', 'You', 'Inspect', 'Mirror'], ['Abilities', 'You', 'Study', 'Notebook, skills'],
    ['Body and conditions', 'You', 'Inspect', 'Mirror'], ['Items', 'Belongings', 'Inspect', 'Satchel'], ['Crafting', 'Work', 'Make', 'Bench'],
    ['Mixing', 'Work', 'Make', 'Bench'], ['Rituals and making', 'Work', 'Make', 'Bench'], ['Combat', 'Today', 'Fight', 'Door'],
    ['Talk', 'People', 'Talk', 'Table, person cards'], ['Relationship web', 'People', 'Talk', 'Corkboard'], ['Family tree', 'People', 'Talk', 'Corkboard'],
    ['Organizations', 'People', 'Join', 'Letters'], ['Economy and institutions', 'World', 'Trade', 'Ledger book'], ['Knowledge', 'Work', 'Study', 'Notebook, notes'],
    ['Research', 'Work', 'Study', 'Notebook, notes'], ['Maps and travel', 'World', 'Travel', 'Map table'], ['Spacetime', 'World', 'Travel', 'Map table'],
    ['Worlds and crossings', 'World', 'Travel', 'Door'], ['Time and chronicle', 'Today', 'Learn', 'Calendar and journal'], ['Chronicle return note', 'Today', 'Learn', 'Letters'],
];
