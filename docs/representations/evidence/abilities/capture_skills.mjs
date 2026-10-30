// Headless Chrome over CDP at 1920x1080: the Skills and techniques tab (G17): gallery populated and empty, then the Tingen Path tab from a fresh life.
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
for (const id of ['skills-tab', 'skills-tab-empty']) {
    log.push(`gallery ${id}: ` + await evaluate(`(()=>{const s=document.querySelector('[data-fixture="${id}"]');if(!s)return 'missing';s.querySelectorAll('details.skills-row').forEach(d=>d.open=true);s.querySelector('.skills-text')&&(s.querySelector('.skills-text').open=true);s.scrollIntoView({block:'start'});return s.querySelector('pre').textContent.replace(/\\n+/g,' | ').slice(0,700);})()`));
    await sleep(300); await shot(`skills-gallery-${id}.png`);
}
await send('Page.navigate', {url: `${BASE}/index.html`}); await sleep(6000);
log.push('play: ' + await evaluate(`(()=>{const b=document.getElementById('loading_screen_play_button');if(!b)return 'none';b.click();return 'clicked';})()`)); await sleep(4000);
log.push(await evaluate(`(()=>{const b=document.querySelector('[data-lotm="pick_probationer"]');if(!b)return 'no pick';b.click();return 'picked';})()`)); await sleep(800);
log.push(await evaluate(`(()=>{const b=document.querySelector('[data-lotm="enroll"]');if(!b)return 'no enroll';b.click();return 'enrolled';})()`)); await sleep(5000);
log.push('select: '+await evaluate(`(()=>{const sel=[...document.querySelectorAll('select')].find(n=>[...n.options].some(o=>/Tingen/.test(o.textContent))&&n.checkVisibility());if(!sel)return 'none';const o=[...sel.options].find(o=>/Tingen/.test(o.textContent));sel.value=o.value;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));return 'chose '+o.textContent;})()`)); await sleep(1500);
for (const re of ['report_in', 'accept_allocation', 'ingest']) { await evaluate(`(()=>{const b=[...document.querySelectorAll('#lotm_panel button[data-lotm]')].find(n=>n.dataset.lotm.includes('${re}')&&!n.dataset.lotm.startsWith('plan_')&&!n.dataset.lotm.includes('corpse')&&!n.dataset.lotm.includes('savant'));if(b&&!b.disabled)b.click();})()`); await sleep(1500); }
log.push('path tab: '+await evaluate(`(()=>{document.querySelector('[data-workroom-tabs] [data-tab="path"]')?.click();return !!document.querySelector('#lotm_panel [data-lotm-ladder]')?.checkVisibility();})()`)); await sleep(600);
await shot('skills-game-tingen-ladder.png');
log.push('skills tab: '+await evaluate(`(()=>{const t=[...document.querySelectorAll('#lotm_panel [role=tab]')].find(n=>/Skills and techniques/.test(n.textContent));if(!t)return 'no sub-tab';t.click();const p=document.querySelector('#lotm_panel [data-lotm-skills]');p.scrollIntoView({block:'start'});return 'visible='+p.checkVisibility()+' | '+p.querySelector('pre').textContent+' | ladderHidden='+!document.querySelector('#lotm_panel [data-lotm-ladder]').checkVisibility();})()`)); await sleep(600);
await shot('skills-game-tingen-skills.png');
log.push('errors: ' + JSON.stringify(errors.slice(0, 5)));
writeFileSync(join(OUT, 'skills-capture-log.txt'), log.join('\n') + '\n');
sock.close(); chrome.kill(); console.log(log.join('\n'));
