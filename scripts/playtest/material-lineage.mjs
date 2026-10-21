// Native observations -> exact processing -> storage split/coalesce -> partial
// recipe processing. Only disposable fixture access/skill/encounter stock.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {createHarvest,drawSpecimen,addCarcass} from '../../src/harvest.js';
import {calendarMinutes} from '../../src/world_rhythm.js';
const out=resolve(process.argv[2]||'/tmp/oops-material-lineage-browser');await mkdir(out,{recursive:true});
const server=await serve(resolve('.')),missing=[],s=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:15000,hooks:{beforeOpen:async c=>c.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);})}});
let p;const checks=[],snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const bag=save=>save.inventories.person.main_character;
async function play(){await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.locator('#loading_screen_play_button').click();await p.waitForFunction(()=>typeof simulationTestHooks==='object',null,{timeout:60000});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(300);}
async function placeActions(){const back=p.locator('#center_mode_back');if(await back.isVisible())await back.click();const tab=p.locator('button[data-place-tab="actions"]');if(await tab.isVisible())await tab.click();}
async function processing(){await p.locator('#workspace_navigation select').first().selectOption('carcass-processing');await p.locator('#harvest_panel').evaluate(el=>el.open=true);}
async function roundtrip(label,read){const before=read(await s.save());await p.reload();await play();assert.deepEqual(read(await s.save()),before);const literal=await p.evaluate(()=>save_to_file());await Promise.all([p.waitForEvent('load'),p.evaluate(x=>load_progress(x),literal)]);await play();assert.deepEqual(read(await s.save()),before);checks.push(label+' Save/reload/Export/literal Import');}
async function exactClick(selector,attribute,key){const rows=p.locator(selector),i=await rows.evaluateAll((els,{attribute,key})=>els.findIndex(e=>e.getAttribute(attribute)===key),{attribute,key});assert.ok(i>=0,'exact row retained');await rows.nth(i).click();}
try{
 await s.start();const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8')),clock=calendarMinutes(seed['current time']);delete seed.availabilities?.recipe?.undefined;if(seed.availabilities?.recipe)delete seed.availabilities.recipe['recipe/undefined'];
 seed.global_flags.is_crafting_unlocked=true;seed.harvest=createHarvest();seed.availabilities.skill.Butchering=1;seed.levels.person.main_character.skill_xp.Butchering=0;
 seed.availabilities.location.Shack=1;seed.locations.Shack={...seed.locations.Shack,housing_unlocked:true};
 for(let i=0;i<7;i++)addCarcass(seed.harvest,drawSpecimen({species:'Wolf rat',key:`lineage-native-${i}`,clock:clock-(i===0?50:i*2)},()=>.5),{clock});
 await s.open(seed);p=s.page;await processing();const picker='select[data-harvest-specimen="Wolf rat"]',observe='button[data-harvest="observe"][data-harvest-specimen="Wolf rat"]';
 await p.locator(picker).selectOption('lineage-native-0');await p.locator(observe).click();
 const low=(await snap()).harvest.lots['Wolf rat'][0].observations[0];assert.equal(low.ageEstimate.max-low.ageEstimate.min,110);
 const skilled=await s.save();skilled.levels.person.main_character.skill_xp.Butchering=1e6;await s.open(skilled);p=s.page;await processing();await p.locator(picker).selectOption('lineage-native-0');await p.locator(observe).click();
 let state=await snap(),history=state.harvest.lots['Wolf rat'][0].observations;assert.deepEqual(history[0],low);assert.ok(history[1].ageEstimate.max-history[1].ageEstimate.min<110);
 checks.push('Explicit native condition refresh appends a narrower skill-supported estimate; the earlier source reading stays unchanged');
 await p.locator('[data-harvest-choice="whole"]').first().click();await s.step(1);
 await roundtrip('Pending exact specimen with both observations',x=>({job:x.harvest.job,source:x.harvest.job.specimen}));
 await s.step((await snap()).harvest.job.remaining);await processing();
 let saved=await s.save();const firstFang=Object.keys(bag(saved)).find(k=>JSON.parse(k).id==='Rat fang'&&JSON.parse(k).lineage);assert.ok(firstFang);assert.equal(JSON.parse(firstFang).lineage.history[0].inputs[0].facts.evidence.specimen.observations.length,2);
 for(let i=1;i<7;i++){await p.locator(picker).selectOption(`lineage-native-${i}`);await p.locator('[data-harvest-choice="whole"]').first().click();await s.step((await snap()).harvest.job.remaining);await p.waitForTimeout(60);}
 saved=await s.save();const rawPelts=Object.keys(bag(saved)).filter(k=>JSON.parse(k).id==='Rat pelt'&&JSON.parse(k).lineage);assert.equal(rawPelts.length,7);
 await p.evaluate(()=>change_location({location_id:'Shack',skip_travel_time:true}));await placeActions();await p.locator('#open_storage_div').click();
 const amountBefore=(await snap()).inventories.person.main_character[firstFang].count;
 await exactClick('#inventory_content_div > [data-character_item]','data-character_item',firstFang);
 let split=await snap();assert.equal(bag(split)[firstFang].count,amountBefore-1);assert.equal(split.inventories.storage.player[firstFang].count,1);
 await roundtrip('Split cohort across pack and native chest',x=>({pack:bag(x),chest:x.inventories.storage.player}));
 await placeActions();await p.locator('#open_storage_div').click();await exactClick('#storage_inventory_div > [data-storage_item]','data-storage_item',firstFang);
 assert.equal(bag(await snap())[firstFang].count,amountBefore);checks.push('Native partial chest deposit/withdraw splits and coalesces one exact cohort; distinct source-age keys stay distinct');
 await p.locator('#center_mode_back').click();await p.evaluate(()=>change_location({location_id:'Village',skip_travel_time:true}));
 await placeActions();await p.locator('.choice_craft').click();await p.locator('#crafting_mainpage_buttons [data-crafting_category="butchering"]').click();
 await p.locator('[data-crafting_category="butchering"] [data-recipe_id="Piece of wolf rat leather"] .recipe_item_name').click();
 await p.locator('#crafting_detail [data-craft-commit]').click();
 saved=await s.save();const products=Object.keys(bag(saved)).filter(k=>JSON.parse(k).id==='Piece of wolf rat leather'&&JSON.parse(k).lineage);assert.equal(products.length,1);
 const product=JSON.parse(products[0]),parents=product.lineage.history[0].inputs;
 assert.equal(parents.reduce((n,r)=>n+r.count,0),6);assert.equal(Object.keys(bag(saved)).filter(k=>JSON.parse(k).id==='Rat pelt'&&JSON.parse(k).lineage).length,1);
 for(const r of parents){assert.ok(rawPelts.includes(r.item_key));assert.equal(bag(saved)[r.item_key],undefined);assert.equal(JSON.parse(r.item_key).lineage.facts.born,r.facts.born);}
 checks.push('Actual native Butchering consumes six exact lineage-bearing inputs, leaves the seventh unchanged and creates one processed product retaining every consumed cohort');
 await roundtrip('Processed product and unspent source stock',x=>({pack:bag(x),chest:x.inventories.storage.player,harvest:x.harvest}));
 await p.screenshot({path:join(out,'lineage-1920.png')});
 for(const size of [14,21]){const view=await s.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;await processing();for(const [width,height] of [[1920,1080],[1536,864]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`lineage-${size}-${width}.png`)});}}
 assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);assert.deepEqual(missing.filter(x=>x!=='/private_packs/manifest.json'),[]);
 await writeFile(join(out,'receipt.json'),JSON.stringify({checks,missing,errors:s.errors,setup:'Native midgame fixture. Encounter stock, skill upgrade and Shack access are seeded. All observations, processing, recipe and chest operations are native controls. No personal saves; natural acquisition/pacing and human acceptance remain separate.'},null,2));console.log(JSON.stringify({checks,out}));
}catch(e){await writeFile(join(out,'page-state.json'),JSON.stringify(await p?.evaluate(()=>({url:location.href,ready:document.readyState,hooks:typeof window.simulationTestHooks,tail:document.body.innerText.slice(-1500)})).catch(()=>null),null,2));await writeFile(join(out,'failure.txt'),e.stack||String(e));await writeFile(join(out,'errors.json'),JSON.stringify({errors:s.errors,missing},null,2));await p?.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw e;}finally{await s.close();await server.close();}
