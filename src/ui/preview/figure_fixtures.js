// Fixtures for the figure gallery and tests. Invented names only; both go through one renderer (MDL2).
// RPX1 ritual circle: hour and moon timing rings, component slots, a chant track and a risk line in words.
export const RITUAL_FIXTURE = {
    id: 'ritual-low-lamp', size: 720, title: 'Rite of the Low Lamp',
    summary: 'A midnight rite. Four components, a five-line chant, and the moon is against you.',
    rings: [
        {id: 'hour', label: 'Hour', radius: 1, labels: 'out', segments: [
            {label: 'midnight', state: 'active', effect: 'glow'}, {label: 'small hours'}, {label: 'dawn'}, {label: 'day'}, {label: 'dusk'}, {label: 'evening'}]},
        {id: 'moon', label: 'Moon', radius: .8, labels: 'in', rotate: 45, state: 'strained', segments: [
            {label: 'new'}, {label: 'waxing'}, {label: 'full'}, {label: 'waning', state: 'strained'}]},
        {id: 'parts', label: 'Components', radius: .5, slots: 4},
    ],
    slots: [
        {id: 'thread', ring: 'parts', index: 0, label: 'Silver thread', state: 'filled', effect: 'glow'},
        {id: 'salt', ring: 'parts', index: 1, label: 'Grey salt', state: 'broken', effect: 'pulse'},
        {id: 'wick', ring: 'parts', index: 2, label: 'Candle stub', state: 'filled'},
        {id: 'hair', ring: 'parts', index: 3, label: 'Own hair', state: 'empty'},
    ],
    tracks: [{id: 'chant', label: 'Chant', steps: [
        {label: 'Light the lamp', state: 'done'}, {label: 'Say the name', state: 'done'}, {label: 'Call thrice', state: 'current', effect: 'pulse'},
        {label: 'Hold breath', state: 'pending'}, {label: 'Close the lamp', state: 'pending'}]}],
    notes: [{state: 'strained', text: 'Risk is high: the moon is waning and the grey salt broke, so the call may be answered by something else. Place your own hair or wait for the new moon.'}],
    legend: [
        {state: 'filled', label: 'component placed'}, {state: 'empty', label: 'still needed'}, {state: 'broken', label: 'broke, replace it'},
        {state: 'active', label: 'timing window open'}, {state: 'strained', label: 'works against you'}, {state: 'current', label: 'chant line now'}],
};
// RPX11 relationship web: you at the centre, edges for trust, debt and what each knows about you.
export const WEB_FIXTURE = {
    id: 'web-lanternside', size: 720, title: 'Who knows what in Lanternside',
    summary: 'Only what you have learned. Lines you cannot confirm are marked unknown.',
    rings: [{id: 'around', label: 'Around you', radius: 1, count: 5, visible: false}],
    nodes: [
        {id: 'you', label: 'You', glyph: 'Y', at: 'center', state: 'active', effect: 'glow'},
        {id: 'mara', label: 'Mara Venn', glyph: 'M', ring: 'around', index: 0},
        {id: 'tobb', label: 'Old Tobb', glyph: 'T', ring: 'around', index: 1, state: 'strained'},
        {id: 'isel', label: 'Isel Quay', glyph: 'I', ring: 'around', index: 2},
        {id: 'corin', label: 'Corin Dray', glyph: 'C', ring: 'around', index: 3, state: 'unknown'},
        {id: 'pell', label: 'Pell', glyph: 'P', ring: 'around', index: 4},
    ],
    edges: [
        {from: 'you', to: 'mara', kind: 'trust', label: 'firm'},
        {from: 'you', to: 'mara', kind: 'knows', label: 'your alias'},
        {from: 'you', to: 'tobb', kind: 'debt', label: 'you owe 3'},
        {from: 'you', to: 'tobb', kind: 'knows', label: 'your debt'},
        {from: 'you', to: 'isel', kind: 'trust', label: 'wary'},
        {from: 'you', to: 'corin', kind: 'knows', label: 'unconfirmed', state: 'unknown'},
        {from: 'you', to: 'pell', kind: 'debt', label: 'owes you 1'},
        {from: 'you', to: 'pell', kind: 'trust', label: 'warm'},
    ],
    notes: [{state: 'strained', text: 'Old Tobb is the pressure point: he holds your debt and knows it.'}],
    legend: [
        {kind: 'trust', label: 'trust toward you'}, {kind: 'debt', label: 'who owes whom'}, {kind: 'knows', label: 'what they know about you'},
        {state: 'unknown', label: 'not confirmed'}, {state: 'strained', label: 'needs care'}],
};
export const FIGURE_FIXTURES = [RITUAL_FIXTURE, WEB_FIXTURE];
