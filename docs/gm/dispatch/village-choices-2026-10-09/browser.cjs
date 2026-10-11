const fs=require('node:fs'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const {chromium}=require('/tmp/yairpg-nonfactorio-proof-tools/node_modules/playwright');
(async()=>{
 const root=__dirname,origin=process.argv[2],receipt=process.env.CHOICES_ONLY?'BROWSER_'+process.env.CHOICES_ONLY.toUpperCase():'BROWSER';
 const {decodeSaveFile}=await import(pathToFileURL(process.cwd()+'/src/save_files.js'));
 const {addVillageRecruit}=await import(pathToFileURL(process.cwd()+'/src/npc_lives.js'));
 let seed;
 if(fs.existsSync('/tmp/yairpg-village-study-final.txt')) {
  const text=fs.readFileSync('/tmp/yairpg-village-study-final.txt','utf8');
  const raw=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(text.replace(/^YAIR-UTF8-1:/,'')),c=>c.charCodeAt(0))));
  seed=decodeSaveFile(text,raw['game version']);
 }else seed=JSON.parse(fs.readFileSync(root+'/GENERATED_FIXTURE.json','utf8'));
 Object.assign(seed.village_career,{rank:2,shifts:Math.max(5,seed.village_career.shifts),completed:5,returned:5,loan:null,debt:0,schema:3,recruit:null});
 seed.village_career.watchcraft={issued:true,practiceMinutes:5,used:false};
 delete seed.current_activity;
 fs.writeFileSync(root+'/GENERATED_FIXTURE.json',JSON.stringify(seed,null,2));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-gpu']});
 const findings=[],errors=[];
 const record=x=>{findings.push(x);console.log(x);fs.writeFileSync(root+'/'+receipt+'_PROGRESS.json',JSON.stringify({findings,errors},null,2));};
 async function journey(name,fixture,fn){
  const context=await browser.newContext({viewport:{width:1600,height:1100}});
  await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(name+': '+e.message));page.on('console',m=>{if(m.type()==='error')console.log(name+': '+m.text());});
  const play=async()=>{const b=page.locator('#loading_screen_play_button:not(.none_display)');await b.waitFor({timeout:60000});assert.equal((await b.innerText()).trim(),'PLAY');await b.click();};
  const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
  const run=async ms=>{await page.clock.runFor(ms);};
  const click=async id=>{await page.locator('#'+id).click();await run(300);};
  const reload=async()=>{await page.reload({waitUntil:'domcontentloaded'});await play();await run(300);};
  const exchange=async label=>{const dl=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const path='/tmp/yairpg-choices-'+name+'-'+label+'.txt';await(await dl).saveAs(path);const nav=page.waitForEvent('domcontentloaded',{timeout:60000});await page.locator('#saved_file_input').setInputFiles(path);await nav;await play();await run(300);};
  const start=async()=>{await page.getByText('Find work',{exact:false}).click();await page.locator('[data-activity="patrolling"]').click();await run(300);};
  try{
   await page.route('**/resources/js/HackTimer/HackTimer.min.js',r=>r.fulfill({status:200,body:'',contentType:'application/javascript'}));await page.clock.install();await page.goto(origin,{waitUntil:'domcontentloaded'});await play();await run(300);
   await fn({page,play,save,run,click,reload,exchange,start});await page.screenshot({path:root+'/'+name+'.png',fullPage:true});
  }catch(e){fs.writeFileSync(root+'/failure-ui.txt',await page.locator('body').innerText());throw new Error(name+': '+e.stack);}finally{await context.close();}
 }
 try{
 for(const [term,payout] of [['paid',70],['pay',50],['time',0],['favor',60],['free',60]]){
  if(['study','extra'].includes(process.env.CHOICES_ONLY))continue;
  await journey(term,structuredClone(seed),async({page,save,run,click,reload,exchange,start})=>{
   let s=await save();assert.equal(s.village_career.schema,4);assert.equal(s.village_career.recruit,null);assert.equal(s.village_career.completed,5);
   await click('village_assign_recruit');assert.match(await page.locator('#village_teach_paid').innerText(),/default/);
   for(const t of ['paid','pay','time','favor','free'])assert.equal(await page.locator('#village_teach_'+t).isDisabled(),true);
   await start();const preview=await page.locator('#village_teach_'+term).innerText();assert.match(preview,term==='pay'?/lost wages/:term==='paid'?/stipend/:term==='time'?/120/:term==='favor'?/owes/:/no coin cost/);
   await page.locator('#village_career_controls').screenshot({path:root+'/'+term+'-preview.png'});
   s=await save();const before=s.character.money;
   await click('village_teach_'+term);await click('action_end_div');s=await save();assert.equal(s.current_activity.activity_id,'patrolling');assert.equal(s.village_career.loan.teachingTerm,term);
   await run(2000);await save();await reload();await exchange('partial');s=await save();assert.equal(s.village_career.loan.teachingTerm,term);assert(s.village_career.recruit.practiceMinutes<5);
   await run(6000);s=await save();assert.equal(s.village_career.recruit.practiceMinutes,5);assert.equal(s.village_career.recruit.favors,term==='favor'?1:0);
   if(term==='time'){await click('action_end_div');s=await save();assert.equal(s.current_activity.activity_id,'patrolling');assert.equal(s.character.money,before);}
   await run(125000);await page.locator('#village_return_kit').waitFor();s=await save();assert.equal(s.character.money,before+payout);assert.equal(s.village_career.completed,6);
   assert.match(await page.locator('#village_mentor_status').innerText(),term==='pay'?/taught on your shift/:term==='paid'?/paid mentor/:new RegExp(term));
   await click('village_return_kit');await save();await reload();await exchange('completed');s=await save();assert.equal(s.character.money,before+payout);assert.equal(s.village_career.recruit.teachingTerms.at(-1),term);
   if(term==='favor'||term==='free'){
    const cover=term==='favor';const credit=s.village_career.completed;
    await click(cover?'village_recruit_cover':'village_recruit_solo');await run(2000);await save();await reload();await exchange('solo');s=await save();assert.equal(s.village_career.recruit.covering,cover);if(cover)assert.equal(s.village_career.recruit.favors,0);
    const money=s.character.money;
    // Verify durable rejection on tuition's later payout separately from a partial solo import.
    await run(125000);s=await save();assert.equal(s.character.money,money+(cover?50:10));assert.equal(s.village_career.recruit.soloPatrols,1);assert.equal(s.village_career.completed,credit);assert.equal(s.village_career.recruit.tuition,'offered');
    if(cover){assert.equal(await page.locator('#village_recruit_cover').count(),0);await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Test quota','QuotaExceededError');};});await click('village_tuition_accept');await page.evaluate(()=>Storage.prototype.setItem=window.originalSet);s=await save();assert.equal(s.village_career.recruit.tuition,'offered');assert.equal(s.character.money,money+50);}
    await click(cover?'village_tuition_accept':'village_tuition_decline');s=await save();assert.equal(s.character.money,money+(cover?55:10));assert.equal(s.village_career.recruit.tuition,cover?'accepted':'declined');assert.equal(await page.locator('#village_tuition_accept').count(),0);
    await reload();await exchange('tuition');s=await save();assert.equal(s.village_career.recruit.tuition,cover?'accepted':'declined');assert.equal(s.character.money,money+(cover?55:10));
    await run(3000);s=await save();assert.equal(s.character.money,money+(cover?55:10));
    record(cover?'Favor granted once, consumed for one covered shift, +50 with no career credit; quota-rejected tuition gives no coins; accepted +5 tuition survives reload/import.':'Free teaches without obligation; first solo pays +10; tuition declined with no transfer and memory survives reload/import.');
   }
   record(term+': preview, blocked early exit, partial save/reload/file import, five lesson minutes, full shift payout '+payout+', completed save/reload/file import passed.');
  });
 }
 const unstudied=structuredClone(seed);unstudied.village_career.watchcraft={issued:false,practiceMinutes:0,used:false};delete unstudied.books['Tessa’s watchcraft notes'];
 for(const entries of Object.values(unstudied.availabilities))for(const key of Object.keys(entries))if(key.includes('watchcraft'))entries[key]=1;
 const bookKey=Object.keys(unstudied.inventories.person.main_character).find(k=>k.includes('watchcraft'));if(bookKey)delete unstudied.inventories.person.main_character[bookKey];
 for(const route of (process.env.CHOICES_ONLY==='extra'?[]:['tutor','notes']))await journey('study-'+route,structuredClone(unstudied),async({page,save,run,click,reload,exchange,start})=>{
  const money=(await save()).character.money;
  await click('village_watchcraft_'+route);
  if(route==='tutor'){
   await run(2000);await save();await reload();await exchange('partial');await run(6500);let s=await save();assert.equal(s.village_career.watchcraft.tutorMinutes,6);assert.equal(s.village_career.watchcraft.practiceMinutes,0);assert.equal(s.books['Tessa’s watchcraft notes'],undefined);assert.match(await page.locator('#village_watchcraft_status').innerText(),/known yes/);
   // Notes remain reachable even after choosing instruction.
   await click('village_watchcraft_notes');
  }else{await click('village_watchcraft_read');await run(8000);let s=await save();assert.equal(s.books['Tessa’s watchcraft notes'].accumulated_time,6);}
  await click('village_watchcraft_practice');await run(6500);await click('action_end_div');let s=await save();assert.equal(s.village_career.watchcraft.practiceMinutes,5);assert.equal(s.character.money,money);
  await start();await run(125000);await page.locator('#village_return_kit').waitFor();s=await save();assert.equal(s.character.money,money+60);await click('village_return_kit');await save();await reload();await exchange('final');s=await save();assert.equal(s.character.money,money+60);assert.equal(s.village_career.watchcraft.practiceMinutes,5);record(route+': six native study minutes, five practice minutes, +60 executable patrol, save/reload/file import.');
 });
 const kit=structuredClone(seed);kit.village_career.rank=0;kit.village_career.watchcraft={issued:false,practiceMinutes:0,used:false};
 await journey('kit-career',kit,async({page,save,run,click,reload,exchange,start})=>{
  await click('village_promotion');assert.equal((await save()).village_career.rank,1);await click('village_promotion');assert.equal((await save()).village_career.rank,2);
  const initial=await save();await start();await click('action_end_div');await click('village_keep_kit');let s=await save();assert.equal(s.village_career.debt,50);assert.equal(s.village_career.completed,initial.village_career.completed);await click('village_return_kit');s=await save();assert.equal(s.village_career.debt,0);assert.equal(s.village_career.returned,initial.village_career.returned);
  await start();await click('action_end_div');await click('village_keep_kit');await save();await reload();await exchange('debt');const money=(await save()).character.money;await click('village_pay_debt');s=await save();assert.equal(s.character.money,money-50);assert.equal(s.village_career.loan,null);assert.equal(s.village_career.returned,initial.village_career.returned);await save();await reload();await exchange('paid');s=await save();assert.equal(s.character.money,money-50);assert.equal(s.village_career.debt,0);record('Existing choices regression: explicit two promotions, early shift exit without credit, kit kept as debt, debt cleared by returning or paying exactly 50, save/reload/import.');
 });
 await journey('choices-menu',structuredClone(seed),async({page,click,start})=>{
  await click('village_assign_recruit');await start();await page.locator('#village_teach_free').scrollIntoViewIfNeeded();await page.screenshot({path:root+'/choices-menu-visible.png',fullPage:true});
 });
 const historic=structuredClone(seed);historic.npc_lives=addVillageRecruit(historic.npc_lives,999,1);historic.village_career.recruit={id:'iona',known:true,practiceMinutes:5,taughtBy:historic.character.name,soloPatrols:1,soloRemaining:null};
 await journey('old-schema-3',historic,async({page,save,reload,exchange})=>{let s=await save();assert.equal(s.village_career.schema,4);assert.deepEqual(s.village_career.recruit.teachingTerms,['pay']);assert.equal(s.village_career.recruit.favors,0);assert.equal(s.village_career.recruit.tuition,'none');assert.match(await page.locator('#village_mentor_status').innerText(),/taught on your shift/);await reload();await exchange('migrated');s=await save();assert.equal(s.village_career.recruit.soloPatrols,1);record('Historical schema-3 taught recruit migrates to taught on your shift, preserving teacher and solo history without invented favors or tuition.');});
 assert.deepEqual(errors,[]);fs.writeFileSync(root+'/'+receipt+'.json',JSON.stringify({status:'passed',origin,findings,errors,timerPolicy:'Fresh isolated browser contexts, generated schema-3 fixtures from prior generated study proof. HackTimer suppressed; Playwright accelerates common native ticks. No private saves.'},null,2));
 }catch(e){fs.writeFileSync(root+'/'+receipt+'.json',JSON.stringify({status:'failed',origin,findings,errors,error:e.stack},null,2));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
