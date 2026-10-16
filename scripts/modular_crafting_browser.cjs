const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url='http://127.0.0.1:19460/?test_hooks=1',evidence='docs/gm/dispatch/modular-seams-2026-10-16/evidence';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1366,height:768}});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(()=>{Date.now=()=>1792108800000;crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+i;return a;};let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 // UIE15: setup must reach native save ownership and restore completion through a read-only probe; a gap fails as setup, never forced.
 async function ready(p){try{await p.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});}catch{throw Error('SETUP: native save ownership/restore did not complete: '+JSON.stringify(await p.evaluate(()=>window.simulationTestHooks.saveStatus())));}}
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready(page);}
 async function open(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});}
 await page.goto(url);await boot();console.log('fresh');
 const legacy=await snapshot();assert.equal(Object.hasOwn(legacy,'crafting'),false);
 // Controlled injury in this freshly generated life, solely to compare native recovery with and without a dose.
 legacy.character.hp_to_full=25;await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),legacy);await page.reload();await boot();
 await open();
 // UIE13/UIE14: paused, zero ticks advanced, Gather reflects current readiness; a held gate names itself.
 const gatherState=await page.locator('#crafting_gather').evaluate(b=>({disabled:b.disabled,title:b.title}));assert.equal(gatherState.disabled,false,'Gather stale or held: '+gatherState.title);
 await page.locator('#crafting_gather').click();console.log('gathered');
 const gathered=await snapshot();assert.ok(gathered.crafting);assert.ok(Object.keys(gathered.crafting.materials).length);
 const material=Object.keys(gathered.inventories.person.main_character).find(k=>JSON.parse(k).id==='Gathered herb');assert.ok(material);
 await page.locator('[data-craft-material]').first().check();
 assert.ok((await page.locator('#crafting_engine_home').innerText()).includes('Unidentified'));
 await page.screenshot({path:evidence+'/M3-home-materials.png'});
 await page.locator('#crafting_engine_home [data-craft-commit]').click();console.log('crafted');
 const crafted=await snapshot(),product=Object.keys(crafted.inventories.person.main_character).find(k=>JSON.parse(k).productFamily==='craft.batch@1');assert.ok(product);
 assert.equal(Object.keys(crafted.crafting.knowledge).length,0);
 // Record the no-dose control from the same genuine crafted save on a separate fresh browser context.
 const control=await browser.newContext({viewport:{width:1366,height:768}});await control.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await control.addInitScript(s=>{Date.now=()=>1792108800000;localStorage.setItem('save data',JSON.stringify(s));},crafted);
 const cp=await control.newPage();cp.on('pageerror',e=>errors.push(e.message));await cp.goto(url);await cp.waitForFunction(()=>window.simulationTestHooks);await cp.evaluate(()=>window.simulationTestHooks.pause());await startFresh(cp);await ready(cp);await cp.evaluate(()=>window.advanceTicks(1,{render:true}));const untreated=await cp.evaluate(()=>window.simulationTestHooks.snapshot());await control.close();
 await page.locator('[data-crafted-use]').first().click();console.log('used');
 const used=await snapshot();const effect=used.active_effects['Crafted herbal preparation'];assert.ok(effect?.craftExposure);assert.ok(effect.effects.stats.health_regeneration_flat.flat>0);
 assert.ok(Object.keys(used.crafting.knowledge.player).length);assert.equal(used.inventories.person.main_character[product],undefined);
 await page.evaluate(()=>window.advanceTicks(1,{render:true}));const treated=await snapshot();assert.ok(treated.character.hp_to_full<untreated.character.hp_to_full,`Treatment ${treated.character.hp_to_full} vs control ${untreated.character.hp_to_full}`);
 // Native inventory use takes the same registry command path.
 await page.locator('#crafting_gather').click();
 await page.locator('[data-craft-material]').first().check();await page.locator('#crafting_engine_home [data-craft-commit]').click();
 const beforeNative=await snapshot();const nextProduct=Object.keys(beforeNative.inventories.person.main_character).find(k=>JSON.parse(k).productFamily==='craft.batch@1');assert.ok(nextProduct);
 await page.locator('#center_mode_back').click();
 const row=page.locator('[data-character_item]').filter({has:page.locator('.item_use_button')});
 const keyRows=await row.evaluateAll(ns=>ns.map(n=>n.getAttribute('data-character_item')));
 const idx=keyRows.indexOf(nextProduct);assert.ok(idx>=0);
 // Classic layout shows the inline [use]; the shell hides row actions and routes them through item detail.
 const inline=row.nth(idx).locator('.item_use_button');
 if(await inline.isVisible())await inline.click();else{await row.nth(idx).click();await page.locator('#proto23_item_detail').getByRole('button',{name:'Use',exact:true}).click();}
 assert.equal((await snapshot()).inventories.person.main_character[nextProduct],undefined);
 await open();await page.screenshot({path:evidence+'/M3-home-observed.png'});
 await page.keyboard.press('Escape');assert.equal(await page.locator('#crafting_engine_home').isVisible(),false);await open();
 await page.locator('#save_button').click();const saved=await snapshot();
 await page.reload();await boot();const restored=await snapshot();assert.deepEqual(restored.crafting,saved.crafting);assert.deepEqual(restored.active_effects,saved.active_effects);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'modular-crafted.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
 const imported=await snapshot();assert.deepEqual(imported.crafting,saved.crafting);assert.deepEqual(imported.active_effects,saved.active_effects);assert.deepEqual(imported.inventories,saved.inventories);
 // A genuine pre-feature save remains absent, with native inventory and currency untouched.
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),legacy);await page.reload();await boot();const old=await snapshot();assert.equal(Object.hasOwn(old,'crafting'),false);assert.deepEqual(old.inventories,legacy.inventories);assert.equal(old.character.money,legacy.character.money);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(evidence+'/M3_BROWSER.json',JSON.stringify({viewport:'1366x768',errors,steps:['fresh generated life with controlled injury','gather','native material inventory','craft','unknown projection','drink','native recovery vs no-dose control','native inventory use','Back and Esc','Save','reload','Export download','literal Import','old missing-slice save'],treatedHpToFull:treated.character.hp_to_full,controlHpToFull:untreated.character.hp_to_full,craftingIntact:true,exposureIntact:true,inventoryIntact:true},null,2)+'\n');
 console.log('PASS M3 native crafting journey');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
