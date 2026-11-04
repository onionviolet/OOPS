// Named original fixtures through both existing lead hosts, never personal saves.
// node tests/paid_work_browser.mjs <isolated BUILD_OUT> <private evidence directory>
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {Session,serve} from '../scripts/playtest/lib.mjs';
import {paidWorkFixture} from './helpers/paid_work_fixture.mjs';
const [build,out]=process.argv.slice(2).map(p=>resolve(p));
await mkdir(out,{recursive:true});
const server=await serve(join(build,'dist')),checks=[];
const ok=(label,value)=>{assert.ok(value,label);checks.push(label);console.log('PASS '+label);};
const results=[];
try{for(const world of (process.env.PAID_WORK_WORLD?[process.env.PAID_WORK_WORLD]:['lotm','hp'])){
 const {pack,ids:I}=paidWorkFixture(world),hp=world==='hp';let castRequests=0;
 const session=await new Session({url:server.url+(hp?'&structured_candidate=book.hp.lead':''),seed:37,wall:Date.UTC(2026,10,4,15),opTimeout:20000,hooks:{beforeOpen:async context=>{
  await context.route('**/private_packs/**',async route=>{
   const path=new URL(route.request().url()).pathname;
   const file=hp?'hp-cast/cast.json':'lotm-cast/cast.json';
   if(!hp&&path.endsWith('/'+file)&&++castRequests>1)await new Promise(r=>setTimeout(r,500));
   const data=path.endsWith('/manifest.json')?{schema:1,supplements:[file]}:path.endsWith('/'+file)?pack:null;
   return route.fulfill({status:data?200:404,contentType:'application/json',body:JSON.stringify(data)});
  });
 }}}).start();
 const snap=()=>session.page.evaluate(()=>window.simulationTestHooks.snapshot());
 const stock=(s,key)=>s.expansion.actors.player.resources[key]||0;
 const learned=s=>s.expansion.simulation.knowledge.player?.[I.method]?.value;
 const panel=()=>session.page.locator(hp?'#structured_pack_panel':'#lotm_panel');
 const button=id=>session.page.locator(hp?`[data-structured-action="${id}"]`:`[data-lotm="${id}"]`).first();
 const show=async()=>{
  if(hp)await session.page.locator('#workspace_navigation select').first().selectOption('beginning');
  else{await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');await session.page.evaluate(()=>{for(const e of document.querySelectorAll('#lotm_panel details'))e.open=true;});}
 };
 const step=async n=>{await session.step(n);await session.page.evaluate(()=>window.advanceTicks(0,{render:true}));await show();};
 const ready=async()=>{
  const p=session.page;
  await p.waitForFunction(()=>!!window.simulationTestHooks&&(document.getElementById('loading_screen_play_button')?.checkVisibility()||document.getElementById('loading_screen')?.style.visibility==='hidden'));
  await p.evaluate(()=>window.simulationTestHooks.pause());
  const play=p.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();
  const confirm=p.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();
  await p.waitForFunction(()=>document.getElementById('loading_screen')?.style.visibility==='hidden');await p.waitForTimeout(350);await show();
 };
 const save=async()=>{await session.page.locator('#save_button').click();return snap();};
 const digest=s=>JSON.stringify({resources:s.expansion.actors.player.resources,knowledge:s.expansion.simulation.knowledge.player,jobs:s.expansion.simulation.jobs,completed:s.expansion.actors.player.completed});
 try{
  await session.open();const p=session.page;
  if(hp){await show();await p.locator('[data-structured-begin]').click();}
  else await p.evaluate(()=>window.simulationTestHooks.command('lotm','enrollBeFresh'));
  await show();ok(world+': absent prepared sample blocks its receiving use',await button(I.use).count()===0||await button(I.use).isDisabled());await button(I.read).click();await step(2);
  let s=await snap();const method=learned(s);
  ok(world+': instructions retained but no physical output',!!method&&stock(s,I.samples)===0&&stock(s,I.supplies)===8);
  ok(world+': work discloses paid interruption before commitment',/inputs stay spent if/i.test(await panel().innerText()));
  await button(I.work).scrollIntoViewIfNeeded();await session.page.screenshot({path:join(out,world+'-before-work.png')});
  await button(I.work).click();s=await snap();
  ok(world+': admission spends two supplies, produces nothing',stock(s,I.supplies)===6&&stock(s,I.samples)===0);
  ok(world+': native job pins forfeit support policy',s.expansion.simulation.jobs.some(j=>j.commandId===I.work&&j.cancellation==='forfeit'&&j.completionSupport?.failure==='forfeit'));
  await save();await writeFile(join(out,world+'-pending.json'),JSON.stringify(await snap(),null,2));const pending=digest(await snap());await p.reload();await ready();
  ok(world+': pending reload keeps exact paid job and knowledge',digest(await snap())===pending);
  const pendingDownload=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const pendingFile=join(out,world+'-pending-export.txt');await(await pendingDownload).saveAs(pendingFile);
  await p.evaluate(()=>localStorage.clear());await p.reload();await ready();
  const pendingImported=p.waitForEvent('domcontentloaded',{timeout:45000});await p.locator('#saved_file_input').setInputFiles(pendingFile);await pendingImported;await ready();
  ok(world+': literal pending import keeps the exact paid job without granting output',digest(await snap())===pending);

  if(hp)await p.locator('[data-structured-cancel]').first().click();else await button('cancel').click();
  await step(1);s=await snap();
  ok(world+': user cancellation keeps cost and method, no result',stock(s,I.supplies)===6&&stock(s,I.samples)===0&&learned(s)===method&&!s.expansion.simulation.knowledge.player?.[I.prepared]);
  await button(I.work).click();await save();
  // Fault injection on this generated test-origin save only. Actual loading,
  // validators and native boundary settlement then process the support loss.
  await p.evaluate(key=>{const save=JSON.parse(localStorage.getItem('save data'));save.expansion.actors.player.facts[key]=false;localStorage.setItem('save data',JSON.stringify(save));},I.support);
  await p.reload();await ready();await step(6);s=await snap();
  ok(world+': lost support keeps paid cost, grants no output or receipt',stock(s,I.supplies)===4&&stock(s,I.samples)===0&&!s.expansion.simulation.knowledge.player?.[I.prepared]&&learned(s)===method);
  ok(world+': absent tool blocks a new attempt before another payment',await button(I.work).isDisabled());
  await save();await p.evaluate(key=>{const save=JSON.parse(localStorage.getItem('save data'));save.expansion.actors.player.facts[key]=true;localStorage.setItem('save data',JSON.stringify(save));},I.support);
  await p.reload();await ready();await button(I.work).click();await step(6);s=await snap();
  ok(world+': completed work supplies one actual sample',stock(s,I.supplies)===2&&stock(s,I.samples)===1&&!!s.expansion.simulation.knowledge.player?.[I.prepared]);
  // Keep the player-visible cost and next receiving use in the proof screenshots.
  for(const size of [14,21]){
   await p.locator('#workspace_navigation select').first().selectOption('customization');
   await p.locator('[aria-label="Font size"]').fill(String(size));await p.locator('[aria-label="Font size"]').dispatchEvent('change');
   await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();await show();
   await button(I.use).scrollIntoViewIfNeeded();
   ok(world+': desktop '+size+'px has no page overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.screenshot({path:join(out,world+'-ready-'+size+'.png')});
  }
  await button(I.use).click();await step(2);s=await snap();
  ok(world+': next task consumes the sample exactly once',stock(s,I.samples)===0&&stock(s,I.deliveries)===1&&stock(s,I.supplies)===2);
  await step(3);ok(world+': later ticks do not replay payment or output',stock(await snap(),I.deliveries)===1&&stock(await snap(),I.supplies)===2);
  await save();const before=digest(await snap());await p.reload();await ready();
  ok(world+': settled reload preserves costs, knowledge and useful result',digest(await snap())===before);
  const download=p.waitForEvent('download');await p.locator('#save_to_file_button').click();const file=join(out,world+'-export.txt');await(await download).saveAs(file);
  await p.evaluate(()=>localStorage.clear());await p.reload();await ready();
  const imported=p.waitForEvent('domcontentloaded',{timeout:45000});await p.locator('#saved_file_input').setInputFiles(file);await imported;await ready();
  ok(world+': literal file import preserves the exact settled result',digest(await snap())===before);
  ok(world+': no browser errors',session.errors.length===0);
  await writeFile(join(out,world+'-settled.json'),JSON.stringify(await snap(),null,2));
  results.push({world,checks:checks.filter(c=>c.startsWith(world+':')),errors:session.errors});
 }catch(e){await writeFile(join(out,world+'-errors.json'),JSON.stringify(session.errors,null,2));await session.page.screenshot({path:join(out,world+'-failure.png')}).catch(()=>{});await writeFile(join(out,world+'-failure.txt'),await session.page.locator('body').innerText().catch(()=>''));throw e;}
 finally{await session.browser.close();}
}}finally{
 server.close();
 const bundleHash=createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex');
 await writeFile(join(out,'result.json'),JSON.stringify({bundleHash,viewport:'1920x1080',route:'original synthetic situations through LOTM and HP lead hosts; fixture origin and generated-save support fault injection',results,checks},null,2));
}
