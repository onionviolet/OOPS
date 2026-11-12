import assert from 'node:assert/strict';
import test from 'node:test';
import {readGuSignal} from '../src/gu_signal.js';

test('a reader can match a signal separately from the live caster’s authority', () => {
    const reader = {pattern: 'moonlight', minForce: 1};
    const authority = {...reader, authority: {specimen: 'original', operator: 'keeper'}};
    const current = {specimen: 'original', operator: 'keeper'};
    const signal = {pattern: 'moonlight', force: 1, specimen: 'original'};
    for (const method of ['past', 'recorded']) {
        const emission = {...signal, method};
        assert.equal(readGuSignal({reader, emission}), 'accepted');
        assert.equal(readGuSignal({reader: authority, emission, current}), 'authority-required');
    }
    const emission = {...signal, method: 'live'};
    assert.equal(readGuSignal({reader: authority, emission, current}), 'accepted');
    assert.equal(readGuSignal({reader: authority, emission, current: {...current, operator: 'steward'}}), 'authority-required');
    assert.equal(readGuSignal({reader: authority, emission: {...emission, specimen: 'other'},
        current: {...current, specimen: 'other'}}), 'authority-required');
    assert.equal(readGuSignal({reader, emission: {...emission, force: 0.5}}), 'wrong-signal');
});
