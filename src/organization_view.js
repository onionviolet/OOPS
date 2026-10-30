// Organization overview (proposal, ORGANIZATIONS.md): one pure projection for any group the player leads or
// co-runs. An adapter hands in a descriptor; this returns what the panel draws and the same facts as plain
// lines (UR37). No state, no persistence. The kind descriptor picks the nouns, never different code (FND5).
export const ORG_KINDS = Object.freeze({
    household_business: {noun: 'household business', roster: 'People', standing: 'Standing', holdings: 'Holdings', rosterColumns: ['Role', 'Doing']},
    gang: {noun: 'gang', roster: 'Crew', standing: 'Heat', holdings: 'Turf', rosterColumns: ['Role', 'Doing']},
    sect: {noun: 'sect', roster: 'Disciples', standing: 'Renown', holdings: 'Halls', rosterColumns: ['Grade', 'Doing']},
    corporation: {noun: 'corporation', roster: 'Staff', standing: 'Brand', holdings: 'Assets', rosterColumns: ['Department', 'Doing']},
    guild: {noun: 'guild', roster: 'Members', standing: 'Standing', holdings: 'Halls', rosterColumns: ['Rank', 'Doing']},
});
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const minutes = n => plural(Math.max(0, Math.round(n)), 'played minute');

/**
 * descriptor: {id, name, kind, members:[{id, name, role, doing?, present?, note?}],
 *   operations:[{id, label, who, timeLeft (minutes), held?:[string], pays?:[string], state?:'running'|'paused'}],
 *   money?:{onHand?, committedOut?, expectedIn?, unit?}, standing?:{label?, rank, feeling, value, next?:{name, at}},
 *   holdings?:[{id, label, note?}], ladder?:[{label, state}]}
 * Missing facts stay missing: a part with no data is absent, never zero (AD6).
 */
export function organizationView(d) {
    if (!d || typeof d.id !== 'string' || typeof d.name !== 'string') throw new Error('Organization descriptor needs an id and a name.');
    const kind = ORG_KINDS[d.kind] || ORG_KINDS.household_business;
    const members = (d.members || []).map(m => ({id: m.id, name: m.name, role: m.role || '', doing: m.doing || (m.present === false ? 'away' : 'free'), present: m.present !== false, note: m.note || ''}));
    const operations = (d.operations || []).map(o => ({id: o.id, label: o.label, who: o.who || '', timeLeft: o.timeLeft, timeText: Number.isFinite(o.timeLeft) ? `${minutes(o.timeLeft)} left` : 'until you act', held: o.held || [], pays: o.pays || [], state: o.state || 'running'}));
    const money = d.money && ['onHand', 'committedOut', 'expectedIn'].some(k => Number.isFinite(d.money[k])) ? d.money : null;
    const standing = d.standing ? {label: d.standing.label || kind.standing, ...d.standing} : null;
    const view = {id: d.id, name: d.name, kind: d.kind in ORG_KINDS ? d.kind : 'household_business', noun: kind.noun, rosterLabel: kind.roster, rosterColumns: kind.rosterColumns,
        members, operations, money, standing, holdings: d.holdings || [], holdingsLabel: kind.holdings, ladder: d.ladder || []};
    view.running = operations.filter(o => o.state === 'running').length;
    view.empty = operations.length ? '' : 'Nothing is running. Commission someone or accept an order to leave work running while you play.';
    view.summary = organizationSummary(view);
    return view;
}

export function organizationSummary(v) {
    const unit = v.money?.unit || 'coin';
    const parts = [`${v.name}, a ${v.noun}. ${plural(v.members.length, 'person', 'people')}.`];
    const first = v.operations[0];
    parts.push(v.operations.length ? `${plural(v.operations.length, 'job')} under way${first ? `, ${first.label}${Number.isFinite(first.timeLeft) ? `, ${minutes(first.timeLeft)} left` : ''}` : ''}.` : v.empty);
    if (v.money) {
        const m = [];
        if (Number.isFinite(v.money.onHand)) m.push(`${plural(v.money.onHand, unit)} on hand`);
        if (Number.isFinite(v.money.committedOut)) m.push(`${v.money.committedOut} committed out`);
        if (Number.isFinite(v.money.expectedIn)) m.push(`${v.money.expectedIn} expected in`);
        parts.push(`${m.join(', ')}.`);
    }
    if (v.standing) parts.push(`${v.standing.label}: ${v.standing.rank}${v.standing.next ? `, next ${v.standing.next.name} at ${v.standing.next.at}` : ', the top rung'}.`);
    return parts.join(' ');
}

/** The whole overview as lines: the effects-off reading and the accessible description (UR37). */
export function organizationText(v) {
    const lines = [v.summary, `${v.rosterLabel}:`];
    for (const m of v.members) lines.push(`- ${m.name}${m.role ? `, ${m.role}` : ''}: ${m.doing}${m.note ? ` (${m.note})` : ''}.`);
    lines.push('Operations:');
    if (!v.operations.length) lines.push(`- ${v.empty}`);
    for (const o of v.operations) lines.push(`- ${o.label}${o.who ? ` (${o.who})` : ''}: ${o.timeText}${o.held.length ? `; held ${o.held.join(', ')}` : ''}${o.pays.length ? `; pays ${o.pays.join(', ')}` : ''}${o.state === 'paused' ? '; paused' : ''}.`);
    if (v.standing) lines.push(`${v.standing.label}: ${v.standing.rank}. ${v.standing.feeling || ''}`.trim());
    return lines.join('\n');
}

/** A standing ladder as a figure track so the gallery and the panel share one drawing (O4/O5). */
export function standingTrack(v) {
    if (!v.ladder.length) return null;
    return {id: `${v.id}-standing`, label: v.standing?.label || 'Standing', steps: v.ladder.map(s => ({label: s.label, state: s.state}))};
}
