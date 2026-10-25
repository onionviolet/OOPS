// src/host.js: the browser build is a no-op, the desktop host hears changes once.
import test from 'node:test';
import assert from 'node:assert/strict';

test('reportAttention is silent without a host and reports only changes with one', async () => {
    const { reportAttention } = await import('../src/host.js');
    assert.doesNotThrow(() => reportAttention(1, 'a'));           // no window at all
    const calls = [];
    globalThis.window = { yairpgHost: { attention: (...args) => calls.push(args) } };
    try {
        reportAttention(2, 'Invitation');
        reportAttention(2, 'Invitation');
        reportAttention(3, 'Invitation');
        reportAttention(0, '');
        assert.deepEqual(calls, [[2, 'Invitation'], [3, 'Invitation'], [0, '']]);
        globalThis.window = { yairpgHost: { attention() { throw new Error('host gone'); } } };
        assert.doesNotThrow(() => reportAttention(5, 'x'));
    } finally { delete globalThis.window; }
});
