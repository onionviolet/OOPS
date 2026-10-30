// Making-forms fixtures (MAKING_FORMS.md, proposals AD32). Invented names and numbers only (CLR3).
// Built from shapes figure.js already validates: tracks for strips and timelines, rings and slots for boards,
// notes for numbers. The rune strip is computed by the real rune grammar, so the mock is the composition form.
import {defineRuneGrammar, readTalisman, createRuneRecord, recordPair, coverage} from '../../../rune_grammar.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

export const MOCK_GRAMMAR = defineRuneGrammar({id: 'mock.runes', revision: 1, runes: ['ash', 'tide', 'spur', 'veil', 'knot'], maxLength: 5,
    pairs: [{a: 'ash', b: 'tide', ordered: true, effect: 'warmth', power: 2}, {a: 'tide', b: 'ash', ordered: true, effect: 'steam', power: 1},
        {a: 'spur', b: 'veil', effect: 'ward', power: 2}, {a: 'veil', b: 'knot', effect: 'ward', power: 1}],
    discord: {effect: 'static', power: 1, reason: 'Unrelated marks jar against each other.'}});
export const MOCK_STRIP = ['ash', 'tide', 'spur', 'veil', 'spur'];
export const MOCK_TRIALS = [['ash', 'tide', 'warmth'], ['tide', 'ash', 'steam'], ['spur', 'veil', 'ward'], ['knot', 'knot', 'static']];

const wording = {warmth: 'warmth', steam: 'steam', ward: 'a ward', static: 'static (a muddle)'};
// One step per rune, one note per pair. Pairs read left to right; a discord is a cost, not a block.
export function runeStripSpec(grammar = MOCK_GRAMMAR, strip = MOCK_STRIP) {
    const read = readTalisman(grammar, strip);
    const record = MOCK_TRIALS.reduce((r, [a, b, effect], i) => recordPair(r, a, b, effect, i), createRuneRecord());
    const seen = coverage(grammar, record);
    return {read, seen, spec: {
        id: 'making-rune-strip', title: 'Runes: a talisman strip read pair by pair', size: 760,
        summary: 'Five marks on a strip. Each neighbouring pair is read left to right; the first pair is ordered, the second jars, and the last two read the same either way.',
        tracks: [{id: 'strip', label: 'Strip, left to right', progress: `${read.steps.length} pairs read, ${read.discords} jar`,
            steps: strip.map((rune, i) => {
                const pair = read.steps[i];
                return {label: rune, state: pair?.discord ? 'strained' : 'done', note: pair ? `${rune} then ${strip[i + 1]}: ${wording[pair.effect]}` : 'last mark'};
            })}],
        notes: [
            ...read.steps.map(s => ({state: s.discord ? 'strained' : 'done', text: `${s.pair[0]} > ${s.pair[1]}: ${wording[s.effect]} ${s.power}${s.discord ? ' (jar: costs, does not block)' : ''}`})),
            {text: `Ghost total if inscribed now: ${Object.entries(read.effects).map(([k, v]) => `${wording[k]} ${v}`).join(', ')}. Ink cost ${read.cost}. Nothing spent by looking.`},
            {state: 'guessed', text: `Pairs you have tried: ${seen.tried} of ${seen.total}. Untried pairs stay blank; swapping two marks can change the strip.`},
        ],
        legend: [{state: 'done', label: 'pair read cleanly'}, {state: 'strained', label: 'pair jars (static)'}, {state: 'guessed', label: 'what you have only tried'}],
    }};
}

const TONIC_LEGEND = [{state: 'done', label: 'step done'}, {state: 'current', label: 'step now'}, {state: 'pending', label: 'not yet'}, {state: 'guessed', label: 'from your own trials'}];
// Same invented craft in two modes. The hands-on mode shows every step; the folded mode shows what the steps resolve to.
export const TONIC_HANDS_ON = {
    id: 'making-tonic-hands-on', title: 'Reed tonic, hands-on: first attempts and new recipes', size: 760,
    summary: 'Every step is yours: crush, warm, stir, steep. Each one has a window and a stated effect. Ghost band changes as you act.',
    tracks: [{id: 'steps', label: 'Reed tonic', progress: '2 of 4 done, stir now',
        steps: [{label: 'Crush reed', state: 'done', note: 'fine grind: +1 strength'}, {label: 'Warm water', state: 'done', note: 'near the simmer'},
            {label: 'Stir', state: 'current', note: 'window 4 beats, 2 in'}, {label: 'Steep', state: 'pending', note: 'about 6 minutes'}]}],
    notes: [
        {state: 'guessed', text: 'Ghost outcome if you stop stirring now: fine (better than serviceable, short of superior). Looking spends nothing.'},
        {text: 'Hover a reagent: Reed pith, seen in 2 of your 3 known tonics (steadies, soothes). Third tonic untried.'},
        {text: 'Danger before commit: over-warm water scorches the pith and turns the batch to bitter sludge (what you have seen: once).'},
        {text: 'Fold into numbers: unlocks after you have made this method 3 times well. Unfold again at any time.'},
    ], legend: TONIC_LEGEND,
};
export const TONIC_FOLDED = {
    id: 'making-tonic-folded', title: 'Reed tonic, folded: the same craft as numbers and a queue', size: 760,
    summary: 'The recorded method runs as one line. Quality is a band with odds, and a batch runs on a queue. Unfold returns to the steps.',
    tracks: [{id: 'bands', label: 'Quality bands at your skill', progress: 'most likely: fine',
        steps: [{label: 'Rough', state: 'pending', note: '8%'}, {label: 'Serviceable', state: 'pending', note: '27%'}, {label: 'Fine', state: 'current', note: '49%'}, {label: 'Superior', state: 'pending', note: '16%'}]}],
    notes: [
        {text: 'Recorded method: crush, warm, stir, steep. Cost per batch: 4 reed pith, 1 spring water. Time: 8 minutes each.'},
        {text: 'Queue: 12 batches, about 1 hour 36 minutes. Expected: 6 fine or better, 1 sludge. Spent whatever the result.'},
        {state: 'guessed', text: 'Odds come from your own recorded attempts, not the maker\'s secret table. The deep mode can push the superior chance higher; quick never beats what you know.'},
        {text: 'Unfold: back to the four steps with windows and the ghost outcome.'},
    ], legend: TONIC_LEGEND,
};

// A slot board (Gu-style refining and feeding): a core and its feeds sit on a ring; the risk is shown before the commit.
export const FEEDING_BOARD = {
    id: 'making-feeding-board', title: 'Refining and feeding: a slot board with risk before commit', size: 640,
    summary: 'A host creature takes a core and three feeds over days. Each slot is fed, short or hostile; the centre shows the risk if you commit now.',
    rings: [{id: 'board', label: 'Feeding board', radius: 1, slots: 4}],
    nodes: [{id: 'risk', label: '31% it turns on you', at: 'center', state: 'strained'}],
    slots: [{id: 'core', label: 'Core: dusk moth', ring: 'board', index: 0, state: 'filled'}, {id: 'feed1', label: 'Feed 1: nectar', ring: 'board', index: 1, state: 'filled'},
        {id: 'feed2', label: 'Feed 2: ember grain', ring: 'board', index: 2, state: 'strained'}, {id: 'feed3', label: 'Feed 3: empty', ring: 'board', index: 3, state: 'empty'}],
    notes: [{state: 'strained', text: 'Ember grain clashes with the core (seen once, in a past failure). Swap it, or accept the extra risk.'},
        {text: 'Time: 3 days of feeding. A missed day shows here as a gap, not a punishment.'}],
};

// Artifact making where each piece is unique: stays hands-on; the risk is a timeline of named hazards, previewed not rolled.
export const ARTIFACT_RISK = {
    id: 'making-artifact-risk', title: 'Unique artifact: stages with hazards shown before each commit', size: 760,
    summary: 'Not folded by default: each piece is one of a kind, so every stage is a decision. Hazards are named, with what you have seen of them.',
    tracks: [{id: 'stages', label: 'Lantern-bone artifact', progress: '1 of 4 done, seal next',
        steps: [{label: 'Shape the frame', state: 'done', note: 'sound'}, {label: 'Seal the vessel', state: 'current', note: 'hazard: backlash'}, {label: 'Bind the effect', state: 'pending', note: 'hazard: drift'}, {label: 'Wake it', state: 'pending', note: 'point of no return'}]}],
    notes: [{state: 'strained', text: 'Seal: if the vessel is thin, backlash can crack it. Seen in 1 past attempt; the odds are not known to you yet.'},
        {text: 'Stopping here keeps the frame and the vessel. Waking cannot be undone.'},
        {state: 'guessed', text: 'A masterwork sheet could name the hazards sooner; a good teacher or a past failure also reveals them.'}],
    legend: [{state: 'done', label: 'stage done'}, {state: 'current', label: 'stage now'}, {state: 'pending', label: 'ahead'}, {state: 'strained', label: 'named hazard'}],
};

export const MAKING_FORM_FIXTURES = [runeStripSpec().spec, TONIC_HANDS_ON, TONIC_FOLDED, FEEDING_BOARD, ARTIFACT_RISK];
FIGURE_FIXTURES.push(...MAKING_FORM_FIXTURES);
