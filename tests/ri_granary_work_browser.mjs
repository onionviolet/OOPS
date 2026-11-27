// Explicit late-life setup; every work action below uses the native player UI.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve,join} from 'node:path';
import {serve} from '../scripts/playtest/lib.mjs';
import {scenarioSave} from '../scripts/headless/scenarios.mjs';
import {guLeadDay} from '../src/world_packs/book_gu_lead_day.js';
import {guLeadRankTwo} from '../src/world_packs/book_gu_lead_rank_two.js';
import {RI_DAY_ITEMS as IT,RI_LEAD_DAY as DAY,RI_ACADEMY_ELDER as ELDER} from '../src/ri_lead_day_facts.js';
import {RI_GRANARY as ID,RI_EAR_GRASS as EAR,RI_EAR_ATTACHMENT as ATT,RI_GRANARY_FOUND as FOUND,RI_GRANARY_PATCHED as PATCHED,RI_GRANARY_PAID as PAID} from '../src/ri_granary_work.js';
const require=createRequire(import.meta.url),{launchChrome}=require('../scripts/ui_helpers.cjs');
const build=resolve(process.argv[2]||'.lane-builds/fang-granary-20261125');
const out=resolve(process.argv[3]||'docs/representations/evidence/fang-granary-2026-11-25');
await mkdir(out,{recursive:true});
const hash=createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex');
assert.equal(hash,process.env.FANG_EXPECTED_BUNDLE||'4d14cb3c865682abdd1428d9ddd37b627cb0f2ace8db85f055009f1c78ced84c');
const base=JSON.parse(await readFile('work/fang-granary/base-fixture.json','utf8').catch(error=>{if(error.code==='ENOENT')return scenarioSave('ri-fang-yuan-wild-gu');throw error;}));
const pin=raw=>({id:raw.id,revision:raw.revision,contentHash:'sha256:'+createHash('sha256').update(JSON.stringify(raw)).digest('hex')});
const key=id=>JSON.stringify({id}), count=(s,id)=>s.inventories.person.main_character[key(id)]?.count||0;
const snap=p=>p.evaluate(()=>simulationTestHooks.snapshot());
const part=s=>s.expansion.simulation.energies.player['book.ri.lead.primeval'].reserve;
const server=await serve(join(build,'dist')),browser=await launchChrome(),errors=[],results=[];
let servedHash;
const pageError=e=>{errors.push(e.stack||e.message);console.error('PAGEERROR',e.stack||e.message);};
const ready=async p=>{await p.waitForFunction(()=>typeof simulationTestHooks!=='undefined',{timeout:120000});await p.evaluate(()=>simulationTestHooks.pause());const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();await p.evaluate(()=>simulationTestHooks.pause());};
const show=p=>p.getByRole('combobox',{name:'Other known panels'}).selectOption('beginning');
const click=async l=>{await l.evaluate(n=>{for(let a=n.parentElement;a;a=a.parentElement)if(a.tagName==='DETAILS')a.open=true;});await l.click();};
const action=(p,op)=>p.locator(`[data-structured-action="${ID}.${op}"]`);
const finish=async p=>{const s=await snap(p),job=s.expansion.simulation.jobs[0];assert.ok(job);await p.evaluate(n=>advanceTicks(n,{render:true}),job.due-s.expansion.clock);};
async function persist(p,context,label){
 const before=await snap(p);await p.locator('#save_button').click();await p.reload();await ready(p);await show(p);
 const file=join(out,`temporary-${label}.txt`),download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await(await download).saveAs(file);
 const fresh=await browser.newContext({viewport:{width:1920,height:1080}}),q=await fresh.newPage();q.on('pageerror',pageError);await q.goto(server.url);await ready(q);
 const nav=q.waitForEvent('domcontentloaded');await q.locator('#saved_file_input').setInputFiles(file);await nav;await ready(q);await show(q);
 const after=await snap(q);
 for(const note of [FOUND,PATCHED,PAID])assert.deepEqual(after.expansion.simulation.knowledge.player?.[note],before.expansion.simulation.knowledge.player?.[note]);
 assert.deepEqual(after.expansion.simulation.jobs,before.expansion.simulation.jobs);assert.equal(count(after,IT.petals),count(before,IT.petals));assert.equal(count(after,IT.pelt),count(before,IT.pelt));
 assert.equal(part(after),part(before));
 assert.deepEqual(after.content_packs.structured.extensions.find(x=>x.id===ID),before.content_packs.structured.extensions.find(x=>x.id===ID));
 await rm(file);await context.close();return {p:q,context:fresh};
}
try{
 servedHash=createHash('sha256').update(Buffer.from(await(await fetch(new URL('dist/bundle.js',server.url))).arrayBuffer())).digest('hex');
 assert.equal(servedHash,hash,'served browser bytes match the asserted bundle');
 for(const method of ['listen','search']){
  const fixture=structuredClone(base);fixture.content_packs.structured.extensions.push(pin(guLeadRankTwo),pin(guLeadDay));
  fixture.expansion.simulation.people[ELDER].location='book.ri.lead.academy';
  const inv=fixture.inventories.person.main_character;
  for(const [id,n] of [[IT.pelt,1],[IT.moonglow,1],[IT.petals,0],[EAR,method==='listen'?1:0]]){if(n)inv[key(id)]={count:n};else delete inv[key(id)];}
  if(method==='listen')fixture.expansion.actors.player.facts[ATT]='right_ear_adapted';
  fixture.expansion.simulation.energies.player['book.ri.lead.primeval'].reserve=method==='listen'?3:0;
  let context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true}),p=await context.newPage();p.on('pageerror',pageError);
  await p.goto(server.url);await p.evaluate(text=>{localStorage.clear();localStorage.setItem('save data',text);},JSON.stringify(fixture));await p.reload();await ready(p);await show(p);
  await click(p.locator(`[data-structured-extension="${ID}"]`));
  console.log('adopted',method);
  if(method==='listen')for(const [width,height,size] of [[1920,1080,14],[1536,864,14],[1536,864,21]]){
   await p.setViewportSize({width,height});await p.evaluate(n=>document.documentElement.style.fontSize=n+'px',size);
   const row=p.locator('[data-day-action="granary-listen"]');await row.scrollIntoViewIfNeeded();
   const box=await row.locator('button').evaluate(b=>({width:b.clientWidth,scroll:b.scrollWidth,height:b.clientHeight,scrollHeight:b.scrollHeight}));
   assert.ok(box.scroll<=box.width+2&&box.scrollHeight<=box.height+2,JSON.stringify({width,height,size,box}));
   await p.screenshot({path:join(out,`choices-${width}-${size}.jpg`)});
  }
  await p.setViewportSize({width:1920,height:1080});await p.evaluate(()=>document.documentElement.style.fontSize='14px');
  await p.locator('.daily-powers').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`${method}-choices.jpg`)});
  if(method==='listen'){
   await click(action(p,'listen'));assert.equal(part(await snap(p)),2);
   await click(p.locator('[data-day-action="granary-listen"] button'));assert.equal(part(await snap(p)),2);assert.equal((await snap(p)).expansion.simulation.knowledge.player?.[FOUND],undefined);
  }else assert.equal(await action(p,'listen').isDisabled(),true);
  const start=(await snap(p)).expansion.clock;await click(action(p,method));if(method==='listen')assert.equal(part(await snap(p)),1);
  ({p,context}=await persist(p,context,`${method}-pending`));await finish(p);
  console.log('found',method);
  assert.ok((await snap(p)).expansion.simulation.knowledge.player[FOUND]);assert.equal((await snap(p)).expansion.clock-start,method==='listen'?5:45);
  await click(action(p,'patch'));assert.equal(count(await snap(p),IT.pelt),0);await finish(p);assert.ok((await snap(p)).expansion.simulation.knowledge.player[PATCHED]);
  await click(action(p,'collect'));const paid=await snap(p);assert.equal(count(paid,IT.petals),20);assert.ok(paid.expansion.simulation.knowledge[ELDER][PAID]);assert.equal(await action(p,'collect').count(),0);console.log('paid',method);
  await p.locator('.daily-powers').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`${method}-payment.jpg`)});
  assert.match(await p.locator('.daily-powers__latest').innerText(),/pays twenty Moon Orchid petals.*opens tomorrow/);
  ({p,context}=await persist(p,context,`${method}-paid`));
  await click(p.locator(`[data-structured-action="${DAY}.feed_moonglow"]`));assert.equal(count(await snap(p),IT.petals),18);
  await p.locator('.daily-powers').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`${method}-paid-imported.jpg`)});
  results.push({method,minutes:method==='listen'?25:65,paid:20,afterExistingFeed:18,pendingAndPaidSaveReloadExportFreshImport:true});await context.close();
 }
 assert.deepEqual(errors,[]);const result={ok:true,bundle:hash,bundleSha256:hash,servedBundleSha256:servedHash,route:'Native Fang day: cancel funded Ear Grass listening; listen or inspect by hand; patch with a held hide; present work to the existing elder; feed the held Moonglow with earned petals. Save/reload/Export/fresh Import during each investigation and after each payment.',viewport:'1920x1080',fixture:'Late Fang life; existing elder at academy after ceremony, rank-two/day pins, held Moonglow and one hide; listening branch has held attached Ear Grass and three essence, manual branch has neither Gu nor essence.',results,errors};await writeFile(join(out,'proof.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}catch(error){console.error(error);throw error;}finally{await browser.close();server.close();}
