import test from 'node:test';
import assert from 'node:assert/strict';
import {knowsRows, CERTAINTY} from '../src/knowledge_view.js';
// Foreknowledge entries as the Zorian loop writes them (stage 'interpreted' until this run confirms), read by the shared view.
const carried = stage => ({value: 'The lamp fails.', at: 5, stage, basis: {kind: 'recollection', carried: {stampDay: 15, carrier: 'self', sourceKind: 'foreknowledge', decaysAfterDays: 3, prediction: {day: 15, hour: null, text: 'x'}}}});
const rows = knowledge => knowsRows({knowledge: () => knowledge, facts: () => ({})});
test('a carried prediction not yet confirmed reads guessed; confirmed reads known; a plain current-loop fact is unchanged', () => {
    const r = rows({a: carried('interpreted'), b: carried('understood'), c: {value: 'seen', at: 6, stage: 'seen', basis: {kind: 'observation'}}});
    const by = Object.fromEntries(r.map(x => [x.key, x.certainty]));
    assert.deepEqual(by, {a: 'guessed', b: 'known', c: 'known'});
    assert.equal(r.find(x => x.key === 'a').certaintyLabel, CERTAINTY.guessed.label);
});
