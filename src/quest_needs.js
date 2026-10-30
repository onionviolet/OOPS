// Adapters for quest_generator.js: read today's shapes, emit needs. Pure; no domain imports, no writes.
// Village: a met traveler whose goal is unmet and who can pay the fee (the same filter story_requests.js uses for who may ask).
// Owed: rows the player owes, from gatherOwed() in owed_ledger_view.js, any world.
const lc = s => String(s).toLowerCase();

export function wantNeeds(people = [], {world = 'village', pending = []} = {}) {
    return people.filter(p => p.met && p.status !== 'on_road' && !p.goal?.fulfilled && !(p.possessions?.supplies?.[p.goal?.item] || 0)
            && p.possessions?.coins >= p.goal?.reward && !pending.includes(p.id))
        .map(p => ({ref: `want:${p.id}:${p.goal.item}`, kind: 'want', world, subject: p.id, urgency: 0.5,
            label: `${p.name} needs ${p.goal.quantity > 1 ? p.goal.quantity + ' ' : ''}${lc(p.goal.item)}`,
            why: `${p.name}, a ${p.role}, asked for it and can pay ${p.goal.reward} coins.`,
            route: {verb: 'story_request', personId: p.id, item: p.goal.item}}));
}

export function debtNeeds(owed = {rows: [], live: {}}, {world, actorId = 'player'} = {}) {
    return owed.rows.filter(r => (r.debtor === actorId || r.debtor === 'heir') && r.kind !== 'grievance')
        .map(r => {
            const due = owed.live?.[r.id]?.due, name = owed.labels?.[r.creditor] ?? r.creditor.replace(/_/g, ' ');
            const urgency = due?.overdue ? 1 : due ? Math.max(0.3, 0.9 - due.daysLeft / 20) : 0.35;
            return {ref: `debt:${r.id}`, kind: 'debt', world, subject: r.creditor, urgency: Math.min(1, urgency),
                label: r.kind === 'coin' ? `Settle with ${name}` : `Do your duty to ${name}`,
                why: `${r.why}${due ? due.overdue ? ' (overdue)' : ` (due in ${due.daysLeft} days)` : ''}.`.replace('..', '.'),
                route: {verb: 'owed_settle', rowId: r.id}};
        });
}
