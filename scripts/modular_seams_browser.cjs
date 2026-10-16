// Fresh browser storage only. Reuse this route before/after structural rounds.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT || '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh,unlockCombatRoute}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const output=process.env.PROOF_OUT || '/tmp/modular-before.json';
const url=process.env.PROOF_URL || 'http://127.0.0.1:19460/?test_hooks=1';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
 const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(()=>{Date.now=()=>1792108800000;crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+i;return a;};let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);}
 console.log('goto');await page.goto(url);console.log('boot');await boot();console.log('actions');
 await page.getByText('Talk to someone',{exact:false}).first().click();
 await page.locator('[data-dialogue="villageElder"]').click();
 await page.locator('[data-textline="hello"]').click();
 await page.locator('#center_mode_back').click();
 await page.evaluate(()=>window.advanceTicks(3,{render:true}));
 await page.locator('#save_button').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 console.log('reload');await page.reload();await boot();console.log('export');
 const restored=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
 const file=await download.path();const encoded=fs.readFileSync(file);
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'modular-synthetic.txt',mimeType:'text/plain',buffer:encoded})]);
 console.log('imported boot');await boot();const imported=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 // Save deliberately canonicalizes transient storage/UI details. Compare persisted envelopes.
 await page.locator('#save_button').click();
 const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 assert.equal(final.global_flags?.is_hero_created,saved.global_flags?.is_hero_created);
 assert.deepEqual(errors,[]);
 fs.writeFileSync(output,JSON.stringify({saved,restored,imported,final},null,2));
 console.log(JSON.stringify({output,errors,viewport:'1366x768',route:'new game, elder dialogue, 3 engine ticks, Save, reload, Export download, literal Import'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
