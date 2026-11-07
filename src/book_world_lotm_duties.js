// FD8 first consumer (B12): Klein's weekly expense claim to the Nighthawk team, as a recurring duty on the shared ledger.
// Weekly cycle, open the whole week (Neil: the cost can go on expenses; Dunn signs and adds it to the quarterly funding request).
// Amounts and subject are unstated in the book (KJ3T Q6), so this is a duty only; the payout belongs to the FD6 pay lines.
import {LOTM_PENCE} from './book_world_lotm_ids.js';
import {freshDuties, migrateDuties, attendDuty, settleMisses, dutyRows, answerMisses} from './recurring_duties.js';
const WEEK = 7 * 24 * 60;
export const LOTM_DUTIES = Object.freeze([Object.freeze({id: 'lotm.expense_claim', schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'nighthawks', source: 'lotm_duties',
    why: 'File this week\'s expense application with Captain Dunn so it joins the team funding request.'})]);
// Tingen lodging rent as a standing order (OB1/OB2/OB4). AUTHORED PROPOSAL: no rent figure is stated in the source data (basis 'assumed').
// Dial: 5 soli (60 pence) a week, about a twelfth of Klein's 3-pound civil week, so the order is felt but never ruinous; range 2 to 10 soli by district.
// Grace dial: one week late costs nothing (a landlady who knows his hours); one miss brings a notice, two bring her at the door (steps are
// thresholds on the miss count, so escalation is state, not a draw). No heat or bounty in this slice (LATER).
export const LOTM_RENT_ID = 'lotm.rent';
export const LOTM_RENT = Object.freeze([Object.freeze({id: LOTM_RENT_ID, schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'landlady', source: 'lotm_duties',
    why: 'Rent for your Tingen lodging falls due at the end of each week: 5 soli (an assumed figure).',
    policy: Object.freeze({default: 'pay_on_time', allowed: Object.freeze(['pay_on_time', 'pay_late', 'skip']), reason: 'An ordinary landlady takes it on time, a week late with a word, or not at all.'}),
    dues: Object.freeze({amount: 5 * LOTM_PENCE.soli, basis: 'assumed', lateCycles: 1, steps: Object.freeze([
        Object.freeze({atMisses: 1, kind: 'notice', line: 'A note is pushed under your door: the rent is behind.'}),
        Object.freeze({atMisses: 2, kind: 'visit', line: 'Your landlady knocks and says she cannot carry another week without the money.'})])})})]);
export const lotmDutyRows = (slice, minute) => dutyRows(slice, LOTM_DUTIES, minute);
export const fileExpenseClaim = (slice, minute) => answerMisses(attendDuty(slice, LOTM_DUTIES, 'lotm.expense_claim', minute), 'lotm.expense_claim');
export const closeLotmWeeks = (slice, minute) => settleMisses(slice, LOTM_DUTIES, minute);
export {freshDuties, migrateDuties};
