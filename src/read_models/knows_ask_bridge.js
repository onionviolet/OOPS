// Bridge: L14 whoKnows (world_events.js) -> the Knows home "who can I ask" list (KNOWLEDGE.md; ask action routed to the talk view). Pure.
// Only people the seat knows appear, once each, sorted by name. The route, the day they learned it and whether they witnessed or heard it never leave
// (an observer cannot see how someone else learned; sorting by it would leak it too). An event with no wording yields no list (RPT10).
/**
 * known: whoKnows(book, eventId, day, people, ctx) result. opts: self (the seat's person id, excluded), knownPeople: Set of ids the seat has met,
 * nameOf(id) -> string | null, topicOf(eventId) -> string | null.
 */
export function askListFromWhoKnows(known, {self = null, knownPeople = new Set(), nameOf, topicOf} = {}) {
    const byPerson = new Map();
    for (const k of known) {
        if (k.person === self || !knownPeople.has(k.person) || byPerson.has(k.person)) continue;
        const name = nameOf(k.person), topic = topicOf(k.eventId);
        if (!name || !topic) continue;
        byPerson.set(k.person, {personId: k.person, name, topic, action: {kind: 'ask', to: k.person, about: k.eventId}});
    }
    return [...byPerson.values()].sort((a, b) => a.name.localeCompare(b.name));
}
