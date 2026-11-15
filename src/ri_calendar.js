// Fang Yuan's calendar binding (RWT24; TMR1, TMR13). Pure: his life's start clock in, the profile and elapsed time out. The date is
// derived from the one game clock; nothing here saves state or counts days of its own. Until his life has begun there is no date.
import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';

export const RI_LEAD_WORLD = 'book.ri.lead.world';
const INSTANCE_FACT = 'book.ri.lead.instance';
// The life's start clock: the beginning receipt's own `initializedAt` is not in state, so the structured beginning's enrolment clock is
// the start (dial: a world fact 'book.ri.lead.calendar.startedAt' overrides it, for a fixture that sets a stage's date).
export function riLeadStartClock(state) {
    const fact = state?.worlds?.[RI_LEAD_WORLD]?.facts?.['book.ri.lead.calendar.startedAt'];
    if (Number.isSafeInteger(fact)) return fact;   // may precede clock zero: a fixture stages a date by saying when the life began
    const born = state?.simulation?.people?.player?.bornAt;
    return Number.isSafeInteger(born) && born >= 0 ? born : 0;
}
export function riCalendarBinding(state) {
    if (state?.actors?.player?.worldId !== RI_LEAD_WORLD || !Number.isSafeInteger(state.clock)) return null;
    const instance = state.worlds?.[RI_LEAD_WORLD]?.facts?.[INSTANCE_FACT];
    if (!instance) return null;
    return {profile: WORLD_CALENDAR_PROFILES[RI_LEAD_WORLD], instanceId: instance, elapsed: Math.max(0, state.clock - riLeadStartClock(state))};
}
