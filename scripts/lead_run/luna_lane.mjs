// Subscription-lane reading: the same requests the batch route would send, answered by a Codex model (Luna) instead of the paid API.
//   node scripts/lead_run/luna_lane.mjs split   --plan <plan.json>    # dry-run request file -> one prompt file per request under <outDir>/prompts/
//   node scripts/lead_run/luna_lane.mjs ingest  --plan <plan.json>    # <outDir>/replies/<custom_id>.json -> shard files, migrate, audit (no network)
// Prompts and replies hold source text: keep outDir under the gitignored private folder. Run `batch_submit.mjs --dry-run` first to write the request file.
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {collect} from './batch_lib.mjs';

const text = c => (typeof c === 'string' ? c : (c || []).filter(b => b.type === 'text').map(b => b.text).join('\n'));

export function splitPrompts(plan) {
    const reqs = readFileSync(join(plan.outDir, `${plan.label}_requests.jsonl`), 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
    const dir = join(plan.outDir, 'prompts'); mkdirSync(dir, {recursive: true}); mkdirSync(join(plan.outDir, 'replies'), {recursive: true});
    for (const r of reqs) {
        const user = r.params.messages.map(m => text(m.content)).join('\n\n');
        writeFileSync(join(dir, `${r.custom_id}.md`), `${text(r.params.system)}\n\n=====\n\n${user}\n`);
    }
    return reqs.map(r => r.custom_id);
}

// A client-shaped object over local reply files, so collect() runs unchanged (usage is zero: subscription lane, not metered here).
export function localClient(plan) {
    const dir = join(plan.outDir, 'replies');
    const ids = new Set(readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')));
    return {messages: {batches: {
        retrieve: async () => ({processing_status: 'ended', request_counts: {local: ids.size}}),
        results: async () => (async function* () {
            for (const id of ids) yield {custom_id: id, result: {type: 'succeeded', message: {stop_reason: 'end_turn', content: [{type: 'text', text: readFileSync(join(dir, `${id}.json`), 'utf8')}], usage: {}}}};
        })(),
    }}};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const [cmd, ...a] = process.argv.slice(2), planPath = a[a.indexOf('--plan') + 1];
    if (!['split', 'ingest'].includes(cmd) || !planPath) { console.error('usage: luna_lane.mjs split|ingest --plan plan.json'); process.exit(2); }
    const plan = JSON.parse(readFileSync(planPath, 'utf8'));
    if (cmd === 'split') console.log(splitPrompts(plan).join('\n'));
    else {
        if (!existsSync(join(plan.outDir, 'replies'))) { console.error('no replies folder'); process.exit(1); }
        const s = await collect({client: localClient(plan), batchId: 'local', plan, outDir: plan.outDir, log: m => console.error(m)});
        console.log(JSON.stringify({...s, repair: s.repair.map(r => ({id: r.id, why: r.why}))}, null, 1));
    }
}
