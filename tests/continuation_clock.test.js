import test from 'node:test';
import assert from 'node:assert/strict';
import {engineTimeout,suspendEngine,engineNow,clearEngineTimeout,engineInterval,clearEngineInterval} from '../src/simulation_clock.js';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
test('production suspension freezes scheduled native work and excludes validation time',async()=>{
    const before=engineNow();let fired=0;const timer=engineTimeout(()=>fired++,15);
    const release=suspendEngine();await wait(40);assert.equal(fired,0);assert.ok(engineNow()-before<10);
    release();await wait(30);assert.equal(fired,1);clearEngineTimeout(timer);
});
test('production interval can be cleared during suspension without a stale callback',async()=>{
    let fired=0;const token=engineInterval(()=>fired++,10),release=suspendEngine();
    clearEngineInterval(token);release();await wait(30);assert.equal(fired,0);
});
test('out-of-order nested releases cannot resume a remaining transaction freeze',async()=>{
    let fired=0;engineTimeout(()=>fired++,10);const a=suspendEngine(),b=suspendEngine();a();
    await wait(25);assert.equal(fired,0);b();b();await wait(25);assert.equal(fired,1);
});
