import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, existsSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runOvernight, stopCheck} from '../scripts/lead_run/batch_overnight.mjs';

function setup(grades = {s1: ['B'], s2: ['B']}) {
    const dir = mkdtempSync(join(tmpdir(), 'night-'));
    const plans = {};
    for (const [label] of Object.entries(grades)) {
        plans[label] = join(dir, `${label}.json`);
        writeFileSync(plans[label], JSON.stringify({label, pass: 'census', privateDir: dir, outDir: dir, shards: [{prefix: 'x'}]}));
    }
    const calls = {submit: [], collect: []};
    const submitFn = async ({plan, maxUsd}) => { calls.submit.push([plan.label, maxUsd]); writeFileSync(join(dir, `${plan.label}_receipt.json`), JSON.stringify({batchId: `b-${plan.label}`, usdBatchEstimate: 0.01})); return {estimate: {usdBatch: 0.01}, receipt: {batchId: `b-${plan.label}`}}; };
    const collectFn = async ({batchId, plan}) => { calls.collect.push(batchId); return {usd: 0.012, shards: grades[plan.label].map((g, i) => ({id: `${i}`, status: 'ok', grade: g, nameAccuracy: 1})), repair: []}; };
    return {dir, plans, calls, submitFn, collectFn};
}

test('steps run in order, each label submitted once with its cap, summaries written, spend tracked', async () => {
    const {dir, plans, calls, submitFn, collectFn} = setup();
    const run = {ceilingUsd: 1, steps: [{name: 'A', gate: 'stop', labels: [{plan: plans.s1, cap: 0.05}]}, {name: 'B', gate: 'stop', labels: [{plan: plans.s2, cap: 0.05}]}]};
    const r = await runOvernight({run, runName: 't', submitFn, collectFn, log: () => {}, root: '/'});
    assert.equal(r.stopped, null);
    assert.deepEqual(calls.submit, [['s1', 0.05], ['s2', 0.05]]);
    assert.ok(existsSync(join(dir, 's2_summary.json')));
    assert.equal(Number(r.spent.toFixed(3)), 0.024);
    assert.ok(readFileSync(join(dir, 'overnight_t.jsonl'), 'utf8').includes('"done":true'));
    // Re-running skips finished labels: nothing is submitted again.
    const again = await runOvernight({run, runName: 't', submitFn, collectFn, log: () => {}, root: '/'});
    assert.equal(calls.submit.length, 2);
    assert.equal(again.stopped, null);
});

test('a failed stop rule ends the run before the next step; the ceiling blocks a step whose caps would pass it', async () => {
    const s = setup({s1: ['C', 'C', 'B'], s2: ['B']});
    const run = {ceilingUsd: 1, steps: [{name: 'A', gate: 'stop', labels: [{plan: s.plans.s1, cap: 0.05}]}, {name: 'B', gate: 'stop', labels: [{plan: s.plans.s2, cap: 0.05}]}]};
    const r = await runOvernight({run, runName: 't', submitFn: s.submitFn, collectFn: s.collectFn, log: () => {}, root: '/'});
    assert.equal(r.stopped, 'A');
    assert.deepEqual(s.calls.submit.map(c => c[0]), ['s1']);
    const t = setup();
    const r2 = await runOvernight({run: {ceilingUsd: 0.04, steps: [{name: 'A', labels: [{plan: t.plans.s1, cap: 0.05}]}]}, runName: 't', submitFn: t.submitFn, collectFn: t.collectFn, log: () => {}, root: '/'});
    assert.equal(r2.stopped, 'A');
    assert.equal(t.calls.submit.length, 0);
});

test('a submitted label with a receipt is collected, not resubmitted (restart after a crash)', async () => {
    const {dir, plans, calls, submitFn, collectFn} = setup({s1: ['B']});
    writeFileSync(join(dir, 's1_receipt.json'), JSON.stringify({batchId: 'b-old', usdBatchEstimate: 0.01}));
    await runOvernight({run: {ceilingUsd: 1, steps: [{name: 'A', labels: [{plan: plans.s1, cap: 0.05}]}]}, runName: 't', submitFn, collectFn, log: () => {}, root: '/'});
    assert.equal(calls.submit.length, 0);
    assert.deepEqual(calls.collect, ['b-old']);
});

test('stop rules: grade C share, name accuracy and cost over 2x; extra passes count failures only', () => {
    assert.equal(stopCheck([{label: 'x', summary: {usd: 0.01, shards: [{status: 'ok', grade: 'B', nameAccuracy: 0.8}]}, estimate: 0.01}]).length, 1);
    assert.equal(stopCheck([{label: 'x', summary: {usd: 0.05, shards: [{status: 'ok', grade: 'B', nameAccuracy: 1}]}, estimate: 0.01}]).length, 1);
    assert.equal(stopCheck([{label: 'r', summary: {usd: 0.01, shards: [{status: 'ok'}, {status: 'ok'}]}, estimate: 0.01}]).length, 0);
    assert.equal(stopCheck([{label: 'r', summary: {usd: 0.01, shards: [{status: 'max_tokens'}, {status: 'ok'}]}, estimate: 0.01}]).length, 1);
    // One lint row with full name accuracy is repairable, not a stop; two lint rows still count.
    const c = lint => ({status: 'ok', grade: 'C', lintIssues: lint, nameAccuracy: 1});
    assert.equal(stopCheck([{label: 'c', summary: {usd: 0.01, shards: [c(1), c(1), {status: 'ok', grade: 'B', nameAccuracy: 1}]}, estimate: 0.01}]).length, 0);
    assert.equal(stopCheck([{label: 'c', summary: {usd: 0.01, shards: [c(2), {status: 'ok', grade: 'B', nameAccuracy: 1}]}, estimate: 0.01}]).length, 1);
    // Pooled: one bad shard in a small book passes when the step as a whole is under the share.
    const ok = n => Array.from({length: n}, () => ({status: 'ok', grade: 'B', nameAccuracy: 1}));
    const small = {label: 'small', summary: {usd: 0.01, shards: [{status: 'max_tokens'}, ...ok(3)]}, estimate: 0.01}, big = {label: 'big', summary: {usd: 0.01, shards: ok(20)}, estimate: 0.01};
    assert.equal(stopCheck([small, big]).length, 1);
    assert.equal(stopCheck([small, big], {pooled: true}).length, 0);
});

test('pilot gate: grades, pooled new-entity recall and too-small references; experiment arms do not gate', async () => {
    const {pilotCheck} = await import('../scripts/lead_run/batch_overnight.mjs');
    const census = n => Array.from({length: n}, (_, i) => ({zh: `名${i}`, claimant: 'narration'}));
    const loadFn = (dir, p) => ({scenes: [], fills: [], census: p.startsWith('w') ? census(12) : census(10)});
    const ok = pilotCheck({summary: {usd: 0.01, shards: [{id: 'p1', status: 'ok', grade: 'B'}]}, estimate: 0.01, plan: {}, refs: {p1: 'w1'}, loadFn, knownFn: () => new Set()});
    assert.deepEqual(ok.reasons, []);
    assert.equal(ok.recall, 0.833);
    const low = pilotCheck({summary: {usd: 0.01, shards: [{id: 'p1', status: 'ok', grade: 'C'}]}, estimate: 0.01, plan: {}, refs: {p1: 'w1'}, loadFn: (d, p) => ({scenes: [], fills: [], census: p.startsWith('w') ? census(12) : census(3)}), knownFn: () => new Set()});
    assert.equal(low.reasons.length, 2);
    const s = setup({s1: ['B'], s2: ['C']});
    const run = {ceilingUsd: 1, steps: [{name: 'A', gate: 'stop', nonGating: ['s2'], labels: [{plan: s.plans.s1, cap: 0.05}, {plan: s.plans.s2, cap: 0.05}]}]};
    assert.equal((await runOvernight({run, runName: 't', submitFn: s.submitFn, collectFn: s.collectFn, log: () => {}, root: '/'})).stopped, null);
});

test('a dropped connection while collecting is retried; the label is collected once it succeeds', async () => {
    const s = setup({r1: ['B']});
    let calls = 0;
    const flaky = async args => { calls++; if (calls < 3) throw new Error('terminated'); return s.collectFn(args); };
    const run = {ceilingUsd: 1, steps: [{name: 'A', gate: 'stop', labels: [{plan: s.plans.r1, cap: 0.05}]}]};
    const out = await runOvernight({run, runName: 'retry', submitFn: s.submitFn, collectFn: flaky, log: () => {}, root: '/', retryMs: 1});
    assert.equal(calls, 3);
    assert.equal(out.stopped, null);
});

test('a relaunch re-gates a step whose labels were already collected', async () => {
    const s = setup({g1: ['C', 'C', 'B']});
    const run = {ceilingUsd: 1, steps: [{name: 'A', gate: 'stop', labels: [{plan: s.plans.g1, cap: 0.05}]}, {name: 'B', gate: 'stop', labels: [{plan: s.plans.g1, cap: 0.05}]}]};
    const first = await runOvernight({run, runName: 'regate', submitFn: s.submitFn, collectFn: s.collectFn, log: () => {}, root: '/'});
    assert.ok(first.stopped);
    const again = await runOvernight({run, runName: 'regate', submitFn: s.submitFn, collectFn: s.collectFn, log: () => {}, root: '/'});
    assert.ok(again.stopped, 'the second launch stops at the same step');
});
