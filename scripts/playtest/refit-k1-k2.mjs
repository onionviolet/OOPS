// Re-fit K1/K2 proof (2026-10-22): mixing-counter completion receipt and one stock
// quoted for two products, at the desktop viewports. Fresh origins, generated test
// stock only; no personal saves. Usage: node scripts/playtest/refit-k1-k2.mjs . <out> (after npm run build)
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/refit-k1-k2-proof');await mkdir(out,{recursive:true});
const server=await serve(root),receipt={root,setup:'Fresh origin per case; declared test stock of 3 River bellleaf and 3 Spring water; no personal saves or natural-acquisition claim.',cases:[],checks:[]};
const key=id=>JSON.stringify({id});
const s=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,9,22,15)});let p,phase='start';
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));seed.customization=defaultCustomizationState();delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];
seed.inventories.person.main_character[key('River bellleaf')]={count:3};seed.inventories.person.main_character[key('Spring water')]={count:3};
async function replay(){await p.waitForFunction(()=>typeof window.simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(450);}
async function mixer(){await p.locator('#village_mixing_open').click();await p.locator('[data-mixture-destination]').first().waitFor({state:'visible'});await p.waitForTimeout(600);}
const lastResult=()=>p.locator('#mixture_feedback_lastResult').innerText();
try{
 await s.start();
 for(const [width,height,size]of [[1920,1080,14],[1920,1080,21],[1800,1040,14],[1800,1040,21],[1536,864,14],[1536,864,21]]){
  phase=`compare ${width}/${size}`;const f=structuredClone(seed);f.customization.profiles.Default.settings.typography.size=size;await s.open(f);p=s.page;await p.setViewportSize({width,height});await p.waitForTimeout(300);
  await mixer();const cards=p.locator('[data-mixture-destination]');assert.equal(await cards.count(),2);
  const texts=await cards.allInnerTexts();assert.match(texts[0],/Steep → .*3 free → 2 left.*3 vials/s);assert.match(texts[1],/Boil → .*3 free → 2 left.*3 vials/s);
  assert.match(await p.locator('#mixture_destinations_stock').innerText(),/River bellleaf 3 carried · 0 held in vessel · 0 blocked by other holds · 3 free/);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const boxes=await cards.evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
  assert.ok(Math.abs(boxes[0].y-boxes[1].y)<2&&boxes[0].x+boxes[0].width<=boxes[1].x+1,'Two products sit side by side.');
  await p.locator('#mixture_feedback').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`compare-${width}-${size}.png`)});
  // Commit steep, then fire the retained old boil card: its token is stale and must refuse without spending.
  const staleBoil=await p.locator('[data-mixture-destination="boil"] button').elementHandle();
  await p.locator('[data-mixture-destination="steep"] button').click();await p.waitForTimeout(300);
  let saved=await s.save();const inv=saved.inventories.person.main_character;assert.equal(inv[key('River bellleaf')].count,2);assert.equal(inv[key('Spring water')].count,2);
  await staleBoil.evaluate(n=>n.click());await p.waitForTimeout(300);
  assert.match(await p.locator('#mixture_feedback_blocker').innerText(),/Quote changed\. Review the current quote before mixing\./);
  saved=await s.save();assert.equal(saved.inventories.person.main_character[key('River bellleaf')].count,2,'Stale quote spent nothing.');
  assert.match(await lastResult(),/Latest finished mix: [^,]+, 0 game min ago\. Consumed: 1 River bellleaf, 1 Spring water\. Made: 1 vial\. Single vial/);
  assert.match((await cards.allInnerTexts())[1],/2 free → 1 left.*2 vials/s,'Remaining quote follows the new stock.');
  await p.locator('#mixture_feedback').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,`receipt-${width}-${size}.png`)});
  receipt.cases.push({width,height,size,boxes});
 }
 phase='persistence';await p.setViewportSize({width:1920,height:1080});
 const before=await s.save();assert.equal(before.mixtures.lastCompletion.kind,'mix');
 await p.reload();await replay();await mixer();assert.match(await lastResult(),/Consumed: 1 River bellleaf, 1 Spring water/);
 const literal=await p.evaluate(()=>save_to_file());await writeFile(join(out,'native-export.txt'),literal);
 await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(join(out,'native-export.txt'))]);await replay();await mixer();
 const imported=await s.save();assert.deepEqual(imported.mixtures.lastCompletion,before.mixtures.lastCompletion);assert.match(await lastResult(),/Consumed: 1 River bellleaf, 1 Spring water/);
 receipt.checks.push('Save, reload, export and import keep the completion receipt; the stale boil quote refused without spending at all six desktop cases.');
 phase='batch receipt beside running queue';
 const products=p.locator('#mixture_products');await products.getByRole('button',{name:'Experiment: drink one dose'}).click();await p.waitForTimeout(200);
 await products.getByRole('button',{name:'Save observed method'}).click();await p.waitForTimeout(200);
 await products.getByRole('spinbutton',{name:'Repeat batch count'}).fill('2');await products.getByRole('button',{name:'Queue learned method'}).click();await p.waitForTimeout(200);
 await s.step(3);await p.waitForTimeout(1200);
 assert.match(await lastResult(),/Consumed: 1 River bellleaf, 1 Spring water\. Made: 1 vial\. Next queued batch reserved from current stock\./);
 assert.match(await p.locator('#mixture_feedback_work').innerText(),/1 batches incl\. current/);
 assert.match(await p.locator('#mixture_destinations_stock').innerText(),/River bellleaf 0 carried · 1 held in vessel/);
 const batch=await s.save();assert.deepEqual([batch.mixtures.lastCompletion.kind,batch.mixtures.lastCompletion.outcome],['batch','next reserved']);
 await p.locator('#mixture_feedback').scrollIntoViewIfNeeded();await p.screenshot({path:join(out,'batch-receipt-1920-21.png')});
 receipt.checks.push('A timed batch completion shows its own consumed inputs beside the running queue (next batch held in the vessel) and persists as kind batch / next reserved.');
 assert.deepEqual(s.errors,[]);receipt.errors=s.errors;
 await writeFile(join(out,'result.json'),JSON.stringify(receipt,null,1));console.log(JSON.stringify({ok:true,out,cases:receipt.cases.length}));
}catch(error){receipt.failed={phase,error:error.stack,errors:s.errors};await writeFile(join(out,'result.json'),JSON.stringify(receipt,null,1));console.error(phase,error);if(p)await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});process.exitCode=1;}
finally{await s.close();server.close();}
