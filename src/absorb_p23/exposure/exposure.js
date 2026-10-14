// Original proposals inspired by Proto23's passive adaptation and weather rhythm.
// No borrowed code/assets, timer, native skill registry or save writer.
import {normalizePacing} from '../../absorb_e1/pacing.js';
export const EXPOSURE_SCHEMA = 1;
export const PROFILE = Object.freeze({id:'storm-gust', gustMinutes:6, restMinutes:12,
    staminaPerMinute:0.2, coldXpPerMinute:0.02, temperatureOffset:-3});
export const FAMINE = Object.freeze({skillId:'Famine', threshold:20, xpPerMinute:0.01});
const finite = (n, min, max) => typeof n==='number' && Number.isFinite(n) && n>=min && n<=max;
function fail() {throw new Error('Invalid exposure state');}
export function validateExposure(raw) {
    if(raw===undefined) return undefined; // Old saves retain an absent optional field.
    if(!raw || typeof raw!=='object' || Array.isArray(raw)) fail();
    if(raw.schema!==EXPOSURE_SCHEMA) throw new Error('Unsupported exposure schema');
    if(typeof raw.hazardousEnabled!=='boolean' || !['gust','rest'].includes(raw.phase)) fail();
    if(!finite(raw.remaining,Number.MIN_VALUE,raw.phase==='gust'?PROFILE.gustMinutes:PROFILE.restMinutes)) fail();
    if(raw.cursor!==null && !finite(raw.cursor,0,Number.MAX_SAFE_INTEGER)) fail();
    for(const key of ['famineRemainder','coldRemainder']) if(!finite(raw[key],0,0.01) || raw[key]>=0.01) fail();
    return {...raw};
}
export function createExposure(cursor=null) {
    return validateExposure({schema:EXPOSURE_SCHEMA,hazardousEnabled:false,phase:'gust',remaining:PROFILE.gustMinutes,
        cursor,famineRemainder:0,coldRemainder:0});
}
export function setHazardousMode(raw, enabled) {
    if(typeof enabled!=='boolean') throw new Error('Hazardous mode must be boolean');
    return {...(validateExposure(raw)??createExposure()),hazardousEnabled:enabled};
}
function quantize(remainder, earned) {
    const total=remainder+earned;
    const cents=Math.floor((total+1e-12)*100);
    return {xp:cents/100,remainder:Math.max(0,Number((total-cents/100).toFixed(12)))};
}
function advanceRhythm(state, minutes) {
    let left=minutes, gustMinutes=0;
    const take=Math.min(left,state.remaining);
    if(state.phase==='gust') gustMinutes+=take;
    state.remaining-=take;left-=take;
    if(state.remaining===0) {
        state.phase=state.phase==='gust'?'rest':'gust';
        state.remaining=state.phase==='gust'?PROFILE.gustMinutes:PROFILE.restMinutes;
    }
    // A whole cycle returns to this same phase. Bounded work even for long sleep/travel.
    const cycle=PROFILE.gustMinutes+PROFILE.restMinutes;
    const cycles=Math.floor(left/cycle);
    gustMinutes+=cycles*PROFILE.gustMinutes;left-=cycles*cycle;
    while(left>0) {
        const step=Math.min(left,state.remaining);
        if(state.phase==='gust') gustMinutes+=step;
        state.remaining-=step;left-=step;
        if(state.remaining===0) {
            state.phase=state.phase==='gust'?'rest':'gust';
            state.remaining=state.phase==='gust'?PROFILE.gustMinutes:PROFILE.restMinutes;
        }
    }
    return gustMinutes;
}
// The host supplies one contiguous native played interval with constant context.
// Split at food, world, body, shelter, option and resource changes. Stage atomically
// with pacing + native skill XP + resource updates; publish only after save succeeds.
export function stageExposure(raw, event, context={}) {
    const state=validateExposure(raw)??createExposure();
    if(!event || !finite(event.start,0,Number.MAX_SAFE_INTEGER) || !finite(event.end,event.start,Number.MAX_SAFE_INTEGER))
        throw new Error('Invalid native played interval');
    const output={state,skillXp:{},staminaCost:0,underfedMinutes:0,gustMinutes:0,replayed:false};
    if(state.cursor!==null && event.end<=state.cursor) return {...output,replayed:true};
    if(state.cursor!==null && event.start!==state.cursor) throw new Error('Noncontiguous exposure interval');
    const minutes=event.end-event.start;
    state.cursor=event.end;
    if(context.played!==true || context.homeWorld!==true || minutes===0) return output;
    const pacing=normalizePacing(context.pacing);
    if(context.needsFood===true && pacing.hungerEnabled) {
        // Integrate only the underfed suffix, including the exact E1 threshold crossing.
        const untilUnderfed=Math.max(0,(pacing.fullness-FAMINE.threshold)*4.8);
        output.underfedMinutes=Math.max(0,minutes-untilUnderfed);
        const earned=quantize(state.famineRemainder,output.underfedMinutes*FAMINE.xpPerMinute);
        state.famineRemainder=earned.remainder;
        if(earned.xp>0) output.skillXp[FAMINE.skillId]=earned.xp;
    }
    if(state.hazardousEnabled && pacing.weatherEnabled && context.exposureEligible===true) {
        const gust=advanceRhythm(state,minutes);
        if(context.outdoors===true && context.sheltered===false) {
            output.gustMinutes=gust;
            const level=finite(context.coldResistanceLevel,0,10000)?context.coldResistanceLevel:0;
            output.staminaCost=gust*PROFILE.staminaPerMinute/(1+0.05*level);
            const earned=quantize(state.coldRemainder,gust*PROFILE.coldXpPerMinute);
            state.coldRemainder=earned.remainder;
            if(earned.xp>0) output.skillXp['Cold resistance']=earned.xp;
        }
    }
    return output;
}
export function exposureEffects(raw, context={}) {
    const state=validateExposure(raw)??createExposure();
    const pacing=normalizePacing(context.pacing);
    const active=context.played===true && state.hazardousEnabled && pacing.weatherEnabled && context.homeWorld===true && context.exposureEligible===true;
    const exposed=active && context.outdoors===true && context.sheltered===false && state.phase==='gust';
    return {active,exposed,phase:state.phase,remaining:state.remaining,
        temperatureOffset:exposed?PROFILE.temperatureOffset:0};
}
// Real skill function, projected by P00 over E1's existing optional loss only.
// Level 40 removes at most five percentage points, never adds a second meal bonus.
export function famineEfficiency(baseEfficiency, level, context={}) {
    if(!finite(baseEfficiency,0,1) || !finite(level,0,10000)) throw new Error('Invalid Famine projection');
    if(context.homeWorld!==true || context.needsFood!==true || context.hungerEnabled!==true) return baseEfficiency;
    return Math.min(1,baseEfficiency+Math.min(level,40)/40*0.05);
}
