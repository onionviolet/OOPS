import {config} from './config.js';

// Only engine timers opt in. Animation, UI and browser timers remain native.
export const testHooksEnabled = config.enable_dev_mode ||
    (typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname) &&
     new URLSearchParams(location.search).get('test_hooks') === '1');
const pending = new Map();
let nextId = 1, virtualNow = null, paused = false, dispatchTime = null, logicalOffset = 0;
export const engineNow = () => virtualNow ?? dispatchTime ?? (Date.now() + logicalOffset);
export const stepping = () => virtualNow !== null;
function arm(timer) {
    timer.native = setTimeout(() => {
        if(!pending.has(timer.id)) return;
        pending.delete(timer.id);
        // Live timers observe actual elapsed time, as the normal drift correction does.
        // Only synchronous advancement dispatches at exact logical deadlines.
        dispatchTime = Date.now() + logicalOffset;
        try {timer.callback();} finally {dispatchTime = null;}
    }, Math.max(0, timer.due - (Date.now() + logicalOffset)));
}
export function engineTimeout(callback, delay, kind = 'engine') {
    if(!testHooksEnabled) return setTimeout(callback, delay);
    const timer = {id:nextId++, callback, due:engineNow() + Math.max(0, delay), kind};
    pending.set(timer.id, timer);
    if(!paused && !stepping()) arm(timer);
    return timer.id;
}
export function engineInterval(callback, delay) {
    if(!testHooksEnabled) return setInterval(callback, delay);
    const token = {id:null, cancelled:false};
    const run = () => {
        callback();
        if(!token.cancelled) token.id = engineTimeout(run, delay);
    };
    token.id = engineTimeout(run, delay);
    return token;
}
export function clearEngineInterval(token) {
    if(!testHooksEnabled) return clearInterval(token);
    if(!token) return;
    token.cancelled = true;
    clearEngineTimeout(token.id);
}
export function clearEngineTimeout(id) {
    if(!testHooksEnabled) return clearTimeout(id);
    const timer = pending.get(id);
    if(timer) clearTimeout(timer.native);
    pending.delete(id);
}
export function pauseEngine() {
    if(!testHooksEnabled) throw new Error('Test hooks are disabled.');
    if(paused) return;
    virtualNow = engineNow(); paused = true;
    for(const timer of pending.values()) clearTimeout(timer.native);
}
export function resumeEngine() {
    if(!paused) return;
    logicalOffset = virtualNow - Date.now();
    virtualNow = null; paused = false;
    for(const timer of pending.values()) arm(timer);
}
export function runEngineTicks(n) {
    if(!testHooksEnabled) throw new Error('Test hooks are disabled.');
    const wasPaused = paused;
    pauseEngine();
    let ticks = 0, callbacks = 0, boundary = null;
    try {
        while(ticks < n || (boundary !== null && [...pending.values()].some(t => t.due <= boundary))) {
            const timer = [...pending.values()].sort((a,b) => a.due-b.due || a.id-b.id)[0];
            if(!timer || (ticks < n && ![...pending.values()].some(t => t.kind === 'tick')))
                throw new Error('Start PLAY before advancing ticks.');
            if(++callbacks > Math.max(10000, n*10000)) throw new Error('Engine timer runaway.');
            pending.delete(timer.id);
            virtualNow = timer.due;
            timer.callback();
            if(timer.kind === 'tick' && ++ticks === n) boundary = virtualNow;
        }
        return {ticks, callbacks};
    } finally {if(!wasPaused) resumeEngine();}
}
