// Lane W9-A: the hired-guard contract, an ordinary man's sellsword life beside the clerk and the Beyonder (LANE_A_SOCIETY_POSITIONS: one world, many lives).
// AUTHORED JOB, not from the book: the sources name no warehouse watch, foreman, wage or term; every figure below is a dial with its reason (WPR5/AD49).
// Shape: a short 'hired' position row derived from one knowledge note (the signing time, as the civil contract is) plus the saved positions@1 exit
// (resign). The term end is derived from the clock, so no saved exit kind is needed. The weekly night shift is a recurring duty held by the row.
// Saved here (slice `lotm_guard@1`, domain 'lotm_guard'): only what the row cannot recover: which weeks' shifts were stood, which were docked,
// weeks paid out, a bonus owed, the trouble now waiting. Trouble opens a tempo fight (reusing the street robber's foe and, when the player holds a
// loaded revolver, its real rounds); its result is read from the fight log on the next read, once per fight (as the collector does).
import {LOTM_IDS as I, LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {LOTM_PROFILES} from './book_world_lotm_lives.js';
import {LOTM_GUARD_DUTY_ID} from './book_world_lotm_duties.js';
import {lotmFightQuote, lotmFightSpec} from './book_world_lotm_fight.js';
import {lotmLight} from './book_world_lotm_events.js';
import {registerTempoOpener} from './tempo_starters.js';
import {registerDomain} from './domain_registry.js';
import {withExit, positionsOf} from './positions.js';
import {fnv1a, mix32} from './hash_rng.js';

const WEEK = 7 * 24 * 60;
const SOURCE = 'book_world_lotm_guard.js';
export const GUARD_POSITION_ID = 'lotm.position.guard.night_watch';
export const GUARD_NOTE = 'book.lotm.guard_contract';
export const GUARD_FAMILY = 'lotm_guard@1';
export const GUARD_TITLE = 'Thieves at the warehouse door';
export const GUARD_DIALS = Object.freeze({
    weeks: {value: 6, why: 'A short hire: a merchant covering a busy stretch of river trade, not a career. Six weeks is long enough to feel the shifts and short enough to see the end.'},
    weeklyPence: {value: 25 * P.soli, why: '1 pound 5 soli (300 pence) a week: well above the 5-soli rent so the job is worth taking, well under the clerk\'s 3 pounds because it asks for no papers, no secrecy and no training, and it comes with the risk of a scuffle.'},
    shiftsPerWeek: {value: 1, why: 'One night shift a week, so the week stays open to the rest of the life; the foreman covers the other nights with his own men.'},
    troubleChance: {value: .25, why: 'About one watch in four brings someone to the door: a riverside warehouse is a target but most nights are quiet.'},
    fogBonus: {value: .15, why: 'River fog covers a thief\'s approach, so a foggy night raises the chance by fifteen points (the world clock\'s own fog, as the street fights read it).'},
    wonBonusPence: {value: 5 * P.soli, why: 'Five soli (60 pence) on top of the week when you drive the thieves off: a foreman\'s thanks, about a fifth of the weekly wage.'},
    lostDocks: {value: 'the week', why: 'A guard who is beaten or who hands the goods over has lost the foreman\'s cargo on his watch, so that week\'s pay is docked; earlier weeks stay paid.'},
    slippedDocks: {value: 'the week', why: 'If you leave the thieves at the door until the week closes, the goods go the same way, and the week is docked. Standing off is a choice with a cost, not a free skip.'}
});
export const GUARD_RESIGN_COST = 'Resigning ends the hire at once and forfeits the week in progress, its shift and its pay; weeks already closed stay yours to collect. The foreman will not take you back; rehire is not modelled.';
const RESIGN_REASON = 'Walked out on the warehouse watch without notice; the week in progress was forfeited.';
const TERM_END_REASON = 'The six-week hire ran its term.';
const nat = n => Number.isInteger(n) && n >= 0;
const cycleOf = minute => Math.floor(minute / WEEK);
const poundsWords = p => { const pounds = Math.floor(p / P.pound), soli = (p % P.pound) / P.soli; return [pounds ? `${pounds} pound${pounds === 1 ? '' : 's'}` : '', soli ? `${soli} soli` : ''].filter(Boolean).join(' ') || '0'; };
export const guardPayWords = poundsWords;
export const GUARD_OFFER = `A Tingen riverside warehouse needs a night watchman: ${GUARD_DIALS.weeks.value} weeks, ${poundsWords(GUARD_DIALS.weeklyPence.value)} a week, one night shift a week, paid when each week closes. An ordinary man's job: no potion, no church, no papers asked. (An invented job, not in the book.)`;

// ---- the row (derived)
export function guardRow(contractAt, now) {
    const endsAt = contractAt + GUARD_DIALS.weeks.value * WEEK;
    const row = withExit({id: GUARD_POSITION_ID, institution: 'a Tingen riverside warehouse', role: 'Hired guard', rank: 'night watchman',
        term: {type: 'hired', startedAt: contractAt, weeks: GUARD_DIALS.weeks.value, endsAt}, pay: {amount: GUARD_DIALS.weeklyPence.value, unit: 'pence', period: 'week'},
        duties: [LOTM_GUARD_DUTY_ID], exit: {kinds: ['resign'], cost: GUARD_RESIGN_COST}, source: SOURCE});
    return !row.ended && Number.isFinite(now) && now >= endsAt ? {...row, ended: {kind: 'term_end', at: endsAt, reason: TERM_END_REASON}} : row;
}
const noteAt = state => { const n = state?.simulation?.knowledge?.player?.[GUARD_NOTE]; return n ? (Number.isFinite(n.at) ? n.at : 0) : null; };
export function guardRows(state) {
    const at = noteAt(state);
    return at === null ? [] : [guardRow(at, state.clock)];
}
export const guardSigned = state => noteAt(state) !== null;

// ---- the saved slice
const fresh = () => ({family: GUARD_FAMILY, startedAt: null, stood: [], docked: [], paid: 0, bonus: 0, trouble: null, handled: [], lines: []});
const CAP = 80, LINES_CAP = 6;
let slice = fresh();
const cycles = a => [...new Set((Array.isArray(a) ? a : []).filter(nat))].sort((x, y) => x - y).slice(-CAP);
export function migrateGuard(s) {
    if(!s || s.family !== GUARD_FAMILY) return fresh();
    const t = s.trouble, lines = (Array.isArray(s.lines) ? s.lines : []).filter(l => l && typeof l.id === 'string' && typeof l.text === 'string' && nat(l.at)).map(l => ({id: l.id, at: l.at, text: l.text})).slice(-LINES_CAP);
    return {family: GUARD_FAMILY, startedAt: nat(s.startedAt) ? s.startedAt : null, stood: cycles(s.stood), docked: cycles(s.docked), paid: nat(s.paid) ? s.paid : 0, bonus: nat(s.bonus) ? s.bonus : 0,
        trouble: t && nat(t.cycle) && nat(t.at) ? {cycle: t.cycle, at: t.at} : null, handled: (Array.isArray(s.handled) ? s.handled : []).filter(x => typeof x === 'string').slice(-40), lines};
}
const empty = s => s.startedAt === null && !s.lines.length;
registerDomain({id: 'lotm_guard', deps: [], initialState: fresh,
    save: () => empty(slice) ? undefined : structuredClone(slice),
    validate: s => { if(s != null && s.family !== GUARD_FAMILY) throw Error('Hired guard: wrong family.'); },
    migrate: migrateGuard, load: s => { slice = migrateGuard(s); }, projection: () => structuredClone(slice)});
export const guardSnapshot = () => structuredClone(slice);
export const guardRestore = s => { slice = migrateGuard(s); };

// ---- signing (host writes the note; this starts the slice)
export function guardSignQuote(state) {
    if(state?.actors?.player?.worldId !== I.world || !state.lotm) return {eligible: false, reason: ''};
    const profile = Object.values(LOTM_PROFILES).find(p => p.id === state.lotm.entryProfile);
    if(!profile || profile.key === 'be' || profile.key === 'beside') return {eligible: false, reason: ''};
    if(guardSigned(state)) return {eligible: false, reason: 'You have already taken this hire; it cannot be signed twice.'};
    const held = positionsOf(state).find(r => !r.ended);
    if(held) return {eligible: false, reason: `You already hold a post (${held.role.toLowerCase()}); the warehouse wants a man free for the night.`};
    // The contract note is written inside the day's situation (know() attributes it there); before reporting in that situation does not
    // exist yet and the save would refuse the note, so the hire waits until the day has begun.
    if(!state.simulation?.situations?.[I.situation]) return {eligible: false, reason: 'Report in at the workroom first; the warehouse hires in the evening, after your day has begun.'};
    return {eligible: true, reason: GUARD_OFFER};
}
export function guardBegin(startedAt) { slice = {...fresh(), startedAt}; }

// ---- the shift
export const guardDraw = (seed, cycle) => mix32(fnv1a(Number.isFinite(seed) ? seed >>> 0 : 1, `lotm.guard.trouble:${cycle}`)) / 4294967296;
const seedOf = state => state.simulation?.seed ?? state.streams?.root ?? 1;
export function guardChance(state) {
    let fog = false;
    try { fog = !!lotmLight(state).fog; } catch { /* no light profile yet */ }
    return Math.min(.95, GUARD_DIALS.troubleChance.value + (fog ? GUARD_DIALS.fogBonus.value : 0));
}
// Record this week's stood shift once and draw the trouble by the world seed and the week. Returns {cycle, trouble}.
export function guardStand(state) {
    const row = guardRows(state)[0];
    if(!row || row.ended) throw Error('You hold no watch to stand.');
    const cycle = cycleOf(state.clock);
    if(slice.stood.includes(cycle)) throw Error('You have stood this week\'s watch.');
    const trouble = guardDraw(seedOf(state), cycle) < guardChance(state);
    slice = {...slice, stood: cycles([...slice.stood, cycle]), ...(trouble ? {trouble: {cycle, at: state.clock}} : {})};
    return {cycle, trouble};
}

// ---- resolution (idempotent; also runs on reads, as the collector's does)
const note = (id, at, text) => { slice = {...slice, lines: [...slice.lines, {id, at, text}].slice(-LINES_CAP)}; };
export function guardSettle(state) {
    if(slice.startedAt === null) return slice;
    const row = guardRows(state)[0];
    if(!row || row.term.startedAt !== slice.startedAt) return slice;
    const log = state?.simulation?.log;
    for(const e of Array.isArray(log) ? log : []) {
        if(!slice.trouble || !e || typeof e.cause !== 'string' || typeof e.text !== 'string' || !e.text.startsWith(`${GUARD_TITLE}: `) || slice.handled.includes(e.cause)) continue;
        const result = e.text.slice(GUARD_TITLE.length + 2).replace(/\.$/, ''), at = Number.isFinite(e.at) ? e.at : state.clock;
        if(!['won', 'lost', 'yielded'].includes(result)) continue; // withdrawn leaves the thieves at the door
        const c = slice.trouble.cycle, handled = [...slice.handled, e.cause].slice(-40);
        if(result === 'won') {
            slice = {...slice, trouble: null, handled, bonus: slice.bonus + GUARD_DIALS.wonBonusPence.value};
            note(`guard:${e.cause}`, at, `You drove the thieves off the warehouse door. The foreman adds ${poundsWords(GUARD_DIALS.wonBonusPence.value)} to the week.`);
        } else {
            slice = {...slice, trouble: null, handled, docked: cycles([...slice.docked, c])};
            note(`guard:${e.cause}`, at, result === 'lost' ? 'The thieves beat you and cleared a crate. The foreman docks that week\'s pay.' : 'You gave the goods up. The foreman docks that week\'s pay.');
        }
    }
    const t = slice.trouble;
    if(t && (row.ended || cycleOf(state.clock) > t.cycle)) {
        slice = {...slice, trouble: null, ...(row.ended ? {} : {docked: cycles([...slice.docked, t.cycle])})};
        if(!row.ended) note(`guard:slip:${t.cycle}`, state.clock, 'The thieves were still at the door when the week closed and got clear with the goods. The foreman docks that week\'s pay.');
    }
    return slice;
}

// ---- pay: a week is paid when it closes. Resigning forfeits the week in progress; a finished term closes its last week.
export function guardOwed(state) {
    const row = guardRows(state)[0];
    if(!row || slice.startedAt !== row.term.startedAt) return {weeks: 0, bonus: 0, pence: 0, shifts: 0};
    const limit = row.ended ? (row.ended.kind === 'term_end' ? cycleOf(row.term.endsAt) : cycleOf(row.ended.at) - 1) : cycleOf(state.clock) - 1;
    const weeks = Math.max(0, slice.stood.filter(c => c <= limit && !slice.docked.includes(c)).length - slice.paid), bonus = slice.bonus;
    return {weeks, bonus, pence: weeks * GUARD_DIALS.weeklyPence.value + bonus, shifts: slice.stood.length};
}
export function guardCollect(state) {
    guardSettle(state);
    const owed = guardOwed(state);
    if(!owed.pence) throw Error('Nothing to collect yet: the foreman pays a week when it closes.');
    slice = {...slice, paid: slice.paid + owed.weeks, bonus: 0};
    return owed;
}

// ---- resign plan (pure: names the row and the record; the host saves it)
export function guardResignPlan(state) {
    const row = guardRows(state)[0];
    if(!row) throw new Error('You hold no post to resign.');
    if(row.ended) throw new Error(row.ended.kind === 'resign' ? 'You already resigned this post; there is nothing left to resign.' : 'This hire has already run its term; there is nothing left to resign.');
    return {row, exit: {kind: 'resign', at: state.clock, reason: RESIGN_REASON}};
}

// ---- what the panel reads
export function guardView(state) {
    try { guardSettle(state); } catch { /* a paused host retries on the next read */ }
    const quote = guardSignQuote(state), rows = guardRows(state), row = rows[0] || null;
    if(!row && !quote.eligible) return null;
    const owed = guardOwed(state);
    return {offer: quote.eligible ? {text: quote.reason, weeks: GUARD_DIALS.weeks.value, pence: GUARD_DIALS.weeklyPence.value} : null, signReason: quote.reason, rows,
        live: !!row && !row.ended, stood: slice.stood.includes(cycleOf(state.clock)), owed,
        trouble: slice.trouble && row && !row.ended ? 'Thieves are at the warehouse door. Face them from the fight panel before the week closes; if they get clear, that week is docked.' : '',
        lines: slice.lines.map(l => l.text)};
}

// ---- trouble as a tempo opener: the street robber's foe, at the warehouse
export function guardOpenerQuote(state) {
    try { guardSettle(state); } catch { /* retry on the next read */ }
    if(state?.actors?.player?.worldId !== I.world || !state.lotm || !slice.trouble) return {visible: false};
    if(state.simulation?.sessions?.player) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
    return {visible: true, eligible: true, reason: 'Win and the foreman adds a bonus. Lose or yield and that week is docked. Withdraw and they are still at the door until the week closes, when the week is docked.'};
}
export function guardOpenerSpec(state, context, helpers) {
    const base = lotmFightSpec(state, context, helpers), withGun = !!lotmFightQuote(state).eligible;
    return {...base, id: 'lotm-guard-thief', title: GUARD_TITLE, conditions: {...base.conditions, place: 'The warehouse door'},
        fighters: base.fighters.map(f => f.id === 'player'
            ? (withGun ? f : (({stock, ...rest}) => ({...rest, moves: ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield']}))(f))
            : {...f, name: 'A thief at the warehouse door'})};
}
registerTempoOpener({id: 'lotm.guard.trouble', label: 'Face the thieves at the warehouse door',
    text: 'On your watch: an ordinary thief after the crates, no Beyonder. If you hold a loaded revolver its rounds are real and stay spent.',
    quote: guardOpenerQuote, spec: guardOpenerSpec});
