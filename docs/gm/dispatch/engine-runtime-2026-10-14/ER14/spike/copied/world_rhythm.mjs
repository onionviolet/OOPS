// Recurring availability is derived from the saved native calendar. Rendering
// never creates occurrences, simulates missed rewards or consumes randomness.
const integer = value => Number.isSafeInteger(value) && value >= 0;

export function calendarMinutes(t) {
    if(!t || !["year", "month", "day", "hour", "minute"].every(k => integer(t[k])) ||
        t.month < 1 || t.month > 12 || t.day < 1 || t.day > 30 || t.hour >= 24 || t.minute >= 60) {
        throw new Error("Invalid game calendar for recurring service.");
    }
    const minutes = (((t.year * 12 + t.month - 1) * 30 + t.day - 1) * 24 + t.hour) * 60 + t.minute;
    if(!integer(minutes)) throw new Error("Unsupported game calendar range.");
    return minutes;
}

export function validateSchedule(s) {
    if(!s || !integer(s.period) || s.period === 0 || !integer(s.opens) || !integer(s.closes) ||
        s.opens >= s.closes || s.closes > s.period) throw new Error("Invalid recurring service schedule.");
}

export function recurringWindow(schedule, minute, lastClaim) {
    validateSchedule(schedule);
    if(lastClaim != null && !integer(lastClaim)) throw new Error("Invalid recurring service claim.");
    if(!integer(minute)) return {open: false, reason: "The game calendar is unavailable."};
    const cycle = Math.floor(minute / schedule.period), phase = minute % schedule.period;
    const claimed = lastClaim != null && lastClaim >= cycle;
    const open = !claimed && phase >= schedule.opens && phase < schedule.closes;
    const nextOpens = (phase < schedule.opens && !claimed ? cycle : cycle + 1) * schedule.period + schedule.opens;
    return {cycle, open, claimed, remaining: open ? schedule.closes - phase : 0, nextIn: nextOpens - minute,
        reason: open ? "" : claimed ? "Already attended this game day. The next gathering is tomorrow."
            : `Returns in ${nextOpens - minute} game minutes.`};
}
