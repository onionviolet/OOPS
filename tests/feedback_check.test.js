// Feedback check (FBK1-FBK8). The analysis is pure: it reads trace records, so these tests run on
// fixture traces and never boot the game. The last test needs the committed baseline only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {classifyStep, analyzeTrace, buildBaseline, compareToBaseline, rollUp, backlogText, BASELINE_PATH, newestCachedTrace} from '../scripts/check_feedback.mjs';

const step = (i, selector, o = {}) => ({type: 'step', i, minute: 1920 + i * 10, t: i * 10, action: {kind: 'click', selector, label: selector}, advanced: 10,
    text: {blocks: 5, new: 0, removed: 0, novel: 0, samples: []}, reports: [], refusals: [], money: {now: 0, delta: 0}, skills: [], items: [], unlocks: [],
    changed: {count: 0, buckets: {}, samples: []}, boots: 1, ...o});
const meta = start => ({type: 'meta', schemaVersion: 1, start, seed: 1, policy: {name: 'unseen-first', dt: 10, panelDt: 1, minutes: 1440, actions: 10}, startMinute: 1920, setup: [], world: 'w', location: 'L'});
const trace = (steps, start = 'village') => [meta(start), ...steps, {type: 'end', reason: 'actions', actions: steps.length, minutes: 0, errors: []}];

test('each class is told apart', () => {
    assert.equal(classifyStep(step(0, 'a', {reports: ['You mend the net.']})), 'visible');
    assert.equal(classifyStep(step(0, 'a', {text: {blocks: 5, new: 1, removed: 0, novel: 1, samples: ['x']}})), 'visible');
    assert.equal(classifyStep(step(0, 'a', {text: {blocks: 5, new: 1, removed: 0, novel: 0, samples: []}})), 'visible-weak');
    assert.equal(classifyStep(step(0, 'a', {changed: {count: 2, buckets: {flags: 2}, samples: []}})), 'state-only');
    assert.equal(classifyStep(step(0, 'a', {changed: {count: 2, buckets: {levels: 2, skillRecords: 1}, samples: []}})), 'silent', 'passive ticks are not change');
    assert.equal(classifyStep(step(0, 'a')), 'silent');
    assert.equal(classifyStep(step(0, 'a', {refusals: [{kind: 'action-error', text: 'x'}]})), 'refused-silent');
    assert.equal(classifyStep(step(0, 'a', {refusals: [{kind: 'action-error', text: 'x'}], reports: ['Not enough coin.']})), 'refused-with-reason');
    assert.equal(classifyStep(step(0, 'a', {refusals: [{kind: 'disabled', text: 'Buy'}]})), 'silent', 'a newly seen disabled control is not this click\'s refusal');
});

test('a control is flagged only when none of its presses were visible', () => {
    const r = analyzeTrace(trace([
        step(0, '[data-a]'),                                                               // silent every time
        step(1, '[data-b]', {changed: {count: 1, buckets: {flags: 1}, samples: []}}),      // state-only
        step(2, '[data-c]'), step(3, '[data-c]', {reports: ['Done thing.']}),               // mixed: passes
        step(4, '[data-d]', {refusals: [{kind: 'step-error', text: 'x'}]}),                // refused-silent
    ]));
    assert.deepEqual(r.flagged.silent, ['[data-a]']);
    assert.deepEqual(r.flagged['state-only'], ['[data-b]']);
    assert.deepEqual(r.flagged['refused-silent'], ['[data-d]']);
});

test('focus-target selectors are policy artifacts, not findings', () => {
    const r = analyzeTrace(trace([step(0, 'h2.expanded-panel-heading'), step(1, '[data-recipe_id="Axe"]'), step(2, '[data-real]')]));
    assert.deepEqual(r.flagged.silent, ['[data-real]']);
    assert.equal(r.artifacts.length, 2);
});

test('an errored trace is pending, not measured', () => {
    const r = analyzeTrace([meta('lotm.storm'), {type: 'end', reason: 'error', actions: 0, minutes: 0, errors: ['enrol failed']}]);
    assert.equal(r.status, 'pending');
});

test('generic acknowledgements and shared lines are found', () => {
    const r = analyzeTrace(trace([
        step(0, '[data-a]', {reports: ['Done.']}),
        step(1, '[data-b]', {reports: ['You rest a while.']}), step(2, '[data-c]', {reports: ['You rest a while.']}), step(3, '[data-d]', {reports: ['You rest a while.']}),
        step(4, '[data-e]', {reports: ['The rent is due Monday.']}),
    ]));
    assert.equal(r.genericAck.length, 1);
    assert.equal(r.sharedLine.length, 1);
    assert.equal(r.sharedLine[0].controls.length, 3);
});

test('the ratchet: a new finding fails, a retired one asks to tighten, an equal tree passes', () => {
    const quiet = analyzeTrace(trace([step(0, '[data-a]')]));
    const base = buildBaseline([quiet], {seed: 1});
    assert.ok(compareToBaseline([quiet], base).ok);
    const worse = analyzeTrace(trace([step(0, '[data-a]'), step(1, '[data-z]')]));
    const bad = compareToBaseline([worse], base);
    assert.equal(bad.ok, false);
    assert.equal(bad.regressions[0].id, '[data-z]');
    const fixed = analyzeTrace(trace([step(0, '[data-a]', {reports: ['The latch clicks shut.']})]));
    const better = compareToBaseline([fixed], base);
    assert.ok(better.ok);
    assert.equal(better.tighten.length, 1);
});

test('the backlog ranks by presses and hides non-Village report text', () => {
    const a = analyzeTrace(trace([step(0, '[data-a]'), step(1, '[data-a]'), step(2, '[data-b]')]));
    const b = analyzeTrace(trace([step(0, '[data-x]', {reports: ['Done.']}), step(1, '[data-y]', {reports: ['A secret line shows here.']}), step(2, '[data-z]', {reports: ['A secret line shows here.']}), step(3, '[data-w]', {reports: ['A secret line shows here.']})], 'book.hp.school'));
    assert.equal(rollUp([a, b])[0].selector, '[data-a]');
    const md = backlogText([a, b], {seed: 1, actions: 10, dt: 10});
    assert.ok(md.includes('[data-a]'));
    assert.ok(!md.includes('A secret line'), 'book-start line text is shown as a hash');
    assert.ok(md.includes('hash; text not copied'));
});

test('the committed baseline is well formed', {skip: !existsSync(BASELINE_PATH)}, () => {
    const b = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    assert.equal(b.schema, 1);
    assert.ok(Object.keys(b.starts).length > 0);
    for(const s of Object.values(b.starts)) for(const k of ['silent', 'stateOnly', 'refusedSilent', 'genericAck', 'sharedLine']) assert.ok(Array.isArray(s[k]), k);
});

// Reads machine-local cached traces, which change whenever src or the trace policy changes;
// opt in with YAIRPG_FEEDBACK_TRACES=1 after a fresh `node scripts/check_feedback.mjs` run.
test('cached traces, when present, pass against the baseline (YAIRPG_FEEDBACK_TRACES=1)', {skip: !process.env.YAIRPG_FEEDBACK_TRACES}, () => {
    const b = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const results = [];
    for(const id of Object.keys(b.starts)) {
        const f = newestCachedTrace(id, b.params);
        if(!f) continue;
        const recs = readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
        const r = analyzeTrace(recs);
        if(r.status === 'ok') results.push(r);
    }
    const cmp = compareToBaseline(results, b);
    assert.deepEqual(cmp.regressions, []);
});

// FBK4 probe: where a disabled control's reason shows. Fake nodes carry only what the function reads.
const fake = (o = {}) => ({tagName: 'BUTTON', textContent: '', parentElement: null, attrs: {}, ownerDocument: {getElementById: () => null}, querySelectorAll: () => [], ...o,
    getAttribute(k) {return this.attrs?.[k] ?? null;}});
test('disabled controls: inline reason, title-only and none are told apart', async () => {
    const {disabledReasonKind} = await import('../scripts/check_feedback.mjs');
    assert.equal(disabledReasonKind(fake()), 'none');
    assert.equal(disabledReasonKind(fake({attrs: {title: 'Not now'}})), 'title-only');
    assert.equal(disabledReasonKind(fake({tagName: 'OPTION', textContent: 'Study · Ask around for someone to teach you', attrs: {title: 'x'}})), 'inline');
    const note = {textContent: 'No station here.', querySelectorAll: () => []};
    const box = {querySelectorAll: () => [note], parentElement: null};
    assert.equal(disabledReasonKind(fake({parentElement: box, attrs: {title: 'x'}})), 'inline', 'a visible reason node beside it wins over the title');
    assert.equal(disabledReasonKind(fake({parentElement: box}), n => n === note), 'none', 'a hidden reason node does not count');
    const doc = {getElementById: id => id === 'why' ? note : null};
    assert.equal(disabledReasonKind(fake({ownerDocument: doc, attrs: {'aria-describedby': 'why'}})), 'inline');
});
