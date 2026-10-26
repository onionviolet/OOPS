import {validateTrialExpertise,trialExpertise,taskSteadiness,learnFailedTask} from './trial_expertise.js';
import {recordTrialChoice,validateTrialHistory} from './trial_history.js';
import {validateTrialBodies,syncTrialBody} from './trial_bodies.js';
import {validateTrialRoutine} from './trial_routine.js';
// Pledges: one namespaced slice `pledges` (vows, tempering trial, rune record, worn talisman) and the pure
// transitions over it. The domain (pledges_domain.js) supplies the clock, the roll and the item debits.
import {natural as nat} from './basics.js';
import {evaluateGate} from './progression_gates.js';
import {createVowState, takeVow, breakVow, vowBonuses, vowScar, validateVowState} from './vow_rules.js';
import {createTrialState, riskFor, quoteSafeBreakthrough, attemptBreakthrough, validateTrialState} from './breakthrough_trial.js';
import {createRuneRecord, recordPair, readTalisman, readPair, coverage, validateRuneRecord} from './rune_grammar.js';
import {vowRules, trialRules, runeGrammar, temperingGate, stageNeed, TRACK_STATS, STAGE_BONUS, DEMON_PENALTY, EFFECT_STATS, TALISMAN_MINUTES, STAGE_NAMES, RATION, ORDEAL_TERMS as O, ORDEAL_LOADS} from './pledges_content.js';

export const PLEDGES_FAMILY = 'progression.pledges@1';
const fail = message => { throw new Error(message); };
export const fresh = () => ({family: PLEDGES_FAMILY, vows: createVowState(), trial: {...createTrialState(), stage: 0, attempts: 0}, runes: createRuneRecord(), talisman: null});
const withTrial=(s,trial)=>{const n={...s,trial:{...trial,bestStage:Math.max(s.trial.bestStage||0,trial.stage)}};return s.bodyTrials?syncTrialBody(n,s.bodyTrials.active):n;};
export const isFresh = s => !s.trial.decisions?.length && !Object.keys(s.trial.routeLessons||{}).length && !s.routine && !s.charged && !s.ordeal && !Object.keys(s.vows.kept).length && !Object.keys(s.vows.broken).length && s.trial.stage === 0 && s.trial.attempts === 0 && !s.trial.pressure && !s.trial.learning && !s.runes.pairs.length && !s.talisman;

// Self-imposed restrictions remain escapable by explicitly breaking the vow.
export function actionReason(s, action) {
    if(s.vows.kept['plain-table'] && action.kind === 'consume' && action.food && action.id !== RATION)
        return 'Your plain-table vow keeps you to plain fare (stale bread). Break the vow, accepting its scar, before choosing this meal.';
    if(s.vows.kept['open-hand'] && action.kind === 'paid-help')
        return 'Your open-hand vow commits this work to your own hands. Break the vow before commissioning paid help.';
    if(s.vows.kept['long-watch'] && action.kind === 'sleep' && action.hour >= 6 && action.hour < 7)
        return 'Your long-watch vow keeps the dawn hour (06:00–07:00) awake. Break it before sleeping through the watch.';
    return '';
}

const ORDEAL_KINDS = ['endurance', 'precision','blade','pole'];
export const ordealKinds=skills=>ORDEAL_KINDS.map(kind=>({kind,eligible:kind==='blade'?['sword','dagger','axe'].includes(skills.weapon):kind==='pole'?skills.weapon==='spear':true,reason:kind==='blade'?'Equip a sword, dagger or axe for the cutting line.':kind==='pole'?'Equip a spear for the distance line.':''}));
export function beginOrdeal(s, {kind, units, skills, at,load=0}) {
    if(s.ordeal) fail('An ordeal is already active.');
    if(!nat(load)||!ORDEAL_LOADS[load])fail('Choose a supported load on this practice frame.');
    if(!ORDEAL_KINDS.includes(kind) || !nat(units) || units>trialRules.pay.maxUnits || !nat(at)) fail('Invalid ordeal preparation.');
    if(!ordealKinds(skills).find(k=>k.kind===kind)?.eligible)fail('Equip the appropriate weapon before starting this trial.');
    const tier=s.trial.stage+1;
    if(tier>3 || !readiness(tier,skills).met) fail('You are not ready for this ordeal.');
    return {...s,ordeal:{kind,tier,turn:0,score:0,integrity:O.composure+units*O.rationGuard,units,at,load,actions:[]}};
}
export function ordealView(s, skills) {
    const o=s.ordeal;if(!o)return null;const load=ORDEAL_LOADS[o.load||0];
    const power=Math.max(skills.combat??0,skills.equilibrium??0,skills.persistence??0);
    const pressure=Math.ceil((o.tier+1)*1.3**o.turn)+Math.floor(s.trial.pressure/2)+load.pressure;
    return {...o,taskLessons:trialExpertise(s,o.kind,o.tier),loadTerms:load,failurePressure:O.collapsePressure+load.collapse,grade:Math.min(9,Math.floor(o.score/3)),limit:O.turns,pressure,
        steadyCost:Math.max(1,pressure-Math.min(5,power)-Math.min(3,Math.floor(((s.trial.learning??0)+(skills.fieldLearning||0))/3))-taskSteadiness(s,o.kind,o.tier)),pressCost:pressure+(o.kind==='precision'?5:o.kind==='blade'?4:o.kind==='pole'?1:2)+(skills.intent?.pressCost||0),
        reason:o.kind==='blade'?'A cutting line rewards a forceful committed stroke; measured cuts score less.':o.kind==='pole'?'Keeping distance earns more from measured steps than a rushed thrust.':o.kind==='precision'?'Precise footwork earns more from measured steps; rushing strains control.':'The weighted frame grows heavier with each turn. Steady work preserves composure.'};
}
function finishOrdeal(s,at,passed) {
    const o=s.ordeal;if(!o)fail('No active ordeal.');
    const grade=passed?Math.min(9,Math.max(1,Math.floor(o.score/3))):0;
    const history=[...(s.trial.history??[]),{kind:o.kind,at,turn:o.turn,grade,passed}].slice(-24);
    const trial={...s.trial,attempts:s.trial.attempts+1,stage:passed?o.tier:s.trial.stage,
        quality:(s.trial.quality??0)+grade,...(!passed?{learning:(s.trial.learning??0)+1}:{}),pressure:Math.max(0,s.trial.pressure+(passed?-1:O.collapsePressure+ORDEAL_LOADS[o.load||0].collapse)),history,
        last:{tier:o.tier,risk:0,passed,units:o.units,grade}};
    return {state:recordTrialChoice(s,learnFailedTask(s,{...withTrial(s,trial),ordeal:null},o.kind,passed),{at,route:o.kind,units:o.units,passed,grade,steps:o.actions||[],load:o.load||0}),grade,passed};
}
export function stepOrdeal(s,choice,skills,at) {
    const v=ordealView(s,skills);if(!v)fail('No active ordeal.');
    if(!ordealKinds(skills).find(k=>k.kind===v.kind)?.eligible)fail('Restore the trial’s appropriate weapon before continuing.');
    if(!['steady','press'].includes(choice)||!nat(at))fail('Choose a measured step or press harder.');
    const integrity=v.integrity-(choice==='steady'?v.steadyCost:v.pressCost),
        score=v.score+(choice==='press'?(skills.intent?.pressScore||0)+(v.kind==='blade'?7:v.kind==='pole'?3:5):v.kind==='precision'?4:v.kind==='blade'?2:v.kind==='pole'?5:3)+v.loadTerms.score;
    const next={...s,ordeal:{...s.ordeal,turn:v.turn+1,integrity,score,...(s.ordeal.actions?{actions:[...s.ordeal.actions,choice]}:{})}};
    if(integrity<=0)return finishOrdeal(next,at,false).state;
    return v.turn+1>=v.limit?finishOrdeal(next,at,true).state:next;
}
export function settleOrdeal(s,at) {
    if(!s.ordeal)fail('No active ordeal.');
    if(!s.ordeal.turn)fail('Take at least one step before accepting a grade.');
    return finishOrdeal(s,at,true);
}
export function abandonOrdeal(s,at=0) {
    if(!s.ordeal)fail('No active ordeal.');
    const o=s.ordeal;return recordTrialChoice(s,{...s,ordeal:null},{at,route:o.kind,units:o.units,passed:null,steps:o.actions||[],load:o.load||0}); // Laid-in supplies remain spent; no stage, grade or penalty is minted.
}

export function validate(s) {
    if(s?.family !== PLEDGES_FAMILY) fail('Unsupported pledges slice.');
    validateTrialBodies(s.bodyTrials);validateTrialExpertise(s.trial?.routeLessons);validateTrialHistory(s.trial?.decisions);
    if(s.bodyTrials){const active=s.bodyTrials.copies[s.bodyTrials.active];if(active.stage!==s.trial.stage||active.quality!==(s.trial.quality||0)||Math.max(...Object.values(s.bodyTrials.copies).map(b=>b.stage))>(s.trial.bestStage??s.trial.stage))fail('Conditioning differs from its actual body ledger.');}
    if(s.trial?.bestStage!==undefined&&(!nat(s.trial.bestStage)||s.trial.bestStage>3||s.trial.bestStage<s.trial.stage))fail('Invalid remembered tempering qualification.');
    validateVowState(vowRules, s.vows); validateTrialState(s.trial);
    if(!nat(s.trial.stage) || s.trial.stage > 3 || !nat(s.trial.attempts)) fail('Invalid tempering record.');
    if(s.trial.learning!=null&&!nat(s.trial.learning))fail('Invalid trial learning.');
    if(s.trial.quality!=null&&(!nat(s.trial.quality)||s.trial.quality>27))fail('Invalid trial quality.');
    if(s.trial.history!=null&&(!Array.isArray(s.trial.history)||s.trial.history.length>24||s.trial.history.some(h=>!ORDEAL_KINDS.includes(h.kind)||!nat(h.at)||!nat(h.turn)||h.turn>12||!nat(h.grade)||h.grade>9||typeof h.passed!=='boolean')))fail('Invalid ordeal history.');
    if(s.ordeal!=null){const o=s.ordeal;if(!ORDEAL_KINDS.includes(o.kind)||!nat(o.tier)||o.tier!==s.trial.stage+1||o.tier>3||!nat(o.turn)||o.turn>=12||!nat(o.score)||o.score>O.turns*(7+(ORDEAL_LOADS[o.load||0]?.score||0))||!nat(o.integrity)||!o.integrity||o.integrity>44||!nat(o.units)||o.units>5||!nat(o.at))fail('Invalid active ordeal.');}
    if(s.ordeal?.load!==undefined&&(!nat(s.ordeal.load)||!ORDEAL_LOADS[s.ordeal.load]))fail('Invalid active frame load.');
    if(s.ordeal?.actions!==undefined&&(!Array.isArray(s.ordeal.actions)||s.ordeal.actions.length!==s.ordeal.turn||s.ordeal.actions.some(a=>!['steady','press'].includes(a))))fail('Invalid active ordeal choices.');
    validateRuneRecord(runeGrammar, s.runes);
    if(s.talisman != null) {
        const t = s.talisman;
        if(!Array.isArray(t.runes) || !nat(t.at) || !nat(t.until) || t.until < t.at || !t.effects || typeof t.effects !== 'object') fail('Invalid worn talisman.');
        readTalisman(runeGrammar, t.runes);
        for(const e of Object.keys(t.effects)) if(!EFFECT_STATS[e]) fail(`Unknown talisman effect ${e}.`);
    }
    validateTrialRoutine(s.routine);
    if(s.charged)validateCharged(s.charged);
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
const situation = (s,skills={}) => ({pressure: s.trial.pressure, stability:taskSteadiness(s,'quick')+ Object.keys(s.vows.kept).length * 2 + Math.min(10,(s.trial.learning??0)+(skills.fieldLearning||0))+2*Math.max(0,Math.min(3,skills.channels||0))+(skills.intent?.stability||0), scar: vowScar(s.vows)});
export function trialView(s, skills) {
    const tier = s.trial.stage + 1;
    if(tier > 3) return {stage: s.trial.stage, name: STAGE_NAMES[s.trial.stage], done: true, pressure: s.trial.pressure};
    const sit = situation(s,skills), gate = readiness(tier, skills);
    return {stage: s.trial.stage, name: STAGE_NAMES[s.trial.stage], next: STAGE_NAMES[tier], tier,taskLessons:trialExpertise(s,'quick',tier), pressure: s.trial.pressure, scar: sit.scar, stability: sit.stability,
        risk: riskFor(trialRules, tier, sit), quote: quoteSafeBreakthrough(trialRules, tier, sit), maxUnits: trialRules.pay.maxUnits, ready: gate.met, shown: gate.shown,
        tribulation: trialRules.tribulationFrom != null && tier >= trialRules.tribulationFrom, last: s.trial.last};
}
export function attempt(s, {roll, units, skills, at=0}) {
    if(s.ordeal)fail('Finish or settle the active ordeal first.');
    const tier = s.trial.stage + 1;
    if(tier > 3) fail('Nothing is left to temper.');
    if(!readiness(tier, skills).met) fail('You are not ready for this tempering yet.');
    const r = attemptBreakthrough(trialRules, s.trial, {tier, roll, progress: 0, units, ...situation(s,skills)});
    const trial = {...r.state, stage: r.passed ? tier : s.trial.stage, attempts: s.trial.attempts + 1,...(!r.passed?{learning:(s.trial.learning??0)+1}:{})};
    return {state: recordTrialChoice(s,learnFailedTask(s,withTrial(s,trial),'quick',r.passed),{at,route:'quick',units,passed:r.passed,risk:r.risk}), passed: r.passed, risk: r.risk, spent: r.spent, tier, pressureGain: r.passed ? 0 : trialRules.pressureOnFail * Math.max(1, r.waves)};
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
    if(s.trial.stage) { out.tempering = {}; const bonus=STAGE_BONUS*s.trial.stage+(s.trial.quality??0)*O.gradePermille; mult(bonus, out.tempering, 'strength'); mult(bonus, out.tempering, 'max_health'); }
    if(s.trial.pressure) { const cut = Math.min(300, DEMON_PENALTY * s.trial.pressure); out.heart_demon = {}; mult(-cut, out.heart_demon, 'strength'); mult(-cut, out.heart_demon, 'agility'); }
    if(s.talisman && clock < s.talisman.until) {
        out.talisman = {};
        for(const [effect, power] of Object.entries(s.talisman.effects)) { const [stat, sign] = EFFECT_STATS[effect]; mult(sign * power * 10, out.talisman, stat); }
    }
    return out;
}
export const BUCKET_NAMES = Object.freeze(['vow_oath', 'tempering', 'heart_demon', 'talisman']);

// A second, explicitly carved strip spends its charge on resolved native hits.
// The normal timed talisman retains its old law and expires on its old clock.
export function chargeSpec(runes,mode){
 if(!['attack','guard','mend','burst','siphon'].includes(mode))fail('Choose attack, guard, mend, burst or siphon.');
 const r=readTalisman(runeGrammar,runes),grade=Math.max(1,runes.length-1-r.discords),power=Math.max(1,Object.entries(r.effects).reduce((n,[id,p])=>n+(id==='fizzle'?-p:p),0));
 return {grade,power,maxCharges:2+grade};
}
function validateCharged(t){
 const spec=chargeSpec(t.runes,t.mode);
 if(t.serial!==undefined&&(!nat(t.serial)||t.serial<1))fail('Invalid physical strip serial.');
 if(typeof t.binding!=='string'||!t.binding||t.binding.length>300||!nat(t.at)||!nat(t.charges)||t.charges>spec.maxCharges||t.grade!==spec.grade||t.power!==spec.power||t.maxCharges!==spec.maxCharges||!nat(t.uses)||t.uses+t.charges!==spec.maxCharges)fail('Invalid charged talisman.');
}
export function carveCharged(s,runes,mode,clock,binding){
 const spec=chargeSpec(runes,mode);if(!nat(clock)||typeof binding!=='string'||!binding)fail('Carve for your actual body.');
 const t={runes:[...runes],mode,...spec,charges:spec.maxCharges,uses:0,at:clock,binding,serial:(s.charged?.serial||0)+1};validateCharged(t);
 return {...s,charged:t};
}
export function useCharged(s,{direction,binding,health=0,maxHealth=0,damage}){
 const t=s.charged;if(!t||!t.charges||t.binding!==binding||!(t.mode==='guard'?direction==='incoming':direction==='outgoing'))return {state:s,multiplier:1,heal:0};
 if(t.mode==='siphon'&&!(Number.isFinite(damage)&&damage>0))return {state:s,multiplier:1,heal:0};
 const heal=['mend','siphon'].includes(t.mode)?Math.max(0,Math.min(maxHealth-health,t.mode==='mend'?t.power/2:damage*Math.min(.5,t.power/100))):0;
 if(['mend','siphon'].includes(t.mode)&&!heal)return {state:s,multiplier:1,heal:0};
 const spent=t.mode==='burst'?t.charges:1;
 return {state:{...s,charged:{...t,charges:t.charges-spent,uses:t.uses+spent}},multiplier:t.mode==='attack'||t.mode==='burst'?1+t.power*spent/100:t.mode==='guard'?Math.max(.5,1-t.power/100):1,heal};
}

export function guardedTempering(s,skills,at=0){
 if(s.ordeal)fail('Finish the active ordeal first.');const tier=s.trial.stage+1;
 if(tier>3||!readiness(tier,skills).met)fail('Earn the next stage’s readiness first.');
 return recordTrialChoice(s,withTrial(s,{...s.trial,stage:tier,attempts:s.trial.attempts+1,pressure:Math.max(0,s.trial.pressure-1),last:{tier,risk:0,passed:true,units:5,route:'guarded'}}),{at,route:'guarded',units:5,passed:true});
}
