// R15 G1 browser harness. Serves the worktree's rebuilt bytes on 127.0.0.1:19110,
// drives headless Chrome (1600x1100) from a fresh profile under /private/tmp,
// and accepts JavaScript steps on 127.0.0.1:19111 (POST body, evaluated with
// `page`, `ctx`, `fs`, `out`, `saved`, `log` in scope). Test harness only.
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const out = new URL('.', import.meta.url).pathname;
const root = path.resolve(out, '../../../../../../..');
const profile = process.argv[2] || '/private/tmp/r15-g1-profile';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon'};
const hash = b => crypto.createHash('sha256').update(b).digest('hex');

const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404); res.end(); return;}
    res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store'});
    fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(19110, '127.0.0.1', r));

const ctx = await chromium.launchPersistentContext(profile, {channel: 'chrome', headless: true, viewport: {width: 1600, height: 1100}, acceptDownloads: true});
const page = ctx.pages()[0] || await ctx.newPage();
page.setDefaultTimeout(5000);
const log = {errors: [], console: [], bundle: null};
page.on('pageerror', e => log.errors.push(e.message));
page.on('console', m => {if (['error', 'warning'].includes(m.type())) log.console.push(m.type() + ': ' + m.text().slice(0, 300));});
page.on('response', async r => {if (r.url().includes('/dist/bundle.js')) {try {log.bundle = {url: r.url(), loaded: hash(await r.body()), disk: hash(fs.readFileSync(path.join(root, 'dist/bundle.js')))};} catch {}}});
const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('save data') || 'null'));

const control = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    let result;
    try {result = await eval('(async()=>{' + body + '})()');}
    catch (e) {result = {error: e.stack?.slice(0, 1500)};}
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify(result ?? null, null, 1));
    if (body.trim() === 'SHUTDOWN') {await ctx.close(); server.close(); control.close(); process.exit(0);}
});
await new Promise(r => control.listen(19111, '127.0.0.1', r));
console.log('harness ready', profile);
