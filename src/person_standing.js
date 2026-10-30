// Player-facing read of how one person stands toward another: severity, loyalty, debt and lies (LSD408-LSD416, LSD422).
// Derived on every read from episodes and claims; nothing here is saved.
import {readMemories, decodeClaims, vividness} from './person_memory.js';
import {payload, isHarm} from './person_episode.js';
import {standingRung, SEVERITY_TABLE} from './person_severity.js';
import {loyaltyOf, debtOf} from './person_loyalty.js';
import {compareClaims} from './person_silence.js';
import {MEMORY_LIMITS, temperamentOf as defaultTemperamentOf} from './person_temperament.js';

const RUNG_WORDS = Object.freeze({trivial: 'a trivial matter', minor: 'a minor slight', serious: 'serious', grave: 'grave', life_changing: 'life-changing'});
const CLAIM_WORDS = Object.freeze({'claim.only_asked': 'you only asked him for a moment'});
const TRUTH_WORDS = Object.freeze({interruption: 'you interrupted his counting at the bench'});
export function standingView({memory, holder, subject, day, temperamentOf = defaultTemperamentOf, limits = MEMORY_LIMITS, relative = {}}) {
    const t = temperamentOf(holder), rows = readMemories(memory, holder, day, {limits}), table = SEVERITY_TABLE;
    const harms = rows.filter(e => e.about === subject && isHarm(e) && payload(e) && !['threat'].includes(payload(e).topic));
    const worst = harms.map(e => ({e, rung: standingRung(e, {rows, day, temperament: t, relative, table})}))
        .sort((a, b) => table.rungs.indexOf(b.rung) - table.rungs.indexOf(a.rung) || vividness(b.e, day, t, limits) - vividness(a.e, day, t, limits))[0];
    const loyalty = loyaltyOf({rows, subject, day, temperament: t, limits});
    const debt = debtOf({rows, theirRows: readMemories(memory, subject, day, {limits}), holder, subject, day, temperament: t, limits});
    const claims = decodeClaims(memory).filter(c => c.speaker === subject).map(c => {
        const topic = payload({fact: c.fact})?.topic, cmp = compareClaims([c], c.fact, c.fact);
        return {says: CLAIM_WORDS[c.says] || c.says, truth: TRUTH_WORDS[topic] || 'what happened', differs: cmp.conflict};
    });
    return {severity: worst ? {rung: worst.rung.id, word: RUNG_WORDS[worst.rung.id], reach: worst.rung.reach, topic: payload(worst.e).topic} : null,
        loyalty: {shown: loyalty.shown, tested: loyalty.tested}, debt: {owed: Math.round(debt.owed * 10) / 10, resentment: Math.round(debt.resentment * 10) / 10}, claims};
}
export function standingLines(v) {
    const out = [];
    if (v.severity) out.push(`He weighs the interruption as ${v.severity.word}; it would travel as far as the ${v.severity.reach}.`);
    out.push(typeof v.loyalty.shown === 'number' ? `His loyalty to you is tested: ${v.loyalty.shown}.` : 'His loyalty to you is a guess: nothing has tested it yet.');
    out.push(v.debt.resentment > 0 ? `He resents that he owes you ${v.debt.resentment}.` : v.debt.owed > 0 ? `He feels he owes you a little (${v.debt.owed}).` : 'He owes you nothing.');
    for (const c of v.claims) out.push(`You told Tamsin ${c.says}${c.differs ? `, but the record shows ${c.truth}` : ''}.`);
    return out;
}
