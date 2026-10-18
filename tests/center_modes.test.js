import test from 'node:test';
import assert from 'node:assert/strict';
import {createCenterModes} from '../src/center_modes.js';
test('center navigation restores mixing after nested native modes and Back stops native work once', () => {
    let shown, stopped=0;
    const modes=createCenterModes(mode=>shown=mode);
    modes.open('mixing'); modes.open('crafting',()=>{stopped++;modes.local();});
    modes.open('crafting',()=>{stopped++;modes.local();});
    modes.back(); assert.equal(stopped,1); assert.equal(shown,'mixing');
    modes.back(); assert.equal(shown,'local'); assert.equal(modes.back(),false);
});
test('UR9: a rejected stop keeps the current view and return destination, then allows one successful retry', () => {
    let frame, attempts = 0, reject = true;
    const modes = createCenterModes((mode, depth, destination) => {frame = {mode, depth, destination};});
    modes.open('workspace:inventory');
    modes.open('crafting', () => {attempts++; if (reject) throw new Error('save rejected');});
    const before = {...frame};
    assert.throws(() => modes.back(), /save rejected/);
    assert.equal(modes.mode, 'crafting'); assert.deepEqual(frame, before);
    reject = false;
    assert.equal(modes.back(), true);
    assert.equal(modes.mode, 'workspace:inventory'); assert.equal(attempts, 2);
    assert.equal(modes.back(), true); assert.equal(modes.mode, 'local');
    assert.equal(modes.back(), false); assert.equal(attempts, 2, 'leaving the reference cannot repeat the craft stop');
});

test('native redraw can replace a popped dialogue branch without losing its Back route', () => {
    const modes=createCenterModes(()=>{});
    modes.open('mixing');
    modes.open('dialogue',()=>modes.open('dialogue'));
    modes.back(); assert.equal(modes.mode,'dialogue');
    modes.local(); assert.equal(modes.mode,'mixing');
    modes.close('mixing'); assert.equal(modes.mode,'local');
});
test('revisiting a borrowed panel keeps its original history entry mounted until final return', () => {
    const returned=[];const modes=createCenterModes(()=>{});
    modes.open('workspace:inventory',()=>returned.push('inventory'));
    modes.open('workspace:journal',()=>returned.push('journal'));
    modes.open('workspace:inventory',()=>returned.push('inventory'));
    modes.back();assert.equal(modes.mode,'workspace:journal');assert.deepEqual(returned,[]);
    modes.back();assert.equal(modes.mode,'workspace:inventory');assert.deepEqual(returned,['journal']);
    modes.back();assert.deepEqual(returned,['journal','inventory']);
});
test('native completion beneath inspection preserves the reference and removes the obsolete return destination',()=>{
    const modes=createCenterModes(()=>{});modes.open('reading');modes.open('workspace:inventory');
    modes.local();assert.equal(modes.mode,'workspace:inventory');modes.back();assert.equal(modes.mode,'local');
    modes.open('crafting');modes.open('workspace:journal');modes.close('crafting');assert.equal(modes.mode,'workspace:journal');modes.back();assert.equal(modes.mode,'local');
});
