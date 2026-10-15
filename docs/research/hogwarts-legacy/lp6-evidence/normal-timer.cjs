// Real worker-timer smoke check. No resource routes, fake clocks or game-state injection.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
 const ctx=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8199/style.css');await p.evaluate(s=>localStorage.setItem('save data',s),fs.readFileSync('/tmp/lp6-seed.json','utf8'));await p.goto('http://127.0.0.1:8199/');await p.locator('#loading_screen_play_button:not(.none_display)').click();
 await p.locator('#notebook_tab_people').click();await p.locator('#party_panel').evaluate(n=>n.open=true);await p.locator('#party_partner_panel').evaluate(n=>n.open=true);
 await p.locator('[data-party="party.lp6.ask"]').click();await p.locator('[data-party="party.lp6.help"]').click();
 await p.waitForFunction(()=>JSON.parse(localStorage.getItem('save data')).expansion.actors.player.facts['party.lp6.history']==='helped',null,{timeout:25000});
 await p.locator('#save_button').click();const save=JSON.parse(await p.evaluate(()=>localStorage.getItem('save data'))),f=save.expansion.actors.player.facts;
 assert.equal(f['party.lp6.history'],'helped');assert.equal(save.inventories.person.main_character[JSON.stringify({id:'Prepared survey kit'})]?.count||0,0);assert.equal(save.expansion.simulation.relationships.player.partyPartner.axes.trust,0);
 assert.equal(await p.locator('[data-party="party.lp6.pack_shared"]').isEnabled(),true);assert.deepEqual(errors,[]);
 await p.locator('[data-party="party.lp6.pack_shared"]').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(__dirname,'normal-timer-completed.png')});
 fs.writeFileSync(path.join(__dirname,'normal-timer.json'),JSON.stringify({pass:true,viewport:{width:1366,height:768},clock:save.expansion.clock,history:f['party.lp6.history'],kits:0,trust:0,sharedOfferEnabled:true,errors},null,2));console.log('PASS default worker timer completes the paid favor and enables shared packing');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
