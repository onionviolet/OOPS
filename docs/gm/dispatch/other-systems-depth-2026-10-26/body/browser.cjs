const assert=require('node:assert/strict'),fs=require('node:fs');
const R='/Users/weiwei/code/yet-another-idle-rpg',OUT=__dirname;
const {launchChrome,advanceGameMinutes,withTestHooks}=require(R+'/scripts/ui_helpers.cjs');
const {startFresh,unlockCombatRoute}=require(R+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
(async()=>{const browser=await launchChrome();let page;
try {
 const ctx=await browser.newContext({viewport:{width:1920,height:1080}});
 await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 page=await ctx.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(withTestHooks('http://127.0.0.1:19346/'));await page.waitForFunction(()=>window.simulationTestHooks);
 await startFresh(page);
 const a=page.locator('#location_actions_div');
 await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();
 for(const key of ['hello','what happened','ask to leave 1','need to']){const l=a.locator(`.dialogue_textline[data-textline="${key}"]`);await l.waitFor({state:'visible'});await l.evaluate(n=>n.click());await l.waitFor({state:'detached'});}
 await page.evaluate(()=>end_dialogue());await advanceGameMinutes(page,3);
 const open=async()=>{
  const select=page.getByRole('combobox',{name:'Other known panels'});const value=await select.evaluate(n=>[...n.options].find(o=>o.textContent.includes('Notes, practice & people'))?.value);if(value)await select.selectOption(value);
  await page.locator('[data-notebook-view="here"]').click();
  await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>d.open=true);});
 };
 const click=async(pattern)=>{await open();const b=page.locator('#feature_expansion_panel button').filter({hasText:pattern}).first();await b.scrollIntoViewIfNeeded();console.log('click',await b.innerText(),await b.isDisabled());await b.click();await page.waitForTimeout(400);};
 const snapshot=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 await click(/Read the parallel-entry/);await click(/Choose independent Paradise entry/);await click(/Enter the independent contractor district/);await click(/Meet the independent service desk/);
 await click(/packing shift/i);await advanceGameMinutes(page,5);
 await click(/Open optional local care and work notes/);
 console.log('buttons',await page.locator('#feature_expansion_panel').innerText());
 fs.writeFileSync(OUT+'/native-route-save.json',JSON.stringify(await snapshot(),null,2));
 await page.screenshot({path:OUT+'/desktop.png'});
 assert.deepEqual(errors,[]);console.log('PASS native entry and care enrollment');
} catch(e) {if(page){fs.writeFileSync(OUT+'/browser-failure.txt',await page.locator('body').innerText());await page.screenshot({path:OUT+'/browser-failure.png'});}throw e;}
finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
