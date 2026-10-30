import test from 'node:test';
import assert from 'node:assert/strict';
import {nextStep, FIRST_HOUR_STEPS} from '../src/first_hour.js';
const at = (tasks, extra = {}) => nextStep({tasks, armed: false, fought: false, ...extra})?.id;
test('opening line follows the quest task flags, not a count', () => {
    assert.equal(at([false, false, false, false, false]), 'ask-elder');
    // task 1 is hidden: answered the first question but not yet sent to the field
    assert.equal(at([true, false, false, false, false]), 'ask-to-leave');
    assert.equal(at([true, true, false, false, false]), 'get-weapon');
    assert.equal(at([true, true, false, false, false], {armed: true}), 'fight-rats');
    assert.equal(at([true, true, false, false, false], {armed: true, fought: true}), 'report-back');
    assert.equal(at([true, true, true, false, false]), 'journal');
    assert.equal(at([true, true, true, true, false]), undefined);
});
test('fighting first does not send the player back for a weapon', () => {
    assert.equal(at([true, true, false, false, false], {fought: true}), 'report-back');
});
test('every step names its place in words and a known module', () => {
    for (const row of FIRST_HOUR_STEPS) {
        assert.ok(row.line.length > 5 && row.how.length > 10, row.id);
        assert.ok(['local-actions', 'records'].includes(row.where), row.id);
    }
    assert.equal(nextStep(null), null);
});
