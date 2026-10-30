// World events to knowledge writes (L14, GM35): news spread is knowledge. Emits the same write rows as
// beat_knowledge.js ({at, cause, effect:{type:'knowledge', ...}}) for the host's one knowledge writer; stores nothing.
// Present is 'seen'; heard is 'seen' with a reported basis naming the route, so legibility labels it a retained account.
import {learnedBetween} from './world_events.js';

export function eventKnowledgeWrites(book, person, fromDay, toDay, ctx, {textFor, keyPrefix = 'book.news.', actor = id => id} = {}) {
    const writes = [];
    for (const k of learnedBetween(book, person, fromDay, toDay, ctx)) {
        const e = book.byId.get(k.eventId), value = textFor?.(e);
        if (typeof value !== 'string' || !value) continue;   // no pack line: nothing to know, nothing to invent
        writes.push({at: k.learnedDay, cause: `event:${e.id}`, effect: {type: 'knowledge', actor: actor(person), key: keyPrefix + e.id,
            stage: 'seen', value, basis: k.level === 'present' ? {kind: 'observation'} : {kind: 'reported', route: k.route}}});
    }
    return writes;
}
