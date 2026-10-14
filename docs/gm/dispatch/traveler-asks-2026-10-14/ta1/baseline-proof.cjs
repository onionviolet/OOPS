const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const proof=path.join(process.cwd(),'docs/gm/dispatch/traveler-asks-2026-10-14/ta1');
(async()=>{
 const profile=process.env.P34_PROFILE||'/private/tmp/ta-ta1-profile-rev1-'+Date.now();
 const browser=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const page=browser.pages()[0]||await browser.newPage();for(const p of browser.pages())if(p!==page)await p.close();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const imp=async f=>import(path.join(process.cwd(),'src',f));const {decodeSaveFile}=await imp('save_files.js');
 const save=async()=>{await page.locator('#save_button').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const projection=s=>({people:s.generated_people,history:s.expansion.loreHistory,streams:s.expansion.streams,decks:s.expansion.simulation.decks,events:Object.values(s.expansion.simulation.events).filter(e=>e.storylet),inventory:s.inventories.person.main_character,money:s.character.money});
 const shots=async(prefix)=>{for(const [width,height] of [[1366,768],[1600,1000]]){await page.setViewportSize({width,height});await page.locator('#generated_people_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(proof,`${prefix}-${width}.png`)});}};
 try {
 await page.goto('http://127.0.0.1:22420/');await page.locator('#loading_screen_play_button').click();
 if(await page.locator('#hero_creation_panel').isVisible()){await page.locator('#hero_creation_name_field').fill('TEST FIXTURE TA TA1 REV1');await page.locator('#hero_creation_panel_confirmation').click();}
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

 const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();await(await dl).saveAs('/private/tmp/ta1-rev1-baseline.txt');
 fs.writeFileSync('/private/tmp/ta1-rev1-baseline.json',JSON.stringify(snapshot));
 assert.equal(request.revision,1);
 fs.writeFileSync(path.join(proof,'REV1_BASELINE.json'),JSON.stringify({baseline:'91ec169e',label:'natural baseline',profile,item:request.item,quantity:request.quantity,revision:request.revision,literal:'/private/tmp/ta1-rev1-baseline.txt',bundleSha256:crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex')},null,2));
 console.log('REV1 BASELINE captured');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
