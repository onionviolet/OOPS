// Shared perf-gate plumbing: temp-tree builds, a static server on a free port,
// a Chrome launcher, the baseline metrics window and the det capture.
// Ported from docs/gm/dispatch/engine-perf-2026-10-14/tools/{baseline,det}.cjs
// so the gate never writes tracked dist/ or index.html.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import {execFileSync, spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const FIXTURE_DIR = path.join(ROOT, 'tests/fixtures/perf');
export const FIXTURES = ['fresh', 'mid', 'crowded'];
const require = createRequire(import.meta.url);

export function loadPlaywright() {
  const candidates = [process.env.YAIRPG_PLAYWRIGHT, 'playwright',
    path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
  for (const c of candidates) { try { return require(c); } catch {} }
  throw new Error('Playwright not found. Set YAIRPG_PLAYWRIGHT to a playwright package path.');
}

export async function launchChrome() {
  const {chromium} = loadPlaywright();
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.YAIRPG_CHROME || (fs.existsSync(mac) ? mac : undefined);
  return chromium.launch({headless: true, ...(executablePath ? {executablePath} : {})});
}

// Paths the build and the served page need. docs/ is large, so only the docs
// directories that src/ imports are added (found per revision, see prepareTree).
const TREE_PATHS = ['build.js', 'package.json', 'index.html', 'style.css', 'favicon.ico', 'styles', 'src', 'stories',
  'locales', 'resources', 'assets', 'scripts/compile_feature_ink.mjs', 'docs/gm/feature-wave/ink'];

const docsImports = dir => {
  const found = new Set();
  const walk = d => { for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.js')) for (const m of fs.readFileSync(p, 'utf8').matchAll(/['"](?:\.\.\/)+(docs\/[^'"]+)['"]/g)) found.add(path.dirname(m[1]));
  } };
  walk(path.join(dir, 'src'));
  return [...found];
};

// rev 'WORKTREE' copies tracked and untracked-unignored files from disk; any other rev uses git archive.
export function prepareTree(rev, dir) {
  fs.rmSync(dir, {recursive: true, force: true});
  fs.mkdirSync(dir, {recursive: true});
  const copy = paths => {
    if (rev === 'WORKTREE') {
      const list = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '--deduplicate', '-z', '--', ...paths], {cwd: ROOT, maxBuffer: 1 << 28})
        .toString().split('\0').filter(f => f && fs.existsSync(path.join(ROOT, f)));
      for (const f of list) { fs.mkdirSync(path.dirname(path.join(dir, f)), {recursive: true}); fs.copyFileSync(path.join(ROOT, f), path.join(dir, f)); }
    } else {
      const existing = paths.filter(p => { try { execFileSync('git', ['cat-file', '-e', `${rev}:${p}`], {cwd: ROOT, stdio: 'ignore'}); return true; } catch { return false; } });
      const tar = execFileSync('git', ['archive', '--format=tar', rev, '--', ...existing], {cwd: ROOT, maxBuffer: 1 << 30});
      execFileSync('tar', ['-x', '-C', dir], {input: tar, maxBuffer: 1 << 30});
    }
  };
  copy(TREE_PATHS);
  copy(docsImports(dir));
  fs.mkdirSync(path.join(dir, 'dist'), {recursive: true});
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(dir, 'node_modules'));
  return dir;
}

export function build(dir) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['build.js'], {cwd: dir, stdio: ['ignore', 'pipe', 'pipe']});
    let log = '';
    child.stdout.on('data', d => { log += d; });
    child.stderr.on('data', d => { log += d; });
    child.on('exit', code => code === 0 ? resolve(log) : reject(new Error(`build failed in ${dir}\n${log.slice(-4000)}`)));
  });
}

const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.map': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2'};

// Static server bound to 127.0.0.1 on an OS-assigned port (outside reserved gate ranges).
export function serve(dir) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\\/g, '/');
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(dir, p);
    if (!file.startsWith(dir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, {'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => {
    const {port} = server.address();
    resolve({url: `http://127.0.0.1:${port}/`, port, close: () => new Promise(r => { server.closeAllConnections?.(); server.close(r); })});
  }));
}

export const gameMinutes = t => (t.day_count * 24 + t.hour) * 60 + t.minute;
export const readFixture = name => fs.readFileSync(path.join(FIXTURE_DIR, name + '.json'), 'utf8');

// Opens a fresh origin, seeds the fixture once (reloads keep the game's own save), clicks PLAY.
export async function openGame(browser, url, fixtureText, {instrument = false} = {}) {
  const context = await browser.newContext({viewport: (([w, h]) => ({width: +w || 1920, height: +h || 1080}))((process.env.YAIRPG_PERF_VIEWPORT || '').split('x'))});
  await context.addInitScript(([d, inst]) => {
    if (d && !sessionStorage.getItem('perf-seeded')) { localStorage.setItem('save data', d); sessionStorage.setItem('perf-seeded', '1'); }
    if (!inst) return;
    const o = Storage.prototype.setItem;
    window.__ls = {n: 0, bytes: 0, ms: 0};
    Storage.prototype.setItem = function (k, v) { const a = performance.now(); o.call(this, k, v); const s = window.__ls; s.n++; s.bytes += String(v).length; s.ms += performance.now() - a; };
    window.__lt = [];
    try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({type: 'longtask', buffered: true}); } catch {}
  }, [fixtureText || null, instrument]);
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, {waitUntil: 'load'});
  const play = page.getByText('PLAY', {exact: true});
  await play.waitFor({state: 'visible', timeout: 30000});
  await play.click({noWaitAfter: true});
  const confirm = page.getByText('Confirm', {exact: true});
  await page.waitForTimeout(500);
  if (await confirm.isVisible().catch(() => false)) await confirm.click({noWaitAfter: true});
  await page.waitForFunction(() => typeof window.saveProgress === 'function' && !!localStorage.getItem('save data'), null, {polling: 250});
  return {context, page, errors};
}

const METRICS = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount', 'JSHeapUsedSize', 'Nodes', 'JSEventListeners'];

// One idle window of CDP renderer metrics plus the storage and long-task counters (baseline.cjs method).
export async function idleWindow(context, page, seconds) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.filter(m => METRICS.includes(m.name)).map(m => [m.name, m.value]));
  const counters = () => page.evaluate(() => ({n: window.__ls.n, bytes: window.__ls.bytes, lt: window.__lt.length, ltMs: window.__lt.slice()}));
  const m0 = await metrics(), c0 = await counters(), a = performance.now();
  await page.waitForTimeout(seconds * 1000);
  const wall = performance.now() - a, m1 = await metrics(), c1 = await counters();
  const d = k => m1[k] - m0[k], sec = wall / 1000;
  const longs = c1.ltMs.slice(c0.lt);
  return {
    wallMs: Math.round(wall),
    taskBusyPct: +(100 * d('TaskDuration') / sec).toFixed(1),
    scriptBusyPct: +(100 * d('ScriptDuration') / sec).toFixed(1),
    layoutsPerSec: +(d('LayoutCount') / sec).toFixed(1),
    styleRecalcsPerSec: +(d('RecalcStyleCount') / sec).toFixed(1),
    longTasks: longs.length,
    longTaskMaxMs: Math.round(Math.max(0, ...longs)),
    storageWritesPerMin: +((c1.n - c0.n) / sec * 60).toFixed(1),
    storageKBPerMin: +(((c1.bytes - c0.bytes) * 2 / 1024) / sec * 60).toFixed(0),
    heapMB: +(m1.JSHeapUsedSize / 1048576).toFixed(1),
    domNodes: m1.Nodes,
    listeners: m1.JSEventListeners,
  };
}

// det.cjs: from the fixture's own clock, wait for the first durable save at fixture minute + N.
export async function detCapture(browser, url, fixtureText, minutes) {
  const {context, page, errors} = await openGame(browser, url, fixtureText);
  try {
    const start = gameMinutes(JSON.parse(fixtureText)['current time']);
    const raw = await page.waitForFunction(target => {
      const v = localStorage.getItem('save data'), t = JSON.parse(v)['current time'];
      return ((t.day_count * 24 + t.hour) * 60 + t.minute) >= target && v;
    }, start + minutes, {polling: 20, timeout: minutes * 3000 + 30000});
    const save = JSON.parse(await raw.jsonValue());
    for (const k of ['saved_at', 'total_playtime']) delete save[k];
    return {text: JSON.stringify(save), start, end: gameMinutes(save['current time']), clock: save.expansion?.clock, errors};
  } finally { await context.close(); }
}

export const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
