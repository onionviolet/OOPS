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
 // P17 replaces raw rat drops with retained carcasses. Acquire their
 // parts through native processing, then check discovery without fake drops.
 await R.leaveCombat(page);
 await page.locator('#harvest_panel').evaluate(e=>e.open=true);
 await page.locator('[data-harvest-choice="whole"]').first().click();
 await page.waitForFunction(()=>document.querySelector('#harvest_receipt'),null,{timeout:30000});
 const saved=JSON.parse(await R.saveText(page));
 const known=Object.keys(saved.item_log).filter(k=>saved.item_log[k].number>0);
 assert.ok(known.length>0);
 const observed=saved.p23_drop_observations;
 const estimate=[];
 assert(saved.harvest.processed>0,'native whole processing completed');
 const parts=['Rat pelt','Rat tail','Rat fang'].filter(id=>saved.item_log[id]?.number>0);
 assert(parts.length>0,'actual carcass parts acquired');
 for(const [name,record] of Object.entries(observed.creatures)) {
   assert.deepEqual(record.drops,{},'rat parts are harvested, never fabricated drop associations');
 }
 const bestiaryText=await page.locator('.bestiary_entry_div').allTextContents();
 assert(bestiaryText.some(t=>t.includes('Observed drops')&&t.includes('No drops observed yet.')));
 assert.equal(await page.locator('.known_loot_value').count(),0,'catalog drop odds stay undisclosed under P11');
 estimate.push(...bestiaryText);
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
 const restored=JSON.parse(await R.saveText(page));assert.deepEqual(restored.p23_drop_observations,observed,'actual drop receipts survive reload');assert.deepEqual(restored.harvest.last,saved.harvest.last,'actual processing receipt survives reload');for(const id of parts)assert.equal(restored.item_log[id].number,saved.item_log[id].number,'acquired part knowledge retained');
 assert.deepEqual(errors,[]);
 const evidence={viewport:'1366x768',fixture:'precombat disposable boundary fixture: matching hero XP 100000, field groups 29, native carcass processing; ambient Math.random 0.01 does not control saved combat streams',clearAfterRealKill:clear,knownItems:known,estimates:estimate,itemLog:sources,reloaded,errors};
 fs.writeFileSync('/tmp/fork-resurvey-20261014/browser.json',JSON.stringify(evidence,null,2));
 console.log(JSON.stringify(evidence,null,2));
 await context.close();await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exit(1)});
