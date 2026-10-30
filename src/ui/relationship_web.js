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

// Relationship stages (round 2, proposal): depth from what the observer knows, never their hidden axes.
// Each rung names the evidence that reaches it, so the bar can say what moves it next. The words are
// a per-world dial (a court may say acquaintance, ally, confidant); the evidence rules stay the same.
export const RELATIONSHIP_STAGES = Object.freeze([
    {id: 'met', word: 'Met', next: 'share something with them: work, a favour, a question'},
    {id: 'acquainted', word: 'Acquainted', next: 'see them often or make an agreement with them'},
    {id: 'familiar', word: 'Familiar', next: 'settle an agreement with them'},
    {id: 'relied', word: 'Relied on', next: 'after a settled agreement, see them warm toward you or come to trust them yourself'},
    {id: 'close', word: 'Close', next: ''},
]);
const reached = person => {
    const settled = person.owes.some(o => o.settled), warm = person.manner?.warm === true || person.trust > 0;
    if (settled && warm) return 4;
    if (settled) return 3;
    if (person.saw.length >= 3 || person.owes.length) return 2;
    return person.saw.length ? 1 : 0;
};
/** Stage and its strain, from the same person input as the web. */
export function relationshipStage(person) {
    const index = reached(person), stage = RELATIONSHIP_STAGES[index];
    return {...stage, index, max: RELATIONSHIP_STAGES.length - 1, strained: strained(person)};
}
/** One glance line for a person card summary: stage, then only the signals that need attention. */
export function relationshipGlance(person) {
    const stage = relationshipStage(person), open = person.owes.filter(o => !o.settled);
    return [stage.word, person.here ? 'here' : '', open.some(o => o.by === 'you') ? 'you owe' : '', open.some(o => o.by === 'them') ? 'owes you' : '',
        stage.strained ? 'needs care' : ''].filter(Boolean).join(' · ');
}
/** A meter_bar.js spec (discrete track) for the stage, with what moves it and what was read today. */
export function relationshipStageMeter(person) {
    const stage = relationshipStage(person);
    return {id: `bond.${person.id}`, label: `Bond: ${stage.word}`, kind: 'track', value: stage.index, max: stage.max, discrete: true,
        note: stage.next ? `Next: ${stage.next}.` : 'The highest stage this world names.',
        ...(person.manner ? {observation: {text: `Seen here now: ${person.manner.line.replace(/\.$/, '')}`}} : {})};
}

// Round 3 bars: three small readings per person, each with its words beside the bar (UR37, UR61). Trust is the
// observer's own axis. Warmth is only what was read face to face today, and says so when nothing was. Debt is
// a count from the open agreements and loans, never a fill from anyone's hidden state.
const TRUST_WORD = ['You distrust them', 'You have not decided', 'You trust them'];
export function relationshipBars(person) {
    const bars = [], sign = Number.isFinite(person.trust) ? Math.sign(person.trust) : 0;
    bars.push({id: `trust.${person.id}`, label: `Trust: ${TRUST_WORD[sign + 1]}`, kind: 'track', value: sign + 1, max: 2, discrete: true, note: 'Your own regard for them, from what you have lived through.'});
    const m = person.manner, warmth = !m ? 1 : m.warm ? 2 : 0;
    bars.push({id: `warmth.${person.id}`, label: !m ? 'Their warmth: not read now' : m.warm ? 'Their warmth: warmer toward you' : 'Their warmth: wary of you', kind: 'track', value: warmth, max: 2, discrete: true,
        note: !m ? 'Manner is read only face to face.' : `${m.heard ? 'Heard of you; ' : ''}Seen here now: ${m.line.replace(/\.$/, '')}.`});
    const open = person.owes.filter(o => !o.settled), you = open.filter(o => o.by === 'you').length, them = open.length - you;
    bars.push({id: `debt.${person.id}`, label: !open.length ? 'Debts: none open' : `Debts: you owe ${you}, they owe ${them}`, kind: 'track', value: Math.min(open.length, 4), max: 4, discrete: true,
        note: open.length ? open.map(o => `${o.by === 'you' ? 'You owe' : 'Owes you'}: ${o.label}`).join('; ') + '.' : 'No agreement or loan is open between you.'});
    return bars;
}
