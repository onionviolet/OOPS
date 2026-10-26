// Paradise chart-before-enrolment proof: headless 1920x1080, fresh origin, native clicks, rebuilt bundle.
// Clicks the chart directly after the village elder, with no other living-world enrolment first.
// CONTROL=1 expects the old (unfixed) bundle to refuse; otherwise the fixed bundle must enrol and survive save/reload/import.
const assert=require('node:assert/strict'),fs=require('node:fs');
const R='/Users/weiwei/code/yet-another-idle-rpg';
const {launchChrome,advanceGameMinutes,withTestHooks}=require(R+'/scripts/ui_helpers.cjs');
const {startFresh}=require(R+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=withTestHooks(process.env.URL),shot=process.env.SHOT,control=process.env.CONTROL==='1';
(async()=>{const browser=await launchChrome(),errors=[];
 try{const ctx=await browser.newContext({viewport:{width:1920,height:1080}});await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await ctx.newPage();page.setDefaultTimeout(16000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>window.simulationTestHooks);await startFresh(page);
  const snap=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const a=page.locator('#location_actions_div');
  await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();
  for(const key of ['hello','what happened','ask to leave 1','need to']){const l=a.locator(`.dialogue_textline[data-textline="${key}"]`);await l.waitFor({state:'visible'});await l.evaluate(n=>n.click());await l.waitFor({state:'detached'});}
  await page.evaluate(()=>end_dialogue());await advanceGameMinutes(page,3);
  const openHere=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption({label:'Notes, practice & people •'});await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;});};
  await openHere();
  const before=await snap();assert.equal(before.expansion.simulation==null,true,'fresh game has no living-world services yet');
  await page.evaluate(()=>document.querySelectorAll('#feature_expansion_panel details').forEach(d=>d.open=true));
  const chart=page.locator('#feature_expansion_panel button',{hasText:/Read the parallel-entry/}).first();
  assert.ok(await chart.count(),'chart action is offered');
  const visibleBefore=await chart.isDisabled()?'disabled':'enabled';
  await chart.scrollIntoViewIfNeeded();await chart.click({timeout:15000,noWaitAfter:true});await page.waitForTimeout(1500);
  try{await page.waitForLoadState('load',{timeout:8000});}catch{}
  if(await page.locator('#loading_screen_play_button').isVisible().catch(()=>false)){await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.waitForTimeout(800);}
  const after=await snap();const enrolled=after.expansion.simulation!=null;
  const text=await page.locator('body').innerText();const refusal=/required knowledge, means or circumstances are missing/i.test(text);
  if(shot)await page.screenshot({path:shot});
  if(control){assert.equal(enrolled,false,'control: old bundle must not enrol');console.log(JSON.stringify({control:true,buttonBefore:visibleBefore,enrolled,refusalShown:refusal,errors}));}
  else{assert.equal(enrolled,true,'fixed bundle enrols living-world services through the chart');assert.equal(refusal,false,'no refusal message');
   assert.equal(after.expansion.simulation.people.player.location,'Village');
   const chartDone=JSON.stringify(after.expansion.actors.player.completed||{}).includes('book.paradise.chart');
   assert.equal(chartDone,true,'chart is recorded complete');
   const left=await page.locator('#feature_expansion_panel button',{hasText:/Read the parallel-entry/}).count();
   await page.evaluate(()=>window.saveProgress());await page.reload();await page.waitForFunction(()=>window.simulationTestHooks||document.getElementById('loading_screen_play_button'));
   await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
   const reloaded=await snap();assert.equal(reloaded.expansion.simulation!=null,true,'enrolment survives reload');
   const encoded=await page.evaluate(()=>window.save_to_file());
   await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'chart.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
   await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
   const imported=await snap();assert.equal(imported.expansion.simulation!=null,true,'enrolment survives file import');
   assert.equal(imported.expansion.simulation.people.player.location,'Village');
   assert.deepEqual(errors,[]);
   console.log(JSON.stringify({control:false,buttonBefore:visibleBefore,enrolled,refusalShown:refusal,chartDone,chartOfferedAfter:left,reloaded:true,imported:true,errors}));}
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message||e);process.exit(1)});
