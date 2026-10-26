// Existing Cyoria manual-control lesson and household consumer. QA fixture only.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {serve} from '../perf/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../ui_helpers.cjs');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);await fs.mkdir(out,{recursive:true});
const source=path.resolve('docs/gm/dispatch/other-systems-depth-2026-10-26/learning/evidence/TEST-FIXTURE-R15-G4-learning-house.txt');
const fixture=JSON.parse(Buffer.from((await fs.readFile(source,'utf8')).trim().split(':')[1],'base64'));
const server=await serve(root),browser=await launchChrome();let context,page;const errors=[];
const receipt={route:'named synthetic R15 G4 supplied-stock/body fixture; native commands earned control, tested lamp, surveyed, declined retrieval and closed service; browser uses household application',viewport:'1920x1080'};
const key='{"id":"Cyorian keyed formula lamp"}',command='book.mol.use_lamp_house';
const count=s=>s.inventories.person.main_character[key]?.count||0;
const fuel=s=>s.expansion.actors.player.resources['book.mol.deviceFuel'];
const boot=async()=>{await page.waitForFunction(()=>window.simulationTestHooks||(()=>{const n=document.getElementById('loading_screen_play_button');return n&&getComputedStyle(n).display!=='none';})(),null,{timeout:20000});const play=page.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();const c=page.locator('#hero_creation_panel_confirmation');if(await c.isVisible())await c.click();await page.waitForFunction(()=>window.simulationTestHooks,null,{timeout:20000});await page.evaluate(()=>simulationTestHooks.pause());};
const save=async()=>{await page.evaluate(()=>saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
async function panel(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});}
const use=()=>page.getByRole('button',{name:'Do this: Use the learned lamp for one household reading interval · 1 charge',exact:true});
async function roundtrip(label){const before=await save();await page.reload();await boot();assert.deepEqual((await save()).expansion,before.expansion);const encoded=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(out,label+'-export.txt'),encoded);await Promise.all([page.waitForEvent('load',{timeout:15000}),page.locator('#saved_file_input').setInputFiles({name:'learning-test.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await boot();const after=await save();assert.deepEqual(after.expansion,before.expansion);assert.deepEqual(after.inventories.person.main_character,before.inventories.person.main_character);receipt[label+'RoundTrip']=true;await panel();}
try{
 context=await browser.newContext({viewport:{width:1920,height:1080}});await context.addInitScript(s=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',JSON.stringify(s));sessionStorage.setItem('seeded','1');}},fixture);
 page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));await page.goto(server.url+'?test_hooks=1');await boot();await panel();
 const before=await save();assert.equal(before.expansion.simulation.powers.player['book.mol.formula_operator'].mastery,1);assert.equal(await use().isEnabled(),true);await use().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'household-ready-1920.png')});await use().click();
 let pending=await save();assert.equal(count(pending),0);assert.equal(fuel(pending),fuel(before)-1);assert.ok(pending.expansion.simulation.jobs.some(j=>j.commandId===command));
 await page.getByRole('button',{name:/Cancel Use the learned lamp/}).click();const cancelled=await save();assert.equal(count(cancelled),1);assert.equal(fuel(cancelled),fuel(before));assert.equal(cancelled.expansion.simulation.knowledge.player['book.mol.houseLamp'],undefined);receipt.cancellation=true;
 await use().click();await roundtrip('pending');await page.evaluate(()=>advanceTicks(2));assert.equal((await save()).expansion.simulation.knowledge.player['book.mol.houseLamp'],undefined);await page.evaluate(()=>advanceTicks(1));const done=await save();assert.equal(count(done),1);assert.equal(fuel(done),fuel(before)-1);assert.equal(done.expansion.actors.player.completed[command],1);assert.equal(done.expansion.simulation.powers.player['book.mol.formula_operator'].mastery,1);assert.ok(done.expansion.simulation.knowledge.player['book.mol.houseLamp']);
 await panel();await page.locator('#feature_expansion_panel li').filter({hasText:/Your retained keyed lamp supported one agreed household reading interval/}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'household-result-1920.png')});await roundtrip('completed');assert.equal(await use().count(),0);await page.evaluate(()=>advanceTicks(3));assert.equal((await save()).expansion.actors.player.completed[command],1);receipt.actualConsumer=true;receipt.noReplay=true;
 receipt.bundleHash=createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex');receipt.fixtureHash=createHash('sha256').update(await fs.readFile(source)).digest('hex');receipt.errors=errors;assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'browser-result.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}catch(e){await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});await fs.writeFile(path.join(out,'failure.txt'),String(e.stack)+'\n'+await page?.locator('body').innerText().catch(()=>''));throw e;}
finally{await context?.close();await browser.close();await server.close();}
