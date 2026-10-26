// Fresh disposable origin. Earn readiness through native combat, then exercise
// actual panels and the native Save/Export/Import routes. Never loads a personal save.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.cwd(),routes=require(path.join(root,'docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs'));
const evidence='/Users/weiwei/.codex/research/cultivation-absorption-2026-10-24/browser';fs.mkdirSync(evidence,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const watchdog=setTimeout(()=>browser.close(),120000);
 const context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
 await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 const page=await context.newPage(),errors=[],receipt={};page.on('pageerror',e=>errors.push(e.message));
 const snapshot=()=>page.evaluate(()=>simulationTestHooks.snapshot());
 const open=async id=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption(id);};
 const play=async()=>{await routes.startFresh(page);await page.waitForFunction(()=>simulationTestHooks.saveStatus().ownsSave&&!simulationTestHooks.saveStatus().restoring&&!simulationTestHooks.saveStatus().writeBlocked);await page.evaluate(()=>simulationTestHooks.pause());};
 try{
  await page.goto('http://127.0.0.1:19524/?test_hooks=1');await play();
  const openingKeys=new Set(Object.keys((await snapshot()).inventories.person.main_character));
  const actions=page.locator('#location_actions_div');
  await actions.getByText('Talk to someone',{exact:false}).first().click();
  await actions.getByText('Talk to village elder',{exact:false}).first().click();
  for(const id of ['hello','what happened','ask to leave 1','need to'])await actions.locator(`[data-textline="${id}"]`).click();
  await actions.locator('[data-textline="starting gear"]').click();
  await actions.locator('[data-textline="spear"]').click();
  await page.keyboard.press('Escape');
  const equipment=await snapshot(),weapon=Object.keys(equipment.inventories.person.main_character).find(k=>!openingKeys.has(k));
  assert.ok(weapon);await page.evaluate(k=>equip_item(k),weapon);
  console.log('Native elder dialogue supplied an equipped spear.');
  await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
  await page.locator('.action_travel[data-travel="Infested field"]').first().click();
  await page.evaluate(()=>advanceTicks(5,{render:true}));
  for(let i=0;i<80;i++){
   const s=await snapshot();console.log('Combat learning',i,s.levels.person.main_character.skill_xp.Combat,s['current location']);
   if((s.levels.person.main_character.skill_xp.Combat??0)>=60)break;
   if(s['current location']==='Village'){
    console.log('Rest after native defeat, then return for another ordinary hunt.');
    await page.evaluate(()=>advanceTicks(30,{render:true}));
    await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
    await page.locator('.action_travel[data-travel="Infested field"]').first().click();
   }
   await page.evaluate(()=>advanceTicks(5,{render:true}));
  }
  await routes.leaveCombat(page);await page.evaluate(()=>advanceTicks(5,{render:true}));
  await open('pledges');await page.locator('#pledges_panel').waitFor({state:'visible'});
  console.log('GATE',await page.locator('#pledges_panel').innerText());
  const begin=page.locator('[data-ordeal-begin="precision"][data-ordeal-rations="1"]');
  assert.ok(await begin.isEnabled(),'native combat earned a qualifying skill');
  const before=await snapshot();fs.writeFileSync(path.join(evidence,'earned-readiness.json'),JSON.stringify(before));
  await begin.click();await page.locator('[data-ordeal-abandon]').click();
  const abandoned=await snapshot();assert.equal(abandoned.pledges?.ordeal??null,null);assert.equal(abandoned.pledges?.trial.stage??0,0);
  assert.equal(abandoned.inventories.person.main_character['{"id":"Stale bread"}'].count,before.inventories.person.main_character['{"id":"Stale bread"}'].count-1,'leaving cannot refund committed supplies');
  const prepared=await snapshot();await begin.click();
  const pending=await snapshot();assert.equal(pending.pledges.ordeal.kind,'precision');
  assert.equal(pending.inventories.person.main_character['{"id":"Stale bread"}'].count,prepared.inventories.person.main_character['{"id":"Stale bread"}'].count-1);
  await page.locator('[data-ordeal-step="steady"]').click();
  const step=await snapshot();assert.equal(step.pledges.ordeal.turn,1);
  await page.locator('#save_button').click();await page.reload();await play();await open('pledges');
  assert.deepEqual((await snapshot()).pledges,step.pledges,'pending trial survives native save/reload');
  await page.locator('[data-ordeal-accept]').click();const settled=await snapshot();
  assert.equal(settled.pledges.ordeal,null);assert.equal(settled.pledges.trial.stage,1);assert.ok(settled.pledges.trial.quality>0);
  await page.screenshot({path:path.join(evidence,'slice1-trial-1920.png')});
  await page.locator('[data-take-vow="plain-table"]').click();
  fs.writeFileSync(path.join(evidence,'earned-trial-prefix.json'),JSON.stringify(await snapshot()));
  await page.locator('[data-route-id="records:notebook"]').click();
  const peopleTab=page.locator('[data-notebook-view="people"]');if(await peopleTab.isVisible())await peopleTab.click();
  await page.locator('#chronicle_panel').waitFor({state:'visible'});
  if(!await page.locator('#chronicle_panel').evaluate(n=>n.open))await page.locator('#chronicle_panel summary').click();
  await page.locator('[data-chronicle="begin-open"]').click();
  await open('inherited_traits');await page.locator('#inherited_traits_panel').waitFor({state:'visible'});
  await page.evaluate(()=>advanceTicks(1,{render:true}));
  const lineage=(await snapshot()).inherited_traits;assert.ok(lineage?.selfId&&lineage.bodyBinding,'family line and current embodiment are saved');
  const L=await import(path.join(root,'src/lineage_traits.js'));
  const expected=L.inheritedStatMultipliers(lineage);
  if(Object.keys(expected).length)assert.match(await page.locator('body').textContent(),/Inherited qualities/,'native stat breakdown names the inherited contribution');
  receipt.lineage={naturalFounding:true,expected,bodyBinding:lineage.bodyBinding};
  await page.screenshot({path:path.join(evidence,'slice1-lineage-1920.png')});
  const saved=await snapshot();await page.locator('#save_button').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);
  const buffer=fs.readFileSync(await download.path());fs.writeFileSync(path.join(evidence,'slice1.save.txt'),buffer);
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'disposable-cultivation.txt',mimeType:'text/plain',buffer})]);await play();
  assert.deepEqual((await snapshot()).pledges,saved.pledges,'graded history and vows survive literal exported import');
  assert.deepEqual((await snapshot()).inherited_traits,saved.inherited_traits,'inherited genotype and body binding survive literal exported import');
  receipt.trial={nativeReadiness:true,cancellation:true,pendingReload:true,settled:saved.pledges.trial,literalImport:true};
  assert.deepEqual(errors,[]);receipt.errors=errors;receipt.status='PASS';
  fs.writeFileSync(path.join(evidence,'slice1.json'),JSON.stringify(receipt,null,2));console.log('PASS',JSON.stringify(receipt));
 }catch(e){await page.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});console.error('BODY',(await page.locator('body').innerText()).slice(-4500));console.error('STATE',JSON.stringify((await snapshot()).pledges));throw e;}
 finally{clearTimeout(watchdog);await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
