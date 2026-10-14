const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const URL='http://127.0.0.1:18706/';
const R=require('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const results=[];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});let ctx,p;
 async function open(save){console.log('OPEN',save?.['current time'],save?.absorb_local_life?.parcelStep);
  if(ctx)await ctx.close();ctx=await browser.newContext({viewport:{width:1366,height:768}});p=await ctx.newPage();p.setDefaultTimeout(12000);
  p.on('pageerror',e=>results.push({error:e.message}));
  if(save){await p.goto(URL+'style.css');await p.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),save);}
  await p.goto(URL,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available'),null,{timeout:12000});await R.startFresh(p);await p.locator('#local_life_panel summary').click();
 }
 async function save(){await p.evaluate(()=>saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));}
 async function click(id){await p.locator(`[data-local-life-action="${id}"]`).click();}
 async function checkpoint(label){console.log('CHECK',label);const before=await save();const encoded=await p.evaluate(()=>save_to_file());assert.ok(encoded);await p.reload();await p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available'),null,{timeout:12000});await R.startFresh(p);const reload=await save();assert.deepEqual(reload.absorb_local_life,before.absorb_local_life);
  await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded'}),p.evaluate(payload=>load_progress(payload),encoded)]);await p.waitForFunction(()=>document.querySelector('#workspace_current_work')?.textContent.includes('Saving available'),null,{timeout:12000});await R.startFresh(p);const imported=await save();assert.deepEqual(imported.absorb_local_life,before.absorb_local_life);
  results.push({check:label,result:'PASS',state:before.absorb_local_life});await p.locator('#local_life_panel').evaluate(e=>e.open=true);
 }
 await open();const baseline=await save();assert.equal(baseline.absorb_local_life.schema,3);
 assert.match(await p.locator('#local_life_panel').innerText(),/1 find remains/);
 assert.match(await p.locator('[data-local-life-action="watch"]').innerText(),/watch/i);
 await click('mentor');assert.match(await p.locator('#local_life_panel [role=status]').innerText(),/Elder:/);
 results.push({check:'fresh search, watch opening and mentor',result:'PASS'});
 // Controlled native save checkpoints, distinct from a natural full-day journey.
 let seed=structuredClone(baseline);seed['current time'].hour=7;seed['current time'].minute=0;seed.absorb_local_life.lastClock=null;seed.absorb_local_life.lastLocation='Village';
 await open(seed);await click('watch');assert.match(await p.locator('[data-local-life-action="stop_watch"]').innerText(),/stay until 20:00/);
 await checkpoint('accepted watch save/reload/export/import');
 seed=await save();seed['current time'].hour=19;seed['current time'].minute=59;seed.absorb_local_life.lastClock=null;
 await open(seed);await p.waitForTimeout(2200);const paid=await save();assert.equal(paid.absorb_local_life.watchShifts,1);assert.equal(paid.absorb_local_life.watching,false);assert.equal(paid.character.money,seed.character.money+12);
 await checkpoint('evening watch pays once');
 seed=structuredClone(baseline);seed['current time'].hour=7;seed['current time'].minute=0;seed.absorb_local_life.lastClock=null;
 await open(seed);await click('watch');await click('stop_watch');assert.equal((await save()).absorb_local_life.watchShifts,0);
 results.push({check:'watch voluntary interruption without pay',result:'PASS'});
 seed=structuredClone(baseline);seed.absorb_local_life.visitorMet=true;
 await open(seed);await click('pamphlet');assert.match(await p.locator('[data-local-life-action="parcel"]').innerText(),/elder/);
 assert.equal(await p.locator('[data-local-life-action="parcel"]').isDisabled(),true,'native mill permission preserved');
 await checkpoint('pamphlet unlock and relay gate');
 seed=await save();seed.locations['Eastern mill'].is_unlocked=true;seed.locations.Shack.is_unlocked=true;
 await open(seed);await click('parcel');assert.match(await p.locator('#village_parcel_details').textContent(),/Eastern mill/);
 await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator('.action_travel[data-travel="Eastern mill"]').click();await R.waitLocation(p,'Eastern mill');
 await p.locator('#local_life_panel').evaluate(e=>e.open=true);await click('parcel');await p.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();await p.locator('.action_travel[data-travel="Village"]').click();await R.waitLocation(p,'Village');
 await p.locator('#local_life_panel').evaluate(e=>e.open=true);const purse=(await save()).character.money;await click('parcel');assert.equal((await save()).character.money,purse+8);
 await checkpoint('three stops using ordinary travel and once-only reward');
 await click('parcel_again');assert.equal((await save()).absorb_local_life.parcelStep,0);assert.match(await p.locator('[data-local-life-action=parcel]').innerText(),/1\/3/);results.push({check:'parcel relay explicit repeat remains available',result:'PASS'});
 // Weekly event at the calendar's actual recurring phase.
 seed=structuredClone(baseline);const t=seed['current time'];let m=(((t.year*12+t.month-1)*30+t.day-1)*24)*60;
 const days=(7-Math.floor(m/1440)%7)%7;t.day+=days;t.hour=9;t.minute=0;seed.absorb_local_life.lastClock=null;
 await open(seed);assert.equal(await p.locator('[data-local-life-action="market"]').isDisabled(),false);await click('market');assert.equal(await p.locator('[data-local-life-action="market"]').isDisabled(),true);
 await checkpoint('weekly stall claim survives persistence');
 seed=structuredClone(baseline);seed['current location']='Shack';seed.locations.Shack.is_unlocked=true;seed.absorb_local_life.homeMinutes=1439;seed.absorb_local_life.lastLocation='Shack';seed.absorb_local_life.lastClock=null;
 await open(seed);await p.evaluate(()=>showCharacterBio());await p.locator('#titles_panel').evaluate(e=>e.open=true);await p.waitForTimeout(6500);const home=await save();assert.ok(home.absorb_local_life.homeMinutes>=1440);assert.ok(home.character.titles.homebody);
 results.push({check:'played home counter grants public title',result:'PASS'});
 await checkpoint('home title persistence');
 await p.evaluate(async()=>{const m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);m.add_active_effect('Bleeding',5,true);m.add_active_effect('Bleeding',5,true);window.__effect=m.active_effects.Bleeding.duration;});
 assert.equal(await p.evaluate(()=>window.__effect),10);await p.waitForTimeout(2200);assert.ok(Object.values((await save()).levels).flatMap(Object.values).some(l=>(l.skill_xp['Iron skin']||0)>0));
 results.push({check:'native bleeding duration stacking and resistance XP',result:'PASS'});
 await checkpoint('bleeding save/reload/export/import');
 seed=structuredClone(baseline);seed.absorb_local_life.itemsBought=24;seed.character.money=1000;
 await open(seed);await p.evaluate(()=>showCharacterBio());await p.locator('#titles_panel').evaluate(e=>e.open=true);
 await p.evaluate(()=>{window.__titleCues=[];new MutationObserver(()=>{const e=document.querySelector('#titles_panel .work-ledger-effect');if(e&&!e.hidden&&e.textContent.includes('Title earned'))window.__titleCues.push(e.textContent);}).observe(document.getElementById('titles_panel'),{subtree:true,childList:true,attributes:true});startTrade('villageTrader');});
 const bread=p.locator('#trader_inventory_div .inventory_item_control[data-trader_item]').filter({hasText:'Stale bread'}).first();await bread.click();await p.locator('#accept_trade_button').click();
 assert.equal((await save()).absorb_local_life.itemsBought,25);await p.evaluate(()=>exitTrade());await p.waitForTimeout(5500);
 assert.ok((await save()).character.titles.local_customer);assert.ok((await p.evaluate(()=>window.__titleCues)).some(t=>t.includes('Local Customer')));
 results.push({check:'settled native purchase counter grants anchored title cue',result:'PASS'});
 await p.screenshot({path:'/tmp/p23-life-title-desktop.png',fullPage:false});await checkpoint('purchase title save/reload/export/import');
 assert.equal(await p.locator('#titles_panel .work-ledger-effect').evaluate(e=>e.hidden),true,'no title cue on restore');
 await p.locator('[data-local-life-action=mentor]').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/p23-life-desktop.png',fullPage:false});
 await ctx.close();await browser.close();fs.writeFileSync('/tmp/p23-browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(({state,...x})=>x),null,2));
})().catch(e=>{console.error(e);fs.writeFileSync('/tmp/p23-browser-results.json',JSON.stringify(results,null,2));process.exit(1);});
