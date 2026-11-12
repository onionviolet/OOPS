// Fresh browser storage only. Reuse this route before/after structural rounds.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT || '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh,unlockCombatRoute}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const output=process.env.PROOF_OUT || '/tmp/modular-before.json';
const url=process.env.PROOF_URL || 'http://127.0.0.1:19460/?test_hooks=1';
const fleeceProof=process.env.PROOF_FLEECE==='1';
const lifecycleProof=process.env.PROOF_LIFECYCLE==='1'||fleeceProof;
const shellProof=process.env.PROOF_SHELL==='1';
const viewport=lifecycleProof||shellProof ? {width:1920,height:1080} : {width:1366,height:768};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try {
 const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(()=>{Date.now=()=>1792108800000;crypto.getRandomValues=a=>{for(let i=0;i<a.length;i++)a[i]=12345+i;return a;};let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);}
 console.log('goto');await page.goto(url);console.log('boot');await boot();console.log('actions');
 await page.getByText('Talk to someone',{exact:false}).first().click();
 await page.locator('[data-dialogue="villageElder"]').click();
 await page.locator('#talk_view_host button[data-topic-id="hello"]').click();
 await page.locator('#center_mode_back').click();
 if(process.env.PROOF_DOMAINS==='1' || lifecycleProof) {
  const {calendarMinutes}=await import('../src/world_rhythm.js');
  if(!lifecycleProof){
  const h=await import('../src/harvest.js');
  console.log('domain fixture');const fixture=await page.evaluate(()=>window.simulationTestHooks.snapshot());
  fixture.harvest=h.createHarvest();const clock=calendarMinutes(fixture['current time']);
  h.addCarcass(fixture.harvest,h.drawSpecimen({species:'Wolf rat',key:'modular-fixture-kill',clock},()=>.5),{clock,skill:0,tool:0});
  await page.evaluate(save=>localStorage.setItem('save data',JSON.stringify(save)),fixture);await page.reload();await boot();
  console.log('processing');await page.locator('#harvest_panel > summary').click();
  await page.locator('[data-harvest-choice="tail"]').click();
  await page.evaluate(()=>window.advanceTicks(3,{render:true}));
  assert.equal((await page.evaluate(()=>window.simulationTestHooks.snapshot())).harvest.processed,1);
  }
  console.log('care');await page.keyboard.press('Alt+r');if(!await page.locator('#projects_drawer').evaluate(n=>n.open))await page.locator('#projects_drawer > summary').click();
  await page.locator('#meadow_pen_panel > summary').click();
  for(const action of ['build',lifecycleProof?'rescue_ewe':'adopt','buy_feed','feed','attend']){console.log('care',action);await page.locator(`[data-habitat="${action}"]`).click();}
  if(lifecycleProof){
   const pending=await page.evaluate(()=>window.simulationTestHooks.snapshot());
   const {lifecycle,sheepId}=pending.meadow_pen;
   assert.equal(lifecycle.individuals[sheepId].experience.player.bond,1);
   assert.ok(lifecycle.individuals[sheepId].health.careUntil>calendarMinutes(pending['current time']));
   assert.equal(await page.locator('[data-habitat="collect"]').isDisabled(),true);
  }
  await page.evaluate(ticks=>window.advanceTicks(ticks,{render:true}),lifecycleProof?12:6);
  // Rendering uses the played clock lazily, as before the registry move.
  await page.waitForFunction(()=>!document.querySelector('[data-habitat="collect"]').disabled);
  await page.locator('[data-habitat="collect"]').click();
  if(lifecycleProof){
   const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
   await page.locator('[data-habitat="extend_pen"]').click();
   await page.locator('[data-habitat="breed_sheep"]').click();
   await page.waitForFunction(()=>document.querySelector('[data-habitat-fact="lamb"]')?.textContent.includes('expecting'));
   await page.evaluate(()=>window.advanceTicks(12,{render:true}));
   await page.waitForFunction(()=>document.querySelector('[data-habitat-fact="lamb"]')?.textContent.includes('spare stall'));
   assert.equal(await page.locator('[data-habitat="sell_lamb"]').isDisabled(),true);
   await page.evaluate(()=>window.advanceTicks(18,{render:true}));
   await page.waitForFunction(()=>!document.querySelector('[data-habitat="sell_lamb"]').disabled);
   if(fleeceProof){
    await page.locator('[data-habitat="buy_feed"]').click();
    await page.locator('[data-habitat="tend_lamb"]').click();
    assert.equal(await page.locator('[data-habitat="shear_lamb"]').isDisabled(),true);
    await page.evaluate(()=>window.advanceTicks(6,{render:true}));
    await page.locator('[data-habitat="shear_lamb"]').click();
    assert.equal((await snapshot()).inventories.person.main_character['{"id":"Fine wool"}'].count,5);
   }
   const purse=(await snapshot()).character.money;
   await page.locator('[data-habitat="sell_lamb"]').click();
   assert.equal((await snapshot()).character.money,purse+12);
   const bread=JSON.stringify({id:'Stale bread'}), meat=JSON.stringify({id:'Rabbit meat'});
   const before=(await snapshot()).inventories.person.main_character[bread]?.count ?? 0;
   assert.ok(before>0,'the fresh life carries bread');
   await page.locator('[data-habitat="survey_copse"]').click();
   await page.locator('[data-habitat="hunt_rabbit"]').click();
   const bag=(await snapshot()).inventories.person.main_character;
   assert.equal(bag[bread]?.count??0,before-1);
   assert.equal(bag[meat].count,1);
   await page.evaluate(()=>window.advanceTicks(12,{render:true}));
   await page.waitForFunction(()=>document.querySelector('[data-habitat-fact="wildlife"]')?.textContent.includes('0 foxes'));
  }
  const active=await page.evaluate(()=>window.simulationTestHooks.snapshot());
  assert.equal(active.meadow_pen.collected,1);if(!lifecycleProof)assert.equal(active.harvest.processed,1);
 }
 if(shellProof){
  const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const cloth='{"id":"Wool cloth"}', wood='{"id":"Rough wood log"}';
  const seed=await snapshot();
  seed.inventories.person.main_character[cloth]={count:1};
  if(!seed.expansion.simulation){
   const {enrollSimulation}=await import('../src/simulation.js');
   const {expeditionRegistry}=await import('../src/expedition_content.js');
   const {fieldContext}=await import('./field_fixtures.mjs');
   seed.expansion=enrollSimulation(seed.expansion,expeditionRegistry,
    fieldContext({state:seed.expansion,external:{money:seed.character.money},gameplay:{player:{inventory:{},skills:{},reputation:{}}}})).state;
  }
  await page.evaluate(save=>localStorage.setItem('save data',JSON.stringify(save)),seed);
  await page.reload();await boot();
  async function meadow(){
   await page.keyboard.press('Alt+r');
   if(!await page.locator('#projects_drawer').evaluate(n=>n.open))await page.locator('#projects_drawer > summary').click();
   if(!await page.locator('#meadow_pen_panel').evaluate(n=>n.open))await page.locator('#meadow_pen_panel > summary').click();
  }
  const action=id=>page.locator(`[data-habitat="${id}"]`);
  const step=n=>page.evaluate(ticks=>window.advanceTicks(ticks,{render:true}),n);
  const battle=async()=>(await snapshot()).expansion.simulation.sessions.player?.nativeBattle;
  const guard=async()=>Object.values((await battle()).fighters).find(f=>f.side==='b').profile.stats.defense;
  async function leaveBout(){
   for(let tries=0;tries<12&&await battle();tries++){
    const leave=page.locator('#fight_situation [data-fight-option="withdraw"]');
    const yieldBout=page.locator('#fight_situation [data-fight-option="yield"]');
    await (await leave.isEnabled()?leave:yieldBout).click({timeout:8000});
   }
   assert.equal(await battle(),undefined);
  }
  await meadow();
  for(const id of ['build','rescue_shell','buy_feed','feed_shell','fit_inlet'])await action(id).click();
  assert.equal((await snapshot()).inventories.person.main_character[cloth],undefined);
  await step(2);
  await page.waitForFunction(()=>document.querySelector('[data-habitat-fact="terrapin"]')?.textContent.includes('tucked'));
  await action('spar_shell').click();
  assert.equal(await guard(),6);
  await page.locator('#fight_situation [data-fight-option="jab"]').click({timeout:8000});
  await leaveBout();
  await meadow();
  await step(6);
  await action('close_inlet').click();
  await step(2);
  await page.waitForFunction(()=>document.querySelector('[data-habitat-fact="terrapin"]')?.textContent.includes('has healed'));
  await action('spar_shell').click();
  assert.equal(await guard(),1);
  await leaveBout();
  await meadow();
  await step(2);
  await action('buy_feed').click();
  await action('feed_shell').click();
  await step(4);
  const stock=(await snapshot()).inventories.person.main_character[wood]?.count??0;
  await action('collect_driftwood').click();
  assert.equal((await snapshot()).inventories.person.main_character[wood].count,stock+1);
 }
 if(fleeceProof){
  const seed=await page.evaluate(()=>window.simulationTestHooks.snapshot());
  seed.global_flags.is_crafting_unlocked=true;
  seed.levels.person.main_character.skill_xp.Crafting=1e6;
  seed.availabilities.skill.Crafting=1;
  await page.evaluate(save=>localStorage.setItem('save data',JSON.stringify(save)),seed);
  await page.reload();
  await boot();
  const place=page.locator('button[data-place-tab="actions"]');
  if(await place.isVisible())await place.click();
  await page.locator('.choice_craft').click({timeout:8000});
  await page.locator('#crafting_mainpage_buttons [data-crafting_category="crafting"]').click();
  for(const name of ['Wool cloth','Fine wool cloth']){
   await page.locator(`[data-crafting_category="crafting"][data-crafting_subcategory="items"] [data-recipe_id="${name}"] .recipe_item_name`).click({timeout:8000});
   await page.locator('#crafting_detail [data-craft-commit]').click();
   const stock=await page.evaluate(()=>window.simulationTestHooks.snapshot().inventories.person.main_character);
   assert.equal(stock[JSON.stringify({id:name})]?.count,1);
  }
  await page.keyboard.press('Escape');
  async function meadow(){
   await page.keyboard.press('Alt+r');
   if(!await page.locator('#projects_drawer').evaluate(n=>n.open))await page.locator('#projects_drawer > summary').click();
   if(!await page.locator('#meadow_pen_panel').evaluate(n=>n.open))await page.locator('#meadow_pen_panel > summary').click();
  }
  await meadow();
  const action=id=>page.locator(`[data-habitat="${id}"]`);
  await action('hire_courier').click();
  assert.equal(await action('dispatch_courier').isDisabled(),true);
  await action('fit_courier').click();
  await action('dispatch_courier').click();
  assert.equal(await action('receive_courier').isDisabled(),true);
  await page.locator('#save_button').click();
  const pending=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).meadow_pen.courier);
  assert.equal(pending.order.parcel.count,2);
  await page.reload();
  await boot();
  assert.deepEqual(await page.evaluate(()=>window.simulationTestHooks.snapshot().meadow_pen.courier),pending);
  await meadow();
  await page.evaluate(()=>window.advanceTicks(8,{render:true}));
  const beforeFee=await page.evaluate(()=>window.simulationTestHooks.snapshot().character.money);
  await action('receive_courier').click();
  const delivered=await page.evaluate(()=>window.simulationTestHooks.snapshot());
  assert.equal(delivered.character.money,beforeFee+6);
  assert.equal(delivered.meadow_pen.courier.recipientStock['{"id":"Stale bread"}'],2);
  assert.equal(delivered.meadow_pen.courier.id,pending.id);
  assert.equal(delivered.inventories.person.main_character['{"id":"Wool cloth"}'],undefined);
 }
 await page.evaluate(()=>window.advanceTicks(3,{render:true}));
 await page.locator('#save_button').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 console.log('reload');await page.reload();await boot();console.log('export');
 const restored=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
 const file=await download.path();const encoded=fs.readFileSync(file);
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'modular-synthetic.txt',mimeType:'text/plain',buffer:encoded})]);
 console.log('imported boot');await boot();const imported=await page.evaluate(()=>window.simulationTestHooks.snapshot());
 if(lifecycleProof){
  await page.keyboard.press('Alt+r');
  if(!await page.locator('#projects_drawer').evaluate(n=>n.open))await page.locator('#projects_drawer > summary').click();
  if(!await page.locator('#meadow_pen_panel').evaluate(n=>n.open))await page.locator('#meadow_pen_panel > summary').click();
  assert.match(await page.locator('[data-habitat-fact="wildlife"]').innerText(),/0 foxes/);
  assert.equal(imported.inventories.person.main_character['{"id":"Rabbit meat"}'].count,1);
  if(fleeceProof){
   assert.equal(imported.inventories.person.main_character['{"id":"Fine wool cloth"}'].count,1);
   assert.equal(imported.meadow_pen.courier.recipientStock['{"id":"Stale bread"}'],2);
  }
 }
 // Save deliberately canonicalizes transient storage/UI details. Compare persisted envelopes.
 await page.locator('#save_button').click();
 const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 if(shellProof){
  assert.deepEqual(restored.meadow_pen.shellAnimal,saved.meadow_pen.shellAnimal);
  assert.deepEqual(imported.meadow_pen.shellAnimal,saved.meadow_pen.shellAnimal);
  assert.deepEqual(final.meadow_pen.shellAnimal,saved.meadow_pen.shellAnimal);
 }
 assert.equal(final.global_flags?.is_hero_created,saved.global_flags?.is_hero_created);
 if(process.env.PROOF_DOMAINS==='1' || lifecycleProof) {
  assert.deepEqual(final.harvest,saved.harvest);assert.deepEqual(final.meadow_pen,saved.meadow_pen);
  const legacy=structuredClone(final);delete legacy.harvest;delete legacy.meadow_pen;
  await page.evaluate(save=>localStorage.setItem('save data',JSON.stringify(save)),legacy);await page.reload();await boot();
  const old=await page.evaluate(()=>window.simulationTestHooks.snapshot());
  assert.equal(Object.hasOwn(old,'harvest'),false);assert.equal(Object.hasOwn(old,'meadow_pen'),false);
  assert.deepEqual(old.inventories,final.inventories);
 }
 let moss;
 if(lifecycleProof){
  const ownedShack=structuredClone(final);
  ownedShack['current location']='Shack';
  ownedShack.availabilities.location.Shack=1;
  ownedShack.locations.Shack={...ownedShack.locations.Shack,housing_unlocked:true};
  ownedShack.inventories.person.main_character['{"id":"Linen cloth","quality":75}']={count:1};
  await page.evaluate(save=>localStorage.setItem('save data',JSON.stringify(save)),ownedShack);
  await page.reload();
  await boot();
  const actions=page.locator('button[data-place-tab="options"]');
  if(await actions.isVisible())await actions.click();
  const panel=page.locator('#p23_household_panel');
  if(!await panel.evaluate(n=>n.open))await panel.locator(':scope > summary').click();
  const visit=id=>page.locator(`[data-household-action="${id}"]`);
  const step=()=>page.evaluate(()=>window.advanceTicks(5,{render:true}));
  await visit('meet').click({timeout:8000});
  const seen=(await page.evaluate(()=>window.simulationTestHooks.snapshot())).household.animal;
  assert.equal(seen.lifecycle.individuals[seen.creatureId].keeper,null);
  await step();
  await visit('play').click();
  await step();
  await visit('pet').click();
  await page.locator('#save_button').click();
  moss=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).household.animal);
  const cat=moss.lifecycle.individuals[moss.creatureId];
  assert.equal(moss.creatureId,seen.creatureId);
  assert.equal(cat.keeper,'player');
  assert.equal(cat.experience.player.bond,30);
  assert.deepEqual(cat.experience.player.training,{chase:1});
  await page.reload();
  await boot();
  assert.deepEqual(await page.evaluate(()=>window.simulationTestHooks.snapshot().household.animal),moss);
  const [petDownload]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input')
   .setInputFiles({name:'moss-synthetic.txt',mimeType:'text/plain',buffer:fs.readFileSync(await petDownload.path())})]);
  await boot();
  assert.deepEqual(await page.evaluate(()=>window.simulationTestHooks.snapshot().household.animal),moss);
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(output,JSON.stringify({saved,restored,imported,final,moss},null,2));
 console.log(JSON.stringify({output,errors,viewport:`${viewport.width}x${viewport.height}`,route:'new game, elder dialogue, 3 engine ticks, Save, reload, Export download, literal Import'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
