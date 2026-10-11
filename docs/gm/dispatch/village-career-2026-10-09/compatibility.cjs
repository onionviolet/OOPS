const fs=require('node:fs'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const {decodeSaveFile}=await import(pathToFileURL(process.cwd()+'/src/save_files.js'));
 // Only this lane's generated native UI export, never a personal save.
 const text=fs.readFileSync('/tmp/yairpg-village-career-export.txt','utf8');
 const raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(text.replace(/^YAIR-UTF8-1:/,'')),c=>c.charCodeAt(0))));
 const s=decodeSaveFile(text,raw['game version']);delete s.village_career;
 s.current_activity={activity_id:'patrolling',earnings:0,gathering_time:10,gathered_materials:{}};
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const context=await browser.newContext(),errors=[];
 await context.addInitScript(data=>localStorage.setItem('save data',JSON.stringify(data)),s);
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 try {
 await page.goto(process.argv[2],{waitUntil:'domcontentloaded'});
 const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();
 await page.locator('#action_end_div').waitFor();
 await page.evaluate(()=>window.saveProgress());let loaded=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 assert.equal(loaded.village_career.shifts,0);assert.equal(loaded.village_career.loan,null);assert.equal(loaded.current_activity.activity_id,'patrolling');assert(loaded.current_activity.gathering_time>=10);
 await page.locator('#action_end_div').click();
 await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await page.evaluate(()=>window.saveProgress());
 loaded=await page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.equal(loaded.village_career.shifts,1);assert.equal(loaded.village_career.loan.status,'active');assert.deepEqual(errors,[]);
 fs.writeFileSync(__dirname+'/COMPATIBILITY.json',JSON.stringify({status:'passed',origin:process.argv[2],errors,findings:['Generated v0.6 native save with the new optional field removed loads an already-active legacy patrol with retained timer and no fabricated loan, career, or debt.','Finishing the legacy patrol and starting a new native patrol creates exactly one career shift and loan.']},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
