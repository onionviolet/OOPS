// Headless Chrome over CDP at 1920x1080: several ladders, the path picker and switch/branch/loss states in the gallery (Round 6).
import {spawn} from 'node:child_process';
import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const OUT = process.argv[2], BASE = 'http://127.0.0.1:18977';
const profile = mkdtempSync(join(tmpdir(), 'abl-chrome-'));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--remote-debugging-port=9337', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--hide-scrollbars', 'about:blank'], {stdio: 'ignore'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws; for (let i = 0; i < 40 && !ws; i++) { try { const t = await (await fetch('http://127.0.0.1:9337/json')).json(); const page = t.find(x => x.type === 'page'); if (page) ws = page.webSocketDebuggerUrl; } catch {} await sleep(250); }
const sock = new WebSocket(ws); await new Promise(r => sock.onopen = r);
let id = 0; const pending = new Map(), errors = [];
sock.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise(r => { const n = ++id; pending.set(n, r); sock.send(JSON.stringify({id: n, method, params})); });
const evaluate = async expr => (await send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true})).result?.result?.value;
const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', {format: 'png', ...(clip ? {clip: {...clip, scale: 1}} : {})}); writeFileSync(join(OUT, name), Buffer.from(r.result.data, 'base64')); };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false});
const log = [];



await send('Page.navigate', {url: `${BASE}/figure-gallery.html?effects=full`}); await sleep(2500);
for (const id of ['ladders-several', 'path-picker', 'ladder-events']) {
    log.push(`gallery ${id}: ` + await evaluate(`(()=>{const s=document.querySelector('[data-fixture="${id}"]');if(!s)return 'missing';s.scrollIntoView({block:'start'});return [...s.querySelectorAll('h3,h4')].map(n=>n.textContent).join(' / ')+' | '+(s.querySelector('pre')?.textContent||'').replace(/\\n+/g,' | ').slice(0,400)+' | fills='+s.querySelectorAll('.fig-fill').length;})()`));
    await sleep(400); await shot(`ladders-gallery-${id}.png`);
}
log.push('errors: ' + JSON.stringify(errors.slice(0, 5)));
writeFileSync(join(OUT, 'ladders-capture-log.txt'), log.join('\n') + '\n');
sock.close(); chrome.kill(); console.log(log.join('\n'));
