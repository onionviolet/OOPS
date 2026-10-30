import test from 'node:test';
import assert from 'node:assert/strict';
import {nextStep, FIRST_HOUR_STEPS} from '../src/first_hour.js';
const at = (tasks, extra = {}) => nextStep({tasks, armed: false, fought: false, ...extra})?.id;
test('opening line follows the quest task flags and the elder\'s own lines', () => {
    assert.equal(at([false, false, false, false, false]), 'ask-elder');
    // task 1 is hidden: answered the first question but not yet sent to the field
    assert.equal(at([true, false, false, false, false]), 'ask-to-leave');
    const sent = [true, true, false, false, false];
    assert.equal(at(sent), 'get-weapon');
    assert.equal(at(sent, {armed: true}), 'fight-rats');
    assert.equal(at(sent, {armed: true, fieldCleared: true}), 'report-field');
    assert.equal(at(sent, {fieldCleared: true, fieldReported: true}), 'clear-cave');
    assert.equal(at(sent, {fieldCleared: true, fieldReported: true, caveCleared: true}), 'report-cave');
    assert.equal(at([true, true, true, false, false]), 'journal');
    assert.equal(at([true, true, true, true, false]), undefined);
});
test('a cleared field never sends the player back for a weapon or to the field', () => {
    assert.equal(at([true, true, false, false, false], {fieldCleared: true}), 'report-field');
});
test('every step names its place in words and a known module', () => {
    for (const row of FIRST_HOUR_STEPS) {
        assert.ok(row.line.length > 5 && row.how.length > 10, row.id);
        assert.ok(['local-actions', 'records'].includes(row.where), row.id);
    }
    assert.equal(nextStep(null), null);
});
