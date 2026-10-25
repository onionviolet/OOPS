// W3 life events journey (G26 orphan/grief/came-of-age, G25 cause lessons, G03 bonds, G06 broadcast). Fresh origin, headless.
// Run after npm run build with a static server on YAIRPG_PORT. Evidence goes to YAIRPG_EVIDENCE.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=`http://127.0.0.1:${process.env.YAIRPG_PORT||18741}/?test_hooks=1`,evidence=process.env.YAIRPG_EVIDENCE||'docs/gm/dispatch/w3-events-2026-10-23/evidence';
fs.mkdirSync(evidence,{recursive:true});const say=m=>console.log(m);
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{for(const [w,h] of [[1536,864],[1920,1080]]){
  const context=await browser.newContext({viewport:{width:w,height:h},acceptDownloads:true});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);say('PAGEERROR '+e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const ready=()=>page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:15000});
  const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);await ready();};
  const open=async id=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);};
  const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
  await page.goto(url);await boot();
  const fresh=await snapshot();assert.deepEqual(fresh.life_events?.events??[],[]);say(`[${w}] fresh save starts with no life events (baseline only)`);
  // Meet the neighbors on the harder-village dial (forewarned, chosen).
  await open('village-neighbors');await page.evaluate(()=>{document.getElementById('village_lives_panel').open=true;});await page.locator('#village_hardship').check();await page.locator('#meet_village_neighbors').click();
  let save=await stored();assert.equal(save.npc_lives.hardship,'fever_winter');
  const maia=save.npc_lives.people.find(p=>p.id==='maia');assert.equal(maia.cause,'illness');
  say(`[${w}] neighbors met on fever_winter dial; Maia dies year ${maia.deathYear}, cause ${maia.cause}`);
  // Cross the deaths: move the calendar to the winter, with coins in hand.
  save.npc_lives.startYear=save.npc_lives.startYear;save['current time'].year=maia.deathYear;save.character.money=200;
  await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),save);await page.reload();await boot();
  await page.waitForFunction(()=>(window.simulationTestHooks.snapshot().life_events?.events??[]).length>0,null,{timeout:15000}).catch(()=>{});
  let snap=await snapshot();
  assert.ok(snap.life_events,'slice appears once the winter passes');
  const kinds=snap.life_events.events.map(e=>e.id).sort();say(`[${w}] events: ${kinds.join(', ')}`);
  assert.deepEqual(kinds.filter(k=>k.startsWith('orphan')),['orphan:lio','orphan:neri']);
  assert.equal(snap.life_events.lessons.illness.n,2);assert.equal(snap.defeat.deathCauses.illness,2);say(`[${w}] cause tally in defeat slice: ${JSON.stringify(snap.defeat.deathCauses)}`);
  // The panel and the choice. Free choice first, then the costed one.
  await open('life-events');await page.locator('#life_events_panel').waitFor({state:'visible'});
  assert.match(await page.locator('#life_events_panel [data-forecast]').innerText(),/fever has taken 2/i);
  await page.screenshot({path:`${evidence}/life-events-${w}.png`});
  const coins0=(await snapshot()).character?.money??null;
  await page.locator('[data-event-choice="orphan:lio:village"]').click();
  await page.locator('[data-event-choice="orphan:neri:take_in"]').click();
  snap=await snapshot();assert.equal(snap.life_events.wards.neri.by,'player');assert.equal(snap.life_events.wards.lio.by,'village');
  assert.ok(snap.life_events.memories.lio?.some(m=>m.id==='ward:neri')||snap.life_events.memories.neri?.some(m=>m.id==='death:maia'),'broadcast landed in household memories');
  say(`[${w}] wards ${JSON.stringify(snap.life_events.wards)}; memories for ${Object.keys(snap.life_events.memories).join(',')}`);
  if(coins0!==null)assert.equal((await stored()).character.money,coins0-30);
  // Years on: Lio and Neri come of age, mourning has faded.
  save=await stored();save['current time'].year=maia.deathYear+16;await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),save);await page.reload();await boot();
  await page.waitForFunction(()=>(window.simulationTestHooks.snapshot().life_events?.events??[]).some(e=>e.id==='age:lio'),null,{timeout:15000});
  snap=await snapshot();assert.deepEqual(snap.life_events.mourning,{});assert.ok(snap.life_events.events.some(e=>e.id==='age:neri'));say(`[${w}] came of age: lio and neri; mourning faded`);
  await open('life-events');await page.screenshot({path:`${evidence}/life-events-grown-${w}.png`});
  await page.locator('[data-event-choice="age:lio:mark"]').click();
  const s3=await snapshot();
  await page.locator('#save_button').click();await page.reload();await boot();
  assert.deepEqual((await snapshot()).life_events,s3.life_events);say(`[${w}] life_events survives save+reload`);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const encoded=fs.readFileSync(await download.path());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'events.txt',mimeType:'text/plain',buffer:encoded})]);await boot();
  const s4=await snapshot();assert.deepEqual(s4.life_events,s3.life_events);assert.deepEqual(s4.defeat.deathCauses,s3.defeat.deathCauses);say(`[${w}] life_events survives Export + Import`);
  await context.close();
 }
 assert.deepEqual(errors,[]);say('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
