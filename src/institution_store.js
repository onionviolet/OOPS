// Institutions, contribution and the store (DWF154, DWF155, DWF162, 2026-10-25). One contribution ledger per institution and one store whose stock and prices
// are rows. Churches pay merit, sects pay contribution points, societies keep credit: the currency is the institution's own, earned by missions that are real
// actions and spent at its store. This leaf holds only the shapes and the pure checks; each world adapter stores the numbers where its own save keeps
// them (a resource pair in the Tingen branch, a slice in the sect) and turns store rows into its own commands. Standing is not here: faction_rank.js
// derives rank from signed reputation and stays a separate fact (one authority per fact). Leaf: no world imports, no DOM, no clock, no save.
// Every price, pay and stock is a per-world dial and a labelled proposal unless a row carries a source locator (WPR5).
import {evaluateRule} from './rules.js';

const fail = message => { throw new Error(message); };
const text = (v, label) => typeof v === 'string' && v.length ? v : fail(`${label} must be non-empty text.`);
const natural = n => Number.isSafeInteger(n) && n >= 0;
const positive = n => Number.isSafeInteger(n) && n > 0;
const plain = v => v && typeof v === 'object' && !Array.isArray(v);
const freeze = v => { if(v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; };
export const STORE_KINDS = Object.freeze(['formula', 'ingredient', 'technique', 'item']);
export const REWARD_KINDS = Object.freeze(['money', 'contribution', 'formula', 'ingredient', 'characteristic', 'standing']);

// A mission pays contribution for time and risk. `minutes` is real elapsed time in the world that runs it; `risk` and `deadline` are stated, not hidden.
function defineMission(m) {
    if(!positive(m.pay)) fail(`Mission ${m.id} pays a positive whole number.`);
    if(m.minutes != null && !positive(m.minutes)) fail(`Mission ${m.id} minutes are a positive integer.`);
    if(m.deadline != null && !positive(m.deadline)) fail(`Mission ${m.id} deadline is a positive integer of minutes.`);
    return {id: text(m.id, 'Mission ID'), label: text(m.label, 'Mission label'), pay: m.pay, reward: 'contribution', ...(m.minutes != null ? {minutes: m.minutes} : {}),
        issuer: text(m.issuer, 'Mission issuer'), risk: text(m.risk, 'Mission risk'), ...(m.deadline != null ? {deadline: m.deadline} : {}), text: text(m.text, 'Mission text'), evidence: m.evidence ?? 'authored proposal'};
}

function defineStoreRow(r) {
    if(!STORE_KINDS.includes(r.kind)) fail(`Unknown store kind: ${r.kind}.`);
    if(!positive(r.price)) fail(`Store row ${r.id} price is a positive whole number.`);
    if(r.stock != null && !positive(r.stock)) fail(`Store row ${r.id} stock is a positive integer or open.`);
    if(r.gate != null) evaluateRule(r.gate.rule, {});
    return {id: text(r.id, 'Store row ID'), label: text(r.label, 'Store row label'), kind: r.kind, price: r.price, stock: r.stock ?? null,
        ...(r.gate ? {gate: {rule: structuredClone(r.gate.rule), text: text(r.gate.text, 'Gate text')}} : {}), grants: structuredClone(r.grants ?? {}), text: text(r.text, 'Store row text'), evidence: r.evidence ?? 'authored proposal'};
}

export function defineInstitution(row) {
    if(!plain(row)) fail('An institution is an object.');
    const currency = {label: text(row.currency?.label, 'Currency label'), unit: text(row.currency?.unit, 'Currency unit')};
    const missions = (row.missions ?? []).map(defineMission), store = (row.store ?? []).map(defineStoreRow);
    if(new Set(missions.map(m => m.id)).size !== missions.length || new Set(store.map(s => s.id)).size !== store.length) fail('Duplicate mission or store row ID.');
    return freeze({id: text(row.id, 'Institution ID'), world: text(row.world, 'Institution world'), name: text(row.name, 'Institution name'), currency, missions, store,
        evidence: [...(row.evidence ?? [])], proposals: [...(row.proposals ?? [])]});
}

// Ledger invariant for any adapter: earned and spent are whole, spent never passes earned, and the balance is exactly the difference.
export function auditLedger({earned, spent}, label = 'Ledger') {
    if(!natural(earned) || !natural(spent)) fail(`${label} earned and spent are whole numbers.`);
    if(spent > earned) fail(`${label} spent ${spent} passes earned ${earned}.`);
    return earned - spent;
}

// One store row, as the player sees it. Every refusal says why, and an exhausted or gated row still shows its price. The gate is an evaluateRule shape
// over the adapter's own facts; `bought` is how many of this row were already taken.
export function offerFor(institution, rowId, {balance, bought = 0, facts = {}}) {
    const row = institution.store.find(r => r.id === rowId) ?? fail(`${institution.name} stocks no ${rowId}.`);
    const reasons = [];
    const left = row.stock == null ? null : Math.max(0, row.stock - bought);
    if(left === 0) reasons.push('The store has none left.');
    if(balance < row.price) reasons.push(`It costs ${row.price} ${institution.currency.unit}; you hold ${balance}.`);
    if(row.gate) { let met = false; try { met = evaluateRule(row.gate.rule, facts).met; } catch { met = false; } if(!met) reasons.push(row.gate.text); }
    return {id: row.id, label: row.label, kind: row.kind, price: row.price, left, eligible: !reasons.length, reasons, text: row.text, evidence: row.evidence};
}

export const storeView = (institution, ctx) => institution.store.map(r => offerFor(institution, r.id, {...ctx, bought: ctx.boughtBy?.[r.id] ?? 0}));
