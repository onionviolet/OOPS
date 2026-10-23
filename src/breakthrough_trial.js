// Breakthrough trial: heart demon, tribulation and the pay-for-safety choice
// (gaps G54, G57). The caller supplies a roll 0-999 from its own RNG, so the
// rule is pure and previewable. Risk is a permille chance of failing; stability,
// vow scars and demon pressure move it, and the player may pay materials to cut
// it down to a floor. The floor is never zero: safety is bought, not guaranteed
// (default; a world may set floor 0 with an in-world reason). A failed trial
// costs progress and adds heart-demon pressure, never the life itself.
// Pure. Save slice `progression.trial@1` holds pressure and the last outcome.
// Not wired into live gameplay yet.
import {natural as nat, positive as pos} from './basics.js';

export const TRIAL_FAMILY = 'progression.trial@1';
const fail = message => { throw new Error(message); };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// spec: {id, revision, baseRisk:{tier:permille}, floor, perPressure, perStability, pay:{perUnit, perUnitRisk, maxUnits, label},
//   setback:permille of progress lost, pressureOnFail, pressureOnPass:negative-ok, tribulationFrom:tier, tribulationWaves}
export function defineTrialRules(spec) {
    for(const k of ['floor', 'perPressure', 'perStability', 'setback', 'pressureOnFail']) if(!nat(spec[k])) fail(`Trial rule ${k} must be a natural number.`);
    if(spec.floor > 1000 || spec.setback > 1000 || !pos(spec.revision)) fail('Invalid trial rules.');
    if(!spec.pay || !pos(spec.pay.perUnit) || !pos(spec.pay.perUnitRisk) || !pos(spec.pay.maxUnits)) fail('Pay terms need positive perUnit, perUnitRisk and maxUnits.');
    return Object.freeze({...spec, baseRisk: Object.freeze({...spec.baseRisk}), pay: Object.freeze({...spec.pay}), perPressureOnPass: spec.pressureOnPass ?? 0});
}
export const createTrialState = () => ({family: TRIAL_FAMILY, pressure: 0, last: null});

export function riskFor(rules, tier, {pressure = 0, stability = 0, scar = 0, units = 0} = {}) {
    const base = rules.baseRisk[tier] ?? fail(`No breakthrough risk for tier ${tier}.`);
    if(!nat(units) || units > rules.pay.maxUnits) fail(`Pay between 0 and ${rules.pay.maxUnits} units.`);
    const raw = base + (pressure + scar) * rules.perPressure - stability * rules.perStability - units * rules.pay.perUnitRisk;
    return clamp(raw, rules.floor, 1000);
}
// What it costs to buy risk down to a target (or the floor), and what that leaves.
export function quoteSafeBreakthrough(rules, tier, situation, target = rules.floor) {
    const start = riskFor(rules, tier, {...situation, units: 0});
    let units = 0;
    while(units < rules.pay.maxUnits && riskFor(rules, tier, {...situation, units}) > Math.max(target, rules.floor)) units++;
    return {units, cost: units * rules.pay.perUnit, label: rules.pay.label, from: start, to: riskFor(rules, tier, {...situation, units})};
}
// roll < risk means failure. Returns the new state and what the attempt cost.
export function attemptBreakthrough(rules, state, {tier, roll, progress, stability = 0, scar = 0, units = 0}) {
    if(!Number.isSafeInteger(roll) || roll < 0 || roll > 999 || !nat(progress)) fail('Roll must be 0-999 and progress a natural number.');
    const risk = riskFor(rules, tier, {pressure: state.pressure, stability, scar, units});
    const waves = rules.tribulationFrom != null && tier >= rules.tribulationFrom ? rules.tribulationWaves ?? 1 : 0;
    const passed = roll >= risk;
    // A tribulation tier fails harder: the demon takes one pressure step per wave.
    const pressure = passed ? Math.max(0, state.pressure + rules.perPressureOnPass) : state.pressure + rules.pressureOnFail * Math.max(1, waves);
    const lost = passed ? 0 : Math.floor(progress * rules.setback / 1000);
    return {state: {...state, pressure, last: {tier, risk, passed, units}}, passed, risk, waves, lost, spent: units * rules.pay.perUnit};
}
export function validateTrialState(state) {
    if(state?.family !== TRIAL_FAMILY || !nat(state.pressure)) fail('Unsupported trial state.');
    return state;
}
