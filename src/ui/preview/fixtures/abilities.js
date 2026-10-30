// RPX5 ladder fixtures for the figure gallery and tests. Invented names only. Each goes through the
// real seam: definePath -> pathView -> ladderFigureSpec -> renderFigure, so the gallery shows what a
// life would show for the same facts. Importing this module registers the fixtures in the gallery list.
import {definePath, pathView} from '../../../ascension_paths.js';
import {ladderFigureSpec} from '../../../ability_ladder_figure.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

// A potion-style pathway: drink, act the role until the potion settles, be assessed, drink again.
export const LANTERN_PATH = definePath({id: 'fixture.lantern', world: 'fixture.harbour', label: 'Lantern-Reader pathway', shape: 'ladder', stages: [
    {id: 'ordinary', label: 'Ordinary clerk', crossings: [], grants: ['No source']},
    {id: 'r1', label: 'First rung · Lantern-Reader', crossings: [{id: 'dose', type: 'ingest', label: 'Drink the issued lantern draught', fact: 'heldDose', need: true, irreversible: true}],
        grants: ['Reads lamp-smoke for the next hour', 'Steadier hands by night']},
    {id: 'r2', label: 'Second rung · Wick-Turner', crossings: [
        {id: 'acting', type: 'digest', label: 'Acts in the Lantern-Reader role', fact: 'acting', need: 6},
        {id: 'assessment', type: 'recognition', label: 'The harbour warden assesses you', fact: 'assessed', need: true},
        {id: 'dose2', type: 'ingest', label: 'Hold the wick draught, then drink it', fact: 'heldNext', need: true, irreversible: true}],
        grants: ['Turns a flame to show what it lit'], failure: {signs: 'Smoke in the voice and a second shadow at dusk', outcome: 'Drinking before the first draught settles can cost control'}},
    {id: 'r3', label: 'Third rung', crossings: [{id: 'unknown', type: 'ingest', label: 'Not offered here', fact: 'never', need: true}], grants: []},
    {id: 'r4', label: 'Fourth rung', crossings: [{id: 'unknown', type: 'ingest', label: 'Not offered here', fact: 'never', need: true}], grants: []},
]});
const lanternView = pathView(LANTERN_PATH, 1, {acting: 4, assessed: false, heldNext: false}, {known: 3, ceiling: 2});

// A cultivation-style realm ladder: breath practice fills each realm until the next opens.
export const REED_PATH = definePath({id: 'fixture.reed', world: 'fixture.marsh', label: 'Reed-breath realms', shape: 'ladder', stages: [
    {id: 'dust', label: 'Dust Gathering', crossings: [], grants: ['Breath held for a slow count of ten']},
    {id: 'reed', label: 'Reed Breath', crossings: [{id: 'practice', type: 'quota', label: 'Marsh breathing (hours)', fact: 'hours', need: 20}], grants: ['Breathes under still water']},
    {id: 'lake', label: 'Still Lake', crossings: [{id: 'practice', type: 'quota', label: 'Marsh breathing (hours)', fact: 'hours', need: 60}, {id: 'insight', type: 'insight', label: 'See the lake without wind', fact: 'calm', need: true}], grants: ['Quiets a room by breathing']},
    {id: 'bell', label: 'Hollow Bell', crossings: [{id: 'practice', type: 'quota', label: 'Marsh breathing (hours)', fact: 'hours', need: 160}], grants: []},
    {id: 'beyond', label: 'Beyond the Bell', crossings: [{id: 'trial', type: 'trial', label: 'Unknown', fact: 'never', need: true}], grants: []},
]});
const reedView = pathView(REED_PATH, 1, {hours: 37, calm: false}, {known: 3});

export const ABILITY_FIXTURES = [
    ladderFigureSpec(lanternView, {id: 'ladder-lantern-self', felt: 'settling', rumours: {3: 'Third rung · Glass-Warden'}}),
    ladderFigureSpec(reedView, {id: 'ladder-reed-self', rumours: {3: 'Hollow Bell'}}),
    ladderFigureSpec(lanternView, {id: 'ladder-lantern-witness', perspective: 'witness', seen: 1, subject: 'the night clerk'}),
];
for (const spec of ABILITY_FIXTURES) if (!FIGURE_FIXTURES.some(f => f.id === spec.id)) FIGURE_FIXTURES.push(spec);
