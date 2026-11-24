// Browser half of the save cost bench (docs/audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md, O6 and round 4).
// Builds a revision in a temp dir, opens each fixture headless in a fresh origin and reports:
//   - full manual save time (create_save, staging, durable stringify, storage write) and the storage write alone
//   - durable writes per minute in an idle window
//   - which save parts change between consecutive durable saves (the payoff of rebuilding changed parts only)
//   - size efficiency: raw, gzip and base64 export sizes
//   - with --profile: a CPU profile of the idle window, self time by function, from an unminified temp build
// Read-only for the checkout: nothing in dist/ or index.html changes.
//   node scripts/perf/save_probe.mjs [--rev HEAD|WORKTREE] [--fixtures fresh,mid,crowded] [--saves 15] [--idle 15] [--profile] [--profile-out prefix] [--tmp dir]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {prepareTree, build, serve, launchChrome, openGame, idleWindow, readFixture, median} from './lib.mjs';
import {splitSave, changedParts} from '../../src/save_parts.js';

const arg = (name, fallback) => {const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback;};
const rev = arg('rev', 'HEAD'), names = arg('fixtures', 'fresh,mid,crowded').split(','), saves = Number(arg('saves', 15)), idle = Number(arg('idle', 15));
const profile = process.argv.includes('--profile');
const tmp = arg('tmp', fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-save-probe-')));

const dir = prepareTree(rev, path.join(tmp, 'tree'));
if(profile) {
    // Temp copy only: readable function names in the profile.
    const file = path.join(dir, 'build.js');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('minify: true', 'minify: false'));
}
await build(dir);
const bundle = fs.readFileSync(path.join(dir, 'dist/bundle.js'));
const server = await serve(dir), browser = await launchChrome();
const report = {rev, minified: !profile, bundle: {bytes: bundle.length, gzip: zlib.gzipSync(bundle).length}, fixtures: {}};

const kb = n => Math.round(n / 1024);
function sizes(text) {
    const utf8 = Buffer.byteLength(text), gz = zlib.gzipSync(text, {level: 6}).length;
    return {rawKB: kb(utf8), storageKB: kb(text.length * 2), exportBase64KB: kb(Math.ceil(utf8 / 3) * 4), gzipKB: kb(gz), gzipRatio: +(utf8 / gz).toFixed(1)};
}
function churn(texts) {
    const manifests = texts.map(t => splitSave(JSON.parse(t)).manifest), counts = new Map();
    let changed = 0, total = 0, changedChars = 0, allChars = 0;
    for(let i = 1; i < texts.length; i++) {
        const split = splitSave(JSON.parse(texts[i])), names = changedParts(manifests[i - 1], manifests[i]);
        changed += names.length; total += Object.keys(split.parts).length;
        for(const n of names) {changedChars += split.parts[n].length; counts.set(n, (counts.get(n) || 0) + 1);}
        allChars += Object.values(split.parts).reduce((a, p) => a + p.length, 0);
    }
    const commits = texts.length - 1;
    return {commits, partsPerSave: commits ? Math.round(total / commits) : 0, changedPartsPerCommit: commits ? +(changed / commits).toFixed(1) : 0,
        changedShare: allChars ? +(changedChars / allChars).toFixed(3) : 0,
        usualChanges: [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([n, c]) => `${n} (${c}/${commits})`)};
}
function topSelf(cpu, limit = 15) {
    const byId = new Map(cpu.nodes.map(n => [n.id, n])), self = new Map(), dt = cpu.timeDeltas;
    for(let i = 0; i < cpu.samples.length; i++) {
        const f = byId.get(cpu.samples[i]).callFrame, key = `${f.functionName || '(anonymous)'} ${f.url ? path.basename(f.url) : ''}:${f.lineNumber + 1}`;
        self.set(key, (self.get(key) || 0) + (dt[i] || 0));
    }
    const total = [...self.values()].reduce((a, b) => a + b, 0);
    return [...self].filter(([k]) => !k.startsWith('(idle)')).sort((a, b) => b[1] - a[1]).slice(0, limit)
        .map(([k, us]) => `${(us / 1000).toFixed(0).padStart(6)} ms ${(100 * us / total).toFixed(1).padStart(5)}%  ${k}`);
}

try {
    for(const name of names) {
        const {context, page, errors} = await openGame(browser, server.url, readFixture(name), {instrument: true});
        await page.waitForTimeout(2000);
        const samples = await page.evaluate(n => {
            const out = [];
            for(let i = 0; i < n + 3; i++) {
                const s = window.__ls, ms0 = s.ms, t = performance.now();
                window.saveProgress();
                out.push({total: performance.now() - t, storage: s.ms - ms0});
            }
            return out.slice(3);
        }, saves);
        // Consecutive durable saves as the game writes them by itself.
        const texts = await page.evaluate(async seconds => {
            const seen = [], end = performance.now() + seconds * 1000;
            let last = null;
            while(performance.now() < end && seen.length < 40) {
                const v = localStorage.getItem('save data');
                if(v && v !== last) {seen.push(v); last = v;}
                await new Promise(r => setTimeout(r, 200));
            }
            return seen;
        }, Math.min(idle, 12));
        let cpu = null;
        const cdp = profile ? await context.newCDPSession(page) : null;
        if(cdp) {await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', {interval: 200}); await cdp.send('Profiler.start');}
        const window_ = await idleWindow(context, page, idle);
        if(cdp) cpu = (await cdp.send('Profiler.stop')).profile;
        if(cpu && arg('profile-out')) fs.writeFileSync(`${arg('profile-out')}.${name}.cpuprofile`, JSON.stringify(cpu));
        const stored = await page.evaluate(() => localStorage.getItem('save data') ?? '');
        report.fixtures[name] = {
            size: sizes(stored),
            manualSaveMs: {best: +Math.min(...samples.map(s => s.total)).toFixed(1), median: +median(samples.map(s => s.total)).toFixed(1)},
            storageWriteMs: +median(samples.map(s => s.storage)).toFixed(2),
            idle: {storageWritesPerMin: window_.storageWritesPerMin, scriptBusyPct: window_.scriptBusyPct, taskBusyPct: window_.taskBusyPct,
                longTasks: window_.longTasks, longTaskMaxMs: window_.longTaskMaxMs, layoutsPerSec: window_.layoutsPerSec, heapMB: window_.heapMB, domNodes: window_.domNodes},
            churn: churn(texts),
            ...(cpu ? {profileTopSelf: topSelf(cpu)} : {}),
            pageErrors: errors.length,
        };
        await context.close();
    }
} finally {
    await browser.close(); await server.close();
    if(!process.argv.includes('--keep')) fs.rmSync(tmp, {recursive: true, force: true});
}
console.log(JSON.stringify(report, null, 1));
