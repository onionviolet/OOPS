const fs=require('node:fs'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const {decodeSaveFile}=await import(pathToFileURL(process.cwd()+'/src/save_files.js'));
 const text=fs.readFileSync('/tmp/yairpg-village-study-final.txt','utf8');
 const raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(text.replace(/^YAIR-UTF8-1:/,'')),c=>c.charCodeAt(0))));
 const fixture=decodeSaveFile(text,raw['game version']);
 fixture.village_career.rank=2;fixture.village_career.shifts=Math.max(5,fixture.village_career.shifts);fixture.village_career.completed=5;fixture.village_career.returned=5;fixture.village_career.loan=null;fixture.village_career.debt=0;fixture.village_career.schema=2;delete fixture.village_career.recruit;
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1600,height:1100}});await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
 const page=await context.newPage(),findings=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log(m.text());});page.setDefaultTimeout(15000);
 const record=x=>{findings.push(x);console.log(x);fs.writeFileSync(__dirname+'/NORMAL_TIMER_PROGRESS.json',JSON.stringify({findings,errors},null,2));};
 const play=async()=>{const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const exportImport=async name=>{const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const path='/tmp/yairpg-mentor-'+name+'.txt';await(await dl).saveAs(path);const nav=page.waitForEvent('domcontentloaded',{timeout:60000});await page.locator('#saved_file_input').setInputFiles(path);await nav;await play();};
 const start=async()=>{await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();};
 try{
 await page.goto(process.argv[2],{waitUntil:'domcontentloaded'});await play();await page.locator('#village_assign_recruit').click();await start();await page.locator('#village_teach_recruit').click();
 await page.waitForFunction(()=>document.querySelector('#village_mentor_status')?.textContent.includes('5/5 minutes'),null,{timeout:18000});let s=await save();assert.equal(s.village_career.recruit.practiceMinutes,5);record('Unmodified worker timer completes five teaching minutes on a native shared patrol.');
 await page.locator('#action_end_div').click();await page.locator('#village_return_kit').click();await page.locator('#village_recruit_solo').click();s=await save();const money=s.character.money;
 await page.waitForFunction(()=>document.querySelector('#village_mentor_status')?.textContent.includes('1 solo patrol'),null,{timeout:155000});s=await save();assert.equal(s.character.money,money+10);assert.equal(s.life_record.recent.filter(e=>e.text.includes('Iona first patrolled')).length,1);assert.equal(s.village_career.recruit.taughtBy,s.character.name);record('Unmodified production worker timer completes 120-minute solo patrol with +10 stipend, teacher memory and one biography.');
 await page.screenshot({path:__dirname+'/normal-timer-result.png',fullPage:true});assert.deepEqual(errors,[]);fs.writeFileSync(__dirname+'/NORMAL_TIMER_BROWSER.json',JSON.stringify({status:'passed',origin:process.argv[2],findings,errors,timerPolicy:'Unmodified production HackTimer; no clock patch, route interception or progress injection. Generated schema-2 Mentor fixture.'},null,2));
 }catch(e){fs.writeFileSync(__dirname+'/NORMAL_TIMER_BROWSER.json',JSON.stringify({status:'failed',findings,errors,error:e.stack},null,2));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
