// Zorian's class tests in Cyoria: the second world on the shared cohort model (exam_cohort.js; Hogwarts is the first). Pure, no state.
// The month loop is the test of the seam: classmates reset, so their marks are the same in every run (one seed, one draw order);
// Zorian keeps what he learnt, so two loop inputs carry: revision sessions (memory of his notes) and papers sat in earlier runs (he
// remembers the questions). Both are soul-bound counters (harm_restart_scope.js, Zorian row). Two classmates do not reset like the rest:
// Zach remembers the loop too, so he aces every paper in every run; Neolu tops the class only in the first run Zorian lives (c7 p346).
// Results are the contract (SPR20, STY33), from the source:
//   c3 p27-50, run 1: the Warding paper goes "badly" for Zorian and Akoja; Zach aces it; Neolu is beating Akoja "in every single class".
//   c3 p272, run 1: Ilsa calls Zorian "one of the best students in your group" (good to high, not the top).
//   c6 p324, about run 8: he knows the month well enough for "near-perfect scores in all subjects, even warding", beating Akoja.
//   c10 p98, a later run: "top grades on every exam" despite skipping classes (attendance is not an input here).
// Every other number is an assumed unit (SPR21): class size, aptitudes, weights, the cohort spread and the test days (all fixture dates).
import {examModel, BANDS} from './exam_cohort.js';
export {BANDS};
export const CLASS_SIZE = 24;          // Zorian's group, himself included (assumed unit; the text names about a dozen classmates)
export const REVISION_CAP = 8;         // revision sessions per subject that still add, summed over every run (memory, not body)
export const SEEN_CAP = 4;             // earlier sittings of the same paper that still add; past four he knows it by heart
// Subjects: `day` is the run day the paper opens (fixture: the text gives week 1 for both of Nora's tests and "two weeks later" for Warding).
// Formulas is Nora's 60-question placement test already in the pack: its mark comes back the day after, so its paper is the return.
export const EXAM_SUBJECTS = Object.freeze([
    ['formulas', 'Spell Formulas', 'Nora', 74, 3, 'Cyoria formula workshop'],
    ['mathematics', 'Advanced Mathematics', 'Nora', 75, 4, 'Cyoria formula workshop'],
    ['warding', 'Warding', 'the warding teacher', 56, 18, 'Cyoria academy guest desk']]
    .map(([id, label, teacher, aptitude, day, location]) => Object.freeze({id, label, teacher, aptitude, day, location})));
export const SUBJECT_IDS = Object.freeze(EXAM_SUBJECTS.map(s => s.id));
export const examSubject = id => EXAM_SUBJECTS.find(s => s.id === id);
// Anchors (SPR20). `variants.first` is the run the loop began in; any other run uses the plain range.
export const ANCHORS = Object.freeze({
    zach: Object.freeze({label: 'Zach', lo: 94, hi: 100}),
    akoja: Object.freeze({label: 'Akoja', lo: 79, hi: 88, over: Object.freeze({warding: [66, 76]})}),
    neolu: Object.freeze({label: 'Neolu', lo: 44, hi: 58, variants: Object.freeze({first: Object.freeze({lo: 95, hi: 100})})})});
export const DIALS = Object.freeze({revision: 1.5, seen: 4, understanding: 6, w0: 8, minW: 1, passMark: 40,
    bands: Object.freeze({top: 2, high: 5, good: 12})}); // rank cut-offs in a class of 24; a tie shares the better rank
export const ANON = Object.freeze({mean: 55, sd: 12, draw: 5, min: 10, max: 98});
export const SEED = 'book.mol.zorian.exams.class.v1';
// The spec is the whole difference from Hogwarts: smaller class, a 100-mark ceiling, and the two loop terms (sessions and seen narrow the draw).
export const MODEL = examModel({id: 'book.mol.zorian', seed: SEED, cohortSize: CLASS_SIZE, subjects: EXAM_SUBJECTS, anchors: ANCHORS, anon: ANON, maxMark: 100,
    terms: [{input: 'understanding', weight: DIALS.understanding, cap: 1},
        {input: 'sessions', weight: DIALS.revision, cap: REVISION_CAP, narrow: 0.5, integer: true},
        {input: 'seen', weight: DIALS.seen, cap: SEEN_CAP, narrow: 1, integer: true}],
    dials: {w0: DIALS.w0, minW: DIALS.minW, passMark: DIALS.passMark, bands: DIALS.bands, overall: {top: 3.6, high: 2.6, good: 1.9}, maxFailed: 1}}); // high = two papers near the top and one solid (three papers, a dial)
/** The anchor variant for a run: the loop's first run is the one where Neolu still tops the class. */
export const variantFor = run => (run ?? 1) <= 1 ? 'first' : null;
export const cohortFor = (run, seed = SEED) => MODEL.cohortMarks(seed, variantFor(run));
// Cyoria words for each band (results line and records; PRS rules).
export const BAND_WORDS = Object.freeze({top: 'one of the two best papers in the class', high: 'near the top of the class', good: 'a solid mark',
    pass: 'a pass', fail: 'not a pass'});
