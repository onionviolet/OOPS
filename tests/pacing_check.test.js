// Pacing check (PAC1-PAC8). The analysis is pure: it reads trace records, so these tests run on
// fixture traces and never boot the game. One small recorder smoke test is gated by
// YAIRPG_PACING_BOOT=1 (it boots the whole game, about a minute).
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {analyzeTrace, compareToBaseline, buildBaseline, targetFor, TARGETS, DEFAULT_TARGET, BASELINE_PATH, PARAMS, PACING_PARAMS} from '../scripts/check_pacing.mjs';
import {flatten, diffFlat, START_IDS, SCHEMA_VERSION} from '../scripts/headless/trace.mjs';

const step = (i, t, o = {}) => ({type: 'step', i, minute: 1920 + t, t, action: {kind: 'click', selector: 'button', label: 'x'}, advanced: 10,
    text: {blocks: 5, new: 0, removed: 0, novel: 0, samples: []}, reports: [], refusals: [], money: {now: 0, delta: 0}, skills: [], items: [], unlocks: [],
    changed: {count: 0, buckets: {}, samples: []}, boots: 1, ...o});
const meta = (start = 'village') => ({type: 'meta', schemaVersion: 1, start, seed: 1, policy: {name: 'unseen-first', dt: 10, panelDt: 1, minutes: 1440, actions: 10}, startMinute: 1920, setup: [], world: 'base.frontier', location: 'Village'});
const end = (reason = 'actions') => ({type: 'end', reason, actions: 0, minutes: 0, errors: []});
const trace = (steps, start) => [meta(start), ...steps, end()];

test('first payoff, acted payoff and the gaps are measured from step times', () => {
    const steps = [];
    for(let i = 0; i < 10; i++) steps.push(step(i, (i + 1) * 10));
    steps[2] = step(2, 30, {action: {kind: 'wait', selector: 'wait', label: '60 minutes'}, unlocks: ['panel:x']});   // payoff on a wait
    steps[5] = step(5, 60, {money: {now: 5, delta: 5}});                                                          // acted payoff
    const r = analyzeTrace(trace(steps));
    assert.equal(r.firstPayoffMin, 30);
    assert.equal(r.firstPayoffKind, 'unlock');
    assert.equal(r.firstActedPayoffMin, 60);
    assert.equal(r.payoffCount, 2);
    assert.equal(r.longestPayoffGapMin, 40, 'from the money at 60 to the end at 100');
    assert.equal(r.firstMoneyMin, 60);
});

test('passive skill ticks are not a change; novel text, reports and other buckets are', () => {
    const passive = {count: 2, buckets: {levels: 2}, samples: []};
    const steps = [];
    for(let i = 0; i < 6; i++) steps.push(step(i, (i + 1) * 10, {changed: passive}));
    steps[3] = step(3, 40, {text: {blocks: 5, new: 1, removed: 0, novel: 1, samples: ['a line']}, changed: passive});
    const r = analyzeTrace(trace(steps));
    assert.equal(r.longestDeadMin, 30, 'steps 0 to 2 are dead for 30 minutes; the novel line at step 3 ends it, steps 4 and 5 are 20 more');
    const withBucket = steps.map((s, i) => i === 1 ? step(1, 20, {changed: {count: 1, buckets: {quests: 1}, samples: []}}) : s);
    assert.equal(analyzeTrace(trace(withBucket)).longestDeadMin, 20, 'a quest change at step 1 ends the first dead stretch after 10 minutes, steps 4 and 5 stay dead');
});

test('a trace with no payoff reports null first payoff and the whole trace as one gap', () => {
    const steps = Array.from({length: 5}, (_, i) => step(i, (i + 1) * 10));
    const r = analyzeTrace(trace(steps));
    assert.equal(r.firstPayoffMin, null);
    assert.equal(r.longestPayoffGapMin, 50);
    assert.equal(r.payoffCount, 0);
});

test('unlock gaps use only steps that unlocked something', () => {
    const steps = Array.from({length: 8}, (_, i) => step(i, (i + 1) * 10));
    steps[0] = step(0, 10, {unlocks: ['a']}); steps[2] = step(2, 30, {unlocks: ['b']}); steps[6] = step(6, 70, {unlocks: ['c']});
    const r = analyzeTrace(trace(steps));
    assert.equal(r.unlockGapMaxMin, 40);
    assert.equal(r.unlockGapMedianMin, 40);
});

test('skipped and errored traces are carried, not measured', () => {
    assert.equal(analyzeTrace([{type: 'meta', start: 'lotm.beside', skipped: true}]).status, 'skipped');
    assert.equal(analyzeTrace([meta(), {type: 'end', reason: 'error', actions: 0, minutes: 0, errors: ['x']}]).status, 'error');
});

test('ratchet: a recorded miss passes, a new miss fails, a worse value fails, a better value says tighten', () => {
    const slow = analyzeTrace(trace(Array.from({length: 20}, (_, i) => step(i, (i + 1) * 10, i === 15 ? {unlocks: ['a']} : {})), 'village'));
    assert.ok(slow.firstPayoffMin >= 160);
    const base = buildBaseline([slow]);
    assert.equal(compareToBaseline([slow], base).ok, true, 'today passes its own baseline');
    assert.equal(compareToBaseline([slow], {starts: {}}).ok, false, 'a miss with no baseline entry is new');
    const worse = {...slow, longestPayoffGapMin: slow.longestPayoffGapMin + 500};
    assert.ok(compareToBaseline([worse], base).regressions.some(g => g.measure === 'longestPayoffGapMin' && g.note === 'worse than baseline'));
    const jitter = {...slow, longestPayoffGapMin: slow.longestPayoffGapMin + 10};
    assert.equal(compareToBaseline([jitter], base).ok, true, 'a step or two of drift is inside the tolerance');
    const fast = analyzeTrace(trace(Array.from({length: 20}, (_, i) => step(i, (i + 1) * 10, i % 2 ? {unlocks: ['u' + i]} : {})), 'village'));
    assert.ok(compareToBaseline([fast], base).tighten.length > 0, 'meeting a recorded target asks to retire the entry');
    assert.equal(compareToBaseline([fast], base).ok, true);
});

test('targets are per start with a default and a reason (PAC3)', () => {
    for(const [id, t] of Object.entries(TARGETS)) assert.ok(t.reason && t.reason.length > 10, `${id} states a reason`);
    for(const id of START_IDS) assert.ok(targetFor(id).longestPayoffGapMin > 0, `${id} has a gap target`);
    assert.ok(targetFor('book.ri.academy').longestPayoffGapMin > targetFor('village').longestPayoffGapMin, 'a slow cultivation start is allowed longer');
    assert.equal(targetFor('no.such.start').firstPayoffMin, DEFAULT_TARGET.firstPayoffMin);
});

test('save flattening drops noise paths and counts buckets', () => {
    const a = flatten({'current time': {minute: 1}, money: 1, levels: {x: 1}, expansion: {rng: 5, clock: 9, streams: {a: 1}, keep: 1}});
    const b = flatten({'current time': {minute: 2}, money: 2, levels: {x: 1}, expansion: {rng: 6, clock: 10, streams: {a: 2}, keep: 1}});
    const d = diffFlat(a, b);
    assert.deepEqual(d.buckets, {money: 1});
    assert.equal(d.count, 1);
});

test('the committed baseline exists, matches the recording parameters and lists known starts', () => {
    assert.ok(existsSync(BASELINE_PATH), 'run node scripts/check_pacing.mjs --update-baseline');
    const base = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    assert.deepEqual(base.params, PACING_PARAMS);
    for(const id of Object.keys(base.starts)) assert.ok(START_IDS.includes(id), `${id} is a known start id`);
    assert.equal(SCHEMA_VERSION, 1);
});

test('a book life\'s own counters are payoffs: settled completions, the event log and a pack purse (work policy)', () => {
    const m = {...meta('book.hp.school'), progress0: {settled: 0, simLog: 0, jobs: 0, packs: 0}};
    const steps = Array.from({length: 8}, (_, i) => step(i, (i + 1) * 10, {progress: {settled: 0, simLog: 0, jobs: 0, packs: 0}}));
    steps[2] = step(2, 30, {progress: {settled: 1, simLog: 1, jobs: 0, packs: 0}});
    for(let i = 3; i < 8; i++) steps[i] = step(i, (i + 1) * 10, {progress: {settled: 1, simLog: 1, jobs: 0, packs: i >= 5 ? 10 : 0}});
    const r = analyzeTrace([m, ...steps, end()]);
    assert.equal(r.firstPayoffMin, 30);
    assert.equal(r.firstPayoffKind, 'progress');
    assert.equal(r.payoffCount, 2, 'the settled action and the pack silver; steady counters are not payoffs');
    const none = analyzeTrace([m, ...Array.from({length: 4}, (_, i) => step(i, (i + 1) * 10, {progress: {settled: 0, simLog: 0, jobs: 1, packs: 0}})), end()]);
    assert.equal(none.firstPayoffMin, null, 'a running job alone is not a payoff');
});

test('traces recorded without a progress field (the default policy) measure as before', () => {
    const steps = Array.from({length: 4}, (_, i) => step(i, (i + 1) * 10));
    assert.equal(analyzeTrace([meta(), ...steps, end()]).firstPayoffMin, null);
    assert.equal(PACING_PARAMS.policy, 'work');
    assert.equal(PARAMS.policy, undefined, 'PARAMS stays policy-free: the feedback check imports it');
});

test('work policy is a named option; the default policy name is unchanged', async () => {
    const {WORK_RX} = await import('../scripts/headless/trace.mjs');
    assert.ok(WORK_RX.test('work_outline Find workPays 5C per every 2 hours'));
    assert.ok(WORK_RX.test('Attend introductory charms'));
    assert.ok(!WORK_RX.test('Stale bread x5'));
});

test('recorder smoke (YAIRPG_PACING_BOOT=1): village records a clean, schema-complete trace', {skip: !process.env.YAIRPG_PACING_BOOT}, async () => {
    const {recordTrace} = await import('../scripts/headless/trace.mjs');
    const t = await recordTrace('village', {actions: 6});
    assert.equal(t.records[0].type, 'meta');
    assert.equal(t.records.at(-1).type, 'end');
    const keys = ['i', 'minute', 't', 'action', 'advanced', 'text', 'reports', 'refusals', 'money', 'skills', 'items', 'unlocks', 'changed', 'boots'];
    for(const s of t.steps) for(const k of keys) assert.ok(k in s, `step has ${k}`);
});

void fileURLToPath;
