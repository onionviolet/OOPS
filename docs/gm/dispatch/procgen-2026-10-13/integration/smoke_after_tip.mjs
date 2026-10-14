// Short smoke after merging the latest foundations tip: fresh hero, one mixing use, Save/reload.
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const ORIGIN=`http://127.0.0.1:${process.env.PORT||19660}`,folder=new URL('./',import.meta.url).pathname,root=new URL('../../../../../',import.meta.url).pathname;
const hash=b=>createHash('sha256').update(b).digest('hex'),local=hash(await readFile(root+'dist/bundle.js'));
const profile=`/private/tmp/procgen-wave1-integration-profile-smoke-${Date.now()}`,errors=[],checks=[];
const ctx=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768}});
try{const page=ctx.pages()[0];page.on('pageerror',e=>errors.push(e.message));await page.goto(ORIGIN);
 assert.equal(hash(await (await page.request.get(ORIGIN+'/dist/bundle.js')).body()),local);checks.push('served bundle equals rebuilt worktree bundle');
 await page.locator('#loading_screen_play_button:not(.none_display)').click();await page.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN WAVE1 tip smoke');await page.locator('#hero_creation_panel_confirmation').click();
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));const save=async()=>{await page.locator('#save_button').click();return read();};
 await page.locator('#village_mixing_open').click();await page.getByRole('button',{name:'Buy 1 (8 coins)',exact:true}).click();await page.getByRole('button',{name:'Buy 1 (2 coins)',exact:true}).click();
 await page.locator('#mixture_craft').click();let s=await save();const p=Object.values(s.mixtures.products)[0];const key=JSON.stringify({id:'Village mixture',mixture:p.id});assert.equal(s.inventories.person.main_character[key].count,1);
 await page.getByRole('button',{name:'Experiment: drink one dose',exact:true}).click();s=await save();assert.equal(s.inventories.person.main_character[key],undefined);assert.equal(s.mixtures.knowledge[p.id].source,'oral experiment');assert.ok(s.active_effects['Village mixture exposure']);
 checks.push('fresh hero bought ingredients, mixed one vial and drank it (real exposure, observed knowledge)');
 await page.reload();await page.locator('#loading_screen_play_button:not(.none_display)').waitFor();await page.evaluate(()=>document.getElementById('save_button').click());const r=await read();
 for(const k of ['mixtures','generated_people'])assert.deepEqual(r[k]??null,s[k]??null);assert.deepEqual(r.expansion.streams,s.expansion.streams);assert.deepEqual(r.active_effects['Village mixture exposure'],s.active_effects['Village mixture exposure']);assert.deepEqual(r.inventories.person.main_character,s.inventories.person.main_character);
 checks.push('Save/reload retains mixtures, exposure, streams and inventory exactly');
 await page.locator('#loading_screen_play_button:not(.none_display)').click();await page.waitForTimeout(500);await page.screenshot({path:folder+'smoke-tip-1366.png'});
 assert.deepEqual(errors,[]);await writeFile(folder+'smoke_evidence.json',JSON.stringify({label:'natural',origin:ORIGIN,profile,viewport:'1366x768',bundleSha256:local,checks,errors},null,2)+'\n');console.log('SMOKE PASS',checks);
}finally{await ctx.close();}
