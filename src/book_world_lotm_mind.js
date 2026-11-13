// FRC51 first caller (proposal): Klein's dread and fascination from what he witnesses, on the mind meters (mind_meters.js) over the
// mood rows (mood_thoughts_domain.js). No new save key and no counter: marks are thought rows; a once-per-act marker rides the
// expansion save's world facts (as place-act reports do), so a replay, a reload or a spent mark never writes the mark again.
// What a route that runs out feeds (MND7, MND8, AD55, AD56): an ordinary man is left shaken (a long, sour thought, mood only); a
// Beyonder's held source gives the fear a mechanism, so one inbox step lands on the one power carrier (RCL5, book_world_lotm_harm.js),
// below the pre-sign line. Fascination is the books' temptation through heightened senses (LOTM_CAUSES.temptation, MND11), read the same way.
// Exits (MND9): contentment spends one dread mark; a night's sleep loosens one fascination mark; a mark also runs out on its own.
// The window closes in play only, never during skipped time (BHR18, as the lost-stage grace).
import {addMoodThought, editMoodThoughts, moodRows} from './mood_thoughts_domain.js';
import {markThought, mindMeter, spendMark, closeRoute, MIND_DIALS} from './mind_meters.js';
import {LOTM_INBOX} from './book_world_lotm_harm.js';
import {BE_SEER_SOURCE} from './book_world_lotm_be_seer.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
// The lead of this life (a mark belongs to the person who saw it, not to whoever plays next).
export const LOTM_MIND_HOLDER = 'player.book.lotm.tingen';
// Producers by place-act id (the private cast pack's ids; lines are short authored paraphrases, PRS, not book text).
const dread = line => ({kind: 'dread', line}), fasc = line => ({kind: 'fascination', line}), calm = line => ({kind: 'contentment', line});
const SLEEP = {kind: 'sleep'};
export const LOTM_MIND_ACTS = Object.freeze({
    'book.lotm.opening.mirror': [dread('the wound you saw in the mirror')],
    'book.lotm.household_clean': [dread('the blood you wiped from the room')],
    'book.lotm.excursion.fog': [dread('the whispers and the pain before the fog'), fasc('the gray fog and the crimson stars')],
    'book.lotm.kj3g.losing': [dread('Dunn\'s account of how Beyonders lose control')],
    'book.lotm.kj3g.origins': [fasc('how potions and Sequences came to be')],
    'book.lotm.kj3j.sleepless': [fasc('the Sleepless path Rozanne described')],
    'book.lotm.kj3m.offer': [fasc('the three paths Dunn laid out')],
    // Family normalcy steadies him (agent proposal): the first talk with Melissa, before the ritual, is the opening's one calm.
    'book.lotm.opening.watch': [calm('talking with Melissa about the watch')],
    'book.lotm.kj3k.errand': [calm('the small celebration you planned with Melissa')],
    'book.lotm.kj3l.mass': [calm('the quiet of the cathedral at Mass')],
    'book.lotm.kj3a.sleep': [SLEEP], 'book.lotm.kj3c.sleep': [SLEEP], 'book.lotm.kj3p.sleep': [SLEEP], 'book.lotm.kj3v.sleep': [SLEEP], 'book.lotm.kj3ae.sleep': [SLEEP]});
const MARKER = 'mind.mark.';
const beyonder = s => { const src = s?.actors?.player?.sources || {}; return !!(src[BE_SEER_SOURCE] || src[I.source]); };
// Before the save: which producer acts finished since the last save. Writes their markers into the plan state (so they ride the save)
// and returns what to apply after it lands. `data` is the pack's householdActs.
export function collectMindMarks(state, data) {
    const facts = state?.worlds?.[I.world]?.facts, know = state?.simulation?.knowledge?.player;
    if(!facts || !know) return [];
    const due = [];
    for(const row of data?.acts || []) {
        const rows = LOTM_MIND_ACTS[row.id], k = rows && know[row.knowledgeKey];
        if(!k || facts[MARKER + row.id] === k.cause) continue;
        facts[MARKER + row.id] = k.cause;
        for(const r of rows) due.push({...r, cause: row.id});
    }
    return due;
}
// After the save landed. Returns Reports lines (contentment spent, sleep easing); a plain mark adds no line of its own (the act's report
// already says what was seen) and the forewarning comes from lotmMindNote on the next tick.
export function applyMindMarks(due, now) {
    const lines = [];
    for(const d of due) {
        if(d.kind === 'sleep') { lines.push(...easeOne('fascination', now, spent => `Sleep loosened the pull of ${spent.line}.`)); continue; }
        if(d.kind === 'contentment' || d.kind === 'dread') {
            // Contentment and a dread mark cancel one for one, whichever came first; the one that arrives second is spent with it.
            const other = d.kind === 'contentment' ? 'dread' : 'contentment';
            const spent = easeOne(other, now, s => d.kind === 'contentment' ? `${cap(d.line)} eased ${s.line}.` : `${cap(s.line)} took the edge off ${d.line}.`);
            if(spent.length) { lines.push(...spent); continue; }
        }
        addMoodThought(markThought({holder: LOTM_MIND_HOLDER, kind: d.kind, cause: d.cause, line: d.line}), now);
    }
    return lines;
}
const cap = t => t[0].toUpperCase() + t.slice(1);
function easeOne(kind, now, say) {
    let spent = null;
    editMoodThoughts(slice => { const r = spendMark(slice, LOTM_MIND_HOLDER, kind, now); spent = r.spent; return r.slice; }, now);
    return spent ? [say(spent)] : [];
}
// The view: one line per kind past its forewarning, in the world's words (knowledge words, never the count; UR70-UR75).
const hours = m => m >= 120 ? `${Math.ceil(m / 60)} hours` : m >= 60 ? 'an hour' : `${m} minutes`;
const list = ls => ls.length < 2 ? ls.join('') : `${ls.slice(0, -1).join(', ')} and ${ls.at(-1)}`;
const WORDS = {
    dread: {warned: ls => `Fear has not let go of you: ${list(ls)}. One more shock and it will settle in.`,
        route: (ls, m, b) => `The fear is settling in (${list(ls)}). Unless something good eases it within ${hours(m.left)}, it ${b ? 'will press on your control' : 'will stay with you for days'}.`,
        land: b => b ? 'The fear settled into your spirituality; your control feels thinner.' : 'The fear settled in. You are shaken, and it will take days to wear off.'},
    fascination: {warned: ls => `What you have glimpsed keeps pulling at you: ${list(ls)}.`,
        route: (ls, m, b) => `You cannot stop thinking about ${list(ls)}. A night's sleep loosens it; left for ${hours(m.left)} it ${b ? 'will tug at your control' : 'will leave you restless for days'}.`,
        land: b => b ? 'The pull of what you glimpsed settled into your spirituality; your control feels thinner.' : 'What you glimpsed will not leave you; you are restless, and it will take days to wear off.'}};
const AFTER = {dread: {source: 'mind.shaken.dread', magnitude: -6, minutes: 5 * 1440, line: 'the fear that settled in'},
    fascination: {source: 'mind.restless.fascination', magnitude: -3, minutes: 5 * 1440, line: 'the pull that would not let go'}};
export function lotmMindView(s) {
    if(!Number.isSafeInteger(s?.clock)) return {lines: [], stages: {}};
    const rows = moodRows(LOTM_MIND_HOLDER, s.clock), b = beyonder(s), lines = [], stages = {};
    for(const kind of ['dread', 'fascination']) {
        const m = mindMeter(rows, kind, s.clock);stages[kind] = m.stage;
        if(m.stage === 'warned') lines.push(WORDS[kind].warned(m.lines));
        if(m.stage === 'route') lines.push(WORDS[kind].route(m.lines, m, b) + (m.passes ? ' If nothing more comes, the oldest of it fades before then.' : ''));
    }
    return {lines, stages};
}
// FBK: one Reports line when a kind reaches its forewarning or its route; the first read after load only records (no repeat on reload).
export function lotmMindNote(before, after) {
    if(!before) return [];
    return ['dread', 'fascination'].filter(k => after[k] !== before[k] && after[k] !== 'clear').map(k => after[k] === 'route'
        ? (k === 'dread' ? 'The fear is settling in. Something good, soon, would ease it.' : 'What you glimpsed is taking hold. A night\'s sleep would loosen it.')
        : (k === 'dread' ? 'Fear has not let go of you.' : 'What you glimpsed keeps pulling at you.'));
}
// The routes whose last window ran out, in play only. Returns {inbox, lines}: `inbox` is the loss step the host saves first (Beyonder only);
// `commit` then takes the marks off (and leaves the ordinary man's long thought), so a failed save changes nothing.
export function lotmMindDue(s, {skipping = false} = {}) {
    if(skipping || !Number.isSafeInteger(s?.clock) || s.actors?.player?.worldId !== I.world) return null;
    const rows = moodRows(LOTM_MIND_HOLDER, s.clock), due = ['dread', 'fascination'].filter(k => mindMeter(rows, k, s.clock).due);
    if(!due.length) return null;
    const b = beyonder(s), now = s.clock;
    return {inbox: b ? due.map(k => ({type: 'resource', actor: 'player', key: LOTM_INBOX.loss, amount: 1, kind: k})) : [],
        lines: due.map(k => WORDS[k].land(b)),
        commit: () => { for(const k of due) {
            editMoodThoughts(slice => closeRoute(slice, LOTM_MIND_HOLDER, k, now, MIND_DIALS).slice, now);
            if(!b) addMoodThought({holder: LOTM_MIND_HOLDER, subject: LOTM_MIND_HOLDER, ...AFTER[k], key: `${AFTER[k].source}.${now}`}, now);
        } }};
}
