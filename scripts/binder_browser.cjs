// Frontier binder journey in a rebuilt page at 1920x1080 from a fresh origin. DEV SEEDED venom (scripts/field_fixtures.mjs); harvest, brew, drink, Save, reload, Export and literal Import are native.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=process.env.PROOF_URL||'http://127.0.0.1:19471/?test_hooks=1',evidence='docs/gm/dispatch/potion-journey-2026-10-22/evidence',VENOM='Mild necrotizing venom',BIND='Toxin binding';
(async()=>{const {seedBinderPoison}=await import('./field_fixtures.mjs');fs.mkdirSync(evidence,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1920,height:1080}});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(()=>{Date.now=()=>1792108800000;crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+i;return a;};let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});const missing=[];page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))errors.push(m.text());});
 const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 async function ready(){await page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});}
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();}
 async function open(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});}
 await page.goto(url);await boot();
 const seeded=await seedBinderPoison(await snapshot());
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),seeded);await page.reload();await boot();
 const start=await snapshot();assert.equal(start.active_effects[VENOM].duration,50,'DEV SEEDED venom loaded');
 await open();
 // Gather until a salt lot appears; the panel offers one verge, so rolls vary by clock and node state.
 let saltKey=null;
 for(let i=0;i<12&&!saltKey;i++){
  const g=page.locator('#crafting_gather');if(await g.isDisabled())break;await g.click({timeout:8000});
  const s=await snapshot();saltKey=Object.keys(s.inventories.person.main_character).find(k=>{try{const j=JSON.parse(k);return j.id==='Gathered herb'&&s.crafting.materials[j.materialRef]?.family==='riversalt';}catch{return false;}})??null;
  if(!saltKey)await page.evaluate(()=>window.advanceTicks(5,{render:true}));
 }
 assert.ok(saltKey,'a salt lot was gathered through the native control');console.log('gathered salt');
 const item=page.locator(`[data-craft-material]`);const n=await item.count();let picked=false;
 for(let i=0;i<n;i++){const k=await item.nth(i).getAttribute('data-craft-material');if(k===saltKey){await item.nth(i).check();picked=true;}}
 assert.ok(picked,'salt selectable in the panel');
 await page.screenshot({path:evidence+'/binder-materials-1920.png'});
 await page.locator('#crafting_engine_home [data-craft-commit]').click({timeout:8000});console.log('brewed');
 const brewed=await snapshot(),product=Object.keys(brewed.inventories.person.main_character).find(k=>JSON.parse(k).productFamily==='craft.batch@1');assert.ok(product);
 await page.locator('[data-crafted-use]').first().click({timeout:8000});console.log('drank');
 const used=await snapshot(),mark=used.active_effects[BIND];assert.ok(mark?.craftExposure?.binds>0);
 const venom=used.active_effects[VENOM];const expected=brewed.active_effects[VENOM].duration-mark.craftExposure.binds;
 if(expected>0)assert.equal(venom.duration,expected);else assert.equal(venom,undefined);
 assert.equal(used.inventories.person.main_character[product],undefined);
 await open();await page.screenshot({path:evidence+'/binder-drunk-1920.png'});
 await page.locator('#save_button').click();const saved=await snapshot();
 await page.reload();await boot();const restored=await snapshot();
 assert.deepEqual(restored.crafting,saved.crafting);assert.deepEqual(restored.active_effects,saved.active_effects);
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'binder.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
 const imported=await snapshot();assert.deepEqual(imported.crafting,saved.crafting);assert.deepEqual(imported.active_effects,saved.active_effects);assert.deepEqual(imported.inventories,saved.inventories);
 // Private bitmap fonts are untracked and absent from a worktree; any other failed request is an error.
 assert.deepEqual(missing.filter(u=>!u.includes('/resources/fonts/private/')),[]);assert.deepEqual(errors,[]);
 fs.writeFileSync(evidence+'/BINDER_BROWSER.json',JSON.stringify({viewport:'1920x1080',setup:'DEV SEEDED venom (50 min) on a fresh generated life; harvest, brew, drink, Save, reload, Export, literal Import all native',binds:mark.craftExposure.binds,venomAfter:venom?.duration??null,errors},null,2));
 console.log('PASS binder journey',mark.craftExposure.binds,venom?.duration??'venom ended');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
