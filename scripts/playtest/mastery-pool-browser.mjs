// Mastery pool journey (mastery_pool.js on the Nighthawk case-file copying): headless Chrome, 1920x1080, fresh origin.
// fresh game → Tingen door → pick_probationer → enroll → report in → copy files by native clicks → pool checkpoint → spend → save/reload/import.
// Usage: node scripts/playtest/mastery-pool-browser.mjs [outDir]   (needs a fresh `npm run build`)
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=path.resolve('.'),out=path.resolve(process.argv[2]||'/tmp/yairpg-mastery-pool-proof');await fs.mkdir(out,{recursive:true});
const server=await serve(root);
const s=await new Session({url:server.url+'?test_hooks=1',opTimeout:20000,seed:7,wall:Date.UTC(2026,10,10),hooks:{beforeOpen:async c=>c.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}}).start();
const log=[],line=(k,v)=>{log.push(`${k}: ${v}`);console.log(`${k}: ${v}`);};
const HAND='book.lotm.power.copying_hand',POOL='book.lotm.tingen.mastery.pool';
const read=sv=>({mastery:sv.expansion.simulation.powers.player?.[HAND]?.mastery??null,pool:sv.expansion.actors.player.resources[POOL]||0,merit:sv.expansion.actors.player.resources['book.lotm.merit.nighthawks.earned']||0,at:sv.expansion.simulation.people.player.location});
const click=async id=>{const p=s.page;const b=p.locator(`#lotm_panel [data-lotm="${id}"]`).first();await b.waitFor({state:'attached'});
 const st=await b.evaluate(n=>({disabled:n.disabled,why:n.dataset.disabledReason||''}));if(st.disabled)throw Error(`${id} disabled: ${st.why}`);await b.evaluate(n=>n.click());await p.waitForTimeout(150);};
const disabledWhy=async id=>{const b=s.page.locator(`#lotm_panel [data-lotm="${id}"]`).first();if(!await b.count())return 'not shown';return b.evaluate(n=>n.disabled?n.dataset.disabledReason||'disabled':'enabled');};
const walkTo=async word=>{const b=s.page.locator(`#lotm_panel [data-walk-place*="${word}"] button[data-lotm]`).first();assert.equal(await b.count(),1,`a walk toward ${word}`);await b.evaluate(n=>{if(n.disabled)throw Error('walk disabled');n.click();});await s.page.waitForTimeout(150);
 const jobs=await s.page.evaluate(()=>simulationTestHooks.snapshot().expansion.simulation.jobs.map(j=>j.commandId));assert.equal(jobs.length,1,'the walk started: '+jobs);
 await s.page.evaluate(()=>{for(let i=0;i<400&&simulationTestHooks.snapshot().expansion.simulation.jobs.length;i++)simulationTestHooks.workTicks(30);if(simulationTestHooks.snapshot().expansion.simulation.jobs.length)throw Error('walk did not finish');});};
// Accepted local work runs through the engine's own work ticks (as native-continuation.mjs settle does), until the clock passes the target.
const work=minutes=>s.page.evaluate(m=>{const c0=simulationTestHooks.clock(),to=c0+m;for(let i=0;i<4000&&simulationTestHooks.clock()<to;i++){const c=simulationTestHooks.clock();simulationTestHooks.workTicks(30);if(simulationTestHooks.clock()===c)advanceTicks(1);}if(simulationTestHooks.clock()<to)throw Error('clock stuck at '+simulationTestHooks.clock()+' < '+to);},minutes);
const copyOnce=async()=>{await click('book.lotm.merit_case_file_copy');await work(31);};
const practice=()=>s.page.locator('#lotm_panel [data-lotm-practice]').innerText();
const shot=async name=>{const tab=s.page.locator('#lotm_panel [role=tab]',{hasText:'Work & merit'}).first();if(!await tab.isVisible())await s.page.locator('#workspace_navigation select').selectOption('lotm');await tab.click();await s.page.waitForTimeout(200);await s.page.evaluate(()=>document.querySelector('#lotm_panel [data-lotm-merit]')?.scrollIntoView());await s.page.screenshot({path:path.join(out,name)});};
const receipt={bundleSha256:createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex'),viewport:'1920x1080',route:'fresh origin, native clicks, game clock stepped by test hooks'};
try{
 await s.open();const p=s.page;
 // The door lives in the Village place actions list (it only opens the panel and commits nothing); the list is collapsed at this width, so click it directly.
 await p.locator('#location_actions_div [data-lotm-door]').evaluate(n=>n.click());
 await p.locator('#lotm_panel [data-lotm="pick_probationer"]').click();
 await p.locator('#lotm_panel [data-lotm="enroll"]').click();
 await p.waitForFunction(()=>/Tingen/.test(document.querySelector('#location_name_span')?.textContent||''),null,{timeout:30000});await p.waitForTimeout(350);
 await click('book.lotm.report_in');
 assert.equal(await p.locator('#lotm_panel [data-lotm-practice]').count(),0,'no practice block before the hand is learned');
 await copyOnce();let v=read(await s.save());assert.equal(v.mastery,0);assert.equal(v.merit,1);line('first copy','learns the copying hand, mastery 0, pool 0, merit 1');
 for(let i=0;i<3;i++)await copyOnce();v=read(await s.save());assert.deepEqual([v.mastery,v.pool],[12,3]);line('three more copies',`mastery ${v.mastery}, pool ${v.pool}/8`);
 const below=await practice();assert.match(below,/Not yet/);line('panel below checkpoint',below.replace(/\n/g,' | '));
 await copyOnce();v=read(await s.save());assert.deepEqual([v.mastery,v.pool],[16,4]);
 const on=await practice();assert.match(on,/You have this now/);assert.match(on,/Spending drops you below A steady desk/);line('pool checkpoint',on.replace(/\n/g,' | '));
 line('cited file at mastery 16',await disabledWhy('book.lotm.merit_cited_file_copy'));
 await shot('01-checkpoint-on.png');
 // The checkpoint changes where the work happens: copy at the lodging, without Hale.
 await walkTo('lodging');v=read(await s.save());line('walked',v.at);
 await click('book.lotm.merit_case_file_copy_home');await work(31);v=read(await s.save());assert.deepEqual([v.mastery,v.pool,v.merit],[20,5,6]);line('lodging copy',`mastery ${v.mastery}, pool ${v.pool}, merit ${v.merit}`);
 await click('book.lotm.merit_spend_copying');v=read(await s.save());assert.deepEqual([v.mastery,v.pool],[24,1]);line('spend 4 pooled',`mastery ${v.mastery}, pool ${v.pool}`);
 const lost=await disabledWhy('book.lotm.merit_case_file_copy_home');assert.notEqual(lost,'enabled');line('lodging copy after spend',lost);
 const after=await practice();assert.match(after,/Not yet/);line('panel after spend',after.replace(/\n/g,' | '));
 await walkTo('workroom');
 await click('book.lotm.merit_cited_file_copy');await work(61);v=read(await s.save());assert.deepEqual([v.mastery,v.pool,v.merit],[28,2,8]);line('cited file (mastery checkpoint)',`mastery ${v.mastery}, pool ${v.pool}, merit ${v.merit}`);
 await shot('02-after-spend.png');
 const saved=read(await s.save());
 // reload
 await p.reload();await p.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
 await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click({force:true});await p.waitForTimeout(400);
 assert.deepEqual(read(await s.save()),saved);line('reload','mastery, pool, merit and place identical');
 // Export, then literal Import into a fresh origin through the file input.
 const encoded=await p.evaluate(()=>window.save_to_file());const file=path.join(out,'export.txt');await fs.writeFile(file,encoded);
 await s.open();
 await Promise.all([s.page.waitForNavigation({waitUntil:'domcontentloaded'}),s.page.locator('#saved_file_input').setInputFiles(file)]);
 await s.page.waitForFunction(()=>window.simulationTestHooks&&document.getElementById('loading_screen_play_button')?.checkVisibility(),null,{timeout:60000});
 await s.page.evaluate(()=>simulationTestHooks.pause());await s.page.locator('#loading_screen_play_button').click({force:true});await s.page.waitForTimeout(400);
 assert.deepEqual(read(await s.save()),saved);line('import','fresh origin, literal Export/Import, identical');
 const imported=await practice();assert.match(imported,/mastery 28/);line('panel after import',imported.split('\n')[0]);
 await shot('03-imported.png');
 receipt.pageErrors=s.errors.filter(e=>e.kind==='pageerror');assert.deepEqual(receipt.pageErrors,[]);receipt.consoleErrors=s.errors.filter(e=>e.kind==='console').map(e=>e.text.slice(0,160));
}catch(e){receipt.error=e.stack;console.error(e.stack);process.exitCode=1;await s.page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{receipt.log=log;await fs.writeFile(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2));await s.close();server.close();}
