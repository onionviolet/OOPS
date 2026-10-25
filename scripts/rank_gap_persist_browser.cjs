// HTP49 persistence journey: earn slice state in Goa, return by existing Paradise commands, save, reload,
// export/import into a fresh origin, re-enter Goa, compare the rankGapObserver slice. Fresh contexts only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {reachGoa,url,out,launchChrome}=require('./rank_gap_browser.cjs');
const {advanceGameMinutes}=require('./ui_helpers.cjs');
(async()=>{
 const browser=await launchChrome(),errors=[],log=[];let page;
 const line=(n,v)=>{log.push(`${n}: ${v}`);console.log(`${n}: ${v}`);};
 const core=s=>s&&{observers:s.observers,earned:s.earned,version:s.version};
 try{
  const r=await reachGoa({browser,errors,line});page=r.page;const {snap}=r;const step=async(n,re)=>{await r.openHere();return r.step(n,re);};
  const status=()=>page.evaluate(()=>window.simulationTestHooks.saveStatus());
  const opts=await page.evaluate(()=>[...document.querySelector('select[aria-label="Other known panels"]').options].map(o=>o.textContent).find(t=>/^Watch a working/.test(t)));
  await page.getByRole('combobox',{name:'Other known panels'}).selectOption({label:opts});
  const panel=page.locator('#rank_gap_observer_panel');await panel.waitFor({state:'visible'});await advanceGameMinutes(page,1);
  const btn=id=>panel.locator(`button[data-subject="book.paradise.${id}"]`);
  await btn('mia').click();await panel.locator('select').selectOption('duty_copy');await btn('hank').click();
  await panel.locator('select').selectOption('local_permit');
  for(let i=0;i<3;i++){await btn('philip_herbert').click();await advanceGameMinutes(page,1);}
  const s0=(await snap()).rankGapObserver;line('slice in Goa',JSON.stringify(core(s0)));
  assert.ok(s0.earned.soulWard,'ward earned');assert.ok(s0.observers.player.strain>0);
  line('saveStatus in Goa',JSON.stringify(await status()));
  // legitimate return by existing commands
  await step('go Gray Terminal',/Go to Goa Gray Terminal/);await step('return to hub',/Return from your personal Goa visit/);
  line('saveStatus at hub',JSON.stringify(await status()));
  let w=(await snap()).expansion.actors.player.worldId;line('world after return_hub',w);
  await step('return to Village',/Return to Village in your retained body/);
  w=(await snap()).expansion.actors.player.worldId;line('world after return_frontier',w);assert.equal(w,'base.frontier');
  line('saveStatus in Village',JSON.stringify(await status()));
  await page.evaluate(()=>window.saveProgress());
  let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
  assert.deepEqual(core(saved.rankGapObserver),core(s0));line('save in Village','slice core identical (sightings, strain, earned.soulWard)');
  // reload
  await page.reload();await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button').click();
  await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
  assert.deepEqual(core((await snap()).rankGapObserver),core(s0));line('reload','slice core identical');
  // export, import into a fresh origin
  const encoded=await page.evaluate(()=>window.save_to_file());const file=path.join(out,'export.txt');fs.writeFileSync(file,typeof encoded==='string'?encoded:JSON.stringify(encoded));
  const ctx2=await browser.newContext({viewport:{width:1920,height:1080}});await ctx2.route('**/private_packs/manifest.json',x=>x.fulfill({json:{schema:1,packs:[]}}));
  const p2=await ctx2.newPage();p2.on('pageerror',e=>errors.push(e.stack));await p2.goto(url);await p2.waitForFunction(()=>window.simulationTestHooks);
  await p2.locator('#loading_screen_play_button').click();await p2.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await p2.evaluate(()=>window.saveProgress());
  await Promise.all([p2.waitForNavigation({waitUntil:'domcontentloaded'}),p2.locator('#saved_file_input').setInputFiles(file)]);
  await p2.waitForFunction(()=>window.simulationTestHooks);await p2.locator('#loading_screen_play_button').click();await p2.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);
  const imp=(await p2.evaluate(()=>window.simulationTestHooks.snapshot())).rankGapObserver;assert.deepEqual(core(imp),core(s0));line('import (fresh origin)','slice core identical');
  await ctx2.close();
  // legacy: a save without the slice loads empty
  // re-enter Goa in the original page
  await step('enter hub again',/Enter the independent contractor district/);await step('visit Goa again',/Visit the first-Goa branch/);
  w=(await snap()).expansion.actors.player.worldId;line('world after re-entry',w);
  const s1=(await snap()).rankGapObserver;assert.deepEqual(core(s1),core(s0));const seenText=await page.evaluate(()=>[...document.querySelectorAll('#rank_gap_observer_panel [aria-label="What you have made out"] li')].map(l=>l.textContent).join(' / '));assert.ok(seenText.length>0&&/Mia|Hank|Philip|Su Xiao/.test(seenText),'seen list empty after re-entry');line('re-entered Goa','slice core identical; panel seen list: '+await page.evaluate(()=>[...document.querySelectorAll('#rank_gap_observer_panel [aria-label="What you have made out"] li')].map(l=>l.textContent).join(' / ')));
  assert.equal(errors.length,0,errors.join('\n'));line('page errors','none');
 }catch(e){console.error('FAIL',e.message);try{await page.screenshot({path:path.join(out,'persist-fail.png')});}catch{}process.exitCode=1;line('FAIL',e.message);}
 finally{fs.writeFileSync(path.join(out,'persist.log'),log.join('\n'));await browser.close();}
})();
