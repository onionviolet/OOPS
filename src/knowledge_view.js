// LTU4 Knows home and RPX12 board (proposal, docs/representations/KNOWLEDGE.md). A pure
// projection: the seat observer's own knowledge entries and inference intentions in, Knows rows
// and an MDL2 figure spec out. It reads only observer.knowledge() and observer.facts(), never
// world facts, another actor's knowledge or a job's frozen effects, so a sealed truth the seat
// has not received has no path to the page. "Open" rows come only from the seat's own unanswered
// questions, never from truths it lacks, so an open row cannot hint that a secret exists.

// UIV6 (proposed): one known / guessed / open grammar, mapped onto existing figure states.
export const CERTAINTY = Object.freeze({
    known: {label: 'Known', figure: 'filled', key: 'known: seen or learned'},
    guessed: {label: 'Guessed', figure: 'pending', key: 'guessed: your reading, may be wrong'},
    open: {label: 'Open', figure: 'unknown', key: 'open: asked, no answer yet'},
});
export const CERTAINTY_ORDER = ['known', 'guessed', 'open'];
const INTENT = {active: {label: 'You mean to act on it', verb: 'Act on', figure: 'current'}, postponed: {label: 'Set aside for now', verb: 'Set aside', figure: 'empty'}, considering: {label: 'Still thinking it over', verb: 'Thinking over', figure: 'unknown'}};
const BOARD_COLUMN = 6, LABEL_MAX = 40;

function certaintyOf(entry) {
    const status = entry.basis?.status;
    if (status === 'obscured' || status === 'unanswered') return 'open';
    return entry.stage === 'interpreted' ? 'guessed' : 'known';
}

// How the seat came to hold it, in the seat's own words (MEANS_AND_APPRAISAL "by channel").
function provenanceOf(entry) {
    const b = entry.basis;
    if (b?.method) return b.status === 'obscured' ? `Divined by ${b.method}; the sign was unclear` : b.status === 'unanswered' ? `Asked by ${b.method}; nothing answered` : `Divined by ${b.method}`;
    switch (b?.kind) {
        case 'observation': return 'You saw it';
        case 'recollection': return 'You remember it';
        case 'instruction': return b.sourceId ? 'You read it' : 'You were told';
        case 'inference': return 'You worked it out';
    }
    return entry.stage === 'interpreted' ? 'You worked it out' : entry.stage === 'understood' ? 'You learned it' : 'You saw it';
}

const MINUTES_PER_DAY = 1440;
export function whenText(at, clock) {
    if (!Number.isFinite(at)) return '';
    const days = Number.isFinite(clock) ? Math.floor(clock / MINUTES_PER_DAY) - Math.floor(at / MINUTES_PER_DAY) : 0;
    return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
}

/** Rows for the Knows list, newest first. options: {clock}. */
export function knowsRows(observer, {clock} = {}) {
    const knowledge = observer.knowledge(), facts = observer.facts();
    const rows = Object.entries(knowledge).map(([key, entry]) => {
        const certainty = certaintyOf(entry);
        return {key, text: entry.value, certainty, certaintyLabel: CERTAINTY[certainty].label, provenance: provenanceOf(entry),
            at: entry.at, when: whenText(entry.at, clock), uncertainty: entry.basis?.uncertainty || '', evidence: (entry.basis?.evidence || []).filter(k => Object.hasOwn(knowledge, k))};
    });
    // Intentions are the seat's own facts (cast_inference_adapter): one row per chain still open.
    for (const [fact, status] of Object.entries(facts)) {
        const m = /^inference\.(.+)\.intention$/.exec(fact);
        if (!m || !Object.hasOwn(INTENT, status)) continue;
        const thoughts = Object.entries(knowledge).filter(([key]) => key.startsWith(`inference.${m[1]}.`)).sort((a, b) => b[1].at - a[1].at);
        const latest = thoughts[0];
        rows.push({key: `intent:${m[1]}`, text: latest ? latest[1].value : 'A thought you have not finished', certainty: status === 'considering' ? 'open' : 'guessed',
            certaintyLabel: INTENT[status].label, provenance: 'Your intention', intent: status, at: latest?.[1].at, when: whenText(latest?.[1].at, clock), uncertainty: '', evidence: latest ? [latest[0]] : []});
    }
    return rows.sort((a, b) => (b.at ?? -1) - (a.at ?? -1) || a.key.localeCompare(b.key));
}

/** Rows grouped by certainty, each group keeping newest first. */
export function knowsGroups(rows) {
    return CERTAINTY_ORDER.map(id => ({id, label: CERTAINTY[id].label, rows: rows.filter(r => r.certainty === id && !r.intent)}))
        .concat([{id: 'intent', label: 'What you mean to do', rows: rows.filter(r => r.intent)}]);
}

/** One plain line per row: the text form the list shows and the board's description shares (UR37). */
export function knowsLine(row) {
    return `${row.certaintyLabel}: ${row.text} (${row.provenance}${row.when ? `, ${row.when}` : ''}${row.uncertainty ? `; doubt: ${row.uncertainty}` : ''})`;
}

const short = text => text.length <= LABEL_MAX ? text : `${text.slice(0, LABEL_MAX - 1).replace(/\s+\S*$/, '')}…`;
const spread = (i, n) => n <= 1 ? 0 : -0.8 + 1.6 * i / (n - 1);

/** RPX12 board: what you hold on the left, your readings in the middle, open matters and intentions on the right. */
export function knowledgeBoardSpec(rows, {id = 'knows-board', title = 'What you know', size = 720} = {}) {
    const columns = [
        {x: -0.72, rows: rows.filter(r => r.certainty === 'known' && !r.intent)},
        {x: 0, rows: rows.filter(r => r.certainty === 'guessed' && !r.intent)},
        {x: 0.72, rows: rows.filter(r => r.certainty === 'open' || r.intent)},
    ];
    const nodes = [], ids = new Map(), notes = [];
    for (const column of columns) {
        const shown = column.rows.slice(0, BOARD_COLUMN);
        shown.forEach((row, i) => {
            const nodeId = `k${nodes.length}`; ids.set(row.key, nodeId);
            nodes.push({id: nodeId, label: short(row.intent ? `${INTENT[row.intent].verb}: ${row.text}` : row.text), state: row.intent ? INTENT[row.intent].figure : CERTAINTY[row.certainty].figure, at: [column.x, spread(i, shown.length)]});
        });
        if (column.rows.length > shown.length) notes.push({text: `${column.rows.length - shown.length} more ${column.x < 0 ? 'known' : column.x > 0 ? 'open' : 'guessed'} lines are in the list.`});
    }
    const edges = [];
    for (const row of rows) for (const source of row.evidence) if (ids.has(source) && ids.has(row.key) && source !== row.key) edges.push({from: ids.get(source), to: ids.get(row.key), kind: 'supports'});
    if (!nodes.length) notes.push({text: 'Nothing learned yet. Look around, ask, read or think, and it is kept here.'});
    const legend = [...CERTAINTY_ORDER.map(c => ({state: CERTAINTY[c].figure, label: CERTAINTY[c].key})),
        ...(rows.some(r => r.intent === 'active') ? [{state: 'current', label: 'you mean to act on it'}] : []),
        ...(rows.some(r => r.intent === 'postponed') ? [{state: 'empty', label: 'set aside for now'}] : []),
        ...(edges.length ? [{kind: 'supports', label: 'this led you to that'}] : [])];
    return {id, size, title, summary: 'Only what you hold. Left: known. Middle: your readings. Right: open questions and plans.', nodes, edges, notes, legend};
}

/** Everything the home needs from one state read. */
export function knowledgeView(observer, options = {}) {
    const rows = knowsRows(observer, options);
    return {rows, groups: knowsGroups(rows), board: knowledgeBoardSpec(rows, options)};
}
