// Drives the visible authored next-task projection through normal UI commands.
// Dev clock stepping accelerates accepted timed work; it never grants progress.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Session} from './lib.mjs';
const root=process.env.ARC_BUILD_ROOT||'/tmp/lotm-kj2-candidate';
const out=process.cwd()+'/docs/research/novels/lord-of-mysteries/private/kj2-preparation-2026-11-01';
const server=createServer(async(req,res)=>{try{const f=path.join(root,new URL(req.url,'http://x').pathname.replace(/^\/$/,'/index.html'));res.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.html')?'text/html':'application/octet-stream','cache-control':'no-store'}).end(await fs.readFile(f));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const session=await new Session({url:`http://127.0.0.1:${server.address().port}/?test_hooks=1`,seed:Number(process.env.ARC_SEED||7),wall:Date.UTC(2026,10,1),opTimeout:90000}).start();
const result={route:process.env.ARC_RESUME_FILE?'earned native checkpoint; visible next-task UI; normal commands; dev-stepped accepted work':'fresh lead; visible next-task UI; normal commands; dev-stepped accepted work',steps:[],trace:[]};let p;
const snap=()=>p.evaluate(()=>window.simulationTestHooks.snapshot());
async function play(timeout=90000){await p.waitForFunction(()=>!!window.simulationTestHooks,{},{timeout});await p.evaluate(()=>window.simulationTestHooks.pause());if(await p.locator('#loading_screen_play_button').isVisible().catch(()=>false)){await p.locator('#loading_screen_play_button').click();if(await p.locator('#hero_creation_panel_confirmation').isVisible().catch(()=>false))await p.locator('#hero_creation_panel_confirmation').click();}await p.evaluate(()=>window.simulationTestHooks.pause());}
async function select(){await p.keyboard.press('Escape');const entry=p.locator('[data-lotm-local-entry="true"]');if(await entry.isVisible().catch(()=>false))await entry.dispatchEvent('click');else await p.locator('select[aria-label="Other known panels"]').selectOption('lotm');await p.waitForTimeout(100);}
async function finishWork(){await p.evaluate(()=>{for(let i=0;i<10000;i++){const s=window.simulationTestHooks.snapshot().expansion;if(!s.simulation.jobs.some(j=>j.actorId==='player'))return;window.advanceTicks(1);}throw Error('Accepted work did not finish.');});}
async function roundTrip(){await fs.writeFile(out+'/pending-checkpoint.json',JSON.stringify(await session.save()));await p.evaluate(()=>window.saveProgress());const exported=await p.evaluate(()=>window.save_to_file());await p.reload();await play();await select();await Promise.all([p.waitForEvent('load'),p.evaluate(x=>window.load_progress(x),exported)]);await play();await select();}
try{
 console.log('opening');await session.open(process.env.ARC_RESUME_FILE?JSON.parse(await fs.readFile(process.env.ARC_RESUME_FILE,'utf8')):null);p=session.page;p.on('pageerror',e=>console.log('PAGE ERROR',e.message));console.log('opened');if(!process.env.ARC_RESUME_FILE){await select();console.log('selected');await p.waitForFunction(()=>!!document.querySelector('[data-lotm="pick_be"]'),{},{timeout:60000});await p.locator('[data-lotm="pick_be"]').click();await p.locator('[data-lotm="enroll_be"]').click();console.log('enroll clicked');await p.waitForTimeout(3000);
 for(let i=0;i<60;i++){await p.waitForTimeout(200);await play(1000).catch(()=>{});if(i%10===0)console.log('enrolling',i,await p.url(),(await snap().catch(()=>({}))).expansion?.lotm?.entryProfile);if((await snap().catch(()=>({expansion:{}}))).expansion.lotm?.entryProfile==='book.lead.be@1')break;}
 }
 console.log('enrollment complete');await select();console.log('lead selected');result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');
 assert.ok((await p.locator('script[src*="dist/bundle.js"]').getAttribute('src')).includes(result.bundleSha256.slice(0,12)));
 for(let i=0;i<100;i++){
  const arc=p.locator('[data-lotm-arc]');await arc.waitFor();const id=await arc.getAttribute('data-next-command'),place=await arc.getAttribute('data-next-place');if(!id)break;console.log('next',id);
  let action=p.locator(`[data-lotm="${id}"]`);
  if(!await action.count()){
   const walk=p.locator(`[data-lotm="lotm.move.${place}"]`);assert.equal(await walk.count(),1,'No reachable next-task destination');assert.equal(await walk.isDisabled(),false,'Next walk blocked');
   const minutes=Number((await walk.innerText()).match(/· (\d+) min/)[1]);result.trace.push({kind:'walk',id:await walk.getAttribute('data-lotm'),minutes});await walk.dispatchEvent('click');await finishWork();await p.waitForTimeout(100);action=p.locator(`[data-lotm="${id}"]`);
  }
  if(await action.isDisabled()){
   const visibleReason=await action.locator('..').innerText();console.log('blocked',visibleReason);
   const next=await p.evaluate(()=>window.simulationTestHooks.project('lotm').arc.next),clock=(await snap()).expansion.clock;
   assert.ok(next.readyAt>clock,'Blocked without a qualified future time: '+visibleReason);
   const wait=p.locator(`[data-lotm="wait.until.${next.readyAt}"]:enabled`).first();assert.equal(await wait.count(),1);
   result.trace.push({kind:'wait',id:await wait.getAttribute('data-lotm'),at:clock});await wait.dispatchEvent('click');await p.waitForTimeout(150);continue;
  }
  const minutes=Number((await action.innerText()).match(/· (\d+) min/)[1]);result.trace.push({kind:'action',id,minutes,at:(await snap()).expansion.clock});await action.dispatchEvent('click');
  // Preserve and resume an actual pending remote conversation.
  if(await p.locator('[data-remote-meeting]').count()&&!result.meetingPersistence){await roundTrip();assert.ok((await snap()).expansion.simulation.jobs.some(j=>j.commandId===id));result.meetingPersistence=true;await p.screenshot({path:out+'/meeting-14.png'});}
  await finishWork();await p.waitForTimeout(100);
  const s=(await snap()).expansion;assert.ok(s.actors.player.completed[id],id+' did not settle');result.steps.push(id);console.log('settled',id);await fs.writeFile(out+'/route-latest-checkpoint.json',JSON.stringify(await session.save()));if(result.steps.length%4===0)await fs.writeFile(out+'/route-checkpoint-'+result.steps.length+'.json',JSON.stringify(await session.save()));if(result.steps.length===16)await fs.writeFile(out+'/opening-checkpoint.json',JSON.stringify(await session.save()));
 }
 const s=(await snap()).expansion;result.final={place:s.simulation.people.player.location,resources:s.actors.player.resources,completed:result.steps.length,clock:s.clock,epoch:s.lotm.initializedAt};
 if(!process.env.ARC_RESUME_FILE)assert.equal(result.steps.length,34);assert.equal(s.worlds['book.lotm.tingen'].facts['household.excursion.complete'],true);
 assert.equal(s.actors.player.resources['household.excursion.bread'],12);assert.equal(s.actors.player.resources['household.excursion.corners'],4);assert.equal(s.worlds['book.lotm.tingen'].facts['household.excursion.trade.formula.delivered'],false);
 assert.equal(await p.locator('[data-remote-meeting]').count(),0);assert.equal(await p.locator('[data-lotm-object-acts] button').count(),0);
 await roundTrip();await fs.writeFile(out+'/complete-checkpoint.json',JSON.stringify(await session.save()));result.returnPersistence=true;result.font14=await p.locator('[data-lotm-arc] p').first().evaluate(e=>getComputedStyle(e).fontSize);assert.equal(result.font14,'14px');result.noHorizontalOverflow14=await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);assert.equal(result.noHorizontalOverflow14,true);assert.equal((await snap()).character.money,0);await p.screenshot({path:out+'/complete-14.png'});
 const claims=Object.entries((await snap()).expansion.simulation.knowledge.player).filter(([key])=>key.startsWith('book.lotm.history.first_gathering.')).map(([,r])=>r.value);assert.equal(claims.length,2);
 await p.locator('[data-workroom-tabs] [data-tab="notebook"]').click();for(const claim of claims)assert.ok((await p.locator('body').innerText()).includes(claim));await p.screenshot({path:out+'/notebook-14.png'});result.notebookClaimsVisible=true;

 const large=structuredClone(await session.save());large.customization.profiles.Default.settings.typography={font:'gothic',size:21};await session.open(large);p=session.page;await p.waitForTimeout(1200);await select();result.font21=await p.locator('[data-lotm-arc] p').first().evaluate(e=>getComputedStyle(e).fontSize);assert.equal(result.font21,'21px');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await p.screenshot({path:out+'/complete-21.png'});await p.locator('[data-workroom-tabs] [data-tab="notebook"]').click();for(const claim of claims)assert.ok((await p.locator('body').innerText()).includes(claim));await p.screenshot({path:out+'/notebook-21.png'});result.pageErrors=session.errors;assert.equal(session.errors.filter(e=>e.kind==='pageerror').length,0);
 if(process.env.ARC_CHECK_ENTRY==='1')for(const developer of [false,true]){
  const context=await session.browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>session.errors.push({kind:'pageerror',text:e.message}));
  const url=`http://127.0.0.1:${server.address().port}/`+(developer?'?test_hooks=1':'');
  await Promise.all([page.waitForResponse(r=>r.url().endsWith('/lotm-cast/cast.json')&&r.status()===200),page.goto(url)]);
  await page.locator('#loading_screen_play_button').click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible().catch(()=>false))await confirm.click();if(developer)await page.evaluate(()=>window.simulationTestHooks.pause());
  await page.locator('select[aria-label="Other known panels"]').selectOption('lotm');await page.waitForTimeout(500);
  assert.equal(await page.locator('[data-lotm="pick_be"]').count(),developer?1:0);result[developer?'developerEntryAvailable':'ordinaryEntryHidesDeveloper']=true;await context.close();
 }

}catch(e){result.error=e.stack;console.error(e);if(p){result.visible=await p.locator('body').innerText().catch(()=>null);await p.screenshot({path:out+'/failure.png'}).catch(()=>{});}process.exitCode=1;}finally{result.pageErrors=session.errors;await fs.writeFile(out+`/browser-route-${process.env.ARC_RUN||process.env.ARC_SEED||7}.json`,JSON.stringify(result,null,2));await session.close();server.close();}
