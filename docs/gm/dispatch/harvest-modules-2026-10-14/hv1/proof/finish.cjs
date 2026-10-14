// Continue the disposable natural journey earned by route/field scripts. Never inject state.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
(async()=>{
 const proof=__dirname,profile=process.env.HV1_PROFILE||'/private/tmp/hv-hv1-profile-natural';
 const browser=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1600,height:1000},acceptDownloads:true});
 const page=browser.pages()[0];page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const save=async()=>{await page.locator('#save_button').click();return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const stock=s=>s.inventories.person.main_character;
 const count=(s,id)=>Object.entries(stock(s)).reduce((n,[k,v])=>n+(JSON.parse(k).id===id?v.count:0),0);
 const projection=s=>({harvest:s.harvest,inventory:stock(s),xp:s.levels.person.main_character.skill_xp.Butchering,streams:s.expansion.streams});
 const shots=async name=>{for(const [width,height]of [[1366,768],[1600,1000]]){await page.setViewportSize({width,height});await page.screenshot({path:path.join(proof,`${name}-${width}.png`)});}};
 try{
 await page.goto('http://127.0.0.1:22430/');await page.locator('#loading_screen_play_button').click();
 let s=await save();assert.ok(s.locations['Infested field'].enemy_groups_killed>=15);assert.ok(s.global_flags.is_crafting_unlocked);
 await page.getByText('Try to craft something',{exact:false}).click();await page.locator('#crafting_mainpage_buttons [data-crafting_category="butchering"]').click();await page.locator('[data-crafting_category="butchering"][data-crafting_subcategory="items"] [data-recipe_id="Piece of wolf rat leather"]').click();
 let crafted=false;
 if(count(s,'Piece of wolf rat leather')>0 && fs.existsSync('/private/tmp/hv1-craft-ready.json')){
   const before=JSON.parse(fs.readFileSync('/private/tmp/hv1-craft-ready.json','utf8'));
   assert.equal(count(before,'Rat pelt')-count(s,'Rat pelt'),6);
   assert.equal(count(s,'Piece of wolf rat leather')-count(before,'Piece of wolf rat leather'),1);
   const used=Object.entries(stock(before)).filter(([k])=>JSON.parse(k).id==='Rat pelt').map(([k,v])=>({key:k,n:v.count-(stock(s)[k]?.count??0)})).filter(r=>r.n>0);
   const quality=Math.round(used.reduce((n,r)=>n+(JSON.parse(r.key).quality??100)*r.n,0)/6/5)*5;
   assert.equal(JSON.parse(Object.keys(stock(s)).find(k=>JSON.parse(k).id==='Piece of wolf rat leather')).quality,quality);
   fs.writeFileSync(path.join(proof,'CRAFT_EVIDENCE.json'),JSON.stringify({label:'natural',used,outputQuality:quality,leatherDelta:1,peltDelta:-6,receiptVerifiedInPriorAttempt:true},null,2));
   crafted=true;await shots('leather');
 }
 for(let attempt=0;!crafted&&attempt<2;attempt++){
   const before=await save();assert.ok(count(before,'Rat pelt')>=6);
   await page.locator('[data-craft-commit]').click();const after=await save();assert.equal(count(before,'Rat pelt')-count(after,'Rat pelt'),6);
   const consumed=Object.entries(stock(before)).filter(([k])=>JSON.parse(k).id==='Rat pelt').map(([k,v])=>({key:k,n:v.count-(stock(after)[k]?.count??0)})).filter(r=>r.n>0);
   const expected=Math.round(consumed.reduce((n,r)=>n+(JSON.parse(r.key).quality??100)*r.n,0)/6/5)*5;
   if(count(after,'Piece of wolf rat leather')>count(before,'Piece of wolf rat leather')){
      const output=Object.entries(stock(after)).find(([k,v])=>JSON.parse(k).id==='Piece of wolf rat leather' && v.count>(stock(before)[k]?.count??0));assert.equal(JSON.parse(output[0]).quality,expected);
      assert.match(await page.locator('#crafting_detail .craft_receipt').innerText(),/Made|Created|Crafted/i);crafted=true;console.log('native leather',output[0],consumed);await shots('leather');break;
   }
 }
 assert.ok(crafted,'Natural paid recipe must produce leather');await page.locator('#exit_crafting_button').click();
 await page.locator('#harvest_panel summary').first().click();await page.locator('[data-harvest="auto"]').uncheck();await page.locator('#harvest_panel summary').first().click();
 await page.waitForTimeout(22000);await page.getByText('Move somewhere else',{exact:false}).click();await page.locator('#location_actions_div').getByText('Enter the [Infested field]',{exact:false}).click();
 for(let i=0;i<30;i++){await page.waitForTimeout(2500);s=await save();if(Object.values(s.harvest.lots).reduce((n,l)=>n+l.length,0)>=2)break;if(s['current location']==='Village')throw Error('Rest/retry route needed for two carcasses');}
 assert.ok(Object.values(s.harvest.lots).reduce((n,l)=>n+l.length,0)>=2);
 await page.locator('#location_actions_div').getByText('Go back to [Village]',{exact:false}).click();await page.locator('#harvest_panel summary').first().click();
 const beforeCancel=await save(),species=Object.keys(beforeCancel.harvest.lots).find(k=>beforeCancel.harvest.lots[k].length);
 await page.locator(`[data-harvest-species="${species}"] [data-harvest-choice="whole"]`).click();await page.locator('[data-harvest="cancel"]').click();const canceled=await save();assert.deepEqual(canceled.harvest.lots,beforeCancel.harvest.lots);
 await page.locator(`[data-harvest-species="${species}"] [data-harvest-choice="whole"]`).click();const pending=await save();assert.equal(pending.harvest.job.choice,'whole');
 await page.reload();await page.locator('#loading_screen_play_button').waitFor();assert.deepEqual(projection(await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),projection(pending));await page.locator('#loading_screen_play_button').click();
 await page.waitForTimeout(5500);const whole=await save();assert.equal(whole.harvest.last.choice,'whole');assert.equal(whole.harvest.last.outputs.length,3);assert.ok(whole.levels.person.main_character.skill_xp.Butchering>pending.levels.person.main_character.skill_xp.Butchering);
 await page.locator('#harvest_panel summary').first().click();const oneSpecies=Object.keys(whole.harvest.lots).find(k=>whole.harvest.lots[k].length);
 await page.locator(`[data-harvest-species="${oneSpecies}"] [data-harvest-choice="tail"]`).click();await page.waitForTimeout(2000);const tail=await save();assert.equal(tail.harvest.last.choice,'tail');assert.equal(count(tail,'Rat tail'),count(whole,'Rat tail')+1);assert.equal(count(tail,'Rat pelt'),count(whole,'Rat pelt'));assert.equal(count(tail,'Rat fang'),count(whole,'Rat fang'));await shots('processing');
 // Ordinary player UI has no inspector. Explicit developer opt-in shows only this slice's inputs.
 assert.equal(await page.locator('#harvest_inspector').count(),0);
 const stable=await save();await page.reload();await page.locator('#loading_screen_play_button').waitFor();assert.deepEqual(projection(await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),projection(stable));await page.locator('#loading_screen_play_button').click();const reloaded=await save();assert.deepEqual(projection(reloaded),projection(stable));
 const downloadPromise=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const download=await downloadPromise,literal='/private/tmp/hv1-natural-literal.txt';await download.saveAs(literal);
 const {decodeSaveFile}=await import(path.join(process.cwd(),'src/save_files.js'));const exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');
 const importedBrowser=await chromium.launchPersistentContext('/private/tmp/hv-hv1-profile-import-'+Date.now(),{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
 const ip=importedBrowser.pages()[0];ip.on('pageerror',e=>errors.push(e.message));await ip.goto('http://127.0.0.1:22430/');await ip.locator('#loading_screen_play_button').click();await ip.locator('#hero_creation_name_field').fill('TEST FIXTURE HV HV1 IMPORT');await ip.locator('#hero_creation_panel_confirmation').click();
 await Promise.all([ip.waitForNavigation({waitUntil:'domcontentloaded'}),ip.locator('#saved_file_input').setInputFiles(literal)]);
 const imported=await ip.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.deepEqual(projection(imported),projection(exported));await ip.locator('#loading_screen_play_button').click();await ip.locator('#save_button').click();assert.deepEqual(projection(await ip.evaluate(()=>JSON.parse(localStorage.getItem('save data')))),projection(exported));await ip.screenshot({path:path.join(proof,'literal-import-1366.png')});await importedBrowser.close();
 await page.goto('http://127.0.0.1:22430/?harvest-inspector=1');await page.locator('#loading_screen_play_button').click();await page.locator('#harvest_panel summary').first().click();assert.equal(await page.locator('#harvest_inspector').count(),1);
 const bundle=fs.readFileSync('dist/bundle.js'),served=await(await page.request.get('http://127.0.0.1:22430/dist/bundle.js')).body();assert.deepEqual(served,bundle);assert.deepEqual(errors,[]);
 const evidence={label:'natural',profile,hero:'TEST FIXTURE HV HV1 NATURAL',kills:exported.enemy_killcount,viewports:['1366x768','1600x1000'],recipePaidGradedQuality:true,manualWhole:true,manualTailOnly:true,cancelReturnsExactLot:true,pendingReloadExact:true,completedReloadExact:true,exportLiteralImportSecondProfileExact:true,inspectorOnlyExplicitOptIn:true,pageErrors:errors,bundleSha256:crypto.createHash('sha256').update(bundle).digest('hex')};fs.writeFileSync(path.join(proof,'BROWSER_EVIDENCE.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
 }catch(e){await page.screenshot({path:path.join(proof,'attempt.png')});console.log((await page.locator('body').innerText()).slice(-5000));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
