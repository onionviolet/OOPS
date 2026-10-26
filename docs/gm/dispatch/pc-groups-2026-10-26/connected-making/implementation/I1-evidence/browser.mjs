import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),repo=process.cwd();
const {launchChrome}=require(path.join(repo,'scripts/ui_helpers.cjs'));
const E=path.dirname(new URL(import.meta.url).pathname),root=process.env.I1_INPUT;
const load=p=>import(pathToFileURL(path.join(root,'src',p)));
const {createCraftState,freezeMaterials}=await load('craft_state.js');
const {generateMaterial}=await load('craft_materials.js');
const {catalogue,materialKey}=await load('crafting_frontier_runtime.js');
const herb=generateMaterial(catalogue,'reedherb',{root:4,scope:'g1',index:0}).value,salt=generateMaterial(catalogue,'riversalt',{root:4,scope:'g1',index:0}).value;
const hk=materialKey(herb,50),sk=materialKey(salt,50),owner=freezeMaterials(createCraftState({world:'base.frontier'}),catalogue,[herb,salt]);
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();page.setDefaultTimeout(15000);
const receipt={route:'DEV SEEDED root-4 g1 gathered lots and 2 Iron ingots; native shelf acquisition, learning, crafting and consumption thereafter',checks:[],errors:[]};
page.on('pageerror',e=>receipt.errors.push(e.stack));
await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
const snap=()=>page.evaluate(()=>simulationTestHooks.snapshot());
const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button:not(.none_display)').click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'&&simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>simulationTestHooks.pause());};
const panel=()=>page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');
const scope=()=>page.locator('#crafting_engine_home');
const commit=()=>scope().locator('[data-craft-commit]');
const check=async(k,on)=>{const n=await scope().locator('[data-craft-material]').evaluateAll((nodes,k)=>nodes.findIndex(n=>n.dataset.craftMaterial===k),k);assert.ok(n>=0);await scope().locator('[data-craft-material]').nth(n).setChecked(on);};
const qty=async(k,n)=>{const rows=scope().locator('.crafting-trial-material');const i=await rows.evaluateAll((rows,k)=>rows.findIndex(n=>n.querySelector('[data-craft-material]')?.dataset.craftMaterial===k),k);const input=rows.nth(i).locator('input[type=number]');await input.fill(String(n));await input.dispatchEvent('change');};
const forecast=()=>scope().locator('[data-craft-forecast]');
const digest=s=>JSON.stringify({crafting:s.crafting,ledger:s.craftLedger,depth:s.craftDepth,inventory:s.inventories.person.main_character});
async function roundtrip(name){await page.evaluate(()=>saveProgress());const before=await snap(),literal=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(E,name+'.save.txt'),literal);await page.reload();await boot();assert.equal(digest(await snap()),digest(before),'reload '+name);await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();assert.equal(digest(await snap()),digest(before),'literal import '+name);await panel();receipt.checks.push(name+' native Save/reload/Export/literal Import');}
try{
 await page.goto(process.env.I1_URL+'/?test_hooks=1');await boot();const seed=await snap();seed.crafting=owner;seed.inventories.person.main_character[hk]={count:12};seed.inventories.person.main_character[sk]={count:12};seed.inventories.person.main_character[JSON.stringify({id:'Iron ingot'})]={count:2};await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),seed);await page.reload();await boot();await panel();
 await scope().locator('[data-craft-treatment="apparatus"]').click();assert.equal((await snap()).craftDepth.body.apparatus,1);receipt.checks.push('ordinary funded apparatus treatment consumes its actual 2 ingots');
 await scope().locator('[data-shelf-take="village.method-book"]').click();await scope().locator('#crafting_method').selectOption('village.salt-steep');await check(hk,true);assert.equal(await commit().isDisabled(),true);assert.match(await scope().innerText(),/selected materials do not fit/i);await page.screenshot({path:path.join(E,'method-refusal-1920.png')});receipt.checks.push('native named-method wrong-lot preview refuses before debit');
 await check(sk,true);assert.equal(await commit().isDisabled(),false);await scope().locator('#crafting_layered').check();assert.equal(await commit().isDisabled(),true);await scope().locator('#crafting_layered').uncheck();
 await scope().locator('[data-ref-return]').filter({hasText:'Put back'}).first().click();assert.equal(await scope().locator('#crafting_method option[value="village.salt-steep"]').count(),0);receipt.checks.push('returning book removes named access while free experiment stays available');
 await scope().locator('[data-shelf-take="village.method-disk"]').click();await scope().locator('[data-ref-learn]').click();await scope().locator('#crafting_method').selectOption('village.salt-steep');assert.equal(await commit().isDisabled(),false);receipt.checks.push('consumed slate retains learned method');
 await qty(hk,3);await qty(sk,1);await page.evaluate(()=>saveProgress());const before=await snap(),durable=await page.evaluate(()=>localStorage.getItem('save data'));
 await page.evaluate(()=>{const original=Storage.prototype.setItem;window.restoreI1Storage=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(k,v){if(k==='save data')throw new DOMException('I1 synthetic save rejection','QuotaExceededError');return original.call(this,k,v);};});await commit().click();assert.equal(digest(await snap()),digest(before));assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),durable);await page.evaluate(()=>restoreI1Storage());await page.reload();await boot();await panel();receipt.checks.push('failed native saving restores ledger, stock and crafting owners');
 await check(hk,true);await check(sk,true);await qty(hk,3);await qty(sk,1);await commit().click();assert.equal(await forecast().getAttribute('data-verdict'),'known-fail');await page.screenshot({path:path.join(E,'exact-failure-1920.png')});await roundtrip('failed-setup');
 await check(hk,true);await check(sk,true);await qty(hk,1);await qty(sk,1);assert.equal(await forecast().getAttribute('data-verdict'),'near');assert.match(await forecast().innerText(),/another setup/);await page.screenshot({path:path.join(E,'changed-ratio-1920.png')});await commit().click();assert.ok(Object.keys((await snap()).crafting.products).length);await scope().locator('[data-crafted-use]').first().click();assert.ok(Object.keys((await snap()).crafting.knowledge.player).length);receipt.checks.push('thin 3:1 exact recall; usable 1:1 near forecast, real preparation and oral consumer');await roundtrip('used-preparation');
 receipt.matrix=[];for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();await check(hk,true);await check(sk,true);await qty(hk,1);await forecast().scrollIntoViewIfNeeded();const bounds=await page.evaluate(()=>({pageOverflow:document.documentElement.scrollWidth>innerWidth+1,height:document.documentElement.scrollHeight,viewport:innerHeight}));assert.equal(bounds.pageOverflow,false);await page.screenshot({path:path.join(E,`forecast-${width}-${size}.png`)});receipt.matrix.push({width,height,size,...bounds});}
 assert.deepEqual(receipt.errors,[]);receipt.state='agent-verified, not human-reviewed';console.log('PASS',receipt.checks);
}catch(e){receipt.failure=e.stack;await page.screenshot({path:path.join(E,'failure.png')});await fs.writeFile(path.join(E,'failure-ui.txt'),await page.locator('body').innerText());throw e;}
finally{await fs.writeFile(path.join(E,'browser-result.json'),JSON.stringify(receipt,null,2));await context.close();await browser.close();}
