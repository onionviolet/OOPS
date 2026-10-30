// Progression forms per world (PROGRESSION_BY_WORLD.md). Raw figure specs with paraphrased, invented data:
// no book names, quotes or sealed truths. Each is a proposal for one world's default form, drawn from the
// same figure primitive, so the gallery and tests show what a life would read. Importing registers them.
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

// Status window (a world that gives its holder a window): rank chain, attribute words, a shelf of keepsakes.
const STATUS_WINDOW = {id: 'progression-status-window', size: 720, title: 'Status window (the holder reads it)',
    summary: 'Rank, attributes in words with a fill, and a shelf of keepsakes. Locked rows are what you have not learned to read.',
    tracks: [
        {id: 'rank', label: 'Rank', orient: 'vertical', progress: 'second of four', steps: [
            {label: 'Unlit', state: 'done'}, {label: 'Kindled', state: 'current', fill: .6, note: 'about 6 of 10 sparks set'},
            {label: 'Burning', state: 'guessed', note: 'rumoured, needs a trial'}, {label: 'Higher ranks', state: 'unknown'}]},
        {id: 'attributes', label: 'Attributes', progress: 'three read, one locked', steps: [
            {label: 'Grip', state: 'filled', fill: .7, note: 'strong'}, {label: 'Wit', state: 'filled', fill: .4, note: 'average'},
            {label: 'Nerve', state: 'filled', fill: .55, note: 'steady'}, {label: 'Luck', state: 'unknown', note: 'locked'}]},
        {id: 'shelf', label: 'Keepsakes', progress: 'two of four slots', steps: [
            {label: 'Lamp-bell', state: 'filled', note: 'keepsake, rings at dusk'}, {label: 'Dust cat', state: 'filled', note: 'trace, follows you'},
            {label: 'Empty', state: 'empty'}, {label: 'Empty', state: 'empty'}]},
    ],
    notes: [{state: 'strained', text: 'Your knack can branch at the next rank. One branch is known by name, two are not.'}],
    legend: [{state: 'filled', label: 'read and set'}, {state: 'guessed', label: 'rumoured'}, {state: 'unknown', label: 'locked or not learned'}, {state: 'current', label: 'you are here'}]};

// Report card (a school world): subject grades by term, and a spell field of mastery states.
const REPORT_CARD = {id: 'progression-report-card', size: 720, title: 'Report card and spell field',
    summary: 'Grades per subject by term; each spell is heard, tried or fluent. A gate is a grade you must hold to choose a subject next year.',
    tracks: [
        {id: 'charms', label: 'Charms', progress: 'B this term', steps: [
            {label: 'Term 1', state: 'done', note: 'C'}, {label: 'Term 2', state: 'done', note: 'B'}, {label: 'Term 3', state: 'current', note: 'B so far'}, {label: 'Gate', state: 'pending', note: 'needs B'}]},
        {id: 'brewing', label: 'Brewing', progress: 'below the gate', steps: [
            {label: 'Term 1', state: 'done', note: 'D'}, {label: 'Term 2', state: 'done', note: 'D'}, {label: 'Term 3', state: 'current', note: 'C so far'}, {label: 'Gate', state: 'broken', note: 'needs B, short'}]},
        {id: 'spells', label: 'Spells', progress: 'one fluent, one tried, two heard', steps: [
            {label: 'Light-wick', state: 'done', note: 'fluent'}, {label: 'Gust', state: 'current', fill: .5, note: 'tried'},
            {label: 'Hold-door', state: 'guessed', note: 'heard of it'}, {label: 'Name-ash', state: 'guessed', note: 'heard of it'}]},
    ],
    notes: [{state: 'strained', text: 'You miss the Brewing gate by one grade. Charms stays open.'}],
    legend: [{state: 'done', label: 'graded or fluent'}, {state: 'current', label: 'this term'}, {state: 'broken', label: 'gate not met'}, {state: 'guessed', label: 'heard of, not tried'}]};

// Loop notebook: what you know, what carried over, and a reserve in the character's own words.
const LOOP_NOTEBOOK = {id: 'progression-loop-notebook', size: 720, title: 'Loop notebook',
    summary: 'No rank. What you know and practised, what carried over from the last loop, and a reserve you feel rather than read.',
    tracks: [
        {id: 'known', label: 'Known', progress: 'four entries, two practised', steps: [
            {label: 'Shaping drill', state: 'done', note: 'practised, carried over'}, {label: 'Rod timing', state: 'done', note: 'practised, carried over'},
            {label: 'Door pattern', state: 'guessed', note: 'seen once, unconfirmed'}, {label: 'Teacher habit', state: 'filled', note: 'known, not yet used'}]},
        {id: 'reserve', label: 'Reserve', progress: 'felt, not measured', steps: [
            {label: 'Reserve', state: 'current', fill: .65, note: 'feels about two thirds full, grew a little'}]},
    ],
    notes: [{state: 'active', text: 'The body starts over each loop; the first two entries stay. Fatigue tells you the reserve more than any number.'}],
    legend: [{state: 'done', label: 'practised'}, {state: 'filled', label: 'known'}, {state: 'guessed', label: 'unconfirmed'}]};

// Realm meter: stages inside a realm, a bottleneck, and a vessel that holds essence and creatures.
const REALM_METER = {id: 'progression-realm-meter', size: 720, title: 'Realm meter and vessel',
    summary: 'A fill inside the stage, a bottleneck before the next, and a vessel of fixed places. The dashed arc is what the planned hour adds.',
    rings: [{id: 'vessel', label: 'Vessel', radius: .42, slots: 4}],
    slots: [
        {id: 'core', ring: 'vessel', index: 0, label: 'Essence pool', state: 'filled', effect: 'glow'}, {id: 'moth', ring: 'vessel', index: 1, label: 'Moth worm', state: 'filled'},
        {id: 'sting', ring: 'vessel', index: 2, label: 'Sting worm', state: 'broken'}, {id: 'free', ring: 'vessel', index: 3, label: 'Free place', state: 'empty'}],
    tracks: [{id: 'realm', label: 'Realm', orient: 'vertical', progress: 'rank two, upper stage', steps: [
        {label: 'Rank two, early', state: 'done'}, {label: 'Rank two, middle', state: 'done'},
        {label: 'Rank two, upper', state: 'current', fill: .8, ghost: .9, note: 'about four fifths, the hour adds a little'},
        {label: 'Bottleneck', state: 'pending', note: 'a breakthrough, can fail'}, {label: 'Rank three', state: 'guessed', note: 'rumoured'}]}],
    notes: [{state: 'strained', text: 'Sting worm died. Its place is not free until you clear it.'}],
    legend: [{state: 'filled', label: 'held'}, {state: 'broken', label: 'lost'}, {state: 'empty', label: 'free'}, {state: 'current', label: 'you are here'}]};

// Service record: public rank, a cohort standing with the cut line, and what is on your record.
const SERVICE_RECORD = {id: 'progression-service-record', size: 720, title: 'Service record and tablet standing',
    summary: 'Rank is public insignia. The cohort board is seen by your officer, and the cut line is where places end.',
    tracks: [
        {id: 'rank', label: 'Rank', orient: 'vertical', progress: 'trainee, two of four', steps: [
            {label: 'Recruit', state: 'done'}, {label: 'Trainee', state: 'current'}, {label: 'Legionnaire', state: 'pending'}, {label: 'Section lead', state: 'unknown'}]},
        {id: 'board', label: 'Tablet standing', progress: 'ninth of twelve, cut after ten', steps: [
            {label: 'Dara', state: 'done', note: '1st'}, {label: 'Brenn', state: 'done', note: '2nd'}, {label: 'You', state: 'current', note: '9th'},
            {label: 'Oss', state: 'strained', note: '10th, last safe place'}, {label: 'Cut line', state: 'broken', note: 'below here, sent to the line'}]},
        {id: 'record', label: 'On record', progress: 'one commendation', steps: [
            {label: 'Wall shift', state: 'done', note: 'commendation'}, {label: 'Essence intake', state: 'filled', note: 'two portions this term'}]},
    ],
    notes: [{state: 'strained', text: 'The next cut is in nine days. Oss is one place behind you.'}],
    legend: [{state: 'current', label: 'you'}, {state: 'strained', label: 'one place from the cut'}, {state: 'broken', label: 'below the cut'}]};


// Frame sheet (a world of installed power): parts as rows, damage in words, where the cost goes.
const FRAME_SHEET = {id: 'progression-frame-sheet', size: 720, title: 'Frame sheet (installed parts and strain)',
    summary: 'No rank. Each installed part, the strain it adds in words, and where the cost goes. How much you understand the install is the dial.',
    tracks: [
        {id: 'parts', label: 'Installed parts', progress: 'two working, one strained', steps: [
            {label: 'Ember part', state: 'filled', note: 'works, steady'}, {label: 'Tide part', state: 'strained', note: 'strains after long use'},
            {label: 'Dusk part', state: 'guessed', note: 'origin unknown to you'}]},
        {id: 'strain', label: 'Strain', progress: 'felt, not scored', steps: [
            {label: 'Damage added', state: 'current', fill: .45, note: 'a dull ache by evening'}, {label: 'Vent', state: 'pending', note: 'needs an empty room and an hour'}]},
    ],
    notes: [{state: 'strained', text: 'Owner: the supplier still holds the licence. Venting moves the cost into the room, it does not remove it.'}],
    legend: [{state: 'filled', label: 'works'}, {state: 'strained', label: 'costs you'}, {state: 'guessed', label: 'origin not learned'}]};

// Colour wheel: one bonded power drawn from one colour, a bond count, and the mix warning at two.
const COLOUR_WHEEL = {id: 'progression-colour-wheel', size: 720, title: 'Colour wheel and bond count',
    summary: 'Eight colours round the wheel; yours is marked and its blend is small. A second bond ordinarily goes badly, so the count is shown beside the wheel.',
    rings: [{id: 'colours', label: 'Colours', radius: .8, labels: 'out', segments: [
        {label: 'green'}, {label: 'blue', state: 'active', effect: 'glow'}, {label: 'violet', state: 'guessed'}, {label: 'red'},
        {label: 'orange'}, {label: 'yellow'}, {label: 'white'}, {label: 'black', state: 'unknown'}]}],
    tracks: [{id: 'bond', label: 'Bonds', progress: 'one of one', steps: [
        {label: 'First bond', state: 'done', note: 'blue, matched to you'}, {label: 'Second bond', state: 'broken', note: 'ordinarily goes badly; rare exceptions'}]}],
    notes: [{state: 'strained', text: 'A bought copy would give less power and a cost, and would not link you to a colour at all.'}],
    legend: [{state: 'active', label: 'your colour'}, {state: 'guessed', label: 'small share, unconfirmed'}, {state: 'broken', label: 'mix warning'}]};


// Growth digest: what improved this week across every axis the character has, in the world's own words.
const GROWTH_DIGEST = {id: 'progression-growth-digest', size: 720, title: 'What improved this week',
    summary: 'One line per axis that moved, in its own words. Axes that did not move are not listed. A span dial sets week or month.',
    tracks: [{id: 'digest', label: 'This week', progress: 'five things moved', steps: [
        {label: 'Rank', state: 'done', note: 'rung 8 settled'}, {label: 'School', state: 'done', note: 'Charms B, up from C'},
        {label: 'Knowledge', state: 'guessed', note: 'two entries learned, one unconfirmed'}, {label: 'Standing', state: 'filled', note: '9th on the board, was 11th'},
        {label: 'Gear', state: 'filled', note: 'lantern re-wicked, burns longer'}]}],
    notes: [{state: 'active', text: 'Learned by insight this week is marked as such and stays apart from what you earned.'}],
    legend: [{state: 'done', label: 'advanced'}, {state: 'filled', label: 'improved'}, {state: 'guessed', label: 'partly confirmed'}]};

// Several systems at once: one line each on the sheet, each in its own words.
const MULTI_GLANCE = {id: 'progression-multi-glance', size: 720, title: 'Glance line for a character holding three systems',
    summary: 'The sheet shows one short line per system, capped at three; the abilities view opens each in its own form.',
    tracks: [{id: 'systems', label: 'Systems held', progress: 'three', steps: [
        {label: 'Lantern pathway', state: 'current', fill: .4, note: 'rung 8, settling'},
        {label: 'Academy', state: 'filled', note: 'Charms B, 3 spells fluent'},
        {label: 'Loop gift', state: 'guessed', note: '2 powers known, limits unclear'}]}],
    notes: [{state: 'active', text: 'Sheet: Lantern rung 8, settling · Academy Charms B, 3 spells fluent · Loop gift, 2 powers known.'}],
    legend: [{state: 'current', label: 'path with a rung'}, {state: 'filled', label: 'graded'}, {state: 'guessed', label: 'partly known'}]};

export const PROGRESSION_FIXTURES = [STATUS_WINDOW, REPORT_CARD, LOOP_NOTEBOOK, FRAME_SHEET, COLOUR_WHEEL, REALM_METER, SERVICE_RECORD, MULTI_GLANCE, GROWTH_DIGEST];
for (const spec of PROGRESSION_FIXTURES) if (!FIGURE_FIXTURES.some(f => f.id === spec.id)) FIGURE_FIXTURES.push(spec);
