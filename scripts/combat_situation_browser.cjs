// LTU7 fight situation card at 1920x1080 from a fresh origin and a fresh life: Elder lines unlock
// Infested field, the first fight shows the card inside the Combat panel, its text form is read, and
// the Withdraw option leaves through the native leave choice. Then the figure gallery's combat
// fixtures. Disposable context; no user save is touched. Rebuild (npm run build, build:figures) first.
const {chromium}=require(process.env.YAIRPG_PLAYWRIGHT||'/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const {startFresh,waitLocation}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const base=process.env.PROOF_BASE||'http://127.0.0.1:19477/',out=process.env.PROOF_OUT||'docs/representations/evidence/combat';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],missing=[];
 try{
 const context=await browser.newContext({viewport:{width:1920,height:1080}});await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
 await context.addInitScript(()=>{Date.now=()=>1792108800000;let n=41;Math.random=()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/status of 404/.test(m.text()))errors.push(m.text());})/* Known noise: a plain static server has no private fonts or packs, so those 404s log console errors. They are collected in `missing`, not treated as failures. */;page.on('response',r=>{if(r.status()===404)missing.push(r.url());});
 await page.goto(base+'?test_hooks=1');await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>window.simulationTestHooks.pause());await startFresh(page);
 const bundle=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name.split('version=')[1]);
 await page.getByRole('button',{name:'Talk to someone'}).click(); // role, not text: the first text match is a hidden duplicate
 await page.locator('[data-dialogue="villageElder"]').click();
 // The talk view (#talk_view_host) covers the native text lines, so choose through its own options.
 await page.locator('#talk_view_host .talk-view').waitFor({state:'visible'});
 for(const key of ['hello','what happened','ask to leave 1','need to']){const opt=page.locator(`#talk_view_host button[data-topic-id="${key}"][data-topic-state="new"]`);await opt.click();await opt.waitFor({state:'detached'});}
 await page.locator('#center_mode_back').click();
 await page.locator('#location_actions_div').getByText('Move somewhere else',{exact:false}).first().click();
 await page.locator('#location_actions_div .action_travel[data-travel="Infested field"]').click();await waitLocation(page,'Infested field');
 await page.locator('#combat_div .fighter_div').first().waitFor({state:'attached'});
 await page.evaluate(()=>window.advanceTicks(8,{render:true}));
 const card=page.locator('#fight_situation');await card.waitFor({state:'visible'});
 await card.scrollIntoViewIfNeeded();
 const read=()=>page.evaluate(()=>{const s=document.getElementById('fight_situation');const r=s.getBoundingClientRect();
  return {lines:[...s.querySelectorAll('.fight-situation-lines li')].map(n=>n.textContent),nativeLeaveVisible:!!document.querySelector('#location_actions_div .action_travel[data-travel]')?.checkVisibility(),text:s.innerText,cards:[...s.querySelectorAll('.versus-card')].map(c=>({threat:c.dataset.threat,label:c.getAttribute('aria-label')})),stakes:s.querySelector('.scene-card-stakes')?.textContent||'',option:s.querySelector('[data-fight-option]')?.textContent||'',
   blocked:s.querySelector('[data-scene-blocked]')?.textContent||'',box:{x:r.x,y:r.y,w:r.width,h:r.height},
   log:(()=>{const l=document.getElementById('message_log_div');const b=l?.getBoundingClientRect();return b?{w:b.width,h:b.height,visible:l.checkVisibility()}:null;})()};});
 const first=await read();
 await page.screenshot({path:`${out}/fight-1920x1080.png`});
 await card.screenshot({path:`${out}/fight-card.png`});
 // UR52: as hp changes over live ticks, the lines and drawing update but the Withdraw button is the same node.
 await page.evaluate(()=>{document.querySelector('#fight_situation [data-fight-option="leave"]').dataset.probe='1';});
 let later=first;for(let i=0;i<20&&later.text===first.text;i++){await page.evaluate(()=>window.advanceTicks(10,{render:true}));await page.waitForTimeout(500);later=await read();}
 const stable=await page.evaluate(()=>document.querySelector('#fight_situation [data-fight-option="leave"]')?.dataset.probe==='1');
 const changed=later.text!==first.text;
 // Withdraw goes through the native leave choice.
 let withdrew=false;
 if(await page.locator('#fight_situation [data-fight-option="leave"]:not([disabled])').count()){await page.locator('#fight_situation [data-fight-option="leave"]').click();await page.waitForTimeout(800);
  withdrew=await page.evaluate(()=>document.getElementById('location_name_span')?.textContent.trim()!=='Infested field');}
 const hiddenAfter=await page.evaluate(()=>document.getElementById('fight_situation')?.hidden!==false||!document.getElementById('fight_situation').checkVisibility());
 // Gallery fixtures.
 const g=await context.newPage();g.on('pageerror',e=>errors.push(e.message));await g.goto(base+'figure-gallery.html');
 const fixtures=await g.evaluate(()=>[...document.querySelectorAll('[data-fixture]')].map(n=>n.dataset.fixture));
 for(const id of ['fight-duel','fight-brawl','chase-fixture.tollman','versus-row']){const s=g.locator(`[data-fixture="${id}"]`);await s.scrollIntoViewIfNeeded();await s.screenshot({path:`${out}/gallery-${id.replace(/\W+/g,'-')}.png`});}
 // Effects off: the versus row still reads (UR38). Root font-size does not scale this page, so this is not 21 px evidence.
 await g.evaluate(()=>{document.documentElement.style.fontSize='21px';document.documentElement.dataset.effects='off';});
 {const s=g.locator('[data-fixture="versus-row"]');if(await s.count()){await s.scrollIntoViewIfNeeded();await s.screenshot({path:`${out}/gallery-versus-row-effects-off.png`});}}
 const report={viewport:'1920x1080',route:'fresh life -> Village Elder lines -> Infested field (earned steps)',bundle,first,stable,changed,later:{text:later.text,stakes:later.stakes,lines:later.lines},withdrew,hiddenAfter,fixtures,errors,missing};
 fs.writeFileSync(`${out}/journey.json`,JSON.stringify(report,null,1)+'\n');
 assert.ok(first.cards.length>0&&first.text.includes('Withdraw'),'versus row and Withdraw shown');assert.ok(changed,'text form changed over live ticks');assert.ok(stable,'Withdraw button survived the change');assert.ok(fixtures.includes('fight-duel'));assert.deepEqual(errors,[]);
 console.log('PASS',JSON.stringify({bundle,withdrew,hiddenAfter,stable,fixtures:fixtures.length,box:first.box,log:first.log}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
