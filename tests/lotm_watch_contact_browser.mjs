// Fresh ordinary entry; branch only from the actual earned reporting checkpoint.
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
import {WATCH_STORM_NOTE,WATCH_HANDOVER,DIRECTORY_STORM} from '../src/book_world_lotm_watch_lead.js';
const build=resolve(process.argv[2]||'.lane-builds/ordinary-watch-contact-20261125'),out=resolve('docs/representations/evidence/ordinary-watch-contact-2026-11-25');
await mkdir(out,{recursive:true});
const server=await serve(build),session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:30000,
 hooks:{beforeOpen:async context=>context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}))}});
const snap=()=>session.page.evaluate(()=>simulationTestHooks.snapshot()),panel=()=>session.page.locator('#lotm_panel');
const a=id=>panel().locator(`[data-lotm="${id}"]:visible`).first();
const work=()=>panel().getByRole('tab',{name:/Work & merit/}).click(),here=()=>panel().getByRole('tab',{name:'Here',exact:true}).click();
const note=s=>s.expansion.simulation.knowledge.player?.[WATCH_STORM_NOTE];
const clock=s=>s.expansion.clock;
async function boot(){const p=session.page;await p.waitForFunction(()=>!!window.simulationTestHooks);await p.evaluate(()=>simulationTestHooks.pause());if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click({force:true});}
async function reopen(){await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');}
const checks=[];
try{
 await session.start();await session.open();
 await session.page.getByRole('button',{name:'Cross',exact:true}).click();await session.page.locator('[data-lotm="pick_probationer"]').click();
 await session.page.getByRole('button',{name:'Confirm and cross to Tingen',exact:true}).click();await a('book.lotm.report_in').click();
 await work();const earned=await session.save();assert.equal(note(earned),undefined);
 await session.page.screenshot({path:join(out,'ordinary-work-choice.png')});
 await a('book.lotm.merit_cold_room_watch').click();await session.step(60);assert.equal(note(await snap()),undefined,'watch never invents an unseen conversation');
 await panel().locator('[data-lotm-public-work-lead]').locator(`[data-lotm="${WATCH_HANDOVER}"]`).click();
 const learned=await snap();assert.equal(note(learned).basis.attributedTo,'book.lotm.supervisor');assert.equal(clock(learned)-clock(earned),60);
 await panel().locator('[data-lotm-public-work-lead]').scrollIntoViewIfNeeded();await session.page.screenshot({path:join(out,'hale-public-work-lead.png')});
 checks.push('Actual60min watch earns merit; present-Hale handover teaches a reported contact with no extra coin reward/time');
 await a('lead_lotm.move.docks').click();await session.step(20);await a('public_work_here').click();
 const before=(await snap()).character.money;await a('book.lotm.endorse_storm').click();assert.equal((await snap()).character.money,before-24);
 await a('book.lotm.errand_storm').click();await session.step(20);const paid=await session.save();assert.equal(paid.character.money,before-24+18);
 await session.page.screenshot({path:join(out,'actual-docks-errand.png')});
 await session.page.reload();await boot();assert.equal((await snap()).character.money,paid.character.money);assert.deepEqual(note(await snap()),note(paid));
 const download=session.page.waitForEvent('download');await session.page.locator('#save_to_file_button').click();const stream=await(await download).createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);
 await session.open();const imported=session.page;imported.on('dialog',d=>d.accept());const loaded=imported.waitForEvent('domcontentloaded');await imported.locator('#saved_file_input').setInputFiles({name:'ordinary-office-save.txt',mimeType:'text/plain',buffer:Buffer.concat(chunks)});await loaded;await boot();
 assert.deepEqual(note(await snap()),note(paid));assert.equal((await snap()).character.money,paid.character.money);
 checks.push('Existing20min walk,24pence endorsement and20min/18pence native errand pay actual purse; Save/reload and literal Export/Import preserve note and outcome');
 await session.open(earned);await reopen();await here();await a('lotm.move.university').click();await session.step(25);
 const library=a('library_study');await library.click();assert.equal(note(await snap()),undefined);await a('library_study').click();
 await a(DIRECTORY_STORM).click();await session.step(1);const directory=await session.save();assert.equal(clock(directory)-clock(earned),146);
 assert.equal(directory.expansion.actors.player.completed['book.lotm.merit_cold_room_watch']||0,0);assert.equal(note(directory).basis.attributedTo,'player');
 await work();await panel().locator('[data-lotm-public-work-lead]').scrollIntoViewIfNeeded();await session.page.screenshot({path:join(out,'independent-directory-lead.png')});
 checks.push('Independent route actually walks25min, reads2×60min papers and applies notes1min; same public contact with no completed watch');
 await session.open(earned);await reopen();await work();await a('repeat.2.book.lotm.merit_case_file_copy').click();await session.step(60);const copied=await snap();
 assert.equal(note(copied),undefined);assert.equal(await panel().locator('[data-lotm-practice-level]').getAttribute('data-lotm-practice-level'),'4');
 await session.page.screenshot({path:join(out,'copying-alternative.png')});checks.push('One-hour copying alternative retains2merit and mastery4 without inventing the watch handover');
 const result={viewport:'1920x1080',route:'Fresh ordinary PLAY -> Village crossing -> probationer -> report; all branches use that earned checkpoint, no fixture or gifted contact',bundleSha256:createHash('sha256').update(await readFile(join(build,'dist/bundle.js'))).digest('hex'),checks,
  watch:{minutes:clock(learned)-clock(earned),purseBeforeJob:before,purseAfterJob:paid.character.money},directory:{minutes:clock(directory)-clock(earned)},pageErrors:session.errors.filter(e=>e.kind==='pageerror')};
 assert.deepEqual(result.pageErrors,[]);await writeFile(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){console.error(error);await session.page?.screenshot({path:join(out,'failed.png')});await writeFile(join(out,'failure.txt'),await session.page?.locator('body').innerText()||String(error));throw error;}
finally{await session.browser?.close();await server.close();}
