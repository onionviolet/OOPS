// Luna plan queue: any batch reading plan (scenes, census, people, rules, texture) answered by `gpt-6-luna` on the ChatGPT subscription
// (no API), one lane per shard and pass in plan order. Plans run concurrently, so run a census plan before the plans that read its names.
//   node scripts/lead_run/luna_scenes.mjs --book coi --plans coi_pilot_scenes,coi_scenes [--schema 1.5] [--effort high] [--retry-effort high]
//        [--lanes 2] [--cap 70] [--wait <pid>] [--ingest-first] [--limit N]
// Plans are copied with the Luna `L` shard prefix and census match (as luna_queue.mjs does), so the Luna census serves as known names.
// --wait holds until another queue exits (its census must land first); --ingest-first then ingests every plan_*.json under the book's luna-q folder.
// A shard whose reply already parses is skipped; a missing or unparsable reply gets one retry, never a third. Stops launching at --cap percent.
// Progress: <privateDir>/luna-q/<book>/scenes.log (every pass logs there). Prompts and replies hold book text: private folders only.
import {readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {requestsFromPlan, stripMeta} from './batch_lib.mjs';
import {splitPrompts} from './luna_lane.mjs';

const PLANS = 'docs/gm/dispatch/batch-reading-2026-10-27/plans';
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const BOOK = arg('--book'), NAMES = arg('--plans', '').split(',').filter(Boolean), SCHEMA = arg('--schema', null);
const EFFORT = arg('--effort', 'high'), RETRY = arg('--retry-effort', 'high'), LANES = +arg('--lanes', 2), CAP = arg('--cap', '70');
const WAIT = +arg('--wait', 0), LIMIT = +arg('--limit', 1e9);
if (!BOOK || !NAMES.length) { console.error('usage: luna_scenes.mjs --book <key> --plans <plan,...> [options]'); process.exit(2); }
const readJ = f => JSON.parse(readFileSync(f, 'utf8')), sleep = ms => new Promise(r => setTimeout(r, ms));
const parses = f => { try { JSON.parse(readFileSync(f, 'utf8')); return true; } catch { return false; } };
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const preflightOk = () => spawnSync('node', ['scripts/codex_lane.mjs', 'preflight'], {env: {...process.env, CODEX_LANE_MAX_USED: CAP}}).status === 0;
const ingest = file => spawnSync('node', ['scripts/lead_run/luna_lane.mjs', 'ingest', '--plan', file], {encoding: 'utf8', maxBuffer: 1 << 28});

const first = readJ(join(PLANS, `${NAMES[0]}.json`)), root = join(first.privateDir, 'luna-q', BOOK);
mkdirSync(root, {recursive: true});
const log = m => { const l = `${new Date().toISOString()} ${BOOK} ${m}`; console.log(l); appendFileSync(join(root, 'scenes.log'), l + '\n'); };

while (WAIT && alive(WAIT)) await sleep(60000);
if (a.includes('--ingest-first')) for (const f of readdirSync(root).filter(f => /^plan_.*\.json$/.test(f))) ingest(join(root, f));

const plans = NAMES.map(name => {
    const src = readJ(join(PLANS, `${name}.json`)), label = `lq-${name}${SCHEMA ? '-' + SCHEMA.replace('.', '') : ''}`, outDir = join(root, `plan-${name}`);
    const plan = {...src, label, outDir, ...(SCHEMA ? {schemaVersion: SCHEMA} : {}), shards: src.shards.map(s => ({...s, prefix: s.prefix + 'L'}))};
    if (plan.glossary?.censusMatch) plan.glossary = {...plan.glossary, censusMatch: plan.glossary.censusMatch.replace('m_census', 'L?m_census')};
    mkdirSync(outDir, {recursive: true});
    const rf = join(outDir, `${label}_requests.jsonl`);
    if (!existsSync(rf)) writeFileSync(rf, requestsFromPlan(plan).map(r => JSON.stringify(stripMeta(r))).join('\n') + '\n');
    if (!existsSync(join(outDir, 'prompts'))) splitPrompts(plan);
    const file = join(root, `plan_${label}.json`); writeFileSync(file, JSON.stringify(plan, null, 1));
    return {plan, file};
});
const dirOf = {};
for (const {plan} of plans) for (const s of plan.shards) dirOf[`${s.prefix}-${plan.pass}`] = plan.outDir;
const paths = id => ({p: join(dirOf[id], 'prompts', `${id}.md`), r: join(dirOf[id], 'replies', `${id}.json`)});
const queue = Object.keys(dirOf).filter(id => !parses(paths(id).r)).slice(0, LIMIT), tries = {};
log(`${queue.length} shards to read at ${EFFORT}${SCHEMA ? `, schema ${SCHEMA}` : ''} (${Object.keys(dirOf).length - queue.length} already answered)`);

const work = async id => {
    const {p, r} = paths(id), lane = `sw-ls-${id}${tries[id] ? 'r' : ''}`, bf = join(root, `brief_${lane}.md`);
    writeFileSync(bf, `# Lane brief: Luna reads ${BOOK} ${id}

Model: gpt-6-luna. Working directory ${process.cwd()}. Do not commit, stash, reset, push or use the web, and edit no tracked repo file. The only file you create is the reply file below.
Read the whole prompt file (reader instructions, output schema, known names, shard text, separated by "=====") and follow it exactly as the bounded source reader: every row the whole shard supports, not a sample; only what the shard states, no outside knowledge of the book or its sequels; exact locators. Write the bare JSON the prompt asks for (no fences, no commentary) and verify it parses with node -e.

${p} -> ${r}
Report one line: rows written and any rows you were unsure of.
`);
    await new Promise(res => spawn('node', ['scripts/codex_lane.mjs', 'launch', lane, bf, '--model', 'gpt-6-luna', '--effort', tries[id] ? RETRY : EFFORT], {stdio: 'ignore'}).on('exit', res));
    if (parses(r)) return log(`${id} done`);
    if (!tries[id]) { tries[id] = 1; queue.push(id); log(`${id} missing -> retry`); } else log(`${id} failed after retry`);
};
let running = 0, stop = false, since = 0; const pending = [];
while (queue.length || running) {
    while (queue.length && running < LANES && !stop) {
        if (!preflightOk()) { stop = true; log('Codex cap reached, no more launches'); break; }
        const id = queue.shift(); running++; pending.push(work(id).finally(() => { running--; since++; })); await sleep(5000);
    }
    if (stop && !running) break;
    if (since >= 20) { since = 0; for (const x of plans) ingest(x.file); log('ingested'); }
    await sleep(15000);
}
await Promise.all(pending);
for (const x of plans) ingest(x.file);
log(`finished (${stop ? 'stopped at cap' : 'queue empty'}), ingested`);
