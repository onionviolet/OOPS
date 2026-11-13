import assert from 'node:assert/strict';
import test from 'node:test';
import {runCaseData} from '../scripts/coverage_report.mjs';
import {coverageCase} from '../src/world_packs/hp_occlumency.js';

test('practice permits a paid mental defense that screens a restored Legilimens attempt until expiry', async () => {
    assert.equal((await runCaseData(coverageCase('occlumency'))).state, 'expressed-authored');
});

test('confusion during focus prevents a trained defense without spending the student’s effort', async () => {
    const data = coverageCase('occlumency');
    const guard = data.timeline.findIndex(step => step.id === 'guard');
    const access = {holder: 'reader', property: 'mind_access', direction: 'changed', to: ['["student","private-memory"]']};
    const effort = {holder: 'student', quantity: 'stamina', direction: 'unchanged', to: 4};
    data.timeline.splice(guard, 0, {id: 'distraction',
        ops: [{op: 'property', holder: 'student', property: 'mind_confusion', value: 1}]},
    {id: 'restore-distraction', restore: true});
    const focus = data.timeline.find(step => step.id === 'guard');
    focus.interruption = {working: 'guard', reason: 'The student cannot settle their thoughts.'};
    focus.expect = [effort];
    const probe = data.timeline.find(step => step.id === 'guarded');
    probe.expect[0] = access;
    data.timeline.find(step => step.id === 'lapse').expect[0].direction = 'unchanged';
    data.expect.find(row => row.holder === 'student' && row.quantity === 'stamina').to = 4;
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});

test('a tutor who leaves before a restored lesson finishes grants no progress', async () => {
    const data = coverageCase('occlumency');
    const lesson = data.timeline.findIndex(step => step.id === 'first-lesson');
    const effort = {holder: 'student', quantity: 'stamina', direction: 'unchanged', to: 8};
    const progress = {holder: 'student', quantity: 'occlumency-practice', direction: 'unchanged', to: 0};
    const away = {holder: 'tutor', position: true, direction: 'changed', to: 'outside'};
    data.timeline.splice(lesson, data.timeline.length - lesson,
        {id: 'tutor-leaves', ops: [{op: 'move', holder: 'tutor', to: 'outside'}], expect: [away]},
        {id: 'restore-lesson', restore: true},
        {id: 'failed-lesson', advanceTo: 3, interruption: {working: 'first-lesson', reason: 'The student needs an attentive tutor here.'},
            expect: [effort, progress]});
    data.expect = [away, effort, progress];
    assert.equal((await runCaseData(data)).state, 'expressed-authored');
});
