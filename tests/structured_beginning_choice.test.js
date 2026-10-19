import test from 'node:test';
import assert from 'node:assert/strict';
import {initialStructuredBeginning} from '../src/structured_beginning_choice.js';

test('installed manifest head is reachable before the public fallback', () => {
    const current = {id: 'installed.current'}, previous = {id: 'installed.previous'}, fallback = {id: 'public'};
    const definitions = new Map([[current.id, current], [previous.id, previous], [fallback.id, fallback]]);
    assert.equal(initialStructuredBeginning(definitions), current);
    assert.deepEqual([...definitions.values()], [current, previous, fallback]);
    assert.equal(initialStructuredBeginning(definitions), current);
});

test('public fallback and explicit local QA probe work without installed content', () => {
    const fallback = {id: 'public'}, probe = {id: 'probe'};
    assert.equal(initialStructuredBeginning(new Map([[fallback.id, fallback]])), fallback);
    const definitions = new Map([[fallback.id, fallback], [probe.id, probe]]);
    assert.equal(initialStructuredBeginning(definitions, probe.id), probe);
    assert.equal(initialStructuredBeginning(definitions, 'absent'), fallback);
    assert.equal(initialStructuredBeginning(new Map()), undefined);
});
