// P3c loyalty and debt: derived reads over episodes (LSD408-LSD411). Nothing here is saved.
import {isHarm, payload} from './person_episode.js';
import {vividness} from './person_memory.js';
import {DEFAULT_TEMPERAMENT} from './person_temperament.js';

export const LOYALTY_TABLE = Object.freeze({id: 'memory.loyalty', revision: 1,
    // Weight of each kind of act. Risk, shared hardship and kept confidences count far more than a favour.
    acts: Object.freeze({favour: 1, hardship: 3, risk: 5, kept_quiet: 4, payment: 0.25, silence_ask: 0, apology: 1}),
    timeEach: 0.1, max: 20, betrayal: 6, repayDays: 60, debtPerFeeling: 1, resentAt: 2,
});
export const LOYALTY_REASONS = Object.freeze({
    acts: 'Costly acts earn more loyalty than cheap ones; a payment buys little.', timeEach: 'Days together add loyalty slowly.',
    max: 'Loyalty has a ceiling before opposed goals lower it.', betrayal: 'A betrayal removes a large share of earned loyalty.',
    repayDays: 'An unpaid debt sours after this many days.', resentAt: 'Owing at least this much for that long becomes resentment.',
});
const actOf = e => {const t = payload(e)?.topic; return t && Object.hasOwn(LOYALTY_TABLE.acts, t) ? t : e.kind === 'helped' ? 'favour' : null;};
// holder's loyalty to subject. `opposed` are goal conflicts [{strength}] that cap it; a guess until a test is passed.
export function loyaltyOf({rows, subject, day, temperament = DEFAULT_TEMPERAMENT, opposed = [], table = LOYALTY_TABLE, limits}) {
    const groups = new Map(); let betrayed = 0, tested = false; const days = new Set();
    for (const e of rows) {
        if (e.about !== subject || e.kind === 'impression') continue;
        const act = actOf(e);
        if (e.kind === 'betrayed' || (isHarm(e) && payload(e)?.topic === 'broke_confidence')) { betrayed += Math.abs(e.feeling) * vividness(e, day, temperament, limits); continue; }
        if (!act || !['helped', 'amends'].includes(e.kind)) continue;
        if (act === 'kept_quiet' || act === 'risk') tested = true;
        const w = (table.acts[act] ?? 1) * Math.abs(e.feeling) ** 0.5 * vividness(e, day, temperament, limits);
        groups.set(act, [...(groups.get(act) || []), w]); days.add(e.day);
    }
    // Diminishing returns: within one kind of act the n-th contribution counts 1/n.
    let raw = 0;
    for (const ws of groups.values()) ws.sort((a, b) => b - a).forEach((w, i) => { raw += w / (i + 1); });
    raw += days.size * table.timeEach;
    const cap = Math.max(0, table.max - opposed.reduce((t, g) => t + (g.strength || 0), 0));
    const value = Math.max(0, Math.min(raw, cap) - betrayed * table.betrayal);
    return {value, raw, cap, tested, shown: tested ? Math.round(value * 10) / 10 : 'a guess', betrayed: betrayed > 0};
}
// holder's debt to subject: what subject did for holder, less what holder did back. Unpaid long enough, it sours.
export function debtOf({rows, theirRows = [], holder, subject, day, temperament = DEFAULT_TEMPERAMENT, table = LOYALTY_TABLE, limits}) {
    const owed = rows.filter(e => e.about === subject && e.kind === 'helped' && payload(e) && !['payment', 'silence_ask'].includes(payload(e).topic)).reduce((t, e) => ({sum: t.sum + e.feeling * vividness(e, day, temperament, limits) * table.debtPerFeeling, oldest: Math.min(t.oldest, e.day)}), {sum: 0, oldest: Infinity});
    const back = theirRows.filter(e => e.about === holder && ['helped', 'amends'].includes(e.kind)).reduce((t, e) => t + e.feeling, 0);
    const outstanding = Math.max(0, owed.sum - back);
    const age = Number.isFinite(owed.oldest) ? day - owed.oldest : 0;
    return {owed: outstanding, resentment: outstanding >= table.resentAt && age >= table.repayDays ? outstanding : 0, repaid: outstanding === 0 && owed.sum > 0};
}
