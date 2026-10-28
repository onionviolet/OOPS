// Batch reading, submit side. Dry run (default) writes the request file and a token/cost estimate and never touches the API.
// Live submission needs --live, ANTHROPIC_API_KEY in the environment, and --max-usd >= the estimate. Paid route: Weibao's explicit go per batch.
//   node scripts/lead_run/batch_submit.mjs --plan <plan.json> [--dry-run] [--out-tokens 25000]
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//       node scripts/lead_run/batch_submit.mjs --plan <plan.json> --live --max-usd 0.50
// Plan JSON: {label, pass:'census'|'scenes'|'full', privateDir, outDir, world?, model?, effort?, maxTokens?, schemaMode?, glossary:{wiki?, censusDir?, censusMatch?},
//             shards:[{prefix, shard, base, chapters}]}. Request files hold source text: keep outDir under the gitignored private folder.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {requestsFromPlan, estimateCost, stripMeta, planHash, makeClient} from './batch_lib.mjs';

export async function submit({plan, live = false, maxUsd = 0, outTokens = 25000, makeClientFn = makeClient, log = console.log, requestsFile = null, resubmit = false}) {
    // A repair batch submits the request file collect wrote (failing rows only), under the plan's folder with a "-repair" label.
    const reqs = requestsFile ? readFileSync(requestsFile, 'utf8').split('\n').filter(l => l.trim()).map(l => ({...JSON.parse(l), _hits: 0, _candidates: 0})) : requestsFromPlan(plan);
    if (requestsFile) plan = {...plan, label: `${plan.label}-repair`};
    mkdirSync(plan.outDir, {recursive: true});
    const estimate = {label: plan.label, pass: plan.pass, model: plan.model || 'claude-haiku-5-5', effort: plan.effort || 'low', planHash: planHash(plan),
        ...estimateCost(reqs, outTokens, plan.model), glossaryHitsTotal: reqs.reduce((a, r) => a + r._hits, 0), candidatesTotal: reqs.reduce((a, r) => a + r._candidates, 0),
        basis: 'tokens estimated by character count [I]; prices claude-api skill cached table 2026-10-06, Batch API half price; no cache hits assumed'};
    writeFileSync(join(plan.outDir, `${plan.label}_requests.jsonl`), reqs.map(r => JSON.stringify(stripMeta(r))).join('\n') + '\n');
    writeFileSync(join(plan.outDir, `${plan.label}_estimate.json`), JSON.stringify(estimate, null, 1) + '\n');
    log(JSON.stringify(estimate, null, 1));
    if (!live) { log('dry run: nothing sent'); return {estimate}; }
    if (existsSync(join(plan.outDir, `${plan.label}_receipt.json`)) && !resubmit) throw new Error(`${plan.label} already has a receipt (a batch was submitted); pass --resubmit only if you mean to pay for it again`);
    if (!(maxUsd > 0) || estimate.usdBatch > maxUsd) throw new Error(`estimate $${estimate.usdBatch} exceeds --max-usd ${maxUsd}; raise it deliberately or shrink the plan`);
    if (estimate.requestsOverPromptCap) throw new Error(`${estimate.requestsOverPromptCap} request(s) estimated over the 100K-token price tier; split the shard`);
    const client = await makeClientFn();
    const batch = await client.messages.batches.create({requests: reqs.map(stripMeta)});
    const receipt = {batchId: batch.id, label: plan.label, pass: plan.pass, planHash: estimate.planHash, requests: reqs.length, usdBatchEstimate: estimate.usdBatch, createdAt: new Date().toISOString()};
    writeFileSync(join(plan.outDir, `${plan.label}_receipt.json`), JSON.stringify(receipt, null, 1) + '\n');
    log(`submitted ${batch.id}; collect with batch_collect.mjs --plan <plan> --batch ${batch.id}`);
    return {estimate, receipt};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = (n, d = null) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : d; };
    const planPath = flag('--plan');
    if (!planPath) { console.error('usage: batch_submit.mjs --plan plan.json [--live --max-usd N] [--out-tokens N] [--requests repair.jsonl] [--resubmit]'); process.exit(2); }
    try {
        await submit({plan: JSON.parse(readFileSync(planPath, 'utf8')), live: a.includes('--live') && !a.includes('--dry-run'), maxUsd: Number(flag('--max-usd', 0)), outTokens: Number(flag('--out-tokens', 25000)), requestsFile: flag('--requests'), resubmit: a.includes('--resubmit')});
    } catch (e) { console.error(e.message); process.exit(1); }
}
