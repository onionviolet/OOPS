// L3 native route with explicit starting-stock fixture, no player profile.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{launchChrome,advanceGameMinutes}=require('../ui_helpers.cjs');
const {startFresh,unlockCombatRoute}=require('../../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const E=path.resolve('docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L3');
const P='book.paradise',F=P+'.campaign.',METHOD=F+'line_rigging',K=id=>JSON.stringify({id});
const LOG=K('Rough wood log'),ROPE=K('Survey rope'),KIT=K('Prepared survey kit');
const layoutOnly=process.env.L3_LAYOUT_ONLY==='1';
const origin=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:54066';
const snapshot=page=>page.evaluate(()=>simulationTestHooks.snapshot());
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080}}),page=await context.newPage();
page.setDefaultTimeout(15000);const errors=[],receipt={route:'Fresh native route, DEV SEEDED starting owned wood/rope/kits only; both lessons, bench, drills and rehearsals earned by native commands',origin,errors};
page.on('pageerror',e=>errors.push(e.stack));
await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button:not(.none_display)').click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'||document.querySelector('#hero_creation_panel_confirmation')?.getClientRects().length);const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed'&&simulationTestHooks.saveStatus().ownsSave);await page.evaluate(()=>simulationTestHooks.pause());};
const panel=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>n.open=true);await page.locator('#feature_expansion_panel').evaluate(n=>n.querySelectorAll('details').forEach(d=>d.open=true));};
const focusCard=async card=>card.evaluate(el=>{el.scrollIntoView({block:'start',inline:'nearest'});let p=el.parentElement;while(p){if(p.scrollHeight>p.clientHeight+1&&/(auto|scroll)/.test(getComputedStyle(p).overflowY)){p.scrollTop=Math.max(0,p.scrollTop-100);break;}p=p.parentElement;}});
const button=re=>page.locator('#feature_expansion_panel button').filter({hasText:re}).first();
async function click(re){await panel();const b=button(re);await b.waitFor({state:'visible'});if(await b.isDisabled())throw Error('Disabled '+re+': '+await b.evaluate(n=>n.parentElement.innerText));await b.click();await page.waitForTimeout(250);}
const step=n=>advanceGameMinutes(page,n);
async function act(re,id,minutes=0){await click(re);if(minutes){await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),id);await step(minutes);}await page.waitForFunction(id=>(simulationTestHooks.snapshot().expansion.actors.player.completed[id]||0)>0,id);}
const save=async()=>{await page.evaluate(()=>saveProgress());return snapshot(page);};
const digest=s=>JSON.stringify({actor:s.expansion.actors.player,powers:s.expansion.simulation.powers.player,faculties:s.expansion.simulation.faculties.player,jobs:s.expansion.simulation.jobs,inventory:s.inventories.person.main_character,meta:s.book_world_campaign_native});
async function roundtrip(name){const before=await save(),literal=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(E,name+'.save.txt'),literal);await page.reload();await boot();assert.equal(digest(await snapshot(page)),digest(before),name+' reload');await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();assert.equal(digest(await snapshot(page)),digest(before),name+' literal import');await panel();return before;}
try{
 await fs.mkdir(E,{recursive:true});await page.goto(origin+'/?test_hooks=1');await boot();
 if(layoutOnly){const literal=await fs.readFile(path.join(E,'inactive-method.save.txt'),'utf8');await Promise.all([page.waitForEvent('load'),page.evaluate(x=>load_progress(x),literal)]);await boot();receipt.route='Reimport the agent-earned final inactive-method export for focused desktop evidence';receipt.layoutOnly=true;await click(/Go to Paradise paid training booth/);await page.waitForFunction(()=>simulationTestHooks.snapshot()['current location']==='Paradise paid training booth');await act(/Resume your own learned line procedure/,F+'hub.resume_method');const resumed=await save();assert.equal(resumed.expansion.simulation.powers.player[METHOD].mastery,3);assert.equal(resumed.expansion.simulation.faculties.player[METHOD].development,2);assert.equal(resumed.expansion.simulation.faculties.player[METHOD].active,true);receipt.resumedWithoutRelearning=true;await panel();const cap=page.locator('article[data-action-legibility-key="action:'+F+'hub.practice"]');await focusCard(cap);await page.screenshot({path:path.join(E,'methods-cap-1920-14.png')});await click(/Go to Paradise independent-contractor desk/);await page.waitForFunction(()=>simulationTestHooks.snapshot()['current location']==='Paradise independent-contractor desk');}else{
 const seed=await snapshot(page);seed.inventories.person.main_character[LOG]={count:30};seed.inventories.person.main_character[ROPE]={count:12};seed.inventories.person.main_character[KIT]={count:4};
 await page.evaluate(s=>localStorage.setItem('save data',JSON.stringify(s)),seed);await page.reload();await boot();
 const a=page.locator('#location_actions_div');await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();for(const key of ['hello','what happened','ask to leave 1','need to']){const line=a.locator('.dialogue_textline[data-textline="'+key+'"]');await line.waitFor({state:'visible'});await line.evaluate(n=>n.click());await line.waitFor({state:'detached'});}await page.evaluate(()=>end_dialogue());await step(3);console.log('elder route');
 await click(/Begin an optional record of local care/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.simulation);
 await act(/Read the parallel-entry/,P+'.chart');await click(/Choose independent Paradise entry/);await page.waitForFunction(()=>!!simulationTestHooks.snapshot().expansion.bookWorldCampaign);
 await click(/Enter the independent contractor district/);await page.waitForFunction(()=>simulationTestHooks.snapshot().expansion.actors.player.worldId==='book.paradise.hub');
 await act(/Meet the independent service desk/,P+'.hub_meet');await act(/Accept the funded packing shift/,P+'.hub_shift',5);
 await act(/Buy the attributed load-bracing lesson/,P+'.lesson',3);console.log('base method earned');
 await act(/Open the extended craft, danger and return terms/,F+'hub.begin');await act(/Build your own paid-district bench/,F+'hub.bench',5);await act(/Buy line-rigging instruction/,F+'hub.learn_paid',4);
 let s=await save();assert.equal(s.expansion.simulation.powers.player[METHOD].mastery,0);assert.equal(s.expansion.simulation.faculties.player[METHOD].development,0);console.log('own method earned');
 await click(/Rehearse a single loaded line/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.foundation_1');
 const pending=await roundtrip('foundation-pending');assert.equal(pending.expansion.simulation.faculties.player[METHOD].development,0);await step(6);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.actors.player.completed[id]===1,F+'hub.foundation_1');
 const one=await save();assert.equal(one.expansion.simulation.powers.player[METHOD].mastery,0);assert.equal(one.expansion.simulation.faculties.player[METHOD].development,1);
 const before=one.inventories.person.main_character;await act(/Make one measured kit/,F+'hub.make_measured',3);s=await save();assert.equal(s.inventories.person.main_character[LOG].count,before[LOG].count-1);assert.equal(s.inventories.person.main_character[KIT].count,before[KIT].count+1);assert.equal(s.inventories.person.main_character[ROPE].count,before[ROPE].count);
 await act(/Rehearse a continuous load sequence/,F+'hub.foundation_2',6);const two=await save();await click(/Make two continuous-load kits/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.make_continuous');await roundtrip('batch-pending');await step(4);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.actors.player.completed[id]===1,F+'hub.make_continuous');
 s=await save();assert.equal(s.inventories.person.main_character[LOG].count,two.inventories.person.main_character[LOG].count-2);assert.equal(s.inventories.person.main_character[KIT].count,two.inventories.person.main_character[KIT].count+2);assert.equal(s.inventories.person.main_character[ROPE].count,two.inventories.person.main_character[ROPE].count);assert.equal(s.expansion.simulation.powers.player[METHOD].mastery,0);receipt.production={single:true,batch:true,masteryUnchanged:true};
 // Existing finite district order is the real consumer of a newly produced kit.
 await act(/Supply district repair order 1/,F+'hub.commission_1',2);await roundtrip('foundation-and-consumer');
 await click(/Go to Paradise paid training booth/);await page.waitForFunction(()=>simulationTestHooks.snapshot()['current location']==='Paradise paid training booth');
 for(let i=0;i<3;i++){await click(/Practice control of your own line/);await page.waitForFunction(id=>simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===id),F+'hub.practice');await step(3);await page.waitForFunction(({id,n})=>simulationTestHooks.snapshot().expansion.actors.player.completed[id]===n,{id:F+'hub.practice',n:i+1});}
 await panel();assert.equal(await button(/Practice control of your own line/).isDisabled(),true);assert.match(await page.locator('#feature_expansion_panel').innerText(),/drill is complete at mastery three/);receipt.cap=true;
 await act(/Stop using your taught line procedure/,F+'hub.pause_method');assert.equal((await save()).expansion.simulation.powers.player[METHOD].mastery,3);await click(/Go to Paradise independent-contractor desk/);await page.waitForFunction(()=>simulationTestHooks.snapshot()['current location']==='Paradise independent-contractor desk');await panel();assert.equal(await button(/Make one measured kit/).isDisabled(),true);receipt.inactiveRefusal=true;
 await roundtrip('inactive-method');
 }
 receipt.matrix=[];
 for(const [width,height] of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await page.setViewportSize({width,height});await page.locator('#workspace_navigation select').first().selectOption('customization');await page.locator('[aria-label="Font size"]').fill(String(size));await page.locator('[aria-label="Font size"]').dispatchEvent('change');await page.getByRole('button',{name:'Apply and save',exact:true}).first().click();await panel();
  const card=page.locator('article[data-action-legibility-key="action:'+F+'hub.make_measured"]');await focusCard(card);
  const cardBounds=await card.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,overflow:el.scrollWidth>el.clientWidth+1}));assert.equal(cardBounds.overflow,false);
  const bounds=await page.locator('#feature_expansion_panel').evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),pageOverflow:document.documentElement.scrollWidth>innerWidth+1}));assert.equal(bounds.font,size);assert.equal(bounds.pageOverflow,false);await page.screenshot({path:path.join(E,`methods-${width}-${size}.png`)});receipt.matrix.push({width,height,size,...bounds,cardBounds});
 }
 if(!layoutOnly){receipt.pendingReloadExportImport=true;receipt.finalReloadExportImport=true;}assert.deepEqual(errors,[]);console.log(layoutOnly?'PASS focused desktop controls, visible cap and actual source resumption without relearning':'PASS native foundation, actual kit consumer, drill cap, inactive refusal, pending/settled persistence and desktop matrix');
}catch(e){receipt.failure=e.stack;await page.screenshot({path:path.join(E,'failure.png')});await fs.writeFile(path.join(E,'failure-ui.txt'),await page.locator('body').innerText());throw e;}
finally{await fs.writeFile(path.join(E,layoutOnly?'layout-result.json':'browser-result.json'),JSON.stringify(receipt,null,2));await context.close();await browser.close();}
