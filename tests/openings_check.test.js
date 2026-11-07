// Openings check (OPN1-OPN9). The analysis is pure: fixture scenes and traces, no game boots.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {analyzeOpening, compareToBaseline, buildBaseline, labelTerms, stepEffect, isSceneAction, BASELINE_PATH, DIALS, START_ORDER} from '../scripts/check_openings.mjs';

const step = (i, o = {}) => ({type: 'step', i, minute: 1920 + (i + 1) * 10, t: (i + 1) * 10, action: {kind: 'click', selector: '[data-native-choice="location"]', label: 'Talk to someone'}, advanced: 10,
    text: {blocks: 5, new: 0, removed: 0, novel: 0, samples: []}, reports: [], refusals: [], money: {now: 0, delta: 0}, skills: [], items: [], unlocks: [],
    changed: {count: 0, buckets: {}, samples: []}, boots: 1, ...o});
const prose = n => Array.from({length: n}, (_, i) => `word${i}`).join(' ');
const good = () => ({start: 'x', blocks: [{text: 'You stand in the workroom. A desk and a door.', region: 'scene'}, {text: 'Talk to the clerk and take the first job on the board.', region: 'scene'}],
    controls: [{label: 'Talk to the clerk', action: true, enabled: true, reason: ''}, {label: 'Take the job', action: true, enabled: false, reason: 'Talk to the clerk first.'}],
    pointer: {text: 'Next step: Talk to the clerk.', target: 'Talk to the clerk.'}});
const codes = r => r.flags.map(f => f.code);

test('a clean opening raises no flag', () => {
    const steps = [step(0, {changed: {count: 1, buckets: {quests: 1}, samples: []}, unlocks: ['quest:a:active']}), step(1), step(2)];
    const r = analyzeOpening({start: 'x', scene: good(), steps});
    assert.deepEqual(codes(r), []);
    assert.equal(r.measures.firstActionStep, 1);
});

test('a first screen with no action, a wall of prose and a stale pointer is flagged', () => {
    const scene = good();
    scene.controls = [];
    scene.blocks = [{text: prose(DIALS.proseWords + 40), region: 'scene'}, {text: 'Talk to someone nearby about the weather today please.', region: 'scene'}];
    scene.pointer = {text: 'Next step: Talk to the village elder.', target: 'Talk to the village elder.'};
    const c = codes(analyzeOpening({start: 'x', scene}));
    for(const want of ['no-action', 'prose-wall', 'long-block', 'stale-pointer']) assert.ok(c.includes(want), want);
});

test('chrome and options text does not count as scene prose', () => {
    const scene = good();
    scene.blocks.push({text: prose(500), region: 'chrome'}, {text: prose(500), region: 'reports'});
    assert.equal(analyzeOpening({start: 'x', scene}).measures.proseWords, 22);
});

test('unexplained terms and same-label controls', () => {
    assert.deepEqual(labelTerms('Practice Reparo · practice pane'), ['Reparo']);
    assert.deepEqual(labelTerms('Walk · 2 min'), []);
    assert.deepEqual(labelTerms('Repeat Spend an hour in the study room 3 times'), []);   // the first word of a Repeat button is its action's verb
    assert.deepEqual(labelTerms('Talk to Dunn Smith'), []);   // the label itself introduces the person
    assert.deepEqual(labelTerms('Walk to Saltgate wharf · 20 min'), []);
    const scene = good();
    scene.controls.push({label: 'Bind Fitting', action: true, enabled: true, reason: ''}, {label: 'Walk · 2 min', action: true, enabled: true, reason: ''}, {label: 'Walk · 2 min', action: true, enabled: true, reason: ''});
    const r = analyzeOpening({start: 'x', scene});
    assert.ok(codes(r).includes('unexplained-term'));
    assert.deepEqual(r.measures.unexplainedTerms, ['Fitting']);
    assert.ok(codes(r).includes('same-label'));
    scene.blocks.push({text: 'A fitting is a piece you bind to the frame here.', region: 'scene'});
    assert.deepEqual(analyzeOpening({start: 'x', scene}).measures.unexplainedTerms, [], 'a term the screen introduces is explained');
});

test('refusals need a reason; engine fallback text is flagged; a repeat button shares its base reason', () => {
    const scene = good();
    scene.controls.push({label: 'Practice it', action: true, enabled: false, reason: ''}, {label: 'Repeat Practice it 3 times', action: true, enabled: false, reason: ''},
        {label: 'Open it', action: true, enabled: false, reason: 'The required knowledge, means or circumstances are missing.'});
    const r = analyzeOpening({start: 'x', scene});
    assert.equal(r.measures.disabledNoReason, 2, 'Practice it and its repeat; the engine-text one has a (bad) reason');
    assert.ok(codes(r).includes('engine-reason'));
    scene.controls[2].reason = 'Practice has no target yet.';
    assert.equal(analyzeOpening({start: 'x', scene}).measures.disabledNoReason, 0, 'the blank repeat inherits its base action\'s reason');
});

test('a Village reason on another start is foreign; on the Village it is not', () => {
    const scene = good();
    scene.controls.push({label: 'Mixing', action: false, enabled: false, reason: 'Return to Village and finish your conversation.'});
    assert.ok(codes(analyzeOpening({start: 'lotm.storm', scene})).includes('foreign-place'));
    assert.ok(!codes(analyzeOpening({start: 'village', scene})).includes('foreign-place'));
});

test('trace measures: late first action, no-effect choices and dead stretches are policy-limited', () => {
    const steps = Array.from({length: 20}, (_, i) => step(i));
    steps[12] = step(12, {reports: ['You take the job.'], changed: {count: 1, buckets: {quests: 1}, samples: []}});
    const r = analyzeOpening({start: 'x', scene: good(), steps});
    assert.equal(r.measures.firstActionStep, 13);
    const by = Object.fromEntries(r.flags.map(f => [f.code, f]));
    assert.ok(by['first-action-late'].policyLimited && by['dead-stretch'].policyLimited && by['no-effect-choice'].policyLimited);
    assert.equal(by['dead-stretch'].value, 12);
    assert.equal(by['first-payoff-late'].value, 21, 'never within 20 presses counts as 21');
});

test('browsing presses and passive buckets are not scene actions or effects', () => {
    assert.equal(isSceneAction(step(0, {action: {kind: 'click', selector: 'button.shell-stat-record', label: 'STR12.0'}})), false);
    assert.equal(isSceneAction(step(0, {action: {kind: 'click', selector: 'button', label: '← Village'}})), false);
    assert.equal(isSceneAction(step(0)), true);
    assert.equal(stepEffect(step(0, {changed: {count: 2, buckets: {levels: 2}, samples: []}})).any, false);
    assert.equal(stepEffect(step(0, {text: {blocks: 1, new: 1, removed: 0, novel: 1, samples: ['a']}})).any, true);
});

test('ratchet: a recorded flag passes, a new or worse flag fails, a cleared one asks to tighten', () => {
    const scene = good(); scene.blocks = [{text: prose(DIALS.proseWords + 100), region: 'scene'}];
    const flagged = analyzeOpening({start: 'x', scene});
    const base = buildBaseline([flagged]);
    assert.equal(compareToBaseline([flagged], base).ok, true);
    const worse = analyzeOpening({start: 'x', scene: {...scene, blocks: [{text: prose(DIALS.proseWords + 600), region: 'scene'}]}});
    assert.equal(compareToBaseline([worse], base).ok, false);
    assert.equal(compareToBaseline([analyzeOpening({start: 'x', scene: good()})], base).tighten[0].code, 'prose-wall');
    assert.equal(compareToBaseline([flagged], {starts: {}}).regressions[0].note, 'new flag');
    const pending = {...analyzeOpening({start: 'x', scene: good()}), tracePending: true};
    const traceBase = {starts: {x: {misses: {'dead-stretch': 9}}}};
    assert.equal(compareToBaseline([pending], traceBase).tighten.length, 0, 'a pending trace does not clear trace flags');
});

test('the committed baseline parses and is consistent with itself (no boots)', () => {
    assert.ok(existsSync(BASELINE_PATH), 'run check_openings.mjs --update-baseline');
    const base = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    assert.equal(base.schema, 1);
    for(const id of Object.keys(base.starts)) assert.ok(START_ORDER.includes(id), `${id} is a known start`);
    for(const [id, s] of Object.entries(base.starts)) for(const [code, v] of Object.entries(s.misses)) assert.ok(Number.isFinite(v) && v >= 0, `${id} ${code}`);
    // Replaying the recorded values as flags compares clean against the baseline.
    const results = Object.entries(base.starts).map(([start, s]) => ({start, status: 'ok', flags: Object.entries(s.misses).map(([code, value]) => ({code, value}))}));
    assert.equal(compareToBaseline(results, base).ok, true);
});
