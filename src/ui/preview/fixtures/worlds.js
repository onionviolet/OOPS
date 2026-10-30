// Crossing threshold fixtures (RPX20). Invented places and people only (CLR3); the shape is what
// lotmThresholdView and any later world's adapter hand to renderCrossingThreshold.
const answers = (overrides = {}) => Object.entries({
    'Body': 'A dock clerk who died in the night. You wake in their body, healthy enough to work.',
    'Memories': 'Yours carry whole. The clerk\'s come in fragments: faces, the ledger room, the way home.',
    'Base cheat': 'Comes with you, unchanged.',
    'Money and items': 'Nothing physical crosses. The money you held stays behind with your Village life; the clerk\'s own purse, 3 crowns, is yours.',
    'Name and papers': 'The clerk\'s name, papers and post are yours.',
    'Language': 'The clerk\'s harbour tongue comes with the body.',
    'Who notices': 'No one, at first. Colleagues see a clerk who seems a little changed.',
    'Your old life': 'Your Village life pauses where you left it, money and all. Resume it from Continuing connection.',
    'What you owe': 'Report to Harbourmaster Quell and serve a probation.',
    ...overrides,
}).filter(([, a]) => a !== null);

// A body crossing that can be resumed: the default shape of a book-world start.
export const CROSSING_RETURNABLE = {
    id: 'lanternside-clerk', from: 'Village', to: 'Lanternside', title: 'as a dock clerk', era: 'Year 412, the wet season',
    method: 'crossing', returnable: true, answers: answers(),
    options: [{id: 'confirm', label: 'Confirm and cross to Lanternside', cost: 'Your Village life pauses'}, {id: 'back', label: 'Back to the lives', affects: 'Nothing changes'}],
};
// In person, one way, blocked: own body and speech cross, the old life ends, and the reason prints beside the button.
export const CROSSING_ONE_WAY_BLOCKED = {
    id: 'lanternside-envoy', from: 'Village', to: 'Lanternside', title: 'under a new name', era: 'Year 412, the wet season',
    method: 'in_person', returnable: false,
    answers: answers({'Body': 'Your own adult body. You arrive in person.', 'Language': 'You speak the harbour tongue well enough to pass.',
        'Your old life': 'Your Village life stops where you left it. Export first if you want to keep playing it.', 'Omens': 'The harbour bells ring once when you land.'}),
    options: [{id: 'confirm', label: 'Confirm and cross to Lanternside', cost: 'Cannot be undone on this save', blocked: 'Return to the Village first.'}, {id: 'back', label: 'Back to the lives'}],
};
export const WORLDS_FIXTURES = [CROSSING_RETURNABLE, CROSSING_ONE_WAY_BLOCKED];
