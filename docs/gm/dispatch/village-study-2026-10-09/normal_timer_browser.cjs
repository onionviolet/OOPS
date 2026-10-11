const fs=require('node:fs'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const {decodeSaveFile}=await import(pathToFileURL(process.cwd()+'/src/save_files.js'));
 const text=fs.readFileSync('/tmp/yairpg-village-study-part1.txt','utf8');
 const raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(text.replace(/^YAIR-UTF8-1:/,'')),c=>c.charCodeAt(0))));
 const fixture=decodeSaveFile(text,raw['game version']);
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1600,height:1100}});await context.addInitScript(s=>localStorage.setItem('save data',JSON.stringify(s)),fixture);
 const page=await context.newPage(),findings=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const record=x=>{findings.push(x);fs.writeFileSync(__dirname+'/NORMAL_TIMER_PROGRESS.json',JSON.stringify({findings,errors},null,2));console.log(x);};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 try{
 await page.goto(process.argv[2],{waitUntil:'domcontentloaded'});const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();
 await page.locator('#village_watchcraft_notes').click();await page.locator('#village_watchcraft_read').click();await page.locator('#village_watchcraft_practice').waitFor({timeout:18000});assert.match(await page.locator('#village_watchcraft_status').innerText(),/known yes.*practiced no/);record('Unmodified worker timer completes six-minute native reading on generated schema-1 Mentor fixture.');
 await page.locator('#village_watchcraft_practice').click();await page.waitForFunction(()=>document.querySelector('#village_watchcraft_status')?.textContent.includes('practiced yes'),null,{timeout:18000});await page.locator('#action_end_div').click();let s=await save();const money=s.character.money;
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.waitForFunction(()=>document.querySelector('#village_watchcraft_status')?.textContent.includes('executable now yes'));record('Normal worker timer completes meditation; center displays executable only after borrowing the patrol kit.');
 await page.locator('#village_return_kit').waitFor({timeout:155000});s=await save();assert.equal(s.character.money,money+60);assert.equal(s.village_career.watchcraft.used,true);assert.equal(s.life_record.recent.filter(e=>e.text.includes('first used Tessa')).length,1);await page.locator('#village_return_kit').click();record('Unmodified production HackTimer completes one real-time two-hour game patrol, paying 60 with one biography entry.');
 assert.deepEqual(errors,[]);await page.screenshot({path:__dirname+'/normal-timer-result.png',fullPage:true});fs.writeFileSync(__dirname+'/NORMAL_TIMER_BROWSER.json',JSON.stringify({status:'passed',origin:process.argv[2],findings,errors,fixture:'Generated Part 1 native export, no personal save; fresh origin. No route interception, clock patch, speed helper or progress injection.'},null,2));
 }catch(e){fs.writeFileSync(__dirname+'/NORMAL_TIMER_BROWSER.json',JSON.stringify({status:'failed',findings,errors,error:e.stack},null,2));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
