// Day-indexed world events (L14, GM18/GM36/GM38): dated and anchored happenings the world runs without the lead,
// and who learns of them when. Pure and world-neutral: records in, answers out, nothing written (RPT8).
// Design: docs/gm/dispatch/sonnet-wave-2026-10-30/L14_CALENDAR_DESIGN.md. Event text is pack data via lineKey (RPT10).
import {check, natural, object} from './basics.js';

export const EVENT_KINDS = Object.freeze(['public_event', 'institution_notice', 'disaster', 'curfew', 'festival', 'canon_beat']);
export const PLACEMENTS = Object.freeze(['dated', 'anchored', 'ordinal', 'recurring', 'unplaced']);
const LABELS = ['S', 'T', 'I', 'U'], SCOPES = ['public', 'private'];

function validateRecord(r) {
    check(object(r) && typeof r.id === 'string' && r.id && typeof r.key === 'string' && r.key, 'Invalid world event.');
    check(EVENT_KINDS.includes(r.kind) && PLACEMENTS.includes(r.placement) && SCOPES.includes(r.scope) && LABELS.includes(r.evidence), `Invalid world event ${r.id}.`);
    check(r.spread === undefined || (Array.isArray(r.spread) && r.spread.every(s => object(s) && typeof s.route === 'string' && natural(s.delayDays))), `Invalid spread on ${r.id}.`);
    check(r.present === undefined || (Array.isArray(r.present) && r.present.every(p => typeof p === 'string')), `Invalid presence on ${r.id}.`);
    if (r.placement === 'dated') check(object(r.when) && natural(r.when.day) && (r.when.endDay === undefined || (natural(r.when.endDay) && r.when.endDay >= r.when.day)), `Invalid window on ${r.id}.`);
    if (r.placement === 'anchored') check(object(r.anchor) && typeof r.anchor.eventId === 'string' && Number.isSafeInteger(r.anchor.offsetDays) &&
        (r.anchor.durationDays === undefined || natural(r.anchor.durationDays)), `Invalid anchor on ${r.id}.`);
    // RWT25: a repeating window. `recur` = {every: {days, years?}, fromDay, untilDay?, durationDays, phaseDays?: [{id, days}]}, in the world's
    // day index (calendarDayIndex gives a date's index). A phase list must add up to durationDays: each occurrence runs its phases in order.
    if (r.placement === 'recurring') {
        const c = r.recur, every = c?.every;
        check(object(c) && object(every) && natural(every.days ?? 0) && natural(every.years ?? 0) && (every.days ?? 0) + (every.years ?? 0) > 0 &&
            natural(c.fromDay) && (c.untilDay === undefined || (natural(c.untilDay) && c.untilDay >= c.fromDay)) && natural(c.durationDays) && c.durationDays > 0 &&
            (c.phaseDays === undefined || (Array.isArray(c.phaseDays) && c.phaseDays.every(p => typeof p?.id === 'string' && natural(p.days) && p.days > 0) &&
                c.phaseDays.reduce((n, p) => n + p.days, 0) === c.durationDays)), `Invalid recurrence on ${r.id}.`);
    }
    if (r.placement === 'ordinal') check(object(r.ordinal) && typeof r.ordinal.beat === 'string', `Invalid ordinal on ${r.id}.`);
}

// Resolves anchors to days. Ordinal and unplaced events have no day: they never run until the host binds them (WA24).
// `calendar` (a profile: its months give the year length) is needed only to turn `every.years` into days.
export function buildEventBook(records, {bindings = {}, calendar = null} = {}) {
    check(Array.isArray(records), 'Invalid world event list.');
    const byId = new Map();
    for (const r of records) {validateRecord(r); check(!byId.has(r.id), `Duplicate world event ${r.id}.`); byId.set(r.id, r);}
    const windows = new Map(), visiting = new Set();
    const resolve = id => {
        if (windows.has(id)) return windows.get(id);
        const r = byId.get(id);
        check(r, `Unknown anchor event ${id}.`);
        check(!visiting.has(id), `Anchor cycle at ${id}.`);
        visiting.add(id);
        let w = null;
        if (r.placement === 'dated') w = {day: r.when.day, endDay: r.when.endDay ?? r.when.day};
        else if (r.placement === 'anchored') {
            const base = resolve(r.anchor.eventId);
            if (base) {const day = base.endDay + r.anchor.offsetDays; check(day >= 0, `Anchored day before zero on ${id}.`); w = {day, endDay: day + (r.anchor.durationDays ?? 0)};}
        } else if (r.placement === 'ordinal' && natural(bindings[r.ordinal.beat])) w = {day: bindings[r.ordinal.beat], endDay: bindings[r.ordinal.beat]};
        visiting.delete(id);
        windows.set(id, w);
        return w;
    };
    const yearDays = calendar ? calendar.months.reduce((n, m) => n + m.days, 0) : 0;
    for (const r of records) if (r.placement === 'recurring') {
        check(!r.recur.every.years || yearDays > 0, `Recurrence in years on ${r.id} needs a calendar.`);
        const span = (r.recur.every.years ?? 0) * yearDays + (r.recur.every.days ?? 0);
        check(span >= r.recur.durationDays, `Recurrence on ${r.id} repeats before it ends.`);
    }
    const events = records.map(r => ({...r, ...(r.placement === 'recurring' ? {periodDays: (r.recur.every.years ?? 0) * yearDays + (r.recur.every.days ?? 0)} : {}), window: resolve(r.id), spread: r.spread ?? [], present: r.present ?? [], effects: r.effects ?? []}));
    return Object.freeze({events: Object.freeze(events), byId: new Map(events.map(e => [e.id, e]))});
}

// The window an event holds on `day`: its one window, or for a recurring event the occurrence that covers `day` (null between them).
// An occurrence is {day, endDay, index, phase?: {id, index, dayInPhase, days}}. A recurring event has no `window` of its own, so
// learnedDay (who learns of it) skips it: a recurring event is read by day, not heard of once (dial: a per-occurrence route later).
export function windowOn(e, day) {
    if (e.placement !== 'recurring') return e.window && e.window.day <= day && day <= e.window.endDay ? e.window : null;
    const c = e.recur;
    if (day < c.fromDay) return null;
    const index = Math.floor((day - c.fromDay) / e.periodDays), start = c.fromDay + index * e.periodDays;
    if (day >= start + c.durationDays || (c.untilDay !== undefined && start > c.untilDay)) return null;
    let into = day - start, i = 0;
    const phases = c.phaseDays ?? [];
    while (i < phases.length - 1 && into >= phases[i].days) {into -= phases[i].days; i++;}
    return {day: start, endDay: start + c.durationDays - 1, index, ...(phases.length ? {phase: {id: phases[i].id, index: i, dayInPhase: into, days: phases[i].days}} : {})};
}
export const happenedOn = (book, day) => book.events.filter(e => windowOn(e, day));
// Where a recurring event stands on `day`: inside an occurrence (with its phase), or waiting for the next one.
export function standingOn(book, eventId, day) {
    const e = book.byId.get(eventId);
    check(e?.placement === 'recurring', `Unknown recurring event ${eventId}.`);
    const w = windowOn(e, day);
    if (w) return {active: true, ...w};
    const c = e.recur;
    if (day < c.fromDay) return {active: false, nextDay: c.fromDay};
    const next = c.fromDay + (Math.floor((day - c.fromDay) / e.periodDays) + 1) * e.periodDays;
    return {active: false, nextDay: c.untilDay !== undefined && next > c.untilDay ? null : next};
}
export const endedBy = (book, day) => book.events.filter(e => e.window && e.window.endDay <= day);
// City-scale restrictions (GM38): the world meets the lead as curfews, closures and halted travel on their days.
// An effect is {kind: 'curfew'|'closure'|'travel_halt', places?, institutions?, legs?, means?, hours?, fromDay?, toDay?}.
// `places` omitted means the whole region; `hours` is [start, end] like region_kit hours and names when the restriction
// bites (curfew), omitted means all day; `hoursKnown` is false when the source gives none (shown, not enforced, by default).
// A curfew- or closure-kind event with no listed effect is its own region-wide restriction over its window.
export function restrictionsOn(book, day) {
    return book.events.flatMap(e => {
        const w = e.placement === 'recurring' ? windowOn(e, day) : e.window;   // a recurring event restricts only inside an occurrence
        if (!w) return [];
        const listed = e.effects.filter(f => ['curfew', 'closure', 'travel_halt'].includes(f.kind));
        if (!listed.length) {
            return ['curfew', 'closure'].includes(e.kind) && windowOn(e, day) ?
                [{eventId: e.id, kind: e.kind, places: e.place ? [e.place] : null, hours: null, hoursKnown: false, lineKey: e.lineKey ?? null}] : [];
        }
        return listed.filter(f => (f.fromDay ?? w.day) <= day && day <= (f.toDay ?? w.endDay)).map(f => ({eventId: e.id, kind: f.kind,
            places: f.places ?? (f.place ? [f.place] : e.place ? [e.place] : null), institutions: f.institutions ?? null, legs: f.legs ?? null, means: f.means ?? null,
            hours: f.hours ?? null, hoursKnown: f.hoursKnown ?? f.hours != null, unmapped: f.unmapped === true, scopeText: f.scopeText ?? null, lineKey: e.lineKey ?? null}));
    });
}
export const curfewsOn = (book, day) => restrictionsOn(book, day).filter(r => r.kind === 'curfew').map(r => ({eventId: r.eventId, place: r.places?.[0] ?? null}));

// Whether a place, institution or leg stays open at an hour under the day's restrictions. The caller ANDs this with its own
// base hours (region_kit isOpen). Enforced: closures, curfews with known hours, halts. Curfews with no recorded hours are
// reported in `notices` but do not close anything (default; the source gave no hours).
export function openUnder(restrictions, {place = null, institution = null, leg = null, means = null, hour}) {
    const hits = restrictions.filter(r => {
        if (r.unmapped) return true;   // scope known only as text: shown, never enforced, until place data names it
        if (r.kind === 'travel_halt') return (leg && r.legs?.includes(leg)) || (means && r.means?.includes(means)) || (!r.legs && !r.means && !!leg);
        if (r.institutions) return !!institution && r.institutions.includes(institution);
        if (r.legs || r.means) return false;
        return !r.places || (place && r.places.includes(place));
    });
    const inHours = h => !h || (h[0] < h[1] ? hour >= h[0] && hour < h[1] : hour >= h[0] || hour < h[1]);
    const closing = hits.filter(r => !r.unmapped && (r.kind === 'closure' ? !r.hours || inHours(r.hours) : r.hoursKnown && inHours(r.hours) || r.kind === 'travel_halt'));
    return {open: closing.length === 0, closedBy: closing.map(r => r.eventId), notices: hits.filter(r => !closing.includes(r) && !r.hoursKnown).map(r => r.eventId)};
}

// ctx = {presence(person, day) -> place|null, channels(person) -> Set}.
// Present: in the event's place on any day of its window, or listed in `present`. Heard: through the first
// spread route the person can use, no earlier than the window's end plus the route's delay. A `via` route delivers
// to `audience` (a person id or a channel they hold) once the carrier has learned the event by any route, so
// second-hand news travels a delay behind the first teller. Private events with no usable carrier are never learned.
export function learnedDay(book, person, eventId, ctx, seen = new Set()) {
    const e = book.byId.get(eventId);
    if (!e?.window) return null;
    const {day, endDay} = e.window;
    if (e.present.includes(person)) return {eventId, learnedDay: day, route: 'present', level: 'present'};
    if (e.place) for (let d = day; d <= endDay; d++) if (ctx.presence?.(person, d) === e.place) return {eventId, learnedDay: d, route: 'present', level: 'present'};
    const guard = `${person}|${eventId}`;
    if (seen.has(guard)) return null;
    seen.add(guard);
    const channels = ctx.channels?.(person) ?? new Set();
    let best = null;
    for (const s of e.spread) {
        let start = endDay;
        if (s.via) {
            if (s.audience && s.audience !== person && !channels.has(s.audience)) continue;
            const carrier = learnedDay(book, s.via, eventId, ctx, seen);
            if (!carrier) continue;
            start = Math.max(endDay, carrier.learnedDay);
        } else if (e.scope === 'private' || !channels.has(s.route)) continue;   // private events leave the room only through a carrier
        const d = start + s.delayDays;
        if (!best || d < best.learnedDay) best = {eventId, learnedDay: d, route: s.route, level: 'heard'};
    }
    seen.delete(guard);
    return best;
}
// Inverse query: who among `people` knows the event by `day`, with when and how. Drives who-can-I-ask and secret checks.
export function whoKnows(book, eventId, day, people, ctx) {
    return people.map(p => ({person: p, ...learnedDay(book, p, eventId, ctx)})).filter(k => k.eventId && k.learnedDay <= day);
}
export function knownTo(book, person, day, ctx) {
    return book.events.map(e => learnedDay(book, person, e.id, ctx)).filter(k => k && k.learnedDay <= day);
}
// Newly known in (fromDay, toDay]: the RPT6 digest. Written by the host once, at the settling rollover.
export function learnedBetween(book, person, fromDay, toDay, ctx) {
    return book.events.map(e => learnedDay(book, person, e.id, ctx)).filter(k => k && k.learnedDay > fromDay && k.learnedDay <= toDay)
        .sort((a, b) => a.learnedDay - b.learnedDay || a.eventId.localeCompare(b.eventId));
}
export const newsOn = (book, person, day, ctx) => learnedBetween(book, person, day - 1, day, ctx);
