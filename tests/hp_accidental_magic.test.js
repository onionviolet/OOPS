import assert from 'node:assert/strict';
import test from 'node:test';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {coverageCase} from '../src/world_packs/hp_accidental_magic.js';

test('distress releases involuntary magic once and a restored responder can reverse it', async () => {
    assert.equal((await runCaseData(coverageCase('marge'))).state, 'expressed-authored');
});

test('stepping away during the provocation protects the subject and leaves the reserve intact after restore', async () => {
    const data = coverageCase('marge');
    const outburst = data.timeline.findIndex(step => step.id === 'outburst');
    const untouched = {holder: 'marge', property: 'form', direction: 'unchanged', to: 'ordinary'};
    const unspent = {holder: 'harry', quantity: 'energy:mana', direction: 'unchanged', to: 5};
    const away = {holder: 'marge', position: true, direction: 'changed', to: 'hall'};
    data.timeline.splice(outburst, data.timeline.length - outburst,
        {id: 'leave', ops: [{op: 'move', holder: 'marge', to: 'hall'}], expect: [away]},
        {id: 'restore-separation', restore: true},
        {id: 'out-of-reach', advanceTo: 6, expect: [untouched, unspent]});
    data.expect = [away, untouched, unspent];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a responder with no wand grip cannot reverse the restored inflation', async () => {
    const data = coverageCase('marge');
    const reverse = data.timeline.findIndex(step => step.id === 'reverse');
    const aloft = {holder: 'marge', position: true, direction: 'unchanged', to: 'ceiling'};
    const form = {holder: 'marge', property: 'form', direction: 'unchanged', to: 'ballooned'};
    const effort = {holder: 'responder', quantity: 'stamina', direction: 'unchanged', to: 5};
    data.timeline.splice(reverse, 0, {id: 'drop-wand',
        ops: [{op: 'property', holder: 'responder-wand', property: 'marks', value: []}]});
    const deflate = data.timeline.find(step => step.id === 'deflate');
    deflate.interruption = {working: 'reverse', reason: 'The casting implement is out of your hand.'};
    deflate.expect = [aloft, form, effort];
    data.timeline.pop();
    data.expect = [data.expect[0], effort, {...aloft, direction: 'changed'}, {...form, direction: 'changed'}];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a drained reserve cannot turn distress into an outburst after restore', async () => {
    const data = coverageCase('marge');
    const pending = data.timeline.findIndex(step => step.id === 'restore-before-outburst');
    const reserve = {holder: 'harry', quantity: 'energy:mana', direction: 'down', to: 0};
    data.timeline.splice(pending, data.timeline.length - pending,
        {id: 'exhausted', ops: [{op: 'set', holder: 'harry', quantity: 'energy:mana', amount: 0}], expect: [reserve]},
        {id: 'restore-exhaustion', restore: true},
        {id: 'remain-grounded', advanceTo: 6, expect: [
            {holder: 'marge', position: true, direction: 'unchanged', to: 'dining-room'},
            {holder: 'marge', property: 'form', direction: 'unchanged', to: 'ordinary'},
        ]});
    data.expect = [reserve];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});
