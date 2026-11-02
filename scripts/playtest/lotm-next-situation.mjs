// Bounded continuation probe. Source text, earned saves and captures remain private.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {Session} from './lib.mjs';
import {NativeContinuation} from './native-continuation.mjs';
import {serve} from '../perf/lib.mjs';
const root=resolve(process.argv[2]||'/tmp/lotm-kj3a-review');
const out=resolve(process.env.YAIRPG_EVIDENCE_DIR||'docs/research/novels/lord-of-mysteries/private/kj3-first-situation-2026-11-01');
const seed=JSON.parse(await fs.readFile('docs/research/novels/lord-of-mysteries/private/kj2-preparation-2026-11-01/route-latest-checkpoint.json','utf8'));
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,1),opTimeout:20000}).start();
const route=new NativeContinuation(session);
const result={route:'named earned KJ2 return checkpoint; native commands, waits, costs, sleep and literal options Export/Import',checks:[],steps:[]};let p,staleBread,beforeCook;
const prefix='book.lotm.kj3a.',world='book.lotm.tingen';
const key=id=>JSON.stringify({id});
const snap=()=>route.snapshot();
const view=()=>route.view();
const holds=(s,id)=>s.inventories?.character?.[key(id)]?.count??s.inventories?.person?.main_character?.[key(id)]?.count??0;
const open=()=>route.panel();
async function load(s){await route.load(s);p=route.page;}
const settle=()=>route.settle();
const startCurrent=()=>route.startCurrent({beforeClick:async({id,control})=>{if(id===prefix+'bread')staleBread=await control.elementHandle();}});
async function imported(encoded){await route.imported(encoded);p=route.page;}
try{
 console.log('Opening earned checkpoint');await load(seed);assert.equal((await view()).arc.id,'tingen_first_inquiry');assert.equal((await view()).arc.completed,0);result.checks.push('old earned checkpoint projects the new continuation without resetting or inventing prior completion');
 result.bundleSha256=createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex');result.packSha256=createHash('sha256').update(await fs.readFile(root+'/private_packs/lotm-cast/cast.json')).digest('hex');
 assert((await p.locator('script[src*="dist/bundle.js"]').getAttribute('src')).includes(result.bundleSha256.slice(0,12)));
 while(!(await view()).arc.done){const v=await view();assert.equal(v.arc.id,'tingen_first_inquiry');const command=v.arc.next.id;const stage=command.slice(prefix.length);
  if(stage==='boil')beforeCook=await session.save();
  let started=await startCurrent();
  if(started.id!==command){await settle();continue;}
  if(stage==='sleep'){
   assert.equal((await view()).sleeping,true);assert.match(await p.locator('#lotm_panel').innerText(),/Stop work/);assert.doesNotMatch(await p.locator('#lotm_panel').innerText(),/Stop \(reserved attention/);
   await p.getByText('Wake up',{exact:true}).first().click();await open();assert.equal((await view()).sleeping,false);assert.equal((await view()).arc.next.id,command);
   await startCurrent();const pending=await session.save();assert.equal(pending.expansion.simulation.jobs.some(j=>j.commandId===command),true);
   const encoded=await p.evaluate(()=>save_to_file());assert(encoded);await fs.writeFile(out+'/pending-sleep-export.txt',encoded);await imported(encoded);
   assert.equal((await view()).sleeping,true,'pending native sleep restored after literal Import');assert.equal((await view()).jobs.some(j=>j.label),true);
   result.checks.push('sleep starts/stops through native ports and pending sleep survives save/export/literal Import without a completed receipt');
  }
  if(stage==='boil'){
   assert.equal((await view()).jobs[0].refundsInputs,true);assert.match(await p.locator('#lotm_panel').innerText(),/Stopping returns reserved inputs/);
   await fs.writeFile(out+'/pending-cooking.json',JSON.stringify(await session.save()));
  }
  await settle();await open();result.steps.push(command);await fs.writeFile(out+'/earned-stage-'+result.steps.length+'.json',JSON.stringify(await session.save()));console.log('Settled',stage);
  if(stage==='potatoes'){
   const s=await snap();result.inventoryShape=Object.keys(s.inventories||{});
   assert.equal(holds(s,'Fresh bread'),16);assert.equal(holds(s,'Potato'),2);
   assert.equal(s.expansion.actors.player.resources['household.excursion.bread'],0);assert.equal(s.expansion.actors.player.resources['household.excursion.corners'],0);assert.equal(s.expansion.actors.player.resources['household.excursion.vegetables.bundle'],0);
   assert.equal((await view()).stockViews.some(v=>v.title==='Physical supplies'),false);
   result.checks.push('food allocations convert once into actual inventory, with an uncounted remainder and no duplicate old stock display');
   await p.screenshot({path:out+'/ingredients-14.png',timeout:10000});
  }
  if(result.steps.length>15)throw Error('Probe exceeded the selected situation');
 }
 const final=await session.save();await fs.writeFile(out+'/completed-checkpoint.json',JSON.stringify(final));
 assert.equal(result.steps.length,15);assert.equal(holds(final,'Fresh bread'),14);assert.equal(holds(final,'Potato'),0);assert.equal(holds(final,'Cooked potato'),0);
 const a=final.expansion.actors.player;assert.equal(a.resources['household.excursion.mutton.lb'],1);assert.equal(a.resources['household.kj3a.vegetables.remainder'],1);assert.equal(a.resources['household.kj3a.soup'],0);assert.equal(a.facts['household.kj3a.hungry'],false);
 assert(final.expansion.simulation.knowledge.player[prefix+'plan.seen']);assert(final.expansion.simulation.knowledge.player[prefix+'knock.seen']);assert.equal(final.expansion.worlds[world].facts['household.kj3a.lead.available'],undefined);assert.match(final.expansion.simulation.knowledge.player[prefix+'inference.seen'].value,/may.*connected/);
 result.checks.push('complete earned route consumes the exact meal, preserves other groceries and uses an attributed finding to prepare the next inquiry');
 if(staleBread){const before=await snap();await staleBread.evaluate(n=>n.click());assert.deepEqual(await snap(),before);result.checks.push('stale completed conversion control cannot mint food or another receipt');}
 for(const size of[14,21]){
  if(size===21){const large=structuredClone(final);large.customization.profiles.Default.settings.typography={font:'gothic',size:21};await load(large);}
  await p.setViewportSize({width:1920,height:1080});assert.equal(await p.locator('[data-lotm-arc] p').first().evaluate(n=>getComputedStyle(n).fontSize),size+'px');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.screenshot({path:out+`/complete-${size}.png`,timeout:10000});result.checks.push(`rebuilt desktop 1920x1080 at actual ${size}px, current task/aftermath and retained inventory`);
 }
 const completed=await session.save();await p.reload();await p.locator('#loading_screen_play_button').waitFor({timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await open();assert.equal((await view()).arc.done,true);assert.equal(holds(await snap(),'Fresh bread'),14);
 const encoded=await p.evaluate(()=>save_to_file());await fs.writeFile(out+'/completed-export.txt',encoded);await imported(encoded);assert.equal((await view()).arc.done,true);assert.equal(holds(await snap(),'Fresh bread'),14);assert((await snap()).expansion.simulation.knowledge.player[prefix+'plan.seen']);
 result.checks.push('settled save/reload/export/literal Import retains consumed inputs, useful finding and completed sequence');
 // Explicit counterfactual fixtures derived from earned play, never a private player save.
 const pending=JSON.parse(await fs.readFile(out+'/pending-cooking.json','utf8'));pending.expansion.worlds[world].facts['household.kj3a.water.available']=false;await load(pending);await settle();const stopped=await snap();assert.equal(holds(stopped,'Potato'),2);assert.equal(holds(stopped,'Cooked potato'),0);assert.equal(stopped.expansion.actors.player.resources['household.kj3a.cooking.allocation'],1);assert.equal(stopped.expansion.simulation.knowledge.player[prefix+'boil.seen'],undefined);assert.equal((await view()).arc.next.id,prefix+'boil');assert.match(await p.locator('[data-lotm-arc]').innerText(),/Water/);result.checks.push('lost water support refunds the actual reserved ingredients once, awards no cooked output and explains the known blocker');
 const missing=structuredClone(beforeCook);const inv=missing.inventories.character??missing.inventories.person?.main_character;assert(inv&&inv[key('Potato')]);inv[key('Potato')].count=1;await load(missing);assert.equal((await view()).objectActs.find(a=>a.id===prefix+'boil').eligible,false);result.checks.push('missing native ingredient blocks the quoted recipe before spend');
 result.pageErrors=session.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(result.pageErrors,[]);result.review='agent-verified earned-checkpoint route and explicit negative fixtures; not fresh full journey or installed proof';
 console.log(JSON.stringify({steps:result.steps.length,checks:result.checks.length,bundleSha256:result.bundleSha256,pageErrors:result.pageErrors}));
}catch(e){result.error=e.stack;console.error(e.stack);if(p)await p.screenshot({path:out+'/failure.png',timeout:10000}).catch(()=>{});process.exitCode=1;}finally{result.timings=route.timings;await fs.writeFile(out+'/browser-result.json',JSON.stringify(result,null,2));await session.close();await server.close();}
