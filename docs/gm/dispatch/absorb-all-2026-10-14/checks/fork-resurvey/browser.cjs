const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('assert/strict');
fs.mkdirSync('/tmp/fork-resurvey-20261014',{recursive:true});
process.env.URL='http://127.0.0.1:18703/';
const R=require(process.cwd()+'/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,channel:"chrome"});
 const context=await browser.newContext({viewport:{width:1366,height:768}});
 // Controlled RNG gives a reproducible native positive drop. Not natural balance proof.
 await context.addInitScript(()=>{Math.random=()=>0.01;});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.stack));
 let save=JSON.parse(fs.readFileSync('docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/precombat.save.txt','utf8'));
 // Disposable generated boundary fixture, not a user save or a natural progression claim.
 save.levels.person.main_character.total_xp=100000;save.character.xp.total_xp=100000;
 save.locations['Infested field'].enemy_groups_killed=29;
 await page.goto(R.URL+'style.css');
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),save);
 await page.goto(R.URL);try {await R.startFresh(page);}catch(e){console.log('STARTERROR',errors);console.log((await page.locator('body').innerText()).slice(0,1600));await page.screenshot({path:'/tmp/fork-resurvey-20261014/start-error.png'});throw e;}
 
 assert.equal(await page.locator('.known_loot_value').count(),0);
 await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
 await page.locator('#location_actions_div .action_travel[data-travel="Infested field"]').first().click();
 await R.waitLocation(page,'Infested field');
 console.log('ENTERED',await page.locator('#clear_count_div').innerText());
 await page.waitForFunction(()=>document.querySelector('#clear_count_div').innerText.includes('Clears: [2]'),null,{timeout:60000});
 const clear=await page.locator('#clear_count_div').innerText();
 assert.match(clear,/known milestone: 4 clears/);
 assert.ok(!clear.includes('10 clears'));
 await page.screenshot({path:'/tmp/fork-resurvey-20261014/combat.png'});
 // P11 replaces catalog odds with durable actual drop receipts. Keep the
 // acquired-only discovery gate and assert exact native associations/counts.
 await page.waitForFunction(()=>{window.saveProgress();const s=JSON.parse(localStorage.getItem('save data'));return Object.values(s.p23_drop_observations?.creatures||{}).some(c=>Object.keys(c.drops).length);},null,{timeout:120000});
 await R.leaveCombat(page);
 const saved=JSON.parse(await R.saveText(page));
 const known=Object.keys(saved.item_log).filter(k=>saved.item_log[k].number>0);
 assert.ok(known.length>0);
 const observed=saved.p23_drop_observations;
 const estimate=[];
 for(const [name,record] of Object.entries(observed.creatures)) {
   const entry=page.locator('.bestiary_entry_div').filter({has:page.getByText(name,{exact:true})}).first();
   const text=await entry.innerText();
   assert.match(text,/Observed drops/);
   for(const [id,count] of Object.entries(record.drops)) {
     assert(saved.item_log[id]?.number>0,'observed drop is acquired');
     assert(text.includes(`${id}: ${count} acquired`),`exact observed ${name}/${id}`);
   }
   assert(!/Drop chance|Known loot estimate/.test(text),'no catalog odds or unobserved value projection');
   estimate.push(text);
 }
 await page.locator('#journal_show_bestiary').click();
 await page.locator('.bestiary_entry_div').first().hover();
 assert.ok(await page.locator('.bestiary_entry_tooltip').first().isVisible());
 await page.screenshot({path:'/tmp/fork-resurvey-20261014/bestiary.png'});
 // Open the native journal and data view through its existing controls.
 await page.locator('#journal_show_data').click();
 const sources=await page.locator('#item_log_table').innerText();
 assert.match(sources,/Known bestiary sources/);
 assert.ok(/Wolf rat|Starving wolf rat/.test(sources));
 await page.evaluate(()=>document.getElementById('item_log_table').scrollIntoView());
 await page.screenshot({path:'/tmp/fork-resurvey-20261014/desktop.png'});
 await page.reload();await R.startFresh(page);
 await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
 await page.locator('#location_actions_div .action_travel[data-travel="Infested field"]').first().click();
 await R.waitLocation(page,'Infested field');
 const reloaded=await page.locator('#clear_count_div').innerText();
 const savedClears=Math.floor(saved.locations['Infested field'].enemy_groups_killed/15);
 const next=[2,4,10].find(n=>n>savedClears);assert.equal(reloaded,`Clears: [${savedClears}]`+(next?` · known milestone: ${next} clears`:''));
 await R.leaveCombat(page);
 assert.deepEqual(JSON.parse(await R.saveText(page)).p23_drop_observations,observed,'actual observed drop receipts survive reload');
 assert.deepEqual(errors,[]);
 const evidence={viewport:'1366x768',fixture:'precombat disposable boundary fixture: matching hero XP 100000, field groups 29, controlled Math.random 0.01',clearAfterRealKill:clear,knownItems:known,estimates:estimate,itemLog:sources,reloaded,errors};
 fs.writeFileSync('/tmp/fork-resurvey-20261014/browser.json',JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
 await context.close();await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exit(1)});
