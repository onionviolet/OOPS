// FD8: save-backed recurring duties on the shared obligations ledger. Owns the namespaced slice 'duties@1'
// ({lastDone: {dutyId: cycle}, missed: {dutyId: count}}); a world supplies defs {id, schedule, debtor, creditor, why, source}.
// Rows are derived, not stored, so the ledger never drifts from the slice. Pure: the host passes the minute.
import {dutyState, lastClosedCycle, validateSchedule} from './world_rhythm.js';
import {createObligations, writeObligation, obligation} from './obligations_ledger.js';
export const DUTIES_FAMILY = 'duties@1';
const nat = n => Number.isInteger(n) && n >= 0;
// policy: the player's standing order per duty id (only a chosen one is stored); late: cycles whose payment a pay_late order has deferred.
export const freshDuties = () => ({family: DUTIES_FAMILY, lastDone: {}, missed: {}, closed: {}, policy: {}, late: {}});
// OB1 standing orders. `bribe` exists only where a def carries `official: true` (a clerk or officer, not a landlady). `hide_income` is a GAP:
// no income-reporting owner exists yet, so it is not offered.
export const POLICIES = Object.freeze(['pay_on_time', 'pay_late', 'pay_part', 'dispute', 'bribe', 'skip']);
const POLICY_WORDS = Object.freeze({pay_on_time: 'pay on time', pay_late: 'pay a week late', pay_part: 'pay part', dispute: 'dispute it', bribe: 'bribe the official', skip: 'skip it'});
const BASE_ALLOWED = Object.freeze(['pay_on_time', 'pay_late', 'pay_part', 'dispute', 'skip']);
export const allowedOf = d => (d.policy?.allowed ?? (d.official ? [...BASE_ALLOWED, 'bribe'] : BASE_ALLOWED)).filter(p => POLICIES.includes(p) && (p !== 'bribe' || d.official === true));
// Dials, per def (`dues.partShare`, `dues.dispute`, `dues.bribe`, `dues.seizure`); defaults are authored proposals (AD32).
export const duesDials = d => {
    const x = d.dues ?? {};
    return {partShare: x.partShare ?? 0.5, dispute: {delayDays: 3, chance: 0.4, cut: 0.5, ...x.dispute}, bribe: {share: 0.6, risk: 0.15, ...x.bribe}, seizure: {atMisses: 6, ...x.seizure}};
};
const pct = n => `${Math.round(n * 100)}%`;
// The select's text: the choice and its in-world cost, read from the def's own dials.
export function policyOption(d, id) {
    const k = duesDials(d), words = POLICY_WORDS[id];
    const cost = {pay_on_time: 'the full amount, no trouble', pay_late: 'a week behind; short of coin it counts as missed', pay_part: `${pct(k.partShare)} a week; the rest builds into a missed week`,
        dispute: `one week held ${k.dispute.delayDays} days while it is answered; may be cut ${pct(k.dispute.cut)}, or you pay in full; more weeks while it is open count as missed`,
        bribe: `${pct(k.bribe.share)} of the dues to the official each week, kept even if refused (${pct(k.bribe.risk)} chance), and then the week is missed`, skip: 'pay nothing; misses pile up toward a fine and goods taken'}[id];
    return `${words} (${cost})`;
}
// A save without the slice (or an unreadable one) loads as fresh: older saves keep working, nothing is owed retroactively.
export function migrateDuties(slice) {
    if(!slice || slice.family !== DUTIES_FAMILY) return freshDuties();
    const clean = o => Object.fromEntries(Object.entries(o && typeof o === 'object' ? o : {}).filter(([k, v]) => k && nat(v)));
    const policy = Object.fromEntries(Object.entries(slice.policy && typeof slice.policy === 'object' ? slice.policy : {}).filter(([k, v]) => k && POLICIES.includes(v)));
    const base = {family: DUTIES_FAMILY, lastDone: clean(slice.lastDone), missed: clean(slice.missed), closed: clean(slice.closed), policy, late: clean(slice.late)};
    // Additive keys (OB1/OB2): written only when non-empty, so a life without them stays byte-identical.
    const obj = o => (o && typeof o === 'object' ? Object.entries(o) : []);
    const dispute = Object.fromEntries(obj(slice.dispute).filter(([k, v]) => k && nat(v?.cycle) && nat(v?.answerAt)).map(([k, v]) => [k, {cycle: v.cycle, answerAt: v.answerAt}]));
    const last = Object.fromEntries(obj(slice.last).filter(([k, v]) => k && v && typeof v.kind === 'string' && nat(v.at) && typeof v.line === 'string').map(([k, v]) => [k, {...v}]));
    return withExtras(base, {short: clean(slice.short), dispute, last});
}
// short: pence of part-payments not yet a full missed week; dispute: the one held week per duty {cycle, answerAt}; last: the latest dated event per duty
// ({kind: dispute|seizure|bribe_refused, at, line, ...}). Absent when empty.
export const withExtras = (slice, extras) => {
    const out = {...slice};
    for(const [k, v] of Object.entries(extras)) { if(Object.keys(v).length) out[k] = v; else delete out[k]; }
    return out;
};
export function validateDuties(slice) {
    if(slice?.family !== DUTIES_FAMILY) throw Error('Duties: wrong family.');
    return slice;
}
const find = (defs, id) => defs.find(d => d.id === id) ?? (() => { throw Error(`Unknown duty ${id}.`); })();
// Attend the duty this cycle; throws when its window is not open (the caller's act decides what that costs).
export function attendDuty(slice, defs, id, minute) {
    const d = find(defs, id);
    if(d.dues) throw Error('That is paid by your standing order, not by hand.');
    const s = dutyState(d.schedule, minute, slice.lastDone[id]);
    if(!s.open) throw Error(s.reason || 'Not open.');
    return {...slice, lastDone: {...slice.lastDone, [id]: s.cycle}};
}
// Count cycles whose window shut unattended, once each: `closed` is the first cycle not yet accounted. Returns {slice, newMisses:{id:n}}.
export function settleMisses(slice, defs, minute) {
    const missed = {...slice.missed}, closed = {...slice.closed}, newMisses = {};
    for(const d of defs) {
        validateSchedule(d.schedule);
        const upTo = lastClosedCycle(d.schedule, minute), from = closed[d.id] ?? upTo + 1;
        if(upTo < from) { closed[d.id] = from; continue; }
        const attended = slice.lastDone[d.id] != null && slice.lastDone[d.id] >= from && slice.lastDone[d.id] <= upTo ? 1 : 0;
        const n = upTo - from + 1 - attended;
        if(n > 0) { missed[d.id] = (missed[d.id] ?? 0) + n; newMisses[d.id] = n; }
        closed[d.id] = upTo + 1;
    }
    return {slice: {...slice, missed, closed}, newMisses};
}
// A duty set that is inactive (holidays, before the life is at school) owes nothing for that stretch: close its cycles without counting,
// so they are not charged as misses when the set becomes active again. Only a def already tracked (`closed` set) moves.
export function skipInactive(slice, defs, minute) {
    const closed = {...slice.closed};
    let moved = false;
    for(const d of defs) {
        if(closed[d.id] == null) continue;
        validateSchedule(d.schedule);
        const next = lastClosedCycle(d.schedule, minute) + 1;
        if(next > closed[d.id]) { closed[d.id] = next; moved = true; }
    }
    return moved ? {...slice, closed} : slice;
}
// ---- Dues with a standing order (OB1/OB2/OB4). A def may carry `policy` {default, allowed?, reason} and `dues` {amount (pence), basis,
// payer text, lateCycles (dial), steps:[{atMisses, kind, line}] (dial)}. Defs without `dues` never reach this path (settleMisses is untouched).
export const policyOf = (slice, d) => {
    const p = slice.policy?.[d.id];
    return POLICIES.includes(p) && allowedOf(d).includes(p) ? p : d.policy?.default ?? 'pay_on_time';
};
export function setPolicy(slice, defs, id, value) {
    const d = find(defs, id);
    if(!d.policy) throw Error('That duty has no standing order.');
    if(!POLICIES.includes(value) || !allowedOf(d).includes(value)) throw Error('That is not a choice for this duty.');
    return {...slice, policy: {...slice.policy, [id]: value}};
}
// Escalation is state: the highest step whose miss count has been reached. No draw, no clock; grace is the steps' own thresholds.
export const escalationOf = (d, missed) => (d.dues?.steps ?? []).filter(s => missed >= s.atMisses).at(-1) ?? null;
// A stable draw in [0, 1) from a string key (FNV-1a). A world passes its own seeded `draw(key)` to settleDues; this is the fallback.
export function keyedDraw(key) {
    let h = 2166136261;
    for(let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h / 4294967296;
}
const DAY = 1440;
// Close every unaccounted cycle of each dues def, once. `balance` is what the purse holds; payments are totalled so the host debits once,
// atomically (the caller commits the returned slice only when that debit lands). Returns {slice, total, paid:[{id,cycle,amount,kind?}], newMisses}.
// Every outcome is a function of the slice and the minute (draws are keyed by duty and cycle), so one long jump equals the same weeks ticked singly.
export function settleDues(slice, defs, minute, balance, draw = keyedDraw) {
    const missed = {...slice.missed}, closed = {...slice.closed}, late = {...slice.late}, short = {...slice.short}, dispute = {...slice.dispute}, last = {...slice.last};
    const newMisses = {}, paid = [];
    let bal = balance, total = 0;
    for(const d of defs) {
        if(!d.dues) continue;
        validateSchedule(d.schedule);
        const upTo = lastClosedCycle(d.schedule, minute), from = closed[d.id] ?? upTo + 1, amt = d.dues.amount, grace = d.dues.lateCycles ?? 1, k = duesDials(d);
        const miss = () => { missed[d.id] = (missed[d.id] ?? 0) + 1; newMisses[d.id] = (newMisses[d.id] ?? 0) + 1; };
        const take = (c, a = amt, kind) => { if(!(bal >= a)) return false; bal -= a; total += a; paid.push(kind ? {id: d.id, cycle: c, amount: a, kind} : {id: d.id, cycle: c, amount: a}); return true; };
        // Paying a cycle also clears one old miss when the purse can carry it: back rent first, a forgiving landlady (ECR21).
        const settle = c => { if(!take(c)) { miss(); return; } if((missed[d.id] ?? 0) > 0 && take(c)) missed[d.id]--; };
        // The creditor answers a dispute once: a seeded draw keyed by duty and week. Granted: the held week is paid at the cut rate. Refused: in full.
        const answer = at => {
            const o = dispute[d.id];
            if(!o || o.answerAt > at) return;
            delete dispute[d.id];
            const granted = draw(`dispute:${d.id}:${o.cycle}`) < k.dispute.chance, cut = Math.round(amt * k.dispute.cut);
            last[d.id] = {kind: 'dispute', at: o.answerAt, granted, line: granted
                ? (k.dispute.grantLine ?? `Your dispute is heard and allowed: that week is cut by ${pct(k.dispute.cut)}.`)
                : (k.dispute.denyLine ?? 'Your dispute is heard and refused: that week is owed in full.')};
            if(granted) { if(!take(o.cycle, amt - cut)) miss(); } else settle(o.cycle);
        };
        if(upTo < from) { closed[d.id] = from; answer(minute); continue; }
        for(let c = from; c <= upTo; c++) {
            answer(c * d.schedule.period + d.schedule.closes);
            if(slice.lastDone[d.id] === c) continue;
            const pol = policyOf(slice, d);
            if(pol === 'pay_late') {
                if((late[d.id] ?? 0) >= grace) { settle(c); late[d.id]--; }
                late[d.id] = (late[d.id] ?? 0) + 1;
                continue;
            }
            while((late[d.id] ?? 0) > 0) { if(pol === 'skip') miss(); else settle(c); late[d.id]--; }
            if(pol === 'skip') miss();
            else if(pol === 'pay_part') {
                const part = Math.ceil(amt * k.partShare);
                if(take(c, part, 'part')) { short[d.id] = (short[d.id] ?? 0) + amt - part; while(short[d.id] >= amt) { short[d.id] -= amt; miss(); } } else miss();
            } else if(pol === 'dispute') {
                if(dispute[d.id]) miss(); // one week is held at a time; the rest count
                else dispute[d.id] = {cycle: c, answerAt: c * d.schedule.period + d.schedule.closes + k.dispute.delayDays * DAY};
            } else if(pol === 'bribe') {
                if(!take(c, Math.ceil(amt * k.bribe.share), 'bribe')) miss();
                else if(draw(`bribe:${d.id}:${c}`) < k.bribe.risk) { miss(); last[d.id] = {kind: 'bribe_refused', at: minute, line: k.bribe.refusedLine ?? 'The official pockets your money and still writes the week up as unpaid.'}; }
            } else settle(c);
        }
        closed[d.id] = upTo + 1;
        answer(minute);
    }
    return {slice: withExtras({...slice, missed, closed, late}, {short, dispute, last}), total, paid, newMisses};
}
// ---- OB2 seizure. At `dues.seizure.atMisses` (default 6) the creditor takes goods worth the arrears, by a stated rule: lowest unit value first, never
// equipped or quest items, whole units only, stopping as soon as the arrears are covered. goods: [{key, name, value (pence/unit), qty, equipped?, quest?}].
// Returns null when nothing is due or nothing can be taken; else {picks:[{key, name, qty, value}], taken, weeks}. `weeks` of arrears are cleared.
export function planSeizure(d, missedCount, goods) {
    if(!d.dues || !(missedCount >= duesDials(d).seizure.atMisses)) return null;
    const need = missedCount * d.dues.amount, picks = [];
    let taken = 0;
    const order = goods.filter(g => !g.equipped && !g.quest && g.value > 0 && g.qty > 0).sort((a, b) => a.value - b.value || String(a.key).localeCompare(String(b.key)));
    for(const g of order) {
        if(taken >= need) break;
        const qty = Math.min(g.qty, Math.ceil((need - taken) / g.value));
        picks.push({key: g.key, name: g.name ?? g.key, qty, value: g.value}); taken += qty * g.value;
    }
    if(!picks.length) return null;
    return {picks, taken, weeks: taken >= need ? missedCount : Math.min(missedCount, Math.floor(taken / d.dues.amount))};
}
// The line the player reads once goods are taken; held in `last` so a panel or a consequence reader can show it later.
export function applySeizure(slice, d, plan, minute) {
    const missed = {...slice.missed, [d.id]: Math.max(0, (slice.missed[d.id] ?? 0) - plan.weeks)};
    const list = plan.picks.map(p => `${p.qty} x ${p.name}`).join(', ');
    return withExtras({...slice, missed}, {short: slice.short ?? {}, dispute: slice.dispute ?? {}, last: {...slice.last, [d.id]: {kind: 'seizure', at: minute, weeks: plan.weeks, taken: plan.taken, items: plan.picks, line: `${duesDials(d).seizure.who ?? 'The creditor'} took ${list} against ${plan.weeks} ${plan.weeks === 1 ? 'week' : 'weeks'} of arrears.`}}});
}
// Ledger rows for the owed panel: one duty row per def that is due or has unanswered misses. `since` is the window's opening minute.
export function dutyRows(slice, defs, minute) {
    let ledger = createObligations();
    for(const d of defs) {
        const s = dutyState(d.schedule, minute, slice.lastDone[d.id]), m = slice.missed[d.id] ?? 0;
        if(s.status !== 'due' && s.status !== 'late' && !m) continue;
        const esc = escalationOf(d, m), standing = d.dues ? ` Standing order: ${POLICY_WORDS[policyOf(slice, d)]}.` : '';
        const note = `${standing}${m ? ` Missed ${m} time${m === 1 ? '' : 's'}.` : ''}${esc ? ` ${esc.line}` : ''}`;
        ledger = writeObligation(ledger, obligation({id: `duty:${d.id}`, kind: 'duty', debtor: d.debtor, creditor: d.creditor, amount: 1,
            why: `${d.why}${s.status === 'late' ? ' The window has shut for this round.' : ''}${note}`, source: d.source, since: s.cycle * d.schedule.period + d.schedule.opens, carries: false}));
    }
    return ledger.rows;
}
// A miss is answered (apologised for, made up) by the world's own act; this clears the count.
export const policyWords = id => POLICY_WORDS[id];
export const answerMisses = (slice, id) => ({...slice, missed: {...slice.missed, [id]: 0}});
