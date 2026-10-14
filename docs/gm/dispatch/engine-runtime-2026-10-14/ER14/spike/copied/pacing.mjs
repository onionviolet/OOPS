// Original optional home-world pacing proposals. No timer, inventory or save writer.
export const PACING_SCHEMA = 1;
export const WEATHER_STATES = Object.freeze([
    {id:'clear', label:'Clear', minutes:120, temperature:0.5, efficiency:1},
    {id:'breeze', label:'Breezy', minutes:90, temperature:-0.5, efficiency:1},
    {id:'fog', label:'Fog', minutes:90, temperature:0, efficiency:0.95},
    {id:'rain', label:'Rain', minutes:120, temperature:-1, efficiency:1},
    {id:'clear', label:'Clear', minutes:180, temperature:0.5, efficiency:1},
    {id:'overcast', label:'Overcast', minutes:120, temperature:0, efficiency:1},
]);
export function weatherDuration(phase, season) {
    const weather=WEATHER_STATES[phase];
    let extra=0;
    if(weather.id==='clear') extra=season==='Summer'?30:season==='Winter'?-30:0;
    if(weather.id==='fog') extra=season==='Autumn'?30:season==='Spring'?15:0;
    if(weather.id==='rain') extra=season==='Winter'?30:season==='Summer'?-30:0;
    return weather.minutes+extra;
}
const clamp = (n, low, high, fallback) => Number.isFinite(n) ? Math.min(high, Math.max(low,n)) : fallback;
export function normalizePacing(raw) {
    if(raw?.schema != null && raw.schema !== PACING_SCHEMA) throw new Error('Unsupported home pacing schema');
    const phase = Number.isInteger(raw?.weather?.phase) ? clamp(raw.weather.phase,0,5,0) : 0;
    return {schema:PACING_SCHEMA, hungerEnabled:raw?.hungerEnabled===true, weatherEnabled:raw?.weatherEnabled===true,
        fullness:clamp(raw?.fullness,0,100,100), weather:{phase, remaining:clamp(raw?.weather?.remaining,1e-9,240,WEATHER_STATES[phase].minutes)}};
}
export function setPacingOption(raw, option, enabled) {
    if(!['hungerEnabled','weatherEnabled'].includes(option) || typeof enabled!=='boolean') throw new Error('Invalid home pacing option');
    return {...normalizePacing(raw), [option]:enabled};
}
export function advancePacing(raw, minutes, context={}) {
    const next=normalizePacing(raw);
    if(!Number.isFinite(minutes) || minutes<0) throw new Error('Played minutes must be finite and nonnegative');
    if(context.homeWorld!==true || minutes===0) return next;
    // One full bar lasts eight played hours. Sleep and travel use that same clock.
    if(next.hungerEnabled) next.fullness=Math.max(0,next.fullness-minutes/4.8);
    if(next.weatherEnabled) {
        let left=minutes;
        const cycleMinutes=WEATHER_STATES.reduce((n,_weather,phase)=>n+weatherDuration(phase,context.season),0);
        if(left>=next.weather.remaining) {
            left-=next.weather.remaining;
            next.weather.phase=(next.weather.phase+1)%WEATHER_STATES.length;
            next.weather.remaining=weatherDuration(next.weather.phase,context.season);
            left%=cycleMinutes; // Whole cycles return to the same phase, with bounded work.
        }
        while(left>=next.weather.remaining) {
            left-=next.weather.remaining;
            next.weather.phase=(next.weather.phase+1)%WEATHER_STATES.length;
            next.weather.remaining=weatherDuration(next.weather.phase,context.season);
        }
        next.weather.remaining-=left;
    }
    return next;
}
export function nourishmentFor(item) {
    if(item?.tags?.food!==true) return 0;
    // Native buff duration represents meal size; item prices are not nutrition.
    const duration=Math.max(0,...(item.effects??[]).map(e=>Number.isFinite(e.duration)?e.duration:0));
    return Math.min(40,10+duration/12);
}
export function prepareFood(raw, item, context={}) {
    const state=normalizePacing(raw);
    const nutrition=nourishmentFor(item);
    const restored=context.homeWorld===true && state.hungerEnabled ? Math.min(100-state.fullness,nutrition) : 0;
    state.fullness+=restored;
    return {state,restored}; // Publish only after the native item is actually consumed.
}
export function pacingEffects(raw, context={}) {
    const state=normalizePacing(raw);
    const active=context.homeWorld===true;
    const outdoors=active && context.outdoors===true;
    const weather=WEATHER_STATES[state.weather.phase];
    const weatherActive=outdoors && state.weatherEnabled;
    const hungerEfficiency=active && state.hungerEnabled ? 0.8+0.2*state.fullness/100 : 1;
    return {hungerEfficiency, efficiency:hungerEfficiency*(weatherActive?weather.efficiency:1),
        temperatureOffset:weatherActive?weather.temperature:0,
        raining:context.nativeRain===true || (weatherActive && weather.id==='rain'),
        weatherLabel:weather.id==='rain' && context.season==='Winter'?'Flurries':weather.label,
        weatherId:weather.id, remaining:state.weather.remaining, active};
}
export function pacedTemperature(raw, nativeTemperature, context={}) {
    return nativeTemperature+pacingEffects(raw,context).temperatureOffset;
}
let runtimeState=normalizePacing();
export function getPacingState() {return normalizePacing(runtimeState);}
export function setPacingState(raw) {runtimeState=normalizePacing(raw);return getPacingState();}
export function advancePacingRuntime(minutes,context) {return setPacingState(advancePacing(runtimeState,minutes,context));}
export function getPacingEffects(context) {return pacingEffects(runtimeState,context);}
