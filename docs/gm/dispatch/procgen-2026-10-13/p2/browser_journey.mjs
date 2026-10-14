// Rebuilt bytes only. Fresh isolated Chrome profile, public controls only.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const profile=process.env.P2_PROFILE||'/private/tmp/procgen-p2-profile-journey-v3';
const root=new URL('../../../../../',import.meta.url);
const evidence=[];const hash=b=>createHash('sha256').update(b).digest('hex');
const c=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});
try {
const p=c.pages()[0],errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:19320');
const served=await p.request.get('http://127.0.0.1:19320/dist/bundle.js');assert.equal(hash(await served.body()),hash(await readFile(new URL('dist/bundle.js',root))));
evidence.push({id:'N1',label:'natural',check:'rebuilt served bytes match',pass:true});
await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN P2 natural');await p.locator('#hero_creation_panel_confirmation').click();
await p.locator('#village_mixing_open').click();
const read=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
const save=async()=>{await p.locator('#save_button').click();return read();};
const buy=async(price,n=1)=>{for(let i=0;i<n;i++)await p.getByRole('button',{name:`Buy 1 (${price} coins)`,exact:true}).click();};
await buy(8,5);await buy(2,6);await buy(10,2);await buy(4);
let s=await save();assert.equal(s.character.money,26);assert.equal(s.mixtures.sequence,14);evidence.push({id:'N2',label:'natural',check:'paid supplies reduce purse exactly',pass:true});
const previewBefore=structuredClone(s.mixtures);for(let n of ['2','1','3','1'])await p.locator('#mixture_amount_River_bellleaf').fill(n);await p.locator('#mixture_process').selectOption('boil');await p.locator('#mixture_process').selectOption('steep');s=await save();assert.deepEqual(s.mixtures,previewBefore);assert.doesNotMatch(await p.locator('#mixture_prediction').innerText(),/health regeneration/);
await p.locator('#mixture_amount_River_bellleaf').fill('99');await p.locator('#mixture_craft').click();assert.match(await p.locator('#mixture_notice').innerText(),/Shortage/);s=await save();assert.deepEqual(s.mixtures,previewBefore);evidence.push({id:'N3',label:'natural',check:'preview and rejected craft retain owner/draws; unknown forecast',pass:true});
await p.locator('#mixture_amount_River_bellleaf').fill('1');await p.locator('#mixture_craft').click();await p.locator('#mixture_craft').click();s=await read();const steep=Object.values(s.mixtures.products)[0],steepKey=JSON.stringify({id:'Village mixture',mixture:steep.id});assert.equal(s.inventories.person.main_character[steepKey].count,2);
await p.locator('#mixture_amount_River_bellleaf').fill('0');await p.locator('#mixture_amount_Emberseed').fill('1');await p.locator('#mixture_process').selectOption('boil');await p.locator('#mixture_craft').click();s=await read();assert.equal(Object.keys(s.mixtures.products).length,2);evidence.push({id:'N4',label:'natural',check:'identical stack plus distinct ratio/process product',pass:true});
const selectLine=key=>p.locator('[data-mixture-product]').filter({has:p.locator('button')}).filter({hasText:key===steepKey?'Steeped':'Boiled'});
await selectLine(steepKey).getByRole('button',{name:'Experiment: drink one dose',exact:true}).click();s=await read();assert.equal(s.mixtures.knowledge[steep.id].source,'oral experiment');assert.ok(s.active_effects['Village mixture exposure'].effects.stats.health_regeneration_flat.flat>0);assert.match(await p.locator('#mixture_prediction').innerText(),/untested/); // other mixture remains unknown
await selectLine(steepKey).getByRole('button',{name:'Save observed method'}).click();
await selectLine(steepKey).getByRole('button',{name:'Queue learned method'}).click();let pending=await save();assert.ok(pending.mixtures.job);assert.equal(pending.mixtures.job.remaining,3);
// Native reload before clicking PLAY does not advance game time.
await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();assert.doesNotMatch(await p.locator('#loading_screen').innerText(),/Something went wrong|error has/i);await p.evaluate(()=>document.getElementById('save_button').click());let restored=await read();assert.deepEqual(restored.mixtures,pending.mixtures);assert.deepEqual(restored.active_effects['Village mixture exposure'],pending.active_effects['Village mixture exposure']);assert.deepEqual(restored.inventories.person.main_character,pending.inventories.person.main_character);
evidence.push({id:'N5',label:'natural',check:'consumed exposure + exact held inputs reload',pass:true});
const exportFile=async(name)=>{const download=p.waitForEvent('download');await p.evaluate(()=>document.getElementById('save_to_file_button').click());const d=await download;const file='/private/tmp/'+name;await d.saveAs(file);return {file,save:await read()};};
const importFile=async(file,expected)=>{await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();await p.waitForTimeout(300);const actual=await read();assert.deepEqual(actual.mixtures,expected.mixtures);assert.deepEqual(actual.active_effects['Village mixture exposure'],expected.active_effects['Village mixture exposure']);assert.deepEqual(actual.inventories.person.main_character,expected.inventories.person.main_character);return actual;};
const pendingExport=await exportFile('proc-p2-pending.txt');await importFile(pendingExport.file,pendingExport.save);evidence.push({id:'N6',label:'natural',check:'literal-file Export/Import pending reservation and consumed exposure',pass:true});
await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#village_mixing_open').click();await p.locator('#mixture_cancel').click();s=await read();assert.equal(s.mixtures.job,null);assert.equal(s.inventories.person.main_character['{"id":"River bellleaf"}'].count,3);evidence.push({id:'N7',label:'natural',check:'cancel returns exact held stock',pass:true});
// Consume remaining original vial, then verify exposure persists after all source vials disappear.
await selectLine(steepKey).getByRole('button',{name:'Drink one dose',exact:true}).click();s=await save();assert.equal(s.inventories.person.main_character[steepKey],undefined);
const consumedExport=await exportFile('proc-p2-consumed.txt');await importFile(consumedExport.file,consumedExport.save);evidence.push({id:'N8',label:'natural',check:'literal-file consumed-source exposure retained without vial',pass:true});
await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#village_mixing_open').click();await selectLine(steepKey).getByRole('button',{name:'Queue learned method'}).click();await p.waitForTimeout(11000);s=await save();assert.equal(s.mixtures.job,null);assert.equal(s.inventories.person.main_character[steepKey].count,3); // all three available leaf packs
// One more requested batch must stop on shortage, then deliberately queue an over-request with new paid stock.
await buy(8);await buy(2);await selectLine(steepKey).getByRole('button',{name:'Queue learned method'}).click();await p.waitForTimeout(5000);s=await save();assert.equal(s.mixtures.job,null);assert.match(await p.locator('#mixture_notice').innerText(),/Repeat stopped: Shortage/);assert.equal(s.inventories.person.main_character[steepKey].count,4);evidence.push({id:'N9',label:'natural',check:'idle timed repeat produces exact vials and stops on shortage',pass:true});
await p.screenshot({path:new URL('laptop.png',import.meta.url).pathname});
await p.setViewportSize({width:1600,height:1000});await p.screenshot({path:new URL('desktop.png',import.meta.url).pathname});
assert.equal(await p.locator('#mixture_craft').isVisible(),true);assert.equal(await selectLine(steepKey).getByRole('button',{name:'Queue learned method'}).isVisible(),true);
const finalExport=await exportFile('proc-p2-final.txt');await importFile(finalExport.file,finalExport.save);evidence.push({id:'N10',label:'natural',check:'final exact literal-file Import at wider desktop',pass:true});
assert.deepEqual(errors,[]);evidence.push({id:'N11',label:'natural',check:'no page errors; both target viewports',pass:true});
await writeFile(new URL('browser_evidence.json',import.meta.url),JSON.stringify({profile,checks:evidence},null,2)+'\n');console.log(JSON.stringify({checks:evidence,pass:evidence.length}));
}finally{await c.close();}
