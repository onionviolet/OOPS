// Unattended run of approved batch stages (NOV1_SCHEDULE): submit each step's labels, collect them, apply the gate, then the next step.
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//       node scripts/lead_run/batch_overnight.mjs --run <run.json>
// Run file: {approval, ceilingUsd, steps: [{name, gate?: 'pilot'|'stop', pilotLabel?, pilotRefs?, nonGating?: [labels], labels: [{plan, cap}]}]}. Only labels Weibao approved with their caps belong in it.
// Resumable: a label with a receipt is collected, not resubmitted; a label with a summary is skipped. Stops (and says why) on a failed gate, a stop rule,
// a cap above the remaining ceiling, or an error. Repair batches are written by collect but never submitted here (they need their own go).
// Log: <outDir>/overnight_<run name>.jsonl with labels, batch ids, counts and dollars only.
import {readFileSync, writeFileSync, appendFileSync, existsSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeClient, collect, stripMeta, glossaryFromPlan} from './batch_lib.mjs';
import {submit} from './batch_submit.mjs';
import {compareShards, load} from './batch_compare.mjs';

const readJson = p => JSON.parse(readFileSync(p, 'utf8'));

/** Stop rules (PLAN section 4) over one step's collect summaries; extra passes count failed shards only. */
/** Grade C from exactly one lint row with full name accuracy: the repair batch fixes it, so it is not a stop. */
export const repairable = s => s.grade === 'C' && (s.lintIssues ?? s.lint) === 1 && (s.nameAccuracy ?? 1) >= 1;

export function stopCheck(results) {
    const reasons = [];
    for (const {label, summary, estimate} of results) {
        const shards = summary.shards || [];
        const failed = shards.filter(s => s.status !== 'ok').length, graded = shards.filter(s => s.grade);
        // A C shard with one lint row gets a repair request for cents (NOV1_SCHEDULE section 9); only C shards with more count against the wave.
        const gradeC = graded.filter(s => s.grade === 'C' && !repairable(s)).length, lowName = graded.filter(s => s.nameAccuracy < 0.9).length;
        if (shards.length && (gradeC + failed) / shards.length > 0.2) reasons.push(`${label}: ${gradeC} grade C and ${failed} failed of ${shards.length}`);
        if (lowName) reasons.push(`${label}: ${lowName} shard(s) with name accuracy under 0.9`);
        if (estimate && summary.usd > 2 * estimate) reasons.push(`${label}: measured $${summary.usd} over 2x the estimate $${estimate}`);
    }
    return reasons;
}

/** Pilot rule (G1): each pilot census shard grade A or B, pooled new-entity recall at least 0.75 against the agent run, cost within 2x. */
export function pilotCheck({summary, estimate, plan, refs, loadFn = load, knownFn = p => new Set([...glossaryFromPlan(p).keys()])}) {
    const reasons = [];
    for (const s of summary.shards || []) if (s.status !== 'ok' || !(['A', 'B'].includes(s.grade) || repairable(s))) reasons.push(`pilot ${s.id}: ${s.status} grade ${s.grade}`);
    if (estimate && summary.usd > 2 * estimate) reasons.push(`pilot cost $${summary.usd} over 2x $${estimate}`);
    const known = knownFn(plan);
    let fresh = 0, found = 0;
    for (const [cand, ref] of Object.entries(refs)) {
        const c = compareShards(loadFn(plan.privateDir, ref), loadFn(plan.privateDir, `${cand}m`), known);
        fresh += c.newEntity.fresh; found += c.newEntity.readerFound;
    }
    const recall = fresh ? found / fresh : null;
    if (fresh < 10) reasons.push(`pilot: only ${fresh} new entities in the reference, too few to judge`);
    else if (recall < 0.75) reasons.push(`pilot new-entity recall ${recall.toFixed(3)} under 0.75`);
    return {reasons, recall: recall == null ? null : Number(recall.toFixed(3)), fresh};
}

export async function runOvernight({run, runName, submitFn = submit, collectFn = collect, client = null, log = console.log, root = '.'}) {
    let spent = 0;
    const ledger = [];
    const note = (o, outDir) => { const line = {t: new Date().toISOString(), ...o}; ledger.push(line); log(JSON.stringify(line)); if (outDir) appendFileSync(join(outDir, `overnight_${runName}.jsonl`), JSON.stringify(line) + '\n'); };
    let outDir = null;
    for (const step of run.steps) {
        const items = step.labels.map(l => ({...l, plan: readJson(resolve(root, l.plan))}));
        outDir = items[0].plan.outDir;
        // Labels already finished in an earlier run count at their measured cost and are not redone.
        const todo = [], results = [];
        for (const it of items) {
            const sumPath = join(it.plan.outDir, `${it.plan.label}_summary.json`);
            if (existsSync(sumPath)) { const summary = readJson(sumPath); spent += summary.usd || 0; results.push({label: it.plan.label, summary, estimate: null, plan: it.plan, done: true}); }
            else todo.push(it);
        }
        const capTotal = todo.reduce((a, it) => a + it.cap, 0);
        if (spent + capTotal > run.ceilingUsd) { note({step: step.name, stop: `caps $${capTotal.toFixed(2)} would pass the ceiling $${run.ceilingUsd} (spent $${spent.toFixed(4)})`}, outDir); return {stopped: step.name, spent, ledger}; }
        note({step: step.name, start: todo.map(it => it.plan.label), capTotal: Number(capTotal.toFixed(2)), spent: Number(spent.toFixed(4))}, outDir);
        const subs = [];
        for (const it of todo) {
            const receiptPath = join(it.plan.outDir, `${it.plan.label}_receipt.json`);
            if (existsSync(receiptPath)) { const r = readJson(receiptPath); subs.push({it, batchId: r.batchId, estimate: r.usdBatchEstimate}); continue; }
            const {estimate, receipt} = await submitFn({plan: it.plan, live: true, maxUsd: it.cap, outTokens: it.plan.outTokensAssumed || 25000, log: () => {}});
            subs.push({it, batchId: receipt.batchId, estimate: estimate.usdBatch});
            note({label: it.plan.label, submitted: receipt.batchId, estimate: estimate.usdBatch, cap: it.cap}, outDir);
        }
        const collected = await Promise.all(subs.map(async ({it, batchId, estimate}) => {
            const summary = await collectFn({client, batchId, plan: it.plan, outDir: it.plan.outDir, log: () => {}});
            const repairs = (summary.repair || []).filter(r => r.request).map(r => stripMeta(r.request));
            if (repairs.length) writeFileSync(join(it.plan.outDir, `${it.plan.label}_repair_requests.jsonl`), repairs.map(r => JSON.stringify(r)).join('\n') + '\n');
            const pub = {...summary, repair: (summary.repair || []).map(r => ({id: r.id, why: r.why})), repairRequests: repairs.length};
            writeFileSync(join(it.plan.outDir, `${it.plan.label}_summary.json`), JSON.stringify(pub, null, 1) + '\n');
            spent += summary.usd || 0;
            note({label: it.plan.label, collected: batchId, usd: summary.usd, shards: (summary.shards || []).map(s => ({id: s.id, status: s.status, grade: s.grade, lint: s.lintIssues, coverage: s.coverage?.rate})), repairRequests: repairs.length}, it.plan.outDir);
            return {label: it.plan.label, summary: pub, estimate, plan: it.plan};
        }));
        results.push(...collected);
        const reasons = stopCheck(results.filter(r => !r.done));
        if (step.gate === 'pilot') {
            const p = results.find(r => r.label === step.pilotLabel);
            if (p) { const pc = pilotCheck({summary: p.summary, estimate: p.estimate, plan: p.plan, refs: step.pilotRefs}); reasons.push(...pc.reasons); note({step: step.name, pilot: {recall: pc.recall, fresh: pc.fresh}}, outDir); }
        }
        // Experiment arms (A/B, union test) are recorded, not gating; every other label's stop rule ends the run.
        const arms = new Set(step.nonGating || []);
        const gating = reasons.filter(r => !arms.has(r.split(':')[0]));
        if (reasons.length) note({step: step.name, findings: reasons}, outDir);
        if (gating.length) { note({step: step.name, stop: 'gate failed', reasons: gating, spent: Number(spent.toFixed(4))}, outDir); return {stopped: step.name, spent, ledger}; }
        note({step: step.name, done: true, spent: Number(spent.toFixed(4))}, outDir);
    }
    return {stopped: null, spent, ledger};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), i = a.indexOf('--run');
    if (i < 0) { console.error('usage: batch_overnight.mjs --run run.json'); process.exit(2); }
    const runPath = a[i + 1], run = readJson(runPath), runName = run.name || 'run';
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
    try {
        const client = await makeClient();
        const r = await runOvernight({run, runName, client, root});
        console.log(JSON.stringify({stopped: r.stopped, spent: Number(r.spent.toFixed(4))}));
    } catch (e) { console.error(e.message); process.exit(1); }
}
