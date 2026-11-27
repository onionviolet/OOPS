// Klein's weekly wage after the story window (lead core-flow audit, ordinary-day round 2026-11-14, loop K1). The canon terms are on his save:
// the contract note `book.lotm.kj3f.contract.terms` (two pounds ten soli a week plus ten soli for risk, ch ~9) and the advance slip
// `book.lotm.kj3h.advance.slip` (twelve pounds, four weeks' pay, repaid at half the weekly pay). The story replay pays the canon weeks it shows as
// scenes and never takes the advance back, so the ordinary weeks start from his own "Draw the weekly pay" and the whole advance is still owed then.
// Same shape as book_world_lotm_pay.js (the money seam's copy target): pure, one native purse effect per collection, progress as a SET fact
// (`book.lotm.wage.paid`, whole weeks), elapsed weeks derived from the `.at` of the start note. No slice, no second money counter (ECX6).
// Defaults are dials with reasons (AD56); changing one changes only the next collection.
import {purseEffect} from './own_holdings.js';
import {coinWords} from './return_digest.js';
import {formatDuration} from './number_format.js';
import {LOTM_IDS as I, LOTM_PENCE as P} from './book_world_lotm_ids.js';

export const WAGE_WEEK = 7 * 24 * 60;
export const WAGE_CONTRACT_NOTE = 'book.lotm.kj3f.contract.terms';
export const WAGE_ADVANCE_NOTE = 'book.lotm.kj3h.advance.slip';
export const WAGE_START_NOTE = 'book.lotm.wage.start';
export const WAGE_PAID_FACT = 'book.lotm.wage.paid';
export const WAGE_DIALS = Object.freeze({
    weeklyPence: {value: 3 * P.pound, why: 'Stated: two pounds ten soli a week plus ten soli for risk and confidentiality (the contract note).'},
    advancePence: {value: 12 * P.pound, why: 'Stated: twelve pounds drawn from Mrs. Orianna, four weeks of pay (the advance slip).'},
    keptShare: {value: 0.5, why: 'Stated: the advance is repaid at half the weekly pay, so eight weeks at one pound ten soli kept.'},
    start: {value: 'his own first draw', why: 'The replay never takes the advance back, so the ordinary weeks count from the day he starts drawing pay and the whole advance is owed then.'}
});
export const wageWords = coinWords();
const SITUATION = 'book.lotm.tingen.canon_beside'; // LOTM_CAST_SITUATION (book_world_lotm_cast_host.js), as book_world_lotm_pay.js names it
const known = state => state?.simulation?.knowledge?.player || {};
const paidOf = state => {const n = state?.actors?.player?.facts?.[WAGE_PAID_FACT]; return Number.isSafeInteger(n) && n >= 0 ? n : 0;};
const kept = (week, d = WAGE_DIALS) => {const half = d.weeklyPence.value * d.keptShare.value, before = (week - 1) * half;
    return Math.max(0, Math.min(half, d.advancePence.value - before));};

export function nextWageWeek(view) {
    const withheld = view.advance ? kept((view.closed ?? 0) + 1) : 0;
    return {withheld, takeHome: view.weeklyPence - withheld};
}

// {eligible, started, closed, paid, owedWeeks, gross, kept, net, advanceLeft, nextAt} for the lead life; null elsewhere or before the contract.
export function wageView(state) {
    if(state?.actors?.player?.worldId !== I.world || !known(state)[WAGE_CONTRACT_NOTE]) return null;
    const advance = !!known(state)[WAGE_ADVANCE_NOTE], at = known(state)[WAGE_START_NOTE]?.at;
    const dials = advance ? WAGE_DIALS : {...WAGE_DIALS, advancePence: {value: 0}};
    if(!Number.isFinite(at)) return {started: false, advance, weeklyPence: WAGE_DIALS.weeklyPence.value, advanceLeft: dials.advancePence.value};
    const closed = Math.max(0, Math.floor((state.clock - at) / WAGE_WEEK)), paid = Math.min(paidOf(state), closed);
    let keptNow = 0;
    for(let w = paid + 1; w <= closed; w++) keptNow += kept(w, dials);
    let keptBefore = 0;
    for(let w = 1; w <= paid; w++) keptBefore += kept(w, dials);
    const owedWeeks = closed - paid, gross = owedWeeks * WAGE_DIALS.weeklyPence.value;
    return {started: true, advance, closed, paid, owedWeeks, gross, kept: keptNow, net: gross - keptNow,
        advanceLeft: dials.advancePence.value - keptBefore, nextAt: at + (closed + 1) * WAGE_WEEK, nextIn: at + (closed + 1) * WAGE_WEEK - state.clock, weeklyPence: WAGE_DIALS.weeklyPence.value};
}
const note = (key, value) => ({type: 'knowledge', actor: 'player', key, stage: 'seen', value, basis: {kind: 'observation', attributedTo: 'player', situationId: SITUATION}});
const fact = value => ({type: 'fact', scope: 'actor', actor: 'player', key: WAGE_PAID_FACT, value});
export function wageStartEffects(state) {
    const v = wageView(state);
    if(!v) throw Error('There is no Nighthawk contract to draw pay on.');
    if(v.started) throw Error('You already draw your weekly pay.');
    return [note(WAGE_START_NOTE, `You draw your pay weekly from Mrs. Orianna: ${wageWords(v.weeklyPence)} a week${v.advance ? `, half of it kept until the advance of ${wageWords(v.advanceLeft)} is repaid` : ''}.`), fact(0)];
}
// The closed weeks not yet collected: one purse effect for what is handed over, the paid count SET to the closed weeks, one line.
export function wageCollectEffects(state) {
    const v = wageView(state);
    if(!v?.started) throw Error('You do not draw a weekly pay yet.');
    if(!v.owedWeeks) throw Error(`Nothing to collect yet: Mrs. Orianna pays a week when it closes, in ${formatDuration(v.nextAt - state.clock)}.`);
    const left = v.advanceLeft - v.kept, weeks = v.owedWeeks === 1 ? `week ${v.closed}` : `weeks ${v.paid + 1} to ${v.closed}`;
    const line = `Mrs. Orianna paid you ${wageWords(v.net)} for ${weeks}${v.kept ? `; she kept ${wageWords(v.kept)} against the advance (${left ? `${wageWords(left)} still owed` : 'now repaid'})` : ''}.`;
    return {effects: [...(v.net ? [purseEffect(v.net)] : []), fact(v.closed), note(`book.lotm.wage.week${v.closed}`, line)], line, view: v};
}
