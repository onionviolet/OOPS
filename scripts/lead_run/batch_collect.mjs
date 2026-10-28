// Batch reading, collect side: poll, download, key results by custom_id, write private shard files, run migrate and the audit gate,
// log usage per request, and write a repair batch request file for failures (submit it with batch_submit.mjs --plan <same plan> --requests <label>_repair_requests.jsonl). Needs ANTHROPIC_API_KEY in the environment; no fallback.
//   ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" \
//       node scripts/lead_run/batch_collect.mjs --plan <plan.json> --batch <msgbatch_id>
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeClient, collect, stripMeta} from './batch_lib.mjs';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), flag = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : null; };
    const planPath = flag('--plan'), batchId = flag('--batch');
    if (!planPath || !batchId) { console.error('usage: batch_collect.mjs --plan plan.json --batch msgbatch_id'); process.exit(2); }
    try {
        const plan = JSON.parse(readFileSync(planPath, 'utf8')), client = await makeClient();
        const summary = await collect({client, batchId, plan, outDir: plan.outDir, log: m => console.error(m)});
        const repairs = summary.repair.filter(r => r.request).map(r => stripMeta(r.request));
        if (repairs.length) writeFileSync(join(plan.outDir, `${plan.label}_repair_requests.jsonl`), repairs.map(r => JSON.stringify(r)).join('\n') + '\n');
        const pub = {...summary, repair: summary.repair.map(r => ({id: r.id, why: r.why})), repairRequests: repairs.length};
        writeFileSync(join(plan.outDir, `${plan.label}_summary.json`), JSON.stringify(pub, null, 1) + '\n');
        console.log(JSON.stringify(pub, null, 1));
        if (repairs.length) console.log(`repair requests written (${repairs.length}); one repair batch per shard at most, a second grade C gets a fresh call, never a third (AU13)`);
    } catch (e) { console.error(e.message); process.exit(1); }
}
