import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Session} from './lib.mjs';
const root='/tmp/lotm-first-arc-accepted',out=process.cwd()+'/docs/research/novels/lord-of-mysteries/private/first-arc-2026-11-01';
const pack=JSON.parse(await fs.readFile('private_packs/lotm-cast/cast.json','utf8'));
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://x').pathname);const f=path.join(root,pathname==='/'?'index.html':pathname);const data=await fs.readFile(f);res.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.html')?'text/html':'application/octet-stream','cache-control':'no-store'}).end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const session=await new Session({url:`http://127.0.0.1:${server.address().port}/?test_hooks=1`,seed:7,wall:Date.UTC(2026,10,1),opTimeout:90000}).start();
const result={route:'fresh lead; real native commands; dev-stepped time; isolated origin',steps:[]};let p;
const snap=()=>p.evaluate(()=>window.simulationTestHooks.snapshot());
const play=async()=>{await p.waitForFunction(()=>!!window.simulationTestHooks,{timeout:90000});if(await p.locator('#loading_screen_play_button').isVisible().catch(()=>false)){await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();const c=p.locator('#hero_creation_panel_confirmation');if(await c.isVisible().catch(()=>false))await c.click();}await p.evaluate(()=>window.simulationTestHooks.pause());};
const select=async()=>{await p.keyboard.press('Escape');const entry=p.locator('[data-lotm-local-entry="true"]');if(await entry.isVisible().catch(()=>false))await entry.click();else await p.locator('select[aria-label="Other known panels"]').selectOption('lotm');await p.waitForTimeout(200);};
try{
 await session.open();p=session.page;await select();await p.locator('[data-lotm="pick_be"]').click();await p.locator('[data-lotm="enroll_be"]').click();await p.waitForTimeout(3000);console.log('entry clicked');
 for(let i=0;i<60;i++){await p.waitForTimeout(200);await play().catch(()=>{});if((await snap().catch(()=>({expansion:{}}))).expansion.lotm?.entryProfile==='book.lead.be@1')break;}
 console.log('enrollment loop done', (await snap()).expansion.lotm?.entryProfile);await select();result.loadedBundle=await p.locator('script[src*="dist/bundle.js"]').getAttribute('src');result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');assert.ok(result.loadedBundle.includes(result.bundleSha256.slice(0,12)));console.log('local panel opened');result.start=(await snap()).expansion.clock;
 for(const stage of pack.householdActs.sequence.stages){
  const row=pack.householdActs.acts.find(r=>r.id===stage.commandId);let state=await snap();
  if(state.expansion.simulation.people.player.location!==row.place){const move=p.locator(`[data-lotm="lotm.move.${row.place}"]`);await move.click();await session.step(4);await p.waitForTimeout(100);}
  let action=p.locator(`[data-lotm="${row.id}"]`);await action.waitFor({state:'visible'});
  if(await action.isDisabled()){
   result.blocked={id:row.id,text:await action.locator('..').innerText()};
   if(row.id==='book.lotm.household_store'){assert.match(result.blocked.text,/Wait until dawn/);const elapsed=(await snap()).expansion.clock-(await snap()).expansion.lotm.initializedAt;await session.step(Math.max(1,360-elapsed));await p.waitForTimeout(250);}else throw Error(JSON.stringify(result.blocked));
  }
  await action.click();await session.step(row.minutes+1);await p.waitForTimeout(200);state=await snap();
  assert.ok(state.expansion.simulation.knowledge.player[row.knowledgeKey],row.id+' not settled');
  result.steps.push(row.id);console.log('settled',row.id);
  if(result.steps.length===2)await p.screenshot({path:out+'/opening-accepted-14.png'});
 }
 assert.doesNotMatch(await p.locator('#return_digest').innerText(),/Village workbench/);result.otherWorldReportAbsent=true;const final=await snap();assert.equal(final.expansion.worlds['book.lotm.tingen'].facts['household.opening.morning.complete'],true);assert.equal(final.expansion.worlds['book.lotm.tingen'].facts['household.opening.notebook.present'],true);assert.equal(final.expansion.worlds['book.lotm.tingen'].facts['household.opening.revolver.holder'],'drawer');
 assert.equal(await p.locator('[data-lotm-object-acts] button').count(),0);assert.match(await p.locator('[data-lotm-arc]').innerText(),/complete/);
 await p.screenshot({path:out+'/complete-accepted-14.png'});result.font14=await p.locator('[data-lotm-arc] p').first().evaluate(e=>getComputedStyle(e).fontSize);
 await p.evaluate(()=>window.saveProgress());const exported=await p.evaluate(()=>window.save_to_file());await p.reload();await play();await select();assert.equal((await snap()).expansion.worlds['book.lotm.tingen'].facts['household.opening.morning.complete'],true);
 await Promise.all([p.waitForEvent('load'),p.evaluate(x=>window.load_progress(x),exported)]);await play();await select();assert.equal((await snap()).expansion.worlds['book.lotm.tingen'].facts['household.opening.morning.complete'],true);result.persistence=true;result.completed=result.steps.length;
 const large=structuredClone(await session.save());large.customization.profiles.Default.settings.typography={font:'gothic',size:21};await session.open(large);p=session.page;await p.waitForTimeout(1200);await select();result.font21=await p.locator('[data-lotm-arc] p').first().evaluate(e=>getComputedStyle(e).fontSize);assert.equal(result.font21,'21px');result.noHorizontalOverflow=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);assert.equal(result.noHorizontalOverflow,true);await p.screenshot({path:out+'/complete-accepted-21.png'});result.pageErrors=session.errors;

}catch(e){result.error=e.stack;console.error(e);if(p)await p.screenshot({path:out+'/failure.png'}).catch(()=>{});process.exitCode=1;}finally{await fs.writeFile(out+'/browser-accepted-result.json',JSON.stringify(result,null,2));await session.close();server.close();}
