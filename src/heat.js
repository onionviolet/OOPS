// OB2/OB3/OB4 (LARGER_FOUNDATIONS round 4): heat through people. Heat is per authority (a group, in one jurisdiction), rises only from acts
// someone KNOWS about, and falls as the act is made good or ages out. World-neutral: a palette keyed by authority id carries each world's
// words and dials; an authority with no row holds no heat. Two sources:
//  - derived (no storage): a missed standing-order duty whose creditor is a palette authority. The creditor holds the record, so it is known by
//    construction. It does not decay with the clock: it falls when the debt is paid (a clock would let skipping rent cool off).
//  - stored (slice `heat@1`): known acts (a witnessed crime) with a weight and an age, linear decay to nothing over `decayDays`.
// An act nobody knows about is refused by recordAct: no heat until an audit or informer finds it (that caller then records it as known).
// Escalation steps 3 and 4 (collector at `collector.atMisses`, fine at `fine.atMisses`) are state, not draws. The fine is a record that waits
// as an owed row; nothing is ever taken while the player is away (OB4). Episodes: `live`/`past` count how many times an authority has cooled
// to zero, so a new bout of trouble is a new cause with new event ids.
import {registerDomain, domainRegistry} from './domain_registry.js';
import './duties_domain.js';
import {obligation} from './obligations_ledger.js';
import {authorityOver} from './authority.js';

export const HEAT_FAMILY = 'heat@1';
const DAY = 1440, PENCE = {one: 'penny', many: 'pence'};
const nat = n => Number.isInteger(n) && n >= 0;

// Palette. Default, dial, reason on every number.
//  missHeat 1: one heat per known missed week; the ladder below is counted in weeks of arrears.
//  levels: 1 = known (first miss, the notice), 2 = on the list (6 weeks: beyond collector and fine, a name passed to the agent for good).
//  collector 3 misses / fine 4 misses: one step past the notice (1) and the landlady's visit (2) in LOTM_RENT; a lenient landlady, a strict state differ here.
//  fine 120 pence: 10 soli, two weeks' rent: felt, payable from one civil week (720p), never ruinous. Authored proposal, no source figure.
//  decayDays 28: a quarter-month for the town's police to stop watching for a minor known act; a world raises it for a stern state.
export const AUTHORITIES = Object.freeze({
    landlady: Object.freeze({jurisdiction: 'tingen', label: 'the landlady', missHeat: 1,
        levels: Object.freeze([
            Object.freeze({at: 1, word: 'known to the landlady', line: 'The landlady has your name down as behind on the rent.'}),
            Object.freeze({at: 6, word: 'on the landlady\'s list of bad debts', line: 'The landlady has put your name on the list she passes to her collector.'})]),
        collector: Object.freeze({atMisses: 3, line: n => `A collector in the landlady's pay waits at your door: ${n} weeks of rent are behind. Paying the arrears settles it; one more missed week carries a fine, which will wait for you as a debt and never be taken while you are out.`}),
        fine: Object.freeze({atMisses: 4, amount: 120, unit: PENCE, why: 'A fine for arrears of rent, written by the landlady\'s collector.',
            line: amount => `The collector has written up a fine of ${amount} pence against you for the arrears. It waits in Ledger → Owed; settle it when you can. Nothing is taken from you while you are away.`})}),
    tingen_police: Object.freeze({jurisdiction: 'tingen', label: 'the Tingen police', decayDays: 28,
        levels: Object.freeze([
            Object.freeze({at: 1, word: 'the Tingen police have your name', line: 'The Tingen police have your name.'}),
            Object.freeze({at: 4, word: 'wanted by the Tingen police', line: 'The Tingen police are asking after you by name.'})]),
        // OB10: the fine the magistrate writes when the constables take you (book_world_lotm_constables.js). 90 pence: a week and a half of rent, felt, below the
        // collector's 180 and never ruinous. Written only through raiseFine with a tag (one fine per arrest), never from arrears, so police add no surprise fines.
        fine: Object.freeze({atMisses: Infinity, amount: 90, unit: PENCE, why: 'A magistrate\'s fine for resisting the constables, written after a night in the cells.',
            line: amount => `The magistrate has written a fine of ${amount} pence against you. It waits in Ledger → Owed; settle it when you can. Nothing is taken from you while you are away.`})}),
});

export const freshHeat = () => ({family: HEAT_FAMILY, acts: [], live: {}, past: {}, marks: {}, fines: {}});
const isEmpty = s => !s.acts.length && !Object.keys(s.live).length && !Object.keys(s.past).length && !Object.keys(s.marks).length && !Object.keys(s.fines).length;
// Absent, foreign or unreadable loads fresh: heat is play history, not a promise (SAVES note in the lane return).
export function migrateHeat(slice) {
    if(!slice || slice.family !== HEAT_FAMILY) return freshHeat();
    const obj = o => o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    const known = id => Object.hasOwn(AUTHORITIES, id);
    const acts = (Array.isArray(slice.acts) ? slice.acts : []).filter(a => a && known(a.authority) && Number.isFinite(a.weight) && a.weight > 0 && nat(a.age) && typeof a.id === 'string')
        .map(a => ({id: a.id, authority: a.authority, weight: a.weight, age: a.age, at: Number.isFinite(a.at) ? a.at : 0, ...(typeof a.witness === 'string' && a.witness ? {witness: a.witness.slice(0, 60)} : {})}));
    const live = Object.fromEntries(Object.entries(obj(slice.live)).filter(([k, v]) => known(k) && v === true));
    const past = Object.fromEntries(Object.entries(obj(slice.past)).filter(([k, v]) => known(k) && nat(v)));
    const marks = Object.fromEntries(Object.entries(obj(slice.marks)).filter(([k, v]) => k && v && known(v.authority) && Number.isFinite(v.at)).map(([k, v]) => [k, {authority: v.authority, at: v.at}]));
    const fines = Object.fromEntries(Object.entries(obj(slice.fines)).filter(([k, f]) => k && f && known(f.authority) && nat(f.epoch) && nat(f.amount) && f.amount > 0 && Number.isFinite(f.at))
        .map(([k, f]) => [k, {authority: f.authority, duty: String(f.duty), epoch: f.epoch, amount: f.amount, at: f.at, settled: f.settled === true}]));
    return {family: HEAT_FAMILY, acts, live, past, marks, fines};
}
export function validateHeat(slice) {
    if(slice?.family !== HEAT_FAMILY) throw Error('Heat: wrong family.');
    return slice;
}
let slice = freshHeat(), purse = null;
// The settlement seam, supplied by a world's composition (the same shape as a duty set's purse). No seam, no fines: a fine the player cannot pay
// would be an unpreventable loss (OB4), so the collector's visit stands alone until a world wires it.
export function configureHeatPurse(p) { purse = p && typeof p.balance === 'function' && typeof p.pay === 'function' ? p : null; }

const decayMinutes = id => (AUTHORITIES[id].decayDays ?? 28) * DAY;
const actHeat = a => a.weight * Math.max(0, 1 - a.age / decayMinutes(a.authority));
const levelOf = (id, value) => AUTHORITIES[id].levels.filter(l => value >= l.at).length;
const epochOf = (s, id) => s.past[id] ?? 0;

// ---- Reading the duties projection (public, derived). Returns [{dutyId, authority, missed, since}] for palette authorities with arrears.
function arrears(duties) {
    const rows = new Map((duties?.rows ?? []).map(r => [r.id, r])), out = [];
    for(const item of duties?.items ?? []) {
        const row = rows.get(`duty:${item.id}`);
        if(!(item.missed > 0) || !row || row.debtor !== 'player' || !Object.hasOwn(AUTHORITIES, row.creditor)) continue;
        out.push({dutyId: item.id, authority: row.creditor, missed: item.missed, since: Number.isFinite(row.since) ? row.since : 0});
    }
    return out;
}
// Heat per authority from the two sources, with the known acts that made it.
export function heatTable(s, duties) {
    const by = {};
    const slot = id => by[id] ??= {authority: id, jurisdiction: AUTHORITIES[id].jurisdiction, label: AUTHORITIES[id].label, value: 0};
    for(const a of arrears(duties)) slot(a.authority).value += a.missed * (AUTHORITIES[a.authority].missHeat ?? 1);
    for(const a of s.acts) { const h = actHeat(a); if(h > 0) slot(a.authority).value += h; }
    return Object.values(by).filter(h => h.value > 0).map(h => {
        const level = levelOf(h.authority, h.value), l = AUTHORITIES[h.authority].levels[level - 1];
        return {...h, value: Math.round(h.value * 100) / 100, level, word: l?.word ?? '', line: l?.line ?? ''};
    }).sort((a, b) => a.authority < b.authority ? -1 : 1);
}

function view(s, duties) {
    const table = heatTable(s, duties), steps = [], rows = [];
    for(const a of arrears(duties)) {
        const def = AUTHORITIES[a.authority], ep = epochOf(s, a.authority);
        if(def.collector && a.missed >= def.collector.atMisses) steps.push({kind: 'collector', key: `collector:${a.dutyId}@${ep}`, authority: a.authority, dutyId: a.dutyId,
            at: s.marks[`collector:${a.dutyId}@${ep}`]?.at ?? a.since, text: def.collector.line(a.missed)});
    }
    for(const [key, f] of Object.entries(s.fines)) {
        const def = AUTHORITIES[f.authority];
        if(f.settled) continue;
        steps.push({kind: 'fine', key, authority: f.authority, dutyId: f.duty, at: f.at, text: def.fine.line(f.amount)});
        rows.push({...obligation({id: `fine:${key}`, kind: 'coin', debtor: 'player', creditor: f.authority, amount: f.amount, why: def.fine.why, source: 'heat', since: f.at, carries: false}), unit: def.fine.unit});
    }
    const words = table.filter(h => h.level > 0).map(h => ({key: `heat:${h.authority}:${h.level}@${epochOf(s, h.authority)}`, authority: h.authority, at: s.marks[`heat:${h.authority}@${epochOf(s, h.authority)}`]?.at ?? arrearsAt(duties, h.authority, s), text: h.line}));
    return {heat: table, steps, words, rows, canPay: !!purse, fines: Object.entries(s.fines).map(([key, f]) => ({key, ...f}))};
}
const arrearsAt = (duties, authority, s) => s.acts.filter(a => a.authority === authority).reduce((m, a) => Math.max(m, a.at), arrears(duties).filter(a => a.authority === authority).reduce((m, a) => Math.max(m, a.since), 0));

// Pure event records for consequences.js (the rules there map these; ids are built from causes, so the same cause is the same id).
export const heatWordEvents = h => (h?.words ?? []).map(w => ({id: w.key, at: w.at, text: w.text, cause: `heat:${w.authority}`, observerSafe: true}));
export const collectorEvents = h => (h?.steps ?? []).filter(s => s.kind === 'collector').map(s => ({id: s.key, at: s.at, text: s.text, cause: `collector:${s.dutyId}`, observerSafe: true}));
export const fineEvents = h => (h?.steps ?? []).filter(s => s.kind === 'fine').map(s => ({id: s.key.replace(/^/, 'fine:'), at: s.at, text: s.text, cause: `fine:${s.key}`, observerSafe: true}));

const readDuties = () => { try { return domainRegistry.project('duties') ?? null; } catch { return null; } };
function tick(minutes = 0) {
    const duties = readDuties();
    let s = slice;
    if(minutes > 0 && s.acts.length) s = {...s, acts: s.acts.map(a => ({...a, age: a.age + Math.floor(minutes)})).filter(a => actHeat(a) > 0)};
    const table = heatTable(s, duties), hot = new Set(table.map(h => h.authority));
    const live = {...s.live}, past = {...s.past}, marks = {...s.marks}, fines = {...s.fines};
    for(const id of hot) live[id] = true;
    // Cooled to zero: the episode ends. Its marks and settled fines go; an unsettled fine stays owed.
    for(const id of Object.keys(live)) if(!hot.has(id)) {
        delete live[id]; past[id] = (past[id] ?? 0) + 1;
        for(const [k, m] of Object.entries(marks)) if(m.authority === id) delete marks[k];
        for(const [k, f] of Object.entries(fines)) if(f.authority === id && f.settled) delete fines[k];
    }
    for(const a of arrears(duties)) {
        const def = AUTHORITIES[a.authority], ep = past[a.authority] ?? 0;
        marks[`heat:${a.authority}@${ep}`] ??= {authority: a.authority, at: a.since};
        if(def.collector && a.missed >= def.collector.atMisses) marks[`collector:${a.dutyId}@${ep}`] ??= {authority: a.authority, at: a.since};
        const key = `${a.dutyId}@${ep}`;
        if(def.fine && purse && a.missed >= def.fine.atMisses && !fines[key]) fines[key] = {authority: a.authority, duty: a.dutyId, epoch: ep, amount: def.fine.amount, at: a.since, settled: false};
    }
    const next = {...s, live, past, marks, fines};
    slice = JSON.stringify(next) === JSON.stringify(slice) ? slice : next;
}
// A known act: someone saw it or holds the record. An unknown act raises nothing (the caller records it when an audit or informer finds it).
// `witness` names who knows (the landlady who saw the assault); it is kept with the act, it adds no heat of its own.
// OB8: when the caller names where it happened (`world`, `place`, optional `state`), the act counts only if the authority's claim reaches that place.
function recordAct({authority, weight = 1, id, at = 0, known = false, witness, world, place, state} = {}) {
    if(known !== true || !Object.hasOwn(AUTHORITIES, authority) || !(weight > 0)) return false;
    if(place != null) { const over = authorityOver(state ?? {}, {world, place}); if(!over.reach || over.claimant !== AUTHORITIES[authority].jurisdiction) return false; }
    const actId = String(id ?? `${authority}@${at}`);
    if(slice.acts.some(a => a.id === actId)) return false;
    slice = {...slice, acts: [...slice.acts, {id: actId, authority, weight, age: 0, at: Number.isFinite(at) ? at : 0, ...(typeof witness === 'string' && witness ? {witness: witness.slice(0, 60)} : {})}]};
    return true;
}
// Settle one fine through the purse seam: debit first (the seam throws if it cannot), then mark paid. Returns pence paid.
function settleFine(key, owed) {
    const f = slice.fines[key];
    if(!f || f.settled) throw Error('That fine is not open.');
    if(!purse) throw Error('That cannot be paid from here yet.');
    if(owed != null && owed !== f.amount) throw Error('The fine has changed; read it again.');
    if(!(purse.balance() >= f.amount)) throw Error(`You hold too little to pay ${f.amount} pence.`);
    purse.pay(f.amount, key);
    slice = {...slice, fines: {...slice.fines, [key]: {...f, settled: true}}};
    return f.amount;
}
// OB10: an authority answers a beating by raising what you owe, never by taking it while you are away (the caller is a fight the player chose).
// Raises the open fine for this duty and episode by `add` pence, or writes it now at the palette amount plus `add` when it was not due yet.
// Returns the new amount, or null when there is no purse seam (no fine can exist, OB4) or that episode's fine is already settled.
// `tag` (optional) makes a separate fine for a separate cause (one per arrest) instead of one per duty and episode.
function raiseFine({authority, dutyId, add = 0, at = 0, tag} = {}) {
    const def = AUTHORITIES[authority];
    if(!def?.fine || !purse || !nat(add) || typeof dutyId !== 'string') return null;
    const ep = epochOf(slice, authority), key = tag ? `${dutyId}:${String(tag).slice(0, 40)}@${ep}` : `${dutyId}@${ep}`, f = slice.fines[key];
    if(f?.settled) return null;
    const amount = (f?.amount ?? def.fine.amount) + add;
    slice = {...slice, fines: {...slice.fines, [key]: f ? {...f, amount} : {authority, duty: dutyId, epoch: ep, amount, at: Number.isFinite(at) ? at : 0, settled: false}}};
    return amount;
}
// OB10: an arrest answers a warrant. Scales one authority's stored acts down so its act heat is at most `to` (derived arrears heat is untouched);
// `to` 0 removes them. Surviving weights stay above 0. Returns the authority's heat value after. Only a chosen fight or surrender calls it.
function easeActs({authority, to = 0} = {}) {
    if(!Object.hasOwn(AUTHORITIES, authority) || !Number.isFinite(to) || to < 0) return null;
    const mine = slice.acts.filter(a => a.authority === authority), sum = mine.reduce((n, a) => n + actHeat(a), 0);
    const derived = (heatTable(slice, readDuties()).find(h => h.authority === authority)?.value ?? 0) - sum, target = Math.max(0, to - Math.max(0, derived));
    if(sum > target) {
        const f = sum > 0 ? target / sum : 0;
        slice = {...slice, acts: slice.acts.flatMap(a => a.authority !== authority ? [a] : f > 0 ? [{...a, weight: Math.max(1e-6, a.weight * f)}] : [])};
    }
    return heatTable(slice, readDuties()).find(h => h.authority === authority)?.value ?? 0;
}
function project() {
    const v = view(slice, readDuties());
    let coins = null; try { coins = purse?.balance() ?? null; } catch { /* purse unreadable */ }
    return {...v, coins};
}
// The quote an owed row's Settle button shows (read by owed_ledger_sources).
export function fineQuotes() {
    const p = project(), out = {};
    for(const r of p.rows) {
        const short = p.coins != null && p.coins < r.amount;
        out[r.id] = {amount: r.amount, quote: {domain: 'heat', command: 'settleFine', factionId: r.id.slice('fine:'.length), owed: r.amount, pays: short ? 0 : r.amount, coins: p.coins ?? 0,
            label: `Pay ${r.amount} pence`, blocked: !p.canPay ? 'This cannot be paid from here yet.' : short ? `You hold ${p.coins} pence, short of the fine.` : null, note: null}};
    }
    return {rows: p.rows, live: out};
}
registerDomain({id: 'heat', deps: ['duties'], initialState: freshHeat,
    save: () => isEmpty(slice) ? undefined : structuredClone(slice), // an untouched life writes no key
    validate: s => { if(s != null && s.family === HEAT_FAMILY) validateHeat(s); },
    migrate: migrateHeat, load: s => { slice = migrateHeat(s); },
    tick, projection: project, commands: {recordAct, settleFine, raiseFine, easeActs}});
