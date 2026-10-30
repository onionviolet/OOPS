// Primordial Saint Sect, first slice "Priced credit and the restart" (packet 2026-10-23). Pure rules and
// data: no DOM, no clock, no save slice. Owner of the loan, the credit-cap gate and the carry rows; the
// host (book_world_primordial_host.js) holds state and the domain wires it. IDs are namespaced
// `book.primordial.` (WA9). Every authored value is a labelled proposal (AD32, WA3) or carries its
// source locator (chapter and page tags in the private novel extraction, passes-2026-10-23).
// Labels follow the packet's live summary: SOURCE (opened locator), AUTHORED (proposal, not canon), SHOWN BASIS
// with a kept dial. Source: 36 percent, ten years, 460 a year schedule, 1,000 and 300 CP prices, credit cap rule.
// Authored: 30-day month and 360-day year, 600 CP second-half price, body-value figure.
import {defineGate, evaluateGate} from './progression_gates.js';
import {DIALS as STANDING_DIALS} from './economy_standing.js';
import {createObligations, writeObligation, obligation} from './obligations_ledger.js';
import {defineInstitution, offerFor} from './institution_store.js';

// Existing grace-days rule (ECR21: forgiving defaults, never a hidden fail state), read from the standing seam.
const GRACE_DAYS = STANDING_DIALS.graceDays.value;
export const WORLD_ID = 'book.primordial.sect';
export const SCHEMA = 1;
export const DAY = 1440;
// The engine calendar is 12 months of 30 days (world_rhythm.calendarMinutes, chronicle GAME_YEAR).
export const YEAR_DAYS = 360;
const dial = (value, status, why, locator = null) => Object.freeze({value, status, why, locator});

export const DIALS = Object.freeze({
    ratePerYear: dial(0.36, 'SOURCE', 'The first-exchange loan is zero down at 36 percent a year over ten years, simple interest on the original principal, repaid as a flat yearly installment: 1,000 CP owes 460 a year (100 principal plus 360 interest), 4,600 in all.', 'c0006 p33-36 (460 a year, 4,600 in all)'),
    termYears: dial(10, 'SOURCE', 'Ten years to repay the first-exchange loan.', 'c0006 p33-36'),
    bodyValue: dial(1200, 'AUTHORED', 'A disciple\'s recorded total value in CP. The rule that credit never exceeds it is stated; the figure is authored so the 1,000 CP formula passes and a 1,500 CP method is refused.', 'rule (credit never exceeds total value) SOURCE c0009 p65-66; figure and formula AUTHORED'),
    secondHalfPrice: dial(600, 'AUTHORED', 'The first half of a method is issued free of charge; the second half is bought. The split is sourced, the price is not stated and is NOT canon.', 'split c0004 p11, c0006 p12-13; price open'),
    yearDays: dial(YEAR_DAYS, 'AUTHORED', 'The source shows a year as twelve monthly cycles (rent 30 CP a month, 360 a year) and gives no day count. Authored: 30-day months, 360-day year, which also matches the engine calendar.', 'c0008 p63-65 (SHOWN arithmetic); days per month authored'),
    restart: dial('drops', 'SHOWN BASIS, dial kept', 'Whether an open loan crosses a restart. In the loop as shown, the restart returns to intake with the first-exchange loan unused again and no recovery by the sect (SHOWN). Only drops is built: the heir route copies a fixed key list that does not include this slice, so a debt that crosses a restart is not offered in this slice. A non-loop restart is not shown; the sect\'s price rule (credit never exceeds total value) is a principle, not an observed recovery.', 'loop: c0015 p6, p9-15, p86 (SHOWN); non-loop restart not shown; c0009 p66 (STATED)'),
    rent: dial(30, 'SOURCE', 'Rent is 30 CP a month (recorded only, not charged in this slice, so the prototype task rates below are not tuned against it).', 'c0003 p25'),
    taskPay: dial(5, 'AUTHORED', 'Prototype pay for one Library shelving mission. Source: missions pay mostly single digits of CP (c0003 p33, STATED); the exact figure is authored. At one mission a day (30-day month) it is about 120 CP a month, enough to meet the 460 CP yearly installment in about four months of missions, so a borrower can repay without grinding.', 'single digits c0003 p33 (STATED); 5 AUTHORED'),
    taskCost: dial(1, 'AUTHORED', 'Prototype cost of one mission: lamp oil and wax, deducted from the pay when the shift ends (so a disciple with 0 CP can still start), on top of the time.', 'AUTHORED'),
    taskMinutes: dial(480, 'AUTHORED', 'Prototype length of one mission: eight game hours of normal game time. It completes through ordinary game ticks; other play continues, but the mission cannot be started again until it ends.', 'AUTHORED'),
    rushFee: dial(2, 'AUTHORED', 'Prototype fee in CP for the elder to post an extra mission on a day that already had one. Default one posting a day; the fee is the cost path, so a player short of calendar time can pay for it.', 'AUTHORED'),
    taskPerDay: dial(1, 'AUTHORED', 'Prototype limit: one mission per game day, so repaying takes calendar time and the interest keeps running.', 'AUTHORED'),
});
export const TASK = Object.freeze({id: 'book.primordial.task.library_shelving', label: 'Sect mission: shelve scrolls in the Library',
    why: 'A modest repeating mission from the Library elder (missions mostly pay single digits of CP, c0003 p33; the task itself is AUTHORED).'});

export const FACTION = Object.freeze({
    id: 'book.primordial.credit.sect', label: 'Sect Library', region: 'Library system',
    creditScale: 1, interestScale: 1,
    why: 'The Library elder lends against a disciple\'s recorded value and keeps dated paper.',
});

export const ITEMS = Object.freeze({
    'book.primordial.item.sword_control_formula': Object.freeze({id: 'book.primordial.item.sword_control_formula', label: 'Divine Firmament Sword Control True Formula', price: 1000, status: 'SOURCE', locator: 'c0006 p32', halves: true}),
    'book.primordial.item.killing_life_curse': Object.freeze({id: 'book.primordial.item.killing_life_curse', label: 'Killing Life Curse', price: 300, status: 'SOURCE', locator: 'c0011 p46'}),
    'book.primordial.item.coiling_dragon_method': Object.freeze({id: 'book.primordial.item.coiling_dragon_method', label: 'Coiling Dragon method', price: 1500, status: 'SOURCE', locator: 'c0027 p1'}),
});
export const FORMULA = 'book.primordial.item.sword_control_formula';
// Price anchors recorded for later slices, not offered here: rent 30 CP a month (c0003 p25); merit pick
// 10 CP a month (pass K8 row, locator not reopened). Merit Pool (c0089 p61-64) is deferred.

export const CAP_GATE = defineGate({
    id: 'book.primordial.gate.credit_cap', kind: 'resource',
    requires: {fact: 'loan.requested', op: 'lte', value: {dial: 'bodyValue'}, hint: 'The sect will not lend more than you are worth to it.'},
    dials: {bodyValue: {default: DIALS.bodyValue.value}},
    reason: 'Credit never exceeds a disciple\'s total value (c0009 p66, stated).',
    routes: [{id: 'book.primordial.route.raise_value', reason: 'A higher recorded value is a higher ceiling.',
        cost: 'Authored proposal: a recorded act for the Library elder that raises your value by 300 CP; not built in this slice.'}],
});
export const FIRST_GATE = defineGate({
    id: 'book.primordial.gate.first_exchange', kind: 'resource',
    requires: {fact: 'loan.firstExchangeOpen', op: 'eq', value: true, hint: 'The zero-down offer is for a first exchange only.'},
    reason: 'The zero-down loan is offered on a disciple\'s first exchange only (c0006 p33).',
    routes: [{id: 'book.primordial.route.pay_cp', reason: 'Pay from CP in hand instead.', cost: 'The item\'s full price in CP; no CP income exists in this slice.'}],
});

export const fresh = () => ({schema: SCHEMA, loan: null, firstExchangeUsed: false, held: {}, knowsRule: false, cp: 0, shift: null, lastShiftDay: null, shifts: 0, store: {spent: 0, bought: {}}});
export const isEmpty = s => !s.loan && !s.firstExchangeUsed && !s.knowsRule && !Object.keys(s.held).length && !s.cp && !s.shift && s.lastShiftDay == null && !s.shifts && !s.store?.spent && !Object.keys(s.store?.bought ?? {}).length;

// Treasure hall (DWF154, DWF162, 2026-10-25): the sect's contribution points (CP in hand) are the institution's currency, the Library shelving mission is how they are
// earned (DWF155), and the store is rows on the shared institution store. Killing Life Curse at 300 CP is SOURCE (c0011 p46, the same price as its loan); the
// pill ingredient and the primer are AUTHORED proposals, cheap enough to reach in a few missions. The sect's standing is a separate fact.
export const CURSE = 'book.primordial.item.killing_life_curse';
export const INSTITUTION = defineInstitution({id: 'sect_library', world: WORLD_ID, name: 'Sect Library treasure hall', currency: {label: 'Contribution points', unit: 'CP'},
    evidence: ['c0003 p33 missions pay single digits of CP', 'c0011 p46 Killing Life Curse 300 CP'],
    proposals: ['Fire grass, the primer and their prices and stock are authored; the mission pay is authored (dial taskPay).'],
    missions: [{id: 'library_shelving', label: TASK.label, pay: DIALS.taskPay.value, minutes: DIALS.taskMinutes.value, issuer: 'The Library elder',
        risk: `None built: the lamp oil costs ${DIALS.taskCost.value} CP and the shift takes ${DIALS.taskMinutes.value / 60} game hours.`, text: TASK.why, evidence: 'single digits c0003 p33 (STATED); figure AUTHORED'}],
    store: [
        {id: 'fire_grass', label: 'Fire grass, a pill ingredient', kind: 'ingredient', price: 8, stock: 3, grants: {ingredient: 'Fire grass'},
            text: 'A bundle of dried fire grass from the hall shelves (AUTHORED). No pill recipe consumes it in the game yet, so it is held, not used.'},
        {id: 'breath_primer', label: 'Outer-disciple breathing primer, a technique', kind: 'technique', price: 20, stock: 1, grants: {technique: 'Outer-disciple breathing primer'},
            text: 'A copied primer for outer disciples (AUTHORED). No technique runtime reads it yet, so it is held, not learned.'},
        {id: 'killing_life_curse', label: 'Killing Life Curse, a technique', kind: 'technique', price: 300, grants: {itemId: CURSE}, gate: {rule: {fact: 'held.curse', op: 'eq', value: false}, text: 'You already hold it.'},
            text: 'The hall sells the technique outright at the same 300 CP it would lend (SOURCE c0011 p46), so a disciple with the points never needs the loan.', evidence: 'c0011 p46'}]});
export const storeRows = state => INSTITUTION.store.map(r => offerFor(INSTITUTION, r.id, {balance: state.cp, bought: state.store?.bought?.[r.id] ?? 0, facts: {'held.curse': !!state.held[CURSE]}}));
// Spend CP at the hall. Pure and atomic: it returns the new state or a refusal with every reason, and nothing changes on a refusal.
export function buy(state, rowId) {
    const row = INSTITUTION.store.find(r => r.id === rowId);
    if(!row) throw Error('The hall stocks no such thing.');
    const offer = storeRows(state).find(o => o.id === rowId);
    if(!offer.eligible) return {ok: false, reasons: offer.reasons};
    const store = {spent: (state.store?.spent ?? 0) + row.price, bought: {...(state.store?.bought ?? {}), [rowId]: (state.store?.bought?.[rowId] ?? 0) + 1}};
    return {ok: true, state: {...state, cp: state.cp - row.price, store, held: row.grants.itemId ? {...state.held, [row.grants.itemId]: 'issued'} : state.held}, paid: row.price};
}

// The sect's flat schedule (c0006 p33-36, STATED by the narrator; the 100 + 360 split is the arithmetic that
// reproduces 4,600, an inference): simple interest on the ORIGINAL principal, repaid as an equal yearly
// installment. Four quantities stay distinct and none is a lump sum:
//   INSTALLMENT        principal / years + principal x rate           (460 for 1,000)
//   accrued INTEREST   flat principal x rate a year, by the day, on the original principal (360 a year)
//   remaining PRINCIPAL falls by principal / years per fully paid installment (900 after the first)
//   TOTAL OBLIGATION   installment x years (4,600); what remains is that minus CP paid
// Payments cover installments in order. Inside one installment, interest is covered first (AUTHORED
// allocation; the source does not say). The Three Rivers Society loan (c0008, one year, bullet,
// 500 + 180 = 680) is a different lender and is NOT modeled here.
const r2 = n => Math.round(n * 100) / 100;
export const installment = loan => r2(loan.principal / loan.termYears + loan.principal * loan.rate);
export const totalDue = loan => r2(installment(loan) * loan.termYears);
const yearMin = () => DAY * DIALS.yearDays.value;
export function quantities(loan, now) {
    const inst = installment(loan), pp = loan.principal / loan.termYears, ip = loan.principal * loan.rate;
    const full = Math.min(loan.termYears, Math.floor(loan.paid / inst + 1e-9)), partial = r2(loan.paid - full * inst);
    const years = Math.min(loan.termYears, Math.max(0, (now - loan.takenAt) / yearMin()));
    const principalPaid = full * pp + Math.max(0, partial - ip);
    const totalRemaining = Math.max(0, Math.ceil(r2(totalDue(loan) - loan.paid)));
    const next = full >= loan.termYears ? null : {number: full + 1, amount: Math.ceil(r2(inst - partial)), dueAt: loan.takenAt + (full + 1) * yearMin()};
    const overdue = !!next && now > next.dueAt + GRACE_DAYS * DAY;
    return {installment: inst, accruedInterest: Math.ceil(r2(ip * years)), remainingPrincipal: Math.max(0, Math.ceil(r2(loan.principal - principalPaid))),
        totalObligation: totalDue(loan), totalRemaining, installmentsPaid: full, installmentsLeft: loan.termYears - full, next, overdue, graceDays: GRACE_DAYS};
}
export const owedNow = (loan, now) => quantities(loan, now).totalRemaining;

export function ledgerOf(state, now) {
    let ledger = createObligations();
    if(state.loan) ledger = writeObligation(ledger, obligation({id: 'book.primordial.ledger.sect_loan', kind: 'coin', debtor: 'player', creditor: FACTION.id,
        amount: owedNow(state.loan, now), why: `Borrowed ${state.loan.principal} CP from the ${FACTION.label}`, source: 'book_primordial', since: state.loan.takenAt,
        eases: 0, carries: false}));
    return ledger;
}

// Ask the Library for an item on the zero-down first exchange. Pure: returns {ok:true, state} or a refusal.
export function request(state, itemId, now) {
    const item = ITEMS[itemId];
    if(!item) throw Error('The Library holds no such item.');
    if(!Number.isFinite(now)) throw Error('The calendar is unavailable.');
    if(state.held[itemId]) return {ok: false, reasons: ['You already hold it.'], shown: [], routes: []};
    const credit = state.loan ? quantities(state.loan, now).remainingPrincipal : 0;
    const facts = {'loan.requested': credit + item.price, 'loan.firstExchangeOpen': !state.firstExchangeUsed};
    const knows = fact => state.knowsRule && fact === 'loan.requested';
    const results = [CAP_GATE, FIRST_GATE].map(g => ({gate: g, r: evaluateGate(g, facts, {knows})}));
    const failed = results.filter(x => !x.r.met);
    if(failed.length) return {ok: false, reasons: failed.map(x => x.gate.reason), shown: [...new Set(failed.flatMap(x => x.r.shown))], routes: failed.flatMap(x => x.gate.routes)};
    const loan = {principal: item.price, rate: DIALS.ratePerYear.value, termYears: DIALS.termYears.value, takenAt: now, paid: 0, itemId};
    return {ok: true, state: {...state, loan, firstExchangeUsed: true, held: {...state.held, [itemId]: item.halves ? 'first half issued' : 'issued'}}};
}
export const askHowCreditIsWeighed = state => ({...state, knowsRule: true});

// The sect mission: starting costs nothing up front; when the eight game hours have passed on the game
// clock the pay (minus the cost) lands in the CP in hand. Settling is driven by ticks (and by any command),
// never by wall time, so it follows time spent sleeping, working or travelling.
export const dayOf = now => Math.floor(now / DAY);
export function startShift(state, now, {rush = false} = {}) {
    if(!Number.isFinite(now)) throw Error('The calendar is unavailable.');
    if(state.shift) return {ok: false, reason: 'A mission is already under way.'};
    const sameDay = state.lastShiftDay === dayOf(now);
    if(sameDay && !rush) return {ok: false, reason: `The elder posts ${DIALS.taskPerDay.value} mission a day (prototype). Come back tomorrow, or pay ${DIALS.rushFee.value} CP for a rush posting today.`};
    if(sameDay && state.cp < DIALS.rushFee.value) return {ok: false, reason: `A rush posting costs ${DIALS.rushFee.value} CP and you hold ${state.cp}. Come back tomorrow.`};
    return {ok: true, state: {...state, shift: {startedAt: now}, lastShiftDay: dayOf(now), cp: sameDay ? state.cp - DIALS.rushFee.value : state.cp}};
}
export function settle(state, now) {
    if(!state.shift || !Number.isFinite(now) || now < state.shift.startedAt + DIALS.taskMinutes.value) return state;
    return {...state, shift: null, shifts: state.shifts + 1, cp: state.cp + DIALS.taskPay.value - DIALS.taskCost.value};
}

// Pays toward the loan from CP in hand (the only way it shrinks). Atomic: it returns the new state or throws
// before anything changes. Whole CP; a payment past the total is trimmed to what remains.
export function repay(state, amount, now) {
    if(!state.loan) throw Error('You owe the Library nothing.');
    if(!Number.isInteger(amount) || amount < 1) throw Error('Repay a whole number of CP.');
    const left = quantities(state.loan, now).totalRemaining, pay = Math.min(amount, left);
    if(pay > state.cp) throw Error(`You hold ${state.cp} CP and this payment is ${pay} CP. Nothing was paid.`);
    const loan = {...state.loan, paid: r2(state.loan.paid + pay)};
    return {state: {...state, cp: state.cp - pay, loan: left - pay <= 0 ? null : loan}, paid: pay};
}

export const CARRY_ROWS = Object.freeze([
    {boundary: 'death', what: 'Body and wealth', carries: 'drops', scope: 'this life', note: 'Nothing but memory and the chosen base cheat crosses without a carrier (AD11).'},
    {boundary: 'rebirth', what: 'Memories', carries: 'carries', scope: 'any life', note: 'Knowledge of people, routes and lines stays.'},
    {boundary: 'rebirth', what: 'Chosen base cheat', carries: 'carries', scope: 'any life', note: 'Authored proposal: it grows with the life and does not reset.'},
    {boundary: 'rebirth', what: 'Open obligations', carries: DIALS.restart.value, scope: 'this life', note: 'A restart returns to intake with the first-exchange loan unused (SHOWN BASIS in the loop, c0015 p6, p9-15, p86); no recovery by the sect is shown. A restart that is not an intake reset is not shown, so this stays a dial.'},
]);

export function validateSlice(s) {
    if(s == null) return s;
    const bad = m => { throw Error(`Primordial credit: ${m}`); };
    if(s.schema !== SCHEMA) bad('unknown schema.');
    if(typeof s.firstExchangeUsed !== 'boolean' || typeof s.knowsRule !== 'boolean') bad('bad flags.');
    if(!s.held || typeof s.held !== 'object') bad('bad held items.');
    for(const k of Object.keys(s.held)) if(!ITEMS[k]) bad('unknown item.');
    if(!Number.isInteger(s.cp ?? 0) || (s.cp ?? 0) < 0 || !Number.isInteger(s.shifts ?? 0) || (s.shifts ?? 0) < 0) bad('bad CP.');
    const st = s.store ?? {spent: 0, bought: {}};
    if(!Number.isInteger(st.spent) || st.spent < 0 || !st.bought || typeof st.bought !== 'object') bad('bad treasure hall record.');
    for(const [k, n] of Object.entries(st.bought)) { const r = INSTITUTION.store.find(x => x.id === k); if(!r || !Number.isInteger(n) || n < 1 || (r.stock != null && n > r.stock)) bad('bad treasure hall purchase.'); }
    if(s.shift != null && !Number.isFinite(s.shift.startedAt)) bad('bad mission.');
    if(s.lastShiftDay != null && !Number.isFinite(s.lastShiftDay)) bad('bad mission day.');
    if(s.loan != null) {
        for(const k of ['principal', 'rate', 'termYears', 'takenAt', 'paid']) if(!Number.isFinite(s.loan[k]) || s.loan[k] < 0) bad('bad loan.');
        if(!ITEMS[s.loan.itemId]) bad('loan names an unknown item.');
    }
    return s;
}
export const migrate = s => s == null ? fresh() : {...fresh(), ...structuredClone(s), schema: SCHEMA};
