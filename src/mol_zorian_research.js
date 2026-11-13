// Zorian's spell research: the first lead-world caller of invention_planner.js (KNW13). One authored project row, worked
// through ordinary pack commands that spend real time, stamina and reserve casts, each writing a knowledge entry into the
// existing store (AR3, no second store). Progress is read back from those entries, never saved elsewhere, so it rides the loop
// row's soul-bound memory carrier (every `book.mol.` knowledge entry crosses a restart, harm_restart_scope RESTART_SCOPES;
// WKR13) while the world, reserve and receipts reset. KNW19: entries do not fade. inquiry.js is not used: its slice is a
// top-level key the scoped restart rebuilds from the anchor, so effort stored there would desync from carried knowledge.
//
// Source grounding (label: authored). Printed: Haslush teaches the narrow question and "what is the object made to do" (c16),
// and Zorian uses it alone on the retrieved watch (c22 p104-107). Authored, not printed: the library shelf reading, the three
// sealed-box trials and the notebook entry, which turn that one use into a worked-out method. Numbers (40/15/30 minutes, one
// cast per trial) are scene dials, reversible proposals. Bank shapes taken, numbers not copied (SKR11): Magic Research 2
// (research unlocks knowledge, not power supply; the refined result changes cost, not the reserve), Upload Labs (a
// prerequisite queue over a data list), Academagia (study level against a dated beat: the watch).
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {expandTarget, checkFeasibility, roadmapView} from './invention_planner.js';

const prefix = 'book.mol.zorian.research.';
const study = 'book.mol.zorian.s2.';
export const MOL_RESEARCH = Object.freeze({
    id: 'ward_question', question: 'What is the narrowest question the object-analysis spell answers cleanly?',
    source: {printed: ['c16 Haslush: one narrow question', 'c22 p104-107 the watch'], authored: ['shelf reading', 'sealed-box trials', 'notebook entry']},
    keys: Object.freeze({shelf: prefix + 'ward.shelf', t1: prefix + 'ward.trial_1', t2: prefix + 'ward.trial_2', t3: prefix + 'ward.trial_3',
        refined: prefix + 'ward.refined'}),
    commands: Object.freeze({shelf: prefix + 'compare_library_notes', t1: prefix + 'trial_empty_box', t2: prefix + 'trial_warded_box',
        t3: prefix + 'trial_purpose_question', refine: prefix + 'write_up_the_method', watch: 'book.mol.zorian.arc1.identify_watch_refined'}),
});
const K = MOL_RESEARCH.keys;

// The authored graph (planner data): goals are what is learned, primitives are what the world supplies.
const GRAPH_PACK = Object.freeze({
    functions: [{id: 'ward.refined', label: 'A refined way to question the object-analysis spell'},
        {id: 'ward.shelf', label: 'The library’s notes set beside Haslush’s method'}, {id: 'ward.trials', label: 'Three trials on sealed boxes'}],
    primitives: [{id: 'p.method', label: 'Haslush’s object-analysis method'}, {id: 'p.library', label: 'The academy library'},
        {id: 'p.cast', label: 'A cast from the reserve'}],
    methods: [{id: 'm.shelf', label: 'Read the divination shelf', produces: 'ward.shelf', requires: ['p.library']},
        {id: 'm.trials', label: 'Question sealed boxes, one narrower than the last', produces: 'ward.trials', requires: ['p.method', 'p.cast']},
        {id: 'm.write', label: 'Write the method up', produces: 'ward.refined', requires: ['ward.shelf', 'ward.trials']}],
});

const known = state => state.simulation?.knowledge.player ?? {};
const zorian = state => isZorianStart(state) && state.actors?.player?.worldId === MOL_IDS.world;
const trials = k => [K.t1, K.t2, K.t3].filter(key => !!k[key]).length;

export function molResearchFacts(state) {
    if (!zorian(state)) return {};
    const k = known(state), open = !!k[study + 'object_analysis_method'], refined = !!k[K.refined], n = trials(k), shelf = !!k[K.shelf];
    return {
        'mol.research.open': open,
        'mol.research.refined': refined,
        'mol.research.showShelf': open && !refined && !shelf,
        'mol.research.showTrial1': open && !refined && shelf && n === 0,
        'mol.research.showTrial2': open && !refined && !!k[K.t1] && !k[K.t2],
        'mol.research.showTrial3': open && !refined && !!k[K.t2] && !k[K.t3],
        'mol.research.showWriteUp': open && !refined && shelf && n === 3,
    };
}

/** The planner's read of this project: feasibility from the world, roadmap from what the seat's own entries show. */
export function molResearchView(state) {
    if (!zorian(state)) return null;
    const k = known(state), n = trials(k), open = !!k[study + 'object_analysis_method'];
    const world = {available: {'p.method': open, 'p.library': true, 'p.cast': true},
        rules: {}};
    const graph = expandTarget(GRAPH_PACK, world, 'ward.refined');
    const feasibility = checkFeasibility(graph, world);
    const fidelity = {'ward.refined': k[K.refined] ? 5 : open ? 2 : 0, 'm.write': k[K.refined] ? 5 : open ? 2 : 0,
        'ward.shelf': k[K.shelf] ? 4 : open ? 2 : 0, 'm.shelf': k[K.shelf] ? 4 : open ? 2 : 0, 'p.library': k[K.shelf] ? 4 : open ? 2 : 0,
        'ward.trials': n === 3 ? 4 : open ? 2 : 0, 'm.trials': n === 3 ? 4 : open ? 2 : 0, 'p.method': open ? 4 : 0, 'p.cast': open ? 4 : 0};
    const road = roadmapView(graph, fidelity);
    return {open, trials: n, shelf: !!k[K.shelf], refined: !!k[K.refined], solvable: feasibility.solvable, road};
}

/** One line for the campaign card: where the work stands and what stays with Zorian across a restart. */
export function molResearchLine(state) {
    const v = molResearchView(state);
    if (!v || !v.open) return '';
    if (v.refined) return 'Your notebook holds a method for questioning the object-analysis spell. It carries across every restart.';
    const left = [v.shelf ? '' : 'the library notes', v.trials < 3 ? `${3 - v.trials} of 3 sealed-box trials` : ''].filter(Boolean);
    const kept = v.shelf || v.trials ? ' What you have worked out stays with you across a restart.' : '';
    return `Your questions about Haslush’s spell are still open: ${left.join(' and ') || 'the write-up'} remain.${kept}`;
}

/** Where to walk for the next piece of the work (lowest-priority route card). */
export function molResearchRoute(state) {
    const f = molResearchFacts(state), here = state.simulation?.people.player.location;
    if (f['mol.research.showShelf'] && here !== MOL_LOCATIONS.library)
        return {id: 'book.mol.move.library', label: 'Go to the library and set Haslush’s method beside its shelf'};
    if ((f['mol.research.showTrial1'] || f['mol.research.showTrial2'] || f['mol.research.showTrial3'] || f['mol.research.showWriteUp'])
        && here !== MOL_LOCATIONS.house)
        return {id: 'book.mol.move.house', label: 'Go home to test the spell on sealed boxes'};
    return null;
}
// The command rows themselves (six: shelf, three trials, write-up, refined watch route) live in the world pack, its authority (WA21).
