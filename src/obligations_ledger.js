// IM32 / IM29 (AD14: bindings and duties carry by their own rules): one record shape for the
// debt-like states that live in separate places today. This module is pure and not wired into
// save or gameplay; the adapters READ the existing shapes and emit records, so a later lane can
// migrate each writer without this file changing them. See
// docs/research/itch-io-2026-10-22/IM32_OBLIGATIONS_LEDGER.md for the mapping and migration note.
export const OBLIGATIONS_FAMILY = 'obligations@1';
export const MAX_OBLIGATIONS = 256;
export const KINDS = Object.freeze(['coin', 'favor', 'grievance', 'duty']);
const fail = message => { throw new Error(message); };

export const createObligations = () => ({family: OBLIGATIONS_FAMILY, rows: []});

// id is stable per source ('household:resentment', 'career:kitDebt', 'heir:grievance').
// amount is in the unit of its kind (coins for coin, resentment points for grievance, 1 for a
// duty or favor). Recovery is a default with a reason (AD19): `eases` per season, never a lock.
export const obligation = ({id, kind, debtor, creditor, amount, why, source, since = 0, eases = 0, carries = true}) => ({
    id, kind, debtor, creditor, amount, why, source, since, eases, carries,
});

export function validateObligations(l) {
    l?.family === OBLIGATIONS_FAMILY || fail('Obligations: wrong family.');
    Array.isArray(l.rows) && l.rows.length <= MAX_OBLIGATIONS || fail('Obligations: bad rows.');
    const seen = new Set();
    for(const r of l.rows) {
        typeof r.id === 'string' && r.id && !seen.has(r.id) || fail('Obligations: duplicate or empty id.');
        seen.add(r.id);
        KINDS.includes(r.kind) || fail(`Obligations: unknown kind ${r.kind}.`);
        Number.isFinite(r.amount) && r.amount >= 0 || fail('Obligations: amount must be finite and non-negative.');
        Number.isFinite(r.eases) && r.eases >= 0 || fail('Obligations: eases must be non-negative.');
        typeof r.debtor === 'string' && typeof r.creditor === 'string' && typeof r.source === 'string' || fail('Obligations: parties and source are required.');
    }
    return l;
}

// Upsert by id; an amount of 0 settles (removes) the row.
export function writeObligation(ledger, row) {
    validateObligations({...ledger, rows: [row]});
    const rows = ledger.rows.filter(r => r.id !== row.id);
    if(row.amount > 0) rows.push(row);
    return validateObligations({...ledger, rows: rows.sort((a, b) => a.id < b.id ? -1 : 1)});
}

export const readObligations = (ledger, {debtor, creditor, kind} = {}) =>
    ledger.rows.filter(r => (!debtor || r.debtor === debtor) && (!creditor || r.creditor === creditor) && (!kind || r.kind === kind));

// Recovery with decent treatment (AD19), the household's rule generalised: rows with `eases` shrink
// per season and settle at 0. Rows with eases 0 (money owed) do not shrink by time.
export const easeObligations = (ledger, seasons) => ({...ledger, rows: ledger.rows
    .map(r => r.eases ? {...r, amount: Math.max(0, r.amount - r.eases * seasons)} : r)
    .filter(r => r.amount > 0)});

// What an heir inherits: only rows marked carries. Money debts are settled by the estate first in
// heir_inheritance.js today; that order is a writer concern and stays there.
export const carriedObligations = ledger => ({...ledger, rows: ledger.rows.filter(r => r.carries)});

// Adapters (read-only over today's shapes).
export function fromHousehold(h = {}) {
    const rows = [];
    if(h.resentment > 0) rows.push(obligation({id: 'household:resentment', kind: 'grievance', debtor: 'player', creditor: 'household',
        amount: h.resentment, why: (h.ledger || []).at(-1)?.note || 'Household resentment', source: 'household_fortunes', eases: 1, carries: false}));
    return rows;
}
export function fromVillageCareer(career = {}) {
    return career.debt > 0 ? [obligation({id: 'career:kitDebt', kind: 'coin', debtor: 'player', creditor: 'village_watch',
        amount: career.debt, why: 'Kept the loaned patrol kit', source: 'village_career', carries: true})] : [];
}
export function fromHeirObligations(keys = [], table = {}) {
    const map = {grievance: ['grievance', 'elder', 3], archiveDuty: ['duty', 'elder', 1]};
    return keys.filter(k => map[k]).map(k => obligation({id: `heir:${k}`, kind: map[k][0], debtor: 'heir', creditor: map[k][1],
        amount: map[k][2], why: table[k] || k, source: 'heir_inheritance', carries: true}));
}

export function collectObligations({household, career, heirKeys, heirTable} = {}) {
    let ledger = createObligations();
    for(const r of [...fromHousehold(household), ...fromVillageCareer(career), ...fromHeirObligations(heirKeys, heirTable)]) ledger = writeObligation(ledger, r);
    return ledger;
}
