// FD8 first consumer (B12): Klein's weekly expense claim to the Nighthawk team, as a recurring duty on the shared ledger.
// Weekly cycle, open the whole week (Neil: the cost can go on expenses; Dunn signs and adds it to the quarterly funding request).
// Amounts and subject are unstated in the book (KJ3T Q6), so this is a duty only; the payout belongs to the FD6 pay lines.
import {LOTM_PENCE} from './book_world_lotm_ids.js';
import {freshDuties, migrateDuties, attendDuty, settleMisses, dutyRows, answerMisses} from './recurring_duties.js';
const WEEK = 7 * 24 * 60;
export const LOTM_DUTIES = Object.freeze([Object.freeze({id: 'lotm.expense_claim', schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'nighthawks', source: 'lotm_duties',
    why: 'File this week\'s expense application with Captain Dunn so it joins the team funding request.'})]);
// Tingen lodging rent as a standing order (OB1/OB2/OB4). Rent follows the home (P7): the old flat is 5 soli 6 pence a week (stated, KJ3N:
// Benson to Mr. Franky), and after the move 2 Daffodil Street is 12 soli plus 3 pence for the furniture (stated, KJ3N haggle; KJ3S sums).
// One duty id for both, so the ledger, the collector and the household read one rent; lotmRentDefs is the set's per-state view.
// Dial: the book's figures; a world without them would use a twelfth to a twentieth of the lead's week (2 to 10 soli by district).
// Grace dial: one week late costs nothing (a landlady who knows his hours); one miss brings a notice, two bring her at the door (steps are
// thresholds on the miss count, so escalation is state, not a draw). No heat or bounty in this slice (LATER).
export const LOTM_RENT_ID = 'lotm.rent';
export const LOTM_RENT = Object.freeze([Object.freeze({id: LOTM_RENT_ID, schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'landlady', source: 'lotm_duties',
    why: 'Rent for your Tingen flat falls due at the end of each week: 5 soli 6 pence.',
    policy: Object.freeze({default: 'pay_on_time', allowed: Object.freeze(['pay_on_time', 'pay_late', 'pay_part', 'dispute', 'skip']), reason: 'An ordinary landlady takes it on time, a week late with a word, in part, or argues it; she is no official, so there is no bribing her.'}),
    dues: Object.freeze({amount: 5 * LOTM_PENCE.soli + 6, basis: 'stated', lateCycles: 1,
        // OB1/OB2 dials (authored proposals): half in part; a dispute held 3 days, 40% allowed, a granted one cuts the week by half; at 6 missed weeks
        // her men take goods worth the arrears (lowest value first, never worn or quest items), only while you are there.
        partShare: 0.5, dispute: Object.freeze({delayDays: 3, chance: 0.4, cut: 0.5, grantLine: 'Your landlady allows the damp and the draught: that week is halved.', denyLine: 'Your landlady checks her book and says the week stands in full.'}),
        seizure: Object.freeze({atMisses: 6, who: 'Your landlady\'s men'}), steps: Object.freeze([
        Object.freeze({atMisses: 1, kind: 'notice', line: 'A note is pushed under your door: the rent is behind.'}),
        Object.freeze({atMisses: 2, kind: 'visit', line: 'Your landlady knocks and says she cannot carry another week without the money.'})])})})]);
// Civil staff weekly office report (FD15, AUTHORED PROPOSAL: the book gives the clerk's weekly pay but no office routine). A duty of the civil post
// (the position row lists its id), so resigning the post ends it through the duties seam: the set stops being active, no code ends it by hand.
export const LOTM_CIVIL_DUTY_ID = 'lotm.civil_office_report';
export const LOTM_CIVIL_DUTIES = Object.freeze([Object.freeze({id: LOTM_CIVIL_DUTY_ID, schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'nighthawks', source: 'lotm_duties',
    why: 'Hand the Nighthawk office this week\'s tally of copied reports and office hours so your week\'s pay can be signed.'})]);
// Hired-guard night shift (W9-A, AUTHORED PROPOSAL; the job is invented, see book_world_lotm_guard.js). A duty of the guard row, so resigning or the
// term running out ends it through the duties seam. Weekly cycle open the whole week, like the civil report; pay and trouble belong to the guard module.
export const LOTM_GUARD_DUTY_ID = 'lotm.guard_night_watch';
export const LOTM_GUARD_DUTIES = Object.freeze([Object.freeze({id: LOTM_GUARD_DUTY_ID, schedule: Object.freeze({period: WEEK, opens: 0, closes: WEEK}),
    debtor: 'player', creditor: 'warehouse foreman', source: 'lotm_duties',
    why: 'Stand this week\'s night watch at the riverside warehouse so the foreman pays the week.'})]);
export const lotmDutyRows = (slice, minute) => dutyRows(slice, LOTM_DUTIES, minute);
export const fileExpenseClaim = (slice, minute) => answerMisses(attendDuty(slice, LOTM_DUTIES, 'lotm.expense_claim', minute), 'lotm.expense_claim');
export const closeLotmWeeks = (slice, minute) => settleMisses(slice, LOTM_DUTIES, minute);
export {freshDuties, migrateDuties};
// The home the rent follows: the old flat until the family moves (the fact the move writes), then 2 Daffodil Street.
export const LOTM_MOVED_FACT = 'book.lotm.kj3n.moved';
const DAFFODIL = Object.freeze(LOTM_RENT.map(d => Object.freeze({...d, why: 'Rent for 2 Daffodil Street falls due at the end of each week: 12 soli 3 pence, with the furniture.',
    dues: Object.freeze({...d.dues, amount: 12 * LOTM_PENCE.soli + 3})})));
export const lotmRentDefs = (defs, state) => state?.actors?.player?.facts?.[LOTM_MOVED_FACT] === true ? DAFFODIL : defs;
