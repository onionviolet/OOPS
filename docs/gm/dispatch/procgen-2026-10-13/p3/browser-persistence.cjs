const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');const {pathToFileURL}=require('node:url');
const root=process.cwd(),proof=path.join(root,'docs/gm/dispatch/procgen-2026-10-13/p3');
(async()=>{
 const imp=async file=>import(pathToFileURL(path.join(root,'src',file)));
 const {createExpansionState,advanceSimulation}=await imp('expansion_engine.js');const {expeditionRegistry:registry,initializeExpedition}=await imp('expedition_content.js');
 const {enrollSimulation,commitSimulationCommand}=await imp('simulation.js');const {Game_Time}=await imp('game_time.js');const {decodeSaveFile}=await imp('save_files.js');
 const base=JSON.parse(fs.readFileSync('/private/tmp/procgen-p3-natural-begin.json','utf8'));
 const gameplay={player:{inventory:Object.fromEntries(Object.entries(base.inventories.person.main_character).map(([id,row])=>[id,row.count])),skills:Object.fromEntries(['Perception','Pest killing'].map(id=>[id,{xp:0,enabled:true}])),reputation:{}},oldCraftsman:{inventory:{},skills:{},reputation:{}}};
 const context={actorId:'player',facts:{location:'Village'},external:{money:base.character.money},gameplay};
 let state=enrollSimulation(initializeExpedition(createExpansionState(73)),registry,context).state;
 state=commitSimulationCommand(state,registry,{id:'village.storylets.begin'},context).state;
 let plan=advanceSimulation(state,registry,36,context.external,gameplay,{player:context});
 const fixture=structuredClone(base);fixture.expansion=plan.state;fixture.character.name='TEST FIXTURE PROCGEN P3 PERSISTENCE';fixture.character.money=plan.external.money;
 const t=new Game_Time(base['current time']);t.goUp(36);fixture['current time']=Object.fromEntries(['year','month','day','hour','minute','day_count'].map(k=>[k,t[k]]));
 // Only the generated fixture: original native save shape, real enrollment/draw code.
 const crypto=require('node:crypto'),hash=body=>crypto.createHash('sha256').update(body).digest('hex');const buildHash=hash(fs.readFileSync(path.join(root,'dist/bundle.js')));
 const errors=[],findings=[];let serial=0;
 const open=async save=>{
   const ctx=await chromium.launchPersistentContext('/private/tmp/procgen-p3-profile-persist-'+Date.now()+'-'+serial++,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
   await ctx.addInitScript(data=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(data));},save);
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:19330/');assert.equal(hash(await (await page.request.get('http://127.0.0.1:19330/dist/bundle.js')).body()),buildHash);await page.getByText('PLAY',{exact:true}).click();
   await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();return {ctx,page};
 };
 const save=async page=>{await page.locator('#save_button').count().then(async n=>{if(n)await page.locator('#save_button').click();else await page.evaluate(()=>window.saveProgress());});return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const deck=save=>({decks:save.expansion.simulation.decks,events:Object.values(save.expansion.simulation.events).filter(e=>e.storylet)});
 let {ctx,page}=await open(fixture);const pending=await save(page);
 assert.deepEqual(deck(pending),deck(fixture));const decision=deck(pending).events.find(e=>e.mode==='decision'&&e.status==='open');assert.ok(decision);
 assert.equal(await page.locator(`[data-storylet-card="${decision.definitionId}"]`).isVisible(),true);
 await page.reload();await page.getByText('PLAY',{exact:true}).click();const reloaded=await save(page);assert.deepEqual(deck(reloaded),deck(pending));findings.push({label:'SEEDED_NATIVE',gate:'Save/reload',result:'exact pending cards, RNG, due times, cooldowns and receipts'});
 // Advance actual native tick, then compare a second browser from the same checkpoint.
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).expansion.clock>=54,{},{polling:20,timeout:40000});const uninterrupted=await save(page);assert.equal(uninterrupted.expansion.clock,54);
 const branch=await open(pending);await branch.page.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).expansion.clock>=54,{},{polling:20,timeout:40000});const restoredNext=await save(branch.page);
 assert.deepEqual(deck(restoredNext),deck(uninterrupted));findings.push({label:'SEEDED_NATIVE',gate:'next draw after reload',result:'exact deck and event continuation through native ticks'});await branch.ctx.close();
 await page.locator('[data-notebook-view="people"]').click();await page.locator(`[data-storylet-card="${decision.definitionId}"]`).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,'pending-1366.png')});await page.setViewportSize({width:1600,height:1000});await page.screenshot({path:path.join(proof,'pending-1600.png')});const row=page.locator(`[data-storylet-card="${decision.definitionId}"]`);
 const choice=decision.definitionId==='village.child_has_fever'?'help':'warn';await row.locator(`[data-storylet-response="${choice}"]`).click();const settled=await save(page);
 assert.equal(settled.expansion.simulation.events[decision.id].status,'resolved');
 assert.ok(settled.expansion.actors.player.facts[choice==='help'?'storylet.fever.treated':'storylet.scouts.warned']);
 findings.push({label:'SEEDED_NATIVE',gate:'decision response',result:decision.definitionId+' '+choice+' resolved with real saved fact'});
 // Use the native Export control, then import the downloaded literal file through its input.
 const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const download=await dl;
 const exportPath='/private/tmp/procgen-p3-export.txt';await download.saveAs(exportPath);const exported=decodeSaveFile(fs.readFileSync(exportPath,'utf8'),'v0.6');assert.deepEqual(deck(exported),deck(settled));
 await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(exportPath)]);
 await page.getByText('PLAY',{exact:true}).click();const imported=await save(page);assert.deepEqual(deck(imported),deck(exported));
 findings.push({label:'SEEDED_NATIVE',gate:'Export/literal Import',result:'native downloaded file, real file input, exact cards and deck state'});
 await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await page.locator('#storylet_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,'imported-1600.png')});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(proof,'browser-persistence.json'),JSON.stringify({origin:'http://127.0.0.1:19330/',buildHash,hero:fixture.character.name,timerControl:'Normal native timers; both restore branches observed at the same clock 54',pendingClock:pending.expansion.clock,nextClock:uninterrupted.expansion.clock,decision:decision.definitionId,findings,errors},null,2));
 console.log(JSON.stringify(findings,null,2));await ctx.close();
})().catch(e=>{console.error(e);process.exit(1);});
