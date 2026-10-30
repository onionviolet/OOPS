// Headless Chrome over CDP at 1920x1080: capture the figure gallery and the Tingen ladder from a fresh life.
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

if(process.argv[3]!=='game'){// 1. Gallery: scroll each ability fixture into view at 1920x1080.
for (const effects of ['full', 'off']) {
    await send('Page.navigate', {url: `${BASE}/figure-gallery.html?effects=${effects}`}); await sleep(2500);
    for (const fixture of ['ladder-lantern-self', 'ladder-reed-self', 'ladder-lantern-witness', 'ladder-long-self', 'ladder-lantern-compact', 'ladder-lantern-insight']) {
        if (effects === 'off' && fixture !== 'ladder-lantern-self') continue;
        const ok = await evaluate(`(()=>{const s=document.querySelector('[data-fixture="${fixture}"]');if(!s)return false;s.scrollIntoView({block:'start'});return true;})()`);
        await sleep(300); log.push(`gallery ${fixture} effects=${effects}: ${ok}`);
        if (ok) await shot(`gallery-${fixture}-${effects}.png`);
    }
}

}
// 2. Game: fresh test origin (new profile), PLAY, pick the probationer life, cross, show the ladder.
await send('Page.navigate', {url: `${BASE}/index.html`}); await sleep(6000);
log.push('play: ' + await evaluate(`(()=>{const b=document.getElementById('loading_screen_play_button');if(!b)return 'none';b.click();return 'clicked';})()`));
await sleep(4000);
const pick = await evaluate(`(()=>{const b=document.querySelector('[data-lotm="pick_probationer"]');if(!b)return 'no pick';b.click();return 'picked';})()`); log.push(pick); await sleep(800);
log.push(await evaluate(`(()=>{const b=document.querySelector('[data-lotm="enroll"]');if(!b)return 'no enroll';b.click();return 'enrolled';})()`));
await sleep(5000);
log.push('select: '+await evaluate(`(()=>{const sel=[...document.querySelectorAll('select')].find(n=>[...n.options].some(o=>/Tingen/.test(o.textContent))&&n.checkVisibility());if(!sel)return 'none';const o=[...sel.options].find(o=>/Tingen/.test(o.textContent));sel.value=o.value;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));return 'chose '+o.textContent+' from '+(sel.getAttribute('aria-label')||sel.id);})()`));
await sleep(1500);
const info = await evaluate(`(()=>{const p=document.querySelector('#lotm_panel');const f=p?.querySelector('[data-lotm-ladder]');if(!f)return {ladder:false};
 const t=p.querySelector('[data-lotm-ladder-text]');t.open=true;
 f.scrollIntoView({block:'start'});const r=f.getBoundingClientRect(),q=p.getBoundingClientRect();
 return {ladder:true,visible:p.checkVisibility(),fig:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],panel:[Math.round(q.x),Math.round(q.y),Math.round(q.width),Math.round(q.height)],text:t.textContent.slice(0,400)};})()`);
log.push('game: ' + JSON.stringify(info));
log.push('chain: '+JSON.stringify(await evaluate(`(()=>{const out=[];let n=document.querySelector('#lotm_panel');while(n&&n!==document.body){const cs=getComputedStyle(n);out.push([n.id||n.className,n.hidden,cs.display,cs.visibility]);n=n.parentElement;}return out;})()`)));
log.push('module: '+JSON.stringify(await evaluate(`(()=>{const m=document.querySelector('#lotm_panel').closest('.workspace-module');return [...m.attributes].map(a=>a.name+'='+a.value).join(' ');})()`)));
log.push('openers: '+JSON.stringify(await evaluate(`[...document.querySelectorAll('[data-module-target],[data-open-module],[data-panel-id],[data-workspace-open]')].filter(n=>/lotm|tingen/i.test(n.outerHTML)).map(n=>n.outerHTML.slice(0,240)).slice(0,10)`)));
log.push('where: '+JSON.stringify(await evaluate(`[...document.querySelectorAll('button,a,[role=tab],summary')].filter(n=>/tingen/i.test(n.textContent)&&n.checkVisibility()).map(n=>n.outerHTML.slice(0,240)).slice(0,10)`)));
await sleep(500); await shot('game-tingen-fresh-ladder.png');
for (const re of ['report_in', 'accept_allocation', 'ingest']) {
    log.push('step '+re+': '+await evaluate(`(()=>{const b=[...document.querySelectorAll('#lotm_panel button[data-lotm]')].find(n=>n.dataset.lotm.includes('${re}')&&!n.dataset.lotm.startsWith('plan_')&&!n.dataset.lotm.includes('corpse')&&!n.dataset.lotm.includes('savant'));if(!b)return 'none';if(b.disabled)return 'disabled '+b.dataset.lotm+' '+(b.title||'');b.click();return 'clicked '+b.dataset.lotm;})()`));
    await sleep(1500);
}
const after = await evaluate(`(()=>{const p=document.querySelector('#lotm_panel');const f=p.querySelector('[data-lotm-ladder]');const t=p.querySelector('[data-lotm-ladder-text]');if(t)t.open=true;f?.scrollIntoView({block:'start'});return t?.querySelector('pre')?.textContent.split('\\n').slice(0,4).join(' | ');})()`);
log.push('after: '+after);
log.push('pulse on gained rung: '+await evaluate(`!!document.querySelector('#lotm_panel [data-lotm-ladder] .fig-step.fig-state--current.fig-fx--pulse')`)); await sleep(500); await shot('game-tingen-dose-ladder.png');
log.push('errors: ' + JSON.stringify(errors.slice(0, 5)));
writeFileSync(join(OUT, 'capture-log.txt'), log.join('\n') + '\n');
sock.close(); chrome.kill();
console.log(log.join('\n'));
