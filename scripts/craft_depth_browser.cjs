// Crafting depth journey (G32/G34/G36/G37): property display, derived names, tolerance, overdose, notebook, persistence.
// Fresh origin, headless. Run after npm run build with a static server on YAIRPG_PORT.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||19482}/?test_hooks=1`,evidence='docs/gm/dispatch/itch-depth-2026-10-23/evidence';
fs.mkdirSync(evidence,{recursive:true});const say=m=>console.log(m);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{for(const [w,h] of [[1536,864],[1920,1080]]){
  const context=await browser.newContext({viewport:{width:w,height:h},acceptDownloads:true});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);say('PAGEERROR '+e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const ready=()=>page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();};
  const open=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('herbal-experiments');await page.locator('#crafting_engine_home').waitFor({state:'visible'});};
  const reeds=async()=>{const inv=(await snapshot()).inventories.person.main_character;return Object.entries(inv).filter(([k])=>{try{return JSON.parse(k).materialRef?.startsWith('gen:reedherb');}catch{return false;}});};
  // The verge is random per fresh game; start fresh until it yields two restorative lots, gathering until it is depleted.
  for(let attempt=0;attempt<8;attempt++){
   await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();await boot();await open();
   while(await page.locator('#crafting_gather').isEnabled()){await page.locator('#crafting_gather').click();await page.waitForTimeout(60);}
   if((await reeds()).some(([,c])=>c.count>=2))break;
   assert.ok(attempt<7,'no fresh verge gave two restorative lots');
  }
  say(`[${w}] fresh, gathered`);
  const [[key]]=(await reeds()).filter(([,c])=>c.count>=2);const check=page.locator(`[data-craft-material="${key.replace(/"/g,'\\"')}"]`);
  const props=page.locator(`[data-craft-props="${key.replace(/"/g,'\\"')}"]`);
  const before=await props.innerText();assert.match(before,/Restorative sap: untried/);say(`[${w}] before any trial: ${before}`);
  await check.check();await page.locator('#crafting_engine_home [data-craft-commit]').click();
  await page.locator('[data-crafted-use]').first().click();
  const after=await props.innerText();assert.match(after,/Restorative sap: \d+/);assert.match(after,/Bracing oil: none/);say(`[${w}] after solo drink: ${after}`);
  const d1=await page.locator('[data-craft-deduction]').allInnerTexts();assert.ok(d1.some(t=>/restorative: possible/.test(t)));say(`[${w}] notebook: ${JSON.stringify(d1)}`);
  const firstOver=(await snapshot()).active_effects?.['Herbal overdose']?.craftExposure.overdose??0;
  // Second dose inside the same day: tolerance dulls it and the overdose condition is live.
  await check.check();await page.locator('#crafting_engine_home [data-craft-commit]').click();
  const named=await page.locator('[data-craft-derived]').allInnerTexts();assert.ok(named.length&&named.every(n=>/restorative/i.test(n)),'seen effects name the same batch');say(`[${w}] derived name on a re-made batch: ${JSON.stringify(named)}`);
  await page.locator('[data-crafted-use]').first().click();
  const s2=await snapshot();assert.ok(s2.active_effects?.['Herbal overdose']?.craftExposure.overdose>firstOver,'second dose overdoses harder');say(`[${w}] overdose condition: ${JSON.stringify(s2.active_effects['Herbal overdose'].craftExposure)}`);
  assert.equal(s2.craftDepth.log.entries.length,2);
  const tol=await page.locator('.crafting-trial-tolerance').innerText();assert.match(tol,/dulled/);say(`[${w}] ${tol}`);
  await page.screenshot({path:`${evidence}/depth-${w}.png`});
  await page.locator('#save_button').click();await page.reload();await boot();assert.deepEqual((await snapshot()).craftDepth,s2.craftDepth);
  await open();assert.match(await page.locator('.crafting-trial-tolerance').innerText(),/dulled/);say(`[${w}] depth survives save+reload (slice and panel)`);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'depth.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
  assert.deepEqual((await snapshot()).craftDepth,s2.craftDepth);assert.ok((await snapshot()).active_effects['Herbal overdose']);say(`[${w}] depth and overdose survive Export + Import`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
