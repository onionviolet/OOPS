// Character sheet fixtures (docs/representations/CHARACTER_SHEET.md): the player and one met person,
// with named reads from a plain look to divination. Invented names only (CLR3). Pure data; the gallery
// mount lives in ../character_sheet_gallery.js and tests import this file directly.
export const SHEET_PLAYER = {
    id: 'player', name: 'You', kind: 'Human', rank: 2, level: {value: 7},
    appearance: [{id: 'build', label: 'Build', value: 'Lean, road-tanned, a healed cut across one knuckle'}],
    stats: [
        {id: 'strength', label: 'Strength', value: 9.4, desc: 'Heavier blows and loads.'},
        {id: 'agility', label: 'Agility', value: 11.2, desc: 'Dodging and moving quickly.'},
        {id: 'dexterity', label: 'Dexterity', value: 8.1, desc: 'Precise hands; hitting what you aim at.'},
        {id: 'intuition', label: 'Intuition', value: 12.6, desc: 'Noticing, reading people and danger.'},
        {id: 'magic', label: 'Magic', value: 3.0, desc: 'What little power you can draw on.'},
    ],
    abilities: [
        {id: 'appraise', label: 'Appraise', level: 3, tier: 'practised', desc: 'Read a person or object you study: rank 3 reaches exact numbers on anyone not above you.'},
        {id: 'woodcraft', label: 'Woodcraft', level: 5, tier: 'journeyman', desc: 'Cut, shape and judge timber; faster work and better kits.'},
    ],
    conditions: [{id: 'tired', label: 'Tired', value: 'mild', desc: 'Work goes a little slower until you rest.'}],
    gear: [
        {id: 'hatchet', label: 'Hatchet', value: 'in hand', desc: 'A sound working edge.'},
        {id: 'coat', label: 'Oilcloth coat', value: 'worn', desc: 'Keeps the rain off.'},
    ],
    traits: [
        {id: 'early', label: 'Early riser', visible: true, desc: 'You wake with the light; mornings start sooner.'},
        {id: 'unease', label: 'Old unease', hidden: true, desc: 'A sealed fixture trait your own sense cannot see.'},
    ],
    standing: [{id: 'village', label: 'Village', value: 'known face, owed one favour', public: true}],
};
export const SHEET_PERSON = {
    id: 'edda', name: 'Edda Marrow', kind: 'Human, lamp-warden', rank: 3, level: {value: 23}, nameKey: 'person.edda.name',
    appearance: [
        {id: 'look', label: 'Look', value: 'A tall woman in a grey coat, lamp-soot on her cuffs'},
        {id: 'manner', label: 'Manner', value: 'Watches doors before faces'},
    ],
    stats: [
        {id: 'strength', label: 'Strength', value: 14, desc: 'Heavier blows and loads.'},
        {id: 'agility', label: 'Agility', value: 17, desc: 'Dodging and moving quickly.'},
        {id: 'dexterity', label: 'Dexterity', value: 21, desc: 'Precise hands; hitting what you aim at.'},
        {id: 'intuition', label: 'Intuition', value: 26, desc: 'Noticing, reading people and danger.'},
        {id: 'magic', label: 'Magic', value: 38, desc: 'Power she can draw on.'},
    ],
    abilities: [
        {id: 'lampcraft', label: 'Lampcraft', level: 6, tier: 'warden', desc: 'Lights that hold back what walks at night; a lit lamp makes her ward stronger.'},
        {id: 'stillness', label: 'Stillness', level: 4, tier: 'trained', desc: 'Stands so quietly that a careless watcher loses her.'},
        {id: 'pact', label: 'Grey pact', level: 2, schema: 'foreign', desc: 'A power from outside this world\'s rules.'},
        {id: 'ashsight', label: 'Ash-sight', level: 3, hidden: true, desc: 'Sees through smoke and soot as if it were clear air.'},
    ],
    conditions: [
        {id: 'limp', label: 'Favouring her left leg', desc: 'An old injury; she will not chase far.'},
        {id: 'cough', label: 'Soot cough', hidden: true, desc: 'Lungs scarred by lamp smoke; long exertion costs her.'},
    ],
    gear: [
        {id: 'lamp', label: 'Iron warden lamp', value: 'at her belt', desc: 'Old iron, well kept.', detail: 'Fine quality; the glass is etched with a ward that strengthens her Lampcraft.'},
        {id: 'knife', label: 'Short knife', value: 'in her boot', concealed: true, desc: 'A plain blade.', detail: 'Plain steel, recently sharpened.'},
    ],
    traits: [
        {id: 'wary', label: 'Wary', visible: true, desc: 'Notices approach; hard to surprise.'},
        {id: 'patient', label: 'Patient', desc: 'Waits out a problem rather than forcing it.'},
        {id: 'debt', label: 'Bound by an old debt', hidden: true, desc: 'Owes something she cannot easily refuse.'},
    ],
    standing: [
        {id: 'wardens', label: 'Lamp-wardens', value: 'sworn warden (badge on her coat)', public: true},
        {id: 'guild', label: 'Chandlers\' guild', value: 'owes them money'},
    ],
    ties: [
        {id: 'apprentice', label: 'Pell', value: 'her apprentice', public: true},
        {id: 'sister', label: 'A sister upriver', value: 'writes monthly, never visits'},
    ],
    history: [{id: 'fire', label: 'The mill fire', value: 'She was the warden on duty the night the old mill burned.'}],
    intent: [{id: 'leave', label: 'Wants', value: 'To leave the wardens before the winter muster.'}],
    between: [{id: 'met', label: 'First meeting', value: 'She let you pass the night gate after you showed your kit.'}],
};
// Named reads, ordered roughly by depth. Each is a means the observer holds, not a UI setting.
export const SHEET_READS = [
    {id: 'glance', read: null, label: 'A plain look'},
    {id: 'introduced', read: {means: 'told', label: 'She told you her name', level: 1, precision: 0}, label: 'Introduced'},
    {id: 'sense', read: {means: 'sense', label: 'Fighter\'s sense', level: 2, precision: 0}, label: 'Fighter\'s sense'},
    {id: 'appraise-low', read: {means: 'appraise', label: 'Appraise (rank 1)', level: 4, precision: 1, rank: 2}, label: 'Appraise, rank 1 (ceiling: she ranks above you)'},
    {id: 'appraise', read: {means: 'appraise', label: 'Appraise (rank 3)', level: 5, precision: 3, rank: 3}, label: 'Appraise, rank 3'},
    {id: 'physician', read: {means: 'physician', label: 'Physician\'s eye', level: 6, precision: 2, scope: ['conditions']}, label: 'Physician\'s eye (conditions only)'},
    {id: 'soul', read: {means: 'soul', label: 'Soul sight', level: 6, precision: 2, rank: 4, schemas: ['native', 'foreign']}, label: 'Soul sight (hidden layers)'},
    {id: 'divination', read: {means: 'divination', label: 'Divination', level: 8, precision: 0, guess: true, scope: ['history', 'intent', 'ties']}, label: 'Divination (history and intent, as likelihood)'},
];
// The player's own sheet with the awakened status window adding an exact system read.
export const SHEET_SELF_READS = [
    {id: 'self', read: null, label: 'Your own sense'},
    {id: 'system', read: {means: 'system', label: 'Status window', level: 5, precision: 3}, label: 'Status window'},
];
