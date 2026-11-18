// Worker for step_parity.mjs: boot a save, step it, print digests of the end state.
//   node scripts/headless/step_digest.mjs <save.json|fresh> <minutes> [chunk] [seed]
// Digests: canonical snapshot (det.cjs form), every stored localStorage value (the durable bytes
// minus saved_at and total_playtime), and the in-game clock. Same input must give the same digests
// before and after a stepping change (RT8: byte-identical to single ticks).
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {boot, canonicalSave} from './runner.mjs';

const [target, minutes, chunk = '60', seed = '1'] = process.argv.slice(2);
const sha = text => createHash('sha256').update(text).digest('hex').slice(0, 16);
const game = await boot(target === 'fresh' ? null : await readFile(target, 'utf8'), {seed:Number(seed)});
let line;
try {
    const t0 = performance.now(), cpu0 = process.cpuUsage();
    const r = await game.step(Number(minutes), {chunk:Number(chunk)});
    const cpu = process.cpuUsage(cpu0);
    const snap = canonicalSave(game.snapshot());
    const stored = {};
    const ls = game.window?.localStorage ?? globalThis.localStorage;
    for(let i = 0; i < ls.length; i++) {
        const k = ls.key(i), v = ls.getItem(k);
        let canon = v;
        try {canon = canonicalSave(v);} catch {}
        stored[k] = sha(canon);
    }
    line = JSON.stringify({minutes:r.minutes, clock:game.internals.expansionState?.clock, snapshot:sha(snap), snapshotBytes:snap.length, stored,
        errors:game.errors.length, wallMs:Math.round(performance.now() - t0), cpuMs:Math.round((cpu.user + cpu.system) / 1000)});
} finally {game.close();}
console.log(line);
