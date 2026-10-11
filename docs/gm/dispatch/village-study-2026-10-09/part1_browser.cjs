const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1440,height:1050}}),page=await context.newPage(),findings=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
 const record=x=>{findings.push(x);fs.writeFileSync(__dirname+'/PART1_PROGRESS.json',JSON.stringify({findings,errors},null,2));console.log(x);};
 const play=async()=>{const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();const yes=page.getByText('Yes, I want the new version');if(await yes.count())await yes.click();const c=page.locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const shift=async()=>{await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.clock.runFor(122000);await page.locator('#village_return_kit').waitFor();};
 try{
 await page.route('**/resources/js/HackTimer/HackTimer.min.js',r=>r.fulfill({status:200,body:'',contentType:'application/javascript'}));await page.clock.install();await page.goto(process.argv[2],{waitUntil:'domcontentloaded'});await play();
 await page.getByText('Talk to someone',{exact:false}).click();await page.locator('[data-dialogue="villageElder"]').click();await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
 for(let i=1;i<=5;i++){await shift();await page.locator('#village_return_kit').click();const s=await save();assert.equal(s.village_career.completed,i);assert.equal(s.village_career.returned,i);if(i===2)await page.locator('#village_promotion').click();record(`Native round ${i} completed and kit returned (browser clock advanced, no career-state injection).`);}
 await page.locator('#village_promotion').click();let s=await save();assert.equal(s.village_career.rank,2);assert.equal(s.life_record.recent.filter(e=>e.kind==='career').length,2);record('Mentor promotion after five full native rounds and five returns.');
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.locator('#action_end_div').click();await page.locator('#village_keep_kit').click();s=await save();const money=s.character.money;
 // Inject failure at the browser storage boundary, without changing game state.
 await page.evaluate(()=>{window.originalStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Test storage quota','QuotaExceededError');};});
 await page.locator('#village_pay_debt').click();assert.match(await page.locator('#village_career_controls').innerText(),/no room/i);
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalStorageSet;});let failed=await save();assert.equal(failed.character.money,money);assert.equal(failed.village_career.debt,50);record('Quota rejection leaves kit debt and money unchanged.');
 await page.locator('#village_pay_debt').click();s=await save();assert.equal(s.character.money,money-50);assert.equal(s.village_career.debt,0);assert.equal(s.village_career.returned,5);record('Paying 50 coins clears debt without return credit.');
 await page.reload({waitUntil:'domcontentloaded'});await play();assert.equal((await save()).village_career.rank,2);
 const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();await(await dl).saveAs('/tmp/yairpg-village-study-part1.txt');
 const nav=page.waitForEvent('domcontentloaded',{timeout:60000});await page.locator('#saved_file_input').setInputFiles('/tmp/yairpg-village-study-part1.txt');await nav;await play();assert.deepEqual((await save()).village_career,s.village_career);record('Mentor and paid kit survive actual native save, reload, file export and import.');
 // Generated test save with 49 coins for an otherwise hard-to-reach boundary.
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.locator('#action_end_div').click();await page.locator('#village_keep_kit').click();s=await save();s.character.money=49;
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),s);await page.reload({waitUntil:'domcontentloaded'});await play();await page.locator('#village_pay_debt').click();assert.match(await page.locator('#village_career_controls').innerText(),/need 50 coins/);s=await save();assert.equal(s.character.money,49);assert.equal(s.village_career.debt,50);record('Generated 49-coin save refuses debt payment with no money or custody mutation.');
 delete s.village_career;s.current_activity={activity_id:'patrolling',earnings:0,gathering_time:10,gathered_materials:{}};await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),s);await page.reload({waitUntil:'domcontentloaded'});await play();const old=await save();assert.equal(old.village_career.shifts,0);assert.equal(old.village_career.loan,null);assert.equal(old.current_activity.activity_id,'patrolling');record('Old generated save missing career owner retains active native patrol without invented career history.');
 assert.deepEqual(errors,[]);fs.writeFileSync(__dirname+'/PART1_BROWSER.json',JSON.stringify({status:'passed',origin:process.argv[2],findings,errors},null,2));
 }catch(e){fs.writeFileSync(__dirname+'/PART1_BROWSER.json',JSON.stringify({status:'failed',findings,errors,error:e.stack},null,2));await page.screenshot({path:__dirname+'/part1-failure.png'}).catch(()=>{});throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
