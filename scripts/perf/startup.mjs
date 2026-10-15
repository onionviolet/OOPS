// Startup/load measurement (PF4). node scripts/perf/startup.mjs [--dir <served dir>] [--runs 5] [--fixtures fresh,crowded] [--out file]
// Serves the dir (default: this working tree, run `node build.js` first), fresh origin per run, 1366x768.
// cold = first load of the origin with empty HTTP cache; warm = reload of the same origin (cache-control: max-age
// so the bundle is cacheable). Metrics: bundle transfer, V8 compile+evaluate (CDP trace), PLAY visible, PLAY-ready.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {ROOT, launchChrome, readFixture, median} from './lib.mjs';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const dir = path.resolve(arg('dir', ROOT)), runs = +arg('runs', 5), fixtures = arg('fixtures', 'fresh,crowded').split(',');
const TYPES = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.map': 'application/json'};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html');
  const f = path.join(dir, p);
  if (!f.startsWith(dir) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'public, max-age=3600'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await launchChrome();
async function once(fixture, warm) {
  const context = await browser.newContext({viewport: {width: 1366, height: 768}});
  const text = readFixture(fixture);
  await context.addInitScript(d => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', '1'); if (d) localStorage.setItem('save data', d); } }, fixture === 'fresh' ? null : text);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const go = async () => {
    await cdp.send('Tracing.start', {traceConfig: {includedCategories: ['v8', 'devtools.timeline', 'disabled-by-default-v8.compile']}, transferMode: 'ReturnAsStream'}).catch(() => cdp.send('Tracing.start', {categories: 'v8,devtools.timeline', transferMode: 'ReturnAsStream'}));
    const t0 = Date.now();
    await page.goto(url, {waitUntil: 'load'});
    const tLoad = Date.now() - t0;
    const play = page.getByText('PLAY', {exact: true});
    await play.waitFor({state: 'visible', timeout: 60000});
    const tPlayVisible = Date.now() - t0;
    await play.click({noWaitAfter: true});
    await page.waitForTimeout(300);
    const confirm = page.getByText('Confirm', {exact: true});
    if (await confirm.isVisible().catch(() => false)) await confirm.click({noWaitAfter: true});
    await page.waitForFunction(() => typeof window.saveProgress === 'function' && !!localStorage.getItem('save data'), null, {polling: 25});
    const tReady = Date.now() - t0;
    const done = new Promise(r => cdp.once('Tracing.tracingComplete', r));
    await cdp.send('Tracing.end');
    const {stream} = await done;
    let s = '';
    for (;;) { const c = await cdp.send('IO.read', {handle: stream}); s += c.data; if (c.eof) break; }
    const ev = JSON.parse(s).traceEvents ?? JSON.parse(s);
    const sum = re => ev.filter(e => e.ph === 'X' && re.test(e.name)).reduce((a, e) => a + e.dur / 1000, 0);
    const res = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /bundle\.js|\.json|stories|chunk/.test(r.name)).map(r => ({n: r.name.split('/').pop().split('?')[0], t: Math.round(r.responseEnd - r.startTime), b: r.encodedBodySize, c: r.transferSize === 0})));
    return {tLoad, tPlayVisible, tReady, compile: sum(/^v8\.compile$|^V8\.CompileCode$|^v8\.parseOnBackground$/), evalMs: sum(/^EvaluateScript$|^v8\.run$/), res, errors: errors.slice()};
  };
  let r = await go();
  if (warm) { await page.close().catch(() => {}); const p2 = await context.newPage(); p2.on('pageerror', e => errors.push(e.message)); const cdp2 = await context.newCDPSession(p2); Object.assign(globalThis, {}); await p2.close(); const p3 = await context.newPage(); const c3 = await context.newCDPSession(p3);
    // warm: reload the same origin in a new page of the same context (HTTP cache kept, save kept)
    await c3.send('Tracing.start', {transferMode: 'ReturnAsStream', traceConfig: {includedCategories: ['v8', 'devtools.timeline']}});
    const t0 = Date.now(); await p3.goto(url, {waitUntil: 'load'}); const tLoad = Date.now() - t0;
    const play = p3.getByText('PLAY', {exact: true}); await play.waitFor({state: 'visible', timeout: 60000}); const tPlayVisible = Date.now() - t0;
    await play.click({noWaitAfter: true}); await p3.waitForTimeout(300);
    const confirm = p3.getByText('Confirm', {exact: true}); if (await confirm.isVisible().catch(() => false)) await confirm.click({noWaitAfter: true});
    await p3.waitForFunction(() => typeof window.saveProgress === 'function', null, {polling: 25});
    const tReady = Date.now() - t0;
    const done = new Promise(rr => c3.once('Tracing.tracingComplete', rr)); await c3.send('Tracing.end'); const {stream} = await done;
    let s = ''; for (;;) { const c = await c3.send('IO.read', {handle: stream}); s += c.data; if (c.eof) break; }
    const ev = JSON.parse(s).traceEvents ?? JSON.parse(s);
    const sum = re => ev.filter(e => e.ph === 'X' && re.test(e.name)).reduce((a, e) => a + e.dur / 1000, 0);
    r = {tLoad, tPlayVisible, tReady, compile: sum(/^v8\.compile$|^V8\.CompileCode$|^v8\.parseOnBackground$/), evalMs: sum(/^EvaluateScript$|^v8\.run$/), res: [], errors};
  }
  await context.close();
  return r;
}
const out = {};
for (const fx of fixtures) for (const warm of [false, true]) {
  const rs = [];
  for (let i = 0; i < runs; i++) rs.push(await once(fx, warm));
  const m = k => Math.round(median(rs.map(r => r[k])));
  out[`${fx}/${warm ? 'warm' : 'cold'}`] = {load: m('tLoad'), playVisible: m('tPlayVisible'), ready: m('tReady'), compileMs: m('compile'), evalMs: m('evalMs'), res: rs[0].res, errors: rs.flatMap(r => r.errors).slice(0, 3)};
}
console.log(JSON.stringify(out, null, 1));
if (arg('out')) fs.writeFileSync(arg('out'), JSON.stringify(out, null, 1));
await browser.close(); server.close();
