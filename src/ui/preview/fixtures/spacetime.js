// Spacetime fixtures (invented names only, CLR3): a lives tree through the real adapter, a loop with carry-over,
// a divergence ledger (opt-in, LTU10, design only) and an abstract space with no geography. Sealed places appear by ID.
import {FIGURE_FIXTURES} from '../figure_fixtures.js';
import {livesFigure} from '../../lives_figure.js';

const T = (year, month, day) => ({year, month, day});
export const LIVES_VIEW = {available: true, challenge: null, loop: {enabled: false, target: 'initial', cycles: 0}, memoryCount: 14, carried: ['Literacy', 'Smelting'],
    lives: [
        {id: 'life-1', label: 'First life', active: false, paused: T(3, 4, 9), reachable: true, tether: 'life-2', initial: T(1, 1, 1), checkpoint: T(2, 6, 2), checkpointReachable: true},
        {id: 'life-2', label: 'Ferryman of Lowmere', active: true, initial: T(1, 1, 1), checkpoint: T(1, 9, 20), checkpointReachable: true, tether: null},
        {id: 'life-3', label: 'Fresh start, Ashgate', active: false, paused: T(1, 2, 11), reachable: true, tether: 'life-2', initial: T(1, 1, 1), checkpoint: null},
        {id: 'life-4', label: 'Shelved after the fire', active: false, paused: T(1, 8, 30), reachable: false, tether: null, initial: T(1, 1, 1), checkpoint: null}]};
export const LIVES_FIXTURE = livesFigure(LIVES_VIEW);

export const LOOP_FIXTURE = {id: 'loop-clock-town', size: 640, title: 'Loop of the Clockwork Town (proposal)',
    summary: 'Cycle 6 of an unknown number. The town resets at dusk on day three; you keep what you learned.',
    rings: [{id: 'cycles', label: 'Cycles', radius: 1, labels: 'out', segments: [
        {label: 'cycle 1', state: 'done'}, {label: 'cycle 2', state: 'done'}, {label: 'cycle 3', state: 'done'},
        {label: 'cycle 4', state: 'done'}, {label: 'cycle 5', state: 'done'}, {label: 'cycle 6', state: 'current', effect: 'pulse'}]},
        {id: 'days', label: 'Days this cycle', radius: .62, labels: 'in', segments: [{label: 'day 1', state: 'done'}, {label: 'day 2', state: 'current'}, {label: 'day 3', state: 'pending'}]}],
    nodes: [{id: 'self', label: 'You', glyph: 'Y', at: 'center', state: 'active', effect: 'glow'}],
    tracks: [{id: 'kept', label: 'What you carry', steps: [
        {label: 'Bell schedule', state: 'done'}, {label: 'Baker\'s secret', state: 'done'}, {label: 'Cellar key location', state: 'done'}, {label: 'Who leaves first', state: 'unknown'}]}],
    notes: [{text: 'The world forgets: every door, price and promise returns to dusk of day 0. You keep the four things above and the skills you practised.'},
        {state: 'strained', text: 'Unknown: whether a seventh cycle changes the town, or only you.'}],
    legend: [{state: 'done', label: 'cycle finished'}, {state: 'current', label: 'this cycle'}, {state: 'unknown', label: 'asked, not yet answered'}]};

export const DIVERGENCE_FIXTURE = {id: 'divergence-opt-in', size: 640, title: 'Where your run differs from the book (opt-in view, proposal)',
    summary: 'Shown only when you turn the canon overlay on. Each step is a canon event and what your run did with it.',
    tracks: [
        {id: 'book', label: 'The book', steps: [{label: 'Reaches the harbour', state: 'done'}, {label: 'Meets the clerk', state: 'done'}, {label: 'Takes the night boat', state: 'done'}, {label: 'Arrives at the tower', state: 'done'}]},
        {id: 'run', label: 'Your run', steps: [{label: 'Reaches the harbour', state: 'done'}, {label: 'Meets the clerk', state: 'done'}, {label: 'Stays in port (differs)', state: 'broken'}, {label: 'Tower not reached yet', state: 'pending'}]}],
    notes: [{state: 'strained', text: 'One difference so far: you stayed in port. Later canon steps may now fail to match until you reach them another way.'},
        {text: 'Pull: this world resists change only through causal weight, so nothing here is forced.'}],
    legend: [{state: 'done', label: 'matches the book'}, {state: 'broken', label: 'differs from the book'}, {state: 'pending', label: 'not reached'}]};

export const PALACE_FIXTURE = {id: 'space-memory-palace', size: 640, title: 'A memory palace (abstract space, proposal)',
    summary: 'No map: rooms are things you know, and doors are how one thing leads to another. One room is sealed (S-11, found elsewhere).',
    nodes: [
        {id: 'hall', label: 'Hall of faces', glyph: 'H', at: 'center', state: 'active', effect: 'glow'},
        {id: 'debts', label: 'Room of debts', glyph: 'D', at: [-.8, -.5], state: 'filled'},
        {id: 'songs', label: 'Room of songs', glyph: 'S', at: [.8, -.5], state: 'filled'},
        {id: 'maps', label: 'Room of roads', glyph: 'R', at: [-.8, .6], state: 'pending'},
        {id: 'sealed', label: 'Sealed room (S-11)', glyph: '?', at: [.8, .6], state: 'unknown'}],
    edges: [
        {from: 'hall', to: 'debts', kind: 'reminds', label: 'a creditor\'s face'}, {from: 'hall', to: 'songs', kind: 'reminds', label: 'a lullaby'},
        {from: 'hall', to: 'maps', kind: 'reminds', label: 'a ferry route'}, {from: 'songs', to: 'sealed', kind: 'locked', label: 'needs a verse you lack', state: 'unknown'},
        {from: 'debts', to: 'maps', kind: 'leads to', label: 'who paid for the road'}],
    notes: [{text: 'Only rooms you have entered or been told about are drawn. A new room appears when a memory links to it.'}],
    legend: [{state: 'active', label: 'where you stand'}, {state: 'filled', label: 'visited'}, {state: 'pending', label: 'known, not entered'}, {state: 'unknown', label: 'sealed or unconfirmed'}, {kind: 'reminds', label: 'one thing recalls another'}, {kind: 'locked', label: 'needs something you lack'}]};

FIGURE_FIXTURES.push(LIVES_FIXTURE, LOOP_FIXTURE, DIVERGENCE_FIXTURE, PALACE_FIXTURE);
