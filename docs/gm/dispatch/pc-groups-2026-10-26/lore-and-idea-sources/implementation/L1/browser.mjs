import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {serve} from '../../../../../../../scripts/perf/lib.mjs';
import {fixture,note,prefix as P} from './fixture.mjs';
import {loadExpansionState} from '../../../../../../../src/expansion_engine.js';
import {expeditionRegistry as registry} from '../../../../../../../src/expedition_content.js';
const {launchChrome}=createRequire(import.meta.url)('../../../../../../../scripts/ui_helpers.cjs');
const root='/Users/weiwei/.codex/research/g7-lore-2026-10-26/L1-build';
const out=path.dirname(new URL(import.meta.url).pathname);const key=s=>JSON.stringify({id:s});
const f=fixture().raw,s=f.expansion,a=s.actors.player;
f.saved_at=Date.now();
// Named supplied-stock preconstruction fixture. Remove previous device receipts,
// not player data: the source itself is a synthetic QA fixture, never a user save.
const removed=['assemble_lamp','charge_1','charge_2','charge_3','control_drill','lamp_test','use_lamp_house'];
for(const id of removed){delete a.completed['book.mol.'+id];delete s.simulation.claims['book.mol.receipt.'+id];}
for(const id of ['lampBuilt','deviceCapacity','controlTrained','lampTested'])delete a.facts['book.mol.'+id];
for(const owner of [a.sources,s.simulation.powers.player,s.simulation.faculties.player])delete owner['book.mol.formula_operator'];
for(const id of ['lamp','control','lampTest','houseLamp'])delete s.simulation.knowledge.player['book.mol.'+id];
a.resources['book.mol.deviceFuel']=0;a.resources['book.mol.crowns']=25;
s.actors['book.mol.nora'].resources['book.mol.personalMana']=18;s.actors['book.mol.nora'].resources['book.mol.attention']=14;
delete f.inventories.person.main_character[key('Cyorian keyed formula lamp')];
for(const [id,count] of [['Cyorian blank stone cube',1],['Cyorian formula ink',1],['Cyorian lamp oil',1],['Cyorian research paper',4]])f.inventories.person.main_character[key(id)]={count};
f['current location']='Cyoria academy guest library';s.simulation.people.player.location=f['current location'];
if(process.env.L1_RESUME)Object.assign(f,JSON.parse(await fs.readFile(path.join(out,'after-assembly.json'),'utf8')));
loadExpansionState(f.expansion,registry);await fs.writeFile(path.join(out,'fixture-preconstruction.json'),JSON.stringify(f));
const server=await serve(root),browser=await launchChrome();let context,page;const errors=[];const result={route:'named synthetic supplied-stock Cyoria preconstruction fixture; actual native actions thereafter',buildRoot:root};
const record=(raw,id)=>raw.expansion.simulation.knowledge.player[P+id];
const count=(raw,id)=>raw.inventories.person.main_character[key(id)]?.count||0;
const save=async()=>{await page.evaluate(()=>saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
async function boot(){await page.waitForFunction(()=>window.simulationTestHooks);await page.evaluate(()=>simulationTestHooks.pause());await page.waitForTimeout(150);const play=page.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();}
async function panel(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});}
const button=name=>page.getByRole('button',{name:'Do this: '+name,exact:true});
async function act(name,minutes=0){console.log('ACT',name);await panel();const b=button(name);assert.equal(await b.isEnabled(),true,name);await b.scrollIntoViewIfNeeded();await b.click();if(minutes)await page.evaluate(n=>advanceTicks(n),minutes);return save();}
async function move(to){if((await save())['current location']!==to)await act('Walk to '+to);}
async function roundtrip(label){const before=await save();await page.reload();await boot();assert.deepEqual((await save()).expansion,before.expansion);const encoded=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(out,label+'-export.txt'),encoded);await Promise.all([page.waitForEvent('load'),page.locator('#saved_file_input').setInputFiles({name:'L1-QA.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await boot();const after=await save();assert.deepEqual(after.expansion,before.expansion);assert.deepEqual(after.inventories.person,before.inventories.person);result[label+'Persistence']=true;await fs.writeFile(path.join(out,label+'-saved.json'),JSON.stringify(after));await panel();}
try{
 context=await browser.newContext({viewport:{width:1920,height:1080}});await context.addInitScript(f=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('save data',JSON.stringify(f));sessionStorage.setItem('seeded','1');}},f);
 page=await context.newPage();page.setDefaultTimeout(15000);console.log('page created');page.on('pageerror',e=>errors.push(e.message));await page.goto(server.url+'?test_hooks=1',{waitUntil:'commit'});console.log('navigation committed');await boot();console.log('booted');await panel();console.log('panel');
 let raw; if(!process.env.L1_RESUME){
 await act('Borrow Ibery’s workshop packet · return this copy');await act('Read print, copy and margin · 2 min',2);raw=await save();assert.ok(record(raw,'print.r1'));assert.ok(record(raw,'copy.r1'));assert.ok(record(raw,'margin.r1'));const original=structuredClone(record(raw,'print.r1'));
 await page.locator('#feature_expansion_panel li').filter({hasText:'The printed circular calls both'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'accounts-1920.png')});
 await act('Inspect the packet’s reverse · 1 min',1);await act('Return Ibery’s workshop packet');assert.equal(count(await save(),'Cyorian borrowed workshop packet'),0);
 await move('Cyoria formula workshop');await act('Ask Nora about the conflicting editions · 1 min',1);assert.deepEqual(record(await save(),'print.r1'),original);
 const beforeTrial=await save();await act('Test formula ink on a dry strip · paper, 2 min');let pending=await save();assert.equal(count(pending,'Cyorian formula ink'),0);assert.equal(count(pending,'Cyorian research paper'),3);
 await roundtrip('pending-trial');await page.evaluate(()=>advanceTicks(2));raw=await save();assert.equal(count(raw,'Cyorian formula ink'),1);assert.ok(record(raw,'trial.ink'));
 await act('Test lamp oil on a dry strip · paper, 2 min',2);await act('Compare the two strip trials');raw=await save();assert.equal(count(raw,'Cyorian lamp oil'),1);assert.equal(count(raw,'Cyorian research paper'),2);assert.ok(record(raw,'interpretation.r1'));assert.equal(raw.expansion.simulation.powers.player['book.mol.formula_operator'],undefined);
 await page.locator('#feature_expansion_panel li').filter({hasText:'The actual formula-ink unit made'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'strip-results-1920.png')});
 // Existing assembly consumes the actual returned tested ink, then the existing
 // training/test/household consumer proves the output remains useful.
 raw=await act('Reconstruct the keyed lamp with Nora · cube + ink + 3 crowns',6);assert.equal(count(raw,'Cyorian formula ink'),0);assert.equal(count(raw,'Cyorian keyed formula lamp'),1);result.testedInkActuallyConsumed=true;
 await fs.writeFile(path.join(out,'after-assembly.json'),JSON.stringify(raw));
 } else {result.testedInkActuallyConsumed=true;result.resumedFrom='same-bundle after-assembly.json captured after actual native strip/assembly route';}
 console.log('ASSEMBLY PASS; continuing existing control/consumer');
 // Labels read from the frozen installed definitions, never guessed from old text.
 const pack=JSON.parse((await fs.readFile('/Users/weiwei/.codex/research/g7-lore-2026-10-26/L1-snapshot/src/world_packs/book_mol_pack.js','utf8')).split('export default ')[1].trim().replace(/;$/,''));
 const def=id=>pack.native.definitions.commands.find(c=>c.id===id);
 for(const id of ['book.mol.charge_3','book.mol.control_drill','book.mol.lamp_test','book.mol.use_lamp_house']){const c=def(id);await move(c.location);raw=await act(c.label,c.duration);}
 assert.ok(raw.expansion.simulation.knowledge.player['book.mol.houseLamp']);result.usefulHouseholdConsumer=true;
 await roundtrip('completed');
 await page.locator('#feature_expansion_panel li').filter({hasText:'Your retained keyed lamp supported'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'household-consumer-1920.png')});
 result.viewports=[];for(const [width,height,font] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){await page.setViewportSize({width,height});await page.evaluate(font=>document.documentElement.style.fontSize=font+'px',font);await page.screenshot({path:path.join(out,`desktop-${width}-${font}.png`)});result.viewports.push({width,height,font,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
 result.bundleHash=createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex');result.errors=errors;assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'browser-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}catch(e){await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});await fs.writeFile(path.join(out,'failure.txt'),String(e.stack)+'\n'+await page?.locator('body').innerText().catch(()=>''));throw e;}
finally{await context?.close();await browser.close();await server.close();}
