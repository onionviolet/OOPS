import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {serve} from '../../../../../../../scripts/perf/lib.mjs';
const {launchChrome}=createRequire(import.meta.url)('../../../../../../../scripts/ui_helpers.cjs');
const dir=path.dirname(new URL(import.meta.url).pathname),out=path.join(dir,'evidence'),root='/Users/weiwei/.codex/research/g7-lore-2026-10-26/L2-build';
const pack=JSON.parse((await fs.readFile('/Users/weiwei/.codex/research/g7-lore-2026-10-26/L2-snapshot/src/world_packs/book_mol_pack.js','utf8')).split('export default ')[1].trim().replace(/;$/,''));
const def=id=>pack.native.definitions.commands.find(c=>c.id===id),P='book.mol.lore.',key=id=>JSON.stringify({id});
const fixtureText=await fs.readFile(path.join(out,process.env.L2_FIXTURE_NAME||'TEST-FIXTURE-G7-L2-pre-assembly-clock-correct.txt'),'utf8');
const base=JSON.parse(Buffer.from(fixtureText.trim().split(':')[1],'base64'));
const server=await serve(root),browser=await launchChrome();let context,page;const errors=[];
const result={route:'named supplied-stock G7-L2 pre-assembly fixture; assessment/study/document/ink trial earned by fixture-builder commands; actual native UI methods, guided assembly and household use thereafter',buildRoot:root};
const count=(s,id)=>s.inventories.person.main_character[key(id)]?.count||0;
const record=(s,id)=>s.expansion.simulation.knowledge.player[P+id];
const save=async()=>{await page.evaluate(()=>saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
async function boot(){await page.waitForFunction(()=>window.simulationTestHooks,null,{timeout:30000});await page.evaluate(()=>simulationTestHooks.pause());const play=page.locator('#loading_screen_play_button');if(await play.isVisible())await play.click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();await page.waitForFunction(()=>document.getElementById('main_content')?.dataset.mode!=='title');}
async function panel(){await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;for(const d of n.querySelectorAll('details'))d.open=true;});}
const button=id=>page.getByRole('button',{name:'Do this: '+def(id).label,exact:true});
async function act(id,finish=true){await panel();const b=button(id);assert.equal(await b.isEnabled(),true,id);await b.scrollIntoViewIfNeeded();await b.click();if(finish&&def(id).duration)await page.evaluate(n=>advanceTicks(n),def(id).duration);console.log('ACT',id);return save();}
async function move(where){const target='Cyoria '+where;if((await save())['current location']===target)return;await panel();await page.getByRole('button',{name:'Do this: Walk to '+target,exact:true}).click();}
async function importText(text){await Promise.all([page.waitForEvent('load',{timeout:30000}),page.locator('#saved_file_input').setInputFiles({name:'G7-L2-QA.txt',mimeType:'text/plain',buffer:Buffer.from(text)})]);await boot();}
async function roundtrip(label){const before=await save();await page.reload();await boot();assert.deepEqual((await save()).expansion,before.expansion);const text=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(out,label+'-export.txt'),text);await importText(text);const after=await save();assert.deepEqual(after.expansion,before.expansion);assert.deepEqual(after.inventories.person,before.inventories.person);result[label+'SaveReloadExportLiteralImport']=true;await panel();}
try{
 context=await browser.newContext({viewport:{width:1920,height:1080}});page=await context.newPage();page.setDefaultTimeout(25000);page.on('pageerror',e=>errors.push(e.message));await page.goto(server.url+'?test_hooks=1');await boot();await importText(fixtureText);result.initialNativeImport=true;await panel();
 assert.equal((await save()).expansion.simulation.claims['book.mol.receipt.assemble_lamp'],undefined);
 const unavailable=page.getByRole('button',{name:'Unavailable: '+def(P+'prepare_guide_jig').label,exact:true});assert.equal(await unavailable.isEnabled(),false);await unavailable.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'jig-unavailable-1920.png')});
 await act(P+'practice_hand_guide');await move('Imaya household');const before=await save();const ink=count(before,'Cyorian formula ink'),paper=count(before,'Cyorian research paper');
 await act(P+'prepare_guide_folded',false);const pending=await save();assert.equal(count(pending,'Cyorian formula ink'),ink-1);assert.equal(count(pending,'Cyorian research paper'),paper-1);assert.equal(count(pending,'Cyorian single-cube tracing guide'),0);
 await page.getByRole('button',{name:/Cancel Prepare a guide with the folded-paper method/}).click();assert.equal(count(await save(),'Cyorian formula ink'),ink);result.cancellation=true;
 await act(P+'prepare_guide_folded',false);await roundtrip('pending-guide');await page.evaluate(()=>advanceTicks(4));let current=await save();assert.equal(count(current,'Cyorian single-cube tracing guide'),1);assert.ok(record(current,'method.folded'));assert.equal(current.expansion.simulation.powers.player?.['book.mol.formula_operator'],undefined);
 const first=record(current,'method.folded');await act(P+'repeat_guide_folded');current=await save();assert.equal(count(current,'Cyorian single-cube tracing guide'),2);assert.deepEqual(record(current,'method.folded'),first);result.repeatConsumesFreshMaterialsWithoutNewMastery=true;
 // Current physical jig restoration is explicitly supplied in this second QA
 // state. L3 owns the earned trace/repair route, which is absent from L2's build.
 current.expansion.worlds['book.mol.cyoria'].facts[P+'jigRestored']=true;await fs.writeFile(path.join(out,'TEST-FIXTURE-G7-L2-restored-jig.txt'),'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(current)).toString('base64'));
 await importText('YAIR-UTF8-1:'+Buffer.from(JSON.stringify(current)).toString('base64'));await move('formula workshop');await act(P+'prepare_guide_jig');await act(P+'compare_methods');current=await save();assert.ok(record(current,'method.jig'));assert.match(record(current,'method.comparison').value,/not a claim.*one isolated cause/);result.jigRoute='explicit synthetic restored-jig fixture; actual restoration belongs to L3';
 await page.locator('#feature_expansion_panel li').filter({hasText:'Both actual guide preparations'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'method-comparison-1920.png')});
 const beforeAssembly=await save();await act(P+'assemble_guided_lamp');current=await save();assert.equal(count(current,'Cyorian keyed formula lamp'),1);assert.equal(count(current,'Cyorian formula ink'),count(beforeAssembly,'Cyorian formula ink'));assert.equal(count(current,'Cyorian single-cube tracing guide'),count(beforeAssembly,'Cyorian single-cube tracing guide')-1);assert.equal(current.expansion.simulation.powers.player['book.mol.formula_operator'].mastery,0);result.guideInkChargedOnce=true;
 await act('book.mol.charge_1');await move('supervised practice court');await act('book.mol.control_drill');await move('formula workshop');await act('book.mol.lamp_test');await move('Imaya household');await act('book.mol.close_service_arc');await act('book.mol.use_lamp_house');assert.ok((await save()).expansion.simulation.knowledge.player['book.mol.houseLamp']);result.usefulHouseholdConsumer=true;
 await roundtrip('completed');await page.locator('#feature_expansion_panel li').filter({hasText:'Your retained keyed lamp supported'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'household-consumer-1920.png')});
 result.viewports=[];
 for(const [width,height,font] of [[1920,1080,14],[1920,1080,21],[1536,864,14],[1536,864,21]]){
  await page.setViewportSize({width,height});await page.getByRole('combobox',{name:'Other known panels'}).selectOption('customization');await page.getByRole('button',{name:'Text size '+font,exact:true}).click();await page.waitForTimeout(300);await panel();await page.locator('#feature_expansion_panel li').filter({hasText:'Both actual guide preparations'}).first().scrollIntoViewIfNeeded();
  const observed=await page.locator('#feature_expansion_panel').evaluate(n=>({font:getComputedStyle(n).fontSize,custom:getComputedStyle(n).getPropertyValue('--custom-size'),overflow:document.documentElement.scrollWidth>innerWidth}));await page.screenshot({path:path.join(out,`desktop-${width}-${font}.png`)});result.viewports.push({width,height,requestedFont:font,...observed});assert.equal(observed.overflow,false);
 }
 result.bundleHash=createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex');result.fixtureHash=createHash('sha256').update(fixtureText).digest('hex');result.errors=errors;assert.deepEqual(errors,[]);await fs.writeFile(path.join(out,'browser-result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}catch(e){await page?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});await fs.writeFile(path.join(out,'failure.txt'),String(e.stack)+'\n'+await page?.locator('body').innerText().catch(()=>''));throw e;}
finally{await context?.close();await browser.close();await server.close();}
