// Launch Luna typing lanes for ability chunks, N at a time (L10). Free of Claude tokens: it only writes briefs, launches `codex_lane.mjs` lanes and
// checks that each reply covers every (id, item) of its chunk, retrying a short reply once.
//   node scripts/lead_run/ability_typing_fanout.mjs --dir <l10-abilities dir> [--parallel 3] [--max-used 85]
import {readFileSync, readdirSync, existsSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {execFileSync, spawn} from 'node:child_process';

const args = process.argv.slice(2), arg = (f, d) => {const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d;};
const dir = resolve(arg('--dir')), parallel = Number(arg('--parallel', 3)), maxUsed = arg('--max-used', '85');
const template = readFileSync(new URL('../../docs/gm/dispatch/sonnet-wave-2026-10-30/l10-briefs/TYPING_BRIEF_TEMPLATE.md', import.meta.url), 'utf8');
const lane = (...a) => execFileSync('node', ['scripts/codex_lane.mjs', ...a], {encoding: 'utf8', env: {...process.env, CODEX_LANE_MAX_USED: maxUsed}});
const covered = name => {
    const out = join(dir, `out_${name}.tsv`);
    if (!existsSync(out)) return false;
    const have = new Set(readFileSync(out, 'utf8').split('\n').filter(Boolean).map(l => l.split('\t').slice(0, 2).join('\t')));
    return JSON.parse(readFileSync(join(dir, `in_${name}.json`), 'utf8')).every(e => e.items.every(i => have.has(`${e.id}\t${i.k}`)));
};
const names = readdirSync(dir).filter(f => /^in_v\d_k\d+\.json$/.test(f)).map(f => f.slice(3, -5)).sort();
const todo = names.filter(n => !covered(n)).map(n => ({name: n, tries: 0}));
const running = new Map();
const sleep = ms => new Promise(r => setTimeout(r, ms));
console.log(`${todo.length} chunks to type of ${names.length}`);
while (todo.length || running.size) {
    const status = lane('status');
    for (const [id, job] of [...running]) {
        if (!new RegExp(`^${id}: exited`, 'm').test(status)) continue;
        running.delete(id);
        if (covered(job.name)) console.log(`done ${job.name}`);
        else if (job.tries < 2) {console.log(`short reply ${job.name}, retry`); todo.push(job);}
        else console.log(`FAILED ${job.name}`);
    }
    while (todo.length && running.size < parallel) {
        const job = todo.shift(); job.tries++;
        try {lane('preflight');} catch (e) {console.log('preflight stopped the fan-out:', String(e.stdout || e).slice(0, 200)); todo.length = 0; break;}
        const brief = join(dir, `brief_${job.name}.md`), id = `sw-l10-${job.name.replace('_', '')}-${Date.now() % 100000}`;
        writeFileSync(brief, template.replaceAll('{IN}', join(dir, `in_${job.name}.json`)).replaceAll('{OUT}', join(dir, `out_${job.name}.tsv`)));
        // Detached with no inherited pipes: `launch` otherwise holds the caller until the lane ends and the lanes would run one at a time.
        spawn('node', ['scripts/codex_lane.mjs', 'launch', id, brief, '--model', 'gpt-6-luna', '--effort', 'medium'], {stdio: 'ignore', detached: true, env: {...process.env, CODEX_LANE_MAX_USED: maxUsed}}).unref();
        running.set(id, job); console.log(`launched ${id}`);
    }
    await sleep(20000);
}
console.log('fan-out finished');
