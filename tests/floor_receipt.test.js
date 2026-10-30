import test from 'node:test';
import assert from 'node:assert/strict';
import {receiptLine, refSelector, summarizeReceipt, validateScenario} from '../scripts/playtest/floor_receipt.mjs';

const good = {name: 'x', steps: [{op: 'nav', id: 'lotm'}, {op: 'click', ref: 'lotm=enroll'}, {op: 'roundtrip'}]};

test('validateScenario accepts a good scenario and names each problem', () => {
    assert.deepEqual(validateScenario(good), []);
    const bad = validateScenario({name: 'x', steps: [{op: 'fly'}, {op: 'click'}, {op: 'step', minutes: 0}, {op: 'click', ref: 'noequals'}, {op: 'shot', name: 'a b'}]});
    assert.equal(bad.length, 5);
    assert.deepEqual(validateScenario({steps: []}), ['missing name', 'steps must be a non-empty array']);
});

test('refSelector maps key=value to a data attribute', () => {
    assert.equal(refSelector('lotm=pick_probationer'), '[data-lotm="pick_probationer"]');
    assert.equal(refSelector('a=b=c'), '[data-a="b=c"]');
});

test('summarizeReceipt is ok only when steps, errors and roundtrip all pass', () => {
    const steps = [{i: 0, op: 'nav', ok: true}, {i: 1, op: 'roundtrip', ok: true}];
    const rt = {export: true, reload: true, import: true};
    const base = {scenario: 's', bundle: 'abc', steps, roundtrip: rt};
    assert.equal(summarizeReceipt(base).ok, true);
    assert.equal(summarizeReceipt({...base, errors: [{kind: 'pageerror'}]}).ok, false);
    assert.equal(summarizeReceipt({...base, roundtrip: {...rt, import: false}}).ok, false);
    assert.equal(summarizeReceipt({...base, steps: [steps[0], {i: 1, op: 'click', ok: false, error: 'timeout'}]}).ok, false);
    assert.equal(summarizeReceipt({...base, steps: []}).ok, false);
});

test('receiptLine reports the first failure and carries no step payloads', () => {
    const r = summarizeReceipt({scenario: 's', bundle: 'abc', steps: [{i: 0, op: 'nav', ok: true}, {i: 1, op: 'click', ok: false, error: 'timeout'}]});
    assert.match(receiptLine(r), /^FAIL s bundle abc steps 1\/2 errors 0 first failure step 1 \(click\): timeout$/);
});
