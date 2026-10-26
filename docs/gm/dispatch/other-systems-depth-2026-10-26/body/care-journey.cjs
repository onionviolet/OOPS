const assert=require('node:assert/strict'),fs=require('node:fs');
const R='/Users/weiwei/code/yet-another-idle-rpg',O=__dirname;
const {launchChrome,advanceGameMinutes,withTestHooks}=require(R+'/scripts/ui_helpers.cjs');
(async()=>{const browser=await launchChrome();let page;
try {
 const ctx=await browser.newContext({viewport:{width:1920,height:1080}});await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 // Named supplied-care fixture: earned branch/8 credits from browser.cjs plus disclosed synthetic stock.
 const fixture=JSON.parse(fs.readFileSync(O+'/native-route-save.json'));
 const inv=fixture.inventories.person.main_character;
 for(const id of ['Rough wood log','Survey rope','Goa ration parcel'])inv[JSON.stringify({id})]={count:1};
 await ctx.addInitScript(save=>{if(!localStorage.getItem('body.fixture.loaded')){localStorage.setItem('save data',JSON.stringify(save));localStorage.setItem('body.fixture.loaded','1');}},fixture);
 page=await ctx.newPage();page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(withTestHooks('http://127.0.0.1:19346/'));await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>window.simulationTestHooks.pause());
 const snap=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 const click=async(pattern)=>{
  const select=page.getByRole('combobox',{name:'Other known panels'});const value=await select.evaluate(n=>[...n.options].find(o=>o.textContent.includes('Notes, practice & people'))?.value);if(value)await select.selectOption(value);
  await page.locator('[data-notebook-view="here"]').evaluate(n=>n.click());await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>d.open=true);});
  const b=page.locator('#feature_expansion_panel button').filter({hasText:pattern}).first();console.log('click',await b.innerText(),await b.isDisabled());await b.evaluate(n=>{n.scrollIntoView({block:"center"});n.click();});await page.waitForTimeout(400);
 };
 await click(/Pack hurriedly/);await advanceGameMinutes(page,2);
 let s=await snap();assert.ok(s.expansion.simulation.conditions.player['book.care.load_strain']);
 console.log('strained',s.character.hp_to_full,s.expansion.clock);
 await page.locator('#feature_expansion_panel').evaluate(n=>n.querySelectorAll('details').forEach(d=>d.open=true));
 const text=await page.locator('body').innerText();assert.ok(text.includes('Load strain'));assert.match(text,/DEX\s+9\.0/);
 await page.locator('#feature_expansion_panel button').filter({hasText:/Pack precisely/}).first().evaluate(n=>n.scrollIntoView({block:"center"}));
 await page.screenshot({path:O+'/strain-1920.png'});
 await page.evaluate(()=>window.saveProgress());await page.reload();await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>window.simulationTestHooks.pause());
 assert.ok((await snap()).expansion.simulation.conditions.player['book.care.load_strain']);
 const encoded=await page.evaluate(()=>window.save_to_file());assert.ok(encoded);
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles({name:'synthetic-body-care.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
 await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>window.simulationTestHooks.pause());
 assert.ok((await snap()).expansion.simulation.conditions.player['book.care.load_strain']);
 await click(/Rest strained hands without supplies/);await advanceGameMinutes(page,4);
 s=await snap();assert.equal(s.expansion.simulation.conditions.player['book.care.load_strain'],undefined);
 assert.equal(s.expansion.actors.player.completed['book.care.hub.rest'],1);
 await page.screenshot({path:O+'/recovered-1920.png'});assert.deepEqual(errors,[]);
 console.log(JSON.stringify({route:'fixture(supplied-care-stock)',strained:true,blockedPreciseText:true,save:true,reload:true,export:true,import:true,restCleared:true,errors}));
} catch(e){if(page){fs.writeFileSync(O+'/care-failure.txt',await page.locator('body').innerText());await page.screenshot({path:O+'/care-failure.png',timeout:10000}).catch(()=>{});}throw e;}
finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
