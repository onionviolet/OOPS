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

// Deterministic stream (seeded, no ambient randomness): the cohort is the world's, the same in every life.
const hash = text => { let h = 2166136261; for(const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const stream = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const gauss = next => Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Anchors (SPR20): each is a band the book's results fix. `marks` draws one mark per subject inside [lo, hi] (a subject override wins).
export const ANCHORS = Object.freeze({
    hermione: Object.freeze({label: 'Hermione', lo: 90, hi: 99, line: 'led the first years'}),
    ron: Object.freeze({label: 'Ron', lo: 50, hi: 62, line: 'passed with good marks'}),
    neville: Object.freeze({label: 'Neville', lo: 41, hi: 53, over: Object.freeze({herbology: [78, 86]}), line: 'passed, helped by his Herbology mark'})});
export const ANON_MEAN = 46, ANON_SD = 13; // the rest of the year: assumed, tuned so Ron's band sits "good" (see tests)
const MARK_DRAW = 6;

/** The year's marks per subject: {subjectId: [{who, mark}]} for the other COHORT_SIZE - 1 pupils. Pure and cached per seed. */
const cache = new Map();
export function cohortMarks(seed = 'book.hp.lead.exams.cohort.v1') {
    if(cache.has(seed)) return cache.get(seed);
    const next = stream(hash(seed)), out = {};
    const anchorNames = Object.keys(ANCHORS), anonymous = COHORT_SIZE - 1 - anchorNames.length;
    for(const s of SUBJECT_IDS) {
        const rows = anchorNames.map(who => { const a = ANCHORS[who], [lo, hi] = a.over?.[s] ?? [a.lo, a.hi]; return {who, mark: lo + Math.floor(next() * (hi - lo + 1))}; });
        for(let i = 0; i < anonymous; i++) {
            const apt = ANON_MEAN + ANON_SD * gauss(next), draw = Math.floor(next() * (2 * MARK_DRAW + 1)) - MARK_DRAW;
            rows.push({who: null, mark: clamp(Math.round(apt + draw), 8, 96)});
        }
        out[s] = rows;
    }
    cache.set(seed, out);
    return out;
}

/** The band a mark earns in a subject against the cohort: rank (ties share the better one) plus an absolute pass mark. */
export function bandOf(subject, mark, cohort = cohortMarks()) {
    const rank = 1 + cohort[subject].filter(r => r.mark > mark).length;
    if(mark < DIALS.passMark) return 'fail';
    return rank <= DIALS.bands.top ? 'top' : rank <= DIALS.bands.high ? 'high' : rank <= DIALS.bands.good ? 'good' : 'pass';
}

/**
 * Harry's inputs for one subject, each 0..1 except sessions (0..REVISION_CAP). Missing input counts as none.
 * `fluency` is what his hands and practice made of it; `understanding` is why it works (a library write-up, a correct flask).
 */
export const clean = (i = {}) => ({fluency: clamp(+i.fluency || 0, 0, 1), understanding: clamp(+i.understanding || 0, 0, 1), sessions: clamp(Math.floor(+i.sessions || 0), 0, REVISION_CAP)});
export function markRange(subject, inputs) {
    const s = examSubject(subject), i = clean(inputs);
    const centre = s.aptitude + DIALS.fluency * i.fluency + DIALS.understanding * i.understanding + DIALS.revision * i.sessions;
    const w = Math.max(DIALS.minW, DIALS.w0 - i.sessions);
    return {centre, w, low: Math.round(centre) - w, high: Math.round(centre) + w};
}
/** Exact chance of each band for Harry in a subject; the weights the paper command rolls. Sums to 1. */
export function bandChances(subject, inputs, cohort = cohortMarks()) {
    const r = markRange(subject, inputs), chances = Object.fromEntries(BANDS.map(b => [b, 0]));
    const n = 2 * r.w + 1;
    for(let d = -r.w; d <= r.w; d++) chances[bandOf(subject, Math.round(r.centre) + d, cohort)] += 1 / n;
    return chances;
}
const POINTS = Object.freeze({top: 4, high: 3, good: 2, pass: 1, fail: 0});
/** The overall verdict from seven bands: the mean of band points, and no more than one failed paper for any pass. */
export function overallBand(bands) {
    const list = SUBJECT_IDS.map(s => bands[s]);
    if(list.some(b => !(b in POINTS))) return null;
    const mean = list.reduce((n, b) => n + POINTS[b], 0) / list.length, failed = list.filter(b => b === 'fail').length;
    if(failed > 1 || mean < 1) return 'fail';
    return mean >= 3.6 ? 'top' : mean >= 2.8 ? 'high' : mean >= 1.9 ? 'good' : 'pass';
}
/** Chance of each overall band for given per-subject inputs (independent papers; exact by enumeration over bands). */
export function overallChances(inputsBySubject, cohort = cohortMarks()) {
    let dist = new Map([['', 1]]);
    for(const s of SUBJECT_IDS) {
        const c = bandChances(s, inputsBySubject?.[s], cohort), next = new Map();
        for(const [key, p] of dist) for(const b of BANDS) if(c[b] > 0) next.set(`${key}${key ? ',' : ''}${b}`, (next.get(`${key}${key ? ',' : ''}${b}`) ?? 0) + p * c[b]);
        dist = next;
    }
    const out = Object.fromEntries(BANDS.map(b => [b, 0]));
    for(const [key, p] of dist) { const bands = Object.fromEntries(key.split(',').map((b, i) => [SUBJECT_IDS[i], b])); out[overallBand(bands)] += p; }
    return out;
}
/** Where an anchor stands per subject: the same function on fixed marks (GTR20); the pupil's own mark is never "greater" than itself. */
export const anchorBands = (who, cohort = cohortMarks()) => Object.fromEntries(SUBJECT_IDS.map(s => [s, bandOf(s, cohort[s].find(r => r.who === who).mark, cohort)]));
