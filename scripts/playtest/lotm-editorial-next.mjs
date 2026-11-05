// Continue the explicitly earned previous editorial checkpoint; no personal saves.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {Session} from './lib.mjs';
import {serve} from '../perf/lib.mjs';
const root=resolve(process.argv[2]),phase=process.argv[3]||'after';
const out=resolve('docs/research/novels/lord-of-mysteries/private/editorial-next-2026-11-04/'+phase);
await fs.mkdir(out,{recursive:true});
const seed=JSON.parse(await fs.readFile('docs/research/novels/lord-of-mysteries/private/editorial-ui-2026-11-04/verified/settled-checkpoint.json','utf8'));
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,4),opTimeout:60000}).start();
const result={fixture:'previous editorial earned stage-eight checkpoint',phase,checks:[]};let p;
const check=t=>{result.checks.push(t);console.log(t);};
const view=()=>p.evaluate(()=>simulationTestHooks.project('lotm'));
const snap=()=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();delete s.saved_at;return s;});
const open=async()=>{await p.keyboard.press('Escape');await p.locator('#workspace_navigation select').selectOption('lotm');await p.locator('[data-lotm-arc]').waitFor();};
try{
 console.log('Opening earned prepared-room situation');await session.open(seed);p=session.page;await open();
 result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');assert((await p.locator('script[src*="dist/bundle.js"]').getAttribute('src')).includes(result.bundleSha256.slice(0,12)));
 const v=await view();assert.equal(v.arc.next.id,'book.lotm.excursion.calm');assert.equal(v.arc.completed,8);
 result.ready=await p.locator('[data-lotm-arc]').innerText();await p.locator('[data-lotm-arc]').scrollIntoViewIfNeeded();await p.screenshot({path:out+'/ready-1920-14.png'});await p.locator('[data-lotm-arc]').screenshot({path:out+'/ready-detail.png'});
 if(phase!=='before'){assert.match(await p.locator('[data-lotm-task-context]').innerText(),/outcome is unknown/);assert.match(await p.locator('[data-lotm-task-flavour]').innerText(),/housekeeping/);check('current explanation preserves uncertainty beside its actual quote and local aside');}
 const before=await snap();await p.locator('[data-lotm-task-link]').click();assert.deepEqual(await snap(),before);await p.locator('[data-lotm="book.lotm.excursion.calm"]').click();
 const pending=await view();assert.equal(pending.arc.completed,8);assert.equal(pending.jobs.length,1);result.pending=await p.locator('[data-lotm-arc]').innerText();
 if(phase==='before'){
  const link=p.locator('[data-lotm-task-link]');if(await link.count())await link.click();result.reviewTarget=await p.evaluate(()=>({tag:document.activeElement.tagName,command:document.activeElement.dataset.lotm,text:document.activeElement.textContent}));console.log(JSON.stringify(result.reviewTarget));
 }else{
  assert.equal(await p.locator('[data-lotm-task-context],[data-lotm-task-flavour]').count(),0);
  const workId=pending.jobs[0].id,beforeReview=await snap();await p.locator('[data-lotm-task-work-link]').click();assert.equal(await p.evaluate(()=>document.activeElement.dataset.lotmJob),workId);await p.keyboard.press('Enter');assert.deepEqual(await snap(),beforeReview);check('review and repeated Enter inspect the exact live job without stopping or advancing it');
  await p.evaluate(()=>advanceTicks(1));assert.equal(await p.evaluate(()=>document.activeElement.dataset.lotmJob),workId);check('job status focus survives a local-clock refresh');
  await p.screenshot({path:out+'/working-1920-14.png'});
  for(let i=0;i<40;i++){if(!(await view()).jobs.length)break;await p.evaluate(()=>simulationTestHooks.workTicks(500));}
  const done=await view(),settled=await snap();assert.equal(done.arc.completed,9);assert.equal(settled.character.money,before.character.money);assert.deepEqual(settled.expansion.actors.player.resources,before.expansion.actors.player.resources);assert.equal(await p.evaluate(()=>document.activeElement.id),'lotm-current-task-title');assert.equal(await p.locator('[data-lotm-task-work-link]').count(),0);assert.equal(await p.locator('[data-lotm-task-flavour]').count(),0);check('native preparation settles once with unchanged stock/funds and focus returns to the task heading');
  await fs.writeFile(out+'/settled-checkpoint.json',JSON.stringify(settled));
  let size=14;for(const [width,height,fontSize]of[[1920,1080,14],[1920,1080,21],[1800,1040,21],[1536,864,21]]){
   if(size!==fontSize){size=fontSize;const s=await session.save();s.customization.profiles.Default.settings.typography={font:'gothic',size};await session.open(s);p=session.page;await open();}
   await p.setViewportSize({width,height});await p.locator('[data-lotm-arc]').scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-lotm-arc] p').first().evaluate(n=>getComputedStyle(n).fontSize),size+'px');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:out+`/settled-${width}-${size}.png`});
  }check('desktop layouts retain readable task context at actual 14/21px without horizontal overflow');
  await p.emulateMedia({reducedMotion:'reduce'});assert(await p.locator('[data-lotm-last-result]').isVisible());await session.save();await p.reload();await p.locator('#loading_screen_play_button').waitFor({timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await open();assert.equal((await view()).arc.completed,9);check('readable aftermath survives reduced motion and native reload');
 }
 result.pageErrors=session.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(result.pageErrors,[]);console.log(JSON.stringify({phase,checks:result.checks.length,bundleSha256:result.bundleSha256,pageErrors:result.pageErrors}));
}catch(e){result.error=e.stack;console.error(e.stack);process.exitCode=1;if(p)await p.screenshot({path:out+'/failure.png'}).catch(()=>{});}
finally{await fs.writeFile(out+'/result.json',JSON.stringify(result,null,2));await session.close();await server.close();}
