// Luna read-forward queue: census, people, rules and texture passes for whole books on the ChatGPT subscription (no API, no Claude tokens while it runs).
//   node scripts/lead_run/luna_queue.mjs --books lotm2,lotm3,coi [--lanes 4] [--cap 85] [--ingest-every 20] [--limit N] [--effort medium] [--retry-effort high]
// One lane per shard does the four passes in order (census first; its ids are known names for the other three). A shard that already has a
// `<prefix>m_census.jsonl` in its private folder is skipped. Replies are checked (parse, thin against the book median); a failed shard gets one
// retry, never a third. Progress: <privateDir>/luna-q/<book>/state.json and queue.log. Resumable: rerun the same command.
// Stops launching when `codex_lane.mjs preflight` fails at --cap percent; running lanes finish. Prompts and replies hold book text: private folders only.
import {readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {requestsFromPlan, stripMeta} from './batch_lib.mjs';
import {splitPrompts} from './luna_lane.mjs';

const PLANS = 'docs/gm/dispatch/batch-reading-2026-10-27/plans', PASSES = ['census', 'people', 'rules', 'texture'];
const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const EFFORT = arg('--effort', 'medium'), RETRY_EFFORT = arg('--retry-effort', 'high');
const books = (arg('--books', '')).split(',').filter(Boolean), LANES = +arg('--lanes', 4), CAP = arg('--cap', '85'), EVERY = +arg('--ingest-every', 20), LIMIT = +arg('--limit', 1e9);
const readJ = f => JSON.parse(readFileSync(f, 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const preflightOk = () => spawnSync('node', ['scripts/codex_lane.mjs', 'preflight'], {env: {...process.env, CODEX_LANE_MAX_USED: CAP}}).status === 0;

function prepare(book) {
    const base = readJ(join(PLANS, `${book}_census.json`)), root = join(base.privateDir, 'luna-q', book);
    mkdirSync(root, {recursive: true});
    const plans = {};
    for (const pass of PASSES) {
        const src = readJ(join(PLANS, `${book}_${pass}.json`));
        const plan = {...src, label: `lq-${book}-${pass}`, outDir: join(root, pass), shards: src.shards.map(s => ({...s, prefix: s.prefix + 'L'}))};
        if (plan.glossary?.censusMatch) plan.glossary = {...plan.glossary, censusMatch: plan.glossary.censusMatch.replace('m_census', 'L?m_census')};
        mkdirSync(plan.outDir, {recursive: true});
        const file = join(root, `plan_${pass}.json`);
        if (!existsSync(join(plan.outDir, `${plan.label}_requests.jsonl`))) {
            const reqs = requestsFromPlan(plan);
            writeFileSync(join(plan.outDir, `${plan.label}_requests.jsonl`), reqs.map(r => JSON.stringify(stripMeta(r))).join('\n') + '\n');
        }
        if (!existsSync(join(plan.outDir, 'prompts'))) splitPrompts(plan);
        writeFileSync(file, JSON.stringify(plan, null, 1)); plans[pass] = {plan, file};
    }
    return {base, root, plans};
}

const brief = (book, id, plans) => {
    const p = pass => `${plans[pass].plan.outDir}/prompts/${id}-${pass}.md`, r = pass => `${plans[pass].plan.outDir}/replies/${id}-${pass}.json`;
    return `# Lane brief: Luna reads ${book} ${id} (census, people, rules, texture)

Model: gpt-6-luna, medium. Working directory /Users/weiwei/code/yet-another-idle-rpg. Do not commit, stash, reset, push or use the web, and edit no tracked repo file. The only files you create are the four reply files named below; creating them is required and allowed.

Four independent reading tasks on one shard, in this order. For each pass:
1. Read in full the prompt file (reader instructions, output schema, known names, shard text, separated by "=====").
2. Follow it exactly as the bounded source reader: read the whole shard text, give a full pass (every entity, person, rule and place the text supports, not a sample), record only what the shard states, no outside knowledge of the book or its sequels, exact locators. Omit people with nothing recorded.
3. Write the bare JSON the prompt asks for (no fences, no commentary) to the reply file and verify it parses (node -e).
Passes: census: ${p('census')} -> ${r('census')}
people: ${p('people')} -> ${r('people')} (ids of the census you just wrote count as known names)
rules: ${p('rules')} -> ${r('rules')}
texture: ${p('texture')} -> ${r('texture')}
Report one line: passes done and anything unsure.
`;
};

const count = f => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const rowsOf = o => (Array.isArray(o) ? o.length : o ? Object.values(o).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0) : 0);

async function runBook(book) {
    const {base, root, plans} = prepare(book), log = m => { const l = `${new Date().toISOString()} ${book} ${m}`; console.log(l); appendFileSync(join(root, 'queue.log'), l + '\n'); };
    const stateFile = join(root, 'state.json'), state = existsSync(stateFile) ? readJ(stateFile) : {done: {}, retried: {}, failed: {}};
    const save = () => writeFileSync(stateFile, JSON.stringify(state, null, 1));
    const ids = base.shards.map(s => s.prefix).filter(id => !existsSync(join(base.privateDir, `${id}m_census.jsonl`)) && !existsSync(join(base.privateDir, `${id}L_people.jsonl`)) && !state.done[id] && !state.failed[id]).slice(0, LIMIT);
    log(`${ids.length} shards to read (${Object.keys(state.done).length} done)`);
    const sizes = [], thin = id => { const c = PASSES.map(p => rowsOf(count(join(plans[p].plan.outDir, 'replies', `${id}L-${p}.json`)))); return {c, bad: c.some(x => x === 0) || (sizes.length >= 8 && c.reduce((s, x) => s + x, 0) < 0.3 * sizes.slice().sort((x, y) => x - y)[sizes.length >> 1])}; };
    const ingest = () => { for (const p of PASSES) spawnSync('node', ['scripts/lead_run/luna_lane.mjs', 'ingest', '--plan', plans[p].file], {encoding: 'utf8', maxBuffer: 1 << 28}); log('ingested'); };
    let running = 0, since = 0, stop = false; const queue = [], pending = [];
    for (const id of ids) { const t = thin(id); if (!t.bad) { state.done[id] = t.c; sizes.push(t.c.reduce((q, x) => q + x, 0)); } else queue.push(id); }
    save();
    const work = async id => {
        const lane = `sw-lq-${book}-${id}`, bf = join(root, `brief_${id}.md`); writeFileSync(bf, brief(book, id + 'L', plans));
        await new Promise(res => { const p = spawn('node', ['scripts/codex_lane.mjs', 'launch', lane + (state.retried[id] ? 'r' : ''), bf, '--model', 'gpt-6-luna', '--effort', state.retried[id] ? RETRY_EFFORT : EFFORT], {stdio: 'ignore'}); p.on('exit', res); });
        const t = thin(id);
        if (t.bad) { if (!state.retried[id]) { state.retried[id] = 1; queue.push(id); log(`${id} thin/missing ${t.c} -> retry`); } else { state.failed[id] = t.c; log(`${id} failed after retry ${t.c}`); } }
        else { sizes.push(t.c.reduce((s, x) => s + x, 0)); state.done[id] = t.c; since++; }
        save();
    };
    while (queue.length || running) {
        while (queue.length && running < LANES && !stop) {
            if (!preflightOk()) { stop = true; log('Codex cap reached, no more launches'); break; }
            const id = queue.shift(); running++; const pr = work(id).finally(() => running--); pending.push(pr); await sleep(5000);
        }
        if (stop && !running) break;
        if (since >= EVERY) { since = 0; ingest(); }
        await sleep(15000);
    }
    await Promise.all(pending); ingest(); save(); log(`book finished: done ${Object.keys(state.done).length}, failed ${Object.keys(state.failed).length}`);
    return !stop;
}
for (const b of books) if (!(await runBook(b))) break;
