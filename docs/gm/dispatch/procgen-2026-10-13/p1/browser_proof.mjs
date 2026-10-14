import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const folder=new URL('./',import.meta.url).pathname;
const profile=`/private/tmp/procgen-p1-profile-${Date.now()}`;
const context=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
const page=context.pages()[0],errors=[];
page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});
await context.addInitScript(()=>{const original=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>{if(a instanceof Uint32Array&&a.length===1){a[0]=43;return a;}return original(a);};});
const bind=async()=>{await page.evaluate(async()=>{window.__m=await import(document.querySelector('script[src*="dist/bundle.js"]').src);});
    await page.waitForFunction(async()=> (await navigator.locks.query()).held.some(r=>r.name==='yairpg-save:save data'));};
const save=()=>page.evaluate(()=>{const original=Storage.prototype.setItem;let wrote=false;
    Storage.prototype.setItem=function(k,v){if(this===localStorage&&k==='save data')wrote=true;return original.call(this,k,v);};
    try {window.saveProgress();}finally{Storage.prototype.setItem=original;}
    if(!wrote)throw Error('Manual Save did not write.');return JSON.parse(localStorage.getItem('save data'));});
const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const projection=s=>({streams:s.expansion.streams,encounter:s.native_encounter,
    inventory:s.inventories.person.main_character,levels:s.levels.person.main_character,stock:s.inventories.trader,
    purse:s.character.money,kills:Object.values(s.enemy_killcount).reduce((a,b)=>a+b,0),hits:s.total_hits_done,crits:s.total_crits_done});
try {
    await page.goto('http://127.0.0.1:19310');await page.locator('#loading_screen_play_button').click();
    await page.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN P1 replay');await page.locator('#hero_creation_panel_confirmation').click();await bind();
    await page.evaluate(()=>{__m.add_xp_to_character(2000000,true);__m.unlock_location({location:__m.get_context().locations['Infested field']});});
    console.log('fixture created through native XP/unlock APIs');
    await page.evaluate(()=>window.change_location({location_id:'Infested field',skip_travel_time:true}));
    await page.waitForTimeout(2500);const earned=await save();
    console.log('earned',earned.total_kills,earned.total_hits_done,earned.native_encounter?.enemies.length);
    await page.screenshot({path:folder+'fight-1366.png'});
    // Save a pending native fight, then run native timers and note the resulting
    // decisions/loot. Reopening that exact saved checkpoint must reproduce it.
    const checkpoint=await save();await writeFile(folder+'checkpoint-save.json',JSON.stringify(checkpoint));
    await page.waitForFunction(n=>{if((__m.get_context().locations['Infested field'].enemy_groups_killed||0)>=n){__m.current_combat?.clearAllAttackLoops();return true;}return false;},(checkpoint.enemy_killcount['Starving wolf rat']||0)+1,{timeout:30000});const first=await save();console.log('first',first.enemy_killcount,first.total_hits_done);
    // Restore original checkpoint via storage only to exercise the normal page
    // reload reader, rather than synthesizing a new game state.
    await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),checkpoint);
    await page.reload();await bind();await page.locator('#loading_screen_play_button').click({force:true});
    const reloaded=await save();assert.equal(reloaded.native_encounter.key,checkpoint.native_encounter.key,'same encounter on reload');
    assert.deepEqual(reloaded.native_encounter.enemies,checkpoint.native_encounter.enemies,'same enemy health/stats on reload');
    assert.deepEqual(reloaded.expansion.streams,checkpoint.expansion.streams,'load consumes no draws');
    await page.waitForFunction(n=>{if((__m.get_context().locations['Infested field'].enemy_groups_killed||0)>=n){__m.current_combat?.clearAllAttackLoops();return true;}return false;},(checkpoint.enemy_killcount['Starving wolf rat']||0)+1,{timeout:30000});const replay=await save();
    const outcomes=s=>({inventory:s.inventories.person.main_character,kills:Object.values(s.enemy_killcount).reduce((a,b)=>a+b,0),
        playerRolls:s.expansion.streams.log.filter(r=>r.s.startsWith('encounter:core')&&r.k.includes('attackers')).map(r=>[r.id,r.u]).sort(),
        lootRolls:s.expansion.streams.log.filter(r=>r.s.startsWith('loot')).map(r=>[r.id,r.u]).sort(),
        nextLineup:s.native_encounter?.enemies.map(e=>[e.template,e.stats]),cells:s.expansion.streams.cells});
    assert.deepEqual(outcomes(replay),outcomes(first),'next native fight and loot replay');
    assert.equal(first.inventories.person.main_character['{"id":"Rat tail"}']?.count,1,'positive native loot');
    assert.ok((first.enemy_killcount['Starving wolf rat']||0)>(checkpoint.enemy_killcount['Starving wolf rat']||0),'native kill observed');
    // Native shop refresh and epoch replay. Use real reward/unlock APIs to reach
    // the ordinary trader in this named test fixture.
    await page.evaluate(()=>{window.change_location({location_id:'Village',skip_travel_time:true});__m.process_rewards({rewards:{traders:[{trader:'village trader'}]},source_type:'test',source_name:'P1 fixture'});});
    const beforeShop=await save();
    await page.evaluate(()=>window.start_trade('villageTrader'));const shopFirst=await save();
    await page.evaluate(()=>window.exit_trade());
    await page.screenshot({path:folder+'village-1366.png'});
    await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),beforeShop);
    await page.reload();await bind();await page.locator('#loading_screen_play_button').click({force:true});
    await page.evaluate(()=>window.start_trade('villageTrader'));const shopReplay=await save();
    assert.deepEqual(shopReplay.inventories.trader,shopFirst.inventories.trader,'trader refresh epoch replay');
    assert.deepEqual(shopReplay.expansion.streams,shopFirst.expansion.streams,'market receipts replay');
    await page.evaluate(()=>window.exit_trade());
    // Literal browser download/upload. The application validates in its probe
    // origin and then reloads through its normal Import route.
    let exported;
    const downloadPromise=page.waitForEvent('download');
    await page.locator('#save_to_file_button').click({force:true});const download=await downloadPromise;
    const file=folder+'literal-export.txt';await download.saveAs(file);exported=await read();
    await page.evaluate(()=>__m.add_money_to_character(7));await save();
    const input=page.locator('#saved_file_input');console.log('file inputs',await input.count());
    const navigation=page.waitForEvent('framenavigated',{predicate:f=>f===page.mainFrame(),timeout:20000});navigation.catch(()=>{});
    await input.setInputFiles(file);await navigation;
    // Successful import reloads; the probe uses an iframe, not a second tab.
    await page.waitForFunction(()=>document.querySelector('#loading_screen_play_button')?.textContent.includes('PLAY'));
    await bind();await page.locator('#loading_screen_play_button').click({force:true});
    const imported=await save();assert.deepEqual(projection(imported),projection(exported),'literal Export/Import state');
    await page.waitForTimeout(1100);await page.setViewportSize({width:1600,height:1000});await page.screenshot({path:folder+'village-1600.png'});
    const url=await page.evaluate(()=>document.querySelector('script[src*="dist/bundle.js"]').src);
    const response=await page.request.get(url),served=await response.body(),local=await readFile('dist/bundle.js');
    const hash=b=>createHash('sha256').update(b).digest('hex');assert.equal(hash(served),hash(local),'served rebuilt bundle');
    const evidence={label:'seeded-native',profile,viewports:['1366x768','1600x1000'],seed:43,bundleSha256:hash(local),errors,
        reload:'PASS same saved enemy state and stream state, manual Save writes verified',nextFightLoot:'PASS same player decision receipts, kill loot and next lineup; native timers, stopped at next kill',
        killsBefore:checkpoint.enemy_killcount['Starving wolf rat']||0,killsAfter:first.enemy_killcount['Starving wolf rat']||0,hitsBefore:checkpoint.total_hits_done,hitsAfter:first.total_hits_done,
        inventoryBefore:checkpoint.inventories.person.main_character,inventoryAfter:first.inventories.person.main_character,
        trader:'PASS native epoch stock and receipts replay',literalImport:'PASS downloaded file uploaded through input, exact projection',
        root:imported.expansion.streams.root,cells:imported.expansion.streams.cells};
    assert.deepEqual(errors,[]);await writeFile(folder+'BROWSER_EVIDENCE.json',JSON.stringify(evidence,null,2));console.log(evidence);
} finally {await context.close();}
