// FD8 first consumer (B12): Klein's weekly expense claim to the Nighthawk team, as a recurring duty on the shared ledger.
// Weekly cycle, open the whole week (Neil: the cost can go on expenses; Dunn signs and adds it to the quarterly funding request).
// Amounts and subject are unstated in the book (KJ3T Q6), so this is a duty only; the payout belongs to the FD6 pay lines.
import {freshDuties, migrateDuties, attendDuty, settleMisses, dutyRows, answerMisses} from './recurring_duties.js';
const WEEK = 7 * 24 * 60;
export const LOTM_DUTIES = Object.freeze([Object.freeze({id: 'lotm.expense_claim', schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'nighthawks', source: 'lotm_duties',
    why: 'File this week\'s expense application with Captain Dunn so it joins the team funding request.'})]);
export const lotmDutyRows = (slice, minute) => dutyRows(slice, LOTM_DUTIES, minute);
export const fileExpenseClaim = (slice, minute) => answerMisses(attendDuty(slice, LOTM_DUTIES, 'lotm.expense_claim', minute), 'lotm.expense_claim');
export const closeLotmWeeks = (slice, minute) => settleMisses(slice, LOTM_DUTIES, minute);
export {freshDuties, migrateDuties};
