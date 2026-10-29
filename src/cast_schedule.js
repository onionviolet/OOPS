// Pure cast-location projection (AR3, AR5, AR10, AR14). The host supplies the
// current game calendar; this module owns neither time nor location state.
import {calendarMinutes} from './world_rhythm.js';
import {dayIndex} from './world_day_index.js';
import {check, natural} from './basics.js';

// Half-open windows, measured in minutes after midnight. These are defaults
// for rows that use a named band; a world's own explicit minutes remain free.
export const TIME_BANDS = Object.freeze({
    night: Object.freeze({from: 0, to: 360}),
    dawn: Object.freeze({from: 360, to: 480}),
    morning: Object.freeze({from: 480, to: 720}),
    noon: Object.freeze({from: 720, to: 840}),
    afternoon: Object.freeze({from: 840, to: 1080}),
    evening: Object.freeze({from: 1080, to: 1440}),
});

// Calendar periods use this game's 30-day months and 12-month years. A term
// is an authored default of 120 days; callers may supply termDays per row.
export const RECURRENCE_DAYS = Object.freeze({daily: 1, weekly: 7, monthly: 30,
    term: 120, seasonal: 90, yearly: 360});
const SOURCE_RANK = Object.freeze({fill: 0, routine: 1, intention: 2, canon: 3});
const LABELS = new Set(['S', 'T', 'I', 'U', 'fill']);
const SOURCES = new Set(Object.keys(SOURCE_RANK));
const RECURRENCES = new Set(['once', 'daily', 'weekdays', 'weekly', 'monthly', 'term', 'seasonal', 'yearly', 'irregular']);
const own = (v, k) => v != null && Object.hasOwn(v, k);

function minuteValue(value, field) {
    if (typeof value === 'string') {
        const band = TIME_BANDS[value];
        check(band, `Unknown ${field} time band: ${value}`);
        return band[field];
    }
    check(natural(value) && value <= 1440, `Invalid schedule ${field} minute.`);
    return value;
}

function normalizeRow(row, index) {
    check(row && typeof row === 'object' && !Array.isArray(row), `Invalid schedule row ${index}.`);
    check(typeof row.actor === 'string' && row.actor.length > 0, `Schedule row ${index} needs an actor.`);
    check(typeof row.place === 'string' && row.place.length > 0, `Schedule row ${index} needs a place.`);
    const recurrence = row.recurrence ?? 'once';
    check(RECURRENCES.has(recurrence), `Unknown schedule recurrence: ${recurrence}`);
    check(row.until == null || (natural(row.until) && row.until > 0), `Invalid schedule until on row ${index}.`);
    check(row.label == null || LABELS.has(row.label), `Invalid schedule label on row ${index}.`);
    check(row.source == null || SOURCES.has(row.source), `Invalid schedule source on row ${index}.`);
    check(row.weight == null || (typeof row.weight === 'number' && Number.isFinite(row.weight)), `Invalid schedule weight on row ${index}.`);
    const from = minuteValue(row.from, 'from'), to = minuteValue(row.to, 'to');
    check(from < to, `Schedule row ${index} must have from before to.`);
    check(row.termDays == null || (natural(row.termDays) && row.termDays > 0), `Invalid term length on row ${index}.`);
    // `day` is the row's first day (dayIndex). A `once` row needs it; for repeating rows it sets the
    // phase (first weekly day, term start) and nothing before it applies.
    check(row.day == null || (natural(row.day) && row.day > 0), `Invalid schedule day on row ${index}.`);
    check(recurrence !== 'once' || row.day != null, `Schedule row ${index} is once and needs a day.`);
    return {row, index, recurrence, from, to, source: row.source ?? (row.label === 'fill' ? 'fill' : 'routine')};
}

function readAt(at) {
    check(at && typeof at === 'object', 'A game calendar is required for cast whereabouts.');
    const calendar = at.calendar ?? at;
    const minute = calendarMinutes(calendar);
    const day = dayIndex(at.calendar ? at : {calendar});
    return {calendar, minute, day, minuteOfDay: calendar.hour * 60 + calendar.minute};
}

function dateAtMinute(minute) {
    const minuteInYear = minute % (360 * 1440);
    const dayOfYear = Math.floor(minuteInYear / 1440);
    const year = Math.floor(minute / (360 * 1440));
    const month = Math.floor(dayOfYear / 30) + 1;
    const day = dayOfYear % 30 + 1;
    return {year, month, day};
}

function occursOn(spec, current, candidateMinute, candidateDay) {
    const first = spec.row.day ?? 1;
    if (candidateDay < first) return false;
    if (spec.recurrence === 'once') return candidateDay === first;
    if (spec.recurrence === 'irregular') return false;
    if (spec.recurrence === 'weekdays') return ((candidateDay - 1) % 7) < 5;
    // Without `day`, calendar recurrences use the native calendar anchor (day 1,
    // month 1), so rows stay deterministic without a clock; `day` sets the phase.
    if (spec.recurrence === 'weekly') return (candidateDay - first) % 7 === 0;
    const period = spec.recurrence === 'term' ? (spec.row.termDays ?? RECURRENCE_DAYS.term) : RECURRENCE_DAYS[spec.recurrence];
    if (spec.recurrence === 'daily') return true;
    const currentDate = dateAtMinute(current.minute), candidateDate = dateAtMinute(candidateMinute);
    if (spec.recurrence === 'monthly') return candidateDate.day === 1;
    if (spec.recurrence === 'yearly') return candidateDate.month === 1 && candidateDate.day === 1;
    if (spec.recurrence === 'seasonal') return candidateDate.day === 1 && [1, 4, 7, 10].includes(candidateDate.month);
    return period > 0 && (candidateDay - first) % period === 0;
}

function isActive(spec, current) {
    if (spec.recurrence === 'irregular' || (spec.row.until != null && current.day > spec.row.until)) return false;
    return occursOn(spec, current, current.minute, current.day) &&
        current.minuteOfDay >= spec.from && current.minuteOfDay < spec.to;
}

function nextOccurrence(spec, current) {
    if (spec.recurrence === 'irregular') return null;
    if (spec.recurrence === 'once') {
        if (spec.row.day < current.day || spec.row.day === current.day && current.minuteOfDay >= spec.to) return null;
        const from = spec.row.day === current.day ? Math.max(spec.from, current.minuteOfDay) : spec.from;
        return {minute: current.minute - current.minuteOfDay + (spec.row.day - current.day) * 1440 + from, day: spec.row.day};
    }
    // At most one 360-day game year is needed to find yearly recurrence; a
    // larger term can extend the bounded search to its next authored boundary.
    const horizon = Math.max(360, spec.row.termDays ?? 0) + Math.max(0, (spec.row.day ?? 1) - current.day) + 1;
    for (let offset = 0; offset <= horizon; offset++) {
        const start = offset === 0 ? current.minute : current.minute - current.minuteOfDay + offset * 1440;
        const candidateDay = current.day + offset;
        if (spec.row.until != null && candidateDay > spec.row.until) return null;
        if (!occursOn(spec, current, start, candidateDay)) continue;
        const atMinute = offset === 0 ? current.minuteOfDay : 0;
        const from = Math.max(spec.from, offset === 0 ? current.minuteOfDay : 0);
        if (from < spec.to) return {minute: start - atMinute + from, day: candidateDay};
    }
    return null;
}

function rank(spec) {
    return [SOURCE_RANK[spec.source], String(spec.row.locator ?? '')];
}
function compare(a, b) {
    const ar = rank(a), br = rank(b);
    return br[0] - ar[0] || (ar[1] < br[1] ? 1 : ar[1] > br[1] ? -1 : b.index - a.index);
}

export function whereabouts(rows, actor, at) {
    check(Array.isArray(rows), 'Cast schedule rows must be a list.');
    check(typeof actor === 'string' && actor.length > 0, 'A cast actor is required.');
    return projectWhereabouts(rows.map(normalizeRow).filter(spec => spec.row.actor === actor), readAt(at));
}

function projectWhereabouts(candidates, current) {
    const active = candidates.filter(spec => isActive(spec, current)).sort(compare);
    if (active.length) return {place: active[0].row.place, row: active[0].row};
    const upcoming = candidates.flatMap(spec => {
        const next = nextOccurrence(spec, current);
        return next ? [{spec, next}] : [];
    }).sort((a, b) => a.next.minute - b.next.minute || compare(a.spec, b.spec));
    if (!upcoming.length) {
        return candidates.some(spec => spec.recurrence === 'irregular' && (spec.row.until == null || current.day <= spec.row.until))
            ? {place: null, irregular: true}
            : {place: null, nextAt: null, nextPlace: null};
    }
    return {place: null, nextAt: upcoming[0].next.minute, nextPlace: upcoming[0].spec.row.place};
}

// Compile immutable pack rows once. The ordinary API still validates mutable
// callers on every read; a host replaces this index when its pack changes.
export function compileCastSchedule(rows) {
    check(Array.isArray(rows), 'Cast schedule rows must be a list.');
    const byActor = new Map();
    for(const spec of rows.map(normalizeRow)) {
        if(!byActor.has(spec.row.actor)) byActor.set(spec.row.actor, []);
        byActor.get(spec.row.actor).push(spec);
    }
    return {
        whereabouts: (actor, at) => projectWhereabouts(byActor.get(actor) || [], readAt(at)),
        nextBoundary(actor, at) {
            const current = readAt(at); let next = Infinity;
            for(const spec of byActor.get(actor) || []) {
                if(spec.row.until != null && current.day > spec.row.until) continue;
                if(isActive(spec, current)) next = Math.min(next, current.minute - current.minuteOfDay + spec.to);
                else {
                    const occurrence = nextOccurrence(spec, current);
                    if(occurrence) next = Math.min(next, occurrence.minute);
                }
            }
            return Number.isFinite(next) ? next : null;
        },
    };
}

export function lintAnchors(rows, anchors) {
    check(Array.isArray(rows) && Array.isArray(anchors), 'Schedule rows and anchors must be lists.');
    const conflicts = [];
    for (const anchor of anchors) {
        check(anchor && typeof anchor.actor === 'string' && typeof anchor.place === 'string', 'Invalid cast anchor.');
        const current = readAt(anchor.at);
        for (const spec of rows.map(normalizeRow).filter(s => s.row.actor === anchor.actor && s.source !== 'canon')) {
            if (spec.row.place !== anchor.place && isActive(spec, current)) conflicts.push(spec.row);
        }
    }
    return conflicts;
}

export function awayReason(result, labels = {}) {
    if (!result || result.place != null || result.irregular || result.nextAt == null) return null;
    const band = Object.entries(TIME_BANDS).find(([, range]) => result.nextAt % 1440 >= range.from && result.nextAt % 1440 < range.to)?.[0] ?? 'night';
    const place = labels[result.nextPlace] ?? result.nextPlace;
    return `Away; usually back by ${band} at ${place}`;
}
