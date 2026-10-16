// Standing perf gate (audit D6/T10, considerations PF1-PF2).
// Builds the working tree and a base commit into a temp dir, serves both on free
// ports, then per committed fixture measures:
//   Node   - advanceSimulation one-minute tick, best of 15 (pure step, head source)
//   Chrome - idle task/script busy %, long tasks, layouts/s, storage writes/min (head build)
//   det    - durable save after N game minutes, byte-identical between base and head
// and prints PASS/FAIL against scripts/perf/budgets.json.
// Usage: node scripts/perf/gate.mjs --base <commit> [--fixtures fresh,mid,crowded]
//        [--idle 15] [--det-minutes 8] [--budgets file] [--out report.json] [--keep]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import {ROOT, FIXTURES, prepareTree, build, serve, launchChrome, openGame, idleWindow, detCapture, readFixture, median} from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
if (!args.base || args.base === true) { console.error('usage: node scripts/perf/gate.mjs --base <commit> [--fixtures a,b] [--idle s] [--det-minutes n] [--budgets f] [--out f] [--keep]'); process.exit(2); }
const baseRev = execFileSync('git', ['rev-parse', '--verify', args.base + '^{commit}'], {cwd: ROOT}).toString().trim();
const fixtures = args.fixtures ? String(args.fixtures).split(',') : FIXTURES;
const IDLE = +(args.idle || 15), WARM = 4, DET_MIN = +(args['det-minutes'] || 8);
const budgets = JSON.parse(fs.readFileSync(args.budgets || path.join(ROOT, 'scripts/perf/budgets.json'), 'utf8'));
const t0 = performance.now(), log = (...a) => console.error(`[${((performance.now() - t0) / 1000).toFixed(0).padStart(3)}s]`, ...a);

async function nodeTicks(names) {
  const engine = await import(path.join(ROOT, 'src/expansion_engine.js'));
  const {expeditionRegistry: registry} = await import(path.join(ROOT, 'src/expedition_content.js'));
  const out = {};
  for (const name of names) {
    const save = JSON.parse(readFixture(name));
    const state = engine.loadExpansionState(save.expansion, registry);
    const inventory = Object.fromEntries(Object.entries(save.inventories.person.main_character).map(([k, v]) => [k, v.count]));
    const external = {money: save.character.money}, gameplay = {player: {inventory, skills: {}, reputation: {}}};
    const times = [];
    for (let i = 0; i < 18; i++) {
      const t = performance.now();
      engine.advanceSimulation(state, registry, 1, external, gameplay);
      if (i >= 3) times.push(performance.now() - t); // three warmups
    }
    // Budget on best-of-15: a busy host inflates the median, not the intrinsic minimum.
    out[name] = {nodeTickMs: +Math.min(...times).toFixed(2), nodeTickMedianMs: +median(times).toFixed(2)};
  }
  return out;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'yairpg-perf-gate-'));
const servers = [];
let browser, code = 1;
try {
  log(`base ${baseRev.slice(0, 10)}; head = working tree; fixtures ${fixtures.join(',')}; idle ${IDLE}s; det ${DET_MIN} game min`);
  const headDir = prepareTree('WORKTREE', path.join(tmp, 'head')), baseDir = prepareTree(baseRev, path.join(tmp, 'base'));
  await Promise.all([build(headDir), build(baseDir)]);
  const [head, base] = await Promise.all([serve(headDir), serve(baseDir)]);
  servers.push(head, base);
  log('built and serving', head.url, base.url);

  const report = {base: baseRev, head: 'WORKTREE', headCommit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: ROOT}).toString().trim(),
    idleSec: IDLE, detMinutes: DET_MIN, host: {platform: process.platform, arch: process.arch, cpus: os.cpus().length, loadavg: os.loadavg().map(x => +x.toFixed(1)), node: process.version},
    fixtures: {}};
  const ticks = await nodeTicks(fixtures);
  log('node ticks', JSON.stringify(ticks));

  browser = await launchChrome();
  report.host.chrome = browser.version();
  for (const name of fixtures) {
    const text = readFixture(name);
    const {context, page, errors} = await openGame(browser, head.url, text, {instrument: true});
    await page.waitForTimeout(WARM * 1000);
    const idle = await idleWindow(context, page, IDLE);
    await context.close();
    report.fixtures[name] = {fixtureBytes: Buffer.byteLength(text), ...ticks[name], ...idle, pageErrors: errors};
    log(name, 'idle', JSON.stringify(idle));
  }
  for (const name of fixtures) {
    const text = readFixture(name);
    const [b, h] = await Promise.all([detCapture(browser, base.url, text, DET_MIN), detCapture(browser, head.url, text, DET_MIN)]);
    const det = {identical: b.text === h.text, start: h.start, baseEnd: b.end, headEnd: h.end, clock: h.clock, bytes: h.text.length, errors: [...b.errors, ...h.errors]};
    if (!det.identical) {
      const dump = path.join(os.tmpdir(), `yairpg-perf-det-${name}-${process.pid}`);
      fs.writeFileSync(dump + '-base.json', b.text); fs.writeFileSync(dump + '-head.json', h.text);
      det.diffFiles = [dump + '-base.json', dump + '-head.json'];
    }
    report.fixtures[name].det = det;
    log(name, 'det', det.identical ? 'identical' : 'DIFFERENT', `minute ${det.start}->${det.headEnd}`);
  }

  // Budget check: every budgeted metric must be <= its budget; det identical; no page errors.
  const rows = [], failures = [];
  for (const name of fixtures) {
    const r = report.fixtures[name], b = budgets.fixtures[name] || {};
    for (const [metric, limit] of Object.entries(b)) {
      const ok = r[metric] <= limit;
      rows.push([name, metric, r[metric], limit, ok ? 'pass' : 'FAIL']);
      if (!ok) failures.push(`${name}.${metric} ${r[metric]} > ${limit}`);
    }
    rows.push([name, 'det identical', r.det.identical, true, r.det.identical ? 'pass' : 'FAIL']);
    if (!r.det.identical) failures.push(`${name}.det differs from base (${r.det.diffFiles.join(' vs ')})`);
    const errs = [...r.pageErrors, ...r.det.errors];
    rows.push([name, 'page errors', errs.length, 0, errs.length ? 'FAIL' : 'pass']);
    if (errs.length) failures.push(`${name} page errors: ${errs.slice(0, 3).join(' | ')}`);
  }
  report.failures = failures;
  report.result = failures.length ? 'FAIL' : 'PASS';
  report.host.loadavgEnd = os.loadavg().map(x => +x.toFixed(1));
  report.host.busy = Math.max(report.host.loadavg[0], report.host.loadavgEnd[0]) > os.cpus().length;
  report.wallSec = +((performance.now() - t0) / 1000).toFixed(0);
  const w = [8, 22, 10, 10, 5];
  console.log(['fixture', 'metric', 'value', 'budget', ''].map((c, i) => String(c).padEnd(w[i])).join(' '));
  for (const row of rows) console.log(row.map((c, i) => String(c).padEnd(w[i])).join(' '));
  const out = args.out && args.out !== true ? args.out : path.join(os.tmpdir(), `yairpg-perf-gate-${Date.now()}.json`);
  fs.writeFileSync(out, JSON.stringify(report, null, 1));
  console.log(`\n${report.result}  base ${baseRev.slice(0, 10)}  ${report.wallSec}s  load ${report.host.loadavg.join(' ')}  report ${out}`);
  for (const f of failures) console.log('  - ' + f);
  if (report.host.busy) console.log(`  WARNING: 1-min load above ${os.cpus().length} cores during the run; browser numbers are unreliable. Rerun on a quiet host before acting on a FAIL.`);
  code = failures.length ? 1 : 0;
} catch (e) {
  console.error(e);
  code = 2;
} finally {
  if (browser) await browser.close().catch(() => {});
  for (const s of servers) await s.close();
  if (!args.keep) fs.rmSync(tmp, {recursive: true, force: true});
  else console.error('kept', tmp);
}
process.exit(code);
