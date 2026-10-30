// RPX11 and RPX17 gallery fixtures. Invented names only. The web goes through the same builder the game uses.
import {relationshipWebSpec} from '../../relationship_web.js';

// A populated life: debts both ways, shared history, one face read here now, one rumour noticed.
export const RELATIONSHIP_WEB_PEOPLE = [
    {id: 'brenna', name: 'Brenna Hale, ferrier', here: true, owes: [{by: 'them', label: 'a mended bridle'}],
        saw: ['You paid the agreed coin', 'You carried her anvil block'], manner: {line: 'Warmer toward you since you helped them.', warm: true, heard: false}},
    {id: 'osric', name: 'Osric the tallyman', here: false, owes: [{by: 'you', label: 'return 2 × Lantern oil'}, {by: 'you', label: 'amends for a broken seal', strained: true}],
        saw: ['You broke the warehouse seal']},
    {id: 'wren', name: 'Wren, dock runner', here: true, owes: [], saw: [], manner: {line: 'Wary of you after hearing that you harmed them.', warm: false, heard: true}},
    {id: 'matthis', name: 'Matthis Corr', here: false, owes: [{by: 'you', label: 'the ferry promise', settled: true}], saw: ['You kept the ferry promise'], trust: 2},
    {id: 'ilka', name: 'Ilka of the reeds', here: false, owes: [], saw: ['You asked about the reed paths']},
    {id: 'tamsk', name: 'Old Tamsk', here: false, owes: [], saw: []},
];
export const RELATIONSHIP_WEB_FIXTURE = relationshipWebSpec(RELATIONSHIP_WEB_PEOPLE, {id: 'relationship-web-ferry', title: 'Who knows what about you: Ferry Row'});

// RPX17 ripple (design sketch, not wired to play): one deed at the centre, rings are hops of telling.
export const RUMOUR_RIPPLE_FIXTURE = {
    id: 'rumour-ripple-seal', size: 720, title: 'How far the broken seal travelled',
    summary: 'Only the links you traced by asking around. Rings are hops of telling; certainty drops outward.',
    rings: [{id: 'saw', label: 'Saw it', radius: .38, count: 2, visible: true}, {id: 'heard', label: 'Heard from a witness', radius: .7, count: 3, visible: true},
        {id: 'far', label: 'Heard second-hand', radius: 1, count: 3, visible: true, rotate: 30}],
    nodes: [
        {id: 'deed', label: 'Broken seal', glyph: '!', at: 'center', state: 'strained'},
        {id: 'osric', label: 'Osric', glyph: 'O', ring: 'saw', index: 0, state: 'done'},
        {id: 'guard', label: 'Night guard', glyph: 'N', ring: 'saw', index: 1, state: 'done'},
        {id: 'wren', label: 'Wren', glyph: 'W', ring: 'heard', index: 0, state: 'done'},
        {id: 'cook', label: 'Inn cook', glyph: 'I', ring: 'heard', index: 1, state: 'unknown'},
        {id: 'clerk', label: 'Toll clerk', glyph: 'T', ring: 'heard', index: 2, state: 'done'},
        {id: 'priest', label: 'Shrine keeper', glyph: 'S', ring: 'far', index: 0, state: 'unknown'},
        {id: 'boat', label: 'Boatwife', glyph: 'B', ring: 'far', index: 1, state: 'done'},
    ],
    edges: [
        {from: 'deed', to: 'osric', kind: 'saw'}, {from: 'deed', to: 'guard', kind: 'saw'},
        {from: 'osric', to: 'wren', kind: 'told', label: 'at the dock'}, {from: 'guard', to: 'clerk', kind: 'told', label: 'at shift change'},
        {from: 'guard', to: 'cook', kind: 'told', label: 'guessed', state: 'unknown'},
        {from: 'clerk', to: 'boat', kind: 'told', label: 'at the toll'}, {from: 'cook', to: 'priest', kind: 'told', label: 'guessed', state: 'unknown'},
    ],
    notes: [{state: 'unknown', text: 'Two links are guesses: you saw the inn cook and the shrine keeper cool toward you but nobody named a teller.'}],
    legend: [{kind: 'saw', label: 'saw it happen'}, {kind: 'told', label: 'told someone'}, {state: 'done', label: 'traced'}, {state: 'unknown', label: 'guessed, not traced'}, {state: 'strained', label: 'the deed'}],
};
export const RELATIONSHIP_WEB_FIXTURES = [RELATIONSHIP_WEB_FIXTURE, RUMOUR_RIPPLE_FIXTURE];
