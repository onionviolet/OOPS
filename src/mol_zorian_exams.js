// Zorian's class tests (GTR14, SPR20-SPR22, STY33): state readers over the shared cohort model (mol_exam_model.js) and the commands in
// world_packs/book_mol_exam_data.js. Nothing here is saved. Inputs are what the seat kept from every run, read from the owners that keep it:
//   sessions:      soul-bound revision counters (actor resources under book.mol.loop., which cross the restart)
//   seen:          soul-bound count of earlier sittings of the same paper (minus this run's, once sat)
//   understanding: Nora's study months (Formulas, Mathematics) and Haslush's ward reading plus the barrier cubes (Warding), all
//                  knowledge records the restart already carries
// The run number picks the anchor variant (Neolu tops the class only in the first run); every other classmate's mark repeats exactly.
import {EXAM_SUBJECTS, SUBJECT_IDS, BANDS, BAND_WORDS, ANCHORS, REVISION_CAP, MODEL, cohortFor} from './mol_exam_model.js';
import {MOL_EXAM_IDS as X} from './world_packs/book_mol_exam_data.js';
import {isZorianStart} from './book_world_mol_starts.js';
import {MOL_IDS} from './book_world_mol_ids.js';
import {resolveWorldCalendar} from './world_calendar.js';
// The run day, read from the one calendar profile as mol_zorian_loop.js todayFor does (not imported: that module sits in a cycle with
// people_knowledge.js, and molFacts must stay outside it).
const MOL_WORLD = MOL_IDS.world;
const todayFor = state => isZorianStart(state) && state.actors?.player?.worldId === MOL_WORLD ? (d => d ? {day: d.day} : null)(resolveWorldCalendar(state, null)) : null;
const loopStartOf = state => isZorianStart(state);
import {MOL_STUDY_IDS} from './mol_zorian_study_months.js';
const NORA_MONTHS = MOL_STUDY_IDS.filter((_, i) => i % 2 === 1); // months 2, 4 and 6 are with Nora
const WARD_NOTES = ['book.mol.zorian.s2.object_analysis_method', 'book.mol.zorian.s2.object_analysis_result', 'book.mol.zorian.s2.kael_sewer_preparations'];
const seat = state => state?.actors?.player?.worldId === MOL_WORLD && todayFor(state) ? state.actors.player : null;
const sat = (a, s) => a?.completed?.[X.paper(s)] === 1;
export const runOf = state => state?.motherOfLearning?.runs ?? 1;

/** Zorian's inputs per subject from what he kept across runs. */
export function molExamInputs(state) {
    const a = state?.actors?.player, known = state?.simulation?.knowledge?.player || {}, r = a?.resources || {};
    const nora = Math.min(1, NORA_MONTHS.filter(id => known[id]).length / 3), ward = Math.min(1, WARD_NOTES.filter(id => known[id]).length * 0.5);
    return Object.fromEntries(SUBJECT_IDS.map(s => [s, {sessions: r[X.sessions(s)] ?? 0, seen: Math.max(0, (r[X.sat(s)] ?? 0) - (sat(a, s) ? 1 : 0)),
        understanding: s === 'warding' ? ward : nora}]));
}

/** Facts the exam commands read (spread into molFacts). Defined for the Zorian start at any time, so weights resolve; the visitor gets none. */
export function molExamFacts(state) {
    if(!loopStartOf(state)) return {};
    const a = seat(state), day = todayFor(state)?.day ?? 0, inputs = molExamInputs(state), cohort = cohortFor(runOf(state));
    const facts = {'mol.exam.shown': !!a, 'mol.exam.day': day};
    for(const s of EXAM_SUBJECTS) {
        const ready = s.id === 'formulas' ? a?.completed?.[X.placement] === 1 && day >= s.day : day >= s.day;
        facts[`mol.exam.revise.${s.id}`] = !!a && !sat(a, s.id) && inputs[s.id].sessions < REVISION_CAP;
        facts[`mol.exam.open.${s.id}`] = !!a && !!ready;
        const chances = MODEL.bandChances(s.id, inputs[s.id], cohort);
        for(const b of BANDS) facts[`mol.exam.p.${s.id}.${b}`] = chances[b];
    }
    return facts;
}

const ANCHOR_WORDS = Object.freeze({top: 'aced it', high: 'was near the top', good: 'got a solid mark', pass: 'scraped a pass', fail: 'did not pass'});
/** Read model for the Cyoria tests section: where this run's tests stand and what Zorian remembers of earlier ones. */
export function molExamView(state) {
    const a = seat(state);
    if(!a) return null;
    const day = todayFor(state).day, run = runOf(state), inputs = molExamInputs(state), cohort = cohortFor(run);
    const papers = EXAM_SUBJECTS.map(s => {
        const band = sat(a, s.id) ? a.facts?.[X.band(s.id)] ?? null : null, last = a.facts?.[X.last(s.id)] ?? null, i = inputs[s.id];
        const others = band ? Object.keys(ANCHORS).map(who => `${ANCHORS[who].label} ${ANCHOR_WORDS[MODEL.bandOf(s.id, cohort[s.id].find(r => r.who === who).mark, cohort)]}`) : [];
        const memory = i.seen ? `you have sat this paper ${i.seen} time${i.seen === 1 ? '' : 's'} before${!band && last ? `, last time ${BAND_WORDS[last]}` : ''}` : 'you have not sat this paper before';
        return {id: s.id, label: s.label, day: s.day, band, words: band ? BAND_WORDS[band] : null, sessions: i.sessions, seen: i.seen, others,
            text: `${s.label} (day ${s.day}): ${band ? `${BAND_WORDS[band]} this run. ${others.join('; ')}.` : `not yet sat this run.`} Revision ${i.sessions} of ${REVISION_CAP}; ${memory}.`};
    });
    const bands = Object.fromEntries(papers.map(p => [p.id, p.band])), overall = MODEL.overallBand(bands);
    const next = papers.find(p => !p.band);
    const line = overall ? `All three tests marked this run: ${BAND_WORDS[overall]} overall. The class will have forgotten by next month; you will not.`
        : `Run ${run}, day ${day}. ${next.label} is next${day < next.day ? ` (day ${next.day})` : ''}. Your classmates sit the same papers every month; what you learn each time stays with you.`;
    return {run, day, papers, overall, overallWords: overall ? BAND_WORDS[overall] : null, line};
}

/** The section the Cyoria panel shows (host registration, AR18): exam actions move out of the campaign list into it. */
export function molExamSection(state, actions) {
    const view = molExamView(state), mine = actions.filter(x => x.id.startsWith('book.mol.zorian.exam.'));
    if(!view) return {section: null, rest: actions};
    return {rest: actions.filter(x => !mine.includes(x)), section: {id: 'book.mol.exams', label: 'Class tests this month', description: view.line,
        work: 'Revise in the academy library; Nora’s tests are in the formula workshop, Warding at the academy. Each paper is marked against your class. Revision and earlier sittings are memory, so they carry into the next month; the marks themselves do not.',
        actions: mine, records: view.papers.map(p => ({id: `book.mol.exams.${p.id}`, text: p.text}))}};
}
