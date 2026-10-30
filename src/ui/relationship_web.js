// RPX11 relationship web: a pure builder from what the observer knows to an MDL2 figure spec.
// No game imports, so the figure gallery can run it on invented rows. The projection from live
// state (relationship_web_view.js) decides what is known; this file only decides how it is drawn.
// Four edge kinds at most, so each keeps its own line pattern (figure.js has four).
// Input person: {id, name, here, trust?, owes:[{by:'you'|'them', label, settled?, strained?}],
//   saw:[text], manner?: {line, warm, heard}}
// people: most shown on the web; bands: fewest people before closeness splits into two rings
// (below it a short inner spoke crowds its labels, and the text form still names who is close).
export const WEB_LIMITS = Object.freeze({people: 16, bands: 4});
const YOU = '@you';

const shortList = texts => texts.length === 1 ? texts[0] : `${texts.slice(0, -1).join('; ')}; and ${texts[texts.length - 1]}`;
const close = person => person.manner?.warm === true || person.trust > 0 || person.owes.some(o => o.settled);
const strained = person => person.manner?.warm === false || person.owes.some(o => o.strained);
const weight = person => person.owes.length * 3 + person.saw.length + (person.manner ? 2 : 0) + (person.here ? 1 : 0);

/** people: known-person inputs in their list order; title: the place or life. Returns a figure spec. */
export function relationshipWebSpec(people, {id = 'relationship-web', title = 'Who knows what about you', size} = {}) {
    const ranked = people.map((person, order) => ({person, order}))
        .sort((a, b) => weight(b.person) - weight(a.person) || a.order - b.order);
    const shown = ranked.slice(0, WEB_LIMITS.people).sort((a, b) => a.order - b.order).map(entry => entry.person);
    const inner = shown.filter(close), outer = shown.filter(person => !close(person));
    // One ring when nobody is close yet; the closeness band is a dial from known signals only.
    const rings = inner.length && outer.length && shown.length >= WEB_LIMITS.bands
        ? [{id: 'close', label: 'Close to you', radius: .6, count: inner.length, visible: false},
            {id: 'known', label: 'Known', radius: 1, count: outer.length, visible: false}]
        : [{id: 'known', label: 'Known', radius: 1, count: Math.max(1, shown.length), visible: false}];
    // A single even ring would put a spoke straight down through the "You" label; turn it half a step.
    const outerRing = rings[rings.length - 1];
    if (rings.length === 1 && outerRing.count % 2 === 0) outerRing.rotate = 180 / outerRing.count;
    // The inner ring sits half an outer step round, so no inner spoke runs through an outer person.
    if (rings.length > 1) rings[0].rotate = (outerRing.rotate || 0) + 180 / outerRing.count;
    const ringOf = person => rings.length > 1 && close(person) ? 'close' : 'known';
    const index = new Map(), nodes = [{id: YOU, label: 'You', glyph: 'Y', at: 'center', state: 'active'}];
    for (const person of shown) {
        const ring = ringOf(person), i = index.get(ring) || 0; index.set(ring, i + 1);
        const state = strained(person) ? 'strained' : person.here ? 'current' : undefined;
        nodes.push({id: person.id, label: person.name, glyph: [...person.name][0].toUpperCase(), ring, index: i, ...(state ? {state} : {})});
    }
    const edges = [], quiet = [];
    for (const person of shown) {
        const before = edges.length;
        for (const debt of person.owes) {
            const label = debt.settled ? `settled: ${debt.label}` : debt.by === 'you' ? `you owe: ${debt.label}` : `owes you: ${debt.label}`;
            edges.push({from: debt.by === 'you' ? YOU : person.id, to: debt.by === 'you' ? person.id : YOU, kind: 'owes', label,
                state: debt.settled ? 'done' : debt.strained ? 'strained' : 'pending'});
        }
        if (person.saw.length) edges.push({from: person.id, to: YOU, kind: 'saw', label: `saw ${person.saw.length === 1 ? '1 deed' : `${person.saw.length} deeds`}`,
            detail: `Saw: ${shortList(person.saw)}.`});
        if (person.manner) {
            const words = person.manner.line.replace(/\.$/, '');
            edges.push({from: person.id, to: YOU, kind: 'manner', label: person.manner.heard ? 'heard of you' : person.manner.warm ? 'warmer' : 'wary',
                ...(person.manner.heard ? {state: 'unknown'} : {}), detail: `Seen here now: ${words}.${person.manner.heard ? ' Who told them is not known to you.' : ''}`});
        }
        if (Number.isFinite(person.trust) && person.trust !== 0) edges.push({from: YOU, to: person.id, kind: 'your trust', label: person.trust > 0 ? 'you trust' : 'you distrust'});
        if (edges.length === before) quiet.push(person.name);
    }
    const notes = [];
    if (quiet.length) notes.push({text: `No agreement or shared event yet with ${shortList(quiet)}.`});
    // Manner is read face to face only; this never claims where anyone is.
    const unread = shown.filter(person => !person.manner).length;
    if (unread) notes.push({state: 'unknown', text: `Manner is read only face to face; nothing read now for ${unread === shown.length ? 'anyone you know' : `${unread} of them`}.`});
    if (people.length > shown.length) notes.push({text: `${people.length - shown.length} more people are in the cards below.`});
    const legend = [{kind: 'owes', label: 'who owes whom'}, {kind: 'saw', label: 'what they saw you do'}, {kind: 'manner', label: 'their manner, seen here now'},
        {kind: 'your trust', label: 'your own trust'},
        {state: 'pending', label: 'still open'}, {state: 'done', label: 'settled'}, {state: 'current', label: 'here now'}, {state: 'strained', label: 'needs care'}, {state: 'unknown', label: 'heard from someone you cannot name, or not known to you'}]
        .filter(entry => entry.state ? nodes.some(n => n.state === entry.state) || edges.some(e => e.state === entry.state) || notes.some(n => n.state === entry.state) : edges.some(e => e.kind === entry.kind));
    // Size dial: a small web for a few people, so one acquaintance does not fill the column.
    return {id, size: size ?? (shown.length < WEB_LIMITS.bands ? 560 : 720), title, summary: 'Only what you have seen, agreed or can read from them now. Hover a line for detail.', rings, nodes, edges, notes, legend};
}
