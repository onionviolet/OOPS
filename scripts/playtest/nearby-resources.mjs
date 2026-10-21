// Native nearby navigation/gathering proof; fixture enables the crafting station.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
import {resumeElectronGame} from './electron_ready.mjs';
const require=createRequire(import.meta.url),root=resolve('.'),out=resolve(process.argv[2]||'docs/reviews/corc_ui_2026-10-21/places');
await mkdir(out,{recursive:true});const profile=await mkdtemp(join(tmpdir(),'oops-nearby-resources-'));
const {_electron}=require('../ui_helpers.cjs').loadPlaywright();
const app=await _electron.launch({executablePath:require('electron'),args:[root],cwd:root,env:{...process.env,YAIRPG_USER_DATA:profile,YAIRPG_ROOT:root,YAIRPG_HIDDEN:'1'}});
const p=await app.firstWindow(),errors=[],checks=[];p.on('pageerror',e=>errors.push(e.message));
const seed=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete seed.availabilities.recipe.undefined;delete seed.availabilities.recipe['recipe/undefined'];seed.global_flags.is_crafting_unlocked=true;seed.customization=defaultCustomizationState();seed.customization.profiles.Default.settings.typography.size=21;
seed['current time'].hour=22;seed['current time'].minute=59;
await p.addInitScript(()=>{if(window.name.startsWith('RESIZE_FIXTURE:')){localStorage.setItem('save data',window.name.slice(15));window.name='';}});
try{
 await resumeElectronGame(p);await p.setViewportSize({width:1920,height:1080});await p.evaluate(s=>window.name='RESIZE_FIXTURE:'+JSON.stringify(s),seed);await p.reload();await resumeElectronGame(p);
 assert.match(await p.locator('.scene-calendar').getAttribute('title'),/30-day months/);assert.match(await p.locator('[data-condition="season"]').innerText(),/Summer/);
 await p.screenshot({path:join(out,'nearby-stations.png')});checks.push('Home date uses explicit local-calendar explanation; season follows its 30-day-month calendar');
 await p.locator('[data-inspect-nearby="herbal-experiments"]').click();await p.locator('.nearby-context-actions button').first().click();assert(await p.locator('#crafting_engine_home').isVisible());
 await p.locator('#crafting_gather').click();assert.match(await p.locator('#crafting_engine_home').innerText(),/Gathered materials stored in your inventory/);
 await p.screenshot({path:join(out,'herb-gathering.png')});await p.locator('#save_button').click();await p.reload();await resumeElectronGame(p);
 await p.locator('[data-inspect-nearby="herbal-experiments"]').click();await p.locator('.nearby-context-actions button').first().click();assert(await p.locator('[data-craft-material]').count()>0);checks.push('Nearby verge opens native herb gathering; exact material survives native save/reload');
 await p.locator('#center_mode_back').click();await p.locator('[data-inspect-nearby="gear-workshop"]').click();await p.locator('.nearby-context-actions button').first().click();assert(await p.locator('#gear_workshop').isVisible());await p.screenshot({path:join(out,'gear-workshop.png')});checks.push('Known nearby workshop opens the merged native gear owner');
 assert.deepEqual(errors,[]);await writeFile(join(out,'receipt.json'),JSON.stringify({profile,checks,errors,limits:'Native Village routes only. Cross-world header binding has pure regression coverage; a natural visitor transition is not asserted.'},null,2));console.log(JSON.stringify({checks:checks.length,errors,out}));
}catch(e){await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});await writeFile(join(out,'failure.json'),JSON.stringify({error:e.stack,errors},null,2));throw e;}finally{await app.close();}
