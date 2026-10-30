import test from 'node:test';
import assert from 'node:assert/strict';
import {recognizeTropes, TROPE_DIAL} from '../src/trope_recognizer.js';

const rel = (n, grievance = true) => ({axes: {}, ties: grievance ? {grievance: true} : {}, memories: Array.from({length: n}, (_, i) => ({id: `m${i}`, text: 'They attacked you at the gate.'}))});
const receipt = (i, person, result = 'delivered') => ({id: `story.outcome:${i}`, action: 'request.deliver', result, audience: ['player'], targetPerson: person});
const state = {chronicle: {relationships: {kesh: rel(3), marren: rel(1)}}, loreHistory: {receipts: [receipt(1, 'marren'), receipt(2, 'marren'), receipt(3, 'kesh', 'declined')]}};

test('names the patterns the saved record already shows, each citing real causes', () => {
    const t = recognizeTropes(state);
    assert.deepEqual(t.map(x => x.trope).sort(), ['helper_returns', 'rival_returns']);
    assert.equal(t.find(x => x.trope === 'rival_returns').with, 'kesh');
    assert.deepEqual(t.find(x => x.trope === 'helper_returns').causes, ['receipt:story.outcome:1', 'receipt:story.outcome:2']);
});

test('nothing in the record, nothing named; one event is not a pattern', () => {
    assert.deepEqual(recognizeTropes({}), []);
    assert.deepEqual(recognizeTropes({chronicle: {relationships: {a: rel(1)}}, loreHistory: {receipts: [receipt(1, 'a')]}}), []);
    assert.deepEqual(recognizeTropes({chronicle: {relationships: {a: rel(3, false)}}}), []);
});

test('the overuse dial raises the bar, caps the count and only winks when asked', () => {
    assert.deepEqual(recognizeTropes(state, {dial: {...TROPE_DIAL, rival_returns: {repeats: 4}}}).map(x => x.trope), ['helper_returns']);
    assert.deepEqual(recognizeTropes(state, {dial: {...TROPE_DIAL, rival_returns: {repeats: 99}, helper_returns: {repeats: 99}}}), []);
    const many = {chronicle: {relationships: {a: rel(3), b: rel(4), c: rel(5)}}};
    assert.equal(recognizeTropes(many).length, 2);
    assert.ok(!/tradition/.test(recognizeTropes(state)[0].line));
    assert.ok(recognizeTropes(state, {dial: {...TROPE_DIAL, wink: true}}).every(x => /tradition/.test(x.line)));
});

test('same record gives the same tropes (nothing stored, so reload cannot reroll)', () => {
    assert.deepEqual(recognizeTropes(state), recognizeTropes(structuredClone(state)));
});
