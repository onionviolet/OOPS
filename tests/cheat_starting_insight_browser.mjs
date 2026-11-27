// Fresh first-game choices and earned Village/field play; no save-state gameplay grants.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../scripts/playtest/lib.mjs';
const require=createRequire(import.meta.url),{launchChrome}=require('../scripts/ui_helpers.cjs');
const build=resolve(process.argv[2]||'.lane-builds/cheat-starting-insight-20261125'),out=resolve(process.argv[3]||'docs/representations/evidence/cheat-starting-insight-2026-11-25');
await mkdir(out,{recursive:true});const bundle=createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex');
if(process.env.CHEAT_EXPECTED_BUNDLE)assert.equal(bundle,process.env.CHEAT_EXPECTED_BUNDLE);
const server=await serve(join(build,'dist'));let browser;const errors=[],results=[];
let baselineBudget;
const snap=p=>p.evaluate(()=>simulationTestHooks.snapshot()),faculty=s=>s.cheats.held['quiet-faculty'].card;
const pageError=e=>{errors.push(e.stack||e.message);console.error('PAGEERROR',e.stack||e.message);};
const init=async context=>context.addInitScript(()=>{
 const RealDate=Date,wall=Date.UTC(2026,10,25,18);globalThis.Date=class extends RealDate{constructor(...a){super(...(a.length?a:[wall]));}static now(){return wall;}};
 let n=19;const random=()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};Math.random=random;
 crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=Math.floor(random()*256);return a;};crypto.randomUUID=()=>{const h=[...Array(32)].map(()=>Math.floor(random()*16).toString(16));h[12]='4';h[16]='8';const s=h.join('');return`${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;};
});
async function context(){const c=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});await init(c);return c;}
async function ready(p){await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:120000});await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.evaluate(()=>{simulationTestHooks.pause();advanceTicks(1,{render:true});});}
async function open(p){await p.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('cheat-faculty');await p.locator('#cheat_faculty_panel > button').click();await p.locator('#cheat_faculty_view').waitFor({state:'visible'});}
const act=(p,type)=>p.locator(`#cheat_faculty_view [data-cheat-action="${type}"]`);
async function persist(p,c,label){
 const before=(await snap(p)).cheats;await p.locator('#save_button').click();await p.reload();await ready(p);await open(p);assert.deepEqual((await snap(p)).cheats,before);
 const file=join(out,`temporary-${label}.txt`),download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await(await download).saveAs(file);
 const fresh=await context(),q=await fresh.newPage();q.setDefaultTimeout(20000);q.on('pageerror',pageError);await q.goto(server.url);await ready(q);
 const nav=q.waitForEvent('domcontentloaded');await q.locator('#saved_file_input').setInputFiles(file);await nav;await ready(q);await open(q);assert.deepEqual((await snap(q)).cheats,before);await rm(file);await c.close();return {p:q,c:fresh};
}
try{
 const served=createHash('sha256').update(Buffer.from(await(await fetch(new URL('dist/bundle.js',server.url))).arrayBuffer())).digest('hex');assert.equal(served,bundle);
 browser=await launchChrome();
 for(const choice of ['ordinary','extra-insight']){
  let c=await context(),p=await c.newPage();p.setDefaultTimeout(20000);p.on('pageerror',pageError);await p.goto(server.url);await ready(p);await open(p);
  assert.equal(faculty(await snap(p)).state.points,0);assert.equal(faculty(await snap(p)).state.startingOffer.choice,'pending');assert.equal(await p.locator('[data-cheat-growth]').count(),0);
  if(choice==='extra-insight'){
   await p.evaluate(()=>{window.__insightWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){let s;try{s=JSON.parse(value);}catch{}if(key==='save data'&&s?.cheats?.held?.['quiet-faculty']?.card.state.startingOffer?.choice==='extra-insight')throw new DOMException('starting-insight storage fault','QuotaExceededError');return __insightWrite.call(this,key,value);};});
   await p.getByRole('button',{name:'Take +1 starting insight',exact:true}).click();assert.equal(faculty(await snap(p)).state.points,0);assert.match(await p.locator('[data-cheat-message]').innerText(),/browser has no room|last saved life is still safe/);
   await p.evaluate(()=>{Storage.prototype.setItem=__insightWrite;delete window.__insightWrite;});
   await p.getByRole('button',{name:'Take +1 starting insight',exact:true}).click();assert.equal(faculty(await snap(p)).state.points,1);
   await p.getByRole('button',{name:'Keep the ordinary beginning',exact:true}).click();assert.equal(faculty(await snap(p)).state.points,0);
   await p.getByRole('button',{name:'Take +1 starting insight',exact:true}).click();assert.equal(faculty(await snap(p)).state.points,1);
  }else await p.getByRole('button',{name:'Keep the ordinary beginning',exact:true}).click();
  for(const [width,height,size]of [[1920,1080,14],[1536,864,14],[1536,864,21]]){await p.setViewportSize({width,height});await p.evaluate(n=>document.documentElement.style.fontSize=n+'px',size);const card=p.locator('[data-starting-insight]');await card.scrollIntoViewIfNeeded();for(const b of await card.locator('button').all()){const fit=await b.evaluate(n=>n.scrollWidth<=n.clientWidth+2&&n.scrollHeight<=n.clientHeight+2);assert.ok(fit);}await p.screenshot({path:join(out,`${choice}-opening-${width}-${size}.jpg`)});}
  await p.setViewportSize({width:1920,height:1080});await p.evaluate(()=>document.documentElement.style.fontSize='14px');
  ({p,c}=await persist(p,c,`${choice}-opening`));console.log('opening persisted',choice);
  // Same real elder conversation earns field access and the same loaned sword.
  const beforeGear=new Set(Object.keys((await snap(p)).inventories.person.main_character));
  await p.evaluate(()=>{start_dialogue('villageElder');for(const k of ['hello','what happened','ask to leave 1','need to','starting gear','sword'])start_textline(k);end_dialogue();});
  let state=await snap(p);const sword=Object.keys(state.inventories.person.main_character).find(k=>!beforeGear.has(k));assert.ok(sword,'the elder supplied the ordinary starting sword');
  await p.evaluate(k=>equip_item(k),sword);await p.evaluate(()=>change_location({location_id:'Infested field'}));assert.equal((await snap(p))['current location'],'Infested field');
  let ticks=0,lots=[];
  while(ticks<500){state=await snap(p);lots=Object.values(state.harvest?.lots||{}).flat();if(lots.length>=4)break;await p.evaluate(()=>advanceTicks(1,{render:true}));ticks++;}
  assert.ok(lots.length>=4,'four actual field carcasses earned');await p.evaluate(()=>change_location({location_id:'Village'}));await open(p);assert.equal(faculty(await snap(p)).state.awakened,true);console.log('four field carcasses',choice,ticks);
  const claimed=[];const readyClaims=()=>p.locator('#cheat_faculty_view [data-cheat-action="claim"]:enabled');
  while(await readyClaims().count()){assert.ok(claimed.length<8);claimed.push((await readyClaims().first().locator('..').innerText()).replace(/Retain insight\s*$/,''));await readyClaims().first().click();}
  const points=faculty(await snap(p)).state.points;if(choice==='ordinary')baselineBudget=points;else assert.equal(points,baselineBudget+1);
  assert.ok(baselineBudget>=2);for(let i=0;i<baselineBudget;i++)await act(p,'develop').click();assert.ok((await snap(p)).cheats.held['loaded-dice']);
  const appraisal=()=>p.locator('[data-cheat-card="true-appraisal"]');
  for(let i=0;i<3;i++)await appraisal().locator('[data-cheat-action="appraise"]').nth(i).click();
  state=await snap(p);assert.equal(state.cheats.held['true-appraisal'].card.state.readings.length,3);assert.equal(new Set(state.cheats.held['true-appraisal'].card.state.readings.map(r=>r.key)).size,3);
  const recharge=appraisal().locator('[data-cheat-action="recharge"]');assert.equal(await recharge.isDisabled(),choice==='ordinary');assert.equal(await act(p,'develop').isDisabled(),choice==='ordinary');
  await appraisal().scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`${choice}-affordability.jpg`)});
  if(choice==='extra-insight'){await recharge.click();await appraisal().locator('[data-cheat-action="appraise"]').nth(3).click();}
  else assert.equal(await appraisal().locator('[data-cheat-action="appraise"]').nth(3).isDisabled(),true);
  state=await snap(p);const readings=state.cheats.held['true-appraisal'].card.state.readings;
  assert.equal(readings.length,choice==='ordinary'?3:4);assert.equal(new Set(readings.map(r=>r.key)).size,readings.length);assert.equal(faculty(state).state.points,0);assert.equal(faculty(state).state.spent,baselineBudget+Number(choice==='extra-insight'));
  ({p,c}=await persist(p,c,`${choice}-used`));await p.screenshot({path:join(out,`${choice}-used-imported.jpg`)});
  const result={choice,earnedBeforeSpending:points,claimedMilestones:claimed,facets:baselineBudget,distinctNativeCarcassReadings:readings.length,recharges:state.cheats.held['true-appraisal'].card.state.recharged,openingAndUsedSaveReloadExportFreshImport:true,ordinaryElderSword:true,actualFieldFightTicks:ticks};results.push(result);await c.close();assert.deepEqual(errors,[]);await writeFile(join(out,`${choice}-proof.json`),JSON.stringify({ok:true,bundleSha256:bundle,result,errors},null,2));console.log('finished',JSON.stringify(result));
 }
 assert.deepEqual(errors,[]);const proof={ok:true,bundleSha256:bundle,servedBundleSha256:served,viewport:'1920x1080',route:'Fresh PLAY -> in-game opening choice -> elder conversation and loaned sword -> first actual field victory awakens the same faculty ->4 actual field carcasses -> claim all ready lived insights and develop same facets -> baseline cannot recharge, +1 restores appraisal and reads4th distinct carcass -> native Save/reload/Export/fresh Import.',setup:'Fresh first games, matched deterministic seed/wall; native clock stepper advances fights. No scenario or injected inventory/insight/victory grants. Advantage branch injects and recovers one storage-write fault before any credit.',results,errors};await writeFile(join(out,'proof.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
}catch(error){console.error(error);throw error;}finally{try{await browser?.close();}finally{server.closeAllConnections?.();server.close();}}
