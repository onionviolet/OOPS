// Harry's first-year exams, the pure model (no state, clock or save). Shape taken from the Academagia decompile packet
// (docs/research/academagia/decompile-2026-10-14, P1/P2: a mark is practical skill plus preparation, preparation narrows the random
// range, a subject is graded against the cohort); no number, band name or formula is copied (GTR7, SLR7).
//   mark = aptitude + FLUENCY * fluency + UNDERSTANDING * understanding + REVISION * min(sessions, CAP) + draw(-w..w), w = max(MIN_W, W0 - sessions)
// Harry's draw is exact (enumerated), so the weights a command rolls are the true chances; the cohort's marks are fixed per world.
// Results are the contract (SPR20): the book says Hermione leads the year, Harry and Ron pass with good marks, Neville passes helped by
// Herbology. Those are the anchor bands below; every other number is an assumed unit (SPR21), reported with its slack in the tests.
export const EXAM_DAY = 321;            // 17 June on the lead clock (day 0 = 31 July); exams are sat on this day (compressed, a dial)
export const REVISION_OPENS = 247;      // the Easter holidays start the revision window (book_world_hp_school_calendar.js)
export const REVISION_CAP = 6;          // sessions per subject that still add; past it the subject is known by heart (GTR21/GTR22)
export const COHORT_SIZE = 40;          // Harry's year, himself included (assumed unit)
export const DIALS = Object.freeze({fluency: 18, understanding: 6, revision: 2, w0: 9, minW: 3, passMark: 38,
    bands: Object.freeze({top: 1, high: 6, good: 20})});    // rank cut-offs in a year of 40 (best, best sixth, best half); a tie shares the better rank
export const BANDS = Object.freeze(['top', 'high', 'good', 'pass', 'fail']);
// Hogwarts words for each band (the results screen and the overall line read these; PRS rules).
export const BAND_WORDS = Object.freeze({top: 'among the best in the year', high: 'high marks', good: 'good marks', pass: 'a pass', fail: 'not a pass'});
// Subjects: `driven` = Harry's inputs come from what he did in play (practice, study); the rest use the stated baseline plus revision.
export const EXAM_SUBJECTS = Object.freeze([
    ['transfiguration', 'Transfiguration', 'the transformation mistress', 52, false],
    ['charms', 'Charms', 'the charms master', 52, true],
    ['herbology', 'Herbology', 'the herbology witch', 52, false],
    ['potions', 'Potions', 'the potions master', 50, true],
    ['astronomy', 'Astronomy', 'the astronomy witch', 52, false],
    ['defence', 'Defence Against the Dark Arts', 'the defence master', 52, false],
    ['history', 'History of Magic', 'the history ghost', 52, false]]
    .map(([id, label, teacher, aptitude, driven]) => Object.freeze({id, label, teacher, aptitude, driven})));
export const SUBJECT_IDS = Object.freeze(EXAM_SUBJECTS.map(s => s.id));
export const examSubject = id => EXAM_SUBJECTS.find(s => s.id === id);

import {examModel, BANDS as SHARED_BANDS} from './exam_cohort.js';

// Anchors (SPR20): each is a band the book's results fix. `marks` draws one mark per subject inside [lo, hi] (a subject override wins).
export const ANCHORS = Object.freeze({
    hermione: Object.freeze({label: 'Hermione', lo: 90, hi: 99, line: 'led the first years'}),
    ron: Object.freeze({label: 'Ron', lo: 50, hi: 62, line: 'passed with good marks'}),
    neville: Object.freeze({label: 'Neville', lo: 41, hi: 53, over: Object.freeze({herbology: [78, 86]}), line: 'passed, helped by his Herbology mark'})});
export const ANON_MEAN = 46, ANON_SD = 13; // the rest of the year: assumed, tuned so Ron's band sits "good" (see tests)
const MARK_DRAW = 6;
// The shared cohort model (exam_cohort.js) with Hogwarts numbers; the second world is Cyoria (mol_exam_model.js). Harry has no loop term.
const MODEL = examModel({id: 'book.hp.lead', seed: 'book.hp.lead.exams.cohort.v1', cohortSize: COHORT_SIZE, subjects: EXAM_SUBJECTS, anchors: ANCHORS,
    anon: {mean: ANON_MEAN, sd: ANON_SD, draw: MARK_DRAW, min: 8, max: 96},
    terms: [{input: 'fluency', weight: DIALS.fluency, cap: 1}, {input: 'understanding', weight: DIALS.understanding, cap: 1},
        {input: 'sessions', weight: DIALS.revision, cap: REVISION_CAP, narrow: 1, integer: true}],
    dials: {w0: DIALS.w0, minW: DIALS.minW, passMark: DIALS.passMark, bands: DIALS.bands, overall: {top: 3.6, high: 2.8, good: 1.9}, maxFailed: 1}});
if(SHARED_BANDS.join() !== BANDS.join()) throw Error('Hogwarts exam bands differ from the shared cohort model.');

/** The year's marks per subject: {subjectId: [{who, mark}]} for the other COHORT_SIZE - 1 pupils. Pure and cached per seed. */
export const cohortMarks = (seed = 'book.hp.lead.exams.cohort.v1') => MODEL.cohortMarks(seed);
/** The band a mark earns in a subject against the cohort: rank (ties share the better one) plus an absolute pass mark. */
export const bandOf = (subject, mark, cohort = cohortMarks()) => MODEL.bandOf(subject, mark, cohort);
/**
 * Harry's inputs for one subject, each 0..1 except sessions (0..REVISION_CAP). Missing input counts as none.
 * `fluency` is what his hands and practice made of it; `understanding` is why it works (a library write-up, a correct flask).
 */
export const clean = i => MODEL.clean(i);
export const markRange = (subject, inputs) => MODEL.markRange(subject, inputs);
/** Exact chance of each band for Harry in a subject; the weights the paper command rolls. Sums to 1. */
export const bandChances = (subject, inputs, cohort = cohortMarks()) => MODEL.bandChances(subject, inputs, cohort);
/** The overall verdict from seven bands: the mean of band points, and no more than one failed paper for any pass. */
export const overallBand = bands => MODEL.overallBand(bands);
/** Chance of each overall band for given per-subject inputs (independent papers; exact by enumeration over bands). */
export const overallChances = (inputsBySubject, cohort = cohortMarks()) => MODEL.overallChances(inputsBySubject, cohort);
/** Where an anchor stands per subject: the same function on fixed marks (GTR20); the pupil's own mark is never "greater" than itself. */
export const anchorBands = (who, cohort = cohortMarks()) => MODEL.anchorBands(who, cohort);
