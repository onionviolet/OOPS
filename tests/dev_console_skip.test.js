import test from 'node:test';
import assert from 'node:assert/strict';
import {enableDevConsole} from '../src/dev_console.js';

test('skip helpers route through the injected fast-forward and the next-event distance', async () => {
    const calls = [];
    const saved = {window: globalThis.window, log: console.log};
    globalThis.window = {};
    console.log = () => {};
    let event = 90;
    try {
        enableDevConsole({effect_templates: {}, item_templates: {}, locations: {}, skills: {}, quests: {}, dialogues: {}, global_flags: {},
            fastForward: n => { calls.push(n); return Promise.resolve({wallMs: 3, slices: 1}); }, eventMinutes: () => event});
        const w = globalThis.window;
        await w.skip_days(2);
        await w.skip_minutes(30.4);
        await w.skip_to_event();
        event = null;
        assert.equal(await w.skip_to_event(), null, 'nothing scheduled is reported, not run');
        assert.deepEqual(calls, [2880, 30, 90]);
        assert.equal(globalThis.document, undefined, 'no DOM, so no panel was built here');
    } finally {globalThis.window = saved.window; console.log = saved.log;}
});
