// Harry's ordinary school week (lead core-flow audit, ordinary-day round 2026-11-14, loop H1, on the shared day shape PS5; proposal
// under AD32, ACR1, ACR6, ACR8). The five first-year subjects that had no class of their own get a weekly timetable; Charms and Potions
// keep their Monday hour (book_world_hp_lessons.js, the class-slot duty). A class leaves a set of notes and a piece of homework comes back
// marked; both are items he holds (the inventory is the one count), and the end-of-year papers read them (book_world_hp_exams.js), so the
// week feeds the June marks. Notes he gives away or loses are gone from his revision too. Nothing else is saved.
// One clock and one term gate: hpLeadMinute and hpInTerm from the lessons module. No import of duties or positions (import cycle, see there).
// The commands are in world_packs/book_hp_lead_day.js; this file is the timetable, its facts and its read model.
import {lessonAvailability} from './lesson.js';
import {hpLeadMinute, hpInTerm} from './book_world_hp_lessons.js';

export const HP_LEAD_DAY = 'book.hp.lead.day';
const DAY = 1440, WEEK = 7 * DAY, H = 60;
// Day 0 of the lead clock is a Saturday, so Monday is weekday 2 of each 7-day cycle (the class-slot duty's arithmetic).
const WEEKDAYS = Object.freeze({mon: 2, tue: 3, wed: 4, thu: 5, fri: 6});
const DAY_WORDS = Object.freeze({mon: 'Mondays', tue: 'Tuesdays', wed: 'Wednesdays', thu: 'Thursdays', fri: 'Fridays'});
const clock = m => `${String(Math.floor(m / H) % 24).padStart(2, '0')}:${String(m % H).padStart(2, '0')}`;
// Dials with reasons (AD56). The book states Herbology three times a week in the greenhouses and Astronomy at midnight on Wednesdays (PS ch8).
// It also puts double Potions on Friday mornings; this life already teaches Potions on Monday (an earlier proposal), so Friday stays free.
// Every other day and hour is an authored proposal: mornings and early afternoons, one class an hour, none on top of Monday's Charms and Potions.
export const HP_DAY_DIALS = Object.freeze({
    lateMinutes: {value: 15, why: 'A pupil who arrives within a quarter of an hour is let in; later than that the class has started without him.'},
    lessonMinutes: {value: 60, why: 'One hour a class, the length of the Monday Charms and Potions hours.'},
    homeworkMinutes: {value: 60, why: 'An evening hour in the common room or the library per piece, the usual first-year essay.'},
    lessonsForFull: {value: 24, why: 'The practical work of a subject is known after about two thirds of a year\'s weekly classes (weeks of term to the exams, about 36).'},
    homeworkForFull: {value: 12, why: 'Half as many written pieces as classes show the reasons behind the practical work.'}
});
const slot = (day, start, length = H) => Object.freeze({day, start, period: WEEK, opens: WEEKDAYS[day] * DAY + start, closes: WEEKDAYS[day] * DAY + start + length});
export const HP_TIMETABLE = Object.freeze([
    {id: 'herbology', label: 'Herbology', teacher: 'the herbology witch', room: 'the greenhouses', slots: [slot('tue', 9 * H), slot('thu', 9 * H), slot('fri', 9 * H)],
        lesson: 'You repotted and fed the strange plants in the greenhouses and learned what each one needs.', homework: 'You wrote up the care of this week\'s plant.',
        basis: 'Three times a week in the greenhouses (stated, PS ch8).'},
    {id: 'transfiguration', label: 'Transfiguration', teacher: 'the transformation mistress', room: 'the Transfiguration classroom', slots: [slot('tue', 10 * H), slot('thu', 14 * H)],
        lesson: 'You took notes, then tried to turn a match into a needle. It went a little silver and pointed.', homework: 'You wrote the notes on this week\'s change out fair.',
        basis: 'A strict class of notes and then practice (stated); the days are a proposal.'},
    {id: 'defence', label: 'Defence Against the Dark Arts', teacher: 'the defence master', room: 'the Defence classroom', slots: [slot('wed', 10 * H), slot('fri', 10 * H)],
        lesson: 'A lesson on what to do about the dark creatures in the book, from a nervous teacher in a turban.', homework: 'You wrote out the defences against this week\'s creature.',
        basis: 'Days and hours are a proposal.'},
    {id: 'history', label: 'History of Magic', teacher: 'the history ghost', room: 'the History classroom', slots: [slot('mon', 14 * H), slot('fri', 14 * H)],
        lesson: 'The ghost read out names and dates. You kept awake long enough to write most of them down.', homework: 'You wrote the essay on this week\'s goblin rebellion.',
        basis: 'Days and hours are a proposal.'},
    {id: 'astronomy', label: 'Astronomy', teacher: 'the astronomy witch', room: 'the Astronomy tower', slots: [slot('wed', 23 * H)],
        lesson: 'At midnight on the tallest tower you found the week\'s stars and planets through the telescope.', homework: 'You drew this week\'s star chart.',
        basis: 'Wednesday nights at midnight on the tower (stated, PS ch8; the hour before midnight here).'}
].map(Object.freeze));
export const HP_NOTES_ITEM = s => `${HP_LEAD_DAY}.notes.${s}`;
export const HP_MARKED_ITEM = s => `${HP_LEAD_DAY}.marked.${s}`;
export const hpDayFact = (s, what) => `${HP_LEAD_DAY}.${s}.${what}`;
export const hpTimetableWords = row => {
    const byTime = new Map();
    for(const s of row.slots) { const t = `${clock(s.start)} to ${s.start + H >= DAY ? 'midnight' : clock(s.start + H)}`; byTime.set(t, [...(byTime.get(t) || []), DAY_WORDS[s.day]]); }
    const list = d => d.length < 2 ? d.join('') : `${d.slice(0, -1).join(', ')} and ${d.at(-1)}`;
    return [...byTime].map(([t, days]) => `${list(days)} ${t}`).join('; ');
};
// `gameplay` is the shell's projection (context.gameplay), whose player inventory is keyed by the item key.
const count = (gameplay, id) => { const n = gameplay?.player?.inventory?.[JSON.stringify({id})]; return Number.isFinite(n) && n > 0 ? n : 0; };
export const hpLessonsAttended = (gameplay, s) => count(gameplay, HP_NOTES_ITEM(s));
export const hpHomeworkDone = (gameplay, s) => count(gameplay, HP_MARKED_ITEM(s));
const sorted = state => !!state?.actors?.player?.facts?.['hp.lead.house'];
// The slot taking pupils now (open and no more than the late allowance in), or null.
function startableSlot(row, minute) {
    for(const s of row.slots) { const w = {period: s.period, opens: s.opens, closes: s.closes};
        if(lessonAvailability(w, minute).available && minute % WEEK - s.opens <= HP_DAY_DIALS.lateMinutes.value) return s; }
    return null;
}
function inTermSafe(state) { try { return hpInTerm(state); } catch { return false; } }
// Facts for the commands (spread into hpFacts for the lead life). Always defined, so a rule never reads a missing fact.
export function hpDayFacts(state, context = {}) {
    const g = context.gameplay;
    const minute = hpLeadMinute(state), here = sorted(state) && minute != null && inTermSafe(state), facts = {};
    for(const row of HP_TIMETABLE) {
        facts[hpDayFact(row.id, 'startable')] = here && !!startableSlot(row, minute);
        facts[hpDayFact(row.id, 'owed')] = hpLessonsAttended(g, row.id) > hpHomeworkDone(g, row.id);
    }
    return facts;
}
// The paper's inputs from the week (read by hpExamInputs for the subjects without a play route of their own).
export function hpDayExamInputs(gameplay, subject) {
    const d = HP_DAY_DIALS;
    return {fluency: Math.min(1, hpLessonsAttended(gameplay, subject) / d.lessonsForFull.value), understanding: Math.min(1, hpHomeworkDone(gameplay, subject) / d.homeworkForFull.value)};
}
