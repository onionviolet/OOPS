import {knownPeopleView} from './people_knowledge.js';
import {eventFeed} from './event_feed.js';
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

// Adapter from real state. `facts` and `lifeRecord` are the same inputs the World events feed uses;
// a caller that already built that feed passes it as `feed`.
export function returnDigest(state, registry, {facts = {}, lifeRecord = null, seenAt = null, threshold, feed: given = null, events = null} = {}) {
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
    return groupDigest({clock, seenAt, people, own, around, missed, threshold});
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
