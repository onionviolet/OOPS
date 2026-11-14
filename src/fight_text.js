// Fight text (proposal, CBD289, CBD299 and CBD310 in
// docs/COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md). Terse factual lines
// from settled contest log rows, and an itemised result. One pattern per kind of
// event, so a move nobody wrote a sentence for still reads. Names and labels are
// the caller's (world data); an id with no label is never shown. Pure and
// headless: no UI, no save data, no engine import.
import {check, object} from './basics.js';

export const FIGHT_TEXT_SCHEMA = 'fight.text@1';

// Outcome words a player can read. An outcome with no word here is left out.
const OUTCOME_WORDS = Object.freeze({
    stood: 'standing', killed: 'killed', knocked_out: 'out cold', yielded: 'yielded', withdrew: 'withdrew',
    routed: 'routed', captured: 'captured', escaped: 'got away', drove_off: 'driven off',
});
const POSTURE_WORDS = Object.freeze({kneeling: 'kneeling', 'down injured': 'hurt'});
const QUIET_MOVES = new Set(['wait']);

// Every contest log row has one of these types (CBD63). `fightRowType` never returns anything else.
export const FIGHT_ROW_TYPES = Object.freeze(['hit', 'miss', 'blocked', 'failed', 'out of reach', 'done', 'yield', 'yield refused',
    'down', 'out', 'withdraw', 'interrupted', 'handoff', 'routed', 'wait']);
const FAILED = new Set(['failed', 'wasted', 'unavailable']);

/** The type of one settled row. A move that was paid for and came to nothing is `failed`, `miss`, `blocked` or `out of reach`. */
export function fightRowType(row) {
    if (QUIET_MOVES.has(row.move)) return 'wait';
    if (row.move === 'down') return 'down';
    if (row.move === 'none') return 'out';
    if (row.move === 'yield') return row.outcome === 'refused' ? 'yield refused' : 'yield';
    if (row.move === 'withdraw') return 'withdraw';
    if (row.move === 'interrupted') return 'interrupted';
    if (row.move === 'handoff') return 'handoff';
    if (row.move === 'break') return 'routed';
    if (row.outcome === undefined) return 'done';
    if (row.outcome === 'hit' || row.outcome === 'miss' || row.outcome === 'blocked') return row.outcome;
    if (row.outcome === 'out of position') return 'out of reach';
    return 'failed';
}

const label = (table, id) => (typeof id === 'string' && typeof table?.[id] === 'string' && table[id].length ? table[id] : null);
const lower = s => s[0].toLowerCase() + s.slice(1);

function reader(labels) {
    check(object(labels) && typeof labels.seat === 'string', 'Fight text needs labels with a seat.');
    const life = labels.life ?? 'vitality';
    return {
        life,
        subject: id => { const n = id === labels.seat ? 'You' : label(labels.names, id) ?? 'Someone'; return n[0].toUpperCase() + n.slice(1); },
        object: id => (id === labels.seat ? 'you' : label(labels.names, id) ?? 'someone'),
        move: id => label(labels.moves, id),
        done: id => label(labels.done, id),
        part: id => label(labels.parts, id) ?? (labels.parts ? null : id),
        means: id => label(labels.means, id),
    };
}

// "vitality -4, hands -14" -> ['hands']: the parts a blow reached besides life.
function partsHit(row, life) {
    if (typeof row.landed !== 'string' || !row.landed) return [];
    return row.landed.split(',').map(s => s.trim().split(' ')[0]).filter(p => p && p !== life);
}

/** Whether a row is a turning point: someone leaves the fight, or a blow reaches a part besides life.
 * A world may add move ids through `labels.turning`. Plain hurt is left to the result's own line. */
export function isTurningRow(row, labels) {
    const r = reader(labels);
    if (['down', 'yield', 'withdraw', 'interrupted', 'break', 'handoff', 'none'].includes(row.move)) return true;
    if (labels.turning?.includes(row.move)) return true;
    return row.outcome === 'hit' && partsHit(row, r.life).length > 0;
}

// What a move cost when nothing came of it: "4 primeval essence spent". Left off a hit, where the result is the news.
function spentTail(row, r) {
    const parts = Object.entries(row.spent ?? {}).filter(([, n]) => n > 0).map(([q, n]) => [r.means(q), n]).filter(([name]) => name)
        .map(([name, n]) => `${n} ${lower(name)}`);
    return parts.length ? ` ${parts.join(', ')} spent.` : '';
}

/** One terse line for one settled row, or null when the row has nothing a reader needs. */
export function fightLine(row, labels) {
    check(object(row) && typeof row.actor === 'string' && typeof row.move === 'string', 'A fight row needs an actor and a move.');
    const r = reader(labels), who = r.subject(row.actor), mine = row.actor === labels.seat, type = fightRowType(row);
    if (type === 'wait') return null;
    if (type === 'down') {
        const word = OUTCOME_WORDS[row.outcome];
        return word ? `${who} down, ${word}.` : `${who} down.`;
    }
    if (type === 'out') return OUTCOME_WORDS[row.outcome] ? `${who}: ${OUTCOME_WORDS[row.outcome]}.` : null;
    if (type === 'yield') {
        const posture = POSTURE_WORDS[row.posture];
        return `${who}: ${mine ? 'yield' : 'yields'}${posture ? `, ${posture}` : ''}.`;
    }
    if (type === 'yield refused') return `${who}: yield refused.`;
    if (type === 'withdraw') return `${who}: back${mine ? '' : 's'} off, ${/away|left|escaped/.test(row.outcome ?? '') ? 'clear' : 'caught'}.`;
    if (type === 'interrupted') return `${who}: interrupted${row.by ? ` by ${r.object(row.by)}` : ''}.`;
    if (type === 'routed') return `${who}: routed.`;
    if (type === 'handoff') return row.outcome === 'unavailable' ? `${who}: nobody to hand over to.`
        : `${who}: hand${mine ? '' : 's'} over${row.target ? ` to ${r.object(row.target)}` : ''}.`;
    const move = r.move(row.move);
    if (!move) return null; // no label, no line: an engine id is never player text
    // A move with no outcome is something done (a step, a thing dropped): `labels.done` holds its done form.
    if (type === 'done') return `${who}: ${r.done(row.move) ?? lower(move)}.`;
    const whom = row.target && row.target !== row.actor ? ` ${r.object(row.target)}` : '';
    if (type === 'hit') {
        const where = [row.location, ...partsHit(row, r.life)].map(p => p && r.part(p)).filter(Boolean);
        const tail = [...new Set(where), ...(row.glare ? ['through the glare'] : [])];
        return `${who}: ${lower(move)} hits${whom}${tail.length ? `, ${tail.join(', ')}` : ''}.`;
    }
    const spent = spentTail(row, r);
    if (type === 'miss') return `${who}: ${lower(move)} misses${whom}.${spent}`;
    if (type === 'blocked') return `${who}: ${lower(move)} blocked${row.target && row.target !== row.actor ? ` by ${r.object(row.target)}` : ''}.${spent}`;
    if (type === 'out of reach') return `${who}: ${lower(move)}, out of reach.${spent}`;
    return `${who}: ${lower(move)} fails.${spent}`;
}

/** Every row, typed, in order and unfolded: the full account (CBD64). `text` is null where no line is shown. */
export function fightAccount(rows, labels) {
    check(Array.isArray(rows), 'A fight account needs a list of rows.');
    return rows.map(row => ({at: row.at ?? null, actor: row.actor, type: fightRowType(row), text: fightLine(row, labels),
        spent: Object.fromEntries(Object.entries(row.spent ?? {}).filter(([, n]) => n > 0)), turn: isTurningRow(row, labels)}));
}

/** Lines for a run of rows. Plain lines that repeat between two turning points fold into one with a count
 * (CBD88), kept at the place of their first use. A turning point always has its own line. */
export function fightLines(rows, labels) {
    check(Array.isArray(rows), 'Fight lines need a list of rows.');
    const out = [];
    let run = new Map();
    for (const row of rows) {
        const text = fightLine(row, labels);
        if (!text) continue;
        if (isTurningRow(row, labels)) { out.push({text, at: row.at ?? null, turn: true, count: 1}); run = new Map(); continue; }
        const seen = run.get(text);
        if (seen) { seen.count += 1; continue; }
        const line = {text, at: row.at ?? null, turn: false, count: 1};
        run.set(text, line);
        out.push(line);
    }
    return out;
}

/** The line as shown: a folded line carries its count. */
export const shownLine = line => (line.count > 1 ? `${line.text.slice(0, -1)} (${line.count} times).` : line.text);
// A folded line that carries a cost shows the cost of one use; the result's Spent line holds the total.

/** An itemised result (CBD78): a head, rows of [label, text], and the turning points.
 * `means` is [{id, before, after}], `left` a list of thing labels, `asked` the decisions asked.
 * `rows` may be empty when the engine keeps no typed rows; pass its own `turning` lines then. */
export function fightResult({place, seconds, outcomes, rows, means = [], left = [], asked = 0, turning: given = null}, labels) {
    check(object(outcomes) && Array.isArray(rows), 'A fight result needs outcomes and rows.');
    const r = reader(labels);
    const mine = OUTCOME_WORDS[outcomes[labels.seat]];
    const head = [place, Number.isFinite(seconds) ? `${seconds.toFixed(1)} seconds` : null, mine ? `You: ${mine}` : null].filter(Boolean).join('. ') + '.';
    const byWord = new Map();
    for (const [id, outcome] of Object.entries(outcomes)) {
        const word = OUTCOME_WORDS[outcome], name = label(labels.names, id);
        if (id === labels.seat || !word || !name) continue;
        byWord.set(word, [...(byWord.get(word) ?? []), name]);
    }
    const items = [];
    if (byWord.size) items.push(['Them', [...byWord].map(([word, names]) => { const list = names.join(', '); return `${list[0].toUpperCase()}${list.slice(1)}: ${word}.`; }).join(' ')]);
    const spent = [], kept = [];
    for (const m of means) {
        const name = r.means(m.id);
        if (!name) continue;
        if (m.id === r.life) kept.push(m.after >= m.before ? 'Unhurt.' : `${name} ${m.after} of ${m.before}.`);
        else if (m.after < m.before) spent.push(`${name} ${m.before - m.after} of ${m.before}.`);
    }
    if (spent.length) items.push(['Spent', spent.join(' ')]);
    if (kept.length) items.push(['Hurt', kept.join(' ')]);
    if (left.length) items.push(['Left here', left.map(t => `${t}.`).join(' ')]);
    items.push(['Asked', asked === 0 ? 'Nothing.' : `${asked} decision${asked === 1 ? '' : 's'}.`]);
    // An engine whose log is already sentences (the tempo fight) hands its own turning lines in `turning`.
    const turning = given ? [...new Set(given)] : [...new Set(rows.filter(row => isTurningRow(row, labels)).map(row => fightLine(row, labels)).filter(Boolean))];
    return {schema: FIGHT_TEXT_SCHEMA, head, items, turning};
}
