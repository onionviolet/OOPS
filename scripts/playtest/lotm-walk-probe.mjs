// Fresh Village life -> cross as Tingen probationer -> report in -> start the first offered walk. Headless 1920x1080, temp bundle, fresh origin.
// Usage: node scripts/playtest/lotm-walk-probe.mjs <out-dir>
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session,sha} from './lib.mjs';
const out=path.resolve(process.argv[2]||'.');await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
const bundleHash=sha(await fs.readFile(path.join(bundle.dir,'bundle.js')));
const s=await new Session({url:server.url,opTimeout:30000,seed:7,wall:Date.UTC(2026,9,30),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const pause=(ms=350)=>s.page.waitForTimeout(ms);
const nav=async id=>{await s.page.keyboard.press('Escape');await s.page.locator('#workspace_navigation select').first().selectOption(id);await pause();};
const report={bundle:bundleHash,viewport:'1920x1080',steps:[]};
try{
 await s.open();const p=s.page;await p.setViewportSize({width:1920,height:1080});
 await nav('lotm');const panel=p.locator('#lotm_panel');
 await panel.locator('[data-lotm="pick_probationer"]').click();await pause();await panel.locator('[data-lotm="enroll"]').click();
 await p.waitForFunction(()=>/Tingen/.test(document.querySelector('#location_name_span')?.textContent||''),null,{timeout:30000});await pause();
 await nav('lotm');
 const reportIn=panel.locator('button',{hasText:/^Report to the supervisor/});
 if(await reportIn.count()){await reportIn.first().click();await pause(600);const nn=await p.evaluate(()=>document.querySelector('#lotm_panel [role=status]')?.textContent||'');report.afterClick=nn;await s.step(60);await pause();await nav('lotm');report.steps.push({reportedIn:true,label:await reportIn.first().textContent().catch(()=>null),notice:await p.evaluate(()=>document.querySelector('#lotm_panel [role=status]')?.textContent||''),btns:await p.evaluate(()=>[...document.querySelectorAll('#lotm_panel button')].map(b=>b.textContent).slice(0,12))});}
 report.dump=await p.evaluate(()=>{const sim=window.simulationTestHooks.snapshot().expansion.simulation;return {situations:Object.keys(sim.situations||{}),bases:Object.entries(sim.knowledge).flatMap(([a,k])=>Object.entries(k).map(([key,v])=>[a,key,v.basis?.situationId]))}});
 const walk=panel.locator('button',{hasText:/^Walk to /}).first();await walk.waitFor();
 const label=await walk.textContent();await walk.click();await pause(600);
 const notice=await p.evaluate(()=>document.querySelector('#lotm_panel [role=status]')?.textContent||'');
 report.steps.push({walk:label,notice});
 assert.notEqual(notice,'Knowledge needs its actual situation context.','the walk must not be refused');
 report.errors=s.errors;
}finally{await fs.writeFile(path.join(out,'lotm-walk-probe.json'),JSON.stringify(report,null,1)+'\n');await s.close();server.close();await bundle.dispose();}
console.log(JSON.stringify({ok:true,bundle:bundleHash,steps:report.steps}));
