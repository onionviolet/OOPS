// Step fixtures headlessly and report game minutes per wall and per CPU second.
//   node scripts/headless/bench.mjs [--minutes 1440] [fresh|path/to/save.json ...]
// Defaults: fresh plus the committed perf fixtures (tests/fixtures/perf/*.json).
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {loadavg} from 'node:os';
import {boot, ROOT} from './runner.mjs';

const args = process.argv.slice(2);
const at = args.indexOf('--minutes');
const minutes = at >= 0 ? Number(args.splice(at, 2)[1]) : 1440;
const targets = args.length ? args : ['fresh', ...['fresh', 'mid', 'crowded'].map(n => join(ROOT, 'tests/fixtures/perf', n + '.json'))];
const rows = [];
for(const target of targets) {
    const save = target === 'fresh' ? null : await readFile(target, 'utf8');
    const b0 = performance.now();
    const game = await boot(save, {seed:1});
    const bootMs = performance.now() - b0;
    const cpu0 = process.cpuUsage(), t0 = performance.now();
    const {minutes:advanced} = await game.step(minutes);
    const wall = (performance.now() - t0) / 1000, cpu = process.cpuUsage(cpu0), cpuS = (cpu.user + cpu.system) / 1e6;
    rows.push({fixture:target === 'fresh' ? 'fresh' : target.split('/').pop(), bootMs:Math.round(bootMs), minutes:advanced,
        wallS:+wall.toFixed(2), cpuS:+cpuS.toFixed(2), minPerWallS:Math.round(advanced / wall), minPerCpuS:Math.round(advanced / cpuS), errors:game.errors.length});
    process.stderr.write(JSON.stringify(rows.at(-1)) + '\n');
}
process.stdout.write(JSON.stringify({minutes, load:loadavg().map(n => +n.toFixed(1)), node:process.version, rows}, null, 2) + '\n');
