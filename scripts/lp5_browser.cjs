// Disposable generated profiles only, assigned LP5 origin only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {openNotebook}=require('./ui_helpers.cjs');
const out=path.resolve('docs/research/hogwarts-legacy/lp5-evidence'),url='http://127.0.0.1:8198/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}), errors=[];
 const open=async fixture=>{const ctx=await browser.newContext({viewport:{width:1366,height:768}});if(fixture)await ctx.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);const page=await ctx.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await play(page);return {page,ctx};};
 const play=async p=>{await p.getByText('PLAY',{exact:true}).click();if(await p.getByText('Confirm',{exact:true}).isVisible())await p.getByText('Confirm',{exact:true}).click();};
 const panel=async(p,people=false)=>{await openNotebook(p);await p.locator(`[data-notebook-view="${people?'people':'here'}"]`).click();const s=people?'#simulation_panel':'#village_panel';if(!await p.locator(s).evaluate(n=>n.open))await p.locator(s+'>summary').click();};
 const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const action=async(p,id)=>{await panel(p);await p.locator(`[data-village-action="${id}"]`).click();};
 const shot=async(p,name)=>{await p.locator('[data-teacher-window]').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,name+'.png')});};
 const state=async p=>(await save(p)).expansion;
 const wait=async(p,fn)=>p.waitForFunction(fn);
 const roundtrip=async(p,label)=>{
   const before=await save(p), encoded=await p.evaluate(()=>window.save_to_file());
   await p.reload();await play(p);await panel(p);
   const reloaded=await save(p);
   assert.deepEqual(reloaded.expansion.actors.player,before.expansion.actors.player,label+' reload player');
   await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.locator('#saved_file_input').setInputFiles({name:`lp5-${label}.txt`,mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
   await play(p);await panel(p);
   const imported=await save(p);
   for(const s of [reloaded,imported]){
     assert.equal(s.character.money,before.character.money,label+' money');
     assert.deepEqual(s.inventories,before.inventories,label+' stock');
     assert.deepEqual(s.expansion.actors.player,before.expansion.actors.player,label+' player');
   }
   return imported;
 };
 let {page:p,ctx}=await open();
 const fingerprint=await p.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);
 assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));
 await p.getByText('Talk to someone',{exact:false}).click();await p.locator('[data-dialogue="villageElder"]').click();await p.locator('[data-textline="hello"]').click();await p.locator('.end_dialogue_button').click();
 await action(p,'village.waypost');await wait(p,()=>document.querySelector('[data-village-read]')?.hidden===false);
 const old=await save(p);assert.equal(old.expansion.actors.player.facts['village.waypostChapterClosed'],undefined);await ctx.close();
 // Fixture only unlocks the known craftsman and supplies ordinary input logs.
 // Discovery and all LP5 causes/results below are actual UI commands.
 const ready=structuredClone(old),wood=JSON.stringify({id:'Rough wood log'});
 ready.character.money=30;ready.inventories.person.main_character[wood]={count:4};
 ready.availabilities.person.oldCraftsman|=1;ready.availabilities.dialogue.oldCraftsman|=1;
 ({page:p,ctx}=await open(ready));
 await p.getByText('Talk to someone',{exact:false}).click();await p.locator('[data-dialogue="oldCraftsman"]').click();await p.locator('[data-textline="hello"]').click();await p.locator('.end_dialogue_button').click();await panel(p);
 await wait(p,()=>!document.querySelector('[data-village-action="village.route_lesson"]').disabled);
 await shot(p,'01-normal-window');const beforeOrder=await save(p);
 await panel(p,true);await p.locator('[data-simulation="enroll"]').click();await p.locator('[data-simulation="village.commission"]').click();
 await panel(p);assert.match(await p.locator('[data-teacher-window]').innerText(),/Commission override/);
 assert.equal(await p.locator('[data-village-action="village.route_lesson"]').isDisabled(),true);
 const pending=await save(p);assert.equal(pending.character.money,beforeOrder.character.money-1);assert.equal(pending.inventories.person.main_character[wood].count,2);
 await shot(p,'02-real-order-override');
 await roundtrip(p,'pending-order');
 await wait(p,()=>!document.querySelector('[data-village-action="village.route_lesson"]').disabled);
 await shot(p,'03-restored-window');
 await panel(p,true);await p.locator('[data-simulation="village.collect"]').click();
 await action(p,'village.return_token');await action(p,'village.route_lesson');
 const tuition=await save(p);assert.equal(tuition.character.money,27);
 await roundtrip(p,'pending-lesson');
 await wait(p,()=>document.querySelector('[data-waypost-phase]')?.textContent.includes('Route: learned'));
 const taught=await save(p);assert.equal(taught.expansion.actors.player.facts['village.routeOrigin'],'teacher');
 await action(p,'village.record_waypost_chapter');const changed=await save(p);
 assert.deepEqual(changed.inventories,taught.inventories);assert.equal(changed.character.money,taught.character.money);
 assert.deepEqual(changed.expansion.actors.player.sources,taught.expansion.actors.player.sources);
 assert.match(await p.locator('[data-waypost-phase]').innerText(),/Account recorded/);
 await shot(p,'04-story-retains-learning');
 const final=await roundtrip(p,'story-complete');
 assert.equal(final.expansion.actors.player.facts['village.waypostChapterClosed'],true);
 assert.equal(await p.locator('[data-village-action="village.record_waypost_chapter"]').isVisible(),false);
 assert.equal(await p.locator('[data-village-action="village.route_lesson"]').isVisible(),false);
 const completed=structuredClone(final);await ctx.close();
 // Closed-hours fixture: same earned profile, only native calendar set to 17:59.
 const late=structuredClone(completed);late['current time'].hour=17;late['current time'].minute=59;
 ({page:p,ctx}=await open(late));await panel(p);
 await wait(p,()=>document.querySelector('[data-teacher-window]')?.textContent.includes('Returns in'));
 assert.match(await p.locator('[data-waypost-phase]').innerText(),/Account recorded.*Route: learned/);
 await shot(p,'05-daily-close-independent');await ctx.close();
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({url,viewport:'1366x768',fingerprint,checks:['native waypost discovery on fresh origin','old profile absent chapter field','normal daily teacher window','real supplied commission consumes 2 logs and 1 coin','order override refuses lesson','pending-order save/reload/Export/literal Import','scheduler completion restores teaching','real kit collected once','paid lesson costs 2 coins','pending lesson persistence','story phase advances without stock/method/reward changes','completed chapter save/reload/Export/literal Import','daily 18:00 closure independent of chapter and learned method'],fixtures:['craftsman availability + 4 logs + 30 coins after native waypost discovery','earned final profile calendar 17:59 for daily close'],errors},null,2));
 console.log('LP5 browser acceptance passed');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
