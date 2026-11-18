#!/usr/bin/env node
// Prove a stepping change keeps results identical: run the same save and seed in two checkouts
// (the reference one, e.g. `git archive <base> | tar -x -C ref`, and this one) and compare digests.
//   node scripts/headless/step_parity.mjs --ref <dir> --save <save.json|fresh> [--minutes 240] [--chunk 60] [--seed 1]
// Exit 1 on any difference. The worker (step_digest.mjs) is copied into the reference tree.
import {spawnSync} from 'node:child_process';
import {copyFileSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)), ROOT = resolve(here, '../..');
const opt = {minutes:'240', chunk:'60', seed:'1'};
for(let i = 2; i < process.argv.length; i += 2) opt[process.argv[i].slice(2)] = process.argv[i + 1];
if(!opt.ref || !opt.save) throw new Error('Give --ref <checkout> and --save <file|fresh>.');
copyFileSync(join(here, 'step_digest.mjs'), join(resolve(opt.ref), 'scripts/headless/step_digest.mjs'));
const run = root => {
    const r = spawnSync('node', [join(root, 'scripts/headless/step_digest.mjs'), opt.save === 'fresh' ? 'fresh' : resolve(opt.save), opt.minutes, opt.chunk, opt.seed], {encoding:'utf8', maxBuffer:1 << 26});
    if(r.status !== 0) throw new Error(`digest failed in ${root}: ${r.stderr.slice(-800)}`);
    return JSON.parse(r.stdout.trim().split('\n').at(-1));
};
const ref = run(resolve(opt.ref)), cur = run(ROOT);
const same = ref.snapshot === cur.snapshot && ref.clock === cur.clock && JSON.stringify(ref.stored) === JSON.stringify(cur.stored);
console.log(JSON.stringify({same, minutes:cur.minutes, ref:{cpuMs:ref.cpuMs, wallMs:ref.wallMs, snapshot:ref.snapshot}, cur:{cpuMs:cur.cpuMs, wallMs:cur.wallMs, snapshot:cur.snapshot},
    storedDiff:Object.keys({...ref.stored, ...cur.stored}).filter(k => ref.stored[k] !== cur.stored[k]), errors:[ref.errors, cur.errors]}));
process.exit(same ? 0 : 1);
