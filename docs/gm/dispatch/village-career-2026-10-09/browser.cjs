const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
const dir=__dirname, findings=[],errors=[];
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu','--use-angle=swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1050}});
 const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',e=>errors.push(e.message));
 const record=x=>{findings.push(x);fs.writeFileSync(dir+'/BROWSER_PROGRESS.json',JSON.stringify({findings,errors},null,2));console.log(x);};
 const play=async()=>{const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();const yes=page.getByText('Yes, I want the new version');if(await yes.count())await yes.click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 try {
 await page.goto(process.argv[2],{waitUntil:'domcontentloaded'});await play();
 record('Fresh origin opened the rebuilt vanilla game.');
 fs.writeFileSync(dir+'/opening-ui.txt',await page.locator('body').innerText());
 await page.getByText('Talk to someone',{exact:false}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
 await page.locator('#village_career_controls').waitFor();
 assert.match(await page.locator('#village_career_controls').innerText(),/Complete 2 full shifts \(0\/2\)/);
 await page.getByText('Find work',{exact:false}).click();
 await page.locator('[data-activity="patrolling"]').click();
 const initial=await save();assert.equal(initial.village_career.loan.status,'active');
 record('Native job starts a loaned patrol kit; opening shows exact promotion requirements.');
 await page.reload({waitUntil:'domcontentloaded'});await play();
 const resumed=await save();assert.equal(resumed.village_career.shifts,1);assert.equal(resumed.village_career.loan.status,'active');
 record('Active native patrol save/reload restores the same shift and loan without duplication.');
 await page.waitForFunction(()=>!!document.querySelector('#village_return_kit'),null,{timeout:155000});
 let paid=await save();assert.equal(paid.village_career.completed,1);assert.equal(paid.character.money,initial.character.money+50);
 assert.match(await page.locator('#village_career_controls').innerText(),/stayed for the whole round/);
 await page.locator('#village_return_kit').click();let returned=await save();assert.equal(returned.village_career.returned,1);assert.equal(returned.village_career.loan,null);
 record('Played full native two-hour shift, got 50 coins, heard Tessa remember it, and returned the kit.');
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();
 await page.waitForFunction(()=>!!document.querySelector('#village_return_kit'),null,{timeout:155000});
 await page.locator('#village_return_kit').click();await page.locator('#village_promotion').click();
 let promoted=await save();assert.equal(promoted.village_career.rank,1);assert.equal(promoted.life_record.recent.filter(e=>e.kind==='career').length,1);
 assert.match(await page.locator('#village_career_controls').innerText(),/Complete 5 full shifts \(2\/5\)/);
 await page.screenshot({path:dir+'/promotion.png',fullPage:true});
 record('Two played shifts unlock Dependable worker, append exactly one career memory, and show the Mentor gate.');
 await page.reload({waitUntil:'domcontentloaded'});await play();let reloaded=await save();assert.equal(reloaded.village_career.rank,1);assert.equal(reloaded.village_career.returned,2);
 const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const exported=await download;await exported.saveAs('/tmp/yairpg-village-career-export.txt');
 const nav=page.waitForEvent('domcontentloaded',{timeout:60000});await page.locator('#saved_file_input').setInputFiles('/tmp/yairpg-village-career-export.txt');await nav;await play();
 let imported=await save();assert.deepEqual(imported.village_career,promoted.village_career);assert.equal(imported.life_record.recent.filter(e=>e.kind==='career').length,1);
 record('Actual UI export file imports through native loader; promotion, kit history and career biography survive reload/import.');
 // Failure and debt paths use another real native shift, cancelled early.
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.locator('#action_end_div').click();
 let cancelled=await save();assert.equal(cancelled.village_career.completed,2);
 await page.locator('#village_keep_kit').click();let debt=await save();assert.equal(debt.village_career.debt,50);
 await page.reload({waitUntil:'domcontentloaded'});await play();assert.match(await page.locator('#village_career_controls').innerText(),/50-coin debt/);
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();assert.equal((await save()).village_career.shifts,3);
 await page.locator('#village_return_kit').click();assert.equal((await save()).village_career.debt,0);
 record('Early departure earns no credit; kept kit debt persists, blocks another loan and clears on return.');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(dir+'/BROWSER.json',JSON.stringify({origin:process.argv[2],findings,errors,status:'passed'},null,2));
 } catch(e){await page.screenshot({path:dir+'/failure.png',fullPage:true}).catch(()=>{});fs.writeFileSync(dir+'/failure-ui.txt',await page.locator('body').innerText());fs.writeFileSync(dir+'/BROWSER.json',JSON.stringify({findings,errors,status:'failed',error:e.stack},null,2));throw e;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
