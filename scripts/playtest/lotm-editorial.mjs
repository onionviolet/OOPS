// One earned shopping/preparation checkpoint; isolated browser, no personal saves.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {Session} from './lib.mjs';
import {serve} from '../perf/lib.mjs';
const root=resolve(process.argv[2]),phase=process.argv[3]||'after';
const out=resolve('docs/research/novels/lord-of-mysteries/private/editorial-ui-2026-11-04/'+phase);
await fs.mkdir(out,{recursive:true});
const seed=JSON.parse(await fs.readFile('docs/research/novels/lord-of-mysteries/private/kj2-preparation-2026-11-01/route-checkpoint-20.json','utf8'));
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,4),opTimeout:60000}).start();
let p;const result={fixture:'earned KJ2 route-checkpoint-20',phase,optionalPackFixture:false,checks:[]};
const check=text=>{result.checks.push(text);console.log(text);};
const snap=()=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();delete s.saved_at;return s;});
const view=()=>p.evaluate(()=>simulationTestHooks.project('lotm'));
const open=async()=>{await p.keyboard.press('Escape');await p.locator('#workspace_navigation select').selectOption('lotm');await p.locator('[data-lotm-arc]').waitFor();};
const tick=(working=false)=>p.evaluate(working=>{const n=simulationTestHooks.clock();for(let i=0;i<5;i++){if(working)simulationTestHooks.workTicks(500);else advanceTicks(10);if(simulationTestHooks.clock()>n)return;}throw Error('Local clock held');},working);
const settle=async()=>{for(let i=0;i<40;i++){if(!(await view()).jobs.length)return;await tick(true);}throw Error('Local job exceeded bound');};
try{
 console.log('Opening complete-manifest earned checkpoint');await session.open(seed);p=session.page;await open();console.log('Current situation opened');
 result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');assert((await p.locator('script[src*="dist/bundle.js"]').getAttribute('src')).includes(result.bundleSha256.slice(0,12)));
 const initial=await view();result.initial={arc:initial.arc,summary:await p.locator('[data-lotm-arc]').innerText()};
 const review=p.locator('[data-lotm-task-link]');await review.focus();const target=await review.getAttribute('data-lotm-task-link');await tick();
 result.reviewFocusRetained=await p.evaluate(target=>document.activeElement?.dataset.lotmTaskLink===target,target);
 await p.screenshot({path:out+'/opening-1920-14.png'});
 if(phase.startsWith('before')){console.log(JSON.stringify({arc:initial.arc.id,next:initial.arc.next.id,summary:result.initial.summary,reviewFocusRetained:result.reviewFocusRetained}));}
 else{
  assert(result.reviewFocusRetained,'task review focus must survive a local-clock refresh');check('same review target keeps focus through refresh');
  const unchanged=await snap();await p.locator('[data-lotm-task-link]').click();assert.deepEqual(await snap(),unchanged);
  assert.equal(await p.evaluate(()=>document.activeElement.dataset.lotm),target);check('review navigation changes neither state nor clock');
  await p.locator(`[data-lotm="${target}"]`).first().click();await settle();
  const purchase=await view(),before=await snap();assert.match(await p.locator('[data-lotm-task-terms]').innerText(),/5 min.*16 pence/);
  await open();await p.locator('[data-lotm-arc]').scrollIntoViewIfNeeded();
  await p.screenshot({path:out+'/purchase-1920-14.png'});
  await p.locator('[data-lotm-task-link]').click();await p.locator(`[data-lotm="${purchase.arc.next.id}"]`).click();
  assert((await view()).jobs.length);result.pendingSummary=await p.locator('[data-lotm-arc]').innerText();await settle();
  const bought=await snap();assert.equal(bought.character.money,before.character.money-16);assert.equal(bought.expansion.actors.player.resources['household.excursion.mutton.lb'],1);assert.equal(bought.expansion.actors.player.resources['household.excursion.vegetables.bundle'],1);
  check('actual quote, pending work and one settled purchase retain exact cost/goods');
  let steps=0;while((await view()).arc.completed<8){assert(++steps<=10);const v=await view(),id=await p.locator('[data-lotm-task-link]').getAttribute('data-lotm-task-link');assert(id);await p.locator('[data-lotm-task-link]').click();const b=p.locator(`[data-lotm="${id}"]`).first();if(await b.isDisabled()){assert.match(await p.locator('[data-lotm-arc]').innerText(),/chimes/);const wait=v.waits.filter(a=>a.eligible).sort((a,b)=>a.duration-b.duration)[0];assert(wait);await p.locator(`[data-lotm="${wait.id}"]`).click();}await b.click();await settle();}
  const final=await snap();await fs.writeFile(out+'/settled-checkpoint.json',JSON.stringify(final));assert.equal(final.expansion.actors.player.resources['household.excursion.bread'],12);assert.equal(final.expansion.actors.player.resources['household.excursion.corners'],4);
  check('return/preparation/known timing wait/use preserve carried versus placed bread');
  let textSize=14;
  for(const [width,height,size]of[[1920,1080,14],[1920,1080,21],[1800,1040,21],[1536,864,21]]){
   if(size!==textSize){textSize=size;const s=await session.save();s.customization.profiles.Default.settings.typography={font:'gothic',size:21};await session.open(s);p=session.page;await open();}
   await p.setViewportSize({width,height});assert.equal(await p.locator('[data-lotm-arc] p').first().evaluate(n=>getComputedStyle(n).fontSize),size+'px');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await p.screenshot({path:out+`/result-${width}-${size}.png`});
  }
  check('populated desktop 1920/1800/1536 and actual 14/21px without horizontal overflow');
  await p.emulateMedia({reducedMotion:'reduce'});assert.match(await p.locator('[data-lotm-last-result]').innerText(),/not consumed/);check('reduced motion retains the real readable result');
  await session.save();await p.reload();await p.locator('#loading_screen_play_button').waitFor({timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await open();assert.equal((await view()).arc.completed,8);assert.equal((await snap()).character.money,final.character.money);check('native reload retains the task and settled funds');
  const poor=structuredClone(seed);poor.character.money=0;await session.open(poor);p=session.page;await open();const v=await view(),walk=v.moves.find(m=>m.to===v.arc.next.place);await p.locator(`[data-lotm="${walk.id}"]`).first().click();await settle();assert.equal((await view()).objectActs.find(a=>a.id===(v.arc.next.id)).eligible,false);assert.match(await p.locator('[data-lotm-arc]').innerText(),/pence|funds|money/i);const refused=await snap();await p.locator(`[data-lotm="${v.arc.next.id}"]`).evaluate(n=>n.click());assert.deepEqual(await snap(),refused);await p.screenshot({path:out+'/blocked-1920-14.png'});check('explicit zero-purse fixture exposes known blocker and spends nothing');
 }
 result.pageErrors=session.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(result.pageErrors,[]);
 console.log(JSON.stringify({phase,checks:result.checks.length,bundleSha256:result.bundleSha256,pageErrors:result.pageErrors}));
}catch(e){result.error=e.stack;result.browserErrors=session.errors;result.debug=p?await p.evaluate(()=>({storedName:JSON.parse(localStorage.getItem('save data')||'null')?.character?.name,stored:!!localStorage.getItem('save data'),name:simulationTestHooks.snapshot().character.name,world:simulationTestHooks.snapshot().expansion.actors.player.worldId,progress:document.getElementById('loading_screen_loading_progress')?.textContent,workspace:document.querySelector('[data-workspace-mode]')?.dataset.workspaceMode,hasPanel:!!document.getElementById('lotm_panel')})).catch(()=>null):null;console.error(e.stack);process.exitCode=1;if(p)await p.screenshot({path:out+'/failure.png'}).catch(()=>{});}
finally{await fs.writeFile(out+'/result.json',JSON.stringify(result,null,2));await session.close();await server.close();}
