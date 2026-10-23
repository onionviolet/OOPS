// Pledges: one namespaced slice `pledges` (vows, tempering trial, rune record, worn talisman) and the pure
// transitions over it. The domain (pledges_domain.js) supplies the clock, the roll and the item debits.
import {natural as nat} from './basics.js';
import {evaluateGate} from './progression_gates.js';
import {createVowState, takeVow, breakVow, vowBonuses, vowScar, validateVowState} from './vow_rules.js';
import {createTrialState, riskFor, quoteSafeBreakthrough, attemptBreakthrough, validateTrialState} from './breakthrough_trial.js';
import {createRuneRecord, recordPair, readTalisman, readPair, coverage, validateRuneRecord} from './rune_grammar.js';
import {vowRules, trialRules, runeGrammar, temperingGate, stageNeed, TRACK_STATS, STAGE_BONUS, DEMON_PENALTY, EFFECT_STATS, TALISMAN_MINUTES, STAGE_NAMES} from './pledges_content.js';

export const PLEDGES_FAMILY = 'progression.pledges@1';
const fail = message => { throw new Error(message); };
export const fresh = () => ({family: PLEDGES_FAMILY, vows: createVowState(), trial: {...createTrialState(), stage: 0, attempts: 0}, runes: createRuneRecord(), talisman: null});
export const isFresh = s => !Object.keys(s.vows.kept).length && !Object.keys(s.vows.broken).length && s.trial.stage === 0 && s.trial.attempts === 0 && !s.trial.pressure && !s.runes.pairs.length && !s.talisman;

export function validate(s) {
    if(s?.family !== PLEDGES_FAMILY) fail('Unsupported pledges slice.');
    validateVowState(vowRules, s.vows); validateTrialState(s.trial);
    if(!nat(s.trial.stage) || s.trial.stage > 3 || !nat(s.trial.attempts)) fail('Invalid tempering record.');
    validateRuneRecord(runeGrammar, s.runes);
    if(s.talisman != null) {
        const t = s.talisman;
        if(!Array.isArray(t.runes) || !nat(t.at) || !nat(t.until) || t.until < t.at || !t.effects || typeof t.effects !== 'object') fail('Invalid worn talisman.');
        readTalisman(runeGrammar, t.runes);
        for(const e of Object.keys(t.effects)) if(!EFFECT_STATS[e]) fail(`Unknown talisman effect ${e}.`);
    }
    return s;
}
export const migrate = slice => slice == null ? fresh() : structuredClone(validate(slice));

export const vowTake = (s, id, at) => ({...s, vows: takeVow(vowRules, s.vows, id, at)});
export const vowBreak = (s, id, at) => ({...s, vows: breakVow(vowRules, s.vows, id, at)});

// Readiness reads live skill levels; the gate is data (GTR1) and the player view names only what the hero knows.
export function readiness(tier, skills) {
    const facts = {'skill.combat': skills.combat ?? 0, 'skill.equilibrium': skills.equilibrium ?? 0, 'skill.persistence': skills.persistence ?? 0};
    return evaluateGate(temperingGate, facts, {dials: {need: stageNeed(tier)}, knows: () => true});
}
const situation = s => ({pressure: s.trial.pressure, stability: Object.keys(s.vows.kept).length * 2, scar: vowScar(s.vows)});
export function trialView(s, skills) {
    const tier = s.trial.stage + 1;
    if(tier > 3) return {stage: s.trial.stage, name: STAGE_NAMES[s.trial.stage], done: true, pressure: s.trial.pressure};
    const sit = situation(s), gate = readiness(tier, skills);
    return {stage: s.trial.stage, name: STAGE_NAMES[s.trial.stage], next: STAGE_NAMES[tier], tier, pressure: s.trial.pressure, scar: sit.scar, stability: sit.stability,
        risk: riskFor(trialRules, tier, sit), quote: quoteSafeBreakthrough(trialRules, tier, sit), maxUnits: trialRules.pay.maxUnits, ready: gate.met, shown: gate.shown,
        tribulation: trialRules.tribulationFrom != null && tier >= trialRules.tribulationFrom, last: s.trial.last};
}
export function attempt(s, {roll, units, skills}) {
    const tier = s.trial.stage + 1;
    if(tier > 3) fail('Nothing is left to temper.');
    if(!readiness(tier, skills).met) fail('You are not ready for this tempering yet.');
    const r = attemptBreakthrough(trialRules, s.trial, {tier, roll, progress: 0, units, ...situation(s)});
    const trial = {...r.state, stage: r.passed ? tier : s.trial.stage, attempts: s.trial.attempts + 1};
    return {state: {...s, trial}, passed: r.passed, risk: r.risk, spent: r.spent, tier, pressureGain: r.passed ? 0 : trialRules.pressureOnFail * Math.max(1, r.waves)};
}
// Sitting with the fear costs one ration and eases one step of the heart demon.
export function calm(s) {
    if(!s.trial.pressure) fail('Nothing weighs on you.');
    return {...s, trial: {...s.trial, pressure: s.trial.pressure - 1}};
}

export function carve(s, runes, clock) {
    const read = readTalisman(runeGrammar, runes);
    let record = s.runes;
    // Only a plain two-rune carving shows which pair did what; longer strips mix their pairs together.
    if(runes.length === 2) { const p = readPair(runeGrammar, runes[0], runes[1]); record = recordPair(record, runes[0], runes[1], p.effect, clock); }
    return {state: {...s, runes: record, talisman: {runes: [...runes], effects: read.effects, at: clock, until: clock + TALISMAN_MINUTES}}, read};
}
export const expire = (s, clock) => s.talisman && clock >= s.talisman.until ? {...s, talisman: null} : s;
export const runeView = s => ({coverage: coverage(runeGrammar, s.runes), tried: s.runes.pairs, talisman: s.talisman, runes: runeGrammar.runes, maxLength: runeGrammar.maxLength, perRune: runeGrammar.perRuneCost});

const mult = (permille, row, stat) => { if(permille) row[stat] = Math.round(((row[stat] ?? 1) + permille / 1000) * 1000) / 1000; };
// Named stat buckets {bucket: {stat: factor}}; empty buckets are omitted so the stat tooltip lists only live parts.
export function buckets(s, clock) {
    const out = {};
    for(const [track, permille] of Object.entries(vowBonuses(vowRules, s.vows))) { out.vow_oath ??= {}; mult(permille, out.vow_oath, TRACK_STATS[track]); }
    if(s.trial.stage) { out.tempering = {}; mult(STAGE_BONUS * s.trial.stage, out.tempering, 'strength'); mult(STAGE_BONUS * s.trial.stage, out.tempering, 'max_health'); }
    if(s.trial.pressure) { const cut = Math.min(300, DEMON_PENALTY * s.trial.pressure); out.heart_demon = {}; mult(-cut, out.heart_demon, 'strength'); mult(-cut, out.heart_demon, 'agility'); }
    if(s.talisman && clock < s.talisman.until) {
        out.talisman = {};
        for(const [effect, power] of Object.entries(s.talisman.effects)) { const [stat, sign] = EFFECT_STATS[effect]; mult(sign * power * 10, out.talisman, stat); }
    }
    return out;
}
export const BUCKET_NAMES = Object.freeze(['vow_oath', 'tempering', 'heart_demon', 'talisman']);
