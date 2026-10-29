// November touch-up census pilot (READINESS_AND_SCOPE round 15, proposal): the brief carries the local rows; the cloud reader returns only missing or corrected rows.
//   node touchup_pilot.mjs build                 write the 6 requests to <kit>/touchup/ (no network)
//   ANTHROPIC_API_KEY=... node touchup_pilot.mjs run   send them directly (paid; needs Weibao's go), one at a time, streaming
//   node touchup_pilot.mjs score                 union of local + touch-up vs the October high rows, beside medium+local and two merged medium runs
import {readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {requestsFromPlan, makeClient, parseMessage, usageUsd} from './batch_lib.mjs';

const root = new URL('../..', import.meta.url).pathname, KIT = join(root, 'docs/research/novels/_local-eval'), OUT = join(KIT, 'touchup');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans'), LOCAL_TAG = process.env.LOCAL_TAG || 'b12';
const SHARDS = {ri1c004: 'ri1_census.json', ri1c061: 'ri1_census.json', gc1c003: 'gc1_census.json', gc1c004: 'gc1_census.json', hp1c005: 'hp1_census.json', hp5c012: 'hp5_census.json'};
const dirs = {ri1: 'reverend-insanity/private/lead-run-2026-10-29', gc1: 'godclads/private/lead-run-2026-10-29', hp1: 'harry-potter/private/lead-run-2026-10-28', hp5: 'harry-potter/private/lead-run-2026-10-28'};
const jl = f => readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const localRows = id => jl(join(KIT, 'local_c44', `localai-${LOCAL_TAG}-${id}_census.jsonl`));

export const TOUCHUP_NOTE = `# Local first pass (touch-up task)

A small local model already read this shard and wrote the rows in the table below. It is incomplete and sometimes wrong: it finds roughly half of what a full census holds, most often missing places, organizations, creatures, laws, items, measures, prices, calendar and clock rows, and its notes are often thin. Do the census as the instructions say, reading the whole shard, but return ONLY:
(a) rows the table does not have (a new name, or a candidate that is a real price, measure, clock time or duration and has no row), and
(b) corrected rows for table rows that are wrong (wrong kind, wrong zh or locator, a wrong or misleading note). Give a corrected row the SAME id as the table row; it replaces that row. Leave a thin but true note such as "Mentioned by name." alone.
Do not repeat correct table rows. Do not assume the table is complete near the rows it has. A table row satisfies the rule that every candidate becomes a row, an anchor or is skipped.

| id | zh | kind | locator | note |
| --- | --- | --- | --- | --- |
`;
export function touchupMeta(meta, rows) {
    const t = rows.map(r => `| ${r.id} | ${r.zh} | ${r.kind} | ${r.firstMention} | ${(r.note || '').replace(/\|/g, '/')} |`).join('\n');
    return meta.replace('\n# Shard text\n', `\n${TOUCHUP_NOTE}${t}\n\n# Shard text\n`);
}
const plan = name => JSON.parse(readFileSync(join(PLANS, name), 'utf8'));
function build() {
    mkdirSync(OUT, {recursive: true});
    for (const [id, pf] of Object.entries(SHARDS)) {
        const p = plan(pf), r = requestsFromPlan({...p, shards: p.shards.filter(s => s.prefix === id), effort: 'medium'})[0];
        const [m, s] = r.params.messages[0].content, rows = localRows(id);
        r.params.messages[0].content = [{type: 'text', text: touchupMeta(m.text, rows)}, s];
        writeFileSync(join(OUT, `${id}-request.json`), JSON.stringify({custom_id: r.custom_id, params: r.params}));
        console.log(id, 'local rows', rows.length, 'brief chars', JSON.stringify(r.params).length);
    }
}
async function run() {
    const client = await makeClient();
    for (const id of Object.keys(SHARDS)) {
        const f = join(OUT, `${id}-census.touchup.message.json`); if (existsSync(f)) continue;
        const {params} = JSON.parse(readFileSync(join(OUT, `${id}-request.json`), 'utf8')), t0 = Date.now();
        const msg = await client.messages.stream(params).finalMessage();
        writeFileSync(f, JSON.stringify(msg));
        console.log(id, msg.stop_reason, 'out', msg.usage.output_tokens, 'usd(batch rate)', usageUsd(msg.usage).toFixed(4), 'sec', Math.round((Date.now() - t0) / 1000));
    }
}
const norm = s => (s || '').toLowerCase().replace(/^the /, '').replace(/[^a-z0-9一-鿿]/g, '');
const keys = rows => new Set(rows.flatMap(r => [norm(r.zh), norm(r.label), ...(r.aliases || []).map(norm)].filter(Boolean)));
const hit = (ref, k) => ref.filter(r => k.has(norm(r.zh)) || k.has(norm(r.label))).length;
const msgRows = (d, id) => { const f = readdirSync(d).find(f => f.startsWith(id + '-census')); const m = JSON.parse(readFileSync(join(d, f), 'utf8')); return {rows: parseMessage(m).rows?.census || [], out: m.usage?.output_tokens || 0}; };
function score() {
    const T = {}, add = (k, n, d) => { (T[k] = T[k] || [0, 0])[0] += n; T[k][1] += d; }, tok = {touch: 0, med1: 0, med2: 0};
    for (const id of Object.keys(SHARDS)) {
        const oct = jl(join(root, 'docs/research/novels', dirs[id.slice(0, 3)], `${id}_census.jsonl`)), lead = oct.filter(r => r.touchedByLead);
        const loc = localRows(id), m1 = msgRows(join(KIT, 'c13'), id), m2 = msgRows(join(KIT, 'c13med2'), id), tu = msgRows(OUT, id);
        const fixed = new Map(loc.map(r => [r.id, r])); let fixes = 0;
        for (const r of tu.rows) { if (fixed.has(r.id)) fixes++; fixed.set(r.id, r); }
        const union = [...fixed.values()] ,
            arms = {local: loc, 'touch-up only': tu.rows, 'local+touch-up': union, 'med1': m1.rows, 'med1+local': [...m1.rows, ...loc], 'med1+med2': [...m1.rows, ...m2.rows]};
        tok.touch += tu.out; tok.med1 += m1.out; tok.med2 += m2.out;
        console.log(id, `touch-up rows ${tu.rows.length} (corrections ${fixes}), out tokens ${tu.out} vs medium ${m1.out}`);
        for (const [n, rows] of Object.entries(arms)) { const k = keys(rows); add(n + ' recall', hit(oct, k), oct.length); add(n + ' lead', hit(lead, k), lead.length); }
    }
    for (const n of new Set(Object.keys(T).map(k => k.replace(/ (recall|lead)$/, '')))) { const r = T[n + ' recall'], l = T[n + ' lead']; console.log(n.padEnd(16), `recall ${(r[0] / r[1]).toFixed(3)}  lead ${(l[0] / l[1]).toFixed(3)}`); }
    console.log('output tokens: touch-up', tok.touch, 'plain medium', tok.med1, 'ratio', (tok.touch / tok.med1).toFixed(2));
}
const mode = process.argv[2];
if (mode === 'build') build(); else if (mode === 'run') await run(); else if (mode === 'score') score(); else console.log('usage: build | run | score');
