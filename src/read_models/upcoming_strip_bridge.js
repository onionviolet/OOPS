// Bridge: L14 restrictions (world_events.js restrictionsOn) and L11 gatherings (gatherings.js nextMeeting) -> rep-time upcoming strip rows
// (TIME_AND_CHRONICLE TC12): [{id, kind, text, when, startsIn, place}], soonest first, at most `limit`. Pure. `startsIn` is whole days (0 = today)
// for sorting; `when` is the phrase the strip prints (TC9, never raw minutes). Only what the seat has learned appears: an event the person has no
// learnedDay for is absent (RPT7), an event whose wording the pack does not supply is dropped (RPT10), and a gathering shows only its schedule and
// label, never a seat or its persona (G14, WA/SR secrecy). Evidence labels, kinds and route ids never leave in text.
import {restrictionsOn, learnedDay} from '../world_events.js';
import {nextMeeting} from '../gatherings.js';

const hourText = h => `${String(Math.floor(h)).padStart(2, '0')}:00`;
export const dayPhrase = n => n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;

/**
 * book: buildEventBook() result. person: id. day: today's day index. ctx: learnedDay's ctx {presence, channels}.
 * textOf: (lineKey, event) -> string | null. placeLabel: (placeId) -> string | null (a place without a label is not named).
 * options: horizon (days scanned, default 7), limit (default 3), gatherings (defineGathering rows the seat knows of; the host passes only known ones),
 * gatheringText: (gathering) -> string | null (default: the gathering's own label),
 * announced: Set of event ids the seat was told are coming (a posted notice). L14 learns an event no earlier than its window opens, so
 * without this a future curfew is never shown ahead of time (gap G20).
 */
export function upcomingStrip(book, person, day, ctx, textOf, {placeLabel = () => null, horizon = 7, limit = 3, gatherings = [], gatheringText = g => g.label, announced = new Set()} = {}) {
    const rows = [], seen = new Map();
    for (let d = day; d <= day + horizon; d++) {
        for (const r of restrictionsOn(book, d)) {
            const k = `${r.eventId}|${r.kind}|${(r.places ?? []).join(',')}`;
            if (seen.has(k)) {seen.get(k).last = d; continue;}
            const e = book.byId.get(r.eventId), learned = learnedDay(book, person, r.eventId, ctx);
            if (!announced.has(r.eventId) && (!learned || learned.learnedDay > day)) continue;
            const base = r.lineKey ? textOf(r.lineKey, e) : null;
            if (typeof base !== 'string' || !base) continue;
            const place = r.places?.length === 1 ? placeLabel(r.places[0]) : null;
            const hours = r.hoursKnown && r.hours ? ` (${hourText(r.hours[0])} to ${hourText(r.hours[1])})` : '';
            const row = {id: `restriction:${r.eventId}:${r.kind}`, kind: r.kind, text: `${base}${place ? `, ${place}` : ''}${hours}`, startsIn: d - day, place, last: d};
            seen.set(k, row);
            rows.push(row);
        }
    }
    for (const row of rows) {
        row.when = row.startsIn > 0 ? `from ${dayPhrase(row.startsIn)}` : row.last - day >= horizon ? 'today, for now' : row.last === day ? 'today only' : `today, ends after ${dayPhrase(row.last - day)}`;
        delete row.last;
    }
    for (const g of gatherings) {
        const m = nextMeeting(g, day, {book}), text = gatheringText(g);
        if (!m || typeof text !== 'string' || !text || m.day - day > horizon) continue;
        rows.push({id: `gathering:${g.id}`, kind: 'gathering', text, when: `${dayPhrase(m.day - day)}, ${hourText(m.hour)}`, startsIn: m.day - day, place: null});
    }
    return rows.sort((a, b) => a.startsIn - b.startsIn || a.id.localeCompare(b.id)).slice(0, limit);
}
