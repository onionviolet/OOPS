// World-neutral notch contest (FD2, 2026-11-05). One contest engine among several: dice checks (check_contract.js) and upstream
// attack/evasion (combat_math.js) stay where a world's rules use them. Scale: signed notches on a log scale, a reference adult at 0, open at both
// ends. One notch multiplies effective magnitude by dials.gain; a contest on a notch gap wins with a logistic of steepness dials.logistic.
// Every world passes its own dials; NOTCH_DIALS is only a neutral default. Pure functions: no state, no clock, no save slice, no world imports.
export const NOTCH_DIALS=Object.freeze({gain:1.5,logistic:1.1});
export const NOTCH_SCALE=Object.freeze({referenceAdult:0,signed:true,openEnded:true,unit:'notch'});
// Hits of `force` needed to down a target of `toughness`, floored at one.
export const hitsToDown=(toughness,force=0,dials=NOTCH_DIALS)=>Math.max(1,Math.pow(dials.gain,toughness-force));
export const winChance=(delta,dials=NOTCH_DIALS)=>1/(1+Math.exp(-dials.logistic*delta));
// `rng` is a required () => [0,1): the game's scoped rng, or a fixed one in tests. No default, so no hidden randomness.
export function contest(delta,rng,dials=NOTCH_DIALS){const chance=winChance(delta,dials),roll=rng();return {chance,roll,win:roll<chance};}
