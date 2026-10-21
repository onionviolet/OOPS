// Rebuilt, disposable browser proof. All seeded state is a test fixture, never a personal save.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {createHarvest,drawSpecimen,addCarcass} from '../../src/harvest.js';
import {calendarMinutes} from '../../src/world_rhythm.js';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';

const root=resolve(process.argv[2]||'/tmp/oops-palette-candidate-20261020');
const output=resolve(process.argv[3]||'/tmp/oops-palette-browser');await mkdir(output,{recursive:true});
const server=await serve(root),missing=[];
const session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:15000,
 hooks:{beforeOpen:async context=>{context.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);});await context.addInitScript(()=>{window.__paletteAudio={starts:0};const A=globalThis.AudioContext;if(!A)return;const create=A.prototype.createOscillator;A.prototype.createOscillator=function(...args){const voice=create.apply(this,args),start=voice.start;voice.start=function(...xs){window.__paletteAudio.starts++;return start.apply(this,xs);};return voice;};});}}});
const key=id=>JSON.stringify({id}),checks=[];let page,fixtureNormalization=[];
const snapshot=()=>page.evaluate(()=>simulationTestHooks.snapshot());
async function playReload(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await page.waitForTimeout(400);}
async function panel(id){const more=page.locator('#workspace_navigation select').first();await more.selectOption(id);await page.waitForTimeout(200);}
async function roundTrip(){
 const saved=await session.save();await page.reload();await playReload();assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(saved)),[]);
 const exported=await page.evaluate(()=>save_to_file());const before=await session.save();
 await Promise.all([page.waitForEvent('load'),page.evaluate(encoded=>load_progress(encoded),exported)]);await playReload();
 assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(before)),[]);
 checks.push('Pending/final processing current-format Save, reload, Export, literal Import preserve the exact state');
}
try{
 await session.start();
 const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));
 const clock=calendarMinutes(seed['current time']);
 for(const id of ['Oil lamp','Lamp oil'])seed.inventories.person.main_character[key(id)]={count:1};
 seed.harvest=createHarvest();
 addCarcass(seed.harvest,drawSpecimen({species:'Wolf rat',key:'palette:browser:carcass',clock},()=>.5),{clock,skill:0,tool:0});
 await session.open(seed);page=session.page;
 // The archived mid fixture predates lazy zero-XP initialization for two NPCs.
 // Normalize it before any changed command, then demand exact new-state round trips.
 const imported=await session.save();await page.reload();await playReload();
 fixtureNormalization=diffSaves(canonicalSave(await session.save()),canonicalSave(imported));
 assert.ok(fixtureNormalization.every(d=>/^\/levels\/person\//.test(d.path)&&d.path.includes('/skill_xp/')&&d.a==='0'&&d.b===undefined));
 await page.locator(`#inventory_content_div > [data-character_item='${key('Oil lamp')}']`).click();
 await page.locator('[data-shell-item-action="use"]').click();
 assert.equal((await snapshot()).lamplight.lit,true);
 await panel('tools');await page.waitForFunction(()=>document.querySelector('[data-meter="lamp-fuel"]'));
 assert.match(await page.locator('#tools_panel').innerText(),/240/);
 const fuel=(await snapshot()).lamplight.oil;await session.step(1);
 assert.equal((await snapshot()).lamplight.oil,fuel-1);
 assert.match(await page.locator('[data-meter="lamp-fuel"]').innerText(),/239/);
 checks.push('Native inventory lighting spends one flask; live Tools fuel and signed burn follow native elapsed time');

 await panel('carcass-processing');await page.waitForTimeout(300);
 // The native details remains the same control even when the workspace has scrolled it.
 await page.locator('#harvest_panel').evaluate(el=>{el.open=true;});
 await page.locator('#harvest_panel [data-harvest-choice="whole"]').click();
 const pending=await snapshot();assert.equal(pending.harvest.job.total,pending.harvest.job.remaining);
 await session.step(1);await page.waitForTimeout(600);
 assert.match(await page.locator('#harvest_panel .work-status-view').innerText(),/played minutes/);
 await roundTrip();
 await session.step((await snapshot()).harvest.job.remaining);await page.waitForTimeout(600);
 assert.equal((await snapshot()).harvest.processed,1);
 assert.match(await page.locator('#harvest_receipt').innerText(),/Completed/);
 await panel('around-place');
 assert.match(await page.locator('#palette_feedback_panel').innerText(),/Output: carried/);
 await roundTrip();checks.push('Native carcass selection, work progress, finish, processed count and carried-output summary agree');

 await page.keyboard.press('Alt+h');
 const beforeSettings=canonicalSave(await session.save());
 await page.locator('#display-setting-lootReports').evaluate(el=>{el.value='off';el.dispatchEvent(new Event('change',{bubbles:true}));});
 assert.equal(await page.locator('html').getAttribute('data-display-loot'),'off');
 const lootCount=await page.locator('#message_box_div .message_loot').count();
 assert.equal(await page.locator('#message_box_div .message_loot:visible').count(),0);
 await page.locator('#display-setting-lootReports').evaluate(el=>{el.value='all';el.dispatchEvent(new Event('change',{bubbles:true}));});
 assert.equal(await page.locator('#message_box_div .message_loot').count(),lootCount);
 assert.equal(canonicalSave(await session.save()),beforeSettings);
 checks.push('Loot presentation filter changes visibility without changing retained row count or the game save');

 const soundSeed=await session.save();soundSeed.customization.profiles.Default.settings.sound=true;soundSeed.customization.profiles.Default.settings.effects='full';
 soundSeed.lamplight={schema:1,lit:false,oil:10,noticed:{}};
 await session.open(soundSeed);page=session.page;
 assert.equal(await page.locator('#quiet_place_detail').evaluate(el=>el.checkVisibility()),true,'local scene host is visible in the actual shell');
 await page.locator(`#inventory_content_div > [data-character_item='${key('Oil lamp')}']`).click();await page.locator('[data-shell-item-action="use"]').click();await session.step(1);await page.waitForTimeout(350);
 assert.match(await page.locator('.palette-local-cue').innerText(),/lamp/i);
 assert.ok(await page.evaluate(()=>window.__paletteAudio.starts>0),'optional sound reaches the native WebAudio start path after a user gesture');
 checks.push('Real lamp ignition reaches the visible place host and optional WebAudio sound after a user gesture');

 const home=await session.save();home['current location']='Shack';home.availabilities.location.Shack=1;home.locations.Shack={...home.locations.Shack,housing_unlocked:true};home.character.money=5000;
 home.inventories.person.main_character[key('Rough wood log')]={count:5};
 await session.open(home);page=session.page;await session.step(1);await page.waitForTimeout(350);await page.locator('[data-place-tab="options"]').click();
 await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});
 await page.locator('[data-household-action="meet"]').click();
 await page.locator('[data-household-action="install_hearth"]').click();
 await page.locator('[data-household-action="light"]').click();
 assert.match(await page.locator('.household-scene').innerText(),/20 played minutes of fuel/);await session.step(1);await page.waitForTimeout(400);
 assert.match(await page.locator('.household-scene').innerText(),/19 played minutes of fuel/);
 assert.match(await page.locator('.household-scene').innerText(),/Moss/);
 await page.screenshot({path:join(output,'palette-home-native.png')});
 checks.push('Native owned-home meet/install/light commands drive the bounded cat/hearth scene and real fuel countdown');

 const large=await session.save();large.customization.profiles.Default.settings.typography={font:'gothic',size:21};
 await session.open(large);page=session.page;await page.locator('[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});

 for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:join(output,`palette-${width}x${height}.png`)});
 }
 await page.locator('#display-setting-contrast').evaluate(el=>{el.value='high';el.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.emulateMedia({reducedMotion:'reduce'});await page.screenshot({path:join(output,'palette-high-contrast-reduced.png')});
 assert.equal(await page.locator('html').getAttribute('data-display-contrast'),'high');
 checks.push('Actual Gothic 21px at 1920×1080, 1800×1040 and 1536×864 has no document overflow; high contrast and reduced motion retain native text');
 const unexpected=missing.filter(p=>p!=='/private_packs/manifest.json');assert.deepEqual(unexpected,[]);
 const resource404='Failed to load resource: the server responded with a status of 404 (Not Found)';
 const expectedManifestErrors=session.errors.filter(e=>e.kind==='console'&&e.text===resource404);
 assert.ok(expectedManifestErrors.length<=missing.length,'each tolerated console 404 has an observed optional manifest request');
 assert.deepEqual(session.errors.filter(e=>!expectedManifestErrors.includes(e)),[]);
 await writeFile(join(output,'receipt.json'),JSON.stringify({checks,fixtureNormalization,setup:'Seeded disposable mid fixture normalized before changed commands, and one carcass; actual native UI actions and clock. No natural campaign acquisition or human acceptance claimed.',missing,errors:session.errors},null,2));
 console.log(JSON.stringify({checks:checks.length,output}));
}catch(error){await writeFile(join(output,'failure.txt'),String(error.stack||error));await writeFile(join(output,'failure.json'),JSON.stringify({missing,errors:session.errors,checks},null,2));if(page)await page.screenshot({path:join(output,'failure.png')}).catch(()=>{});throw error;}
finally{await session.close();await server.close();}
