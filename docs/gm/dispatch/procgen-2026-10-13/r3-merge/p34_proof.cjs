const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const proof=path.join(process.cwd(),'docs/gm/dispatch/procgen-2026-10-13/r3-merge');
(async()=>{
 const profile=process.env.P34_PROFILE||'/private/tmp/procgen-p34-profile-natural-'+Date.now();
 const browser=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const page=browser.pages()[0]||await browser.newPage();for(const p of browser.pages())if(p!==page)await p.close();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const imp=async f=>import(path.join(process.cwd(),'src',f));const {decodeSaveFile}=await imp('save_files.js');
 const save=async()=>{await page.locator('#save_button').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const projection=s=>({people:s.generated_people,history:s.expansion.loreHistory,streams:s.expansion.streams,decks:s.expansion.simulation.decks,events:Object.values(s.expansion.simulation.events).filter(e=>e.storylet),inventory:s.inventories.person.main_character,money:s.character.money});
 const shots=async(prefix)=>{for(const [width,height] of [[1366,768],[1600,1000]]){await page.setViewportSize({width,height});await page.locator('#generated_people_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,`${prefix}-${width}.png`)});}};
 try {
 await page.goto('http://127.0.0.1:22410/');await page.locator('#loading_screen_play_button').click();
 if(await page.locator('#hero_creation_panel').isVisible()){await page.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN R3 NATURAL');await page.locator('#hero_creation_panel_confirmation').click();}
 const enrolled=await page.locator('[data-storylet="begin"]').isVisible().catch(()=>false);
 if(!((await saved())?.expansion?.actors.player.facts['storylets.enabled'])) {
 await page.getByText('Talk to someone',{exact:false}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
 await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await page.locator('[data-storylet="begin"]').click();
 }
 const details=page.locator('#generated_people_panel');await details.evaluate(n=>n.open=true);
 if(await page.locator('[data-generated-action="enroll"]').count())await page.locator('[data-generated-action="enroll"]').click();
 // Meet second traveler first through its real discovery route. No latent goal inspection.
 let snapshot=await save();
 for(const id of ['traveler_2','traveler_1']) {
  const row=page.locator(`[data-generated-person="${id}"]`);await row.evaluate(n=>n.open=true);
  if(await row.locator('[data-generated-action="meet"]').count())await row.locator('[data-generated-action="meet"]').click();
  snapshot=await save();const known=snapshot.generated_people.people.find(p=>p.id===id);
  if(known.goal.item==='Stale bread')break;
 }
 if(await page.locator('[data-story-request="enable"]').count())await page.locator('[data-story-request="enable"]').click();
 if(await page.locator('[data-story-request="raise"]').count())await page.locator('[data-story-request="raise"]').click();
 snapshot=await save();let request=snapshot.generated_people.storyRequests.requests.find(r=>['offered','accepted'].includes(r.status));assert.ok(request);
 console.log(JSON.stringify({phase:'natural request raised',profile,item:request.item,clock:snapshot.expansion.clock}));
 const key=JSON.stringify({id:request.item});
 fs.writeFileSync('/private/tmp/procgen-p34-natural-pending.json',JSON.stringify(snapshot));
 fs.writeFileSync(path.join(proof,'NATIVE_CHECKPOINT.json'),JSON.stringify({profile,request:request.id,item:request.item,phase:'offered',label:'natural'},null,2));
 if(!(snapshot.inventories.person.main_character[key]?.count>=1))throw Error('NATURAL_STOCK_ROUTE_NEEDED: '+request.item);
 if(request.status==='offered')await page.locator(`[data-request-id="${request.id}"][data-story-request="take"]`).click();
 const pending=await save();await page.reload();await page.locator('#loading_screen_play_button').waitFor();assert.deepEqual(projection(await saved()),projection(pending));await page.locator('#loading_screen_play_button').click();await page.locator('#generated_people_panel').evaluate(n=>n.open=true);
 const restored=await save();assert.deepEqual(restored.generated_people.storyRequests,pending.generated_people.storyRequests);
 await page.locator(`[data-request-id="${request.id}"][data-story-request="deliver"]`).click();const delivered=await save();
 assert.equal(delivered.character.money,restored.character.money+request.reward);assert.equal(delivered.inventories.person.main_character[key]?.count||0,(restored.inventories.person.main_character[key]?.count||0)-1);
 assert.equal(delivered.generated_people.storyRequests.requests.find(r=>r.id===request.id).status,'delivered');
 const recap=page.locator(`[data-story-request-row="${request.id}"] [data-story-recap]`);assert.match(await recap.innerText(),/you delivered one/);await shots('recap');
 const target=delivered.expansion.clock+65;
 while((await saved()).expansion.clock<target) {await page.waitForTimeout(5000);await save();const s=await saved();if(Object.values(s.expansion.simulation.events).some(e=>e.definitionId==='village.remembered_supply'&&e.status==='open'))break;}
 const callback=page.locator('[data-storylet-card="village.remembered_supply"]');await page.locator('#journal_show_notebook').click();await page.locator('[data-notebook-view="people"]').click();await callback.waitFor({state:'visible',timeout:10000});
 const text=await callback.innerText(),person=delivered.generated_people.people.find(p=>p.id===request.issuer);assert.ok(text.includes(person.name)&&text.includes(request.item));
 for(const [width,height] of [[1366,768],[1600,1000]]){await page.setViewportSize({width,height});await callback.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,`aftermath-${width}.png`)});}
 await callback.locator('[data-storylet-response="listen"]').click();const settled=await save();assert.ok(settled.expansion.loreHistory.receipts.some(r=>r.action==='aftermath.response'&&r.targetPerson===request.issuer));
 await page.reload();await page.locator('#loading_screen_play_button').waitFor();assert.deepEqual(projection(await saved()),projection(settled));await page.locator('#loading_screen_play_button').click();
 const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const download=await dl,literal='/private/tmp/procgen-p34-natural-literal.txt';await download.saveAs(literal);const exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');
 // Literal import on a second fresh profile at the same isolated test origin.
 const importedBrowser=await chromium.launchPersistentContext('/private/tmp/procgen-p34-profile-import-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1600,height:1000},acceptDownloads:true});
 const importedPage=importedBrowser.pages()[0];await importedPage.goto('http://127.0.0.1:22410/');await importedPage.locator('#loading_screen_play_button').click();await importedPage.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN R3 IMPORT');await importedPage.locator('#hero_creation_panel_confirmation').click();
 await Promise.all([importedPage.waitForNavigation({waitUntil:'domcontentloaded'}),importedPage.locator('#saved_file_input').setInputFiles(literal)]);
 const imported=await importedPage.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.deepEqual(projection(imported),projection(exported));await importedPage.locator('#loading_screen_play_button').click();await importedPage.locator('#generated_people_panel').evaluate(n=>n.open=true);await importedPage.screenshot({path:path.join(proof,'import-1600.png')});await importedBrowser.close();
 const bundle=fs.readFileSync('dist/bundle.js'),served=await(await page.request.get('http://127.0.0.1:22410/dist/bundle.js')).body();assert.deepEqual(served,bundle);assert.deepEqual(errors,[]);
 fs.writeFileSync('/private/tmp/procgen-p34-natural-complete.json',JSON.stringify(exported));
 const evidence={label:'natural',profile,route:'elder > Begin Village encounters > Welcome road travelers > Meet traveler > Begin remembered requests > Ask about a supply need > Take request > Deliver > Story so far > remembered supply card > compare road signs',viewports:['1366x768','1600x1000'],requestItem:request.item,pendingReloadExact:true,actualStockAndFee:true,receiptRecap:true,laterSamePersonObject:true,completedReloadExact:true,exportLiteralImportSecondProfileExact:true,pageErrors:errors,bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex')};fs.writeFileSync(path.join(proof,'BROWSER_EVIDENCE.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
 }catch(e){await page.screenshot({path:path.join(proof,'attempt.png')});console.log((await page.locator('body').innerText()).slice(-8000));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
