// Headless Chrome (CDP) 1920x1080 capture of owed-coi.html, served from the repo root. Run through scripts/slot_run.mjs --kind browser.
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, extname, resolve} from 'node:path';
const ROOT = resolve(process.argv[2]), OUT = resolve(process.argv[3]), PORT = 18981, CDP = 9341;
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css'};
const srv = createServer((q, s) => { try { const p = decodeURIComponent(q.url.split('?')[0]); const f = p === '/owed-coi.html' ? join(OUT, 'owed-coi.html') : join(ROOT, p);
    s.writeHead(200, {'content-type': types[extname(f)] ?? 'application/octet-stream'}); s.end(readFileSync(f)); } catch { s.writeHead(404); s.end(); } }).listen(PORT);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'coi-chrome-'))}`, '--window-size=1920,1080', '--hide-scrollbars', 'about:blank'], {stdio: 'ignore'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws; for (let i = 0; i < 40 && !ws; i++) { try { ws = (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(x => x.type === 'page')?.webSocketDebuggerUrl; } catch {} await sleep(250); }
const sock = new WebSocket(ws); await new Promise(r => sock.onopen = r);
let id = 0; const pending = new Map(), errors = [];
sock.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise(r => { const n = ++id; pending.set(n, r); sock.send(JSON.stringify({id: n, method, params})); });
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false});
await send('Page.navigate', {url: `http://127.0.0.1:${PORT}/owed-coi.html`}); await sleep(2000);
const text = (await send('Runtime.evaluate', {expression: 'document.body.innerText', returnByValue: true})).result.result.value;
writeFileSync(join(OUT, 'owed-coi-text.txt'), text + '\nerrors: ' + JSON.stringify(errors) + '\n');
writeFileSync(join(OUT, 'owed-coi-1920.png'), Buffer.from((await send('Page.captureScreenshot', {format: 'png'})).result.data, 'base64'));
chrome.kill(); srv.close(); process.exit(0);
