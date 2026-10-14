import {WORLD_CALENDAR_PROFILES} from './world_calendar_content.js';
import {legacyClimateEnvironment} from './world_climate.js';
const assert = (ok, message) => {if (!ok) throw new Error(message);};
const natural = n => Number.isSafeInteger(n) && n >= 0;
const pad = n => String(n).padStart(2, '0');
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

// Fixed arithmetic only in this legacy slice. Unsupported algorithms fail closed.
export function projectCalendar(profile, {elapsed = 0, unit = 'played_minutes', instanceId, calendar = null}) {
    assert(profile?.algorithmId === 'fixed_months' && profile.algorithmRevision === 1 &&
        Number.isSafeInteger(profile.revision) && profile.revision > 0 && typeof profile.id === 'string', 'Unavailable calendar profile.');
    const u = profile.units, months = profile.months, a = calendar ?? profile.anchor;
    assert(u && natural(u.minutesPerHour) && u.minutesPerHour > 0 && natural(u.hoursPerDay) && u.hoursPerDay > 0 &&
        Array.isArray(months) && months.length > 0 && months.every(m => natural(m.days) && m.days > 0), 'Invalid calendar units.');
    assert(unit === 'played_minutes' && natural(elapsed) && typeof instanceId === 'string' && instanceId.length > 0, 'Invalid calendar coordinate.');
    assert(a && natural(a.year) && a.year > 0 && natural(a.month) && a.month > 0 && a.month <= months.length &&
        natural(a.day) && a.day > 0 && a.day <= months[a.month - 1].days && natural(a.hour) && a.hour < u.hoursPerDay &&
        natural(a.minute) && a.minute < u.minutesPerHour && natural(a.day_count), 'Invalid calendar anchor.');
    const dayLength = u.minutesPerHour * u.hoursPerDay, yearLength = months.reduce((n, m) => n + m.days, 0);
    const anchorDay = (a.year - 1) * yearLength + months.slice(0, a.month - 1).reduce((n, m) => n + m.days, 0) + a.day - 1;
    const total = anchorDay * dayLength + a.hour * u.minutesPerHour + a.minute + elapsed;
    assert(Number.isSafeInteger(dayLength) && Number.isSafeInteger(yearLength) && Number.isSafeInteger(total), 'Calendar overflow.');
    const absoluteLocalDay = Math.floor(total / dayLength), minuteWithinDay = total % dayLength;
    const day_count = a.day_count + absoluteLocalDay - anchorDay;
    assert(natural(day_count), 'Calendar weekday overflow.');
    const year = Math.floor(absoluteLocalDay / yearLength) + 1;
    let remaining = absoluteLocalDay % yearLength, month = 1;
    while (remaining >= months[month - 1].days) {remaining -= months[month - 1].days; month++;}
    const hour = Math.floor(minuteWithinDay / u.minutesPerHour), minute = minuteWithinDay % u.minutesPerHour;
    const seasonId = profile.seasons ? seasons[Math.floor((month - 1) / 3)] : null;
    // Public projection uses only declared date fields; no event graph or hidden overlay enters it.
    return {profileId: profile.id, profileRevision: profile.revision, instanceId,
        dayIdentity: JSON.stringify([instanceId, profile.id, profile.revision, absoluteLocalDay]),
        absoluteLocalDay, minuteWithinDay, dayFraction: minuteWithinDay / dayLength,
        year, month, day: remaining + 1, hour, minute, day_count,
        weekday: profile.week?.[day_count % profile.week.length] ?? null,
        seasonId, precision: profile.precision, label: profile.label, format: profile.format,
        description: profile.format === 'elapsed' ? 'Local elapsed shift date; civil calendar unknown.' : 'Authored legacy numeric calendar; not a sourced civil date.'};
}
export function formatCalendar(view, {time = false} = {}) {
    if (!view) return 'Local date unavailable';
    const date = view.format === 'elapsed' ? `Shift day ${view.absoluteLocalDay + 1} (local elapsed; civil date unknown)` :
        `${pad(view.day)}/${pad(view.month)}/${view.year}`;
    return date + (time ? ` ${pad(view.hour)}:${pad(view.minute)}` : '') +
        (view.seasonId ? `, ${view.seasonId}, ${view.weekday}` : '');
}
export function calendarEnvironment(view) {
    // Preserve legacy 20:00 physical light; descriptive Night remains 21:00.
    const daylight = legacyClimateEnvironment({...view, month: 1, hour: Math.floor(view.dayFraction * 24),
        minute: Math.round(view.dayFraction * 1440) % 60}).daylight;
    return {absoluteLocalDay: view.day_count, dayFraction: view.dayFraction,
        seasonId: view.seasonId, seasonPhase: null, daylight};
}
export function resolveWorldCalendar(state, homeCalendar) {
    const worldId = state?.actors?.player?.worldId ?? 'base.frontier';
    const profile = WORLD_CALENDAR_PROFILES[worldId];
    if (!profile) return null; // Other worlds retain their owners, never a home fallback.
    if (worldId === 'base.frontier') return projectCalendar(profile, {instanceId: 'frontier.main', calendar: homeCalendar});
    const domain = worldId === 'book.mol.cyoria' ? state.motherOfLearning : state.bookWorldCampaign;
    const visit = domain?.visits?.find(v => v.id === domain.activeVisitId && v.status === 'active');
    const instance = domain?.instances?.find(i => i.id === visit?.instanceId && i.worldId === worldId);
    if (!instance || domain.definitionRevision !== 1 || instance.definitionId !== profile.definitionId ||
        instance.definitionRevision !== profile.definitionRevision) return null;
    return projectCalendar(profile, {instanceId: instance.id, elapsed: instance.clock.elapsed, unit: instance.clock.unit});
}
// Session-only cursor. Invoke after successful publication, never from render.
export function createCalendarLog(emit) {
    let previous = null;
    return {
        reset() {previous = null;},
        commit(view) {
            if (!view) {previous = null; return false;}
            if (previous?.dayIdentity === view.dayIdentity) return false;
            const sameBinding = previous?.instanceId === view.instanceId && previous?.profileId === view.profileId && previous?.profileRevision === view.profileRevision;
            const skipped = sameBinding ? Math.max(0, view.absoluteLocalDay - previous.absoluteLocalDay - 1) : 0;
            const text = `[ ${view.label} · ${formatCalendar(view)} ]` +
                (skipped ? ` (${skipped} intervening local ${skipped === 1 ? 'day' : 'days'} skipped; ${formatCalendar(previous)} → ${formatCalendar(view)})` : '');
            emit(text, 'notification', {safeText: true, calendarDate: view.dayIdentity, description: view.description});
            previous = view;
            return true;
        },
    };
}
