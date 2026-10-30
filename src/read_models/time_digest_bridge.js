// Bridge: L14 world events (world_events.js) -> rep-time return digest rows (claude/rep-time, return_digest.js groupDigest inputs `around` and `missed`:
// [{id, text, at}], `at` in game minutes). Pure. What the person witnessed goes to Around; what reached them by a spread route after the window
// closed goes to Missed (TC10). Private events with no usable route never appear (learnedDay is null); an event whose wording the pack does not
// supply is dropped rather than invented (RPT10), and no evidence label, kind or id leaves in the text (RPT7, RPT11).
import {learnedBetween} from '../world_events.js';

const DAY = 1440;

/**
 * book: buildEventBook() result. person: id. span: {fromDay, toDay} (newly known in (fromDay, toDay]).
 * ctx: learnedDay's ctx {presence, channels, knownVia}. textOf: (lineKey, event) -> string | null (pack wording, names resolved by the caller).
 * options: minuteOfDay (default 480) places a day's learning inside the day for `at`.
 */
export function digestRowsFromEvents(book, person, {fromDay, toDay}, ctx, textOf, {minuteOfDay = 480} = {}) {
    const around = [], missed = [];
    for (const k of learnedBetween(book, person, fromDay, toDay, ctx)) {
        const e = book.byId.get(k.eventId), text = e.lineKey ? textOf(e.lineKey, e) : null;
        if (typeof text !== 'string' || !text) continue;
        (k.level === 'present' ? around : missed).push({id: `event:${e.id}`, text, at: k.learnedDay * DAY + minuteOfDay});
    }
    return {around, missed};
}
