// Pledges journey (G47 vows, G54/G57 tempering trial, G67/G70 rune bench). Fresh origin, headless.
// Run after npm run build with a static server on YAIRPG_PORT.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||19483}/?test_hooks=1`,evidence='docs/gm/dispatch/itch-depth-2026-10-23/evidence';
fs.mkdirSync(evidence,{recursive:true});const say=m=>console.log(m);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{for(const [w,h] of [[1536,864],[1920,1080]]){
  const context=await browser.newContext({viewport:{width:w,height:h},acceptDownloads:true});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);say('PAGEERROR '+e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const ready=()=>page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();};
  const open=async id=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);};
  const bread=async()=>(await snapshot()).inventories.person.main_character['{"id":"Stale bread"}']?.count??0;
  const wood=async()=>(await snapshot()).inventories.person.main_character['{"id":"Rough wood log"}']?.count??0;
  const str=async()=>Number((await page.locator('body').innerText()).match(/STR\s+([\d.]+)/)[1]);
  await page.goto(url);await boot();
  // Seed: trained Combat (the tempering gate reads it) and carving wood. Fresh saves hold neither.
  const fresh=await snapshot();assert.equal(Object.hasOwn(fresh,'pledges'),false);say(`[${w}] fresh save has no pledges slice`);
  const seeded=structuredClone(fresh);seeded.levels.person.main_character.skill_xp.Combat=5000;seeded.inventories.person.main_character['{"id":"Rough wood log"}']={count:6};
  await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),seeded);await page.reload();await boot();
  // Vows
  await open('pledges');await page.locator('#pledges_panel').waitFor({state:'visible'});
  const str0=await str();
  await page.locator('[data-take-vow="long-watch"]').click();
  assert.deepEqual(Object.keys((await snapshot()).pledges.vows.kept),['long-watch']);
  await page.waitForTimeout(150);const str1=await str();assert.ok(str1>str0,`vow raised STR ${str0} -> ${str1}`);say(`[${w}] vow kept, STR ${str0} -> ${str1}`);
  // Tempering with rations laid in
  const risk0=Number(await page.locator('[data-trial-risk]').getAttribute('data-trial-risk'));
  const breadBefore=await bread();
  await page.screenshot({path:`${evidence}/pledges-${w}.png`});
  const pay=page.locator('[data-temper]').last();const units=Number(await pay.getAttribute('data-temper'));assert.ok(units>0);
  await pay.click();const s1=await snapshot();assert.equal(s1.pledges.trial.attempts,1);assert.equal(await bread(),breadBefore-units);say(`[${w}] tempering: risk ${risk0/10}%, laid in ${units}, ${s1.pledges.trial.last.passed?'held':'failed'}, bread ${breadBefore} -> ${await bread()}`);
  if(s1.pledges.trial.last.passed)assert.equal(s1.pledges.trial.stage,1);
  else{assert.ok(s1.pledges.trial.pressure>0);await page.locator('[data-heart-demon]').waitFor();const left=await bread();if(left>0){await page.locator('[data-calm]').click();assert.equal((await snapshot()).pledges.trial.pressure,s1.pledges.trial.pressure-1);say(`[${w}] heart demon eased by one`);}}
  await page.locator('[data-break-vow="long-watch"]').click();
  const s2=await snapshot();assert.equal(Object.keys(s2.pledges.vows.broken).length,1);await page.waitForTimeout(150);
  const risk1=Number(await page.locator('[data-trial-risk]').getAttribute('data-trial-risk'));say(`[${w}] broken vow leaves its scar: risk now ${risk1/10}%`);
  // Second attempt with no rations: the broken vow and bare risk make a failure likely; check whichever way it falls.
  if(s1.pledges.trial.last.passed){
   const t2=await page.locator('[data-temper="0"]');if(await t2.count()&&await t2.isEnabled()){await t2.click();const s4=await snapshot();assert.equal(s4.pledges.trial.attempts,2);
    if(!s4.pledges.trial.last.passed){assert.equal(s4.pledges.trial.pressure,s1.pledges.trial.pressure+4);await page.waitForTimeout(150);const dim=await str();assert.ok(dim<str1,`heart demon dulled STR to ${dim}`);
     const b=await bread();if(b>0){await page.locator('[data-calm]').click();assert.equal((await snapshot()).pledges.trial.pressure,s4.pledges.trial.pressure-1);}
     say(`[${w}] tribulation failed: pressure ${s4.pledges.trial.pressure}, STR ${dim}, calm eased one`);}
    else say(`[${w}] second tempering held (risk ${s4.pledges.trial.last.risk/10}%)`);}
  }
  // Rune bench
  await open('rune-bench');await page.locator('#rune_bench_panel').waitFor({state:'visible'});
  const w0=await wood();
  await page.locator('[data-rune="ember"]').click();await page.locator('[data-rune="gale"]').click();
  assert.match(await page.locator('[data-rune-preview]').innerText(),/untried/);
  await page.locator('[data-carve]').click();
  assert.equal(await wood(),w0-2);assert.match(await page.locator('[data-rune-pair="ember>gale"]').innerText(),/more stamina/);assert.ok(await page.locator('[data-worn]').isVisible());
  say(`[${w}] carved ember+gale: ${await page.locator('[data-worn]').innerText()}`);
  await page.locator('[data-rune="root"]').click();await page.locator('[data-rune="ember"]').click();
  await page.locator('[data-rune="gale"]').click();
  assert.match(await page.locator('[data-rune-preview]').innerText(),/ember→gale: more stamina/);say(`[${w}] preview names known pairs and says untried for the rest`);
  await page.screenshot({path:`${evidence}/rune-bench-${w}.png`});
  const s3=await snapshot();
  // Save, reload, export/import
  await page.locator('#save_button').click();await page.reload();await boot();
  assert.deepEqual((await snapshot()).pledges,s3.pledges);await open('rune-bench');assert.ok(await page.locator('[data-worn]').isVisible());say(`[${w}] pledges survive save+reload (slice and worn talisman)`);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'pledges.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
  assert.deepEqual((await snapshot()).pledges,s3.pledges);say(`[${w}] pledges survive Export + Import`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
