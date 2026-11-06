// FD8 second world: Harry's weekly class slot as a recurring duty on the shared ledger (duties_domain.js owns the save key).
// Active only once Harry is at school: the actor fact `hp.lead.atSchool` (nothing sets it yet; W5+ will, on arrival). Until then
// the set is inactive, so an untouched life writes no duty record. The lesson itself is an authored proposal (fixed weekday and hour).
import {resolveWorldCalendar} from './world_calendar.js';
import {schoolYearPosition} from './book_world_hp_school_calendar.js';
const WEEK = 7 * 24 * 60, DAY = 1440;
export const HP_AT_SCHOOL_FACT = 'hp.lead.atSchool';
const WORLD = 'book.hp.lead.world';
// Day 0 is a Saturday, so Monday is day 2 of each 7-day cycle: 09:00 to 11:00 (dial: weekday, hour, length).
export const HP_DUTIES = Object.freeze([Object.freeze({id: 'hp.lead.class_slot',
    schedule: Object.freeze({period: WEEK, opens: 2 * DAY + 9 * 60, closes: 2 * DAY + 11 * 60}),
    debtor: 'player', creditor: 'hp.lead.school', source: 'hp_duties',
    why: 'Be in this week\'s lesson on time.'})]);
// Minutes on the lead calendar since day 0 00:00, the same counter the schedule is written against.
export const hpDutyMinute = state => { const v = resolveWorldCalendar(state); return v.absoluteLocalDay * DAY + v.minuteWithinDay; };
export const hpDutyActive = state => {
    if(state?.actors?.player?.worldId !== WORLD || state.actors.player.facts?.[HP_AT_SCHOOL_FACT] !== true) return false;
    const v = resolveWorldCalendar(state);
    return !!v && schoolYearPosition(v.absoluteLocalDay)?.phase === 'term';
};
export const hpDutySet = getState => ({defs: HP_DUTIES, state: getState, active: hpDutyActive, minute: hpDutyMinute});
