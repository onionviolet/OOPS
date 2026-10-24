// Wasted common herbs as a grudge row in the obligations ledger (IM32). The Village common verge is shared stock, so a
// spoiled steep costs its keepers something; the row is written and read through obligations_ledger.js, no counter of its own.
// Default and dial: one point per spoiled steep, easing one point per season of decent behaviour (AD19), never a lock.
import {obligation, writeObligation, readObligations} from './obligations_ledger.js';
export const GRUDGE_ID = 'craft:verge-grudge', GRUDGE_CREDITOR = 'village_verge';
export const GRUDGE = Object.freeze({perSpoil: 1, easesPerSeason: 1, seasonMinutes: 90 * 1440, cap: 12,
    why: 'Wasted common verge herbs on steeps that came to nothing'});
const rowOf = ledger => readObligations(ledger, {creditor: GRUDGE_CREDITOR}).find(r => r.id === GRUDGE_ID);
// What the row amounts to at `now`, after the seasons since it was last written.
export function grudgeNow(ledger, now) {
    const row = rowOf(ledger);
    return row ? Math.max(0, row.amount - Math.floor(Math.max(0, now - row.since) / GRUDGE.seasonMinutes) * row.eases) : 0;
}
// Returns a new ledger with one more spoiled steep on the row; the old amount is first eased to `now`.
export function chargeGrudge(ledger, now, spoiled = 1) {
    const amount = Math.min(GRUDGE.cap, grudgeNow(ledger, now) + GRUDGE.perSpoil * spoiled);
    return writeObligation(ledger, obligation({id: GRUDGE_ID, kind: 'grievance', debtor: 'player', creditor: GRUDGE_CREDITOR, amount,
        why: GRUDGE.why, source: 'crafting', since: now, eases: GRUDGE.easesPerSeason, carries: false}));
}
