// G5 (slice 4, first step): the school year for Harry's own lead life, as pure data plus readers. Nothing here is saved.
// Mapping (authored, stated once): the lead clock's day 0 is the Saturday of his birthday, 31 July (book_hp_lead_life_data.js
// calendarProfile; the book gives the birthday and no year). The clock's own months are 30-day shift blocks, so the school
// year does NOT read them: it counts real calendar days from 31 July as `day` offsets (non-leap arithmetic: Aug 31 days,
// Sep 30, Oct 31, Nov 30, Dec 31, Jan 31, Feb 28, Mar 31, Apr 30, May 31, Jun 30). One authority: the lead calendar view's
// absoluteLocalDay; this module only reads that index. Dates other than 1 September are proposals (dial: edit `day`, one place).
export const LEAD_DAY0 = '31 July';
export const SCHOOL_YEAR = Object.freeze([
    Object.freeze({id: 'term_start', label: 'Term starts', date: '1 September', day: 32, phase: 'term',
        source: 'Philosopher\'s Stone: the Hogwarts Express leaves King\'s Cross on 1 September (stated in the book).'}),
    Object.freeze({id: 'christmas_break', label: 'Christmas holidays begin', date: '18 December', day: 140, phase: 'christmas_break',
        source: 'Authored proposal. The book has Harry stay at the school over Christmas, so a break exists; its start date is not stated. Dial: the break length and who goes home.'}),
    Object.freeze({id: 'term_resumes', label: 'Lessons resume', date: '5 January', day: 158, phase: 'term',
        source: 'Authored proposal (a short break ending the first week of January).'}),
    Object.freeze({id: 'easter_break', label: 'Easter holidays begin', date: '4 April', day: 247, phase: 'easter_break',
        source: 'Authored proposal. The book mentions Easter holidays for revision, no dates. The year is unknown, so Easter is not tied to a real moon.'}),
    Object.freeze({id: 'term_resumes_easter', label: 'Lessons resume', date: '20 April', day: 263, phase: 'term',
        source: 'Authored proposal.'}),
    Object.freeze({id: 'exams', label: 'End-of-year exams', date: '17 June', day: 321, phase: 'exams',
        source: 'Authored proposal. The book has the exams in June after the forest detention and puts the last paper just before the night in the trapdoor chapters; no date is given. The week of papers is compressed to one day of sittings (dial: hp_exam_model.js EXAM_DAY). Lessons stop while the exams run.'}),
    Object.freeze({id: 'term_end', label: 'Term ends', date: '25 June', day: 329, phase: 'summer_after',
        source: 'Authored proposal. The book puts the exams in June and the end-of-year feast and the train home after them; no day is given.'})]);
const plural = n => `${n} day${n === 1 ? '' : 's'}`;
const when = n => n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${plural(n)}`;
// Where a lead-clock day index sits in the school year: {phase, next:{id,label,date,inDays}|null}. Phase 'summer_before' until 1 September.
export function schoolYearPosition(dayIndex) {
    if(!Number.isInteger(dayIndex) || dayIndex < 0) return null;
    let phase = 'summer_before';
    for(const e of SCHOOL_YEAR) { if(e.day <= dayIndex) phase = e.phase; else break; }
    const next = SCHOOL_YEAR.find(e => e.day > dayIndex) ?? null;
    return {phase, next: next && {id: next.id, label: next.label, date: next.date, inDays: next.day - dayIndex}};
}
// Plain words for the Reports 'Now' line; null when there is nothing to say (after term ends).
export function schoolYearText(dayIndex) {
    const p = schoolYearPosition(dayIndex);
    if(!p) return null;
    if(!p.next) return null;
    const {label, date, inDays} = p.next;
    const lead = p.phase === 'summer_before' ? '' : p.phase === 'term' ? 'Term time. ' : 'School holiday. ';
    return `${lead}${label} ${when(inDays)} (${date}).`;
}
