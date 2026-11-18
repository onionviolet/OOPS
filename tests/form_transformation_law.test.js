import test from 'node:test';
import assert from 'node:assert/strict';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {FORM_REVERSALS, FORM_TARGETS, canRunForm, formCase, formCaseId} from '../src/form_transformation_law.js';

test('every reversal runs against every target', async () => {
    for (const r of FORM_REVERSALS) for (const t of FORM_TARGETS) {
        const id = formCaseId(r, t);
        assert.match((await runCaseData(formCase(id), {id})).state, /^expressed-authored$/, id);
    }
});

test('a wrong expectation fails: a stranger cannot undo an at-will change, nothing undoes none, a timeout needs its clock', async () => {
    const atWill = formCase('form:at-will.holder.form');
    atWill.timeline.find(s => s.id === 'stranger').expect = [{holder: 'wielder', property: 'form', direction: 'changed'}];
    assert.equal((await runCaseData(atWill, {id: 'neg1'})).state, 'blocked:runner-expect-mismatch');
    const none = formCase('form:none.other.form');
    none.timeline.find(s => s.id === 'later').expect = [{holder: 'other', property: 'form', direction: 'changed'}];
    assert.equal((await runCaseData(none, {id: 'neg2'})).state, 'blocked:runner-expect-mismatch');
    const timed = formCase('form:timeout.object.form');
    timed.timeline.find(s => s.id === 'later').advanceTo = 5;
    assert.equal((await runCaseData(timed, {id: 'neg3'})).state, 'blocked:runner-expect-mismatch');
});

test('only a form sentence is read; another object waits for its law', () => {
    assert.equal(canRunForm({verb: 'transform', object: 'form'}), true);
    assert.equal(canRunForm({verb: 'alter', object: 'form'}), true);
    assert.equal(canRunForm({verb: 'add', object: 'force'}), false);
    assert.throws(() => formCase('form:sometimes.holder.form'));
});
