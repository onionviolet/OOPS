const WT='/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/agent-a355d67700960c941';
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {startFresh}=require(WT+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const OUT=process.env.OUT||'/tmp/h2';fs.mkdirSync(OUT,{recursive:true});
const COPY=JSON.stringify({id:'Goa duty copy'});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[];
 try{
 const ctx=await browser.newContext({viewport:{width:1920,height:1080}});
 await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 const page=await ctx.newPage();page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});
 page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))errors.push(m.text());});
 const snap=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
 async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());
  if(await page.locator('#loading_screen_play_button:not(.none_display)').count())await startFresh(page);
  await page.waitForFunction(()=>{const s=window.simulationTestHooks.saveStatus();return s.ownsSave&&!s.restoring&&!s.writeBlocked;},null,{timeout:8000}).catch(async e=>{console.log('STATUS',JSON.stringify(await page.evaluate(()=>window.simulationTestHooks.saveStatus())),errors.slice(0,3),(await page.locator('body').innerText()).slice(0,500));throw e;});}
 await page.goto('http://127.0.0.1:19622/index.html?test_hooks=1');await boot();
 let s=await snap();
 // LEGACY: a fresh save has no rankGapObserver field and loads.
 assert.equal(s.rankGapObserver,undefined,'fresh save carries no new field');
 // DEV SEEDED: stand in Goa with the duty copy and local permit (earned routes are separate Paradise commands).
 s.expansion.actors.player.facts['village.discovered']=true;
 s.inventories.person.main_character[COPY]={count:1};
 await page.evaluate(x=>localStorage.setItem('save data',JSON.stringify(x)),s);await page.reload();await boot();
 const loaded=await snap();assert.ok(loaded.expansion.actors.player.facts['village.discovered'],'seed loaded');
 const panel=page.locator('#rank_gap_observer_panel');
 // open via the workspace panel list
 const combo=page.getByRole('combobox',{name:'Other known panels'});
 const opts=await combo.locator('option').allTextContents();console.log('panel options',opts.join('|'));
 await combo.selectOption({label:'Watch a working'}).catch(e=>console.log('select fail',e.message.slice(0,80)));
 await page.evaluate(()=>window.advanceTicks?.(1,{render:true}));
 await panel.waitFor({state:'visible',timeout:8000});
 const btn=id=>panel.locator(`button[data-subject="book.paradise.${id}"]`);
 const said=()=>panel.locator('#rank_gap_said').textContent();
 // WITNESS: Mia by plain sight, Hank by the duty copy
 await btn('mia').click();console.log('witness Mia:',await said());assert.match(await said(),/Civilian/);
 await panel.locator('select').selectOption('duty_copy');await btn('hank').click();console.log('witness Hank:',await said());assert.match(await said(),/Guard or contractor/);
 // BLIND: Su Xiao by plain sight
 await panel.locator('select').selectOption('sight');await btn('su_xiao').click();console.log('blind Su:',await said());assert.match(await said(),/see nothing/);
 // GLIMPSE: Philip Herbert by palace admission
 await panel.locator('select').selectOption('local_permit');const before=(await snap()).character?.stats?.stamina;
 await btn('philip_herbert').click();console.log('glimpse King:',await said());assert.match(await said(),/strain \+1/);
 await page.screenshot({path:OUT+'/glimpse-1920.png'});
 const mid=await snap();console.log('slice',JSON.stringify(mid.rankGapObserver).slice(0,300));
 assert.ok(mid.rankGapObserver.observers.player.strain>0);assert.equal(mid.rankGapObserver.clock,8,'4 watches x 2 min');
 // second glimpse: stack strain until the ward is earned (3rd glimpse), then sight closes
 await btn('philip_herbert').click();await btn('philip_herbert').click();
 console.log('after 3 glimpses:',await said(),'|',await panel.locator('p').nth(1).textContent());
 const st=await snap();assert.ok(st.rankGapObserver.earned.soulWard,'ward earned in play');
 await page.screenshot({path:OUT+'/ward-1920.png'});
 // SAVE, RELOAD
 await page.locator('#save_button').click();const saved=await snap();
 await page.reload();await boot();const re=await snap();assert.deepEqual(re.rankGapObserver,saved.rankGapObserver);console.log('reload keeps slice');
 // EXPORT, IMPORT
 const [dl]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const enc=fs.readFileSync(await dl.path());
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'h2.txt',mimeType:'text/plain',buffer:enc})]);await boot();
 const imp=await snap();assert.deepEqual(imp.rankGapObserver,saved.rankGapObserver);console.log('import keeps slice');
 assert.deepEqual(errors,[]);console.log('PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
