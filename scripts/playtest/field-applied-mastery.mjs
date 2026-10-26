// Named synthetic supplied-workshop fixture. No player save or installed profile.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {serve} from '../perf/lib.mjs';
import {joinField,fieldCommand,fieldAdvance,completeFieldProject,wood,kit} from '../field_fixtures.mjs';
import {encodeSaveFile} from '../../src/save_files.js';
const {launchChrome}=createRequire(import.meta.url)('../ui_helpers.cjs');
const root=path.resolve(process.argv[2]),evidence=path.resolve(process.argv[3]);
await fs.mkdir(evidence,{recursive:true});
const server=await serve(root),browser=await launchChrome();
const method='field.load_step',focus='field.focus',drive='field.drive',applied='field.pack_applied_focus';
const errors=[],receipt={route:'DEV SEEDED supplied workshop; method taught and project completed through pure native planners; browser executes packing',matrix:[]};
let context,page;
const boot=async()=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible'});await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();const confirm=page.locator('#hero_creation_panel_confirmation');if(await confirm.isVisible())await confirm.click();await page.waitForTimeout(200);};
const open=async fixture=>{await context?.close();context=await browser.newContext({viewport:{width:1920,height:1080}});if(fixture)await context.addInitScript(data=>{if(!sessionStorage.getItem('fixtureSeeded')){localStorage.setItem('save data',JSON.stringify(data));sessionStorage.setItem('fixtureSeeded','1');}},fixture);page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));await page.goto(server.url+'?test_hooks=1');await boot();};
const save=async()=>{await page.evaluate(()=>saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
const panel=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('notebook');await page.locator('[data-notebook-view="here"]').click();const p=page.locator('#field_panel');await p.waitFor({state:'visible'});if(!await p.evaluate(n=>n.open))await p.locator(':scope > summary').click();};
const button=id=>page.locator(`#field_panel [data-field-command="${id}"]`);
const reveal=async id=>{await panel();const b=button(id);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await b.scrollIntoViewIfNeeded();return b;};
const click=async id=>{await (await reveal(id)).click();await page.waitForTimeout(250);};
const tick=n=>page.evaluate(n=>advanceTicks(n),n);
const mastery=s=>s.expansion.simulation.powers.player[method].mastery;
const count=(s,key)=>s.inventories.person.main_character[key]?.count||0;
async function roundTrip(label){
 const prior=await save();await page.reload();await boot();assert.deepEqual((await save()).expansion,prior.expansion);
 const literal=await page.evaluate(()=>save_to_file());await fs.writeFile(path.join(evidence,label+'-export.txt'),literal);
 await Promise.all([page.waitForEvent('load'),page.locator('#saved_file_input').setInputFiles({name:'l2-generated.txt',mimeType:'text/plain',buffer:Buffer.from(literal)})]);await boot();
 const imported=await save();assert.deepEqual(imported.expansion,prior.expansion);assert.equal(imported.character.money,prior.character.money);assert.deepEqual(imported.inventories.person.main_character,prior.inventories.person.main_character);receipt[label+'RoundTrip']=true;
}
try{
 await open();const base=await save();
 let p=joinField();for(const name of ['focus','drive'])p=fieldAdvance(fieldCommand(p,`field.learn_${name}`),name==='focus'?2:3);
 for(const name of ['focus','drive'])p=fieldAdvance(fieldCommand(p,`field.recover_${name}`,'Shack'),name==='focus'?2:4);
 p=fieldAdvance(fieldCommand(p,'field.teach_step','Village',{targetId:'oldCraftsman'}),2);p=completeFieldProject(p);
 const fixture=structuredClone(base);fixture.expansion=p.state;fixture.character.money=p.external.money;fixture['current location']='Shack';fixture.availabilities.location.Shack|=1;
 for(const [actor,owner]of Object.entries(p.gameplay)){const native=actor==='player'?'main_character':actor;fixture.inventories.person[native]||={};for(const [key,n]of Object.entries(owner.inventory))fixture.inventories.person[native][key]={count:n};}
 await fs.writeFile(path.join(evidence,'supplied-workshop-fixture.json'),JSON.stringify(fixture));await open(fixture);
 const initial=await save();assert.equal(mastery(initial),1);await reveal('field.pack_drive');assert.equal(await button('field.pack_drive').isDisabled(),true);
 assert.match(await button('field.pack_drive').locator('..').innerText(),/capacity/i);await page.screenshot({path:path.join(evidence,'drive-blocked.png')});
 for(const [width,height]of [[1920,1080],[1536,864]])for(const size of [14,21]){
  await page.setViewportSize({width,height});const styled=await save();styled.customization.profiles.Default.settings.typography.size=size;
  await Promise.all([page.waitForEvent('load'),page.evaluate(s=>load_progress(s),encodeSaveFile(JSON.stringify(styled)))]);await boot();await reveal(applied);
  const box=await button(applied).boundingBox(),font=await button(applied).evaluate(n=>getComputedStyle(n).fontSize);assert.equal(font,size+'px');assert.ok(box.x>=0&&box.x+box.width<=width+1&&box.y>=0&&box.y+box.height<=height+1);assert.equal(await button(applied).isEnabled(),true);
  await page.screenshot({path:path.join(evidence,`applied-${width}-${size}.png`)});receipt.matrix.push({width,height,size,font,box});
 }
 await click(applied);const reserved=await save();assert.equal(mastery(reserved),1);assert.equal(reserved.character.money,initial.character.money-1);assert.equal(count(reserved,wood),count(initial,wood)-1);assert.equal(reserved.expansion.simulation.energies.player[focus].reserve,2);
 await click('cancel');const cancelled=await save();assert.equal(mastery(cancelled),1);assert.equal(cancelled.character.money,initial.character.money);assert.equal(count(cancelled,wood),count(initial,wood));assert.equal(count(cancelled,kit),count(initial,kit));assert.deepEqual(cancelled.expansion.simulation.energies.player[focus],initial.expansion.simulation.energies.player[focus]);receipt.cancellationConserves=true;
 await click(applied);await roundTrip('pending');await tick(1);assert.equal(mastery(await save()),1);await tick(1);const learned=await save();assert.equal(mastery(learned),2);assert.equal(count(learned,kit),count(initial,kit)+1);assert.equal(learned.expansion.actors.player.completed[applied],1);
 await reveal('field.pack_drive');assert.equal(await button('field.pack_drive').isEnabled(),true);await page.screenshot({path:path.join(evidence,'drive-earned.png')});await click('field.pack_drive');await tick(1);const driven=await save();assert.equal(count(driven,kit),count(initial,kit)+2);assert.equal(mastery(driven),2);assert.equal(driven.expansion.simulation.energies.player[drive].reserve,3);receipt.existingFasterConsumer=true;
 await roundTrip('completed');const final=await save();assert.equal(final.expansion.actors.player.completed[applied],1);assert.equal(await button(applied).isVisible(),false);await fs.writeFile(path.join(evidence,'final-generated.json'),JSON.stringify(final));
 receipt.bundleHash=createHash('sha256').update(await fs.readFile(path.join(root,'dist/bundle.js'))).digest('hex');receipt.errors=errors;assert.deepEqual(errors,[]);await fs.writeFile(path.join(evidence,'browser-result.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}catch(error){await page?.screenshot({path:path.join(evidence,'failure.png')}).catch(()=>{});await fs.writeFile(path.join(evidence,'failure.txt'),String(error.stack)+'\n'+await page?.locator('body').innerText().catch(()=>''));throw error;}
finally{await context?.close();await browser.close();await server.close();}
