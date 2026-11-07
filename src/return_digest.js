import {knownPeopleView} from './people_knowledge.js';
import {eventFeed} from './event_feed.js';
import {livelihoodsOf, livelihoodLine} from './livelihoods.js';
import {lastClosedCycle} from './world_rhythm.js';
// RPT6/LTU3 return digest (TIME_AND_CHRONICLE TC3, TC8-TC11). Read-only grouping of lines the
// player already knows: people's memories from knownPeopleView and news from eventFeed. It owns
// no record and reads no NPC private state; the only saved input is `seenAt`, held by the domain.

// Default dial: four game hours since you last marked it read (TC8). Worlds may pass their own.
export const DIGEST_THRESHOLD_MINUTES = 240;
const HOUR = 60, DAY = 1440;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// LSD161/TC9: a stretch of game time as a phrase, never as raw minutes.
export function spanPhrase(minutes) {
    if (!Number.isFinite(minutes) || minutes < 0) throw new Error('Invalid time span.');
    if (minutes < 15) return 'a few minutes';
    if (minutes < 45) return 'less than an hour';
    if (minutes < 90) return 'about an hour';
    if (minutes < 10 * HOUR) return `about ${Math.round(minutes / HOUR)} hours`;
    if (minutes < 16 * HOUR) return 'about half a day';
    if (minutes < 36 * HOUR) return 'about a day';
    if (minutes < 6 * DAY) return `about ${Math.round(minutes / DAY)} days`;
    if (minutes < 11 * DAY) return 'about a week';
    return `about ${plural(Math.round(minutes / (7 * DAY)), 'week')}`;
}
export const agoPhrase = (at, clock) => clock - at < 15 ? 'just now' : `${spanPhrase(clock - at)} ago`;

const line = (text, at, clock) => ({text, at, when: agoPhrase(at, clock)});
const newest = (a, b) => b.at - a.at || a.text.localeCompare(b.text);

// Pure grouping (TC10). Sources are already player-knowable; this only orders and words them.
export function groupDigest({clock, seenAt, people = [], own = [], around = [], missed = [], threshold = DIGEST_THRESHOLD_MINUTES}) {
    if (!Number.isSafeInteger(clock) || clock < 0) throw new Error('Invalid digest clock.');
    const seen = seenAt == null ? clock : Math.max(0, Math.min(clock, seenAt));
    const after = rows => rows.filter(r => Number.isFinite(r.at) && r.at > seen && r.at <= clock && typeof r.text === 'string' && r.text);
    const groups = [];
    const personGroups = people.map(p => ({id: `person:${p.id}`, kind: 'person', personId: p.id, label: p.name,
        lines: after(p.memories || []).sort(newest).map(m => line(m.text, m.at, clock))})).filter(g => g.lines.length)
        .sort((a, b) => b.lines.length - a.lines.length || b.lines[0].at - a.lines[0].at || a.label.localeCompare(b.label));
    groups.push(...personGroups);
    const used = new Set(personGroups.flatMap(g => g.lines.map(l => l.text)));
    for (const [id, label, rows] of [['you', 'You', own], ['around', 'Around', around], ['missed', 'Missed', missed]]) {
        const lines = after(rows).filter(r => !used.has(r.text)).sort(newest).map(r => line(r.text, r.at, clock));
        lines.forEach(l => used.add(l.text));
        if (lines.length) groups.push({id, kind: id, label, lines});
    }
    const span = clock - seen, count = groups.reduce((n, g) => n + g.lines.length, 0);
    const spanText = spanPhrase(span);
    const visible = span >= threshold && count > 0;
    const text = visible ? `While you were away (${spanText}): ${groups.map(g => `${g.label}: ${g.lines.map(l => l.text.replace(/[.\s]+$/, '')).join('; ')}.`).join(' ')}` : '';
    return {visible, seenAt: seen, clock, span, spanText, threshold, count, groups, text};
}

// OB6: the weekly money line. One line per world for what standing orders paid and earned while away, exceptions listed apart.
// Pure and derived on read: nothing is stored, and a world that owes and earns nothing adds nothing. A world passes one input:
//   {world, defs, slice, owed, fmt, paidLabel}   defs/slice are its duty set and the duties slice, owed its ledger rows, fmt(amount) its coin words.
// Paid cycles are the dues cycles that closed in the window, less those the slice still counts as missed or held back by a pay_late order.
// An approximation only where old back rent was cleared inside the window (the slice keeps no per-cycle history).
export const POUND_SOLI_PENCE = Object.freeze([{size: 240, one: 'pound', many: 'pounds'}, {size: 12, one: 'soli', many: 'soli'}, {size: 1, one: 'penny', many: 'pence'}]);
export function coinWords(units = POUND_SOLI_PENCE) {
    return amount => {
        if (!Number.isFinite(amount) || amount < 0) throw new Error('Invalid coin amount.');
        let left = Math.round(amount); const out = [];
        for (const u of units) { const n = Math.floor(left / u.size); if (n) { out.push(`${n} ${n === 1 ? u.one : u.many}`); left -= n * u.size; } }
        return out.length ? out.join(' ') : `0 ${units.at(-1).many}`;
    };
}
const times = n => n === 1 ? 'once' : `${n} times`;
export function moneyLines(inputs, {seenAt, clock}) {
    const lines = [], exceptions = [];
    if (!Number.isSafeInteger(clock) || !Number.isFinite(seenAt) || seenAt >= clock) return {lines, exceptions};
    for (const w of inputs ?? []) {
        const fmt = w.fmt ?? coinWords(), slice = w.slice ?? {}, parts = [];
        let paid = 0;
        for (const d of w.defs ?? []) {
            if (!d.dues || slice.closed?.[d.id] == null) continue; // untracked: the order never ran, so nothing was paid
            const n = Math.min(lastClosedCycle(d.schedule, clock), slice.closed[d.id] - 1) - lastClosedCycle(d.schedule, seenAt);
            if (n <= 0) continue;
            const missed = Math.min(slice.missed?.[d.id] ?? 0, n), held = Math.min(slice.late?.[d.id] ?? 0, n - missed);
            paid += (n - missed - held) * d.dues.amount;
            const label = d.label ?? w.dueWord ?? 'Rent';
            if (missed) exceptions.push({world: w.world, kind: 'missed', text: `${label} missed ${times(missed)} (${fmt(missed * d.dues.amount)} unpaid)`});
            if (held) exceptions.push({world: w.world, kind: 'held', text: `${label} held back ${times(held)} by your standing order`});
        }
        if (paid > 0) parts.push(`${w.paidLabel ?? 'Rent and dues paid'}: ${fmt(paid)}.`);
        const wages = (w.owed ?? []).filter(r => r.creditor === 'player' && r.kind === 'coin' && r.amount > 0).reduce((a, r) => a + r.amount, 0);
        if (wages > 0) parts.push(`${w.wagesLabel ?? 'Wages owed to you'}: ${fmt(wages)}.`);
        if (parts.length) lines.push({world: w.world, text: parts.join(' ')});
        for (const r of w.owed ?? []) if (r.debtor === 'player' && String(r.id).startsWith('fine:') && r.amount > 0)
            exceptions.push({world: w.world, kind: 'fined', text: `Fined ${fmt(r.amount)}`});
    }
    return {lines, exceptions};
}

// Adapter from real state. `facts` and `lifeRecord` are the same inputs the World events feed uses;
// a caller that already built that feed passes it as `feed`.
export function returnDigest(state, registry, {facts = {}, lifeRecord = null, seenAt = null, threshold, feed: given = null, events = null, livelihoodCtx = {}, money = null} = {}) {
    const clock = state.clock;
    const people = knownPeopleView(state, facts);
    const feed = given ?? eventFeed(state, registry, facts, lifeRecord);
    const own = feed.news.filter(m => m.id.startsWith('receipt:'));
    const around = feed.news.filter(m => !m.id.startsWith('receipt:'));
    const missed = [...feed.heard];
    const reports = feed.leads.find(e => e.id === 'chronicle:reports');
    if (reports) missed.push({text: `${reports.label}. ${reports.detail}`, at: reports.at});
    // L14 world events, already worded by the host: digestRowsFromEvents (read_models/time_digest_bridge.js) gives {around, missed}.
    if (events) { around.push(...events.around); missed.push(...events.missed); }
    // Lane E: where your livelihoods stand now (derived on read, no save key). Shown with the digest, not timed lines.
    const base = groupDigest({clock, seenAt, people, own, around, missed, threshold});
    // OB6: money is its own view; a week of paid rent alone is enough to show the digest once the dial's span has passed.
    const m = moneyLines(money, {seenAt: base.seenAt, clock}), moneyText = [...m.lines.map(l => l.text), ...m.exceptions.map(e => `${e.text}.`)].join(' ');
    const visible = base.visible || (base.span >= base.threshold && (m.lines.length > 0 || m.exceptions.length > 0));
    return {...base, visible, text: visible ? `${base.text || `While you were away (${base.spanText}):`}${moneyText ? ` ${moneyText}` : ''}` : '', money: m, livelihoods: livelihoodsOf(state, livelihoodCtx).map(livelihoodLine)};
}

// The same digest as a figure spec (RPX15/RPX19 gallery form): you at the centre, one marker per
// person or place group, each line kept as a note so figureText reads as the row does.
export function digestFigure(digest, {id = 'return-digest', title = 'While you were away'} = {}) {
    const others = digest.groups.filter(g => g.kind !== 'you'), own = digest.groups.find(g => g.kind === 'you');
    const state = g => g.kind === 'missed' ? 'strained' : undefined;
    const count = n => `${n} ${n === 1 ? 'thing' : 'things'}`;
    return {id, title, size: 720,
        summary: digest.visible ? `${digest.spanText} since you last looked; ${count(digest.count)} you could know.` : 'Nothing new since you last looked.',
        rings: others.length ? [{id: 'who', label: 'Who it came from', radius: .85, count: others.length, visible: false}] : [],
        nodes: [{id: 'you', label: own ? `You · ${own.lines.length}` : 'You', glyph: 'Y', at: 'center', state: 'active'},
            ...others.map((g, index) => ({id: g.id, label: `${g.label} · ${g.lines.length}`, glyph: g.label.charAt(0).toUpperCase(), ring: 'who', index, ...(state(g) ? {state: state(g)} : {})}))],
        edges: others.map(g => ({from: 'you', to: g.id, kind: g.kind === 'person' ? 'from a person' : g.kind === 'missed' ? 'missed' : 'heard around', label: g.lines[0].when})),
        notes: digest.groups.map(g => ({text: `${g.label}: ${g.lines.map(l => `${l.text.replace(/[.\s]+$/, '')} (${l.when})`).join('; ')}.`}))};
}
