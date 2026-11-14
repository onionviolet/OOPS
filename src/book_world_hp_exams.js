// Harry's end-of-year exams (GTR14, SLR4/SLR6, SPR20-SPR22, STY33): the state readers over the pure model in hp_exam_model.js and the
// commands in world_packs/book_hp_lead_exam_data.js. Nothing here is saved: Harry's practice, study and revision are read from the
// native state that already owns them; the one new saved thing is each paper's band, an actor fact written by the paper's outcome.
//   Practice (fluency):   Charms = levitation-charm practice steps, Potions = Alchemy xp, both from the lessons and casts he chose to do.
//   Study (understanding): the library write-ups (HP_STUDY) and a correct flask (hp.lead.potions.flask), as the lessons already count them.
//   Revision: native sessions per subject (actor resource) plus the two the story's own revision act gives every subject once played.
//   Other papers have no play behind them yet: aptitude baseline plus revision only (stated gap, hp_exam_model.js SUBJECTS).
import {SUBJECT_IDS, EXAM_SUBJECTS, BANDS, BAND_WORDS, ANCHORS, REVISION_OPENS, EXAM_DAY, REVISION_CAP, bandChances, overallChances, overallBand, anchorBands, cohortMarks, examSubject} from './hp_exam_model.js';
import {HP_EXAM_IDS} from './world_packs/book_hp_lead_exam_data.js';
import {HP_LEVITATION} from './world_packs/book_hp_lead_life_data.js';
import {HP_STUDY} from './book_world_hp_lessons.js';
const P = 'book.hp.lead', WORLD = `${P}.world`, STORY_REVISION = `${P}.w11_finale.revision`, STORY_REVISION_SESSIONS = 2, MARKS_DAY = 329;
const MASTERY_FOR_FULL = 8, ALCHEMY_XP_FOR_FULL = 40;
const leadDay = state => { const o = state?.simulation?.knowledge?.player?.[`${P}.opening`]; return o ? Math.floor((Math.max(0, state.clock - o.at) + 480) / 1440) : null; }; // rule-lint: allow days since the opening scene plus an 8-hour offset, not a calendar day
const player = state => state?.actors?.player?.worldId === WORLD ? state.actors.player : null;
const atSchoolSorted = a => !!a?.facts?.['hp.lead.atSchool'] && !!a.facts['hp.lead.house'];
const studied = (state, topic) => state?.simulation?.knowledge?.player?.[HP_STUDY[topic].key]?.stage === 'understood';

/** Revision sessions per subject, including the story's own revision act once it is done. */
export function hpExamSessions(state) {
    const a = player(state), story = a?.completed?.[STORY_REVISION] ? STORY_REVISION_SESSIONS : 0;
    return Object.fromEntries(SUBJECT_IDS.map(s => [s, Math.min(REVISION_CAP, (a?.resources?.[HP_EXAM_IDS.resource(s)] ?? 0) + story)]));
}
/** Harry's inputs per subject from what he did in play. */
export function hpExamInputs(state, gameplay) {
    const mastery = state?.simulation?.powers?.player?.[HP_LEVITATION]?.mastery ?? 0, xp = gameplay?.player?.skills?.Alchemy?.xp ?? 0;
    const flask = player(state)?.facts?.['hp.lead.potions.flask'] === 'cure' ? 0.5 : 0, sessions = hpExamSessions(state);
    const base = Object.fromEntries(SUBJECT_IDS.map(s => [s, {fluency: 0, understanding: 0, sessions: sessions[s]}]));
    base.charms = {...base.charms, fluency: Math.min(1, mastery / MASTERY_FOR_FULL), understanding: studied(state, 'charms') ? 1 : 0};
    base.potions = {...base.potions, fluency: Math.min(1, xp / ALCHEMY_XP_FOR_FULL), understanding: (studied(state, 'potions') ? 0.5 : 0) + flask};
    return base;
}
const savedBands = state => { const f = player(state)?.facts || {}; return Object.fromEntries(SUBJECT_IDS.map(s => [s, f[`hp.lead.exam.band.${s}`]])); };

/** Facts the exam commands read (spread into hpFacts for the lead life). Always defined, so weights resolve at any time. */
export function hpExamFacts(state, context = {}) {
    const a = player(state), day = leadDay(state), sessions = hpExamSessions(state), inputs = hpExamInputs(state, context.gameplay);
    const here = atSchoolSorted(a) && day != null, bands = savedBands(state), overall = overallBand(bands);
    const facts = {'hp.lead.exam.revisionOpen': here && day >= REVISION_OPENS && day < EXAM_DAY, 'hp.lead.exam.open': here && day >= EXAM_DAY};
    for(const s of SUBJECT_IDS) {
        facts[`hp.lead.exam.rev.${s}`] = sessions[s];
        const chances = bandChances(s, inputs[s]);
        for(const b of BANDS) facts[`hp.lead.exam.p.${s}.${b}`] = chances[b];
    }
    for(const b of BANDS) facts[`hp.lead.exam.overall.${b}`] = overall === b ? 1 : 0;
    return facts;
}

// What a master writes beside a mark (Hogwarts words, PRS7: one voice, plain). `who` is capitalised role text.
const REMARK = Object.freeze({top: 'says yours is among the best papers in the year',
    high: 'was pleased with the paper and says so',
    good: 'marked it well and wrote that you follow the work',
    pass: 'passed it, with a note to go over the steps more carefully',
    fail: 'asks you to go over this term’s work again over the holidays'});
const cap = t => t[0].toUpperCase() + t.slice(1);
const heard = (state, name) => Object.values(state?.simulation?.knowledge?.player || {}).some(r => typeof r?.value === 'string' && r.value.includes(name));
const ANCHOR_WORDS = Object.freeze({top: 'led the first years', high: 'got high marks', good: 'passed with good marks', pass: 'passed', fail: 'did not pass'});
const dateText = day => day === EXAM_DAY ? '17 June' : `day ${day}`;

/** Read model for the panel: where the exam year stands and what the player can do about it. */
export function hpExamView(state) {
    const a = player(state), day = leadDay(state);
    if(!atSchoolSorted(a) || day == null) return null;
    const done = id => !!a.completed?.[id], sessions = hpExamSessions(state), bands = savedBands(state);
    const papers = EXAM_SUBJECTS.map(s => ({id: s.id, label: s.label, commandId: HP_EXAM_IDS.paper(s.id), done: !!bands[s.id]}));
    const next = papers.find(p => !p.done) ?? null, marksRead = done(HP_EXAM_IDS.marks);
    const phase = marksRead ? 'results' : !next ? 'marks_pending' : day >= EXAM_DAY ? 'exams' : day >= REVISION_OPENS ? 'revision' : 'before';
    const view = {phase, examDate: dateText(EXAM_DAY), daysToExams: Math.max(0, EXAM_DAY - day), cap: REVISION_CAP,
        revision: EXAM_SUBJECTS.map(s => ({id: s.id, label: s.label, commandId: HP_EXAM_IDS.revise(s.id), sessions: sessions[s.id], full: sessions[s.id] >= REVISION_CAP})),
        papers, nextPaper: next, results: null};
    view.line = phase === 'before' ? `The exams are on ${view.examDate}. Revision starts with the Easter holidays.`
        : phase === 'revision' ? `The exams begin on ${view.examDate} (${view.daysToExams} day${view.daysToExams === 1 ? '' : 's'}). Revise what you are least sure of.`
        : phase === 'exams' ? `Exam week. ${papers.filter(p => p.done).length} of ${papers.length} papers sat.`
        : phase === 'marks_pending' ? 'All papers sat. The marks go up on the board on the last day of term.' : 'Your marks are in.';
    if(marksRead) {
        const overall = a.facts['hp.lead.exam.overall'] ?? overallBand(bands), cohort = cohortMarks();
        const others = Object.keys(ANCHORS).filter(who => heard(state, ANCHORS[who].label)).map(who => {
            const b = overallBand(anchorBands(who, cohort));
            return `${ANCHORS[who].label} ${who === 'hermione' && b === 'top' ? ANCHOR_WORDS.top : ANCHOR_WORDS[b]}.`;
        });
        view.results = {overall, overallWords: BAND_WORDS[overall], others,
            rows: EXAM_SUBJECTS.map(s => ({id: s.id, label: s.label, band: bands[s.id], words: BAND_WORDS[bands[s.id]], remark: `${cap(s.teacher)} ${REMARK[bands[s.id]]}.`})),
            nextYear: overall === 'fail' ? 'You are told to repeat the weak papers’ work over the holidays.' : ['top', 'high'].includes(overall) ? 'The masters will expect more of you next year.' : 'Next year starts from where this one left you.'};
    }
    return view;
}
export {examSubject};
