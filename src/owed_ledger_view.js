// Ledger → Owed (LTU6, coverage B2/K3; proposed 2026-10-30). A read-only projection over obligations_ledger.js rows: who owes whom, what,
// since when, when it is due, whether it passes to an heir and where it is settled. No save field, no command; the writers stay the owners
// (economy_standing, household_fortunes, village_career, crafting). Parties are read from the seat's controlled actor (observer_view.js),
// never from a literal lead id. Leaf: no DOM, no clock, no domain imports; the host passes projected rows in.
import {CONTROLLED_ACTOR_ID} from './observer_view.js';

export const DAY = 1440;
const KIND = {coin: 'Money', favor: 'Favour', grievance: 'Grievance', duty: 'Duty'};
const KIND_ORDER = ['coin', 'favor', 'duty', 'grievance'];
// Labels for the parties today's writers use. A world adapter may pass its own through `labels`; unknown ids read as words.
export const PARTY_LABELS = Object.freeze({
    market_circle: 'the Market Circle', gutter_crews: 'the Gutter Crews', counting_house: 'the Counting-House',
    village_watch: 'the Village watch', household: 'your household', village_verge: 'the keepers of the Village verge',
    insurer: 'the broker', elder: 'the village elder', heir: 'your heir',
});
const SOURCE = {economy_standing: 'Standing and ledger', household_fortunes: 'Household', village_career: 'Village watch work',
    crafting: 'Crafting', heir_inheritance: 'Inheritance'};
// Where each row is settled, as a pointer (this tab never settles). Keyed by id prefix, then by kind.
const SETTLE = [
    ['credit:', 'Repay it in Standing and ledger → Credit. Paying on time raises that house\'s regard for you.'],
    ['claim:', 'The broker pays on the date written on the claim. Nothing to do but wait.'],
    ['career:', 'Settle with the Village watch: return the kit or pay its price.'],
    ['household:', 'Eases with decent treatment of the household, season by season.'],
    ['craft:', 'Eases season by season if no more common herbs are wasted.'],
];
const SETTLE_KIND = {coin: 'Pay it where it was borrowed.', favor: 'Return the favour in person.', duty: 'Do the duty where it is owed.',
    grievance: 'Eases with time and decent treatment.'};
const words = id => String(id).replace(/^book\.[^.]+\.(ledger\.)?/, '').replace(/[_.:-]+/g, ' ').trim();
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

export function amountText(kind, amount) {
    if(kind === 'coin') return plural(amount, 'coin');
    if(kind === 'grievance') return `grievance ${amount}`;
    if(kind === 'favor') return amount === 1 ? 'a favour' : plural(amount, 'favour');
    return amount === 1 ? 'a duty' : plural(amount, 'duty', 'duties');
}

function dueText(due, row) {
    if(due) {
        if(due.overdue) return 'overdue';
        if(due.daysLeft <= 0) return 'due today';
        return `due in ${plural(due.daysLeft, 'day')}`;
    }
    if(row.eases) return `no date; eases by ${row.eases} a season`;
    return 'no set date';
}

// One row as the player reads it. `due` is {daysLeft, overdue} when the writer keeps a date; `amount` may be a live figure (interest,
// easing) supplied by the host so the tab never shows a stale balance.
export function owedRow(row, {actorId = CONTROLLED_ACTOR_ID, labels = {}, due = null, amount = row.amount, now = 0} = {}) {
    const name = id => id === actorId ? 'you' : labels[id] ?? PARTY_LABELS[id] ?? words(id);
    const direction = row.debtor === actorId || row.debtor === 'heir' ? 'owe' : row.creditor === actorId ? 'owed' : 'other';
    const party = direction === 'owed' ? name(row.debtor) : name(row.creditor);
    const what = amountText(row.kind, amount), when = dueText(due, row);
    const effect = direction === 'owed' ? `${cap(party)} owes you ${what}, ${when}.`
        : row.debtor === 'heir' ? `Your heir owes ${party} ${what}, ${when}.`
        : direction === 'owe' ? `You owe ${party} ${what}, ${when}.` : `${cap(name(row.debtor))} owes ${name(row.creditor)} ${what}, ${when}.`;
    const days = row.since > 0 && now >= row.since ? Math.floor((now - row.since) / DAY) : null;
    return {id: row.id, kind: row.kind, kindLabel: KIND[row.kind] ?? words(row.kind), direction, party, amount, amountText: what,
        dated: !!due, overdue: !!due?.overdue, daysLeft: due ? due.daysLeft : null, dueText: when, effect,
        why: row.why || 'No reason was written down.',
        since: days == null ? 'Since: not recorded.' : days === 0 ? 'Since: today.' : `Since: ${plural(days, 'day')} ago.`,
        carries: row.carries ? 'Passes to an heir if it is still open when this life ends.' : 'Ends with this life.',
        source: SOURCE[row.source] ?? words(row.source),
        settle: SETTLE.find(([p]) => row.id.startsWith(p))?.[1] ?? SETTLE_KIND[row.kind] ?? 'Settle it with the other party.'};
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const rank = r => (r.overdue ? 0 : r.dated ? 1 : 2) * 1e6 + (r.dated ? Math.max(0, r.daysLeft) : 0) * 10 + (r.direction === 'owe' ? 0 : 1);
export const FILTERS = Object.freeze(['all', 'owe', 'owed', 'due', ...KIND_ORDER]);
const FILTER_LABEL = {all: 'All', owe: 'You owe', owed: 'Owed to you', due: 'Has a date', ...KIND};
const matches = (r, f) => f === 'all' || (f === 'owe' || f === 'owed' ? r.direction === f : f === 'due' ? r.dated : r.kind === f);

export const EMPTY_TEXT = 'No one owes you and you owe no one. Rows appear here when you borrow from a house (Standing and ledger → Credit), '
    + 'when an insured cargo is lost and the broker owes you a claim, or when your household, the Village watch or the verge keepers hold something against you.';

// The whole tab. `rows` are obligations@1 rows (already merged by the host); `live` maps row id → {amount, due}.
export function owedLedgerView({rows = [], live = {}, labels = {}, now = 0, actorId = CONTROLLED_ACTOR_ID, filter = 'all', selected = null} = {}) {
    const seen = new Set(), all = [];
    for(const r of rows) {
        if(!r || seen.has(r.id)) continue; seen.add(r.id);
        const v = owedRow(r, {actorId, labels, now, due: live[r.id]?.due ?? null, amount: live[r.id]?.amount ?? r.amount});
        if(v.amount > 0) all.push(v);
    }
    all.sort((a, b) => rank(a) - rank(b) || (a.id < b.id ? -1 : 1));
    const f = FILTERS.includes(filter) ? filter : 'all';
    const shown = all.filter(r => matches(r, f));
    const kinds = new Set(all.map(r => r.kind));
    const filters = FILTERS.filter(id => !KIND_ORDER.includes(id) || kinds.has(id))
        .map(id => ({id, label: FILTER_LABEL[id], count: all.filter(r => matches(r, id)).length, active: id === f}));
    const coins = dir => all.filter(r => r.direction === dir && r.kind === 'coin').reduce((n, r) => n + r.amount, 0);
    const owe = all.filter(r => r.direction === 'owe').length, owed = all.filter(r => r.direction === 'owed').length;
    const next = all.find(r => r.dated);
    const summary = !all.length ? '' : [
        `You owe ${plural(owe, 'account')}${coins('owe') ? ` (${plural(coins('owe'), 'coin')})` : ''}.`,
        `Owed to you: ${plural(owed, 'account')}${coins('owed') ? ` (${plural(coins('owed'), 'coin')})` : ''}.`,
        next ? `Next date: ${next.party}, ${next.dueText}.` : 'Nothing here has a date.'].join(' ');
    const pick = shown.find(r => r.id === selected) ?? null;
    return {rows: shown, total: all.length, filter: f, filters, summary, selected: pick,
        empty: !all.length ? EMPTY_TEXT : !shown.length ? `Nothing matches “${FILTER_LABEL[f]}”. Choose All to see ${plural(all.length, 'account')}.` : '',
        note: 'This tab only reads. Each account is settled where its row says.'};
}

// Host join over today's projections (pure, so tests feed it fixtures). `standing` is the economy_standing projection; `fortunes` are
// rows from collectFortuneObligations; `grudge` is the eased verge grudge at `now` (craft_grudge.grudgeNow).
export function gatherOwed({standing = null, fortunes = [], grudge = null} = {}) {
    const rows = [...(standing?.ledger ?? []), ...fortunes], live = {}, labels = {};
    for(const f of standing?.factions ?? []) {
        labels[f.id] = `the ${f.label}`;
        if(f.loan) live[`credit:${f.id}`] = {amount: f.loan.owed, due: {daysLeft: f.loan.daysLeft, overdue: !!f.loan.overdue}};
    }
    for(const c of standing?.claims ?? []) if(standing.now != null) live[c.id] = {amount: c.amount, due: {daysLeft: Math.ceil((c.due - standing.now) / DAY), overdue: false}};
    if(grudge != null) live['craft:verge-grudge'] = {amount: grudge};
    return {rows, live, labels, now: standing?.now ?? 0};
}
