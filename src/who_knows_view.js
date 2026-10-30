// G18 in the Knows home: for a thing the seat knows, who else is known to know it. Honest by construction:
// a link exists only when the seat has its own evidence (it was there together, it told them, it asked them).
// The truth query whoKnows (world_events.js) is never called here; a host may feed this module from the
// seat's own evidence through registerWhoKnowsSource. Nothing is stored.
const sources = [];
/** fn(observer, state) -> [{key, person, basis:'present'|'told'|'asked'}], seat evidence only. */
export const registerWhoKnowsSource = fn => { sources.push(fn); return () => sources.splice(sources.indexOf(fn), 1); };

const REASON = {present: 'you were both there', told: 'you told them', asked: 'you asked; no answer yet'};

/** rows: knowsRows output; links: source output; people: relationshipWebPeople output (id, name, here). */
export function whoKnowsRows(rows, links, people) {
    const byId = new Map(people.map(p => [p.id, p])), seen = new Set(), out = [];
    for (const row of rows) {
        const who = [];
        for (const link of links) {
            if (link.key !== row.key || !REASON[link.basis]) continue;
            const person = byId.get(link.person), id = `${row.key}|${link.person}`;
            if (!person || seen.has(id)) continue; seen.add(id);
            who.push({id: person.id, name: person.name, certainty: link.basis === 'asked' ? 'open' : 'known', reason: REASON[link.basis], here: person.here,
                canAsk: person.here, askReason: person.here ? `Ask ${person.name} about it` : `${person.name} is not here; ask when you meet`});
        }
        if (who.length) out.push({key: row.key, text: row.text, who});
    }
    return out;
}
export const whoKnowsLine = (entry, w) => `${w.name}: ${w.certainty === 'open' ? 'open' : 'knows'} (${w.reason}${w.here ? ', here now' : ''})`;

export function whoKnowsFor(observer, state, rows, people) {
    const links = sources.flatMap(fn => { try { return fn(observer, state) || []; } catch { return []; } });
    return whoKnowsRows(rows, links, people);
}

// "Who can I ask" (L13 bridge): hosts feed askListFromWhoKnows output ([{personId, name, topic, action}]) through
// registerAskSource. The list names people and topics only; the route, day and witness level never reach the page.
// Ask opens talk with the person (start_dialogue takes the person; the topic is shown beside the button).
const askSources = [];
export const registerAskSource = fn => { askSources.push(fn); return () => askSources.splice(askSources.indexOf(fn), 1); };
export function askRows(observer, state, people) {
    const here = new Map(people.map(p => [p.id, p.here])), seen = new Set(), out = [];
    for (const fn of askSources) {
        let list = []; try { list = fn(observer, state) || []; } catch { list = []; }
        for (const item of list) {
            const key = `${item.personId}|${item.action?.about}`;
            if (item.action?.kind !== 'ask' || !here.has(item.personId) || seen.has(key)) continue; seen.add(key);
            const present = here.get(item.personId);
            out.push({personId: item.personId, name: item.name, topic: item.topic, canAsk: present,
                reason: present ? `Ask ${item.name} about it` : `${item.name} is not here; ask when you meet`});
        }
    }
    return out;
}
