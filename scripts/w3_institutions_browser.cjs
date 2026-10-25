// G62 diplomacy/schism/heresy events and G27 skill floor/near-miss/paths-not-taken journey. Fresh origin, headless.
// Run after npm run build with a static server on YAIRPG_PORT.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||19555}/?test_hooks=1`,evidence='docs/gm/dispatch/w3-institutions-2026-10-23/evidence';
fs.mkdirSync(evidence,{recursive:true});
const say=m=>console.log(m);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{for(const [w,h] of [[1536,864],[1920,1080]]){
  const context=await browser.newContext({viewport:{width:w,height:h},acceptDownloads:true});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);say('PAGEERROR '+e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const ready=()=>page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();};
  const open=async id=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);await page.locator('#story_insight_panel').waitFor({state:'visible'});};
  const reloadWith=async mutate=>{const s=await snapshot();mutate(s);await page.evaluate(x=>localStorage.setItem('save data',JSON.stringify(x)),s);await page.reload();await boot();};
  await page.goto(url);await boot();say(`[${w}] fresh`);
  // G62: fresh history carries events with causes
  await open('story-insight');await page.locator('[data-story-insight="recall"]').click();
  const events=await page.locator('[data-event-id]').allInnerTexts();assert.ok(events.length>0);for(const l of events)assert.match(l,/^Year \d+: .*(Cause|cause)/);say(`[${w}] events: ${events.length} e.g. ${events[0]}`);
  for(const l of events)assert.doesNotMatch(l,/war:\d/);const warCause=events.find(l=>/war of Year/.test(l));say(`[${w}] war-cause line: ${warCause??'none in this seed'}`);
  assert.equal(await page.locator('[data-story-insight="recall"]').isHidden(),true);
  await page.screenshot({path:`${evidence}/events-${w}.png`});
  const s1=await snapshot(),hist=s1.expansion.loreHistory.worldHistories['base.frontier'];assert.ok(hist.events.length);
  // Old-shape history (no events) upgrades through the same button and keeps its wars
  await reloadWith(s=>{delete s.expansion.loreHistory.worldHistories['base.frontier'].events;});
  await open('story-insight');assert.equal(await page.locator('[data-event-id]').count(),0);
  assert.match(await page.locator('[data-story-insight="recall"]').innerText(),/further events/);
  await page.locator('[data-story-insight="recall"]').click();
  assert.deepEqual((await snapshot()).expansion.loreHistory.worldHistories['base.frontier'],hist);say(`[${w}] old-shape history upgraded to the same events and wars`);
  // G27: seed idle skills, rust off by default, then switch the dial on and let real ticks run
  await reloadWith(s=>{s.levels.person.main_character.skill_xp.Running=100000;s.levels.person.main_character.skill_xp.Climbing=133;
   s.skillRecords={schema:1,rustOn:{},nearMisses:[],tracked:{Running:{peak:17,level:17,seen:100000,idle:30000,rust:0,nm:null},Climbing:{peak:3,level:1,seen:133,idle:2000,rust:0,nm:null}}};});
  await open('story-insight');
  await page.evaluate(()=>{window.simulationTestHooks.resume();});await page.waitForTimeout(2500);await page.evaluate(()=>window.simulationTestHooks.pause());
  let sr=(await snapshot()).skillRecords;assert.equal(sr.tracked.Running.rust,0);assert.ok(sr.nearMisses.length>=1,'near miss recorded without the rust dial');say(`[${w}] rust off by default; near miss: ${JSON.stringify(sr.nearMisses[0])}`);
  const box=page.locator('[data-skill-rust]');await box.check();
  await page.evaluate(()=>{window.simulationTestHooks.resume();});await page.waitForTimeout(2500);await page.evaluate(()=>window.simulationTestHooks.pause());
  sr=(await snapshot()).skillRecords;assert.equal(sr.rustOn['base.frontier'],true);assert.ok(sr.tracked.Running.rust>0,'rust applied after ticks');
  const text=await page.locator('#story_insight_panel').innerText();assert.match(text,/Running has gone rusty/);assert.match(text,/Near miss: Climbing/);say(`[${w}] path-not-taken lines live: ${(text.match(/Path not taken/g)||[]).length}`);
  say(`[${w}] rust ${sr.tracked.Running.rust} (ceiling 6 of peak 17)`);
  await page.screenshot({path:`${evidence}/skills-${w}.png`});
  // Save, reload, export/import keep the slice
  await page.locator('#save_button').click();const saved=(await snapshot()).skillRecords;
  await page.reload();await boot();assert.deepEqual((await snapshot()).skillRecords.tracked.Running.rust,saved.tracked.Running.rust);assert.deepEqual((await snapshot()).skillRecords.nearMisses,saved.nearMisses);say(`[${w}] slice survives save+reload`);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'w3.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
  const after=(await snapshot()).skillRecords;assert.equal(after.tracked.Running.rust,saved.tracked.Running.rust);assert.equal(after.rustOn['base.frontier'],true);
  await open('story-insight');assert.match(await page.locator('#story_insight_panel').innerText(),/Running has gone rusty/);say(`[${w}] slice survives Export + Import`);
  // Dial off lifts the penalty
  await page.locator('[data-skill-rust]').uncheck();assert.equal((await snapshot()).skillRecords.tracked.Running.rust,0);say(`[${w}] dial off lifts rust`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
