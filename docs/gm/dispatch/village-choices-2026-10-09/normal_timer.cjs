const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const origin=process.argv[2],fixture=JSON.parse(fs.readFileSync(__dirname+'/GENERATED_FIXTURE.json','utf8'));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1600,height:1100}});await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const play=async()=>{const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});await play();await page.locator('#village_assign_recruit').click();await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.locator('#village_teach_time').click();
  const money=(await save()).character.money;await page.locator('#action_end_div').click();assert.equal((await save()).current_activity.activity_id,'patrolling');
  await page.waitForFunction(()=>document.querySelector('#village_mentor_status')?.textContent.includes('5/5 minutes'),null,{timeout:18000});assert.equal((await save()).village_career.recruit.practiceMinutes,5);
  await page.locator('#action_end_div').click();assert.equal((await save()).current_activity.activity_id,'patrolling');
  await page.locator('#village_return_kit').waitFor({timeout:150000});let s=await save();assert.equal(s.character.money,money);assert.equal(s.village_career.completed,6);await page.locator('#village_return_kit').click();await save();await page.reload({waitUntil:'domcontentloaded'});await play();s=await save();assert.equal(s.village_career.recruit.teachingTerms.at(-1),'time');assert.equal(s.character.money,money);assert.deepEqual(errors,[]);
  await page.screenshot({path:__dirname+'/normal-timer.png',fullPage:true});fs.writeFileSync(__dirname+'/NORMAL_TIMER.json',JSON.stringify({status:'passed',origin,errors,findings:['Unmodified production HackTimer: Time teaches five lesson minutes, blocks early exit after lesson, finishes a fresh 120-minute shift with zero wages and one full-shift credit, retains terms and money after save/reload.'],timerPolicy:'No routing, clock patch or progress injection; generated schema-3 Mentor fixture.'},null,2));console.log('Normal timer Time shift passed.');
 }catch(e){fs.writeFileSync(__dirname+'/NORMAL_TIMER.json',JSON.stringify({status:'failed',errors,error:e.stack},null,2));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
