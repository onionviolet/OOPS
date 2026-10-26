import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectMaterialEvidence} from '../src/material_inspector.js';

const fixture = () => ({
    identity: {id: 'hp:ingredient', name: 'Known ingredient', secret: 'discard'},
    lot: {id: 'lot-7', form: 'powdered', custody: 'owned', truth: {quality: 99}},
    properties: [
        {id: 'measured-zero', status: 'observed', value: 0, source: 'assay'},
        {id: 'unmeasured', status: 'unknown', value: 99},
        {id: 'not-authored', status: 'unsupported', value: 0},
        {id: 'supplier-duration', status: 'claim', value: 21, source: 'shopkeeper'},
        {id: 'expected-duration', status: 'inferred', value: 20, source: 'notebook'},
    ],
    conditions: [{id: 'powdered', status: 'observed', value: true}, {id: 'heat', status: 'observed', value: false}, {id: 'provenance', status: 'unknown', value: false}],
    method: {id: 'formula', revision: 2, supportedConditions: [{id: 'heat', status: 'observed', value: 'gentle'}], changedAssumptions: [{id: 'lot', status: 'observed', value: 'replacement'}]},
    trace: [{id: 'prepare-1', process: 'powder', revision: 1, inputs: ['lot-7'], output: 'lot-7', hiddenResult: 'discard'}],
    receipt: {required: ['base', 'support'], retained: ['base']},
    consumer: {id: 'brew', description: 'Selected formula', truth: 'discard'},
    coverage: {searched: 1, total: 3, reason: 'Only held lots checked'},
});

test('inspector preserves zero, uncertainty and attributed belief as different evidence', () => {
    const result = inspectMaterialEvidence(fixture());
    assert.equal(result.properties[0].value, 0);
    assert.equal(Object.hasOwn(result.properties[1], 'value'), false);
    assert.equal(Object.hasOwn(result.properties[2], 'value'), false);
    assert.equal(result.properties[3].status, 'claim');
    assert.equal(result.properties[3].source, 'shopkeeper');
    assert.equal(result.properties[4].status, 'inferred');
    assert.deepEqual(result.failedConditions.map(r => r.id), ['heat']);
    assert.deepEqual(result.uncertainConditions.map(r => r.id), ['provenance']);
    assert.throws(() => inspectMaterialEvidence({properties: [{id: 'claim', status: 'claim', value: 1}]}), /attribution/);
});

test('inspector is read-only, detaches results, and does not pass through raw truth', () => {
    const input = fixture(), before = JSON.stringify(input);
    const output = inspectMaterialEvidence(input);
    assert.equal(JSON.stringify(input), before);
    assert.equal(JSON.stringify(output).includes('discard'), false);
    assert.equal(Object.hasOwn(output.lot, 'truth'), false);
    output.method.supportedConditions[0].value = 'changed';
    output.trace[0].inputs.push('another');
    assert.equal(JSON.stringify(input), before);
});

test('unknown evidence changes neither numeric display nor refusal when hidden value changes', () => {
    const a = fixture(), b = fixture();
    b.properties[1].value = -123;
    b.properties[2].value = 987;
    b.conditions[2].value = true;
    b.lot.truth.quality = 1;
    assert.deepEqual(inspectMaterialEvidence(a), inspectMaterialEvidence(b));
});

test('search coverage and receipt sufficiency do not become physical impossibility or invented history', () => {
    const result = inspectMaterialEvidence(fixture());
    assert.equal(result.coverage.complete, false);
    assert.deepEqual(result.receipt.missing, ['support']);
    assert.equal(inspectMaterialEvidence().coverage.complete, false);
    assert.match(inspectMaterialEvidence({coverage: {searched: 3, total: 3}}).coverage.summary, /other sources may exist/);
    assert.throws(() => inspectMaterialEvidence({coverage: {searched: 4, total: 3}}), /exceeds/);
    assert.throws(() => inspectMaterialEvidence({conditions: [{id: 'fit', status: 'observed', value: 'no'}]}), /boolean/);
});

test('method conditions and revision survive changed assumptions without claiming replay', () => {
    const input = fixture(), out = inspectMaterialEvidence(input);
    assert.equal(out.method.revision, 2);
    assert.equal(out.method.revisionStatus, 'specified');
    assert.deepEqual(out.method.changedAssumptions, input.method.changedAssumptions);
    delete input.method.revision;
    assert.equal(inspectMaterialEvidence(input).method.revisionStatus, 'unsupported');
});
