// Headless Chrome over CDP at 1920x1080: the ghost fill (RS15) and typed ability lines in the gallery, and the ghost in a fresh Tingen life.
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


for (const fixture of ['ladder-lantern-planned', 'ladder-lantern-records']) {
    await send('Page.navigate', {url: `${BASE}/figure-gallery.html?effects=full`}); await sleep(2500);
    const ok = await evaluate(`(()=>{const s=document.querySelector('[data-fixture="${fixture}"]');if(!s)return false;s.scrollIntoView({block:'start'});return s.querySelectorAll('.fig-ghost').length+' ghosts; '+(s.querySelector('.fig-text, pre')?.textContent||'').replace(/[\\n ]+/g,' ').slice(0,600);})()`);
    await sleep(300); log.push(`gallery ${fixture}: ${ok}`); await shot(`ghost-gallery-${fixture}.png`);
}
await send('Page.navigate', {url: `${BASE}/index.html`}); await sleep(6000);
log.push('play: ' + await evaluate(`(()=>{const b=document.getElementById('loading_screen_play_button');if(!b)return 'none';b.click();return 'clicked';})()`));
await sleep(4000);
log.push(await evaluate(`(()=>{const b=document.querySelector('[data-lotm="pick_probationer"]');if(!b)return 'no pick';b.click();return 'picked';})()`)); await sleep(800);
log.push(await evaluate(`(()=>{const b=document.querySelector('[data-lotm="enroll"]');if(!b)return 'no enroll';b.click();return 'enrolled';})()`)); await sleep(5000);
log.push('select: '+await evaluate(`(()=>{const sel=[...document.querySelectorAll('select')].find(n=>[...n.options].some(o=>/Tingen/.test(o.textContent))&&n.checkVisibility());if(!sel)return 'none';const o=[...sel.options].find(o=>/Tingen/.test(o.textContent));sel.value=o.value;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));return 'chose '+o.textContent;})()`)); await sleep(1500);
for (const re of ['report_in', 'accept_allocation', 'ingest']) {
    log.push('step '+re+': '+await evaluate(`(()=>{const b=[...document.querySelectorAll('#lotm_panel button[data-lotm]')].find(n=>n.dataset.lotm.includes('${re}')&&!n.dataset.lotm.startsWith('plan_')&&!n.dataset.lotm.includes('corpse')&&!n.dataset.lotm.includes('savant'));if(!b)return 'none';if(b.disabled)return 'disabled '+b.dataset.lotm;b.click();return 'clicked '+b.dataset.lotm;})()`));
    await sleep(1500);
}
const ladder = `(()=>{const p=document.querySelector('#lotm_panel');const f=p.querySelector('[data-lotm-ladder]');const t=p.querySelector('[data-lotm-ladder-text]');if(!f)return 'no ladder';document.querySelector('[data-workroom-tabs] [data-tab="path"]')?.click();t.open=true;f.scrollIntoView({block:'start'});return f.querySelectorAll('.fig-ghost').length+' ghosts | '+t.querySelector('pre').textContent.split('\\n').slice(0,4).join(' | ');})()`;
const clickLotm = id => evaluate(`(()=>{const b=document.querySelector('#lotm_panel button[data-lotm="${id}"]');if(!b)return 'none';if(b.disabled)return 'disabled '+(b.title||'');b.click();return 'clicked';})()`);
log.push('lesson: '+await clickLotm('book.lotm.lesson'));
let reading = 'none';
for (let i = 0; i < 90 && reading !== 'ready'; i++) { await sleep(2000); reading = await evaluate(`(()=>{const b=document.querySelector('#lotm_panel button[data-lotm="book.lotm.act_reading"]');return !b?'none':b.disabled?'disabled':'ready';})()`); }
log.push('reading act: '+reading);
const toWorkroom = () => evaluate(`(()=>{if(document.querySelector('#lotm_panel [data-lotm-ladder]')?.checkVisibility())return 'already';const back=[...document.querySelectorAll('a,button')].find(n=>/Tingen workroom/.test(n.textContent)&&n.checkVisibility());if(back){back.click();return 'back: '+back.textContent.trim();}return 'none';})()`);
log.push('to workroom: '+await toWorkroom()); await sleep(1200);
log.push('before find: '+await evaluate(ladder));
log.push('find: '+await evaluate(`(()=>{const g=document.querySelector('#lotm_panel [data-lotm-acting-guidance]');if(!g)return 'no acting guidance';const b=g.querySelector('button[data-lotm^="find_"]');if(!b)return 'no find button: '+g.textContent.slice(0,200);const label=b.closest('[data-panel-row]').textContent.slice(0,80);b.click();return label;})()`));
await sleep(1200);
log.push('to workroom: '+await toWorkroom()); await sleep(1200); log.push('after find: '+await evaluate(ladder)); await sleep(500); await shot('ghost-game-tingen-planned.png');
log.push('start reading: '+await clickLotm('book.lotm.act_reading')); await sleep(1500);
log.push('to workroom: '+await toWorkroom()); await sleep(1200); log.push('while running: '+await evaluate(ladder)); await sleep(500); await shot('ghost-game-tingen-running.png');
log.push('errors: ' + JSON.stringify(errors.slice(0, 5)));
writeFileSync(join(OUT, 'ghost-capture-log.txt'), log.join('\n') + '\n');
sock.close(); chrome.kill();
console.log(log.join('\n'));
