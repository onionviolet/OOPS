// World look floor (DSG11/DSG12): fresh Village life shows the generic look and arrival line; crossing as a
// Nighthawk probationer shows the LOTM flourish and a voiced Reports line. Headless 1920x1080, temp bundle, fresh origin.
// Known limit: the resume reload clears the log, so the frontier side proves the fallback by no voiced line and no flourish;
// the same-kind fallback (a frontier arrival stays generic) is covered by tests/world_look.test.js.
// Usage: node scripts/playtest/world-look-probe.mjs <out-dir>
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session,sha} from './lib.mjs';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
const report={bundle:sha(await fs.readFile(path.join(bundle.dir,'bundle.js'))),viewport:'1920x1080',errors:[]};
const s=await new Session({url:server.url,opTimeout:30000,seed:7,wall:Date.UTC(2026,9,30)}).start();
const pause=(ms=400)=>s.page.waitForTimeout(ms);
const read=()=>s.page.evaluate(()=>{const r=document.documentElement.dataset,h=document.querySelector('#village_scene > .scene-location-header');
 return {world:r.world,family:r.worldFamily,flourish:r.worldFlourish,header:h?.textContent.trim().slice(0,80),epithet:h?getComputedStyle(h,'::after').content:null,
  glyph:h?.querySelector('strong')?getComputedStyle(h.querySelector('strong'),'::before').content:null,
  lines:document.querySelectorAll('#message_box_div .message_common').length,voiced:document.querySelectorAll('#message_box_div .report-voice').length,
  arrivals:[...document.querySelectorAll('#message_box_div .message_common[data-log-kind="message_travel"]')].map(m=>({text:m.textContent.trim().slice(0,240),world:m.dataset.world||null}))};});
try{
 await s.open();const p=s.page;p.on('pageerror',e=>report.errors.push(String(e).slice(0,200)));
 await pause(1500);report.frontier=await read();
 await p.screenshot({path:path.join(out,'frontier-1920.png')});
 await p.keyboard.press('Escape');await p.evaluate(()=>{const e=document.querySelector('select[aria-label="Other known panels"]');e.value='lotm';e.dispatchEvent(new Event('change',{bubbles:true}));});await pause();
 await p.getByRole('button',{name:'Begin as a Nighthawk probationer'}).click();await pause();
 await p.getByRole('button',{name:'Confirm and cross to Tingen'}).click();
 for(let i=0;i<40&&(await read()).family!=='lotm';i++)await pause(500);
 await pause(1500);report.lotm=await read();
 await p.screenshot({path:path.join(out,'lotm-1920.png')});
 // Back to the Village: the frontier arrival line stays generic and older LOTM lines keep their voice.
 await p.getByRole('button',{name:'Open Continuing connection'}).click();await pause();
 await p.getByRole('button',{name:'Open your connection'}).click();await pause(800);
 await p.getByRole('button',{name:'Return',exact:true}).click();await pause(800);
 report.connection=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.closest('section.workspace-module')?.textContent.includes('Continuing connection')&&!/^(Lives|Return|Anchors|Learning|Investigate|←)/.test(b.textContent.trim())).map(b=>b.textContent.trim().slice(0,80)));
 const resume=p.getByRole('button',{name:/^Resume/}).first();
 if(await resume.count()){await resume.click();await pause(800);
  report.afterResume=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/resume|confirm|cross|return/i.test(b.textContent)).map(b=>b.textContent.trim().slice(0,80)));
  const confirm=p.getByRole('button',{name:/^(Confirm|Resume)/}).first();if(await confirm.count())await confirm.click();
  for(let i=0;i<40&&(await read()).family!=='frontier';i++)await pause(500);await pause(1500);}
 report.back=await read();
 await p.screenshot({path:path.join(out,'back-1920.png')});
}finally{await s.close?.();server.close?.();}
console.log(JSON.stringify(report,null,1));
