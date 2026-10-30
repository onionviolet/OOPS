// Upcoming strip (SUI7/TC12): Village (strip hidden) then the Tingen book life across the day-1 rail halt. Headless 1920x1080, temp bundle, fresh origin.
// Usage: node scripts/playtest/time-strip-probe.mjs <out-dir>
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session,sha} from './lib.mjs';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
// Fixture (FLR2): the shipped private event pack's evidence label ('authored proposal') fails the validator, so the pack never loads in play. Correct it in transit only.
const hooks={beforeOpen:async ctx=>ctx.route('**/private_packs/lotm-events/events.json',async r=>{const j=await (await r.fetch()).json();j.events.forEach(e=>{e.evidence='U';});await r.fulfill({json:j});})};
const s=await new Session({url:server.url,opTimeout:90000,seed:7,wall:Date.UTC(2026,9,30),hooks}).start();
const pause=(ms=350)=>s.page.waitForTimeout(ms);
const nav=async id=>{await s.page.keyboard.press('Escape');await s.page.evaluate(v=>{const e=document.querySelector('select[aria-label="Other known panels"]');e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}));},id);await pause(800);};
const strip=()=>s.page.evaluate(()=>{const n=document.getElementById('upcoming_strip'),r=n?.getBoundingClientRect();return {exists:!!n,hidden:n?.hidden,text:n&&!n.hidden?n.innerText:null,box:r?[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]:null,clock:document.querySelector('.scene-calendar')?.innerText};});
const shot=async(p,name)=>{try{await p.screenshot({path:path.join(out,name),timeout:120000});}catch{const c=await p.context().newCDPSession(p);const {data}=await c.send('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(out,name),Buffer.from(data,'base64'));}};
const report={bundle:sha(await fs.readFile(path.join(bundle.dir,'bundle.js'))),viewport:'1920x1080'};
try{
 await s.open();const p=s.page;
 report.village=await strip();await shot(p,'village-1920.png');
 await nav('lotm');const panel=p.locator('#lotm_panel');
 await panel.locator('[data-lotm="pick_be"]').click();await pause();await panel.locator('[data-lotm="enroll_be"]').click();
 for(let i=0;i<80;i++){try{if(await p.locator('#loading_screen_play_button').isVisible()){await p.locator('#loading_screen_play_button').click({timeout:3000});await pause(2000);}
  report.entry=await p.evaluate(()=>window.simulationTestHooks.snapshot().expansion.lotm?.entryProfile);if(report.entry)break;}catch(e){}await pause(1500);}
 await pause(1500);report.tingenBefore=await strip();await shot(p,'tingen-before-halt-1920.png');
 report.day=await p.evaluate(()=>{const t=window.simulationTestHooks.snapshot()['current time'];return [t.day_count,t.hour,t.minute];});
 // The day-1 rail halt opens at 07:00 of the cast clock. Play the minutes forward in chunks (native ticks, no save edit: an edited clock fails the save's event check).
 report.steps=[];for(let i=0;i<8;i++){const t0=Date.now();await s.step(60);report.steps.push(Date.now()-t0);if(i>=6)await pause(500);}
 await pause(3000);
 report.tingenAfter=await strip();await shot(p,'tingen-halt-1920.png');
 report.errors=s.errors;
}finally{console.log(JSON.stringify(report,null,1));await s.browser.close();await server.close?.();}
