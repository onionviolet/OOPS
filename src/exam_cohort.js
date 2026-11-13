// Exams against a simulated cohort (GTR14, GTR20, SPR20-SPR22, STY33): the world-neutral pure model, no state, clock or save.
// Shape from the Academagia decompile packet (P1/P2): a mark is practice plus preparation, preparation narrows the random range, a subject is
// graded against the cohort. A world passes a spec; Hogwarts (hp_exam_model.js) and Cyoria (mol_exam_model.js) are the two callers.
//   mark = aptitude + sum(term.weight * clamp(input, 0, term.cap)) + draw(-w..w),  w = max(minW, w0 - sum(term.narrow * input))
// The seat's draw is exact (enumerated), so the weights a paper command rolls are the true chances. The cohort's marks are fixed per seed.
// Loop worlds: `variant` changes only anchor ranges, never the number of draws, so every pupil who resets gets the same mark in every run.
// Spec: {id, seed, cohortSize, subjects:[{id, aptitude}], anchors:{who:{lo, hi, over?, variants?:{name:{lo, hi, over?}}}},
//   anon:{mean, sd, draw, min, max}, terms:[{input, weight, cap, narrow?, integer?}], dials:{w0, minW, passMark, bands:{top, high, good},
//   overall:{top, high, good}, maxFailed}, maxMark?}
export const BANDS = Object.freeze(['top', 'high', 'good', 'pass', 'fail']);
export const POINTS = Object.freeze({top: 4, high: 3, good: 2, pass: 1, fail: 0});

// Deterministic stream (seeded, no ambient randomness).
const hash = text => { let h = 2166136261; for(const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const stream = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const gauss = next => Math.sqrt(-2 * Math.log(1 - next())) * Math.cos(2 * Math.PI * next());
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function examModel(spec) {
    const subjectIds = Object.freeze(spec.subjects.map(s => s.id)), subjectOf = id => spec.subjects.find(s => s.id === id);
    const D = spec.dials, cache = new Map();
    const range = (a, s, variant) => { const v = (variant && a.variants?.[variant]) || a; return v.over?.[s] ?? [v.lo, v.hi]; };
    /** The cohort's marks per subject: {subjectId: [{who, mark}]} for the other cohortSize - 1 pupils. Pure and cached per seed and variant. */
    function cohortMarks(seed = spec.seed, variant = null) {
        const key = `${seed}\u0000${variant ?? ''}`;
        if(cache.has(key)) return cache.get(key);
        const next = stream(hash(seed)), out = {}, names = Object.keys(spec.anchors), anonymous = spec.cohortSize - 1 - names.length, A = spec.anon;
        for(const s of subjectIds) {
            const rows = names.map(who => { const [lo, hi] = range(spec.anchors[who], s, variant); return {who, mark: lo + Math.floor(next() * (hi - lo + 1))}; });
            for(let i = 0; i < anonymous; i++) {
                const apt = A.mean + A.sd * gauss(next), draw = Math.floor(next() * (2 * A.draw + 1)) - A.draw;
                rows.push({who: null, mark: clamp(Math.round(apt + draw), A.min, A.max)});
            }
            out[s] = rows;
        }
        cache.set(key, out);
        return out;
    }
    /** The band a mark earns in a subject against the cohort: rank (ties share the better one) plus an absolute pass mark. */
    function bandOf(subject, mark, cohort = cohortMarks()) {
        const rank = 1 + cohort[subject].filter(r => r.mark > mark).length;
        if(mark < D.passMark) return 'fail';
        return rank <= D.bands.top ? 'top' : rank <= D.bands.high ? 'high' : rank <= D.bands.good ? 'good' : 'pass';
    }
    /** The seat's inputs, each clamped to its term's cap (integer terms floored). Missing input counts as none. */
    const clean = (i = {}) => Object.fromEntries(spec.terms.map(t => { const v = t.integer ? Math.floor(+i[t.input] || 0) : +i[t.input] || 0; return [t.input, clamp(v, 0, t.cap)]; }));
    function markRange(subject, inputs) {
        const s = subjectOf(subject), i = clean(inputs);
        let centre = s.aptitude, narrowing = 0;
        for(const t of spec.terms) { centre += t.weight * i[t.input]; narrowing += (t.narrow ?? 0) * i[t.input]; }
        const w = Math.max(D.minW, Math.floor(D.w0 - narrowing)); // whole marks either side, so the draw enumerates
        return {centre, w, low: Math.round(centre) - w, high: Math.round(centre) + w};
    }
    const markAt = (r, d) => spec.maxMark == null ? Math.round(r.centre) + d : Math.min(spec.maxMark, Math.round(r.centre) + d);
    /** Exact chance of each band in a subject; the weights the paper command rolls. Sums to 1. */
    function bandChances(subject, inputs, cohort = cohortMarks()) {
        const r = markRange(subject, inputs), chances = Object.fromEntries(BANDS.map(b => [b, 0])), n = 2 * r.w + 1;
        for(let d = -r.w; d <= r.w; d++) chances[bandOf(subject, markAt(r, d), cohort)] += 1 / n;
        return chances;
    }
    /** The overall verdict: the mean of band points, and no more than `maxFailed` failed papers for any pass. */
    function overallBand(bands) {
        const list = subjectIds.map(s => bands[s]);
        if(list.some(b => !(b in POINTS))) return null;
        const mean = list.reduce((n, b) => n + POINTS[b], 0) / list.length, failed = list.filter(b => b === 'fail').length;
        if(failed > D.maxFailed || mean < 1) return 'fail';
        return mean >= D.overall.top ? 'top' : mean >= D.overall.high ? 'high' : mean >= D.overall.good ? 'good' : 'pass';
    }
    /** Chance of each overall band for given per-subject inputs (independent papers; exact by enumeration over bands). */
    function overallChances(inputsBySubject, cohort = cohortMarks()) {
        let dist = new Map([['', 1]]);
        for(const s of subjectIds) {
            const c = bandChances(s, inputsBySubject?.[s], cohort), next = new Map();
            for(const [key, p] of dist) for(const b of BANDS) if(c[b] > 0) next.set(`${key}${key ? ',' : ''}${b}`, (next.get(`${key}${key ? ',' : ''}${b}`) ?? 0) + p * c[b]);
            dist = next;
        }
        const out = Object.fromEntries(BANDS.map(b => [b, 0]));
        for(const [key, p] of dist) { const bands = Object.fromEntries(key.split(',').map((b, i) => [subjectIds[i], b])); out[overallBand(bands)] += p; }
        return out;
    }
    /** Where an anchor stands per subject: the same function on fixed marks (GTR20); a pupil's own mark is never "greater" than itself. */
    const anchorBands = (who, cohort = cohortMarks()) => Object.fromEntries(subjectIds.map(s => [s, bandOf(s, cohort[s].find(r => r.who === who).mark, cohort)]));
    return Object.freeze({subjectIds, subjectOf, cohortMarks, bandOf, clean, markRange, bandChances, overallBand, overallChances, anchorBands});
}
