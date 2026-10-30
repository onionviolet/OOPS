// Bridge: L14 event book (world_events.js) -> a per-place history spec for the spacetime views (SPACETIME.md palimpsest: "one place with its
// versions listed by era"). Pure. One track per era the caller names ({id, label, fromDay, toDay}); each step is an event at the place that the
// seat has learned of by `day` and the pack words, so unlearned, unworded and future events never appear (RPT7, RPT10). State: done once its
// window has ended, current while it runs. No evidence label, kind or route id leaves.
import {learnedDay} from '../world_events.js';

/** opts: eras, textOf(lineKey, event) -> string | null, placeLabel(placeId) -> string | null (unlabelled place yields null). */
export function placeHistorySpec(book, person, place, day, ctx, {eras, textOf, placeLabel, size = 640} = {}) {
    const name = placeLabel(place);
    if(!name) return null;
    const tracks = [];
    for(const era of eras) {
        const steps = book.events.filter(e => e.place === place && e.window && e.window.day >= era.fromDay && e.window.day <= era.toDay && e.window.day <= day)
            .filter(e => {const k = learnedDay(book, person, e.id, ctx); return k && k.learnedDay <= day;})
            .sort((a, b) => a.window.day - b.window.day || a.id.localeCompare(b.id))
            .flatMap(e => {const text = e.lineKey ? textOf(e.lineKey, e) : null; return typeof text === 'string' && text ? [{label: text, state: e.window.endDay < day ? 'done' : 'current'}] : [];});
        if(steps.length) tracks.push({id: `era-${era.id}`, label: era.label, steps});
    }
    return {id: `place-history-${place}`, size, title: `${name}, through the years`, summary: tracks.length ? `${tracks.reduce((n, t) => n + t.steps.length, 0)} things you know happened here.` : 'You know of nothing that happened here.',
        tracks, notes: tracks.length ? [] : [{state: 'unknown', text: 'Nothing is recorded here that you have learned.'}]};
}
