import test from 'node:test';
import assert from 'node:assert/strict';
import {interruptedOperation, validateInterruptedOperation} from '../src/interrupted_operation.js';

test('an interrupted operation records stop point, kept items and who is told', () => {
    const r = interruptedOperation({operation: 'brew.batch', stopPoint: 'after the second stir', partialEffect: 'half a batch',
        kept: ['the sample'], toldTo: ['master'], reason: 'called away'});
    assert.deepEqual(r, {operation: 'brew.batch', stopPoint: 'after the second stir', partialEffect: 'half a batch',
        kept: ['the sample'], toldTo: ['master'], reason: 'called away'});
    assert.deepEqual(validateInterruptedOperation(r), []);
});

test('a record missing a stop point is rejected; no partial effect defaults to none', () => {
    assert.throws(() => interruptedOperation({operation: 'x'}), /stopPoint/);
    assert.deepEqual(validateInterruptedOperation({operation: 'x', partialEffect: 'none', kept: [], toldTo: [], reason: ''}), ['stopPoint is required']);
    assert.equal(interruptedOperation({operation: 'x', stopPoint: 'start'}).partialEffect, 'none');
});
