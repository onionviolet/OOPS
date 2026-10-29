// Overnight local census (READINESS_AND_SCOPE round 15): runs local_census_lane.py on every shard of the given census plans, in order,
// on the local Ollama model, for $0. Briefs and shard texts come from the same requests the batch would send (requestsFromPlan), so the
// local rows are a first reader for the November touch-up pass. Resumable: a shard whose output exists is skipped.
//   node scripts/lead_run/local_census_overnight.mjs --plans coi_census.json,ri5_census.json [--tag n1] [--min-free 25] [--predict 12000] [--limit n]
//     [--model qwen3.8:27b] [--seed 7] [--temp 0.3] [--think]   (a second pass with another --tag and --seed is a second reader to union)
// Memory gate (capacity doc LA11): before each shard, if free memory is under --min-free %, unload the model and wait 10 minutes.
// Outputs: <plan privateDir>/local-census/localai-<tag>-<prefix>_census.jsonl; progress lines in <that dir>/overnight_<tag>.jsonl.
import {readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {requestsFromPlan} from './batch_lib.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const PLANS = join(root, 'docs/gm/dispatch/batch-reading-2026-10-27/plans');
const LANE = join(root, 'scripts/lead_run/local_census_lane.py');
const a = process.argv.slice(2), flag = (n, d) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : d; };
const plans = flag('--plans', '').split(',').filter(Boolean), tag = flag('--tag', 'n1');
const minFree = Number(flag('--min-free', '25')), predict = flag('--predict', '12000');
let left = Number(flag('--limit', 'Infinity'));
const MODEL = flag('--model', 'qwen3.8:27b'), seed = flag('--seed', '7'), temp = flag('--temp', '0.3'), think = a.includes('--think') ? '1' : '0';

const freePct = () => Number(/(\d+)%/.exec(execFileSync('memory_pressure', {encoding: 'utf8'}).split('\n').filter(Boolean).at(-1))?.[1] ?? 0);
const swapUsed = () => /used = ([\d.]+)M/.exec(execFileSync('sysctl', ['vm.swapusage'], {encoding: 'utf8'}))?.[1];
const unload = () => { try { execFileSync('ollama', ['stop', MODEL]); } catch { /* not loaded */ } };
const sleep = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

for (const name of plans) {
    const plan = JSON.parse(readFileSync(join(PLANS, name), 'utf8'));
    const dir = join(plan.privateDir, 'local-census'), log = join(dir, `overnight_${tag}.jsonl`);
    mkdirSync(dir, {recursive: true});
    const note = o => appendFileSync(log, JSON.stringify({t: new Date().toISOString(), plan: name, ...o}) + '\n');
    for (const r of requestsFromPlan(plan)) {
        const key = r.custom_id.replace(/-census$/, ''), out = join(dir, `localai-${tag}-${key}_census.jsonl`);
        if (existsSync(out)) continue;
        if (left-- <= 0) break;
        const [meta, text] = r.params.messages[0].content.map(c => c.text);
        writeFileSync(join(dir, `brief_${key}.md`), meta);
        writeFileSync(join(dir, `shard_${key}_x.txt`), text);
        while (freePct() < minFree) { unload(); note({key, paused: 'low memory', free: freePct(), swapMB: swapUsed()}); sleep(600000); }
        const res = spawnSync('python3', ['-I', LANE, MODEL, tag, key, seed, temp], {encoding: 'utf8',
            env: {...process.env, LEADRUN_DIR: dir + '/', LOCAL_WORLD: plan.world, LOCAL_NUM_PREDICT: predict, LOCAL_KEEP: '1', LOCAL_THINK: think}});
        const info = res.stdout.trim().split('\n').at(-1);
        note({key, status: res.status, info: res.status === 0 ? JSON.parse(info) : (res.stderr || '').slice(-300), free: freePct(), swapMB: swapUsed()});
    }
    note({planDone: true, model: MODEL, seed, temp, think});
}
unload();
